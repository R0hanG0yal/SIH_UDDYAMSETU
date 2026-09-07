import React, { useState } from 'react';
import { Mic, MicOff, Volume2, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, User, Building2, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { VoiceEngine } from '../engines/voiceEngine';

export function VoiceIntake({ profile, setProfile, onProceedToMatch, lang = 'en' }) {
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState(null);
  const [interimText, setInterimText] = useState('');
  const [voiceEngine] = useState(() => new VoiceEngine());
  const [activeStep, setActiveStep] = useState(1);
  const [rawSearchQuery, setRawSearchQuery] = useState(profile?.categoryName || '');
  const [showPolicyHelp, setShowPolicyHelp] = useState(false);

  const t = {
    en: {
      heroBadge: "Government of India • Universal Enterprise Credit Gateway",
      heroTitle: "Universal Credit Schemes for Every Citizen & Entrepreneur",
      heroSubtitle: "Find running GoI schemes (PMEGP, MUDRA, PM-VishwaKarma, PM SVANidhi) you qualify for, unlock direct capital subsidies up to 35%, and see how to bridge eligibility gaps.",
      step1Title: "1. What is your trade, business, or enterprise requirement?",
      step1Subtitle: "Speak naturally in English or Hindi, or select a sector below.",
      typePlaceholder: "e.g. Tailoring boutique, Kirana store, Cafe, Fabrication workshop, Dairy, Solar...",
      speakBtn: "Speak in Your Language",
      listening: "Listening... speak naturally now",
      step2Title: "2. How much capital or loan do you need?",
      step2Subtitle: "Total project valuation including machinery, working capital, or equipment.",
      step3Title: "3. Household Income & Subsidy Multipliers",
      step3Subtitle: "All Indian citizens qualify for universal schemes (MUDRA, PMEGP). Special categories unlock up to 35% non-repayable grants.",
      step4Title: "4. Applicant Profile & Operating District",
      step4Subtitle: "Used to issue your verified QR Loan Fit Passport and locate active bank desks.",
      fullNameLabel: "Applicant Legal Name",
      categoryMultiplier: "Category Subsidy Multiplier (Optional)",
      categoryNote: "PMEGP and GoI schemes offer 15% to 35% non-repayable direct cash grants based on location and affirmative profile.",
      genderLabel: "Beneficiary Gender",
      femaleRebate: "Female (Unlocks 35% PMEGP subsidy & 0.5% interest rebate)",
      male: "Male",
      locationType: "Project Location Area",
      rural: "Rural / Village (Unlocks highest 25%-35% subsidy)",
      urban: "Urban / Municipal Area",
      continueBtn: "Evaluate National Schemes & Subsidy",
      nextStepBtn: "Continue",
      backBtn: "Back"
    },
    hi: {
      heroBadge: "भारत सरकार • राष्ट्रीय व्यावसायिक ऋण व सब्सिडी पोर्टल",
      heroTitle: "प्रत्येक नागरिक व उद्यमी के लिए सरकारी ऋण व सब्सिडी योजनाएं",
      heroSubtitle: "PMEGP (35% तक सरकारी अनुदान), मुद्रा योजना (₹20 लाख तक), पीएम विश्वकर्मा (5% ब्याज) सहित सभी चालू योजनाओं में अपनी पात्रता जांचें।",
      step1Title: "1. आप किस व्यवसाय, उद्योग या कार्य के लिए ऋण चाहते हैं?",
      step1Subtitle: "माइक दबाकर बोलें या नीचे दिए गए विकल्पों में से चुनें।",
      typePlaceholder: "जैसे: सिलाई बुटीक, किराना स्टोर, चाय दुकान, वर्कशॉप, डेयरी, सोलर...",
      speakBtn: "अपनी भाषा में बोलें",
      listening: "सुन रहे हैं... कृपया बोलिए",
      step2Title: "2. आपको कितने रुपयों की आवश्यकता है?",
      step2Subtitle: "मशीनरी, कच्चा माल या कार्यशील पूंजी सहित कुल लागत।",
      step3Title: "3. पारिवारिक आय व सब्सिडी श्रेणियां",
      step3Subtitle: "मुद्रा व PMEGP सभी नागरिकों के लिए खुली हैं। विशेष श्रेणियों को 35% तक का सरकारी अनुदान मिलता है।",
      step4Title: "4. आवेदक का नाम व जिला",
      step4Subtitle: "यह जानकारी आपके QR लोन फिट पासपोर्ट में दर्ज होगी।",
      fullNameLabel: "आवेदक का पूरा नाम",
      categoryMultiplier: "सब्सिडी श्रेणी (ऐच्छिक)",
      categoryNote: "PMEGP के तहत 15% से 35% तक की सीधी गैर-वापसी सरकारी सब्सिडी मिलती है।",
      genderLabel: "आवेदक का लिंग",
      femaleRebate: "महिला (35% सब्सिडी व 0.5% ब्याज छूट)",
      male: "पुरुष",
      locationType: "परियोजना का स्थान",
      rural: "ग्रामीण / ग्राम पंचायत (सर्वाधिक 35% सब्सिडी)",
      urban: "शहरी / नगर पालिका क्षेत्र",
      continueBtn: "राष्ट्रीय योजनाएं व सब्सिडी जांचें",
      nextStepBtn: "आगे बढ़ें",
      backBtn: "पीछे"
    }
  }[lang === 'hi' ? 'hi' : 'en'];

  // Speech Recognition
  const handleStartMic = () => {
    setSpeechError(null);
    setIsListening(true);
    const speechLang = lang === 'hi' ? 'hi-IN' : 'en-IN';

    voiceEngine.startListening(
      speechLang,
      (transcript) => {
        setInterimText(transcript);
        setIsListening(false);
        handleProcessSpeech(transcript);
      },
      (err) => {
        setIsListening(false);
        setSpeechError("Microphone unavailable or closed. You can also type freely or select a sector.");
      },
      () => setIsListening(false)
    );
  };

  const handleStopMic = () => {
    voiceEngine.stopListening();
    setIsListening(false);
  };

  const handleProcessSpeech = (text) => {
    const parsed = VoiceEngine.extractIntent(text);
    setRawSearchQuery(parsed.categoryName || text);
    
    setProfile(prev => ({
      ...prev,
      categoryName: parsed.categoryName || text,
      purpose: parsed.purpose || prev.purpose,
      projectCost: parsed.projectCost || prev.projectCost
    }));

    if (parsed.projectCost) {
      setActiveStep(3);
    } else {
      setActiveStep(2);
    }
  };

  const handleSelectSector = (name, purpose, defaultCost) => {
    setRawSearchQuery(name);
    setProfile(prev => ({
      ...prev,
      categoryName: name,
      purpose: purpose,
      projectCost: defaultCost || prev.projectCost
    }));
    setActiveStep(2);
  };

  const ventureCategories = [
    { id: 'tailoring', name: 'Tailoring & Garments (सिलाई/बुटीक)', purpose: 'business', defaultCost: 120000, icon: '🧵', tag: 'PM-VishwaKarma & PMEGP' },
    { id: 'retail', name: 'Kirana & Grocery Store (किराना दुकान)', purpose: 'business', defaultCost: 150000, icon: '🏪', tag: 'PMMY Kishore' },
    { id: 'tea', name: 'Tea Stall & Food Cart (चाय/नाश्ता कॉर्नर)', purpose: 'business', defaultCost: 50000, icon: '☕', tag: 'PM SVANidhi & MUDRA' },
    { id: 'transport', name: 'Commercial Transport / Auto (ऑटो/ई-रिक्शा)', purpose: 'business', defaultCost: 320000, icon: '🛺', tag: 'PMMY Tarun' },
    { id: 'dairy', name: 'Dairy & Livestock Unit (डेयरी/पशुपालन)', purpose: 'business', defaultCost: 450000, icon: '🐄', tag: 'PMEGP Subsidy' },
    { id: 'workshop', name: 'Workshop & Fabrication (वर्कशॉप/कारखाना)', purpose: 'business', defaultCost: 1200000, icon: '⚙️', tag: 'PMEGP 35% Grant' },
    { id: 'education', name: 'Higher Professional Degree (उच्च शिक्षा/तकनीकी)', purpose: 'education', defaultCost: 800000, icon: '🎓', tag: '100% CSIS Subsidy' }
  ];

  return (
    <div style={{ marginBottom: '2.5rem' }}>

      {/* Main Intake Form Container */}
      <div className="liquid-glass-card" style={{ padding: '2rem', maxWidth: '880px', margin: '0 auto' }}>
        {/* Thin progress dot indicator */}
        <div className="intake-progress">
          {[1, 2, 3, 4].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setActiveStep(s)}
              id={`step-indicator-${s}`}
              className={`intake-dot ${activeStep === s ? 'active' : activeStep > s ? 'completed' : ''}`}
              title={`Step ${s}`}
            />
          ))}
        </div>

        {/* STEP 1: VENTURE */}
        {activeStep === 1 && (
          <div style={{ animation: 'fadeIn 0.25s ease-out' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--brand-navy)' }}>
                {t.step1Title}
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', marginTop: '0.2rem' }}>
                {t.step1Subtitle}
              </p>
            </div>

            {/* Voice Mic Bar */}
            <div style={{
              background: isListening ? '#fef2f2' : 'rgba(255, 255, 255, 0.65)',
              border: isListening ? '2px solid #ef4444' : '1.5px solid rgba(203, 213, 225, 0.8)',
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              transition: 'all 0.2s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={isListening ? handleStopMic : handleStartMic}
                  id="voice-mic-trigger-btn"
                  className={isListening ? 'btn-outline' : 'btn-accent-saffron'}
                  style={{ minWidth: '170px' }}
                >
                  {isListening ? <MicOff size={18} color="#ef4444" /> : <Mic size={18} />}
                  <span>{isListening ? "Stop Listening" : t.speakBtn}</span>
                </button>

                {isListening && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="voice-wave">
                      <div className="voice-wave-bar"></div>
                      <div className="voice-wave-bar"></div>
                      <div className="voice-wave-bar"></div>
                      <div className="voice-wave-bar"></div>
                      <div className="voice-wave-bar"></div>
                    </div>
                    <span style={{ fontSize: '0.84rem', color: '#b91c1c', fontWeight: '700' }}>
                      {t.listening}
                    </span>
                  </div>
                )}
              </div>

              {speechError && (
                <div style={{ fontSize: '0.8rem', color: '#b91c1c', padding: '0.35rem 0.5rem', background: '#fee2e2', borderRadius: '6px' }}>
                  {speechError}
                </div>
              )}

              {interimText && (
                <div style={{ fontSize: '0.86rem', color: 'var(--brand-teal)', fontStyle: 'italic' }}>
                  "{interimText}"
                </div>
              )}
            </div>

            {/* Custom Input */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: '700', fontSize: '0.88rem', color: '#334155', marginBottom: '0.4rem' }}>
                Or type enterprise/venture details:
              </label>
              <input
                type="text"
                value={rawSearchQuery}
                onChange={(e) => {
                  setRawSearchQuery(e.target.value);
                  setProfile({ ...profile, categoryName: e.target.value });
                }}
                placeholder={t.typePlaceholder}
                className="form-input"
                id="venture-type-input"
              />
            </div>



            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="btn-solid-primary"
                id="step1-continue-btn"
              >
                <span>{t.nextStepBtn}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: CAPITAL */}
        {activeStep === 2 && (
          <div style={{ animation: 'fadeIn 0.25s ease-out' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--brand-navy)' }}>
                {t.step2Title}
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', marginTop: '0.2rem' }}>
                {t.step2Subtitle}
              </p>
            </div>

            {/* Slider & Input */}
            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--brand-navy)' }}>Project Cost</span>
                <span style={{
                  fontSize: '1.45rem',
                  fontWeight: '900',
                  color: 'var(--brand-teal)',
                  background: '#f0fdfa',
                  padding: '0.35rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #99f6e4'
                }}>
                  ₹{Number(profile?.projectCost || 100000).toLocaleString('en-IN')}
                </span>
              </div>

              <input
                type="range"
                min="10000"
                max="2500000"
                step="10000"
                value={profile?.projectCost || 100000}
                onChange={(e) => setProfile({ ...profile, projectCost: Number(e.target.value) })}
                id="project-cost-slider"
                style={{ width: '100%', height: '8px', accentColor: 'var(--brand-teal)', cursor: 'pointer', margin: '0.5rem 0' }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--slate-400)', marginTop: '0.25rem' }}>
                <span>₹10,000 (Micro)</span>
                <span>₹5,00,000</span>
                <span>₹10,00,000</span>
                <span>₹25,00,000+ (MSME)</span>
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontWeight: '700', fontSize: '0.85rem', color: '#334155', marginBottom: '0.4rem' }}>
                Quick Valuation Presets:
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {[50000, 100000, 250000, 500000, 1000000, 1500000].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setProfile({ ...profile, projectCost: amt })}
                    style={{
                      padding: '0.45rem 0.9rem',
                      borderRadius: '8px',
                      border: profile?.projectCost === amt ? '2px solid var(--brand-teal)' : '1px solid #cbd5e1',
                      background: profile?.projectCost === amt ? '#f0fdfa' : '#ffffff',
                      color: profile?.projectCost === amt ? 'var(--brand-teal)' : '#334155',
                      fontWeight: '700',
                      fontSize: '0.84rem',
                      cursor: 'pointer'
                    }}
                  >
                    ₹{(amt / 100000).toFixed(amt >= 100000 ? 1 : 2)} Lakh
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="btn-outline"
              >
                {t.backBtn}
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className="btn-solid-primary"
                id="step2-continue-btn"
              >
                <span>{t.nextStepBtn}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SUBSIDY MULTIPLIERS */}
        {activeStep === 3 && (
          <div style={{ animation: 'fadeIn 0.25s ease-out' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--brand-navy)' }}>
                {t.step3Title}
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', marginTop: '0.2rem' }}>
                {t.step3Subtitle}
              </p>
            </div>

            {/* Income Slider */}
            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: '700', fontSize: '0.92rem', color: 'var(--brand-navy)' }}>Annual Family Income</span>
                <span style={{
                  fontSize: '1.2rem',
                  fontWeight: '800',
                  color: 'var(--emerald-dark)',
                  background: '#ecfdf5',
                  padding: '0.2rem 0.75rem',
                  borderRadius: '6px'
                }}>
                  ₹{Number(profile?.annualIncome || 180000).toLocaleString('en-IN')} / year
                </span>
              </div>

              <input
                type="range"
                min="50000"
                max="1200000"
                step="25000"
                value={profile?.annualIncome || 180000}
                onChange={(e) => setProfile({ ...profile, annualIncome: Number(e.target.value) })}
                id="annual-income-slider"
                style={{ width: '100%', height: '8px', accentColor: '#10b981', cursor: 'pointer', margin: '0.5rem 0' }}
              />

              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                ℹ️ Note: National schemes (PMMY MUDRA, PMEGP, PM-VishwaKarma) have <strong>no family income ceiling</strong>. All citizens qualify!
              </div>
            </div>

            {/* Location Type */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: '700', fontSize: '0.88rem', color: '#334155', marginBottom: '0.4rem' }}>
                {t.locationType}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, isRural: true })}
                  id="loc-rural-btn"
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: profile?.isRural !== false ? '2px solid #10b981' : '1px solid #cbd5e1',
                    background: profile?.isRural !== false ? '#ecfdf5' : '#ffffff',
                    color: profile?.isRural !== false ? '#065f46' : '#475569',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  🌾 {t.rural}
                </button>
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, isRural: false })}
                  id="loc-urban-btn"
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: profile?.isRural === false ? '2px solid var(--brand-navy)' : '1px solid #cbd5e1',
                    background: profile?.isRural === false ? '#f0fdfa' : '#ffffff',
                    color: profile?.isRural === false ? 'var(--brand-navy)' : '#475569',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  🏙️ {t.urban}
                </button>
              </div>
            </div>

            {/* Gender Selection */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontWeight: '700', fontSize: '0.88rem', color: '#334155', marginBottom: '0.4rem' }}>
                {t.genderLabel}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, gender: 'female' })}
                  id="gender-female-btn"
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: profile?.gender === 'female' ? '2px solid #f97316' : '1px solid #cbd5e1',
                    background: profile?.gender === 'female' ? '#fff7ed' : '#ffffff',
                    color: profile?.gender === 'female' ? '#c2410c' : '#475569',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  👩 {t.femaleRebate}
                </button>
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, gender: 'male' })}
                  id="gender-male-btn"
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: profile?.gender === 'male' ? '2px solid var(--brand-navy)' : '1px solid #cbd5e1',
                    background: profile?.gender === 'male' ? '#f0fdfa' : '#ffffff',
                    color: profile?.gender === 'male' ? 'var(--brand-navy)' : '#475569',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  👨 {t.male}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="btn-outline"
              >
                {t.backBtn}
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(4)}
                className="btn-solid-primary"
                id="step3-continue-btn"
              >
                <span>{t.nextStepBtn}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: APPLICANT PROFILE */}
        {activeStep === 4 && (
          <div style={{ animation: 'fadeIn 0.25s ease-out' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--brand-navy)' }}>
                {t.step4Title}
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', marginTop: '0.2rem' }}>
                {t.step4Subtitle}
              </p>
            </div>

            {/* Real Applicant Legal Name */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontWeight: '700', fontSize: '0.88rem', color: '#334155', marginBottom: '0.4rem' }}>
                {t.fullNameLabel}:
              </label>
              <input
                type="text"
                value={profile?.applicantName || ''}
                onChange={(e) => setProfile({ ...profile, applicantName: e.target.value })}
                placeholder="Enter your legal full name (e.g. as on Aadhaar card)"
                className="form-input"
                id="applicant-name-input"
                style={{ fontSize: '1rem' }}
              />
            </div>

            {/* Operating District */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontWeight: '700', fontSize: '0.88rem', color: '#334155', marginBottom: '0.4rem' }}>
                Operating District:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.65rem' }}>
                {[
                  { district: 'Lucknow', state: 'Uttar Pradesh', label: 'Lucknow, UP' },
                  { district: 'Varanasi', state: 'Uttar Pradesh', label: 'Varanasi, UP' },
                  { district: 'New Delhi', state: 'Delhi', label: 'New Delhi, NCR' },
                  { district: 'Mumbai', state: 'Maharashtra', label: 'Mumbai, MH' },
                  { district: 'Bengaluru', state: 'Karnataka', label: 'Bengaluru, KA' },
                  { district: 'Jaipur', state: 'Rajasthan', label: 'Jaipur, RJ' }
                ].map(loc => (
                  <button
                    key={loc.district}
                    type="button"
                    onClick={() => setProfile({ ...profile, district: loc.district, state: loc.state })}
                    id={`district-btn-${loc.district}`}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: profile?.district === loc.district ? '2px solid var(--brand-navy)' : '1px solid #cbd5e1',
                      background: profile?.district === loc.district ? '#f0fdfa' : '#ffffff',
                      color: profile?.district === loc.district ? 'var(--brand-navy)' : '#334155',
                      fontWeight: '700',
                      fontSize: '0.85rem',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    📍 {loc.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className="btn-outline"
              >
                {t.backBtn}
              </button>
              <button
                type="button"
                onClick={onProceedToMatch}
                className="btn-accent-saffron"
                id="voice-intake-evaluate-btn"
                style={{ fontSize: '1.05rem', padding: '0.85rem 1.8rem' }}
              >
                <span>{t.continueBtn}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
