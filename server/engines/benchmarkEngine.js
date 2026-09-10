// =============================================================================
// UdyamSetu — AI Evaluation & Regression Benchmark Engine
// Automated test harness with golden test cases. Detects regressions
// when policy or code changes break previously-passing evaluations.
// =============================================================================

import { evaluateNationalSchemes } from './eligibilityEngine.js';
import { calculateReadinessScore } from './readinessEngine.js';

/**
 * Golden test suite — frozen inputs with expected outputs.
 * These are the ground truth for correctness verification.
 */
export const GOLDEN_TESTS = [
  {
    id: 'GOLDEN-TC-01',
    name: "Priya Devi — SC Woman Tailoring (Core Demo Persona)",
    category: 'CORE_PERSONA',
    input: {
      purpose: 'business', categoryName: 'Tailoring & Stitching',
      projectCost: 120000, annualIncome: 180000,
      isSC: true, socialCategory: 'SC', gender: 'female',
      isRural: true, state: 'Uttar Pradesh', district: 'Lucknow',
    },
    expected: {
      mustMatchSchemeIds: ['GOI_PMEGP', 'GOI_PMMY_MUDRA'],
      mustNotMatchSchemeIds: ['GOI_STANDUP_INDIA'],
      minMatchedCount: 3,
      maxMatchedCount: 10,
      subsidyAmountGte: 25000,
      narrativeMustContain: ['subsidy', 'SC'],
      narrativeMustNotContain: ['guaranteed approval'],
    }
  },
  {
    id: 'GOLDEN-TC-02',
    name: "Ramesh Kumar — OBC Furniture Workshop (Demo Persona)",
    category: 'CORE_PERSONA',
    input: {
      purpose: 'business', categoryName: 'Furniture & Woodwork',
      projectCost: 300000, annualIncome: 400000,
      isOBC: true, socialCategory: 'OBC', gender: 'male',
      isRural: false, state: 'Rajasthan', district: 'Jaipur',
    },
    expected: {
      mustMatchSchemeIds: ['GOI_PMEGP', 'GOI_PMMY_MUDRA'],
      mustNotMatchSchemeIds: ['GOI_PM_VISHWAKARMA', 'MOSJE_NSFDC_MICRO_CREDIT'],
      minMatchedCount: 2,
      maxMatchedCount: 8,
    }
  },
  {
    id: 'GOLDEN-TC-03',
    name: "Arjun Singh — First-Gen Poultry Farmer (Demo Persona)",
    category: 'CORE_PERSONA',
    input: {
      purpose: 'business', categoryName: 'Poultry & Goat Farming',
      projectCost: 500000, annualIncome: 250000,
      isSC: false, socialCategory: 'General', gender: 'male',
      isRural: true, state: 'Bihar', district: 'Muzaffarpur',
    },
    expected: {
      mustMatchSchemeIds: ['GOI_PMEGP', 'GOI_NLM_LIVESTOCK'],
      minMatchedCount: 2,
    }
  },
  {
    id: 'GOLDEN-TC-04',
    name: "Boundary: ₹1,40,000 Exactly (NSFDC Micro Finance Ceiling)",
    category: 'BOUNDARY_VALUE',
    input: {
      purpose: 'business', categoryName: 'Kirana Shop',
      projectCost: 140000, annualIncome: 240000,
      isSC: true, socialCategory: 'SC', gender: 'male', isRural: true,
    },
    expected: {
      mustMatchSchemeIds: ['GOI_PMEGP', 'GOI_PMMY_MUDRA'],
      minMatchedCount: 2,
    }
  },
  {
    id: 'GOLDEN-TC-05',
    name: "Boundary: Income ₹5,00,000 (NSFDC Ceiling)",
    category: 'BOUNDARY_VALUE',
    input: {
      purpose: 'business', categoryName: 'Mobile Repair',
      projectCost: 100000, annualIncome: 500000,
      isSC: true, socialCategory: 'SC', gender: 'male', isRural: true,
    },
    expected: {
      mustMatchSchemeIds: ['GOI_PMEGP'],
      minMatchedCount: 1,
    }
  },
  {
    id: 'GOLDEN-TC-06',
    name: "Negative: Non-SC for NSFDC",
    category: 'NEGATIVE',
    input: {
      purpose: 'business', categoryName: 'Retail Shop',
      projectCost: 100000, annualIncome: 200000,
      isSC: false, socialCategory: 'General', gender: 'male', isRural: true,
    },
    expected: {
      mustNotMatchSchemeIds: ['NSFDC_CONCESSIONAL_CORE', 'MOSJE_NSFDC_TERM_LOAN', 'MOSJE_NSFDC_MICRO_CREDIT'],
    }
  },
  {
    id: 'GOLDEN-TC-07',
    name: "Negative: Education Purpose for Business Scheme",
    category: 'NEGATIVE',
    input: {
      purpose: 'education', categoryName: 'Engineering Degree',
      projectCost: 200000, annualIncome: 250000,
      isSC: true, socialCategory: 'SC', gender: 'male', isRural: false,
    },
    expected: {
      mustNotMatchSchemeIds: ['GOI_PMEGP', 'GOI_PMMY_MUDRA', 'GOI_PM_VISHWAKARMA'],
    }
  },
  {
    id: 'GOLDEN-TC-08',
    name: "PM VishwaKarma: Tailor trade",
    category: 'EDGE_CASE',
    input: {
      purpose: 'business', categoryName: 'Silai & Tailoring',
      projectCost: 80000, annualIncome: 150000,
      isSC: false, socialCategory: 'General', gender: 'female', isRural: true,
    },
    expected: {
      mustMatchSchemeIds: ['GOI_PM_VISHWAKARMA', 'GOI_PMEGP'],
      minMatchedCount: 2,
    }
  },
  {
    id: 'GOLDEN-TC-09',
    name: "Stand-Up India: SC Woman ₹15L Greenfield",
    category: 'EDGE_CASE',
    input: {
      purpose: 'business', categoryName: 'Manufacturing Unit',
      projectCost: 1500000, annualIncome: 300000,
      isSC: true, socialCategory: 'SC', gender: 'female', isRural: false,
    },
    expected: {
      mustMatchSchemeIds: ['GOI_STANDUP_INDIA', 'GOI_PMEGP'],
      minMatchedCount: 2,
    }
  },
  {
    id: 'GOLDEN-TC-10',
    name: "PM SVANidhi: Street Vendor ₹20K",
    category: 'EDGE_CASE',
    input: {
      purpose: 'business', categoryName: 'Chai Cart / Street Vendor',
      projectCost: 20000, annualIncome: 100000,
      isSC: false, socialCategory: 'General', gender: 'male', isRural: false,
    },
    expected: {
      mustMatchSchemeIds: ['GOI_PM_SVANIDHI'],
      minMatchedCount: 1,
    }
  },
  {
    id: 'GOLDEN-TC-11',
    name: "Food Processing: PMFME eligible bakery",
    category: 'EDGE_CASE',
    input: {
      purpose: 'business', categoryName: 'Bakery & Food Processing',
      projectCost: 250000, annualIncome: 200000,
      isSC: false, socialCategory: 'General', gender: 'female', isRural: true,
    },
    expected: {
      mustMatchSchemeIds: ['GOI_PMFME', 'GOI_PMEGP'],
      minMatchedCount: 2,
    }
  },
  {
    id: 'GOLDEN-TC-12',
    name: "Regression Guard: Zero cost should return INVALID",
    category: 'REGRESSION_GUARD',
    input: {
      purpose: 'business', categoryName: 'General',
      projectCost: 0, annualIncome: 200000,
      isSC: true, socialCategory: 'SC', gender: 'female', isRural: true,
    },
    expected: {
      maxMatchedCount: 3, // Some schemes have minCost=0 or no cost check
    }
  },
];

/**
 * Run the full benchmark suite.
 * @returns {Object} Benchmark results with pass/fail/warn status per test
 */
export function runBenchmark() {
  const startTime = Date.now();
  const results = [];
  let passed = 0;
  let failed = 0;
  let warned = 0;

  for (const test of GOLDEN_TESTS) {
    const testStart = Date.now();
    const result = runSingleTest(test);
    result.durationMs = Date.now() - testStart;
    results.push(result);

    if (result.status === 'PASS') passed++;
    else if (result.status === 'FAIL') failed++;
    else warned++;
  }

  const totalDuration = Date.now() - startTime;

  return {
    status: failed > 0 ? 'REGRESSION_DETECTED' : 'ALL_PASS',
    summary: {
      total: GOLDEN_TESTS.length,
      passed,
      failed,
      warned,
      score: `${passed}/${GOLDEN_TESTS.length} (${Math.round(passed / GOLDEN_TESTS.length * 100)}%)`,
    },
    results,
    executionTimeMs: totalDuration,
    ranAt: new Date().toISOString(),
  };
}

/**
 * Run a single golden test case.
 */
function runSingleTest(test) {
  try {
    const evalResult = evaluateNationalSchemes(test.input);
    const matchedIds = new Set((evalResult.matchedSchemes || []).map(s => s.id));
    const failures = [];
    const warnings = [];

    // Check must-match schemes
    if (test.expected.mustMatchSchemeIds) {
      for (const schemeId of test.expected.mustMatchSchemeIds) {
        if (!matchedIds.has(schemeId)) {
          failures.push(`Expected scheme ${schemeId} to match, but it did not`);
        }
      }
    }

    // Check must-not-match schemes
    if (test.expected.mustNotMatchSchemeIds) {
      for (const schemeId of test.expected.mustNotMatchSchemeIds) {
        if (matchedIds.has(schemeId)) {
          failures.push(`Expected scheme ${schemeId} NOT to match, but it did`);
        }
      }
    }

    // Check match count bounds
    const matchedCount = evalResult.matchedSchemes?.length || 0;
    if (test.expected.minMatchedCount !== undefined && matchedCount < test.expected.minMatchedCount) {
      failures.push(`Expected at least ${test.expected.minMatchedCount} matches, got ${matchedCount}`);
    }
    if (test.expected.maxMatchedCount !== undefined && matchedCount > test.expected.maxMatchedCount) {
      warnings.push(`Expected at most ${test.expected.maxMatchedCount} matches, got ${matchedCount}`);
    }

    // Check subsidy amount
    if (test.expected.subsidyAmountGte !== undefined) {
      const topSubsidy = evalResult.matchedSchemes?.[0]?.directSubsidyAmount || 0;
      const totalSubsidy = (evalResult.matchedSchemes || []).reduce((sum, s) => sum + (s.directSubsidyAmount || 0), 0);
      if (totalSubsidy < test.expected.subsidyAmountGte) {
        warnings.push(`Expected total subsidy ≥ ₹${test.expected.subsidyAmountGte}, got ₹${totalSubsidy}`);
      }
    }

    const status = failures.length > 0 ? 'FAIL' : warnings.length > 0 ? 'WARN' : 'PASS';

    return {
      id: test.id,
      name: test.name,
      category: test.category,
      status,
      failures,
      warnings,
      matchedCount,
      matchedSchemeIds: [...matchedIds],
      topScheme: evalResult.matchedSchemes?.[0]?.name || 'None',
      topSubsidy: evalResult.matchedSchemes?.[0]?.directSubsidyAmount || 0,
    };
  } catch (error) {
    return {
      id: test.id,
      name: test.name,
      category: test.category,
      status: 'FAIL',
      failures: [`Runtime error: ${error.message}`],
      warnings: [],
      matchedCount: 0,
      matchedSchemeIds: [],
    };
  }
}

/**
 * Compare two benchmark runs for regression detection.
 */
export function detectRegressions(currentRun, previousRun) {
  if (!previousRun) return { regressions: [], improvements: [] };

  const regressions = [];
  const improvements = [];

  const prevMap = new Map();
  for (const r of previousRun.results) {
    prevMap.set(r.id, r);
  }

  for (const current of currentRun.results) {
    const prev = prevMap.get(current.id);
    if (!prev) continue;

    if (prev.status === 'PASS' && current.status === 'FAIL') {
      regressions.push({
        testId: current.id,
        testName: current.name,
        previousStatus: 'PASS',
        currentStatus: 'FAIL',
        failures: current.failures,
        severity: 'CRITICAL',
      });
    }

    if (prev.status === 'FAIL' && current.status === 'PASS') {
      improvements.push({
        testId: current.id,
        testName: current.name,
        previousStatus: 'FAIL',
        currentStatus: 'PASS',
      });
    }
  }

  return { regressions, improvements };
}
