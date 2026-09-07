import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Mount API routes
app.use('/api', apiRouter);

// --- Production: Serve Vite-built frontend static files ---
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// SPA fallback: any non-API route serves index.html (Express 5 syntax)
app.get('{*path}', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[SAARTHI Server Error]', err);
  res.status(500).json({
    status: 'SERVER_ERROR',
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🛡️  SAARTHI National Government Credit Gateway`);
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌐 Frontend served from ${distPath}`);
  console.log(`📜 API health: /api/health`);
  console.log(`===================================================`);
});
