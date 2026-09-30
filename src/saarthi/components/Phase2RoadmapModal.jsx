import React, { useState } from 'react';
import { useSaarthi } from '../context/SaarthiContext';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  MessageSquare, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  Smartphone, 
  Send, 
  QrCode, 
  FileCheck,
  Building,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export function Phase2RoadmapModal() {
  const { 
    isWhatsappModalOpen, 
    setIsWhatsappModalOpen,
    isDigilockerModalOpen,
    setIsDigilockerModalOpen,
    applicant,
    activeMatch,
    selectedPartner
  } = useSaarthi();

  const [activeTab, setActiveTab] = useState(isWhatsappModalOpen ? 'whatsapp' : 'digilocker');
  const [digilockerState, setDigilockerState] = useState('IDLE'); // 'IDLE', 'FETCHING', 'VERIFIED'
  const [phoneNumber, setPhoneNumber] = useState('+91 98765 43210');
  const [whatsappSent, setWhatsappSent] = useState(false);

  // If neither modal is open, return null
  if (!isWhatsappModalOpen && !isDigilockerModalOpen) return null;

  const handleClose = () => {
    setIsWhatsappModalOpen(false);
    setIsDigilockerModalOpen(false);
  };

  const handleSimulateDigilocker = () => {
    setDigilockerState('FETCHING');
    setTimeout(() => {
      setDigilockerState('VERIFIED');
    }, 1200);
  };

  const handleSendWhatsapp = (e) => {
    e.preventDefault();
    setWhatsappSent(true);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      
      {/* Modal Container */}
      <div className="bg-obsidian-900 border border-white/20 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden my-auto">
        
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5 font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase">
              <span className="px-3 py-1 rounded-full bg-champagne-gold/20 text-champagne-gold border border-champagne-gold/40 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                PILLAR 06 // PHASE 2 STRATEGIC ROADMAP
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 text-white/60 border border-white/10">
                DEFENDING AGAINST SCOPE CREEP
              </span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-medium">
              National Scalability &amp; Last-Mile Delivery
            </h3>
            <p className="text-white/60 text-xs sm:text-sm font-light mt-1">
              Production-ready integrations designed to eliminate paperwork friction and reach rural beneficiaries directly.
            </p>
          </div>

          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white flex items-center justify-center transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-3 bg-obsidian-950 p-1.5 rounded-2xl border border-white/10 mb-6 font-mono text-xs">
          <button
            onClick={() => setActiveTab('digilocker')}
            className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'digilocker' 
                ? 'bg-champagne-gold text-black font-bold shadow' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>01 // 1-Click DigiLocker Verification</span>
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'whatsapp' 
                ? 'bg-emerald-500 text-black font-bold shadow' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>02 // WhatsApp Bot Last-Mile Delivery</span>
          </button>
        </div>

        {/* TAB 01: DIGILOCKER VERIFICATION */}
        {activeTab === 'digilocker' && (
          <div className="space-y-6">
            <div className="bg-obsidian-950 border border-white/10 rounded-2xl p-5">
              <h4 className="font-serif text-xl text-white mb-2">
                Automated Caste &amp; Income Statutory Boundary Verification
              </h4>
              <p className="text-white/70 text-xs sm:text-sm font-light leading-relaxed mb-6">
                A future version could explore consent-based DigiLocker verification, subject to approved integrations, privacy review and explicit user consent. This prototype does not connect to DigiLocker or verify identity, caste or income.
              </p>

              {/* Interactive DigiLocker Simulation */}
              <div className="bg-obsidian-900 border border-white/10 rounded-2xl p-5 max-w-xl mx-auto">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/40">
                      <Lock className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <span className="font-mono text-xs uppercase tracking-wider text-white font-bold block">
                        DigiLocker Sandbox Gateway
                      </span>
                      <span className="text-[10px] text-white/50 font-mono">
                        Aadhaar Linked Identity: XXXX-XXXX-4819
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 font-mono text-[9px] uppercase font-bold border border-blue-500/30">
                    SANDBOX ACTIVE
                  </span>
                </div>

                {digilockerState === 'IDLE' && (
                  <div className="text-center py-4">
                    <p className="text-white/70 text-xs font-light mb-4">
                      Click below to simulate 1-click credential pull from Uttar Pradesh e-District &amp; Revenue Portal.
                    </p>
                    <button
                      onClick={handleSimulateDigilocker}
                      className="px-6 py-2.5 rounded-xl bg-champagne-gold text-black font-mono text-xs uppercase font-bold tracking-wider hover:bg-white transition active:scale-95 shadow-lg"
                    >
                      Authenticate with DigiLocker OTP &rarr;
                    </button>
                  </div>
                )}

                {digilockerState === 'FETCHING' && (
                  <div className="text-center py-6 font-mono text-xs text-white/70">
                    <div className="w-8 h-8 rounded-full border-2 border-champagne-gold border-t-transparent animate-spin mx-auto mb-3"></div>
                    <span>Querying National API Gateway (UIDAI + State EDistrict)...</span>
                  </div>
                )}

                {digilockerState === 'VERIFIED' && (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-emerald-300">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Caste Certificate: SC (Chamar / Balmiki)</span>
                      </div>
                      <span className="text-[10px] text-emerald-400/80">DOC #UP/CST/2024/91823</span>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-emerald-300">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Annual Income: ₹1,80,000 (&le; ₹5.00L Statutory Bound)</span>
                      </div>
                      <span className="text-[10px] text-emerald-400/80">DOC #UP/INC/2026/04119</span>
                    </div>

                    <p className="text-[11px] text-white/60 font-sans text-center mt-2">
                      &check; <strong>Zero-Paperwork Verified:</strong> Automatic green light for 90% NSFDC concessional loan underwriting.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 02: WHATSAPP LAST-MILE DELIVERY */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-6">
            <div className="bg-obsidian-950 border border-white/10 rounded-2xl p-5">
              <h4 className="font-serif text-xl text-white mb-2">
                WhatsApp Bot &bull; Instant Match-Score &amp; Green Pin Navigation
              </h4>
              <p className="text-white/70 text-xs sm:text-sm font-light leading-relaxed mb-6">
                A future version could offer an opt-in messaging channel for scheme information in regional languages. This prototype does not send WhatsApp messages or verify nearby partners.
              </p>

              {/* WhatsApp Simulator Mockup */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Left: Interactive Phone Chat View (7 Cols) */}
                <div className="md:col-span-7 bg-[#0b141a] border-2 border-emerald-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl">
                  
                  {/* WhatsApp Chat Top Bar */}
                  <div className="flex items-center gap-3 border-b border-white/10 pb-3 mb-4">
                    <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
                      S
                    </div>
                    <div>
                      <h5 className="font-sans text-xs font-bold text-white flex items-center gap-1.5">
                        <span>UdyamSetu messaging concept</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
                      </h5>
                      <span className="text-[10px] text-emerald-400 font-mono">Government Verified Assistant</span>
                    </div>
                  </div>

                  {/* Message Bubble */}
                  <div className="bg-[#1f2c34] rounded-2xl p-3.5 text-xs text-white space-y-2 border border-white/5 font-sans leading-relaxed">
                    <p className="font-bold text-emerald-400 text-sm">
                      नमस्ते {applicant.name}! 🎉
                    </p>
                    <p>
                      आपके <strong>₹{applicant.projectCost / 100000} लाख</strong> के प्रोजेक्ट के लिए इस डेमो में संभावित योजना मैच:
                    </p>
                    <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-500/30 font-mono text-[11px] space-y-1">
                      <div className="text-emerald-300 font-bold">
                        {activeMatch?.scheme?.name || "Term Loan Scheme (TLS-03)"}
                      </div>
                      <div className="text-white/80">&bull; यह केवल एक उदाहरण है; पात्रता की पुष्टि योजना प्रदाता से करें।</div>
                      <div className="text-white/80">&bull; ब्याज दर: <strong>{activeMatch?.effectiveRate}% p.a. (Fixed)</strong></div>
                      <div className="text-white/80">&bull; 90% सरकारी ऋण: <strong>₹{((activeMatch?.loanAmount || 0)/100000).toFixed(2)} Lakhs</strong></div>
                      <div className="text-white/80">&bull; मोरेटोरियम ग्रेस: <strong>{activeMatch?.moratoriumMonths} महीने</strong></div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 font-mono text-[11px] space-y-1">
                      <div className="text-champagne-gold font-bold flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        निकटतम 🟢 ग्रीन पिन बैंक:
                      </div>
                      <div className="text-white font-medium">{selectedPartner?.name || "UPSCFDC Directorate"}</div>
                      <div className="text-white/60 text-[10px]">{selectedPartner?.branch} ({selectedPartner?.distanceKm} km)</div>
                    </div>

                    <p className="text-[10px] text-white/60 pt-1 font-mono">
                      आपका CA-ग्रेड बैंक प्रोजेक्ट रिपोर्ट (DPR PDF) तैयार है। नीचे क्लिक करके डाउनलोड करें।
                    </p>
                  </div>

                  {/* Message Delivery Form */}
                  <form onSubmit={handleSendWhatsapp} className="mt-4 flex items-center gap-2">
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 Mobile Number"
                      className="flex-1 bg-obsidian-950 border border-white/20 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase rounded-xl transition flex items-center gap-1.5"
                    >
                      <Send className="w-3 h-3" />
                      <span>{whatsappSent ? 'Sent!' : 'Send'}</span>
                    </button>
                  </form>

                  {whatsappSent && (
                    <div className="mt-2 text-center font-mono text-[11px] text-emerald-400">
                      &check; Match dossier dispatched to {phoneNumber} via WhatsApp Business API.
                    </div>
                  )}

                </div>

                {/* Right: QR Code for Mobile Testing (5 Cols) */}
                <div className="md:col-span-5 bg-obsidian-900 border border-white/10 rounded-3xl p-5 text-center flex flex-col items-center justify-center">
                  <div className="p-3 bg-white rounded-2xl shadow-xl mb-4">
                    <QRCodeSVG 
                      value={`https://wa.me/?text=UdyamSetu%20scheme%20information%20for%20${encodeURIComponent(applicant.name)}`}
                      size={140}
                      level="H"
                    />
                  </div>
                  <span className="font-mono text-xs uppercase tracking-wider text-champagne-gold font-bold block mb-1">
                    Scan to Open on WhatsApp
                  </span>
                  <p className="text-white/60 text-xs font-light max-w-xs">
                    Judges can scan with any smartphone camera to inspect the live WhatsApp payload.
                  </p>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
