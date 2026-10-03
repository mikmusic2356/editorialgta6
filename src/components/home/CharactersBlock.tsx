import React from 'react';
import { CHARACTERS_DATA } from '../../data/characters';
import { Users, ArrowRight } from 'lucide-react';
import { MainCategorySlug, CharacterProfile } from '../../types';

interface CharactersBlockProps {
  onSelectCharacter: (char: CharacterProfile) => void;
  onSelectCategory: (category: MainCategorySlug) => void;
}

export const CharactersBlock: React.FC<CharactersBlockProps> = ({
  onSelectCharacter,
  onSelectCategory,
}) => {
  return (
    <section aria-label="Bloque de Personajes" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#ff6486] font-bold mb-1">
            <Users className="w-4 h-4 text-[#ff6486]" />
            <span>BLOQUE 05 · EXPEDIENTES & BIOGRAFÍAS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Personajes de GTA 6
          </h2>
          <p className="text-xs text-white/90 mt-1 font-light">
            Dossiers interactivos, galería de fotos, biografía, historia y artículos vinculados de Leonida.
          </p>
        </div>

        <button
          onClick={() => onSelectCategory('personajes')}
          className="px-4 py-2 rounded-lg bg-[#ff6486] hover:bg-[#ff6486]/90 text-white font-bold text-xs shadow-md transition-colors inline-flex items-center gap-1.5 font-mono whitespace-nowrap cursor-pointer"
        >
          <span>Ver catálogo de personajes</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid of Character Cards with Cover Photos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CHARACTERS_DATA.slice(0, 2).map((char) => (
          <div
            key={char.id}
            onClick={() => onSelectCharacter(char)}
            className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-slate-800 hover:border-[#ff6486]/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
          >
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-slate-700 bg-slate-950">
                  <img
                    src={char.mainImage}
                    alt={char.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#ffc456] font-bold px-2 py-0.5 rounded bg-slate-950 border border-[#ffc456]/40 truncate">
                      {char.imageBadge}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold shrink-0">
                      ✓ {char.status}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#ff6486] transition-colors font-display">
                    {char.name}
                  </h3>
                  <div className="text-xs text-[#ffc456] font-mono truncate">{char.role} · {char.alias}</div>
                </div>
              </div>

              <p className="text-xs text-white/90 line-clamp-3 leading-relaxed font-light">
                {char.bio}
              </p>

              {/* Skills Preview */}
              {(char.skills && char.skills.length > 0) && (
                <div className="space-y-1.5 pt-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Habilidades tácticas destacadas:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {char.skills.slice(0, 3).map((s, i) => (
                      <span key={i} className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-white">
                        {s.name} ({s.level}%)
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-[#ff6486] font-bold group-hover:translate-x-0.5 transition-transform">
              <span>Abrir expediente táctico y galería</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
