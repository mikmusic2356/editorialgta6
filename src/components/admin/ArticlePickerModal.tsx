import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { Article } from '../../types';
import { ARTICLES } from '../../data/articles';
import { 
  Search, 
  X, 
  Check, 
  FileText, 
  Sparkles, 
  Eye, 
  ExternalLink, 
  Tag, 
  Calendar,
  Layers,
  CheckCircle2
} from 'lucide-react';

interface ArticlePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArticle: (article: Article, autoFillBanner?: boolean) => void;
  title?: string;
  selectedSlug?: string;
}

export const ArticlePickerModal: React.FC<ArticlePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectArticle,
  title = 'Seleccionar Artículo de la Base de Datos',
  selectedSlug
}) => {
  const { articles: cmsArticles, categories } = useCMS();
  const allArticles = cmsArticles && cmsArticles.length > 0 ? cmsArticles : ARTICLES;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  // Filter published articles
  const publishedArticles = allArticles.filter(a => a.status === 'publicado' || a.status === 'programado' || !a.status);

  const filteredArticles = publishedArticles.filter(article => {
    const matchesSearch = 
      !searchQuery.trim() ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.excerpt && article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
      article.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = 
      selectedCategory === 'all' || 
      article.category === selectedCategory ||
      article.subcategorySlug === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#ff6486]/20 text-[#ff6486] border border-[#ff6486]/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">
                {title}
              </h2>
              <p className="text-xs text-slate-400">
                Elige cualquier artículo publicado para enlazarlo directamente con el botón de acción del Banner
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 bg-slate-950/70 border-b border-slate-800 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar artículos por título, palabra clave, slug o etiquetas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#ff6486]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Categories Horizontal Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-lg text-[11px] font-mono font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#ff6486] text-white shadow-xs'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Todos ({publishedArticles.length})
            </button>
            {categories.map((cat) => {
              const count = publishedArticles.filter(a => a.category === cat.slug).length;
              return (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-mono font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat.slug
                      ? 'bg-[#ffc456] text-slate-950 shadow-xs'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Articles List Grid */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredArticles.length === 0 ? (
            <div className="py-16 text-center text-slate-500 space-y-2">
              <FileText className="w-10 h-10 mx-auto opacity-30 text-slate-400" />
              <p className="text-sm font-bold text-slate-400">No se encontraron artículos con esos filtros</p>
              <p className="text-xs text-slate-500">Prueba ajustando la búsqueda o seleccionando otra categoría</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredArticles.map((art) => {
                const isSelected = selectedSlug === art.slug;
                const coverImage = art.featuredImage?.url || '/images/Artes_y_Ediciones/Official_Cover_Art_landscape.webp';

                return (
                  <div
                    key={art.id}
                    className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'bg-slate-800/90 border-[#ff6486] shadow-lg shadow-[#ff6486]/10 ring-1 ring-[#ff6486]'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex gap-3 items-start">
                      {/* Thumbnail */}
                      <div className="w-24 h-18 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-800 relative">
                        <img
                          src={coverImage}
                          alt={art.title}
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-[#ff6486]/40 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-white drop-shadow-md" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-[#ffc456] font-bold uppercase">
                            {art.categoryLabel || art.category}
                          </span>
                          {art.verificationType && (
                            <span className="text-[9px] font-mono text-emerald-400">
                              ✓ {art.verificationType}
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug font-display">
                          {art.title}
                        </h4>

                        <div className="text-[10px] font-mono text-slate-400 truncate">
                          slug: /{art.slug}
                        </div>
                      </div>
                    </div>

                    {/* Excerpt */}
                    {art.excerpt && (
                      <p className="text-[11px] text-slate-400 line-clamp-2 font-light">
                        {art.excerpt}
                      </p>
                    )}

                    {/* Selection Action Buttons */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectArticle(art, true);
                          onClose();
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-[#ffc456] hover:text-slate-950 text-[#ffc456] text-[10px] font-mono font-bold transition-colors cursor-pointer flex items-center gap-1"
                        title="Rellena el título, subtítulo, distintivo, imagen y enlace del banner con este artículo"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Auto-rellenar Banner</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onSelectArticle(art, false);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#ff6486] hover:bg-[#ff6486]/90 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ml-auto shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isSelected ? 'Seleccionado' : 'Asignar Enlace'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Mostrando <strong className="text-white">{filteredArticles.length}</strong> de {publishedArticles.length} artículos
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
