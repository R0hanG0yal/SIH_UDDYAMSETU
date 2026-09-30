import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AlertCircle, Home, X } from 'lucide-react';

const NOTICE_KEY = 'udyamsetu-privacy-notice-v1';
const NOTICE_EVENT = 'udyamsetu-privacy-notice';

function wasNoticeDismissed() {
  try {
    return window.localStorage.getItem(NOTICE_KEY) === 'seen';
  } catch {
    return false;
  }
}

function Section({ heading, children }) {
  return (
    <section className="mb-5">
      <h3 className="mb-1.5 text-base font-bold text-slate-900">{heading}</h3>
      <div className="space-y-2 text-sm leading-relaxed text-slate-700">{children}</div>
    </section>
  );
}

function DemoNotice() {
  return (
    <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-amber-300 bg-amber-50 p-3.5 text-sm text-amber-950">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <p>
        UdyamSetu is an independent student prototype for Smart India Hackathon 2026,
        problem statement SIH26092. It is not a government website, scheme provider,
        myScheme service, or lender.{' '}
        <a
          className="font-semibold underline underline-offset-2"
          href="https://www.myscheme.gov.in/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit myScheme for official scheme information
        </a>.
      </p>
    </div>
  );
}

function PrivacyPage() {
  return (
    <div>
      <DemoNotice />
      <p className="mb-4 text-xs text-slate-500">Last updated: 30 September 2026</p>
      <Section heading="Who is responsible for this prototype">
        <p>
          This is a student project identified as UdyamSetu, SIH 2026 problem statement
          SIH26092. No registered business, postal address, or public support contact has
          been supplied for this prototype, so none is represented here.
        </p>
      </Section>
      <Section heading="What the scheme finder uses">
        <p>
          The current finder uses the example project cost selected on this page to
          choose a possible record from a bundled demonstration catalogue. That value
          stays in page memory in your browser and is not sent to the application server
          or saved for later use. Reloading or closing the page clears it.
        </p>
        <p>
          The finder does not need your name, phone number, Aadhaar, bank details,
          documents, caste certificate, or precise location. Do not enter sensitive
          personal information in this prototype.
        </p>
      </Section>
      <Section heading="Browser storage and tracking">
        <p>
          The app does not use analytics, advertising pixels, or tracking cookies. It
          stores one preference in this browser's local storage to remember that you
          dismissed this notice. Clearing site data in your browser removes it.
        </p>
        <p>
          Fonts and the utility styles are bundled with the app rather than loaded from
          third-party CDNs. External government information opens only when you choose an
          official-source link.
        </p>
      </Section>
      <Section heading="Privacy and the DPDP Act">
        <p>
          The prototype is designed to avoid collecting personal data. This statement is
          not a legal certification of compliance with the Digital Personal Data
          Protection Act, 2023 or its Rules. A real public launch would need a named
          responsible entity and contact, a verified data-flow and retention plan,
          security review, and legal review against the provisions in force at that time.
        </p>
      </Section>
      <Section heading="Scheme information">
        <p>
          The bundled catalogue is for demonstration and may be incomplete or out of
          date. A possible match is not an eligibility decision, loan offer, or
          application. Check current criteria and steps with the official scheme provider.
        </p>
      </Section>
    </div>
  );
}

function TermsPage() {
  return (
    <div>
      <DemoNotice />
      <p className="mb-4 text-xs text-slate-500">Last updated: 30 September 2026</p>
      <Section heading="Purpose">
        <p>
          UdyamSetu is a student-built demonstration for SIH 2026 problem statement
          SIH26092. It is provided for learning and evaluation, not as a public financial
          service.
        </p>
      </Section>
      <Section heading="No advice, approval, or promise">
        <p>
          A result is only a possible match based on limited demonstration data. It is not
          an eligibility determination, loan offer, approval, legal or financial advice,
          or a promise of funding.
        </p>
      </Section>
      <Section heading="Check official information">
        <p>
          Scheme rules and application steps can change. Confirm them directly with the
          scheme provider or on an official government portal before acting. If this
          prototype conflicts with an official notice, follow the official notice.
        </p>
      </Section>
      <Section heading="Use of the prototype">
        <p>
          Do not submit sensitive information or rely on example values for a financial
          decision. The project does not accept applications, verify identity, or contact
          a government department or lender on your behalf.
        </p>
      </Section>
      <Section heading="Project attribution">
        <p>
          The project is identified as UdyamSetu, Smart India Hackathon 2026, problem
          statement SIH26092. No separate legal business or service operator is represented.
        </p>
      </Section>
    </div>
  );
}

function CookiesPage() {
  return (
    <div>
      <DemoNotice />
      <p className="mb-4 text-xs text-slate-500">Last updated: 30 September 2026</p>
      <Section heading="Cookies">
        <p>
          This prototype does not set cookies for analytics or advertising. The current
          app uses browser local storage only to remember whether you dismissed the
          privacy notice. This preference does not track your activity across pages or
          sites.
        </p>
      </Section>
      <Section heading="Your choice">
        <p>
          You can remove the saved notice preference with the “Reset privacy notice”
          control in the footer, or clear this site's local storage in your browser.
          Resetting the notice does not delete information from a server; the scheme
          finder does not submit or save the values you enter.
        </p>
      </Section>
      <Section heading="External links">
        <p>
          When you choose to open an official-source link, your browser connects to that
          external website. Its own privacy and cookie practices apply there.
        </p>
      </Section>
    </div>
  );
}

function AccessibilityPage() {
  return (
    <div>
      <DemoNotice />
      <p className="mb-4 text-xs text-slate-500">Last updated: 30 September 2026</p>
      <Section heading="Current accessibility work">
        <p>
          The prototype includes a skip link, keyboard focus indicators, responsive
          layouts, semantic headings, and labels for the main project-cost control.
          Reduced-motion preferences are respected for site animations.
        </p>
      </Section>
      <Section heading="Limitations">
        <p>
          The site has not had a complete screen-reader, keyboard, or contrast audit.
          UdyamSetu does not claim WCAG conformance. Some optional demo components from
          earlier iterations are not part of the current public flow.
        </p>
      </Section>
      <Section heading="Project contact">
        <p>
          This localhost prototype has no public support channel. Accessibility issues
          should be raised with the SIH project team during evaluation before any wider
          release.
        </p>
      </Section>
    </div>
  );
}

const LEGAL_PAGES = {
  privacy: { title: 'Privacy Policy', Component: PrivacyPage },
  terms: { title: 'Terms & Conditions', Component: TermsPage },
  cookies: { title: 'Cookie Policy', Component: CookiesPage },
  accessibility: { title: 'Accessibility Statement', Component: AccessibilityPage }
};

export function openLegalPage(page) {
  if (!LEGAL_PAGES[page]) return;
  window.location.hash = '#/' + page;
  window.dispatchEvent(new Event('udyamsetu-open-legal'));
}

function LegalModalShell({ title, onClose, children }) {
  const closeRef = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const dialog = closeRef.current?.closest('[role="dialog"]');
      const focusable = dialog?.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    closeRef.current?.focus();
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-slate-950/55 p-0 sm:items-center sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-dialog-title"
        className="w-full max-h-[92vh] overflow-y-auto rounded-t-xl bg-white text-slate-800 shadow-2xl sm:max-w-2xl sm:rounded-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:px-7">
          <h2 id="legal-dialog-title" className="text-lg font-bold text-slate-900">{title}</h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close this page"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="px-5 py-5 sm:px-7 sm:py-6">{children}</div>
      </div>
    </div>
  );
}

export function LegalPageHost() {
  const [page, setPage] = useState(null);

  useEffect(() => {
    const sync = () => {
      const match = window.location.hash.match(/^#\/(privacy|terms|cookies|accessibility)$/);
      setPage(match ? match[1] : null);
    };
    sync();
    window.addEventListener('hashchange', sync);
    window.addEventListener('udyamsetu-open-legal', sync);
    return () => {
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('udyamsetu-open-legal', sync);
    };
  }, []);

  const close = useCallback(() => {
    history.replaceState(null, '', window.location.pathname + window.location.search);
    setPage(null);
  }, []);

  if (!page) return null;
  const { title, Component } = LEGAL_PAGES[page];
  return (
    <LegalModalShell title={title} onClose={close}>
      <Component />
    </LegalModalShell>
  );
}

export function NotFoundPage() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-5 px-4 text-center">
      <span className="font-mono text-7xl font-black text-slate-300" aria-hidden="true">404</span>
      <h1 className="text-2xl font-bold text-slate-900">This page could not be found</h1>
      <p className="max-w-md text-sm text-slate-700">
        This prototype only has a home page. The address may be old or typed incorrectly.
      </p>
      <a
        href="/"
        className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-emerald-900 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-900"
      >
        <Home className="h-4 w-4" aria-hidden="true" />
        Go to the home page
      </a>
    </main>
  );
}

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!wasNoticeDismissed());
    const reopen = () => setVisible(true);
    window.addEventListener(NOTICE_EVENT, reopen);
    return () => window.removeEventListener(NOTICE_EVENT, reopen);
  }, []);

  const dismiss = () => {
    try {
      window.localStorage.setItem(NOTICE_KEY, 'seen');
    } catch {
      // The notice remains dismissible when storage is unavailable.
    }
    setVisible(false);
  };

  if (!visible) return null;
  return (
    <aside
      role="region"
      aria-label="Privacy notice"
      className="fixed inset-x-0 bottom-0 z-[150] border-t border-slate-300 bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.12)]"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-900" aria-hidden="true" />
          <div>
            <p className="text-sm font-bold text-slate-900">Privacy notice</p>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-700">
              No analytics or advertising trackers are used. Scheme-finder inputs stay in
              this page; one browser preference remembers that this notice was dismissed.{' '}
              <button
                type="button"
                onClick={() => openLegalPage('privacy')}
                className="font-semibold text-emerald-900 underline underline-offset-2"
              >
                Read the privacy policy
              </button>
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="min-h-11 shrink-0 rounded-lg bg-emerald-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-900"
        >
          Continue
        </button>
      </div>
    </aside>
  );
}

export function ConsentSettingsButton() {
  const resetNotice = () => {
    try {
      window.localStorage.removeItem(NOTICE_KEY);
    } catch {
      // Nothing else is stored by this control.
    }
    window.dispatchEvent(new Event(NOTICE_EVENT));
  };

  return (
    <button
      type="button"
      onClick={resetNotice}
      className="text-[11px] font-semibold text-emerald-900 underline underline-offset-2 hover:text-emerald-700"
    >
      Reset privacy notice
    </button>
  );
}

export default {
  CookieConsentBanner,
  LegalPageHost,
  NotFoundPage,
  ConsentSettingsButton,
  openLegalPage
};
