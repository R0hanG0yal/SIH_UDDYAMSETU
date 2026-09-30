import React from 'react';
import { FileText, MapPin, Search, SlidersHorizontal } from 'lucide-react';
import { useSaarthi } from '../context/SaarthiContext';
import { revealAndScrollTo } from '../utils';

export function SaarthiMobileBottomBar() {
  const { setActiveSection } = useSaarthi();

  const items = [
    { label: 'Find', icon: Search, id: 'dual-mode-section' },
    { label: 'Compare', icon: SlidersHorizontal, id: 'smart-arbitrage-card', section: 'recommender' },
    { label: 'Report', icon: FileText, id: 'auto-dpr-section', section: 'dpr' },
    { label: 'Map', icon: MapPin, id: 'honest-map-section', section: 'honest_map' }
  ];

  return (
    <nav className="udyam-mobile-nav" aria-label="Quick navigation">
      {items.map(({ label, icon: Icon, id, section }) => (
        <button
          key={id}
          type="button"
          onClick={() => {
            if (section) setActiveSection(section);
            revealAndScrollTo(id);
          }}
        >
          <Icon size={18} aria-hidden="true" />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

export default SaarthiMobileBottomBar;
