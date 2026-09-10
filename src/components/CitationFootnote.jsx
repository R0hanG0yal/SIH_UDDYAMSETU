import React, { useState } from 'react';
import { BookOpen, ExternalLink, ShieldCheck, AlertCircle, Info, Sparkles } from 'lucide-react';

/**
 * CitationFootnote — Grounded RAG Provenance Indicator
 * Every scheme requirement, subsidy calculation, or AI narrative carries
 * verified source-level citations directly linking to published government guidelines.
 */
export function CitationFootnote({ citation, claimText = null, label = null }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!citation) return null;

  const provenance = citation.verification_status || citation.provenance || 'VERIFIED_FROM_PUBLISHED_GUIDELINE';
  
  const isVerified = provenance.includes('VERIFIED');
  const isAi = provenance.includes('AI');

  const badgeColor = isVerified 
    ? 'rgba(16, 185, 129, 0.15)' 
    : isAi 
      ? 'rgba(168, 85, 247, 0.15)' 
      : 'rgba(245, 158, 11, 0.15)';

  const textColor = isVerified 
    ? '#10b981' 
    : isAi 
      ? '#c084fc' 
      : '#f59e0b';

  const borderColor = isVerified
    ? 'rgba(16, 185, 129, 0.3)'
    : isAi
      ? 'rgba(168, 85, 247, 0.3)'
      : 'rgba(245, 158, 11, 0.3)';

  return (
    <span className="citation-footnote-wrapper" style={{ display: 'inline-flex', alignItems: 'center', margin: '0 4px', position: 'relative' }}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        title="View Official Source Citation"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '2px 7px',
          fontSize: '0.72rem',
          fontWeight: 600,
          borderRadius: '9999px',
          background: badgeColor,
          color: textColor,
          border: `1px solid ${borderColor}`,
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          backdropFilter: 'blur(8px)',
          verticalAlign: 'middle',
        }}
      >
        {isVerified ? <ShieldCheck size={11} /> : isAi ? <Sparkles size={11} /> : <Info size={11} />}
        <span>{label || (citation.source_paragraph ? citation.source_paragraph.split(',')[0] : 'Govt Citation')}</span>
      </button>

      {isOpen && (
        <div
          className="citation-popover"
          style={{
            position: 'absolute',
            bottom: '125%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            width: '320px',
            maxWidth: '90vw',
            padding: '14px 16px',
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '12px',
            boxShadow: '0 20px 35px -5px rgba(0, 0, 0, 0.6), 0 0 15px rgba(16, 185, 129, 0.15)',
            color: '#f8fafc',
            fontSize: '0.8rem',
            textAlign: 'left',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '6px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: textColor }}>
              {isVerified ? <ShieldCheck size={14} /> : <AlertCircle size={14} />}
              {isVerified ? 'VERIFIED POLICY PROVENANCE' : 'AI-INFERRED CLAIM'}
            </span>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1 }}
            >
              &times;
            </button>
          </div>

          {claimText && (
            <div style={{ fontStyle: 'italic', color: '#cbd5e1', marginBottom: '8px', padding: '6px 8px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', borderLeft: `2px solid ${textColor}` }}>
              "{claimText}"
            </div>
          )}

          <div style={{ marginBottom: '6px' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.05em' }}>Source Document</div>
            <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{citation.source_document || citation.document || 'Official Scheme Operational Guidelines'}</div>
          </div>

          {citation.source_paragraph && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.05em' }}>Clause / Paragraph</div>
              <div style={{ color: '#e2e8f0', fontSize: '0.76rem' }}>{citation.source_paragraph}</div>
            </div>
          )}

          {citation.last_verified_at && (
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '10px' }}>
              Last Verified: <strong style={{ color: '#10b981' }}>{citation.last_verified_at}</strong>
            </div>
          )}

          {citation.source_url && (
            <a
              href={citation.source_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                textDecoration: 'none',
                width: '100%',
                justifyContent: 'center',
                transition: 'background 0.2s',
              }}
            >
              <BookOpen size={12} />
              <span>Verify at Official Ministry Portal</span>
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      )}
    </span>
  );
}

export default CitationFootnote;
