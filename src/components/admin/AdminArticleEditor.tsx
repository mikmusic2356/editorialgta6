import React, { useState, useEffect, useRef } from 'react';
import { useCMS } from '../../context/CMSContext';
import { CMSArticle, ArticleStatus, MediaItem } from '../../types/cms';
import { MainCategorySlug, ContentVerificationType, ArticleSection, GuideStep, CalloutBox, TableData, ImageAsset } from '../../types';
import { AdminSection } from './AdminLayout';
import { 
  Save, 
  Eye, 
  History, 
  Sparkles, 
  Image as ImageIcon, 
  Youtube, 
  List, 
  Heading1, 
  Heading2, 
  Heading3, 
  Quote, 
  Table as TableIcon, 
  AlertTriangle, 
  CheckCircle2, 
  Smartphone, 
  Tablet, 
  Monitor, 
  ChevronDown, 
  ChevronRight, 
  X, 
  Plus, 
  Trash2, 
  RotateCcw,
  Search,
  ExternalLink,
  ShieldCheck,
  Tag,
  Link as LinkIcon,
  Layers,
  FileText,
  HelpCircle,
  Check,
  Info,
  Calendar,
  Clock,
  Cloud,
  Upload,
  Loader2,
  ArrowUp,
  ArrowDown,
  Video,
  GripVertical,
  User,
  UserCheck,
  Users,
  Heart,
  Share2,
  Flame
} from 'lucide-react';
import { resolveArticleSchemaType } from '../../utils/schemaGenerator';
import { RichTextEditor } from './RichTextEditor';
import { MediaPickerModal } from './MediaPickerModal';
import { uploadToR2 } from '../../lib/r2Service';
import { ARTICLES } from '../../data/articles';
import { MAIN_CATEGORIES } from '../../data/categories';

interface AdminArticleEditorProps {
  articleId?: string;
  onNavigate: (section: AdminSection, articleId?: string) => void;
  onClose: () => void;
}

const SAMPLE_PRESET_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1600&auto=format&fit=crop&q=80', label: 'Vice City Skyline Neón' },
  { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1600&auto=format&fit=crop&q=80', label: 'Lucia Caminos Retrato' },
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&auto=format&fit=crop&q=80', label: 'Jason Duval Retrato' },
  { url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&auto=format&fit=crop&q=80', label: 'Gameplay Tiroteo Urbano' },
  { url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&auto=format&fit=crop&q=80', label: 'Superdeportivo Nocturno' },
  { url: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=1600&auto=format&fit=crop&q=80', label: 'Arsenal & Armería Táctica' },
  { url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1600&auto=format&fit=crop&q=80', label: 'Manglares de Leonida' }
];

export const AdminArticleEditor: React.FC<AdminArticleEditorProps> = ({
  articleId,
  onNavigate,
  onClose
}) => {
  const { 
    articles, 
    categories, 
    authors, 
    media, 
    tags, 
    addArticle, 
    updateArticle, 
    revertToRevision,
    currentUser 
  } = useCMS();

  // Look up existing article in CMS state or fallback to default static articles
  const existingArticle = articleId 
    ? (articles.find(a => a.id === articleId || a.slug === articleId) || ARTICLES.find(a => a.id === articleId || a.slug === articleId) || null)
    : null;

  // Form State
  const [title, setTitle] = useState(existingArticle?.title || '');
  const [subtitle, setSubtitle] = useState(existingArticle?.subtitle || '');
  const [slug, setSlug] = useState(existingArticle?.slug || '');
  const [excerpt, setExcerpt] = useState(existingArticle?.excerpt || '');
  const [category, setCategory] = useState<MainCategorySlug>((existingArticle?.category as MainCategorySlug) || 'noticias');
  const [subcategorySlug, setSubcategorySlug] = useState<string>(existingArticle?.subcategorySlug || 'gta-6');
  const [status, setStatus] = useState<ArticleStatus>(existingArticle?.status || 'publicado');
  const [verificationType, setVerificationType] = useState<ContentVerificationType>(existingArticle?.verificationType || 'rumor-verificado');
  const [selectedAuthorName, setSelectedAuthorName] = useState(
    existingArticle?.author?.name || currentUser?.name || (authors.length > 0 ? authors[0].name : 'Redacción Editorial')
  );

  // Keep author selected if authors list loads or changes
  useEffect(() => {
    if (!selectedAuthorName && authors.length > 0) {
      setSelectedAuthorName(existingArticle?.author?.name || currentUser?.name || authors[0].name);
    }
  }, [authors, selectedAuthorName, existingArticle, currentUser]);
  
  // Featured Image
  const [featuredImageUrl, setFeaturedImageUrl] = useState(existingArticle?.featuredImage?.url || 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1600&auto=format&fit=crop&q=80');
  const [featuredImageAlt, setFeaturedImageAlt] = useState(existingArticle?.featuredImage?.alt || '');
  const [featuredImageCaption, setFeaturedImageCaption] = useState(existingArticle?.featuredImage?.caption || '');
  const [featuredImageBadge, setFeaturedImageBadge] = useState(existingArticle?.featuredImage?.badge || 'REPORTAJE CENTRAL');

  const [youtubeUrl, setYoutubeUrl] = useState(existingArticle?.youtubeVideoId ? `https://www.youtube.com/watch?v=${existingArticle.youtubeVideoId}` : '');
  const [selectedTags, setSelectedTags] = useState<string[]>(existingArticle?.tags || ['GTA 6', 'Leonida']);
  const [tagInput, setTagInput] = useState('');
  
  // Scheduled publication
  const [scheduledDate, setScheduledDate] = useState(existingArticle?.scheduledAt || '');

  // Engagement Metrics (Admin configurable / boostable)
  const [likes, setLikes] = useState<number>(existingArticle?.likes ?? 0);
  const [shares, setShares] = useState<number>(existingArticle?.shares ?? 0);
  const [views, setViews] = useState<number>(existingArticle?.views ?? 0);

  // SEO Fields
  const [seoTitle, setSeoTitle] = useState(existingArticle?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(existingArticle?.seoDescription || '');
  const [canonicalUrl, setCanonicalUrl] = useState(existingArticle?.canonicalUrl || '');

  // Lead and Content Sections
  const [leadText, setLeadText] = useState(existingArticle?.content?.leadText || '');
  
  // Convert existing sections or initialize
  const [sections, setSections] = useState<ArticleSection[]>(() => {
    if (existingArticle?.content?.sections && existingArticle.content.sections.length > 0) {
      return existingArticle.content.sections;
    }
    return [
      {
        heading: '1. Desglose Editorial y Análisis en Profundidad',
        paragraphs: ['<p>Escribe aquí el análisis en profundidad con el nuevo editor enriquecido...</p>']
      }
    ];
  });
  
  // Takeaways (En Resumen)
  const [takeaways, setTakeaways] = useState<string[]>(existingArticle?.content?.takeaways || [
    'Desarrollado exclusivamente para la nueva generación de plataformas.',
    'Nuevas físicas dinámicas y simulación meteorológica de Leonida.'
  ]);
  const [newTakeawayInput, setNewTakeawayInput] = useState('');

  // Related articles
  const [relatedSlugs, setRelatedSlugs] = useState<string[]>(existingArticle?.relatedSlugs || []);

  // UI state
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'seo' | 'history'>('editor');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'featured' | { sectionIdx: number } | null>(null);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);
  const [savedArticleSlug, setSavedArticleSlug] = useState<string>(existingArticle?.slug || '');
  const [isUploadingFeaturedR2, setIsUploadingFeaturedR2] = useState(false);
  const featuredFileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync state whenever articleId or existingArticle changes
  useEffect(() => {
    if (existingArticle) {
      setTitle(existingArticle.title || '');
      setSubtitle(existingArticle.subtitle || '');
      setSlug(existingArticle.slug || '');
      setExcerpt(existingArticle.excerpt || '');
      setCategory(existingArticle.category || 'gta-6');
      setSubcategorySlug(existingArticle.subcategorySlug || 'informacion');
      setStatus(existingArticle.status || 'publicado');
      setVerificationType(existingArticle.verificationType || 'rumor-verificado');
      setSelectedAuthorName(existingArticle.author?.name || currentUser?.name || (authors.length > 0 ? authors[0].name : ''));
      setFeaturedImageUrl(existingArticle.featuredImage?.url || 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1600&auto=format&fit=crop&q=80');
      setFeaturedImageAlt(existingArticle.featuredImage?.alt || '');
      setFeaturedImageCaption(existingArticle.featuredImage?.caption || '');
      setFeaturedImageBadge(existingArticle.featuredImage?.badge || 'REPORTAJE CENTRAL');
      setYoutubeUrl(existingArticle.youtubeVideoId ? `https://www.youtube.com/watch?v=${existingArticle.youtubeVideoId}` : '');
      setSelectedTags(existingArticle.tags || ['GTA 6', 'Leonida']);
      setScheduledDate(existingArticle.scheduledAt || '');
      setSeoTitle(existingArticle.seoTitle || '');
      setSeoDescription(existingArticle.seoDescription || '');
      setCanonicalUrl(existingArticle.canonicalUrl || '');
      setLeadText(existingArticle.content?.leadText || '');
      setSections(existingArticle.content?.sections && existingArticle.content.sections.length > 0 ? existingArticle.content.sections : [
        {
          heading: '1. Desglose Editorial y Análisis en Profundidad',
          paragraphs: ['<p>Escribe aquí el análisis en profundidad con el nuevo editor enriquecido...</p>']
        }
      ]);
      setTakeaways(existingArticle.content?.takeaways || [
        'Desarrollado exclusivamente para la nueva generación de plataformas.',
        'Nuevas físicas dinámicas y simulación meteorológica de Leonida.'
      ]);
      setRelatedSlugs(existingArticle.relatedSlugs || []);
      setSavedArticleSlug(existingArticle.slug || '');
    }
  }, [articleId, existingArticle?.id]);

  const handleFeaturedR2Upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingFeaturedR2(true);
      const result = await uploadToR2(file, file.name, 'articulos');
      setFeaturedImageUrl(result.url);
      if (!featuredImageAlt) {
        setFeaturedImageAlt(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
      setIsUploadingFeaturedR2(false);
      setShowSavedFeedback(true);
      setTimeout(() => setShowSavedFeedback(false), 3000);
    } catch (err: any) {
      console.error('Error uploading to Cloudflare R2:', err);
      setIsUploadingFeaturedR2(false);
      alert(`Error al subir a Cloudflare R2: ${err?.message || err}`);
    }
  };

  const handleMediaSelect = (item: { url: string; alt?: string; caption?: string; title?: string }) => {
    if (mediaPickerTarget === 'featured') {
      setFeaturedImageUrl(item.url);
      if (item.alt) setFeaturedImageAlt(item.alt);
      if (item.caption) setFeaturedImageCaption(item.caption);
    } else if (mediaPickerTarget && typeof mediaPickerTarget === 'object') {
      updateSectionImage(mediaPickerTarget.sectionIdx, {
        url: item.url,
        alt: item.alt || '',

        caption: item.caption || '',
        badge: 'ANÁLISIS'
      });
    }
    setMediaPickerOpen(false);
    setMediaPickerTarget(null);
  };

  // Auto-slug generator from title if slug is empty or user is creating
  useEffect(() => {
    if (!existingArticle && title && !slug) {
      const generated = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generated);
    }
  }, [title, existingArticle, slug]);

  // Extract YouTube ID from URL helper
  const extractYoutubeId = (url: string): string | undefined => {
    if (!url) return undefined;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : undefined;
  };

  const currentYoutubeId = extractYoutubeId(youtubeUrl);

  // Autosave logic
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      handleSave(false);
    }, 30000);

    return () => clearTimeout(timer);
  }, [title, leadText, sections, category, subcategorySlug, status, takeaways, featuredImageUrl]);

  // Word count and read time calculation
  const calculateTotalWords = () => {
    let count = (leadText || '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    sections.forEach(s => {
      s.paragraphs?.forEach(p => {
        count += (p || '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
      });
    });
    return count;
  };

  const estimatedReadTime = Math.max(1, Math.ceil(calculateTotalWords() / 200));

  // Current category data with 100% fallback safety
  const currentCategoryData = categories.find(c => c.slug === category) 
    || MAIN_CATEGORIES.find(c => c.slug === category) 
    || categories[0] 
    || MAIN_CATEGORIES[0];
  const currentSubcategories = currentCategoryData?.subcategories || [];

  // Save and Publish handler
  const handleSave = (manual: boolean = true, targetStatus?: ArticleStatus) => {
    if (!title.trim()) {
      if (manual) alert('Por favor, ingresa al menos un título para el artículo.');
      return;
    }

    const finalStatus: ArticleStatus = targetStatus || status || 'publicado';
    setStatus(finalStatus);
    setIsSaving(true);

    const matchedAuthor = authors.find(a => a.name === selectedAuthorName) || (authors.length > 0 ? authors[0] : null);
    const authorObj = matchedAuthor ? {
      name: matchedAuthor.name,
      role: matchedAuthor.role,
      avatar: matchedAuthor.avatar,
      bio: matchedAuthor.bio,
      email: matchedAuthor.email,
      socialTwitter: matchedAuthor.socialTwitter,
      socialInstagram: matchedAuthor.socialInstagram,
      socialYoutube: matchedAuthor.socialYoutube,
      socialTiktok: matchedAuthor.socialTiktok,
      socialTwitch: matchedAuthor.socialTwitch,
      socialWebsite: matchedAuthor.socialWebsite
    } : {
      name: selectedAuthorName || 'Redactor Editorial',
      role: 'Redactor Editorial',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
    };

    const finalYoutubeId = extractYoutubeId(youtubeUrl);
    const cleanSlug = (slug || title)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || `articulo-${Date.now()}`;

    const articlePayload: Omit<CMSArticle, 'id'> = {
      slug: cleanSlug,
      title: title.trim(),
      subtitle: subtitle.trim(),
      seoTitle: seoTitle || `${title.trim()} | KAIROSION`,
      seoDescription: seoDescription || excerpt || leadText.replace(/<[^>]+>/g, '').slice(0, 155),
      canonicalUrl: canonicalUrl || (category === 'gta-6' ? `https://kairosion.online/gta-6/${cleanSlug}` : `https://kairosion.online/gta-6/${category}/${cleanSlug}`),
      excerpt: excerpt || leadText.replace(/<[^>]+>/g, '').slice(0, 140),
      category,
      subcategorySlug,
      categoryLabel: currentCategoryData?.name || category.toUpperCase(),
      verificationType,
      author: authorObj,
      publishedAt: existingArticle?.publishedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      scheduledAt: finalStatus === 'programado' ? scheduledDate : undefined,
      readTimeMinutes: estimatedReadTime,
      tags: selectedTags,
      featuredImage: {
        url: featuredImageUrl,
        alt: featuredImageAlt || title,
        caption: featuredImageCaption,
        badge: featuredImageBadge
      },
      youtubeVideoId: finalYoutubeId,
      content: {
        leadText,
        sections,
        takeaways: takeaways.filter(Boolean)
      },
      likes: Math.max(0, Math.floor(Number(likes) || 0)),
      shares: Math.max(0, Math.floor(Number(shares) || 0)),
      views: Math.max(0, Math.floor(Number(views) || 0)),
      relatedSlugs,
      status: finalStatus
    };

    setSavedArticleSlug(cleanSlug);

    if (existingArticle) {
      updateArticle(
        existingArticle.id, 
        articlePayload, 
        manual 
          ? (finalStatus === 'publicado' ? 'Publicación en vivo en el portal' : 'Guardado manual desde el editor') 
          : 'Autoguardado'
      );
    } else {
      const created = addArticle(articlePayload);
      onNavigate('edit-article', created.id);
    }

    setLastSavedTime(new Date().toLocaleTimeString('es-ES'));
    setIsSaving(false);
    if (manual) {
      setShowSavedFeedback(true);
      setTimeout(() => setShowSavedFeedback(false), 5000);
    }
  };

  // Section handlers & Reordering
  const moveSectionUp = (index: number) => {
    if (index <= 0) return;
    setSections(prev => {
      const next = [...prev];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const moveSectionDown = (index: number) => {
    setSections(prev => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const addTextSection = () => {
    setSections(prev => [
      ...prev,
      {
        id: `sec-${Date.now()}`,
        type: 'text',
        heading: `${prev.length + 1}. Nueva Sección de Análisis`,
        paragraphs: ['<p>Escribe aquí el contenido enriquecido de esta sección...</p>']
      }
    ]);
  };

  const addVideoSection = () => {
    setSections(prev => [
      ...prev,
      {
        id: `sec-${Date.now()}`,
        type: 'video',
        heading: `${prev.length + 1}. Tráiler / Gameplay en Vídeo`,
        youtubeVideoId: '',
        youtubeCaption: 'Tráiler oficial de Grand Theft Auto VI publicado por Rockstar Games.',
        paragraphs: ['<p>Análisis de las escenas clave mostradas en este metraje...</p>']
      }
    ]);
  };

  const addCalloutSection = () => {
    setSections(prev => [
      ...prev,
      {
        id: `sec-${Date.now()}`,
        type: 'callout',
        heading: `${prev.length + 1}. Aviso Editorial`,
        calloutBox: {
          type: 'tip',
          title: 'Consejo Táctico de Leonida',
          content: 'Detalla aquí un dato clave o advertencia importante para los lectores...'
        }
      }
    ]);
  };

  const addSection = () => {
    addTextSection();
  };

  const updateSectionHeading = (index: number, newHeading: string) => {
    setSections(prev => prev.map((s, idx) => idx === index ? { ...s, heading: newHeading } : s));
  };

  const updateSectionContent = (index: number, htmlContent: string) => {
    setSections(prev => prev.map((s, idx) => {
      if (idx !== index) return s;
      return {
        ...s,
        paragraphs: [htmlContent]
      };
    }));
  };

  const updateSectionVideo = (index: number, urlOrId: string, caption?: string) => {
    const extractedId = extractYoutubeId(urlOrId) || urlOrId.trim();
    setSections(prev => prev.map((s, idx) => {
      if (idx !== index) return s;
      return {
        ...s,
        youtubeVideoId: extractedId,
        ...(caption !== undefined ? { youtubeCaption: caption } : {})
      };
    }));
  };

  const toggleSectionVideo = (index: number) => {
    setSections(prev => prev.map((s, idx) => {
      if (idx !== index) return s;
      if (s.youtubeVideoId !== undefined) {
        const { youtubeVideoId, youtubeCaption, ...rest } = s;
        return rest;
      }
      return {
        ...s,
        youtubeVideoId: '',
        youtubeCaption: 'Tráiler oficial de Grand Theft Auto VI.'
      };
    }));
  };

  const updateSectionImage = (index: number, image: ImageAsset | undefined) => {
    setSections(prev => prev.map((s, idx) => idx === index ? { ...s, image } : s));
  };

  const updateSectionCallout = (index: number, calloutBox: CalloutBox | undefined) => {
    setSections(prev => prev.map((s, idx) => idx === index ? { ...s, calloutBox } : s));
  };

  const removeSection = (index: number) => {
    setSections(prev => prev.filter((_, idx) => idx !== index));
  };

  // Takeaways handlers
  const handleAddTakeaway = () => {
    if (newTakeawayInput.trim()) {
      setTakeaways(prev => [...prev, newTakeawayInput.trim()]);
      setNewTakeawayInput('');
    }
  };

  const handleRemoveTakeaway = (idx: number) => {
    setTakeaways(prev => prev.filter((_, i) => i !== idx));
  };

  // Tag handlers
  const handleAddTag = () => {
    if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
      setSelectedTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tagToRemove));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* 1. TOP TOOLBAR & CONTROLS */}
      <div className="sticky top-0 z-20 bg-slate-950/95 backdrop-blur-md p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        
        {/* Left: Action tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'editor' ? 'bg-[#ff6486] text-white' : 'text-slate-400 hover:text-white bg-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Editor Enriquecido</span>
          </button>
          
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'preview' ? 'bg-[#ffc456] text-slate-950 font-bold' : 'text-slate-400 hover:text-white bg-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Vista Previa Real</span>
          </button>

          <button
            onClick={() => setActiveTab('seo')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'seo' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SEO & Schema</span>
          </button>

          {existingArticle?.revisions && existingArticle.revisions.length > 0 && (
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'history' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white bg-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Versiones ({existingArticle.revisions.length})</span>
            </button>
          )}
        </div>

        {/* Right: Status & Save Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {lastSavedTime && (
            <span className="text-[11px] font-mono text-slate-400 hidden md:inline">
              Guardado: {lastSavedTime}
            </span>
          )}

          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Estado:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ArticleStatus)}
              className={`bg-transparent text-xs font-bold focus:outline-hidden font-mono cursor-pointer ${
                status === 'publicado' ? 'text-emerald-400' : status === 'borrador' ? 'text-amber-400' : 'text-purple-400'
              }`}
            >
              <option value="publicado" className="bg-slate-900 text-emerald-400">● Publicado en Portal</option>
              <option value="borrador" className="bg-slate-900 text-amber-400">● Borrador Privado</option>
              <option value="revision" className="bg-slate-900 text-purple-400">● En Revisión</option>
              <option value="programado" className="bg-slate-900 text-blue-400">● Programado</option>
              <option value="archivado" className="bg-slate-900 text-slate-400">● Archivado</option>
            </select>
          </div>

          <button
            onClick={() => handleSave(true, 'borrador')}
            disabled={isSaving}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Guardar como borrador sin publicar en el portal público"
          >
            <Save className="w-3.5 h-3.5 text-slate-400" />
            <span>Guardar Borrador</span>
          </button>

          <button
            onClick={() => handleSave(true, 'publicado')}
            disabled={isSaving}
            className="px-4 py-2 rounded-lg bg-linear-to-r from-emerald-600 via-rose-600 to-pink-600 hover:opacity-90 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Guardar y publicar inmediatamente en la portada y categorías del portal"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>{isSaving ? 'Publicando...' : '🚀 Publicar en Portal'}</span>
          </button>

          {savedArticleSlug && (
            <button
              onClick={() => {
                const targetCat = category || 'gta-6';
                const sub = subcategorySlug && subcategorySlug !== 'all' ? `/${subcategorySlug}` : '';
                const viewUrl = targetCat === 'gta-6' ? `/gta-6${sub}/${savedArticleSlug}` : `/gta-6/${targetCat}${sub}/${savedArticleSlug}`;
                window.open(viewUrl, '_blank');
              }}
              className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg cursor-pointer"
              title="Ver artículo en el portal público en nueva pestaña"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
            title="Cerrar editor"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* 2. TAB 1: MAIN RICH TEXT EDITOR */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Writing Column (8 COLS) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Title & Subtitle Card */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-sm">
              <div>
                <label className="text-xs font-mono uppercase text-[#ffc456] block mb-1 font-bold">
                  Título Principal del Artículo (H1) *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Análisis Completo del Sistema de Físicas, Clima y Conducción en GTA 6"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-lg font-bold text-white placeholder-slate-600 focus:outline-hidden focus:border-[#ff6486] font-display"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
                  Subtítulo / Bajada Editorial
                </label>
                <input
                  type="text"
                  placeholder="Ej: Desglose técnico de la densidad de peatones y respuesta de la IA policial en Leonida..."
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-[#ff6486]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400 block">
                      Slug / URL (/articulo/{slug})
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const generated = title
                          .toLowerCase()
                          .normalize('NFD')
                          .replace(/[\u0300-\u036f]/g, '')
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/(^-|-$)/g, '');
                        if (generated) setSlug(generated);
                      }}
                      className="text-[10px] font-mono text-[#ffc456] hover:underline cursor-pointer flex items-center gap-1"
                      title="Generar slug idéntico al título para Search Console"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Sincronizar Slug (SEO)</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-[#ff6486] focus:outline-hidden focus:border-[#ff6486]"
                  />
                  <div className="mt-1 text-[10px] font-mono">
                    {slug === title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Slug 100% sincronizado con el título (Search Console)</span>
                      </span>
                    ) : (
                      <span className="text-amber-400 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>El slug difiere del título (Recomendado sincronizar)</span>
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                    Extracto Breve (Para tarjetas e índices)
                  </label>
                  <input
                    type="text"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Resumen corto de 1 o 2 frases..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-hidden focus:border-[#ff6486]"
                  />
                </div>
              </div>
            </div>

            {/* Rich Text Lead Paragraph */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase text-[#ff6486] font-bold block">
                  Párrafo de Entrada / Lead (Entradilla con Letra Capitular)
                </label>
                <span className="text-[11px] text-[#ffc456] font-mono">
                  Admite enlaces y texto enriquecido
                </span>
              </div>
              <RichTextEditor
                value={leadText}
                onChange={setLeadText}
                placeholder="El párrafo inicial que contextualiza la publicación con letra capitular..."
                minHeight="140px"
              />
            </div>

            {/* Info note regarding reorderable YouTube video blocks */}
            <div className="p-4 rounded-2xl bg-linear-to-r from-red-950/40 via-slate-900/60 to-slate-900/40 border border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center shrink-0">
                  <Youtube className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Vídeos de YouTube Reorganizables</span>
                    <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-mono text-[10px] font-bold">100% DINÁMICOS</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Inserta y mueve vídeos entre cualquier párrafo usando los botones <strong>▲ Subir</strong> / <strong>▼ Bajar</strong> en las secciones de abajo.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={addVideoSection}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-md active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Insertar Vídeo de YouTube</span>
              </button>
            </div>

            {/* Sections with Full Rich Text Editors, Section Images & Video Blocks */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#ff6486]" />
                    <span>Bloques y Secciones del Artículo ({sections.length})</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Organiza, mueve hacia arriba o abajo párrafos, vídeos de YouTube, imágenes y cajas informativas.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={addTextSection}
                    className="px-3 py-1.5 text-xs font-bold bg-[#ff6486] hover:bg-[#ff6486]/90 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    title="Añadir una nueva sección de texto/párrafo"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Párrafo</span>
                  </button>

                  <button
                    type="button"
                    onClick={addVideoSection}
                    className="px-3 py-1.5 text-xs font-bold bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    title="Añadir un bloque de vídeo de YouTube que puedes mover a cualquier posición"
                  >
                    <Youtube className="w-3.5 h-3.5" />
                    <span>+ Vídeo YouTube</span>
                  </button>

                  <button
                    type="button"
                    onClick={addCalloutSection}
                    className="px-3 py-1.5 text-xs font-bold bg-amber-600/80 hover:bg-amber-500 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    title="Añadir un recuadro informativo destacado"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>+ Caja</span>
                  </button>
                </div>
              </div>

              {sections.map((section, sIdx) => {
                const currentContent = section.paragraphs && section.paragraphs.length > 0 
                  ? section.paragraphs.join('') 
                  : '';
                const hasVideo = section.youtubeVideoId !== undefined || section.type === 'video';
                const sectionYoutubeId = extractYoutubeId(section.youtubeVideoId || '');

                return (
                  <div 
                    key={section.id || sIdx}
                    className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5 shadow-sm transition-all duration-200 hover:border-slate-700"
                  >
                    {/* Section Controls & Position Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                      
                      {/* Left: Position Indicator & Up/Down Movement Buttons */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-[#ffc456]">
                          <GripVertical className="w-3.5 h-3.5 text-slate-500" />
                          <span>Bloque #{sIdx + 1}</span>
                        </div>

                        {/* Move Up Button */}
                        <button
                          type="button"
                          onClick={() => moveSectionUp(sIdx)}
                          disabled={sIdx === 0}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-colors ${
                            sIdx === 0 
                              ? 'bg-slate-950/50 text-slate-600 cursor-not-allowed border border-slate-900' 
                              : 'bg-slate-800 hover:bg-[#ff6486] text-slate-200 hover:text-white cursor-pointer border border-slate-700'
                          }`}
                          title={sIdx === 0 ? 'Ya está en la primera posición' : 'Mover este bloque hacia arriba'}
                        >
                          <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Subir</span>
                        </button>

                        {/* Move Down Button */}
                        <button
                          type="button"
                          onClick={() => moveSectionDown(sIdx)}
                          disabled={sIdx === sections.length - 1}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-colors ${
                            sIdx === sections.length - 1 
                              ? 'bg-slate-950/50 text-slate-600 cursor-not-allowed border border-slate-900' 
                              : 'bg-slate-800 hover:bg-[#ff6486] text-slate-200 hover:text-white cursor-pointer border border-slate-700'
                          }`}
                          title={sIdx === sections.length - 1 ? 'Ya está en la última posición' : 'Mover este bloque hacia abajo'}
                        >
                          <ArrowDown className="w-3.5 h-3.5 text-rose-400" />
                          <span>Bajar</span>
                        </button>
                      </div>

                      {/* Right: Quick Action Toggles & Delete */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleSectionVideo(sIdx)}
                          className={`px-2.5 py-1 text-xs font-mono rounded-lg border transition-colors flex items-center gap-1 cursor-pointer ${
                            hasVideo 
                              ? 'bg-red-950/70 border-red-500/50 text-red-300' 
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                          title="Alternar vídeo de YouTube en esta posición"
                        >
                          <Youtube className="w-3.5 h-3.5 text-red-400" />
                          <span>{hasVideo ? 'Vídeo Activado' : '+ Vídeo'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (section.image) {
                              updateSectionImage(sIdx, undefined);
                            } else {
                              setMediaPickerTarget({ sectionIdx: sIdx });
                              setMediaPickerOpen(true);
                            }
                          }}
                          className={`px-2.5 py-1 text-xs font-mono rounded-lg border transition-colors flex items-center gap-1 cursor-pointer ${
                            section.image 
                              ? 'bg-pink-950/70 border-pink-500/50 text-pink-300' 
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-[#ffc456]" />
                          <span>{section.image ? 'Imagen Activa' : '+ Imagen'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (section.calloutBox) {
                              updateSectionCallout(sIdx, undefined);
                            } else {
                              updateSectionCallout(sIdx, {
                                type: 'tip',
                                title: 'Consejo Estratégico',
                                content: 'Información relevante para esta sección...'
                              });
                            }
                          }}
                          className={`px-2.5 py-1 text-xs font-mono rounded-lg border transition-colors flex items-center gap-1 cursor-pointer ${
                            section.calloutBox 
                              ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300' 
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <Info className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{section.calloutBox ? 'Caja Activa' : '+ Caja'}</span>
                        </button>

                        {sections.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSection(sIdx)}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg text-xs cursor-pointer ml-1"
                            title="Eliminar este bloque"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Section Heading Title */}
                    <div>
                      <label className="text-[11px] font-mono text-slate-400 block mb-1 uppercase">
                        Subtítulo / Encabezado H2 de este Bloque
                      </label>
                      <input
                        type="text"
                        value={section.heading || ''}
                        onChange={(e) => updateSectionHeading(sIdx, e.target.value)}
                        placeholder="Ej: Análisis del mapa, detalles de la misión, o título del vídeo..."
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm font-bold text-white focus:outline-hidden focus:border-[#ff6486] font-display"
                      />
                    </div>

                    {/* Dedicated Embedded YouTube Video Block in this position */}
                    {hasVideo && (
                      <div className="p-4 rounded-xl bg-slate-950 border-2 border-red-500/30 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono uppercase text-red-400 font-bold flex items-center gap-2">
                            <Youtube className="w-4 h-4 text-red-500" />
                            <span>Vídeo de YouTube en esta Posición (Bloque #{sIdx + 1})</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleSectionVideo(sIdx)}
                            className="text-[11px] text-red-400 hover:underline font-mono cursor-pointer"
                          >
                            Quitar Vídeo
                          </button>
                        </div>

                        <input
                          type="text"
                          placeholder="Pega la URL del vídeo de YouTube (Ej: https://www.youtube.com/watch?v=QdBZY2fkU-0)"
                          value={section.youtubeVideoId || ''}
                          onChange={(e) => updateSectionVideo(sIdx, e.target.value, section.youtubeCaption)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:outline-hidden focus:border-red-400"
                        />

                        {sectionYoutubeId && (
                          <div className="aspect-16/9 w-full max-w-lg rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-md">
                            <iframe
                              src={`https://www.youtube-nocookie.com/embed/${sectionYoutubeId}`}
                              title="Previsualización de YouTube en Sección"
                              allowFullScreen
                              className="w-full h-full"
                            />
                          </div>
                        )}

                        <input
                          type="text"
                          placeholder="Pie de vídeo descriptivo (opcional)..."
                          value={section.youtubeCaption || ''}
                          onChange={(e) => updateSectionVideo(sIdx, section.youtubeVideoId || '', e.target.value)}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300"
                        />
                      </div>
                    )}

                    {/* Rich Text Editor for this section */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-mono text-slate-400 uppercase">
                          Texto / Párrafos de este Bloque
                        </label>
                      </div>
                      <RichTextEditor
                        value={currentContent}
                        onChange={(newHtml) => updateSectionContent(sIdx, newHtml)}
                        placeholder="Redacta el contenido de esta sección. Puedes insertar negritas, listas, enlaces y formatear el texto..."
                        minHeight="160px"
                      />
                    </div>

                    {/* Section Additional Image & Media Block */}
                    {section.image && (
                      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono uppercase text-[#ffc456] font-bold flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5 text-[#ffc456]" />
                            Imagen en este Bloque
                          </span>
                          <button
                            type="button"
                            onClick={() => updateSectionImage(sIdx, undefined)}
                            className="text-[11px] text-red-400 hover:underline font-mono cursor-pointer"
                          >
                            Eliminar Imagen
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                          <div 
                            onClick={() => {
                              setMediaPickerTarget({ sectionIdx: sIdx });
                              setMediaPickerOpen(true);
                            }}
                            className="group relative cursor-pointer sm:col-span-4 aspect-16/9 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 hover:border-[#ff6486]"
                            title="Haz clic para cambiar imagen desde la galería"
                          >
                            <img
                              src={section.image.url}
                              alt={section.image.alt || 'Imagen de sección'}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-xs font-bold text-white gap-1">
                              <Sparkles className="w-4 h-4 text-[#ffc456]" />
                              <span>Cambiar desde Galería</span>
                            </div>
                          </div>
                          <div className="sm:col-span-8 space-y-2 text-xs">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="URL de la imagen (https://...)"
                                value={section.image.url}
                                onChange={(e) => updateSectionImage(sIdx, { ...section.image!, url: e.target.value })}
                                className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-white font-mono"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setMediaPickerTarget({ sectionIdx: sIdx });
                                  setMediaPickerOpen(true);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-[#ffc456]/20 hover:bg-[#ffc456]/30 text-[#ffc456] border border-[#ffc456]/40 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-[#ffc456]" />
                                <span>Galería</span>
                              </button>
                            </div>
                            <input
                              type="text"
                              placeholder="Pie de foto descriptivo..."
                              value={section.image.caption || ''}
                              onChange={(e) => updateSectionImage(sIdx, { ...section.image!, caption: e.target.value })}
                              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-300"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                placeholder="Texto ALT (SEO)"
                                value={section.image.alt || ''}
                                onChange={(e) => updateSectionImage(sIdx, { ...section.image!, alt: e.target.value })}
                                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-300 text-xs"
                              />
                              <input
                                type="text"
                                placeholder="Distintivo (Ej: FOTOGRAMA)"
                                value={section.image.badge || ''}
                                onChange={(e) => updateSectionImage(sIdx, { ...section.image!, badge: e.target.value })}
                                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-300 text-xs font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Section Callout Box Block */}
                    {section.calloutBox && (
                      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono uppercase text-[#ff6486] font-bold flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5 text-[#ff6486]" />
                            Caja Informativa en este Bloque
                          </span>
                          <button
                            type="button"
                            onClick={() => updateSectionCallout(sIdx, undefined)}
                            className="text-[11px] text-red-400 hover:underline font-mono cursor-pointer"
                          >
                            Eliminar Caja
                          </button>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <select
                              value={section.calloutBox.type}
                              onChange={(e) => updateSectionCallout(sIdx, { ...section.calloutBox!, type: e.target.value as any })}
                              className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-white font-mono"
                            >
                              <option value="tip">Consejo / Truco (Verde)</option>
                              <option value="warning">Advertencia (Ámbar)</option>
                              <option value="info">Información (Azul)</option>
                              <option value="rockstar-note">Nota Editorial (Rosa)</option>
                            </select>
                            <input
                              type="text"
                              placeholder="Título de la caja..."
                              value={section.calloutBox.title}
                              onChange={(e) => updateSectionCallout(sIdx, { ...section.calloutBox!, title: e.target.value })}
                              className="sm:col-span-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-white font-bold"
                            />
                          </div>
                          <textarea
                            rows={2}
                            placeholder="Contenido de la nota o consejo..."
                            value={section.calloutBox.content}
                            onChange={(e) => updateSectionCallout(sIdx, { ...section.calloutBox!, content: e.target.value })}
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-white"
                          />
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}

              {/* Bottom Quick-Add Bar */}
              <div className="flex flex-wrap items-center justify-center gap-3 p-4 bg-slate-950/60 rounded-2xl border border-dashed border-slate-800">
                <button
                  type="button"
                  onClick={addTextSection}
                  className="px-4 py-2 text-xs font-bold bg-[#ff6486] hover:bg-[#ff6486]/90 text-white rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Añadir Sección de Párrafos / Texto</span>
                </button>

                <button
                  type="button"
                  onClick={addVideoSection}
                  className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-500 text-white rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Youtube className="w-3.5 h-3.5" />
                  <span>+ Añadir Bloque de Vídeo YouTube</span>
                </button>

                <button
                  type="button"
                  onClick={addCalloutSection}
                  className="px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-slate-700"
                >
                  <Info className="w-3.5 h-3.5 text-amber-400" />
                  <span>+ Añadir Caja Informativa</span>
                </button>
              </div>
            </div>

            {/* Key Takeaways / En Resumen Editor */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-mono uppercase tracking-wider text-[#ffc456] font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#ffc456]" />
                  <span>Puntos Clave · «En Resumen» ({takeaways.length})</span>
                </h3>
              </div>

              <div className="space-y-2">
                {takeaways.map((item, tIdx) => (
                  <div key={tIdx} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[#ff6486] font-bold">•</span>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTakeaways(prev => prev.map((t, i) => i === tIdx ? val : t));
                      }}
                      className="flex-1 bg-transparent border-none text-xs text-white focus:outline-hidden"
                    />
                    <button
                      onClick={() => handleRemoveTakeaway(tIdx)}
                      className="p-1 text-slate-500 hover:text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Escribir nuevo punto clave..."
                    value={newTakeawayInput}
                    onChange={(e) => setNewTakeawayInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTakeaway();
                      }
                    }}
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#ffc456]"
                  />
                  <button
                    onClick={handleAddTakeaway}
                    className="px-4 py-2 bg-[#ffc456] hover:bg-[#ffc456]/90 text-slate-950 font-bold rounded-lg text-xs cursor-pointer"
                  >
                    Añadir Punto
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar Publishing Settings Column (4 COLS) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Taxonomy & Hierarchy */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-sm">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#ff6486] font-bold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#ff6486]" />
                Taxonomía & Categorización
              </h4>

              <div>
                <label className="text-[10px] font-mono uppercase text-[#ffc456] block mb-1 font-bold">
                  Categoría Principal
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    const newCat = e.target.value as MainCategorySlug;
                    setCategory(newCat);
                    const catObj = categories.find(c => c.slug === newCat) || MAIN_CATEGORIES.find(c => c.slug === newCat);
                    if (catObj && catObj.subcategories && catObj.subcategories.length > 0) {
                      setSubcategorySlug(catObj.subcategories[0].slug);
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-hidden focus:border-[#ff6486] font-medium cursor-pointer"
                >
                  {(categories.length > 0 ? categories : MAIN_CATEGORIES).map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-[#ffc456] block mb-1 font-bold">
                  Subcategoría
                </label>
                <select
                  value={subcategorySlug}
                  onChange={(e) => setSubcategorySlug(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-hidden focus:border-[#ff6486] font-medium cursor-pointer"
                >
                  {currentSubcategories.map((sub) => (
                    <option key={sub.slug} value={sub.slug}>{sub.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  Distintivo de Verificación Editorial
                </label>
                <select
                  value={verificationType}
                  onChange={(e) => setVerificationType(e.target.value as ContentVerificationType)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-hidden focus:border-[#ff6486] font-mono cursor-pointer"
                >
                  <option value="oficial">✓ Oficial Rockstar Games</option>
                  <option value="actualizacion">Actualización / Parche</option>
                  <option value="rumor-verificado">Rumor Verificado / Filtración</option>
                  <option value="guia-estrategica">Guía Paso a Paso</option>
                  <option value="truco-rapido">Truco / Consejo Rápido</option>
                  <option value="comunidad">Comunidad & Teorías</option>
                </select>
              </div>

              {/* Scheduled date */}
              {status === 'programado' && (
                <div className="pt-2 border-t border-slate-800">
                  <label className="text-[10px] font-mono uppercase text-blue-400 font-bold block mb-1">
                    Fecha y Hora de Publicación
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-blue-500/40 rounded-lg text-xs text-white"
                  />
                </div>
              )}
            </div>

            {/* Dedicated Author Selection Card */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#ffc456] font-bold flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#ffc456]" />
                  Autor & Redactor
                </h4>
                <button
                  type="button"
                  onClick={() => onNavigate('authors')}
                  className="text-[11px] font-mono text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                  title="Gestionar lista de autores y perfiles"
                >
                  <Users className="w-3 h-3 text-[#ffc456]" />
                  <span>Gestionar</span>
                </button>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1.5">
                  Seleccionar Autor del Artículo
                </label>
                <select
                  value={selectedAuthorName}
                  onChange={(e) => setSelectedAuthorName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-[#ff6486] font-medium cursor-pointer"
                >
                  {authors.map((auth) => (
                    <option key={auth.id} value={auth.name}>
                      {auth.name} — {auth.role}
                    </option>
                  ))}
                </select>
              </div>

              {/* Active Author Preview Box */}
              {(() => {
                const currentAuthor = authors.find(a => a.name === selectedAuthorName) || authors[0];
                if (!currentAuthor) return null;
                return (
                  <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl flex items-start gap-3">
                    <img
                      src={currentAuthor.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                      alt={currentAuthor.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700/60 shrink-0"
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-white truncate">{currentAuthor.name}</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-bold bg-[#ff6486]/20 text-[#ff6486] border border-[#ff6486]/30">
                          {currentAuthor.role}
                        </span>
                      </div>
                      {currentAuthor.bio && (
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {currentAuthor.bio}
                        </p>
                      )}
                      {/* Social icons presence */}
                      <div className="flex items-center gap-2 pt-1 text-[10px] font-mono">
                        {currentAuthor.socialTwitter && <span className="text-sky-400">Twitter/X ✓</span>}
                        {currentAuthor.socialInstagram && <span className="text-pink-400">Insta ✓</span>}
                        {currentAuthor.socialYoutube && <span className="text-red-400">YT ✓</span>}
                        {currentAuthor.socialTiktok && <span className="text-purple-400">TikTok ✓</span>}
                        {currentAuthor.socialTwitch && <span className="text-purple-300">Twitch ✓</span>}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Engagement & Popularity Metrics Card (Admin Only) */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-current" />
                  Métricas de Popularidad (Admin)
                </h4>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  SOLO ADMIN
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                Los espectadores en la web solo suman <strong className="text-white">+1 like real</strong> al pulsar el corazón. Como administrador puedes ajustar o inflar estos números cuando desees:
              </p>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[10px] font-mono uppercase text-rose-400 block mb-1 font-bold">
                    Likes (❤️)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={likes}
                    onChange={(e) => setLikes(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-rose-500/40 rounded-lg text-xs font-mono text-white text-center font-bold focus:outline-hidden focus:border-rose-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-cyan-400 block mb-1 font-bold">
                    Shares (📤)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={shares}
                    onChange={(e) => setShares(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-cyan-500/40 rounded-lg text-xs font-mono text-white text-center font-bold focus:outline-hidden focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-[#ffc456] block mb-1 font-bold">
                    Vistas (👁️)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={views}
                    onChange={(e) => setViews(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-[#ffc456]/40 rounded-lg text-xs font-mono text-white text-center font-bold focus:outline-hidden focus:border-[#ffc456]"
                  />
                </div>
              </div>

              {/* Fast Boost Buttons for Admin */}
              <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                <span className="text-[9px] font-mono uppercase text-slate-500">Impulso Rápido:</span>
                <button
                  type="button"
                  onClick={() => setLikes(prev => (prev || 0) + 25)}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 cursor-pointer"
                >
                  +25 Likes
                </button>
                <button
                  type="button"
                  onClick={() => setShares(prev => (prev || 0) + 10)}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 cursor-pointer"
                >
                  +10 Shares
                </button>
                <button
                  type="button"
                  onClick={() => setViews(prev => (prev || 0) + 150)}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/60 hover:bg-amber-900 border border-amber-500/40 text-amber-300 cursor-pointer"
                >
                  +150 Vistas
                </button>
                <button
                  type="button"
                  onClick={() => { setLikes(0); setShares(0); setViews(0); }}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white cursor-pointer ml-auto"
                  title="Restablecer a conteo real (0)"
                >
                  Reset (0)
                </button>
              </div>
            </div>

            {/* Featured Image Box (Portada Principal) */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3.5 shadow-sm">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#ff6486] font-bold flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#ff6486]" />
                  Imagen de Portada
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setMediaPickerTarget('featured');
                    setMediaPickerOpen(true);
                  }}
                  className="text-xs text-[#ffc456] hover:underline font-mono font-bold cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Abrir Galería de Medios</span>
                </button>
              </div>

              {/* Preview Thumbnail */}
              <div className="relative aspect-16/9 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 group">
                <img
                  src={featuredImageUrl}
                  alt={featuredImageAlt || title}
                  className="w-full h-full object-cover"
                />
                {featuredImageBadge && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/85 backdrop-blur-md text-[10px] font-mono font-bold text-[#ffc456] uppercase border border-slate-700">
                    {featuredImageBadge}
                  </div>
                )}
                <div 
                  onClick={() => {
                    setMediaPickerTarget('featured');
                    setMediaPickerOpen(true);
                  }}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-xs font-bold text-white gap-1.5"
                >
                  <ImageIcon className="w-4 h-4 text-[#ffc456]" />
                  <span>Cambiar Imagen de Portada</span>
                </div>
              </div>

              {/* Image URL Input */}
              <div>
                <label className="text-[10px] font-mono uppercase text-[#ffc456] block mb-1 font-bold">
                  URL de la Portada *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={featuredImageUrl}
                    onChange={(e) => setFeaturedImageUrl(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono"
                  />
                  <input
                    ref={featuredFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFeaturedR2Upload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isUploadingFeaturedR2}
                    onClick={() => featuredFileInputRef.current?.click()}
                    className="px-3 py-2 bg-gradient-to-r from-orange-500 to-[#ff6486] hover:opacity-95 text-slate-950 font-black text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 shadow-xs"
                    title="Subir archivo directo a Cloudflare R2"
                  >
                    {isUploadingFeaturedR2 ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Cloud className="w-3.5 h-3.5 fill-slate-950" />
                    )}
                    <span>{isUploadingFeaturedR2 ? 'Subiendo...' : 'R2 Subir'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMediaPickerTarget('featured');
                      setMediaPickerOpen(true);
                    }}
                    className="px-3 py-2 bg-[#ff6486] hover:bg-[#ff6486]/90 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 shadow-xs"
                    title="Abrir galería de medios"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Galería</span>
                  </button>
                </div>

              </div>

              {/* Quick Pick Sample Images */}
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1.5">
                  Plantillas Rápidas de Portada:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {SAMPLE_PRESET_IMAGES.slice(0, 4).map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => setFeaturedImageUrl(preset.url)}
                      className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-[#ff6486] text-left text-[10px] font-mono text-slate-300 truncate cursor-pointer transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                    Distintivo / Badge
                  </label>
                  <input
                    type="text"
                    placeholder="REPORTAJE CENTRAL"
                    value={featuredImageBadge}
                    onChange={(e) => setFeaturedImageBadge(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                    Texto ALT (SEO)
                  </label>
                  <input
                    type="text"
                    placeholder="Descripción visual..."
                    value={featuredImageAlt}
                    onChange={(e) => setFeaturedImageAlt(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  Pie de Foto / Caption
                </label>
                <input
                  type="text"
                  placeholder="Pie de foto visible debajo de la imagen..."
                  value={featuredImageCaption}
                  onChange={(e) => setFeaturedImageCaption(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                />
              </div>

              {/* Optional Global Fallback Trailer Video */}
              <div className="pt-2 border-t border-slate-800">
                <label className="text-[10px] font-mono uppercase text-red-400 block mb-1 font-bold flex items-center gap-1">
                  <Youtube className="w-3.5 h-3.5 text-red-500" />
                  <span>Vídeo Tráiler al Pie (Opcional)</span>
                </label>
                <input
                  type="text"
                  placeholder="URL YouTube (solo si no usas vídeos en secciones)"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono placeholder-slate-600"
                />
              </div>
            </div>

            {/* Tags & Hashtags */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-sm">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#ff6486] font-bold flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#ff6486]" />
                Etiquetas & Hashtags
              </h4>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Añadir etiqueta..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                />
                <button
                  onClick={handleAddTag}
                  className="px-3 py-1.5 bg-[#ff6486] hover:bg-[#ff6486]/90 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  +
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedTags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-[11px] font-mono text-[#ffc456]"
                  >
                    <span>#{t}</span>
                    <button
                      onClick={() => handleRemoveTag(t)}
                      className="text-slate-500 hover:text-red-400 cursor-pointer"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 3. TAB 2: RESPONSIVE REAL PREVIEW */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
            <span className="text-xs font-mono text-[#ffc456] font-bold">
              MODO DE PREVISUALIZACIÓN EN TIEMPO REAL · KAIROSION
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-2 rounded-lg flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
                  previewDevice === 'desktop' ? 'bg-[#ff6486] text-white font-bold' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => setPreviewDevice('tablet')}
                className={`p-2 rounded-lg flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
                  previewDevice === 'tablet' ? 'bg-[#ff6486] text-white font-bold' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Tablet className="w-4 h-4" />
                <span>Tablet</span>
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-2 rounded-lg flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
                  previewDevice === 'mobile' ? 'bg-[#ff6486] text-white font-bold' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Móvil</span>
              </button>
            </div>
          </div>

          <div className="flex justify-center p-4 bg-slate-950/90 rounded-2xl border border-slate-800/80 min-h-[600px] overflow-x-auto">
            <div 
              className={`bg-[#080c14] border border-slate-800 rounded-xl p-6 transition-all duration-300 ${
                previewDevice === 'desktop' ? 'w-full max-w-4xl' : previewDevice === 'tablet' ? 'w-[768px]' : 'w-[375px]'
              }`}
            >
              {/* Preview Content */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#ffc456] font-bold">
                  <span>{currentCategoryData?.name || 'GTA 6'}</span>
                  <span>·</span>
                  <span className="text-[#ff6486]">{subcategorySlug}</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display leading-tight">
                  {title || 'Título del artículo'}
                </h1>

                {subtitle && (
                  <p className="text-sm text-slate-300 font-light italic">
                    {subtitle}
                  </p>
                )}

                {/* Featured Image */}
                <div className="relative aspect-16/9 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                  <img src={featuredImageUrl} alt={title} className="w-full h-full object-cover" />
                  {featuredImageBadge && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-slate-950/85 backdrop-blur-md text-[10px] font-mono font-bold text-[#ffc456] uppercase border border-slate-700">
                      {featuredImageBadge}
                    </div>
                  )}
                </div>

                {/* Lead Text */}
                {leadText && (
                  <div 
                    className="text-base text-white leading-relaxed font-light border-l-2 border-[#ff6486] pl-4 prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: leadText }}
                  />
                )}

                {/* Top-Level YouTube Video (only if no sections have embedded video) */}
                {currentYoutubeId && !sections.some(s => s.youtubeVideoId) && (
                  <div className="aspect-16/9 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-md">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${currentYoutubeId}`}
                      title={title}
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                )}

                {/* Sections in Exact Reordered Sequence */}
                {sections.map((s, idx) => {
                  const sVid = s.youtubeVideoId ? (extractYoutubeId(s.youtubeVideoId) || s.youtubeVideoId) : null;
                  return (
                    <div key={s.id || idx} className="space-y-4 pt-4 border-t border-slate-800/80">
                      {s.heading && (
                        <h2 className="text-xl font-bold text-white font-display">
                          {s.heading}
                        </h2>
                      )}

                      {/* Embedded Section YouTube Video */}
                      {sVid && (
                        <div className="space-y-2">
                          <div className="aspect-16/9 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-md">
                            <iframe
                              src={`https://www.youtube-nocookie.com/embed/${sVid}`}
                              title={s.heading || 'Vídeo de YouTube'}
                              allowFullScreen
                              className="w-full h-full"
                            />
                          </div>
                          {s.youtubeCaption && (
                            <p className="text-xs text-slate-400 italic px-1">
                              {s.youtubeCaption}
                            </p>
                          )}
                        </div>
                      )}

                      {s.paragraphs?.map((p, pIdx) => (
                        <div 
                          key={pIdx} 
                          className="text-sm text-white/90 leading-relaxed prose prose-invert max-w-none font-light"
                          dangerouslySetInnerHTML={{ __html: p }}
                        />
                      ))}

                      {/* Section Image Preview */}
                      {s.image && s.image.url && (
                        <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                          <div className="relative aspect-16/9">
                            <img src={s.image.url} alt={s.image.alt || s.heading} className="w-full h-full object-cover" />
                            {s.image.badge && (
                              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/85 text-[10px] font-mono font-bold text-[#ffc456] uppercase border border-slate-700">
                                {s.image.badge}
                              </div>
                            )}
                          </div>
                          {s.image.caption && (
                            <div className="p-2.5 text-xs text-slate-300 bg-slate-950 border-t border-slate-800 italic">
                              {s.image.caption}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Callout Box Preview */}
                      {s.calloutBox && (
                        <div className="p-4 rounded-xl bg-slate-950 border border-[#ff6486]/40 text-xs space-y-1">
                          <div className="font-bold text-[#ff6486] uppercase font-mono">{s.calloutBox.title}</div>
                          <div className="text-white font-light">{s.calloutBox.content}</div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Takeaways Preview */}
                {takeaways.length > 0 && (
                  <div className="p-5 rounded-xl bg-slate-950 border border-[#ffc456]/40 space-y-2">
                    <div className="text-xs font-mono uppercase text-[#ffc456] font-bold">En Resumen · Puntos Clave</div>
                    <ul className="space-y-1.5 text-xs text-white font-light">
                      {takeaways.map((t, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#ff6486] font-bold">•</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 3: SEO & SCHEMA.ORG AUDIT */}
      {activeTab === 'seo' && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white font-display">
              Configuración SEO & Datos Estructurados Schema.org
            </h3>
            <p className="text-xs text-slate-400">
              Generación automática de Rich Results para Google Search Console.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* SEO Metadata Form */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
                  Meta Title ({seoTitle.length || title.length} / 60 car.)
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder={title ? `${title} | KAIROSION` : 'Título optimizado para buscadores'}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
                  Meta Description ({(seoDescription || excerpt).length} / 155 car.)
                </label>
                <textarea
                  rows={3}
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder={excerpt || 'Descripción concisa para fragmentos de Google...'}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
                  URL Canónica
                </label>
                <input
                  type="text"
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  placeholder={category === 'gta-6' ? `https://kairosion.online/gta-6/${slug || 'articulo'}` : `https://kairosion.online/gta-6/${category}/${slug || 'articulo'}`}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono"
                />
              </div>
            </div>

            {/* Google SERP Simulated Snippet */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="text-[10px] font-mono text-slate-500 uppercase">
                Simulador de Resultado en Google (SERP Preview)
              </div>
              <div className="space-y-1">
                <div className="text-xs text-slate-400 font-mono truncate">
                  https://kairosion.online › gta-6 {category !== 'gta-6' ? `› ${category}` : ''} › {slug || 'articulo'}
                </div>
                <div className="text-base text-blue-400 hover:underline font-medium cursor-pointer">
                  {seoTitle || title || 'Título del artículo en Google'}
                </div>
                <div className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-light">
                  {seoDescription || excerpt || leadText.replace(/<[^>]+>/g, '') || 'Fragmento descriptivo que aparecerá en los resultados de búsqueda de Google.'}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 text-xs text-emerald-400 font-mono">
                Tipo Schema.org asignado: <strong className="text-white font-bold">{resolveArticleSchemaType({ category, content: { leadText, sections } } as any)}</strong>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 5. TAB 4: REVISIONS & VERSION HISTORY */}
      {activeTab === 'history' && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white font-display">
              Historial de Revisiones y Versiones
            </h3>
            <p className="text-xs text-slate-400">
              Restaura cualquier versión anterior guardada por redactores o el asistente IA.
            </p>
          </div>

          <div className="divide-y divide-slate-800">
            {existingArticle?.revisions?.map((rev: any) => (
              <div key={rev.id} className="py-4 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono text-[#ffc456] font-bold">
                    {new Date(rev.timestamp).toLocaleString('es-ES')} · por {rev.authorName}
                  </div>
                  <div className="text-sm font-semibold text-white mt-1">
                    {rev.title}
                  </div>
                  <div className="text-xs text-slate-400 italic">
                    {rev.summary}
                  </div>
                </div>

                <button
                  onClick={() => revertToRevision(existingArticle.id, rev.id)}
                  className="px-3 py-1.5 text-xs font-mono rounded-lg bg-slate-800 hover:bg-[#ff6486] hover:text-white text-slate-300 transition-colors cursor-pointer shrink-0"
                >
                  Restaurar esta versión
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Bottom Save Action Bar & Toast Feedback */}
      <div className="fixed bottom-6 right-6 sm:right-10 z-40 flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-bottom-4 max-w-full">
        {showSavedFeedback && (
          <div className="px-4 py-2.5 rounded-xl bg-emerald-950 border border-emerald-500/60 text-emerald-300 font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{status === 'publicado' ? '¡Artículo publicado en vivo en el portal!' : '¡Borrador guardado en la base de datos!'}</span>
            {savedArticleSlug && (
              <button
                onClick={() => {
                  const targetCat = category || 'gta-6';
                  const sub = subcategorySlug && subcategorySlug !== 'all' ? `/${subcategorySlug}` : '';
                  const viewUrl = targetCat === 'gta-6' ? `/gta-6${sub}/${savedArticleSlug}` : `/gta-6/${targetCat}${sub}/${savedArticleSlug}`;
                  window.open(viewUrl, '_blank');
                }}
                className="ml-2 px-2.5 py-1 rounded bg-emerald-800 hover:bg-emerald-700 text-white text-[11px] font-mono inline-flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Ver en la Web</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        <div className="p-2 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-2xl flex items-center gap-2">
          <button
            onClick={() => handleSave(true, 'borrador')}
            disabled={isSaving}
            className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-slate-400" />
            <span>Guardar Borrador</span>
          </button>

          <button
            onClick={() => handleSave(true, 'publicado')}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-linear-to-r from-emerald-600 via-rose-600 to-pink-600 hover:opacity-90 text-white font-bold text-xs shadow-lg shadow-rose-950/50 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>{isSaving ? 'Guardando...' : '🚀 Publicar Artículo'}</span>
          </button>
        </div>
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => {
          setMediaPickerOpen(false);
          setMediaPickerTarget(null);
        }}
        onSelectMedia={handleMediaSelect}
        title={mediaPickerTarget === 'featured' ? 'Seleccionar Imagen de Portada' : 'Seleccionar Imagen para Sección'}
      />

    </div>
  );
};
