// 30 Boundary & Scenario Test Cases for NiyamGraph Policy-as-Code Engine
// Used for automated verification and interactive live test runner in the Admin Studio

export const BOUNDARY_TEST_CASES = [
  {
    id: "TC-01",
    name: "Rani's Tailoring Unit (Core Persona)",
    description: "SC entrepreneur seeking ₹1.20L for sewing machines and initial fabric inventory.",
    input: {
      purpose: "business",
      categoryName: "Tailoring & Stitching",
      projectCost: 120000,
      annualIncome: 180000,
      isSC: true,
      gender: "female",
      isConstructionOrPlantation: false,
      hasCasteCert: true,
      hasIncomeCert: true,
      hasAadhaar: true,
      hasQuotation: true
    },
    expectedSchemeId: "NSFDC_MICRO_FINANCE",
    expectedPassed: true,
    keyCheck: "Micro Finance matched with 6.5% interest and 3 months moratorium."
  },
  {
    id: "TC-02",
    name: "Boundary: ₹1,40,000 Exactly (Micro Finance Ceiling)",
    description: "Maximum allowable project cost under Micro Finance Scheme.",
    input: {
      purpose: "business",
      categoryName: "Kirana Shop",
      projectCost: 140000,
      annualIncome: 240000,
      isSC: true,
      gender: "male",
      isConstructionOrPlantation: false,
      hasCasteCert: true,
      hasIncomeCert: true,
      hasAadhaar: true,
      hasQuotation: true
    },
    expectedSchemeId: "NSFDC_MICRO_FINANCE",
    expectedPassed: true,
    keyCheck: "Boundary ₹1.40L qualifies for Micro Finance; loan ₹1.25L cap applies."
  },
  {
    id: "TC-03",
    name: "Boundary: ₹1,40,001 (Term Loan Threshold Transition)",
    description: "₹1 above Micro Finance limit; must transition strictly to Term Loan.",
    input: {
      purpose: "business",
      categoryName: "Small Workshop",
      projectCost: 140001,
      annualIncome: 240000,
      isSC: true,
      gender: "male",
      isConstructionOrPlantation: false,
      hasCasteCert: true,
      hasIncomeCert: true,
      hasAadhaar: true,
      hasQuotation: true
    },
    expectedSchemeId: "NSFDC_TERM_LOAN",
    expectedPassed: true,
    keyCheck: "Exceeds ₹1.40L, triggers Term Loan Scheme with 8% interest."
  },
  {
    id: "TC-04",
    name: "Income Boundary: ₹5,00,000 Exactly (Current Ceiling)",
    description: "Declared family income equals the official NSFDC 2026 threshold ceiling.",
    input: {
      purpose: "business",
      categoryName: "Mobile Repair Shop",
      projectCost: 100000,
      annualIncome: 500000,
      isSC: true,
      gender: "male",
      isConstructionOrPlantation: false,
      hasCasteCert: true,
      hasIncomeCert: true,
      hasAadhaar: true,
      hasQuotation: true
    },
    expectedSchemeId: "NSFDC_MICRO_FINANCE",
    expectedPassed: true,
    keyCheck: "Income of ₹5,00,000 is eligible under current NSFDC-2026.01 rules."
  },
  {
    id: "TC-05",
    name: "Income Boundary: ₹5,00,001 (Exceeds Threshold)",
    description: "Declared income ₹1 above threshold; must reject and provide Next-Best Action.",
    input: {
      purpose: "business",
      categoryName: "Grocery Store",
      projectCost: 100000,
      annualIncome: 500001,
      isSC: true,
      gender: "female",
      isConstructionOrPlantation: false,
      hasCasteCert: true,
      hasIncomeCert: true,
      hasAadhaar: true,
      hasQuotation: true
    },
    expectedSchemeId: null,
    expectedPassed: false,
    keyCheck: "Rejected due to income ceiling; points to Stand-Up India and PMMY Mudra."
  },
  {
    id: "TC-06",
    name: "Non-SC Category Applicant",
    description: "Applicant belongs to general category or does not have SC certification.",
    input: {
      purpose: "business",
      categoryName: "Tea Stall",
      projectCost: 80000,
      annualIncome: 200000,
      isSC: false,
      gender: "male",
      isConstructionOrPlantation: false,
      hasCasteCert: false,
      hasIncomeCert: true,
      hasAadhaar: true,
      hasQuotation: true
    },
    expectedSchemeId: null,
    expectedPassed: false,
    keyCheck: "NSFDC mandates SC eligibility; refers to National Minorities/BC/MUDRA schemes."
  },
  {
    id: "TC-07",
    name: "Construction Project (Extended Moratorium)",
    description: "Commercial dairy shed construction requiring extended gestation period.",
    input: {
      purpose: "business",
      categoryName: "Dairy Shed Construction",
      projectCost: 800000,
      annualIncome: 300000,
      isSC: true,
      gender: "male",
      isConstructionOrPlantation: true,
      hasCasteCert: true,
      hasIncomeCert: true,
      hasAadhaar: true,
      hasQuotation: true
    },
    expectedSchemeId: "NSFDC_TERM_LOAN",
    expectedPassed: true,
    keyCheck: "Term Loan matched with 24 months extended construction moratorium."
  },
  {
    id: "TC-08",
    name: "Standard Commercial Vehicle / Transport",
    description: "Commercial auto-rickshaw purchase at ₹3.20 Lakh without construction.",
    input: {
      purpose: "business",
      categoryName: "Commercial Transport",
      projectCost: 320000,
      annualIncome: 220000,
      isSC: true,
      gender: "male",
      isConstructionOrPlantation: false,
      hasCasteCert: true,
      hasIncomeCert: true,
      hasAadhaar: true,
      hasQuotation: true
    },
    expectedSchemeId: "NSFDC_TERM_LOAN",
    expectedPassed: true,
    keyCheck: "Standard Term Loan moratorium of 6 months applied."
  },
  {
    id: "TC-09",
    name: "Education Loan: Female Student (Concession Rate)",
    description: "B.Tech professional degree course fee ₹8.5 Lakh for female student.",
    input: {
      purpose: "education",
      categoryName: "B.Tech Computer Science",
      projectCost: 850000,
      annualIncome: 280000,
      isSC: true,
      gender: "female",
      isConstructionOrPlantation: false,
      hasCasteCert: true,
      hasIncomeCert: true,
      hasAadhaar: true,
      hasQuotation: true
    },
    expectedSchemeId: "NSFDC_EDUCATION_LOAN",
    expectedPassed: true,
    keyCheck: "Educational Loan matched with 3.5% interest (0.5% female concession)."
  },
  {
    id: "TC-10",
    name: "Education Loan: Male Student",
    description: "MBA course fee ₹6.0 Lakh for male student.",
    input: {
      purpose: "education",
      categoryName: "MBA Finance",
      projectCost: 600000,
      annualIncome: 310000,
      isSC: true,
      gender: "male",
      isConstructionOrPlantation: false,
      hasCasteCert: true,
      hasIncomeCert: true,
      hasAadhaar: true,
      hasQuotation: true
    },
    expectedSchemeId: "NSFDC_EDUCATION_LOAN",
    expectedPassed: true,
    keyCheck: "Standard 4.0% interest rate applied for male student."
  },
  {
    id: "TC-11",
    name: "Education Loan: Overseas Maximum Boundary (₹40 Lakh)",
    description: "MS degree abroad costing ₹40,00,000.",
    input: {
      purpose: "education",
      categoryName: "MS Studies Abroad",
      projectCost: 4000000,
      annualIncome: 420000,
      isSC: true,
      gender: "female",
      isConstructionOrPlantation: false,
      hasCasteCert: true,
      hasIncomeCert: true,
      hasAadhaar: true,
      hasQuotation: true
    },
    expectedSchemeId: "NSFDC_EDUCATION_LOAN",
    expectedPassed: true,
    keyCheck: "Exact maximum ₹40 Lakh eligible; max loan 90% = ₹36 Lakh."
  },
  {
    id: "TC-12",
    name: "Education Loan: Exceeds Maximum Cap (₹45 Lakh)",
    description: "Course costing ₹45 Lakh, exceeding NSFDC upper boundary.",
    input: {
      purpose: "education",
      categoryName: "Medical Studies Abroad",
      projectCost: 4500000,
      annualIncome: 420000,
      isSC: true,
      gender: "female",
      isConstructionOrPlantation: false,
      hasCasteCert: true,
      hasIncomeCert: true,
      hasAadhaar: true,
      hasQuotation: true
    },
    expectedSchemeId: "NSFDC_EDUCATION_LOAN",
    expectedPassed: true,
    keyCheck: "Qualifies with capped financing: loan limited to ₹36 Lakh maximum ceiling."
  },
  {
    id: "TC-13",
    name: "Micro Activity: ₹25,000 Footwear Stall",
    description: "Cobbler upgrading repair kit and inventory.",
    input: {
      purpose: "business",
      categoryName: "Footwear & Leather Work",
      projectCost: 25000,
      annualIncome: 120000,
      isSC: true,
      gender: "male",
      isConstructionOrPlantation: false,
      hasCasteCert: true,
      hasIncomeCert: true,
      hasAadhaar: true,
      hasQuotation: true
    },
    expectedSchemeId: "NSFDC_MICRO_FINANCE",
    expectedPassed: true,
    keyCheck: "Micro Finance 90% loan = ₹22,500; own contribution = ₹2,500."
  },
  {
    id: "TC-14",
    name: "Udyam Nidhi SFB Route (₹3.0 Lakh)",
    description: "Semi-urban hardware store through Small Finance Bank.",
    input: {
      purpose: "business",
      categoryName: "Hardware & Electricals",
      projectCost: 300000,
      annualIncome: 260000,
      isSC: true,
      gender: "male",
      isConstructionOrPlantation: false,
      hasCasteCert: true,
      hasIncomeCert: true,
      hasAadhaar: true,
      hasQuotation: true
    },
    expectedSchemeId: "NSFDC_UDYAM_NIDHI",
    expectedPassed: true,
    keyCheck: "Udyam Nidhi Scheme with 7.5% rate matched as primary or alternate."
  },
  {
    id: "TC-15",
    name: "Aajeevika Rapid MFI Disclosure (₹90,000)",
    description: "Urgent hawker micro-loan via NBFC-MFI channel.",
    input: {
      purpose: "business",
      categoryName: "Vegetable Vending Cart",
      projectCost: 90000,
      annualIncome: 140000,
      isSC: true,
      gender: "female",
      isConstructionOrPlantation: false,
      hasCasteCert: true,
      hasIncomeCert: true,
      hasAadhaar: true,
      hasQuotation: true
    },
    expectedSchemeId: "NSFDC_MICRO_FINANCE",
    expectedPassed: true,
    keyCheck: "Recommends MFS at 6.5%; clearly warns of Aajeevika 15% rate if chosen for speed."
  },
  {
    id: "TC-16",
    name: "Invalid Zero Project Cost",
    description: "User declares ₹0 or negative investment.",
    input: {
      purpose: "business",
      categoryName: "Unspecified",
      projectCost: 0,
      annualIncome: 200000,
      isSC: true,
      gender: "male",
      isConstructionOrPlantation: false,
      hasCasteCert: true,
      hasIncomeCert: true,
      hasAadhaar: true,
      hasQuotation: true
    },
    expectedSchemeId: null,
    expectedPassed: false,
    keyCheck: "Validation error: project cost must be greater than zero."
  },
  {
    id: "TC-17",
    name: "Term Loan Upper Boundary (₹50 Lakh)",
    description: "Flour mill & agro processing unit costing exactly ₹50,00,000.",
    input: {
      purpose: "business",
      categoryName: "Agro Processing Unit",
      projectCost: 5000000,
      annualIncome: 480000,
      isSC: true,
      gender: "female",
      isConstructionOrPlantation: false,
      hasCasteCert: true,
      hasIncomeCert: true,
      hasAadhaar: true,
      hasQuotation: true
    },
    expectedSchemeId: "NSFDC_TERM_LOAN",
    expectedPassed: true,
    keyCheck: "Exact maximum ₹50 Lakh cap; maximum loan component ₹45 Lakh (90%)."
  },
  {
    id: "TC-18",
    name: "Exceeds Term Loan Upper Limit (₹55 Lakh)",
    description: "Industrial printing press costing ₹55,00,000.",
    input: {
      purpose: "business",
      categoryName: "Industrial Printing Press",
      projectCost: 5500000,
      annualIncome: 450000,
      isSC: true,
      gender: "male",
      isConstructionOrPlantation: false,
      hasCasteCert: true,
      hasIncomeCert: true,
      hasAadhaar: true,
      hasQuotation: true
    },
    expectedSchemeId: "NSFDC_TERM_LOAN",
    expectedPassed: true,
    keyCheck: "Eligible up to NSFDC maximum ceiling ₹50L project (loan ₹45L); excess self-funded."
  },
  {
    id: "TC-19",
    name: "Partner Pulse: Paused Branch Bypass",
    description: "Nearest branch (Aryavart Bank, 2.1km) has paused intake; system must route to UPSCFDC (4.2km, Green).",
    input: {
      purpose: "business",
      categoryName: "Tailoring",
      projectCost: 120000,
      annualIncome: 180000,
      isSC: true,
      gender: "female",
      isConstructionOrPlantation: false,
      hasCasteCert: true,
      hasIncomeCert: true,
      hasAadhaar: true,
      hasQuotation: true
    },
    expectedSchemeId: "NSFDC_MICRO_FINANCE",
    expectedPassed: true,
    keyCheck: "Avoids paused red partner; selects active green partner."
  },
  {
    id: "TC-20",
    name: "Partner Pulse: Stale Status Warning",
    description: "Partner with > 14 days unverified status is flagged with warning confirmation banner.",
    input: {
      purpose: "business",
      categoryName: "Transport",
      projectCost: 400000,
      annualIncome: 250000,
      isSC: true,
      gender: "male",
      isConstructionOrPlantation: false,
      hasCasteCert: true,
      hasIncomeCert: true,
      hasAadhaar: true,
      hasQuotation: true
    },
    expectedSchemeId: "NSFDC_TERM_LOAN",
    expectedPassed: true,
    keyCheck: "Grey/stale partner requires citizen phone confirmation."
  },
  {
    id: "TC-21",
    name: "Document Readiness: 100% Complete",
    description: "All 5 required documents verified.",
    input: {
      purpose: "business",
      categoryName: "Tailoring",
      projectCost: 120000,
      annualIncome: 180000,
      isSC: true,
      gender: "female",
      isConstructionOrPlantation: false,
      hasCasteCert: true,
      hasIncomeCert: true,
      hasAadhaar: true,
      hasQuotation: true
    },
    expectedSchemeId: "NSFDC_MICRO_FINANCE",
    expectedPassed: true,
    keyCheck: "100% Document readiness score; Green Passport status."
  },
  {
    id: "TC-22",
    name: "Document Readiness: Missing Caste Certificate",
    description: "Crucial mandatory document missing.",
    input: {
      purpose: "business",
      categoryName: "Tailoring",
      projectCost: 120000,
      annualIncome: 180000,
      isSC: true,
      gender: "female",
      isConstructionOrPlantation: false,
      hasCasteCert: false,
      hasIncomeCert: true,
      hasAadhaar: true,
      hasQuotation: true
    },
    expectedSchemeId: "NSFDC_MICRO_FINANCE",
    expectedPassed: true,
    keyCheck: "Score drops to 60%; flags critical missing Caste Certificate with Tehsil audio guide."
  },
  {
    id: "TC-23",
    name: "Document Readiness: Missing Quotation Only",
    description: "Identity & income present, vendor quotation pending.",
    input: {
      purpose: "business",
      categoryName: "Tailoring",
      projectCost: 120000,
      annualIncome: 180000,
      isSC: true,
      gender: "female",
      isConstructionOrPlantation: false,
      hasCasteCert: true,
      hasIncomeCert: true,
      hasAadhaar: true,
      hasQuotation: false
    },
    expectedSchemeId: "NSFDC_MICRO_FINANCE",
    expectedPassed: true,
    keyCheck: "Score 80%; conditional referral generated with quotation requirement alert."
  },
  {
    id: "TC-24",
    name: "Beneficiary Contribution on ₹1.40L Project",
    description: "Verify 10% own equity and ₹1.25L loan cap interaction.",
    input: {
      purpose: "business",
      categoryName: "Beauty Parlour",
      projectCost: 140000,
      annualIncome: 200000,
      isSC: true,
      gender: "female",
      isConstructionOrPlantation: false,
      hasCasteCert: true,
      hasIncomeCert: true,
      hasAadhaar: true,
      hasQuotation: true
    },
    expectedSchemeId: "NSFDC_MICRO_FINANCE",
    expectedPassed: true,
    keyCheck: "Project ₹1.40L: Loan capped at ₹1.25L, beneficiary contribution = ₹15,000 (10.7%)."
  },
  {
    id: "TC-25",
    name: "Term Loan ₹12.0 Lakh (Demo Switch Scenario)",
    description: "Rani's project scale switch from ₹1.20L to ₹12.0L.",
    input: {
      purpose: "business",
      categoryName: "Boutique & Garment Manufacturing",
      projectCost: 1200000,
      annualIncome: 250000,
      isSC: true,
      gender: "female",
      isConstructionOrPlantation: false,
      hasCasteCert: true,
      hasIncomeCert: true,
      hasAadhaar: true,
      hasQuotation: true
    },
    expectedSchemeId: "NSFDC_TERM_LOAN",
    expectedPassed: true,
    keyCheck: "Instantly switches to Term Loan; 90% loan = ₹10.80L, own contribution = ₹1.20L."
  },
  {
    id: "TC-26",
    name: "Quarterly Repayment Schedule Precision",
    description: "Verify quarterly cadence rather than simple monthly EMI for Term Loan.",
    input: {
      purpose: "business",
      categoryName: "Small Factory",
      projectCost: 500000,
      annualIncome: 280000,
      isSC: true,
      gender: "male",
      isConstructionOrPlantation: false,
      hasCasteCert: true,
      hasIncomeCert: true,
      hasAadhaar: true,
      hasQuotation: true
    },
    expectedSchemeId: "NSFDC_TERM_LOAN",
    expectedPassed: true,
    keyCheck: "Generates quarterly amortization schedule with principal + interest per quarter."
  },
  {
    id: "TC-27",
    name: "Hindi Voice Intent Parsing: 'silai ka kaam'",
    description: "Speech query 'Mujhe silai ka kaam shuru karne ke liye ₹1.2 lakh chahiye'.",
    input: {
      rawText: "Mujhe silai ka kaam shuru karne ke liye ₹1.2 lakh chahiye",
      language: "hi"
    },
    expectedSchemeId: "NSFDC_MICRO_FINANCE",
    expectedPassed: true,
    keyCheck: "Extracted: Category = Tailoring, Amount = ₹1,20,000, Purpose = Business."
  },
  {
    id: "TC-28",
    name: "Hindi Voice Intent Parsing: 'padhai ke liye loan'",
    description: "Speech query 'BTech padhai ke liye college fee chahiye lagbhag 5 lakh'.",
    input: {
      rawText: "BTech padhai ke liye college fee chahiye lagbhag 5 lakh",
      language: "hi"
    },
    expectedSchemeId: "NSFDC_EDUCATION_LOAN",
    expectedPassed: true,
    keyCheck: "Extracted: Category = Engineering, Amount = ₹5,00,000, Purpose = Education."
  },
  {
    id: "TC-29",
    name: "Plantation / Horticulture Gestation Rule",
    description: "Polyhouse horticulture unit costing ₹6 Lakh with 18-month gestation.",
    input: {
      purpose: "business",
      categoryName: "Horticulture Polyhouse",
      projectCost: 600000,
      annualIncome: 300000,
      isSC: true,
      gender: "female",
      isConstructionOrPlantation: true,
      hasCasteCert: true,
      hasIncomeCert: true,
      hasAadhaar: true,
      hasQuotation: true
    },
    expectedSchemeId: "NSFDC_TERM_LOAN",
    expectedPassed: true,
    keyCheck: "Triggers extended 24-month moratorium permissible under NSFDC rules."
  },
  {
    id: "TC-30",
    name: "Ambiguous Natural Query Clarification",
    description: "Query without budget or category: 'Mujhe loan chahiye'.",
    input: {
      rawText: "Mujhe loan chahiye",
      language: "hi"
    },
    expectedSchemeId: null,
    expectedPassed: false,
    keyCheck: "AI responsibly requests clarification instead of hallucinating eligibility."
  }
];
