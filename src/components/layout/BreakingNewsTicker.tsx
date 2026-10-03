import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { BreakingNewsItem } from '../../types/cms';
import { MainCategorySlug } from '../../types';
import { Zap, ChevronRight, ExternalLink } from 'lucide-react';

interface BreakingNewsTickerProps {
  onSelectArticle?: (slug: string) => void;
  onSelectCategory?: (category: MainCategorySlug) => void;
}

export const BreakingNewsTicker: React.FC<BreakingNewsTickerProps> = ({
  onSelectArticle,
  onSelectCategory,
}) => {
  const { breakingNews } = useCMS();
  const [isPaused, setIsPaused] = useState(false);

  const activeNews = breakingNews
    .filter((item) => item.isActive)
    .sort((a, b) => a.order - b.order);

  if (activeNews.length === 0) return null;

  const handleNewsClick = (item: BreakingNewsItem) => {
    if (!item.linkTarget) return;

    if (item.linkType === 'category' && onSelectCategory) {
      onSelectCategory(item.linkTarget as MainCategorySlug);
    } else if (item.linkType === 'article' && onSelectArticle) {
      onSelectArticle(item.linkTarget);
    } else if (item.linkTarget.startsWith('/')) {
      if (item.linkTarget.startsWith('/articulo/') && onSelectArticle) {
        onSelectArticle(item.linkTarget.replace('/articulo/', ''));
      } else if (onSelectCategory) {
        onSelectCategory(item.linkTarget.replace('/', '') as MainCategorySlug);
      }
    } else if (onSelectArticle) {
      onSelectArticle(item.linkTarget);
    }
  };

  // Duplicate items for infinite seamless looping ticker
  const tickerItems = [...activeNews, ...activeNews, ...activeNews];

  return (
    <div 
      className="w-full bg-slate-950 border-b border-slate-800/90 py-2 px-4 text-xs overflow-hidden select-none z-30"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        
        {/* Animated LIVE Red Circle Indicator & Label */}
        <div className="flex items-center gap-2 shrink-0 bg-slate-900/90 px-3 py-1 rounded-lg border border-slate-800 shadow-xs z-10">
          {/* Animated Red Pulse Circle */}
          <span className="relative flex h-2.5 w-2.5 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 duration-1000" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600 shadow-[0_0_8px_rgba(239,68,68,1)]" />
          </span>

          <span className="font-mono text-[10px] tracking-wider uppercase text-[#ff6486] font-extrabold flex items-center gap-1">
            <span>ÚLTIMA HORA</span>
          </span>
        </div>

        {/* Rolling / Ticker Queue */}
        <div className="relative flex-1 overflow-hidden">
          <div 
            className="flex items-center gap-6 whitespace-nowrap will-change-transform"
            style={{
              animation: `marquee ${Math.max(25, activeNews.length * 15)}s linear infinite`,
              animationPlayState: isPaused ? 'paused' : 'running'
            }}
          >
            {tickerItems.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                onClick={() => handleNewsClick(item)}
                className={`inline-flex items-center gap-2.5 transition-colors cursor-pointer group ${
                  item.linkTarget ? 'hover:text-[#ff6486]' : ''
                }`}
              >
                {/* Separator Icon at beginning of each news */}
                <span className="text-[#ffc456] text-xs font-bold shrink-0 flex items-center gap-1">
                  <span>⚡</span>
                </span>

                {/* Badge if present */}
                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded bg-slate-900 border border-[#ffc456]/40 text-[#ffc456] text-[9px] font-mono font-bold uppercase">
                    {item.badge}
                  </span>
                )}

                {/* News text in white */}
                <span className="text-white text-xs font-medium group-hover:text-[#ff6486] transition-colors">
                  {item.text}
                </span>

                {/* Link arrow indicator if clickable */}
                {item.linkTarget && (
                  <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-[#ff6486] transition-colors shrink-0" />
                )}

                {/* End separator icon */}
                <span className="text-[#ffc456] text-xs font-bold shrink-0 ml-2">
                  <span>✦</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Station Weather & City Tag */}
        <div className="hidden lg:flex items-center gap-2 shrink-0 text-[11px] font-mono text-[#ffc456] pl-2 border-l border-slate-800">
          <span>VICE CITY 28°C</span>
          <span>·</span>
          <span className="text-white font-medium">LEONIDA LIVE</span>
        </div>

      </div>

      {/* Marquee Keyframes Injected Inline for Bulletproof Animation */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};
