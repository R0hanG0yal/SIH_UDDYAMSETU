import { Router } from 'express';
import { NATIONAL_SCHEMES } from '../data/nationalSchemes.js';
import { NATIONAL_PARTNERS } from '../data/partnerNetwork.js';
import { evaluateNationalSchemes } from '../engines/eligibilityEngine.js';
import { db } from '../db/database.js';

const router = Router();

// Prepared SQLite statements for high performance & ACID persistence
const insertPassportStmt = db.prepare(`
  INSERT OR REPLACE INTO passports (
    ref_id, timestamp, policy_version, beneficiary_name, category, gender,
    district, state, primary_scheme, scheme_code, project_cost, eligible_loan,
    own_equity, government_subsidy_amount, effective_interest_rate, partner_id,
    partner_name, branch, status, documents_verified, metadata
  ) VALUES (
    @refId, @timestamp, @policyVersion, @beneficiaryName, @category, @gender,
    @district, @state, @primaryScheme, @schemeCode, @projectCost, @eligibleLoan,
    @ownEquity, @governmentSubsidyAmount, @effectiveInterestRate, @partnerId,
    @partnerName, @branch, @status, @documentsVerified, @metadata
  )
`);

const getPassportStmt = db.prepare(`
  SELECT * FROM passports WHERE ref_id = ?
`);

const listPassportsStmt = db.prepare(`
  SELECT * FROM passports ORDER BY timestamp DESC LIMIT 50
`);

const updateStatusStmt = db.prepare(`
  UPDATE passports SET status = ?, metadata = ? WHERE ref_id = ?
`);

const logEvaluationStmt = db.prepare(`
  INSERT INTO scheme_evaluations (
    applicant_name, sector, project_cost, annual_income,
    matched_schemes_count, top_scheme, timestamp
  ) VALUES (?, ?, ?, ?, ?, ?, ?)
`);

// 1. GET /api/schemes - Fetch national schemes with sector / category filtering
router.get('/schemes', (req, res) => {
  const { purpose, sector, search } = req.query;
  let list = [...NATIONAL_SCHEMES];

  if (purpose) {
    list = list.filter(s => s.purpose === purpose);
  }
  if (sector) {
    list = list.filter(s => (s.sectors || []).some(sec => sec.toLowerCase().includes(sector.toLowerCase())));
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(s => s.name.toLowerCase().includes(q) || (s.nameHindi && s.nameHindi.includes(q)) || s.code.toLowerCase().includes(q));
  }

  res.json({
    status: 'SUCCESS',
    count: list.length,
    schemes: list
  });
});

// 2. POST /api/match - Multi-scheme matching & Bridge to Eligibility roadmap
router.post('/match', (req, res) => {
  const profile = req.body || {};
  const evaluation = evaluateNationalSchemes(profile);

  // Asynchronously log to SQLite database
  try {
    logEvaluationStmt.run(
      profile.applicantName || 'Anonymous',
      profile.categoryName || 'General',
      Number(profile.projectCost) || 0,
      Number(profile.annualIncome) || 0,
      evaluation.totalMatched,
      evaluation.matchedSchemes?.[0]?.name || 'None',
      new Date().toISOString()
    );
  } catch (err) {
    console.error('[DB Evaluation Log Error]:', err.message);
  }

  res.json({
    status: 'SUCCESS',
    evaluation
  });
});

// 3. GET /api/partners - Channel partners & bank branches
router.get('/partners', (req, res) => {
  const { district, status, schemeId } = req.query;
  let results = [...NATIONAL_PARTNERS];

  if (district) {
    results = results.filter(p => p.district.toLowerCase() === district.toLowerCase());
  }
  if (status && status !== 'all') {
    results = results.filter(p => p.intakeStatus === status);
  }
  if (schemeId) {
    results = results.filter(p => !p.supportedSchemes || p.supportedSchemes.includes(schemeId));
  }

  res.json({
    status: 'SUCCESS',
    count: results.length,
    partners: results
  });
});

// 4. POST /api/passports - Create and persist official QR Loan Fit Passport to SQLite
router.post('/passports', (req, res) => {
  const data = req.body || {};
  const refId = data.refId || `SAARTHI-GOI-${Math.floor(100000 + Math.random() * 900000)}`;
  const timestamp = data.timestamp || new Date().toISOString();

  const record = {
    refId,
    timestamp,
    policyVersion: data.policyVersion || 'GOI-CREDIT-2026.02',
    beneficiaryName: (data.beneficiaryName || 'Verified Citizen').trim(),
    category: data.category || 'Universal Citizen',
    gender: data.gender || 'female',
    district: data.district || 'Lucknow',
    state: data.state || 'Uttar Pradesh',
    primaryScheme: data.primaryScheme || "Prime Minister's Employment Generation Programme (PMEGP)",
    schemeCode: data.schemeCode || 'PMEGP-01',
    projectCost: Number(data.projectCost) || 100000,
    eligibleLoan: Number(data.eligibleLoan) || 90000,
    ownEquity: Number(data.ownEquity) || 10000,
    governmentSubsidyAmount: Number(data.governmentSubsidyAmount) || 0,
    effectiveInterestRate: Number(data.effectiveInterestRate) || 8.5,
    partnerId: data.partnerId || 'PARTNER-SBI-01',
    partnerName: data.partnerName || 'State Bank of India',
    branch: data.branch || 'SME Hub',
    status: data.status || 'received',
    documentsVerified: JSON.stringify(data.documentsVerified || []),
    metadata: JSON.stringify({
      auditTrail: [
        { action: 'CREATED', timestamp, note: 'Passport generated and saved to persistent SQLite database' }
      ]
    })
  };

  try {
    insertPassportStmt.run(record);
    res.status(201).json({
      status: 'SUCCESS',
      refId,
      passport: record,
      persisted: true
    });
  } catch (err) {
    console.error('[DB Insert Error]:', err.message);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to persist passport to SQLite database: ' + err.message
    });
  }
});

// 5. GET /api/passports - List all saved passports
router.get('/passports', (req, res) => {
  try {
    const list = listPassportsStmt.all();
    res.json({
      status: 'SUCCESS',
      count: list.length,
      passports: list.map(row => ({
        ...row,
        documentsVerified: JSON.parse(row.documents_verified || '[]'),
        metadata: JSON.parse(row.metadata || '{}')
      }))
    });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
});

// 6. GET /api/passports/:id - Retrieve and verify passport from SQLite
router.get('/passports/:id', (req, res) => {
  const { id } = req.params;

  try {
    const row = getPassportStmt.get(id);

    if (!row) {
      return res.status(404).json({
        status: 'NOT_FOUND',
        message: `No active passport record found in SQLite database with reference token ${id}.`
      });
    }

    res.json({
      status: 'SUCCESS',
      passport: {
        refId: row.ref_id,
        timestamp: row.timestamp,
        policyVersion: row.policy_version,
        beneficiaryName: row.beneficiary_name,
        category: row.category,
        gender: row.gender,
        district: row.district,
        state: row.state,
        primaryScheme: row.primary_scheme,
        schemeCode: row.scheme_code,
        projectCost: row.project_cost,
        eligibleLoan: row.eligible_loan,
        ownEquity: row.own_equity,
        governmentSubsidyAmount: row.government_subsidy_amount,
        effectiveInterestRate: row.effective_interest_rate,
        partnerId: row.partner_id,
        partnerName: row.partner_name,
        branch: row.branch,
        status: row.status,
        documentsVerified: JSON.parse(row.documents_verified || '[]'),
        metadata: JSON.parse(row.metadata || '{}')
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
});

// 7. PATCH /api/passports/:id/status - Update application lifecycle stage in SQLite
router.patch('/passports/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, note } = req.body;

  try {
    const row = getPassportStmt.get(id);
    if (!row) {
      return res.status(404).json({
        status: 'NOT_FOUND',
        message: `Passport ${id} not found in database.`
      });
    }

    const meta = JSON.parse(row.metadata || '{"auditTrail":[]}');
    if (!meta.auditTrail) meta.auditTrail = [];
    meta.auditTrail.push({
      action: 'STATUS_UPDATED',
      status,
      timestamp: new Date().toISOString(),
      note: note || `Application advanced to ${status} via Officer Terminal`
    });

    updateStatusStmt.run(status, JSON.stringify(meta), id);

    res.json({
      status: 'SUCCESS',
      refId: id,
      updatedStatus: status
    });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
});

// 8. GET /api/health - Diagnostics & Database Stats
router.get('/health', (req, res) => {
  try {
    const countRow = db.prepare('SELECT COUNT(*) as count FROM passports').get();
    const evalCountRow = db.prepare('SELECT COUNT(*) as count FROM scheme_evaluations').get();

    res.json({
      status: 'UP',
      system: 'SAARTHI National Credit Gateway',
      version: '2.5.0-sqlite-persistent',
      database: 'SQLite (WAL Mode Active)',
      activeSchemesCount: NATIONAL_SCHEMES.length,
      activePartnersCount: NATIONAL_PARTNERS.length,
      persistedPassportsCount: countRow.count,
      totalEvaluationsLogged: evalCountRow.count,
      uptimeSeconds: process.uptime()
    });
  } catch (err) {
    res.json({
      status: 'UP',
      system: 'SAARTHI National Credit Gateway',
      error: err.message
    });
  }
});

export default router;
