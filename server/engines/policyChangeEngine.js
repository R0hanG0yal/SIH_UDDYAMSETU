// =============================================================================
// UdyamSetu — Policy Change Intelligence Engine
// Detects, diffs, and propagates scheme policy updates.
// Version-controls every scheme rule set with SHA256 hashing.
// =============================================================================

import { evaluateNationalSchemes } from './eligibilityEngine.js';
import crypto from 'crypto';

/**
 * In-memory policy version store.
 * Each entry is a snapshot of a scheme's rules at a point in time.
 */
const policyVersions = [];
const changeImpacts = [];

/**
 * Compute a deterministic hash of a scheme's rule-relevant fields.
 */
export function computePolicyHash(scheme) {
  const ruleFields = {
    id: scheme.id,
    purpose: scheme.purpose,
    minCost: scheme.minCost,
    maxCost: scheme.maxCost,
    maxFundingPercent: scheme.maxFundingPercent,
    interestRatePercent: scheme.interestRatePercent,
    subsidyMatrix: scheme.subsidyMatrix || null,
    directSubsidyPercent: scheme.directSubsidyPercent || null,
    maxSubsidyAmount: scheme.maxSubsidyAmount || null,
    moratoriumMonths: scheme.moratoriumMonths,
    repaymentTenureYears: scheme.repaymentTenureYears,
    eligibilityRules: scheme.eligibilityRules || {},
  };
  const json = JSON.stringify(ruleFields, Object.keys(ruleFields).sort());
  return crypto.createHash('sha256').update(json).digest('hex').substring(0, 16);
}

/**
 * Snapshot the current state of a scheme as a version.
 */
export function createPolicyVersion(scheme, changedBy = 'system') {
  const hash = computePolicyHash(scheme);
  const existingVersions = policyVersions.filter(v => v.scheme_id === scheme.id);
  const versionNumber = existingVersions.length + 1;

  const version = {
    version_id: `PV-${scheme.id}-v${versionNumber}`,
    scheme_id: scheme.id,
    scheme_name: scheme.name,
    version_number: versionNumber,
    policy_hash: hash,
    snapshot: JSON.parse(JSON.stringify(scheme)),
    created_at: new Date().toISOString(),
    changed_by: changedBy,
  };

  policyVersions.push(version);
  return version;
}

/**
 * Get all versions for a given scheme, ordered by version number.
 */
export function getSchemeVersions(schemeId) {
  return policyVersions
    .filter(v => v.scheme_id === schemeId)
    .sort((a, b) => a.version_number - b.version_number);
}

/**
 * Compute a structured diff between two scheme snapshots.
 * Returns which fields changed, whether constraints tightened or relaxed,
 * and human-readable impact descriptions.
 */
export function computePolicyDiff(oldScheme, newScheme) {
  const changes = [];
  const fieldsToCompare = [
    { key: 'minCost', label: 'Minimum Project Cost', format: 'currency' },
    { key: 'maxCost', label: 'Maximum Project Cost', format: 'currency' },
    { key: 'maxFundingPercent', label: 'Maximum Funding %', format: 'percent' },
    { key: 'interestRatePercent', label: 'Interest Rate', format: 'percent' },
    { key: 'directSubsidyPercent', label: 'Direct Subsidy %', format: 'percent' },
    { key: 'maxSubsidyAmount', label: 'Max Subsidy Amount', format: 'currency' },
    { key: 'moratoriumMonths', label: 'Moratorium Period', format: 'months' },
    { key: 'repaymentTenureYears', label: 'Repayment Tenure', format: 'years' },
    { key: 'purpose', label: 'Purpose', format: 'text' },
  ];

  for (const field of fieldsToCompare) {
    const oldVal = oldScheme[field.key];
    const newVal = newScheme[field.key];

    if (oldVal === newVal) {
      changes.push({ field: field.key, label: field.label, was: oldVal, now: newVal, type: 'UNCHANGED' });
      continue;
    }

    if (oldVal === undefined && newVal !== undefined) {
      changes.push({
        field: field.key, label: field.label, was: null, now: newVal,
        type: 'ADDED',
        impact: `${field.label} added: ${formatFieldValue(newVal, field.format)}`,
      });
      continue;
    }

    // Determine if this is a relaxation or tightening
    let changeType = 'MODIFIED';
    if (typeof oldVal === 'number' && typeof newVal === 'number') {
      if (field.key === 'maxCost' || field.key === 'maxFundingPercent' ||
          field.key === 'maxSubsidyAmount' || field.key === 'moratoriumMonths' ||
          field.key === 'repaymentTenureYears' || field.key === 'directSubsidyPercent') {
        changeType = newVal > oldVal ? 'RELAXED' : 'TIGHTENED';
      }
      if (field.key === 'minCost' || field.key === 'interestRatePercent') {
        changeType = newVal < oldVal ? 'RELAXED' : 'TIGHTENED';
      }
    }

    changes.push({
      field: field.key,
      label: field.label,
      was: oldVal,
      now: newVal,
      type: changeType,
      impact: generateImpactDescription(field, oldVal, newVal, changeType),
    });
  }

  // Compare subsidy matrix if present
  if (oldScheme.subsidyMatrix || newScheme.subsidyMatrix) {
    const oldMatrix = oldScheme.subsidyMatrix || {};
    const newMatrix = newScheme.subsidyMatrix || {};
    for (const key of new Set([...Object.keys(oldMatrix), ...Object.keys(newMatrix)])) {
      if (oldMatrix[key] !== newMatrix[key]) {
        const changeType = (newMatrix[key] || 0) > (oldMatrix[key] || 0) ? 'RELAXED' : 'TIGHTENED';
        changes.push({
          field: `subsidyMatrix.${key}`,
          label: `Subsidy: ${key}`,
          was: oldMatrix[key],
          now: newMatrix[key],
          type: changeType,
          impact: `${key} subsidy ${changeType === 'RELAXED' ? 'increased' : 'decreased'}: ${oldMatrix[key] || 0}% → ${newMatrix[key] || 0}%`,
        });
      }
    }
  }

  const significantChanges = changes.filter(c => c.type !== 'UNCHANGED');

  return {
    scheme_id: newScheme.id || oldScheme.id,
    scheme_name: newScheme.name || oldScheme.name,
    total_fields_compared: changes.length,
    changes_detected: significantChanges.length,
    relaxations: significantChanges.filter(c => c.type === 'RELAXED').length,
    tightenings: significantChanges.filter(c => c.type === 'TIGHTENED').length,
    changes,
    significant_changes: significantChanges,
    old_hash: computePolicyHash(oldScheme),
    new_hash: computePolicyHash(newScheme),
    diffed_at: new Date().toISOString(),
  };
}

/**
 * Propagate a policy change: re-evaluate all saved profiles and detect
 * which profiles are affected (newly eligible, lost eligibility, etc.).
 */
export function propagatePolicyChange(schemeId, savedProfiles = []) {
  const impacts = [];

  for (const profile of savedProfiles) {
    const result = evaluateNationalSchemes(profile);
    const matchedIds = new Set((result.matchedSchemes || []).map(s => s.id));
    const wasMatched = profile._previousMatches?.includes(schemeId);
    const isNowMatched = matchedIds.has(schemeId);

    if (wasMatched && !isNowMatched) {
      impacts.push({
        profile_id: profile.applicantName || profile._id,
        scheme_id: schemeId,
        previous_status: 'ELIGIBLE',
        new_status: 'NOT_ELIGIBLE',
        change_type: 'LOST_ELIGIBILITY',
        notification: `⚠️ Policy update: You may no longer be eligible for this scheme. Please review updated requirements.`,
      });
    } else if (!wasMatched && isNowMatched) {
      impacts.push({
        profile_id: profile.applicantName || profile._id,
        scheme_id: schemeId,
        previous_status: 'NOT_ELIGIBLE',
        new_status: 'ELIGIBLE',
        change_type: 'GAINED_ELIGIBILITY',
        notification: `🟢 Good news! A policy update has made you eligible for a new scheme.`,
      });
    }
  }

  changeImpacts.push(...impacts);

  return {
    scheme_id: schemeId,
    profiles_evaluated: savedProfiles.length,
    impacts_detected: impacts.length,
    gained_eligibility: impacts.filter(i => i.change_type === 'GAINED_ELIGIBILITY').length,
    lost_eligibility: impacts.filter(i => i.change_type === 'LOST_ELIGIBILITY').length,
    impacts,
    propagated_at: new Date().toISOString(),
  };
}

/**
 * Check which schemes have stale verification dates (>30 days).
 */
export function checkStaleness(schemes, maxAgeDays = 30) {
  const now = Date.now();
  const stale = [];

  for (const scheme of schemes) {
    const lastVerified = scheme.last_verified_at || scheme.lastVerified;
    if (!lastVerified) {
      stale.push({
        scheme_id: scheme.id,
        scheme_name: scheme.name,
        last_verified: null,
        days_since: null,
        severity: 'CRITICAL',
        message: 'Scheme has never been verified against source document.',
      });
      continue;
    }

    const verifiedDate = new Date(lastVerified);
    const daysSince = Math.floor((now - verifiedDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSince > maxAgeDays) {
      stale.push({
        scheme_id: scheme.id,
        scheme_name: scheme.name,
        last_verified: lastVerified,
        days_since: daysSince,
        severity: daysSince > 90 ? 'CRITICAL' : daysSince > 60 ? 'HIGH' : 'MEDIUM',
        message: `Scheme not verified in ${daysSince} days. Please review against latest published guidelines.`,
      });
    }
  }

  return {
    total_checked: schemes.length,
    stale_count: stale.length,
    stale_schemes: stale.sort((a, b) => (b.days_since || 999) - (a.days_since || 999)),
    checked_at: new Date().toISOString(),
  };
}

/**
 * Get all recorded change impacts.
 */
export function getChangeImpacts(schemeId = null) {
  if (schemeId) return changeImpacts.filter(i => i.scheme_id === schemeId);
  return [...changeImpacts];
}

// Helpers
function formatFieldValue(value, format) {
  if (value === null || value === undefined) return 'N/A';
  if (format === 'currency') return `₹${Number(value).toLocaleString('en-IN')}`;
  if (format === 'percent') return `${value}%`;
  if (format === 'months') return `${value} months`;
  if (format === 'years') return `${value} years`;
  return String(value);
}

function generateImpactDescription(field, oldVal, newVal, changeType) {
  const label = field.label;
  const fmt = field.format;
  const old = formatFieldValue(oldVal, fmt);
  const nw = formatFieldValue(newVal, fmt);

  if (changeType === 'RELAXED') return `${label} relaxed: ${old} → ${nw}. More applicants may now qualify.`;
  if (changeType === 'TIGHTENED') return `${label} tightened: ${old} → ${nw}. Some applicants may lose eligibility.`;
  return `${label} changed: ${old} → ${nw}.`;
}
