import React from 'react';
import { User, Sparkles, MapPin, IndianRupee, ArrowRight, Award, Layers } from 'lucide-react';

export const DEMO_PERSONAS = [
  {
    id: 'RAMESH_KUMAR',
    name: 'Ramesh Kumar',
    nameHindi: 'रमेश कुमार',
    avatar: '🪵',
    role: 'Furniture Workshop Owner',
    roleHindi: 'फर्नीचर वर्कशॉप',
    district: 'Jaipur',
    state: 'Rajasthan',
    socialCategory: 'OBC',
    gender: 'male',
    isRural: true,
    isOBC: true,
    isSC: false,
    purpose: 'business',
    categoryName: 'Woodwork & Furniture',
    projectCost: 300000,
    annualIncome: 180000,
    highlights: ['OBC 35% Rural Subsidy', 'Machine Upgrade ₹3L', 'NBCFDC + PMEGP Eligible'],
    highlightsHindi: ['35% ग्रामीण सब्सिडी', 'मशीन अपग्रेड ₹3 लाख', 'PMEGP व NBCFDC पात्र'],
    primaryScheme: "PMEGP (35% Subsidy)",
    documents: { aadhaar: true, pan: true, dpr: false, bank_passbook: true, quotation: true },
    story: "Wants ₹3L to purchase a modern edge-banding machine for his 3-year-old workshop. Lacks Udyam registration."
  },
  {
    id: 'PRIYA_DEVI',
    name: 'Priya Devi',
    nameHindi: 'प्रिया देवी',
    avatar: '🧵',
    role: 'Tailoring Boutique & Embroidery',
    roleHindi: 'सिलाई एवं कढ़ाई केंद्र',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    socialCategory: 'SC',
    gender: 'female',
    isRural: true,
    isSC: true,
    isOBC: false,
    purpose: 'business',
    categoryName: 'Tailoring & Stitching',
    projectCost: 120000,
    annualIncome: 140000,
    highlights: ['SC Female 35% Margin Subsidy', 'Mahila Samriddhi 4% Interest', 'Zero Collateral Required'],
    highlightsHindi: ['महिला SC 35% सब्सिडी', 'महिला समृद्धि 4% ब्याज', 'शून्य कोलैटरल'],
    primaryScheme: "NSFDC Mahila Samriddhi",
    documents: { aadhaar: true, pan: false, dpr: false, bank_passbook: true, quotation: false },
    story: "Requires ₹1.2L for 3 industrial sewing machines and fabrics. Qualifies for concessional 4% female interest tier."
  },
  {
    id: 'ARJUN_SINGH',
    name: 'Arjun Singh',
    nameHindi: 'अर्जुन सिंह',
    avatar: '🌾',
    role: 'Poultry & Agro-Processing',
    roleHindi: 'पोल्ट्री व कृषि प्रसंस्करण',
    district: 'Patna',
    state: 'Bihar',
    socialCategory: 'General / Rural',
    gender: 'male',
    isRural: true,
    isSC: false,
    isOBC: false,
    purpose: 'business',
    categoryName: 'Agro & Food Processing',
    projectCost: 500000,
    annualIncome: 240000,
    highlights: ['PMFME 35% Capital Subsidy', 'Kisan Credit Convergence', 'FPO Cluster Eligible'],
    highlightsHindi: ['PMFME 35% पूँजी सब्सिडी', 'किसान क्रेडिट लिंकेज', 'FPO क्लस्टर लाभ'],
    primaryScheme: "PMFME (MoFPI)",
    documents: { aadhaar: true, pan: true, dpr: true, bank_passbook: true, quotation: false },
    story: "Expanding rural poultry feed and sorting setup. Needs ₹5L capital loan with 35% capital expenditure subsidy."
  }
];

export function DemoPersonas({ onSelectPersona, activePersonaId = null, lang = 'en' }) {
  return (
    <section className="demo-personas-section" style={{ padding: '2rem 1rem 3rem', maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 14px',
          background: 'rgba(249, 115, 22, 0.1)',
          border: '1px solid rgba(249, 115, 22, 0.25)',
          borderRadius: '9999px',
          color: '#f97316',
          fontSize: '0.78rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: '8px',
        }}>
          <Sparkles size={13} />
          <span>{lang === 'hi' ? 'त्वरित डेमो परीक्षण प्रोफाइल' : 'Instant SIH Evaluation Personas'}</span>
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
          {lang === 'hi' ? 'वास्तविक उद्यमी परिदृश्य का परीक्षण करें' : 'Simulate Real Entrepreneur Journeys'}
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.92rem', maxWidth: '640px', margin: '0.5rem auto 0' }}>
          {lang === 'hi' 
            ? 'एक क्लिक में हमारे AI आर्केस्ट्रेटर, पात्रता इंजन, व्हाट-इफ सिमुलेटर और RAG साइटेशन का लाइव प्रदर्शन देखें।'
            : 'Select a verified citizen archetype to evaluate the entire 13-engine intelligence core in one click.'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {DEMO_PERSONAS.map((persona) => {
          const isActive = activePersonaId === persona.id;
          return (
            <div
              key={persona.id}
              className={`demo-persona-card ${isActive ? 'active' : ''}`}
              style={{
                position: 'relative',
                background: isActive ? 'rgba(19, 78, 74, 0.35)' : 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(16px)',
                border: isActive ? '1px solid rgba(16, 185, 129, 0.6)' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: isActive ? '0 20px 40px -10px rgba(16, 185, 129, 0.3)' : '0 10px 30px -10px rgba(0,0,0,0.5)',
              }}
            >
              {isActive && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '20px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '2px 10px',
                  borderRadius: '9999px',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}>
                  Active Citizen
                </div>
              )}

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1rem' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem',
                  }}>
                    {persona.avatar}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                      {lang === 'hi' ? persona.nameHindi : persona.name}
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600 }}>
                      {lang === 'hi' ? persona.roleHindi : persona.role}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '1rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} color="#f97316" />
                    {persona.district}, {persona.state}
                  </span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Layers size={13} color="#10b981" />
                    {persona.socialCategory} ({persona.gender === 'female' ? 'Female' : 'Male'})
                  </span>
                </div>

                <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '1rem', minHeight: '40px' }}>
                  {persona.story}
                </p>

                <div style={{
                  background: 'rgba(0, 0, 0, 0.25)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  marginBottom: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.04)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Funding Needed</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc' }}>
                      ₹{(persona.projectCost).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Top Target Scheme</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#34d399' }}>
                      {persona.primaryScheme}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1.2rem' }}>
                  {(lang === 'hi' ? persona.highlightsHindi : persona.highlights).map((hl, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '3px 9px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: '#cbd5e1',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      ✓ {hl}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectPersona && onSelectPersona(persona.id, persona)}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  background: isActive ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  border: isActive ? 'none' : '1px solid rgba(255, 255, 255, 0.15)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  boxShadow: isActive ? '0 8px 20px -4px rgba(16, 185, 129, 0.4)' : 'none',
                }}
              >
                <span>{isActive ? (lang === 'hi' ? 'सिमुलेशन चालू है' : 'Citizen Active') : (lang === 'hi' ? 'यह प्रोफाइल लोड करें' : 'Simulate Citizen')}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default DemoPersonas;
