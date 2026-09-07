import initSqlJs from 'sql.js';
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

// Initialize sql.js (pure JS/WASM — no native C++ addon, works on Render/Vercel/anywhere)
const SQL = await initSqlJs();

// Load existing database file or create new one
let sqlDb;
if (fs.existsSync(dbPath)) {
  const fileBuffer = fs.readFileSync(dbPath);
  sqlDb = new SQL.Database(fileBuffer);
} else {
  sqlDb = new SQL.Database();
}

// Initialize schema
sqlDb.run(`
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
    documents_verified TEXT,
    metadata TEXT
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

// Auto-save to disk periodically and on changes
function saveToDisk() {
  try {
    const data = sqlDb.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  } catch (err) {
    console.error('[DB Save Error]:', err.message);
  }
}

// Save every 30 seconds
setInterval(saveToDisk, 30000);

// Graceful shutdown save
process.on('SIGTERM', () => { saveToDisk(); process.exit(0); });
process.on('SIGINT', () => { saveToDisk(); process.exit(0); });

/**
 * Compatibility wrapper to match better-sqlite3 API surface.
 * The API routes use db.prepare(sql) which returns { run(), get(), all() }.
 * This wrapper translates sql.js calls to that interface.
 */
const db = {
  prepare(sql) {
    return {
      // Run with named params (object like { refId: '...', ... }) or positional params
      run(...args) {
        if (args.length === 1 && typeof args[0] === 'object' && !Array.isArray(args[0])) {
          // Named parameters: convert @name to $name for sql.js
          const namedSql = sql.replace(/@(\w+)/g, '$$$1');
          const params = {};
          for (const [key, value] of Object.entries(args[0])) {
            params[`$${key}`] = value;
          }
          sqlDb.run(namedSql, params);
        } else {
          // Positional parameters
          sqlDb.run(sql, args);
        }
        saveToDisk();
        return { changes: sqlDb.getRowsModified() };
      },

      // Get single row
      get(...args) {
        const stmt = sqlDb.prepare(sql);
        if (args.length > 0) {
          stmt.bind(args);
        }
        if (stmt.step()) {
          const columns = stmt.getColumnNames();
          const values = stmt.get();
          stmt.free();
          const row = {};
          columns.forEach((col, i) => { row[col] = values[i]; });
          return row;
        }
        stmt.free();
        return undefined;
      },

      // Get all rows
      all(...args) {
        const results = [];
        const stmt = sqlDb.prepare(sql);
        if (args.length > 0) {
          stmt.bind(args);
        }
        while (stmt.step()) {
          const columns = stmt.getColumnNames();
          const values = stmt.get();
          const row = {};
          columns.forEach((col, i) => { row[col] = values[i]; });
          results.push(row);
        }
        stmt.free();
        return results;
      }
    };
  }
};

console.log(`[Database] sql.js (pure WASM) initialized at ${dbPath}`);

export { db };
