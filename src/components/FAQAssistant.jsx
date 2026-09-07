import React, { useState } from 'react';
import { HelpCircle, Search, ExternalLink, BookOpen, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { FAQ_ITEMS } from '../data/faqKnowledge';

export function FAQAssistant({ lang }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState('faq-income-ceiling');

  const filteredFaqs = FAQ_ITEMS.filter(item => {
    const q = (item.question + ' ' + (item.questionHindi || '') + ' ' + item.answer + ' ' + item.tags.join(' ')).toLowerCase();
    return q.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
      {/* FAQ Header */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f393b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HelpCircle size={24} color="#ff6f1e" />
          <span>Source-Grounded FAQ & Governance Citations</span>
        </h2>
        <p style={{ fontSize: '0.86rem', color: '#475569' }}>
          Directly sourced from official NSFDC guidelines, operational manuals, and PM-SURAJ directives.
        </p>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={lang === 'hi' ? 'सवाल खोजें... (जैसे: आय सीमा, 1.40 लाख, मोरेटोरियम)' : 'Search queries... (e.g., income ceiling, 1.40 lakh, moratorium)'}
          style={{
            width: '100%',
            padding: '0.75rem 1rem 0.75rem 2.5rem',
            borderRadius: '10px',
            border: '1.5px solid #cbd5e1',
            fontSize: '0.92rem',
            color: '#0f172a'
          }}
        />
        <Search size={18} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
      </div>

      {/* FAQs List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filteredFaqs.map((faq) => {
          const isExpanded = expandedId === faq.id;

          return (
            <div
              key={faq.id}
              style={{
                background: '#ffffff',
                border: isExpanded ? '1.5px solid #0f393b' : '1px solid #e2e8f0',
                borderRadius: '10px',
                overflow: 'hidden',
                transition: 'all 0.2s ease'
              }}
            >
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: isExpanded ? '#f0fdf4' : 'transparent',
                  border: 'none',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  gap: '0.75rem'
                }}
              >
                <div style={{ fontWeight: '700', fontSize: '0.95rem', color: isExpanded ? '#065f46' : '#0f393b' }}>
                  {lang === 'hi' && faq.questionHindi ? faq.questionHindi : faq.question}
                </div>
                {isExpanded ? <ChevronUp size={18} color="#0f393b" /> : <ChevronDown size={18} color="#64748b" />}
              </button>

              {isExpanded && (
                <div style={{ padding: '0 1.25rem 1.25rem', background: '#f0fdf4' }}>
                  <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: '1.5', marginBottom: '0.85rem' }}>
                    {lang === 'hi' && faq.answerHindi ? faq.answerHindi : faq.answer}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.65rem', borderTop: '1px dashed #cbd5e1', fontSize: '0.75rem', color: '#64748b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <ShieldCheck size={14} color="#059669" />
                      <span>Clause: <strong>{faq.sourceClause}</strong></span>
                    </div>
                    <a
                      href={faq.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#ff6f1e', textDecoration: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      <span>Official NSFDC Portal Source</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
