// =============================================================================
// UdyamSetu — Outcome-Learning Feedback Loop Engine
// Collects post-recommendation feedback, tracks outcomes, and computes
// per-scheme accuracy metrics (precision, recall, F1) for model calibration.
// =============================================================================

/**
 * Feedback types at each stage
 */
export const FEEDBACK_TYPES = {
  RECOMMENDATION_HELPFUL: 'recommendation_helpful',
  PARTNER_ACCEPTED: 'partner_accepted',
  DOCUMENTS_ACCURATE: 'documents_accurate',
  APPLICATION_OUTCOME: 'application_outcome',
  FOLLOWUP_30DAY: 'followup_30day',
};

/**
 * Application outcome values
 */
export const OUTCOMES = {
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  PENDING: 'PENDING',
  WITHDREW: 'WITHDREW',
  UNKNOWN: 'UNKNOWN',
};

/**
 * In-memory feedback store (persisted to SQLite via API layer)
 * In production, this would be the database directly.
 */
const feedbackStore = [];
const calibrationCache = {};

/**
 * Record a feedback entry.
 */
export function recordFeedback({
  profileId,
  recommendationId,
  schemeId,
  feedbackType,
  predictedStatus,
  predictedReadiness,
  predictedSubsidy,
  actualOutcome = null,
  actualSubsidyReceived = null,
  rejectionReason = null,
  helpfulnessRating = null,
  accuracyRating = null,
  userComment = null,
  timeToOutcomeDays = null,
}) {
  const entry = {
    feedback_id: `FB-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    profile_id: profileId,
    recommendation_id: recommendationId,
    scheme_id: schemeId,
    feedback_type: feedbackType,
    predicted_status: predictedStatus,
    predicted_readiness: predictedReadiness,
    predicted_subsidy: predictedSubsidy,
    actual_outcome: actualOutcome,
    actual_subsidy_received: actualSubsidyReceived,
    rejection_reason: rejectionReason,
    helpfulness_rating: helpfulnessRating,
    accuracy_rating: accuracyRating,
    user_comment: userComment,
    time_to_outcome_days: timeToOutcomeDays,
    collected_at: new Date().toISOString(),
    collection_method: 'IN_APP',
  };

  feedbackStore.push(entry);
  invalidateCalibrationCache(schemeId);

  return entry;
}

/**
 * Get all feedback entries, optionally filtered by scheme.
 */
export function getFeedback(schemeId = null) {
  if (schemeId) {
    return feedbackStore.filter(f => f.scheme_id === schemeId);
  }
  return [...feedbackStore];
}

/**
 * Compute calibration scores for a specific scheme.
 * Measures how well our predictions matched reality.
 *
 * Precision: Of those we said were ELIGIBLE, how many were actually approved?
 * Recall: Of those who were actually approved, how many did we predict?
 * F1: Harmonic mean of precision and recall.
 */
export function computeCalibration(schemeId = null) {
  if (schemeId && calibrationCache[schemeId]) {
    return calibrationCache[schemeId];
  }

  const relevantFeedback = schemeId
    ? feedbackStore.filter(f => f.scheme_id === schemeId && f.actual_outcome)
    : feedbackStore.filter(f => f.actual_outcome);

  if (relevantFeedback.length === 0) {
    const result = {
      scheme_id: schemeId || 'ALL',
      sample_size: 0,
      precision: null,
      recall: null,
      f1: null,
      accuracy: null,
      message: 'Insufficient data — no outcome feedback collected yet',
      avg_helpfulness: null,
      avg_accuracy_rating: null,
    };
    return result;
  }

  // True Positives: We predicted ELIGIBLE, actual was APPROVED
  let tp = 0;
  // False Positives: We predicted ELIGIBLE, actual was REJECTED
  let fp = 0;
  // False Negatives: We predicted NOT_ELIGIBLE, actual was APPROVED (missed opportunity)
  let fn = 0;
  // True Negatives: We predicted NOT_ELIGIBLE, actual was REJECTED
  let tn = 0;

  for (const f of relevantFeedback) {
    const predicted = f.predicted_status === 'ELIGIBLE';
    const actual = f.actual_outcome === OUTCOMES.APPROVED;

    if (predicted && actual) tp++;
    else if (predicted && !actual) fp++;
    else if (!predicted && actual) fn++;
    else tn++;
  }

  const precision = (tp + fp) > 0 ? tp / (tp + fp) : null;
  const recall = (tp + fn) > 0 ? tp / (tp + fn) : null;
  const f1 = (precision !== null && recall !== null && (precision + recall) > 0)
    ? 2 * (precision * recall) / (precision + recall)
    : null;
  const accuracy = relevantFeedback.length > 0 ? (tp + tn) / relevantFeedback.length : null;

  // Aggregate satisfaction ratings
  const helpfulnessRatings = relevantFeedback
    .filter(f => f.helpfulness_rating !== null)
    .map(f => f.helpfulness_rating);
  const accuracyRatings = relevantFeedback
    .filter(f => f.accuracy_rating !== null)
    .map(f => f.accuracy_rating);

  const avgHelpfulness = helpfulnessRatings.length > 0
    ? helpfulnessRatings.reduce((a, b) => a + b, 0) / helpfulnessRatings.length
    : null;
  const avgAccuracyRating = accuracyRatings.length > 0
    ? accuracyRatings.reduce((a, b) => a + b, 0) / accuracyRatings.length
    : null;

  const result = {
    scheme_id: schemeId || 'ALL',
    sample_size: relevantFeedback.length,
    true_positives: tp,
    false_positives: fp,
    false_negatives: fn,
    true_negatives: tn,
    precision: precision !== null ? Math.round(precision * 100) : null,
    recall: recall !== null ? Math.round(recall * 100) : null,
    f1: f1 !== null ? parseFloat(f1.toFixed(3)) : null,
    accuracy: accuracy !== null ? Math.round(accuracy * 100) : null,
    avg_helpfulness: avgHelpfulness !== null ? parseFloat(avgHelpfulness.toFixed(1)) : null,
    avg_accuracy_rating: avgAccuracyRating !== null ? parseFloat(avgAccuracyRating.toFixed(1)) : null,
    computed_at: new Date().toISOString(),
    flags: [],
  };

  // Flag low-performing schemes
  if (result.precision !== null && result.precision < 80) {
    result.flags.push({
      type: 'LOW_PRECISION',
      severity: 'WARNING',
      message: `Precision is ${result.precision}% — system is over-predicting eligibility for this scheme. Consider adding verification steps.`,
    });
  }
  if (result.recall !== null && result.recall < 80) {
    result.flags.push({
      type: 'LOW_RECALL',
      severity: 'WARNING',
      message: `Recall is ${result.recall}% — system is missing eligible applicants for this scheme. Review constraint rules.`,
    });
  }

  if (schemeId) {
    calibrationCache[schemeId] = result;
  }

  return result;
}

/**
 * Get calibration scores for all schemes that have feedback.
 */
export function getFullCalibrationReport() {
  const schemeIds = [...new Set(feedbackStore.map(f => f.scheme_id))];
  const perScheme = schemeIds.map(id => computeCalibration(id));
  const overall = computeCalibration(null);

  return {
    overall,
    perScheme,
    totalFeedbackEntries: feedbackStore.length,
    schemesWithFeedback: schemeIds.length,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Seed demo feedback data for demonstration purposes.
 * Clearly labeled as prototype simulation data.
 */
export function seedDemoFeedback() {
  const demoData = [
    { schemeId: 'GOI_PMEGP', predictedStatus: 'ELIGIBLE', outcome: 'APPROVED', helpfulness: 5, accuracy: 5, subsidy: 42000 },
    { schemeId: 'GOI_PMEGP', predictedStatus: 'ELIGIBLE', outcome: 'APPROVED', helpfulness: 4, accuracy: 4, subsidy: 35000 },
    { schemeId: 'GOI_PMEGP', predictedStatus: 'ELIGIBLE', outcome: 'REJECTED', helpfulness: 3, accuracy: 2, subsidy: 0, reason: 'EDP training not completed' },
    { schemeId: 'GOI_PMEGP', predictedStatus: 'ELIGIBLE', outcome: 'APPROVED', helpfulness: 5, accuracy: 5, subsidy: 52500 },
    { schemeId: 'GOI_PMMY_MUDRA', predictedStatus: 'ELIGIBLE', outcome: 'APPROVED', helpfulness: 4, accuracy: 5, subsidy: 0 },
    { schemeId: 'GOI_PMMY_MUDRA', predictedStatus: 'ELIGIBLE', outcome: 'APPROVED', helpfulness: 5, accuracy: 4, subsidy: 0 },
    { schemeId: 'GOI_PM_VISHWAKARMA', predictedStatus: 'ELIGIBLE', outcome: 'APPROVED', helpfulness: 5, accuracy: 5, subsidy: 15000 },
    { schemeId: 'GOI_PM_VISHWAKARMA', predictedStatus: 'ELIGIBLE', outcome: 'APPROVED', helpfulness: 4, accuracy: 5, subsidy: 15000 },
    { schemeId: 'NSFDC_CONCESSIONAL_CORE', predictedStatus: 'ELIGIBLE', outcome: 'APPROVED', helpfulness: 4, accuracy: 4, subsidy: 0 },
    { schemeId: 'NSFDC_CONCESSIONAL_CORE', predictedStatus: 'ELIGIBLE', outcome: 'REJECTED', helpfulness: 2, accuracy: 2, subsidy: 0, reason: 'Income above ceiling' },
  ];

  for (const d of demoData) {
    recordFeedback({
      profileId: `DEMO-${Math.floor(Math.random() * 1000)}`,
      recommendationId: `REC-DEMO-${Date.now()}`,
      schemeId: d.schemeId,
      feedbackType: FEEDBACK_TYPES.APPLICATION_OUTCOME,
      predictedStatus: d.predictedStatus,
      predictedReadiness: Math.floor(Math.random() * 30 + 50),
      predictedSubsidy: d.subsidy,
      actualOutcome: d.outcome,
      actualSubsidyReceived: d.subsidy,
      rejectionReason: d.reason || null,
      helpfulnessRating: d.helpfulness,
      accuracyRating: d.accuracy,
      userComment: null,
    });
  }
}

function invalidateCalibrationCache(schemeId) {
  if (schemeId) delete calibrationCache[schemeId];
  delete calibrationCache['ALL'];
}
