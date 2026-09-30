import React, { useEffect } from 'react';
import SaarthiApp from './saarthi/SaarthiApp';
import { NotFoundPage } from './compliance/ComplianceKit';

export function App() {
  // Custom 404: direct paths other than the app root are not real pages.
  // The server SPA fallback serves index.html for these; we show a proper
  // "page not found" screen instead of pretending the route exists.
  const isKnownRoute = ['/', '/index.html'].includes(window.location.pathname);

  useEffect(() => {
    const descriptions = {
      home: 'An independent SIH 2026 student prototype for exploring possible government scheme matches by project-cost range.',
      privacy: 'Privacy information for the UdyamSetu SIH 2026 student prototype.',
      terms: 'Terms for the UdyamSetu SIH 2026 demonstration.',
      cookies: 'Cookie and local browser storage information for the UdyamSetu demo.',
      accessibility: 'Accessibility information and known limitations for the UdyamSetu demo.'
    };
    const syncMetadata = () => {
      const legalMatch = window.location.hash.match(/^#\/(privacy|terms|cookies|accessibility)$/);
      const page = legalMatch?.[1] || 'home';
      const title = {
        home: 'UdyamSetu — Scheme Discovery Demo',
        privacy: 'Privacy Policy — UdyamSetu',
        terms: 'Terms & Conditions — UdyamSetu',
        cookies: 'Cookie Policy — UdyamSetu',
        accessibility: 'Accessibility — UdyamSetu'
      }[page];
      document.title = isKnownRoute ? title : 'Page not found — UdyamSetu';
      const description = document.querySelector('meta[name="description"]');
      if (description) description.content = descriptions[page];
      const robots = document.querySelector('meta[name="robots"]');
      if (robots) robots.content = 'noindex, nofollow';
    };
    syncMetadata();
    window.addEventListener('hashchange', syncMetadata);
    return () => window.removeEventListener('hashchange', syncMetadata);
  }, [isKnownRoute]);

  if (!isKnownRoute) {
    return <NotFoundPage />;
  }

  // UdyamSetu: an independent scheme-discovery prototype for SIH26092.
  return <SaarthiApp />;
}

export default App;
