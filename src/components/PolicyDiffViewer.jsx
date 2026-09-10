import React, { useState } from 'react';
import { 
  FileDiff, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, 
  RefreshCw, Bell, Sparkles 
} from 'lucide-react';

export function PolicyDiffViewer({ lang = 'en' }) {
  const [selectedScheme, setSelectedScheme] = useState('GOI_PMEGP');
  const [propagated, setPropagated] = useState(false);

  const diffData = {
    schemeId: 'GOI_PMEGP',
    schemeName: "Prime Minister's Employment Generation Programme (PMEGP)",
    versionFrom: '2024.Q4 (Gazette No. 142)',
    versionTo: '2025.Q2 (Revised Guidelines)',
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    changes: [
      {
        field: 'maxLoanAmount (Manufacturing)',
        was: '₹25,00,000',
        now: '₹50,00,000',
        type: 'RELAXED',
        impact: 'Projects between ₹25L and ₹50L now qualify for credit-linked subsidy'
      },
      {
        field: 'moratoriumMonths',
        was: '6 Months',
        now: '12 Months',
        type: 'RELAXED',
        impact: 'EMI repayment starts 12 months after machine installation'
      },
      {
        field: 'subsidyPercent (Rural Special)',
        was: '35%',
        now: '35%',
        type: 'UNCHANGED',
        impact: 'Continues to offer 35% non-repayable sovereign capital'
      }
    ],
    impactedCitizensCount: 14,
  };

  const handlePropagate = () => {
    setPropagated(true);
    setTimeout(() => setPropagated(false), 4000);
  };

  return (
    <div className="policy-diff-card" style={{
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '24px',
      padding: '2rem',
      boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
      marginTop: '2rem',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 12px',
            borderRadius: '9999px',
            background: 'rgba(168, 85, 247, 0.15)',
            color: '#c084fc',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '6px',
            border: '1px solid rgba(168, 85, 247, 0.3)',
          }}>
            <FileDiff size={13} />
            <span>Policy Change Intelligence & Versioning</span>
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f8fafc', margin: '0 0 4px' }}>
            {lang === 'hi' ? 'नीति परिवर्तन विश्लेषण व प्रभाव प्रसार' : 'Gazette Policy Diff & Impact Propagation'}
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.84rem', margin: 0 }}>
            {lang === 'hi'
              ? 'मंत्रालय के नए दिशा-निर्देशों का संरचित अंतर विश्लेषण। सभी सहेजे गए उद्यमियों पर प्रभाव स्वतः आँका जाता है।'
              : 'Structured diffs tracking guideline updates. Re-evaluates saved entrepreneur profiles and notifies newly qualified citizens.'}
          </p>
        </div>

        <button
          type="button"
          onClick={handlePropagate}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px',
            background: propagated ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #a855f7, #9333ea)',
            color: '#ffffff',
            border: 'none',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 8px 20px -4px rgba(168, 85, 247, 0.4)',
          }}
        >
          {propagated ? <CheckCircle2 size={16} /> : <Bell size={16} />}
          <span>{propagated ? 'Changes Propagated to 14 Profiles!' : 'Propagate Updates to Citizens'}</span>
        </button>
      </div>

      {/* Scheme Version Banner */}
      <div style={{
        padding: '12px 16px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        marginBottom: '1.2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <div>
          <strong style={{ color: '#f8fafc', fontSize: '0.9rem' }}>{diffData.schemeName}</strong>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
            Comparing: <span style={{ color: '#ef4444' }}>{diffData.versionFrom}</span> → <span style={{ color: '#10b981' }}>{diffData.versionTo}</span>
          </div>
        </div>
        <div style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'monospace' }}>
          SHA-256: {diffData.hash.slice(0, 16)}...
        </div>
      </div>

      {/* Diff Table */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {diffData.changes.map((c, idx) => (
          <div
            key={idx}
            style={{
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc', marginBottom: '2px' }}>
                {c.field}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                {c.impact}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ textAlign: 'right', fontSize: '0.8rem' }}>
                <span style={{ color: '#ef4444', textDecoration: 'line-through', marginRight: '8px' }}>{c.was}</span>
                <span style={{ color: '#10b981', fontWeight: 800 }}>{c.now}</span>
              </div>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '6px',
                background: c.type === 'RELAXED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                color: c.type === 'RELAXED' ? '#10b981' : '#94a3b8',
                border: `1px solid ${c.type === 'RELAXED' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
              }}>
                {c.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PolicyDiffViewer;
