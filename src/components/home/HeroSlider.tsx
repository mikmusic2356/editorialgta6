import React, { useState, useEffect, useRef } from 'react';
import { HeroBanner } from '../../types/cms';
import { MainCategorySlug } from '../../types';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, Play, Pause } from 'lucide-react';

interface HeroSliderProps {
  banners: HeroBanner[];
  onSelectArticle: (slug: string) => void;
  onSelectCategory: (category: MainCategorySlug) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({
  banners,
  onSelectArticle,
  onSelectCategory,
}) => {
  const activeBanners = banners.filter((b) => b.isActive).sort((a, b) => a.order - b.order);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const displayBanners = activeBanners.length > 0 ? activeBanners : [
    {
      id: 'fallback-1',
      title: 'Grand Theft Auto VI: Salto Generacional y Motor RAGE 9',
      subtitle: 'Análisis técnico exhaustivo sobre el desarrollo, iluminación volumétrica global y físicas dinámicas en Leonida.',
      badge: 'REPORTAJE CENTRAL EXCLUSIVO',
      imageUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&auto=format&fit=crop&q=85',
      ctaText: 'Leer Análisis Completo',
      ctaActionType: 'article' as const,
      ctaTarget: 'gta-6-al-detalle-todo-sobre-el-desarrollo-motor-rage-9-y-salto-generacional',
      order: 1,
      isActive: true,
      createdAt: '2026-09-29T10:00:00Z'
    }
  ];

  const currentBanner = displayBanners[currentIndex] || displayBanners[0];

  useEffect(() => {
    if (isAutoPlaying && displayBanners.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % displayBanners.length);
      }, 6000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying, displayBanners.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayBanners.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + displayBanners.length) % displayBanners.length);
  };

  const handleCtaClick = (banner: HeroBanner) => {
    const target = banner.ctaTarget?.trim() || '';
    if (!target) return;

    if (banner.ctaActionType === 'category') {
      onSelectCategory(target as MainCategorySlug);
      return;
    }

    if (target.startsWith('http://') || target.startsWith('https://')) {
      window.open(target, '_blank');
      return;
    }

    // Direct article or path
    onSelectArticle(target);
  };

  return (
    <section 
      aria-label="Portada Principal y Banners Hero"
      className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Full-width Image Background with Smooth Fade */}
      <div className="relative w-full min-h-[420px] sm:min-h-[500px] lg:min-h-[560px] flex items-end">
        {displayBanners.map((banner, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000"
                loading={idx === 0 ? 'eager' : 'lazy'}
                fetchPriority={idx === 0 ? 'high' : 'low'}
                decoding={idx === 0 ? 'sync' : 'async'}
              />
              {/* Radial and Linear Gradients for perfect readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080c14] via-[#080c14]/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#080c14]/90 via-[#080c14]/40 to-transparent" />
            </div>
          );
        })}

        {/* Content Overlay */}
        <div className="relative z-20 w-full p-6 sm:p-10 lg:p-14 max-w-4xl space-y-4">
          
          {/* Badge / Tagline */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-slate-950/85 backdrop-blur-md border border-[#ffc456]/40 text-[#ffc456] text-xs font-mono font-bold uppercase tracking-wider shadow-sm animate-in fade-in slide-in-from-bottom-2">
            <Sparkles className="w-3.5 h-3.5 text-[#ffc456]" />
            <span>{currentBanner.badge || 'PORTADA CENTRAL'}</span>
          </div>

          {/* Main Title in pure white */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white font-display tracking-tight leading-[1.08] [text-wrap:balance]">
            {currentBanner.title}
          </h1>

          {/* Subtitle in white */}
          {currentBanner.subtitle && (
            <p className="text-sm sm:text-base lg:text-lg text-white/90 max-w-2xl leading-relaxed font-light line-clamp-3">
              {currentBanner.subtitle}
            </p>
          )}

          {/* Customizable CTA Button */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => handleCtaClick(currentBanner)}
              className="px-6 py-3.5 rounded-xl bg-[#ff6486] hover:bg-[#ff6486]/90 text-white font-bold text-sm shadow-xl shadow-[#ff6486]/20 transition-transform transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2 font-display uppercase tracking-wide"
            >
              <span>{currentBanner.ctaText || 'Ver Más'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Slide Index indicator */}
            {displayBanners.length > 1 && (
              <span className="text-xs font-mono text-[#ffc456] font-bold">
                Banner {currentIndex + 1} de {displayBanners.length}
              </span>
            )}
          </div>

        </div>

        {/* Slide Navigation Arrows */}
        {displayBanners.length > 1 && (
          <div className="absolute right-6 bottom-8 z-30 flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-[#ff6486] text-white border border-slate-700 transition-colors cursor-pointer shadow-lg backdrop-blur-md"
              aria-label="Banner anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-[#ff6486] text-white border border-slate-700 transition-colors cursor-pointer shadow-lg backdrop-blur-md"
              aria-label="Banner siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Bottom Pagination Dots */}
        {displayBanners.length > 1 && (
          <div className="absolute left-6 bottom-4 sm:bottom-6 z-30 flex items-center gap-2">
            {displayBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-[width,background-color] duration-300 cursor-pointer ${
                  currentIndex === idx ? 'w-8 bg-[#ff6486]' : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
                aria-label={`Ir al banner ${idx + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
