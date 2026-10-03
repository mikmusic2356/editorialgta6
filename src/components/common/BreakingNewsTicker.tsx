import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { MainCategorySlug } from '../../types';
import { Sparkles, ArrowRight, Radio, Bell } from 'lucide-react';

interface BreakingNewsTickerProps {
  onSelectArticle?: (slug: string) => void;
  onSelectCategory?: (category: MainCategorySlug) => void;
  className?: string;
}

export const BreakingNewsTicker: React.FC<BreakingNewsTickerProps> = ({
  onSelectArticle,
  onSelectCategory,
  className = ''
}) => {
  const { breakingNews } = useCMS();
  const [isPaused, setIsPaused] = useState(false);

  const activeNews = breakingNews
    .filter((item) => item.isActive)
    .sort((a, b) => a.order - b.order);

  const displayItems = activeNews.length > 0 ? activeNews : [
    {
      id: 'default-1',
      text: 'Take-Two y Rockstar Games reiteran la ventana de lanzamiento de GTA VI para PlayStation 5 y Xbox Series X|S.',
      badge: 'OFICIAL',
      linkType: 'article' as const,
      linkTarget: 'gta-6-al-detalle-todo-sobre-el-desarrollo-motor-rage-9-y-salto-generacional',
      isActive: true,
      order: 1,
      createdAt: '2026-09-30T10:00:00Z'
    },
    {
      id: 'default-2',
      text: 'Análisis de físicas del motor RAGE 9: Simulación volumétrica del agua y deformación procedural.',
      badge: 'MOTOR GRÁFICO',
      linkType: 'article' as const,
      linkTarget: 'gta-6-al-detalle-todo-sobre-el-desarrollo-motor-rage-9-y-salto-generacional',
      isActive: true,
      order: 2,
      createdAt: '2026-09-30T11:00:00Z'
    },
    {
      id: 'default-3',
      text: 'Dossier de Inteligencia: Lucia Caminos y Jason Duval contarán con árboles tácticos independientes.',
      badge: 'PERSONAJES',
      linkType: 'category' as const,
      linkTarget: 'personajes',
      isActive: true,
      order: 3,
      createdAt: '2026-09-30T12:00:00Z'
    }
  ];

  const handleItemClick = (item: typeof displayItems[0]) => {
    if (item.linkType === 'article' && item.linkTarget && onSelectArticle) {
      onSelectArticle(item.linkTarget);
    } else if (item.linkType === 'category' && item.linkTarget && onSelectCategory) {
      onSelectCategory(item.linkTarget as MainCategorySlug);
    } else if (item.linkType === 'url' && item.linkTarget) {
      if (item.linkTarget.startsWith('http')) {
        window.open(item.linkTarget, '_blank', 'noopener,noreferrer');
      } else if (item.linkTarget.startsWith('/articulo/') && onSelectArticle) {
        onSelectArticle(item.linkTarget.replace('/articulo/', ''));
      } else if (onSelectArticle) {
        onSelectArticle(item.linkTarget);
      }
    }
  };

  return (
    <div 
      className={`w-full bg-slate-950 border-y border-slate-800/90 shadow-inner select-none ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex items-center gap-3 overflow-hidden">
        
        {/* Live Animated Badge (Circulo Rojo Tipo Live en Vivo) */}
        <div className="shrink-0 flex items-center gap-2 bg-slate-900/90 px-3 py-1 rounded-full border border-red-500/30 shadow-xs z-10">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)]"></span>
          </span>
          <span className="font-mono text-[10px] sm:text-xs font-black tracking-wider uppercase text-[#ff6486]">
            ÚLTIMA HORA
          </span>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-slate-700" />
          <span className="hidden sm:inline-block font-mono text-[9px] text-[#ffc456] uppercase font-bold tracking-widest">
            LIVE
          </span>
        </div>

        {/* Continuous Scrolling Queue Marquee with Start & End delimiters */}
        <div className="relative flex-1 overflow-hidden mask-linear-fade">
          <div 
            className={`flex items-center gap-6 whitespace-nowrap will-change-transform ${
              isPaused ? '' : 'animate-marquee'
            }`}
            style={{
              animationDuration: `${Math.max(25, displayItems.length * 12)}s`,
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite'
            }}
          >
            {/* Render items twice for infinite seamless scroll */}
            {[...displayItems, ...displayItems].map((item, idx) => (
              <React.Fragment key={`${item.id}-${idx}`}>
                
                {/* News Item pill */}
                <button
                  onClick={() => handleItemClick(item)}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-200 hover:text-white group transition-colors cursor-pointer py-0.5"
                  title="Hacer clic para ver la noticia"
                >
                  {/* Badge */}
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#ff6486]/15 text-[#ff6486] border border-[#ff6486]/30 uppercase group-hover:bg-[#ff6486] group-hover:text-white transition-colors">
                      {item.badge}
                    </span>
                  )}
                  
                  {/* Headline text */}
                  <span className="font-medium text-white group-hover:underline">
                    {item.text}
                  </span>

                  <ArrowRight className="w-3 h-3 text-[#ffc456] opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-0.5" />
                </button>

                {/* Clear Delimiter Icon Separator between news */}
                <span className="inline-flex items-center justify-center text-[#ffc456] px-2 opacity-80" aria-hidden="true">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ffc456] shadow-[0_0_6px_rgba(255,196,86,0.8)] inline-block mr-1.5" />
                  <span className="text-[11px] font-mono font-bold text-[#ffc456]">✦</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ffc456] shadow-[0_0_6px_rgba(255,196,86,0.8)] inline-block ml-1.5" />
                </span>

              </React.Fragment>
            ))}
          </div>
        </div>

        {/* City Temperature & Status Badge */}
        <div className="hidden lg:flex items-center gap-2 shrink-0 text-[11px] font-mono text-slate-400 pl-2 border-l border-slate-800">
          <span className="text-[#ffc456] font-bold">VICE CITY 28°C</span>
          <span>·</span>
          <span>COLA ACTIVA: {activeNews.length}</span>
        </div>

      </div>
    </div>
  );
};
