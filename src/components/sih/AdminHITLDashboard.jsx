import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2, XCircle, AlertTriangle, ShieldCheck, RefreshCw, Sparkles,
  ExternalLink, Quote, ChevronDown, ChevronRight, Database, MapPin, Trash2,
  Link2, Info
} from 'lucide-react';

// ============================================================================
// Field rendering metadata: label + formatter per HITL data key.
// Unknown keys (future extractors) fall back to a generic string renderer.
// ============================================================================
const FIELD_META = {
  maxCost:         { label: 'Max Project Cost',              fmt: v => `₹${Number(v).toLocaleString('en-IN')}` },
  maxLoanAmount:   { label: 'Max Loan Amount (90%)',         fmt: v => `₹${Number(v).toLocaleString('en-IN')}` },
  interestRate:    { label: 'Base Interest Rate',            fmt: v => `${v}% p.a.` },
  moratoriumMonths:{ label: 'Moratorium Period',             fmt: v => `${v} Months` },
  tenureYears:     { label: 'Max Repayment Tenure',          fmt: v => `${v} Years` },
  incomeCeiling:   { label: 'Annual Family Income Ceiling',  fmt: v => `₹${Number(v).toLocaleString('en-IN')}` }
};
const genericFmt = v => (typeof v === 'number' ? v.toLocaleString('en-IN') : String(v));

const confColor = (c) => (c >= 0.9 ? 'text-emerald-400' : c >= 0.75 ? 'text-amber-400' : 'text-rose-400');
const confChip = (c) => (c >= 0.9 ? 'bg-emerald-500/20 text-emerald-300' : c >= 0.75 ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300');

const GEOCODE_STATUS_CHIP = {
  PENDING_GEOCODE: 'bg-slate-600/40 text-slate-300',
  GEOCODED: 'bg-emerald-500/20 text-emerald-300',
  GEOCODED_OFFLINE: 'bg-cyan-500/20 text-cyan-300',
  LOW_CONFIDENCE: 'bg-amber-500/20 text-amber-300',
  MANUAL_REVIEW: 'bg-rose-500/20 text-rose-300',
  PROMOTED: 'bg-purple-500/20 text-purple-300'
};

export function AdminHITLDashboard() {
  const [reviews, setReviews] = useState([]);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionFeedback, setActionFeedback] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Staged directory partners (scrape -> geocode -> promote pipeline)
  const [staged, setStaged] = useState({ partners: [], byStatus: {} });
  const [stagedBusyId, setStagedBusyId] = useState(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v2/admin/policy-reviews');
      const data = await response.json();
      if (data.status === 'SUCCESS' && data.reviews) {
        setReviews(data.reviews);
        if (data.reviews.length > 0 && !data.reviews.some(r => r.id === selectedReviewId)) {
          setSelectedReviewId(data.reviews[0].id);
        }
      }
    } catch (err) {
      console.error('[HITL Dashboard Error]', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaged = async () => {
    try {
      const response = await fetch('/api/v2/admin/scraped-partners');
      const data = await response.json();
      if (data.status === 'SUCCESS') setStaged({ partners: data.partners || [], byStatus: data.byStatus || {} });
    } catch (err) {
      console.error('[Staged Partners Error]', err);
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchStaged();
  }, []);

  const activeReview = reviews.find(r => r.id === selectedReviewId) || reviews[0];

  const handleAdjudicate = async (action) => {
    if (!activeReview) return;
    setIsProcessing(true);
    setActionFeedback(null);

    try {
      const response = await fetch(`/api/v2/admin/policy-reviews/${activeReview.id}/adjudicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          reviewerName: 'Joint Secretary (SJE) Admin Desk',
          comments: action === 'APPROVE'
            ? 'Verified against MoSJE Official Gazette circular. Approved for live production routing.'
            : 'Rejected by nodal officer due to manual discrepancies.'
        })
      });

      const data = await response.json();
      setActionFeedback({
        type: action === 'APPROVE' ? 'success' : 'danger',
        message: data.message || (data.status !== 'SUCCESS' ? 'Adjudication failed' : data.message)
      });
      if (data.status === 'SUCCESS') {
        await fetchReviews(); // refresh statuses + live queue from source of truth
      }
    } catch (err) {
      console.error('[Adjudication Error]', err);
      setActionFeedback({ type: 'danger', message: err.message || 'Adjudication failed' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePromote = async (row) => {
    setStagedBusyId(row.id);
    try {
      const response = await fetch(`/api/v2/admin/scraped-partners/${row.id}/promote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ officerName: 'Joint Secretary (SJE) Admin Desk' })
      });
      const data = await response.json();
      setActionFeedback({
        type: data.status === 'SUCCESS' ? 'success' : 'danger',
        message: data.message
      });
      await fetchStaged();
    } catch (err) {
      setActionFeedback({ type: 'danger', message: err.message || 'Promotion failed' });
    } finally {
      setStagedBusyId(null);
    }
  };

  const handleDiscard = async (row) => {
    setStagedBusyId(row.id);
    try {
      const response = await fetch(`/api/v2/admin/scraped-partners/${row.id}/discard`, { method: 'POST' });
      const data = await response.json();
      if (data.status !== 'SUCCESS') setActionFeedback({ type: 'danger', message: data.message });
      await fetchStaged();
    } catch (err) {
      setActionFeedback({ type: 'danger', message: err.message || 'Discard failed' });
    } finally {
      setStagedBusyId(null);
    }
  };

  // In-process pipeline triggers (single DB writer: the API server itself)
  const [pipelineBusy, setPipelineBusy] = useState(false);

  const handleRunGeocode = async (offline = true) => {
    setPipelineBusy(true);
    setActionFeedback(null);
    try {
      const response = await fetch('/api/v2/admin/ingest/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offline })
      });
      const data = await response.json();
      if (response.status === 202) {
        setActionFeedback({ type: 'success', message: data.message });
      } else if (data.status === 'SUCCESS') {
        setActionFeedback({
          type: 'success',
          message: `Geocoded ${data.summary.geocoded} row(s); ${data.summary.needAttention} need attention.`
        });
      } else {
        setActionFeedback({ type: 'danger', message: data.message || 'Geocode failed' });
      }
      await fetchStaged();
    } catch (err) {
      setActionFeedback({ type: 'danger', message: err.message || 'Geocode failed' });
    } finally {
      setPipelineBusy(false);
    }
  };

  const handleRunIngest = async () => {
    setPipelineBusy(true);
    setActionFeedback(null);
    try {
      const response = await fetch('/api/v2/admin/ingest/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offline: true })
      });
      const data = await response.json();
      setActionFeedback({
        type: data.status === 'ACCEPTED' ? 'success' : 'danger',
        message: data.message || 'Ingest trigger failed'
      });
    } catch (err) {
      setActionFeedback({ type: 'danger', message: err.message || 'Ingest trigger failed' });
    } finally {
      setPipelineBusy(false);
    }
  };

  // Field rows derived from the review payload (dynamic — survives schema growth)
  const fieldRows = useMemo(() => {
    if (!activeReview) return [];
    const { oldData = {}, newData = {}, fieldConfidence = {}, fieldQuotes = {} } = activeReview;
    return Object.keys(oldData).map((key) => ({
      key,
      meta: FIELD_META[key] || { label: key, fmt: genericFmt },
      oldVal: oldData[key],
      newVal: newData[key] !== undefined ? newData[key] : oldData[key],
      confidence: fieldConfidence[key] ?? 1.0,
      quote: fieldQuotes[key] || null,
      changed: newData[key] !== undefined && newData[key] !== oldData[key]
    }));
  }, [activeReview]);

  const stagedGeocoded = staged.partners.filter(p => p.latitude && p.geocodeStatus !== 'PROMOTED');
  const stagedPendingCount = (staged.byStatus.PENDING_GEOCODE || 0) + (staged.byStatus.LOW_CONFIDENCE || 0) + (staged.byStatus.MANUAL_REVIEW || 0);

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 shadow-2xl text-slate-100 font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            Module 4: Human-in-the-Loop Admin Studio
          </span>
          <h2 className="text-2xl md:text-3xl font-black mt-2 text-white tracking-tight">
            Policy Ingestion & Validation Gateway
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Audit AI-extracted parameters from PDF circulars & official gazettes. Compare side-by-side with current production data before approving publication.
          </p>
        </div>

        <button
          type="button"
          onClick={() => { fetchReviews(); fetchStaged(); }}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-white/10 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Review queue selector (visible when more than one review exists) */}
      {reviews.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pt-4">
          {reviews.map(r => (
            <button
              type="button"
              key={r.id}
              onClick={() => setSelectedReviewId(r.id)}
              className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                r.id === activeReview?.id
                  ? 'bg-purple-500/20 border-purple-400 text-white'
                  : 'bg-slate-800/70 border-white/5 text-slate-400 hover:border-white/20'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${
                r.reviewStatus === 'PENDING' ? 'bg-amber-400 animate-pulse'
                : r.reviewStatus === 'APPROVED' ? 'bg-emerald-400' : 'bg-rose-400'
              }`}></span>
              {r.id} · {r.schemeName.split('(')[0].trim()}
            </button>
          ))}
        </div>
      )}

      {activeReview ? (
        <div className="space-y-6 pt-6">
          {/* Metadata Banner */}
          <div className="p-4 rounded-2xl bg-slate-800/70 border border-white/5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 block">
                {activeReview.reviewStatus === 'PENDING' ? 'Pending Ingestion Review' : `Review ${activeReview.reviewStatus.toLowerCase()}`}
                <span className="ml-2 px-1.5 py-0.5 rounded bg-slate-700 text-[10px] font-mono uppercase">{activeReview.origin}</span>
              </span>
              <span className="text-lg font-bold text-white">{activeReview.schemeName}</span>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                <span>Circular: <b className="text-slate-200">{activeReview.circularRef}</b></span>
                <span>•</span>
                <span>Extracted: {new Date(activeReview.extractedAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border ${
                activeReview.reviewStatus === 'APPROVED'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : activeReview.reviewStatus === 'REJECTED'
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse'
              }`}>
                {activeReview.reviewStatus}
              </span>
              <a
                href={activeReview.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition"
              >
                <span>View Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* AI Extraction Notes */}
          <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 text-xs text-purple-200 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-purple-300 block mb-0.5">AI OCR & Parsing Intelligence:</span>
              <p className="text-slate-300">{activeReview.aiExtractionNotes}</p>
            </div>
          </div>

          {/* Side-by-Side Comparison: dynamic rows + per-field verbatim quotes */}
          <div className="overflow-x-auto rounded-3xl border border-white/10 shadow-xl bg-slate-900/90">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/90 text-slate-300 font-bold uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3.5 px-4">Scheme Parameter</th>
                  <th className="py-3.5 px-4 text-slate-400">Current Production Policy (Old)</th>
                  <th className="py-3.5 px-4 text-emerald-400">AI-Extracted Circular (New)</th>
                  <th className="py-3.5 px-4 text-center">Confidence</th>
                  <th className="py-3.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {fieldRows.map((row) => (
                  <React.Fragment key={row.key}>
                    <tr className={`transition ${row.changed ? 'hover:bg-white/5' : 'opacity-60 hover:bg-white/5'}`}>
                      <td className="py-3 px-4 font-sans font-semibold text-slate-200">{row.meta.label}</td>
                      <td className="py-3 px-4 text-slate-400">{row.meta.fmt(row.oldVal)}</td>
                      <td className={`py-3 px-4 font-bold ${row.changed ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-300'}`}>
                        {row.meta.fmt(row.newVal)}
                      </td>
                      <td className={`py-3 px-4 text-center font-bold ${confColor(row.confidence)}`}>
                        {(row.confidence * 100).toFixed(0)}%
                      </td>
                      <td className="py-3 px-4 text-right font-sans">
                        {row.changed ? (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${confChip(row.confidence)}`}>
                            CHANGED {row.confidence < 0.75 ? '• NEEDS REVIEW' : ''}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700/60 text-slate-400">
                            UNCHANGED
                          </span>
                        )}
                      </td>
                    </tr>
                    {/* Verbatim quote audit line (zero-hallucination proof) */}
                    <tr className={row.changed ? 'bg-slate-900/60' : ''}>
                      <td className="py-2 px-4"></td>
                      <td colSpan={4} className="py-2 pr-4">
                        {row.quote ? (
                          <div className="flex items-start gap-2 text-[11px] text-slate-400 leading-snug">
                            <Quote className={`w-3 h-3 shrink-0 mt-0.5 ${row.changed ? 'text-emerald-400' : 'text-slate-600'}`} />
                            <span className="italic">
                              {row.quote}
                              <a
                                href={activeReview.sourceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="ml-2 inline-flex items-center gap-0.5 text-[10px] text-cyan-400 hover:text-cyan-300 not-italic font-sans"
                              >
                                <Link2 className="w-3 h-3" /> verify
                              </a>
                            </span>
                          </div>
                        ) : (
                          <span className="flex items-center gap-1.5 text-[11px] text-rose-400">
                            <AlertTriangle className="w-3 h-3" /> No verbatim quote — field must not be published.
                          </span>
                        )}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Feedback Alert */}
          {actionFeedback && (
            <div className={`p-4 rounded-2xl border text-sm flex items-center gap-3 ${
              actionFeedback.type === 'success'
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-500/20 border-rose-500/40 text-rose-200'
            }`}>
              {actionFeedback.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
              )}
              <span>{actionFeedback.message}</span>
            </div>
          )}

          {/* Human-in-the-Loop Adjudication Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-slate-800/80 border border-white/10 shadow-xl">
            <div className="text-xs text-slate-400 max-w-md">
              <span className="font-bold text-slate-200 block mb-0.5">Admin Sovereign Gatekeeping:</span>
              Approving commits these parameters into live database schemas and updates policy version to NSFDC-2026.02.
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleAdjudicate('REJECT')}
                disabled={isProcessing || activeReview.reviewStatus !== 'PENDING'}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer shadow-lg shadow-rose-600/20"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject & Request Re-OCR</span>
              </button>

              <button
                type="button"
                onClick={() => handleAdjudicate('APPROVE')}
                disabled={isProcessing || activeReview.reviewStatus !== 'PENDING'}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer shadow-lg shadow-emerald-600/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Publish to Live Schemes</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-slate-400 text-sm">
          No pending circular policy reviews found.
        </div>
      )}

      {/* ====================================================================== */}
      {/* Directory Ingest: staged SCA/RRB/PSB rows (scrape -> geocode -> promote) */}
      {/* ====================================================================== */}
      <div className="mt-10 pt-6 border-t border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Database className="w-3.5 h-3.5" />
              Directory Ingest Pipeline
            </span>
            <h3 className="text-lg font-black text-white mt-2">
              Staged Channel-Partner Rows ({staged.partners.length})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Scraped from the official MoSJE Channelizing Agencies list. Geocode, review, then promote onto the live map.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
            {Object.entries(staged.byStatus).map(([status, count]) => (
              <span key={status} className={`px-2 py-1 rounded-lg ${GEOCODE_STATUS_CHIP[status] || 'bg-slate-700 text-slate-300'}`}>
                {status.replace(/_/g, ' ')}: {count}
              </span>
            ))}
          </div>
        </div>

        {(stagedPendingCount > 0 || staged.partners.length > 0) && (
          <div className="mt-3 p-3 rounded-2xl bg-slate-800/60 border border-white/5 text-[11px] text-slate-400 flex flex-wrap items-center gap-3">
            <span className="flex items-start gap-2 flex-1 min-w-[220px]">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-cyan-400" />
              <span>
                {stagedPendingCount > 0
                  ? `${stagedPendingCount} row(s) awaiting coordinates. Geocode offline (demo jitter) or via Nominatim (1 req/s), then promote reviewed rows.`
                  : 'Rows ready for review. Promote to publish onto the live map with SIMULATED_DEMO telemetry flags.'}
              </span>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleRunIngest()}
                disabled={pipelineBusy}
                className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-slate-200 text-[11px] font-bold transition cursor-pointer"
                title="Re-scrape the official MoSJE directory into staging"
              >
                Re-scrape Directory
              </button>
              <button
                type="button"
                onClick={() => handleRunGeocode(true)}
                disabled={pipelineBusy}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-[11px] font-bold transition cursor-pointer"
                title="Offline demo geocode (deterministic jitter)"
              >
                {pipelineBusy ? 'Working…' : 'Geocode (Offline)'}
              </button>
              <button
                type="button"
                onClick={() => handleRunGeocode(false)}
                disabled={pipelineBusy}
                className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-cyan-600 disabled:opacity-50 text-slate-200 text-[11px] font-bold transition cursor-pointer"
                title="Live Nominatim geocode — ~1s per row"
              >
                Geocode (Live OSM)
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 max-h-72 overflow-y-auto rounded-2xl border border-white/10 divide-y divide-white/5">
          {stagedGeocoded.length === 0 && staged.partners.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-xs">
              No staged directory rows. Run <code className="font-mono text-slate-400">npm run ingest</code> to scrape the official directory.
            </div>
          )}
          {staged.partners.map((p) => {
            const promotable = !!p.latitude && p.geocodeStatus !== 'PROMOTED';
            return (
              <div key={p.id} className="flex flex-wrap items-center gap-3 p-3 hover:bg-white/5 transition">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-slate-200 block truncate">{p.agencyName}</span>
                  <span className="text-[10px] text-slate-500 truncate block">
                    {p.section} • {p.state || '—'}
                    {p.latitude ? ` • (${Number(p.latitude).toFixed(3)}, ${Number(p.longitude).toFixed(3)})` : ''}
                    {p.geocodeConfidence != null ? ` • conf ${(p.geocodeConfidence * 100).toFixed(0)}%` : ''}
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${GEOCODE_STATUS_CHIP[p.geocodeStatus] || 'bg-slate-700 text-slate-300'}`}>
                  {p.geocodeStatus.replace(/_/g, ' ')}
                </span>
                {p.geocodeDisplayName && (
                  <span className="hidden xl:block text-[10px] text-slate-500 max-w-[220px] truncate" title={p.geocodeDisplayName}>
                    {p.geocodeDisplayName}
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePromote(p)}
                    disabled={!promotable || stagedBusyId === p.id}
                    title={promotable ? 'Publish to the live partner map' : 'Geocode this row first'}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-[11px] font-bold flex items-center gap-1 transition cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-3 h-3" /> Promote
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDiscard(p)}
                    disabled={stagedBusyId === p.id || p.geocodeStatus === 'PROMOTED'}
                    title="Discard this staged row"
                    className="px-2.5 py-1.5 rounded-lg bg-slate-700 hover:bg-rose-600 disabled:opacity-40 text-slate-200 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {staged.byStatus.PROMOTED > 0 && (
          <p className="mt-2 text-[10px] text-slate-500">
            {staged.byStatus.PROMOTED} row(s) already promoted to the live map appear greyed in filters but stay listed until the next directory scrape refreshes staging.
          </p>
        )}
      </div>
    </div>
  );
}

export default AdminHITLDashboard;
