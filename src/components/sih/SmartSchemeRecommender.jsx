import React, { useState } from 'react';
import { 
  Compass, Sparkles, AlertCircle, CheckCircle2, ChevronRight, 
  HelpCircle, Volume2, ShieldCheck, IndianRupee, BookOpen, 
  Building2, GraduationCap, Briefcase, RefreshCw, ArrowRight, BadgeCheck 
} from 'lucide-react';

/**
 * Multi-lingual translations for accessibility across marginalized demographic
 */
const I18N = {
  en: {
    badge: "Smart India Hackathon • SIH26092",
    title: "AI Smart Scheme Recommender",
    subtitle: "Find tailored concessional government financial schemes covering up to 90% of project costs.",
    projectTypeLabel: "1. What is your Project Type?",
    costLabel: "2. Estimated Project Cost (₹)",
    incomeLabel: "3. Annual Family Income (₹)",
    educationLabel: "4. Applicant's Highest Education Status",
    casteLabel: "Target Community Affirmation",
    scConfirmed: "I belong to Scheduled Caste (SC) community (Eligible for NSFDC)",
    calculateBtn: "Find Concessional Schemes",
    analyzing: "Analyzing Policy Rules...",
    incomeAlert: "Note: NSFDC sovereign concessional loans require annual family income ≤ ₹5,00,000.",
    ninetyPercentTag: "Up to 90% Concessional Funding",
    tenPercentTag: "Small Beneficiary Contribution (as per scheme)",
    matchedHeading: "Best-Fit Concessional Scheme Recommended",
    confidence: "Eligibility Confidence",
    effectiveRate: "Concessional Interest Rate",
    moratorium: "Moratorium Period",
    repaymentTenure: "Repayment Tenure",
    cadence: "Cadence",
    rationaleHeading: "AI Matching Rationale & Verification",
    continueToCalculator: "Calculate Detailed EMI & Savings",
    speakBtn: "Read Form Aloud (Hindi/English Voice)"
  },
  hi: {
    badge: "स्मार्ट इंडिया हैकाथॉन • SIH26092",
    title: "एआई योजना सिफारिश प्रणाली",
    subtitle: "अनुसूचित जाति के उद्यमियों हेतु 90% तक रियायती सरकारी ऋण व शिक्षा सहायता योजनाएं खोजें।",
    projectTypeLabel: "1. आपकी परियोजना का प्रकार क्या है?",
    costLabel: "2. अनुमानित परियोजना लागत (₹)",
    incomeLabel: "3. परिवार की वार्षिक आय (₹)",
    educationLabel: "4. आवेदक की उच्चतम शैक्षणिक योग्यता",
    casteLabel: "लक्षित समुदाय सत्यापन",
    scConfirmed: "मैं अनुसूचित जाति (SC) समुदाय से हूँ (NSFDC हेतु पात्र)",
    calculateBtn: "रियायती योजनाएं खोजें",
    analyzing: "नीति नियमों का विश्लेषण हो रहा है...",
    incomeAlert: "ध्यान दें: NSFDC रियायती ऋणों हेतु वार्षिक पारिवारिक आय ₹5,00,000 या उससे कम होनी चाहिए।",
    ninetyPercentTag: "90% रियायती सरकारी ऋण",
    tenPercentTag: "10% स्वयं का अंशदान",
    matchedHeading: "आपके लिए सर्वश्रेष्ठ रियायती योजना",
    confidence: "पात्रता विश्वास",
    effectiveRate: "रियायती ब्याज दर",
    moratorium: "ऋण स्थगन (मोरटोरियम) अवधि",
    repaymentTenure: "चुकौती अवधि",
    cadence: "किस्त आवृत्ति",
    rationaleHeading: "एआई पात्रता विश्लेषण व सत्यापन कारण",
    continueToCalculator: "विस्तृत EMI व बचत देखें",
    speakBtn: "फॉर्म को बोलकर सुनें (ऑडियो सहायता)"
  }
};

const PROJECT_TYPES = [
  { id: 'MICRO_ENTERPRISE', labelEn: 'Micro Enterprise / Small Business', labelHi: 'लघु उद्यम / दुकान / हस्तशिल्प', icon: Briefcase, maxSuggested: 140000 },
  { id: 'COMMERCIAL_INDUSTRIAL', labelEn: 'Commercial & Transport Unit', labelHi: 'व्यावसायिक व औद्योगिक प्रोजेक्ट', icon: Building2, maxSuggested: 5000000 },
  { id: 'EDUCATION', labelEn: 'Higher / Technical Education', labelHi: 'उच्च एवं तकनीकी शिक्षा', icon: GraduationCap, maxSuggested: 4000000 }
];

const EDUCATION_LEVELS = [
  { id: 'BELOW_8TH', labelEn: 'Below 8th Pass', labelHi: '8वीं से कम' },
  { id: '8TH_TO_10TH', labelEn: '8th to 10th Pass', labelHi: '8वीं से 10वीं पास' },
  { id: '10TH_TO_12TH', labelEn: '10th to 12th Pass', labelHi: '10वीं से 12वीं पास' },
  { id: 'DIPLOMA', labelEn: 'ITI / Polytechnic Diploma', labelHi: 'डिप्लोमा / आईटीआई' },
  { id: 'GRADUATE', labelEn: 'Graduate / Degree Holder', labelHi: 'स्नातक (Graduate)' },
  { id: 'PROFESSIONAL', labelEn: 'Professional / Technical Degree', labelHi: 'इंजीनियरिंग / मेडिकल / प्रबंधन' }
];

export function SmartSchemeRecommender({ onSchemeMatched, onSelectSchemeForCalculator, defaultLang = 'en' }) {
  const [lang, setLang] = useState(defaultLang);
  const t = I18N[lang] || I18N.en;

  // Form State
  const [projectType, setProjectType] = useState('MICRO_ENTERPRISE');
  const [estimatedCost, setEstimatedCost] = useState(120000);
  const [incomeLevel, setIncomeLevel] = useState(180000);
  const [educationStatus, setEducationStatus] = useState('8TH_TO_10TH');
  const [isSC, setIsSC] = useState(true);
  const [gender, setGender] = useState('female');
  
  // Async API State
  const [loading, setLoading] = useState(false);
  const [recommendationResult, setRecommendationResult] = useState(null);
  const [apiError, setApiError] = useState(null);

  // Audio accessibility synthesis
  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = lang === 'hi' 
        ? `योजना सिफारिश फॉर्म। अनुमानित लागत ₹${estimatedCost}, वार्षिक आय ₹${incomeLevel}। 90% तक सरकारी ऋण उपलब्ध है।`
        : `Scheme Recommender Form. Estimated cost is ₹${estimatedCost}, annual income is ₹${incomeLevel}. Up to 90% concessional government loan is available.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleQuickCost = (val) => {
    setEstimatedCost(val);
    if (val <= 140000) setProjectType('MICRO_ENTERPRISE');
    else setProjectType('COMMERCIAL_INDUSTRIAL');
  };

  const handleFindSchemes = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setApiError(null);

    try {
      const response = await fetch('/api/v2/recommender/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectType,
          estimatedCost,
          incomeLevel,
          educationStatus,
          casteCategory: isSC ? 'SC' : 'GENERAL',
          gender
        })
      });

      const data = await response.json();
      if (!response.ok || data.status !== 'SUCCESS') {
        throw new Error(data.message || 'Failed to match schemes');
      }

      setRecommendationResult(data);
      if (onSchemeMatched && data.primaryRecommendation) {
        onSchemeMatched(data.primaryRecommendation);
      }
    } catch (err) {
      console.error('[Recommender Error]', err);
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const primary = recommendationResult?.primaryRecommendation;

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 shadow-2xl text-slate-100 font-sans">
      {/* Header bar with Language Toggle and Audio Assist */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            {t.badge}
          </span>
          <h2 className="text-2xl md:text-3xl font-black mt-2 text-white tracking-tight">
            {t.title}
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            {t.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSpeak}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 transition"
            title={t.speakBtn}
          >
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">{t.speakBtn}</span>
          </button>

          {/* Vernacular Language Selector */}
          <div className="flex rounded-xl bg-slate-800 p-1 border border-white/10">
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition ${lang === 'en' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang('hi')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition ${lang === 'hi' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              हिन्दी
            </button>
          </div>
        </div>
      </div>

      {/* Main Intake Form */}
      <form onSubmit={handleFindSchemes} className="space-y-6 pt-6">
        {/* Field 1: Project Type Selection */}
        <div>
          <label className="block text-sm font-bold text-slate-200 mb-2">
            {t.projectTypeLabel}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PROJECT_TYPES.map((pt) => {
              const Icon = pt.icon;
              const isSelected = projectType === pt.id;
              return (
                <button
                  type="button"
                  key={pt.id}
                  onClick={() => {
                    setProjectType(pt.id);
                    if (pt.id === 'MICRO_ENTERPRISE' && estimatedCost > 140000) setEstimatedCost(120000);
                    if (pt.id === 'EDUCATION' && estimatedCost < 100000) setEstimatedCost(500000);
                  }}
                  className={`flex flex-col items-start p-4 rounded-2xl border text-left transition ${
                    isSelected 
                      ? 'bg-orange-500/15 border-orange-500 text-white shadow-lg shadow-orange-500/10' 
                      : 'bg-slate-800/60 border-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-orange-400' : 'text-slate-500'}`} />
                  <span className="text-sm font-bold text-white">{lang === 'hi' ? pt.labelHi : pt.labelEn}</span>
                  <span className="text-xs text-slate-400 mt-1">Up to ₹{(pt.maxSuggested / 100000).toFixed(1)} Lakhs</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Field 2: Estimated Cost (Slider + Number Input + Quick Chips) */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold text-slate-200">
              {t.costLabel}
            </label>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 border border-white/10 text-orange-400 font-mono font-bold text-lg">
              <IndianRupee className="w-4 h-4" />
              <span>{Number(estimatedCost).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <input
            type="range"
            min={10000}
            max={projectType === 'MICRO_ENTERPRISE' ? 140000 : 5000000}
            step={projectType === 'MICRO_ENTERPRISE' ? 5000 : 25000}
            value={estimatedCost}
            onChange={(e) => setEstimatedCost(Number(e.target.value))}
            className="w-full accent-orange-500 cursor-pointer h-2 bg-slate-700 rounded-lg"
          />

          {/* Quick Preset Buttons for Rapid Tap */}
          <div className="flex flex-wrap gap-2 mt-3">
            {[50000, 100000, 140000, 500000, 1500000, 3000000].map((preset) => (
              <button
                type="button"
                key={preset}
                onClick={() => handleQuickCost(preset)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border transition ${
                  estimatedCost === preset 
                    ? 'bg-orange-500 text-white border-orange-400' 
                    : 'bg-slate-800/80 text-slate-300 border-white/10 hover:border-white/30'
                }`}
              >
                ₹{(preset / 100000).toFixed(preset >= 100000 ? 1 : 2)}L
              </button>
            ))}
          </div>

          {/* 90% Loan vs 10% Equity Sovereign Preview Pill */}
          <div className="grid grid-cols-2 gap-3 mt-3 p-3 rounded-2xl bg-slate-800/40 border border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
              <div>
                <span className="text-xs text-slate-400 block">{t.ninetyPercentTag}</span>
                <span className="text-sm font-bold text-emerald-400">
                  ₹{Math.round(estimatedCost * 0.90).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
              <div>
                <span className="text-xs text-slate-400 block">{t.tenPercentTag}</span>
                <span className="text-sm font-bold text-amber-400">
                  ₹{Math.round(estimatedCost * 0.10).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Field 3: Annual Family Income */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold text-slate-200">
              {t.incomeLabel}
            </label>
            <span className={`font-mono text-sm font-bold ${incomeLevel > 500000 ? 'text-rose-400' : 'text-slate-200'}`}>
              ₹{Number(incomeLevel).toLocaleString('en-IN')} / year
            </span>
          </div>

          <input
            type="range"
            min={30000}
            max={700000}
            step={10000}
            value={incomeLevel}
            onChange={(e) => setIncomeLevel(Number(e.target.value))}
            className="w-full accent-orange-500 cursor-pointer h-2 bg-slate-700 rounded-lg"
          />

          {incomeLevel > 500000 ? (
            <div className="flex items-center gap-2 p-3 mt-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Income exceeds ₹5,00,000 threshold. Universal schemes (Stand-Up India / MUDRA) will be recommended.</span>
            </div>
          ) : (
            <p className="text-xs text-slate-400 mt-1.5">
              {t.incomeAlert}
            </p>
          )}
        </div>

        {/* Field 4: Education Qualification */}
        <div>
          <label className="block text-sm font-bold text-slate-200 mb-2">
            {t.educationLabel}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {EDUCATION_LEVELS.map((edu) => (
              <button
                type="button"
                key={edu.id}
                onClick={() => setEducationStatus(edu.id)}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition ${
                  educationStatus === edu.id
                    ? 'bg-orange-500 text-white border-orange-400'
                    : 'bg-slate-800/70 text-slate-300 border-white/5 hover:border-white/20'
                }`}
              >
                {lang === 'hi' ? edu.labelHi : edu.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Transparency note: what happens with the answers (DPDP data minimization) */}
        <p className="rounded-xl border border-white/10 bg-slate-800/50 px-3.5 py-2.5 text-[11px] leading-relaxed text-slate-400">
          <b className="text-slate-300">How your answers are used:</b> they are checked instantly on this device to shortlist schemes and are never shared, sold, or used for ads. We do not ask for documents, bank details, or ID numbers. Nothing is stored unless you choose to save a summary.
        </p>

        {/* Affirmative SC Community Verification Checkbox */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/20">
          <input
            type="checkbox"
            id="scCheckbox"
            checked={isSC}
            onChange={(e) => setIsSC(e.target.checked)}
            className="w-5 h-5 rounded text-emerald-500 accent-emerald-500 cursor-pointer"
          />
          <label htmlFor="scCheckbox" className="text-xs sm:text-sm text-emerald-200 cursor-pointer">
            <span className="font-bold text-white block">{t.casteLabel}</span>
            {t.scConfirmed}
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-base shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer transition transform active:scale-[0.99]"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>{t.analyzing}</span>
            </>
          ) : (
            <>
              <Compass className="w-5 h-5" />
              <span>{t.calculateBtn}</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      {/* API Error Notification */}
      {apiError && (
        <div className="mt-6 p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      {/* Recommendation Results Display */}
      {primary && (
        <div className="mt-8 p-6 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-800/80 to-slate-900 border border-emerald-500/30 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {t.matchedHeading}
              </span>
              <h3 className="text-xl md:text-2xl font-black text-white mt-1">
                {lang === 'hi' ? primary.schemeNameHindi : primary.schemeName}
              </h3>
              <span className="text-xs text-slate-400">Scheme Code: {primary.schemeCode}</span>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block">{t.confidence}</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {primary.matchConfidence}%
              </span>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5">
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5">
              <span className="text-xs text-slate-400 block">Eligible Loan (90%)</span>
              <span className="text-base font-bold text-white font-mono">
                ₹{primary.eligibleLoanAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5">
              <span className="text-xs text-slate-400 block">{t.effectiveRate}</span>
              <span className="text-base font-bold text-orange-400 font-mono">
                {primary.effectiveInterestRate}% p.a.
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5">
              <span className="text-xs text-slate-400 block">{t.moratorium}</span>
              <span className="text-base font-bold text-white font-mono">
                {primary.recommendedMoratoriumMonths} Months
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5">
              <span className="text-xs text-slate-400 block">{t.repaymentTenure}</span>
              <span className="text-base font-bold text-white font-mono">
                {primary.defaultTenureYears} Years ({primary.cadence})
              </span>
            </div>
          </div>

          {/* Zero-Hallucination Provenance Badge */}
          {primary.officialSourceUrl && (
            <a
              href={primary.officialSourceUrl}
              target="_blank"
              rel="noreferrer"
              className="flex flex-wrap items-center gap-x-2 gap-y-1 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-[11px] text-emerald-300 hover:bg-emerald-500/20 transition mb-4"
              title={primary.sourceQuote}
            >
              <BadgeCheck className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
              <span className="font-bold">Verified on {primary.lastVerifiedAt ? new Date(primary.lastVerifiedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'official record'}</span>
              <span className="text-emerald-500/70">•</span>
              <span className="truncate max-w-[240px] sm:max-w-xs">Source: {primary.sourceQuote}</span>
              <span className="ml-auto px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold shrink-0">{primary.policyVersion}</span>
            </a>
          )}

          {/* AI Matching Rationale */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {t.rationaleHeading}
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {primary.rationale.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Button to pass data to Calculator */}
          {onSelectSchemeForCalculator && (
            <button
              type="button"
              onClick={() => onSelectSchemeForCalculator(primary)}
              className="w-full py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition"
            >
              <span>{t.continueToCalculator}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default SmartSchemeRecommender;
