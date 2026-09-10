import { Router } from 'express';
import { NATIONAL_SCHEMES } from '../data/nationalSchemes.js';
import { NATIONAL_PARTNERS } from '../data/partnerNetwork.js';
import { evaluateNationalSchemes } from '../engines/eligibilityEngine.js';
import { runAwaazIntakeAgent, runSubsidyOptimizerAgent, runConversationalSahayak } from '../engines/aiAgentEngine.js';
import { runOrchestrator } from '../engines/orchestrator.js';
import { calculateReadinessScore } from '../engines/readinessEngine.js';
import { runCounterfactual, COUNTERFACTUAL_PARAMS } from '../engines/counterfactualEngine.js';
import { groundWithCitations, SCHEME_SOURCES } from '../engines/ragCitationEngine.js';
import { runBenchmark, detectRegressions } from '../engines/benchmarkEngine.js';
import { recordFeedback, getFeedback, computeCalibration, getFullCalibrationReport, seedDemoFeedback } from '../engines/feedbackLoop.js';
import { computePolicyDiff, createPolicyVersion, getSchemeVersions, checkStaleness, propagatePolicyChange } from '../engines/policyChangeEngine.js';
import { db } from '../db/database.js';

const router = Router();

// Prepared SQLite statements
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

const getPassportStmt = db.prepare(`SELECT * FROM passports WHERE ref_id = ?`);
const listPassportsStmt = db.prepare(`SELECT * FROM passports ORDER BY timestamp DESC LIMIT 50`);
const updateStatusStmt = db.prepare(`UPDATE passports SET status = ?, metadata = ? WHERE ref_id = ?`);
const logEvaluationStmt = db.prepare(`
  INSERT INTO scheme_evaluations (
    applicant_name, sector, project_cost, annual_income,
    matched_schemes_count, top_scheme, timestamp
  ) VALUES (?, ?, ?, ?, ?, ?, ?)
`);

// =============================================================================
// 1. ORCHESTRATOR — Main Entry Point (runs full AI pipeline)
// =============================================================================
router.post('/orchestrate', async (req, res) => {
  try {
    const { profile, documents, partners, whatIf } = req.body || {};
    const result = await runOrchestrator(profile || req.body, {
      documents: documents || {},
      partners: partners || NATIONAL_PARTNERS,
      whatIf: whatIf || null,
    });
    res.json({ status: 'SUCCESS', ...result });
  } catch (err) {
    console.error('[Orchestrator Error]:', err);
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
});

// =============================================================================
// 2. SCHEMES — Fetch & filter national schemes
// =============================================================================
router.get('/schemes', (req, res) => {
  const { purpose, sector, search } = req.query;
  let list = [...NATIONAL_SCHEMES];
  if (purpose) list = list.filter(s => s.purpose === purpose);
  if (sector) list = list.filter(s => (s.sectors || []).some(sec => sec.toLowerCase().includes(sector.toLowerCase())));
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(s => s.name.toLowerCase().includes(q) || (s.nameHindi && s.nameHindi.includes(q)) || s.code.toLowerCase().includes(q));
  }
  res.json({ status: 'SUCCESS', count: list.length, schemes: list });
});

// =============================================================================
// 3. MATCH — Multi-scheme eligibility matching (deterministic)
// =============================================================================
router.post('/match', (req, res) => {
  const profile = req.body || {};
  const evaluation = evaluateNationalSchemes(profile);

  // Ground all matched schemes with citations
  if (evaluation.matchedSchemes) {
    evaluation.matchedSchemes = evaluation.matchedSchemes.map(s => groundWithCitations(s));
  }
  if (evaluation.nearFitSchemes) {
    evaluation.nearFitSchemes = evaluation.nearFitSchemes.map(s => groundWithCitations(s));
  }

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

  res.json({ status: 'SUCCESS', evaluation });
});

// =============================================================================
// 4. READINESS — Funding Readiness Score
// =============================================================================
router.post('/readiness', (req, res) => {
  try {
    const { profile, documents, partners } = req.body || {};
    const eligibility = evaluateNationalSchemes(profile || req.body);
    const readiness = calculateReadinessScore(
      profile || req.body,
      eligibility,
      documents || {},
      partners || NATIONAL_PARTNERS
    );
    res.json({ status: 'SUCCESS', readiness, eligibilitySummary: { matched: eligibility.totalMatched } });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
});

// =============================================================================
// 5. COUNTERFACTUAL — What-If Simulation
// =============================================================================
router.post('/counterfactual', (req, res) => {
  try {
    const { profile, changes, documents } = req.body || {};
    if (!changes || Object.keys(changes).length === 0) {
      return res.status(400).json({ status: 'ERROR', message: 'Provide at least one hypothetical change' });
    }
    const result = runCounterfactual(
      profile || req.body,
      changes,
      documents || {},
      NATIONAL_PARTNERS
    );
    res.json({ status: 'SUCCESS', ...result });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
});

router.get('/counterfactual/params', (req, res) => {
  res.json({ status: 'SUCCESS', params: COUNTERFACTUAL_PARAMS });
});

// =============================================================================
// 6. CITATIONS — Source-level provenance
// =============================================================================
router.get('/citations/:schemeId', (req, res) => {
  const source = SCHEME_SOURCES[req.params.schemeId];
  if (!source) {
    return res.status(404).json({ status: 'NOT_FOUND', message: 'No citation data for this scheme' });
  }
  res.json({ status: 'SUCCESS', scheme_id: req.params.schemeId, source });
});

router.get('/citations', (req, res) => {
  const allCitations = Object.entries(SCHEME_SOURCES).map(([id, source]) => ({
    scheme_id: id, document: source.document, url: source.url,
    provenance: source.provenance, lastVerified: source.lastVerified,
    constraintCount: Object.keys(source.constraints).length,
  }));
  res.json({ status: 'SUCCESS', count: allCitations.length, citations: allCitations });
});

// =============================================================================
// 7. BENCHMARK — AI Evaluation & Regression Testing
// =============================================================================
router.post('/benchmark/run', (req, res) => {
  try {
    const result = runBenchmark();
    res.json({ status: 'SUCCESS', benchmark: result });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
});

// =============================================================================
// 8. FEEDBACK — Outcome-Learning Loop
// =============================================================================
router.post('/feedback', (req, res) => {
  try {
    const entry = recordFeedback(req.body);
    res.status(201).json({ status: 'SUCCESS', feedback: entry });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
});

router.get('/feedback/calibration', (req, res) => {
  try {
    const report = getFullCalibrationReport();
    res.json({ status: 'SUCCESS', calibration: report });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
});

router.get('/feedback/calibration/:schemeId', (req, res) => {
  try {
    const result = computeCalibration(req.params.schemeId);
    res.json({ status: 'SUCCESS', calibration: result });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
});

router.post('/feedback/seed-demo', (req, res) => {
  seedDemoFeedback();
  res.json({ status: 'SUCCESS', message: 'Demo feedback data seeded for calibration demonstration' });
});

// =============================================================================
// 9. POLICY — Policy Change Intelligence
// =============================================================================
router.get('/policy/stale', (req, res) => {
  const maxAge = Number(req.query.maxAge) || 30;
  const schemesWithDates = NATIONAL_SCHEMES.map(s => ({
    ...s,
    last_verified_at: SCHEME_SOURCES[s.id]?.lastVerified || null,
  }));
  const result = checkStaleness(schemesWithDates, maxAge);
  res.json({ status: 'SUCCESS', ...result });
});

router.get('/policy/versions/:schemeId', (req, res) => {
  const versions = getSchemeVersions(req.params.schemeId);
  res.json({ status: 'SUCCESS', scheme_id: req.params.schemeId, versions });
});

router.post('/policy/diff', (req, res) => {
  try {
    const { oldScheme, newScheme } = req.body;
    if (!oldScheme || !newScheme) {
      return res.status(400).json({ status: 'ERROR', message: 'Both oldScheme and newScheme required' });
    }
    const diff = computePolicyDiff(oldScheme, newScheme);
    res.json({ status: 'SUCCESS', diff });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
});

// =============================================================================
// 10. PARTNERS — Channel partner directory
// =============================================================================
router.get('/partners', (req, res) => {
  const { district, status, schemeId } = req.query;
  let results = [...NATIONAL_PARTNERS];
  if (district) results = results.filter(p => p.district.toLowerCase() === district.toLowerCase());
  if (status && status !== 'all') results = results.filter(p => p.intakeStatus === status);
  if (schemeId) results = results.filter(p => !p.supportedSchemes || p.supportedSchemes.includes(schemeId));
  res.json({ status: 'SUCCESS', count: results.length, partners: results });
});

// =============================================================================
// 11. PASSPORTS — QR Loan Fit Passport CRUD
// =============================================================================
router.post('/passports', (req, res) => {
  const data = req.body || {};
  const refId = data.refId || `UDYAMSETU-${Math.floor(100000 + Math.random() * 900000)}`;
  const timestamp = data.timestamp || new Date().toISOString();
  const record = {
    refId, timestamp,
    policyVersion: data.policyVersion || 'UDYAMSETU-2026.01',
    beneficiaryName: (data.beneficiaryName || 'Verified Citizen').trim(),
    category: data.category || 'Universal Citizen',
    gender: data.gender || 'female',
    district: data.district || 'Lucknow',
    state: data.state || 'Uttar Pradesh',
    primaryScheme: data.primaryScheme || "PMEGP",
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
    metadata: JSON.stringify({ auditTrail: [{ action: 'CREATED', timestamp, note: 'Passport generated via UdyamSetu' }] })
  };
  try {
    insertPassportStmt.run(record);
    res.status(201).json({ status: 'SUCCESS', refId, passport: record, persisted: true });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
});

router.get('/passports', (req, res) => {
  try {
    const list = listPassportsStmt.all();
    res.json({ status: 'SUCCESS', count: list.length, passports: list.map(row => ({ ...row, documentsVerified: JSON.parse(row.documents_verified || '[]'), metadata: JSON.parse(row.metadata || '{}') })) });
  } catch (err) { res.status(500).json({ status: 'ERROR', message: err.message }); }
});

router.get('/passports/:id', (req, res) => {
  try {
    const row = getPassportStmt.get(req.params.id);
    if (!row) return res.status(404).json({ status: 'NOT_FOUND', message: `Passport ${req.params.id} not found` });
    res.json({ status: 'SUCCESS', passport: { refId: row.ref_id, timestamp: row.timestamp, policyVersion: row.policy_version, beneficiaryName: row.beneficiary_name, category: row.category, gender: row.gender, district: row.district, state: row.state, primaryScheme: row.primary_scheme, schemeCode: row.scheme_code, projectCost: row.project_cost, eligibleLoan: row.eligible_loan, ownEquity: row.own_equity, governmentSubsidyAmount: row.government_subsidy_amount, effectiveInterestRate: row.effective_interest_rate, partnerId: row.partner_id, partnerName: row.partner_name, branch: row.branch, status: row.status, documentsVerified: JSON.parse(row.documents_verified || '[]'), metadata: JSON.parse(row.metadata || '{}') } });
  } catch (err) { res.status(500).json({ status: 'ERROR', message: err.message }); }
});

router.patch('/passports/:id/status', (req, res) => {
  try {
    const row = getPassportStmt.get(req.params.id);
    if (!row) return res.status(404).json({ status: 'NOT_FOUND' });
    const { status, note } = req.body;
    const meta = JSON.parse(row.metadata || '{"auditTrail":[]}');
    if (!meta.auditTrail) meta.auditTrail = [];
    meta.auditTrail.push({ action: 'STATUS_UPDATED', status, timestamp: new Date().toISOString(), note: note || `Advanced to ${status}` });
    updateStatusStmt.run(status, JSON.stringify(meta), req.params.id);
    res.json({ status: 'SUCCESS', refId: req.params.id, updatedStatus: status });
  } catch (err) { res.status(500).json({ status: 'ERROR', message: err.message }); }
});

// =============================================================================
// 12. AI AGENTS — Conversational & Intake
// =============================================================================
router.post('/ai/intake-agent', async (req, res) => {
  try {
    const { transcript, lang } = req.body || {};
    if (!transcript) return res.status(400).json({ status: 'ERROR', message: 'Transcript required' });
    const result = await runAwaazIntakeAgent(transcript, lang || 'hi-IN');
    res.json({ status: 'SUCCESS', ...result });
  } catch (err) { res.status(500).json({ status: 'ERROR', message: err.message }); }
});

router.post('/ai/chat-agent', async (req, res) => {
  try {
    const { message, history, profile } = req.body || {};
    if (!message) return res.status(400).json({ status: 'ERROR', message: 'Message required' });
    const result = await runConversationalSahayak(message, history || [], profile || {});
    res.json({ status: 'SUCCESS', ...result });
  } catch (err) { res.status(500).json({ status: 'ERROR', message: err.message }); }
});

router.post('/ai/subsidy-stack', (req, res) => {
  try {
    const result = runSubsidyOptimizerAgent(req.body || {});
    res.json(result);
  } catch (err) { res.status(500).json({ status: 'ERROR', message: err.message }); }
});

// =============================================================================
// 13. HEALTH — Diagnostics & Database Stats
// =============================================================================
router.get('/health', (req, res) => {
  try {
    const countRow = db.prepare('SELECT COUNT(*) as count FROM passports').get();
    const evalCountRow = db.prepare('SELECT COUNT(*) as count FROM scheme_evaluations').get();
    res.json({
      status: 'UP',
      system: 'UdyamSetu — AI Funding Navigator',
      version: '3.0.0-intelligence-core',
      database: 'SQLite (WASM)',
      engines: {
        orchestrator: '✅', eligibility: '✅', readiness: '✅',
        counterfactual: '✅', ragCitations: '✅', benchmark: '✅',
        feedbackLoop: '✅', policyChange: '✅', aiAgent: '✅',
      },
      activeSchemesCount: NATIONAL_SCHEMES.length,
      activePartnersCount: NATIONAL_PARTNERS.length,
      persistedPassportsCount: countRow?.count || 0,
      totalEvaluationsLogged: evalCountRow?.count || 0,
      uptimeSeconds: process.uptime(),
    });
  } catch (err) {
    res.json({ status: 'UP', system: 'UdyamSetu', error: err.message });
  }
});

export default router;
