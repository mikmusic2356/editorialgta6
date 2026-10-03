import React, { useState } from 'react';
import { QuickTip, QUICK_TIPS_DATA } from '../../data/tips';
import { Sparkles, ShieldAlert, Crosshair, Car, Compass, Flame, ArrowRight, X } from 'lucide-react';
import { MainCategorySlug } from '../../types';

interface TipsTricksBlockProps {
  onSelectCategory: (category: MainCategorySlug) => void;
}

export const TipsTricksBlock: React.FC<TipsTricksBlockProps> = ({
  onSelectCategory,
}) => {
  const [selectedTip, setSelectedTip] = useState<QuickTip | null>(null);

  const getIcon = (name: string) => {
    switch (name) {
      case 'ShieldAlert': return ShieldAlert;
      case 'Crosshair': return Crosshair;
      case 'Car': return Car;
      case 'Compass': return Compass;
      case 'Flame': return Flame;
      default: return Sparkles;
    }
  };

  return (
    <section aria-label="Bloque de Trucos y Consejos" className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#ff6486] font-bold mb-1">
            <Sparkles className="w-4 h-4 text-[#ff6486]" />
            <span>BLOQUE 04 · TÉCNICAS RÁPIDAS Y DESCUBRIMIENTOS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Trucos y Consejos
          </h2>
          <p className="text-xs text-white/90 mt-1 font-light">
            Recomendaciones directas de combate, conducción, economía y supervivencia en Vice City.
          </p>
        </div>

        <button
          onClick={() => onSelectCategory('trucos-consejos')}
          className="px-4 py-2 rounded-lg bg-[#ff6486] hover:bg-[#ff6486]/90 text-white font-bold text-xs shadow-md transition-colors inline-flex items-center gap-1.5 font-mono whitespace-nowrap cursor-pointer"
        >
          <span>Ver todos los trucos ({QUICK_TIPS_DATA.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid of Quick Tips Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {QUICK_TIPS_DATA.slice(0, 6).map((tip) => {
          const Icon = getIcon(tip.iconName);
          return (
            <div
              key={tip.id}
              onClick={() => setSelectedTip(tip)}
              className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-[#ff6486]/50 hover:bg-slate-900/80 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-[#ffc456] font-bold">
                    <Icon className="w-3.5 h-3.5 text-[#ffc456]" />
                    <span>{tip.categoryLabel}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                    {tip.difficulty}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-[#ff6486] transition-colors line-clamp-2 leading-snug">
                  {tip.title}
                </h3>

                <p className="text-xs text-white/90 line-clamp-2 leading-relaxed font-light">
                  {tip.summary}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400 group-hover:text-[#ff6486] transition-colors">Ver técnica completa</span>
                <span className="text-[#ff6486]">→</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Tip Modal Detail if clicked */}
      {selectedTip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="text-xs font-mono uppercase tracking-wider text-[#ffc456] font-bold">
                {selectedTip.categoryLabel} · {selectedTip.difficulty}
              </div>
              <button 
                onClick={() => setSelectedTip(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-lg font-bold text-white font-display">
              {selectedTip.title}
            </h3>

            <p className="text-xs text-white/90 leading-relaxed font-light">
              {selectedTip.summary}
            </p>

            {selectedTip.stepsOrKeyAdvice && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="text-[10px] font-mono uppercase text-[#ff6486] font-bold">Consejo de ejecución:</div>
                <p className="text-xs text-white leading-relaxed">
                  {selectedTip.stepsOrKeyAdvice}
                </p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedTip(null)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#ff6486] hover:bg-[#ff6486]/90 rounded-lg cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
