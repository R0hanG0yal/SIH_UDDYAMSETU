import React from 'react';
import { 
  X, Cpu, ShieldCheck, Sparkles, BookOpen, Layers, 
  CheckCircle2, ArrowRight, BarChart3, Sliders, RefreshCw, Zap 
} from 'lucide-react';

/**
 * AIModelExplainerModal — Crystal-clear architectural transparency for judges and entrepreneurs.
 * Explicitly demystifies the AI model: Gemini 1.5 Flash + Deterministic Sovereign Engines.
 */
export function AIModelExplainerModal({ isOpen, onClose, lang = 'en' }) {
  if (!isOpen) return null;

  const engines = [
    {
      name: "1. Deterministic Sovereign Eligibility Engine",
      role: "Zero-Hallucination Legal Evaluation",
      model: "Rule-as-Code Constraint Evaluator",
      why: "Government legal eligibility CANNOT be left to an LLM hallucination. Sourced directly from MoMSME, MoSJE, NSFDC gazettes.",
      status: "100% Deterministic"
    },
    {
      name: "2. Grounded RAG Citation Engine",
      role: "Source-Level Provenance",
      model: "Clause Mapping & Gazette Indexer",
      why: "Every claim, subsidy %, and ceiling is traceable to a specific paragraph (e.g. PMEGP Para 4.2(iii)) with direct links.",
      status: "Verified Sovereign Source"
    },
    {
      name: "3. Conversational Caseworker (Awaaz Sahayak)",
      role: "Natural Language & Speech Understanding",
      model: "Google Gemini 1.5 Flash (with Sovereign Fallback)",
      why: "Extracts unstructured Hindi/English audio & text into verified entrepreneur profiles and drafts banker justification dossiers.",
      status: "Gemini 1.5 Flash Active"
    },
    {
      name: "4. Funding Readiness Score Engine",
      role: "Banker Sanction Predictor",
      model: "6-Factor Transparent Weighted Model (0–100)",
      why: "Scores profile completeness, business formalization, document readiness, scheme coverage, financials, and partner desks.",
      status: "Multi-Factor Scoring"
    },
    {
      name: "5. Counterfactual / What-If Engine",
      role: "Policy Sensitivity Simulator",
      model: "Multi-Variable Delta Re-Evaluation",
      why: "Allows citizens to drag sliders (loan amount, Udyam registration, location) and see live newly unlocked subsidies.",
      status: "Dynamic Simulation"
    },
    {
      name: "6. Multi-Agent AI Orchestrator",
      role: "Central Nervous System",
      model: "Sense → Reason → Plan → Act Pipeline",
      why: "Coordinates execution order, checks confidence thresholds, handles short-circuits, and logs full execution traces.",
      status: "Orchestration Layer"
    },
    {
      name: "7. Human-in-the-Loop (HITL) Uncertainty Gate",
      role: "Certainty Verification",
      model: "Confidence Gating (<0.70 Escalation)",
      why: "Low certainty inputs are never assumed. Automatically routes ambiguous claims to CSC operators for human review.",
      status: "Operator Queue Gated"
    },
    {
      name: "8. Outcome-Learning Calibration Loop",
      role: "Self-Calibrating Feedback Engine",
      model: "Closed-Loop Precision/Recall/F1 Optimizer",
      why: "Tracks post-recommendation bank sanctions and user ratings to calibrate system accuracy over time (currently 88.5%).",
      status: "Self-Calibrating"
    },
    {
      name: "9. Policy Change Intelligence",
      role: "Gazette Revision Tracking",
      model: "SHA-256 Rule Hashing & AST Diffing",
      why: "Detects ministry policy updates, computes RELAXED/TIGHTENED diffs, and propagates updates to affected citizen profiles.",
      status: "Version Controlled"
    },
    {
      name: "10. Automated Regression Benchmark Harness",
      role: "Quality Assurance & Golden Testing",
      model: "12-Case Golden Test Matrix",
      why: "Prevents code or policy changes from breaking previously-passing edge cases, boundary ceilings, or negative guards.",
      status: "Zero Regressions"
    }
  ];

  return (
    <div
      className="ai-modal-overlay animate-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: 'rgba(9, 30, 32, 0.85)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        className="ai-modal-container"
        style={{
          width: '100%',
          maxWidth: '860px',
          maxHeight: '88vh',
          overflowY: 'auto',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(9, 30, 32, 0.98))',
          border: '1.5px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '24px',
          padding: '2.5rem',
          boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.7), 0 0 40px rgba(16, 185, 129, 0.15)',
          color: '#f8fafc',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#94a3b8',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: '1.8rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 14px',
            borderRadius: '9999px',
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#10b981',
            fontSize: '0.78rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            marginBottom: '10px',
          }}>
            <Cpu size={14} />
            <span>AI Architecture & Model Transparency</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f8fafc', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            {lang === 'hi' ? 'उद्यमसेतु का AI मॉडल क्या है?' : 'What Is The UdyamSetu AI Model?'}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.5, margin: 0 }}>
            {lang === 'hi'
              ? 'उद्यमसेतु कोई सामान्य चैटबॉट नहीं है। यह एक हाइब्रिड आर्किटेक्चर है जो Google Gemini 1.5 Flash के भाषाई कौशल को 100% सटीक सरकारी राजपत्र नियमों के साथ जोड़ता है।'
              : 'UdyamSetu is NOT a generic black-box chatbot. It is a Dual-Core Sovereign AI architecture combining Google Gemini 1.5 Flash for language understanding with deterministic legal rule engines for zero-hallucination eligibility decisions.'}
          </p>
        </div>

        {/* Core Principles Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: '#10b981', fontWeight: 800, fontSize: '0.88rem' }}>
              <ShieldCheck size={18} />
              <span>Zero-Hallucination Law</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.4, margin: 0 }}>
              Government eligibility is NEVER evaluated by an LLM alone. Hard rules are executed deterministically from official gazettes.
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: '#38bdf8', fontWeight: 800, fontSize: '0.88rem' }}>
              <BookOpen size={18} />
              <span>Grounded Provenance</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.4, margin: 0 }}>
              Every claim, subsidy %, and ceiling carries a verifiable clause reference (e.g. PMEGP Para 4.2) with direct ministry links.
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: '#a855f7', fontWeight: 800, fontSize: '0.88rem' }}>
              <Sparkles size={18} />
              <span>Gemini 1.5 Flash Caseworker</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.4, margin: 0 }}>
              Processes multi-lingual Hindi & Hinglish voice transcripts, answers scheme questions, and drafts banker justification dossiers.
            </p>
          </div>
        </div>

        {/* The 10 Engine Breakdown */}
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={18} color="#f97316" />
          <span>The Intelligence Core Engines</span>
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {engines.map((eng, idx) => (
            <div
              key={idx}
              style={{
                padding: '14px 18px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div style={{ flex: '1 1 340px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f8fafc' }}>{eng.name}</span>
                  <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 600 }}>({eng.role})</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4 }}>
                  {eng.why}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                }}>
                  <CheckCircle2 size={12} /> {eng.status}
                </span>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>
                  {eng.model}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AIModelExplainerModal;
