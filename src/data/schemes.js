// Policy-as-Code definitions for NSFDC Concessional Credit Ecosystem
// Effective-dated policy version: NSFDC-2026.01 (reflecting the ₹5 lakh annual income threshold update)
// Official Source: https://nsfdc.nic.in/faqs

export const POLICY_METADATA = {
  version: "NSFDC-2026.01",
  effectiveDate: "2026-01-01",
  regulatoryBody: "National Scheduled Castes Finance and Development Corporation (NSFDC)",
  parentMinistry: "Ministry of Social Justice and Empowerment, Govt. of India",
  portalHandoff: "PM-SURAJ (pm-suraj.dosje.gov.in)",
  annualIncomeCeiling: 500000, // ₹5,00,000 annual family income
  targetCategory: "Scheduled Caste (SC)"
};

export const SCHEMES = [
  {
    id: "NSFDC_MICRO_FINANCE",
    code: "MFS-01",
    name: "Micro Finance Scheme (MFS)",
    nameHindi: "लघु वित्त योजना (Micro Finance)",
    nameMarathi: "सूक्ष्म वित्त योजना (Micro Finance)",
    purpose: "business",
    category: "Micro Enterprises & Artisan Units",
    categoryKeywords: ["tailoring", "silai", "stitching", "sewing", "tea shop", "chai", "kirana", "grocery", "vegetable", "subzi", "beauty parlour", "cobbler", "leather craft", "welding"],
    summary: "Concessional micro credit up to ₹1.40 Lakh for quick individual or SHG income generating activities with low 6.5% interest rate.",
    summaryHindi: "छोटे व्यापार व आजीविका के लिए ₹1.40 लाख तक की किफायती ऋण सहायता, केवल 6.5% वार्षिक ब्याज पर।",
    minCost: 10000,
    maxCost: 140000,
    maxLoanAmount: 125000,
    maxFundingPercent: 90,
    minBeneficiaryContributionPercent: 10,
    interestRatePercent: 6.5,
    genderRebatePercent: 0,
    moratoriumMonths: 3,
    moratoriumExtendedMonths: 6,
    repaymentCadence: "quarterly", // Quarterly is NSFDC standard
    totalRepaymentTenureYears: 3,
    effectiveDate: "2026-01-01",
    officialSourceUrl: "https://nsfdc.nic.in/faqs",
    allowedPartnerTypes: ["SCA", "RRB", "SFB"],
    requiredDocuments: [
      { id: "caste_cert", label: "SC Caste Certificate (जाति प्रमाण पत्र)", mandatory: true, isIdProof: true },
      { id: "income_cert", label: "Income Certificate ≤ ₹5 Lakh (आय प्रमाण पत्र)", mandatory: true },
      { id: "aadhaar", label: "Aadhaar Card (आधार कार्ड)", mandatory: true, isIdProof: true },
      { id: "bank_passbook", label: "Bank Account Passbook / Cancelled Cheque", mandatory: true },
      { id: "quotation", label: "Machinery/Tool Quotation or Cost Estimate (अनुमानित खर्च विवरण)", mandatory: false }
    ],
    suitabilityRules: [
      "Project cost must be within ₹1,40,000",
      "Applicant must belong to Scheduled Caste community",
      "Family annual income must not exceed ₹5,00,000"
    ]
  },
  {
    id: "NSFDC_AAJEEVIKA",
    code: "AMFS-02",
    name: "Aajeevika Micro-Finance Scheme (via NBFC-MFIs)",
    nameHindi: "आजीविका माइक्रो फाइनेंस (NBFC-MFI माध्यम)",
    nameMarathi: "आजीविका सूक्ष्म वित्त (NBFC-MFI)",
    purpose: "business",
    category: "Rapid Micro Finance via NBFC-MFIs",
    categoryKeywords: ["tailoring", "silai", "hawker", "vendor", "small business", "kirana"],
    summary: "Fast-track micro finance routed through authorized NBFC-MFIs. Ideal when state SCA queues are crowded, but note higher interest rate (15%).",
    summaryHindi: "NBFC-MFI के माध्यम से त्वरित वितरण, लेकिन ब्याज दर 15% है (SCA की 6.5% योजना से अधिक)।",
    minCost: 10000,
    maxCost: 140000,
    maxLoanAmount: 125000,
    maxFundingPercent: 90,
    minBeneficiaryContributionPercent: 10,
    interestRatePercent: 15.0,
    genderRebatePercent: 0,
    moratoriumMonths: 1,
    moratoriumExtendedMonths: 2,
    repaymentCadence: "monthly",
    totalRepaymentTenureYears: 2,
    effectiveDate: "2026-01-01",
    officialSourceUrl: "https://nsfdc.nic.in/faqs",
    allowedPartnerTypes: ["NBFC_MFI"],
    requiredDocuments: [
      { id: "caste_cert", label: "SC Caste Certificate (जाति प्रमाण पत्र)", mandatory: true },
      { id: "income_cert", label: "Self-Declaration / Income Certificate ≤ ₹5 Lakh", mandatory: true },
      { id: "aadhaar", label: "Aadhaar Card (आधार कार्ड)", mandatory: true },
      { id: "bank_passbook", label: "Bank Account Passbook", mandatory: true }
    ],
    suitabilityRules: [
      "Project cost up to ₹1,40,000",
      "Urgent disbursement priority",
      "Note: High interest rate compared to State SCA channels"
    ]
  },
  {
    id: "NSFDC_TERM_LOAN",
    code: "TLS-03",
    name: "Term Loan Scheme (TLS)",
    nameHindi: "सावधि ऋण योजना (Term Loan)",
    nameMarathi: "मुदत कर्ज योजना (Term Loan)",
    purpose: "business",
    category: "Commercial, Transport & Industrial Projects",
    categoryKeywords: ["commercial", "manufacturing", "transport", "auto rickshaw", "tractor", "dairy", "poultry", "workshop", "construction", "plantation", "retail store", "cyber cafe", "restaurant", "food processing"],
    summary: "Comprehensive funding up to ₹50 Lakh (loan up to ₹45 Lakh / 90%) for medium to large enterprises with 8% interest and up to 24 months construction moratorium.",
    summaryHindi: "₹1.40 लाख से ऊपर और ₹50 लाख तक के बड़े उद्योगों व व्यावसायिक प्रोजेक्ट्स के लिए 8% ब्याज पर ऋण।",
    minCost: 140001,
    maxCost: 5000000,
    maxLoanAmount: 4500000,
    maxFundingPercent: 90,
    minBeneficiaryContributionPercent: 10,
    interestRatePercent: 8.0,
    genderRebatePercent: 0.5, // 0.5% rebate for women beneficiaries in specific sectors
    moratoriumMonths: 6,
    moratoriumExtendedMonths: 24, // extended for civil construction / horticulture / plantation
    repaymentCadence: "quarterly",
    totalRepaymentTenureYears: 5,
    effectiveDate: "2026-01-01",
    officialSourceUrl: "https://nsfdc.nic.in/faqs",
    allowedPartnerTypes: ["SCA", "RRB", "PSB"],
    requiredDocuments: [
      { id: "caste_cert", label: "SC Caste Certificate (जाति प्रमाण पत्र)", mandatory: true },
      { id: "income_cert", label: "Income Certificate ≤ ₹5 Lakh (आय प्रमाण पत्र)", mandatory: true },
      { id: "aadhaar", label: "Aadhaar Card (आधार कार्ड)", mandatory: true },
      { id: "dpr", label: "Detailed Project Report / Business Proposal (DPR/लागत विवरण)", mandatory: true },
      { id: "bank_passbook", label: "Bank Account Passbook / 6-Month Statement", mandatory: true },
      { id: "quotation", label: "Vendor Quotations for Machinery / Vehicles", mandatory: true }
    ],
    suitabilityRules: [
      "Project cost must exceed ₹1,40,000 and be up to ₹50,00,000",
      "Applicant must belong to Scheduled Caste community",
      "Family annual income must not exceed ₹5,00,000",
      "Must submit a preliminary project profile or vendor quotation"
    ]
  },
  {
    id: "NSFDC_UDYAM_NIDHI",
    code: "UNS-04",
    name: "Udyam Nidhi Scheme",
    nameHindi: "उद्यम निधि योजना (SFB व सहकारी बैंक)",
    nameMarathi: "उद्यम निधी योजना",
    purpose: "business",
    category: "Micro Activity via SFBs & Cooperatives",
    categoryKeywords: ["retail", "service", "hardware", "mobile repair", "handloom", "kirana", "bakery"],
    summary: "Dedicated small enterprise credit up to ₹5.00 Lakh financed through Small Finance Banks (SFBs) and Urban Cooperative Banks at 7.5% interest.",
    summaryHindi: "लघु वित्त बैंकों (SFB) के माध्यम से ₹5 लाख तक का रियायती ऋण, 7.5% ब्याज दर पर।",
    minCost: 50000,
    maxCost: 500000,
    maxLoanAmount: 450000,
    maxFundingPercent: 90,
    minBeneficiaryContributionPercent: 10,
    interestRatePercent: 7.5,
    genderRebatePercent: 0,
    moratoriumMonths: 3,
    moratoriumExtendedMonths: 6,
    repaymentCadence: "monthly",
    totalRepaymentTenureYears: 4,
    effectiveDate: "2026-01-01",
    officialSourceUrl: "https://nsfdc.nic.in/faqs",
    allowedPartnerTypes: ["SFB", "COOP", "SCA"],
    requiredDocuments: [
      { id: "caste_cert", label: "SC Caste Certificate", mandatory: true },
      { id: "income_cert", label: "Income Certificate ≤ ₹5 Lakh", mandatory: true },
      { id: "aadhaar", label: "Aadhaar Card", mandatory: true },
      { id: "bank_passbook", label: "Bank Statement", mandatory: true }
    ],
    suitabilityRules: [
      "Project cost up to ₹5,00,000",
      "Preferable for urban/semi-urban areas served by SFBs",
      "Family income ≤ ₹5,00,000"
    ]
  },
  {
    id: "NSFDC_EDUCATION_LOAN",
    code: "ELS-05",
    name: "Educational Loan Scheme (ELS)",
    nameHindi: "शिक्षा ऋण योजना (Education Loan)",
    nameMarathi: "शैक्षणिक कर्ज योजना",
    purpose: "education",
    category: "Professional & Technical Higher Education",
    categoryKeywords: ["study", "college", "engineering", "btech", "medical", "mbbs", "nursing", "mba", "diploma", "degree", "higher education", "abroad"],
    summary: "Concessional study loan up to ₹40 Lakh for technical & professional courses in India or abroad, with subsidized interest (3.5% for women, 4.0% for men).",
    summaryHindi: "उच्च तकनीकी व व्यावसायिक शिक्षा के लिए ₹40 लाख तक का ऋण, छात्राओं हेतु केवल 3.5% व छात्रों हेतु 4% ब्याज पर।",
    minCost: 50000,
    maxCost: 4000000, // Up to ₹40 Lakh abroad, ₹20-30 Lakh in India
    maxLoanAmount: 3600000, // 90% of eligible cost
    maxFundingPercent: 90,
    minBeneficiaryContributionPercent: 10,
    interestRatePercent: 4.0,
    genderRebatePercent: 0.5, // 3.5% for women
    moratoriumMonths: 42, // Course duration + 6 months
    moratoriumExtendedMonths: 54,
    repaymentCadence: "quarterly",
    totalRepaymentTenureYears: 5, // Repayable in 5 years after moratorium
    effectiveDate: "2026-01-01",
    officialSourceUrl: "https://nsfdc.nic.in/faqs",
    allowedPartnerTypes: ["SCA", "PSB", "RRB"],
    requiredDocuments: [
      { id: "caste_cert", label: "SC Caste Certificate (जाति प्रमाण पत्र)", mandatory: true },
      { id: "income_cert", label: "Income Certificate ≤ ₹5 Lakh", mandatory: true },
      { id: "aadhaar", label: "Aadhaar Card of Student & Parent", mandatory: true },
      { id: "admission_letter", label: "Admission Confirmation Letter & Fee Structure", mandatory: true },
      { id: "academic_records", label: "10th/12th/Graduation Marksheets", mandatory: true }
    ],
    suitabilityRules: [
      "Eligible technical/professional higher education degree or diploma",
      "SC community student",
      "Family income ≤ ₹5,00,000",
      "Moratorium covers full regular course duration + 6 months grace"
    ]
  }
];

export const ALTERNATIVE_NON_CONCESSIONAL = [
  {
    id: "STANDUP_INDIA",
    name: "Stand-Up India Scheme",
    sponsor: "SIDBI / Ministry of Finance",
    costRange: "₹10 Lakh to ₹100 Lakh",
    suitability: "For greenfield enterprises by SC/ST or Women entrepreneurs when family income exceeds NSFDC ceiling (> ₹5 Lakh)."
  },
  {
    id: "PMMY_MUDRA",
    name: "Pradhan Mantri MUDRA Yojana (Tarun/Kishore)",
    sponsor: "Govt of India",
    costRange: "Up to ₹10 Lakh / ₹20 Lakh",
    suitability: "No caste-based income ceiling restrictions, directly accessible through commercial bank branches."
  },
  {
    id: "CGSSD",
    name: "Credit Guarantee Scheme for SC (CGSSC)",
    sponsor: "IFCI / MoSJE",
    costRange: "Up to ₹5 Crore",
    suitability: "Credit guarantee cover for collateral-free bank loans to SC entrepreneurs."
  }
];
