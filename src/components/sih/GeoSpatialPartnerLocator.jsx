import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, ShieldAlert, CheckCircle2, XCircle, Navigation, 
  Phone, Clock, ArrowRight, Building, Award, Filter, 
  ExternalLink, Sparkles, AlertTriangle, Info 
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ChannelTypeChart } from './SIHVisuals';

export function GeoSpatialPartnerLocator({ 
  selectedSchemeId = 'NSFDC_MICRO_FINANCE', 
  onPartnerSelected,
  onApplicationDispatched 
}) {
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersGroupRef = useRef(null);

  // User simulated coordinates (Lucknow demo center)
  const [userCoords, setUserCoords] = useState({ lat: 26.8467, lng: 80.9462 });
  const [loading, setLoading] = useState(false);
  const [partnersData, setPartnersData] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [dispatchedSuccess, setDispatchedSuccess] = useState(false);

  // Fetch partners from backend router with NPA / Overdue safety filtering
  const fetchEligiblePartners = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v2/router/channel-partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userLatitude: userCoords.lat,
          userLongitude: userCoords.lng,
          schemeId: selectedSchemeId,
          district: 'Lucknow'
        })
      });
      const data = await response.json();
      if (data.status === 'SUCCESS') {
        setPartnersData(data);
        if (data.recommendedPartner) {
          setSelectedPartner(data.recommendedPartner);
        }
      }
    } catch (err) {
      console.error('[Partner Locator Error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEligiblePartners();
  }, [selectedSchemeId, userCoords]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [userCoords.lat, userCoords.lng],
        zoom: 12,
        zoomControl: true
      });

      // Dark Mode OpenStreetMap Tile Layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 19
      }).addTo(map);

      // User Location Marker (Pulse Blue)
      const userIcon = L.divIcon({
        className: 'user-marker',
        html: `
          <div style="position:relative; width:24px; height:24px;">
            <div style="position:absolute; width:24px; height:24px; border-radius:50%; background:rgba(59,130,246,0.3); animation: ping 1.5s infinite;"></div>
            <div style="position:absolute; top:4px; left:4px; width:16px; height:16px; border-radius:50%; background:#2563eb; border:3px solid #ffffff; box-shadow:0 0 10px rgba(37,99,235,0.8);"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      L.marker([userCoords.lat, userCoords.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup("<b>Your Enterprise Location</b><br>Lucknow, Uttar Pradesh");

      const markersGroup = L.layerGroup().addTo(map);
      markersGroupRef.current = markersGroup;
      leafletMapRef.current = map;
    }

    return () => {
      // Cleanup on unmount
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Update Partner Markers when data changes
  useEffect(() => {
    if (!leafletMapRef.current || !markersGroupRef.current || !partnersData) return;

    markersGroupRef.current.clearLayers();

    // Render Eligible Partners (Green / Amber)
    (partnersData.eligiblePartners || []).forEach((p) => {
      const isSelected = selectedPartner?.id === p.id;
      const isSCA = p.type === 'SCA';
      const pinColor = isSCA ? '#10b981' : '#f59e0b';

      const customIcon = L.divIcon({
        className: 'partner-marker',
        html: `
          <div style="background:${pinColor}; width:${isSelected ? '36px' : '28px'}; height:${isSelected ? '36px' : '28px'}; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-weight:bold; font-size:12px; border:2px solid white; box-shadow:0 4px 10px rgba(0,0,0,0.5); transform:${isSelected ? 'scale(1.2)' : 'scale(1)'}; transition:all 0.2s;">
            ${p.type === 'SCA' ? '🏛️' : p.type === 'RRB' ? '🌾' : '🏦'}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([p.latitude, p.longitude], { icon: customIcon })
        .addTo(markersGroupRef.current)
        .bindPopup(`
          <div style="font-family:sans-serif; min-width:180px;">
            <b style="color:#0f172a;">${p.name}</b><br/>
            <span style="font-size:11px; color:#64748b;">${p.branch}</span><br/>
            <span style="font-size:11px; font-weight:bold; color:#10b981;">✓ ${p.distanceKm} km away • ${p.avgSlaDays} Days SLA</span><br/>
            <span style="font-size:10px; color:#475569;">Nodal: ${p.nodalOfficer}</span>
          </div>
        `);

      marker.on('click', () => {
        setSelectedPartner(p);
        if (onPartnerSelected) onPartnerSelected(p);
      });
    });
  }, [partnersData, selectedPartner]);

  const handleDispatch = () => {
    setDispatchedSuccess(true);
    if (onApplicationDispatched) {
      onApplicationDispatched(selectedPartner);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 shadow-2xl text-slate-100 font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Navigation className="w-3.5 h-3.5" />
            Module 3: Geo-Spatial Partner Locator & Router
          </span>
          <h2 className="text-2xl md:text-3xl font-black mt-2 text-white tracking-tight">
            Authorized Channel Partner Locator
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Locates nearest SCAs, PSBs, and RRBs with real-time fund availability. Automated NPA & overdue safety filter prevents routing to congested desks.
          </p>
        </div>

        {/* Safety Filter Badge */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>NPA &lt; 7.0% & Overdue &lt; 12.0% Enforced</span>
        </div>
      </div>

      {/* Main Map & Partner List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
        {/* Leaflet Map Container (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div 
            ref={mapContainerRef} 
            className="w-full h-[400px] md:h-[460px] rounded-3xl overflow-hidden border border-white/15 shadow-inner relative z-0"
          >
            {loading && (
              <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-10">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <Navigation className="w-5 h-5 animate-spin text-cyan-400" />
                  Routing to Verified Channel Partners...
                </span>
              </div>
            )}
          </div>

          {/* Partners-by-type chart (visual summary of the routing pool) */}
          {partnersData?.eligiblePartners?.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/10">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-[11px] font-black text-white uppercase tracking-wider">Routing Pool by Partner Type</h4>
                <span className="text-[10px] text-slate-500">{partnersData.eligiblePartnersCount} eligible of {partnersData.totalDiscovered} discovered</span>
              </div>
              <ChannelTypeChart partners={partnersData.eligiblePartners} />
            </div>
          )}

          {/* Map Legend */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 px-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                <span>State Agency (SCA - 6.5%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                <span>Small Finance Bank (SFB - 7.5%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
                <span>Your Location</span>
              </span>
            </div>
            <span>Auto-Centering: Lucknow Center</span>
          </div>

          {/* Honest Map provenance footnote (from safetyAuditLog disclaimer) */}
          {partnersData?.safetyAuditLog?.disclaimer && (
            <p className="flex items-start gap-2 px-2 text-[11px] text-slate-500 leading-snug">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{partnersData.safetyAuditLog.disclaimer}</span>
            </p>
          )}

          {/* High NPA Disqualification Notification (Visual Proof of Safety Filter) */}
          {partnersData?.safetyAuditLog?.disqualifiedList?.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/30 flex items-start gap-3 text-xs text-rose-200">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-rose-300 block">
                  Safety Gate Blocked {partnersData.safetyAuditLog.disqualifiedList.length} Congested / High-Risk Channel Desk(s):
                </span>
                <span className="text-slate-300">
                  {partnersData.safetyAuditLog.disqualifiedList.map(d => `${d.name} (${d.reasons.join(', ')})`).join('; ')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Partner Detail & Application Dispatch Card (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              Recommended Routing Desk ({partnersData?.eligiblePartnersCount || 0} Available)
            </h3>

            {selectedPartner ? (
              <div className="p-5 rounded-3xl bg-slate-800/80 border border-emerald-500/40 shadow-xl space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {selectedPartner.type} Channel Partner
                    </span>
                    <h4 className="text-lg font-black text-white mt-1.5">
                      {selectedPartner.name}
                    </h4>
                    <p className="text-xs text-slate-400">{selectedPartner.branch}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Distance</span>
                    <span className="text-lg font-black text-emerald-400 font-mono">
                      {selectedPartner.distanceKm} km
                    </span>
                  </div>
                </div>

                {/* Honest Map telemetry flag */}
                {selectedPartner.healthDataSource === 'SIMULATED_DEMO' && (
                  <p className="flex items-start gap-1.5 text-[10px] text-slate-400 -mt-2">
                    <Info className="w-3 h-3 shrink-0 mt-0.5 text-slate-500" />
                    <span>NPA/overdue telemetry simulated for demo — per-branch NPA is not published by regulators.</span>
                  </p>
                )}

                {/* Telemetry Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                    <span className="text-slate-400 block">Average SLA</span>
                    <span className="font-bold text-white font-mono">{selectedPartner.avgSlaDays} Working Days</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                    <span className="text-slate-400 block">Fund Utilization</span>
                    <span className="font-bold text-emerald-400 font-mono">{selectedPartner.fundUtilizationPercent}% (Quota Open)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                    <span className="text-slate-400 block">Gross NPA Ratio</span>
                    <span className="font-bold text-emerald-400 font-mono">{selectedPartner.grossNpaPercent}% (Safe)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                    <span className="text-slate-400 block">Overdue Ratio</span>
                    <span className="font-bold text-emerald-400 font-mono">{selectedPartner.overdueRatePercent}% (Healthy)</span>
                  </div>
                </div>

                {/* Nodal Officer Contact Details */}
                <div className="p-3 rounded-2xl bg-slate-900/90 border border-white/5 space-y-1 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Award className="w-3.5 h-3.5 text-orange-400" />
                    <span>Nodal Officer: <b>{selectedPartner.nodalOfficer}</b></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Desk Helpline: <b>{selectedPartner.contactPhone}</b></span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-sm">
                No channel partner selected.
              </div>
            )}
          </div>

          {/* Action: Route & Dispatch Application */}
          <div>
            {dispatchedSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-center">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                <span className="font-bold block text-base">Application Successfully Routed!</span>
                <span className="text-xs text-emerald-300">
                  Application forwarded to {selectedPartner?.name}. Verification token generated on PM-SURAJ portal.
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleDispatch}
                disabled={!selectedPartner}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-600 hover:to-blue-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 cursor-pointer transition transform active:scale-[0.99]"
              >
                <Navigation className="w-4 h-4" />
                <span>Route Application to This Partner</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GeoSpatialPartnerLocator;
