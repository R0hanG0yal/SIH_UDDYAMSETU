/**
 * =============================================================================
 * SAARTHI — STAGED PARTNER GEOCODER (OpenStreetMap Nominatim)
 *
 * Usage (single-writer rule: stop the API server first, or trigger the same
 * logic in-process via POST /api/v2/admin/ingest/geocode):
 *   node server/ingest/geocodePartners.js             # live Nominatim (1 req/s)
 *   node server/ingest/geocodePartners.js --offline   # deterministic jitter around Lucknow (demo-safe)
 *   node server/ingest/geocodePartners.js --pending-only
 *
 * Pipeline:
 *   1. Read scraped_partners rows staged by `npm run ingest` (sca-directory parser).
 *   2. Geocode "AgencyName, <Section type>, <State>, India" against Nominatim,
 *      honoring the usage policy: max 1 request/second, descriptive User-Agent.
 *   3. Write lat/lon + confidence back to staging. Low-confidence hits are
 *      flagged LOW_CONFIDENCE; misses go to MANUAL_REVIEW. Nothing here touches
 *      the live channel_partners map — promotion is a separate HITL action from
 *      the Admin dashboard (POST /api/v2/admin/scraped-partners/:id/promote).
 * =============================================================================
 */

import {
  listScrapedPartners,
  updateScrapedPartnerGeocode,
  setScrapedPartnerStatus
} from '../db/v2db.js';
import { pathToFileURL } from 'url';

const BASE_URL = process.env.NOMINATIM_URL || 'https://nominatim.openstreetmap.org/search';
const USER_AGENT = 'SAARTHI-SIH26092/1.0 (partner-locator geocoder; educational hackathon project)';
const REQUEST_SPACING_MS = 1100;   // Nominatim usage policy: absolute max 1 request/second
const MIN_QUERY_CONFIDENCE = 0.3;  // below this -> LOW_CONFIDENCE (needs human eyes)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const SECTION_TYPE = {
  SCA: 'State Channelizing Agency',
  RRB: 'Regional Rural Bank',
  PSB: 'Public Sector Bank'
};

function buildQuery(row) {
  const parts = [`${row.agencyName}, ${SECTION_TYPE[row.section] || 'Channelizing Agency'}`];
  if (row.address) parts.push(row.address);
  if (row.state) parts.push(row.state);
  parts.push('India');
  return parts.join(', ');
}

/** Coarse confidence from the Nominatim result type (no paid API available). */
function confidenceFromType(type) {
  const t = String(type || '');
  if (t === 'amenity' || t === 'office' || t === 'building') return 0.95;
  if (t === 'postcode') return 0.35; // postcode centroid — district-level accuracy
  if (t === 'administrative' || t === 'city' || t === 'town' || t === 'village') return 0.3;
  return 0.5;
}

async function geocodeRow(row) {
  const q = buildQuery(row);
  const url = `${BASE_URL}?q=${encodeURIComponent(q)}&format=jsonv2&addressdetails=0&limit=1&countrycodes=in`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const resp = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': USER_AGENT, 'Accept-Language': 'en' }
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const results = await resp.json();
    if (!Array.isArray(results) || results.length === 0) return null;
    const r = results[0];
    return {
      latitude: Number(r.lat),
      longitude: Number(r.lon),
      displayName: r.display_name,
      confidence: confidenceFromType(r.type || r.addresstype)
    };
  } finally {
    clearTimeout(timer);
  }
}

/** Deterministic pseudo-coordinates for offline demos (no network needed). */
function offlineGuess(row) {
  let h = 2166136261;
  const s = `${row.agencyName}|${row.state}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const rand = ((h >>> 0) % 1000) / 1000; // 0..1
  return {
    latitude: +(26.78 + rand * 0.22).toFixed(6),
    longitude: +(80.85 + rand * 0.25).toFixed(6),
    displayName: `${row.agencyName}, ${row.state || 'India'} (OFFLINE_JITTER around Lucknow)`,
    confidence: 0.2
  };
}

/**
 * One geocoding pass over staged rows. Exported so the API server can run it
 * in-process (single DB writer); the CLI block below wraps it for npm scripts.
 */
export async function geocodeStagedPartners({ offline = false, pendingOnly = false, log = console } = {}) {
  const rows = listScrapedPartners({ geocodeStatus: pendingOnly ? 'PENDING_GEOCODE' : undefined })
    .filter((r) => r.geocodeStatus !== 'PROMOTED');

  log.log(
    `SAARTHI partner geocoder — ${rows.length} staged row(s) ` +
    (offline ? '[OFFLINE jitter]' : '[Nominatim live, 1 req/s]')
  );

  const summary = { total: rows.length, geocoded: 0, needAttention: 0 };

  for (const row of rows) {
    try {
      const hit = offline ? offlineGuess(row) : await geocodeRow(row);
      if (!hit) {
        log.log(`  ✗ #${row.id} ${row.agencyName} — no match; flagged MANUAL_REVIEW`);
        setScrapedPartnerStatus(row.id, 'MANUAL_REVIEW');
        summary.needAttention += 1;
      } else if (!offline && hit.confidence < MIN_QUERY_CONFIDENCE) {
        log.log(`  ~ #${row.id} ${row.agencyName} — low confidence (${hit.confidence}): ${hit.displayName}`);
        updateScrapedPartnerGeocode(row.id, { ...hit, status: 'LOW_CONFIDENCE' });
        summary.needAttention += 1;
      } else {
        updateScrapedPartnerGeocode(row.id, { ...hit, status: offline ? 'GEOCODED_OFFLINE' : 'GEOCODED' });
        log.log(`  ✓ #${row.id} ${row.agencyName} → (${hit.latitude}, ${hit.longitude}) conf=${hit.confidence}`);
        summary.geocoded += 1;
      }
    } catch (err) {
      log.warn(`  ! #${row.id} ${row.agencyName} — ${err.message}`);
      summary.needAttention += 1;
    }
    if (!offline) await sleep(REQUEST_SPACING_MS); // Nominatim politeness
  }

  return summary;
}

// --- CLI entry (skipped when imported by the server) -------------------------
// pathToFileURL handles Windows drive letters (file:///Z:/...)
const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  const args = process.argv.slice(2);
  geocodeStagedPartners({
    offline: args.includes('--offline'),
    pendingOnly: args.includes('--pending-only')
  })
    .then((s) => {
      console.log(`\nDone: ${s.geocoded} geocoded, ${s.needAttention} need attention.`);
      console.log('Promote reviewed rows into the live map via Admin dashboard → Directory Ingest.');
      // database.js keeps a 30s flush interval — exit explicitly
      process.exit(0);
    })
    .catch((err) => {
      console.error('Geocoder crashed:', err);
      process.exit(1);
    });
}
