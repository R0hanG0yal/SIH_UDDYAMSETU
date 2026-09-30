import React, { useState, useEffect, useRef } from 'react';
import { useSaarthi } from '../context/SaarthiContext';
import { 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  PauseCircle, 
  Activity, 
  Navigation, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Phone, 
  ArrowRight, 
  Info,
  RefreshCw,
  ExternalLink,
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export function HonestMapPredictiveRouter() {
  const { 
    honestPartners, 
    selectedPartner, 
    setSelectedPartner,
    setIsWhatsappModalOpen,
    applicant 
  } = useSaarthi();

  const [filterType, setFilterType] = useState('ALL'); // 'ALL', 'GREEN', 'YELLOW', 'GREY'
  const [partnersList, setPartnersList] = useState(honestPartners);
  const [velocitySimulationTriggered, setVelocitySimulationTriggered] = useState(false);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // Filter partners
  const filteredPartners = partnersList.filter(p => {
    if (filterType === 'ALL') return true;
    return p.pinStatus === filterType;
  });

  // Simulated live downgrade: Green bank accepts 50 applications but disburses none in 30 days
  const triggerVelocityDowngrade = () => {
    setVelocitySimulationTriggered(true);
    setPartnersList(prev => prev.map(p => {
      if (p.id === 'PARTNER-UP-03') { // Utkarsh SFB
        return {
          ...p,
          pinStatus: 'YELLOW',
          statusLabel: 'AUTOMATIC DOWNGRADE // VELOCITY DRIFT',
          avgSlaDays: 8,
          velocityStatus: 'DOWNGRADED',
          velocityNote: 'Predictive SLA downgrade: 50 applications received, 0 disbursed in last 30 days. Auto-reclassified to Yellow to prevent applicant backlog.'
        };
      }
      return p;
    }));
  };

  const resetVelocitySimulation = () => {
    setVelocitySimulationTriggered(false);
    setPartnersList(honestPartners);
  };

  // Initialize or update Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Center on Lucknow coordinates
    const defaultCenter = [26.8467, 80.9462];

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 12,
        zoomControl: false,
        attributionControl: false
      });

      // Light, low-contrast map tiles to match the citizen-facing service UI.
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear old markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    // Add markers for filtered partners
    filteredPartners.forEach(partner => {
      const isSelected = selectedPartner?.id === partner.id;

      // Color coding for pins
      let pinColor = '#10b981'; // Green
      let pinBorder = '#059669';
      let pinGlow = 'rgba(16, 185, 129, 0.4)';

      if (partner.pinStatus === 'YELLOW') {
        pinColor = '#f59e0b';
        pinBorder = '#d97706';
        pinGlow = 'rgba(245, 158, 11, 0.4)';
      } else if (partner.pinStatus === 'GREY') {
        pinColor = '#94a3b8';
        pinBorder = '#64748b';
        pinGlow = 'rgba(148, 163, 184, 0.3)';
      }

      // Create custom SVG HTML marker
      const customIcon = L.divIcon({
        className: 'custom-leaflet-pin',
        html: `
          <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: ${pinGlow}; animation: ${partner.pinStatus === 'GREEN' ? 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' : 'none'}; opacity: 0.75;"></div>
            <div style="width: 24px; height: 24px; border-radius: 50%; background: ${pinColor}; border: 2px solid ${isSelected ? '#ffffff' : pinBorder}; box-shadow: 0 4px 12px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; color: #000; font-weight: bold; font-size: 11px;">
              ${partner.pinStatus === 'GREEN' ? '●' : partner.pinStatus === 'YELLOW' ? '▲' : '■'}
            </div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const marker = L.marker([partner.coordinates.lat, partner.coordinates.lng], { icon: customIcon })
        .addTo(map)
        .on('click', () => {
          setSelectedPartner(partner);
        });

      markersRef.current.push(marker);
    });

  }, [filteredPartners, selectedPartner]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <section id="honest-map-section" className="w-full py-12 sm:py-16 border-b border-white/10 bg-obsidian-950">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                PILLAR 05 // GEO-SPATIAL ROUTING
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 text-white/60 border border-white/10 hidden sm:inline">
                TRANSPARENCY-FIRST COMPLIANCE
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal uppercase tracking-tight">
              The <span className="italic text-emerald-400 font-light">"Honest Map"</span> &amp; Predictive Routing
            </h2>
            <p className="mt-2 text-white/70 text-xs sm:text-sm font-light max-w-3xl leading-relaxed">
              The map is a prototype view. Partner availability and status shown here are sample data, not a live or verified directory; contact the institution directly before travelling.
            </p>
          </div>

          {/* Interactive Predictive SLA Live Downgrade Demo */}
          <div className="bg-obsidian-900 border border-amber-500/30 rounded-2xl p-4 sm:p-5 max-w-md shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0 border border-amber-500/40">
                <Activity className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400 font-bold block">
                  PREDICTIVE VELOCITY SIMULATION
                </span>
                <p className="text-white/80 text-xs font-light mt-1">
                  "If a bank accepts 50 files but disburses none in 30 days, the AI downgrades them without waiting for self-reporting."
                </p>
                <div className="mt-3 flex items-center gap-2">
                  {!velocitySimulationTriggered ? (
                    <button
                      onClick={triggerVelocityDowngrade}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 font-mono text-[11px] uppercase tracking-wider transition flex items-center gap-1.5"
                    >
                      <span>Simulate Zero-Disbursement Stalling</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ) : (
                    <button
                      onClick={resetVelocitySimulation}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] uppercase tracking-wider transition flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Reset Live Telemetry</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pin Legend Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          
          {/* Green Pin Legend */}
          <button
            onClick={() => setFilterType(filterType === 'GREEN' ? 'ALL' : 'GREEN')}
            className={`p-4 rounded-2xl border text-left transition ${
              filterType === 'GREEN' 
                ? 'bg-emerald-950/40 border-emerald-500 shadow-lg' 
                : 'bg-obsidian-900 border-white/10 hover:border-emerald-500/50'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="w-4 h-4 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
              <span className="font-mono text-xs uppercase font-bold text-emerald-400 tracking-wider">
                🟢 Green Pin &bull; Prime Match
              </span>
            </div>
            <p className="text-white/70 text-xs font-light leading-relaxed">
              Nearest branch, active concessional liquidity allocated (&gt;50%), low NPA (&lt;3.5%), and verified disbursement within 3 business days.
            </p>
          </button>

          {/* Yellow Pin Legend */}
          <button
            onClick={() => setFilterType(filterType === 'YELLOW' ? 'ALL' : 'YELLOW')}
            className={`p-4 rounded-2xl border text-left transition ${
              filterType === 'YELLOW' 
                ? 'bg-amber-950/40 border-amber-500 shadow-lg' 
                : 'bg-obsidian-900 border-white/10 hover:border-amber-500/50'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="w-4 h-4 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.8)]"></span>
              <span className="font-mono text-xs uppercase font-bold text-amber-400 tracking-wider">
                🟡 Yellow Pin &bull; Limited Capacity
              </span>
            </div>
            <p className="text-white/70 text-xs font-light leading-relaxed">
              High pending caseload or quota utilization &gt;85%. Processing velocity is degraded; applicant is alerted that approval may take 6+ days.
            </p>
          </button>

          {/* Grey Pin Legend */}
          <button
            onClick={() => setFilterType(filterType === 'GREY' ? 'ALL' : 'GREY')}
            className={`p-4 rounded-2xl border text-left transition ${
              filterType === 'GREY' 
                ? 'bg-slate-900 border-slate-400 shadow-lg' 
                : 'bg-obsidian-900 border-white/10 hover:border-slate-400/50'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="w-4 h-4 rounded-full bg-slate-400"></span>
              <span className="font-mono text-xs uppercase font-bold text-slate-300 tracking-wider">
                ⚪ Grey Pin &bull; Transparently Paused
              </span>
            </div>
            <p className="text-white/70 text-xs font-light leading-relaxed">
              Not hidden from auditors! Kept on directory with transparent tag: <em>"Temporarily paused due to quarterly audit / high overdues."</em>
            </p>
          </button>

        </div>

        {/* Main Map & Partner Telemetry Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Leaflet Interactive Map Canvas (7 Cols) */}
          <div className="lg:col-span-7 bg-obsidian-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
            
            {/* Top map overlay metadata */}
            <div className="absolute top-4 left-4 z-[500] bg-obsidian-950/90 backdrop-blur-md border border-white/10 px-3 py-2 rounded-xl flex items-center gap-2 font-mono text-[11px] text-white">
              <Compass className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
              <span>LUCKNOW CLUSTER &bull; RADIUS 10 KM</span>
            </div>

            <div className="absolute top-4 right-4 z-[500] flex items-center gap-2">
              <span className="bg-obsidian-950/90 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl font-mono text-[10px] text-white/70">
                ACTIVE PARTNERS: <strong>{filteredPartners.length}</strong>
              </span>
            </div>

            {/* Leaflet container */}
            <div 
              ref={mapContainerRef} 
              className="w-full h-[450px] sm:h-[550px] bg-obsidian-950"
            />

            {/* Map bottom summary bar */}
            <div className="p-3 bg-obsidian-950/95 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-white/60 font-mono text-[11px] px-4">
              <span>GPS ANCHOR: 26.8467° N, 80.9462° E (LUCKNOW)</span>
              <span className="text-emerald-400">TELEMETRY SYNCED VIA STATE CHANNEL FINANCE API</span>
            </div>
          </div>

          {/* Right: Partner List & Selected Partner Deep-Dive (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Partner Quick-Select Cards */}
            <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
              {filteredPartners.map(partner => {
                const isSelected = selectedPartner?.id === partner.id;

                let badgeColor = "bg-emerald-500/20 text-emerald-400 border-emerald-500/40";
                if (partner.pinStatus === 'YELLOW') badgeColor = "bg-amber-500/20 text-amber-400 border-amber-500/40";
                if (partner.pinStatus === 'GREY') badgeColor = "bg-slate-700/50 text-slate-300 border-slate-500/40";

                return (
                  <div
                    key={partner.id}
                    onClick={() => setSelectedPartner(partner)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-obsidian-900 border-champagne-gold shadow-lg' 
                        : 'bg-obsidian-950 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] uppercase font-bold border ${badgeColor}`}>
                            {partner.pinStatus === 'GREEN' ? '● PRIME' : partner.pinStatus === 'YELLOW' ? '▲ LIMITED' : '■ PAUSED'}
                          </span>
                          <span className="font-mono text-[10px] text-white/40">
                            {partner.type} &bull; {partner.distanceKm} km away
                          </span>
                        </div>
                        <h4 className="font-medium text-sm text-white">{partner.name}</h4>
                        <p className="text-white/50 text-xs font-light mt-0.5">{partner.branch}</p>
                      </div>

                      <div className="text-right font-mono text-xs">
                        <span className="text-white/40 block text-[9px]">SLA</span>
                        <span className={`font-bold ${partner.pinStatus === 'GREEN' ? 'text-emerald-400' : partner.pinStatus === 'YELLOW' ? 'text-amber-400' : 'text-slate-400'}`}>
                          {partner.avgSlaDays} Days
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Partner Deep-Dive Card */}
            {selectedPartner && (
              <div className="bg-obsidian-900 border border-white/15 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
                
                {/* Status Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider border ${
                    selectedPartner.pinStatus === 'GREEN'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : selectedPartner.pinStatus === 'YELLOW'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : 'bg-slate-800 text-slate-300 border-slate-600'
                  }`}>
                    {selectedPartner.statusLabel}
                  </span>

                  <span className="font-mono text-xs text-white/60">
                    DIST: <strong>{selectedPartner.distanceKm} KM</strong>
                  </span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl text-white font-medium mb-1">
                  {selectedPartner.name}
                </h3>
                <p className="text-white/60 text-xs font-light mb-4">
                  {selectedPartner.branch}
                </p>

                {/* Special Pause Reason Callout for Grey Pins */}
                {selectedPartner.pinStatus === 'GREY' && (
                  <div className="bg-slate-900/90 border border-slate-600 rounded-2xl p-4 mb-4">
                    <div className="flex items-start gap-2.5">
                      <PauseCircle className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-mono text-[10px] uppercase font-bold text-slate-200 tracking-wider block">
                          Transparent Audit Pause Notice
                        </span>
                        <p className="text-slate-300 text-xs mt-1 leading-relaxed font-light">
                          {selectedPartner.pauseReason}
                        </p>
                        <p className="text-emerald-400 font-mono text-[11px] mt-2">
                          &rarr; Recommended reroute: Apply at <strong>UPSCFDC Directorate (Green Pin, 2.4 km)</strong> for instant biometric intake.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Velocity Degradation Note for Yellow Pins */}
                {selectedPartner.pinStatus === 'YELLOW' && (
                  <div className="bg-amber-950/30 border border-amber-500/40 rounded-2xl p-4 mb-4">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-mono text-[10px] uppercase font-bold text-amber-300 tracking-wider block">
                          Predictive Velocity Alert
                        </span>
                        <p className="text-amber-200/90 text-xs mt-1 leading-relaxed font-light">
                          {selectedPartner.velocityNote}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bank Telemetry Grid */}
                <div className="grid grid-cols-3 gap-3 mb-5 font-mono text-center">
                  <div className="bg-obsidian-950 p-3 rounded-xl border border-white/5">
                    <span className="text-[9px] uppercase opacity-50 block">Gross NPA</span>
                    <span className={`text-base font-bold mt-0.5 block ${selectedPartner.grossNpaPercent > 5 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {selectedPartner.grossNpaPercent}%
                    </span>
                  </div>

                  <div className="bg-obsidian-950 p-3 rounded-xl border border-white/5">
                    <span className="text-[9px] uppercase opacity-50 block">Available Quota</span>
                    <span className="text-base font-bold text-champagne-gold mt-0.5 block">
                      {selectedPartner.fundAvailablePercent}%
                    </span>
                  </div>

                  <div className="bg-obsidian-950 p-3 rounded-xl border border-white/5">
                    <span className="text-[9px] uppercase opacity-50 block">Avg SLA</span>
                    <span className="text-base font-bold text-white mt-0.5 block">
                      {selectedPartner.avgSlaDays} Days
                    </span>
                  </div>
                </div>

                {/* Quota Progress Bar */}
                <div className="bg-obsidian-950 p-3.5 rounded-xl border border-white/5 mb-5 font-mono text-xs">
                  <div className="flex justify-between text-[10px] mb-1.5 opacity-70">
                    <span>Allocated: {formatCurrency(selectedPartner.allocatedQuota)}</span>
                    <span>Utilized: {formatCurrency(selectedPartner.utilizedQuota)}</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${selectedPartner.fundAvailablePercent < 20 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${100 - selectedPartner.fundAvailablePercent}%` }}
                    />
                  </div>
                </div>

                {/* Nodal Officer Contact & Route Button */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 font-mono text-xs">
                  <div>
                    <span className="text-[10px] opacity-50 block uppercase">Nodal Officer</span>
                    <span className="text-white font-medium block">{selectedPartner.nodalOfficer}</span>
                    <span className="text-white/60 text-[11px] block">{selectedPartner.contactPhone}</span>
                  </div>

                  {selectedPartner.pinStatus !== 'GREY' ? (
                    <button
                      onClick={() => setIsWhatsappModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-champagne-gold text-black font-bold uppercase tracking-wider hover:bg-white transition flex items-center gap-1.5 active:scale-95"
                    >
                      <span>Route via WhatsApp</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      disabled
                      className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-500 font-bold uppercase tracking-wider cursor-not-allowed"
                    >
                      Routing Paused
                    </button>
                  )}
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
