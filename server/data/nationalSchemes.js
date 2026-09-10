// Comprehensive Catalog of National Enterprise Schemes (Ministry Level)
// Sources: Ministry of MSME, Ministry of Finance, MoHUA, MoSJE, MoFPI, MoFAHD, SIDBI, KVIC

export const NATIONAL_SCHEMES = [
  // 1. PMEGP (Prime Minister's Employment Generation Programme)
  {
    id: "GOI_PMEGP",
    code: "PMEGP-01",
    name: "Prime Minister's Employment Generation Programme (PMEGP)",
    nameHindi: "प्रधानमंत्री रोजगार सृजन कार्यक्रम (PMEGP)",
    ministry: "Ministry of MSME & KVIC Nodal",
    portalUrl: "https://www.kviconline.gov.in/pmegp",
    category: "Universal Credit-Linked Capital Subsidy",
    purpose: "business",
    sectors: ["Manufacturing", "Services", "Food Processing", "Agro"],
    minCost: 50000,
    maxCost: 5000000, // ₹50 Lakh for manufacturing, ₹20 Lakh for service
    maxFundingPercent: 90,
    minOwnContributionPercent: 10,
    interestRatePercent: 9.0,
    subsidyMatrix: {
      generalUrban: 15,
      generalRural: 25,
      specialUrban: 25,
      specialRural: 35
    },
    moratoriumMonths: 6,
    repaymentTenureYears: 7,
    repaymentCadence: "quarterly",
    summary: "Up to 35% non-repayable direct cash grant (margin money) for setting up new manufacturing or service micro-enterprises.",
    summaryHindi: "विनिर्माण (₹50 लाख तक) व सेवा इकाइयों (₹20 लाख तक) हेतु सरकार द्वारा 15% से 35% तक का सीधा गैर-वापसी नकद अनुदान।",
    requiredDocuments: [
      { id: "aadhaar", label: "Aadhaar Card", mandatory: true },
      { id: "pan", label: "PAN Card", mandatory: true },
      { id: "dpr", label: "Project Profile / DPR", mandatory: true },
      { id: "bank_passbook", label: "Bank Account Passbook", mandatory: true },
      { id: "edp_cert", label: "EDP Training Certificate (5-day online free via udyamiedp.org.in)", mandatory: false }
    ],
    eligibilityRules: {
      minAge: 18,
      educationEighthPassForHighCost: true, // Only if project > ₹10L mfg or > ₹5L service
      onlyNewGreenfield: true
    },
    bridgeSteps: [
      "If you haven't done EDP training, complete the free 5-day online course on udyamiedp.org.in to unlock instant subsidy disbursement.",
      "Ensure your project quotation specifies machinery invoices and working capital details.",
      "Rural location grants an additional 10% cash subsidy (boosting total subsidy to 35%)."
    ]
  },

  // 2. PMMY MUDRA (Pradhan Mantri MUDRA Yojana)
  {
    id: "GOI_PMMY_MUDRA",
    code: "PMMY-02",
    name: "Pradhan Mantri MUDRA Yojana (PMMY)",
    nameHindi: "प्रधानमंत्री मुद्रा योजना (PMMY)",
    ministry: "Ministry of Finance (DFS)",
    portalUrl: "https://www.mudra.org.in",
    category: "100% Collateral-Free Enterprise Refinance",
    purpose: "business",
    sectors: ["Retail", "Services", "Manufacturing", "Transport", "Food Processing"],
    minCost: 10000,
    maxCost: 2000000, // Tarun Plus up to ₹20 Lakh
    maxFundingPercent: 95,
    minOwnContributionPercent: 5,
    interestRatePercent: 8.5,
    tiers: [
      { tier: "Shishu", max: 50000, collateralFree: true },
      { tier: "Kishore", min: 50001, max: 500000, collateralFree: true },
      { tier: "Tarun", min: 500001, max: 1000000, collateralFree: true },
      { tier: "Tarun Plus", min: 1000001, max: 2000000, collateralFree: true }
    ],
    moratoriumMonths: 3,
    repaymentTenureYears: 5,
    repaymentCadence: "monthly",
    summary: "100% collateral-free institutional credit up to ₹20 Lakh for small shops, traders, artisans, transport operators, and micro-manufacturers.",
    summaryHindi: "बिना किसी गारंटी या गिरवी के ₹20 लाख तक का सुलभ बैंक ऋण (शिशु, किशोर, तरुण व तरुण प्लस)।",
    requiredDocuments: [
      { id: "aadhaar", label: "Aadhaar Card", mandatory: true },
      { id: "pan", label: "PAN Card / Form 60", mandatory: true },
      { id: "bank_passbook", label: "6-Month Bank Statement", mandatory: true },
      { id: "quotation", label: "Quotation / Purchase Bill of Machinery", mandatory: false }
    ],
    eligibilityRules: {
      minAge: 18,
      noCollateralRequired: true,
      incomeCeiling: null
    },
    bridgeSteps: [
      "Open a basic savings or current account in any Public Sector Bank (SBI, PNB, BoB).",
      "Prepare a list of equipment or inventory to be purchased.",
      "Repaying Shishu (₹50K) on time automatically qualifies you for Kishore (₹5 Lakh) without additional paperwork."
    ]
  },

  // 3. PM-VishwaKarma Scheme
  {
    id: "GOI_PM_VISHWAKARMA",
    code: "PMVK-03",
    name: "PM-VishwaKarma Central Sector Scheme",
    nameHindi: "पीएम विश्वकर्मा योजना (कारीगर व शिल्पकार)",
    ministry: "Ministry of MSME & Ministry of Skill Development",
    portalUrl: "https://pmvishwakarma.gov.in",
    category: "Artisan & Traditional Craftsman Credit + Toolkit",
    purpose: "business",
    sectors: ["Artisan", "Handicraft", "Tailoring", "Carpentry", "Masonry", "Blacksmith", "Barber", "Footwear"],
    minCost: 15000,
    maxCost: 300000, // ₹1 Lakh tranche 1 + ₹2 Lakh tranche 2
    maxFundingPercent: 100,
    minOwnContributionPercent: 0,
    interestRatePercent: 5.0, // Subsidized flat 5%
    toolKitVoucherAmount: 15000,
    stipendPerDay: 500,
    moratoriumMonths: 3,
    repaymentTenureYears: 3,
    repaymentCadence: "monthly",
    summary: "Holistic institutional support for 18 traditional artisan trades: ₹15,000 free modern tool kit grant + 5% flat concessional interest loan.",
    summaryHindi: "18 पारंपरिक व्यवसायों (सिलाई, बढ़ई, राजमिस्त्री आदि) के लिए ₹15,000 का मुफ्त आधुनिक टूलकिट वाउचर और 5% रियायती ब्याज पर ₹3 लाख तक ऋण।",
    requiredDocuments: [
      { id: "aadhaar", label: "Aadhaar Card (Biometric verified)", mandatory: true },
      { id: "bank_passbook", label: "Bank Account Details", mandatory: true },
      { id: "ration_card", label: "Ration Card / Family Proof", mandatory: false }
    ],
    eligibilityRules: {
      minAge: 18,
      traditionalTradesOnly: true,
      oneFamilyOneBenefit: true
    },
    bridgeSteps: [
      "Visit your nearest Common Service Centre (CSC) with Aadhaar for free biometric verification.",
      "Attend the 5-7 day basic skill training workshop (receives ₹500/day direct stipend).",
      "Receive ₹15,000 e-voucher on your mobile to purchase modern ISO-certified toolkits."
    ]
  },

  // 4. PMFME (PM Formalisation of Micro Food Processing Enterprises)
  {
    id: "GOI_PMFME",
    code: "PMFME-04",
    name: "PM Formalisation of Micro Food Processing Enterprises (PMFME)",
    nameHindi: "प्रधानमंत्री सूक्ष्म खाद्य उद्योग उन्नयन योजना (PMFME)",
    ministry: "Ministry of Food Processing Industries (MoFPI)",
    portalUrl: "https://pmfme.mofpi.gov.in",
    category: "35% Credit-Linked Food Industry Capital Subsidy",
    purpose: "business",
    sectors: ["Food Processing", "Bakery", "Spices", "Dairy", "Pickle", "Flour Mill", "Oil Extraction"],
    minCost: 50000,
    maxCost: 3000000, // 35% subsidy capped at ₹10 Lakh
    maxFundingPercent: 90,
    minOwnContributionPercent: 10,
    interestRatePercent: 8.5,
    directSubsidyPercent: 35,
    maxSubsidyAmount: 1000000, // ₹10 Lakh maximum non-repayable grant
    moratoriumMonths: 6,
    repaymentTenureYears: 6,
    repaymentCadence: "quarterly",
    summary: "35% direct credit-linked capital cash grant (up to ₹10 Lakh) for establishing or upgrading food processing units (bakeries, flour mills, spice grinding, packaging).",
    summaryHindi: "खाद्य प्रसंस्करण इकाइयों (आटा चक्की, मसाला पिसाई, बेकरी, अचार, तेल मिल) हेतु 35% (अधिकतम ₹10 लाख) का सीधा सरकारी अनुदान।",
    requiredDocuments: [
      { id: "aadhaar", label: "Aadhaar Card", mandatory: true },
      { id: "fssai", label: "Basic FSSAI Registration / Application", mandatory: false },
      { id: "dpr", label: "Food Machinery Quotation", mandatory: true },
      { id: "bank_passbook", label: "Bank Passbook", mandatory: true }
    ],
    eligibilityRules: {
      minAge: 18,
      foodSectorOnly: true
    },
    bridgeSteps: [
      "Get free FSSAI basic registration online on foscos.fssai.gov.in (cost ₹100).",
      "Get a machinery quotation from a food equipment vendor (mixers, grinders, packaging).",
      "Apply through the centralized PMFME portal to receive a 35% non-repayable capital credit."
    ]
  },

  // 5. Stand-Up India
  {
    id: "GOI_STANDUP_INDIA",
    code: "STANDUP-05",
    name: "Stand-Up India Scheme (Greenfield MSME)",
    nameHindi: "स्टैंड-अप इंडिया योजना (महिला व SC/ST उद्यमी)",
    ministry: "Ministry of Finance & SIDBI",
    portalUrl: "https://www.standupmitra.in",
    category: "Commercial Enterprise Credit",
    purpose: "business",
    sectors: ["Manufacturing", "Services", "Trading", "Agro"],
    minCost: 1000000, // ₹10 Lakh minimum
    maxCost: 10000000, // ₹1 Crore maximum
    maxFundingPercent: 85,
    minOwnContributionPercent: 15,
    interestRatePercent: 7.5,
    moratoriumMonths: 18,
    repaymentTenureYears: 7,
    repaymentCadence: "quarterly",
    summary: "Bank loans between ₹10 Lakh and ₹1 Crore for greenfield commercial enterprises, specifically earmarked for women and SC/ST entrepreneurs.",
    summaryHindi: "महिला एवं अनुसूचित जाति/जनजाति उद्यमियों के नए बड़े उद्यमों हेतु ₹10 लाख से ₹1 करोड़ तक का बैंक ऋण (18 माह ग्रेस अवधि)।",
    requiredDocuments: [
      { id: "aadhaar", label: "Aadhaar Card", mandatory: true },
      { id: "pan", label: "PAN Card", mandatory: true },
      { id: "caste_cert", label: "SC/ST Certificate (or Woman Entrepreneur)", mandatory: true },
      { id: "dpr", label: "Detailed Project Report (DPR)", mandatory: true },
      { id: "land_proof", label: "Lease or Ownership Proof of Unit Site", mandatory: true }
    ],
    eligibilityRules: {
      minAge: 18,
      isWomanOrSCST: true,
      greenfieldOnly: true
    },
    bridgeSteps: [
      "For general category male entrepreneurs: Form a partnership firm or private limited company with at least 51% equity held by a woman co-founder to qualify!",
      "Register on standupmitra.in for handholding and connect with pre-vetted Project Appraisal agencies.",
      "Ensure the enterprise is greenfield (first-time venture in that specific sector)."
    ]
  },

  // 6. PM SVANidhi (Street Vendor's AtmaNirbhar Nidhi)
  {
    id: "GOI_PM_SVANIDHI",
    code: "SVANIDHI-06",
    name: "PM SVANidhi Micro Credit for Street Vendors",
    nameHindi: "पीएम स्वनिधि योजना (स्ट्रीट वेंडर्स/रेहड़ी-पटरी)",
    ministry: "Ministry of Housing and Urban Affairs (MoHUA)",
    portalUrl: "https://pmsvanidhi.mohua.gov.in",
    category: "Collateral-Free Micro Working Capital",
    purpose: "business",
    sectors: ["Retail", "Trading", "Street Vendor", "Food Cart"],
    minCost: 5000,
    maxCost: 50000,
    maxFundingPercent: 100,
    minOwnContributionPercent: 0,
    interestRatePercent: 7.0, // With 7% interest subsidy, effective interest is ~0%
    interestSubventionPercent: 7.0,
    digitalCashbackAnnual: 1200,
    tranches: [
      { tranche: 1, amount: 10000, tenureMonths: 12 },
      { tranche: 2, amount: 20000, tenureMonths: 18 },
      { tranche: 3, amount: 50000, tenureMonths: 36 }
    ],
    moratoriumMonths: 1,
    repaymentTenureYears: 1,
    repaymentCadence: "monthly",
    summary: "Instant working capital loans of ₹10,000, ₹20,000, and ₹50,000 with 7% interest subvention and ₹1,200 annual digital cashback for urban and peri-urban vendors.",
    summaryHindi: "रेहड़ी-पटरी वेंडर्स हेतु ₹10K, ₹20K और ₹50K का आसान ऋण, 7% ब्याज सब्सिडी और ₹1,200 वार्षिक डिजिटल कैशबैक।",
    requiredDocuments: [
      { id: "aadhaar", label: "Aadhaar Card", mandatory: true },
      { id: "vending_cert", label: "Certificate of Vending / Letter of Recommendation (LoR)", mandatory: true },
      { id: "bank_passbook", label: "Bank Account Details", mandatory: true }
    ],
    eligibilityRules: {
      minAge: 18,
      streetVendingActivity: true
    },
    bridgeSteps: [
      "If you do not have a vending ID, apply for a Letter of Recommendation (LoR) at your local Municipal Ward Counter (takes 2 days).",
      "Link your UPI QR code (PhonePe, Paytm, BHIM) to your loan account to receive ₹100 monthly cashbacks automatically.",
      "Repaying Tranche 1 on time automatically unlocks Tranche 2 (₹20,000) with zero processing charges."
    ]
  },

  // 7. CGTMSE (Credit Guarantee Fund Trust for Micro and Small Enterprises)
  {
    id: "GOI_CGTMSE",
    code: "CGTMSE-07",
    name: "CGTMSE Collateral-Free Sovereign Credit Guarantee",
    nameHindi: "क्रेडिट गारंटी फंड ट्रस्ट (CGTMSE संपार्श्विक मुक्त गारंटी)",
    ministry: "Ministry of MSME & SIDBI",
    portalUrl: "https://www.cgtmse.in",
    category: "Sovereign Loan Guarantee Cover",
    purpose: "business",
    sectors: ["Manufacturing", "Services", "Retail", "Food Processing", "Agro"],
    minCost: 100000,
    maxCost: 50000000, // Up to ₹5 Crore
    maxFundingPercent: 90,
    minOwnContributionPercent: 10,
    interestRatePercent: 8.5,
    guaranteeCoveragePercent: 85, // 85% for women/SC/ST/micro, 75% for others
    moratoriumMonths: 6,
    repaymentTenureYears: 7,
    repaymentCadence: "quarterly",
    summary: "The Government guarantees up to 85% of your bank loan up to ₹5 Crore so you do not need to pledge personal land, house, or find third-party guarantors.",
    summaryHindi: "₹5 करोड़ तक के बैंक ऋण पर सरकार द्वारा 85% तक की सुरक्षा गारंटी—जमीन, मकान या गारंटीदार की कोई आवश्यकता नहीं।",
    requiredDocuments: [
      { id: "aadhaar", label: "Aadhaar Card", mandatory: true },
      { id: "pan", label: "PAN Card", mandatory: true },
      { id: "udyam", label: "Udyam Registration Certificate (Free)", mandatory: true },
      { id: "dpr", label: "Project Financial Viability Report", mandatory: true }
    ],
    eligibilityRules: {
      udyamRegistered: true
    },
    bridgeSteps: [
      "Obtain your instant free Udyam Certificate on udyamregistration.gov.in using Aadhaar.",
      "Ask your bank branch manager to sanction the loan under CGTMSE trust guarantee rather than demanding property mortgage."
    ]
  },

  // 8. NSFDC Concessional Credit Line
  {
    id: "NSFDC_CONCESSIONAL_CORE",
    code: "NSFDC-08",
    name: "NSFDC Concessional Social Finance Credit",
    nameHindi: "राष्ट्रीय अनुसूचित जाति वित्त एवं विकास निगम (NSFDC रियायती ऋण)",
    ministry: "Ministry of Social Justice & Empowerment",
    portalUrl: "https://nsfdc.nic.in/faqs",
    category: "Targeted Concessional Social Finance",
    purpose: "business",
    sectors: ["Manufacturing", "Services", "Retail", "Transport", "Agro"],
    minCost: 10000,
    maxCost: 5000000,
    maxFundingPercent: 90,
    minOwnContributionPercent: 10,
    interestRatePercent: 6.5,
    genderRebatePercent: 0.5,
    moratoriumMonths: 3,
    repaymentTenureYears: 5,
    repaymentCadence: "quarterly",
    summary: "Dedicated concessional credit at 6.0%–6.5% interest rate for eligible SC entrepreneurs with family income up to ₹5 Lakh.",
    summaryHindi: "वार्षिक ₹5 लाख आय सीमा के भीतर केवल 6.5% रियायती ब्याज पर सूक्ष्म व सावधि ऋण सहायता।",
    requiredDocuments: [
      { id: "caste_cert", label: "SC Caste Certificate", mandatory: true },
      { id: "income_cert", label: "Income Certificate ≤ ₹5 Lakh", mandatory: true },
      { id: "aadhaar", label: "Aadhaar Card", mandatory: true },
      { id: "bank_passbook", label: "Bank Passbook", mandatory: true }
    ],
    eligibilityRules: {
      isSC: true,
      incomeCeiling: 500000
    },
    bridgeSteps: [
      "If your family income exceeds ₹5 Lakh or you belong to other categories, switch to PMEGP or MUDRA where there is no caste restriction and up to 35% subsidies exist!",
      "Submit application through your State Channelising Agency (e.g. UPSCFDC, MPVAVN) or directly via PM-SURAJ portal."
    ]
  },

  // 9. NBCFDC Concessional Credit (For OBC Entrepreneurs)
  {
    id: "NBCFDC_OBC_FINANCE",
    code: "NBCFDC-09",
    name: "NBCFDC Concessional Credit for Backward Classes",
    nameHindi: "राष्ट्रीय पिछड़ा वर्ग वित्त एवं विकास निगम (NBCFDC)",
    ministry: "Ministry of Social Justice & Empowerment",
    portalUrl: "https://nbcfdc.gov.in",
    category: "Targeted Concessional Finance (OBC)",
    purpose: "business",
    sectors: ["Manufacturing", "Services", "Retail", "Transport", "Artisan"],
    minCost: 20000,
    maxCost: 2500000,
    maxFundingPercent: 90,
    minOwnContributionPercent: 10,
    interestRatePercent: 6.0,
    genderRebatePercent: 1.0, // New Swarnima for women at 5%
    moratoriumMonths: 6,
    repaymentTenureYears: 5,
    repaymentCadence: "quarterly",
    summary: "Concessional credit at 5.0% to 6.0% for OBC entrepreneurs with family income under ₹3 Lakh. New Swarnima scheme offers special 5% rate for women.",
    summaryHindi: "OBC वर्ग के उद्यमियों हेतु 5% से 6% ब्याज पर ऋण सहायता। महिलाओं के लिए 'न्यू स्वर्णिमा योजना' में 5% विशेष ब्याज दर।",
    requiredDocuments: [
      { id: "caste_cert", label: "OBC Caste Certificate (Non-Creamy Layer)", mandatory: true },
      { id: "income_cert", label: "Income Certificate ≤ ₹3 Lakh", mandatory: true },
      { id: "aadhaar", label: "Aadhaar Card", mandatory: true },
      { id: "dpr", label: "Project Quotation", mandatory: true }
    ],
    eligibilityRules: {
      isOBC: true,
      incomeCeiling: 300000
    },
    bridgeSteps: [
      "Obtain your Non-Creamy Layer (NCL) OBC certificate from your local Tehsil.",
      "Apply through your State Backward Classes Development Corporation or PM-SURAJ portal."
    ]
  },

  // 10. NMDFC Concessional Credit (For Minority Entrepreneurs)
  {
    id: "NMDFC_MINORITY_FINANCE",
    code: "NMDFC-10",
    name: "NMDFC Concessional Finance for Minorities",
    nameHindi: "राष्ट्रीय अल्पसंख्यक विकास एवं वित्त निगम (NMDFC)",
    ministry: "Ministry of Minority Affairs",
    portalUrl: "https://nmdfc.org",
    category: "Targeted Concessional Finance (Minorities)",
    purpose: "business",
    sectors: ["Manufacturing", "Services", "Retail", "Artisan", "Handloom"],
    minCost: 25000,
    maxCost: 3000000,
    maxFundingPercent: 90,
    minOwnContributionPercent: 10,
    interestRatePercent: 6.0,
    genderRebatePercent: 1.0,
    moratoriumMonths: 6,
    repaymentTenureYears: 5,
    repaymentCadence: "quarterly",
    summary: "Concessional financing at 6.0% (and 5.0% for women under Virasat scheme) for notified minority communities (Muslim, Christian, Sikh, Buddhist, Jain, Parsi).",
    summaryHindi: "अल्पसंख्यक समुदाय (मुस्लिम, ईसाई, सिख, बौद्ध, जैन, पारसी) के उद्यमियों व दस्तकारों हेतु 5% से 6% रियायती ब्याज दर।",
    requiredDocuments: [
      { id: "aadhaar", label: "Aadhaar Card", mandatory: true },
      { id: "minority_cert", label: "Minority Community Self-Declaration / Certificate", mandatory: true },
      { id: "income_cert", label: "Income Certificate ≤ ₹6 Lakh", mandatory: true },
      { id: "bank_passbook", label: "Bank Account Passbook", mandatory: true }
    ],
    eligibilityRules: {
      isMinority: true,
      incomeCeiling: 600000
    },
    bridgeSteps: [
      "Notified minority communities include Muslim, Christian, Sikh, Buddhist, Jain, Parsi.",
      "Apply through State Minority Financial Corporation or authorized RRB/State Bank channel partner."
    ]
  },

  // 11. National Livestock Mission (NLM) - Agro & Livestock
  {
    id: "GOI_NLM_LIVESTOCK",
    code: "NLM-11",
    name: "National Livestock Mission (NLM) Capital Subsidy",
    nameHindi: "राष्ट्रीय पशुधन मिशन (NLM पूंजीगत अनुदान)",
    ministry: "Ministry of Fisheries, Animal Husbandry and Dairying",
    portalUrl: "https://nlm.udyamimitra.in",
    category: "50% Direct Capital Subsidy for Livestock Enterprises",
    purpose: "business",
    sectors: ["Agro", "Livestock", "Poultry", "Dairy", "Goat Farming", "Sheep"],
    minCost: 200000,
    maxCost: 5000000,
    maxFundingPercent: 90,
    minOwnContributionPercent: 10,
    interestRatePercent: 7.5,
    directSubsidyPercent: 50, // 50% capital subsidy
    maxSubsidyAmount: 2500000, // Up to ₹25 Lakh direct subsidy
    moratoriumMonths: 12,
    repaymentTenureYears: 5,
    repaymentCadence: "quarterly",
    summary: "50% direct capital cash subsidy (up to ₹25 Lakh for poultry, ₹50 Lakh for breed farms) for livestock and animal husbandry enterprises.",
    summaryHindi: "बकरी पालन, मुर्गी पालन, भेड़ पालन व चारा विकास इकाइयों पर 50% तक का सीधा पूंजीगत सरकारी अनुदान।",
    requiredDocuments: [
      { id: "aadhaar", label: "Aadhaar Card", mandatory: true },
      { id: "land_proof", label: "Land Ownership / Lease Agreement for Farm", mandatory: true },
      { id: "dpr", label: "Livestock Project DPR", mandatory: true },
      { id: "bank_passbook", label: "Bank Passbook", mandatory: true }
    ],
    eligibilityRules: {
      minAge: 18,
      livestockSectorOnly: true,
      hasFarmLand: true
    },
    bridgeSteps: [
      "Secure at least 1-2 acres of land (owned or leased for 5+ years) for farm shed construction.",
      "Submit DPR through nlm.udyamimitra.in to claim the 50% back-ended capital subsidy."
    ]
  },

  // 12. CSIS Higher Technical Education
  {
    id: "GOI_CSIS_EDUCATION",
    code: "CSIS-12",
    name: "Central Sector Interest Subsidy (CSIS) Scheme",
    nameHindi: "केंद्रीय क्षेत्र ब्याज सब्सिडी शिक्षा योजना (CSIS)",
    ministry: "Ministry of Education",
    portalUrl: "https://www.vidyalakshmi.co.in",
    category: "100% Interest-Subsidized Higher Education",
    purpose: "education",
    sectors: ["Education", "Professional Degree"],
    minCost: 50000,
    maxCost: 4000000,
    maxFundingPercent: 95,
    minOwnContributionPercent: 5,
    interestRatePercent: 4.0,
    moratoriumMonths: 48,
    fullInterestSubsidyInMoratorium: true,
    summary: "100% Government-paid interest subsidy during entire professional course duration + 1-year moratorium for students with family income under ₹4.5 Lakh.",
    summaryHindi: "व्यावसायिक व तकनीकी शिक्षा के दौरान संपूर्ण ब्याज का भुगतान सरकार द्वारा (कोर्स अवधि + 1 वर्ष तक 0% ब्याज)।",
    requiredDocuments: [
      { id: "aadhaar", label: "Aadhaar Card", mandatory: true },
      { id: "admission_proof", label: "College Admission Letter & Fee Schedule", mandatory: true },
      { id: "income_cert", label: "Income Certificate ≤ ₹4.5 Lakh", mandatory: true }
    ],
    eligibilityRules: {
      recognizedCourse: true,
      incomeCeiling: 450000
    },
    bridgeSteps: [
      "Apply through the centralized Vidya Lakshmi Portal (vidyalakshmi.co.in).",
      "Ensure college is NAAC or NBA accredited / AICTE approved."
    ]
  },

  // ====================================================================
  // MoSJE / NSFDC SCHEMES — Targeted at SC/ST Communities
  // ====================================================================

  // NSFDC Term Loan Scheme
  {
    id: "MOSJE_NSFDC_TERM_LOAN",
    code: "NSFDC-TL-01",
    name: "NSFDC Term Loan Scheme for SC Entrepreneurs",
    nameHindi: "NSFDC अनुसूचित जाति उद्यम ऋण योजना",
    ministry: "Ministry of Social Justice & Empowerment (MoSJE) / NSFDC",
    portalUrl: "https://nsfdc.nic.in",
    category: "Concessional Term Loan for SC/ST",
    purpose: "business",
    sectors: ["Manufacturing", "Services", "Agriculture", "Transport", "Small Business"],
    minCost: 50000,
    maxCost: 3000000, // ₹30 Lakh
    maxFundingPercent: 90,
    minOwnContributionPercent: 10,
    interestRatePercent: 6.0, // concessional rate
    subsidyMatrix: null, // No capital subsidy — concessional interest instead
    moratoriumMonths: 6,
    repaymentTenureYears: 10,
    repaymentCadence: "quarterly",
    summary: "Concessional loan up to ₹30 Lakh at 6% p.a. exclusively for SC/ST entrepreneurs through NSFDC-authorized State Channelising Agencies (SCAs). No collateral for loans up to ₹5 Lakh.",
    summaryHindi: "NSFDC द्वारा अनुसूचित जाति/जनजाति उद्यमियों के लिए ₹30 लाख तक का रियायती ऋण 6% ब्याज दर पर। ₹5 लाख तक बिना गारंटी।",
    requiredDocuments: [
      { id: "aadhaar", label: "Aadhaar Card", mandatory: true },
      { id: "caste_cert", label: "SC/ST Caste Certificate (Issued by SDM/Tehsildar)", mandatory: true },
      { id: "income_cert", label: "Income Certificate (≤ ₹3 Lakh annual)", mandatory: true },
      { id: "dpr", label: "Detailed Project Report (DPR)", mandatory: true },
      { id: "bank_passbook", label: "Bank Account Passbook", mandatory: true }
    ],
    eligibilityRules: {
      minAge: 18,
      maxAge: 55,
      socialCategory: ["SC", "ST"],
      annualIncomeCeiling: 300000, // ₹3 Lakh (doubled BPL)
      onlyNewGreenfield: false
    },
    bridgeSteps: [
      "Obtain SC/ST caste certificate from your SDM/Tehsildar office if not already available.",
      "Get income certificate from SDM/Tehsildar — must show annual family income ≤ ₹3,00,000.",
      "Contact your State Channelising Agency (SCA) — they process NSFDC loans at the state level.",
      "Prepare a Detailed Project Report (DPR) describing your business plan, costs, and expected revenue."
    ]
  },

  // NSFDC Micro Credit Finance Scheme
  {
    id: "MOSJE_NSFDC_MICRO_CREDIT",
    code: "NSFDC-MCF-02",
    name: "NSFDC Micro Credit Finance for SC Women SHGs",
    nameHindi: "NSFDC अनुसूचित जाति महिला स्वयं सहायता समूह सूक्ष्म ऋण",
    ministry: "Ministry of Social Justice & Empowerment (MoSJE) / NSFDC",
    portalUrl: "https://nsfdc.nic.in",
    category: "Micro Credit for SC Women",
    purpose: "business",
    sectors: ["Services", "Manufacturing", "Food Processing", "Handicrafts", "Retail"],
    minCost: 5000,
    maxCost: 150000, // ₹1.5 Lakh per member
    maxFundingPercent: 95,
    minOwnContributionPercent: 5,
    interestRatePercent: 5.0, // highly concessional
    subsidyMatrix: null,
    moratoriumMonths: 3,
    repaymentTenureYears: 3,
    repaymentCadence: "monthly",
    summary: "Micro credit up to ₹1.5 Lakh per SC woman through Self-Help Groups at 5% p.a. Targeted at women from scheduled caste communities for starting micro enterprises.",
    summaryHindi: "स्वयं सहायता समूहों के माध्यम से SC महिलाओं को ₹1.5 लाख तक का सूक्ष्म ऋण 5% ब्याज दर पर। सूक्ष्म उद्यम शुरू करने हेतु।",
    requiredDocuments: [
      { id: "aadhaar", label: "Aadhaar Card", mandatory: true },
      { id: "caste_cert", label: "SC Caste Certificate", mandatory: true },
      { id: "income_cert", label: "Income Certificate (≤ ₹3 Lakh)", mandatory: true },
      { id: "shg_cert", label: "SHG Registration / Bank Linkage Proof", mandatory: true }
    ],
    eligibilityRules: {
      minAge: 18,
      socialCategory: ["SC"],
      genderRestriction: "female",
      annualIncomeCeiling: 300000,
      requiresSHG: true
    },
    bridgeSteps: [
      "Join or form a Self-Help Group (SHG) in your area — NRLM/State Rural Livelihood Mission can help.",
      "Get the SHG bank-linked through nearest bank branch or CSC kiosk.",
      "Apply through SCA with SHG registration proof and caste certificate."
    ]
  },

  // NSFDC Education Loan
  {
    id: "MOSJE_NSFDC_EDUCATION",
    code: "NSFDC-EDU-03",
    name: "NSFDC Education Loan for SC Students",
    nameHindi: "NSFDC अनुसूचित जाति शिक्षा ऋण",
    ministry: "Ministry of Social Justice & Empowerment (MoSJE) / NSFDC",
    portalUrl: "https://nsfdc.nic.in",
    category: "Concessional Education Loan for SC",
    purpose: "education",
    sectors: ["Education"],
    minCost: 50000,
    maxCost: 2000000, // ₹20 Lakh
    maxFundingPercent: 90,
    minOwnContributionPercent: 10,
    interestRatePercent: 4.0, // lowest rate
    subsidyMatrix: null,
    moratoriumMonths: 12, // 1 year after course completion
    repaymentTenureYears: 5,
    repaymentCadence: "monthly",
    summary: "Education loan up to ₹20 Lakh at 4% p.a. for SC students pursuing professional/technical courses. Moratorium until 1 year after course completion.",
    summaryHindi: "SC छात्रों के लिए व्यावसायिक/तकनीकी पाठ्यक्रमों हेतु ₹20 लाख तक का शिक्षा ऋण 4% ब्याज दर पर। कोर्स पूर्ण होने के 1 वर्ष बाद तक मोरेटोरियम।",
    requiredDocuments: [
      { id: "aadhaar", label: "Aadhaar Card", mandatory: true },
      { id: "caste_cert", label: "SC Caste Certificate", mandatory: true },
      { id: "income_cert", label: "Income Certificate (≤ ₹3 Lakh)", mandatory: true },
      { id: "admission_letter", label: "Admission/Enrollment Letter", mandatory: true }
    ],
    eligibilityRules: {
      minAge: 17,
      maxAge: 35,
      socialCategory: ["SC"],
      annualIncomeCeiling: 300000,
      purposeRestriction: "education"
    },
    bridgeSteps: [
      "Secure admission in a recognized institution (AICTE/UGC approved).",
      "Obtain caste and income certificates from SDM/Tehsildar.",
      "Apply through State Channelising Agency (SCA) with admission letter."
    ]
  },

  // Venture Capital Fund for Scheduled Castes (VCF-SC)
  {
    id: "MOSJE_VCF_SC",
    code: "VCF-SC-04",
    name: "Venture Capital Fund for Scheduled Castes (VCF-SC)",
    nameHindi: "अनुसूचित जाति उद्यम पूंजी कोष (VCF-SC)",
    ministry: "Ministry of Social Justice & Empowerment (MoSJE) / IFCI",
    portalUrl: "https://vcfsc.ifciltd.com",
    category: "Equity-Like Venture Capital for SC Entrepreneurs",
    purpose: "business",
    sectors: ["Manufacturing", "Services", "Technology", "Agro-processing"],
    minCost: 500000,
    maxCost: 3000000, // ₹30 Lakh (equity-like)
    maxFundingPercent: 75,
    minOwnContributionPercent: 25,
    interestRatePercent: 0, // equity-like, no interest — revenue sharing
    subsidyMatrix: null,
    moratoriumMonths: 24, // 2 years
    repaymentTenureYears: 7,
    repaymentCadence: "quarterly",
    summary: "Equity-like funding up to ₹30 Lakh for SC entrepreneurs starting manufacturing or service enterprises. Managed by IFCI. No interest — returns via revenue sharing over 7 years.",
    summaryHindi: "SC उद्यमियों के लिए विनिर्माण/सेवा उद्यम शुरू करने हेतु ₹30 लाख तक की इक्विटी-जैसी पूंजी। IFCI द्वारा प्रबंधित। ब्याज नहीं — राजस्व साझेदारी।",
    requiredDocuments: [
      { id: "aadhaar", label: "Aadhaar Card", mandatory: true },
      { id: "caste_cert", label: "SC Caste Certificate", mandatory: true },
      { id: "income_cert", label: "Income Certificate", mandatory: true },
      { id: "dpr", label: "Detailed Project Report (DPR)", mandatory: true },
      { id: "business_plan", label: "Business Plan with Revenue Projections", mandatory: true }
    ],
    eligibilityRules: {
      minAge: 18,
      maxAge: 50,
      socialCategory: ["SC"],
      annualIncomeCeiling: 500000,
      minProjectCost: 500000
    },
    bridgeSteps: [
      "Prepare a detailed business plan with 3-5 year revenue projections.",
      "Apply through IFCI's VCF-SC portal: vcfsc.ifciltd.com.",
      "Attend the selection committee interview if shortlisted."
    ]
  },

  // PM-DAKSH (Pradhan Mantri Dakshta Aur Kushalta Sampann Hitgrahi)
  {
    id: "MOSJE_PM_DAKSH",
    code: "PM-DAKSH-05",
    name: "PM-DAKSH: Free Skill Training for SC/ST/OBC/Safai Karamcharis",
    nameHindi: "पीएम-दक्ष: SC/ST/OBC/सफाई कर्मचारियों हेतु मुफ्त कौशल प्रशिक्षण",
    ministry: "Ministry of Social Justice & Empowerment (MoSJE)",
    portalUrl: "https://pmdaksh.dosje.gov.in",
    category: "Free Skill Training + Stipend",
    purpose: "skill_training",
    sectors: ["All Sectors — Skill Development"],
    minCost: 0,
    maxCost: 0, // fully free
    maxFundingPercent: 100,
    minOwnContributionPercent: 0,
    interestRatePercent: 0,
    subsidyMatrix: {
      stipendPerMonth: 3000, // ₹3000/month during training
      toolkitGrant: true
    },
    moratoriumMonths: 0,
    repaymentTenureYears: 0,
    repaymentCadence: null,
    summary: "100% free skill training (short-term, long-term, up-skilling, re-skilling, entrepreneurship development) with ₹3,000/month stipend for SC/ST/OBC/Safai Karamcharis. No repayment — it's a grant.",
    summaryHindi: "SC/ST/OBC/सफाई कर्मचारियों के लिए 100% मुफ्त कौशल प्रशिक्षण + ₹3,000/माह छात्रवृत्ति। कोई ऋण वापसी नहीं — पूर्णतः अनुदान।",
    requiredDocuments: [
      { id: "aadhaar", label: "Aadhaar Card", mandatory: true },
      { id: "caste_cert", label: "SC/ST/OBC Caste Certificate", mandatory: true },
      { id: "income_cert", label: "Income Certificate", mandatory: false }
    ],
    eligibilityRules: {
      minAge: 18,
      maxAge: 45,
      socialCategory: ["SC", "ST", "OBC"],
      annualIncomeCeiling: 300000
    },
    bridgeSteps: [
      "Register on PM-DAKSH portal: pmdaksh.dosje.gov.in.",
      "Select a training program matching your trade from available slots.",
      "Attend training and receive ₹3,000/month stipend during the program."
    ]
  }
];
