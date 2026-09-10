import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Sparkles, ShieldCheck, ArrowRight, ExternalLink, Gift, Clock, Wrench, FileCheck2, ChevronDown, ChevronUp, Layers, FileText, Bot, X } from 'lucide-react';
import { fetchStackedSubsidies } from '../services/api';
import { CitationFootnote } from './CitationFootnote';
import { FeedbackWidget } from './FeedbackWidget';

export function SchemeMatchView({ matchEvaluation, profile, onSelectSchemeAndProceed, lang = 'en' }) {
  const [selectedSchemeId, setSelectedSchemeId] = useState(null);
  const [expandedDetailsMap, setExpandedDetailsMap] = useState({});
  const [showIneligibleSection, setShowIneligibleSection] = useState(false);
  const [expandedBridgeId, setExpandedBridgeId] = useState(null);
  const [stackedData, setStackedData] = useState(null);
  const [showDossierModal, setShowDossierModal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetchStackedSubsidies(profile || {})
      .then(data => {
        if (isMounted && data.status === 'SUCCESS') {
          setStackedData(data);
        }
      })
      .catch(err => console.warn('[AI Subsidy Stacking Error]:', err));
    return () => { isMounted = false; };
  }, [profile]);

  const evaluation = matchEvaluation || {
    matchedSchemes: [],
    nearFitSchemes: [],
    ineligibleSchemes: [],
    bridgeRoadmaps: []
  };

  const { matchedSchemes, nearFitSchemes, ineligibleSchemes, bridgeRoadmaps } = evaluation;

  // Default select first (highest benefit) scheme
  const currentSelectedScheme = matchedSchemes.find(s => s.id === selectedSchemeId) || matchedSchemes[0];

  const toggleDetails = (schemeId, e) => {
    e.stopPropagation();
    setExpandedDetailsMap(prev => ({ ...prev, [schemeId]: !prev[schemeId] }));
  };

  const t = {
    en: {
      matchTitle: "Schemes You Qualify For — AI Eligibility Analysis",
      matchSubtitle: "Evaluated against published guidelines from MoSJE/NSFDC, MoMSME, MoF, and MoHUA. Higher subsidies for SC/ST/OBC/Minority/PWD applicants.",
      subsidyBadge: "Direct Capital Cash Grant",
      toolBadge: "Free Tool Kit Grant",
      whyMatched: "Policy Rules Passed:",
      bridgeTitle: "Bridge to Eligibility: How to Unlock Higher Subsidies",
      bridgeSubtitle: "Actionable, zero-cost steps to elevate your enterprise into higher capital grant tiers.",
      ineligibleTitle: "Other Schemes Outside Current Project Scope",
      proceedBtn: "Configure Repayment Schedule with",
      showDetailsBtn: "Show Complete Policy Details",
      hideDetailsBtn: "Hide Details"
    },
    hi: {
      matchTitle: "योजनाएं जिनके लिए आप पात्र हैं — AI पात्रता विश्लेषण",
      matchSubtitle: "MoSJE/NSFDC, MoMSME, वित्त मंत्रालय व आवास मंत्रालय की प्रकाशित नियमावलियों के आधार पर। SC/ST/OBC/अल्पसंख्यक/PWD हेतु विशेष सब्सिडी।",
      subsidyBadge: "सीधा गैर-वापसी अनुदान",
      toolBadge: "मुफ्त टूलकिट अनुदान",
      whyMatched: "सत्यापित पात्रता नियम:",
      bridgeTitle: "पात्रता विस्तार: बड़ी सब्सिडी व योजनाएं कैसे प्राप्त करें?",
      bridgeSubtitle: "सरल, निःशुल्क कदम जिनके द्वारा आप 35% तक का अनुदान व 5% ब्याज दर प्राप्त कर सकते हैं।",
      ineligibleTitle: "अन्य योजनाएं जो वर्तमान प्रोजेक्ट में उपयुक्त नहीं हैं",
      proceedBtn: "किस्त योजना व मोरेटोरियम देखें:",
      showDetailsBtn: "विस्तृत नीति नियम देखें",
      hideDetailsBtn: "विवरण छिपाएं"
    }
  }[lang === 'hi' ? 'hi' : 'en'];

  return (
    <div className="liquid-glass-card animate-fade-in" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
      {/* Top Ministry Ribbon */}
      <div style={{
        background: 'rgba(9, 30, 32, 0.95)',
        color: '#ffffff',
        padding: '0.85rem 1.25rem',
        borderRadius: '12px',
        marginBottom: '1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        fontSize: '0.82rem',
        border: '1px solid rgba(255, 255, 255, 0.12)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={18} color="#10b981" />
          <span><strong>National Credit Gateway:</strong> Multi-Scheme Rule Engine v2.0 • <strong>{matchedSchemes.length} Running Schemes Qualified</strong></span>
        </div>
        <div style={{ color: '#cbd5e1' }}>
          Project Valuation: <strong>₹{Number(profile?.projectCost || 100000).toLocaleString('en-IN')}</strong> • Universal Non-Discriminatory Rule
        </div>
      </div>

      {/* AI SUBSIDY STACKING & BENEFIT MAXIMIZER CARD */}
      {stackedData && stackedData.stackedBenefits && (
        <div 
          className="ai-subsidy-card animate-fade-in"
          style={{
            marginBottom: '2rem',
            padding: '1.5rem',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #0b192c 0%, #164e63 100%)',
            color: '#ffffff',
            boxShadow: '0 12px 30px rgba(11, 25, 44, 0.25)',
            border: '1px solid rgba(56, 189, 248, 0.3)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #ff6f1e, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Layers size={20} color="#ffffff" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '900', color: '#ffffff' }}>
                    {lang === 'hi' ? 'AI सब्सिडी स्टैकिंग व लाभ अधिकतमकरण' : 'AI Subsidy Stacking & Benefit Maximizer'}
                  </h3>
                  <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.25)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.5)', fontWeight: '800' }}>
                    AUTONOMOUS BENEFIT STACK
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>
                  {lang === 'hi' ? 'PMEGP, NSFDC व PM-विश्वकर्मा के संयुक्त अनुदान का स्वचालित मिलान' : 'Multi-scheme grant stacking: PMEGP Capital Subsidy + PM Vishwakarma Toolkit'}
                </p>
              </div>
            </div>

            <button 
              type="button"
              onClick={() => setShowDossierModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 1rem',
                borderRadius: '10px',
                background: '#ff6f1e',
                color: '#ffffff',
                border: 'none',
                fontWeight: '700',
                fontSize: '0.84rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(255, 111, 30, 0.35)'
              }}
            >
              <FileText size={16} />
              <span>{lang === 'hi' ? 'बैंक प्रबंधक अनुशंसा पत्र (Dossier)' : 'Bank Manager Justification Dossier'}</span>
            </button>
          </div>

          {/* 3 Metric Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '700' }}>
                {lang === 'hi' ? 'सीधा गैर-वापसी नकद अनुदान' : 'Non-Repayable Cash Grant'}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#34d399', marginTop: '0.2rem' }}>
                ₹{stackedData.stackedBenefits.totalDirectGrant.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '0.25rem' }}>
                {lang === 'hi' ? 'ऋण खाते में सीधी सरकारी सब्सिडी जमा' : 'Direct Margin Money Deposit'}
              </div>
            </div>

            <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '700' }}>
                {lang === 'hi' ? 'वार्षिक ब्याज बचत' : 'Annual Interest Saved'}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#38bdf8', marginTop: '0.2rem' }}>
                ₹{stackedData.stackedBenefits.annualInterestSaved.toLocaleString('en-IN')}<span style={{ fontSize: '0.85rem', fontWeight: '600' }}>/yr</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '0.25rem' }}>
                {stackedData.stackedBenefits.effectiveInterestRate}% {lang === 'hi' ? 'रियायती दर (बाजार दर 12.5% के विरुद्ध)' : 'Concessional vs 12.5% Commercial'}
              </div>
            </div>

            <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '700' }}>
                {lang === 'hi' ? '5-वर्षीय संचयी लाभ' : '5-Year Cumulative Advantage'}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#f59e0b', marginTop: '0.2rem' }}>
                ₹{stackedData.stackedBenefits.netBenefitOver5Years.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '0.25rem' }}>
                {lang === 'hi' ? 'अनुदान + ब्याज अंतर का कुल फायदा' : 'Grant + Interest differential total'}
              </div>
            </div>
          </div>

          {/* Stacking Breakdown Steps */}
          {stackedData.stackedBenefits.stackSteps && stackedData.stackedBenefits.stackSteps.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '0.85rem' }}>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>
                {lang === 'hi' ? 'स्टैकिंग घटक (Stacked Components):' : 'Stacked Components:'}
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                {stackedData.stackedBenefits.stackSteps.map((step, idx) => (
                  <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '0.4rem 0.75rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#34d399', fontWeight: '800' }}>+₹{step.amount.toLocaleString('en-IN')}</span>
                    <span style={{ color: '#f8fafc' }}>{step.scheme}</span>
                    <span style={{ color: '#94a3b8', fontSize: '0.72rem' }}>({step.type})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* BANKER JUSTIFICATION DOSSIER MODAL */}
      {showDossierModal && stackedData && stackedData.bankerDossier && (
        <div 
          className="ai-modal-overlay animate-fade-in"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
        >
          <div 
            style={{
              width: '100%',
              maxWidth: '680px',
              maxHeight: '85vh',
              overflowY: 'auto',
              background: '#ffffff',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
              border: '1.5px solid #cbd5e1',
              color: '#0f172a'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1.5px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <ShieldCheck size={26} color="#0f393b" />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '900', color: '#0f393b' }}>
                    Official Banker Recommendation Dossier
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Prepared autonomously by SAARTHI AI for Lead District Manager / Bank Branch
                  </span>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setShowDossierModal(false)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={18} color="#475569" />
              </button>
            </div>

            <div style={{ fontSize: '0.88rem', lineHeight: '1.6', color: '#334155' }}>
              <p style={{ margin: '0 0 0.5rem', fontWeight: '700', color: '#64748b', fontSize: '0.8rem' }}>
                Date: {stackedData.bankerDossier.date}
              </p>
              <p style={{ margin: '0 0 0.75rem', fontWeight: '700' }}>
                {stackedData.bankerDossier.salutation}
              </p>
              <div style={{ padding: '0.65rem 0.85rem', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #ff6f1e', marginBottom: '1rem', fontWeight: '700', color: '#0f393b' }}>
                Subject: {stackedData.bankerDossier.subject}
              </div>

              <p style={{ marginBottom: '0.85rem' }}>
                {stackedData.bankerDossier.applicantSummary}
              </p>

              <p style={{ marginBottom: '0.85rem' }}>
                {stackedData.bankerDossier.statutoryBacking}
              </p>

              <div style={{ margin: '1rem 0', padding: '0.85rem', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                <div style={{ fontWeight: '800', color: '#166534', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                  Risk Mitigation & Guarantee Parameters:
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#15803d' }}>
                  {stackedData.bankerDossier.riskMitigation.map((risk, rIdx) => (
                    <li key={rIdx} style={{ marginBottom: '0.25rem' }}>{risk}</li>
                  ))}
                </ul>
              </div>

              <p style={{ fontWeight: '700', color: '#0f393b', marginTop: '1rem' }}>
                Recommended Action: {stackedData.bankerDossier.recommendedAction}
              </p>
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button 
                type="button"
                onClick={() => {
                  window.print();
                }}
                style={{ padding: '0.55rem 1.25rem', borderRadius: '8px', background: '#0f393b', color: '#ffffff', border: 'none', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Print / Save PDF Dossier
              </button>
              <button 
                type="button"
                onClick={() => setShowDossierModal(false)}
                style={{ padding: '0.55rem 1rem', borderRadius: '8px', background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. DIRECT MATCHES SECTION */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.45rem', fontWeight: '900', color: 'var(--brand-navy)' }}>
            {t.matchTitle}
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', marginTop: '0.2rem' }}>
            {t.matchSubtitle}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {matchedSchemes.map((scheme, index) => {
            const isSelected = (currentSelectedScheme?.id === scheme.id);
            const isExpanded = !!expandedDetailsMap[scheme.id];

            return (
              <div
                key={scheme.id}
                onClick={() => setSelectedSchemeId(scheme.id)}
                onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') setSelectedSchemeId(scheme.id); }}
                tabIndex={0}
                role="button"
                aria-pressed={isSelected}
                aria-expanded={isExpanded}
                style={{
                  border: isSelected ? '2px solid var(--brand-teal)' : '1px solid var(--glass-border)',
                  background: isSelected ? 'rgba(240, 253, 250, 0.95)' : 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  boxShadow: isSelected ? '0 10px 28px rgba(15, 52, 54, 0.15)' : '0 2px 8px rgba(0,0,0,0.03)',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative'
                }}
              >
                {/* Highest Benefit Ribbon */}
                {index === 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '20px',
                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '9999px',
                    boxShadow: '0 2px 6px rgba(249, 115, 22, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}>
                    <Sparkles size={12} /> HIGHEST DIRECT GRANT FIT
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginTop: index === 0 ? '0.35rem' : 0 }}>
                  <div style={{ flex: '1 1 320px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span className="badge-status badge-green">
                        <CheckCircle2 size={13} /> Direct Match
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: '600' }}>
                        {scheme.ministry}
                      </span>
                      <CitationFootnote citation={scheme.citation} />
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--brand-navy)', marginTop: '0.35rem' }}>
                      {lang === 'hi' ? (scheme.nameHindi || scheme.name) : scheme.name}
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--brand-teal)', fontWeight: '600', marginTop: '0.15rem' }}>
                      Code: {scheme.code} • Portal: <a href={scheme.portalUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} style={{ color: 'var(--brand-teal)' }}>{new URL(scheme.portalUrl).hostname} <ExternalLink size={12} style={{ display: 'inline' }} /></a>
                    </div>

                    <p style={{ fontSize: '0.88rem', color: 'var(--slate-700)', marginTop: '0.5rem', lineHeight: 1.45 }}>
                      {lang === 'hi' ? (scheme.summaryHindi || scheme.summary) : scheme.summary}
                    </p>
                  </div>

                  {/* High-Impact Financial Badge */}
                  <div style={{ textAlign: 'right', minWidth: '180px' }}>
                    {scheme.directSubsidyAmount > 0 ? (
                      <div style={{
                        background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
                        border: '1.5px solid #10b981',
                        borderRadius: '12px',
                        padding: '0.65rem 1rem',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)'
                      }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#065f46', textTransform: 'uppercase' }}>
                          {t.subsidyBadge}
                        </div>
                        <div style={{ fontSize: '1.35rem', fontWeight: '900', color: '#047857', marginTop: '0.1rem' }}>
                          ₹{scheme.directSubsidyAmount.toLocaleString('en-IN')}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#065f46', fontWeight: '600' }}>
                          {scheme.directSubsidyPercent}% Non-Repayable Grant
                        </div>
                      </div>
                    ) : (
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.85)',
                        border: '1px solid var(--slate-300)',
                        borderRadius: '12px',
                        padding: '0.65rem 1rem'
                      }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: '700' }}>
                          Effective Rate
                        </div>
                        <div style={{ fontSize: '1.35rem', fontWeight: '900', color: 'var(--brand-navy)' }}>
                          {scheme.effectiveInterestRate}% p.a.
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--emerald-dark)', fontWeight: '700' }}>
                          100% Collateral-Free
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Key Numbers Bar */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '0.75rem',
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid rgba(203, 213, 225, 0.6)'
                }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>Eligible Loan</span>
                    <div style={{ fontWeight: '800', color: 'var(--brand-navy)', fontSize: '0.95rem' }}>
                      ₹{Math.round(scheme.eligibleFunding || (profile?.projectCost * 0.9)).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>Own Margin (Equity)</span>
                    <div style={{ fontWeight: '800', color: '#ea580c', fontSize: '0.95rem' }}>
                      ₹{Math.round(scheme.ownEquity || (profile?.projectCost * 0.1)).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>Grace Moratorium</span>
                    <div style={{ fontWeight: '800', color: '#2563eb', fontSize: '0.95rem' }}>
                      {scheme.moratoriumMonths || 3} Months Holiday
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>Collateral Security</span>
                    <div style={{ fontWeight: '800', color: '#047857', fontSize: '0.95rem' }}>
                      Zero (Waived by GoI)
                    </div>
                  </div>
                </div>

                {/* Progressive Disclosure Toggle */}
                <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={(e) => toggleDetails(scheme.id, e)}
                    className="details-toggle-btn"
                  >
                    {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    {isExpanded ? t.hideDetailsBtn : t.showDetailsBtn}
                  </button>
                </div>

                {/* Collapsible Complete Policy Rules */}
                {isExpanded && (
                  <div style={{
                    marginTop: '0.75rem',
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '10px',
                    border: '1px solid rgba(203, 213, 225, 0.8)',
                    fontSize: '0.82rem'
                  }}>
                    <strong style={{ color: 'var(--brand-navy)', display: 'block', marginBottom: '0.35rem' }}>
                      {t.whyMatched}
                    </strong>
                    <ul style={{ paddingLeft: '1.25rem', color: 'var(--slate-700)', lineHeight: 1.5 }}>
                      {(scheme.passedRules || []).map((rule, rIdx) => (
                        <li key={rIdx}>{rule}</li>
                      ))}
                    </ul>

                    {scheme.requiredDocuments && (
                      <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed #cbd5e1' }}>
                        <strong style={{ color: 'var(--brand-navy)', display: 'block', marginBottom: '0.25rem' }}>
                          Required Documentation Checklist:
                        </strong>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          {scheme.requiredDocuments.map(doc => (
                            <span key={doc.id} style={{ background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', color: '#334155' }}>
                              ✓ {doc.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <FeedbackWidget schemeId={scheme.id} compact={true} lang={lang} />
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. BRIDGE TO ELIGIBILITY ROADMAP */}
      {bridgeRoadmaps && bridgeRoadmaps.length > 0 && (
        <div style={{
          background: 'rgba(254, 243, 199, 0.5)',
          backdropFilter: 'blur(16px)',
          border: '1.5px solid #fcd34d',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '2.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <Sparkles size={20} color="#d97706" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#92400e' }}>
              {t.bridgeTitle}
            </h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#78350f', marginBottom: '1.25rem' }}>
            {t.bridgeSubtitle}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {bridgeRoadmaps.map((road) => {
              const isRoadExpanded = expandedBridgeId === road.schemeId;

              return (
                <div key={road.schemeId} style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #fde68a', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#b45309', textTransform: 'uppercase' }}>
                        Target: {road.targetBenefit}
                      </span>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#091e20' }}>
                        {road.schemeName}
                      </h4>
                    </div>

                    <button
                      onClick={() => setExpandedBridgeId(isRoadExpanded ? null : road.schemeId)}
                      className="details-toggle-btn"
                    >
                      {isRoadExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      {isRoadExpanded ? "Hide Steps" : "View Action Steps"}
                    </button>
                  </div>

                  {isRoadExpanded && (
                    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {road.actionableSteps.map((step, sIdx) => (
                        <div key={sIdx} style={{ background: '#fefce8', padding: '0.85rem', borderRadius: '8px', border: '1px solid #fef08a' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                            <strong style={{ fontSize: '0.86rem', color: '#854d0e' }}>{step.actionTitle}</strong>
                            <span style={{ fontSize: '0.72rem', background: '#ecfdf5', color: '#065f46', padding: '0.1rem 0.45rem', borderRadius: '4px', fontWeight: '700' }}>
                              {step.cost} • {step.timeToComplete}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.82rem', color: '#713f12', lineHeight: 1.45, marginBottom: '0.5rem' }}>
                            {step.actionDetail}
                          </p>
                          {step.externalLink && (
                            <a href={step.externalLink} target="_blank" rel="noreferrer" style={{ fontSize: '0.78rem', color: '#d97706', fontWeight: '700', textDecoration: 'underline' }}>
                              Official Portal Link →
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. INELIGIBLE SCHEMES (COLLAPSIBLE DISCLOSURE) */}
      {ineligibleSchemes && ineligibleSchemes.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => setShowIneligibleSection(!showIneligibleSection)}
            className="details-toggle-btn"
            style={{ marginBottom: '1rem' }}
          >
            {showIneligibleSection ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {showIneligibleSection ? "Hide Schemes Outside Scope" : `${t.ineligibleTitle} (${ineligibleSchemes.length})`}
          </button>

          {showIneligibleSection && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {ineligibleSchemes.map((item) => (
                <div key={item.id} style={{ background: '#ffffff', border: '1px solid var(--slate-200)', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.92rem', color: 'var(--brand-navy)' }}>{item.name}</strong>
                    <span className="badge-status badge-grey">Out of Current Scope</span>
                  </div>
                  <ul style={{ paddingLeft: '1.25rem', marginTop: '0.4rem', fontSize: '0.8rem', color: 'var(--slate-600)' }}>
                    {(item.failedRules || []).map((f, fi) => (
                      <li key={fi}>{f}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bottom Sticky Action Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid rgba(203, 213, 225, 0.6)'
      }}>
        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>Selected Scheme for Bank Routing:</div>
          <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--brand-navy)' }}>
            {lang === 'hi' ? (currentSelectedScheme?.nameHindi || currentSelectedScheme?.name) : currentSelectedScheme?.name}
          </div>
        </div>

        <button
          onClick={() => onSelectSchemeAndProceed(currentSelectedScheme)}
          className="btn-accent-saffron"
          id="proceed-to-repayment-btn"
          style={{ fontSize: '0.98rem' }}
        >
          <span>{t.proceedBtn} {currentSelectedScheme?.code}</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
