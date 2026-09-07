import React, { useRef } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, CheckCircle2, Wrench, Scissors, SunMedium, ShoppingBag, Milk, Hammer } from 'lucide-react';

export function GalleryScroll({ onSelectCategory, currentCategory }) {
  const scrollRef = useRef(null);

  const categories = [
    {
      id: "workshop",
      name: "Light Manufacturing & Engineering Workshop",
      hindi: "लघु विनिर्माण व खराद वर्कशॉप",
      icon: <Wrench size={26} className="text-teal-600" />,
      costRange: "₹2,00,000 – ₹50,00,000",
      subsidy: "35% PMEGP Grant (Up to ₹17.5 Lakh)",
      scheme: "PMEGP Manufacturing",
      color: "rgba(19, 78, 74, 0.08)"
    },
    {
      id: "tailoring",
      name: "Tailoring, Boutique & Garment Unit",
      hindi: "सिलाई बुटीक व रेडीमेड वस्त्र निर्माण",
      icon: <Scissors size={26} className="text-orange-500" />,
      costRange: "₹50,000 – ₹10,00,000",
      subsidy: "₹15,000 Free Toolkit + 5% Interest",
      scheme: "PM-VishwaKarma / PMMY",
      color: "rgba(249, 115, 22, 0.08)"
    },
    {
      id: "dairy",
      name: "Dairy Processing & Agro-Enterprises",
      hindi: "डेयरी फार्मिंग व पशुपालन इकाई",
      icon: <Milk size={26} className="text-emerald-600" />,
      costRange: "₹1,00,000 – ₹20,00,000",
      subsidy: "Up to 35% Capital Subsidy + KCC",
      scheme: "PMEGP / NABARD",
      color: "rgba(16, 185, 129, 0.08)"
    },
    {
      id: "solar",
      name: "Solar Charging & Green Microgrid",
      hindi: "सोलर ऊर्जा सेवा व उपकरण केंद्र",
      icon: <SunMedium size={26} className="text-amber-500" />,
      costRange: "₹3,00,000 – ₹25,00,000",
      subsidy: "40% MNRE + PMEGP Capital Subsidy",
      scheme: "PMEGP / Green MSME",
      color: "rgba(245, 158, 11, 0.08)"
    },
    {
      id: "retail",
      name: "Kirana, Provisions & Micro Retail",
      hindi: "किराना दुकान व खुदरा व्यापार",
      icon: <ShoppingBag size={26} className="text-blue-500" />,
      costRange: "₹20,000 – ₹10,00,000",
      subsidy: "100% Collateral-Free Bank Credit",
      scheme: "PMMY Shishu/Kishore",
      color: "rgba(14, 165, 233, 0.08)"
    },
    {
      id: "artisan",
      name: "Carpentry, Masonry & Traditional Crafts",
      hindi: "बढ़ईगीरी, राजमिस्त्री व पारंपरिक शिल्प",
      icon: <Hammer size={26} className="text-purple-600" />,
      costRange: "₹10,000 – ₹3,00,000",
      subsidy: "₹15,000 Toolkit + ₹3L at 5%",
      scheme: "PM-VishwaKarma 18 Trades",
      color: "rgba(147, 51, 234, 0.08)"
    }
  ];

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles className="text-orange-500" size={18} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--brand-navy)' }}>
              Explore Supported Enterprise Sectors
            </h3>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--slate-600)' }}>
            1-Click selector: Pick your venture to automatically calculate capital requirements & subsidy caps.
          </p>
        </div>

        {/* Scroll Nav Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => scroll('left')}
            className="btn-outline"
            style={{ padding: '0.45rem', borderRadius: '50%', width: '36px', height: '36px' }}
            title="Scroll Left"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="btn-outline"
            style={{ padding: '0.45rem', borderRadius: '50%', width: '36px', height: '36px' }}
            title="Scroll Right"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div ref={scrollRef} className="gallery-scroll-container">
        {categories.map((item) => {
          const isSelected = currentCategory === item.name;

          return (
            <div
              key={item.id}
              className="gallery-card"
              onClick={() => onSelectCategory(item.name)}
              style={{
                background: isSelected ? 'rgba(255, 255, 255, 0.95)' : 'var(--glass-bg-primary)',
                borderColor: isSelected ? 'var(--accent-saffron)' : 'var(--glass-border)',
                borderWidth: isSelected ? '2px' : '1px',
                position: 'relative'
              }}
            >
              <div>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.85rem'
                }}>
                  {item.icon}
                </div>

                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--brand-navy)', lineHeight: 1.35, marginBottom: '0.35rem' }}>
                  {item.name}
                </h4>
                <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginBottom: '0.85rem' }}>
                  {item.hindi}
                </div>
              </div>

              <div>
                <div style={{
                  padding: '0.55rem 0.75rem',
                  background: 'rgba(16, 185, 129, 0.08)',
                  borderRadius: '8px',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  marginBottom: '0.75rem'
                }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--emerald-dark)', fontWeight: 600 }}>Government Grant</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--emerald-dark)' }}>{item.subsidy}</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-600)' }}>{item.costRange}</span>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: isSelected ? 'var(--accent-saffron)' : 'var(--brand-teal)'
                  }}>
                    {isSelected ? '✓ Selected' : 'Select Trade →'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
