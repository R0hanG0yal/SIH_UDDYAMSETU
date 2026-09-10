// =============================================================================
// UdyamSetu — Counterfactual / What-If Simulation Engine
// "What would change if I registered under Udyam?"
// "What if my project cost was ₹5L instead of ₹3L?"
// Re-runs eligibility engine with hypothetical profile changes,
// computes structured diffs, and generates human-readable explanations.
// =============================================================================

import { evaluateNationalSchemes } from './eligibilityEngine.js';
import { calculateReadinessScore } from './readinessEngine.js';

/**
 * Supported counterfactual changes
 */
export const COUNTERFACTUAL_PARAMS = {
  projectCost: {
    label: 'Project Cost',
    type: 'slider',
    min: 10000,
    max: 10000000,
    step: 10000,
    format: 'currency',
  },
  annualIncome: {
    label: 'Annual Family Income',
    type: 'slider',
    min: 50000,
    max: 1000000,
    step: 10000,
    format: 'currency',
  },
  socialCategory: {
    label: 'Social Category',
    type: 'dropdown',
    options: ['General', 'SC', 'ST', 'OBC', 'Minority'],
  },
  gender: {
    label: 'Beneficiary Gender',
    type: 'toggle',
    options: ['female', 'male'],
  },
  isRural: {
    label: 'Project Location',
    type: 'toggle',
    options: [true, false],
    labels: ['Rural / Gram Panchayat', 'Urban / Municipal'],
  },
  purpose: {
    label: 'Loan Purpose',
    type: 'dropdown',
    options: ['business', 'education'],
  },
  hasUdyamRegistration: {
    label: 'Udyam Registration',
    type: 'toggle',
    options: [true, false],
  },
  categoryName: {
    label: 'Business Sector',
    type: 'text',
    placeholder: 'e.g. Tailoring, Food Processing, Furniture...',
  },
};

/**
 * Run a counterfactual simulation.
 *
 * @param {Object} currentProfile - The current entrepreneur profile
 * @param {Object} hypotheticalChanges - Key-value pairs of proposed changes
 * @param {Object} currentDocuments - Current document availability
 * @param {Array} partners - Available partners
 * @returns {Object} Structured diff with explanations
 */
export function runCounterfactual(currentProfile, hypotheticalChanges, currentDocuments = {}, partners = []) {
  const startTime = Date.now();

  // Build the hypothetical profile
  const hypotheticalProfile = { ...currentProfile };
  const appliedChanges = [];

  for (const [key, newValue] of Object.entries(hypotheticalChanges)) {
    const oldValue = currentProfile[key];
    if (oldValue !== newValue) {
      hypotheticalProfile[key] = newValue;

      // Auto-sync derived fields
      if (key === 'socialCategory') {
        hypotheticalProfile.isSC = newValue === 'SC';
        hypotheticalProfile.isST = newValue === 'ST';
        hypotheticalProfile.isOBC = newValue === 'OBC';
        hypotheticalProfile.isMinority = newValue === 'Minority';
      }

      appliedChanges.push({
        field: key,
        label: COUNTERFACTUAL_PARAMS[key]?.label || key,
        from: formatValue(key, oldValue),
        to: formatValue(key, newValue),
        fromRaw: oldValue,
        toRaw: newValue,
      });
    }
  }

  if (appliedChanges.length === 0) {
    return {
      status: 'NO_CHANGES',
      message: 'No hypothetical changes detected. Modify at least one parameter.',
      executionTimeMs: Date.now() - startTime,
    };
  }

  // Run eligibility engine on both profiles
  const currentResult = evaluateNationalSchemes(currentProfile);
  const hypotheticalResult = evaluateNationalSchemes(hypotheticalProfile);

  // Run readiness engine on both
  const currentReadiness = calculateReadinessScore(currentProfile, currentResult, currentDocuments, partners);
  const hypotheticalReadiness = calculateReadinessScore(hypotheticalProfile, hypotheticalResult, currentDocuments, partners);

  // Compute scheme-level diff
  const currentMatchIds = new Set((currentResult.matchedSchemes || []).map(s => s.id));
  const hypotheticalMatchIds = new Set((hypotheticalResult.matchedSchemes || []).map(s => s.id));

  const newlyEligible = (hypotheticalResult.matchedSchemes || []).filter(s => !currentMatchIds.has(s.id));
  const lostEligibility = (currentResult.matchedSchemes || []).filter(s => !hypotheticalMatchIds.has(s.id));
  const unchanged = (hypotheticalResult.matchedSchemes || []).filter(s => currentMatchIds.has(s.id));

  // Compute financial diff for unchanged schemes
  const financialChanges = [];
  for (const scheme of unchanged) {
    const currentScheme = currentResult.matchedSchemes.find(s => s.id === scheme.id);
    if (!currentScheme) continue;

    const subsidyDiff = (scheme.directSubsidyAmount || 0) - (currentScheme.directSubsidyAmount || 0);
    const interestDiff = (scheme.effectiveInterestRate || 0) - (currentScheme.effectiveInterestRate || 0);
    const fundingDiff = (scheme.eligibleFunding || 0) - (currentScheme.eligibleFunding || 0);

    if (subsidyDiff !== 0 || interestDiff !== 0 || fundingDiff !== 0) {
      financialChanges.push({
        schemeId: scheme.id,
        schemeName: scheme.name,
        subsidyBefore: currentScheme.directSubsidyAmount || 0,
        subsidyAfter: scheme.directSubsidyAmount || 0,
        subsidyDiff,
        interestBefore: currentScheme.effectiveInterestRate || 0,
        interestAfter: scheme.effectiveInterestRate || 0,
        interestDiff,
        fundingBefore: currentScheme.eligibleFunding || 0,
        fundingAfter: scheme.eligibleFunding || 0,
        fundingDiff,
      });
    }
  }

  // Generate human-readable explanations
  const explanations = [];

  if (newlyEligible.length > 0) {
    explanations.push({
      type: 'POSITIVE',
      icon: '🟢',
      headline: `${newlyEligible.length} new scheme(s) become available`,
      detail: newlyEligible.map(s => `**${s.name}**: ${s.summary || ''}`).join('\n'),
      schemes: newlyEligible.map(s => ({ id: s.id, name: s.name })),
    });
  }

  if (lostEligibility.length > 0) {
    explanations.push({
      type: 'NEGATIVE',
      icon: '🔴',
      headline: `${lostEligibility.length} scheme(s) would no longer match`,
      detail: lostEligibility.map(s => {
        const reasons = s.failedRules || [];
        return `**${s.name}**: ${reasons[0] || 'Eligibility criteria no longer met'}`;
      }).join('\n'),
      schemes: lostEligibility.map(s => ({ id: s.id, name: s.name })),
    });
  }

  for (const fc of financialChanges) {
    if (fc.subsidyDiff > 0) {
      explanations.push({
        type: 'POSITIVE',
        icon: '💰',
        headline: `${fc.schemeName}: Subsidy increases by ₹${fc.subsidyDiff.toLocaleString('en-IN')}`,
        detail: `From ₹${fc.subsidyBefore.toLocaleString('en-IN')} → ₹${fc.subsidyAfter.toLocaleString('en-IN')}`,
      });
    } else if (fc.subsidyDiff < 0) {
      explanations.push({
        type: 'NEGATIVE',
        icon: '📉',
        headline: `${fc.schemeName}: Subsidy decreases by ₹${Math.abs(fc.subsidyDiff).toLocaleString('en-IN')}`,
        detail: `From ₹${fc.subsidyBefore.toLocaleString('en-IN')} → ₹${fc.subsidyAfter.toLocaleString('en-IN')}`,
      });
    }

    if (fc.interestDiff < 0) {
      explanations.push({
        type: 'POSITIVE',
        icon: '📈',
        headline: `${fc.schemeName}: Interest rate drops to ${fc.interestAfter}%`,
        detail: `From ${fc.interestBefore}% → ${fc.interestAfter}%`,
      });
    }
  }

  const readinessDiff = hypotheticalReadiness.score - currentReadiness.score;
  if (readinessDiff !== 0) {
    explanations.push({
      type: readinessDiff > 0 ? 'POSITIVE' : 'NEGATIVE',
      icon: readinessDiff > 0 ? '⬆️' : '⬇️',
      headline: `Readiness Score: ${currentReadiness.score} → ${hypotheticalReadiness.score} (${readinessDiff > 0 ? '+' : ''}${readinessDiff})`,
      detail: `Tier: ${currentReadiness.tier.label} → ${hypotheticalReadiness.tier.label}`,
    });
  }

  return {
    status: 'SUCCESS',
    appliedChanges,
    current: {
      matchedCount: currentResult.matchedSchemes?.length || 0,
      totalSubsidy: sumSubsidies(currentResult.matchedSchemes),
      readinessScore: currentReadiness.score,
      readinessTier: currentReadiness.tier,
    },
    hypothetical: {
      matchedCount: hypotheticalResult.matchedSchemes?.length || 0,
      totalSubsidy: sumSubsidies(hypotheticalResult.matchedSchemes),
      readinessScore: hypotheticalReadiness.score,
      readinessTier: hypotheticalReadiness.tier,
    },
    diff: {
      newlyEligible,
      lostEligibility,
      unchanged: unchanged.length,
      financialChanges,
      readinessDiff,
      matchCountDiff: (hypotheticalResult.matchedSchemes?.length || 0) - (currentResult.matchedSchemes?.length || 0),
      subsidyDiff: sumSubsidies(hypotheticalResult.matchedSchemes) - sumSubsidies(currentResult.matchedSchemes),
    },
    explanations,
    currentFullResult: currentResult,
    hypotheticalFullResult: hypotheticalResult,
    currentReadiness,
    hypotheticalReadiness,
    executionTimeMs: Date.now() - startTime,
    simulatedAt: new Date().toISOString(),
  };
}

// =============================================================================
// Helpers
// =============================================================================

function sumSubsidies(schemes) {
  if (!schemes) return 0;
  return schemes.reduce((sum, s) => sum + (s.directSubsidyAmount || 0), 0);
}

function formatValue(key, value) {
  if (value === undefined || value === null) return 'Not set';
  if (key === 'projectCost' || key === 'annualIncome') {
    return `₹${Number(value).toLocaleString('en-IN')}`;
  }
  if (key === 'isRural') return value ? 'Rural' : 'Urban';
  if (key === 'hasUdyamRegistration') return value ? 'Yes' : 'No';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
}
