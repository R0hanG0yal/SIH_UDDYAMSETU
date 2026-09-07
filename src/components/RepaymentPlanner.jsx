import React, { useState } from 'react';
import { Calendar, ArrowRight, ShieldCheck, ChevronDown, ChevronUp, Layers, CheckCircle2, AlertTriangle, TrendingDown } from 'lucide-react';
import { calculateRepaymentPlan } from '../engines/financialPlanner';

export function RepaymentPlanner({ scheme, projectCost, profile, onProceedToPartnerRouting, lang = 'en' }) {
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [isExtendedMoratorium, setIsExtendedMoratorium] = useState(Boolean(profile?.isConstructionOrPlantation));

  const plan = calculateRepaymentPlan(scheme, projectCost, {
    isFemale: profile?.gender === 'female',
    isConstructionOrPlantation: isExtendedMoratorium
  });

  // Calculate high-interest MFI comparison for the "Financial Dignity" contrast
  const mfiPlan = calculateRepaymentPlan(
    { ...scheme, interestRatePercent: 15.0, repaymentCadence: 'monthly' },
    projectCost,
    { isFemale: false, isConstructionOrPlantation: false }
  );

  const interestSavings = mfiPlan ? (mfiPlan.totalInterestPayable - (plan?.totalInterestPayable || 0)) : 0;

  if (!plan) return null;

  const t = {
    en: {
      plannerTitle: "Financial Dignity Calculator: Indicative Repayment Planner",
      plannerSubtitle: "Transparent breakdown of concessional credit, own contribution, moratorium, and actual quarterly installments.",
      costLabel: "Total Project Cost",
      loanLabel: "Eligible Concessional Loan",
      ownLabel: "Beneficiary Contribution (Own Equity)",
      rateLabel: "Concessional Interest",
      moratoriumLabel: "Moratorium (Grace Period)",
      cadenceLabel: "Repayment Cadence",
      installmentLabel: "Indicative Regular Installment",
      totalRepayLabel: "Total Repayment",
      savingsCallout: "Concessional Dignity Advantage",
      savingsDetail: `By routing through the authorized ${scheme?.name} at ${plan.interestRatePercent}% rather than high-cost informal lenders (15%), you save approximately ₹${Math.round(interestSavings).toLocaleString('en-IN')} in interest charges.`,
      scheduleToggleShow: "View Full Indicative Amortization Schedule",
      scheduleToggleHide: "Hide Detailed Schedule Table",
      moratoriumToggleLabel: "Simulate Extended Moratorium (24 Months for Construction / Plantation)",
      proceedBtn: "Find Verified Authorized Bank Channel Desks"
    },
    hi: {
      plannerTitle: "वित्तीय गरिमा कैलकुलेटर: सांकेतिक पुनर्भुगतान योजना",
      plannerSubtitle: "रियायती ऋण, स्वयं का अंशदान, मोरेटोरियम (ग्रेस अवधि) और वास्तविक त्रैमासिक किस्तों का पारदर्शी विवरण।",
      costLabel: "कुल परियोजना लागत",
      loanLabel: "पात्र रियायती ऋण",
      ownLabel: "लाभार्थी का स्वयं का अंशदान",
      rateLabel: "रियायती ब्याज दर",
      moratoriumLabel: "मोरेटोरियम (ग्रेस पीरियड)",
      cadenceLabel: "किस्त का प्रकार",
      installmentLabel: "सांकेतिक नियमित किस्त",
      totalRepayLabel: "कुल देय राशि",
      savingsCallout: "रियायती ऋण का आर्थिक लाभ",
      savingsDetail: `अधिकृत ${scheme?.nameHindi || scheme?.name} (ब्याज ${plan.interestRatePercent}%) से जुड़ने पर आप अनधिकृत या महंगे साहूकारों (15% ब्याज) की तुलना में लगभग ₹${Math.round(interestSavings).toLocaleString('en-IN')} ब्याज की बचत करते हैं।`,
      scheduleToggleShow: "संपूर्ण किस्त समय-सारणी देखें",
      scheduleToggleHide: "समय-सारणी छिपाएं",
      moratoriumToggleLabel: "निर्माण/बागवानी हेतु 24 माह का विस्तारित मोरेटोरियम लागू करें",
      proceedBtn: "अधिकृत चैनल पार्टनर बैंक खोजें"
    }
  }[lang === 'hi' ? 'hi' : 'en'];

  return (
    <div className="liquid-glass-card animate-fade-in" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
      {/* Title */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--brand-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={24} className="text-orange-500" />
          <span>{t.plannerTitle}</span>
        </h2>
        <p style={{ fontSize: '0.86rem', color: 'var(--slate-600)' }}>
          {t.plannerSubtitle}
        </p>
      </div>

      {/* Extended Moratorium Simulation Toggle */}
      <div style={{ background: 'rgba(255, 255, 255, 0.7)', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={18} color="#2563eb" />
          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#1e293b' }}>
            {t.moratoriumToggleLabel}
          </span>
        </div>
        <input
          type="checkbox"
          id="toggleExtMoratorium"
          checked={isExtendedMoratorium}
          onChange={(e) => setIsExtendedMoratorium(e.target.checked)}
          style={{ width: '18px', height: '18px', accentColor: '#f97316', cursor: 'pointer' }}
        />
      </div>

      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Project Cost */}
        <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>{t.costLabel}</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--brand-navy)', marginTop: '0.2rem' }}>
            ₹{plan.projectCost.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Declared project valuation</div>
        </div>

        {/* Eligible Loan */}
        <div style={{ background: '#ecfdf5', border: '1.5px solid #a7f3d0', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: '700', textTransform: 'uppercase' }}>{t.loanLabel}</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#065f46', marginTop: '0.2rem' }}>
            ₹{plan.eligibleLoan.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#059669' }}>
            Max funding capped by scheme policy
          </div>
        </div>

        {/* Own Equity */}
        <div style={{ background: '#fff7ed', border: '1.5px solid #fed7aa', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#c2410c', fontWeight: '700', textTransform: 'uppercase' }}>{t.ownLabel}</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ea580c', marginTop: '0.2rem' }}>
            ₹{plan.ownContribution.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#9a3412' }}>
            Beneficiary margin / equity
          </div>
        </div>

        {/* Regular Installment */}
        <div style={{ background: '#f0f9ff', border: '1.5px solid #bae6fd', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: '700', textTransform: 'uppercase' }}>{t.installmentLabel}</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0369a1', marginTop: '0.2rem' }}>
            ₹{plan.firstRegularInstallment.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#0284c7' }}>
            {plan.cadenceLabel} post moratorium
          </div>
        </div>
      </div>

      {/* Moratorium & Cadence Summary Row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.7)', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
        <div style={{ flex: '1 1 200px' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.rateLabel}:</span>
          <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--brand-navy)' }}>
            {plan.interestRatePercent}% per annum
          </div>
        </div>
        <div style={{ flex: '1 1 200px' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.moratoriumLabel}:</span>
          <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#2563eb' }}>
            {plan.moratoriumMonths} Months (Gestation Grace)
          </div>
        </div>
        <div style={{ flex: '1 1 200px' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Tenure:</span>
          <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--brand-navy)' }}>
            {plan.totalTenureYears} Years ({plan.schedule.length} {plan.cadence} installments)
          </div>
        </div>
        <div style={{ flex: '1 1 200px' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.totalRepayLabel}:</span>
          <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--brand-navy)' }}>
            ₹{plan.totalRepayment.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Financial Dignity Savings Callout */}
      {interestSavings > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #ecfdf5, #f0fdf4)',
          border: '1px solid #86efac',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <TrendingDown size={20} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#065f46' }}>
              {t.savingsCallout}: ₹{Math.round(interestSavings).toLocaleString('en-IN')} Saved
            </div>
            <div style={{ fontSize: '0.82rem', color: '#047857', marginTop: '0.15rem' }}>
              {t.savingsDetail}
            </div>
          </div>
        </div>
      )}

      {/* Schedule Table Toggle */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          type="button"
          onClick={() => setShowFullSchedule(!showFullSchedule)}
          className="details-toggle-btn"
          id="toggle-repayment-schedule-btn"
        >
          {showFullSchedule ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          <span>{showFullSchedule ? t.scheduleToggleHide : t.scheduleToggleShow}</span>
        </button>

        {showFullSchedule && (
          <div style={{ marginTop: '1rem', overflowX: 'auto', border: '1px solid #cbd5e1', borderRadius: '10px', background: '#ffffff' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1', color: '#475569' }}>
                  <th style={{ padding: '0.65rem 0.85rem' }}>#</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Month</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Phase</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Installment</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Principal</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Interest</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Balance</th>
                </tr>
              </thead>
              <tbody>
                {plan.schedule.map((row) => (
                  <tr key={row.installmentNumber} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.6rem 0.85rem', fontWeight: '700' }}>{row.installmentNumber}</td>
                    <td style={{ padding: '0.6rem 0.85rem' }}>M{row.month}</td>
                    <td style={{ padding: '0.6rem 0.85rem' }}>
                      <span style={{
                        fontSize: '0.72rem',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        background: row.isMoratorium ? '#eff6ff' : '#f0fdf4',
                        color: row.isMoratorium ? '#1d4ed8' : '#15803d',
                        fontWeight: '700'
                      }}>
                        {row.isMoratorium ? 'Moratorium' : 'Repayment'}
                      </span>
                    </td>
                    <td style={{ padding: '0.6rem 0.85rem', fontWeight: '700' }}>₹{row.installmentAmount.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '0.6rem 0.85rem' }}>₹{row.principalComponent.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '0.6rem 0.85rem' }}>₹{row.interestComponent.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '0.6rem 0.85rem', color: '#64748b' }}>₹{row.closingBalance.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
        <button
          type="button"
          onClick={onProceedToPartnerRouting}
          className="btn-solid-primary"
          id="repayment-proceed-btn"
          style={{ fontSize: '0.95rem' }}
        >
          <span>{t.proceedBtn}</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
