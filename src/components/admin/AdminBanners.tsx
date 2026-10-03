import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { HeroBanner } from '../../types/cms';
import { Article } from '../../types';
import { MediaPickerModal } from './MediaPickerModal';
import { ArticlePickerModal } from './ArticlePickerModal';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  Image as ImageIcon, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Sparkles,
  Layers,
  Sliders,
  Check,
  Search,
  FileText,
  ExternalLink,
  CheckCircle2,
  X,
  Save,
  Link2
} from 'lucide-react';

export const AdminBanners: React.FC = () => {
  const { banners, addBanner, updateBanner, deleteBanner, reorderBanners, articles, categories } = useCMS();

  // Media Picker Modal State
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<'create' | 'edit' | null>(null);

  // Article Picker Modal State
  const [articlePickerOpen, setArticlePickerOpen] = useState(false);
  const [articlePickerTarget, setArticlePickerTarget] = useState<'create' | 'edit' | null>(null);

  // Feedback toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Create Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [badge, setBadge] = useState('REPORTAJE CENTRAL');
  const [imageUrl, setImageUrl] = useState('/images/Artes_y_Ediciones/Official_Cover_Art_landscape.webp');
  const [ctaText, setCtaText] = useState('Leer Análisis Completo');
  const [ctaActionType, setCtaActionType] = useState<'article' | 'category' | 'url'>('article');
  const [ctaTarget, setCtaTarget] = useState('gta-6-al-detalle-todo-sobre-el-desarrollo-motor-rage-9-y-salto-generacional');

  // Edit Form State
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Find article info helper
  const getLinkedArticle = (slugOrTarget: string) => {
    if (!slugOrTarget) return null;
    const clean = slugOrTarget.replace(/^https?:\/\/[^\/]+/, '').replace(/^\/gta-6\//, '').replace(/^\/categoria\//, '').replace(/^\/articulo\//, '').replace(/\/$/, '');
    const parts = clean.split('/');
    const targetSlug = parts[parts.length - 1];
    return articles.find(a => a.slug.toLowerCase() === slugOrTarget.toLowerCase() || a.slug.toLowerCase() === targetSlug.toLowerCase() || a.id === slugOrTarget);
  };

  const handleCreateBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      alert('Por favor ingresa un título y una imagen para el banner.');
      return;
    }

    const newBanner = addBanner({
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      badge: badge.trim() || undefined,
      imageUrl: imageUrl.trim(),
      ctaText: ctaText.trim() || 'Leer Más',
      ctaActionType,
      ctaTarget: ctaTarget.trim() || (articles[0]?.slug || 'gta-6-al-detalle-todo-sobre-el-desarrollo-motor-rage-9-y-salto-generacional'),
      order: banners.length + 1,
      isActive: true
    });

    showToast('¡Banner creado y publicado en la portada exitosamente!');
    setTitle('');
    setSubtitle('');
    setCtaText('Leer Análisis Completo');
    setCtaTarget(articles[0]?.slug || '');
  };

  const handleStartEdit = (banner: HeroBanner) => {
    setEditingBanner({ ...banner });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner || !editingBanner.title.trim()) {
      alert('El banner debe tener al menos un título.');
      return;
    }

    setIsSavingEdit(true);

    updateBanner(editingBanner.id, {
      title: editingBanner.title.trim(),
      subtitle: editingBanner.subtitle?.trim() || undefined,
      badge: editingBanner.badge?.trim() || undefined,
      imageUrl: editingBanner.imageUrl.trim(),
      ctaText: editingBanner.ctaText.trim() || 'Ver Más',
      ctaActionType: editingBanner.ctaActionType || 'article',
      ctaTarget: editingBanner.ctaTarget.trim()
    });

    setIsSavingEdit(false);
    setEditingBanner(null);
    showToast('¡Cambios del banner guardados correctamente en la base de datos!');
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const items = [...banners];
    const temp = items[index];
    items[index] = items[index - 1];
    items[index - 1] = temp;
    reorderBanners(items.map((b, idx) => ({ ...b, order: idx + 1 })));
    showToast('Orden de banners actualizado');
  };

  const handleMoveDown = (index: number) => {
    if (index === banners.length - 1) return;
    const items = [...banners];
    const temp = items[index];
    items[index] = items[index + 1];
    items[index + 1] = temp;
    reorderBanners(items.map((b, idx) => ({ ...b, order: idx + 1 })));
    showToast('Orden de banners actualizado');
  };

  const handleMediaSelect = (media: { url: string }) => {
    if (mediaTarget === 'create') {
      setImageUrl(media.url);
    } else if (mediaTarget === 'edit' && editingBanner) {
      setEditingBanner({ ...editingBanner, imageUrl: media.url });
    }
    setMediaPickerOpen(false);
    setMediaTarget(null);
  };

  const handleArticleSelect = (art: Article, autoFill: boolean = false) => {
    if (articlePickerTarget === 'create') {
      setCtaActionType('article');
      setCtaTarget(art.slug);
      if (autoFill) {
        setTitle(art.title);
        setSubtitle(art.excerpt || art.seoDescription || '');
        setBadge(art.categoryLabel?.toUpperCase() || art.category.toUpperCase());
        if (art.featuredImage?.url) {
          setImageUrl(art.featuredImage.url);
        }
        setCtaText('Leer Reportaje');
      }
    } else if (articlePickerTarget === 'edit' && editingBanner) {
      const updated: HeroBanner = {
        ...editingBanner,
        ctaActionType: 'article',
        ctaTarget: art.slug
      };
      if (autoFill) {
        updated.title = art.title;
        updated.subtitle = art.excerpt || art.seoDescription || '';
        updated.badge = art.categoryLabel?.toUpperCase() || art.category.toUpperCase();
        if (art.featuredImage?.url) {
          updated.imageUrl = art.featuredImage.url;
        }
        updated.ctaText = 'Leer Reportaje';
      }
      setEditingBanner(updated);
    }
    setArticlePickerOpen(false);
    setArticlePickerTarget(null);
    showToast(`Artículo "${art.title.slice(0, 30)}..." vinculado al banner`);
  };

  // Helper to open live article URL in new tab
  const handleTestLink = (banner: HeroBanner) => {
    if (banner.ctaActionType === 'article') {
      const art = getLinkedArticle(banner.ctaTarget);
      if (art) {
        const cat = art.category || 'gta-6';
        const sub = art.subcategorySlug && art.subcategorySlug !== 'all' ? `/${art.subcategorySlug}` : '';
        const url = cat === 'gta-6' ? `/gta-6${sub}/${art.slug}` : `/gta-6/${cat}${sub}/${art.slug}`;
        window.open(url, '_blank');
      } else {
        window.open(`/gta-6/${banner.ctaTarget}`, '_blank');
      }
    } else if (banner.ctaActionType === 'category') {
      const catUrl = banner.ctaTarget === 'gta-6' ? '/gta-6' : `/gta-6/${banner.ctaTarget}`;
      window.open(catUrl, '_blank');
    } else {
      window.open(banner.ctaTarget.startsWith('/') ? banner.ctaTarget : `/${banner.ctaTarget}`, '_blank');
    }
  };

  const createSelectedArticle = getLinkedArticle(ctaTarget);
  const editSelectedArticle = editingBanner ? getLinkedArticle(editingBanner.ctaTarget) : null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in pb-12">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#ff6486] font-bold">
            <Sliders className="w-4 h-4 text-[#ff6486]" />
            <span>PORTADA PRINCIPAL FULL-WIDTH · HERO SLIDER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Banners de Portada y Botones de Acción
          </h1>
          <p className="text-xs text-slate-400">
            Administra los banners deslizables de la portada principal, asignando directamente artículos desde la base de datos o categorías.
          </p>
        </div>
      </div>

      {/* 2. CREATE NEW BANNER FORM */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#ffc456] font-bold">
            <Plus className="w-4 h-4 text-[#ffc456]" />
            <span>Añadir Nuevo Banner Deslizable a la Portada</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setArticlePickerTarget('create');
              setArticlePickerOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-[#ffc456] hover:text-slate-950 text-[#ffc456] text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Importar Datos desde Artículo</span>
          </button>
        </div>

        <form onSubmit={handleCreateBanner} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Left Fields */}
            <div className="md:col-span-8 space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-[#ffc456] block mb-1 font-bold">
                  Título Principal del Banner (H1) *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Grand Theft Auto VI: Salto Generacional y Motor RAGE 9"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-bold text-white placeholder-slate-500 focus:outline-hidden focus:border-[#ff6486] font-display"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  Subtítulo / Descripción
                </label>
                <textarea
                  rows={2}
                  placeholder="Descripción resumida del reportaje o sección..."
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#ff6486]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                    Distintivo / Etiqueta Superior
                  </label>
                  <input
                    type="text"
                    placeholder="REPORTAJE CENTRAL EXCLUSIVO"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-[#ffc456] font-mono font-bold uppercase focus:outline-hidden focus:border-[#ff6486]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                    URL de la Imagen de Fondo
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="/images/..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      required
                      className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setMediaTarget('create');
                        setMediaPickerOpen(true);
                      }}
                      className="px-3 py-2 bg-slate-800 hover:bg-[#ff6486] hover:text-white text-[#ffc456] rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer"
                    >
                      Galería
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Preview Card */}
            <div className="md:col-span-4 space-y-2">
              <label className="text-[10px] font-mono uppercase text-slate-400 block">
                Previsualización de Imagen:
              </label>
              <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-slate-950 border border-slate-700">
                <img src={imageUrl} alt="Banner preview" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-[9px] font-mono text-[#ffc456] font-bold uppercase">
                  {badge || 'BANNER'}
                </div>
              </div>
            </div>

          </div>

          {/* CTA Button Customization Section */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 pt-3">
            <span className="text-xs font-mono uppercase text-[#ff6486] font-bold flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-[#ff6486]" />
              Personalización del Botón de Llamado a la Acción (CTA)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-4">
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  Texto del Botón *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Leer Análisis Completo"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-bold"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  Tipo de Destino
                </label>
                <select
                  value={ctaActionType}
                  onChange={(e) => {
                    const newType = e.target.value as any;
                    setCtaActionType(newType);
                    if (newType === 'article') {
                      setCtaTarget(articles[0]?.slug || '');
                    } else if (newType === 'category') {
                      setCtaTarget(categories[0]?.slug || 'gta-6');
                    } else {
                      setCtaTarget('/gta-6');
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-medium"
                >
                  <option value="article">📄 Artículo Específico</option>
                  <option value="category">📁 Categoría del Portal</option>
                  <option value="url">🔗 URL Personalizada</option>
                </select>
              </div>

              <div className="sm:col-span-5">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 block">
                    {ctaActionType === 'article' ? 'Artículo Vinculado' : ctaActionType === 'category' ? 'Categoría' : 'URL de Destino'}
                  </label>
                  {ctaActionType === 'article' && (
                    <button
                      type="button"
                      onClick={() => {
                        setArticlePickerTarget('create');
                        setArticlePickerOpen(true);
                      }}
                      className="text-[10px] font-mono text-[#ffc456] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Search className="w-3 h-3" />
                      <span>Buscar en BD</span>
                    </button>
                  )}
                </div>

                {ctaActionType === 'article' && (
                  <div className="space-y-2">
                    <select
                      value={ctaTarget}
                      onChange={(e) => setCtaTarget(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    >
                      <option value="">Seleccionar Artículo de la lista...</option>
                      {articles.filter(a => a.status === 'publicado' || a.status === 'programado' || !a.status).map(art => (
                        <option key={art.id} value={art.slug}>
                          [{art.categoryLabel || art.category}] {art.title}
                        </option>
                      ))}
                    </select>

                    {createSelectedArticle && (
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2.5">
                        <img 
                          src={createSelectedArticle.featuredImage?.url || '/images/Artes_y_Ediciones/Official_Cover_Art_landscape.webp'} 
                          alt={createSelectedArticle.title} 
                          className="w-10 h-7 rounded object-cover border border-slate-700 shrink-0" 
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] font-bold text-white truncate font-display">
                            {createSelectedArticle.title}
                          </div>
                          <div className="text-[9px] font-mono text-emerald-400">
                            /gta-6/{createSelectedArticle.category}/{createSelectedArticle.slug}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {ctaActionType === 'category' && (
                  <select
                    value={ctaTarget}
                    onChange={(e) => setCtaTarget(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                  >
                    {categories.map(cat => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.name} ({cat.slug === 'gta-6' ? '/gta-6 Super Categoría' : `/gta-6/${cat.slug}`})
                      </option>
                    ))}
                  </select>
                )}

                {ctaActionType === 'url' && (
                  <input
                    type="text"
                    placeholder="ej: /gta-6/personajes o /sitemap"
                    value={ctaTarget}
                    onChange={(e) => setCtaTarget(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="py-2.5 px-6 bg-[#ff6486] hover:bg-[#ff6486]/90 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Crear y Publicar Banner</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. CURRENT BANNERS LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white font-display uppercase tracking-wide flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#ffc456]" />
            <span>Banners de Portada Activos ({banners.length})</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {banners.filter(b => b.isActive).length} en rotación
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {banners.map((banner, index) => {
            const linkedArt = banner.ctaActionType === 'article' ? getLinkedArticle(banner.ctaTarget) : null;

            return (
              <div
                key={banner.id}
                className={`rounded-2xl bg-slate-900/90 border overflow-hidden flex flex-col justify-between shadow-lg transition-all ${
                  banner.isActive ? 'border-slate-800' : 'border-slate-800/40 opacity-50'
                }`}
              >
                <div>
                  {/* Banner Thumbnail */}
                  <div className="relative aspect-16/9 bg-slate-950 overflow-hidden">
                    <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/85 backdrop-blur-md text-[10px] font-mono text-[#ffc456] font-bold uppercase border border-slate-700">
                      {banner.badge || 'PORTADA'}
                    </div>
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-slate-950/85 text-[10px] font-mono text-white font-bold">
                      #{index + 1}
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <h3 className="text-sm font-bold text-white line-clamp-2 font-display">
                      {banner.title}
                    </h3>
                    {banner.subtitle && (
                      <p className="text-xs text-slate-300 line-clamp-2 font-light">
                        {banner.subtitle}
                      </p>
                    )}

                    {/* CTA Details Box */}
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 text-[11px] font-mono">
                      <div className="text-[#ff6486] font-bold flex items-center justify-between">
                        <span>Botón: «{banner.ctaText}»</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400 uppercase">
                          {banner.ctaActionType || 'article'}
                        </span>
                      </div>

                      {linkedArt ? (
                        <div className="text-slate-300 truncate">
                          Artículo: <strong className="text-emerald-400">{linkedArt.title}</strong>
                        </div>
                      ) : (
                        <div className="text-slate-400 truncate">
                          Destino: {banner.ctaTarget}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-800/60 mt-3 pt-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      title="Mover hacia la izquierda"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === banners.length - 1}
                      className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      title="Mover hacia la derecha"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleTestLink(banner)}
                      className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 cursor-pointer"
                      title="Probar destino en nueva pestaña"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        updateBanner(banner.id, { isActive: !banner.isActive });
                        showToast(`Banner ${banner.isActive ? 'pausado' : 'activado'}`);
                      }}
                      className={`p-1.5 rounded-lg border cursor-pointer ${
                        banner.isActive
                          ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-500'
                      }`}
                      title={banner.isActive ? 'Pausar' : 'Activar'}
                    >
                      {banner.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleStartEdit(banner)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-[#ff6486] text-slate-200 hover:text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                      title="Editar Banner"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('¿Eliminar este banner de portada?')) {
                          deleteBanner(banner.id);
                          showToast('Banner eliminado');
                        }
                      }}
                      className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-red-400 cursor-pointer"
                      title="Eliminar Banner"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. EDIT BANNER MODAL WITH ARTICLE PICKER & SAVE CONFIRMATION */}
      {editingBanner && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in"
          onClick={() => setEditingBanner(null)}
        >
          <div 
            className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#ff6486]" />
                <h3 className="text-lg font-bold text-white font-display">
                  Editar Banner de Portada
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingBanner(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-mono uppercase text-[#ffc456] block mb-1 font-bold">
                  Título Principal del Banner *
                </label>
                <input
                  type="text"
                  value={editingBanner.title}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-sm focus:outline-hidden focus:border-[#ff6486]"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  Subtítulo / Descripción
                </label>
                <textarea
                  rows={2}
                  value={editingBanner.subtitle || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                    Distintivo / Etiqueta
                  </label>
                  <input
                    type="text"
                    value={editingBanner.badge || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, badge: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-[#ffc456] font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                    Imagen de Fondo
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={editingBanner.imageUrl}
                      onChange={(e) => setEditingBanner({ ...editingBanner, imageUrl: e.target.value })}
                      className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setMediaTarget('edit');
                        setMediaPickerOpen(true);
                      }}
                      className="px-3 py-2 bg-slate-800 hover:bg-[#ff6486] hover:text-white text-[#ffc456] rounded-lg font-mono font-bold cursor-pointer"
                    >
                      Galería
                    </button>
                  </div>
                </div>
              </div>

              {/* Edit CTA Controls */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-[#ff6486] font-bold flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-[#ff6486]" />
                    Configuración del Botón CTA
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setArticlePickerTarget('edit');
                      setArticlePickerOpen(true);
                    }}
                    className="px-3 py-1 rounded-lg bg-slate-850 hover:bg-[#ffc456] hover:text-slate-950 text-[#ffc456] text-[11px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 border border-slate-700"
                  >
                    <Search className="w-3 h-3" />
                    <span>Seleccionar Artículo de la BD</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-4">
                    <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                      Texto del Botón *
                    </label>
                    <input
                      type="text"
                      value={editingBanner.ctaText}
                      onChange={(e) => setEditingBanner({ ...editingBanner, ctaText: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                      Tipo de Destino
                    </label>
                    <select
                      value={editingBanner.ctaActionType || 'article'}
                      onChange={(e) => {
                        const newType = e.target.value as any;
                        setEditingBanner({
                          ...editingBanner,
                          ctaActionType: newType,
                          ctaTarget: newType === 'article' ? (articles[0]?.slug || '') : newType === 'category' ? 'gta-6' : '/gta-6'
                        });
                      }}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    >
                      <option value="article">📄 Artículo</option>
                      <option value="category">📁 Categoría</option>
                      <option value="url">🔗 URL</option>
                    </select>
                  </div>

                  <div className="sm:col-span-5">
                    <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                      {editingBanner.ctaActionType === 'article' ? 'Artículo de la Base de Datos' : editingBanner.ctaActionType === 'category' ? 'Categoría' : 'URL Destino'}
                    </label>

                    {editingBanner.ctaActionType === 'article' && (
                      <select
                        value={editingBanner.ctaTarget}
                        onChange={(e) => setEditingBanner({ ...editingBanner, ctaTarget: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                      >
                        <option value="">Seleccionar Artículo...</option>
                        {articles.filter(a => a.status === 'publicado' || a.status === 'programado' || !a.status).map(art => (
                          <option key={art.id} value={art.slug}>
                            [{art.categoryLabel || art.category}] {art.title}
                          </option>
                        ))}
                      </select>
                    )}

                    {editingBanner.ctaActionType === 'category' && (
                      <select
                        value={editingBanner.ctaTarget}
                        onChange={(e) => setEditingBanner({ ...editingBanner, ctaTarget: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                      >
                        {categories.map(cat => (
                          <option key={cat.slug} value={cat.slug}>
                            {cat.name} ({cat.slug === 'gta-6' ? '/gta-6 Super Categoría' : `/gta-6/${cat.slug}`})
                          </option>
                        ))}
                      </select>
                    )}

                    {editingBanner.ctaActionType === 'url' && (
                      <input
                        type="text"
                        value={editingBanner.ctaTarget}
                        onChange={(e) => setEditingBanner({ ...editingBanner, ctaTarget: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                      />
                    )}
                  </div>
                </div>

                {/* Selected Article Detail Preview in Modal */}
                {editSelectedArticle && (
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img 
                        src={editSelectedArticle.featuredImage?.url || '/images/Artes_y_Ediciones/Official_Cover_Art_landscape.webp'} 
                        alt={editSelectedArticle.title} 
                        className="w-12 h-8 rounded object-cover border border-slate-700 shrink-0" 
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate font-display">
                          {editSelectedArticle.title}
                        </div>
                        <div className="text-[10px] font-mono text-emerald-400">
                          Ruta: /gta-6/{editSelectedArticle.category}/{editSelectedArticle.slug}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTestLink(editingBanner)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono shrink-0 flex items-center gap-1 cursor-pointer"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Ver</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingBanner(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="px-6 py-2.5 rounded-xl bg-linear-to-r from-emerald-600 via-rose-600 to-pink-600 hover:opacity-90 text-white font-bold shadow-lg transition-all cursor-pointer flex items-center gap-2 text-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingEdit ? 'Guardando...' : '💾 Guardar Cambios en Base de Datos'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => {
          setMediaPickerOpen(false);
          setMediaTarget(null);
        }}
        onSelectMedia={handleMediaSelect}
        title="Seleccionar Imagen para Banner Hero"
      />

      {/* Article Picker Modal */}
      <ArticlePickerModal
        isOpen={articlePickerOpen}
        onClose={() => {
          setArticlePickerOpen(false);
          setArticlePickerTarget(null);
        }}
        onSelectArticle={handleArticleSelect}
        title="Explorador de Artículos de la Base de Datos"
        selectedSlug={articlePickerTarget === 'edit' ? editingBanner?.ctaTarget : ctaTarget}
      />

    </div>
  );
};
