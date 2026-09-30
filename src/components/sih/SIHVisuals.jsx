import React, { useMemo } from 'react';

/**
 * =============================================================================
 * SIH26092 — Pure-SVG visual kit (no external chart library; Tailwind-styled)
 *  - ArchitectureFlow     : the zero-hallucination ingest -> HITL -> serve pipeline
 *  - RateComparisonBars   : NSFDC concessional rates vs commercial benchmark
 *  - FundingDonut         : 90/10 funding split visual
 *  - ChannelTypeChart     : horizontal bar chart of partner types
 *  - IngestSankeyFlow     : scrape -> stage -> geocode -> promote funnel
 *  - JourneyStepper       : 4-step beneficiary journey with progress states
 *  - SIHVisualOverview    : convenience combo of the three overview visuals
 * =============================================================================
 */

const GRADIENT_DEFS = (
  <defs>
    <linearGradient id="gradEmerald" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#10b981" />
      <stop offset="100%" stopColor="#0d9488" />
    </linearGradient>
    <linearGradient id="gradOrange" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#f97316" />
      <stop offset="100%" stopColor="#f59e0b" />
    </linearGradient>
  </defs>
);

export function ArchitectureFlow() {
  const columns = [
    {
      key: 'sources',
      label: 'OFFICIAL SOURCES',
      tone: 'cyan',
      items: [
        { icon: '📄', main: 'NSFDC Circular PDF', sub: 'Annexure-I(a)' },
        { icon: '🌐', main: 'MoSJE Pages', sub: 'dosje.gov.in' },
        { icon: '🏛️', main: 'SCA Directory', sub: 'SCA · RRB · PSB' }
      ]
    },
    {
      key: 'pipeline',
      label: 'EXTRACTION',
      tone: 'emerald',
      items: [
        { icon: '🔍', main: 'Fetch + Hash', sub: 'sha256 of normalized text' },
        { icon: '🧾', main: 'Extract', sub: 'quote-anchored parsers' },
        { icon: '🚦', main: 'Gate ≥ 0.75', sub: 'confidence + verbatim quote' }
      ]
    },
    {
      key: 'hitl',
      label: 'HUMAN GATE',
      tone: 'purple',
      items: [
        { icon: '👤', main: 'Nodal Officer', sub: 'diff + quotes review' },
        { icon: '✍️', main: 'Approve / Reject', sub: 'publish → NSFDC-2026.02' }
      ]
    },
    {
      key: 'serve',
      label: 'LIVE SERVICES',
      tone: 'orange',
      items: [
        { icon: '🎯', main: 'Recommender', sub: 'explainable match score' },
        { icon: '🧮', main: 'EMI Engine', sub: 'moratorium + cadence' },
        { icon: '🗺️', main: 'Partner Router', sub: 'NPA-safe routing' }
      ]
    }
  ];

  const toneMap = {
    cyan: 'bg-cyan-500/10 border-cyan-400/50',
    emerald: 'bg-emerald-500/10 border-emerald-400/50',
    purple: 'bg-purple-500/15 border-purple-400/60',
    orange: 'bg-orange-500/10 border-orange-400/50'
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-wider">System Architecture</h3>
          <p className="text-[11px] text-slate-400">Nothing publishes without a verbatim quote + human sign-off.</p>
        </div>
        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-[10px] font-black tracking-wide">
          ZERO-HALLUCINATION PIPELINE
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {columns.map((col, ci) => (
          <React.Fragment key={col.key}>
            <div className={`rounded-2xl border p-3.5 ${toneMap[col.tone]}`}>
              <div className="text-[10px] font-black tracking-widest text-slate-300 mb-2.5">{col.label}</div>
              <div className="space-y-2">
                {col.items.map((it, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-xl bg-slate-900/60 border border-white/5">
                    <span className="text-base leading-none mt-0.5">{it.icon}</span>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-white leading-tight">{it.main}</div>
                      <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{it.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {ci < columns.length - 1 && (
              <div className="hidden md:flex items-center justify-center text-2xl text-slate-500 px-0.5">→</div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-3 p-2.5 rounded-xl bg-slate-800/60 border border-white/5 flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
        <span className="font-black text-slate-300">LOOP:</span>
        <span>Re-verify every 24h (INGEST_ENABLED) → diff-only reviews → officer approves → version bump</span>
        <span className="ml-auto font-mono text-slate-500">policy_reviews → scheme_versions</span>
      </div>
    </div>
  );
}

export function RateComparisonBars({ rates = [], commercialRate = 12.5 }) {
  const max = Math.max(commercialRate, ...rates.map(r => r.rate)) * 1.15;
  const W = 640;
  const rowH = 34;
  const H = rates.length * rowH + 60;
  const benchX = 46 + (commercialRate / max) * (W - 190);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Interest rate comparison">
      {GRADIENT_DEFS}
      <line x1={benchX} y1={8} x2={benchX} y2={H - 34} stroke="#f43f5e" strokeDasharray="5 4" strokeWidth="1.5" />
      <text x={benchX + 6} y={16} fill="#fb7185" fontSize="10" fontWeight="700">Commercial ~{commercialRate}%</text>

      {rates.map((r, i) => {
        const y = 28 + i * rowH;
        const w = (r.rate / max) * (W - 190);
        return (
          <g key={r.label}>
            <text x={38} y={y + 15} textAnchor="end" fill="#e2e8f0" fontSize="11" fontWeight="700">{r.label}</text>
            <rect x={46} y={y + 3} width={w} height={20} rx={5} fill="url(#gradEmerald)" opacity="0.95" />
            <text x={46 + w + 8} y={y + 18} fill="#6ee7b7" fontSize="11" fontWeight="800">{r.rate}%</text>
          </g>
        );
      })}
    </svg>
  );
}

export function FundingDonut({ percent = 90, size = 130 }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const filled = (percent / 100) * c;

  return (
    <svg viewBox="0 0 130 130" width={size} height={size} role="img" aria-label={`${percent}% funding donut`}>
      {GRADIENT_DEFS}
      <circle cx="65" cy="65" r={r} fill="none" stroke="#1e293b" strokeWidth="14" />
      <circle
        cx="65" cy="65" r={r} fill="none"
        stroke="url(#gradEmerald)" strokeWidth="14" strokeLinecap="round"
        strokeDasharray={`${filled} ${c - filled}`}
        transform="rotate(-90 65 65)"
      />
      <text x="65" y="62" textAnchor="middle" fill="#ffffff" fontSize="24" fontWeight="800">{percent}%</text>
      <text x="65" y="80" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="700">SOVEREIGN FUNDING</text>
    </svg>
  );
}

export function ChannelTypeChart({ partners = [] }) {
  const counts = useMemo(() => {
    const m = {};
    partners.forEach(p => { m[p.type] = (m[p.type] || 0) + 1; });
    return Object.entries(m)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
  }, [partners]);

  const colorFor = {
    SCA: '#10b981', PSB: '#f59e0b', RRB: '#38bdf8',
    SFB: '#a78bfa', NBFC_MFI: '#fb7185', COOP: '#34d399'
  };
  const W = 560;
  const rowH = 30;
  const maxCount = Math.max(1, ...counts.map(c => c.count));
  const H = Math.max(counts.length, 1) * rowH + 16;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Partners by type">
      {GRADIENT_DEFS}
      {counts.map((c, i) => (
        <g key={c.type}>
          <text x={110} y={i * rowH + 19} textAnchor="end" fill="#e2e8f0" fontSize="11" fontWeight="700">
            {c.type.replace('_', '-')}
          </text>
          <rect x={120} y={i * rowH + 6} width={(c.count / maxCount) * (W - 190)} height={18} rx={4}
            fill={colorFor[c.type] || '#64748b'} opacity="0.9" />
          <text x={120 + (c.count / maxCount) * (W - 190) + 8} y={i * rowH + 19}
            fill="#cbd5e1" fontSize="11" fontWeight="800">{c.count}</text>
        </g>
      ))}
      {counts.length === 0 && (
        <text x={W / 2} y={H / 2} textAnchor="middle" fill="#64748b" fontSize="12">No partner data</text>
      )}
    </svg>
  );
}

export function IngestSankeyFlow({ staged = 53, geocoded = 53, promoted = 5 }) {
  const stages = [
    { label: 'Scraped rows', value: staged, color: '#38bdf8' },
    { label: 'Geocoded', value: geocoded, color: '#22d3ee' },
    { label: 'Promoted live', value: promoted, color: '#10b981' }
  ];
  const W = 640;
  const H = 150;
  const gap = 34;
  const bandW = (W - gap * (stages.length - 1)) / stages.length;
  const maxV = Math.max(...stages.map(s => s.value), 1);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Ingest pipeline funnel">
      {GRADIENT_DEFS}
      {stages.map((s, i) => {
        const x = i * (bandW + gap);
        const h = 20 + (s.value / maxV) * 80;
        const y = H - 34 - h;
        return (
          <g key={s.label}>
            <rect x={x} y={y} width={bandW} height={h} rx={8} fill={s.color} opacity="0.85" />
            <text x={x + bandW / 2} y={y - 8} textAnchor="middle" fill="#e2e8f0" fontSize="15" fontWeight="800">{s.value}</text>
            <text x={x + bandW / 2} y={H - 12} textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="700">{s.label}</text>
            {i < stages.length - 1 && (
              <text x={x + bandW + gap / 2} y={y + h / 2 + 4} textAnchor="middle" fill="#64748b" fontSize="14">→</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function JourneyStepper({ current = 1 }) {
  const steps = [
    { id: 1, icon: '🎯', label: 'Match Scheme', desc: 'AI fit + rationale' },
    { id: 2, icon: '🧮', label: 'EMI & Savings', desc: 'moratorium-aware' },
    { id: 3, icon: '🗺️', label: 'Pick Partner', desc: 'NPA-safe routing' },
    { id: 4, icon: '🛡️', label: 'Officer Review', desc: 'HITL publish' }
  ];
  return (
    <div className="flex items-start gap-1.5">
      {steps.map((s, i) => {
        const done = current > s.id;
        const active = current === s.id;
        return (
          <React.Fragment key={s.id}>
            <div className={`flex flex-col items-center px-2.5 py-2 rounded-2xl border min-w-[92px] transition ${
              done ? 'bg-emerald-500/15 border-emerald-400/50'
              : active ? 'bg-orange-500/15 border-orange-400/60'
              : 'bg-slate-800/50 border-white/5'
            }`}>
              <span className="text-lg">{s.icon}</span>
              <span className={`text-[10px] font-black mt-1 ${active ? 'text-orange-300' : done ? 'text-emerald-300' : 'text-slate-400'}`}>{s.label}</span>
              <span className="text-[9px] text-slate-500 text-center leading-tight">{s.desc}</span>
            </div>
            {i < steps.length - 1 && <div className="text-slate-600 self-center">→</div>}
          </React.Fragment>
        );
      })}
      <div className="ml-auto self-center px-2.5 py-1.5 rounded-xl bg-slate-800/70 border border-white/10 text-[10px] text-slate-400">
        Step {Math.min(current, 4)} of 4
      </div>
    </div>
  );
}

/* Convenience wrapper combining the overview visuals */
export function SIHVisualOverview({ partners = [], staged = 53, geocoded = 53, promoted = 5 }) {
  return (
    <div className="space-y-4">
      <ArchitectureFlow />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4">
          <h4 className="text-xs font-black text-white uppercase tracking-wider mb-1">Funding Model</h4>
          <p className="text-[10px] text-slate-400 mb-2">NSFDC concessional share of project cost</p>
          <div className="flex items-center gap-3">
            <FundingDonut percent={90} size={118} />
            <div className="text-[10px] text-slate-400 space-y-1">
              <p><b className="text-emerald-300">90%</b> sovereign loan</p>
              <p><b className="text-amber-300">10%</b> beneficiary equity</p>
              <p className="text-slate-500 pt-1">Up to ₹45L absolute</p>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4">
          <h4 className="text-xs font-black text-white uppercase tracking-wider mb-1">Rate Advantage</h4>
          <p className="text-[10px] text-slate-400 mb-2">Beneficiary rates vs commercial bank</p>
          <RateComparisonBars
            rates={[
              { label: 'MSY (Women)', rate: 6.0 },
              { label: 'MCF', rate: 6.5 },
              { label: 'Term Loan', rate: 8.0 },
              { label: 'Utkarsh', rate: 9.0 }
            ]}
          />
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4">
          <h4 className="text-xs font-black text-white uppercase tracking-wider mb-1">Directory Pipeline</h4>
          <p className="text-[10px] text-slate-400 mb-2">MoSJE scrape → geocode → live map</p>
          <IngestSankeyFlow staged={staged} geocoded={geocoded} promoted={promoted} />
        </div>
      </div>
    </div>
  );
}

export default SIHVisualOverview;
