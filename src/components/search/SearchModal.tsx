import React, { useState, useEffect, useRef } from 'react';
import { Article } from '../../types';
import { Search, X, ChevronRight, Clock, BookOpen, Newspaper } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  onSelectArticle: (slug: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  articles,
  onSelectArticle,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = !query.trim()
    ? articles.slice(0, 4)
    : articles.filter((a) => {
        const q = query.toLowerCase();
        return (
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.categoryLabel.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
        );
      });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/80">
          <Search className="w-5 h-5 text-[#ffc456] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar noticias, guías, mapa de Leonida, vehículos, armas o personajes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-white placeholder-slate-400 text-sm focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs font-mono text-[#ffc456] bg-slate-800 rounded hover:text-white cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#ff6486] font-bold px-2 mb-2">
            {!query.trim() ? 'Artículos sugeridos' : `Resultados (${results.length})`}
          </div>

          {results.length === 0 ? (
            <div className="p-8 text-center text-sm text-white">
              No se encontraron artículos para "{query}". Prueba con "Vice City", "Lucia", "Armas" o "Policía".
            </div>
          ) : (
            results.map((art) => (
              <button
                key={art.id}
                onClick={() => {
                  onSelectArticle(art.slug);
                  onClose();
                }}
                className="w-full text-left p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-[#ff6486]/50 transition-all flex items-center justify-between gap-3 group cursor-pointer"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-[#ffc456] font-bold">
                    <span>{art.categoryLabel}</span>
                    <span>·</span>
                    <span className="text-slate-400">{art.readTimeMinutes} min de lectura</span>
                  </div>
                  <div className="text-sm font-semibold text-white group-hover:text-[#ff6486] truncate">
                    {art.title}
                  </div>
                  <div className="text-xs text-white/90 line-clamp-1 font-light">
                    {art.excerpt}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-[#ff6486] group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            ))
          )}
        </div>

        {/* Search Modal Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] font-mono text-[#ffc456] flex items-center justify-between px-4 font-bold">
          <span>Navega con ↵ Enter para seleccionar</span>
          <span>KAIROSION Search Engine</span>
        </div>
      </div>
    </div>
  );
};
