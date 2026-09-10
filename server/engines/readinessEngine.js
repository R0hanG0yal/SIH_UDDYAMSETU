// =============================================================================
// UdyamSetu — Funding Readiness Score Engine
// Transparent weighted model: every component is visible to the user.
// Score = weighted sum of 6 dimensions, each scored 0-100.
// =============================================================================

/**
 * Readiness dimensions and their weights.
 * These weights are configurable via admin panel.
 */
export const READINESS_WEIGHTS = {
  profileCompleteness: { weight: 0.15, label: 'Profile Completeness', icon: '👤' },
  businessFormalization: { weight: 0.20, label: 'Business Formalization', icon: '🏢' },
  documentReadiness: { weight: 0.20, label: 'Document Readiness', icon: '📄' },
  eligibilityCoverage: { weight: 0.20, label: 'Eligibility Coverage', icon: '✅' },
  financialClarity: { weight: 0.10, label: 'Financial Clarity', icon: '💰' },
  partnerAccessibility: { weight: 0.15, label: 'Partner Accessibility', icon: '🏦' },
};

/**
 * Profile fields required for completeness scoring.
 */
const REQUIRED_PROFILE_FIELDS = [
  'applicantName', 'gender', 'socialCategory', 'purpose',
  'categoryName', 'projectCost', 'annualIncome', 'state', 'district',
];

const OPTIONAL_PROFILE_FIELDS = [
  'isPWD', 'isExServiceperson', 'isRural', 'phoneNumber', 'email',
  'dateOfBirth', 'educationLevel', 'yearsInBusiness',
];

/**
 * Business formalization documents/registrations.
 */
const FORMALIZATION_ITEMS = [
  { key: 'hasUdyamRegistration', label: 'Udyam Registration', weight: 0.35 },
  { key: 'hasGSTRegistration', label: 'GST Registration', weight: 0.20 },
  { key: 'hasPAN', label: 'PAN Card / Business PAN', weight: 0.20 },
  { key: 'hasBankAccount', label: 'Business Bank Account', weight: 0.15 },
  { key: 'hasFSSAI', label: 'FSSAI License (food only)', weight: 0.10, conditional: 'food' },
];

/**
 * Calculate the Funding Readiness Score for a given profile and context.
 *
 * @param {Object} profile - Entrepreneur profile data
 * @param {Object} eligibilityResult - Result from eligibility engine
 * @param {Object} documents - Document availability state
 * @param {Object} partners - Available partners in user's geography
 * @returns {Object} Readiness score with decomposition
 */
export function calculateReadinessScore(profile, eligibilityResult, documents = {}, partners = []) {
  const dimensions = {};
  const actions = [];

  // 1. Profile Completeness (0-100)
  const profileScore = calculateProfileCompleteness(profile);
  dimensions.profileCompleteness = {
    score: profileScore.score,
    details: profileScore.details,
    missing: profileScore.missing,
  };
  if (profileScore.missing.length > 0) {
    actions.push({
      dimension: 'profileCompleteness',
      priority: profileScore.missing.length > 3 ? 'HIGH' : 'MEDIUM',
      action: `Complete ${profileScore.missing.length} missing profile field(s): ${profileScore.missing.slice(0, 3).join(', ')}`,
      impact: `+${Math.round(profileScore.potential - profileScore.score)} readiness points`,
      impactValue: profileScore.potential - profileScore.score,
      effort: 'LOW',
      timeEstimate: '5 minutes',
    });
  }

  // 2. Business Formalization (0-100)
  const bizScore = calculateBusinessFormalization(profile);
  dimensions.businessFormalization = {
    score: bizScore.score,
    details: bizScore.details,
    missing: bizScore.missing,
  };
  for (const m of bizScore.missing) {
    actions.push({
      dimension: 'businessFormalization',
      priority: m.weight >= 0.30 ? 'HIGH' : 'MEDIUM',
      action: `Obtain ${m.label}`,
      impact: `+${Math.round(m.weight * 100 * READINESS_WEIGHTS.businessFormalization.weight)} readiness points`,
      impactValue: m.weight * 100 * READINESS_WEIGHTS.businessFormalization.weight,
      effort: m.key === 'hasUdyamRegistration' ? 'LOW' : 'MEDIUM',
      timeEstimate: m.key === 'hasUdyamRegistration' ? '10 minutes (free online at udyamregistration.gov.in)' : '1-3 days',
      externalLink: m.key === 'hasUdyamRegistration' ? 'https://udyamregistration.gov.in' : null,
    });
  }

  // 3. Document Readiness (0-100)
  const docScore = calculateDocumentReadiness(documents, eligibilityResult);
  dimensions.documentReadiness = {
    score: docScore.score,
    details: docScore.details,
    missing: docScore.missing,
  };
  if (docScore.missing.length > 0) {
    actions.push({
      dimension: 'documentReadiness',
      priority: 'HIGH',
      action: `Prepare ${docScore.missing.length} required document(s): ${docScore.missing.slice(0, 3).map(d => d.label).join(', ')}`,
      impact: `+${Math.round(docScore.potential - docScore.score)} readiness points`,
      impactValue: docScore.potential - docScore.score,
      effort: 'MEDIUM',
      timeEstimate: '1-7 days depending on document type',
    });
  }

  // 4. Eligibility Coverage (0-100)
  const eligScore = calculateEligibilityCoverage(eligibilityResult);
  dimensions.eligibilityCoverage = {
    score: eligScore.score,
    details: eligScore.details,
  };

  // 5. Financial Clarity (0-100)
  const finScore = calculateFinancialClarity(profile);
  dimensions.financialClarity = {
    score: finScore.score,
    details: finScore.details,
    missing: finScore.missing,
  };
  if (finScore.missing.length > 0) {
    actions.push({
      dimension: 'financialClarity',
      priority: 'MEDIUM',
      action: `Clarify financial details: ${finScore.missing.join(', ')}`,
      impact: `+${Math.round(finScore.potential - finScore.score)} readiness points`,
      impactValue: finScore.potential - finScore.score,
      effort: 'LOW',
      timeEstimate: '5 minutes',
    });
  }

  // 6. Partner Accessibility (0-100)
  const partnerScore = calculatePartnerAccessibility(partners, profile);
  dimensions.partnerAccessibility = {
    score: partnerScore.score,
    details: partnerScore.details,
  };

  // Compute weighted total
  let totalScore = 0;
  for (const [key, dim] of Object.entries(dimensions)) {
    totalScore += dim.score * READINESS_WEIGHTS[key].weight;
  }
  totalScore = Math.round(totalScore);

  // Compute projected score after completing all actions
  let projectedScore = totalScore;
  for (const action of actions) {
    projectedScore += action.impactValue || 0;
  }
  projectedScore = Math.min(100, Math.round(projectedScore));

  // Sort actions by impact (highest first)
  actions.sort((a, b) => (b.impactValue || 0) - (a.impactValue || 0));

  // Determine readiness tier
  let tier;
  if (totalScore >= 80) tier = { label: 'Ready to Apply', color: 'emerald', emoji: '🟢' };
  else if (totalScore >= 60) tier = { label: 'Almost Ready', color: 'amber', emoji: '🟡' };
  else if (totalScore >= 40) tier = { label: 'Needs Preparation', color: 'orange', emoji: '🟠' };
  else tier = { label: 'Early Stage', color: 'red', emoji: '🔴' };

  return {
    score: totalScore,
    projectedScore,
    tier,
    dimensions,
    actions,
    weights: READINESS_WEIGHTS,
    computedAt: new Date().toISOString(),
  };
}

// =============================================================================
// Dimension Calculators
// =============================================================================

function calculateProfileCompleteness(profile) {
  let filled = 0;
  const missing = [];

  for (const field of REQUIRED_PROFILE_FIELDS) {
    const val = profile[field];
    if (val !== undefined && val !== null && val !== '') {
      filled++;
    } else {
      missing.push(field);
    }
  }

  let optionalFilled = 0;
  for (const field of OPTIONAL_PROFILE_FIELDS) {
    if (profile[field] !== undefined && profile[field] !== null && profile[field] !== '') {
      optionalFilled++;
    }
  }

  const requiredScore = (filled / REQUIRED_PROFILE_FIELDS.length) * 80;
  const optionalBonus = (optionalFilled / OPTIONAL_PROFILE_FIELDS.length) * 20;
  const score = Math.round(requiredScore + optionalBonus);

  return {
    score,
    potential: 100,
    details: `${filled}/${REQUIRED_PROFILE_FIELDS.length} required fields, ${optionalFilled}/${OPTIONAL_PROFILE_FIELDS.length} optional`,
    missing,
  };
}

function calculateBusinessFormalization(profile) {
  let score = 0;
  const missing = [];
  const isFoodBusiness = (profile.categoryName || '').toLowerCase().match(
    /food|bakery|flour|spice|dairy|pickle|masala|oil|chakk/
  );

  for (const item of FORMALIZATION_ITEMS) {
    if (item.conditional === 'food' && !isFoodBusiness) continue;
    if (profile[item.key]) {
      score += item.weight * 100;
    } else {
      missing.push(item);
    }
  }

  return {
    score: Math.round(Math.min(100, score)),
    details: `${FORMALIZATION_ITEMS.length - missing.length}/${FORMALIZATION_ITEMS.length} formal registrations`,
    missing,
  };
}

function calculateDocumentReadiness(documents, eligibilityResult) {
  const requiredDocs = new Set();
  const topScheme = eligibilityResult?.matchedSchemes?.[0];

  // Get required documents from top matched scheme
  if (topScheme?.requiredDocuments) {
    for (const doc of topScheme.requiredDocuments) {
      if (doc.mandatory) requiredDocs.add(doc);
    }
  }

  // Fallback: minimum universal documents
  const universalDocs = [
    { id: 'aadhaar', label: 'Aadhaar Card', mandatory: true },
    { id: 'pan', label: 'PAN Card', mandatory: true },
    { id: 'bank_passbook', label: 'Bank Passbook', mandatory: true },
  ];

  if (requiredDocs.size === 0) {
    for (const doc of universalDocs) requiredDocs.add(doc);
  }

  let available = 0;
  const missing = [];
  for (const doc of requiredDocs) {
    if (documents[doc.id]) {
      available++;
    } else {
      missing.push(doc);
    }
  }

  const total = requiredDocs.size;
  const score = total > 0 ? Math.round((available / total) * 100) : 50;

  return {
    score,
    potential: 100,
    details: `${available}/${total} required documents ready`,
    missing,
  };
}

function calculateEligibilityCoverage(eligibilityResult) {
  if (!eligibilityResult) {
    return { score: 0, details: 'No eligibility evaluation performed yet' };
  }

  const total = (eligibilityResult.matchedSchemes?.length || 0) +
    (eligibilityResult.nearFitSchemes?.length || 0) +
    (eligibilityResult.ineligibleSchemes?.length || 0);
  const matched = eligibilityResult.matchedSchemes?.length || 0;
  const nearFit = eligibilityResult.nearFitSchemes?.length || 0;

  if (total === 0) return { score: 0, details: 'No schemes evaluated' };

  // Full match = 100%, near fit = 50% credit
  const coverage = ((matched + nearFit * 0.5) / total) * 100;
  const score = Math.round(Math.min(100, coverage));

  return {
    score,
    details: `${matched} fully matched, ${nearFit} near-fit out of ${total} total schemes`,
  };
}

function calculateFinancialClarity(profile) {
  let score = 0;
  const missing = [];

  const cost = Number(profile.projectCost);
  const income = Number(profile.annualIncome);

  if (cost > 0) {
    score += 35;
  } else {
    missing.push('Project cost');
  }

  if (income > 0) {
    score += 25;
  } else {
    missing.push('Annual income');
  }

  if (profile.purpose && profile.purpose !== '') {
    score += 20;
  } else {
    missing.push('Loan purpose');
  }

  if (profile.categoryName && profile.categoryName !== '') {
    score += 20;
  } else {
    missing.push('Business category/sector');
  }

  return {
    score,
    potential: 100,
    details: `${4 - missing.length}/4 financial parameters defined`,
    missing,
  };
}

function calculatePartnerAccessibility(partners, profile) {
  if (!partners || partners.length === 0) {
    return { score: 30, details: 'No partner data available for your geography' };
  }

  const accepting = partners.filter(p => p.intakeStatus === 'accepting');
  const limited = partners.filter(p => p.intakeStatus === 'limited');
  const stale = partners.filter(p => p.intakeStatus === 'stale');

  if (accepting.length >= 2) {
    return { score: 100, details: `${accepting.length} partners actively accepting applications in your area` };
  }
  if (accepting.length === 1) {
    return { score: 80, details: `1 active partner available. ${limited.length} with limited capacity.` };
  }
  if (limited.length > 0) {
    return { score: 55, details: `No partners at full capacity, but ${limited.length} accepting with limitations.` };
  }
  if (stale.length > 0) {
    return { score: 30, details: `Partner data is stale (>14 days old). Confirm availability before visiting.` };
  }
  return { score: 15, details: 'All nearby partners have paused intake.' };
}
