import React, { useState } from 'react';
import { Mic, MicOff, Volume2, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, User, Building2, MapPin, ChevronDown, ChevronUp, Brain, HelpCircle } from 'lucide-react';
import { VoiceEngine } from '../engines/voiceEngine';
import { AgentThoughtTrace } from './AgentThoughtTrace';
import { processVoiceWithAgent } from '../services/api';

export function VoiceIntake({ profile, setProfile, onProceedToMatch, lang = 'en' }) {
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState(null);
  const [interimText, setInterimText] = useState('');
  const [voiceEngine] = useState(() => new VoiceEngine());
  const [activeStep, setActiveStep] = useState(1);
  const [rawSearchQuery, setRawSearchQuery] = useState(profile?.categoryName || '');
  const [showPolicyHelp, setShowPolicyHelp] = useState(false);
  const [agentTrace, setAgentTrace] = useState(null);
  const [traceExecutionTime, setTraceExecutionTime] = useState(0);
  const [isAgentReasoning, setIsAgentReasoning] = useState(false);
  const [clarificationPrompt, setClarificationPrompt] = useState(null);

  const t = {
    en: {
      heroBadge: "SAARTHI Prototype • AI-Powered Scheme Matching",
      heroTitle: "AI Credit Scheme Navigator for Marginalized Entrepreneurs",
      heroSubtitle: "Find schemes from MoSJE/NSFDC (SC/ST), MoMSME (PMEGP, MUDRA, PM-VishwaKarma), and MoHUA (SVANidhi). Explore eligibility based on published guidelines.",
      step1Title: "1. What is your trade, business, or enterprise?",
      step1Subtitle: "Speak naturally in English or Hindi, or type below.",
      typePlaceholder: "e.g. Tailoring boutique, Kirana store, Cafe, Fabrication workshop, Dairy, Solar...",
      speakBtn: "Speak in Your Language",
      listening: "Listening... speak naturally now",
      step2Title: "2. How much capital or loan do you need?",
      step2Subtitle: "Total project cost including machinery, working capital, or equipment.",
      step3Title: "3. Social Category & Subsidy Eligibility",
      step3Subtitle: "SC/ST/OBC/Minority/PWD applicants unlock NSFDC concessional loans (4-6% interest) and higher PMEGP subsidies (up to 35%). Select your category to see matched schemes.",
      step4Title: "4. Applicant Profile & Operating District",
      step4Subtitle: "Used to generate your Loan Fit Passport and locate active bank desks.",
      fullNameLabel: "Applicant Legal Name",
      socialCatLabel: "Your Social Category",
      socialCatNote: "NSFDC schemes are exclusively for SC/ST applicants with annual family income ≤ ₹3 Lakh. OBC/Minority have dedicated NBCFDC/NMFDC schemes.",
      pwdLabel: "Person with Disability (PWD)",
      pwdNote: "PWD applicants get priority processing and additional interest rebates.",
      exServiceLabel: "Ex-Serviceperson",
      genderLabel: "Beneficiary Gender",
      femaleRebate: "Female (Higher PMEGP subsidy & 0.5% interest rebate)",
      male: "Male",
      locationType: "Project Location Area",
      rural: "Rural / Village (Higher 25%-35% PMEGP subsidy)",
      urban: "Urban / Municipal Area",
      continueBtn: "Evaluate Matching Schemes",
      nextStepBtn: "Continue",
      backBtn: "Back"
    },
    hi: {
      heroBadge: "SAARTHI प्रोटोटाइप • AI-आधारित योजना मिलान",
      heroTitle: "वंचित उद्यमियों के लिए AI ऋण योजना नेविगेटर",
      heroSubtitle: "MoSJE/NSFDC (SC/ST), MoMSME (PMEGP, मुद्रा, PM-विश्वकर्मा) और MoHUA (SVANidhi) की योजनाओं में प्रकाशित नियमावली के आधार पर पात्रता जांचें।",
      step1Title: "1. आप किस व्यवसाय या उद्योग के लिए ऋण चाहते हैं?",
      step1Subtitle: "माइक दबाकर बोलें या नीचे टाइप करें।",
      typePlaceholder: "जैसे: सिलाई बुटीक, किराना स्टोर, चाय दुकान, वर्कशॉप, डेयरी, सोलर...",
      speakBtn: "अपनी भाषा में बोलें",
      listening: "सुन रहे हैं... कृपया बोलिए",
      step2Title: "2. आपको कितने रुपयों की आवश्यकता है?",
      step2Subtitle: "मशीनरी, कच्चा माल या कार्यशील पूंजी सहित कुल लागत।",
      step3Title: "3. सामाजिक श्रेणी व सब्सिडी पात्रता",
      step3Subtitle: "SC/ST/OBC/अल्पसंख्यक/PWD आवेदकों को NSFDC रियायती ऋण (4-6% ब्याज) और PMEGP में 35% तक सब्सिडी मिलती है। अपनी श्रेणी चुनें।",
      step4Title: "4. आवेदक का नाम व जिला",
      step4Subtitle: "यह जानकारी आपके लोन फिट पासपोर्ट में दर्ज होगी।",
      fullNameLabel: "आवेदक का पूरा नाम",
      socialCatLabel: "आपकी सामाजिक श्रेणी",
      socialCatNote: "NSFDC योजनाएं विशेष रूप से SC/ST आवेदकों के लिए हैं (वार्षिक पारिवारिक आय ≤ ₹3 लाख)। OBC/अल्पसंख्यक हेतु NBCFDC/NMFDC योजनाएं उपलब्ध हैं।",
      pwdLabel: "दिव्यांग (PWD)",
      pwdNote: "दिव्यांग आवेदकों को प्राथमिकता प्रसंस्करण और अतिरिक्त ब्याज छूट मिलती है।",
      exServiceLabel: "पूर्व सैनिक",
      genderLabel: "आवेदक का लिंग",
      femaleRebate: "महिला (PMEGP में अधिक सब्सिडी व 0.5% ब्याज छूट)",
      male: "पुरुष",
      locationType: "परियोजना का स्थान",
      rural: "ग्रामीण / ग्राम पंचायत (25%-35% PMEGP सब्सिडी)",
      urban: "शहरी / नगर पालिका क्षेत्र",
      continueBtn: "मिलान योजनाएं जांचें",
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

  const handleProcessSpeech = async (text) => {
    setInterimText(text);
    setIsAgentReasoning(true);
    setSpeechError(null);

    try {
      const result = await processVoiceWithAgent(text, lang === 'hi' ? 'hi-IN' : 'en-IN');
      if (result && result.status === 'SUCCESS') {
        setAgentTrace(result.trace);
        setTraceExecutionTime(result.executionTimeMs || 18);
        setRawSearchQuery(result.categoryName || text);
        setClarificationPrompt(result.clarificationPrompt);

        setProfile(prev => ({
          ...prev,
          categoryName: result.categoryName || text,
          purpose: result.purpose || prev.purpose,
          projectCost: result.projectCost || prev.projectCost,
          category: result.detectedCategory || prev.category,
          gender: result.gender || prev.gender,
          locationType: result.locationType || prev.locationType
        }));

        if (result.projectCost) {
          setActiveStep(3);
        } else {
          setActiveStep(2);
        }
        setIsAgentReasoning(false);
        return;
      }
    } catch (err) {
      console.warn('[AI Agent intake fallback to local regex]:', err);
    } finally {
      setIsAgentReasoning(false);
    }

    // Local fallback if server is unreachable
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
                aria-label={`Go to step ${s}`}
                aria-current={activeStep === s ? 'step' : undefined}
                tabIndex={0}
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
                  aria-label={isListening ? "Stop Voice Input" : "Start Voice Input"}
                  aria-pressed={isListening}
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
                <div role="alert" aria-live="assertive" style={{ fontSize: '0.8rem', color: '#b91c1c', padding: '0.35rem 0.5rem', background: '#fee2e2', borderRadius: '6px' }}>
                  {speechError}
                </div>
              )}

              {interimText && (
                <div aria-live="polite" style={{ fontSize: '0.86rem', color: 'var(--brand-teal)', fontStyle: 'italic' }}>
                  "{interimText}"
                </div>
              )}
            </div>

            {/* Agent Thought Trace Visualizer */}
            {agentTrace && (
              <AgentThoughtTrace 
                trace={agentTrace} 
                executionTimeMs={traceExecutionTime} 
                isProcessing={isAgentReasoning} 
                lang={lang} 
              />
            )}

            {/* AI Agent Follow-up Clarification Box */}
            {clarificationPrompt && (
              <div 
                style={{
                  margin: '1rem 0',
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  background: '#fffbeb',
                  border: '1.5px solid #fde68a',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                  boxShadow: '0 2px 8px rgba(245, 158, 11, 0.08)'
                }}
              >
                <HelpCircle size={18} color="#d97706" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '800', fontSize: '0.85rem', color: '#92400e' }}>
                    {lang === 'hi' ? 'एजेंटिक स्पष्टीकरण प्रश्न (AI Clarification):' : 'AI Caseworker Follow-up Question:'}
                  </div>
                  <p style={{ margin: '0.25rem 0 0.5rem', fontSize: '0.84rem', color: '#78350f', lineHeight: '1.4' }}>
                    {clarificationPrompt}
                  </p>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <button 
                      type="button" 
                      onClick={() => {
                        setProfile(prev => ({ ...prev, isSC: true, category: 'SC' }));
                        setClarificationPrompt(null);
                      }}
                      style={{ padding: '0.3rem 0.75rem', borderRadius: '6px', background: '#fef3c7', border: '1px solid #f59e0b', fontSize: '0.78rem', fontWeight: '700', color: '#92400e', cursor: 'pointer' }}
                    >
                      {lang === 'hi' ? 'हाँ, अनुसूचित जाति (SC)' : 'Yes, SC Category'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        setProfile(prev => ({ ...prev, isSC: false, category: 'OBC' }));
                        setClarificationPrompt(null);
                      }}
                      style={{ padding: '0.3rem 0.75rem', borderRadius: '6px', background: '#fef3c7', border: '1px solid #f59e0b', fontSize: '0.78rem', fontWeight: '700', color: '#92400e', cursor: 'pointer' }}
                    >
                      {lang === 'hi' ? 'अन्य पिछड़ा वर्ग (OBC)' : 'OBC Category'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setClarificationPrompt(null)}
                      style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', background: 'transparent', border: 'none', fontSize: '0.78rem', color: '#94a3b8', cursor: 'pointer' }}
                    >
                      {lang === 'hi' ? 'छोड़ें' : 'Skip'}
                    </button>
                  </div>
                </div>
              </div>
            )}

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
                aria-label="Type enterprise or venture details here"
              />
            </div>



            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="btn-solid-primary"
                id="step1-continue-btn"
                aria-label="Continue to Capital Requirement step"
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
                aria-label="Select Project Cost"
                aria-valuenow={profile?.projectCost || 100000}
                aria-valuemin="10000"
                aria-valuemax="2500000"
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

            {/* === SOCIAL CATEGORY SELECTOR GRID === */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: '700', fontSize: '0.92rem', color: '#334155', marginBottom: '0.6rem' }}>
                {t.socialCatLabel}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.6rem', marginBottom: '0.75rem' }}>
                {[
                  { key: 'SC', label: 'SC', emoji: '🟣', desc: 'Scheduled Caste' },
                  { key: 'ST', label: 'ST', emoji: '🟤', desc: 'Scheduled Tribe' },
                  { key: 'OBC', label: 'OBC', emoji: '🟠', desc: 'Other Backward Class' },
                  { key: 'Minority', label: 'Minority', emoji: '🟢', desc: 'Religious Minority' },
                  { key: 'General', label: 'General', emoji: '⚪', desc: 'General Category' }
                ].map(cat => {
                  const isSelected = profile?.socialCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => {
                        setProfile({
                          ...profile,
                          socialCategory: cat.key,
                          isSC: cat.key === 'SC',
                          isST: cat.key === 'ST',
                          isOBC: cat.key === 'OBC',
                          isMinority: cat.key === 'Minority'
                        });
                      }}
                      id={`social-cat-${cat.key}`}
                      aria-pressed={isSelected}
                      aria-label={`${cat.label}, ${cat.desc}`}
                      style={{
                        padding: '0.85rem 0.6rem',
                        borderRadius: '10px',
                        border: isSelected ? '2.5px solid var(--brand-teal)' : '1.5px solid #cbd5e1',
                        background: isSelected ? '#f0fdfa' : '#ffffff',
                        color: isSelected ? 'var(--brand-navy)' : '#475569',
                        fontWeight: '700',
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? '0 2px 8px rgba(19, 78, 74, 0.15)' : 'none'
                      }}
                    >
                      <div style={{ fontSize: '1.3rem', marginBottom: '0.2rem' }} aria-hidden="true">{cat.emoji}</div>
                      <div style={{ fontWeight: '800' }}>{cat.label}</div>
                      <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '0.1rem' }}>{cat.desc}</div>
                    </button>
                  );
                })}
              </div>

              <div style={{ fontSize: '0.78rem', color: '#64748b', background: '#f8fafc', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0', lineHeight: '1.5' }}>
                ℹ️ {t.socialCatNote}
              </div>
            </div>

            {/* === PWD & EX-SERVICEPERSON CHECKBOXES === */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem', padding: '1rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.88rem', fontWeight: '600', color: '#334155' }}>
                <input
                  type="checkbox"
                  checked={profile?.isPWD || false}
                  onChange={(e) => setProfile({ ...profile, isPWD: e.target.checked })}
                  id="pwd-checkbox"
                  aria-label="Person with Disability (PWD)"
                  style={{ width: '18px', height: '18px', accentColor: 'var(--brand-teal)' }}
                />
                <span aria-hidden="true">♿</span> {t.pwdLabel}
              </label>
              {profile?.isPWD && (
                <div style={{ fontSize: '0.75rem', color: '#059669', marginLeft: '2rem', fontWeight: '600' }}>
                  ✓ {t.pwdNote}
                </div>
              )}

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.88rem', fontWeight: '600', color: '#334155' }}>
                <input
                  type="checkbox"
                  checked={profile?.isExServiceperson || false}
                  onChange={(e) => setProfile({ ...profile, isExServiceperson: e.target.checked })}
                  id="ex-service-checkbox"
                  aria-label="Ex-Serviceperson"
                  style={{ width: '18px', height: '18px', accentColor: 'var(--brand-teal)' }}
                />
                <span aria-hidden="true">🎖️</span> {t.exServiceLabel}
              </label>
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
                aria-label="Annual Family Income"
                aria-valuenow={profile?.annualIncome || 180000}
                aria-valuemin="50000"
                aria-valuemax="1200000"
                style={{ width: '100%', height: '8px', accentColor: '#10b981', cursor: 'pointer', margin: '0.5rem 0' }}
              />

              <div aria-live="polite" style={{ fontSize: '0.78rem', color: '#64748b' }}>
                {(profile?.socialCategory === 'SC' || profile?.socialCategory === 'ST') && profile?.annualIncome > 300000 ? (
                  <span style={{ color: '#dc2626', fontWeight: '700' }}>⚠️ NSFDC schemes require annual family income ≤ ₹3,00,000. Your current income ({`₹${Number(profile?.annualIncome).toLocaleString('en-IN')}`}) exceeds this limit. Universal schemes (MUDRA, PMEGP) are still available.</span>
                ) : (
                  <span>ℹ️ NSFDC schemes: income ≤ ₹3L for SC/ST. Universal schemes (MUDRA, PMEGP) have no income ceiling.</span>
                )}
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
                  aria-pressed={profile?.isRural !== false}
                  aria-label="Rural or Village Area"
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
                  <span aria-hidden="true">🌾</span> {t.rural}
                </button>
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, isRural: false })}
                  id="loc-urban-btn"
                  aria-pressed={profile?.isRural === false}
                  aria-label="Urban or Municipal Area"
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
                  <span aria-hidden="true">🏙️</span> {t.urban}
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
                  aria-pressed={profile?.gender === 'female'}
                  aria-label="Female applicant"
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
                  <span aria-hidden="true">👩</span> {t.femaleRebate}
                </button>
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, gender: 'male' })}
                  id="gender-male-btn"
                  aria-pressed={profile?.gender === 'male'}
                  aria-label="Male applicant"
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
                  <span aria-hidden="true">👨</span> {t.male}
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
                aria-label="Continue to Applicant Profile step"
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
                aria-label="Applicant Legal Name"
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
                    aria-pressed={profile?.district === loc.district}
                    aria-label={`Select district ${loc.label}`}
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
                    <span aria-hidden="true">📍</span> {loc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Privacy & Consent */}
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer', fontSize: '0.82rem', color: '#475569', lineHeight: 1.4 }}>
                <input
                  type="checkbox"
                  required
                  id="data-consent-checkbox"
                  aria-label="I consent to the Privacy Policy"
                  style={{ width: '16px', height: '16px', accentColor: 'var(--brand-teal)', marginTop: '2px' }}
                />
                <span>
                  I consent to sharing my demographic details for scheme matching. No data is shared with third parties. <a href="#" style={{ color: 'var(--brand-teal)', textDecoration: 'underline' }}>Privacy Policy</a>.
                </span>
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.75rem', color: '#10b981', fontWeight: '600' }}>
                <ShieldCheck size={14} /> 256-bit Encrypted • Zero Data Retention Demo
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
