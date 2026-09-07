import React, { useState, useEffect } from 'react';
import { ArrowRight, Shield, Percent, Landmark, Sparkles } from 'lucide-react';

export function HeroLanding({ onGetStarted, lang = 'en' }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Stagger the entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const t = {
    en: {
      tagline: 'Government of India — Enterprise Credit Gateway',
      headline: 'Get ₹15,000 to ₹25 Lakh',
      headlineSub: 'for your business — in minutes.',
      description: 'One simple check. Every running GoI scheme. Zero paperwork to start.',
      cta: 'Check My Eligibility',
      chip1: '35% Govt Subsidy',
      chip2: 'Zero Collateral',
      chip3: '12+ National Schemes',
    },
    hi: {
      tagline: 'भारत सरकार — उद्यम ऋण गेटवे',
      headline: '₹15,000 से ₹25 लाख तक',
      headlineSub: 'आपके व्यवसाय के लिए — मिनटों में।',
      description: 'एक सरल जांच। सभी चालू सरकारी योजनाएं। शुरू करने के लिए शून्य कागजी कार्रवाई।',
      cta: 'मेरी पात्रता जांचें',
      chip1: '35% सरकारी अनुदान',
      chip2: 'शून्य गारंटी',
      chip3: '12+ राष्ट्रीय योजनाएं',
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
        {/* Small sovereign badge */}
        <div className={`hero-badge ${isVisible ? 'hero-fade-up delay-1' : 'hero-hidden'}`}>
          <Shield size={14} />
          <span>{t.tagline}</span>
        </div>

        {/* Main headline — large, human, benefit-first */}
        <h1 className={`hero-headline ${isVisible ? 'hero-fade-up delay-2' : 'hero-hidden'}`}>
          {t.headline}
          <br />
          <span className="hero-headline-sub">{t.headlineSub}</span>
        </h1>

        {/* One-line description */}
        <p className={`hero-description ${isVisible ? 'hero-fade-up delay-3' : 'hero-hidden'}`}>
          {t.description}
        </p>

        {/* Single CTA */}
        <div className={`hero-cta-wrap ${isVisible ? 'hero-fade-up delay-4' : 'hero-hidden'}`}>
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
        </div>

        {/* 3 Trust chips */}
        <div className={`hero-chips ${isVisible ? 'hero-fade-up delay-5' : 'hero-hidden'}`}>
          <div className="hero-chip">
            <Percent size={15} />
            <span>{t.chip1}</span>
          </div>
          <div className="hero-chip">
            <Shield size={15} />
            <span>{t.chip2}</span>
          </div>
          <div className="hero-chip">
            <Landmark size={15} />
            <span>{t.chip3}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
