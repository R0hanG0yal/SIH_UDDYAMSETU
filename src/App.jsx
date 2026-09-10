import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { HeroLanding } from './components/HeroLanding';
import { GalleryScroll } from './components/GalleryScroll';
import { VoiceIntake } from './components/VoiceIntake';
import { SchemeMatchView } from './components/SchemeMatchView';
import { RepaymentPlanner } from './components/RepaymentPlanner';
import { PartnerPulseMap } from './components/PartnerPulseMap';
import { DocumentAuditor } from './components/DocumentAuditor';
import { LoanFitPassport } from './components/LoanFitPassport';
import { OfficerScanPortal } from './components/OfficerScanPortal';
import { AdminPolicyStudio } from './components/AdminPolicyStudio';
import { FAQAssistant } from './components/FAQAssistant';
import { AIAssistantModal } from './components/AIAssistantModal';
import ParticleConstellation from './components/ParticleConstellation';
import FundingDashboard from './components/FundingDashboard';
import WhatIfLab from './components/WhatIfLab';
import BenchmarkRunner from './components/BenchmarkRunner';
import CalibrationDashboard from './components/CalibrationDashboard';
import DemoPersonas from './components/DemoPersonas';
import HITLPanel from './components/HITLPanel';
import PolicyDiffViewer from './components/PolicyDiffViewer';
import { matchSchemesApi } from './services/api';
import { evaluateNationalSchemes } from '../server/engines/eligibilityEngine';
import { calculateReadinessScore } from '../server/engines/readinessEngine';
import { NATIONAL_PARTNERS } from '../server/data/partnerNetwork';
import { CheckCircle2, RotateCcw, Bot, Sparkles, BarChart3, FlaskConical, Activity, ShieldAlert, FileDiff } from 'lucide-react';

export function App() {
  const [lang, setLang] = useState('en');
  const [activeTab, setActiveTab] = useState('journey');
  const [journeyStep, setJourneyStep] = useState(0);
  const [isCscMode, setIsCscMode] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [activeScenarioId, setActiveScenarioId] = useState(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const [profile, setProfile] = useState({
    applicantName: '',
    purpose: 'business',
    categoryName: '',
    projectCost: 100000,
    annualIncome: 180000,
    socialCategory: 'General',
    isSC: false, isST: false, isOBC: false, isMinority: false,
    isPWD: false, isExServiceperson: false,
    gender: 'female',
    isRural: true,
    isConstructionOrPlantation: false,
    district: 'Lucknow',
    state: 'Uttar Pradesh'
  });

  const [matchEvaluation, setMatchEvaluation] = useState(null);
  const [readinessResult, setReadinessResult] = useState(null);
  const [selectedScheme, setSelectedScheme] = useState(null);

  const [documents, setDocuments] = useState({
    aadhaar: false, pan: false, dpr: false,
    bank_passbook: false, quotation: false
  });

  const [selectedPartner, setSelectedPartner] = useState(() => {
    return NATIONAL_PARTNERS.find(p => p.id === 'PARTNER-SBI-01') || NATIONAL_PARTNERS[0];
  });

  useEffect(() => {
    if (isHighContrast) document.body.classList.add('high-contrast');
    else document.body.classList.remove('high-contrast');
  }, [isHighContrast]);

  // Live multi-scheme evaluation with readiness scoring
  useEffect(() => {
    let isMounted = true;
    matchSchemesApi(profile)
      .then(res => {
        if (isMounted && res.evaluation) {
          setMatchEvaluation(res.evaluation);
          if (!selectedScheme && res.evaluation.matchedSchemes?.length > 0) {
            setSelectedScheme(res.evaluation.matchedSchemes[0]);
          }
          // Calculate readiness score
          const readiness = calculateReadinessScore(profile, res.evaluation, documents, NATIONAL_PARTNERS);
          setReadinessResult(readiness);
        }
      })
      .catch(() => {
        if (isMounted) {
          const evalResult = evaluateNationalSchemes(profile);
          setMatchEvaluation(evalResult);
          if (!selectedScheme && evalResult.matchedSchemes?.length > 0) {
            setSelectedScheme(evalResult.matchedSchemes[0]);
          }
          const readiness = calculateReadinessScore(profile, evalResult, documents, NATIONAL_PARTNERS);
          setReadinessResult(readiness);
        }
      });
    return () => { isMounted = false; };
  }, [profile, documents]);

  const handleStartNewApplication = () => {
    setProfile({
      applicantName: '', purpose: 'business', categoryName: '',
      projectCost: 100000, annualIncome: 180000, socialCategory: 'General',
      isSC: false, isST: false, isOBC: false, isMinority: false,
      isPWD: false, isExServiceperson: false, gender: 'female',
      isRural: true, isConstructionOrPlantation: false,
      district: 'Lucknow', state: 'Uttar Pradesh'
    });
    setDocuments({ aadhaar: false, pan: false, dpr: false, bank_passbook: false, quotation: false });
    setSelectedScheme(null);
    setJourneyStep(0);
    setActiveScenarioId(null);
  };

  const handleSelectScenario = (scenarioId, payload) => {
    setActiveScenarioId(scenarioId);
    const updatedProfile = {
      applicantName: payload.applicantName || '',
      purpose: payload.purpose,
      categoryName: payload.categoryName,
      projectCost: payload.projectCost,
      annualIncome: payload.annualIncome,
      socialCategory: payload.isSC ? 'SC' : payload.isOBC ? 'OBC' : 'General',
      isSC: payload.isSC || false,
      isOBC: payload.isOBC || false,
      gender: payload.gender,
      isRural: payload.isRural !== undefined ? payload.isRural : true,
      isConstructionOrPlantation: Boolean(payload.isConstructionOrPlantation),
      district: payload.district, state: payload.state
    };
    setProfile(updatedProfile);
    if (payload.documents) setDocuments(payload.documents);

    const evalResult = evaluateNationalSchemes(updatedProfile);
    setMatchEvaluation(evalResult);
    if (evalResult.matchedSchemes.length > 0) setSelectedScheme(evalResult.matchedSchemes[0]);

    setActiveTab('journey');
    setJourneyStep(2);
  };

  const handleSelectSchemeAndProceed = (scheme) => {
    setSelectedScheme(scheme);
    setJourneyStep(3);
  };

  const handleHeroGetStarted = () => {
    setJourneyStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateFromAi = (screen) => {
    const navMap = {
      intake: () => { setActiveTab('journey'); setJourneyStep(1); },
      schemes: () => { setActiveTab('journey'); setJourneyStep(2); },
      repayment: () => { setActiveTab('journey'); setJourneyStep(3); },
      partners: () => setActiveTab('pulse'),
      documents: () => { setActiveTab('journey'); setJourneyStep(5); },
      passport: () => { setActiveTab('journey'); setJourneyStep(6); },
      dashboard: () => { setActiveTab('journey'); setJourneyStep(7); },
      whatif: () => setActiveTab('whatif'),
    };
    (navMap[screen] || (() => {}))();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const journeySteps = [
    { num: 1, label: lang === 'hi' ? '1. उद्यम' : '1. Venture' },
    { num: 2, label: lang === 'hi' ? '2. योजनाएं' : '2. Schemes' },
    { num: 3, label: lang === 'hi' ? '3. किस्त' : '3. Repayment' },
    { num: 4, label: lang === 'hi' ? '4. बैंक' : '4. Bank' },
    { num: 5, label: lang === 'hi' ? '5. दस्तावेज़' : '5. Documents' },
    { num: 6, label: lang === 'hi' ? '6. पासपोर्ट' : '6. Passport' },
    { num: 7, label: lang === 'hi' ? '7. डैशबोर्ड' : '7. Dashboard' },
  ];

  const activeSchemeForPlanner = selectedScheme || (matchEvaluation?.matchedSchemes?.[0]) || {
    id: "GOI_PMEGP",
    name: "Prime Minister's Employment Generation Programme (PMEGP)",
    maxFundingPercent: 90, maxLoanAmount: 5000000,
    interestRatePercent: 9.0, moratoriumMonths: 6,
    repaymentCadence: 'quarterly', totalRepaymentTenureYears: 7
  };

  return (
    <div className="app-container">
      {/* Interactive Particle Constellation Background */}
      <ParticleConstellation particleCount={80} connectionDistance={130} interactive={true} />

      {/* Ambient Liquid Gradient Blobs */}
      <div className="ambient-liquid-bg">
        <div className="liquid-orb liquid-orb-1" />
        <div className="liquid-orb liquid-orb-2" />
        <div className="liquid-orb liquid-orb-3" />
      </div>

      {/* Premium Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        isCscMode={isCscMode}
        setIsCscMode={setIsCscMode}
        isHighContrast={isHighContrast}
        setIsHighContrast={setIsHighContrast}
        onOpenAiSahayak={() => setIsAiModalOpen(true)}
      />

      <main className="main-content">
        {/* Prototype Disclaimer */}
        <div className="prototype-disclaimer">
          <span>⚠️ <strong>SIH 2026 Prototype</strong> — This is a student hackathon demo, not an official government service. Scheme data is sourced from published guidelines and may not reflect real-time availability.</span>
        </div>

        {isCscMode && (
          <div className="csc-banner">
            <span>🏢 <strong>CSC Kiosk Mode Active</strong> — High-contrast enabled. Paperless intake on.</span>
            <button onClick={() => setIsCscMode(false)} className="csc-banner-close">Close</button>
          </div>
        )}

        {/* TAB: CITIZEN JOURNEY */}
        {activeTab === 'journey' && (
          <div>
            {journeyStep === 0 && (
              <>
                <HeroLanding onGetStarted={handleHeroGetStarted} lang={lang} />
                {/* Demo Personas - Quick Start Cards */}
                <DemoPersonas
                  onSelectPersona={handleSelectScenario}
                  activePersonaId={activeScenarioId}
                  lang={lang}
                />
              </>
            )}

            {journeyStep >= 1 && (
              <div className="stepper-nav">
                {journeySteps.map((step) => {
                  const isActive = journeyStep === step.num;
                  const isCompleted = journeyStep > step.num;
                  return (
                    <button
                      key={step.num}
                      type="button"
                      onClick={() => setJourneyStep(step.num)}
                      className={`stepper-btn ${isActive ? 'active' : isCompleted ? 'completed' : ''}`}
                    >
                      {isCompleted ? <CheckCircle2 size={15} color="#10b981" /> : null}
                      <span>{step.label}</span>
                    </button>
                  );
                })}
                <button type="button" onClick={handleStartNewApplication} className="stepper-btn stepper-reset-btn" title="Start new application">
                  <RotateCcw size={14} />
                </button>
              </div>
            )}

            {journeyStep === 1 && (
              <div>
                <GalleryScroll
                  onSelectCategory={(catName) => setProfile(prev => ({ ...prev, categoryName: catName }))}
                  currentCategory={profile.categoryName}
                />
                <VoiceIntake
                  profile={profile}
                  setProfile={setProfile}
                  onProceedToMatch={() => setJourneyStep(2)}
                  lang={lang}
                />
              </div>
            )}

            {journeyStep === 2 && (
              <SchemeMatchView
                matchEvaluation={matchEvaluation}
                profile={profile}
                onSelectSchemeAndProceed={handleSelectSchemeAndProceed}
                lang={lang}
              />
            )}

            {journeyStep === 3 && (
              <RepaymentPlanner
                scheme={activeSchemeForPlanner}
                projectCost={profile.projectCost}
                profile={profile}
                onProceedToPartnerRouting={() => setJourneyStep(4)}
                lang={lang}
              />
            )}

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

            {/* Step 7: Funding Dashboard (NEW) */}
            {journeyStep === 7 && (
              <FundingDashboard
                profile={profile}
                matchEvaluation={matchEvaluation}
                readinessResult={readinessResult}
                documents={documents}
                lang={lang}
                onNavigateToWhatIf={() => setActiveTab('whatif')}
                onNavigateToSchemes={() => setJourneyStep(2)}
              />
            )}
          </div>
        )}

        {/* TAB: WHAT-IF LAB */}
        {activeTab === 'whatif' && (
          <WhatIfLab
            profile={profile}
            documents={documents}
            lang={lang}
          />
        )}

        {/* TAB: PARTNER PULSE DIRECTORY */}
        {activeTab === 'pulse' && (
          <PartnerPulseMap
            scheme={activeSchemeForPlanner}
            selectedPartner={selectedPartner}
            setSelectedPartner={setSelectedPartner}
            onProceedToDocuments={() => { setActiveTab('journey'); setJourneyStep(5); }}
            lang={lang}
            profile={profile}
          />
        )}

        {/* TAB: OFFICER SCAN PORTAL */}
        {activeTab === 'officer' && (
          <OfficerScanPortal
            profile={profile}
            scheme={activeSchemeForPlanner}
            partner={selectedPartner}
            documents={documents}
            lang={lang}
          />
        )}

        {/* TAB: ADMIN — Policy Studio + Benchmark + Calibration */}
        {activeTab === 'admin' && (
          <div>
            {/* Admin Sub-Navigation */}
            <div className="admin-sub-nav">
              <button className="admin-sub-btn active" onClick={() => {}}>
                <Activity size={16} /> Policy Studio
              </button>
              <button className="admin-sub-btn" onClick={() => document.getElementById('policy-diff-section')?.scrollIntoView({ behavior: 'smooth' })}>
                <FileDiff size={16} /> Policy Diff
              </button>
              <button className="admin-sub-btn" onClick={() => document.getElementById('benchmark-section')?.scrollIntoView({ behavior: 'smooth' })}>
                <FlaskConical size={16} /> Benchmark
              </button>
              <button className="admin-sub-btn" onClick={() => document.getElementById('hitl-section')?.scrollIntoView({ behavior: 'smooth' })}>
                <ShieldAlert size={16} /> HITL Queue
              </button>
              <button className="admin-sub-btn" onClick={() => document.getElementById('calibration-section')?.scrollIntoView({ behavior: 'smooth' })}>
                <BarChart3 size={16} /> Calibration
              </button>
            </div>

            <AdminPolicyStudio
              policyOverride={null}
              setPolicyOverride={() => {}}
              lang={lang}
            />

            <div id="policy-diff-section" style={{ marginTop: '2rem' }}>
              <PolicyDiffViewer lang={lang} />
            </div>

            <div id="benchmark-section" style={{ marginTop: '2rem' }}>
              <BenchmarkRunner lang={lang} />
            </div>

            <div id="hitl-section" style={{ marginTop: '2rem' }}>
              <HITLPanel lang={lang} />
            </div>

            <div id="calibration-section" style={{ marginTop: '2rem' }}>
              <CalibrationDashboard lang={lang} />
            </div>
          </div>
        )}

        {/* TAB: FAQ */}
        {activeTab === 'faq' && (
          <FAQAssistant lang={lang} />
        )}
      </main>

      {/* Floating AI Sahayak Button */}
      <button
        type="button"
        onClick={() => setIsAiModalOpen(true)}
        id="floating-ai-sahayak-btn"
        aria-label="Open UdyamSetu AI Sahayak"
        className="floating-ai-btn"
      >
        <div className="floating-ai-btn-icon">
          <Bot size={15} color="#ea580c" />
        </div>
        <span>{lang === 'hi' ? 'AI सहायक' : 'AI Sahayak'}</span>
        <Sparkles size={14} />
      </button>

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        lang={lang}
        profile={profile}
        onNavigate={handleNavigateFromAi}
      />

      {/* Footer */}
      <footer className="app-footer">
        <div className="app-footer-inner">
          <span className="app-footer-brand">उद्यमसेतु — UdyamSetu</span>
          <span className="app-footer-sep">•</span>
          <span>AI Funding Navigator for Underserved Entrepreneurs</span>
          <span className="app-footer-sep">•</span>
          <span>SIH 2026 Prototype</span>
          <span className="app-footer-sep app-footer-hide-mobile">•</span>
          <span className="app-footer-hide-mobile">15+ Schemes from MoSJE, NSFDC, MoMSME</span>
        </div>
      </footer>
    </div>
  );
}
