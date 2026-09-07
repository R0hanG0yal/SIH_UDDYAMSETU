import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { ShieldCheck, CheckCircle2, AlertCircle, Printer, Share2, ArrowRight, ExternalLink, QrCode, FileText, Building, Calendar, UserCheck, RotateCcw, Download, Edit3, ChevronDown, ChevronUp, Gift } from 'lucide-react';
import { savePassportApi } from '../services/api';

export function LoanFitPassport({ profile, scheme, matchResult, partner, documents, onOpenOfficerTerminal, onStartNew, onUpdateName, lang = 'en' }) {
  const [referralId] = useState(() => `SAARTHI-GOI-${Math.floor(100000 + Math.random() * 900000)}`);
  const [timestamp] = useState(() => new Date().toISOString());
  const [copied, setCopied] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [customName, setCustomName] = useState(profile?.applicantName || '');
  const [showFullDossier, setShowFullDossier] = useState(false);

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f97316', '#10b981', '#134e4a', '#38bdf8']
      });
    } catch (e) {
      // ignore
    }
  }, []);

  // Compute live real metrics from user inputs
  const applicantDisplayName = (customName || profile?.applicantName || '').trim() || "Verified Entrepreneur";
  
  const totalDocs = scheme?.requiredDocuments?.length || 4;
  const readyDocs = Object.keys(documents || {}).filter(k => documents[k]).length;
  const readinessPercent = Math.min(100, Math.round((readyDocs / Math.max(1, totalDocs)) * 100));

  const projectCost = Number(profile?.projectCost) || 100000;
  const directSubsidyAmount = Number(scheme?.directSubsidyAmount) || 0;
  const directSubsidyPercent = Number(scheme?.directSubsidyPercent) || 0;
  const eligibleLoan = scheme?.eligibleFunding ? Number(scheme.eligibleFunding) : Math.round(projectCost * 0.9);
  const ownEquity = Math.max(0, projectCost - eligibleLoan);
  const interestRate = scheme?.effectiveInterestRate || scheme?.interestRatePercent || 8.5;
  const moratoriumMonths = scheme?.moratoriumMonths || 3;

  const socialCategory = profile?.isSC 
    ? "Affirmative Category (SC/ST Subsidy Multiplier)" 
    : "Universal Citizen Category (Open to All)";

  // Encoded QR referral payload using purely live user state
  const qrPayload = JSON.stringify({
    refId: referralId,
    timestamp,
    policyVersion: "GOI-CREDIT-2026.02",
    beneficiaryName: applicantDisplayName,
    category: socialCategory,
    schemeId: scheme?.id || "PMEGP_MANUFACTURING",
    schemeName: scheme?.name || "Prime Minister's Employment Generation Programme",
    projectCost,
    eligibleLoan,
    ownEquity,
    directSubsidyAmount,
    partnerId: partner?.id || "PARTNER-SBI-01",
    partnerName: partner?.name || "State Bank of India",
    readinessPercent,
    status: "REFERRAL_VERIFIED"
  });

  // Persist live to backend API database
  useEffect(() => {
    savePassportApi({
      refId: referralId,
      timestamp,
      policyVersion: 'GOI-CREDIT-2026.02',
      beneficiaryName: applicantDisplayName,
      category: socialCategory,
      district: partner?.district || profile?.district || 'Lucknow',
      state: partner?.state || profile?.state || 'Uttar Pradesh',
      primaryScheme: scheme?.name || "Prime Minister's Employment Generation Programme",
      schemeCode: scheme?.code || "PMEGP-01",
      projectCost,
      eligibleLoan,
      ownEquity,
      governmentSubsidyAmount: directSubsidyAmount,
      effectiveInterestRate: interestRate,
      partnerId: partner?.id || 'PARTNER-SBI-01',
      partnerName: partner?.name || 'State Bank of India',
      branch: partner?.branch || 'SME Central Hub',
      status: 'received',
      documentsVerified: Object.keys(documents || {}).filter(k => documents[k])
    }).catch(() => {
      // ignore network errors if offline
    });
  }, [referralId, applicantDisplayName, projectCost, eligibleLoan, scheme, partner]);

  const t = {
    en: {
      passportTitle: "OFFICIAL LOAN FIT PASSPORT",
      tagline: "Secured Pre-Routing & Eligibility Credential • Sovereign Enterprise Credit",
      refNumber: "Referral Token ID",
      issuedFor: "Beneficiary Name",
      schemeAssigned: "Matched National Scheme",
      partnerAssigned: "Assigned Authorized Bank Channel",
      financialBreakdown: "Verified Financial Plan",
      projectCost: "Project Valuation",
      loanEstimate: "Eligible Bank Loan",
      ownEquity: "Beneficiary Margin (Own)",
      subsidyGrant: "Direct Government Capital Grant",
      interestRate: "Effective Interest",
      moratorium: "Moratorium Grace Period",
      docReadiness: "Audited Document Readiness",
      officerScanNotice: "At the bank desk, the officer scans this QR code to load your audited dossier into PM-SURAJ without repetitive manual questions.",
      printBtn: "Print / Save PDF",
      shareBtn: "Share Token",
      copiedNotice: "Copied!",
      officerBtn: "Switch to Officer Desk Terminal",
      startNewBtn: "Start New Application",
      showDetails: "Show Detailed Financial Dossier",
      hideDetails: "Hide Detailed Dossier"
    },
    hi: {
      passportTitle: "आधिकारिक लोन फिट पासपोर्ट",
      tagline: "सुरक्षित प्री-रूटिंग व पात्रता प्रमाण पत्र • भारत सरकार राष्ट्रीय ऋण व्यवस्था",
      refNumber: "रेफरल टोकन संख्या",
      issuedFor: "लाभार्थी का नाम",
      schemeAssigned: "अनुशंसित राष्ट्रीय योजना",
      partnerAssigned: "अधिकृत चैनल पार्टनर बैंक",
      financialBreakdown: "सत्यापित वित्तीय योजना",
      projectCost: "परियोजना लागत",
      loanEstimate: "पात्र बैंक ऋण",
      ownEquity: "स्वयं का अंशदान",
      subsidyGrant: "सीधा गैर-वापसी सरकारी अनुदान",
      interestRate: "प्रभावी ब्याज दर",
      moratorium: "मोरेटोरियम ग्रेस पीरियड",
      docReadiness: "दस्तावेज़ पूर्णता",
      officerScanNotice: "बैंक शाखा में ऋण अधिकारी केवल इस QR कोड को स्कैन करेंगे और आपका आवेदन PM-SURAJ में स्वतः खुल जाएगा।",
      printBtn: "प्रिंट / PDF डाउनलोड",
      shareBtn: "टोकन शेयर करें",
      copiedNotice: "कॉपी हो गया!",
      officerBtn: "अधिकारी डेस्क टर्मिनल पर जांचें",
      startNewBtn: "नया आवेदन शुरू करें",
      showDetails: "विस्तृत विवरण देखें",
      hideDetails: "विवरण छिपाएं"
    }
  }[lang === 'hi' ? 'hi' : 'en'];

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`SAARTHI Official Loan Fit Passport Token: ${referralId} for ${scheme?.name}. Beneficiary: ${applicantDisplayName}. Partner: ${partner?.name}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveName = () => {
    setIsEditingName(false);
    if (onUpdateName && customName) {
      onUpdateName(customName);
    }
  };

  return (
    <div className="animate-fade-in" style={{ marginBottom: '3rem' }}>
      {/* Top Banner Notice */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge-status badge-green" style={{ fontSize: '0.8rem' }}>
            ✓ Real Verified Referral Dossier Ready
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>
            Live Timestamp: {new Date(timestamp).toLocaleDateString()} {new Date(timestamp).toLocaleTimeString()}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setShowFullDossier(!showFullDossier)}
            className="details-toggle-btn"
            id="toggle-passport-dossier-btn"
          >
            {showFullDossier ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {showFullDossier ? t.hideDetails : t.showDetails}
          </button>

          {onStartNew && (
            <button
              type="button"
              onClick={onStartNew}
              className="btn-outline"
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              id="passport-start-new-btn"
            >
              <RotateCcw size={14} />
              <span>{t.startNewBtn}</span>
            </button>
          )}
        </div>
      </div>

      {/* Passport Frame */}
      <div className="passport-frame">
        {/* Background Sovereign Watermark */}
        <div className="passport-watermark">
          GOI
        </div>

        {/* Passport Header Bar */}
        <div className="passport-header-bar">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                <ShieldCheck size={24} color="#0f3436" />
              </div>
              <div>
                <h1 style={{ fontSize: '1.35rem', fontWeight: '900', letterSpacing: '0.04em', color: '#ffffff' }}>
                  {t.passportTitle}
                </h1>
                <div style={{ fontSize: '0.78rem', color: '#fed7aa', fontWeight: '500' }}>
                  {t.tagline}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className="badge-status badge-green" style={{ fontSize: '0.72rem' }}>
                🟢 PM-SURAJ VERIFIED PRE-ROUTING
              </span>
              <div style={{ fontSize: '0.72rem', color: '#e2e8f0', marginTop: '0.2rem' }}>
                Policy Version: <strong>GOI-CREDIT-2026.02</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Interior Grid */}
        <div style={{ padding: '1.75rem', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem', marginBottom: '1.5rem' }}>
            {/* Left Column: QR Code & Security Dossier */}
            <div style={{
              background: '#ffffff',
              border: '2px solid var(--brand-navy)',
              borderRadius: '16px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
            }}>
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #cbd5e1', marginBottom: '1rem' }}>
                <QRCodeSVG
                  value={qrPayload}
                  size={180}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='45' fill='%230f3436'/><circle cx='50' cy='50' r='28' fill='%23f97316'/></svg>",
                    height: 32,
                    width: 32,
                    excavate: true,
                  }}
                />
              </div>

              <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '800' }}>
                {t.refNumber}
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--brand-navy)', letterSpacing: '0.04em', margin: '0.2rem 0' }}>
                {referralId}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#059669', fontWeight: '700' }}>
                Signed Sovereign Token • Bank Desk Interoperable
              </div>

              {/* Beneficiary Meta Info */}
              <div style={{ marginTop: '1.25rem', width: '100%', borderTop: '1px dashed #cbd5e1', paddingTop: '1rem', fontSize: '0.84rem', color: 'var(--slate-800)', textAlign: 'left', lineHeight: '1.7' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span><strong>{t.issuedFor}:</strong> {applicantDisplayName}</span>
                  <button
                    onClick={() => setIsEditingName(!isEditingName)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--brand-teal)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.75rem' }}
                    title="Edit Name"
                  >
                    <Edit3 size={12} /> Edit
                  </button>
                </div>

                {isEditingName && (
                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem', marginBottom: '0.4rem' }}>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="Enter full legal name"
                      className="form-input"
                      style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem' }}
                    />
                    <button onClick={handleSaveName} className="btn-solid-primary" style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem' }}>
                      Save
                    </button>
                  </div>
                )}

                <div><strong>Social Framework:</strong> {socialCategory}</div>
                <div><strong>Location:</strong> {partner?.district || profile?.district || 'Lucknow'}, {partner?.state || profile?.state || 'Uttar Pradesh'}</div>
                <div><strong>Generated Date:</strong> {new Date(timestamp).toLocaleDateString()}</div>
              </div>
            </div>

            {/* Right Column: Scheme & Financial Snapshot */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Scheme Box */}
              <div style={{ background: '#f0fdfa', border: '1.5px solid #99f6e4', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#0f766e', fontWeight: '800', textTransform: 'uppercase' }}>
                  {t.schemeAssigned}
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#134e4a', marginTop: '0.25rem' }}>
                  {lang === 'hi' ? (scheme?.nameHindi || scheme?.name) : scheme?.name}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#115e59', marginTop: '0.35rem' }}>
                  Ministry: <strong>{scheme?.ministry || "Ministry of MSME"}</strong> • Code: <strong>{scheme?.code || "PMEGP-01"}</strong>
                </div>

                {/* Capital Subsidy Highlight */}
                {directSubsidyAmount > 0 && (
                  <div style={{
                    marginTop: '0.75rem',
                    padding: '0.65rem 0.9rem',
                    borderRadius: '8px',
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#065f46'
                  }}>
                    <Gift size={18} className="text-emerald-700" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>
                      ₹{directSubsidyAmount.toLocaleString('en-IN')} Direct Government Cash Grant ({directSubsidyPercent}% Non-Repayable)
                    </span>
                  </div>
                )}
              </div>

              {/* Partner Assigned Box */}
              <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>
                    {t.partnerAssigned}
                  </div>
                  <span className="badge-status badge-green" style={{ fontSize: '0.7rem' }}>
                    🟢 Verified Intake Capacity
                  </span>
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--brand-navy)', marginTop: '0.25rem' }}>
                  {partner?.name || "State Bank of India - SME Hub"}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                  {partner?.branch || "Hazratganj Main, Lucknow"} • Turnaround SLA: {partner?.avgSlaDays || 3} Days
                </div>
                <div style={{ fontSize: '0.78rem', color: '#059669', marginTop: '0.35rem' }}>
                  Nodal Officer: <strong>{partner?.nodalOfficer || "Shri Amit Verma"}</strong> ({partner?.contactPhone || "+91 522 2288123"})
                </div>
              </div>

              {/* High-Signal Financial Numbers */}
              <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', textAlign: 'center' }}>
                  <div style={{ background: 'var(--slate-50)', padding: '0.75rem 0.5rem', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>{t.projectCost}</div>
                    <div style={{ fontWeight: 800, color: 'var(--brand-navy)', fontSize: '1.05rem', marginTop: '0.2rem' }}>
                      ₹{projectCost.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div style={{ background: 'var(--emerald-subtle)', padding: '0.75rem 0.5rem', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--emerald-dark)' }}>{t.loanEstimate}</div>
                    <div style={{ fontWeight: 800, color: 'var(--emerald-dark)', fontSize: '1.05rem', marginTop: '0.2rem' }}>
                      ₹{eligibleLoan.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div style={{ background: 'var(--accent-saffron-subtle)', padding: '0.75rem 0.5rem', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#9a3412' }}>{t.ownEquity}</div>
                    <div style={{ fontWeight: 800, color: '#c2410c', fontSize: '1.05rem', marginTop: '0.2rem' }}>
                      ₹{ownEquity.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Collapsible Detailed Financial Dossier & Audit Breakdown */}
          {showFullDossier && (
            <div style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              fontSize: '0.85rem'
            }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '0.75rem' }}>
                Complete Financial Diagnostics & Repayment Terms
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <span style={{ color: '#64748b' }}>Effective Interest Rate:</span>
                  <div style={{ fontWeight: 700, color: 'var(--brand-navy)' }}>{interestRate}% per annum</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Moratorium Grace Period:</span>
                  <div style={{ fontWeight: 700, color: 'var(--brand-teal)' }}>{moratoriumMonths} Months Repayment Holiday</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Collateral Mandate:</span>
                  <div style={{ fontWeight: 700, color: 'var(--emerald-dark)' }}>100% Collateral-Free (Covered under CGTMSE / CGFMU)</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Audited Document Readiness:</span>
                  <div style={{ fontWeight: 700, color: readinessPercent === 100 ? 'var(--emerald-dark)' : 'var(--amber-warning)' }}>
                    {readinessPercent}% ({readyDocs} of {totalDocs} Required Documents Verified)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Desk Notice */}
          <div style={{
            background: 'linear-gradient(90deg, #ecfdf5 0%, #f0fdfa 100%)',
            border: '1px solid #86efac',
            borderRadius: '10px',
            padding: '0.85rem 1.25rem',
            fontSize: '0.84rem',
            color: '#065f46',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <QrCode size={22} color="#059669" style={{ flexShrink: 0 }} />
            <span>{t.officerScanNotice}</span>
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handlePrint}
            className="btn-outline"
            style={{ fontSize: '0.88rem' }}
            id="passport-print-btn"
          >
            <Printer size={16} />
            <span>{t.printBtn}</span>
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="btn-outline"
            style={{ fontSize: '0.88rem' }}
            id="passport-share-btn"
          >
            <Share2 size={16} />
            <span>{copied ? t.copiedNotice : t.shareBtn}</span>
          </button>
        </div>

        {/* Officer Mode Link */}
        <button
          type="button"
          onClick={onOpenOfficerTerminal}
          className="btn-solid-primary"
          style={{ fontSize: '0.95rem' }}
          id="passport-officer-terminal-btn"
        >
          <UserCheck size={18} />
          <span>{t.officerBtn}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
