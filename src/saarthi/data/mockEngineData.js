/**
 * UdyamSetu // Scheme discovery demo data
 * Official MoSJE & NSFDC Knowledge Base & Telemetry
 */

export const SOVEREIGN_METADATA = {
  ministry: "Ministry of Social Justice and Empowerment (MoSJE)",
  nodalCorporation: "National Scheduled Castes Finance & Development Corporation (NSFDC)",
  problemStatementId: "SIH26092",
  annualIncomeCeiling: 500000, // ₹5.00 Lakhs strict statutory boundary
  sovereignFundingCap: 90,     // 90% Concessional Credit Guarantee
  minimumBeneficiaryEquity: 10 // 10% Mandatory Own Margin
};

export const SCHEMES_CATALOG = [
  {
    id: "NSFDC_MICRO_FINANCE",
    code: "MFS-01",
    name: "Micro Finance Scheme (MFS)",
    nameHindi: "लघु वित्त योजना (Micro Finance)",
    category: "Micro Enterprises & Artisan Units",
    minCost: 10000,
    maxCost: 140000,
    maxLoan: 125000, // 90% of ₹1.40L
    baseInterestRate: 6.5,
    femaleRebate: 0.0,
    moratoriumMonths: 3,
    maxMoratoriumMonths: 6,
    defaultTenureYears: 3,
    cadence: "QUARTERLY",
    channelType: "State Channelizing Agencies (SCAs)",
    rationale: "Optimized for micro enterprises under ₹1.40 Lakh. Provides India's lowest sovereign interest rate at 6.5% p.a. with 3-6 months setup grace."
  },
  {
    id: "NSFDC_TERM_LOAN",
    code: "TLS-03",
    name: "Term Loan Scheme (TLS)",
    nameHindi: "सावधि ऋण योजना (Term Loan)",
    category: "Commercial, Transport & Industrial Projects",
    minCost: 140001,
    maxCost: 5000000, // Up to ₹50.00 Lakhs
    maxLoan: 4500000, // 90% of ₹50.00L
    baseInterestRate: 8.0,
    femaleRebate: 0.5, // 7.5% for women entrepreneurs
    moratoriumMonths: 6,
    maxMoratoriumMonths: 12,
    defaultTenureYears: 5,
    cadence: "QUARTERLY",
    channelType: "SCAs, Public Sector Banks & RRBs",
    rationale: "Tailored for scaling commercial ventures (like commercial cloud kitchens or workshops) up to ₹50 Lakhs with 90% capital expenditure coverage and up to 12 months moratorium."
  },
  {
    id: "NSFDC_EDUCATION_LOAN",
    code: "ELS-05",
    name: "Educational Loan Scheme (ELS)",
    nameHindi: "शिक्षा ऋण योजना (Education Loan)",
    category: "Professional & Technical Higher Education",
    minCost: 50000,
    maxCost: 4000000, // Up to ₹40.00 Lakhs
    maxLoan: 3600000,
    baseInterestRate: 4.0,
    femaleRebate: 0.5, // 3.5% for female students
    moratoriumMonths: 42, // Course duration + 6 months
    maxMoratoriumMonths: 54,
    defaultTenureYears: 5,
    cadence: "QUARTERLY",
    channelType: "SCAs & Public Sector Banks",
    rationale: "Subsidized tuition credit for SC students pursuing technical/professional degrees with repayment commencing only 6 months post-graduation."
  },
  {
    id: "NSFDC_AAJEEVIKA",
    code: "AMFS-02",
    name: "Aajeevika Micro-Finance (via NBFC-MFIs)",
    nameHindi: "आजीविका माइक्रो फाइनेंस (NBFC-MFI माध्यम)",
    category: "Rapid Doorstep Micro Credit",
    minCost: 10000,
    maxCost: 140000,
    maxLoan: 125000,
    baseInterestRate: 15.0,
    femaleRebate: 0.0,
    moratoriumMonths: 1,
    maxMoratoriumMonths: 3,
    defaultTenureYears: 2,
    cadence: "MONTHLY",
    channelType: "Accredited NBFC-MFIs",
    rationale: "Fast-track doorstep micro-credit when local SCA queues are congested. Capped at 15.0% with bi-weekly/monthly repayment."
  }
];

/**
 * Honest Map & Predictive Routing Partners Directory
 * Features transparent Green, Yellow, and Grey (Transparently Paused) classifications.
 */
export const HONEST_CHANNEL_PARTNERS = [
  {
    id: "PARTNER-UP-01",
    name: "UPSCFDC - Central Directorate",
    type: "SCA",
    branch: "B-Block, Indira Bhawan, Lucknow",
    district: "Lucknow",
    coordinates: { lat: 26.8467, lng: 80.9462 },
    distanceKm: 2.4,
    pinStatus: "GREEN", // Prime Match
    statusLabel: "PRIME MATCH // ACTIVE LIQUIDITY",
    grossNpaPercent: 2.4,
    overdueRatePercent: 3.1,
    allocatedQuota: 15000000,
    utilizedQuota: 6800000,
    fundAvailablePercent: 54.7,
    avgSlaDays: 3,
    velocityStatus: "OPTIMAL",
    velocityNote: "Processed 42 files in last 30 days with average disbursement SLA of 3.2 days.",
    nodalOfficer: "Shri R. K. Gautam (Manager Credit)",
    contactPhone: "+91 522 2288123"
  },
  {
    id: "PARTNER-UP-03",
    name: "Utkarsh Small Finance Bank - Hazratganj",
    type: "SFB",
    branch: "Hazratganj Main, Lucknow",
    district: "Lucknow",
    coordinates: { lat: 26.8524, lng: 80.9412 },
    distanceKm: 3.1,
    pinStatus: "GREEN",
    statusLabel: "PRIME MATCH // BIOMETRIC READY",
    grossNpaPercent: 3.1,
    overdueRatePercent: 4.2,
    allocatedQuota: 6000000,
    utilizedQuota: 2400000,
    fundAvailablePercent: 60.0,
    avgSlaDays: 2,
    velocityStatus: "OPTIMAL",
    velocityNote: "Instant tablet e-KYC desk active. Zero backlog for files up to ₹5.00 Lakhs.",
    nodalOfficer: "Amit Saxena (Branch In-charge)",
    contactPhone: "+91 522 2618900"
  },
  {
    id: "PARTNER-UP-04",
    name: "Fusion Micro Finance - Gomti Nagar Desk",
    type: "NBFC_MFI",
    branch: "Vibhuti Khand, Gomti Nagar, Lucknow",
    district: "Lucknow",
    coordinates: { lat: 26.8722, lng: 81.0024 },
    distanceKm: 5.8,
    pinStatus: "YELLOW", // Limited
    statusLabel: "LIMITED // HIGH PENDING CASELOAD",
    grossNpaPercent: 4.8,
    overdueRatePercent: 6.2,
    allocatedQuota: 4000000,
    utilizedQuota: 3450000,
    fundAvailablePercent: 13.8,
    avgSlaDays: 6,
    velocityStatus: "VELOCITY_DEGRADED",
    velocityNote: "Automatic downgrade triggered: 38 files received in last 30 days, only 4 sanctioned. Case velocity degraded.",
    nodalOfficer: "Deepak Yadav (Territory Manager)",
    contactPhone: "+91 522 4022880"
  },
  {
    id: "PARTNER-UP-02",
    name: "Aryavart Regional Rural Bank - Alambagh",
    type: "RRB",
    branch: "Plot 14, Alambagh Market, Lucknow",
    district: "Lucknow",
    coordinates: { lat: 26.8152, lng: 80.9020 },
    distanceKm: 1.8, // Closest physically, but risky!
    pinStatus: "GREY", // Transparently Paused (Not silently hidden!)
    statusLabel: "TRANSPARENTLY PAUSED // AUDIT HOLD",
    pauseReason: "Illustrative sample status for this demo; confirm availability directly with the institution.",
    grossNpaPercent: 9.8,
    overdueRatePercent: 14.5,
    allocatedQuota: 8000000,
    utilizedQuota: 7950000,
    fundAvailablePercent: 0.6,
    avgSlaDays: 14,
    velocityStatus: "STALLED",
    velocityNote: "Disqualification threshold exceeded (> 7% NPA). Citizen redirected to UPSCFDC Directorate to prevent application stalling.",
    nodalOfficer: "Ms. Sunita Verma (Lead District Officer)",
    contactPhone: "+91 522 2451990"
  }
];

/**
 * Persona Pitch: 18-Year-Old Campus Brownie & Baked Goods Entrepreneur
 * Scaling to Commercial Cloud Kitchen under NSFDC Term Loan (TLS-03)
 */
export const BROWNIE_PERSONA_DPR = {
  applicant: {
    name: "Aarav Sharma & Team (The Campus Brownie Co.)",
    age: 18,
    category: "Scheduled Caste (SC) Beneficiary",
    annualIncome: 180000,
    education: "1st Year B.Tech / Culinary Enthusiast",
    district: "Lucknow, Uttar Pradesh",
    ventureName: "VelvetCrust Artisan Baked Goods & Cloud Kitchen",
    existingTrackRecord: "Operated university brownie & tea kiosk generating ₹48,000/month net surplus over 9 months.",
    photoUrl: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80",
    campusStallUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    commercialKitchenUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80",
    brownieProductUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80"
  },
  projectFinances: {
    totalProjectCost: 2500000, // ₹25.00 Lakhs
    nsfdcConcessionalLoan: 2250000, // 90% Sovereign Funding Guarantee
    beneficiaryOwnEquity: 250000,   // 10% Mandatory Own Margin
    fundingRatio: "90% Concessional Credit / 10% Own Equity",
    concessionalInterestRate: 8.0,
    moratoriumPeriodMonths: 6,      // 6 Months setup & commercial baking stabilization
    repaymentTenureYears: 5,
    repaymentCadence: "Quarterly",
    estimatedQuarterlyEmi: 137890
  },
  capitalExpenditureBreakdown: [
    { 
      item: "Commercial 3-Deck Italian Convection Oven (Wiesheu / Sinmag)", 
      cost: 650000, 
      vendor: "BakeEquip India, Noida", 
      invoiceRef: "Q-2026/891",
      imageUrl: "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&w=600&q=80",
      category: "THERMAL_BAKING"
    },
    { 
      item: "Heavy Duty 60L Planetary Spiral Dough Mixer", 
      cost: 280000, 
      vendor: "KitchenTech Solutions", 
      invoiceRef: "Q-2026/892",
      imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80",
      category: "MIXING_PREP"
    },
    { 
      item: "Blast Chiller & 4-Door Commercial Deep Freezer (-20°C)", 
      cost: 340000, 
      vendor: "BlueStar Commercial Cold Chain", 
      invoiceRef: "Q-2026/893",
      imageUrl: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80",
      category: "COLD_CHAIN"
    },
    { 
      item: "Stainless Steel SS-304 Workstations & Racks", 
      cost: 180000, 
      vendor: "SteelFab Lucknow", 
      invoiceRef: "Q-2026/894",
      imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
      category: "SANITATION_PREP"
    },
    { 
      item: "FSSAI Commercial Cloud Kitchen Renovation & HVAC Ventilation", 
      cost: 350000, 
      vendor: "CivilTech Infrastructure", 
      invoiceRef: "EST-402",
      imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
      category: "INFRASTRUCTURE"
    },
    { 
      item: "Initial Raw Material Inventory (Belgian Cocoa, Flour, Butter, Packaging)", 
      cost: 200000, 
      vendor: "BulkAgro Suppliers", 
      invoiceRef: "INV-110",
      imageUrl: "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&w=600&q=80",
      category: "INVENTORY"
    },
    { 
      item: "Working Capital Reserve (3 Months Salaries & Utilities)", 
      cost: 500000, 
      vendor: "Bank Liquid Margin", 
      invoiceRef: "WC-01",
      imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
      category: "LIQUIDITY"
    }
  ],
  kitchenBlueprint: {
    sqFt: 850,
    haccpCertified: true,
    zones: [
      { name: "Zone 01: Raw Ingress & Sanitization", dim: "150 sq.ft", equipment: "Stainless Wash Vats & UV Sterilizers", status: "FSSAI Compliant" },
      { name: "Zone 02: Batch Prep & Spiral Mixing", dim: "220 sq.ft", equipment: "60L Spiral Mixer & Ingredient Silos", status: "Active" },
      { name: "Zone 03: Thermal Deck Baking", dim: "250 sq.ft", equipment: "3-Deck Convection Ovens & Exhaust Hoods", status: "Heavy 3-Phase Power" },
      { name: "Zone 04: Blast Chilling & Cold Retention", dim: "120 sq.ft", equipment: "-20°C Deep Freezers & Rapid Chiller", status: "Continuous Temp Logger" },
      { name: "Zone 05: Clean Packaging & Dispatch", dim: "110 sq.ft", equipment: "Sealing Stations & Delivery Aggregator Window", status: "Swiggy / Zomato Port" }
    ]
  },
  financialProjections: [
    { year: "Year 1 (Post-Moratorium)", monthlyOrders: 1800, revenue: 3600000, opex: 2160000, netProfit: 1440000, dscr: "2.45x (High Safety)", dscrValue: 2.45 },
    { year: "Year 2", monthlyOrders: 2600, revenue: 5200000, opex: 3016000, netProfit: 2184000, dscr: "3.20x", dscrValue: 3.20 },
    { year: "Year 3", monthlyOrders: 3500, revenue: 7000000, opex: 3920000, netProfit: 3080000, dscr: "4.15x", dscrValue: 4.15 },
    { year: "Year 4", monthlyOrders: 4200, revenue: 8400000, opex: 4620000, netProfit: 3780000, dscr: "5.10x", dscrValue: 5.10 },
    { year: "Year 5", monthlyOrders: 5000, revenue: 10000000, opex: 5400000, netProfit: 4600000, dscr: "6.22x", dscrValue: 6.22 }
  ],
  swotAndFeasibility: {
    strengths: "Proven campus customer retention, zero franchise royalty fees, standardized brownie recipe with 68% gross margin.",
    weaknesses: "First-generation commercial equipment operations (mitigated via 5-day free online EDP training on udyamiedp.org.in).",
    opportunities: "B2B supply partnerships with 14 local cafes in Hazratganj & Gomti Nagar and Zomato/Swiggy cloud kitchen listing.",
    threats: "Ingredient price volatility (hedged via 3-month raw material inventory reserve)."
  }
};

/**
 * Illustrative review-queue data for the prototype
 */
export const MOCK_HITL_QUEUE = [
  {
    id: "CIRCULAR-2026-04",
    title: "MoSJE Gazette Notification No. 104/2026",
    nodalSourceUrl: "https://socialjustice.gov.in/gazette/2026/notification-104.pdf",
    detectedBy: "Illustrative source-review step",
    scrapedAt: "2026-09-29T10:14:00Z",
    status: "PENDING_OFFICER_REVIEW",
    oldSchemeData: {
      maxProjectCost: "₹25,00,000",
      maxLoanAmount: "₹22,50,000",
      interestRate: "8.5% p.a.",
      moratoriumMonths: "6 Months",
      incomeCeiling: "₹3,00,000"
    },
    newAiExtractedData: {
      maxProjectCost: "₹50,00,000",
      maxLoanAmount: "₹45,00,000",
      interestRate: "8.0% p.a.",
      moratoriumMonths: "12 Months",
      incomeCeiling: "₹5,00,000"
    },
    confidenceScores: {
      maxProjectCost: 0.99,
      maxLoanAmount: 0.98,
      interestRate: 0.97,
      moratoriumMonths: 0.95,
      incomeCeiling: 0.99
    },
    diffSummary: [
      "Project cost ceiling doubled from ₹25 Lakhs to ₹50 Lakhs for commercial/manufacturing units.",
      "Family income ceiling harmonized upward to ₹5,00,000 across all NSFDC concessional loan categories.",
      "Base interest rate discounted by 50 bps to 8.0% p.a.",
      "Moratorium period extended from 6 to 12 months for machinery installation."
    ]
  }
];
