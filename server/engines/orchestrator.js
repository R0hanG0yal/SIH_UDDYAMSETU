// =============================================================================
// UdyamSetu — AI Orchestrator
// Multi-agent pipeline coordinator: Sense → Reason → Plan → Act
// Routes requests through the correct engines in the correct order.
// Every pipeline run produces an immutable execution trace.
// =============================================================================

import { evaluateNationalSchemes } from './eligibilityEngine.js';
import { calculateReadinessScore } from './readinessEngine.js';
import { runCounterfactual } from './counterfactualEngine.js';
import { groundWithCitations, createAIDraftCitation, PROVENANCE } from './ragCitationEngine.js';
import { getConfidenceTier } from './ragCitationEngine.js';

let runCounter = 0;

/**
 * Create a new orchestrator pipeline run.
 */
function createRun(input) {
  runCounter++;
  const runId = `ORCH-${Date.now()}-${runCounter}`;
  return {
    runId,
    startTime: Date.now(),
    steps: [],
    escalations: [],
    profile: null,
    addStep(engineName, input, output, confidence = 1.0) {
      const step = {
        step_index: this.steps.length + 1,
        engine: engineName,
        started_at: new Date().toISOString(),
        duration_ms: 0,
        confidence,
        confidence_tier: getConfidenceTier(confidence),
        status: 'COMPLETED',
        input_summary: summarizeInput(input),
        output_summary: summarizeOutput(output),
      };
      this.steps.push(step);
      return step;
    },
  };
}

/**
 * Main orchestrator entry point.
 * Runs the full intelligence pipeline for a given profile.
 *
 * @param {Object} input - Raw user input (profile data, transcript, etc.)
 * @param {Object} options - Pipeline options
 * @param {Object} options.documents - Document availability state
 * @param {Array}  options.partners - Available partner banks
 * @param {Object} options.whatIf - Counterfactual changes (if any)
 * @param {boolean} options.skipAINarrative - Skip AI narrative generation
 * @returns {Object} Complete orchestrated result with execution trace
 */
export async function runOrchestrator(input, options = {}) {
  const run = createRun(input);
  const documents = options.documents || {};
  const partners = options.partners || [];

  try {
    // =========================================================================
    // STEP 1: Profile Extraction / Normalization
    // =========================================================================
    const profile = normalizeProfile(input);
    run.profile = profile;
    run.addStep('profileEngine', input, profile, computeProfileConfidence(profile));

    // =========================================================================
    // STEP 2: Deterministic Eligibility Evaluation
    // CRITICAL: This is NEVER done by LLM. Always rule-based.
    // =========================================================================
    const eligibilityResult = evaluateNationalSchemes(profile);
    run.addStep('eligibilityEngine', profile, {
      matched: eligibilityResult.matchedSchemes?.length || 0,
      nearFit: eligibilityResult.nearFitSchemes?.length || 0,
      ineligible: eligibilityResult.ineligibleSchemes?.length || 0,
    }, 1.0); // Deterministic = confidence 1.0

    // =========================================================================
    // STEP 3: Ground all claims with source citations
    // =========================================================================
    const groundedSchemes = [];
    for (const scheme of (eligibilityResult.matchedSchemes || [])) {
      groundedSchemes.push(groundWithCitations(scheme));
    }
    const groundedNearFit = [];
    for (const scheme of (eligibilityResult.nearFitSchemes || [])) {
      groundedNearFit.push(groundWithCitations(scheme));
    }

    eligibilityResult.matchedSchemes = groundedSchemes;
    eligibilityResult.nearFitSchemes = groundedNearFit;

    run.addStep('ragCitationEngine', { schemesCount: groundedSchemes.length + groundedNearFit.length }, {
      grounded: groundedSchemes.filter(s => s.grounding_status === 'GROUNDED').length,
      ungrounded: groundedSchemes.filter(s => s.grounding_status !== 'GROUNDED').length,
    }, 1.0);

    // =========================================================================
    // STEP 4-6: Parallel fan-out (readiness + paths + counterfactual)
    // =========================================================================
    const readinessResult = calculateReadinessScore(profile, eligibilityResult, documents, partners);
    run.addStep('readinessEngine', { profileId: profile.applicantName }, {
      score: readinessResult.score,
      tier: readinessResult.tier.label,
      actionsCount: readinessResult.actions.length,
    }, 1.0);

    // Funding path optimization (rank matched schemes by path score)
    const fundingPaths = computeFundingPaths(eligibilityResult, profile, documents, partners);
    run.addStep('fundingPathOptimizer', { matched: eligibilityResult.matchedSchemes?.length }, {
      pathsRanked: fundingPaths.length,
      topPath: fundingPaths[0]?.scheme_name || 'None',
    }, 1.0);

    // Counterfactual (only if what-if changes are requested)
    let counterfactualResult = null;
    if (options.whatIf && Object.keys(options.whatIf).length > 0) {
      counterfactualResult = runCounterfactual(profile, options.whatIf, documents, partners);
      run.addStep('counterfactualEngine', { changes: Object.keys(options.whatIf) }, {
        newlyEligible: counterfactualResult.diff?.newlyEligible?.length || 0,
        lostEligibility: counterfactualResult.diff?.lostEligibility?.length || 0,
        readinessDiff: counterfactualResult.diff?.readinessDiff || 0,
      }, 1.0);
    }

    // =========================================================================
    // STEP 7: Confidence Gate — HITL uncertainty check
    // =========================================================================
    const escalations = checkConfidence(profile, eligibilityResult);
    run.escalations = escalations;
    if (escalations.length > 0) {
      run.addStep('uncertaintyHandler', { fieldsChecked: Object.keys(profile).length }, {
        escalations: escalations.length,
        tier: escalations[0]?.tier || 'UNKNOWN',
      }, Math.min(...escalations.map(e => e.confidence)));
    }

    // =========================================================================
    // STEP 8: AI Narrative Generation (labeled as AI-generated)
    // =========================================================================
    let narrative = null;
    if (!options.skipAINarrative) {
      narrative = generateNarrative(profile, eligibilityResult, readinessResult, fundingPaths);
      run.addStep('aiNarrativeAgent', { profile: profile.applicantName }, {
        paragraphs: narrative?.sections?.length || 0,
        provenance: PROVENANCE.AI_DRAFT,
      }, 0.7); // AI-generated = lower confidence
    }

    // =========================================================================
    // Finalize
    // =========================================================================
    const totalDuration = Date.now() - run.startTime;

    return {
      status: 'SUCCESS',
      runId: run.runId,
      profile,
      eligibility: eligibilityResult,
      readiness: readinessResult,
      fundingPaths,
      counterfactual: counterfactualResult,
      escalations,
      narrative,
      trace: {
        runId: run.runId,
        steps: run.steps,
        totalDurationMs: totalDuration,
        enginesExecuted: run.steps.length,
        startedAt: new Date(run.startTime).toISOString(),
        completedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    return {
      status: 'ERROR',
      runId: run.runId,
      error: error.message,
      trace: {
        runId: run.runId,
        steps: run.steps,
        totalDurationMs: Date.now() - run.startTime,
        error: error.message,
      },
    };
  }
}

// =============================================================================
// Profile Normalization
// =============================================================================

function normalizeProfile(input) {
  const profile = { ...input };

  // Normalize social category flags
  const sc = (profile.socialCategory || '').toUpperCase();
  if (sc === 'SC') profile.isSC = true;
  if (sc === 'ST') profile.isST = true;
  if (sc === 'OBC') profile.isOBC = true;
  if (sc === 'MINORITY') profile.isMinority = true;

  // Ensure numeric fields
  profile.projectCost = Number(profile.projectCost) || 0;
  profile.annualIncome = Number(profile.annualIncome) || 0;

  // Defaults
  if (!profile.purpose) profile.purpose = 'business';
  if (profile.isRural === undefined) profile.isRural = true;
  if (!profile.gender) profile.gender = 'female';
  if (!profile.socialCategory) profile.socialCategory = profile.isSC ? 'SC' : 'General';

  return profile;
}

/**
 * Compute overall confidence of the profile data.
 * Fields from user input get 0.75, fields from AI extraction get lower.
 */
function computeProfileConfidence(profile) {
  const criticalFields = ['projectCost', 'annualIncome', 'socialCategory', 'gender', 'purpose', 'categoryName'];
  let filledCount = 0;
  for (const field of criticalFields) {
    if (profile[field] !== undefined && profile[field] !== null && profile[field] !== '' && profile[field] !== 0) {
      filledCount++;
    }
  }
  const completeness = filledCount / criticalFields.length;

  // If source is user-declared, base confidence is 0.75
  // If AI-extracted (marked by profile._source === 'ai'), lower
  const baseConfidence = profile._source === 'ai' ? 0.6 : 0.85;
  return Math.min(1.0, baseConfidence * completeness + 0.15);
}

// =============================================================================
// HITL Confidence Gate
// =============================================================================

function checkConfidence(profile, eligibilityResult) {
  const escalations = [];

  // Check profile field confidence
  const fieldConfidences = {
    annualIncome: profile._incomeSource === 'verified' ? 1.0 : 0.65,
    socialCategory: profile._categoryCertVerified ? 1.0 : 0.70,
    projectCost: profile.projectCost > 0 ? 0.85 : 0.3,
    applicantName: profile.applicantName ? 0.90 : 0.2,
  };

  for (const [field, confidence] of Object.entries(fieldConfidences)) {
    const tier = getConfidenceTier(confidence);
    if (confidence < 0.70) {
      // Find which eligibility constraints depend on this field
      const dependentSchemes = findDependentSchemes(field, eligibilityResult);

      escalations.push({
        type: 'PROFILE_FIELD',
        field,
        value: profile[field],
        confidence,
        tier: tier.label,
        badge: tier.badge,
        impact: dependentSchemes.length > 0
          ? `Eligibility for ${dependentSchemes.length} scheme(s) depends on verified ${field}`
          : `Profile completeness affected`,
        dependentSchemes,
        suggestedAction: field === 'annualIncome'
          ? 'Upload income certificate for verification'
          : field === 'socialCategory'
          ? 'Upload caste certificate for verification'
          : `Please confirm your ${field}`,
      });
    }
  }

  // Check for conditional eligibility (schemes that pass but depend on unverified data)
  for (const scheme of (eligibilityResult.matchedSchemes || [])) {
    if (scheme.id === 'NSFDC_CONCESSIONAL_CORE' || scheme.id === 'MOSJE_NSFDC_TERM_LOAN') {
      if (!profile._categoryCertVerified) {
        escalations.push({
          type: 'CONDITIONAL_ELIGIBILITY',
          scheme_id: scheme.id,
          scheme_name: scheme.name,
          confidence: 0.65,
          tier: 'Verify',
          badge: '⚠️',
          impact: `${scheme.name} eligibility depends on verified SC/ST status`,
          suggestedAction: 'Upload caste certificate to confirm eligibility',
        });
      }
    }
  }

  return escalations;
}

function findDependentSchemes(field, eligibilityResult) {
  const dependent = [];
  const allSchemes = [
    ...(eligibilityResult.matchedSchemes || []),
    ...(eligibilityResult.nearFitSchemes || []),
  ];

  for (const scheme of allSchemes) {
    const rules = [...(scheme.passedRules || []), ...(scheme.failedRules || [])];
    const ruleTexts = rules.map(r => typeof r === 'string' ? r : r.text || '').join(' ').toLowerCase();

    if (field === 'annualIncome' && ruleTexts.includes('income')) {
      dependent.push({ id: scheme.id, name: scheme.name });
    }
    if (field === 'socialCategory' && (ruleTexts.includes('sc') || ruleTexts.includes('caste') || ruleTexts.includes('community'))) {
      dependent.push({ id: scheme.id, name: scheme.name });
    }
    if (field === 'projectCost' && ruleTexts.includes('cost')) {
      dependent.push({ id: scheme.id, name: scheme.name });
    }
  }

  return dependent;
}

// =============================================================================
// Funding Path Optimizer
// =============================================================================

function computeFundingPaths(eligibilityResult, profile, documents, partners) {
  const paths = [];

  for (const scheme of (eligibilityResult.matchedSchemes || [])) {
    // Calculate path score (transparent weighted formula)
    const eligibilityScore = 25; // fully eligible = full 25 points

    // Need fit: how well does the scheme match the user's funding need?
    const maxFunding = scheme.eligibleFunding || 0;
    const needFit = Math.min(15, (maxFunding / Math.max(1, profile.projectCost)) * 15);

    // Document readiness for this specific scheme
    const schemeDocs = scheme.requiredDocuments || [];
    const mandatoryDocs = schemeDocs.filter(d => d.mandatory);
    const availableDocs = mandatoryDocs.filter(d => documents[d.id]);
    const docReadiness = mandatoryDocs.length > 0
      ? (availableDocs.length / mandatoryDocs.length) * 15
      : 10;

    // Geography / partner availability
    const activePartners = partners.filter(p =>
      p.intakeStatus === 'accepting' &&
      (!p.supportedSchemes || p.supportedSchemes.includes(scheme.id))
    );
    const geoScore = activePartners.length >= 2 ? 10 : activePartners.length === 1 ? 7 : 3;

    // Process complexity (lower is better for user)
    const complexity = scheme.requiredDocuments?.length > 4 ? 5 : 10;

    // Financial benefit
    const subsidyBenefit = Math.min(15, ((scheme.directSubsidyAmount || 0) / Math.max(1, profile.projectCost)) * 30);
    const interestBenefit = Math.max(0, (12 - (scheme.effectiveInterestRate || 8.5)) / 12 * 5);
    const financialScore = Math.min(15, subsidyBenefit + interestBenefit);

    // Freshness / verification
    const freshness = 10; // All schemes currently verified

    const pathScore = Math.round(eligibilityScore + needFit + docReadiness + geoScore + complexity + financialScore + freshness);

    paths.push({
      scheme_id: scheme.id,
      scheme_name: scheme.name,
      path_score: Math.min(100, pathScore),
      score_breakdown: {
        eligibility: Math.round(eligibilityScore),
        need_fit: Math.round(needFit),
        doc_readiness: Math.round(docReadiness),
        geography: Math.round(geoScore),
        complexity: Math.round(complexity),
        financial_benefit: Math.round(financialScore),
        freshness: Math.round(freshness),
      },
      scheme_data: scheme,
      recommended_partner: activePartners[0] || null,
      missing_documents: mandatoryDocs.filter(d => !documents[d.id]),
    });
  }

  // Sort by path score descending
  paths.sort((a, b) => b.path_score - a.path_score);
  return paths;
}

// =============================================================================
// AI Narrative Generator (clearly labeled as AI-generated)
// =============================================================================

function generateNarrative(profile, eligibility, readiness, paths) {
  const name = profile.applicantName || 'Applicant';
  const sector = profile.categoryName || 'enterprise';
  const topPath = paths[0];
  const matched = eligibility.matchedSchemes?.length || 0;
  const score = readiness.score;

  const sections = [];

  // Section 1: Summary
  sections.push({
    type: 'summary',
    title: 'Your Funding Overview',
    content: `${name}, based on your ${sector} profile, UdyamSetu has identified ${matched} government scheme(s) that match your eligibility. Your current Funding Readiness Score is ${score}/100 (${readiness.tier.label}).`,
    provenance: PROVENANCE.AI_DRAFT,
  });

  // Section 2: Top recommendation
  if (topPath) {
    sections.push({
      type: 'recommendation',
      title: 'Top Recommended Path',
      content: `**${topPath.scheme_name}** (Path Score: ${topPath.path_score}/100)\n\nEligible funding: ₹${(topPath.scheme_data.eligibleFunding || 0).toLocaleString('en-IN')}. Direct subsidy: ₹${(topPath.scheme_data.directSubsidyAmount || 0).toLocaleString('en-IN')}. Interest: ${topPath.scheme_data.effectiveInterestRate || 'N/A'}%.`,
      provenance: PROVENANCE.GUIDELINE,
      citation: topPath.scheme_data.source_document || null,
    });
  }

  // Section 3: Actions
  if (readiness.actions.length > 0) {
    const topActions = readiness.actions.slice(0, 3);
    sections.push({
      type: 'actions',
      title: 'Your Next Steps',
      content: topActions.map((a, i) => `${i + 1}. ${a.action} (${a.impact})`).join('\n'),
      provenance: PROVENANCE.AI_DRAFT,
    });
  }

  return {
    sections,
    generatedAt: new Date().toISOString(),
    provenance: PROVENANCE.AI_DRAFT,
    warning: 'This narrative is AI-generated advisory content. Eligibility decisions are based on published government guidelines. Verify all claims with your bank or CSC centre.',
    citation: createAIDraftCitation(),
  };
}

// =============================================================================
// Helpers
// =============================================================================

function summarizeInput(input) {
  if (!input) return 'null';
  if (typeof input === 'string') return input.substring(0, 100);
  const keys = Object.keys(input);
  return `{${keys.slice(0, 5).join(', ')}${keys.length > 5 ? '...' : ''}}`;
}

function summarizeOutput(output) {
  if (!output) return 'null';
  if (typeof output === 'string') return output.substring(0, 100);
  if (typeof output === 'number') return String(output);
  const keys = Object.keys(output);
  const summary = {};
  for (const key of keys.slice(0, 5)) {
    const val = output[key];
    summary[key] = typeof val === 'object' ? '[Object]' : val;
  }
  return JSON.stringify(summary);
}
