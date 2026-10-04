import React, { useState, useEffect } from 'react';
import { Article, Comment } from '../../types';
import { useCMS } from '../../context/CMSContext';
import { EditorialVisual } from '../common/EditorialVisual';
import { MarkdownParagraph, renderFormattedInline } from '../common/MarkdownParagraph';
import { AdSlot } from '../layout/AdSlot';
import { ArticleCard } from './ArticleCard';
import { generatePageGraphSchema, resolveArticleSchemaType } from '../../utils/schemaGenerator';
import { 
  ChevronRight, 
  Calendar, 
  Clock, 
  RefreshCw, 
  Share2, 
  Check, 
  MessageSquare, 
  ThumbsUp, 
  Send, 
  BookOpen, 
  HelpCircle, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  Play,
  ArrowLeft,
  FileCode,
  Twitter,
  Instagram,
  Youtube,
  Video,
  Globe,
  Mail,
  Heart,
  Eye,
  Flame,
  Copy,
  MessageCircle
} from 'lucide-react';

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
  onSelectCategory: (category: any, subcategory?: string) => void;
  onSelectArticle: (slug: string) => void;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({
  article,
  onBack,
  onSelectCategory,
  onSelectArticle,
}) => {
  const { 
    articles: cmsArticles, 
    isArticleLiked, 
    likeArticle, 
    shareArticle, 
    incrementArticleViews 
  } = useCMS();

  const liveArticle = cmsArticles.find(a => a.slug === article.slug || a.id === article.id) || article;
  const isLiked = isArticleLiked(liveArticle.slug) || isArticleLiked(liveArticle.id);
  const likesCount = liveArticle.likes ?? 0;
  const sharesCount = liveArticle.shares ?? 0;
  const viewsCount = liveArticle.views ?? 0;

  const [copied, setCopied] = useState(false);
  const [shareDropdownOpen, setShareDropdownOpen] = useState(false);
  const [likePulse, setLikePulse] = useState(false);

  // Increment view on load
  useEffect(() => {
    incrementArticleViews(article.slug);
  }, [article.slug]);

  const handleToggleLike = () => {
    setLikePulse(true);
    likeArticle(liveArticle.slug);
    setTimeout(() => setLikePulse(false), 500);
  };

  const handleSocialShare = (platform: 'whatsapp' | 'twitter' | 'facebook' | 'telegram' | 'copy') => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = `Lee "${liveArticle.title}" en KAIROSION · GTA 6:`;
    
    shareArticle(liveArticle.slug, platform);

    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
    } else if (platform === 'copy') {
      handleCopyLink();
    }
  };
  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem(`comments_${article.slug}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [
      {
        id: 'c-1',
        articleSlug: article.slug,
        authorName: 'Vicen_Leonida',
        content: 'Excelente artículo y análisis detallado. El nivel de detalle en el mapa de Vice City y la física del agua en Grassrivers pinta revolucionario.',
        createdAt: 'Hace 2 horas',
        likes: 14
      },
      {
        id: 'c-2',
        articleSlug: article.slug,
        authorName: 'LuciaGang_99',
        content: 'Me parece fundamental la restricción de armas en el maletero. Le da un toque táctico a lo RDR2 que se echaba de menos en GTA V.',
        createdAt: 'Hace 5 horas',
        likes: 8
      }
    ];
  });

  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [article.slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim()) return;

    const newC: Comment = {
      id: `c-${Date.now()}`,
      articleSlug: article.slug,
      authorName: newCommentName.trim(),
      content: newCommentText.trim(),
      createdAt: 'Justo ahora',
      likes: 0
    };

    const updated = [newC, ...comments];
    setComments(updated);
    localStorage.setItem(`comments_${article.slug}`, JSON.stringify(updated));
    setNewCommentName('');
    setNewCommentText('');
  };

  const handleLikeComment = (id: string) => {
    const updated = comments.map(c => c.id === id ? { ...c, likes: c.likes + 1 } : c);
    setComments(updated);
    localStorage.setItem(`comments_${article.slug}`, JSON.stringify(updated));
  };

  const formattedPubDate = new Date(article.publishedAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const formattedUpdateDate = new Date(article.updatedAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Related articles lookup from dynamic CMS articles
  const availableArticles = cmsArticles && cmsArticles.length > 0 ? cmsArticles : [];
  const relatedArticles = availableArticles.filter(a => 
    (a.status === 'publicado' || !a.status) &&
    (article.relatedSlugs?.includes(a.slug) || (a.category === article.category && a.slug !== article.slug))
  ).slice(0, 3);

  const hasSubcategory = Boolean(article.subcategorySlug && article.subcategorySlug !== 'all');
  const subcategoryDisplay = hasSubcategory 
    ? article.subcategorySlug.replace(/-/g, ' ') 
    : null;

  const subPath = hasSubcategory ? `${article.subcategorySlug}/` : '';
  const fullArticlePath = `/gta-6/${article.category}/${subPath}${article.slug}`;

  // Dynamic Hierarchical Breadcrumbs for navigation and Schema (with Super Category GTA 6)
  const breadcrumbItems = [
    { name: 'Portada', url: '/' },
    { name: 'GTA 6', url: '/gta-6' },
    { name: article.categoryLabel || article.category, url: `/gta-6/${article.category}` },
    ...(hasSubcategory ? [{ name: subcategoryDisplay!, url: `/gta-6/${article.category}/${article.subcategorySlug}` }] : []),
    { name: article.title, url: fullArticlePath }
  ];

  // Dynamic Schema.org structured data (@graph containing Article/NewsArticle/TechArticle, BreadcrumbList, VideoObject)
  const pageSchemaObject = generatePageGraphSchema(article, breadcrumbItems, window.location.origin);
  const schemaArticleJson = JSON.stringify(pageSchemaObject, null, 2);

  return (
    <div className="w-full">
      {/* Dynamic Schema.org JSON-LD Script in DOM */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaArticleJson }}
      />

      {/* Back button & Traceable Breadcrumbs with GTA 6 Super Category */}
      <nav aria-label="Breadcrumbs" className="mb-6 flex flex-wrap items-center gap-2 text-xs font-mono text-[#ffc456]">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-1 text-[#ffc456] hover:text-[#ff6486] transition-colors cursor-pointer font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver</span>
        </button>
        
        <ChevronRight className="w-3 h-3 text-slate-600" />
        <button 
          onClick={() => onSelectCategory('portada')}
          className="hover:text-white transition-colors cursor-pointer text-slate-400 hover:underline"
        >
          Portada
        </button>

        <ChevronRight className="w-3 h-3 text-slate-600" />
        <button 
          onClick={() => onSelectCategory('gta-6')}
          className="hover:text-white uppercase transition-colors cursor-pointer text-[#ff6486] font-bold hover:underline"
        >
          GTA 6
        </button>
        
        {article.category !== 'gta-6' && (
          <>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <button 
              onClick={() => onSelectCategory(article.category)}
              className="hover:text-white uppercase transition-colors cursor-pointer text-[#ffc456] font-bold hover:underline"
            >
              {article.categoryLabel || article.category}
            </button>
          </>
        )}

        {hasSubcategory && (
          <>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <button 
              onClick={() => onSelectCategory(article.category, article.subcategorySlug)}
              className="hover:text-white capitalize transition-colors cursor-pointer text-[#ff6486] font-medium hover:underline"
            >
              {subcategoryDisplay}
            </button>
          </>
        )}

        <ChevronRight className="w-3 h-3 text-slate-600" />
        <span className="text-white truncate max-w-[180px] sm:max-w-xs font-semibold" title={article.title}>
          {article.title}
        </span>
      </nav>

      {/* Header of Article */}
      <header className="space-y-4 mb-8">
        {/* Zero-Pill Unboxed Category */}
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#ffc456] font-bold">
          <span>{article.categoryLabel}</span>
          {article.difficulty && (
            <>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-[#ff6486]">Dificultad: {article.difficulty}</span>
            </>
          )}
        </div>

        {/* H1 Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display tracking-tight leading-tight [text-wrap:balance]">
          {article.title}
        </h1>

        {/* Lead Excerpt / Deck */}
        <p className="text-lg sm:text-xl text-white leading-relaxed font-light">
          {article.excerpt}
        </p>

        {/* Byline & Timestamps */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-slate-700"
            />
            <div>
              <div className="text-sm font-semibold text-white">{article.author.name}</div>
              <div className="text-xs text-[#ffc456] font-mono">{article.author.role}</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1 text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-[#ffc456]" />
              {formattedPubDate}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 text-slate-300">
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              Actualizado: {formattedUpdateDate}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 text-[#ff6486] font-bold">
              <Clock className="w-3.5 h-3.5" />
              {article.readTimeMinutes} min
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 text-cyan-400">
              <Eye className="w-3.5 h-3.5" />
              {viewsCount.toLocaleString()} vistas
            </span>
          </div>

          {/* Social Share & Like Controls */}
          <div className="flex items-center gap-2">
            {/* Heart / Like Button */}
            <button
              onClick={handleToggleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer select-none active:scale-95 ${
                isLiked
                  ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-950/50'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-rose-400 hover:border-rose-500/50'
              }`}
              title={isLiked ? 'Ya te gusta este artículo (Haz clic para retirar)' : 'Me gusta este artículo'}
            >
              <Heart 
                className={`w-3.5 h-3.5 transition-transform duration-300 ${
                  isLiked ? 'fill-white text-white' : 'text-rose-400'
                } ${likePulse ? 'scale-125' : 'scale-100'}`} 
              />
              <span className="font-mono">{likesCount}</span>
            </button>

            {/* Share Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setShareDropdownOpen(!shareDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-[#ff6486] text-white hover:bg-[#ff6486]/90 transition-colors shadow-xs cursor-pointer select-none"
                title="Compartir en redes sociales"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Compartir</span>
                <span className="bg-slate-950/60 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold">
                  {sharesCount}
                </span>
              </button>

              {shareDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 p-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase px-2.5 py-1">
                    Compartir artículo ({sharesCount} veces):
                  </div>
                  <button
                    onClick={() => {
                      handleSocialShare('whatsapp');
                      setShareDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-emerald-300 hover:bg-emerald-950/60 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={() => {
                      handleSocialShare('twitter');
                      setShareDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-cyan-300 hover:bg-cyan-950/60 transition-colors cursor-pointer"
                  >
                    <Twitter className="w-3.5 h-3.5 text-cyan-400" />
                    <span>X / Twitter</span>
                  </button>
                  <button
                    onClick={() => {
                      handleSocialShare('facebook');
                      setShareDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-blue-300 hover:bg-blue-950/60 transition-colors cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5 text-blue-400" />
                    <span>Facebook</span>
                  </button>
                  <button
                    onClick={() => {
                      handleSocialShare('telegram');
                      setShareDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-sky-300 hover:bg-sky-950/60 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-sky-400" />
                    <span>Telegram</span>
                  </button>
                  <button
                    onClick={() => {
                      handleSocialShare('copy');
                      setShareDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-amber-300 hover:bg-amber-950/60 transition-colors cursor-pointer border-t border-slate-800 mt-1 pt-2"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                    <span>{copied ? '¡Enlace Copiado!' : 'Copiar Enlace'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Featured Visual */}
      <div className="mb-10">
        <EditorialVisual
          key={liveArticle.slug || liveArticle.id || article.slug}
          image={liveArticle.featuredImage || article.featuredImage}
          category={liveArticle.category || article.category}
          title={liveArticle.title || article.title}
          aspectRatio="16:9"
          priority={true}
          className="w-full"
        />
      </div>

      {/* Table of Contents if available */}
      {article.tableOfContents && article.tableOfContents.length > 0 && (
        <aside className="mb-10 p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-300 font-bold mb-3">
            <BookOpen className="w-4 h-4 text-rose-400" />
            Tabla de Contenidos
          </div>
          <nav>
            <ul className="space-y-2 text-sm">
              {article.tableOfContents.map((item) => (
                <li key={item.id} className={item.level === 3 ? 'pl-4' : ''}>
                  <a
                    href={`#${item.id}`}
                    className="text-slate-300 hover:text-rose-400 transition-colors flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3 h-3 text-slate-600" />
                    <span>{item.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      )}

      {/* Main Editorial Reading Body (constrained 65-75ch measure) */}
      <article 
        className="editorial-prose"
        onClick={(e) => {
          const target = (e.target as HTMLElement).closest('a');
          if (!target) return;
          const internalSlug = target.getAttribute('data-internal-article');
          const href = target.getAttribute('href');
          if (internalSlug) {
            e.preventDefault();
            onSelectArticle(internalSlug);
          } else if (href && href.startsWith('/articulo/')) {
            e.preventDefault();
            const slug = href.replace('/articulo/', '');
            onSelectArticle(slug);
          }
        }}
      >
        {/* Drop cap opening lead */}
        {article.content.leadText && (
          <div className="drop-cap text-slate-200 text-lg leading-relaxed font-light mb-6">
            {renderFormattedInline(article.content.leadText)}
          </div>
        )}

        {/* Render sections */}
        {article.content.sections.map((section, idx) => (
          <div key={idx} id={section.id} className="my-8 scroll-mt-24">
            {section.heading && (
              <h2>{renderFormattedInline(section.heading)}</h2>
            )}

            {section.subheading && (
              <h3>{renderFormattedInline(section.subheading)}</h3>
            )}

            {section.paragraphs && section.paragraphs.map((p, pIdx) => (
              <MarkdownParagraph key={pIdx} content={p} />
            ))}

            {/* Section Featured / Additional Image */}
            {section.image && section.image.url && (
              <figure className="my-8 not-prose rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-lg">
                <div className="relative aspect-16/9 overflow-hidden bg-slate-950">
                  <img
                    src={section.image.url}
                    alt={section.image.alt || section.heading || 'Imagen del artículo'}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {section.image.badge && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-slate-950/85 backdrop-blur-md border border-slate-700 text-[10px] font-mono font-bold text-[#ffc456] uppercase">
                      {section.image.badge}
                    </div>
                  )}
                </div>
                {section.image.caption && (
                  <figcaption className="p-3 bg-slate-950/80 border-t border-slate-800 text-xs text-slate-300 font-light italic">
                    {section.image.caption}
                  </figcaption>
                )}
              </figure>
            )}

            {/* Informational Callout Boxes */}
            {section.calloutBox && (
              <div className={`my-6 p-4 sm:p-5 rounded-xl border flex items-start gap-3.5 not-prose ${
                section.calloutBox.type === 'tip'
                  ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                  : section.calloutBox.type === 'warning'
                  ? 'bg-amber-950/30 border-amber-500/30 text-amber-200'
                  : 'bg-indigo-950/30 border-indigo-500/30 text-indigo-200'
              }`}>
                <div className="shrink-0 mt-0.5">
                  {section.calloutBox.type === 'tip' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  {section.calloutBox.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                  {section.calloutBox.type === 'info' && <Sparkles className="w-5 h-5 text-indigo-400" />}
                  {section.calloutBox.type === 'rockstar-note' && <HelpCircle className="w-5 h-5 text-rose-400" />}
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-sm font-display tracking-wide uppercase">
                    {section.calloutBox.title}
                  </div>
                  <div className="text-sm leading-relaxed text-slate-300">
                    {section.calloutBox.content}
                  </div>
                </div>
              </div>
            )}

            {/* Step by step numbered list for guides */}
            {section.steps && (
              <div className="my-6 space-y-4 not-prose">
                {section.steps.map((step) => (
                  <div 
                    key={step.number}
                    className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-mono font-bold text-sm shrink-0">
                      {step.number}
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <div className="font-semibold text-base text-white">
                        {step.title}
                      </div>
                      <div className="text-sm text-slate-300 leading-relaxed">
                        {step.description}
                      </div>
                      {step.hint && (
                        <div className="text-xs font-mono text-amber-300/90 pt-1 flex items-center gap-1">
                          <span>💡 Pista:</span> {step.hint}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Editorial Pull Quote */}
            {section.quote && (
              <blockquote className="my-8 border-l-4 border-rose-500 pl-6 py-2 italic text-xl font-serif text-slate-200">
                "{section.quote.text}"
                {section.quote.author && (
                  <cite className="block text-xs font-mono font-normal text-slate-400 not-italic mt-2">
                    — {section.quote.author}
                  </cite>
                )}
              </blockquote>
            )}

            {/* Data Comparison Tables */}
            {section.tableData && (
              <div className="my-6 overflow-x-auto not-prose rounded-xl border border-slate-800">
                <table className="w-full text-left text-sm">
                  <caption className="p-3 text-xs font-mono text-slate-400 text-left bg-slate-900 border-b border-slate-800">
                    {section.tableData.caption}
                  </caption>
                  <thead className="bg-slate-900/90 text-xs font-mono uppercase text-slate-300">
                    <tr>
                      {section.tableData.headers.map((h, hIdx) => (
                        <th key={hIdx} className="p-3 font-semibold border-b border-slate-800">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-950/50">
                    {section.tableData.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-900/40 transition-colors">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="p-3 text-slate-300">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Section YouTube Video (Inline / Reorderable) */}
            {section.youtubeVideoId && (
              <div className="my-8 not-prose">
                <div className="text-xs font-mono uppercase tracking-widest text-[#ffc456] mb-2 flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-[#ff6486] fill-current" />
                  <span>Vídeo Incrustado</span>
                </div>
                <div className="video-responsive-container border border-slate-800 rounded-xl overflow-hidden shadow-xl bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${section.youtubeVideoId}?rel=0`}
                    title={section.youtubeCaption || section.heading || 'Vídeo YouTube'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    className="w-full h-full"
                  />
                </div>
                {section.youtubeCaption && (
                  <p className="text-xs text-slate-400 italic mt-2">
                    {section.youtubeCaption}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Fallback Global YouTube Video Player (only if no section has an inline video) */}
        {article.youtubeVideoId && !article.content.sections?.some(s => s.youtubeVideoId) && (
          <div className="my-10 not-prose">
            <div className="text-xs font-mono uppercase tracking-widest text-[#ffc456] mb-2 flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 text-[#ff6486] fill-current" />
              <span>Material Audiovisual Oficial</span>
            </div>
            <div className="video-responsive-container border border-slate-800 rounded-xl overflow-hidden shadow-xl bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${article.youtubeVideoId}?rel=0`}
                title="Tráiler y Gameplay Oficial GTA 6"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className="w-full h-full"
              />
            </div>
            <p className="text-xs text-slate-400 italic mt-2">
              Tráiler oficial de presentación publicado por Rockstar Games.
            </p>
          </div>
        )}

        {/* "En resumen" / Key Takeaways Box */}
        {article.content.takeaways && (
          <div className="my-10 p-6 rounded-xl bg-slate-900/80 border border-rose-500/30 not-prose">
            <div className="text-xs font-mono uppercase tracking-widest text-rose-400 font-bold mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>En Resumen · Puntos Clave</span>
            </div>
            <ul className="space-y-2">
              {article.content.takeaways.map((item, tIdx) => (
                <li key={tIdx} className="text-sm text-slate-200 flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags */}
        <div className="my-8 pt-6 border-t border-slate-800 not-prose">
          <div className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-3">
            Etiquetas del Artículo:
          </div>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-slate-300 hover:text-rose-400 transition-colors font-mono"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </article>

      {/* 🚀 ENGAGEMENT & SOCIAL VIRALITY SECTION */}
      <section className="my-10 p-6 sm:p-8 rounded-3xl bg-linear-to-br from-slate-900/90 via-slate-950/80 to-rose-950/30 border-2 border-rose-500/30 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-mono uppercase tracking-widest text-[#ffc456] font-bold flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-500" />
              <span>¿Te ha parecido útil este reportaje?</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white font-display">
              Apoya la investigación editorial de KAIROSION
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-light">
              Dale tu me gusta ❤️ y compártelo con tu escuadrón de GTA 6 en redes sociales.
            </p>
          </div>

          {/* Big Like Button */}
          <button
            onClick={handleToggleLike}
            className={`px-6 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer select-none active:scale-95 shadow-xl shrink-0 ${
              isLiked
                ? 'bg-rose-600 text-white shadow-rose-900/50 border border-rose-400'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700 hover:border-rose-500/60'
            }`}
          >
            <Heart 
              className={`w-6 h-6 transition-transform duration-300 ${
                isLiked ? 'fill-white text-white' : 'text-rose-400'
              } ${likePulse ? 'scale-135' : 'scale-100'}`} 
            />
            <div className="text-left">
              <div className="text-xs font-mono uppercase opacity-80">{isLiked ? '¡Te gusta!' : 'Dar Me Gusta'}</div>
              <div className="text-base font-extrabold font-mono">{likesCount} Likes</div>
            </div>
          </button>
        </div>

        {/* Social Share Grid */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-3 text-xs font-mono text-slate-400">
            <span>Compartir en un clic ({sharesCount} veces compartido):</span>
            <span className="text-[#ff6486] font-bold">100% LIBRE DE SPAM</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            <button
              onClick={() => handleSocialShare('whatsapp')}
              className="px-3 py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={() => handleSocialShare('twitter')}
              className="px-3 py-2.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Twitter className="w-4 h-4 text-cyan-400" />
              <span>X / Twitter</span>
            </button>

            <button
              onClick={() => handleSocialShare('facebook')}
              className="px-3 py-2.5 rounded-xl bg-blue-950/60 hover:bg-blue-900/80 border border-blue-500/40 text-blue-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Globe className="w-4 h-4 text-blue-400" />
              <span>Facebook</span>
            </button>

            <button
              onClick={() => handleSocialShare('telegram')}
              className="px-3 py-2.5 rounded-xl bg-sky-950/60 hover:bg-sky-900/80 border border-sky-500/40 text-sky-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4 text-sky-400" />
              <span>Telegram</span>
            </button>

            <button
              onClick={() => handleSocialShare('copy')}
              className="col-span-2 sm:col-span-1 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
              <span>{copied ? '¡Copiado!' : 'Copiar URL'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Author Card Box */}
      <div className="my-12 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start gap-5 shadow-lg">
        <img
          src={article.author.avatar}
          alt={article.author.name}
          referrerPolicy="no-referrer"
          className="w-20 h-20 rounded-2xl object-cover border-2 border-[#ff6486]/40 shrink-0 shadow-md"
        />
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#ff6486] font-bold">Escrito por</div>
              <div className="text-xl font-extrabold text-white font-display">{article.author.name}</div>
              <div className="text-xs text-[#ffc456] font-mono">{article.author.role}</div>
            </div>
          </div>

          {article.author.bio && (
            <p className="text-sm text-slate-300 leading-relaxed font-light">{article.author.bio}</p>
          )}

          {/* Author Social Channels */}
          {(article.author.socialTwitter || article.author.socialInstagram || article.author.socialYoutube || article.author.socialTiktok || article.author.socialTwitch || article.author.socialWebsite || article.author.email) && (
            <div className="pt-2 flex flex-wrap items-center gap-2">
              {article.author.socialTwitter && (
                <a
                  href={article.author.socialTwitter.startsWith('http') ? article.author.socialTwitter : `https://x.com/${article.author.socialTwitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-cyan-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <Twitter className="w-3.5 h-3.5" />
                  <span>{article.author.socialTwitter.startsWith('@') ? article.author.socialTwitter : 'X / Twitter'}</span>
                </a>
              )}

              {article.author.socialInstagram && (
                <a
                  href={article.author.socialInstagram.startsWith('http') ? article.author.socialInstagram : `https://instagram.com/${article.author.socialInstagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-pink-950/40 hover:bg-pink-900/60 border border-pink-500/30 text-xs font-mono text-pink-300 hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <Instagram className="w-3.5 h-3.5 text-pink-400" />
                  <span>Instagram</span>
                </a>
              )}

              {article.author.socialYoutube && (
                <a
                  href={article.author.socialYoutube.startsWith('http') ? article.author.socialYoutube : `https://youtube.com/${article.author.socialYoutube.startsWith('@') ? article.author.socialYoutube : '@' + article.author.socialYoutube}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-xs font-mono text-red-300 hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <Youtube className="w-3.5 h-3.5 text-red-500" />
                  <span>YouTube</span>
                </a>
              )}

              {article.author.socialTiktok && (
                <a
                  href={article.author.socialTiktok.startsWith('http') ? article.author.socialTiktok : `https://tiktok.com/@${article.author.socialTiktok.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <Video className="w-3.5 h-3.5 text-cyan-400" />
                  <span>TikTok</span>
                </a>
              )}

              {article.author.socialTwitch && (
                <a
                  href={article.author.socialTwitch.startsWith('http') ? article.author.socialTwitch : `https://twitch.tv/${article.author.socialTwitch}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-xs font-mono text-purple-300 hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Twitch</span>
                </a>
              )}

              {article.author.socialWebsite && (
                <a
                  href={article.author.socialWebsite.startsWith('http') ? article.author.socialWebsite : `https://${article.author.socialWebsite}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-[#ffc456] hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Sitio Web</span>
                </a>
              )}

              {article.author.email && (
                <a
                  href={`mailto:${article.author.email}`}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Comments & Discussion Section */}
      <section className="my-14 pt-8 border-t border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#ff6486]" />
            <h3 className="text-xl font-bold text-white font-display">
              Debate de la Comunidad ({comments.length})
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Comentarios moderados</span>
        </div>

        {/* Add comment form */}
        <form onSubmit={handleAddComment} className="mb-8 p-4 sm:p-5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3">
          <div className="text-xs font-mono uppercase text-[#ffc456] font-bold">
            Deja tu aportación o teoría sobre GTA 6
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Tu nombre o apodo"
              value={newCommentName}
              onChange={(e) => setNewCommentName(e.target.value)}
              className="px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-hidden focus:border-[#ff6486]"
              required
            />
          </div>
          <textarea
            rows={3}
            placeholder="¿Qué opinas de las mecánicas descritas en el artículo? Comparte tus impresiones..."
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-hidden focus:border-[#ff6486]"
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-[#ff6486] hover:bg-[#ff6486]/90 rounded-lg transition-colors shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Publicar comentario
            </button>
          </div>
        </form>

        {/* Comments list */}
        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{c.authorName}</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-[#ffc456] font-mono">{c.createdAt}</span>
                </div>
                <button
                  onClick={() => handleLikeComment(c.id)}
                  className="flex items-center gap-1 text-slate-400 hover:text-[#ff6486] transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span className="font-mono text-xs">{c.likes}</span>
                </button>
              </div>
              <p className="text-sm text-white/90 leading-relaxed font-light">
                {c.content}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* "También te puede interesar" Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="my-16 pt-8 border-t border-slate-800">
          <div className="mb-6">
            <div className="text-xs font-mono uppercase tracking-widest text-[#ff6486] font-bold mb-1">
              RECOMENDACIONES EDITORIALES
            </div>
            <h3 className="text-2xl font-bold text-white font-display">
              También te puede interesar
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <ArticleCard
                key={rel.id}
                article={rel}
                onSelectArticle={onSelectArticle}
                variant="standard"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
