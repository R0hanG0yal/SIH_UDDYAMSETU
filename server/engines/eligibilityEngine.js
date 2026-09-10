// Refined Multi-Scheme Eligibility Engine & "Bridge to Eligibility" Roadmap Generator
// Evaluates National Government Schemes across MoMSME, MoF, MoFPI, MoHUA, MoSJE, MoMA, MoFAHD

import { NATIONAL_SCHEMES } from '../data/nationalSchemes.js';

export function evaluateNationalSchemes(profile) {
  const cost = Number(profile.projectCost) || 100000;
  const income = Number(profile.annualIncome) || 180000;
  const purpose = profile.purpose || "business";
  const categoryName = (profile.categoryName || "").toLowerCase();
  
  // Affirmative markers
  const isFemale = profile.gender === "female";
  const socialCategory = (profile.socialCategory || (profile.isSC ? "SC" : "General")).toUpperCase();
  const isSC = socialCategory === "SC" || Boolean(profile.isSC);
  const isST = socialCategory === "ST";
  const isOBC = socialCategory === "OBC";
  const isMinority = socialCategory === "MINORITY" || Boolean(profile.isMinority);
  const isSpecialCategory = isFemale || isSC || isST || isOBC || isMinority || Boolean(profile.isRural);
  const isRural = Boolean(profile.isRural !== undefined ? profile.isRural : true);
  const isPWD = Boolean(profile.isPWD);

  // Sector identification
  const isFoodProcessing = categoryName.includes("food") || categoryName.includes("bakery") || categoryName.includes("spice") || categoryName.includes("flour") || categoryName.includes("chakk") || categoryName.includes("dairy") || categoryName.includes("oil") || categoryName.includes("pickle") || categoryName.includes("masala");
  const isLivestock = categoryName.includes("goat") || categoryName.includes("poultry") || categoryName.includes("sheep") || categoryName.includes("dairy") || categoryName.includes("pashupalan") || categoryName.includes("animal");
  const isTraditionalArtisan = categoryName.includes("silai") || categoryName.includes("tailor") || categoryName.includes("carpenter") || categoryName.includes("blacksmith") || categoryName.includes("cobbler") || categoryName.includes("mason") || categoryName.includes("potter") || categoryName.includes("barber") || categoryName.includes("vishwa");
  const isStreetVendor = categoryName.includes("cart") || categoryName.includes("vendor") || categoryName.includes("chai") || categoryName.includes("tea") || categoryName.includes("rehdi") || categoryName.includes("street");

  const matchedSchemes = [];
  const nearFitSchemes = [];
  const ineligibleSchemes = [];

  for (const scheme of NATIONAL_SCHEMES) {
    const passedRules = [];
    const failedRules = [];
    let isFit = true;

    // 1. Purpose Filter
    if (scheme.purpose !== purpose) {
      isFit = false;
      failedRules.push(`Scheme is for ${scheme.purpose}, while your application is for ${purpose}.`);
    } else {
      passedRules.push(`Purpose aligns with ${scheme.category}.`);
    }

    // 2. Cost Bounds
    if (cost < scheme.minCost) {
      isFit = false;
      failedRules.push(`Project cost (₹${cost.toLocaleString('en-IN')}) is below minimum limit (₹${scheme.minCost.toLocaleString('en-IN')}).`);
    } else if (cost > scheme.maxCost) {
      isFit = false;
      failedRules.push(`Project cost (₹${cost.toLocaleString('en-IN')}) exceeds scheme limit (₹${scheme.maxCost.toLocaleString('en-IN')}).`);
    } else {
      passedRules.push(`Project valuation (₹${cost.toLocaleString('en-IN')}) fits within permissible bounds (₹${scheme.minCost.toLocaleString('en-IN')} - ₹${scheme.maxCost.toLocaleString('en-IN')}).`);
    }

    // 3. Scheme-specific rules
    // PMEGP
    if (scheme.id === "GOI_PMEGP") {
      passedRules.push("Universal citizen scheme: Open to all Indian entrepreneurs setting up micro-enterprises.");
      if (isRural) {
        passedRules.push("Rural / Gram Panchayat area unlocks maximum 35% non-repayable cash subsidy tier.");
      } else {
        passedRules.push("Urban enterprise area qualifies for 15% to 25% non-repayable cash subsidy.");
      }
    }

    // PMFME (Food Processing)
    if (scheme.id === "GOI_PMFME") {
      if (isFoodProcessing) {
        passedRules.push("Enterprise sector identified as micro food processing (entitled to 35% capital cash grant up to ₹10 Lakh).");
      } else {
        isFit = false;
        failedRules.push("PMFME is earmarked for food processing, flour mills, spice grinding, bakeries, or dairy value addition.");
      }
    }

    // PM-VishwaKarma
    if (scheme.id === "GOI_PM_VISHWAKARMA") {
      if (isTraditionalArtisan) {
        passedRules.push("Trade identified as recognized traditional craft eligible for ₹15,000 toolkit e-voucher and flat 5.0% interest.");
      } else {
        isFit = false;
        failedRules.push("Specifically designated for 18 traditional crafts (tailors, carpenters, masons, cobblers, blacksmiths).");
      }
    }

    // Stand-Up India
    if (scheme.id === "GOI_STANDUP_INDIA") {
      if (cost < 1000000) {
        isFit = false;
        failedRules.push("Stand-Up India is for greenfield projects requiring ₹10 Lakh to ₹1 Crore.");
      } else {
        passedRules.push("Investment scales within greenfield project window (₹10L to ₹1Cr).");
      }

      if (!isFemale && !isSC && !isST) {
        isFit = false;
        failedRules.push("Requires either a Woman entrepreneur or SC/ST founder (or 51% shareholding in partnership).");
      } else {
        passedRules.push("Founder meets woman or affirmative criteria.");
      }
    }

    // PM SVANidhi
    if (scheme.id === "GOI_PM_SVANIDHI") {
      if (isStreetVendor || cost <= 50000) {
        passedRules.push("Micro-vendor / street entrepreneur working capital scheme with 7% interest subvention.");
      } else {
        isFit = false;
        failedRules.push("Designed for micro street vending up to ₹50,000.");
      }
    }

    // NSFDC (SC Community)
    if (scheme.id === "NSFDC_CONCESSIONAL_CORE") {
      if (!isSC) {
        isFit = false;
        failedRules.push("Concessional corporation financing is specifically earmarked for SC community members. Universal schemes (PMEGP, MUDRA) offer equal or higher benefits without community restrictions.");
      } else {
        passedRules.push("Scheduled Caste affirmative social finance verified.");
      }

      if (income > 500000) {
        isFit = false;
        failedRules.push(`Annual family income (₹${income.toLocaleString('en-IN')}) exceeds ₹5 Lakh threshold.`);
      } else {
        passedRules.push("Annual family income is within ₹5,00,000 ceiling.");
      }
    }

    // NBCFDC (OBC Community)
    if (scheme.id === "NBCFDC_OBC_FINANCE") {
      if (!isOBC) {
        isFit = false;
        failedRules.push("Concessional credit specifically earmarked for Other Backward Classes (OBC) entrepreneurs.");
      } else {
        passedRules.push("OBC community affirmative eligibility verified.");
      }

      if (income > 300000) {
        isFit = false;
        failedRules.push(`Family income exceeds ₹3,00,000 ceiling for NBCFDC.`);
      } else {
        passedRules.push("Family income within ₹3,00,000 ceiling.");
      }
    }

    // NMDFC (Minority Community)
    if (scheme.id === "NMDFC_MINORITY_FINANCE") {
      if (!isMinority) {
        isFit = false;
        failedRules.push("Specifically earmarked for notified minority communities (Muslim, Christian, Sikh, Buddhist, Jain, Parsi).");
      } else {
        passedRules.push("Minority community self-employment financing verified.");
      }

      if (income > 600000) {
        isFit = false;
        failedRules.push("Family income exceeds ₹6 Lakh ceiling.");
      } else {
        passedRules.push("Family income within ₹6,00,000 ceiling.");
      }
    }

    // ================================================================
    // MoSJE / NSFDC SCHEME-SPECIFIC RULES
    // ================================================================

    // NSFDC Term Loan — SC/ST only, income ≤ ₹3 Lakh
    if (scheme.id === "MOSJE_NSFDC_TERM_LOAN") {
      if (!isSC && !isST) {
        isFit = false;
        failedRules.push("NSFDC Term Loan is exclusively for Scheduled Caste (SC) and Scheduled Tribe (ST) entrepreneurs.");
      } else {
        passedRules.push("SC/ST social category verified — eligible for NSFDC concessional financing at 6% p.a.");
      }
      if (income > 300000) {
        isFit = false;
        failedRules.push(`Annual family income (₹${income.toLocaleString('en-IN')}) exceeds NSFDC ceiling of ₹3,00,000.`);
      } else {
        passedRules.push("Annual family income within NSFDC ₹3,00,000 ceiling.");
      }
      if (isPWD) passedRules.push("PWD applicant — eligible for priority processing and additional interest rebate.");
    }

    // NSFDC Micro Credit — SC women via SHGs only
    if (scheme.id === "MOSJE_NSFDC_MICRO_CREDIT") {
      if (!isSC) {
        isFit = false;
        failedRules.push("NSFDC Micro Credit is exclusively for Scheduled Caste (SC) women through Self-Help Groups.");
      } else {
        passedRules.push("SC social category verified for NSFDC Micro Credit.");
      }
      if (!isFemale) {
        isFit = false;
        failedRules.push("This scheme is specifically for women entrepreneurs operating through SHGs.");
      } else {
        passedRules.push("Female beneficiary — eligible for SC Women SHG Micro Credit at 5% p.a.");
      }
      if (income > 300000) {
        isFit = false;
        failedRules.push(`Family income (₹${income.toLocaleString('en-IN')}) exceeds ₹3,00,000 ceiling.`);
      } else {
        passedRules.push("Family income within ₹3,00,000 threshold.");
      }
    }

    // NSFDC Education Loan — SC only, education purpose
    if (scheme.id === "MOSJE_NSFDC_EDUCATION") {
      if (!isSC) {
        isFit = false;
        failedRules.push("NSFDC Education Loan is exclusively for SC students.");
      } else {
        passedRules.push("SC category verified — eligible for education loan at 4% p.a.");
      }
      if (purpose !== "education") {
        isFit = false;
        failedRules.push("This loan is for education/professional course purposes only, not business.");
      } else {
        passedRules.push("Purpose aligns — education/professional course.");
      }
      if (income > 300000) {
        isFit = false;
        failedRules.push(`Family income exceeds ₹3,00,000 ceiling.`);
      } else {
        passedRules.push("Family income within NSFDC threshold.");
      }
    }

    // VCF-SC — SC entrepreneurs, larger projects
    if (scheme.id === "MOSJE_VCF_SC") {
      if (!isSC) {
        isFit = false;
        failedRules.push("VCF-SC is exclusively for SC entrepreneurs setting up manufacturing or service enterprises.");
      } else {
        passedRules.push("SC category verified — eligible for equity-like venture capital (0% interest, revenue sharing).");
      }
      if (cost < 500000) {
        isFit = false;
        failedRules.push(`Project cost (₹${cost.toLocaleString('en-IN')}) is below VCF-SC minimum of ₹5,00,000.`);
      } else {
        passedRules.push(`Project scale (₹${cost.toLocaleString('en-IN')}) qualifies for VCF-SC venture funding.`);
      }
    }

    // PM-DAKSH — SC/ST/OBC, skill training (always matches for those categories)
    if (scheme.id === "MOSJE_PM_DAKSH") {
      if (!isSC && !isST && !isOBC) {
        isFit = false;
        failedRules.push("PM-DAKSH is designated for SC/ST/OBC communities and Safai Karamcharis.");
      } else {
        passedRules.push("SC/ST/OBC category verified — eligible for 100% free skill training + ₹3,000/month stipend.");
      }
    }

    // NLM (Livestock)
    if (scheme.id === "GOI_NLM_LIVESTOCK") {
      if (isLivestock) {
        passedRules.push("Livestock / animal husbandry venture eligible for 50% capital subsidy (up to ₹25 Lakh).");
      } else {
        isFit = false;
        failedRules.push("National Livestock Mission is designated for animal husbandry, goat farming, sheep, or poultry.");
      }
    }

    // Financial Advantage Computations
    const fundingPercent = scheme.maxFundingPercent || 90;
    const maxFunding = Math.min((fundingPercent / 100) * cost, scheme.maxCost);
    const ownEquity = Math.max(0, cost - maxFunding);

    // Direct Government Capital Subsidy calculation
    let directSubsidyPercent = 0;
    let directSubsidyAmount = 0;

    if (scheme.id === "GOI_PMEGP" && scheme.subsidyMatrix) {
      if (isSpecialCategory || isFemale || isSC || isST || isOBC) {
        directSubsidyPercent = isRural ? scheme.subsidyMatrix.specialRural : scheme.subsidyMatrix.specialUrban;
      } else {
        directSubsidyPercent = isRural ? scheme.subsidyMatrix.generalRural : scheme.subsidyMatrix.generalUrban;
      }
      directSubsidyAmount = Math.round((directSubsidyPercent / 100) * cost);
    } else if (scheme.directSubsidyPercent) {
      directSubsidyPercent = scheme.directSubsidyPercent;
      directSubsidyAmount = Math.min(Math.round((directSubsidyPercent / 100) * cost), scheme.maxSubsidyAmount || 9999999);
    }

    // Effective Interest Rate (accounting for women rebates)
    let effectiveInterestRate = scheme.interestRatePercent || 8.5;
    if (isFemale && scheme.genderRebatePercent) {
      effectiveInterestRate = Math.max(2.0, effectiveInterestRate - scheme.genderRebatePercent);
    }

    const assessment = {
      ...scheme,
      passedRules,
      failedRules,
      eligibleFunding: Math.round(maxFunding),
      ownEquity: Math.round(ownEquity),
      directSubsidyPercent,
      directSubsidyAmount,
      effectiveInterestRate
    };

    if (isFit) {
      matchedSchemes.push(assessment);
    } else if (failedRules.length === 1 || (failedRules.length <= 2 && scheme.bridgeSteps)) {
      nearFitSchemes.push(assessment);
    } else {
      ineligibleSchemes.push(assessment);
    }
  }

  // Sort matched schemes by Highest Government Benefit:
  // 1. Higher direct non-repayable grant first!
  // 2. Lower effective interest rate second!
  matchedSchemes.sort((a, b) => {
    if (b.directSubsidyAmount !== a.directSubsidyAmount) {
      return b.directSubsidyAmount - a.directSubsidyAmount;
    }
    return a.effectiveInterestRate - b.effectiveInterestRate;
  });

  // Actionable Bridge Roadmaps
  const bridgeRoadmaps = generateBridgeRoadmaps(nearFitSchemes, profile);

  return {
    evaluatedAt: new Date().toISOString(),
    profileSummary: {
      categoryName: profile.categoryName,
      projectCost: cost,
      annualIncome: income,
      purpose,
      gender: profile.gender || "female",
      isSC,
      isRural
    },
    totalMatched: matchedSchemes.length,
    matchedSchemes,
    nearFitSchemes,
    ineligibleSchemes,
    bridgeRoadmaps
  };
}

function generateBridgeRoadmaps(nearFitSchemes, profile) {
  const roadmaps = [];

  for (const scheme of nearFitSchemes) {
    const actionableSteps = [];

    if (scheme.id === "GOI_PMEGP") {
      actionableSteps.push({
        actionTitle: "Unlock Up to 35% Direct Cash Subsidy (₹" + Math.round(0.35 * profile.projectCost).toLocaleString('en-IN') + ")",
        actionDetail: "Enroll in the free 5-day online Entrepreneurship Development Program (EDP) at udyamiedp.org.in. Once completed, your project unlocks the full non-repayable margin money grant.",
        externalLink: "https://www.udyamiedp.org.in",
        timeToComplete: "5 Days (Online)",
        cost: "₹0 (Free)"
      });
    }

    if (scheme.id === "GOI_PMFME") {
      actionableSteps.push({
        actionTitle: "Claim 35% Capital Subsidy up to ₹10 Lakh for Food Businesses",
        actionDetail: "If your enterprise involves baking, flour mill, spice grinding, packaging, oil extraction, or dairy products, submit your machinery quotation on the PMFME portal to unlock a 35% direct cash grant.",
        externalLink: "https://pmfme.mofpi.gov.in",
        timeToComplete: "3 Days",
        cost: "₹0 (Free)"
      });
    }

    if (scheme.id === "GOI_PM_VISHWAKARMA") {
      actionableSteps.push({
        actionTitle: "Claim ₹15,000 Free Toolkit Grant & 5% Concessional Rate",
        actionDetail: "Visit your nearest Common Service Centre (CSC) with Aadhaar to verify your tailoring, carpentry, masonry, or footwear repair trade under the PM-VishwaKarma portal.",
        externalLink: "https://pmvishwakarma.gov.in",
        timeToComplete: "1 Day",
        cost: "₹0 (Free)"
      });
    }

    if (scheme.id === "GOI_CGTMSE") {
      actionableSteps.push({
        actionTitle: "Get 100% Collateral-Free Bank Guarantee (Zero Land/House Mortgage)",
        actionDetail: "Register your enterprise for free on Udyam (udyamregistration.gov.in). Banks are legally mandated not to demand property collateral for loans under CGTMSE trust cover.",
        externalLink: "https://udyamregistration.gov.in",
        timeToComplete: "5 Minutes",
        cost: "₹0 (Free)"
      });
    }

    if (scheme.id === "GOI_STANDUP_INDIA") {
      actionableSteps.push({
        actionTitle: "Unlock ₹10 Lakh to ₹1 Crore Commercial Credit Line",
        actionDetail: "If you are establishing a commercial venture above ₹10 Lakh, partner with a female co-founder (51% equity) or register on Stand-Up Mitra to secure high-ticket greenfield financing.",
        externalLink: "https://www.standupmitra.in",
        timeToComplete: "7 Days",
        cost: "₹0 (Free)"
      });
    }

    if (actionableSteps.length > 0) {
      roadmaps.push({
        schemeId: scheme.id,
        schemeName: scheme.name,
        targetBenefit: scheme.directSubsidyAmount > 0 
          ? `Unlock ₹${scheme.directSubsidyAmount.toLocaleString('en-IN')} Direct Non-Repayable Cash Grant`
          : `Unlock ${scheme.effectiveInterestRate}% Concessional Interest Rate`,
        actionableSteps
      });
    }
  }

  return roadmaps;
}
