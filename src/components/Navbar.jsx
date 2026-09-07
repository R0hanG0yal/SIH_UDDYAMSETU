import React, { useState, useRef, useEffect } from 'react';
import { Compass, ShieldCheck, QrCode, Sliders, HelpCircle, MapPin, Settings, X, Accessibility, Monitor, Globe } from 'lucide-react';

export function Navbar({ activeTab, setActiveTab, lang = 'en', setLang, isCscMode, setIsCscMode, isHighContrast, setIsHighContrast }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'journey', label: lang === 'hi' ? 'यात्रा' : 'Journey', fullLabel: lang === 'hi' ? 'नागरिक यात्रा' : 'Citizen Journey', icon: Compass },
    { id: 'pulse', label: lang === 'hi' ? 'पार्टनर' : 'Partners', fullLabel: lang === 'hi' ? 'पार्टनर पल्स' : 'Partner Pulse', icon: MapPin },
    { id: 'officer', label: lang === 'hi' ? 'QR स्कैन' : 'Officer', fullLabel: lang === 'hi' ? 'अधिकारी QR' : 'Officer Scan', icon: QrCode },
    { id: 'admin', label: lang === 'hi' ? 'नीति' : 'Policy', fullLabel: lang === 'hi' ? 'नीति लैब' : 'Policy Studio', icon: Sliders },
    { id: 'faq', label: lang === 'hi' ? 'सहायता' : 'FAQ', fullLabel: lang === 'hi' ? 'सहायता' : 'FAQ & Portals', icon: HelpCircle }
  ];

  return (
    <header className="navbar-slim">
      <div className="navbar-inner">
        {/* Brand — compact */}
        <div className="navbar-brand" onClick={() => setActiveTab('journey')}>
          <div className="navbar-logo-mark">
            <Compass size={20} color="#ffffff" strokeWidth={2.5} />
          </div>
          <span className="navbar-wordmark">SAARTHI</span>
        </div>

        {/* Tab Navigation — compact pill bar */}
        <nav className="navbar-tabs">
          {navItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                id={`nav-tab-${tab.id}`}
                className={`navbar-tab-btn ${isActive ? 'active' : ''}`}
                title={tab.fullLabel}
              >
                <Icon size={16} />
                <span className="navbar-tab-label">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Language toggle (always visible) + Settings gear */}
        <div className="navbar-actions">
          {/* Compact language toggle — always visible */}
          <div className="navbar-lang-toggle">
            <button
              onClick={() => setLang('en')}
              id="lang-btn-en"
              className={`navbar-lang-btn ${lang === 'en' ? 'active' : ''}`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('hi')}
              id="lang-btn-hi"
              className={`navbar-lang-btn ${lang === 'hi' ? 'active' : ''}`}
            >
              हिं
            </button>
          </div>

          {/* Settings gear dropdown */}
          <div className="navbar-settings-wrap" ref={settingsRef}>
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`navbar-settings-btn ${settingsOpen ? 'open' : ''}`}
              id="settings-toggle-btn"
              title="Settings"
            >
              <Settings size={18} />
            </button>

            {settingsOpen && (
              <div className="navbar-settings-dropdown">
                <div className="settings-dropdown-header">
                  <span>Accessibility & Mode</span>
                  <button onClick={() => setSettingsOpen(false)} className="settings-close-btn">
                    <X size={14} />
                  </button>
                </div>

                <button
                  onClick={() => setIsHighContrast(!isHighContrast)}
                  className={`settings-option ${isHighContrast ? 'active' : ''}`}
                  id="high-contrast-toggle-btn"
                >
                  <Accessibility size={16} />
                  <div className="settings-option-text">
                    <span className="settings-option-label">High Contrast</span>
                    <span className="settings-option-desc">For outdoor / rural monitors</span>
                  </div>
                  <span className={`settings-toggle-pill ${isHighContrast ? 'on' : ''}`} />
                </button>

                <button
                  onClick={() => setIsCscMode(!isCscMode)}
                  className={`settings-option ${isCscMode ? 'active' : ''}`}
                  id="csc-mode-toggle-btn"
                >
                  <Monitor size={16} />
                  <div className="settings-option-text">
                    <span className="settings-option-label">CSC Kiosk Mode</span>
                    <span className="settings-option-desc">Common Service Centre operator view</span>
                  </div>
                  <span className={`settings-toggle-pill ${isCscMode ? 'on' : ''}`} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
