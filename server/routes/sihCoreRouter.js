/**
 * =============================================================================
 * SMART INDIA HACKATHON (SIH26092) - MoSJE & NSFDC
 * Project: AI-Driven Scheme Matching for Marginalized Entrepreneurs
 * Backend Router: Core Recommender, Financials, Geo-Spatial Router, & HITL Admin
 *
 * v2: All endpoints are backed by the SQLite layer (server/db/v2db.js),
 * seeded from official sources (server/data/seedSchemes.js) and refreshed by
 * the ingestion pipeline (server/ingest/runIngest.js). Response contracts are
 * unchanged — the S../../../src/components/sih frontend consumes them as-is.
 * =============================================================================
 */

import { Router } from 'express';
import {
  getActiveSchemes,
  getActivePartners,
  listReviews,
  getReviewById,
  approveReview,
  rejectReview,
  getSources,
  getIngestRuns,
  getScrapedPartnerCount,
  listScrapedPartners,
  promoteScrapedPartner,
  batchPromoteScrapedPartners,
  deleteScrapedPartner,
  insertBeneficiaryPassport,
  listBeneficiaryPassports,
  getBeneficiaryPassport,
  updateBeneficiaryPassportStatus
} from '../db/v2db.js';
import { runIngestOnce } from '../ingest/runIngest.js';
import { geocodeStagedPartners } from '../ingest/geocodePartners.js';

const router = Router();

// Helper: Haversine distance calculation in KM
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

// =============================================================================
// MODULE 1: SMART SCHEME RECOMMENDER ENGINE
// Endpoint: POST /api/v2/recommender/match
// =============================================================================
/**
 * Rule-based, explainable matching over the curated scheme catalog:
 * 1. Income ceiling: income > scheme ceiling (₹5.00 Lakh) -> universal fallback.
 * 2. Purpose: EDUCATION -> ELS only; BUSINESS -> credit schemes by cost bracket.
 * 3. Cost bracket: MCF/MSY (<= ₹1.40L), Suvidha (<= ₹10L), Term/Utkarsh (<= ₹50L).
 * 4. Gender: MSY is women-only (eligible_genders = 'FEMALE').
 * 5. Education floor: scheme.min_education vs applicant educationStatus.
 * 6. Every rationale line cites the scheme's provenance (sourceDocument).
 */
router.post('/recommender/match', (req, res) => {
  try {
    const {
      projectType,
      estimatedCost,
      incomeLevel,
      educationStatus,
      casteCategory = 'SC',
      gender = 'male',
      urgency = 'NORMAL'
    } = req.body;

    if (estimatedCost === undefined || estimatedCost === null || isNaN(Number(estimatedCost))) {
      return res.status(400).json({ status: 'ERROR', message: 'Estimated project cost is required and must be numeric.' });
    }
    if (incomeLevel === undefined || incomeLevel === null || isNaN(Number(incomeLevel))) {
      return res.status(400).json({ status: 'ERROR', message: 'Annual family income level is required.' });
    }

    const cost = Number(estimatedCost);
    const income = Number(incomeLevel);
    const isSC = String(casteCategory).toUpperCase() === 'SC';
    const isFemale = String(gender).toLowerCase() === 'female';
    const isEdu = String(projectType).toUpperCase() === 'EDUCATION';

    const EDU_RANK = {
      BELOW_8TH: 0, '8TH_TO_10TH': 1, '10TH_TO_12TH': 2, DIPLOMA: 2,
      GRADUATE: 3, POST_GRADUATE: 4, PROFESSIONAL: 4
    };
    const MIN_EDU_RANK = { NONE: 0, '8TH_PASS': 1, '12TH_PASS': 2 };
    const applicantEduRank = EDU_RANK[educationStatus] ?? 0;

    const schemes = getActiveSchemes();
    const maxIncomeCeiling = Math.max(...schemes.map(s => s.incomeCeiling));

    // 1. Sovereign income boundary check
    if (income > maxIncomeCeiling) {
      return res.status(200).json({
        status: 'SUCCESS',
        isEligibleForConcessional: false,
        reason: 'IncomeExceedsCeiling',
        message: `Family annual income exceeds ₹${maxIncomeCeiling.toLocaleString('en-IN')} ceiling for NSFDC concessional credit. Recommended fallback to universal government schemes.`,
        matchedSchemes: [],
        alternativeRecommendations: [
          {
            name: 'Stand-Up India Scheme',
            sponsor: 'SIDBI / Ministry of Finance',
            costRange: '₹10 Lakh to ₹1 Crore',
            suitability: 'Dedicated collateral-free credit for SC/ST or Women entrepreneurs with higher income levels.'
          },
          {
            name: 'Pradhan Mantri MUDRA Yojana (Tarun)',
            sponsor: 'Ministry of Finance',
            costRange: 'Up to ₹20 Lakhs',
            suitability: 'Universal commercial micro-credit without income ceiling restrictions.'
          }
        ]
      });
    }

    // 2. Filter & score schemes
    const matches = [];

    for (const scheme of schemes) {
      let score = 0;
      const rationale = [];

      // Purpose alignment
      if (isEdu && scheme.purpose === 'EDUCATION') {
        score += 40;
        rationale.push('Project purpose matches Higher Education criteria.');
      } else if (!isEdu && scheme.purpose === 'BUSINESS') {
        score += 40;
        rationale.push('Project purpose aligns with Enterprise & Self-Employment activities.');
      } else {
        continue;
      }

      // Cost bracket
      if (cost >= scheme.minCost && cost <= scheme.maxCost) {
        score += 35;
        rationale.push(
          `Cost ₹${cost.toLocaleString('en-IN')} fits within permissible bracket (₹${scheme.minCost.toLocaleString('en-IN')} - ₹${scheme.maxCost.toLocaleString('en-IN')}).`
        );
      } else {
        continue;
      }

      // Gender eligibility (MSY is women-only)
      if (scheme.eligibleGenders === 'FEMALE' && !isFemale) continue;
      if (scheme.eligibleGenders === 'FEMALE' && isFemale) {
        rationale.push('Women-only scheme: applicant gender qualifies for Mahila Samriddhi terms.');
      }

      // Income ceiling per scheme
      if (income > scheme.incomeCeiling) continue;
      if (isSC) {
        score += 15;
        rationale.push(
          `Applicant belongs to targeted Scheduled Caste community; family income ₹${income.toLocaleString('en-IN')} within ₹${scheme.incomeCeiling.toLocaleString('en-IN')} ceiling.`
        );
      }

      // Education floor (soft: warn instead of dropping)
      const minEduRank = MIN_EDU_RANK[scheme.minEducation] ?? 0;
      if (applicantEduRank < minEduRank) {
        score -= 20;
        rationale.push(
          `Note: this scheme typically requires ${scheme.minEducation.replace('_', ' ').toLowerCase()} qualification; your declared status is ${educationStatus}. Final verification happens at the Channel Partner desk.`
        );
      }

      // Interest rate & gender rebate
      let effectiveRate = scheme.baseInterestRate;
      if (isFemale && scheme.femaleRebate > 0) {
        effectiveRate = parseFloat((effectiveRate - scheme.femaleRebate).toFixed(2));
        rationale.push(`Women concession of ${scheme.femaleRebate}% applied (effective rate: ${effectiveRate}%).`);
      }

      // Urgency routing + concessional-rate bonus
      if (urgency === 'RAPID' && scheme.channelTypes.includes('NBFC_MFI')) {
        score += 10;
        rationale.push('Fast-track NBFC-MFI routing prioritized due to urgency signal.');
      } else if (effectiveRate <= 6.5) {
        score += 10;
        rationale.push(
          `Lowest concessional sovereign rate (${effectiveRate}% p.a. — well below commercial ~12.5%) via ${scheme.channelTypes.join('/')} channel.`
        );
      }

      // Sovereign 90% funding split
      const loanAmount = Math.min(cost * (scheme.maxLoanPercent / 100), scheme.maxAbsoluteLoan);
      const ownEquity = cost - loanAmount;

      rationale.push(
        `Repayment: ${scheme.repaymentCadence.toLowerCase()} installments, ${scheme.minMoratoriumMonths}-${scheme.maxMoratoriumMonths} months moratorium, up to ${scheme.maxTenureYears} years. Provenance: ${scheme.sourceDocument}.`
      );

      matches.push({
        schemeId: scheme.id,
        schemeCode: scheme.code,
        schemeName: scheme.name,
        schemeNameHindi: scheme.nameHindi,
        matchConfidence: Math.max(0, Math.min(score, 100)),
        cost,
        eligibleLoanAmount: Math.round(loanAmount),
        requiredBeneficiaryEquity: Math.round(ownEquity),
        fundingCoveragePercent: Math.round((loanAmount / cost) * 100),
        effectiveInterestRate: effectiveRate,
        cadence: scheme.repaymentCadence,
        recommendedMoratoriumMonths: scheme.minMoratoriumMonths,
        defaultTenureYears: Math.min(scheme.defaultTenureYears, 7),
        rationale,
        channelPartnerTypes: scheme.channelTypes,
        officialSourceUrl: scheme.officialSourceUrl,
        sourceQuote: scheme.sourceQuote,
        policyVersion: scheme.policyVersion,
        lastVerifiedAt: scheme.lastVerifiedAt
      });
    }

    matches.sort((a, b) =>
      b.matchConfidence - a.matchConfidence ||
      a.effectiveInterestRate - b.effectiveInterestRate
    );

    return res.status(200).json({
      status: 'SUCCESS',
      isEligibleForConcessional: matches.length > 0,
      totalMatched: matches.length,
      primaryRecommendation: matches[0] || null,
      allRecommendations: matches,
      beneficiaryVerificationSummary: {
        incomeVerified: true,
        casteVerified: isSC,
        incomeCeiling: maxIncomeCeiling,
        applicantIncome: income
      }
    });
  } catch (err) {
    console.error('[Recommender Error]:', err);
    return res.status(500).json({ status: 'ERROR', message: err.message || 'Internal recommendation error' });
  }
});

// =============================================================================
// MODULE 2: DYNAMIC FINANCIAL & EMI CALCULATOR
// Endpoint: POST /api/v2/calculator/financials
// =============================================================================
router.post('/calculator/financials', (req, res) => {
  try {
    const {
      projectCost,
      customLoanAmount,
      interestRatePercent,
      moratoriumMonths = 6,
      tenureYears = 5,
      repaymentCadence = 'QUARTERLY'
    } = req.body;

    const cost = Number(projectCost);
    if (!cost || cost <= 0) {
      return res.status(400).json({ status: 'ERROR', message: 'Valid project cost is required.' });
    }

    const maxPermissibleLoan = cost * 0.90;
    const loanPrincipal = customLoanAmount ? Math.min(Number(customLoanAmount), maxPermissibleLoan) : maxPermissibleLoan;
    const ownEquity = cost - loanPrincipal;

    const rate = Number(interestRatePercent) || 8.0;
    const moratorium = Math.max(0, Math.min(Number(moratoriumMonths) || 0, 54));
    const tenure = Number(tenureYears) || 5;
    const isQuarterly = repaymentCadence.toUpperCase() === 'QUARTERLY';

    const periodsPerYear = isQuarterly ? 4 : 12;
    const totalRepaymentPeriods = tenure * periodsPerYear;
    const periodicRate = (rate / 100) / periodsPerYear;

    let periodicEMI = 0;
    if (periodicRate > 0) {
      periodicEMI = loanPrincipal * (periodicRate * Math.pow(1 + periodicRate, totalRepaymentPeriods)) /
                    (Math.pow(1 + periodicRate, totalRepaymentPeriods) - 1);
    } else {
      periodicEMI = loanPrincipal / totalRepaymentPeriods;
    }

    const moratoriumYears = moratorium / 12;
    const moratoriumInterestAccrued = loanPrincipal * (rate / 100) * moratoriumYears;

    const totalPrincipalAndInterestPostMoratorium = periodicEMI * totalRepaymentPeriods;
    const totalRepayable = totalPrincipalAndInterestPostMoratorium + moratoriumInterestAccrued;
    const totalInterestPayable = totalRepayable - loanPrincipal;

    const commLoan = cost * 0.75;
    const commRate = 12.5;
    const commPeriodicRate = (commRate / 100) / 12;
    const commPeriods = tenure * 12;
    const commMonthlyEMI = commLoan * (commPeriodicRate * Math.pow(1 + commPeriodicRate, commPeriods)) /
                           (Math.pow(1 + commPeriodicRate, commPeriods) - 1);
    const commTotalPaid = commMonthlyEMI * commPeriods;
    const netEntrepreneurSavings = commTotalPaid - totalRepayable;

    return res.status(200).json({
      status: 'SUCCESS',
      financials: {
        projectCost: cost,
        loanPrincipal: Math.round(loanPrincipal),
        ownEquityMandatory: Math.round(ownEquity),
        fundingRatio: `${Math.round((loanPrincipal / cost) * 100)}% Loan / ${Math.round((ownEquity / cost) * 100)}% Equity`,
        annualInterestRatePercent: rate,
        moratoriumMonths: moratorium,
        repaymentTenureYears: tenure,
        repaymentCadence: isQuarterly ? 'Quarterly (NSFDC Standard)' : 'Monthly',
        periodicPaymentAmount: Math.round(periodicEMI),
        moratoriumInterestAccrued: Math.round(moratoriumInterestAccrued),
        totalInterestPayable: Math.round(totalInterestPayable),
        totalAmountRepayable: Math.round(totalRepayable),
        firstPaymentDueDateMonthsFromSanction: moratorium + (isQuarterly ? 3 : 1)
      },
      commercialComparison: {
        commercialBankInterestRate: '12.5%',
        commercialRequiredEquity: Math.round(cost * 0.25),
        commercialTotalPayable: Math.round(commTotalPaid),
        concessionalTotalPayable: Math.round(totalRepayable),
        directCitizenBenefitRupees: Math.max(0, Math.round(netEntrepreneurSavings))
      }
    });
  } catch (err) {
    console.error('[Calculator Error]:', err);
    return res.status(500).json({ status: 'ERROR', message: err.message || 'Calculation error' });
  }
});

// =============================================================================
// MODULE 3: GEO-SPATIAL PARTNER LOCATOR & SAFETY ROUTER
// Endpoint: POST /api/v2/router/channel-partners
// =============================================================================
/**
 * Safety gates (applied in order; every exclusion is auditable in the response):
 *  1. Scheme authorization: partner must list the requested schemeId.
 *  2. Gross NPA > 7.0% -> DISQUALIFIED_RISK (frozen credit lines).
 *  3. Overdue rate > 12.0% -> DISQUALIFIED_RISK.
 *  4. Fund utilization >= 95% -> DISQUALIFIED_CAPACITY.
 *  5. intake_status = PAUSED -> DISQUALIFIED_CAPACITY (transparent pause reason).
 * Ranking: score = distance*0.40 + sla*0.35 + npa*0.25 (lower is better).
 */
router.post('/router/channel-partners', (req, res) => {
  try {
    const {
      userLatitude = 26.8467,
      userLongitude = 80.9462,
      schemeId = 'NSFDC_MICRO_FINANCE',
      district = 'Lucknow',
      maxDistanceKm = 50
    } = req.body;

    const uLat = Number(userLatitude);
    const uLon = Number(userLongitude);

    const evaluatedPartners = getActivePartners().map(partner => {
      const distance = calculateDistanceKm(uLat, uLon, partner.latitude, partner.longitude);
      const fundUtilizationPercent = parseFloat(((partner.fundUtilized / partner.fundAllocated) * 100).toFixed(1));

      const isNpaHealthy = partner.grossNpaPercent <= 7.0;
      const isOverdueHealthy = partner.overdueRatePercent <= 12.0;
      const hasFundQuota = fundUtilizationPercent < 95.0;
      const isSchemeAuthorized = !schemeId || partner.authorizedSchemes.includes(schemeId);
      const isIntakeOpen = partner.intakeStatus !== 'PAUSED';

      let routingEligibility = 'ELIGIBLE';
      const disqualificationReasons = [];

      if (!isSchemeAuthorized) {
        routingEligibility = 'INELIGIBLE';
        disqualificationReasons.push(`Not authorized to disburse scheme ${schemeId}`);
      }
      if (!isNpaHealthy) {
        routingEligibility = 'DISQUALIFIED_RISK';
        disqualificationReasons.push(`Gross NPA (${partner.grossNpaPercent}%) exceeds statutory threshold of 7.0%`);
      }
      if (!isOverdueHealthy) {
        routingEligibility = 'DISQUALIFIED_RISK';
        disqualificationReasons.push(`Overdue rate (${partner.overdueRatePercent}%) exceeds 12.0% threshold`);
      }
      if (!hasFundQuota) {
        routingEligibility = 'DISQUALIFIED_CAPACITY';
        disqualificationReasons.push(`Quarterly fund utilization is at ${fundUtilizationPercent}% (depleted)`);
      }
      if (!isIntakeOpen) {
        routingEligibility = 'DISQUALIFIED_CAPACITY';
        disqualificationReasons.push(`Intake transparently paused by agency (status: ${partner.intakeStatus})`);
      }

      const routingScore = parseFloat(
        (distance * 0.40 + partner.avgSlaDays * 0.35 + partner.grossNpaPercent * 0.25).toFixed(2)
      );

      return {
        ...partner,
        distanceKm: distance,
        fundUtilizationPercent,
        isRoutingSafe: routingEligibility === 'ELIGIBLE',
        routingEligibility,
        disqualificationReasons,
        routingScore
      };
    });

    const safePartners = evaluatedPartners
      .filter(p => p.isRoutingSafe && p.distanceKm <= maxDistanceKm)
      .sort((a, b) => a.routingScore - b.routingScore);

    const disqualifiedPartners = evaluatedPartners.filter(p => !p.isRoutingSafe);

    return res.status(200).json({
      status: 'SUCCESS',
      userCoordinates: { lat: uLat, lng: uLon },
      targetScheme: schemeId,
      district,
      totalDiscovered: evaluatedPartners.length,
      eligiblePartnersCount: safePartners.length,
      disqualifiedPartnersCount: disqualifiedPartners.length,
      recommendedPartner: safePartners[0] || null,
      eligiblePartners: safePartners,
      safetyAuditLog: {
        npaCutoffPercent: 7.0,
        overdueCutoffPercent: 12.0,
        maxFundExhaustionPercent: 95.0,
        disclaimer:
          'Directory facts (agency, address, contacts) are sourced from the official MoSJE Channelizing Agencies list. NPA/overdue/fund telemetry is demo-simulated (flagged health_data_source=SIMULATED_DEMO) — per-branch NPA is not regulatorily published.',
        disqualifiedList: disqualifiedPartners.map(dp => ({
          name: dp.name,
          type: dp.type,
          reasons: dp.disqualificationReasons
        }))
      }
    });
  } catch (err) {
    console.error('[Router Error]:', err);
    return res.status(500).json({ status: 'ERROR', message: err.message || 'Routing error' });
  }
});

// =============================================================================
// MODULE 4: ADMIN DASHBOARD (HUMAN-IN-THE-LOOP DATA INGESTION & VALIDATION)
// Endpoints:
//   GET  /api/v2/admin/policy-reviews
//   POST /api/v2/admin/policy-reviews/:id/adjudicate
// =============================================================================
router.get('/admin/policy-reviews', (req, res) => {
  try {
    const status = req.query.status; // optional ?status=PENDING
    const reviews = listReviews(status);
    return res.status(200).json({
      status: 'SUCCESS',
      count: reviews.length,
      reviews
    });
  } catch (err) {
    console.error('[HITL List Error]:', err);
    return res.status(500).json({ status: 'ERROR', message: err.message });
  }
});

router.post('/admin/policy-reviews/:id/adjudicate', (req, res) => {
  try {
    const { id } = req.params;
    const { action, reviewerName = 'Nodal Officer Admin', comments = '' } = req.body;

    if (!['APPROVE', 'REJECT'].includes(action)) {
      return res.status(400).json({ status: 'ERROR', message: "Action must be either 'APPROVE' or 'REJECT'." });
    }

    const result = action === 'APPROVE'
      ? approveReview(id, reviewerName, comments)
      : rejectReview(id, reviewerName, comments);

    if (!result.ok) {
      if (result.error === 'NOT_FOUND') {
        return res.status(404).json({ status: 'NOT_FOUND', message: `Review item ${id} not found.` });
      }
      return res.status(409).json({
        status: 'ERROR',
        message: `Review ${id} was already ${result.error === 'ALREADY_ADJUDICATED' ? 'adjudicated' : 'processed'}.`
      });
    }

    return res.status(200).json({
      status: 'SUCCESS',
      message: `Policy revision ${id} successfully ${result.review.reviewStatus.toLowerCase()}.` +
        (action === 'APPROVE' ? ` Live policy version bumped to NSFDC-2026.02.` : ''),
      updatedItem: result.review,
      publishedToProduction: action === 'APPROVE' && !!result.published
    });
  } catch (err) {
    console.error('[Admin Adjudication Error]:', err);
    return res.status(500).json({ status: 'ERROR', message: err.message || 'Adjudication error' });
  }
});

// =============================================================================
// MODULE 5: PROVENANCE & INGEST VISIBILITY (supports the "Verified" badges)
//   GET /api/v2/schemes        — live catalog + per-scheme source quotes
//   GET /api/v2/sources        — source registry + last fetch/hash state
//   GET /api/v2/admin/ingest-runs — audit trail of scraper runs
// =============================================================================
router.get('/schemes', (req, res) => {
  try {
    const schemes = getActiveSchemes().map(s => ({
      id: s.id,
      code: s.code,
      name: s.name,
      nameHindi: s.nameHindi,
      purpose: s.purpose,
      category: s.category,
      minCost: s.minCost,
      maxCost: s.maxCost,
      maxAbsoluteLoan: s.maxAbsoluteLoan,
      baseInterestRate: s.baseInterestRate,
      incomeCeiling: s.incomeCeiling,
      channelTypes: s.channelTypes,
      description: s.description,
      provenance: {
        officialSourceUrl: s.officialSourceUrl,
        sourceDocument: s.sourceDocument,
        sourceQuote: s.sourceQuote,
        sourcePublishedAt: s.sourcePublishedAt,
        lastVerifiedAt: s.lastVerifiedAt,
        policyVersion: s.policyVersion
      }
    }));
    res.json({ status: 'SUCCESS', count: schemes.length, schemes });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
});

router.get('/sources', (req, res) => {
  try {
    const sources = getSources().map(s => ({
      id: s.id,
      name: s.name,
      url: s.url,
      kind: s.kind,
      parser: s.parser,
      providesIncomeCeiling: !!s.provides_income_ceiling,
      cadenceHours: s.fetch_cadence_hours,
      lastFetchedAt: s.last_fetched_at,
      lastContentHash: s.last_content_hash,
      lastChangeDetectedAt: s.last_change_detected_at,
      isActive: !!s.is_active,
      scrapedPartnerRows: s.parser === 'sca-directory' ? getScrapedPartnerCount(s.id) : undefined
    }));
    res.json({ status: 'SUCCESS', count: sources.length, sources });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
});

router.get('/admin/ingest-runs', (req, res) => {
  try {
    const runs = getIngestRuns(Number(req.query.limit) || 20);
    res.json({ status: 'SUCCESS', count: runs.length, runs });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
});

// ---------------------------------------------------------------------------
// Staged directory partners: scrape -> geocode -> HITL promote/discard.
// Directory rows land in staging from the sca-directory parser; coordinates
// are filled by server/ingest/geocodePartners.js (npm run geocode).
// ---------------------------------------------------------------------------
router.get('/admin/scraped-partners', (req, res) => {
  try {
    const { geocodeStatus } = req.query;
    const rows = listScrapedPartners({ geocodeStatus });
    const byStatus = rows.reduce((acc, r) => {
      acc[r.geocodeStatus] = (acc[r.geocodeStatus] || 0) + 1;
      return acc;
    }, {});
    res.json({ status: 'SUCCESS', count: rows.length, byStatus, partners: rows });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
});

router.post('/admin/scraped-partners/:id/promote', (req, res) => {
  try {
    const { officerName } = req.body || {};
    const result = promoteScrapedPartner(Number(req.params.id), { officerName });
    if (!result.ok) {
      const message = result.error === 'NOT_FOUND'
        ? `Staged partner #${req.params.id} not found.`
        : result.error === 'ALREADY_PROMOTED'
        ? `Staged partner #${req.params.id} was already promoted to the live map.`
        : `Staged partner #${req.params.id} has no coordinates yet — geocode first.`;
      const code = result.error === 'NOT_FOUND' ? 404 : 409;
      return res.status(code).json({ status: 'ERROR', message });
    }
    res.json({
      status: 'SUCCESS',
      message: `Partner ${result.partnerId} promoted to the live channel-partner map.`,
      partnerId: result.partnerId
    });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
});

router.post('/admin/scraped-partners/batch-promote', (req, res) => {
  try {
    const { ids, officerName, filters } = req.body || {};
    let targetIds = Array.isArray(ids) ? ids : null;

    // Filter mode: e.g. { section: 'SCA' } promotes every eligible geocoded SCA row
    if (!targetIds && filters) {
      const rows = listScrapedPartners({});
      targetIds = rows
        .filter(r => r.latitude && r.geocodeStatus !== 'PROMOTED')
        .filter(r => (!filters.section || r.section === filters.section))
        .filter(r => (!filters.state || (r.state || '').toLowerCase() === String(filters.state).toLowerCase()))
        .filter(r => (!filters.minConfidence || (r.geocodeConfidence ?? 0) >= filters.minConfidence))
        .map(r => r.id);
    }

    if (!targetIds || targetIds.length === 0) {
      return res.status(400).json({
        status: 'ERROR',
        message: "Provide { ids: [...] } or { filters: { section, state, minConfidence } } to select rows."
      });
    }

    const result = batchPromoteScrapedPartners(targetIds, { officerName });
    return res.status(200).json({
      status: 'SUCCESS',
      message: `Promoted ${result.promoted.length} partner(s); skipped ${result.skipped.length}.`,
      promotedCount: result.promoted.length,
      skippedCount: result.skipped.length,
      promoted: result.promoted,
      skipped: result.skipped
    });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
});

router.post('/admin/scraped-partners/:id/discard', (req, res) => {
  try {
    const result = deleteScrapedPartner(Number(req.params.id));
    if (!result.ok) {
      return res.status(404).json({ status: 'NOT_FOUND', message: `Staged partner #${req.params.id} not found.` });
    }
    res.json({ status: 'SUCCESS', message: `Staged partner #${req.params.id} discarded.` });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
});

// ---------------------------------------------------------------------------
// In-process pipeline triggers (single-writer rule: sql.js keeps the DB in
// memory per process, so external scripts must never write while the API
// server is running). The same logic is also available as npm scripts for use
// with the server stopped:
//   npm run ingest[:offline] / npm run geocode[:offline]
// ---------------------------------------------------------------------------
let ingestJob = { running: false, lastResult: null, lastError: null, finishedAt: null };

router.post('/admin/ingest/run', (req, res) => {
  if (ingestJob.running) {
    return res.status(409).json({ status: 'ERROR', message: 'An ingest pass is already running.' });
  }
  const offline = String(req.body?.offline || process.env.INGEST_OFFLINE || '').toLowerCase() === 'true';
  ingestJob.running = true;
  runIngestOnce({ offline, log: console })
    .then((s) => { ingestJob = { running: false, lastResult: s, lastError: null, finishedAt: new Date().toISOString() }; })
    .catch((e) => { ingestJob = { running: false, lastResult: null, lastError: e.message, finishedAt: new Date().toISOString() }; });
  res.status(202).json({
    status: 'ACCEPTED',
    message: `Ingest pass started (${offline ? 'offline fixtures' : 'live fetch + fixture fallback'}). Poll GET /api/v2/admin/ingest/run for status.`,
    offline
  });
});

router.get('/admin/ingest/run', (req, res) => {
  res.json({ status: 'SUCCESS', ...ingestJob });
});

router.post('/admin/ingest/geocode', async (req, res) => {
  const offline = String(req.body?.offline ?? 'true').toLowerCase() === 'true';
  if (ingestJob.running) {
    return res.status(409).json({ status: 'ERROR', message: 'Another pipeline job is already running.' });
  }
  if (!offline) {
    // Live Nominatim over 50+ rows takes ~1s/row — exceed typical proxies.
    // Return 202 and let the job run in the background, same as ingest.
    ingestJob.running = true;
    geocodeStagedPartners({ offline: false, log: console })
      .then((s) => { ingestJob = { running: false, lastResult: s, lastError: null, finishedAt: new Date().toISOString() }; })
      .catch((e) => { ingestJob = { running: false, lastResult: null, lastError: e.message, finishedAt: new Date().toISOString() }; });
    return res.status(202).json({ status: 'ACCEPTED', message: 'Live geocoding started (Nominatim 1 req/s). Poll GET /api/v2/admin/ingest/run.' });
  }
  try {
    const summary = await geocodeStagedPartners({ offline: true, log: console });
    res.json({ status: 'SUCCESS', summary });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
});

// =============================================================================
// MODULE 6: BENEFICIARY PASSPORTS — saved v2 journey snapshots
//   POST   /api/v2/passports              — save a journey (scheme + partner + financials)
//   GET    /api/v2/passports              — list (optional ?status=)
//   GET    /api/v2/passports/:id          — fetch one
//   PATCH  /api/v2/passports/:id/status   — officer workflow transitions
// =============================================================================
router.post('/passports', (req, res) => {
  try {
    const body = req.body || {};

    // Spam protection: hidden honeypot field must stay empty (bots fill it)
    if (body.website) {
      return res.status(400).json({ status: 'ERROR', message: 'Submission rejected.' });
    }

    // DPDP data-minimization: strip anything beyond the allowed whitelist
    const b = body.beneficiary || {};
    body.beneficiary = {
      name: typeof b.name === 'string' ? b.name.slice(0, 80) : undefined,
      gender: b.gender,
      district: typeof b.district === 'string' ? b.district.slice(0, 60) : undefined,
      incomeLevel: Number(b.incomeLevel) || undefined,
      consentGiven: !!b.consentGiven
    };

    if (!body.beneficiary.consentGiven) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Please tick the consent box so we are allowed to save this summary (DPDP Act requirement).'
      });
    }

    const passport = insertBeneficiaryPassport(body);
    res.status(201).json({ status: 'SUCCESS', passport, totalPassports: listBeneficiaryPassports({}).length });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
});

router.get('/passports', (req, res) => {
  try {
    const passports = listBeneficiaryPassports({ status: req.query.status });
    res.json({ status: 'SUCCESS', count: passports.length, passports });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
});

router.get('/passports/:id', (req, res) => {
  try {
    const passport = getBeneficiaryPassport(req.params.id);
    if (!passport) return res.status(404).json({ status: 'NOT_FOUND', message: `Passport ${req.params.id} not found.` });
    res.json({ status: 'SUCCESS', passport });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
});

router.patch('/passports/:id/status', (req, res) => {
  try {
    const { status, officerName, note } = req.body || {};
    const result = updateBeneficiaryPassportStatus(req.params.id, status, { officerName, note });
    if (!result.ok) {
      const code = result.error === 'NOT_FOUND' ? 404 : 400;
      return res.status(code).json({
        status: 'ERROR',
        message: result.error === 'NOT_FOUND'
          ? `Passport ${req.params.id} not found.`
          : result.detail || `Invalid status transition.`
      });
    }
    res.json({ status: 'SUCCESS', passport: result.passport });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
});

export default router;
