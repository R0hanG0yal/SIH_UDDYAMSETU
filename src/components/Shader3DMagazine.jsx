import React, { useEffect, useRef, useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, ExternalLink, ShieldCheck, ChevronDown, ChevronUp, Sparkles, FileText } from 'lucide-react';

export function Shader3DMagazine() {
  const canvasRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showFullNotice, setShowFullNotice] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  // Official Policy Gazettes
  const gazettePages = [
    {
      volume: "Gazette Extraordinary No. 412 • MoMSME",
      title: "PMEGP 2.0 Operational Guidelines & Subsidy Matrix",
      date: "Notification Ref: MSME/PMEGP/2024-25/08",
      highlight: "Direct Capital Cash Subsidy: 15% to 35%",
      abstract: "The Prime Minister's Employment Generation Programme (PMEGP) provides direct non-repayable margin money subsidy to encourage micro-enterprise generation across manufacturing (up to ₹50L) and services (up to ₹20L).",
      fullText: "1. Under Section 4.2 of PMEGP Revised Operational Guidelines, general category beneficiaries in urban areas receive 15% margin money subsidy. For special categories (including women, rural, SC/ST, OBC, differently-abled, and ex-servicemen), the margin money subsidy is 25% in urban areas and 35% in rural areas. 2. The beneficiary's minimum equity contribution is 5% for special categories and 10% for general categories. 3. Margin money is maintained in a term deposit receipt for 3 years without interest charge, after which it is adjusted against loan repayment.",
      portal: "https://www.kviconline.gov.in/pmegp"
    },
    {
      volume: "Ministry of Finance Directive • PMMY",
      title: "Pradhan Mantri MUDRA Yojana: Collateral-Free Expansion",
      date: "RBI Notification: FIDD.MSME.BC.No.20/2024",
      highlight: "Tarun Plus Limit Raised to ₹20,00,000",
      abstract: "MUDRA scheme extends 100% collateral-free refinancing and working capital support across four tiers: Shishu (≤₹50K), Kishore (₹50K-₹5L), Tarun (₹5L-₹10L), and Tarun Plus (₹10L-₹20L) for entrepreneurs with satisfactory repayment tracks.",
      fullText: "Pursuant to Union Budget announcement and subsequent RBI operational guidelines, the credit guarantee coverage under Credit Guarantee Fund for Micro Units (CGFMU) is extended up to ₹20 Lakh. Banks are strictly prohibited from seeking third-party guarantee or property mortgage for all loans up to ₹10 Lakh.",
      portal: "https://www.mudra.org.in"
    },
    {
      volume: "Cabinet Committee on Economic Affairs • MSME",
      title: "PM-VishwaKarma Central Sector Scheme Architecture",
      date: "MoMSME Gazette Reg. DL-33004/99",
      highlight: "Flat 5.0% Interest + ₹15,000 Tool Grant",
      abstract: "Comprehensive holistic financial and skill framework for traditional craftsmen and artisans across 18 designated trades, offering digital tool vouchers and subvented credit.",
      fullText: "Beneficiaries undergo 5 to 7 days of basic skill training with a daily stipend of ₹500. Upon successful assessment, a digital voucher of ₹15,000 is credited for purchasing modern toolkit equipment. Enterprise loan tranche 1 provides up to ₹1,00,000 at a flat 5.0% interest rate, followed by tranche 2 of up to ₹2,00,000 upon timely repayment.",
      portal: "https://pmvishwakarma.gov.in"
    }
  ];

  // Fluid Liquid Shader Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.parentElement.offsetWidth || 700;
      canvas.height = 240;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      t += 0.015;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Draw flowing iridescent waves
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const grad = ctx.createLinearGradient(0, 0, w, h);
        if (i === 0) {
          grad.addColorStop(0, 'rgba(19, 78, 74, 0.35)');
          grad.addColorStop(1, 'rgba(16, 185, 129, 0.25)');
        } else if (i === 1) {
          grad.addColorStop(0, 'rgba(249, 115, 22, 0.28)');
          grad.addColorStop(1, 'rgba(245, 158, 11, 0.18)');
        } else {
          grad.addColorStop(0, 'rgba(14, 165, 233, 0.2)');
          grad.addColorStop(1, 'rgba(99, 102, 241, 0.2)');
        }
        ctx.fillStyle = grad;

        ctx.moveTo(0, h);
        for (let x = 0; x <= w; x += 15) {
          const y = h * 0.5 + Math.sin(x * 0.008 + t + i) * 35 + Math.cos(x * 0.005 - t * 0.8) * 20;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handlePageChange = (newPage) => {
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage(newPage);
      setIsFlipping(false);
    }, 280);
  };

  const currentGazette = gazettePages[currentPage];

  return (
    <div className="liquid-glass-card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <BookOpen className="text-teal-700" size={20} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-navy)' }}>
              3D Sovereign Gazette & Policy Magazine
            </h3>
            <span className="badge-status badge-green">
              <span className="pulse-dot green"></span> Live Ministry Directives
            </span>
          </div>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.88rem' }}>
            Interactive 3D view of the statutory Government of India Gazette notifications governing your credit.
          </p>
        </div>

        <button
          onClick={() => setShowFullNotice(!showFullNotice)}
          className="details-toggle-btn"
          id="toggle-gazette-details-btn"
        >
          {showFullNotice ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {showFullNotice ? "Collapse Gazette Text" : "Show Full Official Gazette"}
        </button>
      </div>

      {/* 3D Magazine Stage with Fluid Shader Background */}
      <div className="magazine-3d-wrapper">
        <div style={{
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          background: 'rgba(9, 30, 32, 0.94)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.4)'
        }}>
          {/* Animated Canvas Shader */}
          <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.6 }} />

          {/* Interactive Magazine 3D Card Content */}
          <div
            className="magazine-3d-card"
            style={{
              padding: '2rem',
              color: '#ffffff',
              position: 'relative',
              zIndex: 2,
              transform: isFlipping ? 'rotateY(18deg) scale(0.97)' : 'rotateY(0deg) scale(1)',
              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#fdba74', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {currentGazette.volume}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                {currentGazette.date}
              </span>
            </div>

            <h4 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1.3 }}>
              {currentGazette.title}
            </h4>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.3rem 0.8rem',
              borderRadius: '9999px',
              background: 'rgba(249, 115, 22, 0.25)',
              border: '1px solid rgba(249, 115, 22, 0.45)',
              color: '#ffedd5',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '1rem'
            }}>
              <Sparkles size={14} /> {currentGazette.highlight}
            </div>

            <p style={{ color: 'rgba(255, 255, 255, 0.88)', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              {currentGazette.abstract}
            </p>

            {/* Collapsible Full Official Text */}
            {showFullNotice && (
              <div style={{
                background: 'rgba(0, 0, 0, 0.35)',
                padding: '1.25rem',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '1.25rem',
                fontSize: '0.85rem',
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: 1.65
              }}>
                <strong style={{ color: '#ffffff', display: 'block', marginBottom: '0.4rem' }}>
                  Statutory Enactment & Operational Rules:
                </strong>
                {currentGazette.fullText}
              </div>
            )}

            {/* Navigation & Portal Link Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => handlePageChange((currentPage - 1 + gazettePages.length) % gazettePages.length)}
                  className="btn-outline"
                  style={{
                    padding: '0.4rem 0.8rem',
                    background: 'rgba(255, 255, 255, 0.15)',
                    borderColor: 'rgba(255, 255, 255, 0.25)',
                    color: '#ffffff',
                    fontSize: '0.8rem'
                  }}
                  title="Previous Gazette Page"
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                  Page {currentPage + 1} of {gazettePages.length}
                </span>
                <button
                  onClick={() => handlePageChange((currentPage + 1) % gazettePages.length)}
                  className="btn-outline"
                  style={{
                    padding: '0.4rem 0.8rem',
                    background: 'rgba(255, 255, 255, 0.15)',
                    borderColor: 'rgba(255, 255, 255, 0.25)',
                    color: '#ffffff',
                    fontSize: '0.8rem'
                  }}
                  title="Next Gazette Page"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>

              <a
                href={currentGazette.portal}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: '#fdba74',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                Official Ministry Gazette Portal <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
