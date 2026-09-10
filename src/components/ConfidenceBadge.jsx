import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, HelpCircle, ShieldAlert } from 'lucide-react';

/**
 * ConfidenceBadge — Human-in-the-loop confidence visualizer
 * Displays field-level and decision-level confidence tiers (Auto-Approve, Soft Flag, Ask User, HITL)
 */
export function ConfidenceBadge({ confidence = 1.0, source = 'USER_DECLARED', label = null }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const confNum = Number(confidence) || 1.0;
  
  let tier = 'HIGH';
  let tierLabel = 'Auto-Approved';
  let color = '#10b981';
  let bg = 'rgba(16, 185, 129, 0.12)';
  let border = 'rgba(16, 185, 129, 0.3)';
  let Icon = CheckCircle2;

  if (confNum >= 0.9) {
    tier = 'HIGH';
    tierLabel = 'Confidence ≥ 90%';
    color = '#10b981';
    bg = 'rgba(16, 185, 129, 0.12)';
    border = 'rgba(16, 185, 129, 0.3)';
    Icon = CheckCircle2;
  } else if (confNum >= 0.7) {
    tier = 'MEDIUM';
    tierLabel = 'Verify Info (70-89%)';
    color = '#f59e0b';
    bg = 'rgba(245, 158, 11, 0.12)';
    border = 'rgba(245, 158, 11, 0.3)';
    Icon = AlertTriangle;
  } else {
    tier = 'LOW';
    tierLabel = 'Needs Confirmation (<70%)';
    color = '#ef4444';
    bg = 'rgba(239, 68, 68, 0.12)';
    border = 'rgba(239, 68, 68, 0.3)';
    Icon = HelpCircle;
  }

  return (
    <span
      className="confidence-badge-container"
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '2px 8px',
          borderRadius: '9999px',
          fontSize: '0.7rem',
          fontWeight: 600,
          background: bg,
          color: color,
          border: `1px solid ${border}`,
          cursor: 'help',
        }}
      >
        <Icon size={11} />
        <span>{label || `${Math.round(confNum * 100)}% Conf`}</span>
      </span>

      {showTooltip && (
        <div
          style={{
            position: 'absolute',
            bottom: '120%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            width: '220px',
            padding: '8px 12px',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            color: '#f8fafc',
            fontSize: '0.72rem',
            lineHeight: 1.4,
            pointerEvents: 'none',
          }}
        >
          <div style={{ fontWeight: 700, color, marginBottom: '2px' }}>{tierLabel}</div>
          <div style={{ color: '#cbd5e1' }}>
            Source: <strong>{source.replace(/_/g, ' ')}</strong>
          </div>
          <div style={{ color: '#94a3b8', marginTop: '4px', fontSize: '0.68rem' }}>
            {tier === 'HIGH' ? 'Deterministic verified input. Safe for automated sovereign routing.' :
             tier === 'MEDIUM' ? 'AI-inferred or self-declared. Double check with citizen.' :
             'Low certainty. Flagged for human officer review (HITL).'}
          </div>
        </div>
      )}
    </span>
  );
}

export default ConfidenceBadge;
