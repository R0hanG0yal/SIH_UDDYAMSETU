import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { submitFeedbackApi } from '../services/api';

/**
 * FeedbackWidget — Outcome-Learning feedback collector
 * Closes the loop on recommendation quality, bank approvals, and document audits.
 */
export function FeedbackWidget({
  schemeId = null,
  profileId = 'anonymous',
  recommendationId = null,
  compact = false,
  lang = 'en',
}) {
  const [submitted, setSubmitted] = useState(false);
  const [isHelpful, setIsHelpful] = useState(null);
  const [outcome, setOutcome] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      await submitFeedbackApi({
        profileId,
        schemeId,
        recommendationId: recommendationId || `REC-${Date.now()}`,
        helpfulnessRating: isHelpful ? 5 : 2,
        actualOutcome: outcome || (isHelpful ? 'APPROVED' : 'PENDING'),
        userComment: comment,
        collectionMethod: 'IN_APP_WIDGET',
      });
      setSubmitted(true);
    } catch (err) {
      console.warn('Feedback submit failed, setting local state:', err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{
        padding: '10px 14px',
        background: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.8rem',
        color: '#10b981',
      }}>
        <CheckCircle2 size={16} />
        <span>{lang === 'hi' ? 'धन्यवाद! आपकी प्रतिक्रिया से हमारा AI मॉडल सुधरेगा।' : 'Thank you! Your feedback helps train our outcome calibration models.'}</span>
      </div>
    );
  }

  return (
    <div style={{
      padding: compact ? '8px 12px' : '14px 18px',
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '12px',
      backdropFilter: 'blur(8px)',
      marginTop: '10px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 500 }}>
          {lang === 'hi' ? 'क्या यह सिफ़ारिश उपयोगी थी?' : 'Was this recommendation practical & helpful?'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => { setIsHelpful(true); setExpanded(true); }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 600,
              background: isHelpful === true ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.05)',
              color: isHelpful === true ? '#10b981' : '#94a3b8',
              border: `1px solid ${isHelpful === true ? '#10b981' : 'rgba(255, 255, 255, 0.1)'}`,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <ThumbsUp size={13} />
            <span>{lang === 'hi' ? 'हाँ' : 'Yes'}</span>
          </button>
          <button
            type="button"
            onClick={() => { setIsHelpful(false); setExpanded(true); }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 600,
              background: isHelpful === false ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255, 255, 255, 0.05)',
              color: isHelpful === false ? '#ef4444' : '#94a3b8',
              border: `1px solid ${isHelpful === false ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <ThumbsDown size={13} />
            <span>{lang === 'hi' ? 'नहीं' : 'No'}</span>
          </button>
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '10px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', marginBottom: '8px' }}>
            <select
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '6px',
                padding: '6px 10px',
                color: '#e2e8f0',
                fontSize: '0.75rem',
              }}
            >
              <option value="">Status of application?</option>
              <option value="APPROVED">Bank Approved / Sanctioned</option>
              <option value="REJECTED">Bank Rejected</option>
              <option value="PENDING">Application Under Review</option>
              <option value="WITHDREW">Withdrew / Did not apply</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder={lang === 'hi' ? 'अतिरिक्त टिप्पणी (वैकल्पिक)...' : 'Optional note (e.g. branch requested extra quote)...'}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{
                flex: 1,
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '6px',
                padding: '6px 10px',
                color: '#e2e8f0',
                fontSize: '0.75rem',
              }}
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Send size={12} />
              <span>{loading ? 'Submitting...' : 'Send'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FeedbackWidget;
