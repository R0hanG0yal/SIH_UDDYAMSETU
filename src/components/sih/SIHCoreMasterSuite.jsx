import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Compass, Calculator, Navigation, ShieldCheck, 
  ArrowRight, CheckCircle2, Landmark, Sliders, BarChart3 
} from 'lucide-react';
import { SmartSchemeRecommender } from './SmartSchemeRecommender';
import { DynamicFinancialCalculator } from './DynamicFinancialCalculator';
import { GeoSpatialPartnerLocator } from './GeoSpatialPartnerLocator';
import { AdminHITLDashboard } from './AdminHITLDashboard';
import { SIHVisualOverview, JourneyStepper } from './SIHVisuals';

export function SIHCoreMasterSuite({ lang = 'en' }) {
  const [activeModule, setActiveModule] = useState(1);
  const [matchedScheme, setMatchedScheme] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [pipelineStats, setPipelineStats] = useState({ staged: 53, geocoded: 53, promoted: 5 });

  // Live pipeline numbers for the visual overview (degrades silently)
  useEffect(() => {
    fetch('/api/v2/admin/scraped-partners')
      .then(r => r.json())
      .then(d => {
        if (d.status !== 'SUCCESS') return;
        const b = d.byStatus || {};
        const geocoded = (b.GEOCODED || 0) + (b.GEOCODED_OFFLINE || 0) + (b.LOW_CONFIDENCE || 0) + (b.MANUAL_REVIEW || 0);
        setPipelineStats({
          staged: d.count || 0,
          geocoded,
          promoted: b.PROMOTED || 0
        });
      })
      .catch(() => {});
  }, []);

  const modules = [
    { id: 0, title: "0. Visual Overview", icon: BarChart3, desc: "Architecture flowchart, rate charts & pipeline diagrams" },
    { id: 1, title: "1. Scheme Recommender", icon: Compass, desc: "Multi-lingual input & AI scheme categorization" },
    { id: 2, title: "2. Financial Calculator", icon: Calculator, desc: "90% loan, 6.5%-15% rates, 3-12m moratorium" },
    { id: 3, title: "3. Geo-Spatial Router", icon: Navigation, desc: "Leaflet map with NPA/Overdue safety filter" },
    { id: 4, title: "4. HITL Admin Studio", icon: ShieldCheck, desc: "Human-in-the-Loop circular diff & approve/reject" },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 space-y-8 font-sans">
      {/* SIH Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-900 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart India Hackathon • Problem Statement ID: SIH26092</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight mt-3">
              AI-Driven Scheme Matching for Marginalized Entrepreneurs
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
              Issued by the <strong>Ministry of Social Justice and Empowerment (MoSJE)</strong> &amp; <strong>NSFDC</strong>. Connecting Scheduled Caste beneficiaries (annual income ≤ ₹5.00 Lakhs) with concessional credit covering up to 90% of project costs through verified SCAs, PSBs, RRBs, and NBFC-MFIs.
            </p>
          </div>

          <div className="flex flex-col items-end justify-center p-4 rounded-2xl bg-slate-800/80 border border-white/10 text-right">
            <span className="text-xs text-slate-400">Target Demographic</span>
            <span className="text-sm font-bold text-emerald-400">SC Population ≤ ₹5.00L Income</span>
            <span className="text-xs text-slate-400 mt-2">Sovereign Concession</span>
            <span className="text-sm font-bold text-orange-400">Up to 90% Project Cost</span>
          </div>
        </div>

        {/* 5 Module Tabs Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-8 pt-6 border-t border-white/10">
          {modules.map((m) => {
            const Icon = m.icon;
            const isActive = activeModule === m.id;
            return (
              <button
                type="button"
                key={m.id}
                onClick={() => setActiveModule(m.id)}
                className={`flex flex-col text-left p-3.5 rounded-2xl border transition cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-800/60 border-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span className="text-xs font-black text-white">{m.title}</span>
                </div>
                <span className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                  {m.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Journey Stepper — visual progress across the 4-step flow */}
      {activeModule > 0 && (
        <div className="px-2">
          <JourneyStepper current={activeModule} />
        </div>
      )}

      {/* Active Module Container */}
      <div className="transition-all duration-300">
        {activeModule === 0 && (
          <SIHVisualOverview
            staged={pipelineStats.staged}
            geocoded={pipelineStats.geocoded}
            promoted={pipelineStats.promoted}
          />
        )}
        {activeModule === 1 && (
          <SmartSchemeRecommender 
            defaultLang={lang}
            onSchemeMatched={(scheme) => setMatchedScheme(scheme)}
            onSelectSchemeForCalculator={(scheme) => {
              setMatchedScheme(scheme);
              setActiveModule(2);
            }}
          />
        )}

        {activeModule === 2 && (
          <DynamicFinancialCalculator 
            initialCost={matchedScheme ? matchedScheme.cost : 120000}
            initialRate={matchedScheme ? matchedScheme.effectiveInterestRate : 6.5}
            initialMoratorium={matchedScheme ? matchedScheme.recommendedMoratoriumMonths : 6}
            initialTenure={matchedScheme ? matchedScheme.defaultTenureYears : 3}
            initialCadence={matchedScheme ? matchedScheme.cadence : 'QUARTERLY'}
            onProceedToLocator={() => setActiveModule(3)}
          />
        )}

        {activeModule === 3 && (
          <GeoSpatialPartnerLocator 
            selectedSchemeId={matchedScheme ? matchedScheme.schemeId : 'NSFDC_MICRO_FINANCE'}
            onPartnerSelected={(partner) => setSelectedPartner(partner)}
            onApplicationDispatched={(partner) => {
              setSelectedPartner(partner);
            }}
          />
        )}

        {activeModule === 4 && (
          <AdminHITLDashboard />
        )}
      </div>
    </div>
  );
}

export default SIHCoreMasterSuite;
