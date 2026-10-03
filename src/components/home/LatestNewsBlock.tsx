import React, { useState } from 'react';
import { Article, MainCategorySlug } from '../../types';
import { ArticleCard } from '../articles/ArticleCard';
import { Flame, ArrowRight } from 'lucide-react';

interface LatestNewsBlockProps {
  articles: Article[];
  onSelectArticle: (slug: string) => void;
  onSelectCategory: (category: MainCategorySlug) => void;
}

export const LatestNewsBlock: React.FC<LatestNewsBlockProps> = ({
  articles,
  onSelectArticle,
  onSelectCategory,
}) => {
  const [activeSubFilter, setActiveSubFilter] = useState<string>('all');

  const filteredList = articles.filter(a => {
    if (activeSubFilter === 'all') return true;
    if (a.category === activeSubFilter) return true;
    if (a.subcategorySlug === activeSubFilter) return true;
    return false;
  });

  const heroArticle = filteredList[0] || articles[0];
  const secondaryNews = filteredList.filter(a => a.id !== heroArticle?.id).slice(0, 3);

  return (
    <section aria-label="Bloque de Últimas Noticias y Actualidad" className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#ff6486] font-bold mb-1">
            <Flame className="w-4 h-4 animate-pulse text-[#ff6486]" />
            <span>BLOQUE 01 · LO MÁS RECIENTE EN KAIROSION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Últimas Noticias & Publicaciones
          </h2>
        </div>

        {/* Category & Subcategory Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-lg border border-slate-800 text-xs overflow-x-auto">
          {[
            { label: 'Todo lo Reciente', slug: 'all' },
            { label: 'GTA 6', slug: 'gta-6' },
            { label: 'Noticias', slug: 'noticias' },
            { label: 'Guías', slug: 'guias' },
            { label: 'Rockstar Games', slug: 'rockstar-games' },
            { label: 'Trucos', slug: 'trucos-consejos' },
          ].map((tab) => (
            <button
              key={tab.slug}
              onClick={() => setActiveSubFilter(tab.slug)}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap font-medium cursor-pointer ${
                activeSubFilter === tab.slug
                  ? 'bg-[#ff6486] text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Hero News Story */}
      {heroArticle && (
        <ArticleCard
          article={heroArticle}
          onSelectArticle={onSelectArticle}
          variant="featured"
        />
      )}

      {/* Secondary Recent News Grid */}
      {secondaryNews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {secondaryNews.map((item) => (
            <ArticleCard
              key={item.id}
              article={item}
              onSelectArticle={onSelectArticle}
              variant="standard"
            />
          ))}
        </div>
      )}

      {/* View All CTA Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => onSelectCategory(activeSubFilter !== 'all' ? (activeSubFilter as MainCategorySlug) : 'noticias')}
          className="px-4 py-2 rounded-lg bg-[#ff6486] hover:bg-[#ff6486]/90 text-white font-bold text-xs shadow-md inline-flex items-center gap-2 cursor-pointer font-mono transition-colors"
        >
          <span>Ver archivo completo {activeSubFilter !== 'all' ? `de ${activeSubFilter}` : 'de Noticias'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};
