import React, { useState } from 'react';
import { useSaarthi } from '../context/SaarthiContext';
import { revealAndScrollTo } from '../utils';
import { Monitor, FileSpreadsheet, Keyboard, Upload, CheckCircle2, AlertCircle, Play, FileText, ArrowRight } from 'lucide-react';

export function CSCOperatorTerminal() {
  const {
    applicant,
    updateApplicantProfile,
    activeMatch,
    setActiveSection
  } = useSaarthi();

  const [batchUploaded, setBatchUploaded] = useState(false);
  const [operatorId] = useState("CSC-UP-LKO-44019 (e-Mitra Desk)");

  // Sample data-dense applicant queue for CSC operators
  const [queue, setQueue] = useState([
    { id: "APP-01", name: "Aarav Sharma", venture: "Cloud Bakery", cost: 2500000, income: 180000, scheme: "TLS-03 (Term Loan)", match: "97%", status: "READY_FOR_DPR" },
    { id: "APP-02", name: "Sunita Kumari", venture: "Artisan Silai Kendra", cost: 120000, income: 140000, scheme: "MFS-01 (Micro Finance)", match: "98%", status: "DPR_GENERATED" },
    { id: "APP-03", name: "Vikram Rawat", venture: "Auto Repair Workshop", cost: 480000, income: 210000, scheme: "TLS-03 (Term Loan)", match: "95%", status: "PENDING_KYC" },
    { id: "APP-04", name: "Pooja Gautam", venture: "B.Tech Electrical", cost: 1400000, income: 160000, scheme: "ELS-05 (Education)", match: "99%", status: "ROUTED_SCA" },
    { id: "APP-05", name: "Ramesh Paswan", venture: "Poultry Farm", cost: 850000, income: 240000, scheme: "TLS-03 (Term Loan)", match: "94%", status: "READY_FOR_DPR" }
  ]);

  const handleSimulateBatch = () => {
    setBatchUploaded(true);
    setTimeout(() => {
      setBatchUploaded(false);
    }, 3500);
  };

  return (
    <div className="w-full max-w-6xl mx-auto rounded-3xl border border-white/10 bg-obsidian-900/95 backdrop-blur-xl p-4 sm:p-6 shadow-2xl font-mono text-xs text-white">
      
      {/* Top Terminal Status Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
            <Monitor className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-wider text-sm">
                e-MITRA / CSC HIGH-DENSITY OPERATOR TERMINAL
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] bg-amber-400/20 text-amber-400 border border-amber-400/30">
                STATION ACTIVE
              </span>
            </div>
            <span className="text-[10px] text-white/50 tracking-widest block">
              OPERATOR: {operatorId} &bull; BUFFER: 5 ACTIVE FILES
            </span>
          </div>
        </div>

        {/* Batch Actions & Hotkeys */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSimulateBatch}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-black font-extrabold tracking-wider transition uppercase text-[10px]"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>BULK CSV INGEST (50 APPLICANTS)</span>
          </button>
        </div>
      </div>

      {/* Batch Notification */}
      {batchUploaded && (
        <div className="mt-4 p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 rounded-xl flex items-center gap-2 animate-fadeIn text-[11px]">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Batch processed: 50 rural applicant files validated against NSFDC ₹5.00L income threshold. 48 matched to Green Channel Partners.</span>
        </div>
      )}

      {/* Data-Dense Applicant Queue Table */}
      <div className="mt-4 overflow-x-auto border border-white/10 rounded-xl bg-obsidian-950">
        <table className="w-full text-left text-[11px] whitespace-nowrap">
          <thead className="bg-obsidian-900 text-white/50 uppercase tracking-widest border-b border-white/10">
            <tr>
              <th className="py-2.5 px-3">APP ID</th>
              <th className="py-2.5 px-3">APPLICANT</th>
              <th className="py-2.5 px-3">VENTURE</th>
              <th className="py-2.5 px-3">PROJECT COST</th>
              <th className="py-2.5 px-3">INCOME</th>
              <th className="py-2.5 px-3">MATCHED SCHEME</th>
              <th className="py-2.5 px-3">SCORE</th>
              <th className="py-2.5 px-3">STATUS</th>
              <th className="py-2.5 px-3 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {queue.map((row) => (
              <tr key={row.id} className="hover:bg-white/5 transition">
                <td className="py-2.5 px-3 font-bold text-amber-400">{row.id}</td>
                <td className="py-2.5 px-3 font-sans font-medium text-white">{row.name}</td>
                <td className="py-2.5 px-3 text-white/80">{row.venture}</td>
                <td className="py-2.5 px-3 font-mono font-bold text-white">₹{row.cost.toLocaleString('en-IN')}</td>
                <td className="py-2.5 px-3 text-emerald-400">₹{row.income.toLocaleString('en-IN')}</td>
                <td className="py-2.5 px-3 text-white/90">{row.scheme}</td>
                <td className="py-2.5 px-3 font-bold text-emerald-400">{row.match}</td>
                <td className="py-2.5 px-3">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    row.status === 'READY_FOR_DPR' ? 'bg-champagne-gold/20 text-champagne-gold' :
                    row.status === 'DPR_GENERATED' ? 'bg-emerald-500/20 text-emerald-400' :
                    'bg-blue-500/20 text-blue-300'
                  }`}>
                    {row.status}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      updateApplicantProfile({ name: row.name, projectCost: row.cost, annualIncome: row.income });
                      setActiveSection('dpr');
                      revealAndScrollTo('auto-dpr-section');
                    }}
                    className="px-2 py-1 bg-white/10 hover:bg-champagne-gold hover:text-black rounded text-[9px] uppercase tracking-wider transition"
                  >
                    GENERATE DPR &rarr;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Keyboard Shortcuts Bar */}
      <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-[10px] text-white/40 tracking-wider">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-obsidian-800 border border-white/20 rounded">ALT + N</kbd> New Applicant</span>
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-obsidian-800 border border-white/20 rounded">ALT + D</kbd> Auto-DPR</span>
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-obsidian-800 border border-white/20 rounded">ALT + M</kbd> Honest Map</span>
        </div>
        <span>HIGH-DENSITY KIOSK WORKFLOW VERIFIED</span>
      </div>

    </div>
  );
}

export default CSCOperatorTerminal;
