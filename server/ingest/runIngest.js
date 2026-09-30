/**
 * =============================================================================
 * SAARTHI — INGESTION RUNNER (Hybrid Ingestion + HITL queueing)
 *
 * Usage:
 *   node server/ingest/runIngest.js            # live fetch, fixture fallback
 *   node server/ingest/runIngest.js --offline  # fixtures only (demo-safe)
 *   node server/ingest/runIngest.js --source=nsfdc-annexure-pdf
 *
 * Pipeline per source:
 *   1. FETCH   — live URL (polite UA, 30s timeout) with automatic fallback to
 *                the bundled fixture in server/ingest/fixtures/ so the demo
 *                NEVER breaks when a gov site is down.
 *   2. HASH    — sha256 of normalized extracted text. Unchanged hash -> stop.
 *   3. EXTRACT — source-typed parser -> { value, quote, confidence } fields.
 *   4. GATE    — fields below MIN_CONFIDENCE or without verbatim quotes are
 *                dropped (zero-hallucination).
 *   5. QUEUE   — diffs vs live policy become PENDING rows in policy_reviews,
 *                each with old_data, new_data, confidence and quotes.
 *   6. AUDIT   — one ingest_runs row per source.
 *
 * Nothing here publishes data: publication happens only when a nodal officer
 * clicks Approve in the HITL dashboard (POST .../adjudicate).
 * =============================================================================
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath, pathToFileURL } from 'url';

import {
  getSources,
  getActiveSchemes,
  queueReview,
  recordIngestRun,
  updateSourceState,
  clearScrapedPartners,
  insertScrapedPartner,
  getScrapedPartnerCount,
  getSourceHash,
  getPendingReviewCount,
  getIngestRuns
} from '../db/v2db.js';
import {
  parseNsfdcAnnexure,
  parseMosjeLabeled,
  parseMosjeIncomeCeiling,
  parseScaDirectory,
  normalize,
  MIN_CONFIDENCE
} from './extractors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FIXTURES = path.join(__dirname, 'fixtures');

const args = process.argv.slice(2);
const OFFLINE = args.includes('--offline');
const sourceFilter = (args.find(a => a.startsWith('--source=')) || '').split('=')[1];

// Map of schema columns for each HITL field key (mirrors approveReview)
const FIELD_TO_COLUMN = {
  maxCost: 'max_cost',
  maxLoanAmount: 'max_absolute_loan',
  interestRate: 'base_interest_rate',
  moratoriumMonths: 'max_moratorium_months',
  tenureYears: 'max_tenure_years',
  incomeCeiling: 'income_ceiling'
};

const FIELD_LABELS = {
  maxCost: 'Max Project Cost',
  maxLoanAmount: 'Max Loan Amount',
  interestRate: 'Beneficiary Interest Rate',
  moratoriumMonths: 'Moratorium (Months)',
  tenureYears: 'Max Tenure (Years)',
  incomeCeiling: 'Annual Income Ceiling'
};

// Which parsers may emit which fields (prevents cross-source contamination)
const PARSER_FIELD_ALLOWLIST = {
  'nsfdc-annexure': ['maxCost', 'maxLoanAmount', 'interestRate', 'channelRate', 'moratoriumMonths', 'tenureYears', 'femaleRebate'],
  'mosje-labeled': ['maxCost', 'maxLoanAmount', 'interestRate', 'channelRate', 'moratoriumMonths', 'tenureYears'],
  'mosje-income-ceiling': ['incomeCeiling'],
  'sca-directory': []
};

// Which schemes each parser can touch (PDF table rows map by anchor)
const PDF_SCHEME_TARGETS = new Set([
  'NSFDC_MAHILA_SAMRUDDHI', 'NSFDC_MICRO_FINANCE', 'NSFDC_SUVIDHA',
  'NSFDC_UTKARSH', 'NSFDC_AAJEEVIKA', 'NSFDC_EDUCATION_LOAN'
]);

const fixtureFor = (source) => {
  const map = {
    'nsfdc-annexure-pdf': 'nsfdc-schemes.pdf',
    'dosje-term-loan-page': 'term-loan.html',
    'socialjustice-nsfdc-overview': 'nsfdc-overview.html',
    'dosje-sca-directory': 'sca-directory.html'
  };
  return map[source.id] ? path.join(FIXTURES, map[source.id]) : null;
};

async function fetchSource(source, { offline = false } = {}) {
  const fixture = fixtureFor(source);
  if (offline) {
    if (fixture && fs.existsSync(fixture)) {
      return { buffer: fs.readFileSync(fixture), httpStatus: 0, origin: 'fixture' };
    }
    throw new Error('offline mode and no fixture available');
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    const resp = await fetch(source.url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'SAARTHI-SIH26092/1.0 (scheme-data verifier; educational hackathon project)',
        Accept: source.kind === 'PDF' ? 'application/pdf,*/*' : 'text/html,*/*'
      }
    });
    clearTimeout(timer);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const buffer = Buffer.from(await resp.arrayBuffer());
    return { buffer, httpStatus: resp.status, origin: 'live' };
  } catch (err) {
    if (fixture && fs.existsSync(fixture)) {
      console.warn(`  ! live fetch failed (${err.message}) — falling back to bundled fixture`);
      return { buffer: fs.readFileSync(fixture), httpStatus: 0, origin: 'fixture' };
    }
    throw err;
  }
}

/** Extract fields from a fetched document, shaped as
 *  { schemeId, fields: { key: { value, quote, confidence } } } per target. */
async function extract(source, buffer) {
  switch (source.parser) {
    case 'nsfdc-annexure': {
      const { schemes } = await parseNsfdcAnnexure(buffer);
      return schemes
        .filter(s => PDF_SCHEME_TARGETS.has(s.schemeId))
        .map(s => ({ schemeId: s.schemeId, fields: s.fields }));
    }
    case 'mosje-labeled': {
      const { fields } = parseMosjeLabeled(buffer.toString('utf8'));
      return [{ schemeId: source.target_scheme_id, fields }];
    }
    case 'mosje-income-ceiling': {
      const { fields } = parseMosjeIncomeCeiling(buffer.toString('utf8'));
      // income ceiling applies to EVERY active scheme -> fan out
      if (!fields.incomeCeiling) return [];
      return getActiveSchemes().map(s => ({
        schemeId: s.id,
        fields: { incomeCeiling: fields.incomeCeiling }
      }));
    }
    case 'sca-directory': {
      const { rows } = parseScaDirectory(buffer.toString('utf8'));
      return { directoryRows: rows };
    }
    default:
      throw new Error(`Unknown parser: ${source.parser}`);
  }
}

const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

function buildReviewPayload(source, schemeId, fields) {
  const allow = PARSER_FIELD_ALLOWLIST[source.parser] || [];
  const newData = {};
  const fieldConfidence = {};
  const fieldQuotes = {};
  let quoteChunks = [];

  for (const [key, f] of Object.entries(fields)) {
    if (!allow.includes(key)) continue;            // cross-source guard
    if (FIELD_TO_COLUMN[key] && f.value !== undefined) {
      newData[key] = f.value;
      fieldConfidence[key] = f.confidence;
      fieldQuotes[key] = f.quote;
    }
    if (f.quote) quoteChunks.push(`${FIELD_LABELS[key] || key}: ${f.quote}`);
  }

  if (Object.keys(newData).length === 0) return null;

  return {
    schemeId,
    circularRef: `${source.id} @ ${new Date().toISOString().slice(0, 10)}`,
    sourceId: source.id,
    sourceUrl: source.url,
    extractedAt: new Date().toISOString(),
    newData,
    fieldConfidence,
    fieldQuotes,
    aiNotes:
      `Automated extraction via parser '${source.parser}'. ` +
      `Fields gated at confidence >= ${MIN_CONFIDENCE} with verbatim quote match. ` +
      quoteChunks.slice(0, 6).join(' | ')
  };
}

async function runSource(source, { offline = false } = {}) {
  const startedAt = new Date().toISOString();
  console.log(`\n▶ ${source.id} (${source.kind}/${source.parser})`);

  let reviewsCreated = 0;
  let fieldsExtracted = 0;
  let contentHash = null;

  try {
    const { buffer, httpStatus, origin } = await fetchSource(source, { offline });
    console.log(`  fetched: ${origin}${httpStatus ? ` (HTTP ${httpStatus})` : ''} — ${(buffer.length / 1024).toFixed(1)} KB`);

    // Hash the *extractable text*, not raw bytes, so trivial byte diffs
    // (timestamps, compression) don't trigger false change alerts.
    const textProbe = source.kind === 'PDF'
      ? (await parseNsfdcAnnexure(buffer)).text
      : buffer.toString('utf8');
    contentHash = sha256(normalize(textProbe));

    const prev = getSourceHash(source.id);

    if (prev && prev.last_content_hash === contentHash) {
      console.log('  hash unchanged — no re-extraction needed');
      recordIngestRun({
        sourceId: source.id, startedAt, status: 'UNCHANGED', httpStatus,
        contentHash, previousHash: prev.last_content_hash, message: `origin=${origin}`
      });
      return;
    }

    const extracted = await extract(source, buffer);

    if (source.parser === 'sca-directory') {
      // Directory rows go to staging (never straight to the live map)
      clearScrapedPartners(source.id);
      for (const row of extracted.directoryRows) {
        insertScrapedPartner({ sourceId: source.id, ...row });
      }
      fieldsExtracted = extracted.directoryRows.length;
      console.log(`  staged ${fieldsExtracted} directory rows (pending geocode)`);
      updateSourceState(source.id, { hash: contentHash, fetchedAt: startedAt, changed: true });
      recordIngestRun({
        sourceId: source.id, startedAt, status: 'CHANGED', httpStatus,
        contentHash, previousHash: prev?.last_content_hash,
        fieldsExtracted, reviewsCreated: 0,
        message: `staged ${fieldsExtracted} directory rows; origin=${origin}`
      });
      return;
    }

    for (const item of extracted) {
      if (!item.schemeId) continue;
      const payload = buildReviewPayload(source, item.schemeId, item.fields);
      if (!payload) continue;
      fieldsExtracted += Object.keys(payload.newData).length;

      const outcome = queueReview(payload);
      if (outcome.queued) {
        reviewsCreated += 1;
        console.log(`  + queued ${outcome.id} for ${item.schemeId} [${outcome.fields.join(', ')}]`);
        if (outcome.rejectedFields?.length) {
          console.log(`    gated out: ${outcome.rejectedFields.map(r => `${r.field}(conf=${r.confidence},quote=${r.hasQuote})`).join(', ')}`);
        }
      } else {
        console.log(`  = ${item.schemeId}: ${outcome.reason}${outcome.rejectedFields?.length ? ` (gated: ${outcome.rejectedFields.map(r => r.field).join(',')})` : ''}`);
      }
    }

    const status = reviewsCreated > 0 ? 'CHANGED' : 'NO_CHANGES';
    updateSourceState(source.id, { hash: contentHash, fetchedAt: startedAt, changed: true });
    recordIngestRun({
      sourceId: source.id, startedAt, status, httpStatus, contentHash,
      previousHash: prev?.last_content_hash, fieldsExtracted, reviewsCreated,
      message: `origin=${origin}`
    });
    console.log(`  done: ${status} (fields=${fieldsExtracted}, reviews=${reviewsCreated})`);
  } catch (err) {
    console.error(`  ✗ ${source.id} failed: ${err.message}`);
    recordIngestRun({
      sourceId: source.id, startedAt, status: 'ERROR', contentHash,
      message: err.message
    });
  }
}

/**
 * One full ingest pass over every active source (or a --source= filter).
 * Importable so server/index.js can run it on a schedule; the CLI block below
 * keeps `npm run ingest` / `npm run ingest:offline` working unchanged.
 */
export async function runIngestOnce({ offline = false, sourceId = null, log = console } = {}) {
  const summary = { sources: 0, reviewsCreated: 0, errors: 0 };
  const sources = getSources().filter(s => s.is_active && (!sourceId || s.id === sourceId));
  if (sources.length === 0) {
    throw new Error(sourceId ? `No source matched '${sourceId}'` : 'No active sources registered.');
  }

  for (const source of sources) {
    const before = summary;
    log.log(`\n▶ [ingest] ${source.id} (${source.kind}/${source.parser})`);
    try {
      // runSource logs with console directly; capture counts via its return-less
      // flow by reading the audit row count delta instead.
      const runsBefore = getIngestRuns(1)[0];
      await runSource(source, { offline });
      const runsAfter = getIngestRuns(1)[0];
      summary.sources += 1;
      if (runsAfter && runsAfter.id !== runsBefore?.id) {
        if (runsAfter.status === 'ERROR') summary.errors += 1;
        summary.reviewsCreated += runsAfter.reviews_created || 0;
      }
    } catch (err) {
      summary.errors += 1;
      log.error(`  ✗ [ingest] ${source.id} crashed: ${err.message}`);
    }
  }

  summary.pendingReviews = getPendingReviewCount();
  summary.stagedPartners = sources.reduce(
    (n, s) => n + (s.parser === 'sca-directory' ? getScrapedPartnerCount(s.id) : 0), 0
  );
  return summary;
}

async function main() {
  console.log('SAARTHI ingest runner', OFFLINE ? '[OFFLINE — fixtures only]' : '[live fetch + fixture fallback]');

  try {
    const summary = await runIngestOnce({ offline: OFFLINE, sourceId: sourceFilter || null });
    console.log(
      `\nHITL queue now has ${summary.pendingReviews} PENDING review(s). Approve via the Admin dashboard.`
    );
    console.log(`Staged directory rows: ${summary.stagedPartners}`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

  // database.js keeps a 30s flush interval — exit explicitly
  process.exit(0);
}

// CLI entry — pathToFileURL handles Windows drive letters (file:///Z:/...)
const isMainCli = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainCli) {
  main().catch(err => {
    console.error('Ingest runner crashed:', err);
    process.exit(1);
  });
}
