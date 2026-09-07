import React, { useState, useRef } from 'react';
import { FileText, CheckCircle2, AlertCircle, Volume2, Upload, Sparkles, ArrowRight, ShieldCheck, Eye, X, FileCheck2, ChevronDown, ChevronUp } from 'lucide-react';
import { VoiceEngine } from '../engines/voiceEngine';

export function DocumentAuditor({ scheme, documents, setDocuments, onProceedToPassport, lang = 'en', profile }) {
  const [voiceEngine] = useState(() => new VoiceEngine());
  const [fileDetails, setFileDetails] = useState({});
  const [previewModal, setPreviewModal] = useState(null);
  const [showDocGuidelines, setShowDocGuidelines] = useState(false);
  const fileInputRefs = useRef({});

  const documentList = scheme?.requiredDocuments || [
    { id: "aadhaar", label: "Aadhaar Card (आधार कार्ड)", mandatory: true, sampleDesc: "Biometric e-KYC proof of identity" },
    { id: "pan", label: "PAN Card / Form 60 (पैन कार्ड)", mandatory: true, sampleDesc: "Identity for enterprise bank account" },
    { id: "bank_passbook", label: "Bank Account Passbook (बैंक पासबुक)", mandatory: true, sampleDesc: "Active savings/current account for DBT" },
    { id: "dpr", label: "Project DPR Profile / Quotation (परियोजना रिपोर्ट)", mandatory: true, sampleDesc: "Vendor quotation for machinery, tools, or stock" }
  ];

  const totalDocs = documentList.length;
  const verifiedDocsCount = documentList.filter(d => documents && documents[d.id]).length;
  const readinessPercent = Math.min(100, Math.round((verifiedDocsCount / Math.max(1, totalDocs)) * 100));

  const t = {
    en: {
      auditorTitle: "Document Readiness & Verification Audit",
      auditorSubtitle: "Upload real files or verify your documents. SAARTHI guarantees your dossier is complete before bank dispatch.",
      readinessScore: "Document Readiness Score",
      audioGuideBtn: "Listen to Audio Guidance",
      missingAlert: "Notice: Document pending. You can still generate the Passport, but the authorized partner branch will require this before fund disbursement.",
      uploadRealBtn: "Upload Real File (PDF/Image)",
      viewBtn: "View File",
      mandatory: "Mandatory",
      optional: "Conditional",
      proceedBtn: "Generate Verified QR Loan Fit Passport",
      showGuideBtn: "Show Document Issuance Guidelines",
      hideGuideBtn: "Hide Guidelines"
    },
    hi: {
      auditorTitle: "दस्तावेज़ पूर्णता व स्मार्ट सत्यापन",
      auditorSubtitle: "अपनी फाइलें अपलोड करें अथवा चेक करें। सारथी सुनिश्चित करता है कि बैंक जाने से पहले आपकी फाइल पूरी तरह तैयार हो।",
      readinessScore: "दस्तावेज़ तैयारी स्कोर",
      audioGuideBtn: "चेकलिस्ट को सुनें",
      missingAlert: "सूचना: दस्तावेज़ लंबित है। आप पासपोर्ट अभी भी बना सकते हैं, किंतु बैंक में अंतिम ऋण वितरण से पहले इसे जमा करना होगा।",
      uploadRealBtn: "फाइल अपलोड करें (PDF/फोटो)",
      viewBtn: "फाइल देखें",
      mandatory: "अनिवार्य",
      optional: "आवश्यकतानुसार",
      proceedBtn: "सत्यापित QR लोन फिट पासपोर्ट बनाएं",
      showGuideBtn: "दस्तावेज़ दिशा-निर्देश देखें",
      hideGuideBtn: "दिशा-निर्देश छिपाएं"
    }
  }[lang === 'hi' ? 'hi' : 'en'];

  const handleToggleDoc = (docId) => {
    setDocuments(prev => ({
      ...prev,
      [docId]: !prev?.[docId]
    }));
  };

  // Real File Upload handler
  const handleFileUpload = (docId, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    setFileDetails(prev => ({
      ...prev,
      [docId]: {
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        type: file.type,
        url: fileUrl,
        verifiedTime: new Date().toLocaleTimeString()
      }
    }));

    setDocuments(prev => ({ ...prev, [docId]: true }));
  };

  const handlePlayAudioChecklist = () => {
    const missing = documentList.filter(d => !documents?.[d.id]);
    let audioText = "";

    if (lang === 'hi') {
      if (missing.length === 0) {
        audioText = "बधाई हो! आपके सभी आवश्यक दस्तावेज़ पूर्ण हैं। आपकी फ़ाइल बैंक में सीधे स्वीकार की जाएगी।";
      } else {
        const missingNames = missing.map(m => m.label.split('(')[0]).join(', ');
        audioText = `ध्यान दें: आपके पास ${missingNames} अभी लंबित है।`;
      }
      voiceEngine.speak(audioText, 'hi-IN');
    } else {
      if (missing.length === 0) {
        audioText = "Great! All required documents are ready for your channel partner visit.";
      } else {
        const missingNames = missing.map(m => m.label.split('(')[0]).join(', ');
        audioText = `Notice: ${missingNames} is pending.`;
      }
      voiceEngine.speak(audioText, 'en-IN');
    }
  };

  return (
    <div className="liquid-glass-card animate-fade-in" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--brand-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={24} className="text-orange-500" />
            <span>{t.auditorTitle}</span>
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)' }}>
            {t.auditorSubtitle}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={handlePlayAudioChecklist}
            className="btn-outline"
            style={{ fontSize: '0.82rem', padding: '0.45rem 0.85rem' }}
          >
            <Volume2 size={16} />
            <span>{t.audioGuideBtn}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowDocGuidelines(!showDocGuidelines)}
            className="details-toggle-btn"
          >
            {showDocGuidelines ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            <span>{showDocGuidelines ? t.hideGuideBtn : t.showGuideBtn}</span>
          </button>
        </div>
      </div>

      {/* Readiness Bar */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.85)',
        border: '1.5px solid #cbd5e1',
        borderRadius: '12px',
        padding: '1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ flex: '1 1 240px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--brand-navy)' }}>{t.readinessScore}</span>
            <span style={{ color: readinessPercent === 100 ? '#047857' : '#d97706' }}>
              {readinessPercent}% Complete ({verifiedDocsCount} of {totalDocs})
            </span>
          </div>
          <div style={{ width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{
              width: `${readinessPercent}%`,
              height: '100%',
              background: readinessPercent === 100 ? 'linear-gradient(90deg, #10b981, #059669)' : 'linear-gradient(90deg, #f97316, #ea580c)',
              borderRadius: '9999px',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>
      </div>

      {/* Collapsible Guidelines */}
      {showDocGuidelines && (
        <div style={{
          background: 'rgba(240, 253, 250, 0.8)',
          border: '1px solid #99f6e4',
          borderRadius: '10px',
          padding: '1rem',
          marginBottom: '1.5rem',
          fontSize: '0.84rem',
          color: '#0f766e',
          lineHeight: 1.55
        }}>
          <strong>Statutory Documentation Protocol:</strong> All public sector banks accept digital digilocker e-Aadhaar and PAN for PMEGP, MUDRA, and VishwaKarma. DPR forms under ₹5 Lakh require only simple quotation receipts without chartered accountant certification.
        </div>
      )}

      {/* Checklist items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
        {documentList.map((doc) => {
          const isUploaded = !!documents?.[doc.id];
          const fileInfo = fileDetails[doc.id];

          return (
            <div
              key={doc.id}
              style={{
                background: isUploaded ? '#f0fdf4' : '#ffffff',
                border: isUploaded ? '1.5px solid #86efac' : '1px solid #cbd5e1',
                borderRadius: '12px',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: '1 1 280px' }}>
                <input
                  type="checkbox"
                  checked={isUploaded}
                  onChange={() => handleToggleDoc(doc.id)}
                  id={`checkbox-${doc.id}`}
                  style={{ width: '20px', height: '20px', accentColor: '#10b981', cursor: 'pointer' }}
                />

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <strong style={{ fontSize: '0.92rem', color: isUploaded ? '#065f46' : 'var(--brand-navy)' }}>
                      {doc.label}
                    </strong>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '4px',
                      background: doc.mandatory ? '#fee2e2' : '#f1f5f9',
                      color: doc.mandatory ? '#991b1b' : '#64748b'
                    }}>
                      {doc.mandatory ? t.mandatory : t.optional}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '0.15rem' }}>
                    {fileInfo ? `Uploaded: ${fileInfo.name} (${fileInfo.size})` : doc.sampleDesc}
                  </div>
                </div>
              </div>

              {/* Upload Action */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="file"
                  ref={el => fileInputRefs.current[doc.id] = el}
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileUpload(doc.id, e)}
                  accept="image/*,application/pdf"
                />

                {fileInfo ? (
                  <button
                    type="button"
                    onClick={() => setPreviewModal(fileInfo)}
                    className="btn-outline"
                    style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
                  >
                    <Eye size={13} /> {t.viewBtn}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRefs.current[doc.id]?.click()}
                    className="btn-outline"
                    style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
                  >
                    <Upload size={13} /> {t.uploadRealBtn}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Preview */}
      {previewModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '1.5rem', maxWidth: '500px', width: '100%', position: 'relative' }}>
            <button
              onClick={() => setPreviewModal(null)}
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>Document Verified Preview</h3>
            <div style={{ textAlign: 'center', padding: '2rem', background: '#f8fafc', borderRadius: '10px' }}>
              <FileCheck2 size={48} color="#10b981" style={{ margin: '0 auto 1rem' }} />
              <div style={{ fontWeight: 700 }}>{previewModal.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>{previewModal.size} • Verified on {previewModal.verifiedTime}</div>
            </div>
          </div>
        </div>
      )}

      {/* Proceed */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
        <button
          type="button"
          onClick={onProceedToPassport}
          className="btn-accent-saffron"
          id="proceed-to-passport-btn"
          style={{ fontSize: '1rem' }}
        >
          <span>{t.proceedBtn}</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
