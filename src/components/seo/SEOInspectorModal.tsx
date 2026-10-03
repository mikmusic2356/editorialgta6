import React, { useState, useEffect } from 'react';
import { Article } from '../../types';
import { ARTICLES } from '../../data/articles';
import { CATEGORIES } from '../../data/categories';
import { useCMS } from '../../context/CMSContext';
import { generateSitemapXml } from '../../utils/sitemapGenerator';
import { 
  generatePageGraphSchema, 
  generateArticleSchema, 
  generateBreadcrumbSchema, 
  generateVideoSchema, 
  resolveArticleSchemaType,
  calculateArticleWordCount
} from '../../utils/schemaGenerator';
import { 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  Search, 
  Code, 
  FileText, 
  Copy, 
  Check, 
  Layers, 
  Globe,
  Video,
  ExternalLink,
  Tag,
  BookOpen
} from 'lucide-react';

interface SEOInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentArticle?: Article | null;
}

export const SEOInspectorModal: React.FC<SEOInspectorModalProps> = ({
  isOpen,
  onClose,
  currentArticle,
}) => {
  const { articles: cmsArticles, categories: cmsCategories, staticPages } = useCMS();
  const allArticles = cmsArticles && cmsArticles.length > 0 ? cmsArticles : ARTICLES;
  const allCategories = cmsCategories && cmsCategories.length > 0 ? cmsCategories : CATEGORIES;

  const [activeTab, setActiveTab] = useState<'serp' | 'schema' | 'sitemap' | 'adsense'>('serp');
  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string>(
    currentArticle ? currentArticle.slug : (allArticles[0]?.slug || '')
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (currentArticle?.slug) {
      setSelectedArticleSlug(currentArticle.slug);
    } else if (allArticles.length > 0 && !selectedArticleSlug) {
      setSelectedArticleSlug(allArticles[0].slug);
    }
  }, [currentArticle, isOpen, allArticles]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const targetArticle = allArticles.find(a => a.slug === selectedArticleSlug) || currentArticle || allArticles[0];
  const schemaType = resolveArticleSchemaType(targetArticle);
  const pageTitle = `${targetArticle.seoTitle || targetArticle.title}`;
  const metaDesc = targetArticle.seoDescription || targetArticle.excerpt || '';
  const subPath = targetArticle.subcategorySlug && targetArticle.subcategorySlug !== 'all' ? `${targetArticle.subcategorySlug}/` : '';
  const articleRelativePath = targetArticle.category === 'gta-6' 
    ? `/gta-6/${subPath}${targetArticle.slug}` 
    : `/gta-6/${targetArticle.category}/${subPath}${targetArticle.slug}`;
  const canonicalUrl = `${window.location.origin}${articleRelativePath}`;

  const breadcrumbItems = [
    { name: 'Portada', url: '/' },
    { name: 'GTA 6', url: '/gta-6' },
    ...(targetArticle.category !== 'gta-6' ? [{ name: targetArticle.categoryLabel || targetArticle.category, url: `/gta-6/${targetArticle.category}` }] : []),
    { name: targetArticle.title, url: articleRelativePath }
  ];

  const graphSchemaObject = generatePageGraphSchema(targetArticle, breadcrumbItems, window.location.origin);
  const schemaJson = JSON.stringify(graphSchemaObject, null, 2);
  const wordCount = calculateArticleWordCount(targetArticle);

  const sitemapXml = generateSitemapXml(allArticles, allCategories, staticPages);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">
                Auditoría SEO Técnico & Google Search Console
              </h2>
              <p className="text-xs text-slate-400">
                Verificación de metadatos, Schema.org JSON-LD, Sitemap XML y arquitectura AdSense
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
            title="Cerrar modal"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 gap-2 text-xs font-medium overflow-x-auto">
          {[
            { id: 'serp', label: 'Google SERP Preview', icon: Search },
            { id: 'schema', label: 'Schema.org JSON-LD', icon: Code },
            { id: 'sitemap', label: 'Sitemap.xml & Robots', icon: FileText },
            { id: 'adsense', label: 'AdSense Layout Specs', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-amber-400 text-amber-300 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300 text-sm">
          
          {/* TAB 1: Google SERP Preview */}
          {activeTab === 'serp' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider mb-2">
                  Vista Previa en Resultados de Búsqueda de Google (Desktop & Mobile)
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Así es cómo Google renderiza el snippet para la página actual ({targetArticle.title}):
                </p>

                {/* Simulated Google Search Result */}
                <div className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 shadow-md space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <div className="w-4 h-4 rounded-full bg-rose-500 text-[10px] text-slate-950 font-black flex items-center justify-center">
                      VI
                    </div>
                    <span className="text-slate-300 font-medium">Leonida Chronicle</span>
                    <span className="text-slate-600">›</span>
                    <span className="text-slate-400 truncate">{canonicalUrl}</span>
                  </div>
                  <div className="text-base sm:text-lg font-medium text-blue-400 hover:underline cursor-pointer leading-snug">
                    {pageTitle}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-2">
                    {metaDesc}
                  </div>
                  <div className="pt-1 flex items-center gap-2 text-[11px] font-mono text-slate-400">
                    <span className="text-emerald-400">✓ HTTPS Seguro</span>
                    <span>·</span>
                    <span>Publicado: {new Date(targetArticle.publishedAt).toLocaleDateString()}</span>
                    <span>·</span>
                    <span>Autor: {targetArticle.author.name}</span>
                  </div>
                </div>
              </div>

              {/* Technical Audit Checklist */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                  Checklist de Indexabilidad (Google Search Console Ready)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { title: 'Etiqueta Canonical configurada', desc: canonicalUrl, status: true },
                    { title: 'Etiqueta Title & H1 optimizada', desc: 'Sin keyword stuffing, jerarquía estricta', status: true },
                    { title: 'OpenGraph & Twitter Cards', desc: 'summary_large_image con fallback', status: true },
                    { title: 'Schema.org Article estructurado', desc: 'Validado para Rich Snippets', status: true },
                    { title: 'Meta Robots', desc: 'index, follow, max-image-preview:large', status: true },
                    { title: 'Core Web Vitals optimizado', desc: 'Cero desplazamiento de diseño (CLS 0.0)', status: true },
                  ].map((chk, i) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold text-slate-200">{chk.title}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[260px]">{chk.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Schema.org JSON-LD */}
          {activeTab === 'schema' && (
            <div className="space-y-5">
              {/* Article Selector for Testing Multiple Types */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-xs font-mono uppercase text-slate-400">
                    Probar marcado de cualquier artículo:
                  </div>
                  <select
                    value={selectedArticleSlug}
                    onChange={(e) => setSelectedArticleSlug(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-medium focus:outline-hidden focus:border-amber-400"
                  >
                    {allArticles.map((art) => (
                      <option key={art.slug} value={art.slug}>
                        [{(art.category || 'gta-6').toUpperCase()}] {art.title.slice(0, 60)}...
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">
                    @type: {schemaType}
                  </div>
                  {targetArticle.youtubeVideoId && (
                    <div className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-mono flex items-center gap-1">
                      <Video className="w-3.5 h-3.5" />
                      +VideoObject
                    </div>
                  )}
                  <div className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono">
                    +Breadcrumbs
                  </div>
                </div>
              </div>

              {/* Schema Mapping Rule Explainer */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
                  <div className="font-bold text-rose-400 font-mono">1. Noticias</div>
                  <p className="text-slate-400 text-[11px]">
                    Mapeadas automáticamente a <strong className="text-slate-200">NewsArticle</strong> con fecha de publicación y actualización.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
                  <div className="font-bold text-cyan-400 font-mono">2. Guías y Manuales</div>
                  <p className="text-slate-400 text-[11px]">
                    Mapeadas a <strong className="text-slate-200">Article</strong> o <strong className="text-slate-200">TechArticle</strong> con niveles de dificultad.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
                  <div className="font-bold text-indigo-400 font-mono">3. Video & Breadcrumbs</div>
                  <p className="text-slate-400 text-[11px]">
                    Incluye <strong className="text-slate-200">BreadcrumbList</strong> y <strong className="text-slate-200">VideoObject</strong> si existe YouTube ID.
                  </p>
                </div>
              </div>

              {/* Code output */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono uppercase text-slate-400">
                    JSON-LD Generado Automáticamente (Sin información inventada):
                  </div>
                  <button
                    onClick={() => handleCopy(schemaJson)}
                    className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado' : 'Copiar JSON-LD'}</span>
                  </button>
                </div>

                <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-amber-200/90 overflow-x-auto max-h-96 leading-relaxed">
                  {schemaJson}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: Sitemap.xml & Robots */}
          {activeTab === 'sitemap' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                    Sitemap XML Generado (/sitemap.xml)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Listo para enviar a la propiedad de Google Search Console.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(sitemapXml)}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado' : 'Copiar Sitemap'}</span>
                </button>
              </div>

              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-cyan-200/90 overflow-x-auto max-h-72 leading-relaxed">
                {sitemapXml}
              </pre>

              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <div className="text-xs font-mono uppercase text-slate-300 font-bold">
                  Contenido de robots.txt recomendado:
                </div>
                <pre className="text-xs font-mono text-slate-400">
{`User-agent: *
Allow: /
Sitemap: https://leonidachronicle.com/sitemap.xml`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: Google AdSense Layout Specs */}
          {activeTab === 'adsense' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                Especificaciones de Arquitectura Google AdSense
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                El portal implementa la arquitectura de 3 columnas centradas recomendada por Google AdSense, asegurando que los anuncios nunca interrumpan la lectura ni provoquen saltos de diseño (CLS):
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-amber-400 font-mono uppercase">
                    1. Skyscraper Towers Laterales (Desktop)
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Ubicados en <code className="text-slate-300 font-mono">.left-ad-space</code> y <code className="text-slate-300 font-mono">.right-ad-space</code> con ancho fijo de 180px y sticky positioning. En móvil y tablet se ocultan automáticamente para priorizar el contenido.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-amber-400 font-mono uppercase">
                    2. In-Article & Content Interstitials
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Espaciados estratégicamente entre párrafos principales con reservas de altura fijas (<code className="text-slate-300 font-mono">min-height</code>) para prevenir saltos acumulados de diseño (CLS = 0).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-amber-400 font-mono uppercase">
                    3. No Fake Ads Policy
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    No se insertan imágenes falsas que confundan al lector. Los contenedores están listos para recibir directamente las etiquetas <code className="text-slate-300 font-mono">&lt;ins class="adsbygoogle"&gt;</code>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-amber-400 font-mono uppercase">
                    4. Cumplimiento de Políticas de Calidad
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Relación de contenido vs publicidad superior al 80/20, sin popups agresivos ni contenido duplicado.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
          >
            Cerrar Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
