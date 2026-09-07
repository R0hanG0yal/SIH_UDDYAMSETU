import React, { useState } from 'react';
import { QrCode, Search, CheckCircle2, AlertCircle, ShieldCheck, ArrowRight, RefreshCw, Send, ExternalLink, UserCheck, FileCheck2 } from 'lucide-react';

export function OfficerScanPortal({ profile, scheme, partner, documents, lang }) {
  const [tokenInput, setTokenInput] = useState('NSFDC-REF-2026-88421');
  const [isScanning, setIsScanning] = useState(false);
  const [activeDossier, setActiveDossier] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState('referred'); // referred -> received -> under_review -> approved

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setActiveDossier({
        refId: tokenInput || "NSFDC-REF-2026-88421",
        verifiedAt: new Date().toISOString(),
        policyVersion: "NSFDC-2026.01",
        beneficiaryName: profile.gender === 'female' ? "Rani Devi" : "Ramesh Kumar",
        casteCategory: "Scheduled Caste (SC)",
        schemeName: scheme?.name || "Micro Finance Scheme (MFS)",
        schemeCode: scheme?.code || "MFS-01",
        projectCost: profile.projectCost || 120000,
        eligibleLoan: scheme ? Math.min((scheme.maxFundingPercent / 100) * profile.projectCost, scheme.maxLoanAmount) : 108000,
        ownContribution: profile.projectCost - (scheme ? Math.min((scheme.maxFundingPercent / 100) * profile.projectCost, scheme.maxLoanAmount) : 108000),
        interestRate: 6.5,
        moratoriumMonths: profile.isConstructionOrPlantation ? 24 : 3,
        channelPartner: partner?.name || "UPSCFDC - Central Directorate",
        documentStatus: {
          caste_cert: true,
          income_cert: true,
          aadhaar: true,
          bank_passbook: true,
          quotation: Boolean(documents?.quotation)
        }
      });
      setApplicationStatus('received');
    }, 900);
  };

  const statusPipeline = [
    { key: 'referred', label: 'Referred (सारथी प्रेषित)' },
    { key: 'received', label: 'Received at Desk (प्राप्त)' },
    { key: 'docs_pending', label: 'Docs Verification (दस्तावेज़ जांच)' },
    { key: 'under_review', label: 'Under Review (विचाराधीन)' },
    { key: 'pm_suraj_sync', label: 'PM-SURAJ Synced (स्वीकृत)' }
  ];

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
      {/* Officer Header */}
      <div style={{
        background: 'linear-gradient(135deg, #092628 0%, #164e52 100%)',
        color: '#ffffff',
        padding: '1.25rem',
        borderRadius: '12px',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserCheck size={26} color="#34d399" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>
              Channel Partner Officer Verification Desk
            </h2>
            <p style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
              Authorized Agency: {partner?.name || "UPSCFDC Directorate, Lucknow"} • Terminal ID: SCA-UP-LKO-04
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span className="badge-status badge-green" style={{ fontSize: '0.72rem' }}>
            🟢 PM-SURAJ Bridge Live
          </span>
        </div>
      </div>

      {/* QR Input / Scanner Simulator */}
      <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0f393b', marginBottom: '0.5rem' }}>
          Scan Citizen QR Passport or Enter Token ID:
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 240px', position: 'relative' }}>
            <input
              type="text"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="e.g. NSFDC-REF-2026-88421"
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: '1.5px solid #94a3b8',
                fontSize: '0.95rem',
                fontWeight: '600',
                color: '#0f393b'
              }}
            />
          </div>
          <button
            type="button"
            onClick={handleSimulateScan}
            disabled={isScanning}
            className="btn-primary"
            style={{ fontSize: '0.9rem', padding: '0.65rem 1.3rem' }}
          >
            <QrCode size={18} />
            <span>{isScanning ? 'Decoding Token...' : 'Scan & Load Dossier'}</span>
          </button>
        </div>
      </div>

      {/* Verified Dossier View */}
      {activeDossier && (
        <div style={{
          border: '2px solid #10b981',
          borderRadius: '12px',
          background: '#ffffff',
          padding: '1.5rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
        }}>
          {/* Status Pipeline Progress Bar */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Referral Lifecycle Stage:
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.3rem' }}>
              {statusPipeline.map((step, idx) => {
                const isPassed = statusPipeline.findIndex(s => s.key === applicationStatus) >= idx;
                return (
                  <button
                    key={step.key}
                    type="button"
                    onClick={() => setApplicationStatus(step.key)}
                    style={{
                      flex: '1 1 auto',
                      padding: '0.45rem 0.65rem',
                      borderRadius: '6px',
                      border: isPassed ? '1px solid #059669' : '1px solid #cbd5e1',
                      background: isPassed ? '#ecfdf5' : '#f1f5f9',
                      color: isPassed ? '#065f46' : '#64748b',
                      fontSize: '0.75rem',
                      fontWeight: isPassed ? '700' : '500',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {isPassed ? '✓ ' : `${idx + 1}. `}{step.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dossier Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {/* Applicant Identity */}
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>
                Applicant Identity
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f393b', marginTop: '0.2rem' }}>
                {activeDossier.beneficiaryName}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '0.2rem' }}>
                Category: <strong>{activeDossier.casteCategory}</strong>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#059669', marginTop: '0.35rem' }}>
                ✓ Income Threshold Verified (≤ ₹5L Ceiling)
              </div>
            </div>

            {/* Scheme & Terms */}
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>
                Matched Scheme
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f393b', marginTop: '0.2rem' }}>
                {activeDossier.schemeName}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '0.2rem' }}>
                Interest: <strong>{activeDossier.interestRate}% p.a.</strong> • Moratorium: <strong>{activeDossier.moratoriumMonths} Months</strong>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#059669', marginTop: '0.35rem' }}>
                Policy Source: NSFDC-2026.01 Rule Trace Passed
              </div>
            </div>

            {/* Financials */}
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>
                Financial Structure
              </div>
              <div style={{ fontSize: '0.85rem', color: '#334155', marginTop: '0.25rem' }}>
                Project Cost: <strong>₹{activeDossier.projectCost.toLocaleString('en-IN')}</strong>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#065f46', marginTop: '0.15rem' }}>
                Eligible Loan: <strong>₹{activeDossier.eligibleLoan.toLocaleString('en-IN')}</strong>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#ea580c', marginTop: '0.15rem' }}>
                Applicant Margin: <strong>₹{activeDossier.ownContribution.toLocaleString('en-IN')}</strong>
              </div>
            </div>
          </div>

          {/* Officer Document Audit */}
          <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ fontWeight: '700', color: '#065f46', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              Pre-Verified Document Checklist:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem', fontSize: '0.82rem' }}>
              <div style={{ color: '#166534' }}>✓ SC Caste Certificate (Verified)</div>
              <div style={{ color: '#166534' }}>✓ Income Certificate ≤ ₹5L (Verified)</div>
              <div style={{ color: '#166534' }}>✓ Aadhaar Card (Biometric Ready)</div>
              <div style={{ color: '#166534' }}>✓ Bank Passbook (Active Account)</div>
              <div style={{ color: activeDossier.documentStatus.quotation ? '#166534' : '#d97706' }}>
                {activeDossier.documentStatus.quotation ? '✓ Machinery Quotation (Attached)' : '⚠️ Vendor Quotation (Pending physical submission)'}
              </div>
            </div>
          </div>

          {/* Officer Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Referral ID: <strong>{activeDossier.refId}</strong> • Timestamp: {new Date(activeDossier.verifiedAt).toLocaleTimeString()}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => {
                  setApplicationStatus('pm_suraj_sync');
                  alert("Referral dossier successfully synchronized with national PM-SURAJ portal! Sanction docket created.");
                }}
                className="btn-primary"
                style={{ fontSize: '0.9rem' }}
              >
                <Send size={16} />
                <span>1-Click Handoff to PM-SURAJ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
