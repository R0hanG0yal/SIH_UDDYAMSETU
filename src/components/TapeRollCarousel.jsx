import React from 'react';
import { Sparkles, ShieldCheck, Gift, Percent, Award, ArrowUpRight, Zap } from 'lucide-react';

export function TapeRollCarousel() {
  const highlights = [
    { icon: <Gift size={16} className="text-orange-400" />, text: "PMEGP: Up to 35% Non-Repayable Direct Capital Subsidy", badge: "KVIC / MSME" },
    { icon: <ShieldCheck size={16} className="text-emerald-400" />, text: "PMMY MUDRA: 100% Collateral-Free Bank Credit up to ₹20 Lakh", badge: "Ministry of Finance" },
    { icon: <Zap size={16} className="text-amber-400" />, text: "PM-VishwaKarma: ₹15,000 Free Toolkit Grant & Flat 5.0% Interest", badge: "Active National" },
    { icon: <Percent size={16} className="text-cyan-400" />, text: "PM SVANidhi: 7% Interest Subvention + Cashback for Vendors", badge: "MoHUA" },
    { icon: <Award size={16} className="text-rose-400" />, text: "CGTMSE: 85% Sovereign Credit Guarantee Cover up to ₹5 Crore", badge: "SIDBI / GoI" },
    { icon: <Sparkles size={16} className="text-purple-400" />, text: "Zero Intermediaries: Direct Bank Routing to SBI, PNB, BoB, Canara", badge: "Authorized Channel" },
    { icon: <ShieldCheck size={16} className="text-teal-400" />, text: "Universal Inclusion: Transparent Policy Evaluation For Every Citizen", badge: "No Discrimination" }
  ];

  return (
    <div className="tape-roll-wrapper" title="Real-Time Government Credit Policy Ticker">
      <div className="tape-roll-track">
        {/* Double the array for seamless infinite marquee loop */}
        {[...highlights, ...highlights].map((item, idx) => (
          <div key={idx} className="tape-roll-item">
            {item.icon}
            <span style={{ color: 'rgba(255, 255, 255, 0.92)' }}>{item.text}</span>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '0.15rem 0.5rem',
              borderRadius: '9999px',
              background: 'rgba(249, 115, 22, 0.2)',
              border: '1px solid rgba(249, 115, 22, 0.4)',
              color: '#fdba74'
            }}>
              {item.badge}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
