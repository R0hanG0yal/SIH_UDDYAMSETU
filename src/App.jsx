import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroLanding } from './components/HeroLanding';
import { TapeRollCarousel } from './components/TapeRollCarousel';
import { GalleryScroll } from './components/GalleryScroll';
import { FeatureWheel } from './components/FeatureWheel';
import { Shader3DMagazine } from './components/Shader3DMagazine';
import { DemoStoryBanner } from './components/DemoStoryBanner';
import { VoiceIntake } from './components/VoiceIntake';
import { SchemeMatchView } from './components/SchemeMatchView';
import { RepaymentPlanner } from './components/RepaymentPlanner';
import { PartnerPulseMap } from './components/PartnerPulseMap';
import { DocumentAuditor } from './components/DocumentAuditor';
import { LoanFitPassport } from './components/LoanFitPassport';
import { OfficerScanPortal } from './components/OfficerScanPortal';
import { AdminPolicyStudio } from './components/AdminPolicyStudio';
import { FAQAssistant } from './components/FAQAssistant';
import { matchSchemesApi } from './services/api';
import { evaluateNationalSchemes } from '../server/engines/eligibilityEngine';
import { NATIONAL_PARTNERS } from '../server/data/partnerNetwork';
import { CheckCircle2, RotateCcw } from 'lucide-react';

export function App() {
  const [lang, setLang] = useState('en');
  const [activeTab, setActiveTab] = useState('journey');
  const [journeyStep, setJourneyStep] = useState(0); // 0 = Hero Landing
  const [isCscMode, setIsCscMode] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [activeScenarioId, setActiveScenarioId] = useState(null);

  // Citizen Profile State (Default clean interactive profile)
  const [profile, setProfile] = useState({
    applicantName: '',
    purpose: 'business',
    categoryName: '',
    projectCost: 100000,
    annualIncome: 180000,
    socialCategory: 'General',
    isSC: false,
    gender: 'female',
    isRural: true,
    isConstructionOrPlantation: false,
    district: 'Lucknow',
    state: 'Uttar Pradesh'
  });

  // Multi-scheme match evaluation state
  const [matchEvaluation, setMatchEvaluation] = useState(null);
  const [selectedScheme, setSelectedScheme] = useState(null);

  // Document checklist state (Starts clean without fake pre-checks)
  const [documents, setDocuments] = useState({
    aadhaar: false,
    pan: false,
    dpr: false,
    bank_passbook: false,
    quotation: false
  });

  // Selected Channel Partner
  const [selectedPartner, setSelectedPartner] = useState(() => {
    return NATIONAL_PARTNERS.find(p => p.id === 'PARTNER-SBI-01') || NATIONAL_PARTNERS[0];
  });

  // Toggle High Contrast
  useEffect(() => {
    if (isHighContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [isHighContrast]);

  // Compute live multi-scheme evaluation via backend API (with client-side fallback)
  useEffect(() => {
    let isMounted = true;
    matchSchemesApi(profile)
      .then(res => {
        if (isMounted && res.evaluation) {
          setMatchEvaluation(res.evaluation);
          if (!selectedScheme && res.evaluation.matchedSchemes?.length > 0) {
            setSelectedScheme(res.evaluation.matchedSchemes[0]);
          }
        }
      })
      .catch(() => {
        // Fallback to internal engine if server is unreachable
        if (isMounted) {
          const evalResult = evaluateNationalSchemes(profile);
          setMatchEvaluation(evalResult);
          if (!selectedScheme && evalResult.matchedSchemes?.length > 0) {
            setSelectedScheme(evalResult.matchedSchemes[0]);
          }
        }
      });

    return () => { isMounted = false; };
  }, [profile]);

  // Reset to clean application
  const handleStartNewApplication = () => {
    setProfile({
      applicantName: '',
      purpose: 'business',
      categoryName: '',
      projectCost: 100000,
      annualIncome: 180000,
      socialCategory: 'General',
      isSC: false,
      gender: 'female',
      isRural: true,
      isConstructionOrPlantation: false,
      district: 'Lucknow',
      state: 'Uttar Pradesh'
    });
    setDocuments({
      aadhaar: false,
      pan: false,
      dpr: false,
      bank_passbook: false,
      quotation: false
    });
    setSelectedScheme(null);
    setJourneyStep(0);
    setActiveScenarioId(null);
  };

  // 1-Click Scenario Trigger for Quick Evaluator Testing
  const handleSelectScenario = (scenarioId, payload) => {
    setActiveScenarioId(scenarioId);
    const updatedProfile = {
      applicantName: payload.applicantName || '',
      purpose: payload.purpose,
      categoryName: payload.categoryName,
      projectCost: payload.projectCost,
      annualIncome: payload.annualIncome,
      socialCategory: payload.isSC ? 'SC' : 'General',
      isSC: payload.isSC,
      gender: payload.gender,
      isRural: payload.isRural !== undefined ? payload.isRural : true,
      isConstructionOrPlantation: Boolean(payload.isConstructionOrPlantation),
      district: payload.district,
      state: payload.state
    };
    setProfile(updatedProfile);

    if (payload.documents) {
      setDocuments(payload.documents);
    }

    const evalResult = evaluateNationalSchemes(updatedProfile);
    setMatchEvaluation(evalResult);
    if (evalResult.matchedSchemes.length > 0) {
      setSelectedScheme(evalResult.matchedSchemes[0]);
    }

    setActiveTab('journey');
    setJourneyStep(2);
  };

  const handleSelectSchemeAndProceed = (scheme) => {
    setSelectedScheme(scheme);
    setJourneyStep(3);
  };

  // Hero CTA handler — transitions from hero landing to Step 1
  const handleHeroGetStarted = () => {
    setJourneyStep(1);
    // Smooth scroll to top of main content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const journeySteps = [
    { num: 1, label: lang === 'hi' ? '1. उद्यम' : '1. Venture' },
    { num: 2, label: lang === 'hi' ? '2. योजनाएं' : '2. Schemes' },
    { num: 3, label: lang === 'hi' ? '3. किस्त' : '3. Repayment' },
    { num: 4, label: lang === 'hi' ? '4. बैंक' : '4. Bank' },
    { num: 5, label: lang === 'hi' ? '5. दस्तावेज़' : '5. Documents' },
    { num: 6, label: lang === 'hi' ? '6. पासपोर्ट' : '6. Passport' }
  ];

  const activeSchemeForPlanner = selectedScheme || (matchEvaluation?.matchedSchemes?.[0]) || {
    id: "GOI_PMEGP",
    name: "Prime Minister's Employment Generation Programme (PMEGP)",
    maxFundingPercent: 90,
    maxLoanAmount: 5000000,
    interestRatePercent: 9.0,
    moratoriumMonths: 6,
    repaymentCadence: 'quarterly',
    totalRepaymentTenureYears: 7
  };

  return (
    <div className="app-container">
      {/* Ambient Liquid Glowing Orbs */}
      <div className="ambient-liquid-bg">
        <div className="liquid-orb liquid-orb-1"></div>
        <div className="liquid-orb liquid-orb-2"></div>
        <div className="liquid-orb liquid-orb-3"></div>
      </div>

      {/* Slim Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          // When navigating to journey tab, keep current step (don't reset to hero)
        }}
        lang={lang}
        setLang={setLang}
        isCscMode={isCscMode}
        setIsCscMode={setIsCscMode}
        isHighContrast={isHighContrast}
        setIsHighContrast={setIsHighContrast}
      />

      <main className="main-content">
        {/* CSC Assisted Banner if Active */}
        {isCscMode && (
          <div className="csc-banner">
            <span>🏢 <strong>CSC Kiosk Mode Active</strong> — High-contrast enabled. Paperless intake on.</span>
            <button onClick={() => setIsCscMode(false)} className="csc-banner-close">Close</button>
          </div>
        )}

        {/* TAB 1: CITIZEN JOURNEY */}
        {activeTab === 'journey' && (
          <div>
            {/* Step 0: Hero Landing — shown only on first visit */}
            {journeyStep === 0 && (
              <HeroLanding
                onGetStarted={handleHeroGetStarted}
                lang={lang}
              />
            )}

            {/* Steps 1-6: Active journey — show stepper only when past hero */}
            {journeyStep >= 1 && (
              <>
                {/* Clean Minimal Stepper Navigation */}
                <div className="stepper-nav">
                  {journeySteps.map((step) => {
                    const isActive = journeyStep === step.num;
                    const isCompleted = journeyStep > step.num;
                    return (
                      <button
                        key={step.num}
                        type="button"
                        onClick={() => setJourneyStep(step.num)}
                        id={`stepper-tab-${step.num}`}
                        className={`stepper-btn ${isActive ? 'active' : isCompleted ? 'completed' : ''}`}
                      >
                        {isCompleted ? <CheckCircle2 size={15} color="#10b981" /> : null}
                        <span>{step.label}</span>
                      </button>
                    );
                  })}

                  {/* Start Over button — subtle reset */}
                  <button
                    type="button"
                    onClick={handleStartNewApplication}
                    className="stepper-btn stepper-reset-btn"
                    title="Start new application"
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
              </>
            )}

            {/* Step 1: Trade Selection + Intake (no more FeatureWheel) */}
            {journeyStep === 1 && (
              <div>
                {/* Horizontal Trade Showcase (1-Click Selector) */}
                <GalleryScroll
                  onSelectCategory={(catName) => {
                    setProfile(prev => ({ ...prev, categoryName: catName }));
                  }}
                  currentCategory={profile.categoryName}
                />

                {/* Progressive 4-Step Intake */}
                <VoiceIntake
                  profile={profile}
                  setProfile={setProfile}
                  onProceedToMatch={() => setJourneyStep(2)}
                  lang={lang}
                />
              </div>
            )}

            {/* Step 2: Multi-Scheme Matching + Tape Roll context */}
            {journeyStep === 2 && (
              <div>
                {/* Tape Roll ticker — relevant at scheme stage */}
                <TapeRollCarousel />

                <SchemeMatchView
                  matchEvaluation={matchEvaluation}
                  profile={profile}
                  onSelectSchemeAndProceed={handleSelectSchemeAndProceed}
                  lang={lang}
                />
              </div>
            )}

            {/* Step 3: Repayment Planner (Financial Dignity Calculator) */}
            {journeyStep === 3 && (
              <RepaymentPlanner
                scheme={activeSchemeForPlanner}
                projectCost={profile.projectCost}
                profile={profile}
                onProceedToPartnerRouting={() => setJourneyStep(4)}
                lang={lang}
              />
            )}

            {/* Step 4: Partner Pulse Capacity Router */}
            {journeyStep === 4 && (
              <PartnerPulseMap
                scheme={activeSchemeForPlanner}
                selectedPartner={selectedPartner}
                setSelectedPartner={setSelectedPartner}
                onProceedToDocuments={() => setJourneyStep(5)}
                lang={lang}
                profile={profile}
              />
            )}

            {/* Step 5: Document Readiness & Real File Uploader */}
            {journeyStep === 5 && (
              <DocumentAuditor
                scheme={activeSchemeForPlanner}
                documents={documents}
                setDocuments={setDocuments}
                onProceedToPassport={() => setJourneyStep(6)}
                lang={lang}
                profile={profile}
              />
            )}

            {/* Step 6: Secured QR Loan Fit Passport */}
            {journeyStep === 6 && (
              <LoanFitPassport
                profile={profile}
                scheme={activeSchemeForPlanner}
                matchResult={matchEvaluation}
                partner={selectedPartner}
                documents={documents}
                onOpenOfficerTerminal={() => setActiveTab('officer')}
                onStartNew={handleStartNewApplication}
                onUpdateName={(newName) => setProfile(prev => ({ ...prev, applicantName: newName }))}
                lang={lang}
              />
            )}
          </div>
        )}

        {/* TAB 2: PARTNER PULSE DIRECTORY */}
        {activeTab === 'pulse' && (
          <PartnerPulseMap
            scheme={activeSchemeForPlanner}
            selectedPartner={selectedPartner}
            setSelectedPartner={setSelectedPartner}
            onProceedToDocuments={() => {
              setActiveTab('journey');
              setJourneyStep(5);
            }}
            lang={lang}
            profile={profile}
          />
        )}

        {/* TAB 3: OFFICER SCAN PORTAL */}
        {activeTab === 'officer' && (
          <OfficerScanPortal
            profile={profile}
            scheme={activeSchemeForPlanner}
            partner={selectedPartner}
            documents={documents}
            lang={lang}
          />
        )}

        {/* TAB 4: POLICY STUDIO & TESTS + FEATURE WHEEL (moved here) */}
        {activeTab === 'admin' && (
          <div>
            <Shader3DMagazine />
            <FeatureWheel />
            <AdminPolicyStudio
              policyOverride={null}
              setPolicyOverride={() => {}}
              lang={lang}
            />
          </div>
        )}

        {/* TAB 5: FAQ & GROUNDED SOURCES + FEATURE WHEEL */}
        {activeTab === 'faq' && (
          <div>
            <Shader3DMagazine />
            <FeatureWheel />
            <FAQAssistant
              lang={lang}
            />
          </div>
        )}
      </main>

      {/* Floating Quick Scenarios — ONLY visible on Admin tab */}
      {activeTab === 'admin' && (
        <DemoStoryBanner
          onSelectScenario={handleSelectScenario}
          activeScenarioId={activeScenarioId}
          lang={lang}
        />
      )}

      {/* Minimal Footer */}
      <footer className="app-footer">
        <div className="app-footer-inner">
          <span className="app-footer-brand">SAARTHI</span>
          <span className="app-footer-sep">•</span>
          <span>Smart India Hackathon 2026</span>
          <span className="app-footer-sep">•</span>
          <span>Government of India</span>
          <span className="app-footer-sep app-footer-hide-mobile">•</span>
          <span className="app-footer-hide-mobile">12+ National Credit Schemes</span>
        </div>
      </footer>
    </div>
  );
}
