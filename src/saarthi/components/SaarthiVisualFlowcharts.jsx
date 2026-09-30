import React, { useState } from 'react';
import { 
  GitBranch, 
  Workflow, 
  ShieldCheck, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  PauseCircle, 
  Clock, 
  ArrowRight, 
  FileCode, 
  Coins, 
  TrendingUp, 
  Sparkles,
  Layers,
  Database,
  Search,
  Check,
  Eye
} from 'lucide-react';

export function SaarthiVisualFlowcharts() {
  const [activeFlowchart, setActiveFlowchart] = useState('ingestion'); // 'ingestion', 'arbitrage', 'honest_map', 'waterfall'
  const [selectedNode, setSelectedNode] = useState(null);

  return (
    <section id="flowcharts-section" className="w-full py-12 sm:py-16 border-b border-white/10 bg-obsidian-950">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5 font-bold">
                <Workflow className="w-3.5 h-3.5" />
                Proposed solution workflow
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 text-white/60 border border-white/10 hidden sm:inline">
                Prototype diagrams
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal uppercase tracking-tight">
              How the proposed system fits together
            </h2>
            <p className="mt-2 text-white/70 text-xs sm:text-sm font-light max-w-3xl leading-relaxed">
              These diagrams explain the intended flow. This prototype does not connect to live government systems or provide an official eligibility decision.
            </p>
          </div>

          {/* Flowchart Switcher Pills */}
          <div className="flex flex-wrap items-center gap-2 bg-obsidian-900 p-1.5 rounded-2xl border border-white/10 font-mono text-xs">
            <button
              onClick={() => { setActiveFlowchart('ingestion'); setSelectedNode(null); }}
              className={`px-3 py-1.5 rounded-xl transition ${activeFlowchart === 'ingestion' ? 'bg-champagne-gold text-black font-bold shadow' : 'text-white/70 hover:text-white'}`}
            >
              01 // Ingestion Pipeline
            </button>
            <button
              onClick={() => { setActiveFlowchart('arbitrage'); setSelectedNode(null); }}
              className={`px-3 py-1.5 rounded-xl transition ${activeFlowchart === 'arbitrage' ? 'bg-champagne-gold text-black font-bold shadow' : 'text-white/70 hover:text-white'}`}
            >
              02 // Arbitrage &amp; Auto-DPR Flow
            </button>
            <button
              onClick={() => { setActiveFlowchart('honest_map'); setSelectedNode(null); }}
              className={`px-3 py-1.5 rounded-xl transition ${activeFlowchart === 'honest_map' ? 'bg-champagne-gold text-black font-bold shadow' : 'text-white/70 hover:text-white'}`}
            >
              03 // Honest Routing Tree
            </button>
            <button
              onClick={() => { setActiveFlowchart('waterfall'); setSelectedNode(null); }}
              className={`px-3 py-1.5 rounded-xl transition ${activeFlowchart === 'waterfall' ? 'bg-champagne-gold text-black font-bold shadow' : 'text-white/70 hover:text-white'}`}
            >
              04 // Capital Waterfall
            </button>
          </div>
        </div>

        {/* FLOWCHART 01: PROPOSED SCHEME INFORMATION REVIEW */}
        {activeFlowchart === 'ingestion' && (
          <div className="bg-obsidian-900 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-8">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 font-bold block mb-1">
                  Proposed information review flow
                </span>
                <h3 className="font-serif text-2xl text-white font-medium">
                  Published source to reviewed scheme information
                </h3>
              </div>
              <span className="font-mono text-xs text-white/50">
                Select a step to read a short explanation
              </span>
            </div>

            {/* Interactive Animated SVG Flowchart */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
              
              {/* Node 1: Official Gazette PDF */}
              <div 
                onClick={() => setSelectedNode('gazette')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative group ${
                  selectedNode === 'gazette' ? 'bg-obsidian-950 border-emerald-400 shadow-xl' : 'bg-obsidian-950/70 border-white/10 hover:border-white/30'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-mono font-bold text-sm mb-3 border border-purple-500/30">
                  01
                </div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-purple-300 block mb-1">ORIGIN SOURCE</span>
                <h4 className="font-sans font-bold text-sm text-white mb-2">MoSJE Gazette PDF</h4>
                <p className="text-white/60 text-xs font-light leading-relaxed">
                  A scheme notice or circular is the authoritative source for current rules.
                </p>
                <div className="mt-3 pt-3 border-t border-white/10 font-mono text-[9px] text-white/40 flex items-center justify-between">
                  <span>socialjustice.gov.in</span>
                  <span className="text-purple-400">PDF</span>
                </div>
              </div>

              {/* Node 2: Python Scraper & Hash */}
              <div 
                onClick={() => setSelectedNode('scraper')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative group ${
                  selectedNode === 'scraper' ? 'bg-obsidian-950 border-emerald-400 shadow-xl' : 'bg-obsidian-950/70 border-white/10 hover:border-white/30'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-mono font-bold text-sm mb-3 border border-blue-500/30">
                  02
                </div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-blue-300 block mb-1">INGESTION AGENT</span>
                <h4 className="font-sans font-bold text-sm text-white mb-2">Python SHA-256 Worker</h4>
                <p className="text-white/60 text-xs font-light leading-relaxed">
                  A future source-monitoring service could flag a changed notice for review.
                </p>
                <div className="mt-3 pt-3 border-t border-white/10 font-mono text-[9px] text-white/40 flex items-center justify-between">
                  <span>Example processing step</span>
                  <span className="text-blue-400">PROPOSED</span>
                </div>
              </div>

              {/* Node 3: Structured LLM OCR Extraction */}
              <div 
                onClick={() => setSelectedNode('llm')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative group ${
                  selectedNode === 'llm' ? 'bg-obsidian-950 border-emerald-400 shadow-xl' : 'bg-obsidian-950/70 border-white/10 hover:border-white/30'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-sm mb-3 border border-amber-500/30">
                  03
                </div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-amber-300 block mb-1">PARSER ENGINE</span>
                <h4 className="font-sans font-bold text-sm text-white mb-2">LLM Entity Extractor</h4>
                <p className="text-white/60 text-xs font-light leading-relaxed">
                  Structured fields such as eligibility, benefit and application steps are captured for a reviewer.
                </p>
                <div className="mt-3 pt-3 border-t border-white/10 font-mono text-[9px] text-white/40 flex items-center justify-between">
                  <span>Reviewer checks the source</span>
                  <span className="text-amber-400">REVIEW</span>
                </div>
              </div>

              {/* Node 4: Nodal Officer HITL Review */}
              <div 
                onClick={() => setSelectedNode('hitl')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative group ${
                  selectedNode === 'hitl' ? 'bg-obsidian-950 border-emerald-400 shadow-xl' : 'bg-obsidian-950/70 border-white/10 hover:border-white/30'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-mono font-bold text-sm mb-3 border border-purple-500/30">
                  04
                </div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-purple-300 block mb-1">SOVEREIGN GATE</span>
                <h4 className="font-sans font-bold text-sm text-white mb-2">Nodal Officer Cockpit</h4>
                <p className="text-white/60 text-xs font-light leading-relaxed">
                  A designated scheme owner can confirm that the extracted details reflect the published notice.
                </p>
                <div className="mt-3 pt-3 border-t border-white/10 font-mono text-[9px] text-white/40 flex items-center justify-between">
                  <span>Human review</span>
                  <span className="text-purple-400">PROPOSED</span>
                </div>
              </div>

              {/* Node 5: 100% Grounded Public Engine */}
              <div 
                onClick={() => setSelectedNode('public')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative group ${
                  selectedNode === 'public' ? 'bg-obsidian-950 border-emerald-400 shadow-xl' : 'bg-obsidian-950/70 border-white/10 hover:border-white/30'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-sm mb-3 border border-emerald-500/30">
                  05
                </div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-300 block mb-1">PUBLIC ENGINE</span>
                <h4 className="font-sans font-bold text-sm text-white mb-2">Scheme finder</h4>
                <p className="text-white/60 text-xs font-light leading-relaxed">
                  The demo compares a sample profile with its scheme catalogue and shows a possible match.
                </p>
                <div className="mt-3 pt-3 border-t border-white/10 font-mono text-[9px] text-white/40 flex items-center justify-between">
                  <span>Confirm with provider</span>
                  <span className="text-emerald-400">DEMO</span>
                </div>
              </div>

            </div>

            {/* Selected Node Telemetry Inspector */}
            {selectedNode && (
              <div className="mt-6 p-4 rounded-2xl bg-obsidian-950 border border-emerald-500/30 font-mono text-xs animate-fadeIn">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-emerald-400 font-bold uppercase tracking-wider">
                    [PROTOTYPE EXPLANATION: {selectedNode.toUpperCase()}]
                  </span>
                  <span className="text-white/40 text-[10px]">ILLUSTRATIVE WORKFLOW</span>
                </div>
                <p className="text-white/80 font-sans text-xs leading-relaxed font-light">
                  {selectedNode === 'gazette' && "Start with the official scheme notification or provider page. The exact document and date should be shown alongside every scheme record."}
                  {selectedNode === 'scraper' && "A future monitor could flag a changed web page or document. Human review is needed before updating information shown to users."}
                  {selectedNode === 'llm' && "Proposed fields include eligibility, benefits, required documents, application route and source links. This prototype uses a sample catalogue."}
                  {selectedNode === 'hitl' && "A future scheme administrator or authorized reviewer would check the source and approve changes. No officer is connected to this demo."}
                  {selectedNode === 'public' && "The current demo shows possible matches from sample scheme data. Confirm the latest rules with the official scheme provider."}
                </p>
              </div>
            )}

          </div>
        )}

        {/* FLOWCHART 02: DUAL-MODE ARBITRAGE & AUTO-DPR FLOW */}
        {activeFlowchart === 'arbitrage' && (
          <div className="bg-obsidian-900 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl">
            <div className="border-b border-white/10 pb-4 mb-8">
              <span className="font-mono text-[10px] uppercase tracking-widest text-champagne-gold font-bold block mb-1">
                USER RECEPTION TO UNDERWRITING PIPELINE
              </span>
              <h3 className="font-serif text-2xl text-white font-medium">
                Dual-Mode Intake &rarr; Financial Arbitrage &rarr; Bank-Ready Auto-DPR
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              <div className="bg-obsidian-950 p-5 rounded-2xl border border-white/10">
                <span className="font-mono text-xs font-bold text-white block mb-2">Step 01: Dual-Mode Reception</span>
                <p className="text-white/60 text-xs font-light mb-3">
                  <strong>Entrepreneur:</strong> Guided form with an optional browser voice preview.<br />
                  <strong>Assisted service:</strong> Sample operator queue for demonstration.
                </p>
                <div className="p-2.5 rounded-xl bg-white/5 font-mono text-[10px] text-emerald-400">
                  Input: Aarav (Age 18), ₹25.00L Brownie Kitchen, SC, ₹1.80L Income.
                </div>
              </div>

              <div className="bg-obsidian-950 p-5 rounded-2xl border border-white/10">
                <span className="font-mono text-xs font-bold text-champagne-gold block mb-2">Step 02: Statutory Bounds Check</span>
                <p className="text-white/60 text-xs font-light mb-3">
                  Checks the entered profile against example criteria; no identity, income or caste certificate is verified.
                </p>
                <div className="p-2.5 rounded-xl bg-white/5 font-mono text-[10px] text-champagne-gold">
                  Status: Possible match — confirm current criteria.
                </div>
              </div>

              <div className="bg-obsidian-950 p-5 rounded-2xl border border-white/10">
                <span className="font-mono text-xs font-bold text-blue-400 block mb-2">Step 03: Smart Arbitrage Engine</span>
                <p className="text-white/60 text-xs font-light mb-3">
                  Calculates an indicative amount from the example scheme values and profile entered by the user.
                </p>
                <div className="p-2.5 rounded-xl bg-white/5 font-mono text-[10px] text-blue-400">
                  Result: Indicative estimate; not an approval or offer.
                </div>
              </div>

              <div className="bg-obsidian-950 p-5 rounded-2xl border border-white/10">
                <span className="font-mono text-xs font-bold text-purple-400 block mb-2">Step 04: Project report draft</span>
                <p className="text-white/60 text-xs font-light mb-3">
                  Prepares an editable planning draft using sample assumptions. It requires applicant and lender review.
                </p>
                <div className="p-2.5 rounded-xl bg-white/5 font-mono text-[10px] text-purple-400">
                  Result: A starting point for discussion — it does not guarantee funding.
                </div>
              </div>

            </div>
          </div>
        )}

        {/* FLOWCHART 03: HONEST PREDICTIVE SLA ROUTING DECISION TREE */}
        {activeFlowchart === 'honest_map' && (
          <div className="bg-obsidian-900 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl">
            <div className="border-b border-white/10 pb-4 mb-8">
              <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 font-bold block mb-1">
                DECISION TREE SCHEMATIC // AUDITOR-APPROVED ROUTING
              </span>
              <h3 className="font-serif text-2xl text-white font-medium">
                The Honest Routing Algorithm: Why Stalled Banks are Never Silently Hidden
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
              
              {/* Green Pin Decision */}
              <div className="bg-emerald-950/30 border-2 border-emerald-500/40 p-5 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-400"></span>
                  <span className="font-bold text-emerald-400">🟢 GREEN PIN // PRIME MATCH</span>
                </div>
                <div className="space-y-2 text-white/80 font-sans text-xs">
                  <p><strong>Criteria:</strong> Distance &lt; 5km, Fund Availability &gt; 50%, Gross NPA &lt; 3.5%.</p>
                  <p><strong>Predictive Velocity:</strong> Disbursed &ge; 40 files in 30 days. Avg SLA &le; 3 days.</p>
                  <p className="text-emerald-300 font-mono text-[11px] pt-2 border-t border-emerald-500/20">
                    &rarr; Result: Recommended primary route for immediate biometric sanction.
                  </p>
                </div>
              </div>

              {/* Yellow Pin Decision */}
              <div className="bg-amber-950/30 border-2 border-amber-500/40 p-5 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-3.5 h-3.5 rounded-full bg-amber-400"></span>
                  <span className="font-bold text-amber-400">🟡 YELLOW PIN // LIMITED CAPACITY</span>
                </div>
                <div className="space-y-2 text-white/80 font-sans text-xs">
                  <p><strong>Criteria:</strong> High pending caseload (&gt;85% quota consumed) or velocity degradation.</p>
                  <p><strong>Predictive Velocity:</strong> Accepted &ge; 38 files but disbursed &le; 4 files in 30 days.</p>
                  <p className="text-amber-300 font-mono text-[11px] pt-2 border-t border-amber-500/20">
                    &rarr; Result: Displayed with explicit warning that approval will take 6+ business days.
                  </p>
                </div>
              </div>

              {/* Grey Pin Decision */}
              <div className="bg-slate-900 border-2 border-slate-600 p-5 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-3.5 h-3.5 rounded-full bg-slate-400"></span>
                  <span className="font-bold text-slate-300">⚪ GREY PIN // TRANSPARENT AUDIT PAUSE</span>
                </div>
                <div className="space-y-2 text-white/80 font-sans text-xs">
                  <p><strong>Criteria:</strong> Overdues &gt; 10% or NPA &gt; 7%. Fails underwriting safety.</p>
                  <p><strong>Transparency Compliance:</strong> Kept in directory to satisfy auditors, but tagged as paused.</p>
                  <p className="text-slate-300 font-mono text-[11px] pt-2 border-t border-slate-700">
                    &rarr; Result: Transparent notice + automatic 1-click reroute to nearest Green partner.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* FLOWCHART 04: CAPITAL WATERFALL & MORATORIUM TIMELINE */}
        {activeFlowchart === 'waterfall' && (
          <div className="bg-obsidian-900 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl">
            <div className="border-b border-white/10 pb-4 mb-8">
              <span className="font-mono text-[10px] uppercase tracking-widest text-champagne-gold font-bold block mb-1">
                FINANCIAL WATERFALL &amp; MORATORIUM TIMELINE
              </span>
              <h3 className="font-serif text-2xl text-white font-medium">
                ₹25.00 Lakhs Project Outlay &amp; 6-Month Stabilization Buffer
              </h3>
            </div>

            {/* Visual Waterfall Stack */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
              
              <div>
                <h4 className="font-mono text-xs uppercase tracking-widest font-bold text-white mb-3">
                  Capital Structure Waterfall (90:10 Sovereign Ratio)
                </h4>
                
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-obsidian-950 border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-white/50 text-[10px] block">TOTAL CAPITAL EXPENDITURE</span>
                      <span className="font-bold text-white text-base">₹25,00,000 (100%)</span>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-white/10 text-white font-bold">PROJECT CAPEX</span>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between text-emerald-300">
                    <div>
                      <span className="opacity-60 text-[10px] block">NSFDC CONCESSIONAL LOAN</span>
                      <span className="font-bold text-emerald-400 text-lg">₹22,50,000 (90%)</span>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold">8.0% FIXED</span>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between text-amber-300">
                    <div>
                      <span className="opacity-60 text-[10px] block">PROMOTER'S OWN MARGIN</span>
                      <span className="font-bold text-amber-400 text-lg">₹2,50,000 (10%)</span>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold">OWN EQUITY</span>
                  </div>
                </div>
              </div>

              {/* Moratorium Timeline Gantt Diagram */}
              <div>
                <h4 className="font-mono text-xs uppercase tracking-widest font-bold text-white mb-3">
                  Stabilization Moratorium Timeline (6 Months Grace)
                </h4>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3.5 rounded-xl bg-obsidian-950 border border-white/10">
                    <div className="flex justify-between text-[11px] font-bold text-blue-400 mb-1">
                      <span>Months 1 - 3: Capex Procurement</span>
                      <span>Zero EMI</span>
                    </div>
                    <p className="font-sans text-[11px] text-white/60 font-light">
                      Italian convection oven and spiral mixer delivered directly to vendor via bank disbursement.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-obsidian-950 border border-white/10">
                    <div className="flex justify-between text-[11px] font-bold text-champagne-gold mb-1">
                      <span>Months 4 - 6: B2B Pilot Batches</span>
                      <span>Zero Principal</span>
                    </div>
                    <p className="font-sans text-[11px] text-white/60 font-light">
                      Cloud kitchen supplies 14 local Lucknow cafes and launches on Swiggy/Zomato.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                    <div className="flex justify-between text-[11px] font-bold text-emerald-400 mb-1">
                      <span>Month 7+: Structured Quarterly EMI</span>
                      <span>₹1,37,890 / Qtr</span>
                    </div>
                    <p className="font-sans text-[11px] text-white/60 font-light">
                      Debt servicing commences comfortably from recurring monthly revenues (DSCR 2.45x).
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
}
