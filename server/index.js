import express from 'express';
import { timingSafeEqual } from 'node:crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/api.js';
import sihCoreRouter from './routes/sihCoreRouter.js';
import { db } from './db/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;
const IS_PROD = process.env.NODE_ENV === 'production';
const PUBLIC_ORIGIN = process.env.PUBLIC_ORIGIN;

// Trust forwarded headers only when an explicit production origin is configured.
app.set('trust proxy', IS_PROD && PUBLIC_ORIGIN ? 1 : false);

// Middleware
app.use(express.json({ limit: '256kb' }));

// --- Security headers (no external dependency needed) -----------------------
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self'",
      "style-src-attr 'none'",
      "font-src 'self' data:",
      "img-src 'self' data:",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-src 'none'",
      "frame-ancestors 'none'"
    ].join('; ')
  );
  next();
});

// --- Production serving requires a configured HTTPS origin; localhost stays HTTP. ---
app.use((req, res, next) => {
  if (!IS_PROD) return next();
  let publicOrigin;
  try {
    publicOrigin = new URL(PUBLIC_ORIGIN || '');
  } catch {
    return res.status(503).send('HTTPS deployment is not configured for this prototype.');
  }
  if (publicOrigin.protocol !== 'https:') {
    return res.status(503).send('The configured public origin must use HTTPS.');
  }
  if (!req.secure) {
    return res.redirect(308, publicOrigin.origin + req.originalUrl);
  }
  res.setHeader('Strict-Transport-Security', 'max-age=31536000');
  next();
});

// --- Simple in-memory rate limiter for write endpoints (spam protection) ----
const rateBuckets = new Map();
function rateLimit({ windowMs = 60000, max = 20, key = 'global' } = {}) {
  return (req, res, next) => {
    const id = `${key}:${req.ip || 'unknown'}`;
    const now = Date.now();
    const bucket = rateBuckets.get(id) || { count: 0, resetAt: now + windowMs };
    if (now > bucket.resetAt) {
      bucket.count = 0;
      bucket.resetAt = now + windowMs;
    }
    bucket.count += 1;
    rateBuckets.set(id, bucket);
    if (bucket.count > max) {
      return res.status(429).json({
        status: 'ERROR',
        message: 'Too many requests. Please wait a minute and try again.'
      });
    }
    next();
  };
}
const apiWriteLimiter = rateLimit({ windowMs: 60000, max: 30, key: 'write' });
app.use('/api', (req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  return apiWriteLimiter(req, res, next);
});

function requireAdminToken(req, res, next) {
  const expected = process.env.ADMIN_API_TOKEN || '';
  if (!expected) {
    return res.status(503).json({
      status: 'DISABLED',
      message: 'Administrative routes are disabled until a server-side ADMIN_API_TOKEN is configured.'
    });
  }
  const authorization = req.get('authorization') || '';
  const supplied = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(supplied);
  if (
    suppliedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(suppliedBuffer, expectedBuffer)
  ) {
    return res.status(401).json({ status: 'UNAUTHORIZED', message: 'Administrative authorization required.' });
  }
  next();
}

app.use('/api/v2/admin', requireAdminToken);

// Passport persistence is intentionally disabled in the localhost prototype.
// These legacy endpoints accept personal financial/profile information.
app.use(['/api/passports', '/api/v2/passports'], (req, res) => {
  res.status(503).json({
    status: 'DISABLED',
    message: 'Passport storage is disabled in this prototype; no applicant profiles are saved.'
  });
});

// Mount API routes
app.use('/api', apiRouter);
app.use('/api/v2', sihCoreRouter);

// API 404 handler (ensures unmatched /api routes return JSON, not index.html)
app.use('/api', (req, res) => {
  res.status(404).json({ status: 'NOT_FOUND', message: `API endpoint ${req.originalUrl} not found` });
});

// --- Production: Serve Vite-built frontend static files ---
// (robots.txt, sitemap.xml, favicon, og-image come from public/ via dist/)
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// SPA fallback: any remaining non-API route gets the app shell with a 404
// status — the React router (App.jsx) renders the friendly "page not found"
// screen inside it, matching gov-portal behavior.
app.get('{*path}', (req, res) => {
  res.status(404).sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) res.status(404).send('Page not found. <a href="/">Go to the home page</a>.');
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[SAARTHI Server Error]', err);
  res.status(500).json({
    status: 'SERVER_ERROR',
    message: err.message || 'Internal Server Error'
  });
});

process.on('uncaughtException', (err) => {
  console.error('[SAARTHI Uncaught Exception]', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('[SAARTHI Unhandled Rejection]', reason);
});

// --- Optional periodic re-verification of official policy sources ----------
// Off by default so the SIH demo never stalls on network hiccups. Enable with
// INGEST_ENABLED=true; tune with INGEST_INTERVAL_HOURS (default 24) and
// INGEST_OFFLINE=true to keep scheduled runs on bundled fixtures.
const INGEST_ENABLED = String(process.env.INGEST_ENABLED || '').toLowerCase() === 'true';
if (INGEST_ENABLED) {
  const { runIngestOnce } = await import('./ingest/runIngest.js');
  const intervalHours = Number(process.env.INGEST_INTERVAL_HOURS) || 24;
  const offline = String(process.env.INGEST_OFFLINE || '').toLowerCase() === 'true';
  console.log(`[Ingest] scheduled re-verification every ${intervalHours}h${offline ? ' (offline fixtures)' : ''}`);
  setInterval(() => {
    runIngestOnce({ offline, log: console })
      .then(s => console.log(`[Ingest] pass done: ${s.sources} source(s), ${s.reviewsCreated} review(s) queued, ${s.errors} error(s)`))
      .catch(err => console.error('[Ingest] scheduled run failed:', err.message));
  }, intervalHours * 3600 * 1000);
}

const HOST = IS_PROD ? (process.env.HOST || '0.0.0.0') : '127.0.0.1';
app.listen(PORT, HOST, () => {
  console.log('===================================================');
  console.log('UdyamSetu — SIH 2026 student prototype');
  console.log('Server listening on ' + HOST + ':' + PORT);
  console.log('Frontend served from ' + distPath);
  console.log('API health: /api/health');
  console.log('===================================================');
});
