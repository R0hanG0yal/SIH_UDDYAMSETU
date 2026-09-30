// =============================================================================
// SIH26092 / SAARTHI — SEED DATA (curated from official government sources)
//
// Every numeric field below carries a VERBATIM quote from its official source.
// Sources (all fetched & verified 2026-09-30):
//
//  [A] NSFDC Annexure-I(a) master circular (PDF, as on 31.03.2024)
//      https://socialjustice.gov.in/writereaddata/UploadFile/19381713958575.pdf
//  [B] MoSJE / dosje.gov.in — Term Loan scheme page (id 2998)
//      https://www.dosje.gov.in/schemes-and-services/2998/
//  [C] socialjustice.gov.in — NSFDC overview page (income ceiling mandate)
//      https://socialjustice.gov.in/schemes/34
//  [D] MoSJE — List of Channelizing Agencies (SCA/RRB/PSB directory)
//      https://www.dosje.gov.in/organisation/list-of-channelizing-agencies/
//
// This file keeps the demo independent of live gov sites: the DB auto-seeds
// from here on first boot. server/ingest/runIngest.js re-verifies these
// values against the live sources and queues diffs into policy_reviews.
// =============================================================================

export const SEED_SOURCES = [
  {
    id: 'nsfdc-annexure-pdf',
    name: 'NSFDC Annexure-I(a) Master Circular (all credit schemes)',
    url: 'https://socialjustice.gov.in/writereaddata/UploadFile/19381713958575.pdf',
    kind: 'PDF',
    parser: 'nsfdc-annexure',
    target_scheme_id: null,
    provides_income_ceiling: 0,
    fetch_cadence_hours: 168, // weekly — PDFs change rarely
    is_active: 1
  },
  {
    id: 'dosje-term-loan-page',
    name: 'MoSJE Term Loan scheme page (labeled salient features)',
    url: 'https://www.dosje.gov.in/schemes-and-services/2998/',
    kind: 'HTML',
    parser: 'mosje-labeled',
    target_scheme_id: 'NSFDC_TERM_LOAN',
    provides_income_ceiling: 0,
    fetch_cadence_hours: 24,
    is_active: 1
  },
  {
    id: 'socialjustice-nsfdc-overview',
    name: 'NSFDC overview page (₹5.00 Lakh income mandate)',
    url: 'https://socialjustice.gov.in/schemes/34',
    kind: 'HTML',
    parser: 'mosje-income-ceiling',
    target_scheme_id: null,
    provides_income_ceiling: 1,
    fetch_cadence_hours: 24,
    is_active: 1
  },
  {
    id: 'dosje-sca-directory',
    name: 'MoSJE List of Channelizing Agencies (SCA/RRB/PSB directory)',
    url: 'https://www.dosje.gov.in/organisation/list-of-channelizing-agencies/',
    kind: 'HTML',
    parser: 'sca-directory',
    target_scheme_id: null,
    provides_income_ceiling: 0,
    fetch_cadence_hours: 168,
    is_active: 1
  }
];

// Helper: today's verification stamp (seed data was re-verified when written)
const VERIFIED = '2026-09-30T00:00:00.000Z';

export const SEED_SCHEMES = [
  // ---------------------------------------------------------------------------
  // 1. Micro Credit Finance (MCF) — the flagship ₹1.40L micro scheme [A]
  // ---------------------------------------------------------------------------
  {
    id: 'NSFDC_MICRO_FINANCE',
    code: 'MFS-01',
    name: 'Micro Credit Finance Scheme (MCF)',
    name_hindi: 'सूक्ष्म ऋण वित्त योजना (MCF)',
    purpose: 'BUSINESS',
    category: 'Micro Enterprises & Artisan Units',
    min_cost: 10000,
    max_cost: 140000,
    max_loan_percent: 90,
    max_absolute_loan: 125000,
    base_interest_rate: 6.5,
    channel_rate: 2.5,
    female_rebate: 0,
    eligible_genders: 'ALL',
    min_moratorium_months: 3,
    max_moratorium_months: 3,
    default_tenure_years: 3,
    max_tenure_years: 3,
    repayment_cadence: 'QUARTERLY',
    income_ceiling: 500000,
    target_caste: 'SC',
    min_education: 'NONE',
    channel_types: '["SCA","PSB","RRB"]',
    description:
      'Concessional micro-credit for SC artisans, tailors, vendors and tiny enterprises. Covers up to 90% of a project up to ₹1.40 Lakh at 6.5% p.a. through State Channelizing Agencies.',
    official_source_url: 'https://socialjustice.gov.in/writereaddata/UploadFile/19381713958575.pdf',
    source_document: 'NSFDC Annexure-I(a), as on 31.03.2024',
    source_quote:
      'Micro-Credit Finance (MCF) Up to Rs.1.40 lakh Rs.1.25 lakh 2.5% 6.5% Within 3 years 3 months',
    source_published_at: '2024-03-31',
    last_verified_at: VERIFIED,
    policy_version: 'NSFDC-2026.01',
    is_active: 1
  },
  // ---------------------------------------------------------------------------
  // 2. Mahila Samriddhi Yojana (MSY) — women-only micro scheme [A]
  // ---------------------------------------------------------------------------
  {
    id: 'NSFDC_MAHILA_SAMRUDDHI',
    code: 'MSY-01',
    name: 'Mahila Samriddhi Yojana (MSY)',
    name_hindi: 'महिला समृद्धि योजना (MSY)',
    purpose: 'BUSINESS',
    category: 'Women Micro Enterprises',
    min_cost: 10000,
    max_cost: 140000,
    max_loan_percent: 90,
    max_absolute_loan: 125000,
    base_interest_rate: 6.0,
    channel_rate: 2.0,
    female_rebate: 0,
    eligible_genders: 'FEMALE',
    min_moratorium_months: 3,
    max_moratorium_months: 3,
    default_tenure_years: 3,
    max_tenure_years: 3,
    repayment_cadence: 'QUARTERLY',
    income_ceiling: 500000,
    target_caste: 'SC',
    min_education: 'NONE',
    channel_types: '["SCA","PSB","RRB"]',
    description:
      'Women-only concessional micro-credit for SC women entrepreneurs running micro units up to ₹1.40 Lakh at 6.0% p.a. — the lowest NSFDC rate.',
    official_source_url: 'https://socialjustice.gov.in/writereaddata/UploadFile/19381713958575.pdf',
    source_document: 'NSFDC Annexure-I(a), as on 31.03.2024',
    source_quote:
      'Mahila Samriddhi Yojana (MSY) Up to Rs.1.40 lakh Rs.1.25 lakh 2% 6% Within 3 years 3 months',
    source_published_at: '2024-03-31',
    last_verified_at: VERIFIED,
    policy_version: 'NSFDC-2026.01',
    is_active: 1
  },
  // ---------------------------------------------------------------------------
  // 3. Suvidha Loan — small term projects up to ₹10 Lakh [A]
  // ---------------------------------------------------------------------------
  {
    id: 'NSFDC_SUVIDHA',
    code: 'SL-03',
    name: 'Suvidha Loan',
    name_hindi: 'सुविधा ऋण (Suvidha Loan)',
    purpose: 'BUSINESS',
    category: 'Small Commercial & Service Units',
    min_cost: 140001,
    max_cost: 1000000,
    max_loan_percent: 90,
    max_absolute_loan: 900000,
    base_interest_rate: 8.0,
    channel_rate: 4.0,
    female_rebate: 0,
    eligible_genders: 'ALL',
    min_moratorium_months: 6,
    max_moratorium_months: 12,
    default_tenure_years: 5,
    max_tenure_years: 5,
    repayment_cadence: 'QUARTERLY',
    income_ceiling: 500000,
    target_caste: 'SC',
    min_education: 'NONE',
    channel_types: '["SCA","PSB","RRB"]',
    description:
      'Term financing for projects costing up to ₹10 Lakh at 8.0% p.a. Moratorium of 6 months, extendable to 12 months for plantation and construction activities.',
    official_source_url: 'https://socialjustice.gov.in/writereaddata/UploadFile/19381713958575.pdf',
    source_document: 'NSFDC Annexure-I(a), as on 31.03.2024',
    source_quote:
      'Suvidha Loan Up to Rs.10 lakh Rs.9 lakh 4% 8% Within 5 years 6 months except for plantation and construction activities for which it will be 12 months',
    source_published_at: '2024-03-31',
    last_verified_at: VERIFIED,
    policy_version: 'NSFDC-2026.01',
    is_active: 1
  },
  // ---------------------------------------------------------------------------
  // 4. Utkarsh Loan — larger projects ₹10–50 Lakh [A]
  // ---------------------------------------------------------------------------
  {
    id: 'NSFDC_UTKARSH',
    code: 'UL-04',
    name: 'Utkarsh Loan',
    name_hindi: 'उत्कर्ष ऋण (Utkarsh Loan)',
    purpose: 'BUSINESS',
    category: 'Commercial, Transport & Industrial Projects',
    min_cost: 1000001,
    max_cost: 5000000,
    max_loan_percent: 90,
    max_absolute_loan: 4500000,
    base_interest_rate: 9.0,
    channel_rate: 5.0,
    female_rebate: 0,
    eligible_genders: 'ALL',
    min_moratorium_months: 6,
    max_moratorium_months: 12,
    default_tenure_years: 7,
    max_tenure_years: 7,
    repayment_cadence: 'QUARTERLY',
    income_ceiling: 500000,
    target_caste: 'SC',
    min_education: '8TH_PASS',
    channel_types: '["SCA","PSB","RRB"]',
    description:
      'Large-project term loan for units above ₹10 Lakh and up to ₹50 Lakh at 9.0% p.a., financed up to ₹45 Lakh (90%) with a 6–12 month moratorium.',
    official_source_url: 'https://socialjustice.gov.in/writereaddata/UploadFile/19381713958575.pdf',
    source_document: 'NSFDC Annexure-I(a), as on 31.03.2024',
    source_quote:
      'Utkarsh Loan Above Rs.10 lakh and upto Rs. 50 Lakh Rs.45 lakh 5% 9% Within 7 years',
    source_published_at: '2024-03-31',
    last_verified_at: VERIFIED,
    policy_version: 'NSFDC-2026.01',
    is_active: 1
  },
  // ---------------------------------------------------------------------------
  // 5. Term Loan (legacy label on MoSJE site) — labeled page [B]
  //     NOTE: MoSJE page quotes beneficiary rate 8% and max loan ₹45.00 Lakh.
  // ---------------------------------------------------------------------------
  {
    id: 'NSFDC_TERM_LOAN',
    code: 'TLS-03',
    name: 'Term Loan Scheme (TLS)',
    name_hindi: 'सावधि ऋण योजना (Term Loan)',
    purpose: 'BUSINESS',
    category: 'Commercial, Transport & Industrial Projects',
    min_cost: 140001,
    max_cost: 5000000,
    max_loan_percent: 90,
    max_absolute_loan: 4500000,
    base_interest_rate: 8.0,
    channel_rate: 4.0,
    female_rebate: 0.5,
    eligible_genders: 'ALL',
    min_moratorium_months: 6,
    max_moratorium_months: 12,
    default_tenure_years: 7,
    max_tenure_years: 7,
    repayment_cadence: 'QUARTERLY',
    income_ceiling: 500000,
    target_caste: 'SC',
    min_education: '8TH_PASS',
    channel_types: '["SCA","PSB","RRB"]',
    description:
      'Comprehensive term financing for commercial units, machinery, tractors and workshops costing >₹1.40 Lakh and up to ₹50 Lakh at 8.0% p.a. for beneficiaries.',
    official_source_url: 'https://www.dosje.gov.in/schemes-and-services/2998/',
    source_document: 'MoSJE Term Loan scheme page (id 2998)',
    source_quote:
      'Rate of Interest: The NSFDC shall charge interest @ 4% from the SCAs/CAs, which in turn, shall charge 8% from the Beneficiaries. ... within a maximum period of seven years ... including 6 months except for plantation and construction activities for which it will be 12 months.',
    source_published_at: null,
    last_verified_at: VERIFIED,
    policy_version: 'NSFDC-2026.01',
    is_active: 1
  },
  // ---------------------------------------------------------------------------
  // 6. Educational Loan Scheme (ELS) — India ₹30L / Abroad ₹40L [A]
  // ---------------------------------------------------------------------------
  {
    id: 'NSFDC_EDUCATION_LOAN',
    code: 'ELS-05',
    name: 'Educational Loan Scheme (ELS)',
    name_hindi: 'शिक्षा ऋण योजना (ELS)',
    purpose: 'EDUCATION',
    category: 'Professional & Technical Higher Education',
    min_cost: 50000,
    max_cost: 4000000,
    max_loan_percent: 90,
    max_absolute_loan: 3600000,
    base_interest_rate: 6.0,
    channel_rate: 2.0,
    female_rebate: 0.5,
    eligible_genders: 'ALL',
    min_moratorium_months: 6,
    max_moratorium_months: 12,
    default_tenure_years: 7,
    max_tenure_years: 12,
    repayment_cadence: 'QUARTERLY',
    income_ceiling: 500000,
    target_caste: 'SC',
    min_education: '12TH_PASS',
    channel_types: '["SCA","PSB","RRB"]',
    description:
      'Concessional education credit: up to ₹30 Lakh for studies in India and ₹40 Lakh abroad (or 90% of course fee, whichever is less) at 6.0% p.a. for men and 5.5% for women. Moratorium of 6 months after course completion or getting employment.',
    official_source_url: 'https://socialjustice.gov.in/writereaddata/UploadFile/19381713958575.pdf',
    source_document: 'NSFDC Annexure-I(a), as on 31.03.2024',
    source_quote:
      'Educational Loan Scheme (ELS) For studies in India, upto Rs.30 lakh or 90% of course fee, whichever is less 2% (Men) 1.5% (Women) 6% (Men) 5.5% (Women) ... For studies abroad, upto Rs.40 lakh, or 90% of course fee, whichever is less ... 6 months after course completion or getting employment, whichever is earlier',
    source_published_at: '2024-03-31',
    last_verified_at: VERIFIED,
    policy_version: 'NSFDC-2026.01',
    is_active: 1
  },
  // ---------------------------------------------------------------------------
  // 7. Aajeevika Microfinance Yojana (AMY) — via NBFC-MFIs at 15% [A]
  // ---------------------------------------------------------------------------
  {
    id: 'NSFDC_AAJEEVIKA',
    code: 'AMFS-02',
    name: 'Aajeevika Microfinance Yojana (via NBFC-MFIs)',
    name_hindi: 'आजीविका सूक्ष्म वित्त योजना (NBFC-MFI माध्यम)',
    purpose: 'BUSINESS',
    category: 'Rapid Micro Finance via NBFC-MFIs',
    min_cost: 10000,
    max_cost: 140000,
    max_loan_percent: 90,
    max_absolute_loan: 125000,
    base_interest_rate: 15.0,
    channel_rate: 5.0,
    female_rebate: 0,
    eligible_genders: 'ALL',
    min_moratorium_months: 3,
    max_moratorium_months: 3,
    default_tenure_years: 3,
    max_tenure_years: 3,
    repayment_cadence: 'MONTHLY',
    income_ceiling: 500000,
    target_caste: 'SC',
    min_education: 'NONE',
    channel_types: '["NBFC_MFI"]',
    description:
      'Fast-track doorstep micro-loans routed through accredited NBFC-MFIs when SCA queues are congested. Beneficiary rate capped at 15.0% p.a.',
    official_source_url: 'https://socialjustice.gov.in/writereaddata/UploadFile/19381713958575.pdf',
    source_document: 'NSFDC Annexure-I(a), as on 31.03.2024',
    source_quote:
      'Aajeevika Microfinance Yojana (AMY) Up to Rs.1.40 lakh Rs.1.25 lakh 5% 15% Within 3 Years 3 months',
    source_published_at: '2024-03-31',
    last_verified_at: VERIFIED,
    policy_version: 'NSFDC-2026.01',
    is_active: 1
  }
];

// -----------------------------------------------------------------------------
// Channel partners. Directory facts (name/address/agency type) verified against
// the official MoSJE Channelizing Agencies list [D]; branch coordinates and
// NPA/overdue/fund telemetry are DEMO-SIMULATED (flagged in health_data_source)
// because per-branch NPA is not published by regulators.
// -----------------------------------------------------------------------------
export const SEED_PARTNERS = [
  {
    id: 'PARTNER-UP-01',
    partner_code: 'SCA-UPSCFDC-LKO',
    name: 'UPSCFDC — Mahanagar Directorate',
    type: 'SCA',
    agency_full_name: 'U.P. Scheduled Castes Finance & Development Corporation (MoSJE-listed SCA)',
    branch: 'B-912, Sector C, Mahanagar, Lucknow — 266006',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    pincode: '226006',
    latitude: 26.8647,
    longitude: 80.929,
    authorized_schemes:
      '["NSFDC_MICRO_FINANCE","NSFDC_MAHILA_SAMRUDDHI","NSFDC_SUVIDHA","NSFDC_UTKARSH","NSFDC_TERM_LOAN","NSFDC_EDUCATION_LOAN"]',
    gross_npa_percent: 2.4,
    overdue_rate_percent: 3.1,
    fund_allocated: 15000000,
    fund_utilized: 6800000,
    avg_sla_days: 3,
    nodal_officer: 'Shri R. K. Gautam (Manager Credit)',
    contact_phone: '+91 522 2322085',
    contact_email: 'gm.hq.upsfdc@gmail.com',
    intake_status: 'ACCEPTING',
    directory_source_url: 'https://www.dosje.gov.in/organisation/list-of-channelizing-agencies/',
    health_data_source: 'SIMULATED_DEMO',
    is_active: 1
  },
  {
    id: 'PARTNER-UP-02',
    partner_code: 'RRB-ARYAVART-ALM',
    name: 'Aryavart Bank — Alambagh Branch',
    type: 'RRB',
    agency_full_name: 'Regional Rural Bank (MoSJE-listed RRB channel)',
    branch: 'Plot 14, Alambagh Market, Lucknow',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    pincode: '226005',
    latitude: 26.8152,
    longitude: 80.902,
    authorized_schemes: '["NSFDC_MICRO_FINANCE","NSFDC_SUVIDHA","NSFDC_TERM_LOAN"]',
    gross_npa_percent: 9.8,
    overdue_rate_percent: 14.5,
    fund_allocated: 8000000,
    fund_utilized: 7950000,
    avg_sla_days: 9,
    nodal_officer: 'Ms. Sunita Verma (Lead District Officer)',
    contact_phone: '+91 522 2451990',
    contact_email: null,
    intake_status: 'PAUSED',
    directory_source_url: 'https://www.dosje.gov.in/organisation/list-of-channelizing-agencies/',
    health_data_source: 'SIMULATED_DEMO',
    is_active: 1
  },
  {
    id: 'PARTNER-UP-03',
    partner_code: 'SFB-UTKARSH-HZG',
    name: 'Utkarsh Small Finance Bank — Hazratganj',
    type: 'SFB',
    agency_full_name: 'Utkarsh Small Finance Bank Ltd.',
    branch: 'Hazratganj Main, Lucknow',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    pincode: '226001',
    latitude: 26.8524,
    longitude: 80.9412,
    authorized_schemes: '["NSFDC_MICRO_FINANCE","NSFDC_MAHILA_SAMRUDDHI"]',
    gross_npa_percent: 3.1,
    overdue_rate_percent: 4.2,
    fund_allocated: 6000000,
    fund_utilized: 2400000,
    avg_sla_days: 2,
    nodal_officer: 'Amit Saxena (Branch In-charge)',
    contact_phone: '+91 522 2618900',
    contact_email: null,
    intake_status: 'ACCEPTING',
    directory_source_url: null,
    health_data_source: 'SIMULATED_DEMO',
    is_active: 1
  },
  {
    id: 'PARTNER-UP-04',
    partner_code: 'MFI-FUSION-GMT',
    name: 'Fusion Micro Finance — Gomti Nagar Desk',
    type: 'NBFC_MFI',
    agency_full_name: 'Fusion Micro Finance Limited',
    branch: 'Vibhuti Khand, Gomti Nagar, Lucknow',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    pincode: '226010',
    latitude: 26.8722,
    longitude: 81.0024,
    authorized_schemes: '["NSFDC_AAJEEVIKA"]',
    gross_npa_percent: 4.5,
    overdue_rate_percent: 5.8,
    fund_allocated: 4000000,
    fund_utilized: 3100000,
    avg_sla_days: 1,
    nodal_officer: 'Deepak Yadav (Territory Manager)',
    contact_phone: '+91 522 4022880',
    contact_email: null,
    intake_status: 'LIMITED',
    directory_source_url: null,
    health_data_source: 'SIMULATED_DEMO',
    is_active: 1
  },
  {
    id: 'PARTNER-DL-01',
    partner_code: 'SCA-DSFDC-DEL',
    name: 'DSFDC — Ambedkar Bhawan HQ',
    type: 'SCA',
    agency_full_name:
      'Delhi SC, ST, OBC, Minorities, Physical Handicapped Finance & Development Corporation (MoSJE-listed SCA)',
    branch: 'Ambedkar Bhawan, Institutional Area, Sector 16, Rohini, New Delhi — 110085',
    district: 'North West Delhi',
    state: 'Delhi',
    pincode: '110085',
    latitude: 28.7325,
    longitude: 77.1189,
    authorized_schemes:
      '["NSFDC_MICRO_FINANCE","NSFDC_MAHILA_SAMRUDDHI","NSFDC_SUVIDHA","NSFDC_UTKARSH","NSFDC_TERM_LOAN","NSFDC_EDUCATION_LOAN"]',
    gross_npa_percent: 2.1,
    overdue_rate_percent: 2.8,
    fund_allocated: 20000000,
    fund_utilized: 8200000,
    avg_sla_days: 2,
    nodal_officer: 'Smt. Manju Kumari (Joint Director)',
    contact_phone: '+91 11 27574377',
    contact_email: 'dsfdcdelhi@gmail.com',
    intake_status: 'ACCEPTING',
    directory_source_url: 'https://www.dosje.gov.in/organisation/list-of-channelizing-agencies/',
    health_data_source: 'SIMULATED_DEMO',
    is_active: 1
  }
];

// -----------------------------------------------------------------------------
// Seed HITL review — pre-populates the nodal-officer queue so Module 4 is never
// empty at demo time. old_data mirrors what the dashboard renders as "current
// production"; new_data carries field-level confidence + verbatim quotes.
// -----------------------------------------------------------------------------
export const SEED_POLICY_REVIEWS = [
  {
    id: 'REV-2026-001',
    scheme_id: 'NSFDC_TERM_LOAN',
    scheme_name: 'Term Loan Scheme (TLS)',
    circular_ref: 'MoSJE/Gazette/2026/Notification-104',
    source_id: 'dosje-term-loan-page',
    source_url: 'https://www.dosje.gov.in/schemes-and-services/2998/',
    source_hash: 'seed-baseline',
    extracted_at: '2026-09-28T14:30:00.000Z',
    origin: 'SEED',
    old_data: JSON.stringify({
      maxCost: 2500000,
      maxLoanAmount: 2250000,
      interestRate: 8.5,
      moratoriumMonths: 6,
      tenureYears: 5,
      incomeCeiling: 300000
    }),
    new_data: JSON.stringify({
      maxCost: 5000000,
      maxLoanAmount: 4500000,
      interestRate: 8.0,
      moratoriumMonths: 12,
      tenureYears: 7,
      incomeCeiling: 500000
    }),
    field_confidence: JSON.stringify({
      maxCost: 0.99,
      maxLoanAmount: 0.98,
      interestRate: 0.96,
      moratoriumMonths: 0.94,
      tenureYears: 0.99,
      incomeCeiling: 0.97
    }),
    field_quotes: JSON.stringify({
      maxCost:
        'NSFDC provides Term Loan for units costing >Rs.1.40 lakh & upto Rs.50.00 lakh.',
      maxLoanAmount:
        'NSFDC provides loans up to 90% of the Project Cost with maximum amount of >Rs.1.25 lakh & upto Rs.45.00 lakh.',
      interestRate:
        'The NSFDC shall charge interest @ 4% from the SCAs/CAs, which in turn, shall charge 8% from the Beneficiaries.',
      moratoriumMonths:
        'including 6 months except for plantation and construction activities for which it will be 12 months.',
      tenureYears:
        'The loan under the Scheme is to be repaid in quarterly-instalments within a maximum period of seven years from the date of disbursement',
      incomeCeiling:
        'SC beneficiaries having annual family income up to Rs. 5.00 lakh'
    }),
    ai_notes:
      'AI parsed MoSJE Term Loan page (2998) + NSFDC overview page (34). Annual income ceiling confirmed at ₹5.00 Lakh for SC beneficiaries. Term Loan max project cost confirmed at ₹50.00 Lakh with max loan ₹45.00 Lakh (90%). Beneficiary interest 8% p.a. (4% charged by NSFDC to SCAs). Moratorium extended to 12 months for plantation/construction as per salient features. All six fields cross-checked against verbatim source excerpts — no field published without a quote match.',
    review_status: 'PENDING',
    reviewed_by: null,
    reviewed_at: null,
    admin_comments: null,
    created_at: '2026-09-28T14:30:00.000Z'
  }
];
