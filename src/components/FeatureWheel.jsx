import React, { useState } from 'react';
import { Gift, ShieldCheck, Percent, Clock, Sparkles, QrCode, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

export function FeatureWheel() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [showFullClause, setShowFullClause] = useState(false);

  const features = [
    {
      id: "subsidy",
      icon: <Gift size={22} />,
      title: "Direct 35% Capital Grant",
      highlight: "₹1,75,000 to ₹17,50,000",
      scheme: "PMEGP / KVIC",
      summary: "Non-repayable government cash grant credited directly to your bank account after 3 years of viable enterprise operation.",
      fullClause: "Under PMEGP guidelines (MoMSME), beneficiaries in special categories (female, rural, SC/ST, ex-servicemen) receive 35% of total project cost as a direct margin money grant. General urban enterprises receive 15%. This money never needs to be repaid to the bank.",
      metric: "35% Non-Repayable"
    },
    {
      id: "collateral",
      icon: <ShieldCheck size={22} />,
      title: "Zero Collateral Required",
      highlight: "100% Sovereign Guarantee",
      scheme: "CGTMSE & MUDRA",
      summary: "No land, house, or third-party guarantor required. The Government of India guarantees up to 85% of your loan through CGTMSE.",
      fullClause: "Pursuant to RBI circular RBI/2021-22/86, banks are mandated not to seek collateral security for micro & small enterprise loans up to ₹10 Lakh (PMMY) and up to ₹5 Crore under CGTMSE guarantee trust cover.",
      metric: "₹0 Property Mortgage"
    },
    {
      id: "interest",
      icon: <Percent size={22} />,
      title: "5.0% Concessional Interest",
      highlight: "Flat Concession",
      scheme: "PM-VishwaKarma / NSFDC",
      summary: "Artisans, craftsmen, and small producers access working capital at a flat 5.0% interest rate, with MoMSME paying the remainder.",
      fullClause: "PM-VishwaKarma scheme provides collateral-free enterprise credit at an effective subvented rate of 5.0%. MoMSME bears up to 8% interest subvention directly to the lending bank.",
      metric: "5% Subvented Rate"
    },
    {
      id: "moratorium",
      icon: <Clock size={22} />,
      title: "Moratorium Grace Period",
      highlight: "6 to 48 Months Holiday",
      scheme: "All National Schemes",
      summary: "Zero EMI principal burden during initial setup months while your machinery and enterprise cash flows stabilize.",
      fullClause: "Standard enterprise financing includes a 3 to 6 month moratorium grace period on principal repayment. For CSIS technical higher education schemes, moratorium spans the entire course duration plus 1 year.",
      metric: "Grace Period Included"
    },
    {
      id: "bridge",
      icon: <Sparkles size={22} />,
      title: "Bridge to Eligibility",
      highlight: "Zero Gatekeeping",
      scheme: "SAARTHI AI Engine",
      summary: "If you don't qualify today, receive a concrete, step-by-step roadmap to become eligible at zero financial cost.",
      fullClause: "Instead of outright rejection, SAARTHI cross-references 8+ national ministry matrices and generates actionable steps (e.g. Free Udyam Certificate, KVIC EDP 5-day online course, CSC biometric verification) to elevate your subsidy tier.",
      metric: "Actionable Roadmap"
    },
    {
      id: "passport",
      icon: <QrCode size={22} />,
      title: "Encrypted QR Passport",
      highlight: "Instant Bank Handshake",
      scheme: "PM-SURAJ Integrated",
      summary: "A cryptographic token that bank officers scan to immediately load your audited dossier without redundant paper forms.",
      fullClause: "The Loan Fit Passport generates a cryptographically verifiable token containing your project valuation, calculated subsidy, audited documents, and assigned partner bank ID for instant ingestion into PM-SURAJ.",
      metric: "1-Scan Processing"
    }
  ];

  const currentFeature = features[activeIdx];
  const radius = 125;
  const total = features.length;

  return (
    <div className="liquid-glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <Sparkles className="text-amber-500" size={20} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-navy)' }}>
              Interactive Credit Feature Wheel
            </h3>
            <span className="liquid-glass-pill" style={{ color: 'var(--brand-teal)' }}>
              Rotate or Click Dial
            </span>
          </div>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.88rem' }}>
            Click any node on the radial wheel to inspect how sovereign GoI policies protect your business.
          </p>
        </div>

        <button
          onClick={() => setShowFullClause(!showFullClause)}
          className="details-toggle-btn"
          id="toggle-feature-wheel-clause-btn"
        >
          {showFullClause ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {showFullClause ? "Hide Policy Clause" : "Show Full Policy Clause"}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '2rem', alignItems: 'center' }}>
        {/* Radial Disc Dial */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <div className="feature-wheel-stage">
            <div className="feature-wheel-disc">
              {/* Central Hub Core */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--brand-navy), var(--brand-teal))',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 0 25px rgba(19, 78, 74, 0.45)',
                border: '2px solid rgba(255, 255, 255, 0.25)',
                textAlign: 'center',
                padding: '0.5rem'
              }}>
                <div style={{ fontSize: '0.68rem', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.04em' }}>GoI Credit</div>
                <div style={{ fontSize: '1rem', fontWeight: 800 }}>SAARTHI</div>
                <div style={{ fontSize: '0.62rem', color: '#fdba74' }}>Dial 6 Pillars</div>
              </div>

              {/* 6 Orbiting Feature Nodes */}
              {features.map((feat, i) => {
                const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
                const x = 160 + radius * Math.cos(angle);
                const y = 160 + radius * Math.sin(angle);
                const isActive = i === activeIdx;

                return (
                  <button
                    key={feat.id}
                    onClick={() => setActiveIdx(i)}
                    className={`feature-wheel-node ${isActive ? 'active' : ''}`}
                    style={{ left: `${x}px`, top: `${y}px` }}
                    title={feat.title}
                  >
                    {feat.icon}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dynamic Feature Detail Panel */}
        <div className="liquid-glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-saffron)', textTransform: 'uppercase' }}>
              Pillar {activeIdx + 1} of 6 • {currentFeature.scheme}
            </span>
            <span className="badge-status badge-green" style={{ fontSize: '0.75rem' }}>
              {currentFeature.metric}
            </span>
          </div>

          <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '0.35rem' }}>
            {currentFeature.title}
          </h4>

          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--brand-teal)', marginBottom: '0.85rem' }}>
            {currentFeature.highlight}
          </div>

          <p style={{ color: 'var(--slate-700)', fontSize: '0.92rem', lineHeight: 1.55, marginBottom: '1.25rem' }}>
            {currentFeature.summary}
          </p>

          {/* Quick Select Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: showFullClause ? '1rem' : '0' }}>
            {features.map((f, idx) => (
              <button
                key={f.id}
                onClick={() => setActiveIdx(idx)}
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: '9999px',
                  border: idx === activeIdx ? '1.5px solid var(--accent-saffron)' : '1px solid var(--slate-200)',
                  background: idx === activeIdx ? 'var(--brand-navy)' : '#ffffff',
                  color: idx === activeIdx ? '#ffffff' : 'var(--slate-700)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {f.title.split(' ')[0]} {f.title.split(' ')[1] || ''}
              </button>
            ))}
          </div>

          {/* Collapsible Official Policy Clause */}
          {showFullClause && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '10px',
              border: '1px solid rgba(19, 78, 74, 0.15)',
              fontSize: '0.82rem',
              color: 'var(--slate-600)',
              lineHeight: 1.5
            }}>
              <strong style={{ color: 'var(--brand-navy)', display: 'block', marginBottom: '0.25rem' }}>
                Official Sovereign Regulatory Clause:
              </strong>
              {currentFeature.fullClause}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
