-- =============================================================================
-- SMART INDIA HACKATHON (SIH26092)
-- Ministry of Social Justice and Empowerment (MoSJE) - National Scheduled Castes Finance & Dev Corp (NSFDC)
-- Project: AI-Driven Scheme Matching for Marginalized Entrepreneurs (SAARTHI / UdyamSetu)
-- Database Architecture: PostgreSQL Production Schema & Constraints
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean drop for clean migration testing if needed
-- DROP TABLE IF EXISTS scheme_policy_revisions CASCADE;
-- DROP TABLE IF EXISTS applications CASCADE;
-- DROP TABLE IF EXISTS partner_scheme_authorizations CASCADE;
-- DROP TABLE IF EXISTS channel_partners CASCADE;
-- DROP TABLE IF EXISTS schemes CASCADE;
-- DROP TABLE IF EXISTS beneficiary_profiles CASCADE;

-- -----------------------------------------------------------------------------
-- 1. BENEFICIARY PROFILES TABLE
-- Stores target marginalized beneficiaries (Scheduled Caste with income <= 5.00 Lakhs)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS beneficiary_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aadhaar_hash VARCHAR(64) UNIQUE NOT NULL, -- SHA-256 for biometric privacy compliance
    full_name VARCHAR(150) NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    caste_category VARCHAR(50) NOT NULL DEFAULT 'SC' CHECK (caste_category IN ('SC', 'ST', 'OBC', 'GENERAL', 'MINORITY')),
    annual_family_income NUMERIC(12, 2) NOT NULL CHECK (annual_family_income >= 0),
    income_certificate_number VARCHAR(100),
    is_income_verified BOOLEAN DEFAULT FALSE,
    education_status VARCHAR(50) NOT NULL CHECK (
        education_status IN (
            'BELOW_8TH',
            '8TH_TO_10TH',
            '10TH_TO_12TH',
            'DIPLOMA',
            'GRADUATE',
            'POST_GRADUATE',
            'PROFESSIONAL'
        )
    ),
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    preferred_language VARCHAR(10) DEFAULT 'hi' CHECK (preferred_language IN ('en', 'hi', 'mr', 'ta', 'te', 'pa', 'bn', 'gu', 'kn', 'ml', 'or')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing for rapid geographical and categorical lookup
CREATE INDEX IF NOT EXISTS idx_beneficiary_location ON beneficiary_profiles (state, district);
CREATE INDEX IF NOT EXISTS idx_beneficiary_caste_income ON beneficiary_profiles (caste_category, annual_family_income);

-- -----------------------------------------------------------------------------
-- 2. SCHEMES MASTER CATALOG
-- Policy-as-Code store for MoSJE / NSFDC concessional financial products
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS schemes (
    id VARCHAR(50) PRIMARY KEY, -- e.g., 'NSFDC_MICRO_FINANCE', 'NSFDC_TERM_LOAN'
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    name_hindi VARCHAR(250) NOT NULL,
    ministry VARCHAR(150) NOT NULL DEFAULT 'Ministry of Social Justice and Empowerment (MoSJE)',
    nodal_corporation VARCHAR(150) NOT NULL DEFAULT 'NSFDC',
    purpose VARCHAR(50) NOT NULL CHECK (purpose IN ('BUSINESS', 'EDUCATION', 'AGRICULTURE_ALLIED')),
    category VARCHAR(100) NOT NULL,
    min_project_cost NUMERIC(12, 2) NOT NULL DEFAULT 10000.00,
    max_project_cost NUMERIC(12, 2) NOT NULL,
    max_loan_amount NUMERIC(12, 2) NOT NULL,
    max_funding_percent NUMERIC(5, 2) NOT NULL DEFAULT 90.00 CHECK (max_funding_percent <= 90.00), -- Sovereign 90% rule
    min_beneficiary_equity_percent NUMERIC(5, 2) NOT NULL DEFAULT 10.00, -- 10% own equity
    base_interest_rate_percent NUMERIC(5, 2) NOT NULL CHECK (base_interest_rate_percent BETWEEN 3.00 AND 18.00),
    women_rebate_percent NUMERIC(5, 2) DEFAULT 0.00,
    moratorium_min_months INT NOT NULL DEFAULT 3,
    moratorium_max_months INT NOT NULL DEFAULT 12,
    repayment_cadence VARCHAR(20) NOT NULL DEFAULT 'QUARTERLY' CHECK (repayment_cadence IN ('MONTHLY', 'QUARTERLY', 'HALF_YEARLY')),
    max_tenure_years INT NOT NULL DEFAULT 5,
    max_family_income_ceiling NUMERIC(12, 2) NOT NULL DEFAULT 500000.00, -- ₹5.00 Lakhs ceiling
    target_community VARCHAR(50) NOT NULL DEFAULT 'SC',
    official_source_url TEXT,
    policy_version VARCHAR(50) NOT NULL DEFAULT 'NSFDC-2026.01',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 3. CHANNEL PARTNERS DIRECTORY
-- Covers SCAs, PSBs, RRBs, and NBFC-MFIs with health & fund utilization indicators
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS channel_partners (
    id VARCHAR(50) PRIMARY KEY, -- e.g., 'PARTNER-UP-01', 'PARTNER-SBI-01'
    partner_code VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    agency_type VARCHAR(50) NOT NULL CHECK (agency_type IN ('SCA', 'PSB', 'RRB', 'NBFC_MFI', 'SFB')),
    agency_full_name VARCHAR(250) NOT NULL,
    branch_name VARCHAR(150) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    
    -- Routing Safety & Financial Health Indicators
    gross_npa_percent NUMERIC(5, 2) NOT NULL DEFAULT 3.20 CHECK (gross_npa_percent >= 0),
    overdue_rate_percent NUMERIC(5, 2) NOT NULL DEFAULT 4.10 CHECK (overdue_rate_percent >= 0),
    quarterly_fund_allocated NUMERIC(14, 2) NOT NULL DEFAULT 5000000.00,
    quarterly_fund_utilized NUMERIC(14, 2) NOT NULL DEFAULT 2100000.00,
    
    -- Operational Intake Status
    intake_status VARCHAR(20) NOT NULL DEFAULT 'ACCEPTING' CHECK (intake_status IN ('ACCEPTING', 'LIMITED', 'PAUSED', 'STALE')),
    intake_reason TEXT,
    avg_sla_days INT NOT NULL DEFAULT 3,
    appointment_available BOOLEAN DEFAULT TRUE,
    wheelchair_accessible BOOLEAN DEFAULT TRUE,
    languages_supported VARCHAR(50)[] DEFAULT ARRAY['hi', 'en'],
    
    -- Nodal Officer Desk
    nodal_officer_name VARCHAR(120) NOT NULL,
    nodal_contact_phone VARCHAR(25) NOT NULL,
    operating_hours VARCHAR(100) DEFAULT '10:00 AM - 5:00 PM (Mon-Sat)',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_health_sync TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Geospatial B-Tree and composite indexes for distance/health filtering
CREATE INDEX IF NOT EXISTS idx_partner_geo ON channel_partners (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_partner_health ON channel_partners (intake_status, gross_npa_percent, overdue_rate_percent);

-- -----------------------------------------------------------------------------
-- 4. PARTNER-SCHEME AUTHORIZATION JUNCTION
-- Specifies which Channel Partners are authorized to disburse which NSFDC Schemes
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS partner_scheme_authorizations (
    partner_id VARCHAR(50) REFERENCES channel_partners(id) ON DELETE CASCADE,
    scheme_id VARCHAR(50) REFERENCES schemes(id) ON DELETE CASCADE,
    allocated_tranche_amount NUMERIC(14, 2) DEFAULT 0,
    is_authorized BOOLEAN DEFAULT TRUE,
    authorized_since TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (partner_id, scheme_id)
);

-- -----------------------------------------------------------------------------
-- 5. BENEFICIARY APPLICATIONS TABLE
-- Stores full lifecycle of routed applications with sovereign audit trail
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_number VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'SAARTHI-2026-98124'
    beneficiary_id UUID REFERENCES beneficiary_profiles(id) ON DELETE RESTRICT,
    scheme_id VARCHAR(50) REFERENCES schemes(id) ON DELETE RESTRICT,
    allocated_partner_id VARCHAR(50) REFERENCES channel_partners(id) ON DELETE RESTRICT,
    
    project_type VARCHAR(50) NOT NULL,
    project_description TEXT,
    estimated_project_cost NUMERIC(12, 2) NOT NULL,
    sanctioned_loan_amount NUMERIC(12, 2) NOT NULL, -- Up to 90%
    beneficiary_own_equity NUMERIC(12, 2) NOT NULL, -- Min 10%
    effective_interest_rate NUMERIC(5, 2) NOT NULL,
    moratorium_months INT NOT NULL,
    repayment_tenure_years INT NOT NULL,
    calculated_cadence_emi NUMERIC(12, 2) NOT NULL,
    
    application_status VARCHAR(30) NOT NULL DEFAULT 'ROUTED' CHECK (
        application_status IN (
            'DRAFT',
            'SUBMITTED',
            'ROUTED',
            'DOCUMENT_VERIFIED',
            'SANCTIONED',
            'DISBURSED',
            'REJECTED'
        )
    ),
    
    -- Routing metadata explaining the AI allocation logic & safety checks
    routing_rationale JSONB NOT NULL DEFAULT '{}'::jsonb,
    audit_trail JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_applications_beneficiary ON applications (beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_applications_partner ON applications (allocated_partner_id, application_status);

-- -----------------------------------------------------------------------------
-- 6. ADMIN POLICY REVISION & HITL AUDIT TABLE
-- Supports Human-in-the-Loop validation of AI-extracted circulars vs old schemes
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS scheme_policy_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scheme_id VARCHAR(50) REFERENCES schemes(id) ON DELETE CASCADE,
    circular_ref_number VARCHAR(100) NOT NULL, -- e.g., 'MoSJE-Gazette-No-2026/04'
    source_document_url TEXT NOT NULL,
    
    -- Version Diff Snapshots
    old_scheme_snapshot JSONB NOT NULL,
    ai_extracted_snapshot JSONB NOT NULL,
    field_confidence_scores JSONB NOT NULL, -- Confidence score (0.00 to 1.00) for each extracted parameter
    detected_changes_summary JSONB NOT NULL,
    
    -- Adjudication State
    review_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (review_status IN ('PENDING', 'APPROVED', 'REJECTED', 'MODIFIED')),
    reviewed_by VARCHAR(100),
    reviewed_at TIMESTAMPTZ,
    admin_rationale TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_policy_review_status ON scheme_policy_revisions (review_status);

-- =============================================================================
-- SEED DATA: OFFICIAL NSFDC CONCESSIONAL SCHEMES (MoSJE)
-- =============================================================================
INSERT INTO schemes (
    id, code, name, name_hindi, purpose, category,
    min_project_cost, max_project_cost, max_loan_amount,
    max_funding_percent, min_beneficiary_equity_percent,
    base_interest_rate_percent, women_rebate_percent,
    moratorium_min_months, moratorium_max_months,
    repayment_cadence, max_tenure_years, max_family_income_ceiling,
    official_source_url, policy_version
) VALUES
(
    'NSFDC_MICRO_FINANCE', 'MFS-01',
    'Micro Finance Scheme (MFS)', 'लघु वित्त योजना (Micro Finance)',
    'BUSINESS', 'Micro Enterprises & Artisan Units',
    10000.00, 140000.00, 125000.00,
    90.00, 10.00,
    6.50, 0.00,
    3, 6,
    'QUARTERLY', 3, 500000.00,
    'https://nsfdc.nic.in/faqs', 'NSFDC-2026.01'
),
(
    'NSFDC_TERM_LOAN', 'TLS-03',
    'Term Loan Scheme (TLS)', 'सावधि ऋण योजना (Term Loan)',
    'BUSINESS', 'Commercial, Transport & Industrial Projects',
    140001.00, 5000000.00, 4500000.00,
    90.00, 10.00,
    8.00, 0.50, -- 0.5% rebate for women
    6, 12,
    'QUARTERLY', 5, 500000.00,
    'https://nsfdc.nic.in/faqs', 'NSFDC-2026.01'
),
(
    'NSFDC_EDUCATION_LOAN', 'ELS-05',
    'Educational Loan Scheme (ELS)', 'शिक्षा ऋण योजना (Education Loan)',
    'EDUCATION', 'Professional & Technical Higher Education',
    50000.00, 4000000.00, 3600000.00,
    90.00, 10.00,
    4.00, 0.50, -- 3.5% for female students
    36, 48, -- Course duration + 6 to 12 months grace
    'QUARTERLY', 5, 500000.00,
    'https://nsfdc.nic.in/faqs', 'NSFDC-2026.01'
),
(
    'NSFDC_AAJEEVIKA', 'AMFS-02',
    'Aajeevika Micro-Finance Scheme (via NBFC-MFIs)', 'आजीविका माइक्रो फाइनेंस (NBFC-MFI माध्यम)',
    'BUSINESS', 'Rapid Micro Finance via NBFC-MFIs',
    10000.00, 140000.00, 125000.00,
    90.00, 10.00,
    15.00, 0.00,
    1, 3,
    'MONTHLY', 2, 500000.00,
    'https://nsfdc.nic.in/faqs', 'NSFDC-2026.01'
)
ON CONFLICT (id) DO UPDATE SET
    max_project_cost = EXCLUDED.max_project_cost,
    max_loan_amount = EXCLUDED.max_loan_amount,
    base_interest_rate_percent = EXCLUDED.base_interest_rate_percent,
    updated_at = NOW();

-- =============================================================================
-- SEED DATA: CHANNEL PARTNERS WITH HEALTH INDICATORS (MOCKED NPA & FUND ALLOCATION)
-- =============================================================================
INSERT INTO channel_partners (
    id, partner_code, name, agency_type, agency_full_name, branch_name,
    district, state, pincode, latitude, longitude,
    gross_npa_percent, overdue_rate_percent,
    quarterly_fund_allocated, quarterly_fund_utilized,
    intake_status, intake_reason, avg_sla_days,
    nodal_officer_name, nodal_contact_phone
) VALUES
(
    'PARTNER-UP-01', 'SCA-UPSCFDC-LKO',
    'UPSCFDC - Central Directorate', 'SCA',
    'UP Scheduled Castes Finance & Development Corporation Ltd.', 'B-Block, Indira Bhawan, Lucknow',
    'Lucknow', 'Uttar Pradesh', '226001', 26.8467, 80.9462,
    2.40, 3.10, 15000000.00, 6800000.00, -- Safe: 45% fund utilized, low NPA
    'ACCEPTING', 'Active tranche available; direct PM-SURAJ desk operational', 3,
    'Shri R. K. Gautam (Manager Credit)', '+91 522 2288123'
),
(
    'PARTNER-UP-02', 'RRB-ARYAVART-ALM',
    'Aryavart Bank - Alambagh Branch', 'RRB',
    'Aryavart Regional Rural Bank (Sponsored by Bank of India)', 'Plot 14, Alambagh Market, Lucknow',
    'Lucknow', 'Uttar Pradesh', '226005', 26.8152, 80.9020,
    9.80, 14.50, 8000000.00, 7950000.00, -- DISQUALIFIED: High NPA 9.8% (>7%) & 99% fund exhausted
    'PAUSED', 'Intake temporarily paused pending quarterly fund reconciliation and audit; route to SCA or SFB', 9,
    'Ms. Sunita Verma (Lead District Officer)', '+91 522 2451990'
),
(
    'PARTNER-UP-03', 'SFB-UTKARSH-HZG',
    'Utkarsh Small Finance Bank', 'SFB',
    'Utkarsh Small Finance Bank Ltd.', 'Hazratganj Main, Lucknow',
    'Lucknow', 'Uttar Pradesh', '226001', 26.8524, 80.9412,
    3.10, 4.20, 6000000.00, 2400000.00, -- Safe: 40% utilized, low NPA
    'ACCEPTING', 'Active micro-lending quota; instant biometric e-KYC ready', 2,
    'Amit Saxena (Branch In-charge)', '+91 522 2618900'
),
(
    'PARTNER-UP-04', 'MFI-FUSION-GMT',
    'Fusion Micro Finance - Gomti Nagar Desk', 'NBFC_MFI',
    'Fusion Micro Finance Limited', 'Vibhuti Khand, Gomti Nagar, Lucknow',
    'Lucknow', 'Uttar Pradesh', '226010', 26.8722, 81.0024,
    4.50, 5.80, 4000000.00, 3100000.00, -- Limited: 77.5% utilized
    'LIMITED', 'Daily token limit reached; prior appointment recommended', 1,
    'Deepak Yadav (Territory Manager)', '+91 522 4022880'
)
ON CONFLICT (id) DO UPDATE SET
    gross_npa_percent = EXCLUDED.gross_npa_percent,
    overdue_rate_percent = EXCLUDED.overdue_rate_percent,
    quarterly_fund_utilized = EXCLUDED.quarterly_fund_utilized,
    intake_status = EXCLUDED.intake_status;

-- Link Schemes to Authorized Partners
INSERT INTO partner_scheme_authorizations (partner_id, scheme_id, is_authorized) VALUES
('PARTNER-UP-01', 'NSFDC_MICRO_FINANCE', TRUE),
('PARTNER-UP-01', 'NSFDC_TERM_LOAN', TRUE),
('PARTNER-UP-01', 'NSFDC_EDUCATION_LOAN', TRUE),
('PARTNER-UP-02', 'NSFDC_MICRO_FINANCE', FALSE), -- Revoked due to audit
('PARTNER-UP-02', 'NSFDC_TERM_LOAN', FALSE),
('PARTNER-UP-03', 'NSFDC_MICRO_FINANCE', TRUE),
('PARTNER-UP-04', 'NSFDC_AAJEEVIKA', TRUE)
ON CONFLICT DO NOTHING;
