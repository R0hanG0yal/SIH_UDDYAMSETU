import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure db directory exists
const dbDir = path.join(__dirname, '../data/db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'saarthi.db');
const db = new Database(dbPath);

// Enable WAL mode for high concurrency
db.pragma('journal_mode = WAL');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS passports (
    ref_id TEXT PRIMARY KEY,
    timestamp TEXT NOT NULL,
    policy_version TEXT NOT NULL,
    beneficiary_name TEXT NOT NULL,
    category TEXT NOT NULL,
    gender TEXT,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    primary_scheme TEXT NOT NULL,
    scheme_code TEXT NOT NULL,
    project_cost REAL NOT NULL,
    eligible_loan REAL NOT NULL,
    own_equity REAL NOT NULL,
    government_subsidy_amount REAL NOT NULL,
    effective_interest_rate REAL NOT NULL,
    partner_id TEXT NOT NULL,
    partner_name TEXT NOT NULL,
    branch TEXT,
    status TEXT NOT NULL DEFAULT 'received',
    documents_verified TEXT, -- JSON array
    metadata TEXT -- JSON object
  );

  CREATE TABLE IF NOT EXISTS scheme_evaluations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    applicant_name TEXT,
    sector TEXT,
    project_cost REAL,
    annual_income REAL,
    matched_schemes_count INTEGER,
    top_scheme TEXT,
    timestamp TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS partner_desks (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    intake_status TEXT NOT NULL,
    avg_sla_days INTEGER NOT NULL,
    nodal_officer TEXT NOT NULL,
    contact_phone TEXT NOT NULL
  );
`);

console.log(`[Database] SQLite connected and initialized at ${dbPath}`);

export { db };
