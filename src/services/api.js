// API Service Client communicating with UdyamSetu Government REST API Backend
const API_BASE = '/api';

export async function fetchSchemes(purpose) {
  const url = purpose ? `${API_BASE}/schemes?purpose=${purpose}` : `${API_BASE}/schemes`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch national schemes');
  return res.json();
}

export async function matchSchemesApi(profile) {
  const res = await fetch(`${API_BASE}/match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile)
  });
  if (!res.ok) throw new Error('Failed to run scheme matching');
  return res.json();
}

export async function fetchPartners(query = {}) {
  const params = new URLSearchParams(query).toString();
  const res = await fetch(`${API_BASE}/partners?${params}`);
  if (!res.ok) throw new Error('Failed to fetch partner directory');
  return res.json();
}

export async function savePassportApi(passportData) {
  const res = await fetch(`${API_BASE}/passports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(passportData)
  });
  if (!res.ok) throw new Error('Failed to persist passport to database');
  return res.json();
}

export async function fetchPassportApi(refId) {
  const res = await fetch(`${API_BASE}/passports/${refId}`);
  if (!res.ok) throw new Error('Passport token not found');
  return res.json();
}

export async function updatePassportStatusApi(refId, status, note) {
  const res = await fetch(`${API_BASE}/passports/${refId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, note })
  });
  if (!res.ok) throw new Error('Failed to update passport status');
  return res.json();
}

// 7. AI Agent: Autonomous Conversational Intake & Narrative Parsing
export async function processVoiceWithAgent(transcript, lang = 'hi-IN') {
  const res = await fetch(`${API_BASE}/ai/intake-agent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript, lang })
  });
  if (!res.ok) throw new Error('AI Intake Agent processing failed');
  return res.json();
}

// 8. AI Agent: Conversational Caseworker (Awaaz Sahayak)
export async function chatWithSahayak(message, history = [], profile = {}) {
  const res = await fetch(`${API_BASE}/ai/chat-agent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history, profile })
  });
  if (!res.ok) throw new Error('AI Caseworker conversation failed');
  return res.json();
}

// 9. AI Agent: Niyam Subsidy Stacking & Banker Dossier
export async function fetchStackedSubsidies(profile) {
  const res = await fetch(`${API_BASE}/ai/subsidy-stack`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile)
  });
  if (!res.ok) throw new Error('AI Subsidy Stacking calculation failed');
  return res.json();
}

// 10. AI Orchestrator: Multi-Agent Pipeline Run
export async function runOrchestratorApi(payload) {
  const res = await fetch(`${API_BASE}/orchestrate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('AI Orchestrator pipeline run failed');
  return res.json();
}

// 11. Funding Readiness Engine
export async function calculateReadinessApi(payload) {
  const res = await fetch(`${API_BASE}/readiness`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to calculate readiness score');
  return res.json();
}

// 12. Counterfactual / What-If Engine
export async function runCounterfactualApi(payload) {
  const res = await fetch(`${API_BASE}/counterfactual`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Counterfactual simulation failed');
  return res.json();
}

// 13. Citations & Provenance
export async function fetchCitationsApi(schemeId) {
  const url = schemeId ? `${API_BASE}/citations/${schemeId}` : `${API_BASE}/citations`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch citations');
  return res.json();
}

// 14. Benchmark & Regression Testing
export async function runBenchmarkApi() {
  const res = await fetch(`${API_BASE}/benchmark/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error('Failed to execute AI benchmark');
  return res.json();
}

// 15. Outcome Feedback Loop
export async function submitFeedbackApi(feedback) {
  const res = await fetch(`${API_BASE}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(feedback)
  });
  if (!res.ok) throw new Error('Failed to submit outcome feedback');
  return res.json();
}

export async function getCalibrationApi(schemeId) {
  const url = schemeId ? `${API_BASE}/feedback/calibration/${schemeId}` : `${API_BASE}/feedback/calibration`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch calibration metrics');
  return res.json();
}

export async function seedDemoFeedbackApi() {
  const res = await fetch(`${API_BASE}/feedback/seed-demo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error('Failed to seed demo feedback');
  return res.json();
}

// 16. Policy Change Intelligence
export async function checkPolicyStalenessApi(maxAge = 30) {
  const res = await fetch(`${API_BASE}/policy/stale?maxAge=${maxAge}`);
  if (!res.ok) throw new Error('Failed to check policy staleness');
  return res.json();
}

export async function fetchSchemeVersionsApi(schemeId) {
  const res = await fetch(`${API_BASE}/policy/versions/${schemeId}`);
  if (!res.ok) throw new Error('Failed to fetch scheme versions');
  return res.json();
}

export async function computePolicyDiffApi(oldScheme, newScheme) {
  const res = await fetch(`${API_BASE}/policy/diff`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ oldScheme, newScheme })
  });
  if (!res.ok) throw new Error('Failed to compute policy diff');
  return res.json();
}
