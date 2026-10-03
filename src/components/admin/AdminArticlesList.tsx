import React, { useState, useMemo } from 'react';
import { useCMS } from '../../context/CMSContext';
import { CMSArticle, ArticleStatus } from '../../types/cms';
import { AdminSection } from './AdminLayout';
import { Pagination } from '../common/Pagination';
import { 
  Search, 
  PlusCircle, 
  Trash2, 
  RotateCcw, 
  Eye, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  ArrowUpDown,
  Calendar,
  Layers,
  Folder,
  FolderOpen,
  LayoutGrid,
  List,
  FolderKanban,
  Check,
  ChevronRight,
  Filter,
  User,
  Clock,
  ExternalLink
} from 'lucide-react';

interface AdminArticlesListProps {
  onNavigate: (section: AdminSection, articleId?: string) => void;
  onPreviewArticle: (article: CMSArticle) => void;
}

type ViewMode = 'grouped' | 'table' | 'grid';

export const AdminArticlesList: React.FC<AdminArticlesListProps> = ({ 
  onNavigate, 
  onPreviewArticle 
}) => {
  const { articles, categories, authors, deleteArticle, restoreArticle, updateArticle } = useCMS();
  
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [activeStatusTab, setActiveStatusTab] = useState<ArticleStatus | 'todos'>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'title' | 'updated'>('recent');
  
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  
  // Confirmation Modal State
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    type: 'single-trash' | 'single-permanent' | 'bulk-trash' | 'bulk-permanent' | 'empty-trash';
    articleId?: string;
    articleTitle?: string;
  }>({
    isOpen: false,
    type: 'single-trash'
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // When category filter changes, reset subcategory and page
  const handleCategoryFilterChange = (catSlug: string) => {
    setSelectedCategory(catSlug);
    setSelectedSubcategory('all');
    setCurrentPage(1);
    setSelectedArticles([]);
  };

  const handleSubcategoryFilterChange = (subSlug: string) => {
    setSelectedSubcategory(subSlug);
    setCurrentPage(1);
    setSelectedArticles([]);
  };

  // Get active subcategories list for category filter
  const currentCategorySubcategories = useMemo(() => {
    if (selectedCategory === 'all') return [];
    const found = categories.find(c => c.slug === selectedCategory);
    return found ? found.subcategories : [];
  }, [categories, selectedCategory]);

  // Unified Filter Logic
  const filteredArticles = useMemo(() => {
    return articles.filter(art => {
      // 1. Status Filter
      const matchesStatus = activeStatusTab === 'todos' 
        ? art.status !== 'papelera' 
        : art.status === activeStatusTab;

      if (!matchesStatus) return false;

      // 2. Category Filter
      if (selectedCategory !== 'all' && art.category !== selectedCategory) {
        return false;
      }

      // 3. Subcategory Filter
      if (selectedSubcategory !== 'all' && art.subcategorySlug !== selectedSubcategory) {
        return false;
      }

      // 4. Author Filter
      if (selectedAuthor !== 'all' && art.author?.name !== selectedAuthor) {
        return false;
      }

      // 5. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = art.title.toLowerCase().includes(q);
        const inExcerpt = (art.excerpt || '').toLowerCase().includes(q);
        const inAuthor = (art.author?.name || '').toLowerCase().includes(q);
        const inTags = (art.tags || []).some(t => t.toLowerCase().includes(q));
        const inSlug = (art.slug || '').toLowerCase().includes(q);
        if (!inTitle && !inExcerpt && !inAuthor && !inTags && !inSlug) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      }
      if (sortBy === 'updated') {
        return new Date(b.updatedAt || b.publishedAt).getTime() - new Date(a.updatedAt || a.publishedAt).getTime();
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [articles, activeStatusTab, selectedCategory, selectedSubcategory, selectedAuthor, searchQuery, sortBy]);

  // Paginated articles slice
  const totalItems = filteredArticles.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const effectiveCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (effectiveCurrentPage - 1) * itemsPerPage;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status: ArticleStatus) => {
    switch (status) {
      case 'publicado':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-950/70 border border-emerald-500/40 text-emerald-300">PUBLICADO</span>;
      case 'revision':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-950/70 border border-amber-500/40 text-amber-300">EN REVISIÓN</span>;
      case 'programado':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-blue-950/70 border border-blue-500/40 text-blue-300">PROGRAMADO</span>;
      case 'archivado':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-purple-950/70 border border-purple-500/40 text-purple-300">ARCHIVADO</span>;
      case 'papelera':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-red-950/70 border border-red-500/40 text-red-300">EN PAPELERA</span>;
      case 'borrador':
      default:
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-800 border border-slate-700 text-slate-300">BORRADOR</span>;
    }
  };

  const handleSelectAllOnPage = () => {
    const pageIds = paginatedArticles.map(a => a.id);
    const allPageSelected = pageIds.every(id => selectedArticles.includes(id));
    if (allPageSelected) {
      setSelectedArticles(prev => prev.filter(id => !pageIds.includes(id)));
    } else {
      setSelectedArticles(prev => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedArticles(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkMoveToTrash = () => {
    selectedArticles.forEach(id => deleteArticle(id, false));
    setSelectedArticles([]);
  };

  const handleBulkRestore = () => {
    selectedArticles.forEach(id => restoreArticle(id));
    setSelectedArticles([]);
  };

  const handleBulkPublish = () => {
    selectedArticles.forEach(id => updateArticle(id, { status: 'publicado' }));
    setSelectedArticles([]);
  };

  const handleExecuteDelete = () => {
    if (deleteModalState.type === 'single-permanent' && deleteModalState.articleId) {
      deleteArticle(deleteModalState.articleId, true);
      setSelectedArticles(prev => prev.filter(id => id !== deleteModalState.articleId));
    } else if (deleteModalState.type === 'single-trash' && deleteModalState.articleId) {
      deleteArticle(deleteModalState.articleId, false);
      setSelectedArticles(prev => prev.filter(id => id !== deleteModalState.articleId));
    } else if (deleteModalState.type === 'bulk-permanent') {
      selectedArticles.forEach(id => deleteArticle(id, true));
      setSelectedArticles([]);
    } else if (deleteModalState.type === 'bulk-trash') {
      selectedArticles.forEach(id => deleteArticle(id, false));
      setSelectedArticles([]);
    } else if (deleteModalState.type === 'empty-trash') {
      const trashArticles = articles.filter(a => a.status === 'papelera');
      trashArticles.forEach(a => deleteArticle(a.id, true));
      setSelectedArticles([]);
    }
    setDeleteModalState({ isOpen: false, type: 'single-trash' });
  };

  const isAllPageSelected = paginatedArticles.length > 0 && paginatedArticles.every(a => selectedArticles.includes(a.id));

  // Category counts
  const getCategoryCount = (catSlug: string) => {
    if (catSlug === 'all') return articles.filter(a => a.status !== 'papelera').length;
    return articles.filter(a => a.category === catSlug && a.status !== 'papelera').length;
  };

  const trashCount = articles.filter(a => a.status === 'papelera').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* 1. HEADER & PRIMARY ACTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#ff6486] font-bold">
            <FolderKanban className="w-4 h-4 text-[#ff6486]" />
            <span>ORGANIZADOR EDITORIAL DE CONTENIDOS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Artículos y Publicaciones
          </h1>
          <p className="text-xs text-slate-400">
            Explora por categorías, subtemas, autores y administra el ciclo de vida de cada artículo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('new-article')}
            className="px-4 py-2.5 rounded-xl bg-[#ff6486] hover:bg-[#ff6486]/90 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2 cursor-pointer w-fit"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Redactar Nuevo Artículo</span>
          </button>
        </div>
      </div>

      {/* 2. VISUAL CATEGORY SELECTOR SHELF (Solves category confusion) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#ffc456] uppercase font-bold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#ffc456]" />
            Filtrar por Categoría Principal:
          </span>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => handleCategoryFilterChange('all')}
              className="text-[11px] font-mono text-[#ff6486] hover:underline cursor-pointer"
            >
              Ver todas las categorías
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-2">
          <button
            onClick={() => handleCategoryFilterChange('all')}
            className={`p-2.5 rounded-xl text-left transition-all cursor-pointer border flex flex-col justify-between ${
              selectedCategory === 'all'
                ? 'bg-slate-900 border-[#ff6486] ring-1 ring-[#ff6486] shadow-md'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <FolderOpen className={`w-4 h-4 ${selectedCategory === 'all' ? 'text-[#ff6486]' : 'text-slate-400'}`} />
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                selectedCategory === 'all' ? 'bg-[#ff6486] text-white' : 'bg-slate-900 text-[#ffc456]'
              }`}>
                {getCategoryCount('all')}
              </span>
            </div>
            <div className={`text-xs font-bold mt-2 truncate ${selectedCategory === 'all' ? 'text-white' : 'text-slate-300'}`}>
              Todas
            </div>
          </button>

          {categories.map((cat) => {
            const count = getCategoryCount(cat.slug);
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => handleCategoryFilterChange(cat.slug)}
                className={`p-2.5 rounded-xl text-left transition-all cursor-pointer border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 border-[#ff6486] ring-1 ring-[#ff6486] shadow-md'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Folder className={`w-4 h-4 ${isSelected ? 'text-[#ff6486]' : 'text-[#ffc456]'}`} />
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                    isSelected ? 'bg-[#ff6486] text-white' : 'bg-slate-900 text-[#ffc456]'
                  }`}>
                    {count}
                  </span>
                </div>
                <div className={`text-xs font-bold mt-2 truncate ${isSelected ? 'text-white' : 'text-slate-300'}`} title={cat.name}>
                  {cat.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SUBCATEGORY FILTER CHIPS (When category is selected) */}
      {selectedCategory !== 'all' && currentCategorySubcategories.length > 0 && (
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center gap-2 animate-in fade-in">
          <span className="text-[11px] font-mono text-[#ffc456] uppercase font-bold mr-1">
            Subcategorías de {categories.find(c => c.slug === selectedCategory)?.name}:
          </span>
          <button
            onClick={() => handleSubcategoryFilterChange('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              selectedSubcategory === 'all'
                ? 'bg-[#ff6486] text-white font-bold'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Todas ({getCategoryCount(selectedCategory)})
          </button>
          {currentCategorySubcategories.map((sub) => {
            const subCount = articles.filter(a => a.category === selectedCategory && a.subcategorySlug === sub.slug && a.status !== 'papelera').length;
            const isSubSelected = selectedSubcategory === sub.slug;
            return (
              <button
                key={sub.slug}
                onClick={() => handleSubcategoryFilterChange(sub.slug)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isSubSelected
                    ? 'bg-[#ff6486] text-white font-bold'
                    : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                <span>{sub.name}</span>
                <span className={`text-[10px] font-mono px-1 rounded ${
                  isSubSelected ? 'bg-white/20 text-white' : 'bg-slate-900 text-[#ffc456]'
                }`}>
                  {subCount}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* 4. STATUS TABS NAVIGATION */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-2 overflow-x-auto">
        <div className="flex items-center gap-2">
          {[
            { key: 'todos' as const, label: 'Todos', count: articles.filter(a => a.status !== 'papelera').length },
            { key: 'publicado' as const, label: 'Publicados', count: articles.filter(a => a.status === 'publicado').length },
            { key: 'borrador' as const, label: 'Borradores', count: articles.filter(a => a.status === 'borrador').length },
            { key: 'revision' as const, label: 'En Revisión', count: articles.filter(a => a.status === 'revision').length },
            { key: 'programado' as const, label: 'Programados', count: articles.filter(a => a.status === 'programado').length },
            { key: 'archivado' as const, label: 'Archivados', count: articles.filter(a => a.status === 'archivado').length },
            { key: 'papelera' as const, label: 'Papelera', count: articles.filter(a => a.status === 'papelera').length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveStatusTab(tab.key);
                setCurrentPage(1);
                setSelectedArticles([]);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
                activeStatusTab === tab.key
                  ? 'bg-slate-800 text-[#ff6486] border border-slate-700 shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                activeStatusTab === tab.key ? 'bg-[#ff6486] text-white font-bold' : 'bg-slate-800 text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 shrink-0">
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer flex items-center gap-1 ${
              viewMode === 'table' ? 'bg-[#ff6486] text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="Vista de Tabla"
          >
            <List className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Tabla</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer flex items-center gap-1 ${
              viewMode === 'grid' ? 'bg-[#ff6486] text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="Vista de Cuadrícula / Tarjetas"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Tarjetas</span>
          </button>
          <button
            onClick={() => setViewMode('grouped')}
            className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer flex items-center gap-1 ${
              viewMode === 'grouped' ? 'bg-[#ff6486] text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="Vista por Carpetas Agrupadas"
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Agrupado</span>
          </button>
        </div>
      </div>

      {/* 5. SEARCH & MULTI-FILTER BAR */}
      <div className="flex flex-col gap-3 bg-slate-900/70 p-4 rounded-xl border border-slate-800">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por título, extracto, autor, slug o etiquetas..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#ff6486]"
            />
          </div>

          {/* Sort By & Clear Filters */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3 text-[#ff6486]" />
              <span>Orden:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-hidden focus:border-[#ff6486] font-mono cursor-pointer"
            >
              <option value="recent">Más recientes primero</option>
              <option value="oldest">Más antiguos primero</option>
              <option value="updated">Última actualización</option>
              <option value="title">Título (A-Z)</option>
            </select>

            {(searchQuery || selectedCategory !== 'all' || selectedAuthor !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedSubcategory('all');
                  setSelectedAuthor('all');
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition-colors cursor-pointer"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Author filter */}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-800/60 text-xs">
          <span className="font-mono text-slate-400 text-[11px]">Filtrar por Autor:</span>
          <select
            value={selectedAuthor}
            onChange={(e) => {
              setSelectedAuthor(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-hidden focus:border-[#ff6486] cursor-pointer"
          >
            <option value="all">Todos los Autores</option>
            {authors.map((auth) => (
              <option key={auth.id} value={auth.name}>{auth.name} ({auth.role})</option>
            ))}
          </select>
        </div>
      </div>

      {/* 6. BULK ACTIONS & TRASH MANAGEMENT */}
      {selectedArticles.length > 0 && (
        <div className="p-3 bg-slate-900 border border-[#ff6486]/30 rounded-xl flex flex-wrap items-center justify-between gap-4 animate-in fade-in">
          <span className="text-xs font-mono text-white font-bold">
            {selectedArticles.length} artículo(s) seleccionado(s)
          </span>
          <div className="flex items-center gap-2">
            {activeStatusTab === 'papelera' ? (
              <>
                <button
                  onClick={handleBulkRestore}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar Seleccionados</span>
                </button>
                <button
                  onClick={() => setDeleteModalState({
                    isOpen: true,
                    type: 'bulk-permanent'
                  })}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar Definitivamente ({selectedArticles.length})</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleBulkPublish}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
                >
                  Publicar
                </button>
                <button
                  onClick={() => setDeleteModalState({
                    isOpen: true,
                    type: 'bulk-trash'
                  })}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-red-950 text-red-300 hover:bg-red-900 border border-red-500/30 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Mover a Papelera</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Papelera Header Banner when in Trash view */}
      {activeStatusTab === 'papelera' && trashCount > 0 && (
        <div className="p-3.5 bg-red-950/40 border border-red-500/30 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-red-300 text-xs">
            <Trash2 className="w-4 h-4 text-red-400 shrink-0" />
            <span>Los artículos en la papelera no se muestran en el portal público. Puedes restaurarlos o eliminarlos definitivamente.</span>
          </div>
          <button
            onClick={() => setDeleteModalState({
              isOpen: true,
              type: 'empty-trash'
            })}
            className="px-3 py-1.5 rounded-lg bg-red-900/80 hover:bg-red-800 text-red-100 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Vaciar Papelera ({trashCount})</span>
          </button>
        </div>
      )}

      {/* 7. DISPLAY VIEWS */}

      {/* VIEW A: TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3.5 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={isAllPageSelected}
                      onChange={handleSelectAllOnPage}
                      className="rounded bg-slate-900 border-slate-700 text-[#ff6486] focus:ring-0 cursor-pointer"
                    />
                  </th>
                  <th className="p-3.5">Artículo</th>
                  <th className="p-3.5">Categoría & Subtema</th>
                  <th className="p-3.5">Estado</th>
                  <th className="p-3.5">Autor</th>
                  <th className="p-3.5">Fecha</th>
                  <th className="p-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {paginatedArticles.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-slate-500 space-y-2">
                      <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-400">No se encontraron artículos con los filtros aplicados.</p>
                      <p className="text-xs text-slate-500">Prueba a restablecer los filtros de categoría o búsqueda.</p>
                    </td>
                  </tr>
                ) : (
                  paginatedArticles.map((art) => {
                    const catObj = categories.find(c => c.slug === art.category);
                    const subObj = catObj?.subcategories.find(s => s.slug === art.subcategorySlug);
                    const isInTrash = art.status === 'papelera';

                    return (
                      <tr key={art.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={selectedArticles.includes(art.id)}
                            onChange={() => handleToggleSelect(art.id)}
                            className="rounded bg-slate-900 border-slate-700 text-[#ff6486] focus:ring-0 cursor-pointer"
                          />
                        </td>

                        {/* Title & Thumbnail */}
                        <td className="p-3.5 max-w-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden shrink-0">
                              <img
                                src={art.featuredImage?.url || 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=150&auto=format&fit=crop&q=80'}
                                alt={art.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0 space-y-0.5">
                              <div className="font-bold text-white hover:text-[#ff6486] cursor-pointer truncate" onClick={() => onNavigate('edit-article', art.id)}>
                                {art.title}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono truncate">
                                /{art.slug}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category & Subcategory Pills */}
                        <td className="p-3.5">
                          <div className="space-y-1">
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-950 border border-[#ffc456]/40 text-[#ffc456] text-[10px] font-mono font-bold uppercase">
                              <Folder className="w-3 h-3 text-[#ffc456]" />
                              <span>{catObj?.name || art.category}</span>
                            </div>
                            {subObj && (
                              <div className="text-[11px] text-[#ff6486] font-mono flex items-center gap-1 font-medium">
                                <ChevronRight className="w-3 h-3 text-slate-600" />
                                <span>{subObj.name}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="p-3.5">
                          {getStatusBadge(art.status)}
                        </td>

                        {/* Author */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <img
                              src={art.author?.avatar || '/images/Personajes/Brian_Heder_01.webp'}
                              alt={art.author?.name || 'Autor'}
                              className="w-6 h-6 rounded-full object-cover border border-slate-700"
                            />
                            <span className="text-white font-medium truncate max-w-[120px]">{art.author?.name || 'Redacción'}</span>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="p-3.5 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                          {new Date(art.publishedAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isInTrash ? (
                              <>
                                <button
                                  onClick={() => restoreArticle(art.id)}
                                  className="p-1.5 text-emerald-400 hover:text-white hover:bg-emerald-600 rounded-lg transition-colors cursor-pointer"
                                  title="Restaurar a borrador"
                                >
                                  <RotateCcw className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setDeleteModalState({
                                    isOpen: true,
                                    type: 'single-permanent',
                                    articleId: art.id,
                                    articleTitle: art.title
                                  })}
                                  className="p-1.5 text-red-400 hover:text-white hover:bg-red-600 rounded-lg transition-colors cursor-pointer"
                                  title="Eliminar definitivamente"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => onNavigate('edit-article', art.id)}
                                  className="p-1.5 text-slate-300 hover:text-white hover:bg-[#ff6486] rounded-lg transition-colors cursor-pointer"
                                  title="Editar artículo"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => onPreviewArticle(art)}
                                  className="p-1.5 text-slate-300 hover:text-[#ffc456] hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                  title="Ver en Portal"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setDeleteModalState({
                                    isOpen: true,
                                    type: 'single-trash',
                                    articleId: art.id,
                                    articleTitle: art.title
                                  })}
                                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                  title="Mover a papelera"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW B: GRID / CARDS VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedArticles.map((art) => {
            const catObj = categories.find(c => c.slug === art.category);
            const subObj = catObj?.subcategories.find(s => s.slug === art.subcategorySlug);
            const isInTrash = art.status === 'papelera';

            return (
              <div
                key={art.id}
                className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-[#ff6486]/50 transition-all shadow-sm group"
              >
                <div>
                  <div className="relative aspect-16/9 overflow-hidden bg-slate-950">
                    <img
                      src={art.featuredImage?.url || 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&auto=format&fit=crop&q=80'}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      <span className="px-2 py-0.5 rounded bg-slate-950/90 text-[#ffc456] text-[10px] font-mono font-bold uppercase border border-slate-700">
                        {catObj?.name || art.category}
                      </span>
                      {subObj && (
                        <span className="px-2 py-0.5 rounded bg-[#ff6486]/90 text-white text-[9px] font-mono font-bold">
                          {subObj.name}
                        </span>
                      )}
                    </div>
                    <div className="absolute top-2 right-2">
                      {getStatusBadge(art.status)}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                      <span>{new Date(art.publishedAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      <span>·</span>
                      <span className="text-[#ffc456]">{art.author?.name || 'Redacción'}</span>
                    </div>

                    <h3 
                      onClick={() => onNavigate('edit-article', art.id)}
                      className="text-sm font-bold text-white group-hover:text-[#ff6486] transition-colors line-clamp-2 cursor-pointer"
                    >
                      {art.title}
                    </h3>

                    <p className="text-xs text-slate-300 line-clamp-2 font-light">
                      {art.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-800/60 mt-3 pt-3">
                  <span className="text-[11px] font-mono text-slate-400">
                    {art.readTimeMinutes} min de lectura
                  </span>

                  <div className="flex items-center gap-2">
                    {isInTrash ? (
                      <>
                        <button
                          onClick={() => restoreArticle(art.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-500/30 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                          title="Restaurar"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Restaurar</span>
                        </button>
                        <button
                          onClick={() => setDeleteModalState({
                            isOpen: true,
                            type: 'single-permanent',
                            articleId: art.id,
                            articleTitle: art.title
                          })}
                          className="p-1.5 rounded-lg bg-red-950 text-red-400 hover:bg-red-900 border border-red-500/30 transition-colors cursor-pointer"
                          title="Eliminar definitivamente"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => onPreviewArticle(art)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                          title="Previsualizar"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onNavigate('edit-article', art.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#ff6486] hover:bg-[#ff6486]/90 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => setDeleteModalState({
                            isOpen: true,
                            type: 'single-trash',
                            articleId: art.id,
                            articleTitle: art.title
                          })}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                          title="Mover a papelera"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW C: GROUPED BY CATEGORY VIEW (Solves clutter completely) */}
      {viewMode === 'grouped' && (
        <div className="space-y-6">
          {categories.map((cat) => {
            const catArticles = articles.filter(a => a.category === cat.slug && (activeStatusTab === 'todos' ? a.status !== 'papelera' : a.status === activeStatusTab));
            if (catArticles.length === 0 && selectedCategory !== 'all') return null;

            return (
              <div key={cat.slug} className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden space-y-3 p-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#ff6486]/20 border border-[#ff6486]/30 flex items-center justify-center text-[#ff6486] font-bold">
                      <Folder className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white font-display">
                        {cat.name}
                      </h2>
                      <div className="text-[11px] text-slate-400">{cat.shortDesc}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-slate-950 border border-[#ffc456]/40 text-[#ffc456] text-xs font-mono font-bold">
                      {catArticles.length} artículos
                    </span>
                  </div>
                </div>

                {catArticles.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No hay artículos en esta categoría para el estado seleccionado.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                    {catArticles.map((art) => {
                      const subObj = cat.subcategories.find(s => s.slug === art.subcategorySlug);
                      const isInTrash = art.status === 'papelera';
                      return (
                        <div
                          key={art.id}
                          className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-[#ff6486]/60 transition-all flex items-start justify-between gap-3 group"
                        >
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono text-[#ffc456] font-bold uppercase truncate">
                                {subObj?.name || 'General'}
                              </span>
                              {getStatusBadge(art.status)}
                            </div>
                            <h4 
                              onClick={() => onNavigate('edit-article', art.id)}
                              className="text-xs font-bold text-white group-hover:text-[#ff6486] transition-colors line-clamp-2 cursor-pointer"
                            >
                              {art.title}
                            </h4>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {art.author.name} · {new Date(art.publishedAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0 mt-1">
                            {isInTrash ? (
                              <>
                                <button
                                  onClick={() => restoreArticle(art.id)}
                                  className="p-1.5 text-emerald-400 hover:text-white hover:bg-emerald-600 rounded-lg transition-colors cursor-pointer"
                                  title="Restaurar"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setDeleteModalState({
                                    isOpen: true,
                                    type: 'single-permanent',
                                    articleId: art.id,
                                    articleTitle: art.title
                                  })}
                                  className="p-1.5 text-red-400 hover:text-white hover:bg-red-600 rounded-lg transition-colors cursor-pointer"
                                  title="Eliminar definitivamente"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => onNavigate('edit-article', art.id)}
                                  className="p-1.5 text-slate-400 hover:text-white hover:bg-[#ff6486] rounded-lg transition-colors cursor-pointer"
                                  title="Editar"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setDeleteModalState({
                                    isOpen: true,
                                    type: 'single-trash',
                                    articleId: art.id,
                                    articleTitle: art.title
                                  })}
                                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                  title="Mover a papelera"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 8. PAGINATION BAR */}
      {viewMode !== 'grouped' && (
        <Pagination
          currentPage={effectiveCurrentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(newSize) => {
            setItemsPerPage(newSize);
            setCurrentPage(1);
          }}
          itemsPerPageOptions={[10, 20, 50]}
        />
      )}

      {/* 9. MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
      {deleteModalState.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 relative animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                deleteModalState.type === 'single-permanent' || deleteModalState.type === 'bulk-permanent' || deleteModalState.type === 'empty-trash'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-base font-bold text-white font-display">
                  {deleteModalState.type === 'single-permanent' && '¿Eliminar artículo definitivamente?'}
                  {deleteModalState.type === 'single-trash' && '¿Mover artículo a la papelera?'}
                  {deleteModalState.type === 'bulk-permanent' && '¿Eliminar permanentemente los seleccionados?'}
                  {deleteModalState.type === 'bulk-trash' && '¿Mover seleccionados a la papelera?'}
                  {deleteModalState.type === 'empty-trash' && '¿Vaciar toda la papelera?'}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {deleteModalState.type === 'single-permanent' && (
                    <>
                      Estás a punto de borrar definitivamente el artículo <strong className="text-white">"{deleteModalState.articleTitle}"</strong>. Esta acción <span className="text-red-400 font-semibold">no se puede deshacer</span> y se eliminará de la base de datos permanentemente.
                    </>
                  )}
                  {deleteModalState.type === 'single-trash' && (
                    <>
                      El artículo <strong className="text-white">"{deleteModalState.articleTitle}"</strong> se moverá a la papelera y dejará de ser visible en el portal público. Podrás restaurarlo más tarde si lo deseas.
                    </>
                  )}
                  {deleteModalState.type === 'bulk-permanent' && (
                    <>
                      Se eliminarán de forma <span className="text-red-400 font-semibold">irreversible</span> los <strong className="text-white">{selectedArticles.length}</strong> artículos seleccionados.
                    </>
                  )}
                  {deleteModalState.type === 'bulk-trash' && (
                    <>
                      Se moverán a la papelera los <strong className="text-white">{selectedArticles.length}</strong> artículos seleccionados.
                    </>
                  )}
                  {deleteModalState.type === 'empty-trash' && (
                    <>
                      Se eliminarán de forma permanente todos los <strong className="text-white">{trashCount}</strong> artículos de la papelera. Esta acción es <span className="text-red-400 font-semibold">definitiva</span>.
                    </>
                  )}
                </p>
              </div>
            </div>

            {(deleteModalState.type === 'single-permanent' || deleteModalState.type === 'bulk-permanent' || deleteModalState.type === 'empty-trash') && (
              <div className="p-3 rounded-lg bg-red-950/50 border border-red-500/30 flex items-center gap-2 text-red-300 text-[11px]">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>Advertencia: Los datos no podrán ser recuperados tras confirmar.</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalState({ isOpen: false, type: 'single-trash' })}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-colors cursor-pointer flex items-center gap-1.5 ${
                  deleteModalState.type === 'single-permanent' || deleteModalState.type === 'bulk-permanent' || deleteModalState.type === 'empty-trash'
                    ? 'bg-red-600 hover:bg-red-500 shadow-lg shadow-red-900/30'
                    : 'bg-[#ff6486] hover:bg-[#ff6486]/90'
                }`}
              >
                <Trash2 className="w-4 h-4" />
                <span>
                  {deleteModalState.type === 'single-permanent' || deleteModalState.type === 'bulk-permanent' || deleteModalState.type === 'empty-trash'
                    ? 'Sí, Eliminar Definitivamente'
                    : 'Sí, Mover a Papelera'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
