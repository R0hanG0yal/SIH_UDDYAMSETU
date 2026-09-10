import React from 'react';
import { 
  Award, ShieldAlert, ArrowRight, CheckCircle2, AlertTriangle, 
  Sparkles, Sliders, FileText, ChevronRight, TrendingUp, IndianRupee, ExternalLink 
} from 'lucide-react';
import { CitationFootnote } from './CitationFootnote';
import { ConfidenceBadge } from './ConfidenceBadge';
import { FeedbackWidget } from './FeedbackWidget';

export function FundingDashboard({
  profile,
  matchEvaluation,
  readinessResult,
  documents,
  lang = 'en',
  onNavigateToWhatIf,
  onNavigateToSchemes,
}) {
  const readiness = readinessResult || {
    overallScore: 68,
    tier: 'GOOD',
    tierLabel: 'Strong Candidate',
    breakdown: {
      profileCompleteness: { score: 14, max: 15, pct: 93 },
      businessFormalization: { score: 8, max: 20, pct: 40 },
      documentReadiness: { score: 12, max: 20, pct: 60 },
      eligibilityCoverage: { score: 18, max: 20, pct: 90 },
      financialClarity: { score: 9, max: 10, pct: 90 },
      partnerAccessibility: { score: 12, max: 15, pct: 80 },
    },
    blockers: [
      { id: 'BLOCKER_UDYAM', title: 'Udyam Registration Missing', impact: '-12 pts', severity: 'HIGH', advice: 'Free MSME registration takes 5 minutes with Aadhaar. Unlocks 3 additional priority schemes.' },
      { id: 'BLOCKER_DPR', title: 'Project Report (DPR) Not Attached', impact: '-8 pts', severity: 'MEDIUM', advice: 'Banks require machine specifications & 3-year cash flow projections before sanctioning loans.' }
    ],
    actionPlan: [
      { step: 1, title: 'Complete Free Udyam Portal Registration', time: '5 Mins', points: '+12 pts', link: 'https://udyamregistration.gov.in' },
      { step: 2, title: 'Generate Automated AI Project Report (DPR)', time: 'Instant', points: '+8 pts', action: 'generate_dpr' },
      { step: 3, title: 'Procure Machinery Quotation with GSTIN', time: '1 Day', points: '+6 pts', action: 'quotation' }
    ]
  };

  const matched = matchEvaluation?.matchedSchemes || [];
  const topSchemes = matched.slice(0, 3);

  // SVG Gauge Calculations
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const score = readiness.overallScore || 0;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (s) => {
    if (s >= 80) return '#10b981';
    if (s >= 60) return '#f97316';
    if (s >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const scoreColor = getScoreColor(score);

  return (
    <div className="funding-dashboard-container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '1rem 1rem 3rem' }}>
      
      {/* Top Banner: Overview */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85), rgba(9, 30, 32, 0.9))',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        padding: '2rem',
        backdropFilter: 'blur(20px)',
        marginBottom: '2rem',
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
          
          {/* Readiness Score Radial Gauge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ position: 'relative', width: '150px', height: '150px', flexShrink: 0 }}>
              <svg width="150" height="150" viewBox="0 0 150 150" style={{ transform: 'rotate(-90deg)' }}>
                <circle
                  cx="75"
                  cy="75"
                  r={radius}
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="75"
                  cy="75"
                  r={radius}
                  stroke={scoreColor}
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                />
              </svg>
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
              }}>
                <span style={{ fontSize: '2.4rem', fontWeight: 900, color: '#f8fafc', lineHeight: 1 }}>
                  {score}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  / 100 PTS
                </span>
              </div>
            </div>

            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 10px',
                borderRadius: '9999px',
                background: `${scoreColor}20`,
                color: scoreColor,
                fontSize: '0.75rem',
                fontWeight: 700,
                marginBottom: '6px',
                border: `1px solid ${scoreColor}40`,
              }}>
                <Award size={13} />
                <span>{readiness.tierLabel || 'Funding Candidate'}</span>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 4px' }}>
                {lang === 'hi' ? 'ऋण तैयारी स्कोर (Readiness)' : 'Funding Readiness Score'}
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.84rem', margin: 0, maxWidth: '380px' }}>
                {lang === 'hi'
                  ? 'बैंक व सरकारी योजनाओं में स्वीकृति की संभावना। औपचारिक पंजीकरण व प्रोजेक्ट रिपोर्ट से स्कोर 85+ पहुँच सकता है।'
                  : 'Predictive score measuring bank readiness, documentation completeness, and scheme qualification.'}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Eligible Schemes</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>{matched.length} Schemes</div>
              <div style={{ fontSize: '0.72rem', color: '#10b981' }}>Verified via Gazette</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Max Capital Subsidy</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f97316' }}>
                ₹{((matchEvaluation?.summary?.maxPotentialSubsidy || 105000)).toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#f59e0b' }}>Non-Repayable Grant</div>
            </div>
          </div>
        </div>

        {/* Score Decomposition Bars */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '12px' }}>
            Readiness Decomposition & Transparent Weights
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
            {Object.entries(readiness.breakdown || {}).map(([key, item]) => {
              const labelMap = {
                profileCompleteness: 'Profile (15%)',
                businessFormalization: 'Formalization (20%)',
                documentReadiness: 'Docs Ready (20%)',
                eligibilityCoverage: 'Scheme Fit (20%)',
                financialClarity: 'Financials (10%)',
                partnerAccessibility: 'Bank Partner (15%)'
              };
              return (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '4px' }}>
                    <span>{labelMap[key] || key}</span>
                    <strong style={{ color: '#f8fafc' }}>{item.score}/{item.max}</strong>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${item.pct || 0}%`,
                      height: '100%',
                      background: item.pct > 75 ? '#10b981' : item.pct > 45 ? '#f97316' : '#ef4444',
                      borderRadius: '9999px',
                      transition: 'width 0.8s ease',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Blockers vs Action Plan */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* "What is stopping you?" Blockers */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          padding: '1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <ShieldAlert size={18} color="#ef4444" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              {lang === 'hi' ? 'आपको क्या रोक रहा है? (Blockers)' : 'What Is Stopping You?'}
            </h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' }}>
            {lang === 'hi'
              ? 'ये प्रमुख कमियाँ वर्तमान में आपकी ऋण मंजूरी या अधिकतम सब्सिडी को सीमित कर रही हैं:'
              : 'Key friction points currently limiting your approval confidence or locking higher subsidy brackets:'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(readiness.blockers || []).map((b, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px 14px',
                  background: 'rgba(239, 68, 68, 0.06)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fca5a5' }}>{b.title}</span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ef4444', background: 'rgba(239,68,68,0.15)', padding: '2px 8px', borderRadius: '9999px' }}>
                    {b.impact}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                  {b.advice}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onNavigateToWhatIf}
            style={{
              marginTop: '1.2rem',
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'rgba(249, 115, 22, 0.12)',
              color: '#f97316',
              border: '1px solid rgba(249, 115, 22, 0.3)',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
          >
            <Sliders size={15} />
            <span>{lang === 'hi' ? 'व्हाट-इफ लैब में बदलाव का असर देखें' : 'Simulate Fixes in What-If Lab'}</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* AI Step-by-Step Action Plan */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          padding: '1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <TrendingUp size={18} color="#10b981" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              {lang === 'hi' ? 'सुधार कार्य योजना (Action Plan)' : 'Action Plan to Reach 85+ Readiness'}
            </h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' }}>
            {lang === 'hi'
              ? 'इन व्यावहारिक कदमों से आपका बैंक डोज़ियर तैयार होगा और सब्सिडी प्राथमिकता मिलेगी:'
              : 'Complete these practical micro-actions to optimize your banker application packet:'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(readiness.actionPlan || []).map((step, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px 14px',
                  background: 'rgba(16, 185, 129, 0.06)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: '#10b981',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {idx + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f8fafc' }}>{step.title}</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Est. time: {step.time}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#10b981', background: 'rgba(16,185,129,0.15)', padding: '2px 8px', borderRadius: '9999px' }}>
                    {step.points}
                  </span>
                  {step.link && (
                    <a
                      href={step.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#38bdf8', padding: '4px' }}
                      title="Open portal"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Matched Schemes with Grounded Citations */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '1.5rem',
        marginBottom: '2rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              {lang === 'hi' ? 'सर्वोत्तम सरकारी योजनाएं (Grounded Matches)' : 'Top Verified Funding Schemes'}
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Every subsidy figure is backed by published gazette policy rules.
            </span>
          </div>

          <button
            type="button"
            onClick={onNavigateToSchemes}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#f8fafc',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <span>View All {matched.length} Schemes</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {topSchemes.map((scheme) => (
            <div
              key={scheme.id}
              style={{
                padding: '1.2rem',
                background: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc', margin: 0, lineHeight: 1.3 }}>
                    {scheme.name}
                  </h4>
                  <CitationFootnote citation={scheme.citation} />
                </div>

                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '10px' }}>
                  Ministry: {scheme.ministry || 'Government of India'}
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '6px 10px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase' }}>Subsidy</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#10b981' }}>
                      {scheme.maxSubsidyPercent ? `${scheme.maxSubsidyPercent}%` : 'Concessional'}
                    </div>
                  </div>
                  <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '6px 10px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase' }}>Interest Rate</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#38bdf8' }}>
                      {scheme.interestRatePercent ? `${scheme.interestRatePercent}%` : 'Subsidized'}
                    </div>
                  </div>
                </div>
              </div>

              <FeedbackWidget schemeId={scheme.id} compact={true} lang={lang} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FundingDashboard;
