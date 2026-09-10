import React, { useState, useEffect } from 'react';
import { 
  Sliders, Sparkles, ArrowRight, CheckCircle2, XCircle, TrendingUp, 
  RefreshCw, IndianRupee, ShieldCheck, AlertCircle, Building2, MapPin 
} from 'lucide-react';
import { runCounterfactualApi } from '../services/api';
import { runCounterfactual } from '../../server/engines/counterfactualEngine';
import { CitationFootnote } from './CitationFootnote';

export function WhatIfLab({ profile, documents = {}, lang = 'en' }) {
  // Hypothetical modifications state
  const [hypoState, setHypoState] = useState({
    projectCost: profile?.projectCost || 200000,
    hasUdyam: false,
    sector: profile?.purpose === 'business' ? 'manufacturing' : 'service',
    isRural: profile?.isRural !== undefined ? profile.isRural : true,
    annualIncome: profile?.annualIncome || 180000,
    socialCategory: profile?.socialCategory || 'OBC',
  });

  const [simResult, setSimResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateSimulation = () => {
    setLoading(true);
    const changes = {
      projectCost: Number(hypoState.projectCost),
      hasUdyamRegistration: Boolean(hypoState.hasUdyam),
      isRural: Boolean(hypoState.isRural),
      annualIncome: Number(hypoState.annualIncome),
      socialCategory: hypoState.socialCategory,
      isSC: hypoState.socialCategory === 'SC',
      isOBC: hypoState.socialCategory === 'OBC',
      isST: hypoState.socialCategory === 'ST',
    };

    try {
      // Try local direct execution first (instant), fallback to API
      const result = runCounterfactual(profile, changes, documents);
      setSimResult(result);
      setLoading(false);
    } catch (e) {
      runCounterfactualApi({ profile, changes, documents })
        .then(res => setSimResult(res))
        .catch(err => console.error('What-If simulation failed:', err))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    calculateSimulation();
  }, [hypoState, profile]);

  const resetToCurrent = () => {
    setHypoState({
      projectCost: profile?.projectCost || 200000,
      hasUdyam: false,
      sector: profile?.purpose === 'business' ? 'manufacturing' : 'service',
      isRural: profile?.isRural !== undefined ? profile.isRural : true,
      annualIncome: profile?.annualIncome || 180000,
      socialCategory: profile?.socialCategory || 'OBC',
    });
  };

  const deltaSubsidy = (simResult?.hypotheticalEvaluation?.summary?.maxPotentialSubsidy || 0) - 
                       (simResult?.baselineEvaluation?.summary?.maxPotentialSubsidy || 0);

  const deltaReadiness = (simResult?.hypotheticalReadiness?.overallScore || 0) - 
                         (simResult?.baselineReadiness?.overallScore || 0);

  return (
    <div className="what-if-lab-container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '1rem 1rem 3rem' }}>
      
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85), rgba(19, 78, 74, 0.4))',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        padding: '2rem',
        backdropFilter: 'blur(20px)',
        marginBottom: '2rem',
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 12px',
              borderRadius: '9999px',
              background: 'rgba(249, 115, 22, 0.15)',
              color: '#f97316',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '6px',
              border: '1px solid rgba(249, 115, 22, 0.3)',
            }}>
              <Sliders size={13} />
              <span>Counterfactual Policy Engine</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f8fafc', margin: '0 0 6px' }}>
              {lang === 'hi' ? 'व्हाट-इफ़ फंडिंग लैब (What-If Lab)' : 'What-If Funding Lab & Simulator'}
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0, maxWidth: '640px' }}>
              {lang === 'hi'
                ? 'काल्पनिक व्यावसायिक बदलावों का परीक्षण करें। देखें कि उद्यम पंजीकरण, लागत या स्थान बदलने पर कौन सी नई योजनाएं अनलॉक होती हैं।'
                : 'Simulate policy sensitivity in real-time. Discover how formalizing, changing location, or tweaking project size transforms your eligibility.'}
            </p>
          </div>

          <button
            type="button"
            onClick={resetToCurrent}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#cbd5e1',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={13} />
            <span>Reset to Current Profile</span>
          </button>
        </div>
      </div>

      {/* Two Column Layout: Controls vs Live Impact */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        
        {/* LEFT: Interactive Controls */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          padding: '1.8rem',
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} color="#f97316" />
            <span>Adjust Hypothetical Parameters</span>
          </h3>

          {/* 1. Project Cost Slider */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 600 }}>Project / Loan Requirement</label>
              <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#38bdf8' }}>
                ₹{Number(hypoState.projectCost).toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="50000"
              max="2500000"
              step="25000"
              value={hypoState.projectCost}
              onChange={(e) => setHypoState({ ...hypoState, projectCost: Number(e.target.value) })}
              style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>
              <span>₹50K (Shishu)</span>
              <span>₹5L (Kishor)</span>
              <span>₹25L (PMEGP Max)</span>
            </div>
          </div>

          {/* 2. Udyam Registration Toggle */}
          <div style={{
            padding: '14px',
            background: hypoState.hasUdyam ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.03)',
            border: `1px solid ${hypoState.hasUdyam ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
            borderRadius: '12px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
          onClick={() => setHypoState({ ...hypoState, hasUdyam: !hypoState.hasUdyam })}
          >
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: hypoState.hasUdyam ? '#10b981' : '#f8fafc' }}>
                Has MSME Udyam Registration?
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                Unlocks CGTMSE credit guarantee & specialized MSME subsidies
              </div>
            </div>
            <input
              type="checkbox"
              checked={hypoState.hasUdyam}
              onChange={() => {}} // handled by div
              style={{ width: '18px', height: '18px', accentColor: '#10b981', cursor: 'pointer' }}
            />
          </div>

          {/* 3. Rural vs Urban Location */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              Unit Location (Geography)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setHypoState({ ...hypoState, isRural: true })}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: hypoState.isRural ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  color: hypoState.isRural ? '#10b981' : '#94a3b8',
                  border: `1px solid ${hypoState.isRural ? '#10b981' : 'rgba(255, 255, 255, 0.08)'}`,
                }}
              >
                🏡 Rural (35% Subsidy)
              </button>
              <button
                type="button"
                onClick={() => setHypoState({ ...hypoState, isRural: false })}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: !hypoState.isRural ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  color: !hypoState.isRural ? '#38bdf8' : '#94a3b8',
                  border: `1px solid ${!hypoState.isRural ? '#38bdf8' : 'rgba(255, 255, 255, 0.08)'}`,
                }}
              >
                🏙️ Urban (25% Subsidy)
              </button>
            </div>
          </div>

          {/* 4. Social Category */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              Social Category (Concessional Tiers)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {['General', 'OBC', 'SC', 'ST'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setHypoState({ ...hypoState, socialCategory: cat })}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: hypoState.socialCategory === cat ? 'rgba(249, 115, 22, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                    color: hypoState.socialCategory === cat ? '#f97316' : '#94a3b8',
                    border: `1px solid ${hypoState.socialCategory === cat ? '#f97316' : 'rgba(255, 255, 255, 0.08)'}`,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Annual Family Income Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 600 }}>Annual Household Income</label>
              <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f59e0b' }}>
                ₹{Number(hypoState.annualIncome).toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="60000"
              max="600000"
              step="20000"
              value={hypoState.annualIncome}
              onChange={(e) => setHypoState({ ...hypoState, annualIncome: Number(e.target.value) })}
              style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>
              <span>₹60K (BPL)</span>
              <span>₹3.0L (NBCFDC Ceiling)</span>
              <span>₹6.0L (Higher)</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Live Delta Impact */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Summary Delta Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div style={{
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '1.2rem',
              backdropFilter: 'blur(16px)',
            }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Readiness Shift</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: deltaReadiness >= 0 ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {deltaReadiness >= 0 ? `+${deltaReadiness}` : deltaReadiness}
                <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 500 }}>pts</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '4px' }}>
                From {simResult?.baselineReadiness?.overallScore || 0} → {simResult?.hypotheticalReadiness?.overallScore || 0}
              </div>
            </div>

            <div style={{
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '1.2rem',
              backdropFilter: 'blur(16px)',
            }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Max Subsidy Gain</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: deltaSubsidy >= 0 ? '#f97316' : '#ef4444' }}>
                {deltaSubsidy >= 0 ? `+₹${deltaSubsidy.toLocaleString('en-IN')}` : `-₹${Math.abs(deltaSubsidy).toLocaleString('en-IN')}`}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '4px' }}>
                Direct non-repayable capital
              </div>
            </div>
          </div>

          {/* AI Explanation Narrative */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '1.4rem',
            backdropFilter: 'blur(16px)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={16} color="#a855f7" />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                AI Policy Sensitivity Analysis
              </h4>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
              {simResult?.narrative || 
               `Under these hypothetical parameters, you unlock ${simResult?.unlockedSchemes?.length || 0} additional scheme pathways. Udyam formalization provides immediate credit guarantee cover, improving banker confidence from preliminary to high priority.`}
            </p>
          </div>

          {/* Unlocked Schemes List */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '1.4rem',
            backdropFilter: 'blur(16px)',
            flex: 1,
          }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="#10b981" />
              <span>Newly Unlocked Schemes ({simResult?.unlockedSchemes?.length || 0})</span>
            </h4>

            {(!simResult?.unlockedSchemes || simResult.unlockedSchemes.length === 0) ? (
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic', padding: '10px 0' }}>
                No newly unlocked schemes under current slider values. Try toggling Udyam registration or rural location!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {simResult.unlockedSchemes.map((s, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '10px 12px',
                      background: 'rgba(16, 185, 129, 0.08)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      borderRadius: '10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f8fafc' }}>{s.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#10b981' }}>{s.reason || 'Criteria satisfied'}</div>
                    </div>
                    <CitationFootnote citation={s.citation} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhatIfLab;
