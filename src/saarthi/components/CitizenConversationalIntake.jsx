import React from 'react';
import { ExternalLink, IndianRupee, ShieldCheck } from 'lucide-react';
import { useSaarthi } from '../context/SaarthiContext';

export function CitizenConversationalIntake() {
  const { applicant, updateApplicantProfile, activeMatch } = useSaarthi();

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);

  return (
    <div className="mx-auto w-full max-w-4xl rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="mb-7 border-b border-slate-200 pb-5">
        <p className="text-xs font-semibold text-emerald-900">Guided scheme finder</p>
        <h3 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
          Explore a possible scheme match
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-700">
          Adjust an example project cost. The demo compares only that amount with a small
          bundled catalogue; it does not decide eligibility.
        </p>
      </div>

      <div className="mb-7 rounded-lg bg-slate-50 p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="project-cost" className="text-sm font-semibold text-slate-900">
            Example project cost
          </label>
          <output
            htmlFor="project-cost"
            className="inline-flex items-center gap-1 text-base font-bold text-emerald-900"
          >
            <IndianRupee className="h-4 w-4" aria-hidden="true" />
            {applicant.projectCost.toLocaleString('en-IN')}
          </output>
        </div>
        <input
          id="project-cost"
          type="range"
          min="50000"
          max="5000000"
          step="25000"
          value={applicant.projectCost}
          aria-valuetext={formatCurrency(applicant.projectCost)}
          onChange={(event) => updateApplicantProfile({ projectCost: Number(event.target.value) })}
          className="h-3 w-full cursor-pointer accent-emerald-800"
        />
        <div className="mt-2 flex justify-between text-xs text-slate-600">
          <span>₹50,000</span>
          <span>₹50,00,000</span>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-600">
          Starting amount is an example. Adjust it to explore. This value stays in this
          page and is cleared when you leave or reload.
        </p>
      </div>

      <section aria-live="polite" aria-atomic="true" className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 sm:p-5">
        {activeMatch.scheme ? (
          <>
            <p className="text-xs font-semibold text-emerald-900">Possible catalogue match</p>
            <h4 className="mt-1 text-lg font-bold text-slate-900">
              {activeMatch.scheme.name}
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              {activeMatch.explainableReason}
            </p>
          </>
        ) : (
          <>
            <p className="text-xs font-semibold text-slate-700">No catalogue record found</p>
            <h4 className="mt-1 text-lg font-bold text-slate-900">
              Try another project cost
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              The bundled demonstration catalogue has no record for this amount. This does
              not mean that no government support is available.
            </p>
          </>
        )}
        <div className="mt-4 flex items-start gap-2 border-t border-emerald-200 pt-3 text-xs leading-relaxed text-slate-700">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-900" aria-hidden="true" />
          <p>
            The catalogue may be incomplete or out of date. Confirm current eligibility,
            benefits, and application steps with the official provider.
          </p>
        </div>
        <a
          className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-emerald-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-900"
          href="https://www.myscheme.gov.in/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Verify on myScheme
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </section>
    </div>
  );
}

export default CitizenConversationalIntake;
