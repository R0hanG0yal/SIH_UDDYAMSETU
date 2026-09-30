import React, { useState, useMemo } from 'react';
import { Calculator, TrendingDown, ArrowRight, ShieldCheck, BarChart3, Layers, ChevronDown, ChevronUp, Sparkles, IndianRupee, Clock, Percent } from 'lucide-react';
import { calculateRepaymentPlan } from '../engines/financialPlanner';

/**
 * EMI Comparison Matrix — Side-by-side comparison of ALL eligible schemes
 * Shows total cost of borrowing, EMI, moratorium, interest savings vs informal lending
 */
export function EMIComparisonMatrix({ matchedSchemes, projectCost, profile, lang = 'en', onSelectScheme }) {
  const [expandedScheme, setExpandedScheme] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState([]);

  const isFemale = profile?.gender === 'female';
  const isConstruction = Boolean(profile?.isConstructionOrPlantation);

  // Calculate repayment plans for all schemes
  const schemeAnalysis = useMemo(() => {
    if (!matchedSchemes || matchedSchemes.length === 0) return [];

    return matchedSchemes.map(scheme => {
      const plan = calculateRepaymentPlan(scheme, projectCost, {
        isFemale,
        isConstructionOrPlantation: isConstruction,
      });

      // Calculate informal lender comparison (15% rate)
      const informalPlan = calculateRepaymentPlan(
        { ...scheme, interestRatePercent: 15.0, moratoriumMonths: 0, repaymentCadence: 'monthly' },
        projectCost,
        { isFemale: false, isConstructionOrPlantation: false }
      );

      const interestSavings = informalPlan && plan
        ? (informalPlan.totalInterestPayable - plan.totalInterestPayable)
        : 0;

      const subsidyAmount = scheme.directSubsidyAmount || 0;
      const totalBenefit = interestSavings + subsidyAmount;

      // Score the scheme for ranking
      const benefitScore = (subsidyAmount / Math.max(1, projectCost)) * 40 +
        (interestSavings / Math.max(1, projectCost)) * 30 +
        (plan ? (1 - plan.interestRatePercent / 15) * 20 : 0) +
        (scheme.moratoriumMonths >= 6 ? 10 : scheme.moratoriumMonths >= 3 ? 5 : 0);

      return {
        scheme,
        plan,
        informalPlan,
        interestSavings: Math.round(interestSavings),
        subsidyAmount,
        totalBenefit: Math.round(totalBenefit),
        benefitScore: Math.round(benefitScore),
        effectiveCostPercent: plan ? Math.round(((plan.totalRepayment - plan.loanAmount + plan.loanAmount - subsidyAmount) / Math.max(1, projectCost)) * 100) : 0,
      };
    }).sort((a, b) => b.benefitScore - a.benefitScore);
  }, [matchedSchemes, projectCost, isFemale, isConstruction]);

  const t = {
    en: {
      title: 'EMI Comparison Matrix — All Eligible Schemes',
      subtitle: 'Side-by-side financial analysis of every matched scheme. Compare EMIs, moratorium, subsidies, and total cost of borrowing vs informal lenders (15%).',
      compareBtn: 'Compare Mode',
      exitCompare: 'Exit Compare',
      bestValue: '🏆 Best Financial Value',
      lowestEMI: '💰 Lowest EMI',
      highestSubsidy: '🎯 Highest Subsidy',
      emiLabel: 'EMI / Installment',
      rateLabel: 'Interest Rate',
      moratoriumLabel: 'Moratorium',
      tenureLabel: 'Tenure',
      subsidyLabel: 'Direct Subsidy',
      totalRepayLabel: 'Total Repayment',
      interestLabel: 'Total Interest',
      savingsLabel: 'Interest Savings vs 15% Lender',
      effectiveCostLabel: 'Effective Cost %',
      loanAmountLabel: 'Eligible Loan',
      ownContribLabel: 'Your Contribution',
      cadenceLabel: 'Payment Cadence',
      viewSchedule: 'View Amortization',
      hideSchedule: 'Hide Schedule',
      selectScheme: 'Choose This Scheme',
      noSchemes: 'No eligible schemes found. Adjust your profile to see matching schemes.',
      breakEvenLabel: 'Break-Even Analysis',
      monthlyLabel: 'Monthly',
      quarterlyLabel: 'Quarterly',
      totalBenefitLabel: 'Total Government Benefit',
    },
    hi: {
      title: 'EMI तुलना मैट्रिक्स — सभी पात्र योजनाएं',
      subtitle: 'प्रत्येक मिलान योजना का साथ-साथ वित्तीय विश्लेषण। EMI, मोरेटोरियम, सब्सिडी और कुल उधारी लागत की तुलना।',
      compareBtn: 'तुलना मोड',
      exitCompare: 'तुलना बंद',
      bestValue: '🏆 सर्वोत्तम वित्तीय मूल्य',
      lowestEMI: '💰 न्यूनतम EMI',
      highestSubsidy: '🎯 अधिकतम सब्सिडी',
      emiLabel: 'EMI / किस्त',
      rateLabel: 'ब्याज दर',
      moratoriumLabel: 'मोरेटोरियम',
      tenureLabel: 'अवधि',
      subsidyLabel: 'सीधी सब्सिडी',
      totalRepayLabel: 'कुल देय राशि',
      interestLabel: 'कुल ब्याज',
      savingsLabel: '15% साहूकार से बचत',
      effectiveCostLabel: 'प्रभावी लागत %',
      loanAmountLabel: 'पात्र ऋण',
      ownContribLabel: 'आपका योगदान',
      cadenceLabel: 'भुगतान प्रकार',
      viewSchedule: 'किस्त सारणी देखें',
      hideSchedule: 'सारणी छिपाएं',
      selectScheme: 'यह योजना चुनें',
      noSchemes: 'कोई पात्र योजना नहीं मिली। मिलान देखने के लिए अपनी प्रोफ़ाइल समायोजित करें।',
      breakEvenLabel: 'ब्रेक-ईवन विश्लेषण',
      monthlyLabel: 'मासिक',
      quarterlyLabel: 'त्रैमासिक',
      totalBenefitLabel: 'कुल सरकारी लाभ',
    }
  }[lang === 'hi' ? 'hi' : 'en'];

  if (!schemeAnalysis || schemeAnalysis.length === 0) {
    return (
      <div className="liquid-glass-card animate-fade-in" style={{ padding: '2rem', textAlign: 'center' }}>
        <Calculator size={40} color="#94a3b8" style={{ marginBottom: '0.75rem' }} />
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{t.noSchemes}</p>
      </div>
    );
  }

  const bestValue = schemeAnalysis[0];
  const lowestEMI = [...schemeAnalysis].sort((a, b) => (a.plan?.installmentAmount || Infinity) - (b.plan?.installmentAmount || Infinity))[0];
  const highestSubsidy = [...schemeAnalysis].sort((a, b) => b.subsidyAmount - a.subsidyAmount)[0];

  const toggleCompare = (schemeId) => {
    setSelectedForCompare(prev =>
      prev.includes(schemeId)
        ? prev.filter(id => id !== schemeId)
        : prev.length < 3
          ? [...prev, schemeId]
          : prev
    );
  };

  const displaySchemes = compareMode && selectedForCompare.length > 0
    ? schemeAnalysis.filter(s => selectedForCompare.includes(s.scheme.id))
    : schemeAnalysis;

  return (
    <div className="liquid-glass-card animate-fade-in" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--brand-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={24} color="#f97316" />
            <span>{t.title}</span>
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--slate-600)', marginTop: '0.25rem' }}>
            {t.subtitle}
          </p>
        </div>

        <button
          onClick={() => { setCompareMode(!compareMode); setSelectedForCompare([]); }}
          className="details-toggle-btn"
          style={{ fontWeight: '700' }}
        >
          <Layers size={14} />
          {compareMode ? t.exitCompare : t.compareBtn}
        </button>
      </div>

      {/* Quick Insight Badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {bestValue && (
          <div style={{
            background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', border: '1.5px solid #6ee7b7',
            borderRadius: '10px', padding: '0.5rem 0.85rem', fontSize: '0.75rem', fontWeight: '700', color: '#065f46',
          }}>
            {t.bestValue}: {bestValue.scheme.name?.split('(')[0]?.trim()} — ₹{bestValue.totalBenefit.toLocaleString('en-IN')} benefit
          </div>
        )}
        {lowestEMI?.plan && (
          <div style={{
            background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', border: '1.5px solid #93c5fd',
            borderRadius: '10px', padding: '0.5rem 0.85rem', fontSize: '0.75rem', fontWeight: '700', color: '#1e40af',
          }}>
            {t.lowestEMI}: ₹{lowestEMI.plan.installmentAmount?.toLocaleString('en-IN')}/{lowestEMI.plan.cadence === 'quarterly' ? 'Qtr' : 'Mo'}
          </div>
        )}
        {highestSubsidy?.subsidyAmount > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #fff7ed, #ffedd5)', border: '1.5px solid #fdba74',
            borderRadius: '10px', padding: '0.5rem 0.85rem', fontSize: '0.75rem', fontWeight: '700', color: '#9a3412',
          }}>
            {t.highestSubsidy}: ₹{highestSubsidy.subsidyAmount.toLocaleString('en-IN')} grant
          </div>
        )}
      </div>

      {/* Scheme Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {displaySchemes.map((analysis, idx) => {
          const { scheme, plan, interestSavings, subsidyAmount, totalBenefit, benefitScore } = analysis;
          if (!plan) return null;

          const isExpanded = expandedScheme === scheme.id;
          const isBestValue = idx === 0 && !compareMode;
          const isChecked = selectedForCompare.includes(scheme.id);

          return (
            <div
              key={scheme.id}
              style={{
                background: isBestValue
                  ? 'linear-gradient(135deg, rgba(236,253,245,0.85), rgba(255,255,255,0.9))'
                  : 'rgba(255,255,255,0.85)',
                border: isBestValue ? '2px solid #10b981' : '1.5px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.25rem',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Best Value Badge */}
              {isBestValue && (
                <div style={{
                  position: 'absolute', top: '-10px', right: '16px',
                  background: 'linear-gradient(135deg, #059669, #10b981)', color: '#fff',
                  fontSize: '0.65rem', fontWeight: '800', padding: '3px 10px',
                  borderRadius: '0 0 8px 8px', letterSpacing: '0.5px',
                  boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
                }}>
                  🏆 BEST VALUE
                </div>
              )}

              {/* Scheme Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
                {compareMode && (
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCompare(scheme.id)}
                    style={{ width: '18px', height: '18px', accentColor: '#f97316', cursor: 'pointer', marginTop: '3px' }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '1rem', fontWeight: '800', color: '#091e20' }}>
                    {scheme.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                    {scheme.ministry || scheme.category} • Score: {benefitScore}/100
                  </div>
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '0.65rem',
                marginBottom: '0.85rem',
              }}>
                {/* EMI */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.6rem 0.75rem' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>{t.emiLabel}</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: '900', color: '#0f3436' }}>
                    ₹{plan.installmentAmount?.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b' }}>
                    per {plan.cadence === 'quarterly' ? 'quarter' : 'month'}
                  </div>
                </div>

                {/* Interest Rate */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.6rem 0.75rem' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>{t.rateLabel}</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: '900', color: '#0f3436' }}>
                    {plan.interestRatePercent}%
                    {isFemale && scheme.genderRebatePercent > 0 && (
                      <span style={{ fontSize: '0.65rem', color: '#059669', fontWeight: '600', marginLeft: '4px' }}>
                        (-{scheme.genderRebatePercent}% ♀)
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b' }}>p.a. concessional</div>
                </div>

                {/* Moratorium */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.6rem 0.75rem' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>{t.moratoriumLabel}</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: '900', color: '#0f3436' }}>
                    {plan.moratoriumMonths} mo
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b' }}>grace period</div>
                </div>

                {/* Subsidy */}
                <div style={{
                  background: subsidyAmount > 0 ? '#ecfdf5' : '#f8fafc',
                  border: `1px solid ${subsidyAmount > 0 ? '#6ee7b7' : '#e2e8f0'}`,
                  borderRadius: '10px', padding: '0.6rem 0.75rem'
                }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>{t.subsidyLabel}</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: '900', color: subsidyAmount > 0 ? '#059669' : '#94a3b8' }}>
                    {subsidyAmount > 0 ? `₹${subsidyAmount.toLocaleString('en-IN')}` : '—'}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b' }}>
                    {scheme.directSubsidyPercent ? `${scheme.directSubsidyPercent}% grant` : 'no grant'}
                  </div>
                </div>

                {/* Total Repayment */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.6rem 0.75rem' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>{t.totalRepayLabel}</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: '900', color: '#0f3436' }}>
                    ₹{Math.round(plan.totalRepayment).toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b' }}>over {plan.totalTenureYears} years</div>
                </div>

                {/* Interest Savings */}
                <div style={{
                  background: interestSavings > 0 ? 'linear-gradient(135deg, #ecfdf5, #d1fae5)' : '#f8fafc',
                  border: `1px solid ${interestSavings > 0 ? '#34d399' : '#e2e8f0'}`,
                  borderRadius: '10px', padding: '0.6rem 0.75rem'
                }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>{t.savingsLabel}</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: '900', color: interestSavings > 0 ? '#059669' : '#94a3b8' }}>
                    {interestSavings > 0 ? `₹${interestSavings.toLocaleString('en-IN')}` : '—'}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: interestSavings > 0 ? '#065f46' : '#64748b' }}>
                    {interestSavings > 0 ? 'saved!' : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Total Benefit Bar */}
              {totalBenefit > 0 && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(236,253,245,0.6), rgba(255,247,237,0.6))',
                  border: '1px solid #a7f3d0', borderRadius: '10px', padding: '0.65rem 0.85rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap',
                  gap: '0.5rem', marginBottom: '0.5rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={16} color="#059669" />
                    <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#065f46' }}>
                      {t.totalBenefitLabel}: ₹{totalBenefit.toLocaleString('en-IN')}
                    </span>
                  </div>
                  {/* Visual bar */}
                  <div style={{ flex: 1, minWidth: '100px', height: '8px', background: '#d1fae5', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: '4px',
                      background: 'linear-gradient(90deg, #10b981, #059669)',
                      width: `${Math.min(100, (totalBenefit / Math.max(1, projectCost)) * 100)}%`,
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                  <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#065f46' }}>
                    {Math.round((totalBenefit / Math.max(1, projectCost)) * 100)}% of project cost
                  </span>
                </div>
              )}

              {/* Expand / Action Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                <button
                  onClick={() => setExpandedScheme(isExpanded ? null : scheme.id)}
                  className="details-toggle-btn"
                >
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  {isExpanded ? t.hideSchedule : t.viewSchedule}
                </button>

                {onSelectScheme && (
                  <button
                    onClick={() => onSelectScheme(scheme)}
                    className="btn-primary"
                    style={{ fontSize: '0.78rem', padding: '0.4rem 0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    {t.selectScheme} <ArrowRight size={14} />
                  </button>
                )}
              </div>

              {/* Expanded: Amortization Table */}
              {isExpanded && plan.schedule && (
                <div style={{ marginTop: '1rem', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.72rem' }}>
                    <thead>
                      <tr style={{ background: '#f1f5f9' }}>
                        <th style={{ padding: '6px 10px', textAlign: 'left', fontWeight: '700', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>#</th>
                        <th style={{ padding: '6px 10px', textAlign: 'right', fontWeight: '700', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Principal</th>
                        <th style={{ padding: '6px 10px', textAlign: 'right', fontWeight: '700', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Interest</th>
                        <th style={{ padding: '6px 10px', textAlign: 'right', fontWeight: '700', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Installment</th>
                        <th style={{ padding: '6px 10px', textAlign: 'right', fontWeight: '700', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {plan.schedule.slice(0, 20).map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', background: row.isMoratorium ? '#fffbeb' : (i % 2 === 0 ? '#fff' : '#fafafa') }}>
                          <td style={{ padding: '5px 10px', fontWeight: '600', color: row.isMoratorium ? '#92400e' : '#334155' }}>
                            {row.isMoratorium ? `M${row.period}` : row.period}
                          </td>
                          <td style={{ padding: '5px 10px', textAlign: 'right', color: '#334155' }}>₹{row.principalComponent?.toLocaleString('en-IN') || '0'}</td>
                          <td style={{ padding: '5px 10px', textAlign: 'right', color: '#ef4444' }}>₹{row.interestComponent?.toLocaleString('en-IN') || '0'}</td>
                          <td style={{ padding: '5px 10px', textAlign: 'right', fontWeight: '700', color: '#0f3436' }}>₹{row.installment?.toLocaleString('en-IN') || '0'}</td>
                          <td style={{ padding: '5px 10px', textAlign: 'right', color: '#64748b' }}>₹{row.outstandingBalance?.toLocaleString('en-IN') || '0'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {plan.schedule.length > 20 && (
                    <div style={{ textAlign: 'center', padding: '8px', fontSize: '0.72rem', color: '#94a3b8', fontStyle: 'italic' }}>
                      ... showing first 20 of {plan.schedule.length} installments
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EMIComparisonMatrix;
