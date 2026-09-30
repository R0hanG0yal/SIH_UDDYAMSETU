import React from 'react';
import { ClipboardList, SearchCheck, ShieldCheck } from 'lucide-react';
import { SaarthiProvider } from './context/SaarthiContext';
import { SaarthiNavbar } from './components/SaarthiNavbar';
import { SaarthiHero } from './components/SaarthiHero';
import { CitizenConversationalIntake } from './components/CitizenConversationalIntake';
import {
  CookieConsentBanner,
  ConsentSettingsButton,
  LegalPageHost,
  openLegalPage
} from '../compliance/ComplianceKit';

function SaarthiMainContent() {
  return (
    <div className="udyamsetu-theme min-h-screen bg-obsidian-950 text-slate-900 font-sans">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[300] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-slate-900"
      >
        Skip to main content
      </a>

      <div className="udyam-utility-bar">
        <div className="udyam-utility-inner">
          <span>Smart India Hackathon 2026 <span aria-hidden="true">·</span> SIH26092</span>
          <span className="udyam-utility-status">Independent student prototype</span>
        </div>
      </div>

      <SaarthiNavbar />
      <SaarthiHero />

      <main
        id="main-content"
        className="udyam-main mx-auto max-w-[1200px] space-y-16 px-4 py-12 sm:px-6 sm:py-16"
      >
        <section id="how-it-works" aria-labelledby="how-it-works-title">
          <div className="udyam-section-heading">
            <span className="udyam-section-kicker">How it works</span>
            <h2 id="how-it-works-title">A simple way to explore</h2>
            <p>The prototype makes a limited comparison, then points you to official information.</p>
          </div>
          <div className="udyam-how-grid">
            <article className="udyam-how-card">
              <span className="udyam-step-icon"><ClipboardList size={20} aria-hidden="true" /></span>
              <span className="udyam-step-number" aria-hidden="true">01</span>
              <h3>Choose an example project cost</h3>
              <p>Adjust the amount to explore the demonstration catalogue.</p>
            </article>
            <article className="udyam-how-card">
              <span className="udyam-step-icon"><SearchCheck size={20} aria-hidden="true" /></span>
              <span className="udyam-step-number" aria-hidden="true">02</span>
              <h3>Review a possible match</h3>
              <p>See the catalogue record associated with that project-cost range.</p>
            </article>
            <article className="udyam-how-card">
              <span className="udyam-step-icon"><ShieldCheck size={20} aria-hidden="true" /></span>
              <span className="udyam-step-number" aria-hidden="true">03</span>
              <h3>Verify before acting</h3>
              <p>Check the scheme's current criteria and application process with its official provider.</p>
            </article>
          </div>
        </section>

        <section id="dual-mode-section" aria-labelledby="finder-heading">
          <div className="udyam-finder-heading">
            <div>
              <span className="udyam-section-kicker">Scheme finder</span>
              <h2 id="finder-heading">Explore support for a business project</h2>
              <p>No account is needed. Values stay in this page and are not submitted.</p>
            </div>
          </div>
          <div className="mt-6">
            <CitizenConversationalIntake />
          </div>
        </section>

        <aside className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6" role="note">
          <h2 className="text-base font-bold text-slate-900">About this demonstration</h2>
          <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-700">
            This prototype currently compares project cost with a small bundled catalogue.
            It does not check every eligibility condition, verify a person's identity,
            accept applications, or connect to a government department or lender. Catalogue
            details may be incomplete or out of date.
          </p>
        </aside>
      </main>

      <footer id="about-project" className="udyam-footer border-t border-slate-200 px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-base font-bold text-slate-900">
              <span>UdyamSetu</span>
              <span className="text-xs font-medium text-emerald-900">SIH 2026 student prototype</span>
            </div>
            <p className="mt-1 max-w-md text-xs leading-relaxed text-slate-700">
              Independent project for Smart India Hackathon 2026, problem statement SIH26092.
              Not affiliated with a government department or scheme provider.
            </p>
          </div>

          <nav aria-label="Legal and accessibility information" className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <button type="button" onClick={() => openLegalPage('privacy')}>Privacy Policy</button>
            <button type="button" onClick={() => openLegalPage('terms')}>Terms &amp; Conditions</button>
            <button type="button" onClick={() => openLegalPage('cookies')}>Cookie Policy</button>
            <button type="button" onClick={() => openLegalPage('accessibility')}>Accessibility</button>
            <ConsentSettingsButton />
          </nav>
        </div>
      </footer>

      <LegalPageHost />
      <CookieConsentBanner />
    </div>
  );
}

export default function SaarthiApp() {
  return (
    <SaarthiProvider>
      <SaarthiMainContent />
    </SaarthiProvider>
  );
}
