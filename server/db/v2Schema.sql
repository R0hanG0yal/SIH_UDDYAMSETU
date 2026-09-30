-- =============================================================================
-- SIH26092 / SAARTHI — SQLite (sql.js) schema for the /api/v2 data pipeline
-- Companion to postgresql_schema.sql (production target). Same logical model.
-- Runtime initializer: server/db/v2db.js executes this file.
-- =============================================================================

-- Source registry: every official document we scrape, with content-hash state
-- for change detection (zero-hallucination: only hashes reach the extractor).
CREATE TABLE IF NOT EXISTS sources (
  id                      TEXT PRIMARY KEY,
  name                    TEXT NOT NULL,
  url                     TEXT NOT NULL,
  kind                    TEXT NOT NULL CHECK (kind IN ('PDF', 'HTML')),
  parser                  TEXT NOT NULL,           -- extractor key, e.g. 'nsfdc-annexure', 'mosje-labeled'
  target_scheme_id        TEXT,                    -- optional: HTML page bound to one scheme
  provides_income_ceiling INTEGER NOT NULL DEFAULT 0,
  fetch_cadence_hours     INTEGER NOT NULL DEFAULT 24,
  last_fetched_at         TEXT,
  last_content_hash       TEXT,                    -- sha256 of normalized extracted text
  last_change_detected_at TEXT,
  is_active               INTEGER NOT NULL DEFAULT 1,
  created_at              TEXT NOT NULL
);

-- Master scheme catalog (Policy-as-Code). Seeded from official sources only.
CREATE TABLE IF NOT EXISTS schemes (
  id                     TEXT PRIMARY KEY,
  code                   TEXT UNIQUE NOT NULL,
  name                   TEXT NOT NULL,
  name_hindi             TEXT,
  purpose                TEXT NOT NULL CHECK (purpose IN ('BUSINESS', 'EDUCATION')),
  category               TEXT NOT NULL,
  min_cost               REAL NOT NULL,
  max_cost               REAL NOT NULL,
  max_loan_percent       REAL NOT NULL DEFAULT 90,
  max_absolute_loan      REAL NOT NULL,
  base_interest_rate     REAL NOT NULL,            -- beneficiary rate % p.a.
  channel_rate           REAL,                     -- SCA/CAs rate % p.a. (on-lending)
  female_rebate          REAL NOT NULL DEFAULT 0,
  eligible_genders       TEXT NOT NULL DEFAULT 'ALL' CHECK (eligible_genders IN ('ALL', 'FEMALE')),
  min_moratorium_months  INTEGER NOT NULL,
  max_moratorium_months  INTEGER NOT NULL,
  default_tenure_years   INTEGER NOT NULL,
  max_tenure_years       INTEGER NOT NULL,
  repayment_cadence      TEXT NOT NULL DEFAULT 'QUARTERLY' CHECK (repayment_cadence IN ('MONTHLY', 'QUARTERLY')),
  income_ceiling         REAL NOT NULL DEFAULT 500000,
  target_caste           TEXT NOT NULL DEFAULT 'SC',
  min_education          TEXT NOT NULL DEFAULT 'NONE',
  channel_types          TEXT NOT NULL DEFAULT '["SCA"]',  -- JSON array of partner types
  description            TEXT,
  official_source_url    TEXT NOT NULL,
  source_document        TEXT NOT NULL,            -- human citation, e.g. 'MoSJE Annexure-I(a), as on 31.03.2024'
  source_quote           TEXT NOT NULL,            -- VERBATIM excerpt backing the numbers
  source_published_at    TEXT,
  last_verified_at       TEXT,
  policy_version         TEXT NOT NULL DEFAULT 'NSFDC-2026.01',
  is_active              INTEGER NOT NULL DEFAULT 1,
  created_at             TEXT NOT NULL,
  updated_at             TEXT NOT NULL
);

-- Immutable version history: written on every HITL approval
CREATE TABLE IF NOT EXISTS scheme_versions (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  scheme_id       TEXT NOT NULL REFERENCES schemes(id),
  version_no      INTEGER NOT NULL,
  snapshot        TEXT NOT NULL,                   -- full scheme row as JSON
  source_id       TEXT,
  source_url      TEXT,
  change_summary  TEXT,
  approved_by     TEXT,
  approved_at     TEXT NOT NULL
);

-- Channel partners (SCA/PSB/RRB/SFB/NBFC-MFI). Directory facts come from the
-- official MoSJE list; health metrics are clearly flagged as demo-simulated.
CREATE TABLE IF NOT EXISTS channel_partners (
  id                   TEXT PRIMARY KEY,
  partner_code         TEXT UNIQUE NOT NULL,
  name                 TEXT NOT NULL,
  type                 TEXT NOT NULL CHECK (type IN ('SCA', 'PSB', 'RRB', 'SFB', 'NBFC_MFI', 'COOP')),
  agency_full_name     TEXT NOT NULL,
  branch               TEXT NOT NULL,
  district             TEXT NOT NULL,
  state                TEXT NOT NULL,
  pincode              TEXT,
  latitude             REAL NOT NULL,
  longitude            REAL NOT NULL,
  authorized_schemes   TEXT NOT NULL DEFAULT '[]',  -- JSON array of scheme ids
  gross_npa_percent    REAL NOT NULL,
  overdue_rate_percent REAL NOT NULL,
  fund_allocated       REAL NOT NULL,
  fund_utilized        REAL NOT NULL,
  avg_sla_days         INTEGER NOT NULL DEFAULT 3,
  nodal_officer        TEXT,
  contact_phone        TEXT,
  contact_email        TEXT,
  intake_status        TEXT NOT NULL DEFAULT 'ACCEPTING' CHECK (intake_status IN ('ACCEPTING', 'LIMITED', 'PAUSED')),
  directory_source_url TEXT,
  health_data_source   TEXT NOT NULL DEFAULT 'SIMULATED_DEMO',
  is_active            INTEGER NOT NULL DEFAULT 1,
  created_at           TEXT NOT NULL,
  updated_at           TEXT NOT NULL
);

-- HITL queue: AI-extracted revisions awaiting nodal-officer adjudication.
-- old_data / new_data / field_confidence / field_quotes are JSON documents.
CREATE TABLE IF NOT EXISTS policy_reviews (
  id              TEXT PRIMARY KEY,               -- REV-2026-001
  scheme_id       TEXT NOT NULL REFERENCES schemes(id),
  scheme_name     TEXT NOT NULL,
  circular_ref    TEXT NOT NULL,
  source_id       TEXT REFERENCES sources(id),
  source_url      TEXT NOT NULL,
  source_hash     TEXT,
  extracted_at    TEXT NOT NULL,
  origin          TEXT NOT NULL DEFAULT 'INGEST' CHECK (origin IN ('SEED', 'INGEST')),
  old_data        TEXT NOT NULL,
  new_data        TEXT NOT NULL,
  field_confidence TEXT NOT NULL,
  field_quotes    TEXT,                           -- JSON: field -> verbatim source excerpt
  ai_notes        TEXT,
  review_status   TEXT NOT NULL DEFAULT 'PENDING' CHECK (review_status IN ('PENDING', 'APPROVED', 'REJECTED')),
  reviewed_by     TEXT,
  reviewed_at     TEXT,
  admin_comments  TEXT,
  created_at      TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reviews_status ON policy_reviews (review_status, created_at);
CREATE INDEX IF NOT EXISTS idx_schemes_active ON schemes (is_active, purpose);

-- Audit trail for every ingest run (fetch -> hash -> extract -> diff)
CREATE TABLE IF NOT EXISTS ingest_runs (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  source_id       TEXT NOT NULL REFERENCES sources(id),
  started_at      TEXT NOT NULL,
  finished_at     TEXT,
  status          TEXT NOT NULL CHECK (status IN ('UNCHANGED', 'NO_CHANGES', 'CHANGED', 'ERROR')),
  http_status     INTEGER,
  content_hash    TEXT,
  previous_hash   TEXT,
  fields_extracted INTEGER NOT NULL DEFAULT 0,
  reviews_created  INTEGER NOT NULL DEFAULT 0,
  message         TEXT
);

-- Saved beneficiary passports: snapshot of a completed v2 journey
-- (matched scheme + channel partner + financials) for officer follow-up.
CREATE TABLE IF NOT EXISTS beneficiary_passports (
  id                    TEXT PRIMARY KEY,          -- SRT-2026-XXXXXX
  created_at            TEXT NOT NULL,
  updated_at            TEXT NOT NULL,
  policy_version        TEXT NOT NULL,
  beneficiary           TEXT NOT NULL,             -- JSON: name, gender, district, incomeLevel...
  scheme_id             TEXT,
  scheme_name           TEXT,
  effective_interest_rate REAL,
  eligible_loan_amount  REAL,
  project_cost          REAL,
  partner_id            TEXT,
  partner_name          TEXT,
  partner_distance_km   REAL,
  financials            TEXT,                      -- JSON: EMI, tenure, cadence, moratorium
  status                TEXT NOT NULL DEFAULT 'DRAFT'
                        CHECK (status IN ('DRAFT','SUBMITTED','UNDER_REVIEW','SANCTIONED','REJECTED')),
  audit_log             TEXT NOT NULL DEFAULT '[]' -- JSON: [{action, at, by, note}]
);

CREATE INDEX IF NOT EXISTS idx_passports_created ON beneficiary_passports (created_at DESC);

-- Raw directory rows scraped from the MoSJE Channelizing Agencies page.
-- Kept separate from channel_partners until geocoded + officer-approved.
CREATE TABLE IF NOT EXISTS scraped_partners (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  source_id     TEXT NOT NULL,
  section       TEXT NOT NULL,                    -- 'SCA' | 'RRB' | 'PSB'
  state         TEXT,
  agency_name   TEXT NOT NULL,
  address       TEXT,
  contact_raw   TEXT,
  scraped_at    TEXT NOT NULL,
  geocode_status TEXT NOT NULL DEFAULT 'PENDING_GEOCODE',
  latitude       REAL,                            -- filled by geocodePartners.js
  longitude      REAL,
  geocode_display_name TEXT,
  geocode_confidence  REAL,
  geocoded_at    TEXT
);
