import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  MainCategorySlug, 
  CharacterProfile, 
  VehicleSpecs, 
  WeaponSpecs, 
  MapDistrict 
} from './types';
import { CMSProvider, useCMS } from './context/CMSContext';
import { ARTICLES } from './data/articles';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomeView } from './components/home/HomeView';
import { CookieConsentBanner } from './components/common/CookieConsentBanner';
import { ErrorBoundary } from './components/common/ErrorBoundary';

const ArticleDetail = React.lazy(() => import('./components/articles/ArticleDetail').then(m => ({ default: m.ArticleDetail })));
const CategoryView = React.lazy(() => import('./components/category/CategoryView').then(m => ({ default: m.CategoryView })));

import { CHARACTERS_DATA } from './data/characters';
import { VEHICLES_DATA } from './data/vehicles';
import { WEAPONS_DATA } from './data/weapons';
import { MAP_DISTRICTS } from './data/mapDistricts';

import type { AdminSection } from './components/admin/AdminLayout';

// Lazy Loaded Modals & Overlays (Zero Overhead for Initial Public Paint)
const SearchModal = React.lazy(() => import('./components/search/SearchModal').then(m => ({ default: m.SearchModal })));
const SEOInspectorModal = React.lazy(() => import('./components/seo/SEOInspectorModal').then(m => ({ default: m.SEOInspectorModal })));
const LegalModal = React.lazy(() => import('./components/legal/LegalModal').then(m => ({ default: m.LegalModal })));
const SitemapView = React.lazy(() => import('./components/seo/SitemapView').then(m => ({ default: m.SitemapView })));
const CharacterDetailModal = React.lazy(() => import('./components/characters/CharacterDetailModal').then(m => ({ default: m.CharacterDetailModal })));
const VehicleDetailModal = React.lazy(() => import('./components/vehicles/VehicleDetailModal').then(m => ({ default: m.VehicleDetailModal })));
const WeaponDetailModal = React.lazy(() => import('./components/weapons/WeaponDetailModal').then(m => ({ default: m.WeaponDetailModal })));
const MapExplorerModal = React.lazy(() => import('./components/map/MapExplorerModal').then(m => ({ default: m.MapExplorerModal })));

// Lazy Loaded Admin CMS Components (Code Splitting)
const AdminLayout = React.lazy(() => import('./components/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminDashboard = React.lazy(() => import('./components/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminArticlesList = React.lazy(() => import('./components/admin/AdminArticlesList').then(m => ({ default: m.AdminArticlesList })));
const AdminPopularity = React.lazy(() => import('./components/admin/AdminPopularity').then(m => ({ default: m.AdminPopularity })));
const AdminArticleEditor = React.lazy(() => import('./components/admin/AdminArticleEditor').then(m => ({ default: m.AdminArticleEditor })));
const AdminBanners = React.lazy(() => import('./components/admin/AdminBanners').then(m => ({ default: m.AdminBanners })));
const AdminBreakingNews = React.lazy(() => import('./components/admin/AdminBreakingNews').then(m => ({ default: m.AdminBreakingNews })));
const AdminAIAssistant = React.lazy(() => import('./components/admin/AdminAIAssistant').then(m => ({ default: m.AdminAIAssistant })));
const AdminCategories = React.lazy(() => import('./components/admin/AdminCategories').then(m => ({ default: m.AdminCategories })));
const AdminTags = React.lazy(() => import('./components/admin/AdminTags').then(m => ({ default: m.AdminTags })));
const AdminMediaLibrary = React.lazy(() => import('./components/admin/AdminMediaLibrary').then(m => ({ default: m.AdminMediaLibrary })));
const AdminAuthors = React.lazy(() => import('./components/admin/AdminAuthors').then(m => ({ default: m.AdminAuthors })));
const AdminMenus = React.lazy(() => import('./components/admin/AdminMenus').then(m => ({ default: m.AdminMenus })));
const AdminPages = React.lazy(() => import('./components/admin/AdminPages').then(m => ({ default: m.AdminPages })));
const AdminCookieSettings = React.lazy(() => import('./components/admin/AdminCookieSettings').then(m => ({ default: m.AdminCookieSettings })));
const AdminSettings = React.lazy(() => import('./components/admin/AdminSettings').then(m => ({ default: m.AdminSettings })));
const AdminLogin = React.lazy(() => import('./components/admin/AdminLogin').then(m => ({ default: m.AdminLogin })));

import { ArrowLeft, AlertCircle } from 'lucide-react';

export type ViewState = 
  | { type: 'portada' }
  | { type: 'sitemap' }
  | { type: 'article'; slug: string }
  | { type: 'category'; category: MainCategorySlug | string; subcategory?: string }
  | { type: 'character'; slug: string }
  | { type: 'vehicle'; slug: string }
  | { type: 'weapon'; slug: string }
  | { type: 'district'; slug: string }
  | { type: 'page'; slug: string }
  | { type: 'admin'; section?: AdminSection; articleId?: string }
  | { type: '404' };

const KNOWN_CATEGORIES: MainCategorySlug[] = [
  'gta-6',
  'personajes',
  'mapa',
  'vehiculos',
  'armas',
  'musica',
  'guias',
  'trucos-consejos',
  'rockstar-games',
  'noticias'
];

interface SimpleArticleRef {
  slug: string;
  category: string;
  subcategorySlug?: string;
}

function parsePathToView(pathname: string, articlesList: SimpleArticleRef[] = ARTICLES): ViewState {
  const clean = pathname.replace(/\/$/, '') || '/';

  if (clean === '/' || clean === '') {
    return { type: 'portada' };
  }

  if (clean === '/sitemap' || clean === '/sitemap.xml') {
    return { type: 'sitemap' };
  }

  // 1. Super Category Root & Subpaths: /gta-6, /gta-6/:category, /gta-6/:category/:sub, /gta-6/:category/:sub/:slug
  if (clean === '/gta-6') {
    return { type: 'category', category: 'gta-6' };
  }

  if (clean.startsWith('/gta-6/')) {
    const parts = clean.replace('/gta-6/', '').split('/').filter(Boolean);

    if (parts.length === 1) {
      // Could be category (/gta-6/personajes) or direct article (/gta-6/lucia-historia-gta-6)
      const isKnownCat = KNOWN_CATEGORIES.includes(parts[0] as MainCategorySlug);
      if (isKnownCat) {
        return { type: 'category', category: parts[0] as MainCategorySlug };
      }
      const isArticle = articlesList.find(a => a.slug.toLowerCase() === parts[0].toLowerCase());
      if (isArticle) {
        return { type: 'article', slug: isArticle.slug };
      }
      return { type: 'category', category: parts[0] as MainCategorySlug };
    }

    if (parts.length === 2) {
      // Check if parts[1] is an article
      const isArticle = articlesList.find(a => a.slug.toLowerCase() === parts[1].toLowerCase());
      if (isArticle) {
        return { type: 'article', slug: isArticle.slug };
      }
      return { type: 'category', category: parts[0] as MainCategorySlug, subcategory: parts[1] };
    }

    if (parts.length >= 3) {
      // Last part is the article slug
      const articleSlug = parts[parts.length - 1];
      return { type: 'article', slug: articleSlug };
    }
  }

  // 2. Legacy / Compatibility: /categoria/:category/:subcategory/:articleSlug
  if (clean.startsWith('/categoria/')) {
    const parts = clean.replace('/categoria/', '').split('/').filter(Boolean);
    if (parts.length === 1) {
      return { type: 'category', category: parts[0] as MainCategorySlug };
    }
    if (parts.length === 2) {
      const isArticle = articlesList.find(a => a.slug.toLowerCase() === parts[1].toLowerCase());
      if (isArticle) {
        return { type: 'article', slug: isArticle.slug };
      }
      return { type: 'category', category: parts[0] as MainCategorySlug, subcategory: parts[1] };
    }
    if (parts.length >= 3) {
      const articleSlug = parts[parts.length - 1];
      return { type: 'article', slug: articleSlug };
    }
  }

  // 3. Legacy / Direct article link: /articulo/:slug
  if (clean.startsWith('/articulo/')) {
    const slug = clean.replace('/articulo/', '');
    return { type: 'article', slug };
  }

  // 4. Interactive details
  if (clean.startsWith('/personaje/') || clean.startsWith('/personajes/')) {
    const slug = clean.replace(/^\/personajes?\//, '');
    return { type: 'category', category: 'personajes', subcategory: slug };
  }

  if (clean.startsWith('/vehiculo/') || clean.startsWith('/vehiculos/')) {
    const slug = clean.replace(/^\/vehiculos?\//, '');
    return { type: 'vehicle', slug };
  }

  if (clean.startsWith('/arma/') || clean.startsWith('/armas/')) {
    const slug = clean.replace(/^\/armas?\//, '');
    return { type: 'weapon', slug };
  }

  if (clean.startsWith('/distrito/') || clean.startsWith('/distritos/')) {
    const slug = clean.replace(/^\/distritos?\//, '');
    return { type: 'district', slug };
  }

  if (clean.startsWith('/pagina/')) {
    const slug = clean.replace('/pagina/', '');
    return { type: 'page', slug };
  }

  // 5. Admin routes
  if (clean.startsWith('/admin')) {
    const parts = clean.replace('/admin', '').split('/').filter(Boolean);
    if (parts[0] === 'edit-article' && parts[1]) {
      return { type: 'admin', section: 'edit-article', articleId: parts[1] };
    }
    if (parts[0]) {
      return { type: 'admin', section: parts[0] as AdminSection };
    }
    return { type: 'admin', section: 'dashboard' };
  }

  // 6. Direct category slug fallback: /:category or /:category/:sub or /:category/:sub/:slug
  const directSlug = clean.replace(/^\//, '');
  const directParts = directSlug.split('/').filter(Boolean);
  if (KNOWN_CATEGORIES.includes(directParts[0] as MainCategorySlug)) {
    const cat = directParts[0] as MainCategorySlug;
    if (directParts.length === 1) {
      return { type: 'category', category: cat };
    }
    if (directParts.length === 2) {
      const isArticle = articlesList.find(a => a.slug.toLowerCase() === directParts[1].toLowerCase());
      if (isArticle) {
        return { type: 'article', slug: isArticle.slug };
      }
      return { type: 'category', category: cat, subcategory: directParts[1] };
    }
    if (directParts.length >= 3) {
      return { type: 'article', slug: directParts[directParts.length - 1] };
    }
  }

  // Check if path is an article slug directly
  const directArticle = articlesList.find(a => a.slug.toLowerCase() === directSlug.toLowerCase());
  if (directArticle) {
    return { type: 'article', slug: directArticle.slug };
  }

  return { type: '404' };
}

function formatViewToPath(view: ViewState, articlesList: SimpleArticleRef[] = ARTICLES): string {
  switch (view.type) {
    case 'portada':
      return '/';
    case 'sitemap':
      return '/sitemap';
    case 'article': {
      const art = articlesList.find(a => a.slug === view.slug);
      if (art) {
        const sub = art.subcategorySlug && art.subcategorySlug !== 'all' ? `${art.subcategorySlug}/` : '';
        return `/gta-6/${art.category}/${sub}${art.slug}`;
      }
      return `/gta-6/${view.slug}`;
    }
    case 'category':
      if (view.category === 'gta-6') {
        return view.subcategory && view.subcategory !== 'all'
          ? `/gta-6/${view.subcategory}`
          : `/gta-6`;
      }
      return view.subcategory && view.subcategory !== 'all'
        ? `/gta-6/${view.category}/${view.subcategory}`
        : `/gta-6/${view.category}`;
    case 'character':
      return `/personaje/${view.slug}`;
    case 'vehicle':
      return `/vehiculo/${view.slug}`;
    case 'weapon':
      return `/arma/${view.slug}`;
    case 'district':
      return `/distrito/${view.slug}`;
    case 'page':
      return `/pagina/${view.slug}`;
    case 'admin':
      if (view.articleId) return `/admin/edit-article/${view.articleId}`;
      if (view.section && view.section !== 'dashboard') return `/admin/${view.section}`;
      return '/admin';
    case '404':
      return '/404';
    default:
      return '/';
  }
}

function AppContent() {
  const { articles, isAdminLoggedIn, recordPageView } = useCMS();

  // Initialize view from current browser URL path
  const [currentView, setCurrentView] = useState<ViewState>(() => {
    if (typeof window !== 'undefined') {
      return parsePathToView(window.location.pathname, articles.length > 0 ? articles : ARTICLES);
    }
    return { type: 'portada' };
  });

  // Modals state
  const [searchOpen, setSearchOpen] = useState(false);
  const [seoModalOpen, setSeoModalOpen] = useState(false);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<'about' | 'contact' | 'privacy' | 'cookies' | 'terms' | 'disclaimer'>('about');

  // Interactive detail modals
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterProfile | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleSpecs | null>(null);
  const [selectedWeapon, setSelectedWeapon] = useState<WeaponSpecs | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<MapDistrict | null>(null);

  // Synchronize modal state with currentView if navigated directly
  useEffect(() => {
    if (currentView.type === 'character') {
      const found = CHARACTERS_DATA.find(c => c.slug === currentView.slug || c.id === currentView.slug);
      setSelectedCharacter(found || null);
    } else {
      setSelectedCharacter(null);
    }

    if (currentView.type === 'vehicle') {
      const found = VEHICLES_DATA.find(v => v.id === currentView.slug);
      setSelectedVehicle(found || null);
    } else {
      setSelectedVehicle(null);
    }

    if (currentView.type === 'weapon') {
      const found = WEAPONS_DATA.find(w => w.id === currentView.slug);
      setSelectedWeapon(found || null);
    } else {
      setSelectedWeapon(null);
    }

    if (currentView.type === 'district') {
      const found = MAP_DISTRICTS.find(d => d.id === currentView.slug);
      setSelectedDistrict(found || null);
    } else {
      setSelectedDistrict(null);
    }

    if (currentView.type === 'page') {
      const slugToTab: Record<string, typeof legalTab> = {
        'sobre-nosotros': 'about',
        'contacto': 'contact',
        'politica-de-privacidad': 'privacy',
        'politica-de-cookies': 'cookies',
        'terminos-y-condiciones': 'terms',
        'aviso-legal-y-descargo': 'disclaimer',
      };
      const mappedTab = slugToTab[currentView.slug] || 'about';
      setLegalTab(mappedTab);
      setLegalModalOpen(true);
    } else {
      setLegalModalOpen(false);
    }
  }, [currentView]);

  // Centralized Navigation with URL history pushState
  const navigate = useCallback((newView: ViewState, replace: boolean = false) => {
    const targetPath = formatViewToPath(newView, articles);
    
    if (typeof window !== 'undefined') {
      if (replace) {
        window.history.replaceState(newView, '', targetPath);
      } else {
        window.history.pushState(newView, '', targetPath);
      }
    }

    setCurrentView(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [articles]);

  // Handle browser Back / Forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const view = parsePathToView(window.location.pathname, articles);
      setCurrentView(view);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [articles]);

  // Public published articles list (sorted by latest published date first)
  const publicArticles = articles
    .filter(a => a.status === 'publicado' || a.status === 'programado' || !a.status)
    .sort((a, b) => new Date(b.publishedAt || b.updatedAt || 0).getTime() - new Date(a.publishedAt || a.updatedAt || 0).getTime());

  // Dynamic Title, Description & Canonical Tag Synchronization with Hierarchical URL
  useEffect(() => {
    let title = 'KAIROSION | Portal Editorial de GTA 6 & Grand Theft Auto VI';
    let description = 'Portal editorial especializado en GTA 6: últimas noticias de Rockstar Games, guías completas, trucos, mapa interactivo de Leonida, vehículos y arsenal.';
    let canonicalPath = formatViewToPath(currentView, articles);

    if (currentView.type === 'article') {
      const art = articles.find((a) => a.slug.toLowerCase() === currentView.slug.toLowerCase() || a.id === currentView.slug);
      if (art) {
        title = `${art.seoTitle || art.title} | KAIROSION`;
        description = art.seoDescription || art.excerpt;
      }
    } else if (currentView.type === 'category') {
      const catLabel = currentView.category.toUpperCase().replace('-', ' ');
      title = `${catLabel} | Archivo Editorial GTA 6 - KAIROSION`;
      description = `Explora todas las noticias, guías y análisis de ${currentView.category} en KAIROSION.`;
    } else if (currentView.type === 'sitemap') {
      title = 'Mapa del Sitio Web & Sitemap XML | KAIROSION GTA 6';
      description = 'Directorio completo de URLs, índice de contenidos y sitemap XML indexable de KAIROSION.';
    } else if (currentView.type === 'character') {
      const char = CHARACTERS_DATA.find(c => c.slug === currentView.slug);
      if (char) {
        title = `${char.name} · Expediente de Personaje GTA 6 | KAIROSION`;
        description = char.bio?.slice(0, 150) || `Expediente oficial de ${char.name}.`;
      }
    } else if (currentView.type === 'admin') {
      title = 'KAIROSION Studio | Panel de Administración & CMS';
      description = 'Panel de administración editorial para redactores y moderadores de KAIROSION.';
    }

    document.title = title;

    // Meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }

    // Canonical link tag
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    const fullCanonical = `${window.location.origin}${canonicalPath}`;
    canonicalTag.setAttribute('href', fullCanonical);

    // OpenGraph URL
    let ogUrlTag = document.querySelector('meta[property="og:url"]');
    if (ogUrlTag) {
      ogUrlTag.setAttribute('content', fullCanonical);
    }

    // Auto record analytics pageview
    if (currentView.type !== 'admin') {
      recordPageView(canonicalPath, title);
    }
  }, [currentView, articles]);

  // Action handlers
  const handleSelectArticle = (rawTarget: string) => {
    if (!rawTarget) return;

    // Clean leading/trailing slashes, full domains, and prefixes
    const clean = rawTarget
      .replace(/^https?:\/\/[^\/]+/, '')
      .replace(/^\/gta-6\//, '')
      .replace(/^\/categoria\//, '')
      .replace(/^\/articulo\//, '')
      .replace(/^\//, '')
      .replace(/\/$/, '');

    const parts = clean.split('/').filter(Boolean);
    const candidateSlug = parts.length > 0 ? parts[parts.length - 1] : clean;

    // Check direct slug or ID match
    const foundArticle = articles.find(
      (a) =>
        a.slug.toLowerCase() === rawTarget.toLowerCase() ||
        a.slug.toLowerCase() === clean.toLowerCase() ||
        a.slug.toLowerCase() === candidateSlug.toLowerCase() ||
        a.id === rawTarget ||
        a.id === candidateSlug
    );

    if (foundArticle) {
      navigate({ type: 'article', slug: foundArticle.slug });
      return;
    }

    // Check if it corresponds to a category
    if (KNOWN_CATEGORIES.includes(clean as MainCategorySlug) || KNOWN_CATEGORIES.includes(candidateSlug as MainCategorySlug)) {
      const cat = (KNOWN_CATEGORIES.includes(clean as MainCategorySlug) ? clean : candidateSlug) as MainCategorySlug;
      navigate({ type: 'category', category: cat, subcategory: 'all' });
      return;
    }

    // Try parsing as a route if it has path structure
    if (rawTarget.startsWith('/')) {
      const parsedView = parsePathToView(rawTarget, articles);
      if (parsedView.type !== '404') {
        navigate(parsedView);
        return;
      }
    }

    // Fallback to 404
    navigate({ type: '404' });
  };

  const handleSelectCategory = (cat: MainCategorySlug | 'portada' | string, subcategory?: string) => {
    if (cat === 'portada') {
      navigate({ type: 'portada' });
    } else {
      navigate({ type: 'category', category: cat, subcategory: subcategory || 'all' });
    }
  };

  const handleSelectCharacter = (char: CharacterProfile) => {
    navigate({ type: 'category', category: 'personajes', subcategory: char.slug });
  };

  const handleSelectVehicle = (veh: VehicleSpecs) => {
    navigate({ type: 'vehicle', slug: veh.id });
  };

  const handleSelectWeapon = (wep: WeaponSpecs) => {
    navigate({ type: 'weapon', slug: wep.id });
  };

  const handleSelectDistrict = (dist: MapDistrict) => {
    navigate({ type: 'district', slug: dist.id });
  };

  const handleOpenLegal = (tab: 'about' | 'contact' | 'privacy' | 'cookies' | 'terms' | 'disclaimer') => {
    const tabToSlugMap = {
      about: 'sobre-nosotros',
      contact: 'contacto',
      privacy: 'politica-de-privacidad',
      cookies: 'politica-de-cookies',
      terms: 'terminos-y-condiciones',
      disclaimer: 'aviso-legal-y-descargo',
    };
    navigate({ type: 'page', slug: tabToSlugMap[tab] });
  };

  const handleAdminNavigate = (section: AdminSection, articleId?: string) => {
    navigate({ type: 'admin', section, articleId });
  };

  const handleNavigatePath = (path: string) => {
    const view = parsePathToView(path, articles);
    navigate(view);
  };

  const currentArticle = currentView.type === 'article' 
    ? articles.find((a) => a.slug.toLowerCase() === currentView.slug.toLowerCase() || a.id === currentView.slug) || null
    : null;

  const activeHeaderCategory = (() => {
    if (currentView.type === 'portada') return 'portada';
    if (currentView.type === 'category') return currentView.category;
    if (currentView.type === 'article') return currentArticle?.category || null;
    if (currentView.type === 'character') return 'personajes';
    if (currentView.type === 'vehicle') return 'vehiculos';
    if (currentView.type === 'weapon') return 'armas';
    if (currentView.type === 'district') return 'mapa';
    return null;
  })();

  // ==========================================
  // VIEW: ADMIN CMS DASHBOARD OR LOGIN
  // ==========================================
  if (currentView.type === 'admin') {
    const activeSection = currentView.section || 'dashboard';
    const editingId = currentView.articleId;

    if (!isAdminLoggedIn) {
      return (
        <React.Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-mono">Cargando...</div>}>
          <AdminLogin 
            onBackToPublicSite={() => navigate({ type: 'portada' })} 
          />
        </React.Suspense>
      );
    }

    return (
      <ErrorBoundary fallbackTitle="Error en el Panel de Administración">
        <React.Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-mono">Cargando Panel CMS...</div>}>
          <AdminLayout
            currentSection={activeSection}
            onNavigate={handleAdminNavigate}
            onBackToPublicSite={() => navigate({ type: 'portada' })}
            editingArticleId={editingId}
          >
            {activeSection === 'dashboard' && (
              <AdminDashboard onNavigate={handleAdminNavigate} />
            )}

            {activeSection === 'articles' && (
              <AdminArticlesList
                onNavigate={handleAdminNavigate}
                onPreviewArticle={(art) => {
                  navigate({ type: 'article', slug: art.slug });
                }}
              />
            )}

            {activeSection === 'popularity' && (
              <AdminPopularity
                onNavigate={handleAdminNavigate}
                onPreviewArticle={(art) => {
                  navigate({ type: 'article', slug: art.slug });
                }}
              />
            )}

            {(activeSection === 'new-article' || activeSection === 'edit-article') && (
              <AdminArticleEditor
                articleId={editingId}
                onNavigate={handleAdminNavigate}
                onClose={() => handleAdminNavigate('articles')}
              />
            )}

            {activeSection === 'banners' && (
              <AdminBanners />
            )}

            {activeSection === 'breaking-news' && (
              <AdminBreakingNews />
            )}

            {activeSection === 'ai-assistant' && (
              <AdminAIAssistant onNavigate={handleAdminNavigate} />
            )}

            {activeSection === 'categories' && (
              <AdminCategories />
            )}

            {activeSection === 'tags' && (
              <AdminTags />
            )}

            {activeSection === 'media' && (
              <AdminMediaLibrary />
            )}

            {activeSection === 'authors' && (
              <AdminAuthors />
            )}

            {activeSection === 'menus' && (
              <AdminMenus />
            )}

            {activeSection === 'pages' && (
              <AdminPages />
            )}

            {activeSection === 'cookies' && (
              <AdminCookieSettings />
            )}

            {activeSection === 'settings' && (
              <AdminSettings />
            )}
          </AdminLayout>
        </React.Suspense>
      </ErrorBoundary>
    );
  }

  // ==========================================
  // VIEW: PUBLIC PORTAL
  // ==========================================
  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 selection:bg-rose-500 selection:text-white">
      
      {/* 1. HEADER (Herramientas de Sitemap, Auditoría SEO y CMS ocultas para público general; visibles tras login de Admin) */}
      <Header
        currentCategory={activeHeaderCategory}
        onSelectCategory={handleSelectCategory}
        onSelectArticle={handleSelectArticle}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenSEOInspector={isAdminLoggedIn ? () => setSeoModalOpen(true) : undefined}
        onOpenSitemap={isAdminLoggedIn ? () => navigate({ type: 'sitemap' }) : undefined}
        onOpenAdmin={isAdminLoggedIn ? () => navigate({ type: 'admin', section: 'dashboard' }) : undefined}
      />

      {/* 2. MAIN EDITORIAL CONTENT ARCHITECTURE */}
      <div 
        className="flex-1 py-8"
        onClick={(e) => {
          const target = (e.target as HTMLElement).closest('a');
          if (!target) return;
          const href = target.getAttribute('href');
          const internalSlug = target.getAttribute('data-internal-article');
          
          if (internalSlug) {
            e.preventDefault();
            handleSelectArticle(internalSlug);
          } else if (href && href.startsWith('/') && !href.startsWith('//')) {
            e.preventDefault();
            handleNavigatePath(href);
          }
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <main className="w-full">
            
            {/* VIEW A: PORTADA / HOMEPAGE */}
            {currentView.type === 'portada' && (
              <HomeView
                articles={publicArticles}
                onSelectArticle={handleSelectArticle}
                onSelectCategory={handleSelectCategory}
                onSelectCharacter={handleSelectCharacter}
                onSelectVehicle={handleSelectVehicle}
                onSelectWeapon={handleSelectWeapon}
                onSelectDistrict={handleSelectDistrict}
              />
            )}

            {/* VIEW B: SITEMAP & DIRECTORIO WEB */}
            {currentView.type === 'sitemap' && (
              <React.Suspense fallback={<div className="p-12 text-center text-slate-400">Cargando Mapa del Sitio...</div>}>
                <SitemapView
                  onNavigate={handleNavigatePath}
                  onBackToHome={() => navigate({ type: 'portada' })}
                />
              </React.Suspense>
            )}

            {/* VIEW C: ARTICLE DETAIL (With Hierarchical URL Traceability) */}
            {currentView.type === 'article' && currentArticle && (
              <React.Suspense fallback={<div className="py-20 text-center text-slate-400 font-mono">Cargando artículo...</div>}>
                <ArticleDetail
                  key={currentArticle.slug || currentArticle.id}
                  article={currentArticle}
                  onBack={() => {
                    if (currentArticle.category) {
                      navigate({ 
                        type: 'category', 
                        category: currentArticle.category,
                        subcategory: currentArticle.subcategorySlug && currentArticle.subcategorySlug !== 'all' 
                          ? currentArticle.subcategorySlug 
                          : undefined
                      });
                    } else {
                      navigate({ type: 'portada' });
                    }
                  }}
                  onSelectCategory={handleSelectCategory}
                  onSelectArticle={handleSelectArticle}
                />
              </React.Suspense>
            )}

            {/* VIEW D: MAIN CATEGORY & SUBCATEGORY ARCHIVE */}
            {currentView.type === 'category' && (
              <React.Suspense fallback={<div className="py-20 text-center text-slate-400 font-mono">Cargando sección...</div>}>
                <CategoryView
                  categorySlug={currentView.category}
                  initialSubCategory={currentView.subcategory || 'all'}
                  articles={publicArticles}
                  onSelectArticle={handleSelectArticle}
                  onBackToHome={() => navigate({ type: 'portada' })}
                  onSelectCategory={handleSelectCategory}
                  onSelectCharacter={handleSelectCharacter}
                  onSelectVehicle={handleSelectVehicle}
                  onSelectWeapon={handleSelectWeapon}
                  onSelectDistrict={handleSelectDistrict}
                />
              </React.Suspense>
            )}

            {/* VIEW E: 404 NOT FOUND */}
            {currentView.type === '404' && (
              <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4 max-w-lg mx-auto">
                <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
                <h1 className="text-3xl font-extrabold text-white font-display">404 · Página no encontrada</h1>
                <p className="text-sm text-slate-400">
                  La dirección que buscas no existe o ha sido reubicada. Puedes explorar el mapa del sitio para encontrar todo el contenido disponible.
                </p>
                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => navigate({ type: 'portada' })}
                    className="px-5 py-2 text-xs font-bold text-slate-950 bg-rose-400 hover:bg-rose-300 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Volver a la portada
                  </button>

                  <button
                    onClick={() => navigate({ type: 'sitemap' })}
                    className="px-5 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                  >
                    Ver Mapa del Sitio (/sitemap)
                  </button>
                </div>
              </div>
            )}

          </main>

        </div>
      </div>

      {/* 3. FOOTER */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenLegalModal={handleOpenLegal}
        onOpenSEOInspector={isAdminLoggedIn ? () => setSeoModalOpen(true) : undefined}
        onOpenSitemap={isAdminLoggedIn ? () => navigate({ type: 'sitemap' }) : undefined}
        onOpenAdmin={isAdminLoggedIn ? () => navigate({ type: 'admin', section: 'dashboard' }) : undefined}
        onOpenCookieSettings={() => handleOpenLegal('cookies')}
      />

      {/* 4. MODALS & INTERACTIVE DOSSIERS WITH DEDICATED URLS (Lazy Loaded) */}
      <React.Suspense fallback={null}>
        {searchOpen && (
          <SearchModal
            isOpen={searchOpen}
            onClose={() => setSearchOpen(false)}
            articles={publicArticles}
            onSelectArticle={handleSelectArticle}
          />
        )}

        {seoModalOpen && (
          <SEOInspectorModal
            isOpen={seoModalOpen}
            onClose={() => setSeoModalOpen(false)}
            currentArticle={currentArticle}
          />
        )}

        {legalModalOpen && (
          <LegalModal
            isOpen={legalModalOpen}
            onClose={() => {
              setLegalModalOpen(false);
              if (currentView.type === 'page') {
                navigate({ type: 'portada' });
              }
            }}
            defaultTab={legalTab}
          />
        )}

        {selectedCharacter && (
          <CharacterDetailModal
            character={selectedCharacter}
            onClose={() => {
              setSelectedCharacter(null);
              if (currentView.type === 'character') {
                navigate({ type: 'category', category: 'personajes' });
              }
            }}
            articles={publicArticles}
            onSelectArticle={handleSelectArticle}
          />
        )}

        {selectedVehicle && (
          <VehicleDetailModal
            vehicle={selectedVehicle}
            onClose={() => {
              setSelectedVehicle(null);
              if (currentView.type === 'vehicle') {
                navigate({ type: 'category', category: 'vehiculos' });
              }
            }}
          />
        )}

        {selectedWeapon && (
          <WeaponDetailModal
            weapon={selectedWeapon}
            onClose={() => {
              setSelectedWeapon(null);
              if (currentView.type === 'weapon') {
                navigate({ type: 'category', category: 'armas' });
              }
            }}
          />
        )}

        {selectedDistrict && (
          <MapExplorerModal
            district={selectedDistrict}
            onClose={() => {
              setSelectedDistrict(null);
              if (currentView.type === 'district') {
                navigate({ type: 'category', category: 'mapa' });
              }
            }}
          />
        )}
      </React.Suspense>

      {/* 5. COOKIE CONSENT BANNER & SETTINGS */}
      <CookieConsentBanner />

    </div>
  );
}

export default function App() {
  return (
    <CMSProvider>
      <AppContent />
    </CMSProvider>
  );
}
