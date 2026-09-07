// API Service Client communicating with SAARTHI Government REST API Backend
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
