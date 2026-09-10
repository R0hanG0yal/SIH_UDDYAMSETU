import React, { useState } from 'react';
import { 
  Users, AlertCircle, CheckCircle2, XCircle, ShieldAlert, 
  HelpCircle, Eye, ArrowRight, UserCheck 
} from 'lucide-react';

export function HITLPanel({ lang = 'en' }) {
  const [escalations, setEscalations] = useState([
    {
      id: 'ESC-001',
      profileName: 'Priya Devi',
      field: 'gender',
      detectedValue: 'female',
      confidence: 0.48,
      source: 'AI_INFERRED',
      ruleImpact: 'Triggers 35% special category rural subsidy under PMEGP Para 4.2',
      status: 'PENDING'
    },
    {
      id: 'ESC-002',
      profileName: 'Ramesh Kumar',
      field: 'annualIncome',
      detectedValue: '₹1,80,000',
      confidence: 0.62,
      source: 'USER_DECLARED',
      ruleImpact: 'Boundary check for NBCFDC Creamy Layer exclusion (< ₹3,00,000)',
      status: 'PENDING'
    },
    {
      id: 'ESC-003',
      profileName: 'Vikram Patel',
      field: 'hasUdyamRegistration',
      detectedValue: 'Uncertain',
      confidence: 0.40,
      source: 'DOCUMENT_EXTRACTED',
      ruleImpact: 'Aadhaar name mismatch with Udyam Certificate (Patel V. vs Vikram Patel)',
      status: 'PENDING'
    }
  ]);

  const handleResolve = (id, resolution) => {
    setEscalations(prev => prev.map(item => 
      item.id === id ? { ...item, status: resolution } : item
    ));
  };

  return (
    <div className="hitl-panel-card" style={{
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '24px',
      padding: '2rem',
      boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
      marginTop: '2rem',
    }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '3px 12px',
          borderRadius: '9999px',
          background: 'rgba(239, 68, 68, 0.15)',
          color: '#ef4444',
          fontSize: '0.75rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '6px',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        }}>
          <ShieldAlert size={13} />
          <span>Human-in-the-Loop (HITL) Uncertainty Gate</span>
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f8fafc', margin: '0 0 4px' }}>
          {lang === 'hi' ? 'मानवीय समीक्षा कतार (Uncertainty Queue)' : 'Ambiguity & Uncertainty Review Queue'}
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.84rem', margin: 0 }}>
          {lang === 'hi'
            ? 'जब AI मॉडल की निश्चितता 70% से कम होती है, तो स्वचालित निर्णय लेने के बजाय मामला CSC ऑपरेटर या समीक्षा अधिकारी को भेजा जाता है।'
            : 'Decisions with confidence < 0.70 are never silently assumed. They route to this operator desk for verified human adjudication.'}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {escalations.map((esc) => {
          const isResolved = esc.status !== 'PENDING';
          return (
            <div
              key={esc.id}
              style={{
                padding: '1.2rem',
                background: isResolved ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${isResolved ? 'rgba(255, 255, 255, 0.04)' : 'rgba(239, 68, 68, 0.25)'}`,
                borderRadius: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                opacity: isResolved ? 0.6 : 1,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>{esc.id}</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc' }}>{esc.profileName}</span>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    color: '#ef4444',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                  }}>
                    {Math.round(esc.confidence * 100)}% Certainty
                  </span>
                </div>

                <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '4px' }}>
                  Field: <strong style={{ color: '#38bdf8' }}>{esc.field}</strong> = "{esc.detectedValue}" ({esc.source})
                </div>

                <div style={{ fontSize: '0.76rem', color: '#f59e0b' }}>
                  Policy Impact: {esc.ruleImpact}
                </div>
              </div>

              <div>
                {isResolved ? (
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: esc.status === 'CONFIRMED' ? '#10b981' : '#ef4444',
                  }}>
                    Resolution: {esc.status}
                  </span>
                ) : (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => handleResolve(esc.id, 'CONFIRMED')}
                      style={{
                        padding: '6px 14px',
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '8px',
                        color: '#10b981',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <CheckCircle2 size={13} />
                      <span>Confirm Value</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleResolve(esc.id, 'REJECTED')}
                      style={{
                        padding: '6px 14px',
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '8px',
                        color: '#ef4444',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <XCircle size={13} />
                      <span>Flag / Clarify</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HITLPanel;
