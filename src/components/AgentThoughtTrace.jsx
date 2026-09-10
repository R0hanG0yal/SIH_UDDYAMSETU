import React, { useState } from 'react';
import { Sparkles, Brain, Cpu, CheckCircle2, ChevronDown, ChevronUp, Clock, ShieldCheck, Zap } from 'lucide-react';

export function AgentThoughtTrace({ trace = [], executionTimeMs = 18, isProcessing = false, lang = 'hi' }) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!trace || trace.length === 0) return null;

  const stageIcons = {
    SENSE: <Sparkles size={16} color="#0284c7" />,
    REASON: <Brain size={16} color="#7c3aed" />,
    PLAN: <Cpu size={16} color="#ea580c" />,
    ACT: <ShieldCheck size={16} color="#059669" />
  };

  const stageColors = {
    SENSE: '#0284c7',
    REASON: '#7c3aed',
    PLAN: '#ea580c',
    ACT: '#059669'
  };

  return (
    <div 
      className="agent-trace-container animate-fade-in"
      style={{
        margin: '1.25rem 0',
        background: 'linear-gradient(135deg, #0b192c 0%, #1e293b 100%)',
        borderRadius: '16px',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 0 15px 0 rgba(56, 189, 248, 0.15)',
        overflow: 'hidden',
        color: '#f8fafc'
      }}
    >
      {/* Header bar */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem 1.25rem',
          borderBottom: isExpanded ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
          background: 'rgba(255, 255, 255, 0.03)',
          cursor: 'pointer'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div 
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 10px rgba(56, 189, 248, 0.5)'
            }}
          >
            <Brain size={16} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: '800', fontSize: '0.92rem', letterSpacing: '0.02em', color: '#38bdf8' }}>
                {lang === 'hi' ? 'एजेंटिक AI तर्क श्रृंखला (Thought Trace)' : 'Agentic AI Reasoning Chain'}
              </span>
              <span 
                style={{
                  fontSize: '0.68rem',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '999px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <Zap size={10} />
                <span>AUTONOMOUS</span>
              </span>
            </div>
            <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: 0 }}>
              {lang === 'hi' 
                ? '4-एजेंट स्वायत्त पाइपलाइन: संज्ञान (Sense) ➔ विचार (Reason) ➔ योजना (Plan) ➔ क्रिया (Act)' 
                : '4-Agent Pipeline: Sense ➔ Reason ➔ Plan ➔ Act'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {executionTimeMs && (
            <span style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Clock size={12} />
              <span>{executionTimeMs}ms</span>
            </span>
          )}
          <button 
            type="button" 
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
            aria-label="Toggle agent trace"
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Trace Body */}
      {isExpanded && (
        <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {trace.map((step, idx) => {
            const color = stageColors[step.stage] || '#38bdf8';
            const icon = stageIcons[step.stage] || <Sparkles size={14} color={color} />;

            return (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.85rem',
                  position: 'relative'
                }}
              >
                {/* Timeline connector dot */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '0.15rem' }}>
                  <div 
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: `1.5px solid ${color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {icon}
                  </div>
                  {idx < trace.length - 1 && (
                    <div style={{ width: '2px', height: '24px', background: 'rgba(255, 255, 255, 0.1)', marginTop: '0.25rem' }} />
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.78rem', color: color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      [{step.stage}] {step.agent}
                    </span>
                    <CheckCircle2 size={12} color="#10b981" />
                  </div>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#e2e8f0', lineHeight: '1.4' }}>
                    {step.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
