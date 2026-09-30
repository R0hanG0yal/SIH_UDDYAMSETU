import React, { useState } from 'react';
import { useSaarthi } from '../context/SaarthiContext';
import { revealAndScrollTo } from '../utils';
import { 
  Sparkles, 
  CheckCircle, 
  HelpCircle, 
  ArrowRight, 
  FileText, 
  Percent, 
  Clock, 
  ShieldCheck, 
  TrendingUp, 
  Scale, 
  Coins,
  ChevronRight,
  Info
} from 'lucide-react';

export function SmartArbitrageMatchCard() {
  const {
    applicant,
    updateApplicantProfile,
    activeMatch,
    setActiveSection,
    setIsHitlModalOpen,
    sovereignMetadata
  } = useSaarthi();

  const [activeTab, setActiveTab] = useState('advisor'); // 'advisor', 'comparison', 'moratorium'

  const formatLakhs = (val) => {
    return (val / 100000).toLocaleString('en-IN', { maximumFractionDigits: 2 });
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div id="smart-arbitrage-card" className="w-full bg-obsidian-900 border border-white/10 rounded-3xl p-6 sm:p-8 relative overflow-hidden backdrop-blur-xl shadow-2xl">
      
      {/* Decorative luxury ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-champagne-gold/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[9px] tracking-widest uppercase border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Scheme comparison · prototype
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-white/60 font-mono text-[9px] tracking-widest uppercase border border-white/10">
              Sample data · not a decision
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-white font-medium tracking-tight">
            Possible scheme match and estimate
          </h2>
          <p className="text-white/60 text-xs sm:text-sm mt-1 max-w-2xl font-light">
                An indicative comparison based on this demo profile. Scheme terms and eligibility must be verified with the official provider.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center bg-obsidian-950 p-1 rounded-xl border border-white/10 font-mono text-xs">
          <button
            onClick={() => setActiveTab('advisor')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'advisor' ? 'bg-champagne-gold text-black font-bold shadow' : 'text-white/70 hover:text-white'}`}
          >
            Match Card
          </button>
          <button
            onClick={() => setActiveTab('moratorium')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'moratorium' ? 'bg-champagne-gold text-black font-bold shadow' : 'text-white/70 hover:text-white'}`}
          >
            Moratorium Explainer
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'comparison' ? 'bg-champagne-gold text-black font-bold shadow' : 'text-white/70 hover:text-white'}`}
          >
              Example comparison
          </button>
        </div>
      </div>

      {/* Interactive Quick Simulation Bar */}
      <div className="bg-obsidian-950/80 border border-white/10 rounded-2xl p-4 sm:p-5 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-champagne-gold" />
            <span className="font-mono text-xs uppercase tracking-widest text-white/80">Change the sample project cost</span>
          </div>
          <div className="font-mono text-sm text-champagne-gold font-bold">
            Sample project cost: {formatCurrency(applicant.projectCost)} ({formatLakhs(applicant.projectCost)} lakh)
          </div>
        </div>

        {/* Range slider */}
        <input 
          type="range"
          min="50000"
          max="5000000"
          step="50000"
          value={applicant.projectCost}
          onChange={(e) => updateApplicantProfile({ projectCost: Number(e.target.value) })}
          className="w-full accent-champagne-gold h-2 bg-white/10 rounded-lg cursor-pointer"
        />

        <div className="flex justify-between font-mono text-[10px] text-white/50 mt-2">
          <span>₹50,000 (Micro)</span>
          <span className="text-emerald-400 font-bold">₹1,40,000 (MFS Window Cap)</span>
          <span className="text-amber-400 font-bold">₹25,00,000 (Brownie Cloud Kitchen)</span>
          <span>₹50,00,000 (Term Loan Cap)</span>
        </div>
      </div>

      {activeTab === 'advisor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Match Card (Left 7 Cols) */}
          <div className="lg:col-span-7 bg-obsidian-950 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
            
            {/* Top Match Score Pill */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/50">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="font-mono text-xs sm:text-sm font-bold text-emerald-300 tracking-wide uppercase">
                  {activeMatch?.matchBadge || "Potential match to review"}
                </span>
              </div>

              <span className="font-mono text-[11px] text-white/60 tracking-wider">
                SCHEME CODE: <strong className="text-white">{activeMatch?.scheme?.code || "TLS-03"}</strong>
              </span>
            </div>

            {/* Scheme Title */}
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-medium mb-1">
              {activeMatch?.scheme?.name}
            </h3>
            <p className="text-emerald-400/90 font-mono text-xs sm:text-sm mb-4">
              {activeMatch?.scheme?.nameHindi}
            </p>

            {/* Explainable AI Block */}
            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/40">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                </div>
                <div>
                  <h4 className="font-mono text-xs text-emerald-300 uppercase tracking-widest font-bold mb-1">
                    Why this scheme may be relevant
                  </h4>
                  <p className="text-white/80 text-xs sm:text-sm leading-relaxed font-light">
                    {activeMatch?.explainableReason}
                  </p>
                </div>
              </div>
            </div>

            {/* Key Financial Terms Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <div className="bg-obsidian-900/90 border border-white/10 rounded-xl p-3 sm:p-4 text-center">
                <span className="font-mono text-[9px] uppercase tracking-wider text-white/50 block">Example rate</span>
                <span className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono mt-1 block">
                  {activeMatch?.effectiveRate}%
                </span>
                <span className="text-[9px] text-white/40 font-mono block">p.a. Fixed</span>
              </div>

              <div className="bg-obsidian-900/90 border border-white/10 rounded-xl p-3 sm:p-4 text-center">
                <span className="font-mono text-[9px] uppercase tracking-wider text-white/50 block">Example finance share</span>
                <span className="text-xl sm:text-2xl font-bold text-champagne-gold font-mono mt-1 block">
                  90%*
                </span>
                <span className="text-[9px] text-white/40 font-mono block">scheme-dependent</span>
              </div>

              <div className="bg-obsidian-900/90 border border-white/10 rounded-xl p-3 sm:p-4 text-center">
                <span className="font-mono text-[9px] uppercase tracking-wider text-white/50 block">Moratorium Grace</span>
                <span className="text-xl sm:text-2xl font-bold text-white font-mono mt-1 block">
                  {activeMatch?.moratoriumMonths} Mo
                </span>
                <span className="text-[9px] text-white/40 font-mono block">example only</span>
              </div>

              <div className="bg-obsidian-900/90 border border-white/10 rounded-xl p-3 sm:p-4 text-center">
                <span className="font-mono text-[9px] uppercase tracking-wider text-white/50 block">Repayment Tenure</span>
                <span className="text-xl sm:text-2xl font-bold text-white font-mono mt-1 block">
                  {activeMatch?.tenureYears} Yrs
                </span>
                <span className="text-[9px] text-white/40 font-mono block">{activeMatch?.cadence}</span>
              </div>
            </div>

            {/* Means of Finance Ratio Bar */}
            <div className="bg-obsidian-900/90 border border-white/10 rounded-2xl p-4 mb-6">
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-emerald-400 font-bold">
                  Example loan share (90%): {formatCurrency(activeMatch?.loanAmount || 0)}
                </span>
                <span className="text-champagne-gold font-bold">
                  Example applicant share (10%): {formatCurrency(activeMatch?.ownEquity || 0)}
                </span>
              </div>
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-500 rounded-l-full" style={{ width: '90%' }}></div>
                <div className="h-full bg-champagne-gold rounded-r-full" style={{ width: '10%' }}></div>
              </div>
              <p className="text-[10px] text-white/50 font-mono mt-2 flex items-center gap-1.5">
                <Info className="w-3 h-3 text-white/40 shrink-0" />
                *Illustrative calculation based on sample inputs. Actual finance share, contribution and lender terms depend on the current scheme rules.
              </p>
            </div>

            {/* Call to action for DPR */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setActiveSection('dpr');
                  revealAndScrollTo('auto-dpr-section');
                }}
                className="flex-1 py-3 px-5 rounded-xl bg-champagne-gold text-black font-extrabold font-mono text-xs uppercase tracking-wider hover:bg-white transition flex items-center justify-center gap-2 active:scale-95 shadow-lg"
              >
                <FileText className="w-4 h-4" />
                <span>Open project report preview</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setActiveSection('honest_map');
                  revealAndScrollTo('honest-map-section');
                }}
                className="py-3 px-4 rounded-xl border border-white/20 text-white font-mono text-xs uppercase tracking-wider hover:border-emerald-400 hover:text-emerald-400 transition"
              >
                Open sample partner map
              </button>
            </div>

          </div>

          {/* Right Rail: Financial Architecture Details (Right 5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Beneficiary Qualification Card */}
            <div className="bg-obsidian-950 border border-white/10 rounded-2xl p-5">
              <h4 className="font-mono text-xs uppercase tracking-widest text-champagne-gold font-bold mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Profile details entered · not verified
              </h4>
              <ul className="space-y-2.5 font-mono text-xs text-white/80">
                <li className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-white/50">Category selected:</span>
                  <span className="font-bold text-white">Scheduled Caste (SC)</span>
                </li>
                <li className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-white/50">Income entered:</span>
                  <span className="font-bold text-emerald-400">
                    {formatCurrency(applicant.annualIncome)}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-white/50">Scheme route listed:</span>
                  <span className="font-bold text-white">{activeMatch?.scheme?.channelType || 'Check scheme notice'}</span>
                </li>
              </ul>
            </div>

            {/* Moratorium Feature Callout */}
            <div className="bg-obsidian-950 border border-emerald-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2 text-emerald-400 font-mono text-xs uppercase tracking-widest font-bold">
                <Clock className="w-4 h-4" />
                Example repayment pause
              </div>
              <p className="text-white/70 text-xs leading-relaxed font-light">
              Some schemes may include a repayment moratorium. This demo shows an illustrative value of <strong>{activeMatch?.moratoriumMonths} months</strong>; check the current scheme notice and lender terms before relying on it.
              </p>
            </div>

            {/* Scheme-information verification reminder */}
            <div className="bg-obsidian-950 border border-purple-500/30 rounded-2xl p-5">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-purple-300 font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  Source information
                </span>
                <button
                  onClick={() => setIsHitlModalOpen(true)}
                  className="text-[10px] text-purple-300 underline font-mono hover:text-white"
                >
                  View review concept &rarr;
                </button>
              </div>
              <p className="text-white/60 text-xs leading-relaxed font-light">
                Scheme records in this prototype are sample data, not live-reconciled. Check the current notice from the official provider before relying on any figure.
              </p>
            </div>

          </div>

        </div>
      )}

      {activeTab === 'moratorium' && (
        <div className="bg-obsidian-950 border border-white/10 rounded-2xl p-6">
          <h3 className="font-serif text-2xl text-white mb-2">
            Understanding a repayment pause
          </h3>
          <p className="text-white/70 text-xs sm:text-sm font-light max-w-3xl mb-6">
            A moratorium, when offered by a scheme, may provide time before repayments begin. Availability and duration depend on the current scheme terms.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-obsidian-900 border border-white/10 rounded-xl p-5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono text-sm font-bold flex items-center justify-center mb-3">
                01
              </div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-white font-bold mb-2">
                Procurement &amp; Setup (Months 1-3)
              </h4>
              <p className="text-white/60 text-xs font-light leading-relaxed">
                Ordering commercial convection ovens, stainless steel racks, and obtaining FSSAI food licenses without debt anxiety.
              </p>
            </div>

            <div className="bg-obsidian-900 border border-white/10 rounded-xl p-5">
              <div className="w-8 h-8 rounded-lg bg-champagne-gold/20 text-champagne-gold font-mono text-sm font-bold flex items-center justify-center mb-3">
                02
              </div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-white font-bold mb-2">
                Pilot Testing &amp; Cafe Retainers (Months 4-6)
              </h4>
              <p className="text-white/60 text-xs font-light leading-relaxed">
                Trial brownie batches delivered to 14 university campus cafes and onboarding on Swiggy/Zomato cloud kitchen infrastructure.
              </p>
            </div>

            <div className="bg-obsidian-900 border border-white/10 rounded-xl p-5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 font-mono text-sm font-bold flex items-center justify-center mb-3">
                03
              </div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-white font-bold mb-2">
                Structured Quarterly EMI (Month 7 Onward)
              </h4>
              <p className="text-white/60 text-xs font-light leading-relaxed">
                Quarterly repayment starts only after the cloud kitchen achieves ₹3.00L+ monthly recurring revenues, resulting in a healthy DSCR of 2.45x.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'comparison' && (
        <div className="bg-obsidian-950 border border-white/10 rounded-2xl p-6 overflow-x-auto">
          <h3 className="font-serif text-2xl text-white mb-2">
            Illustrative bank finance vs. scheme finance comparison
          </h3>
          <p className="text-white/70 text-xs sm:text-sm font-light mb-6">
            Example figures only; this is not a like-for-like quote. Actual interest, security, contribution and repayment terms depend on the lender and current scheme rules.
          </p>

          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/20 text-white/50 text-[10px] uppercase tracking-widest">
                <th className="py-3 px-4">Financial Dimension</th>
                <th className="py-3 px-4 text-red-400">Standard Commercial Bank</th>
                <th className="py-3 px-4 text-emerald-400">Example scheme finance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="py-3.5 px-4 text-white font-medium">Annual Interest Rate</td>
                <td className="py-3.5 px-4 text-red-300">12.5% to 16.0% p.a. (Floating)</td>
                <td className="py-3.5 px-4 text-emerald-300 font-bold">6.5% to 8.0% p.a. (Fixed Concessional)</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 text-white font-medium">Collateral &amp; Third-Party Guarantee</td>
                <td className="py-3.5 px-4 text-red-300">100% Tangible Collateral Demanded</td>
                <td className="py-3.5 px-4 text-emerald-300 font-bold">Depends on current scheme and lender terms</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 text-white font-medium">Beneficiary Equity Contribution</td>
                <td className="py-3.5 px-4 text-red-300">25% to 35% Margin Money Required</td>
                <td className="py-3.5 px-4 text-emerald-300 font-bold">Example contribution only; verify rules</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 text-white font-medium">Repayment Moratorium</td>
                <td className="py-3.5 px-4 text-red-300">0 to 1 Month (Immediate EMI pressure)</td>
                <td className="py-3.5 px-4 text-emerald-300 font-bold">3 to 12 Months Grace Period</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 text-white font-medium">Project Documentation (DPR)</td>
                <td className="py-3.5 px-4 text-red-300">₹5,000 CA-Certified Report or Rejection</td>
                <td className="py-3.5 px-4 text-emerald-300 font-bold">Drafting support may be available in this demo</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
