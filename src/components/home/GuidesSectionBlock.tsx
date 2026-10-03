import React, { useState } from 'react';
import { Article, MainCategorySlug } from '../../types';
import { ArticleCard } from '../articles/ArticleCard';
import { Compass, ArrowRight } from 'lucide-react';

interface GuidesSectionBlockProps {
  articles: Article[];
  onSelectArticle: (slug: string) => void;
  onSelectCategory: (category: MainCategorySlug) => void;
}

export const GuidesSectionBlock: React.FC<GuidesSectionBlockProps> = ({
  articles,
  onSelectArticle,
  onSelectCategory,
}) => {
  const [activeGuideFilter, setActiveGuideFilter] = useState<string>('all');

  const guideArticles = articles.filter(a => a.category === 'guias');
  
  const filteredGuides = guideArticles.filter(a => {
    if (activeGuideFilter === 'all') return true;
    return a.subcategorySlug === activeGuideFilter;
  });

  return (
    <section aria-label="Bloque de Guías Estratégicas" className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#ff6486] font-bold mb-1">
            <Compass className="w-4 h-4 text-[#ff6486]" />
            <span>BLOQUE 03 · TUTORIALES COMPLETOS PASO A PASO</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Guías de GTA 6
          </h2>
        </div>

        {/* Subcategory Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-lg border border-slate-800 text-xs overflow-x-auto">
          {[
            { label: 'Todas', slug: 'all' },
            { label: 'Principiantes', slug: 'principiantes' },
            { label: 'Misiones', slug: 'guias-misiones' },
            { label: 'Dinero Rápido', slug: 'dinero' },
            { label: 'Coleccionables', slug: 'coleccionables' },
          ].map((tab) => (
            <button
              key={tab.slug}
              onClick={() => setActiveGuideFilter(tab.slug)}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap font-medium cursor-pointer ${
                activeGuideFilter === tab.slug
                  ? 'bg-[#ff6486] text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGuides.map((guide) => (
          <ArticleCard
            key={guide.id}
            article={guide}
            onSelectArticle={onSelectArticle}
            variant="standard"
          />
        ))}
      </div>

      {/* View All CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <p className="text-xs text-white/90 font-light">
          ¿Buscas una misión específica? Consulta nuestro walkthrough completo indexado.
        </p>
        <button
          onClick={() => onSelectCategory('guias')}
          className="px-4 py-2 text-xs font-bold rounded-lg bg-[#ff6486] text-white hover:bg-[#ff6486]/90 shadow-md transition-colors w-fit cursor-pointer inline-flex items-center gap-2"
        >
          <span>Abrir Hub de Guías</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};
