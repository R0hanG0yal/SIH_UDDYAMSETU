import React, { useState, useEffect } from 'react';
import { ArrowRight, Shield, Percent, Landmark, Sparkles, Users, Heart, Cpu } from 'lucide-react';
import { AIModelExplainerModal } from './AIModelExplainerModal';

export function HeroLanding({ onGetStarted, lang = 'en' }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const t = {
    en: {
      tagline: 'UdyamSetu — AI Funding Navigator for Underserved Entrepreneurs',
      headline: 'Tell Us What Your Business Needs.',
      headlineSub: 'We guide you to sovereign capital, remove blockers, and prepare your bank application.',
      description: 'Grounded in verified policy gazettes from MoMSME, MoSJE, NSFDC & MoF. We calculate your funding readiness, simulate what changes unlock higher subsidies, and trace every eligibility claim to official clauses.',
      cta: 'Find My Practical Funding Path',
      chip1: 'Up to 35% Sovereign Subsidy',
      chip2: 'Grounded RAG Provenance',
      chip3: 'What-If Policy Lab',
      chip4: 'Outcome-Calibrated AI',
    },
    hi: {
      tagline: 'उद्यमसेतु — वंचित उद्यमियों के लिए AI फंडिंग नेविगेटर',
      headline: 'बताइए आपके व्यवसाय को क्या चाहिए।',
      headlineSub: 'हम आपकी स्थिति समझते हैं, व्यावहारिक योजना तय करते हैं और बैंक आवेदन तैयार करते हैं।',
      description: 'MoMSME, MoSJE, NSFDC व MoF के आधिकारिक राजपत्र नियमों पर आधारित। आपका रेडीनेस स्कोर जाँचें, व्हाट-इफ लैब में देखें क्या बदलने से सब्सिडी बढ़ती है, और हर दावे का गजट संदर्भ देखें।',
      cta: 'मेरी फंडिंग योजना खोजें',
      chip1: '35% तक सरकारी सब्सिडी',
      chip2: 'राजपत्र प्रमाणित साइटेशन',
      chip3: 'व्हाट-इफ़ नीति सिम्युलेटर',
      chip4: 'वास्तविक परिणामों से प्रशिक्षित AI',
    }
  }[lang === 'hi' ? 'hi' : 'en'];

  return (
    <section
      className={`hero-landing ${isVisible ? 'hero-visible' : ''}`}
      id="hero-landing-section"
    >
      {/* Subtle floating accent shapes */}
      <div className="hero-accent hero-accent-1" />
      <div className="hero-accent hero-accent-2" />

      <div className="hero-inner">
        {/* Prototype badge — clearly NOT a government service */}
        <div className={`hero-badge ${isVisible ? 'hero-fade-up delay-1' : 'hero-hidden'}`}>
          <Sparkles size={14} />
          <span>{t.tagline}</span>
        </div>

        {/* Main headline — marginalized community focused */}
        <h1 className={`hero-headline ${isVisible ? 'hero-fade-up delay-2' : 'hero-hidden'}`}>
          {t.headline}
          <br />
          <span className="hero-headline-sub">{t.headlineSub}</span>
        </h1>

        {/* Honest description */}
        <p className={`hero-description ${isVisible ? 'hero-fade-up delay-3' : 'hero-hidden'}`}>
          {t.description}
        </p>

        {/* Action Buttons: Main CTA + Model Inspector */}
        <div className={`hero-cta-wrap ${isVisible ? 'hero-fade-up delay-4' : 'hero-hidden'}`} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
          <button
            type="button"
            onClick={onGetStarted}
            className="hero-cta-btn"
            id="hero-get-started-btn"
          >
            <Sparkles size={20} />
            <span>{t.cta}</span>
            <ArrowRight size={18} />
          </button>

          <button
            type="button"
            onClick={() => setIsModelModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.9rem 1.6rem',
              borderRadius: '9999px',
              background: 'rgba(16, 185, 129, 0.12)',
              color: '#10b981',
              border: '1.5px solid rgba(16, 185, 129, 0.4)',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <Cpu size={18} />
            <span>{lang === 'hi' ? 'AI मॉडल आर्किटेक्चर देखें' : 'Inspect AI Model & Architecture'}</span>
          </button>
        </div>

        {/* 4 Trust chips — community focused */}
        <div className={`hero-chips ${isVisible ? 'hero-fade-up delay-5' : 'hero-hidden'}`}>
          <div className="hero-chip">
            <Users size={15} />
            <span>{t.chip2}</span>
          </div>
          <div className="hero-chip">
            <Landmark size={15} />
            <span>{t.chip4}</span>
          </div>
          <div className="hero-chip">
            <Percent size={15} />
            <span>{t.chip1}</span>
          </div>
          <div className="hero-chip">
            <Heart size={15} />
            <span>{t.chip3}</span>
          </div>
        </div>
      </div>

      {/* AI Model Architecture Modal */}
      <AIModelExplainerModal
        isOpen={isModelModalOpen}
        onClose={() => setIsModelModalOpen(false)}
        lang={lang}
      />
    </section>
  );
}
