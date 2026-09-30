// =============================================================================
// SIH26092 / SAARTHI — v2 database layer (SQLite via sql.js)
//
// - Executes server/db/v2Schema.sql on boot (idempotent)
// - Auto-seeds from server/data/seedSchemes.js on FIRST boot only, so the demo
//   never depends on live government sites
// - Exposes tiny query helpers used by server/routes/sihCoreRouter.js and by
//   server/ingest/runIngest.js
// =============================================================================

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from './database.js';
import { SEED_SOURCES, SEED_SCHEMES, SEED_PARTNERS, SEED_POLICY_REVIEWS } from '../data/seedSchemes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NOW = () => new Date().toISOString();

// --- Schema bootstrap --------------------------------------------------------
const schemaSql = fs.readFileSync(path.join(__dirname, 'v2Schema.sql'), 'utf8');
// sql.js exec() runs multi-statement SQL; wrap via prepare+run per statement
for (const stmt of schemaSql.split(/;\s*\n/).map(s => s.trim()).filter(Boolean)) {
  db.prepare(stmt).run();
}

// Lightweight migration for DBs created before the geocode columns existed
// (CREATE TABLE IF NOT EXISTS will not alter an existing table).
for (const col of ['latitude REAL', 'longitude REAL', 'geocode_display_name TEXT',
  'geocode_confidence REAL', 'geocoded_at TEXT']) {
  try { db.prepare(`ALTER TABLE scraped_partners ADD COLUMN ${col}`).run(); } catch { /* exists */ }
}

// --- Seed on first boot ------------------------------------------------------
const schemeCount = db.prepare('SELECT COUNT(*) AS c FROM schemes').get();

if (!schemeCount || schemeCount.c === 0) {
  console.log('[v2db] First boot detected — seeding curated official dataset...');

  const stamp = (obj) => ({ ...obj, created_at: obj.created_at ?? NOW(), updated_at: obj.updated_at ?? NOW() });

  const seedRow = (table, obj) => {
    const row = stamp(obj);
    const cols = Object.keys(row);
    db.prepare(
      `INSERT OR IGNORE INTO ${table} (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`
    ).run(...cols.map(c => (row[c] === undefined ? null : row[c])));
  };

  for (const s of SEED_SOURCES) {
    db.prepare(
      `INSERT OR IGNORE INTO sources (id, name, url, kind, parser, target_scheme_id,
        provides_income_ceiling, fetch_cadence_hours, is_active, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      s.id, s.name, s.url, s.kind, s.parser, s.target_scheme_id,
      s.provides_income_ceiling, s.fetch_cadence_hours, s.is_active, NOW()
    );
  }

  for (const s of SEED_SCHEMES) seedRow('schemes', s);
  for (const p of SEED_PARTNERS) seedRow('channel_partners', p);

  const reviewCols = Object.keys(SEED_POLICY_REVIEWS[0]);
  for (const r of SEED_POLICY_REVIEWS) {
    db.prepare(
      `INSERT OR IGNORE INTO policy_reviews (${reviewCols.join(', ')})
       VALUES (${reviewCols.map(() => '?').join(', ')})`
    ).run(...reviewCols.map(c => (r[c] === undefined ? null : r[c])));
  }

  console.log(
    `[v2db] Seeded ${SEED_SCHEMES.length} schemes, ${SEED_PARTNERS.length} partners, ` +
    `${SEED_POLICY_REVIEWS.length} pending review(s), ${SEED_SOURCES.length} sources.`
  );
}

// --- Row mappers (DB snake_case -> API camelCase) ----------------------------

export function mapScheme(row) {
  if (!row) return null;
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    nameHindi: row.name_hindi,
    purpose: row.purpose,
    category: row.category,
    minCost: row.min_cost,
    maxCost: row.max_cost,
    maxLoanPercent: row.max_loan_percent,
    maxAbsoluteLoan: row.max_absolute_loan,
    baseInterestRate: row.base_interest_rate,
    channelRate: row.channel_rate,
    femaleRebate: row.female_rebate,
    eligibleGenders: row.eligible_genders,
    minMoratoriumMonths: row.min_moratorium_months,
    maxMoratoriumMonths: row.max_moratorium_months,
    defaultTenureYears: row.default_tenure_years,
    maxTenureYears: row.max_tenure_years,
    repaymentCadence: row.repayment_cadence,
    incomeCeiling: row.income_ceiling,
    targetCaste: row.target_caste,
    minEducation: row.min_education,
    channelTypes: JSON.parse(row.channel_types || '[]'),
    description: row.description,
    officialSourceUrl: row.official_source_url,
    sourceDocument: row.source_document,
    sourceQuote: row.source_quote,
    sourcePublishedAt: row.source_published_at,
    lastVerifiedAt: row.last_verified_at,
    policyVersion: row.policy_version,
    isActive: !!row.is_active
  };
}

export function mapPartner(row) {
  if (!row) return null;
  return {
    id: row.id,
    partnerCode: row.partner_code,
    name: row.name,
    type: row.type,
    agencyFullName: row.agency_full_name,
    branch: row.branch,
    district: row.district,
    state: row.state,
    pincode: row.pincode,
    latitude: row.latitude,
    longitude: row.longitude,
    authorizedSchemes: JSON.parse(row.authorized_schemes || '[]'),
    grossNpaPercent: row.gross_npa_percent,
    overdueRatePercent: row.overdue_rate_percent,
    fundAllocated: row.fund_allocated,
    fundUtilized: row.fund_utilized,
    avgSlaDays: row.avg_sla_days,
    nodalOfficer: row.nodal_officer,
    contactPhone: row.contact_phone,
    contactEmail: row.contact_email,
    intakeStatus: row.intake_status,
    directorySourceUrl: row.directory_source_url,
    healthDataSource: row.health_data_source
  };
}

export function mapReview(row) {
  if (!row) return null;
  return {
    id: row.id,
    schemeId: row.scheme_id,
    schemeName: row.scheme_name,
    circularRef: row.circular_ref,
    sourceId: row.source_id,
    sourceUrl: row.source_url,
    sourceHash: row.source_hash,
    extractedAt: row.extracted_at,
    origin: row.origin,
    oldData: JSON.parse(row.old_data),
    newData: JSON.parse(row.new_data),
    fieldConfidence: JSON.parse(row.field_confidence),
    fieldQuotes: row.field_quotes ? JSON.parse(row.field_quotes) : {},
    aiExtractionNotes: row.ai_notes,
    reviewStatus: row.review_status,
    reviewedBy: row.reviewed_by,
    reviewedAt: row.reviewed_at,
    adminComments: row.admin_comments,
    createdAt: row.created_at
  };
}

// --- Query helpers -----------------------------------------------------------

export function getActiveSchemes() {
  return db.prepare('SELECT * FROM schemes WHERE is_active = 1').all().map(mapScheme);
}

export function getSchemeById(id) {
  return mapScheme(db.prepare('SELECT * FROM schemes WHERE id = ?').get(id));
}

export function getActivePartners() {
  return db.prepare('SELECT * FROM channel_partners WHERE is_active = 1').all().map(mapPartner);
}

export function getSources() {
  return db.prepare('SELECT * FROM sources ORDER BY id').all();
}

export function listReviews(statusFilter) {
  const rows = statusFilter
    ? db.prepare('SELECT * FROM policy_reviews WHERE review_status = ? ORDER BY created_at DESC').all(statusFilter)
    : db.prepare('SELECT * FROM policy_reviews ORDER BY created_at DESC').all();
  return rows.map(mapReview);
}

export function getReviewById(id) {
  return mapReview(db.prepare('SELECT * FROM policy_reviews WHERE id = ?').get(id));
}

/**
 * Approve a pending review: flip status + publish new_data into the live
 * schemes row, bumping policy_version and writing an immutable version row.
 */
export function approveReview(id, reviewerName, comments) {
  const row = db.prepare('SELECT * FROM policy_reviews WHERE id = ?').get(id);
  if (!row) return { ok: false, error: 'NOT_FOUND' };
  if (row.review_status !== 'PENDING') return { ok: false, error: 'ALREADY_ADJUDICATED' };

  const newData = JSON.parse(row.new_data);
  const review = mapReview(row);

  db.prepare(
    `UPDATE policy_reviews SET review_status = 'APPROVED', reviewed_by = ?, reviewed_at = ?, admin_comments = ?
     WHERE id = ?`
  ).run(reviewerName, NOW(), comments || null, id);

  const schemeRow = db.prepare('SELECT * FROM schemes WHERE id = ?').get(row.scheme_id);
  let published = false;

  if (schemeRow) {
    // Map HITL new_data keys -> schema columns (only keys present get written)
    const colMap = {
      maxCost: 'max_cost',
      maxLoanAmount: 'max_absolute_loan',
      interestRate: 'base_interest_rate',
      moratoriumMonths: 'max_moratorium_months',
      tenureYears: 'max_tenure_years',
      incomeCeiling: 'income_ceiling'
    };
    const sets = [];
    const params = [];
    for (const [k, col] of Object.entries(colMap)) {
      if (newData[k] !== undefined && newData[k] !== null) {
        sets.push(`${col} = ?`);
        params.push(newData[k]);
      }
    }

    const oldVersion = schemeRow.policy_version;
    const newVersion = 'NSFDC-2026.02';
    sets.push('policy_version = ?', 'last_verified_at = ?', 'updated_at = ?');
    params.push(newVersion, NOW(), NOW(), row.scheme_id);

    db.prepare(`UPDATE schemes SET ${sets.join(', ')} WHERE id = ?`).run(...params);
    published = true;

    // Version counter + immutable snapshot
    const verCount = db.prepare('SELECT COUNT(*) AS c FROM scheme_versions WHERE scheme_id = ?').get(row.scheme_id);
    const freshSnapshot = db.prepare('SELECT * FROM schemes WHERE id = ?').get(row.scheme_id);
    db.prepare(
      `INSERT INTO scheme_versions (scheme_id, version_no, snapshot, source_id, source_url,
        change_summary, approved_by, approved_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      row.scheme_id,
      (verCount?.c || 0) + 1,
      JSON.stringify(freshSnapshot),
      row.source_id,
      row.source_url,
      JSON.stringify({ from: oldVersion, to: newVersion, fields: Object.keys(newData) }),
      reviewerName,
      NOW()
    );
  }

  return { ok: true, published, review: getReviewById(id) };
}

export function rejectReview(id, reviewerName, comments) {
  const row = db.prepare('SELECT * FROM policy_reviews WHERE id = ?').get(id);
  if (!row) return { ok: false, error: 'NOT_FOUND' };
  if (row.review_status !== 'PENDING') return { ok: false, error: 'ALREADY_ADJUDICATED' };

  db.prepare(
    `UPDATE policy_reviews SET review_status = 'REJECTED', reviewed_by = ?, reviewed_at = ?, admin_comments = ?
     WHERE id = ?`
  ).run(reviewerName, NOW(), comments || null, id);

  return { ok: true, review: getReviewById(id) };
}

/**
 * Insert an extraction result as a PENDING policy review.
 * Refuses fields whose value cannot be backed by a verbatim quote (or a
 * confidence score below MIN_CONFIDENCE) — the zero-hallucination gate.
 */
export const MIN_CONFIDENCE = 0.75;

export function queueReview({ schemeId, circularRef, sourceId, sourceUrl, sourceHash,
  extractedAt, newData, fieldConfidence, fieldQuotes, aiNotes }) {
  const scheme = db.prepare('SELECT * FROM schemes WHERE id = ?').get(schemeId);
  if (!scheme) return { queued: false, reason: 'unknown scheme', rejectedFields: [] };

  // Every field the HITL dashboard renders, with the CURRENT live value.
  const liveValues = {
    maxCost: scheme.max_cost,
    maxLoanAmount: scheme.max_absolute_loan,
    interestRate: scheme.base_interest_rate,
    moratoriumMonths: scheme.max_moratorium_months,
    tenureYears: scheme.max_tenure_years,
    incomeCeiling: scheme.income_ceiling
  };

  // Zero-hallucination gate: drop low-confidence / unquoted proposed fields
  const changed = {};
  const rejectedFields = [];
  for (const [k, v] of Object.entries(newData)) {
    if (!(k in liveValues)) continue;              // unknown field — ignore
    const conf = fieldConfidence?.[k] ?? 0;
    const quote = fieldQuotes?.[k];
    if (conf < MIN_CONFIDENCE || !quote) {
      rejectedFields.push({ field: k, confidence: conf, hasQuote: !!quote });
      continue;
    }
    if (v !== liveValues[k]) changed[k] = v;       // only true deltas
  }
  if (Object.keys(changed).length === 0) {
    return { queued: false, reason: 'no delta vs live policy', rejectedFields };
  }

  // Backfill ALL dashboard fields so old/new/confidence are always complete:
  // changed fields carry extraction confidence+quote; unchanged carry 1.0 + the
  // scheme's official source quote backing the live value.
  const outNew = {};
  const outConf = {};
  const outQuotes = {};
  for (const [k, live] of Object.entries(liveValues)) {
    if (k in changed) {
      outNew[k] = changed[k];
      outConf[k] = fieldConfidence[k];
      outQuotes[k] = fieldQuotes[k];
    } else {
      outNew[k] = live;
      outConf[k] = 1.0;
      outQuotes[k] = scheme.source_quote;
    }
  }

  const seq = String(
    (db.prepare('SELECT COUNT(*) AS c FROM policy_reviews').get()?.c || 0) + 1
  ).padStart(3, '0');
  const id = `REV-${new Date().getFullYear()}-${seq}`;

  db.prepare(
    `INSERT INTO policy_reviews (id, scheme_id, scheme_name, circular_ref, source_id, source_url,
      source_hash, extracted_at, origin, old_data, new_data, field_confidence, field_quotes,
      ai_notes, review_status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'INGEST', ?, ?, ?, ?, ?, 'PENDING', ?)`
  ).run(
    id, schemeId, scheme.name, circularRef || 'INGEST-AUTO', sourceId, sourceUrl,
    sourceHash || null, extractedAt || NOW(),
    JSON.stringify(liveValues), JSON.stringify(outNew),
    JSON.stringify(outConf), JSON.stringify(outQuotes), aiNotes || null, NOW()
  );

  return { queued: true, id, rejectedFields, fields: Object.keys(changed) };
}

export function recordIngestRun({ sourceId, status, httpStatus, contentHash, previousHash,
  fieldsExtracted, reviewsCreated, message, startedAt }) {
  db.prepare(
    `INSERT INTO ingest_runs (source_id, started_at, finished_at, status, http_status,
      content_hash, previous_hash, fields_extracted, reviews_created, message)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(sourceId, startedAt, NOW(), status, httpStatus ?? null, contentHash || null,
    previousHash || null, fieldsExtracted || 0, reviewsCreated || 0, message || null);
}

export function updateSourceState(sourceId, { hash, fetchedAt, changed }) {
  if (changed) {
    db.prepare(
      `UPDATE sources SET last_content_hash = ?, last_fetched_at = ?, last_change_detected_at = ? WHERE id = ?`
    ).run(hash, fetchedAt, fetchedAt, sourceId);
  } else {
    db.prepare(
      `UPDATE sources SET last_content_hash = ?, last_fetched_at = ? WHERE id = ?`
    ).run(hash, fetchedAt, sourceId);
  }
}

export function insertScrapedPartner({ sourceId, section, state, agencyName, address, contactRaw }) {
  db.prepare(
    `INSERT INTO scraped_partners (source_id, section, state, agency_name, address, contact_raw, scraped_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(sourceId, section, state || null, agencyName, address || null, contactRaw || null, NOW());
}

export function clearScrapedPartners(sourceId) {
  db.prepare('DELETE FROM scraped_partners WHERE source_id = ?').run(sourceId);
}

export function getSourceHash(sourceId) {
  return db.prepare('SELECT last_content_hash FROM sources WHERE id = ?').get(sourceId);
}

export function getPendingReviewCount() {
  return db.prepare("SELECT COUNT(*) AS c FROM policy_reviews WHERE review_status = 'PENDING'").get()?.c || 0;
}

export function getIngestRuns(limit = 20) {
  return db
    .prepare('SELECT * FROM ingest_runs ORDER BY id DESC LIMIT ?')
    .all(limit);
}

export function getScrapedPartnerCount(sourceId) {
  return db.prepare('SELECT COUNT(*) AS c FROM scraped_partners WHERE source_id = ?').get(sourceId)?.c || 0;
}

// --- Staged directory partners (scrape -> geocode -> HITL promote) ------------

export function listScrapedPartners({ geocodeStatus } = {}) {
  const rows = geocodeStatus
    ? db.prepare('SELECT * FROM scraped_partners WHERE geocode_status = ? ORDER BY section, state, agency_name').all(geocodeStatus)
    : db.prepare('SELECT * FROM scraped_partners ORDER BY section, state, agency_name').all();
  return rows.map(r => ({
    id: r.id,
    sourceId: r.source_id,
    section: r.section,
    state: r.state,
    agencyName: r.agency_name,
    address: r.address,
    contactRaw: r.contact_raw,
    scrapedAt: r.scraped_at,
    geocodeStatus: r.geocode_status,
    latitude: r.latitude,
    longitude: r.longitude,
    geocodeDisplayName: r.geocode_display_name,
    geocodeConfidence: r.geocode_confidence,
    geocodedAt: r.geocoded_at
  }));
}

export function updateScrapedPartnerGeocode(id, { latitude, longitude, displayName, confidence, status }) {
  db.prepare(
    `UPDATE scraped_partners SET latitude = ?, longitude = ?, geocode_display_name = ?,
      geocode_confidence = ?, geocode_status = ?, geocoded_at = ? WHERE id = ?`
  ).run(latitude, longitude, displayName || null, confidence ?? null, status, NOW(), id);
}

export function setScrapedPartnerStatus(id, status) {
  db.prepare('UPDATE scraped_partners SET geocode_status = ? WHERE id = ?').run(status, id);
}

/**
 * HITL promotion: turn a geocoded staging row into a live channel_partner.
 * Directory facts (name/state/section) come verbatim from the official MoSJE
 * list; coordinates come from the geocoder (flagged NOMINATIM_OSM or the
 * offline equivalent). Health telemetry is seeded neutral-safe and flagged
 * SIMULATED_DEMO, matching every other partner on the map.
 */
export function promoteScrapedPartner(id, { officerName } = {}) {
  const row = db.prepare('SELECT * FROM scraped_partners WHERE id = ?').get(id);
  if (!row) return { ok: false, error: 'NOT_FOUND' };
  if (row.geocode_status === 'PROMOTED') return { ok: false, error: 'ALREADY_PROMOTED' };
  if (!row.latitude || !row.longitude) {
    return { ok: false, error: 'NOT_GEOCODED' };
  }

  const partnerId = `PARTNER-SCRAPE-${row.section}-${row.id}`;
  const agencyFullName = `${row.agency_name} (MoSJE-listed ${row.section} channel)`;

  db.prepare(
    `INSERT INTO channel_partners (id, partner_code, name, type, agency_full_name,
      branch, district, state, pincode, latitude, longitude, authorized_schemes,
      gross_npa_percent, overdue_rate_percent, fund_allocated, fund_utilized,
      avg_sla_days, nodal_officer, contact_phone, contact_email, intake_status,
      directory_source_url, health_data_source, is_active, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`
  ).run(
    partnerId,
    `SCRAPED-${row.section}-${row.id}`,
    row.agency_name,
    row.section,
    agencyFullName,
    row.address || row.agency_name,
    row.state || '—',
    row.state || '—',
    null,
    row.latitude,
    row.longitude,
    JSON.stringify([
      'NSFDC_MICRO_FINANCE', 'NSFDC_MAHILA_SAMRUDDHI', 'NSFDC_SUVIDHA',
      'NSFDC_UTKARSH', 'NSFDC_TERM_LOAN', 'NSFDC_EDUCATION_LOAN'
    ]),
    3.0,           // neutral-safe placeholder telemetry (SIMULATED_DEMO)
    4.0,
    5000000,
    1000000,
    5,
    null,
    row.contact_raw,
    null,
    'LIMITED',     // cautious default until the desk is verified
    row.source_id === 'dosje-sca-directory'
      ? 'https://www.dosje.gov.in/organisation/list-of-channelizing-agencies/'
      : null,
    'SIMULATED_DEMO',
    NOW(),
    NOW()
  );

  db.prepare(
    `UPDATE scraped_partners SET geocode_status = 'PROMOTED' WHERE id = ?`
  ).run(id);

  console.log(`[v2db] Partner ${partnerId} promoted to live map by ${officerName || 'admin'}.`);
  return { ok: true, partnerId };
}

export function deleteScrapedPartner(id) {
  const row = db.prepare('SELECT * FROM scraped_partners WHERE id = ?').get(id);
  if (!row) return { ok: false, error: 'NOT_FOUND' };
  db.prepare('DELETE FROM scraped_partners WHERE id = ?').run(id);
  return { ok: true };
}

/**
 * Batch-promote staged rows (HITL bulk approval after review). Only geocoded,
 * not-yet-promoted rows are eligible; per-row outcomes are reported so the
 * officer sees exactly what was published vs skipped.
 */
export function batchPromoteScrapedPartners(ids, { officerName } = {}) {
  const results = { promoted: [], skipped: [] };
  for (const rawId of ids) {
    const id = Number(rawId);
    const row = db.prepare('SELECT * FROM scraped_partners WHERE id = ?').get(id);
    if (!row) {
      results.skipped.push({ id, reason: 'NOT_FOUND' });
      continue;
    }
    if (row.geocode_status === 'PROMOTED') {
      results.skipped.push({ id, reason: 'ALREADY_PROMOTED' });
      continue;
    }
    if (!row.latitude || !row.longitude) {
      results.skipped.push({ id, reason: 'NOT_GEOCODED' });
      continue;
    }
    const outcome = promoteScrapedPartner(id, { officerName });
    if (outcome.ok) results.promoted.push({ id, partnerId: outcome.partnerId });
    else results.skipped.push({ id, reason: outcome.error });
  }
  return { ok: true, ...results };
}

// --- Beneficiary passports (saved v2 journey: scheme + partner + financials) --

const PASSPORT_STATUS_FLOW = {
  DRAFT: ['SUBMITTED'],
  SUBMITTED: ['UNDER_REVIEW', 'REJECTED'],
  UNDER_REVIEW: ['SANCTIONED', 'REJECTED'],
  SANCTIONED: [],
  REJECTED: []
};

function mapPassport(row) {
  if (!row) return null;
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    policyVersion: row.policy_version,
    beneficiary: JSON.parse(row.beneficiary || '{}'),
    scheme: row.scheme_id
      ? { id: row.scheme_id, name: row.scheme_name, effectiveInterestRate: row.effective_interest_rate,
          eligibleLoanAmount: row.eligible_loan_amount, projectCost: row.project_cost }
      : null,
    partner: row.partner_id
      ? { id: row.partner_id, name: row.partner_name, distanceKm: row.partner_distance_km }
      : null,
    financials: JSON.parse(row.financials || '{}'),
    status: row.status,
    auditLog: JSON.parse(row.audit_log || '[]')
  };
}

export function insertBeneficiaryPassport(data) {
  const now = NOW();
  const seq = String(
    (db.prepare('SELECT COUNT(*) AS c FROM beneficiary_passports').get()?.c || 0) + 1
  ).padStart(6, '0');
  const id = `SRT-${new Date().getFullYear()}-${seq}`;

  db.prepare(
    `INSERT INTO beneficiary_passports (id, created_at, updated_at, policy_version,
      beneficiary, scheme_id, scheme_name, effective_interest_rate, eligible_loan_amount,
      project_cost, partner_id, partner_name, partner_distance_km, financials,
      status, audit_log)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id, now, now,
    data.policyVersion || 'NSFDC-2026.01',
    JSON.stringify(data.beneficiary || {}),
    data.scheme?.id || null,
    data.scheme?.name || null,
    data.scheme?.effectiveInterestRate ?? null,
    data.scheme?.eligibleLoanAmount ?? null,
    data.scheme?.projectCost ?? null,
    data.partner?.id || null,
    data.partner?.name || null,
    data.partner?.distanceKm ?? null,
    JSON.stringify(data.financials || {}),
    data.status || 'DRAFT',
    JSON.stringify([{ action: 'CREATED', at: now, by: data.beneficiary?.name || 'beneficiary', note: 'Passport saved from SAARTHI v2 journey' }])
  );

  return getBeneficiaryPassport(id);
}

export function listBeneficiaryPassports({ status } = {}) {
  const rows = status
    ? db.prepare('SELECT * FROM beneficiary_passports WHERE status = ? ORDER BY created_at DESC').all(status)
    : db.prepare('SELECT * FROM beneficiary_passports ORDER BY created_at DESC').all();
  return rows.map(mapPassport);
}

export function getBeneficiaryPassport(id) {
  return mapPassport(db.prepare('SELECT * FROM beneficiary_passports WHERE id = ?').get(id));
}

export function updateBeneficiaryPassportStatus(id, status, { officerName, note } = {}) {
  const row = db.prepare('SELECT * FROM beneficiary_passports WHERE id = ?').get(id);
  if (!row) return { ok: false, error: 'NOT_FOUND' };

  const current = row.status;
  if (!PASSPORT_STATUS_FLOW[current]?.includes(status)) {
    return { ok: false, error: 'INVALID_TRANSITION', detail: `Cannot move ${current} → ${status}` };
  }

  const now = NOW();
  const log = JSON.parse(row.audit_log || '[]');
  log.push({ action: `STATUS:${status}`, at: now, by: officerName || 'officer', note: note || null });

  db.prepare(
    'UPDATE beneficiary_passports SET status = ?, updated_at = ?, audit_log = ? WHERE id = ?'
  ).run(status, now, JSON.stringify(log), id);

  return { ok: true, passport: getBeneficiaryPassport(id) };
}
