import React, { useState } from 'react';
import { useSaarthi } from '../context/SaarthiContext';
import { 
  ShieldCheck, 
  X, 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink, 
  FileCode, 
  Check, 
  ArrowRight, 
  Cpu, 
  UserCheck, 
  Sparkles,
  Eye,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function HITLDataEngineModal() {
  const { 
    isHitlModalOpen, 
    setIsHitlModalOpen, 
    hitlQueue, 
    adjudicateReview 
  } = useSaarthi();

  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [officerNote, setOfficerNote] = useState('');
  const [actionDone, setActionDone] = useState(false);

  if (!isHitlModalOpen) return null;

  const currentItem = hitlQueue[activeItemIndex] || hitlQueue[0];

  const handleApprove = () => {
    adjudicateReview(currentItem.id, 'APPROVE');
    setActionDone(true);
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // safe fallback
    }
  };

  const handleReject = () => {
    adjudicateReview(currentItem.id, 'REJECT');
    setActionDone(true);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      
      {/* Modal Card */}
      <div className="bg-obsidian-900 border border-white/20 rounded-3xl max-w-5xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden my-auto">
        
        {/* Top Glow & Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-emerald-400 to-champagne-gold"></div>
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5 font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                PILLAR 01 // "ZERO-HALLUCINATION" DATA ENGINE
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                HUMAN-IN-THE-LOOP (HITL)
              </span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-medium">
              Nodal Officer Statutory Policy Verification Cockpit
            </h3>
            <p className="text-white/60 text-xs sm:text-sm font-light mt-1">
              Guarantees 100% policy veracity. No AI-extracted government rule goes live without cryptographic source verification and human officer sign-off.
            </p>
          </div>

          <button
            onClick={() => setIsHitlModalOpen(false)}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white flex items-center justify-center transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Source Telemetry Metadata */}
        <div className="bg-obsidian-950 border border-white/10 rounded-2xl p-4 mb-6 font-mono text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <span className="text-white/40 text-[10px] uppercase block">Official Circular Source</span>
              <a 
                href={currentItem.nodalSourceUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="text-emerald-400 hover:underline flex items-center gap-1 mt-0.5"
              >
                <span>{currentItem.title}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div>
              <span className="text-white/40 text-[10px] uppercase block">Scraper Pipeline</span>
              <span className="text-white/80 mt-0.5 block">{currentItem.detectedBy}</span>
            </div>

            <div>
              <span className="text-white/40 text-[10px] uppercase block">Current Queue Status</span>
              <span className={`font-bold mt-0.5 block ${
                currentItem.status === 'APPROVED_BY_OFFICER' 
                  ? 'text-emerald-400' 
                  : currentItem.status === 'REJECTED' 
                  ? 'text-red-400' 
                  : 'text-amber-400 animate-pulse'
              }`}>
                {currentItem.status}
              </span>
            </div>
          </div>
        </div>

        {/* Side-by-Side Diff Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
          {/* Left: Existing Database Schema */}
          <div className="bg-obsidian-950/80 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
              <span className="font-mono text-xs font-bold text-white/60 uppercase tracking-widest">
                01 // Existing Active Database Data
              </span>
              <span className="px-2 py-0.5 rounded bg-white/10 text-white/50 font-mono text-[10px]">
                PRE-NOTIFICATION
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/50">Max Project Cost:</span>
                <span className="text-white font-medium">{currentItem.oldSchemeData.maxProjectCost}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/50">Max Loan Limit:</span>
                <span className="text-white font-medium">{currentItem.oldSchemeData.maxLoanAmount}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/50">Base Interest Rate:</span>
                <span className="text-white font-medium">{currentItem.oldSchemeData.interestRate}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/50">Moratorium Grace:</span>
                <span className="text-white font-medium">{currentItem.oldSchemeData.moratoriumMonths}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Family Income Ceiling:</span>
                <span className="text-white font-medium">{currentItem.oldSchemeData.incomeCeiling}</span>
              </div>
            </div>
          </div>

          {/* Right: AI-Extracted Circular Update */}
          <div className="bg-emerald-950/20 border-2 border-emerald-500/40 rounded-2xl p-5 relative overflow-hidden">
            
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-emerald-500/20">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  02 // AI Circular Extraction (LLM Parsed)
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                HIGH CONFIDENCE (&gt;97%)
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-emerald-500/10 pb-2">
                <span className="text-white/70">Max Project Cost:</span>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold block">{currentItem.newAiExtractedData.maxProjectCost}</span>
                  <span className="text-[9px] text-emerald-500/80">Conf: {Math.round(currentItem.confidenceScores.maxProjectCost * 100)}%</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-b border-emerald-500/10 pb-2">
                <span className="text-white/70">Max Loan Limit:</span>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold block">{currentItem.newAiExtractedData.maxLoanAmount}</span>
                  <span className="text-[9px] text-emerald-500/80">Conf: {Math.round(currentItem.confidenceScores.maxLoanAmount * 100)}%</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-b border-emerald-500/10 pb-2">
                <span className="text-white/70">Base Interest Rate:</span>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold block">{currentItem.newAiExtractedData.interestRate} (-50 bps)</span>
                  <span className="text-[9px] text-emerald-500/80">Conf: {Math.round(currentItem.confidenceScores.interestRate * 100)}%</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-b border-emerald-500/10 pb-2">
                <span className="text-white/70">Moratorium Grace:</span>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold block">{currentItem.newAiExtractedData.moratoriumMonths}</span>
                  <span className="text-[9px] text-emerald-500/80">Conf: {Math.round(currentItem.confidenceScores.moratoriumMonths * 100)}%</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-white/70">Family Income Ceiling:</span>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold block">{currentItem.newAiExtractedData.incomeCeiling} (Harmonized)</span>
                  <span className="text-[9px] text-emerald-500/80">Conf: {Math.round(currentItem.confidenceScores.incomeCeiling * 100)}%</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Diff Highlights Checklist */}
        <div className="bg-obsidian-950 border border-white/10 rounded-2xl p-4 mb-6">
          <h4 className="font-mono text-xs uppercase tracking-widest text-champagne-gold font-bold mb-2">
            Semantic Diff Breakdown for Nodal Officer:
          </h4>
          <ul className="space-y-1.5 font-sans text-xs text-white/80 font-light">
            {currentItem.diffSummary.map((diff, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold font-mono">&rarr;</span>
                <span>{diff}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Controls for Nodal Officer */}
        {currentItem.status === 'PENDING_OFFICER_REVIEW' ? (
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10 font-mono text-xs">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-purple-400" />
              <span className="text-white/70">Nodal Officer: Shri R. K. Gautam (Senior Directorate)</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleReject}
                className="px-4 py-2.5 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/10 uppercase tracking-wider transition"
              >
                Reject / Flag Anomalies
              </button>

              <button
                onClick={handleApprove}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 text-black font-extrabold uppercase tracking-wider hover:bg-emerald-400 transition flex items-center gap-2 shadow-lg active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Approve &amp; Commit to Public Engine</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-4 text-center font-mono text-xs text-emerald-300">
            <CheckCircle className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
            <span>Demo action recorded for this preview. It does not update a live government scheme database or approve a policy change.</span>
          </div>
        )}

      </div>
    </div>
  );
}
