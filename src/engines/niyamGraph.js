// NiyamGraph: Authoritative Policy-as-Code Engine for NSFDC Concessional Credit
// Implements effective-dated policy rules, transparent decision tracing, and "why matched" / "why not" analytics.

import { SCHEMES, POLICY_METADATA, ALTERNATIVE_NON_CONCESSIONAL } from '../data/schemes';

/**
 * Evaluates citizen profile against all effective-dated schemes in NiyamGraph.
 * Returns deterministic decision trace, primary match, alternates, and rejected reasons.
 */
export function evaluatePolicyRules(profile, policyOverride = null) {
  const metadata = policyOverride?.metadata || POLICY_METADATA;
  const activeSchemes = policyOverride?.schemes || SCHEMES;

  const trace = {
    evaluatedAt: new Date().toISOString(),
    policyVersion: metadata.version,
    effectiveDate: metadata.effectiveDate,
    officialSource: metadata.regulatoryBody,
    rulesEvaluated: [],
    profileSummary: {
      purpose: profile.purpose || "business",
      categoryName: profile.categoryName || "General Enterprise",
      projectCost: Number(profile.projectCost) || 0,
      annualIncome: Number(profile.annualIncome) || 0,
      isSC: Boolean(profile.isSC),
      gender: profile.gender || "female",
      isConstructionOrPlantation: Boolean(profile.isConstructionOrPlantation)
    }
  };

  const cost = Number(profile.projectCost) || 0;
  const income = Number(profile.annualIncome) || 0;
  const isSC = Boolean(profile.isSC);
  const purpose = profile.purpose || "business";

  // Global Hard Eligibility Rule 1: Project cost > 0
  const costPositive = cost > 0;
  trace.rulesEvaluated.push({
    ruleId: "RULE_VALID_COST",
    ruleName: "Valid Project Investment Requirement",
    passed: costPositive,
    detail: costPositive ? `Project cost ₹${cost.toLocaleString('en-IN')} is valid.` : `Project cost must be greater than ₹0.`
  });

  if (!costPositive) {
    return {
      status: "INVALID_INPUT",
      message: "Please specify a project or course cost greater than ₹0.",
      primaryMatch: null,
      alternateMatches: [],
      rejectedSchemes: [],
      nextBestActions: [],
      trace
    };
  }

  // Global Hard Eligibility Rule 2: Scheduled Caste community mandate
  trace.rulesEvaluated.push({
    ruleId: "RULE_SC_MANDATE",
    ruleName: "Scheduled Caste Beneficiary Mandate",
    passed: isSC,
    detail: isSC 
      ? "Applicant confirmed Scheduled Caste (SC) category membership." 
      : "NSFDC concessional lending is legally restricted to Scheduled Caste beneficiaries."
  });

  // Global Hard Eligibility Rule 3: Annual Income Ceiling (₹5,00,000 threshold effective Jan 2026)
  const incomeEligible = income <= metadata.annualIncomeCeiling;
  trace.rulesEvaluated.push({
    ruleId: "RULE_INCOME_CEILING",
    ruleName: `Annual Family Income Threshold (≤ ₹${(metadata.annualIncomeCeiling / 100000).toFixed(0)} Lakh)`,
    passed: incomeEligible,
    detail: incomeEligible
      ? `Declared annual family income ₹${income.toLocaleString('en-IN')} is within current NSFDC ceiling of ₹${metadata.annualIncomeCeiling.toLocaleString('en-IN')}.`
      : `Declared annual family income ₹${income.toLocaleString('en-IN')} exceeds current NSFDC ceiling of ₹${metadata.annualIncomeCeiling.toLocaleString('en-IN')}.`
  });

  // If hard eligibility failed, explain why and recommend next-best actions
  if (!isSC || !incomeEligible) {
    const rejectedSchemes = activeSchemes.map(s => ({
      schemeId: s.id,
      schemeName: s.name,
      reason: !isSC 
        ? "Mandatory SC category requirement not met." 
        : `Declared annual family income (₹${income.toLocaleString('en-IN')}) exceeds current NSFDC threshold (₹${metadata.annualIncomeCeiling.toLocaleString('en-IN')}).`
    }));

    return {
      status: "INELIGIBLE_GLOBAL",
      message: !isSC
        ? "NSFDC schemes are targeted specifically to Scheduled Caste entrepreneurs. See alternative national schemes below."
        : `Your family income (₹${(income/100000).toFixed(2)}L) exceeds the ₹5 Lakh NSFDC limit. Explore general commercial credit with interest subsidy.`,
      primaryMatch: null,
      alternateMatches: [],
      rejectedSchemes,
      nextBestActions: ALTERNATIVE_NON_CONCESSIONAL,
      trace
    };
  }

  // Evaluate Scheme-specific matching
  const matchedList = [];
  const rejectedList = [];

  for (const scheme of activeSchemes) {
    const schemeReasons = [];
    let isFit = true;

    // Check Purpose
    if (scheme.purpose !== purpose) {
      isFit = false;
      schemeReasons.push(`Scheme is meant for ${scheme.purpose}, but request is for ${purpose}.`);
    }

    // Check Cost Range
    if (cost < scheme.minCost) {
      isFit = false;
      schemeReasons.push(`Project cost (₹${cost.toLocaleString('en-IN')}) is below minimum limit (₹${scheme.minCost.toLocaleString('en-IN')}).`);
    }

    if (cost > scheme.maxCost && scheme.id === "NSFDC_MICRO_FINANCE") {
      isFit = false;
      schemeReasons.push(`Project cost (₹${cost.toLocaleString('en-IN')}) exceeds Micro Finance limit of ₹1,40,000. Term Loan is required for amounts above ₹1.40 Lakh.`);
    }

    if (isFit) {
      // Calculate scheme-specific financial parameters
      const fundingCap = scheme.maxLoanAmount;
      const calculatedFunding = Math.min((scheme.maxFundingPercent / 100) * cost, fundingCap);
      const ownContribution = Math.max(cost - calculatedFunding, (scheme.minBeneficiaryContributionPercent / 100) * cost);
      
      const interestRate = (profile.gender === "female" && scheme.genderRebatePercent > 0)
        ? (scheme.interestRatePercent - scheme.genderRebatePercent)
        : scheme.interestRatePercent;

      const moratorium = (profile.isConstructionOrPlantation && scheme.moratoriumExtendedMonths)
        ? scheme.moratoriumExtendedMonths
        : scheme.moratoriumMonths;

      matchedList.push({
        ...scheme,
        effectiveInterestRate: interestRate,
        applicableMoratorium: moratorium,
        calculatedFunding,
        ownContribution,
        matchedReason: `Project cost ₹${cost.toLocaleString('en-IN')} falls within ${scheme.name} bounds (₹${scheme.minCost.toLocaleString('en-IN')} - ₹${scheme.maxCost.toLocaleString('en-IN')}). Income within current threshold.`
      });
    } else {
      rejectedList.push({
        schemeId: scheme.id,
        schemeName: scheme.name,
        schemeCode: scheme.code,
        reasons: schemeReasons
      });
    }
  }

  // Select Primary Match and Alternates
  let primaryMatch = null;
  const alternateMatches = [];

  if (matchedList.length > 0) {
    // If Micro Finance matched, check if Aajeevika also matched.
    // Prefer Micro Finance through SCA (6.5% interest) over Aajeevika MFI (15% interest).
    const mfs = matchedList.find(s => s.id === "NSFDC_MICRO_FINANCE");
    const aajeevika = matchedList.find(s => s.id === "NSFDC_AAJEEVIKA");
    const termLoan = matchedList.find(s => s.id === "NSFDC_TERM_LOAN");
    const educationLoan = matchedList.find(s => s.id === "NSFDC_EDUCATION_LOAN");
    const udyamNidhi = matchedList.find(s => s.id === "NSFDC_UDYAM_NIDHI");

    if (purpose === "education") {
      primaryMatch = educationLoan || matchedList[0];
    } else if (cost <= 140000) {
      primaryMatch = mfs || matchedList[0];
      if (aajeevika) {
        alternateMatches.push({
          ...aajeevika,
          comparisonNote: "Aajeevika allows rapid disbursement through NBFC-MFIs, but carries a higher interest rate of 15% vs 6.5% for Micro Finance Scheme."
        });
      }
      if (udyamNidhi && cost >= 50000) {
        alternateMatches.push(udyamNidhi);
      }
    } else {
      primaryMatch = termLoan || matchedList[0];
      if (udyamNidhi && cost <= 500000) {
        alternateMatches.push(udyamNidhi);
      }
    }

    // Add remaining matched as alternates
    for (const item of matchedList) {
      if (item.id !== primaryMatch?.id && !alternateMatches.some(a => a.id === item.id)) {
        alternateMatches.push(item);
      }
    }
  }

  return {
    status: primaryMatch ? "MATCH_FOUND" : "NO_SCHEME_MATCH",
    primaryMatch,
    alternateMatches,
    rejectedSchemes: rejectedList,
    nextBestActions: [],
    trace
  };
}
