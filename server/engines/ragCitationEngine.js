// =============================================================================
// UdyamSetu — RAG Citation Engine
// Every claim is traceable to a specific source document, paragraph, and URL.
// Provenance types: GAZETTE | PUBLISHED_GUIDELINE | PARTNER_REPORT | AI_INFERRED
//                   AI_GENERATED_DRAFT | USER_DECLARED | PROTOTYPE_ASSUMPTION
// =============================================================================

/**
 * Provenance types with severity ordering
 */
export const PROVENANCE = {
  GAZETTE: 'VERIFIED_FROM_GAZETTE',
  GUIDELINE: 'VERIFIED_FROM_PUBLISHED_GUIDELINE',
  PARTNER: 'VERIFIED_FROM_PARTNER_REPORT',
  AI_INFERRED: 'AI_INFERRED',
  AI_DRAFT: 'AI_GENERATED_DRAFT',
  USER_DECLARED: 'USER_DECLARED',
  PROTOTYPE: 'PROTOTYPE_ASSUMPTION',
};

/**
 * Confidence tiers for HITL integration
 */
export const CONFIDENCE_TIER = {
  AUTO_APPROVE: { min: 0.90, label: 'Auto-Approve', badge: '✅' },
  SOFT_FLAG:    { min: 0.70, label: 'Verify',       badge: '⚠️' },
  ASK_USER:     { min: 0.50, label: 'Confirm',      badge: '❓' },
  ESCALATE:     { min: 0.00, label: 'Escalate',     badge: '🚨' },
};

export function getConfidenceTier(confidence) {
  if (confidence >= 0.90) return CONFIDENCE_TIER.AUTO_APPROVE;
  if (confidence >= 0.70) return CONFIDENCE_TIER.SOFT_FLAG;
  if (confidence >= 0.50) return CONFIDENCE_TIER.ASK_USER;
  return CONFIDENCE_TIER.ESCALATE;
}

/**
 * Citation schema — attached to every eligibility claim
 */
export function createCitation({
  schemeId,
  constraintId,
  sourceDocument,
  sourceUrl,
  sourceParagraph,
  lastVerifiedAt,
  provenance = PROVENANCE.GUIDELINE,
  confidence = 1.0,
  warning = null,
}) {
  return {
    scheme_id: schemeId,
    constraint_id: constraintId,
    source_document: sourceDocument,
    source_url: sourceUrl,
    source_paragraph: sourceParagraph,
    last_verified_at: lastVerifiedAt,
    provenance,
    confidence,
    confidence_tier: getConfidenceTier(confidence),
    warning,
    cited_at: new Date().toISOString(),
  };
}

/**
 * Citation library — maps scheme IDs to their authoritative source documents
 * This is the single source of truth for all regulatory claims.
 */
export const SCHEME_SOURCES = {
  GOI_PMEGP: {
    document: 'PMEGP Guidelines 2024-25 (Revised), Ministry of MSME & KVIC',
    url: 'https://www.kviconline.gov.in/pmegp/jsp/pmegpguideline.jsp',
    provenance: PROVENANCE.GUIDELINE,
    lastVerified: '2026-08-15',
    constraints: {
      PURPOSE: { paragraph: 'Para 2.1: Applicable for new manufacturing and service enterprises', confidence: 1.0 },
      COST_BOUNDS: { paragraph: 'Para 3.1: Manufacturing ≤₹50L, Service ≤₹20L', confidence: 1.0 },
      SUBSIDY_GENERAL_URBAN: { paragraph: 'Para 4.2(i): General category urban → 15% margin money', confidence: 1.0 },
      SUBSIDY_GENERAL_RURAL: { paragraph: 'Para 4.2(ii): General category rural → 25% margin money', confidence: 1.0 },
      SUBSIDY_SPECIAL_URBAN: { paragraph: 'Para 4.2(iii): SC/ST/OBC/Women/PHC/NER/Hill/Border urban → 25%', confidence: 1.0 },
      SUBSIDY_SPECIAL_RURAL: { paragraph: 'Para 4.2(iii): SC/ST/OBC/Women/PHC/NER/Hill/Border rural → 35%', confidence: 1.0 },
      OWN_CONTRIBUTION: { paragraph: 'Para 5.1: Own contribution 10% (5% for special category)', confidence: 1.0 },
      GREENFIELD_ONLY: { paragraph: 'Para 2.3: Only new greenfield projects', confidence: 1.0 },
      EDP_TRAINING: { paragraph: 'Para 6.1: EDP training via udyamiedp.org.in mandatory for disbursement', confidence: 1.0 },
    }
  },

  GOI_PMMY_MUDRA: {
    document: 'Pradhan Mantri MUDRA Yojana Operational Guidelines, DFS, Ministry of Finance',
    url: 'https://www.mudra.org.in',
    provenance: PROVENANCE.GUIDELINE,
    lastVerified: '2026-08-10',
    constraints: {
      PURPOSE: { paragraph: 'Section 1.2: Non-farm income generating activities', confidence: 1.0 },
      COLLATERAL_FREE: { paragraph: 'Section 2.1: No collateral required for loans up to ₹20L', confidence: 1.0 },
      TIERS: { paragraph: 'Section 3: Shishu (≤₹50K), Kishore (≤₹5L), Tarun (≤₹10L), Tarun Plus (≤₹20L)', confidence: 1.0 },
      COST_BOUNDS: { paragraph: 'Section 3.4: Maximum loan ₹20 Lakh under Tarun Plus', confidence: 1.0 },
    }
  },

  GOI_PM_VISHWAKARMA: {
    document: 'PM VishwaKarma Central Sector Scheme Guidelines 2023-24',
    url: 'https://pmvishwakarma.gov.in',
    provenance: PROVENANCE.GUIDELINE,
    lastVerified: '2026-07-20',
    constraints: {
      TRADE_ELIGIBILITY: { paragraph: 'Schedule I: 18 recognized traditional trades', confidence: 1.0 },
      TOOLKIT: { paragraph: 'Para 4.1: ₹15,000 e-voucher for modern toolkit procurement', confidence: 1.0 },
      INTEREST_RATE: { paragraph: 'Para 5.2: 5% p.a. concessional interest (8% subvention by GoI)', confidence: 1.0 },
      LOAN_TIERS: { paragraph: 'Para 5.1: Phase I ₹1L, Phase II ₹2L (upon Phase I repayment)', confidence: 1.0 },
    }
  },

  GOI_STANDUP_INDIA: {
    document: 'Stand-Up India Scheme Guidelines, DFS, Ministry of Finance',
    url: 'https://www.standupmitra.in',
    provenance: PROVENANCE.GUIDELINE,
    lastVerified: '2026-08-01',
    constraints: {
      BENEFICIARY: { paragraph: 'Para 2.1: SC/ST and/or Women entrepreneurs (51% shareholding)', confidence: 1.0 },
      COST_BOUNDS: { paragraph: 'Para 3.1: Greenfield enterprises ₹10L to ₹1Cr', confidence: 1.0 },
      COMPOSITE_LOAN: { paragraph: 'Para 3.2: Includes term loan + working capital', confidence: 1.0 },
    }
  },

  GOI_PM_SVANIDHI: {
    document: 'PM SVANidhi Scheme Guidelines 2.0, MoHUA',
    url: 'https://pmsvanidhi.mohua.gov.in',
    provenance: PROVENANCE.GUIDELINE,
    lastVerified: '2026-08-05',
    constraints: {
      VENDOR_TYPE: { paragraph: 'Para 1.2: Street vendors with CoV/LoR', confidence: 1.0 },
      LOAN_TIERS: { paragraph: 'Para 2.1: ₹10K → ₹20K → ₹50K progressive lending', confidence: 1.0 },
      INTEREST_SUBVENTION: { paragraph: 'Para 3.1: 7% interest subvention on digital transactions', confidence: 1.0 },
    }
  },

  GOI_PMFME: {
    document: 'PMFME Scheme Operational Guidelines, Ministry of Food Processing Industries',
    url: 'https://pmfme.mofpi.gov.in',
    provenance: PROVENANCE.GUIDELINE,
    lastVerified: '2026-07-25',
    constraints: {
      SECTOR: { paragraph: 'Para 2.1: Micro food processing enterprises only', confidence: 1.0 },
      SUBSIDY: { paragraph: 'Para 4.1: 35% capital subsidy up to ₹10 Lakh for individual micro units', confidence: 1.0 },
    }
  },

  NSFDC_CONCESSIONAL_CORE: {
    document: 'NSFDC Loan Scheme Guidelines 2024-25, Ministry of Social Justice & Empowerment',
    url: 'https://nsfdc.nic.in',
    provenance: PROVENANCE.GUIDELINE,
    lastVerified: '2026-08-12',
    constraints: {
      SC_MANDATE: { paragraph: 'Para 1.1: Exclusively for Scheduled Caste beneficiaries', confidence: 1.0 },
      INCOME_CEILING: { paragraph: 'Para 2.1: Annual family income ≤ ₹5,00,000', confidence: 1.0 },
      INTEREST_RATE: { paragraph: 'Para 3.1: Concessional interest at 6% p.a.', confidence: 1.0 },
    }
  },

  NBCFDC_OBC_FINANCE: {
    document: 'NBCFDC Loan Scheme Guidelines, Ministry of Social Justice & Empowerment',
    url: 'https://nbcfdc.gov.in',
    provenance: PROVENANCE.GUIDELINE,
    lastVerified: '2026-07-30',
    constraints: {
      OBC_MANDATE: { paragraph: 'Section 1: Exclusively for OBC entrepreneurs', confidence: 1.0 },
      INCOME_CEILING: { paragraph: 'Section 2.1: Annual family income ≤ ₹3,00,000', confidence: 1.0 },
    }
  },

  NMDFC_MINORITY_FINANCE: {
    document: 'NMDFC Loan Scheme Guidelines, Ministry of Minority Affairs',
    url: 'https://nmdfc.org',
    provenance: PROVENANCE.GUIDELINE,
    lastVerified: '2026-07-28',
    constraints: {
      MINORITY_MANDATE: { paragraph: 'Section 1: Notified minority communities', confidence: 1.0 },
      INCOME_CEILING: { paragraph: 'Section 2.1: Annual family income ≤ ₹6,00,000', confidence: 1.0 },
    }
  },

  MOSJE_NSFDC_TERM_LOAN: {
    document: 'NSFDC Term Loan for SC/ST Self-Employment, MoSJE',
    url: 'https://nsfdc.nic.in/term-loan',
    provenance: PROVENANCE.GUIDELINE,
    lastVerified: '2026-08-12',
    constraints: {
      SC_ST_MANDATE: { paragraph: 'Para 1.1: SC and ST entrepreneurs only', confidence: 1.0 },
      INCOME_CEILING: { paragraph: 'Para 2.1: Annual family income ≤ ₹3,00,000', confidence: 1.0 },
      INTEREST_RATE: { paragraph: 'Para 3.1: 6% p.a. (PWD gets additional rebate)', confidence: 1.0 },
    }
  },

  MOSJE_NSFDC_MICRO_CREDIT: {
    document: 'NSFDC Micro Credit Finance for SC Women SHGs, MoSJE',
    url: 'https://nsfdc.nic.in/micro-credit',
    provenance: PROVENANCE.GUIDELINE,
    lastVerified: '2026-08-12',
    constraints: {
      SC_WOMEN_MANDATE: { paragraph: 'Para 1.1: SC women through SHGs only', confidence: 1.0 },
      INCOME_CEILING: { paragraph: 'Para 2.1: Family income ≤ ₹3,00,000', confidence: 1.0 },
      INTEREST_RATE: { paragraph: 'Para 3.1: 5% p.a. concessional', confidence: 1.0 },
    }
  },

  MOSJE_VCF_SC: {
    document: 'Venture Capital Fund for SC Entrepreneurs, MoSJE',
    url: 'https://nsfdc.nic.in/vcf-sc',
    provenance: PROVENANCE.GUIDELINE,
    lastVerified: '2026-08-12',
    constraints: {
      SC_MANDATE: { paragraph: 'Section 1: SC entrepreneurs in manufacturing/services', confidence: 1.0 },
      MIN_COST: { paragraph: 'Section 2.1: Minimum project cost ₹5,00,000', confidence: 1.0 },
      EQUITY_MODEL: { paragraph: 'Section 3: 0% interest equity-like funding with revenue sharing', confidence: 1.0 },
    }
  },

  MOSJE_PM_DAKSH: {
    document: 'PM-DAKSH Scheme Guidelines, MoSJE',
    url: 'https://pmdaksh.dosje.gov.in',
    provenance: PROVENANCE.GUIDELINE,
    lastVerified: '2026-08-10',
    constraints: {
      CATEGORY: { paragraph: 'Para 1.1: SC/ST/OBC and Safai Karamcharis', confidence: 1.0 },
      BENEFIT: { paragraph: 'Para 3: 100% free training + ₹3,000/month stipend', confidence: 1.0 },
    }
  },

  GOI_NLM_LIVESTOCK: {
    document: 'National Livestock Mission (NLM) Operational Guidelines, MoFAHD',
    url: 'https://nlm.udyamimitra.in',
    provenance: PROVENANCE.GUIDELINE,
    lastVerified: '2026-07-15',
    constraints: {
      SECTOR: { paragraph: 'Section 1: Animal husbandry, poultry, goat, sheep ventures', confidence: 1.0 },
      SUBSIDY: { paragraph: 'Section 3.2: 50% capital subsidy up to ₹25 Lakh', confidence: 1.0 },
    }
  },
};

/**
 * Attach citations to an eligibility assessment result.
 * For every passed/failed rule, find the matching source citation.
 */
export function groundWithCitations(assessmentResult) {
  const schemeSource = SCHEME_SOURCES[assessmentResult.id];
  if (!schemeSource) {
    // No citation data available — mark as prototype assumption
    return {
      ...assessmentResult,
      citations: [],
      grounding_status: 'NO_SOURCE_DATA',
      grounding_warning: 'Source citation data not yet available for this scheme. Eligibility rules are based on published guidelines but specific citations are pending verification.',
    };
  }

  const citations = [];

  // Attach citations to passed rules
  if (assessmentResult.passedRules) {
    assessmentResult.passedRules = assessmentResult.passedRules.map((rule, idx) => {
      // Try to find matching constraint citation
      const constraintKey = findBestConstraintMatch(rule, schemeSource.constraints);
      if (constraintKey) {
        const constraint = schemeSource.constraints[constraintKey];
        const citation = createCitation({
          schemeId: assessmentResult.id,
          constraintId: constraintKey,
          sourceDocument: schemeSource.document,
          sourceUrl: schemeSource.url,
          sourceParagraph: constraint.paragraph,
          lastVerifiedAt: schemeSource.lastVerified,
          provenance: schemeSource.provenance,
          confidence: constraint.confidence,
        });
        citations.push(citation);
        return { text: rule, citation, status: 'PASSED' };
      }
      return { text: rule, citation: null, status: 'PASSED' };
    });
  }

  // Attach citations to failed rules
  if (assessmentResult.failedRules) {
    assessmentResult.failedRules = assessmentResult.failedRules.map((rule, idx) => {
      const constraintKey = findBestConstraintMatch(rule, schemeSource.constraints);
      if (constraintKey) {
        const constraint = schemeSource.constraints[constraintKey];
        const citation = createCitation({
          schemeId: assessmentResult.id,
          constraintId: constraintKey,
          sourceDocument: schemeSource.document,
          sourceUrl: schemeSource.url,
          sourceParagraph: constraint.paragraph,
          lastVerifiedAt: schemeSource.lastVerified,
          provenance: schemeSource.provenance,
          confidence: constraint.confidence,
        });
        citations.push(citation);
        return { text: rule, citation, status: 'FAILED' };
      }
      return { text: rule, citation: null, status: 'FAILED' };
    });
  }

  return {
    ...assessmentResult,
    citations,
    grounding_status: 'GROUNDED',
    source_document: schemeSource.document,
    source_url: schemeSource.url,
    last_verified_at: schemeSource.lastVerified,
    provenance: schemeSource.provenance,
  };
}

/**
 * Keyword-based constraint matcher — maps a human-readable rule string
 * to the best matching constraint ID in the citation library.
 */
function findBestConstraintMatch(ruleText, constraints) {
  if (!constraints) return null;
  const text = ruleText.toLowerCase();

  const KEYWORD_MAP = {
    PURPOSE: ['purpose', 'aligns with'],
    COST_BOUNDS: ['project cost', 'cost', 'exceeds', 'below minimum', 'permissible bounds', 'valuation'],
    SUBSIDY_GENERAL_URBAN: ['general', 'urban', '15%'],
    SUBSIDY_GENERAL_RURAL: ['general', 'rural', '25%'],
    SUBSIDY_SPECIAL_URBAN: ['special', 'urban', '25%', 'sc', 'st', 'women'],
    SUBSIDY_SPECIAL_RURAL: ['35%', 'rural', 'maximum', 'non-repayable'],
    OWN_CONTRIBUTION: ['own contribution', 'equity'],
    GREENFIELD_ONLY: ['greenfield', 'new'],
    EDP_TRAINING: ['edp', 'training'],
    COLLATERAL_FREE: ['collateral', 'guarantee', 'mortgage'],
    TIERS: ['shishu', 'kishore', 'tarun'],
    TRADE_ELIGIBILITY: ['traditional', 'craft', 'tailor', 'carpenter', 'mason', 'blacksmith', 'cobbler'],
    TOOLKIT: ['toolkit', 'e-voucher', '₹15,000'],
    INTEREST_RATE: ['interest', 'concessional', '%'],
    LOAN_TIERS: ['phase', '₹1 lakh', '₹2 lakh'],
    BENEFICIARY: ['woman', 'sc/st', 'shareholding'],
    VENDOR_TYPE: ['vendor', 'street', 'cart'],
    INTEREST_SUBVENTION: ['subvention', 'digital'],
    SECTOR: ['food processing', 'livestock', 'animal husbandry', 'poultry', 'goat', 'bakery', 'flour'],
    SUBSIDY: ['subsidy', 'capital subsidy', 'grant', 'margin money'],
    SC_MANDATE: ['scheduled caste', 'sc community', 'sc ', 'exclusively for sc'],
    SC_ST_MANDATE: ['sc and st', 'sc/st', 'scheduled caste', 'scheduled tribe'],
    SC_WOMEN_MANDATE: ['sc women', 'women through shg'],
    OBC_MANDATE: ['other backward', 'obc'],
    MINORITY_MANDATE: ['minority', 'muslim', 'christian', 'sikh', 'buddhist'],
    INCOME_CEILING: ['income', 'ceiling', 'threshold', '₹3', '₹5', '₹6'],
    CATEGORY: ['sc/st/obc', 'safai karamchari', 'pm-daksh'],
    BENEFIT: ['free training', 'stipend', '₹3,000'],
    MIN_COST: ['minimum', '₹5,00,000'],
    EQUITY_MODEL: ['equity', 'revenue sharing', '0% interest'],
  };

  let bestMatch = null;
  let bestScore = 0;

  for (const [constraintId, keywords] of Object.entries(KEYWORD_MAP)) {
    if (!constraints[constraintId]) continue;
    let score = 0;
    for (const keyword of keywords) {
      if (text.includes(keyword)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = constraintId;
    }
  }

  return bestScore >= 1 ? bestMatch : null;
}

/**
 * Create a citation for AI-generated content
 */
export function createAIDraftCitation(model = 'deterministic-fallback') {
  return createCitation({
    schemeId: null,
    constraintId: null,
    sourceDocument: null,
    sourceUrl: null,
    sourceParagraph: null,
    lastVerifiedAt: null,
    provenance: PROVENANCE.AI_DRAFT,
    confidence: 0.6,
    warning: 'This is AI-generated advisory content, not an official recommendation. Verify with your bank or local CSC centre.',
  });
}

/**
 * Create a citation for user-declared data
 */
export function createUserDeclaredCitation(fieldName) {
  return createCitation({
    schemeId: null,
    constraintId: fieldName,
    sourceDocument: 'User self-declaration',
    sourceUrl: null,
    sourceParagraph: null,
    lastVerifiedAt: new Date().toISOString(),
    provenance: PROVENANCE.USER_DECLARED,
    confidence: 0.75,
    warning: `${fieldName} is self-declared and not independently verified. Eligibility may change upon document verification.`,
  });
}
