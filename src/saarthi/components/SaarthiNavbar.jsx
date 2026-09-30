import React from 'react';
import { Landmark } from 'lucide-react';

const links = [
  { label: 'Home', href: '#top' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Find schemes', href: '#dual-mode-section' },
  { label: 'About this demo', href: '#about-project' }
];

export function SaarthiNavbar() {
  return (
    <header className="udyam-header">
      <nav aria-label="Main navigation" className="udyam-nav">
        <a className="udyam-brand" href="#top" aria-label="UdyamSetu home">
          <span className="udyam-brand-mark" aria-hidden="true"><Landmark size={20} strokeWidth={1.8} /></span>
          <span className="udyam-brand-copy">
            <strong>UdyamSetu</strong>
            <small>Scheme guide for entrepreneurs</small>
          </span>
        </a>

        <div className="udyam-nav-links">
          {links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
        </div>

      </nav>
    </header>
  );
}

export default SaarthiNavbar;
