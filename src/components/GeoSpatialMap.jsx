import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Navigation, Locate, Filter, Phone, Clock, ArrowRight, ShieldCheck, AlertTriangle, CheckCircle2, XCircle, ExternalLink, Layers, Compass, ZoomIn, ZoomOut } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CHANNEL_PARTNERS, INTAKE_STATUS_DEFINITIONS } from '../data/partners';

// Haversine distance formula
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Status to color mapping
const STATUS_COLORS = {
  accepting: { fill: '#10b981', stroke: '#065f46', glow: 'rgba(16,185,129,0.4)', label: 'Accepting', pulse: true },
  limited: { fill: '#f59e0b', stroke: '#92400e', glow: 'rgba(245,158,11,0.4)', label: 'Limited', pulse: false },
  stale: { fill: '#94a3b8', stroke: '#475569', glow: 'rgba(148,163,184,0.3)', label: 'Stale', pulse: false },
  paused: { fill: '#f43f5e', stroke: '#9f1239', glow: 'rgba(244,63,94,0.4)', label: 'Paused', pulse: false },
};

// Create custom SVG marker icon
function createMarkerIcon(status, isSelected = false, type = 'PSB') {
  const color = STATUS_COLORS[status] || STATUS_COLORS.stale;
  const size = isSelected ? 42 : 32;
  const typeEmoji = { SCA: '🏛️', PSB: '🏦', RRB: '🌾', SFB: '💳', NBFC_MFI: '📱', COOP: '🤝' }[type] || '🏦';

  const svg = `<svg width="${size}" height="${size + 12}" viewBox="0 0 ${size} ${size + 12}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="glow-${status}" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feFlood flood-color="${color.glow}" flood-opacity="0.6"/>
        <feComposite in2="blur" operator="in"/>
        <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    ${isSelected ? `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 2}" fill="${color.glow}" opacity="0.5">
      <animate attributeName="r" values="${size / 2 - 4};${size / 2};${size / 2 - 4}" dur="2s" repeatCount="indefinite"/>
    </circle>` : ''}
    <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 4}" fill="${color.fill}" stroke="${color.stroke}" stroke-width="${isSelected ? 3 : 2}" filter="url(#glow-${status})"/>
    <text x="${size / 2}" y="${size / 2 + 1}" text-anchor="middle" dominant-baseline="central" font-size="${isSelected ? 18 : 14}">${typeEmoji}</text>
    <polygon points="${size / 2 - 5},${size - 4} ${size / 2},${size + 10} ${size / 2 + 5},${size - 4}" fill="${color.fill}" stroke="${color.stroke}" stroke-width="1.5"/>
  </svg>`;

  return L.divIcon({
    html: svg,
    className: 'custom-map-marker',
    iconSize: [size, size + 12],
    iconAnchor: [size / 2, size + 10],
    popupAnchor: [0, -(size + 5)],
  });
}

// User location icon
function createUserIcon() {
  const svg = `<svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
    <circle cx="18" cy="18" r="16" fill="rgba(37,99,235,0.15)" stroke="#2563eb" stroke-width="2">
      <animate attributeName="r" values="12;16;12" dur="3s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.4;0.15;0.4" dur="3s" repeatCount="indefinite"/>
    </circle>
    <circle cx="18" cy="18" r="7" fill="#2563eb" stroke="#ffffff" stroke-width="3"/>
  </svg>`;

  return L.divIcon({
    html: svg,
    className: 'user-location-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}


export function GeoSpatialMap({ scheme, selectedPartner, setSelectedPartner, onProceedToDocuments, lang = 'en', profile }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);
  const routeLineRef = useRef(null);

  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showMapLegend, setShowMapLegend] = useState(true);
  const [nearestGreen, setNearestGreen] = useState(null);
  const [partnersWithDistance, setPartnersWithDistance] = useState([]);
  const [mapReady, setMapReady] = useState(false);

  // Default center (Lucknow for demo)
  const DEFAULT_CENTER = { lat: 26.8467, lng: 80.9462 };

  // Filter and sort partners
  useEffect(() => {
    const center = userLocation || DEFAULT_CENTER;
    let filtered = CHANNEL_PARTNERS.map(p => ({
      ...p,
      computedDistance: haversineDistance(center.lat, center.lng, p.coordinates.lat, p.coordinates.lng)
    }));

    // Filter by scheme authorization
    if (scheme) {
      filtered = filtered.filter(p => p.authorizedSchemes.includes(scheme.id));
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.intakeStatus === statusFilter);
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(p => p.type === typeFilter);
    }

    // Sort: accepting first, then by distance
    filtered.sort((a, b) => {
      const priority = { accepting: 1, limited: 2, stale: 3, paused: 4 };
      if (priority[a.intakeStatus] !== priority[b.intakeStatus]) {
        return priority[a.intakeStatus] - priority[b.intakeStatus];
      }
      return a.computedDistance - b.computedDistance;
    });

    setPartnersWithDistance(filtered);

    // Find nearest green partner
    const greens = filtered.filter(p => p.intakeStatus === 'accepting');
    if (greens.length > 0) setNearestGreen(greens[0]);
  }, [userLocation, scheme, statusFilter, typeFilter]);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng],
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
    });

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);

    // Add zoom control to bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Add attribution
    L.control.attribution({ position: 'bottomleft', prefix: false })
      .addAttribution('© <a href="https://openstreetmap.org">OSM</a>')
      .addTo(map);

    mapInstanceRef.current = map;
    setMapReady(true);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      setMapReady(false);
    };
  }, []);

  // Update markers when partners change
  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady) return;
    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    // Add partner markers
    partnersWithDistance.forEach(partner => {
      const isSelected = selectedPartner?.id === partner.id;
      const icon = createMarkerIcon(partner.intakeStatus, isSelected, partner.type);
      const statusDef = INTAKE_STATUS_DEFINITIONS[partner.intakeStatus];
      const distText = partner.computedDistance < 1
        ? `${Math.round(partner.computedDistance * 1000)}m`
        : `${partner.computedDistance.toFixed(1)} km`;

      const marker = L.marker([partner.coordinates.lat, partner.coordinates.lng], { icon })
        .addTo(map);

      // Rich popup content
      const popupHtml = `
        <div style="font-family:'Plus Jakarta Sans',sans-serif;min-width:260px;max-width:320px;padding:2px">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${STATUS_COLORS[partner.intakeStatus]?.fill || '#94a3b8'}"></span>
            <span style="font-size:11px;font-weight:700;color:${STATUS_COLORS[partner.intakeStatus]?.stroke || '#475569'};text-transform:uppercase;letter-spacing:0.5px">${statusDef?.label || 'Unknown'}</span>
          </div>
          <div style="font-size:14px;font-weight:800;color:#091e20;margin-bottom:3px">${partner.name}</div>
          <div style="font-size:11.5px;color:#475569;margin-bottom:6px">${partner.typeName} • ${partner.agencyName}</div>
          <div style="font-size:12px;color:#64748b;margin-bottom:4px">📍 ${partner.branch}</div>
          <div style="font-size:12px;color:#64748b;margin-bottom:8px">📏 ${distText} away • ⏱️ SLA: ${partner.avgSlaDays} day(s)</div>
          <div style="font-size:11.5px;color:#334155;background:rgba(241,245,249,0.8);border-radius:6px;padding:6px 8px;margin-bottom:8px;line-height:1.4">${partner.intakeReason}</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            <a href="tel:${partner.contactPhone}" style="font-size:11px;background:#0f3436;color:#fff;padding:5px 10px;border-radius:6px;text-decoration:none;font-weight:600">📞 Call</a>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${partner.coordinates.lat},${partner.coordinates.lng}" target="_blank" style="font-size:11px;background:#f97316;color:#fff;padding:5px 10px;border-radius:6px;text-decoration:none;font-weight:600">🗺️ Navigate</a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        maxWidth: 340,
        className: 'saarthi-map-popup',
      });

      marker.on('click', () => {
        setSelectedPartner(partner);
      });

      markersRef.current.push(marker);
    });

    // Fit bounds if we have markers
    if (markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current);
      // Include user location if available
      if (userMarkerRef.current) {
        group.addLayer(userMarkerRef.current);
      }
      map.fitBounds(group.getBounds().pad(0.15), { maxZoom: 14 });
    }
  }, [partnersWithDistance, selectedPartner, mapReady]);

  // Update user marker
  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady) return;
    const map = mapInstanceRef.current;

    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }

    if (userLocation) {
      const icon = createUserIcon();
      const marker = L.marker([userLocation.lat, userLocation.lng], { icon, zIndexOffset: 1000 })
        .addTo(map)
        .bindPopup(`<div style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:13px;color:#2563eb">📍 Your Location</div>`, { className: 'saarthi-map-popup' });
      userMarkerRef.current = marker;
    }
  }, [userLocation, mapReady]);

  // Draw route line to selected partner
  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady) return;
    const map = mapInstanceRef.current;

    if (routeLineRef.current) {
      map.removeLayer(routeLineRef.current);
      routeLineRef.current = null;
    }

    if (userLocation && selectedPartner) {
      const line = L.polyline(
        [
          [userLocation.lat, userLocation.lng],
          [selectedPartner.coordinates.lat, selectedPartner.coordinates.lng]
        ],
        {
          color: STATUS_COLORS[selectedPartner.intakeStatus]?.fill || '#2563eb',
          weight: 3,
          dashArray: '8, 12',
          opacity: 0.7,
        }
      ).addTo(map);
      routeLineRef.current = line;
    }
  }, [userLocation, selectedPartner, mapReady]);

  // Geolocation handler
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
        setUserLocation(loc);
        setIsLocating(false);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([loc.lat, loc.lng], 13, { animate: true });
        }
      },
      (error) => {
        setIsLocating(false);
        // Fallback to default location for demo
        setUserLocation(DEFAULT_CENTER);
        setLocationError('Using default location (Lucknow). Grant location permission for accurate results.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  // Auto-detect location on mount
  useEffect(() => {
    requestLocation();
  }, []);

  const t = {
    en: {
      title: 'Geo-Spatial Partner Locator & Intelligent Router',
      subtitle: 'Real-time map showing authorized Channel Partners with capacity-aware routing. Partners with paused intake or high NPA are automatically deprioritized.',
      locateMe: 'Locate Me',
      locating: 'Locating...',
      filterLabel: 'Intake Status:',
      typeLabel: 'Partner Type:',
      allStatuses: 'All',
      allTypes: 'All Types',
      nearestGreenLabel: 'Nearest Active Partner',
      legendTitle: 'Map Legend',
      routingAlertTitle: '🧠 Smart Capacity Routing Active',
      routingAlert: 'The nearest branch may have intake PAUSED. SAARTHI automatically routes you to the closest ACTIVE (green) partner with verified processing capacity.',
      selectedPartnerLabel: 'Selected Channel Partner',
      proceedBtn: 'Proceed to Document Audit',
      callBtn: 'Call Now',
      navigateBtn: 'Get Directions',
      distanceLabel: 'Distance',
      slaLabel: 'Processing SLA',
      nodalLabel: 'Nodal Officer',
      hoursLabel: 'Operating Hours',
      schemesLabel: 'Authorized Products',
      bookApptBtn: 'Book Appointment',
    },
    hi: {
      title: 'भू-स्थानिक पार्टनर लोकेटर और बुद्धिमान राउटर',
      subtitle: 'क्षमता-जागरूक रूटिंग के साथ अधिकृत चैनल पार्टनर दिखाने वाला लाइव मानचित्र। रुके हुए या अस्वीकार्य शाखाएं स्वचालित रूप से अवरोहित होती हैं।',
      locateMe: 'मेरा स्थान',
      locating: 'खोज रहे हैं...',
      filterLabel: 'स्वीकृति स्थिति:',
      typeLabel: 'पार्टनर प्रकार:',
      allStatuses: 'सभी',
      allTypes: 'सभी प्रकार',
      nearestGreenLabel: 'निकटतम सक्रिय पार्टनर',
      legendTitle: 'मानचित्र संकेतक',
      routingAlertTitle: '🧠 स्मार्ट क्षमता रूटिंग सक्रिय',
      routingAlert: 'निकटतम शाखा में आवेदन रुका हो सकता है। सारथी आपको स्वचालित रूप से निकटतम सक्रिय (हरा) पार्टनर से जोड़ता है।',
      selectedPartnerLabel: 'चयनित चैनल पार्टनर',
      proceedBtn: 'दस्तावेज़ जांच पर जाएं',
      callBtn: 'कॉल करें',
      navigateBtn: 'दिशा प्राप्त करें',
      distanceLabel: 'दूरी',
      slaLabel: 'प्रक्रिया समय',
      nodalLabel: 'नोडल अधिकारी',
      hoursLabel: 'कार्य समय',
      schemesLabel: 'अधिकृत उत्पाद',
      bookApptBtn: 'अपॉइंटमेंट बुक करें',
    }
  }[lang === 'hi' ? 'hi' : 'en'];

  const selectedDist = selectedPartner && userLocation
    ? haversineDistance(userLocation.lat, userLocation.lng, selectedPartner.coordinates.lat, selectedPartner.coordinates.lng)
    : selectedPartner?.computedDistance || selectedPartner?.distanceKm || 0;

  const partnerTypes = [...new Set(CHANNEL_PARTNERS.map(p => p.type))];

  return (
    <div className="liquid-glass-card animate-fade-in" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--brand-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Navigation size={24} color="#f97316" />
            <span>{t.title}</span>
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--slate-600)', marginTop: '0.25rem' }}>
            {t.subtitle}
          </p>
        </div>

        {/* Locate Me Button */}
        <button
          onClick={requestLocation}
          disabled={isLocating}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', padding: '0.5rem 1rem', minWidth: 'auto' }}
        >
          {isLocating ? (
            <><Compass size={16} className="spin-animation" /> {t.locating}</>
          ) : (
            <><Locate size={16} /> {t.locateMe}</>
          )}
        </button>
      </div>

      {/* Smart Routing Alert */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(255,247,237,0.9), rgba(254,243,199,0.7))',
        border: '1.5px solid #fbbf24',
        borderRadius: '12px',
        padding: '0.85rem 1rem',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
      }}>
        <AlertTriangle size={20} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#92400e', marginBottom: '2px' }}>{t.routingAlertTitle}</div>
          <div style={{ fontSize: '0.78rem', color: '#78350f', lineHeight: 1.5 }}>{t.routingAlert}</div>
        </div>
      </div>

      {/* Filters Row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem', alignItems: 'center' }}>
        {/* Status filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Filter size={14} color="#64748b" />
          <span style={{ fontSize: '0.78rem', fontWeight: '600', color: '#475569' }}>{t.filterLabel}</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              fontSize: '0.78rem', padding: '4px 8px', borderRadius: '8px',
              border: '1.5px solid #cbd5e1', background: '#fff', fontWeight: '600',
              color: '#1e293b', cursor: 'pointer', fontFamily: 'var(--font-sans)',
            }}
          >
            <option value="all">{t.allStatuses}</option>
            {Object.entries(INTAKE_STATUS_DEFINITIONS).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>

        {/* Type filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Layers size={14} color="#64748b" />
          <span style={{ fontSize: '0.78rem', fontWeight: '600', color: '#475569' }}>{t.typeLabel}</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              fontSize: '0.78rem', padding: '4px 8px', borderRadius: '8px',
              border: '1.5px solid #cbd5e1', background: '#fff', fontWeight: '600',
              color: '#1e293b', cursor: 'pointer', fontFamily: 'var(--font-sans)',
            }}
          >
            <option value="all">{t.allTypes}</option>
            {partnerTypes.map(type => (
              <option key={type} value={type}>{type.replace('_', '-')}</option>
            ))}
          </select>
        </div>

        {/* Partner count */}
        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', marginLeft: 'auto' }}>
          {partnersWithDistance.length} partner(s) found
        </span>
      </div>

      {/* MAP CONTAINER */}
      <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '2px solid rgba(203,213,225,0.6)', marginBottom: '1.25rem' }}>
        <div
          ref={mapRef}
          id="saarthi-geo-map"
          style={{ height: '420px', width: '100%', borderRadius: '14px', zIndex: 1 }}
        />

        {/* Map Legend Overlay */}
        {showMapLegend && (
          <div style={{
            position: 'absolute', top: '12px', left: '12px', zIndex: 1000,
            background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
            borderRadius: '12px', padding: '10px 14px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)', border: '1px solid rgba(203,213,225,0.5)',
            minWidth: '170px',
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#091e20', marginBottom: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>{t.legendTitle}</span>
              <button onClick={() => setShowMapLegend(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#94a3b8' }}>×</button>
            </div>
            {Object.entries(STATUS_COLORS).map(([key, val]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: val.fill, border: `1.5px solid ${val.stroke}` }} />
                <span style={{ fontSize: '0.7rem', fontWeight: '600', color: '#475569' }}>
                  {INTAKE_STATUS_DEFINITIONS[key]?.label || val.label}
                </span>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', paddingTop: '4px', borderTop: '1px solid #e2e8f0' }}>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#2563eb', border: '2px solid #fff' }} />
              <span style={{ fontSize: '0.7rem', fontWeight: '600', color: '#2563eb' }}>Your Location</span>
            </div>
          </div>
        )}

        {/* Nearest Green Info Overlay */}
        {nearestGreen && (
          <div style={{
            position: 'absolute', bottom: '12px', left: '12px', right: '12px', zIndex: 1000,
            background: 'linear-gradient(135deg, rgba(236,253,245,0.95), rgba(209,250,229,0.92))',
            backdropFilter: 'blur(12px)',
            borderRadius: '12px', padding: '10px 14px',
            border: '1.5px solid #6ee7b7',
            display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap',
          }}>
            <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#065f46', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {t.nearestGreenLabel}
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#064e3b' }}>
                {nearestGreen.name} — {nearestGreen.computedDistance?.toFixed(1) || nearestGreen.distanceKm} km
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedPartner(nearestGreen);
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.setView([nearestGreen.coordinates.lat, nearestGreen.coordinates.lng], 15, { animate: true });
                }
              }}
              style={{
                fontSize: '0.72rem', fontWeight: '700', padding: '5px 12px',
                background: '#059669', color: '#fff', border: 'none', borderRadius: '8px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
              }}
            >
              Select <ArrowRight size={12} />
            </button>
          </div>
        )}

        {locationError && (
          <div style={{
            position: 'absolute', top: '12px', right: '12px', zIndex: 1000,
            background: 'rgba(255,247,237,0.95)', border: '1px solid #fbbf24',
            borderRadius: '8px', padding: '6px 10px', fontSize: '0.7rem', color: '#92400e',
            maxWidth: '220px', fontWeight: '500',
          }}>
            ⚠️ {locationError}
          </div>
        )}
      </div>

      {/* Partner Cards List (scrollable below map) */}
      <div style={{ maxHeight: '320px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '4px' }}>
        {partnersWithDistance.map(partner => {
          const isSelected = selectedPartner?.id === partner.id;
          const statusDef = INTAKE_STATUS_DEFINITIONS[partner.intakeStatus];
          const statusColor = STATUS_COLORS[partner.intakeStatus];
          const dist = partner.computedDistance?.toFixed(1) || partner.distanceKm;

          return (
            <div
              key={partner.id}
              onClick={() => {
                setSelectedPartner(partner);
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.setView([partner.coordinates.lat, partner.coordinates.lng], 15, { animate: true });
                  // Open popup
                  const idx = partnersWithDistance.indexOf(partner);
                  if (markersRef.current[idx]) markersRef.current[idx].openPopup();
                }
              }}
              style={{
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(236,253,245,0.9), rgba(209,250,229,0.7))'
                  : 'rgba(255,255,255,0.8)',
                border: isSelected ? '2px solid #10b981' : '1.5px solid #e2e8f0',
                borderRadius: '14px',
                padding: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? '0 4px 16px rgba(16,185,129,0.15)' : 'none',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  {/* Status badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{
                      display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%',
                      background: statusColor?.fill || '#94a3b8',
                      boxShadow: partner.intakeStatus === 'accepting' ? `0 0 8px ${statusColor?.glow}` : 'none',
                    }} />
                    <span style={{ fontSize: '0.68rem', fontWeight: '700', color: statusColor?.stroke || '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {statusDef?.label}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>•</span>
                    <span style={{ fontSize: '0.68rem', fontWeight: '600', color: '#64748b' }}>{partner.typeName}</span>
                  </div>

                  {/* Name */}
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#091e20', marginBottom: '2px' }}>{partner.name}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '4px' }}>📍 {partner.branch}</div>

                  {/* Metrics row */}
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.75rem', color: '#475569' }}>
                    <span><strong>📏 {dist} km</strong></span>
                    <span>⏱️ SLA: <strong>{partner.avgSlaDays} day(s)</strong></span>
                    {partner.appointmentAvailable && <span style={{ color: '#059669' }}>✅ Appointments Open</span>}
                    {partner.wheelchairAccessible && <span>♿ Accessible</span>}
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                  {isSelected && (
                    <span style={{
                      fontSize: '0.65rem', fontWeight: '800', color: '#065f46',
                      background: '#d1fae5', padding: '3px 8px', borderRadius: '6px',
                      textTransform: 'uppercase', letterSpacing: '0.5px',
                    }}>✓ {t.selectedPartnerLabel}</span>
                  )}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <a
                      href={`tel:${partner.contactPhone}`}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        fontSize: '0.7rem', fontWeight: '700', padding: '5px 10px',
                        background: '#0f3436', color: '#fff', borderRadius: '8px',
                        textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px',
                      }}
                    >
                      <Phone size={11} /> {t.callBtn}
                    </a>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${partner.coordinates.lat},${partner.coordinates.lng}`}
                      target="_blank"
                      rel="noopener"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        fontSize: '0.7rem', fontWeight: '700', padding: '5px 10px',
                        background: '#f97316', color: '#fff', borderRadius: '8px',
                        textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px',
                      }}
                    >
                      <ExternalLink size={11} /> {t.navigateBtn}
                    </a>
                  </div>
                </div>
              </div>

              {/* Reason text */}
              <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '6px', fontStyle: 'italic', lineHeight: 1.4 }}>
                {partner.intakeReason}
              </div>
            </div>
          );
        })}
      </div>

      {/* Proceed button */}
      {selectedPartner && onProceedToDocuments && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
          <button
            onClick={onProceedToDocuments}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {t.proceedBtn} <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default GeoSpatialMap;
