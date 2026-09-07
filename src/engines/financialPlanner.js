// Financial Dignity Calculator: Indicative Repayment Planner
// Computes loan funding, own equity/beneficiary contribution, moratorium schedule, and actual quarterly/monthly repayment cadence.

export function calculateRepaymentPlan(scheme, projectCost, options = {}) {
  const cost = Number(projectCost) || 0;
  if (cost <= 0 || !scheme) return null;

  const maxFundingPercent = scheme.maxFundingPercent || 90;
  const fundingCap = scheme.maxLoanAmount || 125000;
  const eligibleLoan = Math.min((maxFundingPercent / 100) * cost, fundingCap);
  const ownContribution = Math.max(cost - eligibleLoan, ((scheme.minBeneficiaryContributionPercent || 10) / 100) * cost);

  const interestRate = (options.isFemale && scheme.genderRebatePercent > 0)
    ? (scheme.interestRatePercent - scheme.genderRebatePercent)
    : scheme.interestRatePercent;

  const isExtendedMoratorium = Boolean(options.isConstructionOrPlantation);
  const moratoriumMonths = isExtendedMoratorium && scheme.moratoriumExtendedMonths
    ? scheme.moratoriumExtendedMonths
    : scheme.moratoriumMonths || 3;

  const cadence = scheme.repaymentCadence || "quarterly"; // 'quarterly' or 'monthly'
  const tenureYears = scheme.totalRepaymentTenureYears || 3;

  const periodsPerYear = cadence === "quarterly" ? 4 : 12;
  const totalPeriods = tenureYears * periodsPerYear;
  const moratoriumPeriods = Math.ceil(moratoriumMonths / (cadence === "quarterly" ? 3 : 1));
  const repaymentPeriods = Math.max(1, totalPeriods - moratoriumPeriods);

  // Equal Principal Amortization (standard for Indian concessional dev finance)
  const principalPerPeriod = eligibleLoan / repaymentPeriods;
  const periodicInterestRate = (interestRate / 100) / periodsPerYear;

  const schedule = [];
  let remainingPrincipal = eligibleLoan;
  let totalInterestPayable = 0;

  for (let period = 1; period <= totalPeriods; period++) {
    const isMoratorium = period <= moratoriumPeriods;
    const interest = remainingPrincipal * periodicInterestRate;
    totalInterestPayable += interest;

    const principal = isMoratorium ? 0 : principalPerPeriod;
    const installment = principal + interest;
    
    if (!isMoratorium) {
      remainingPrincipal = Math.max(0, remainingPrincipal - principal);
    }

    schedule.push({
      period,
      periodLabel: cadence === "quarterly" ? `Quarter Q${period}` : `Month M${period}`,
      isMoratorium,
      installmentAmount: Math.round(installment),
      principalComponent: Math.round(principal),
      interestComponent: Math.round(interest),
      closingBalance: Math.round(remainingPrincipal)
    });
  }

  // Indicative average regular installment after moratorium
  const regularInstallments = schedule.filter(s => !s.isMoratorium);
  const firstRegularInstallment = regularInstallments.length > 0 ? regularInstallments[0].installmentAmount : 0;
  const totalRepayment = eligibleLoan + totalInterestPayable;

  return {
    projectCost: cost,
    eligibleLoan: Math.round(eligibleLoan),
    ownContribution: Math.round(ownContribution),
    interestRatePercent: interestRate,
    cadence,
    cadenceLabel: cadence === "quarterly" ? "Quarterly (त्रैमासिक)" : "Monthly (मासिक)",
    moratoriumMonths,
    isExtendedMoratorium,
    totalTenureYears: tenureYears,
    firstRegularInstallment: Math.round(firstRegularInstallment),
    totalInterestPayable: Math.round(totalInterestPayable),
    totalRepayment: Math.round(totalRepayment),
    schedule
  };
}
