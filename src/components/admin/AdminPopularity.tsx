import React, { useState, useMemo } from 'react';
import { useCMS } from '../../context/CMSContext';
import { CMSArticle } from '../../types/cms';
import { AdminSection } from './AdminLayout';
import { 
  Heart, 
  Share2, 
  Eye, 
  Flame, 
  TrendingUp, 
  Search, 
  ExternalLink, 
  Edit3, 
  Award, 
  Sparkles, 
  BarChart3, 
  ArrowUpDown, 
  RefreshCw,
  CheckCircle2,
  Sliders,
  X,
  Plus,
  ShieldCheck,
  CheckSquare,
  Square,
  RotateCcw
} from 'lucide-react';

interface AdminPopularityProps {
  onNavigate: (section: AdminSection, articleId?: string) => void;
  onPreviewArticle?: (article: CMSArticle) => void;
}

type SortField = 'likes' | 'shares' | 'views' | 'engagement' | 'date';

export const AdminPopularity: React.FC<AdminPopularityProps> = ({
  onNavigate,
  onPreviewArticle
}) => {
  const { 
    articles, 
    categories, 
    setArticleMetrics, 
    boostArticleMetrics, 
    bulkBoostMetrics, 
    resetArticleMetrics 
  } = useCMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'top-likes' | 'top-shares' | 'top-views'>('all');
  const [sortBy, setSortBy] = useState<SortField>('likes');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Multi-selection state for batch inflation / reset
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [batchBoostModalOpen, setBatchBoostModalOpen] = useState(false);
  const [batchLikes, setBatchLikes] = useState(25);
  const [batchShares, setBatchShares] = useState(10);
  const [batchViews, setBatchViews] = useState(200);

  // Single article metric edit modal
  const [editingArticle, setEditingArticle] = useState<CMSArticle | null>(null);
  const [inputLikes, setInputLikes] = useState<number>(0);
  const [inputShares, setInputShares] = useState<number>(0);
  const [inputViews, setInputViews] = useState<number>(0);

  // Toast message
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Open modal helper
  const handleOpenEditModal = (art: CMSArticle) => {
    setEditingArticle(art);
    setInputLikes(art.likes ?? 0);
    setInputShares(art.shares ?? 0);
    setInputViews(art.views ?? 0);
  };

  const handleSaveModalMetrics = () => {
    if (!editingArticle) return;
    setArticleMetrics(editingArticle.id, {
      likes: Math.max(0, inputLikes),
      shares: Math.max(0, inputShares),
      views: Math.max(0, inputViews)
    });
    triggerToast(`Métricas actualizadas para "${editingArticle.title.slice(0, 30)}..."`);
    setEditingArticle(null);
  };

  const handleApplyBatchBoost = () => {
    if (selectedIds.length === 0) return;
    bulkBoostMetrics(selectedIds, {
      likes: batchLikes,
      shares: batchShares,
      views: batchViews
    });
    triggerToast(`Impulso de +${batchLikes} Likes, +${batchShares} Shares y +${batchViews} Vistas aplicado a ${selectedIds.length} artículos.`);
    setBatchBoostModalOpen(false);
  };

  const handleResetSelected = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`¿Estás seguro de restablecer las métricas a 0 para ${selectedIds.length} artículos seleccionados?`)) {
      resetArticleMetrics(selectedIds);
      triggerToast(`Métricas restablecidas a 0 para ${selectedIds.length} artículos.`);
      setSelectedIds([]);
    }
  };

  // Calculate Global Aggregate Stats
  const globalMetrics = useMemo(() => {
    let totalLikes = 0;
    let totalShares = 0;
    let totalViews = 0;

    articles.forEach(a => {
      totalLikes += (a.likes || 0);
      totalShares += (a.shares || 0);
      totalViews += (a.views || 0);
    });

    const totalInteractions = totalLikes + totalShares;
    const avgEngagement = totalViews > 0 
      ? ((totalInteractions / totalViews) * 100).toFixed(1) 
      : '0.0';

    let mostViral: CMSArticle | null = null;
    let maxScore = -1;

    articles.forEach(a => {
      const score = (a.likes || 0) * 2 + (a.shares || 0) * 3 + (a.views || 0) * 0.1;
      if (score > maxScore) {
        maxScore = score;
        mostViral = a;
      }
    });

    return {
      totalArticles: articles.length,
      totalLikes,
      totalShares,
      totalViews,
      avgEngagement,
      mostViral
    };
  }, [articles]);

  // Filter & Sort Articles
  const rankedArticles = useMemo(() => {
    return articles
      .filter(art => {
        if (art.status === 'papelera') return false;
        if (selectedCategory !== 'all' && art.category !== selectedCategory) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const inTitle = art.title.toLowerCase().includes(q);
          const inSlug = art.slug.toLowerCase().includes(q);
          const inAuthor = (art.author?.name || '').toLowerCase().includes(q);
          if (!inTitle && !inSlug && !inAuthor) return false;
        }
        return true;
      })
      .map(art => {
        const likes = art.likes || 0;
        const shares = art.shares || 0;
        const views = art.views || 0;
        const interactions = likes + shares;
        const engagementRate = views > 0 ? (interactions / views) * 100 : 0;
        return {
          ...art,
          likes,
          shares,
          views,
          interactions,
          engagementRate
        };
      })
      .sort((a, b) => {
        let fieldA = 0;
        let fieldB = 0;

        if (sortBy === 'likes') {
          fieldA = a.likes;
          fieldB = b.likes;
        } else if (sortBy === 'shares') {
          fieldA = a.shares;
          fieldB = b.shares;
        } else if (sortBy === 'views') {
          fieldA = a.views;
          fieldB = b.views;
        } else if (sortBy === 'engagement') {
          fieldA = a.engagementRate;
          fieldB = b.engagementRate;
        } else if (sortBy === 'date') {
          fieldA = new Date(a.publishedAt || 0).getTime();
          fieldB = new Date(b.publishedAt || 0).getTime();
        }

        return sortOrder === 'desc' ? fieldB - fieldA : fieldA - fieldB;
      });
  }, [articles, selectedCategory, searchQuery, sortBy, sortOrder]);

  // Top 3 Podium
  const topPodium = useMemo(() => {
    return [...rankedArticles].slice(0, 3);
  }, [rankedArticles]);

  const handleSortChange = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === rankedArticles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(rankedArticles.map(a => a.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-slate-900 border border-emerald-500/60 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs text-white animate-fade-in font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. HEADER & ADMIN NOTICE */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold uppercase border border-rose-500/30">
                AUDITORÍA & IMPULSO DE ENGAGEMENT
              </span>
              <span className="text-xs font-mono text-[#ffc456] font-bold">
                KAIROSION ANALYTICS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight mt-1 flex items-center gap-2">
              <Flame className="w-7 h-7 text-rose-500 fill-current" />
              <span>Popularidad, Likes & Compartidos de Blogs</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Supervisa las reacciones y personaliza o impulsa las métricas editoriales de los artículos a tu criterio.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => onNavigate('articles')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold font-mono transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-700"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#ff6486]" />
              <span>Gestionar Artículos</span>
            </button>
          </div>
        </div>

        {/* Security & Authenticity Explanatory Notice */}
        <div className="p-4 rounded-xl bg-linear-to-r from-rose-950/40 via-slate-900/60 to-slate-900/40 border border-rose-500/30 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>Control Exclusivo de Administrador: Confianza y Transparencia con el Lector</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PROTEGIDO
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed font-light">
              Los espectadores públicos en la web únicamente pueden dar <strong>1 Me Gusta real (+1)</strong> mediante el botón de corazón, sin alteraciones automáticas. Como Administrador, tú dispones del control total para <strong>ajustar, inflar o restablecer a 0</strong> las métricas de Likes, Compartidos y Vistas en cualquier momento mediante las herramientas de este panel.
            </p>
          </div>
        </div>
      </div>

      {/* 2. GLOBAL ENGAGEMENT KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Likes */}
        <div className="p-5 rounded-2xl bg-linear-to-br from-rose-950/40 via-slate-900/80 to-slate-900/40 border border-rose-500/30 space-y-2 relative overflow-hidden shadow-lg group hover:border-rose-500/60 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-rose-400 font-bold">Total Me Gusta (❤️)</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400">
              <Heart className="w-4 h-4 fill-current" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-display">
            {globalMetrics.totalLikes.toLocaleString()}
          </div>
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <span>Promedio:</span>
            <strong className="text-rose-300 font-bold">
              {(globalMetrics.totalLikes / Math.max(1, globalMetrics.totalArticles)).toFixed(1)} likes / blog
            </strong>
          </div>
        </div>

        {/* Total Shares */}
        <div className="p-5 rounded-2xl bg-linear-to-br from-cyan-950/40 via-slate-900/80 to-slate-900/40 border border-cyan-500/30 space-y-2 relative overflow-hidden shadow-lg group hover:border-cyan-500/60 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-cyan-400 font-bold">Total Compartidos (📤)</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Share2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-display">
            {globalMetrics.totalShares.toLocaleString()}
          </div>
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <span>Difusión:</span>
            <strong className="text-cyan-300 font-bold">WhatsApp, X, Facebook, Telegram</strong>
          </div>
        </div>

        {/* Total Views */}
        <div className="p-5 rounded-2xl bg-linear-to-br from-amber-950/40 via-slate-900/80 to-slate-900/40 border border-amber-500/30 space-y-2 relative overflow-hidden shadow-lg group hover:border-amber-500/60 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#ffc456] font-bold">Total Lecturas & Vistas</span>
            <div className="w-8 h-8 rounded-xl bg-[#ffc456]/20 flex items-center justify-center text-[#ffc456]">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-display">
            {globalMetrics.totalViews.toLocaleString()}
          </div>
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <span>En {globalMetrics.totalArticles} reportajes activos</span>
          </div>
        </div>

        {/* Engagement Rate */}
        <div className="p-5 rounded-2xl bg-linear-to-br from-emerald-950/40 via-slate-900/80 to-slate-900/40 border border-emerald-500/30 space-y-2 relative overflow-hidden shadow-lg group hover:border-emerald-500/60 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-emerald-400 font-bold">Tasa de Engagement</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-display">
            {globalMetrics.avgEngagement}%
          </div>
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <span>Ratio de interactividad por lector</span>
          </div>
        </div>

      </div>

      {/* 3. PODIUM DE HONOR: TOP 3 BLOGS MÁS VIRALES */}
      {topPodium.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#ffc456] font-bold">
              <Award className="w-4 h-4 text-[#ffc456]" />
              <span>Podio de Honor · Artículos con Mayor Impacto</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">Actualizado en vivo</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topPodium.map((art, idx) => {
              const medals = ['🥇 #1 TOP VIRAL', '🥈 #2 DESTACADO', '🥉 #3 POPULAR'];
              const borderColors = [
                'border-amber-500/60 bg-linear-to-b from-amber-950/30 to-slate-900/90',
                'border-slate-500/60 bg-linear-to-b from-slate-800/30 to-slate-900/90',
                'border-orange-500/60 bg-linear-to-b from-orange-950/30 to-slate-900/90'
              ];

              return (
                <div 
                  key={art.id}
                  className={`p-5 rounded-2xl border-2 ${borderColors[idx] || 'border-slate-800'} space-y-4 shadow-xl flex flex-col justify-between`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-slate-950 border border-slate-700 text-[#ffc456]">
                        {medals[idx]}
                      </span>
                      <span className="text-xs font-mono text-rose-400 font-bold uppercase">
                        {art.categoryLabel}
                      </span>
                    </div>

                    <div className="aspect-16/9 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                      <img
                        src={art.featuredImage?.url}
                        alt={art.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug font-display">
                      {art.title}
                    </h3>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-800">
                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                      <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                        <div className="text-rose-400 font-bold flex items-center justify-center gap-1">
                          <Heart className="w-3 h-3 fill-current" />
                          <span>{art.likes}</span>
                        </div>
                        <div className="text-[9px] text-slate-400 uppercase">Likes</div>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                        <div className="text-cyan-400 font-bold flex items-center justify-center gap-1">
                          <Share2 className="w-3 h-3" />
                          <span>{art.shares}</span>
                        </div>
                        <div className="text-[9px] text-slate-400 uppercase">Shares</div>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                        <div className="text-[#ffc456] font-bold flex items-center justify-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{art.views}</span>
                        </div>
                        <div className="text-[9px] text-slate-400 uppercase">Vistas</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(art)}
                        className="flex-1 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-200 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                        title="Ajustar o inflar likes/shares para este artículo"
                      >
                        <Sliders className="w-3 h-3 text-rose-400" />
                        <span>Ajustar Métricas</span>
                      </button>
                      <button
                        onClick={() => onNavigate('edit-article', art.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 cursor-pointer"
                        title="Editar contenido del artículo"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          const targetCat = art.category || 'gta-6';
                          const sub = art.subcategorySlug && art.subcategorySlug !== 'all' ? `/${art.subcategorySlug}` : '';
                          const viewUrl = targetCat === 'gta-6' ? `/gta-6${sub}/${art.slug}` : `/gta-6/${targetCat}${sub}/${art.slug}`;
                          window.open(viewUrl, '_blank');
                        }}
                        className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
                        title="Ver en Portal Público"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. FILTERS & SEARCH CONTROLS */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Quick Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all' as const, label: 'Todos los Artículos', icon: BarChart3 },
              { id: 'top-likes' as const, label: 'Más Gustados (❤️)', icon: Heart, sort: 'likes' as SortField },
              { id: 'top-shares' as const, label: 'Más Compartidos (📤)', icon: Share2, sort: 'shares' as SortField },
              { id: 'top-views' as const, label: 'Más Vistos (👁️)', icon: Eye, sort: 'views' as SortField }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.sort) {
                    setSortBy(tab.sort);
                    setSortOrder('desc');
                  }
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#ff6486] text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por título o autor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-hidden focus:border-[#ff6486]"
            />
          </div>

        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-800/80">
          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold shrink-0">Categoría:</span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors shrink-0 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-800 text-white font-bold border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Todas ({articles.length})
          </button>
          {categories.map(cat => {
            const count = articles.filter(a => a.category === cat.slug).length;
            return (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors shrink-0 cursor-pointer ${
                  selectedCategory === cat.slug
                    ? 'bg-rose-950 border border-rose-500/50 text-rose-300 font-bold'
                    : 'text-slate-400 hover:text-white bg-slate-950/60'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. MULTI-SELECTION BATCH ACTIONS BAR */}
      {selectedIds.length > 0 && (
        <div className="sticky top-4 z-30 p-4 rounded-2xl bg-linear-to-r from-rose-900 via-slate-900 to-indigo-900 border-2 border-rose-500/60 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-2.5 text-xs text-white font-mono">
            <span className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center font-bold text-slate-950">
              {selectedIds.length}
            </span>
            <span className="font-bold">Artículos seleccionados para acción en lote</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setBatchBoostModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold font-mono transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Impulsar Lote (+Likes / +Shares)</span>
            </button>

            <button
              onClick={handleResetSelected}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-red-950 hover:border-red-500/50 border border-slate-700 text-slate-300 hover:text-red-300 text-xs font-bold font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer a 0</span>
            </button>

            <button
              onClick={() => setSelectedIds([])}
              className="p-1.5 text-slate-400 hover:text-white cursor-pointer"
              title="Deseleccionar todos"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 6. FULL RANKING TABLE WITH METRICS CONTROLS */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleSelectAll}
              className="text-slate-400 hover:text-white cursor-pointer flex items-center gap-1.5 text-xs font-mono"
            >
              {selectedIds.length > 0 && selectedIds.length === rankedArticles.length ? (
                <CheckSquare className="w-4 h-4 text-rose-400" />
              ) : (
                <Square className="w-4 h-4 text-slate-600" />
              )}
              <span>{selectedIds.length === rankedArticles.length ? 'Deseleccionar' : 'Seleccionar Todo'}</span>
            </button>
            <span className="text-xs font-mono uppercase text-white font-bold">
              Tabla de Métricas & Control Editorial ({rankedArticles.length} artículos)
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Haz clic en los encabezados para ordenar
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/90 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
              <tr>
                <th className="p-3.5 w-10 text-center">Sel.</th>
                <th className="p-3.5 w-12 text-center">#</th>
                <th className="p-3.5">Artículo & Categoría</th>
                <th className="p-3.5">Autor</th>
                <th 
                  onClick={() => handleSortChange('likes')}
                  className="p-3.5 text-center cursor-pointer hover:text-rose-400 transition-colors"
                >
                  <div className="inline-flex items-center gap-1">
                    <Heart className="w-3 h-3 text-rose-400 fill-current" />
                    <span>Likes</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSortChange('shares')}
                  className="p-3.5 text-center cursor-pointer hover:text-cyan-400 transition-colors"
                >
                  <div className="inline-flex items-center gap-1">
                    <Share2 className="w-3 h-3 text-cyan-400" />
                    <span>Shares</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSortChange('views')}
                  className="p-3.5 text-center cursor-pointer hover:text-[#ffc456] transition-colors"
                >
                  <div className="inline-flex items-center gap-1">
                    <Eye className="w-3 h-3 text-[#ffc456]" />
                    <span>Vistas</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSortChange('engagement')}
                  className="p-3.5 text-center cursor-pointer hover:text-emerald-400 transition-colors"
                >
                  <div className="inline-flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    <span>Engagement</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3.5 text-right">Ajuste & Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {rankedArticles.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-slate-500 space-y-2">
                    <BarChart3 className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-sm font-semibold text-slate-400">No se encontraron artículos para los filtros aplicados.</p>
                  </td>
                </tr>
              ) : (
                rankedArticles.map((art, rIdx) => {
                  const isSelected = selectedIds.includes(art.id);
                  return (
                    <tr 
                      key={art.id} 
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isSelected ? 'bg-rose-950/20' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleSelectOne(art.id)}
                          className="text-slate-400 hover:text-white cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-rose-400" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-600" />
                          )}
                        </button>
                      </td>

                      {/* Rank Index */}
                      <td className="p-3.5 text-center font-mono font-bold text-slate-500">
                        {rIdx + 1}
                      </td>

                      {/* Title & Thumbnail */}
                      <td className="p-3.5 max-w-md">
                        <div className="flex items-center gap-3">
                          <img
                            src={art.featuredImage?.url}
                            alt={art.title}
                            className="w-12 h-12 rounded-lg object-cover bg-slate-950 border border-slate-800 shrink-0"
                          />
                          <div className="min-w-0 space-y-1">
                            <div className="font-bold text-white truncate text-xs hover:text-[#ff6486] transition-colors">
                              {art.title}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                              <span className="px-1.5 py-0.2 rounded bg-slate-950 border border-slate-800 text-[#ffc456] font-bold">
                                {art.categoryLabel}
                              </span>
                              <span>/{art.slug}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Author */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <img
                            src={art.author?.avatar || '/images/Personajes/Brian_Heder_01.webp'}
                            alt={art.author?.name || 'Autor'}
                            className="w-6 h-6 rounded-full object-cover border border-slate-700"
                          />
                          <span className="text-white font-medium text-xs truncate max-w-[120px]">
                            {art.author?.name || 'Redacción'}
                          </span>
                        </div>
                      </td>

                      {/* Likes Counter */}
                      <td className="p-3.5 text-center font-mono font-bold text-rose-400">
                        <span className="px-2.5 py-1 rounded-lg bg-rose-950/40 border border-rose-500/30 inline-block">
                          ❤️ {art.likes}
                        </span>
                      </td>

                      {/* Shares Counter */}
                      <td className="p-3.5 text-center font-mono font-bold text-cyan-400">
                        <span className="px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/30 inline-block">
                          📤 {art.shares}
                        </span>
                      </td>

                      {/* Views Counter */}
                      <td className="p-3.5 text-center font-mono text-slate-300">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 inline-block">
                          👁️ {art.views}
                        </span>
                      </td>

                      {/* Engagement Rate */}
                      <td className="p-3.5 text-center font-mono font-bold text-emerald-400">
                        <div className="inline-flex items-center gap-1">
                          <span>{art.engagementRate.toFixed(1)}%</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* Modificar / Inflar Métricas (Admin) */}
                          <button
                            onClick={() => handleOpenEditModal(art)}
                            className="px-2.5 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-1"
                            title="Ajustar o inflar métricas (Solo Admin)"
                          >
                            <Sliders className="w-3.5 h-3.5 text-rose-400" />
                            <span>Ajustar</span>
                          </button>

                          {/* Editar Blog */}
                          <button
                            onClick={() => onNavigate('edit-article', art.id)}
                            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors cursor-pointer"
                            title="Editar artículo completo"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Ver en Portal */}
                          <button
                            onClick={() => {
                              const targetCat = art.category || 'gta-6';
                              const sub = art.subcategorySlug && art.subcategorySlug !== 'all' ? `/${art.subcategorySlug}` : '';
                              const viewUrl = targetCat === 'gta-6' ? `/gta-6${sub}/${art.slug}` : `/gta-6/${targetCat}${sub}/${art.slug}`;
                              window.open(viewUrl, '_blank');
                            }}
                            className="p-1.5 text-slate-400 hover:text-[#ffc456] hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors cursor-pointer"
                            title="Ver en Portal Público"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
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

      {/* MODAL 1: INDIVIDUAL ARTICLE METRIC ADJUSTER */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border-2 border-rose-500/40 rounded-2xl shadow-2xl p-6 space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-rose-400" />
                <h3 className="text-base font-bold text-white font-display">
                  Ajustar / Inflar Métricas del Artículo
                </h3>
              </div>
              <button
                onClick={() => setEditingArticle(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Article preview */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
              <img
                src={editingArticle.featuredImage?.url}
                alt={editingArticle.title}
                className="w-12 h-12 rounded-lg object-cover bg-slate-900 shrink-0"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-white line-clamp-1">{editingArticle.title}</div>
                <div className="text-[10px] font-mono text-slate-400">/{editingArticle.slug}</div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Ingresa los valores exactos o pulsa los botones de impulso rápido. Estos números se sincronizarán directamente en el portal.
            </p>

            {/* Inputs */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-mono uppercase text-rose-400 font-bold block mb-1">
                  Likes (❤️)
                </label>
                <input
                  type="number"
                  min="0"
                  value={inputLikes}
                  onChange={(e) => setInputLikes(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 bg-slate-950 border border-rose-500/40 rounded-xl text-center text-sm font-bold font-mono text-white focus:outline-hidden focus:border-rose-400"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-cyan-400 font-bold block mb-1">
                  Shares (📤)
                </label>
                <input
                  type="number"
                  min="0"
                  value={inputShares}
                  onChange={(e) => setInputShares(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 bg-slate-950 border border-cyan-500/40 rounded-xl text-center text-sm font-bold font-mono text-white focus:outline-hidden focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-[#ffc456] font-bold block mb-1">
                  Vistas (👁️)
                </label>
                <input
                  type="number"
                  min="0"
                  value={inputViews}
                  onChange={(e) => setInputViews(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 bg-slate-950 border border-[#ffc456]/40 rounded-xl text-center text-sm font-bold font-mono text-white focus:outline-hidden focus:border-[#ffc456]"
                />
              </div>
            </div>

            {/* Fast boost presets */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                Atajos de Impulso Rápido:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setInputLikes(prev => prev + 25)}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 cursor-pointer"
                >
                  +25 Likes
                </button>
                <button
                  type="button"
                  onClick={() => setInputLikes(prev => prev + 100)}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 cursor-pointer"
                >
                  +100 Likes
                </button>
                <button
                  type="button"
                  onClick={() => setInputShares(prev => prev + 20)}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 cursor-pointer"
                >
                  +20 Shares
                </button>
                <button
                  type="button"
                  onClick={() => setInputViews(prev => prev + 250)}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono bg-amber-950/60 hover:bg-amber-900 border border-amber-500/40 text-amber-300 cursor-pointer"
                >
                  +250 Vistas
                </button>
                <button
                  type="button"
                  onClick={() => { setInputLikes(0); setInputShares(0); setInputViews(0); }}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white cursor-pointer ml-auto"
                >
                  Limpiar a 0
                </button>
              </div>
            </div>

            {/* Modal actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingArticle(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold font-mono transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveModalMetrics}
                className="px-5 py-2 rounded-xl bg-linear-to-r from-rose-600 to-pink-600 hover:opacity-90 text-white text-xs font-bold font-mono transition-all cursor-pointer shadow-lg"
              >
                Guardar Métricas
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: BATCH BOOST MODAL */}
      {batchBoostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border-2 border-indigo-500/40 rounded-2xl shadow-2xl p-6 space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white font-display">
                  Impulsar Lote de {selectedIds.length} Artículos
                </h3>
              </div>
              <button
                onClick={() => setBatchBoostModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Define la cantidad de Likes, Compartidos y Vistas que deseas <strong>sumar en bloque</strong> a los {selectedIds.length} artículos seleccionados:
            </p>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-mono uppercase text-rose-400 font-bold block mb-1">
                  + Likes
                </label>
                <input
                  type="number"
                  min="0"
                  value={batchLikes}
                  onChange={(e) => setBatchLikes(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 bg-slate-950 border border-rose-500/40 rounded-xl text-center text-sm font-bold font-mono text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-cyan-400 font-bold block mb-1">
                  + Shares
                </label>
                <input
                  type="number"
                  min="0"
                  value={batchShares}
                  onChange={(e) => setBatchShares(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 bg-slate-950 border border-cyan-500/40 rounded-xl text-center text-sm font-bold font-mono text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-[#ffc456] font-bold block mb-1">
                  + Vistas
                </label>
                <input
                  type="number"
                  min="0"
                  value={batchViews}
                  onChange={(e) => setBatchViews(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 bg-slate-950 border border-[#ffc456]/40 rounded-xl text-center text-sm font-bold font-mono text-white focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setBatchBoostModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold font-mono transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleApplyBatchBoost}
                className="px-5 py-2 rounded-xl bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-90 text-white text-xs font-bold font-mono transition-all cursor-pointer shadow-lg"
              >
                Aplicar Impulso Masivo
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
