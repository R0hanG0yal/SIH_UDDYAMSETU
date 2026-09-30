import React from 'react';
import { ArrowRight, SearchCheck, ShieldCheck } from 'lucide-react';

export function SaarthiHero() {
  return (
    <section id="top" className="udyam-hero">
      <div className="udyam-hero-inner">
        <div className="udyam-hero-copy">
          <span className="udyam-eyebrow"><span className="udyam-eyebrow-dot" aria-hidden="true" /> Scheme finder for entrepreneurs</span>
          <h1>Explore schemes for your <span>business project.</span></h1>
          <p className="udyam-hero-lede">
            Compare an example project cost with a small scheme catalogue, then check current details with the official provider. This prototype does not determine eligibility or accept applications.
          </p>
          <div className="udyam-hero-actions">
            <a className="udyam-button udyam-button-primary" href="#dual-mode-section">
              Explore possible matches <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
          <div className="udyam-demo-note" role="note">
            <ShieldCheck size={19} aria-hidden="true" />
            <p><strong>Student-built SIH 2026 prototype.</strong> Independent of myScheme and all government departments. Confirm eligibility and current terms with the scheme provider before acting.</p>
          </div>
        </div>

        <aside className="udyam-hero-panel" aria-label="How UdyamSetu helps">
          <div className="udyam-hero-panel-top">
            <span className="udyam-panel-icon"><SearchCheck size={22} aria-hidden="true" /></span>
            <span className="udyam-panel-kicker">A clearer first step</span>
          </div>
          <h2>What this demo checks</h2>
          <p>It compares a project-cost range with a bundled catalogue. It does not check identity, income, category, location, or every scheme condition.</p>
          <div className="udyam-panel-path" aria-hidden="true">
            <span className="udyam-path-node">Example project cost</span>
            <span className="udyam-path-line" />
            <span className="udyam-path-node udyam-path-node-active">Possible record</span>
            <span className="udyam-path-line" />
            <span className="udyam-path-node">Check with provider</span>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default SaarthiHero;
