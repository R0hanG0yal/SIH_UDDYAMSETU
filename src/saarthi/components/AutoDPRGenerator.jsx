import React, { useState } from 'react';
import { useSaarthi } from '../context/SaarthiContext';
import { 
  FileText, 
  Download, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  Building2, 
  Award, 
  ExternalLink,
  ChevronRight,
  Coffee,
  CheckCircle,
  AlertCircle,
  LayoutGrid,
  Table as TableIcon,
  Maximize2,
  Compass,
  Zap,
  Flame,
  Snowflake,
  Box
} from 'lucide-react';

export function AutoDPRGenerator() {
  const { brownieDpr, sovereignMetadata, activeMatch } = useSaarthi();
  const [activeDprTab, setActiveDprTab] = useState('executive'); // 'executive', 'capex', 'financials', 'feasibility', 'blueprint'
  const [capexView, setCapexView] = useState('gallery'); // 'gallery' or 'table'
  const [selectedZone, setSelectedZone] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [previewTheme, setPreviewTheme] = useState('atelier'); // 'atelier' or 'bank'

  const handlePrintDPR = () => {
    setIsExporting(true);
    setTimeout(() => {
      window.print();
      setIsExporting(false);
    }, 400);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  const formatLakhs = (val) => {
    return (val / 100000).toLocaleString('en-IN', { maximumFractionDigits: 2 });
  };

  return (
    <section id="auto-dpr-section" className="w-full py-12 sm:py-16 border-b border-white/10 bg-obsidian-950">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase">
              <span className="px-3 py-1 rounded-full bg-champagne-gold/20 text-champagne-gold border border-champagne-gold/40 flex items-center gap-1.5 font-bold">
                <Award className="w-3.5 h-3.5" />
                Project planning tool
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 text-white/60 border border-white/10 hidden sm:inline">
                Illustrative draft
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal uppercase tracking-tight">
              Illustrative project report builder
            </h2>
            <p className="mt-2 text-white/70 text-xs sm:text-sm font-light max-w-3xl leading-relaxed">
              Create a draft project-planning report using the sample enterprise profile. Figures and assumptions are illustrative, should be reviewed carefully, and are not a certified report or a promise of loan approval.
            </p>
          </div>

          {/* Persona Pitch Badge */}
          <div className="bg-obsidian-900 border border-champagne-gold/30 rounded-2xl p-4 sm:p-5 max-w-md shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-champagne-gold/20 flex items-center justify-center shrink-0 border border-champagne-gold/40">
                <Coffee className="w-5 h-5 text-champagne-gold" />
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-champagne-gold font-bold block">
                  FICTIONAL SAMPLE FOUNDER
                </span>
                <p className="text-white/80 text-xs font-light mt-1">
                  <strong>Aarav (Age 18)</strong> is a fictional example used to show how a project-planning draft could be organized. All profile, business and financial details are illustrative.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Persona & Enterprise Transformation Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
          
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group border border-white/10 bg-obsidian-900">
            <img loading="lazy" decoding="async"
              src={brownieDpr.applicant.photoUrl} 
              alt="Aarav Sharma founder" 
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-3 flex flex-col justify-end">
              <span className="font-mono text-[8px] uppercase tracking-widest text-champagne-gold font-bold">FOUNDER PERSONA</span>
              <span className="font-bold text-xs text-white">Aarav Sharma (Age 18)</span>
              <span className="text-[9px] text-white/60 font-mono">1st Yr B.Tech &bull; SC Beneficiary</span>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group border border-white/10 bg-obsidian-900">
            <img loading="lazy" decoding="async"
              src={brownieDpr.applicant.campusStallUrl} 
              alt="Campus brownie stall" 
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-3 flex flex-col justify-end">
              <span className="font-mono text-[8px] uppercase tracking-widest text-emerald-400 font-bold">PROVEN TRACK RECORD</span>
              <span className="font-bold text-xs text-white">Campus Brownie Kiosk</span>
              <span className="text-[9px] text-white/60 font-mono">₹48,000/mo net over 9 months</span>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group border border-white/10 bg-obsidian-900">
            <img loading="lazy" decoding="async"
              src={brownieDpr.applicant.commercialKitchenUrl} 
              alt="Target commercial cloud kitchen" 
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-3 flex flex-col justify-end">
              <span className="font-mono text-[8px] uppercase tracking-widest text-blue-400 font-bold">EXPANSION TARGET</span>
              <span className="font-bold text-xs text-white">850 sq.ft Cloud Kitchen</span>
              <span className="text-[9px] text-white/60 font-mono">FSSAI HACCP Commercial Unit</span>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group border border-white/10 bg-obsidian-900">
            <img loading="lazy" decoding="async"
              src={brownieDpr.applicant.brownieProductUrl} 
              alt="Artisan brownies" 
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-3 flex flex-col justify-end">
              <span className="font-mono text-[8px] uppercase tracking-widest text-champagne-gold font-bold">SIGNATURE PRODUCT</span>
              <span className="font-bold text-xs text-white">VelvetCrust Artisan Brownies</span>
              <span className="text-[9px] text-white/60 font-mono">68% Gross Margin &bull; 14 Cafes</span>
            </div>
          </div>

        </div>

        {/* DPR Controller Bar */}
        <div className="bg-obsidian-900 border border-white/10 rounded-2xl p-4 sm:p-5 mb-8 flex flex-wrap items-center justify-between gap-4">
          
          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 font-mono text-xs">
            <button
              onClick={() => setActiveDprTab('executive')}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${activeDprTab === 'executive' ? 'bg-champagne-gold text-black font-bold shadow-md' : 'text-white/70 hover:text-white bg-white/5'}`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>01 // Project Summary</span>
            </button>

            <button
              onClick={() => setActiveDprTab('capex')}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${activeDprTab === 'capex' ? 'bg-champagne-gold text-black font-bold shadow-md' : 'text-white/70 hover:text-white bg-white/5'}`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>02 // Capex Machinery Photos</span>
            </button>

            <button
              onClick={() => setActiveDprTab('blueprint')}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${activeDprTab === 'blueprint' ? 'bg-champagne-gold text-black font-bold shadow-md' : 'text-white/70 hover:text-white bg-white/5'}`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>03 // 2D Kitchen Blueprint</span>
            </button>

            <button
              onClick={() => setActiveDprTab('financials')}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${activeDprTab === 'financials' ? 'bg-champagne-gold text-black font-bold shadow-md' : 'text-white/70 hover:text-white bg-white/5'}`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>04 // 5-Yr Cash Flow &amp; DSCR</span>
            </button>

            <button
              onClick={() => setActiveDprTab('feasibility')}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${activeDprTab === 'feasibility' ? 'bg-champagne-gold text-black font-bold shadow-md' : 'text-white/70 hover:text-white bg-white/5'}`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>05 // Feasibility &amp; SWOT</span>
            </button>
          </div>

          {/* Action Buttons: Document Theme Switcher + Export */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center bg-obsidian-950 p-1 rounded-xl border border-white/10 font-mono text-[11px]">
              <button
                onClick={() => setPreviewTheme('atelier')}
                className={`px-2.5 py-1 rounded-lg ${previewTheme === 'atelier' ? 'bg-white/10 text-white' : 'text-white/50'}`}
              >
                Atelier Dark
              </button>
              <button
                onClick={() => setPreviewTheme('bank')}
                className={`px-2.5 py-1 rounded-lg ${previewTheme === 'bank' ? 'bg-white text-black font-bold' : 'text-white/50'}`}
              >
                Bank White Paper
              </button>
            </div>

            <button
              onClick={handlePrintDPR}
              disabled={isExporting}
              className="px-4 py-2.5 rounded-xl bg-champagne-gold text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-white transition flex items-center gap-2 shadow-lg active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>{isExporting ? 'Preparing print view…' : 'Print this sample draft'}</span>
            </button>
          </div>

        </div>

        {/* Illustrative report preview */}
        <div className={`rounded-3xl border transition-all duration-300 ${
          previewTheme === 'bank' 
            ? 'bg-white text-zinc-900 border-zinc-300 shadow-2xl p-6 sm:p-12' 
            : 'bg-obsidian-900 text-white border-white/10 shadow-2xl p-6 sm:p-10'
        }`}>
          
          {/* Demo watermark: keep visible in screen and print output */}
          <div className="border-b-2 border-dashed pb-8 mb-8 border-current/20">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase font-bold text-emerald-500 block mb-1">
                  ILLUSTRATIVE EXAMPLE · NOT AN OFFICIAL DOCUMENT
                </span>
                <h3 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight uppercase">
                  Project report preview
                </h3>
                <p className="text-xs sm:text-sm font-sans mt-1 opacity-70">
                  Example scheme reference: <strong>NSFDC Term Loan Scheme (TLS-03)</strong> · Verify current terms with the official provider
                </p>
              </div>

              {/* Stamp of Sovereign Compliance */}
              <div className="border-2 border-emerald-500 p-3 rounded-xl text-center font-mono text-[10px] tracking-wider uppercase bg-emerald-500/10">
                <span className="font-bold text-emerald-500 block">SAMPLE PROFILE</span>
                <span className="opacity-80 block text-[8px]">NOT VERIFIED</span>
                <span className="text-emerald-400 font-bold block text-xs mt-0.5">ILLUSTRATIVE FIGURES</span>
              </div>
            </div>

            {/* Sub-Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-current/10 font-mono text-xs">
              <div>
                <span className="opacity-50 text-[10px] block uppercase">Principal Applicant</span>
                <span className="font-bold block">{brownieDpr.applicant.name}</span>
                <span className="text-[10px] opacity-70">Age: {brownieDpr.applicant.age} Yrs &bull; {brownieDpr.applicant.education}</span>
              </div>
              <div>
                <span className="opacity-50 text-[10px] block uppercase">Venture Entity</span>
                <span className="font-bold block">{brownieDpr.applicant.ventureName}</span>
                <span className="text-[10px] opacity-70">FSSAI Registration In-Process</span>
              </div>
              <div>
                <span className="opacity-50 text-[10px] block uppercase">Total Project Outlay</span>
                <span className="font-bold text-emerald-500 block">{formatCurrency(brownieDpr.projectFinances.totalProjectCost)}</span>
                <span className="text-[10px] opacity-70">({formatLakhs(brownieDpr.projectFinances.totalProjectCost)} Lakhs)</span>
              </div>
              <div>
                <span className="opacity-50 text-[10px] block uppercase">Example loan amount</span>
                <span className="font-bold text-amber-500 block">{formatCurrency(brownieDpr.projectFinances.nsfdcConcessionalLoan)}</span>
                <span className="text-[10px] opacity-70">(sample calculation only)</span>
              </div>
            </div>
          </div>

          {/* TAB 01: EXECUTIVE SUMMARY */}
          {activeDprTab === 'executive' && (
            <div className="space-y-8">
              
              {/* Means of Finance Card */}
              <div className={`p-6 rounded-2xl border ${previewTheme === 'bank' ? 'bg-zinc-50 border-zinc-200' : 'bg-obsidian-950 border-white/10'}`}>
                <h4 className="font-mono text-xs uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  Example means-of-finance calculation
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className={`p-4 rounded-xl border ${previewTheme === 'bank' ? 'bg-white border-zinc-300' : 'bg-obsidian-900 border-white/10'}`}>
                    <span className="font-mono text-[10px] uppercase opacity-60 block">Example loan share</span>
                    <span className="text-2xl font-bold font-mono text-emerald-500 block mt-1">
                      {formatCurrency(brownieDpr.projectFinances.nsfdcConcessionalLoan)}
                    </span>
                    <span className="text-xs opacity-75 font-mono">illustrative share only</span>
                  </div>

                  <div className={`p-4 rounded-xl border ${previewTheme === 'bank' ? 'bg-white border-zinc-300' : 'bg-obsidian-900 border-white/10'}`}>
                    <span className="font-mono text-[10px] uppercase opacity-60 block">Promoter's Own Margin Money</span>
                    <span className="text-2xl font-bold font-mono text-amber-500 block mt-1">
                      {formatCurrency(brownieDpr.projectFinances.beneficiaryOwnEquity)}
                    </span>
                    <span className="text-xs opacity-75 font-mono">illustrative own contribution</span>
                  </div>

                  <div className={`p-4 rounded-xl border ${previewTheme === 'bank' ? 'bg-white border-zinc-300' : 'bg-obsidian-900 border-white/10'}`}>
                    <span className="font-mono text-[10px] uppercase opacity-60 block">Moratorium Period</span>
                    <span className="text-2xl font-bold font-mono text-blue-500 block mt-1">
                      {brownieDpr.projectFinances.moratoriumPeriodMonths} Months
                    </span>
                    <span className="text-xs opacity-75 font-mono">Zero Principal Repayment Grace</span>
                  </div>
                </div>

                <div className="space-y-3 font-sans text-xs sm:text-sm font-light leading-relaxed">
                  <p>
                    <strong>Important:</strong> Figures on this page are sample assumptions only. They do not represent current scheme limits or confirm eligibility, and must not be used as an application or lender submission.
                  </p>
                  <p>
                    <strong>Sample scenario:</strong> The example business history, margins, expansion costs and potential customers are fictional placeholders to demonstrate the planning workflow.
                  </p>
                </div>
              </div>

              {/* Loan Terms Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-5 rounded-2xl border ${previewTheme === 'bank' ? 'bg-zinc-50 border-zinc-200' : 'bg-obsidian-950 border-white/10'}`}>
                  <h5 className="font-mono text-xs uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Sample profile details · not verified
                  </h5>
                  <ul className="space-y-2 font-mono text-xs">
                    <li className="flex items-center justify-between border-b border-current/10 pb-1.5">
                      <span className="opacity-60">Caste Category:</span>
                      <span className="font-bold">Scheduled Caste (sample selection)</span>
                    </li>
                    <li className="flex items-center justify-between border-b border-current/10 pb-1.5">
                      <span className="opacity-60">Annual Family Income:</span>
                      <span className="font-bold text-emerald-500">₹1,80,000 (&le; ₹5,00,000 Cap)</span>
                    </li>
                    <li className="flex items-center justify-between border-b border-current/10 pb-1.5">
                      <span className="opacity-60">Interest Subvention:</span>
                      <span className="font-bold">8.0% p.a. Concessional Fixed</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="opacity-60">Repayment Period:</span>
                      <span className="font-bold">5 Years (20 Quarterly Installments)</span>
                    </li>
                  </ul>
                </div>

                <div className={`p-5 rounded-2xl border ${previewTheme === 'bank' ? 'bg-zinc-50 border-zinc-200' : 'bg-obsidian-950 border-white/10'}`}>
                  <h5 className="font-mono text-xs uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                    Branch Manager Underwriting Defenses
                  </h5>
                  <ul className="space-y-2 font-mono text-xs">
                    <li className="flex items-center justify-between border-b border-current/10 pb-1.5">
                      <span className="opacity-60">Primary Collateral:</span>
                      <span className="font-bold">Hypothecation of Kitchen Equipment</span>
                    </li>
                    <li className="flex items-center justify-between border-b border-current/10 pb-1.5">
                      <span className="opacity-60">Credit Guarantee:</span>
                      <span className="font-bold">CGTMSE / Nodal Trust Covered</span>
                    </li>
                    <li className="flex items-center justify-between border-b border-current/10 pb-1.5">
                      <span className="opacity-60">Break-Even Utilization:</span>
                      <span className="font-bold text-emerald-500">Month 4 (Post-Moratorium)</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="opacity-60">Avg DSCR Safety:</span>
                      <span className="font-bold text-emerald-500">2.45x (Substantially above 1.50x benchmark)</span>
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          )}

          {/* TAB 02: CAPEX MACHINERY PHOTO GALLERY & QUOTATIONS */}
          {activeDprTab === 'capex' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-champagne-gold" />
                    Example capital expenditure and indicative quotations
                  </h4>
                  <p className="text-xs opacity-60 font-light mt-0.5">
                    Total Outlay: <strong>{formatCurrency(brownieDpr.projectFinances.totalProjectCost)}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <button
                    onClick={() => setCapexView('gallery')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 border ${capexView === 'gallery' ? 'bg-champagne-gold text-black font-bold' : 'border-current/20 opacity-60'}`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Photo Cards</span>
                  </button>
                  <button
                    onClick={() => setCapexView('table')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 border ${capexView === 'table' ? 'bg-champagne-gold text-black font-bold' : 'border-current/20 opacity-60'}`}
                  >
                    <TableIcon className="w-3.5 h-3.5" />
                    <span>Audit Table</span>
                  </button>
                </div>
              </div>

              {capexView === 'gallery' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {brownieDpr.capitalExpenditureBreakdown.map((item, idx) => (
                    <div 
                      key={idx}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        previewTheme === 'bank' ? 'bg-zinc-50 border-zinc-300' : 'bg-obsidian-950 border-white/10'
                      }`}
                    >
                      <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-black/40">
                        <img loading="lazy" decoding="async"
                          src={item.imageUrl} 
                          alt={item.item} 
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 font-mono text-[9px] text-champagne-gold font-bold">
                          {formatCurrency(item.cost)}
                        </span>
                      </div>

                      <span className="font-mono text-[9px] opacity-50 block uppercase">
                        ITEM #{idx + 1} &bull; {item.category}
                      </span>
                      <h5 className="font-sans font-bold text-xs sm:text-sm mt-0.5 line-clamp-2">
                        {item.item}
                      </h5>
                      <div className="mt-2 pt-2 border-t border-current/10 flex justify-between font-mono text-[10px] opacity-70">
                        <span>{item.vendor}</span>
                        <span className="font-bold">{item.invoiceRef}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs border-collapse">
                    <thead>
                      <tr className="border-b-2 border-current/20 uppercase text-[10px] tracking-wider opacity-60">
                        <th className="py-3 px-3">Item #</th>
                        <th className="py-3 px-4">Equipment &amp; Asset Specification</th>
                        <th className="py-3 px-4">Empanelled Vendor</th>
                        <th className="py-3 px-3">Quotation Ref</th>
                        <th className="py-3 px-4 text-right">Cost (INR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-current/10">
                      {brownieDpr.capitalExpenditureBreakdown.map((item, idx) => (
                        <tr key={idx} className="hover:bg-current/5 transition">
                          <td className="py-3 px-3 opacity-60">0{idx + 1}</td>
                          <td className="py-3 px-4 font-sans font-medium">{item.item}</td>
                          <td className="py-3 px-4 opacity-80">{item.vendor}</td>
                          <td className="py-3 px-3 opacity-60 text-[11px]">{item.invoiceRef}</td>
                          <td className="py-3 px-4 text-right font-bold">{formatCurrency(item.cost)}</td>
                        </tr>
                      ))}
                      <tr className="border-t-2 border-current/30 font-bold text-sm">
                        <td colSpan="4" className="py-4 px-4 uppercase tracking-wider">
                          Total Project Capital Expenditure
                        </td>
                        <td className="py-4 px-4 text-right text-emerald-500">
                          {formatCurrency(brownieDpr.projectFinances.totalProjectCost)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              <div className={`p-4 rounded-xl border ${previewTheme === 'bank' ? 'bg-zinc-100 border-zinc-200' : 'bg-obsidian-950 border-white/10'}`}>
                <p className="font-mono text-[11px] opacity-75">
                  &bull; <strong>Direct Bank-to-Vendor Disbursement:</strong> Capital machinery loan is disbursed directly to empanelled vendors against verified delivery challans, preventing loan fund diversion and fulfilling CGTMSE branch covenants.
                </p>
              </div>
            </div>
          )}

          {/* TAB 03: 2D KITCHEN BLUEPRINT ARCHITECTURAL SCHEMATIC */}
          {activeDprTab === 'blueprint' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                    <Compass className="w-4 h-4 text-emerald-500" />
                    Commercial Cloud Kitchen 2D Floor Plan Blueprint (850 sq.ft)
                  </h4>
                  <p className="text-xs opacity-60 font-light mt-0.5">
                    HACCP &amp; FSSAI Clean Room Layout &bull; Linear Production Workflow (Ingress to Dispatch)
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/40">
                  FSSAI COMPLIANT
                </span>
              </div>

              {/* Interactive 2D Blueprint Schematic Box */}
              <div className={`p-6 rounded-2xl border ${previewTheme === 'bank' ? 'bg-zinc-100 border-zinc-300' : 'bg-obsidian-950 border-white/10'}`}>
                
                {/* 2D Zone Layout Grid */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
                  {brownieDpr.kitchenBlueprint.zones.map((zone, idx) => {
                    const isSelected = selectedZone === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedZone(idx)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-emerald-500/20 border-emerald-500 shadow-lg scale-[1.02]' 
                            : 'bg-current/5 border-current/10 hover:border-current/30'
                        }`}
                      >
                        <span className="font-mono text-[10px] font-bold text-emerald-500 block mb-1">
                          ZONE 0{idx + 1}
                        </span>
                        <h6 className="font-sans font-bold text-xs line-clamp-1 mb-1">{zone.name.split(': ')[1]}</h6>
                        <span className="font-mono text-[10px] opacity-60 block">{zone.dim}</span>
                        <span className="font-mono text-[9px] opacity-80 text-champagne-gold mt-2 block font-medium">
                          {zone.status}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Selected Zone Deep Dive */}
                <div className={`p-4 rounded-xl border ${previewTheme === 'bank' ? 'bg-white border-zinc-200' : 'bg-obsidian-900 border-white/10'} font-mono text-xs flex flex-wrap items-center justify-between gap-4`}>
                  <div>
                    <span className="text-emerald-500 font-bold block mb-1">
                      ACTIVE BLUEPRINT ZONE: {brownieDpr.kitchenBlueprint.zones[selectedZone].name}
                    </span>
                    <p className="text-xs opacity-75 font-sans">
                      Primary Installed Equipment: <strong>{brownieDpr.kitchenBlueprint.zones[selectedZone].equipment}</strong>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="opacity-50 text-[10px] block">ALLOCATED AREA</span>
                    <span className="text-sm font-bold text-champagne-gold">{brownieDpr.kitchenBlueprint.zones[selectedZone].dim}</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 04: 5-YEAR CASH FLOW, CHARTS & DSCR DIAL */}
          {activeDprTab === 'financials' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h4 className="font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  5-Year Revenue, Operating Expense &amp; DSCR Coverage Trajectory
                </h4>
                <span className="font-mono text-xs text-emerald-500 font-bold">
                  Target DSCR &ge; 1.75x Achieved
                </span>
              </div>

              {/* Visual 5-Year Bar Chart and DSCR Safety Dial */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* 5-Year Revenue Bar Chart (8 Cols) */}
                <div className={`md:col-span-8 p-5 rounded-2xl border ${previewTheme === 'bank' ? 'bg-zinc-50 border-zinc-200' : 'bg-obsidian-950 border-white/10'}`}>
                  <span className="font-mono text-[10px] uppercase opacity-60 block mb-4">
                    5-YEAR ANNUAL REVENUE (GREEN) VS NET PROFIT (GOLD) [IN LAKHS]
                  </span>

                  <div className="space-y-4">
                    {brownieDpr.financialProjections.map((fin, idx) => {
                      const revLakhs = fin.revenue / 100000;
                      const profitLakhs = fin.netProfit / 100000;
                      return (
                        <div key={idx} className="space-y-1 font-mono text-xs">
                          <div className="flex justify-between text-[11px]">
                            <span className="font-bold">{fin.year}</span>
                            <span className="opacity-70">Rev: ₹{revLakhs}L &bull; Net: ₹{profitLakhs}L &bull; DSCR: {fin.dscr.split(' ')[0]}</span>
                          </div>
                          
                          {/* Visual progress bar */}
                          <div className="w-full h-4 bg-current/10 rounded-full overflow-hidden flex">
                            <div 
                              className="bg-emerald-500 h-full rounded-l-full" 
                              style={{ width: `${(revLakhs / 100) * 100}%` }}
                              title={`Revenue: ₹${revLakhs} Lakhs`}
                            />
                            <div 
                              className="bg-champagne-gold h-full rounded-r-full" 
                              style={{ width: `${(profitLakhs / 100) * 100}%` }}
                              title={`Net Profit: ₹${profitLakhs} Lakhs`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* DSCR Speedometer Dial Gauge (4 Cols) */}
                <div className={`md:col-span-4 p-5 rounded-2xl border text-center ${previewTheme === 'bank' ? 'bg-zinc-50 border-zinc-200' : 'bg-obsidian-950 border-white/10'}`}>
                  <span className="font-mono text-[10px] uppercase opacity-60 block mb-2">
                    DEBT SERVICE COVERAGE (DSCR)
                  </span>

                  <div className="w-28 h-28 rounded-full border-4 border-emerald-500 flex flex-col items-center justify-center mx-auto my-3 bg-emerald-500/10">
                    <span className="text-3xl font-extrabold text-emerald-400 font-mono">2.45x</span>
                    <span className="text-[9px] font-mono opacity-70">YEAR 1 SAFETY</span>
                  </div>

                  <span className="font-mono text-xs text-emerald-400 font-bold block">
                    HIGH SAFETY GRADE
                  </span>
                  <p className="text-[10px] opacity-70 mt-1 font-sans">
                    This is an indicative estimate based on the sample assumptions. Actual lender calculations and repayment terms may differ.
                  </p>
                </div>

              </div>

              {/* 5-Year Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="border-b-2 border-current/20 uppercase text-[10px] tracking-wider opacity-60">
                      <th className="py-3 px-3">Timeline</th>
                      <th className="py-3 px-4">Est. Monthly Volume</th>
                      <th className="py-3 px-4">Annual Revenue</th>
                      <th className="py-3 px-4">Operating Expense</th>
                      <th className="py-3 px-4">Net Operating Profit</th>
                      <th className="py-3 px-4 text-right">DSCR Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-current/10">
                    {brownieDpr.financialProjections.map((fin, idx) => (
                      <tr key={idx} className="hover:bg-current/5 transition">
                        <td className="py-3.5 px-3 font-bold">{fin.year}</td>
                        <td className="py-3.5 px-4">{fin.monthlyOrders.toLocaleString()} Units</td>
                        <td className="py-3.5 px-4 font-bold">{formatCurrency(fin.revenue)}</td>
                        <td className="py-3.5 px-4 opacity-80">{formatCurrency(fin.opex)}</td>
                        <td className="py-3.5 px-4 text-emerald-500 font-bold">{formatCurrency(fin.netProfit)}</td>
                        <td className="py-3.5 px-4 text-right font-bold text-amber-500">{fin.dscr}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 05: FEASIBILITY & SWOT */}
          {activeDprTab === 'feasibility' && (
            <div className="space-y-6">
              <h4 className="font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-champagne-gold" />
                Strategic Feasibility &amp; Risk Mitigation Matrix
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-5 rounded-2xl border ${previewTheme === 'bank' ? 'bg-emerald-50/50 border-emerald-300' : 'bg-emerald-950/20 border-emerald-500/30'}`}>
                  <span className="font-mono text-xs font-bold text-emerald-500 uppercase tracking-widest block mb-2">
                    01 // Core Competitive Strengths
                  </span>
                  <p className="font-sans text-xs sm:text-sm font-light leading-relaxed opacity-85">
                    {brownieDpr.swotAndFeasibility.strengths}
                  </p>
                </div>

                <div className={`p-5 rounded-2xl border ${previewTheme === 'bank' ? 'bg-amber-50/50 border-amber-300' : 'bg-amber-950/20 border-amber-500/30'}`}>
                  <span className="font-mono text-xs font-bold text-amber-500 uppercase tracking-widest block mb-2">
                    02 // Operational Weaknesses &amp; Mitigation
                  </span>
                  <p className="font-sans text-xs sm:text-sm font-light leading-relaxed opacity-85">
                    {brownieDpr.swotAndFeasibility.weaknesses}
                  </p>
                </div>

                <div className={`p-5 rounded-2xl border ${previewTheme === 'bank' ? 'bg-blue-50/50 border-blue-300' : 'bg-blue-950/20 border-blue-500/30'}`}>
                  <span className="font-mono text-xs font-bold text-blue-500 uppercase tracking-widest block mb-2">
                    03 // Commercial Scale Opportunities
                  </span>
                  <p className="font-sans text-xs sm:text-sm font-light leading-relaxed opacity-85">
                    {brownieDpr.swotAndFeasibility.opportunities}
                  </p>
                </div>

                <div className={`p-5 rounded-2xl border ${previewTheme === 'bank' ? 'bg-red-50/50 border-red-300' : 'bg-red-950/20 border-red-500/30'}`}>
                  <span className="font-mono text-xs font-bold text-red-500 uppercase tracking-widest block mb-2">
                    04 // External Risks &amp; Raw Material Hedging
                  </span>
                  <p className="font-sans text-xs sm:text-sm font-light leading-relaxed opacity-85">
                    {brownieDpr.swotAndFeasibility.threats}
                  </p>
                </div>
              </div>

              {/* Endorsement and Sign-off */}
              <div className="border-t border-current/20 pt-6 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
                <div>
                  <span className="opacity-50 block text-[10px]">DIGITALLY GENERATED BY</span>
                  <span className="font-bold">UdyamSetu project report demo</span>
                </div>

                <div className="text-right">
                  <span className="opacity-50 block text-[10px]">DOCUMENT STATUS</span>
                  <span className="font-bold text-emerald-500">UdyamSetu sample · not for submission</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
