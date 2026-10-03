import React, { useState } from 'react';
import { Article } from '../../types';
import { ArticleCard } from '../articles/ArticleCard';
import { AdSlot } from '../layout/AdSlot';
import { 
  Compass, 
  BookOpen, 
  Search, 
  ShieldAlert, 
  Sparkles, 
  Filter,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface GuidesHubProps {
  articles: Article[];
  onSelectArticle: (slug: string) => void;
}

export const GuidesHub: React.FC<GuidesHubProps> = ({
  articles,
  onSelectArticle,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [guideCategory, setGuideCategory] = useState<string>('all');
  const [guideSearch, setGuideSearch] = useState<string>('');

  const guidesAndManuals = articles.filter(a => 
    a.category === 'guias' || a.category === 'trucos-consejos'
  );

  const filteredGuides = guidesAndManuals.filter(item => {
    const matchesDifficulty = 
      selectedDifficulty === 'all' || item.difficulty === selectedDifficulty;
    const matchesCat = 
      guideCategory === 'all' || item.category === guideCategory;
    const matchesSearch = 
      !guideSearch.trim() || 
      item.title.toLowerCase().includes(guideSearch.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(guideSearch.toLowerCase());
    return matchesDifficulty && matchesCat && matchesSearch;
  });

  return (
    <div className="w-full space-y-10">
      {/* Guides Header Banner */}
      <div className="p-6 sm:p-10 rounded-2xl bg-linear-to-r from-cyan-950 via-slate-900 to-indigo-950 border border-cyan-500/30">
        <div className="max-w-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
            <Compass className="w-4 h-4" />
            <span>CENTRO ESTRATÉGICO DE LEONIDA</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display">
            Guías, Manuales y Tutoriales de GTA 6
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Estrategias de supervivencia en Vice City, manuales de balística, evasión policial de 6 estrellas, optimización de botines y resolución de misterios paso a paso.
          </p>
        </div>

        {/* Filter controls */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar en guías..."
              value={guideSearch}
              onChange={(e) => setGuideSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900/90 border border-slate-700/80 rounded-lg text-white placeholder-slate-400 focus:outline-hidden focus:border-cyan-400"
            />
          </div>

          {/* Difficulty filter buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-lg border border-slate-800 text-xs overflow-x-auto">
            {['all', 'Principiante', 'Intermedio', 'Avanzado'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedDifficulty(lvl)}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  selectedDifficulty === lvl
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {lvl === 'all' ? 'Todas las Dificultades' : lvl}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-lg border border-slate-800 text-xs overflow-x-auto">
            {[
              { label: 'Todo', value: 'all' },
              { label: 'Guías', value: 'guias' },
              { label: 'Manuales', value: 'manuales' },
              { label: 'Secretos', value: 'secretos' },
            ].map((t) => (
              <button
                key={t.value}
                onClick={() => setGuideCategory(t.value)}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  guideCategory === t.value
                    ? 'bg-indigo-500 text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>MOSTRANDO {filteredGuides.length} GUÍAS PUBLICADAS</span>
          <span>ACTUALIZADO PARA PS5 & XBOX SERIES X|S</span>
        </div>

        {filteredGuides.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-slate-900/30 border border-slate-800 space-y-2">
            <p className="text-slate-300 font-semibold">No se encontraron guías con los filtros seleccionados</p>
            <p className="text-xs text-slate-500">Prueba a restablecer la dificultad o el término de búsqueda.</p>
          </div>
        ) : (
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
        )}
      </div>

      {/* In-Between Content Ad Slot */}
      <AdSlot type="between-blocks" slotId="guides-hub-mid" />
    </div>
  );
};
