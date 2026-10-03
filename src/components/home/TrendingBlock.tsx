import React from 'react';
import { Article } from '../../types';
import { ArticleCard } from '../articles/ArticleCard';
import { TrendingUp } from 'lucide-react';

interface TrendingBlockProps {
  articles: Article[];
  onSelectArticle: (slug: string) => void;
}

export const TrendingBlock: React.FC<TrendingBlockProps> = ({
  articles,
  onSelectArticle,
}) => {
  const trendingFiltered = articles.filter(a => a.isTrending);
  const trendingArticles = (trendingFiltered.length >= 2 ? trendingFiltered : articles).slice(0, 4);

  return (
    <section aria-label="Bloque En Tendencia" className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#ff6486]/10 text-[#ff6486] border border-[#ff6486]/30">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#ff6486] font-bold">
              BLOQUE 02 · LO MÁS LEÍDO EN LEONIDA
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              En Tendencia
            </h2>
          </div>
        </div>
        <span className="text-xs font-mono text-[#ffc456] font-bold hidden sm:inline">
          ACTUALIZADO EN TIEMPO REAL
        </span>
      </div>

      {/* Grid of Trending Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trendingArticles.map((art, idx) => (
          <ArticleCard
            key={art.id}
            article={art}
            onSelectArticle={onSelectArticle}
            variant="trending"
            rankingNumber={idx + 1}
          />
        ))}
      </div>
    </section>
  );
};
