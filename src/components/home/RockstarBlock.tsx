import React from 'react';
import { Article, MainCategorySlug } from '../../types';
import { ArticleCard } from '../articles/ArticleCard';
import { Shield, ArrowRight } from 'lucide-react';

interface RockstarBlockProps {
  articles: Article[];
  onSelectArticle: (slug: string) => void;
  onSelectCategory: (category: MainCategorySlug) => void;
}

export const RockstarBlock: React.FC<RockstarBlockProps> = ({
  articles,
  onSelectArticle,
  onSelectCategory,
}) => {
  const rockstarArticles = articles.filter(a => a.category === 'rockstar-games');

  return (
    <section aria-label="Bloque Rockstar Games" className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#ff6486] font-bold mb-1">
            <Shield className="w-4 h-4 text-[#ff6486]" />
            <span>BLOQUE 07 · INFORMACIÓN CORPORATIVA & DESARROLLO</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Rockstar Games & Take-Two
          </h2>
          <p className="text-xs text-white/90 mt-1 font-light">
            Anuncios oficiales, patentes del motor RAGE 9, conferencias de accionistas y desarrollo.
          </p>
        </div>

        <button
          onClick={() => onSelectCategory('rockstar-games')}
          className="px-4 py-2 rounded-lg bg-[#ff6486] hover:bg-[#ff6486]/90 text-white font-bold text-xs shadow-md transition-colors inline-flex items-center gap-1.5 font-mono whitespace-nowrap cursor-pointer"
        >
          <span>Ver archivo de Rockstar</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid of Rockstar Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rockstarArticles.map((art) => (
          <ArticleCard
            key={art.id}
            article={art}
            onSelectArticle={onSelectArticle}
            variant="standard"
          />
        ))}
      </div>
    </section>
  );
};
