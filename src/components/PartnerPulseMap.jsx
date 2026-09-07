import React, { useState } from 'react';
import { MapPin, Navigation, Clock, Phone, UserCheck, AlertTriangle, ShieldCheck, CheckCircle2, XCircle, ArrowRight, Filter, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { CHANNEL_PARTNERS, INTAKE_STATUS_DEFINITIONS } from '../data/partners';

export function PartnerPulseMap({ scheme, selectedPartner, setSelectedPartner, onProceedToDocuments, lang = 'en', profile }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [partnerTypeFilter, setPartnerTypeFilter] = useState('all');
  const [showRoutingAlert, setShowRoutingAlert] = useState(true);

  // Filter partners authorized for the current scheme
  const authorizedPartners = CHANNEL_PARTNERS.filter(p => {
    const isAuthorized = !scheme || p.authorizedSchemes.includes(scheme.id);
    const matchesStatus = statusFilter === 'all' || p.intakeStatus === statusFilter;
    const matchesType = partnerTypeFilter === 'all' || p.type === partnerTypeFilter;
    return isAuthorized && matchesStatus && matchesType;
  });

  // Sort partners: Active Green first, then distance
  const sortedPartners = [...authorizedPartners].sort((a, b) => {
    const priority = { accepting: 1, limited: 2, stale: 3, paused: 4 };
    if (priority[a.intakeStatus] !== priority[b.intakeStatus]) {
      return priority[a.intakeStatus] - priority[b.intakeStatus];
    }
    return a.distanceKm - b.distanceKm;
  });

  const t = {
    en: {
      pulseTitle: "Partner Pulse: Capacity & Freshness-Aware Bank Routing",
      pulseSubtitle: "Routes your dossier exclusively to authorized public sector bank desks with verified processing capacity and active subsidy allocations.",
      nearestPausedCallout: "Capacity-Aware Intelligence: The nearest branch (Aryavart Bank, 2.1 km) has intake PAUSED today due to quarterly audit reconciliation. SAARTHI automatically routes you to the active State Bank / UPSCFDC desk (Green) with open intake quotas.",
      filterStatusLabel: "Filter by Intake Capacity:",
      all: "All Partners",
      acceptingOnly: "Accepting Only (Green)",
      selectBtn: "Select This Branch Desk",
      selectedBadge: "Selected Target Partner Desk",
      directions: "Get Directions",
      sla: "Typical Processing SLA:",
      verifiedOn: "Status Verified:",
      nodalLabel: "Nodal Credit Officer:",
      proceedBtn: "Audit Document Readiness"
    },
    hi: {
      pulseTitle: "पार्टनर पल्स: क्षमता व सक्रियता आधारित चयन",
      pulseSubtitle: "केवल उन अधिकृत बैंकों व शाखाओं से जोड़ता है जहाँ वर्तमान में फंड उपलब्ध है और आवेदन स्वीकार किए जा रहे हैं।",
      nearestPausedCallout: "स्मार्ट रूटिंग सूचना: निकटतम शाखा (आर्यावर्त बैंक, 2.1 किमी) में त्रैमासिक ऑडिट के कारण आज आवेदन स्थगित (लाल) हैं। सारथी आपको सक्रिय SBI/UPSCFDC (हरा) से जोड़ता है जो आज सक्रिय है।",
      filterStatusLabel: "स्वीकृति क्षमता के अनुसार देखें:",
      all: "सभी पार्टनर",
      acceptingOnly: "केवल सक्रिय (हरा)",
      selectBtn: "इस अधिकृत बैंक को चुनें",
      selectedBadge: "चयनित शाखा",
      directions: "दिशा-निर्देश",
      sla: "औसत प्रक्रिया समय:",
      verifiedOn: "स्थिति सत्यापन:",
      nodalLabel: "नोडल ऋण अधिकारी:",
      proceedBtn: "दस्तावेज़ पूर्णता जांचें"
    }
  }[lang === 'hi' ? 'hi' : 'en'];

  return (
    <div className="liquid-glass-card animate-fade-in" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--brand-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Navigation size={24} className="text-orange-500" />
            <span>{t.pulseTitle}</span>
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--slate-600)' }}>
            {t.pulseSubtitle}
          </p>
        </div>

        <button
          onClick={() => setShowRoutingAlert(!showRoutingAlert)}
          className="details-toggle-btn"
        >
          {showRoutingAlert ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {showRoutingAlert ? "Hide Routing Note" : "Show Routing Note"}
        </button>
      </div>

      {/* Capacity Aware Alert */}
      {showRoutingAlert && (
        <div style={{
          background: 'rgba(254, 243, 199, 0.6)',
          border: '1.5px solid #f59e0b',
          borderRadius: '12px',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.85rem'
        }}>
          <AlertTriangle size={20} color="#d97706" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: '800', color: '#92400e', fontSize: '0.88rem' }}>
              {lang === 'hi' ? 'स्मार्ट रूटिंग विश्लेषण:' : 'Smart Geospatial Intelligence:'}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#b45309', marginTop: '0.15rem', lineHeight: '1.4' }}>
              {t.nearestPausedCallout}
            </div>
          </div>
        </div>
      )}

      {/* Filter Chips Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.7)', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--slate-600)' }}>{t.filterStatusLabel}</span>
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            style={{
              padding: '0.25rem 0.6rem',
              borderRadius: '6px',
              border: statusFilter === 'all' ? '1.5px solid var(--brand-navy)' : '1px solid #cbd5e1',
              background: statusFilter === 'all' ? 'var(--brand-navy)' : '#ffffff',
              color: statusFilter === 'all' ? '#ffffff' : '#475569',
              fontSize: '0.78rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {t.all}
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('accepting')}
            style={{
              padding: '0.25rem 0.6rem',
              borderRadius: '6px',
              border: statusFilter === 'accepting' ? '1.5px solid #059669' : '1px solid #cbd5e1',
              background: statusFilter === 'accepting' ? '#ecfdf5' : '#ffffff',
              color: statusFilter === 'accepting' ? '#047857' : '#475569',
              fontSize: '0.78rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            🟢 {t.acceptingOnly}
          </button>
        </div>

        <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>
          Showing <strong>{sortedPartners.length}</strong> Authorized Branches
        </div>
      </div>

      {/* Partner List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem' }}>
        {sortedPartners.map((partner) => {
          const isSelected = selectedPartner?.id === partner.id;
          const statusDef = INTAKE_STATUS_DEFINITIONS[partner.intakeStatus] || {};

          return (
            <div
              key={partner.id}
              onClick={() => setSelectedPartner(partner)}
              style={{
                border: isSelected ? '2px solid var(--brand-teal)' : '1px solid #e2e8f0',
                background: isSelected ? '#f0fdfa' : '#ffffff',
                borderRadius: '12px',
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: isSelected ? '0 4px 12px rgba(19, 78, 74, 0.12)' : '0 1px 3px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className={`badge-status ${statusDef.badgeClass || 'badge-grey'}`}>
                      <span className={`pulse-dot ${statusDef.dotClass || 'grey'}`}></span>
                      {statusDef.label}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: '600' }}>
                      {partner.typeLabel} • {partner.distanceKm} km away
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--brand-navy)', marginTop: '0.35rem' }}>
                    {partner.name}
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                    {partner.branch}, {partner.district} ({partner.state})
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  {isSelected && (
                    <span className="badge-status badge-green" style={{ fontSize: '0.75rem' }}>
                      ✓ {t.selectedBadge}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid #f1f5f9', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.8rem' }}>
                <div style={{ color: 'var(--slate-600)' }}>
                  {t.nodalLabel} <strong>{partner.nodalOfficer}</strong> ({partner.contactPhone})
                </div>
                <div style={{ color: 'var(--brand-teal)', fontWeight: '700' }}>
                  SLA: {partner.avgSlaDays} Business Days
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Proceed */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
        <button
          type="button"
          onClick={onProceedToDocuments}
          className="btn-solid-primary"
          id="partner-pulse-proceed-btn"
          style={{ fontSize: '0.95rem' }}
        >
          <span>{t.proceedBtn}</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
