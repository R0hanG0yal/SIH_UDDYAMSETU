import React, { useState } from 'react';
import { Sparkles, ChevronUp, ChevronDown, Check, Zap, Play } from 'lucide-react';

export function DemoStoryBanner({ onSelectScenario, activeScenarioId, lang }) {
  const [isOpen, setIsOpen] = useState(false);

  const scenarios = [
    {
      id: 'rani-120k',
      title: 'Rani\'s Tailoring (₹1.20L)',
      subtitle: 'Micro Finance 6.5% • Paused branch bypass',
      tag: 'Core Persona',
      color: '#10b981',
      payload: {
        applicantName: 'Rani Devi',
        purpose: 'business',
        categoryName: 'Tailoring & Garment Unit',
        projectCost: 120000,
        annualIncome: 180000,
        isSC: true,
        gender: 'female',
        isConstructionOrPlantation: false,
        district: 'Lucknow',
        state: 'Uttar Pradesh',
        documents: { caste_cert: true, income_cert: true, aadhaar: true, bank_passbook: true, quotation: false }
      }
    },
    {
      id: 'boundary-12L',
      title: 'Boundary Scale-Up (₹12.0 Lakh)',
      subtitle: 'Instant Term Loan 8.0% • 5-Year Quarterly Amortization',
      tag: 'Policy Switch',
      color: '#f97316',
      payload: {
        applicantName: 'Rani Devi',
        purpose: 'business',
        categoryName: 'Boutique & Garment Manufacturing',
        projectCost: 1200000,
        annualIncome: 240000,
        isSC: true,
        gender: 'female',
        isConstructionOrPlantation: false,
        district: 'Lucknow',
        state: 'Uttar Pradesh',
        documents: { caste_cert: true, income_cert: true, aadhaar: true, bank_passbook: true, dpr: true, quotation: true }
      }
    },
    {
      id: 'income-500k-boundary',
      title: 'Income Threshold (₹5,00,001)',
      subtitle: 'Exceeds ₹5L ceiling • Triggers Next-Best Action',
      tag: 'Ceiling Edge',
      color: '#f59e0b',
      payload: {
        applicantName: 'Suresh Kumar',
        purpose: 'business',
        categoryName: 'Kirana Retail Store',
        projectCost: 120000,
        annualIncome: 500001,
        isSC: true,
        gender: 'male',
        isConstructionOrPlantation: false,
        district: 'Lucknow',
        state: 'Uttar Pradesh',
        documents: { caste_cert: true, income_cert: true, aadhaar: true, bank_passbook: true }
      }
    },
    {
      id: 'construction-moratorium',
      title: 'Extended Moratorium (24M)',
      subtitle: 'Civil Construction & Dairy Shed • 24 Months Gestation',
      tag: 'Moratorium Edge',
      color: '#3b82f6',
      payload: {
        applicantName: 'Manoj Paswan',
        purpose: 'business',
        categoryName: 'Dairy Shed & Construction',
        projectCost: 800000,
        annualIncome: 250000,
        isSC: true,
        gender: 'male',
        isConstructionOrPlantation: true,
        district: 'Lucknow',
        state: 'Uttar Pradesh',
        documents: { caste_cert: true, income_cert: true, aadhaar: true, bank_passbook: true, dpr: true, quotation: true }
      }
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.25rem',
      right: '1.25rem',
      zIndex: 999,
      maxWidth: '380px',
      width: 'calc(100vw - 2.5rem)'
    }}>
      {/* Expanded Scenario Drawer */}
      {isOpen && (
        <div style={{
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '16px',
          boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          padding: '1rem',
          marginBottom: '0.65rem',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Zap size={16} color="#f97316" />
              <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a' }}>
                Quick Test Personas (जज व टेस्ट प्रीसेट)
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {scenarios.map((sc) => {
              const isSelected = activeScenarioId === sc.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => {
                    onSelectScenario(sc.id, sc.payload);
                    setIsOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    textAlign: 'left',
                    padding: '0.6rem 0.75rem',
                    borderRadius: '8px',
                    border: isSelected ? '1.5px solid #f97316' : '1px solid #e2e8f0',
                    background: isSelected ? '#fff7ed' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '0.15rem' }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: '700', color: isSelected ? '#c2410c' : '#1e293b' }}>
                      {sc.title}
                    </span>
                    <span style={{ fontSize: '0.68rem', background: isSelected ? '#f97316' : '#f1f5f9', color: isSelected ? '#ffffff' : '#64748b', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: '700' }}>
                      {sc.tag}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    {sc.subtitle}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Toggle Trigger Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#091e20',
            color: '#ffffff',
            padding: '0.55rem 1rem',
            borderRadius: '9999px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
            cursor: 'pointer',
            fontSize: '0.82rem',
            fontWeight: '700',
            transition: 'all 0.15s ease'
          }}
        >
          <Sparkles size={15} color="#f97316" />
          <span>{isOpen ? 'Close Presets' : '⚡ 1-Click Test Scenarios'}</span>
          {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
      </div>
    </div>
  );
}
