import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Menu, 
  X, 
  Flame, 
  ShieldCheck, 
  FileCode,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Newspaper,
  Compass,
  Users,
  MapPin,
  Car,
  Crosshair,
  Shield,
  Layers,
  Home,
  Database,
  ArrowRight,
  Music
} from 'lucide-react';
import { MainCategorySlug } from '../../types';
import { SITE_TAXONOMY } from '../../data/categories';
import { useCMS } from '../../context/CMSContext';
import { BrandLogo } from '../common/BrandLogo';
import { BreakingNewsTicker } from '../common/BreakingNewsTicker';

interface HeaderProps {
  currentCategory?: MainCategorySlug | 'portada' | string | null;
  onSelectCategory: (category: MainCategorySlug | 'portada' | string, subcategorySlug?: string) => void;
  onSelectArticle?: (slug: string) => void;
  onOpenSearch: () => void;
  onOpenSEOInspector: () => void;
  onOpenSitemap?: () => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  onSelectCategory,
  onSelectArticle,
  onOpenSearch,
  onOpenSEOInspector,
  onOpenSitemap,
  onOpenAdmin,
}) => {
  const { categories, isTursoConnected } = useCMS();
  const navCategories = categories && categories.length > 0 ? categories : SITE_TAXONOMY;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navContainerRef = useRef<HTMLElement | null>(null);
  const headerWrapperRef = useRef<HTMLDivElement | null>(null);

  // Close dropdowns on click outside or escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (headerWrapperRef.current && !headerWrapperRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };

    // Allow mouse wheel to horizontally scroll the category nav smoothly
    const navEl = navContainerRef.current;
    const handleWheel = (e: WheelEvent) => {
      if (navEl && e.deltaY !== 0) {
        e.preventDefault();
        navEl.scrollLeft += e.deltaY;
      }
    };

    if (navEl) {
      navEl.addEventListener('wheel', handleWheel, { passive: false });
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      if (navEl) {
        navEl.removeEventListener('wheel', handleWheel);
      }
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMouseEnter = (slug: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(slug);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 250);
  };

  const handleDropdownPanelMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
  };

  const scrollNav = (direction: 'left' | 'right') => {
    if (navContainerRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      navContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return Flame;
      case 'Newspaper': return Newspaper;
      case 'Compass': return Compass;
      case 'Sparkles': return Sparkles;
      case 'Users': return Users;
      case 'MapPin': return MapPin;
      case 'Car': return Car;
      case 'Crosshair': return Crosshair;
      case 'Shield': return Shield;
      case 'Layers': return Layers;
      case 'Music': return Music;
      default: return Sparkles;
    }
  };

  // Find the currently active category for the megamenu panel
  const activeCategoryObj = activeDropdown ? navCategories.find(c => c.slug === activeDropdown) : null;
  const ActiveIcon = activeCategoryObj ? getCategoryIcon(activeCategoryObj.iconName) : null;

  return (
    <header 
      ref={headerWrapperRef}
      className="sticky top-0 z-40 w-full bg-slate-950/98 backdrop-blur-md border-b border-slate-800/80 shadow-lg"
    >
      
      {/* ========================================================= */}
      {/* 1. TOPE SUPERIOR: Breaking News Ticker (Última Hora)      */}
      {/* ========================================================= */}
      <BreakingNewsTicker 
        onSelectArticle={onSelectArticle} 
        onSelectCategory={(cat) => onSelectCategory(cat)} 
      />

      {/* ========================================================= */}
      {/* 2. FILA CENTRAL: Logo, Barra de Búsqueda y Botones Clave  */}
      {/* ========================================================= */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Lado Izquierdo: Brand Logo KAIROSION */}
        <div className="shrink-0">
          <BrandLogo
            size="md"
            subtitleText="PORTAL EDITORIAL GTA 6"
            onClick={() => {
              onSelectCategory('portada');
              setMobileMenuOpen(false);
              setActiveDropdown(null);
            }}
          />
        </div>

        {/* Centro: Barra de Búsqueda Rápida Ampliada */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-slate-400 bg-slate-900/90 border border-slate-800 rounded-xl hover:border-[#ff6486]/60 hover:text-white transition-all cursor-pointer shadow-inner group"
            aria-label="Buscar artículos, guías y contenido"
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#ffc456] group-hover:scale-110 transition-transform" />
              <span className="text-slate-300">Buscar noticias, guías, mapa, trucos...</span>
            </span>
            <kbd className="px-2 py-0.5 text-[10px] font-mono font-bold bg-slate-800 text-[#ffc456] rounded-md border border-slate-700">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Lado Derecho: Botones de Acción (SEO, Sitemap, Panel CMS) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Botón de Búsqueda Móvil */}
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2 text-white bg-slate-900 border border-slate-800 rounded-lg hover:border-[#ff6486] transition-colors cursor-pointer"
            aria-label="Buscar en el portal"
          >
            <Search className="w-4 h-4 text-[#ffc456]" />
          </button>

          {/* Botón Sitemap XML */}
          {onOpenSitemap && (
            <button
              onClick={onOpenSitemap}
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-300 bg-slate-900/90 border border-slate-800 rounded-lg hover:border-[#ff6486] hover:text-white transition-colors cursor-pointer font-mono"
              title="Ver Mapa del Sitio Web y Sitemap XML"
              aria-label="Mapa del Sitio Web"
            >
              <FileCode className="w-3.5 h-3.5 text-[#ff6486]" />
              <span>Sitemap</span>
            </button>
          )}

          {/* Botón Auditoría SEO */}
          <button
            onClick={onOpenSEOInspector}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#ffc456] bg-slate-900/90 border border-[#ffc456]/30 rounded-lg hover:bg-slate-800 hover:border-[#ffc456] transition-colors cursor-pointer font-mono"
            title="Inspeccionar SEO, Schema.org y Arquitectura"
            aria-label="Auditoría Técnica de SEO y Schema.org"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#ffc456]" />
            <span className="hidden lg:inline">Auditoría SEO</span>
          </button>

          {/* Botón Destacado Panel CMS con Turso DB */}
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-[#ff6486] via-rose-400 to-[#ffc456] hover:opacity-95 rounded-lg shadow-md hover:shadow-[#ff6486]/20 transition-all cursor-pointer font-mono shrink-0"
              title="Acceso al Panel de Administración & CMS (Conectado a Turso DB)"
            >
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
              <span className="hidden xs:inline">Panel CMS</span>
              <span className="xs:hidden">CMS</span>
              {isTursoConnected && (
                <span className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.2 bg-slate-950/20 rounded text-[9px] font-mono">
                  <Database className="w-2.5 h-2.5" />
                  <span>Turso</span>
                </span>
              )}
            </button>
          )}

          {/* Toggle Menú Móvil */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#ff6486]" /> : <Menu className="w-5 h-5 text-slate-200" />}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. FILA INFERIOR: Menú Completo de TODAS las Categorías   */}
      {/* ========================================================= */}
      <div className="relative w-full bg-slate-900/95 border-t border-b border-slate-800/80">
        
        {/* Contenedor con flechas de navegación y barra de categorías */}
        <div className="max-w-7xl mx-auto px-2 sm:px-4 relative flex items-center">
          
          {/* Flecha Izquierda para desplazamiento */}
          <button
            onClick={() => scrollNav('left')}
            className="hidden sm:flex items-center justify-center w-7 h-7 rounded-full bg-slate-950/90 text-slate-400 hover:text-[#ffc456] hover:bg-slate-800 border border-slate-700/80 shadow-md transition-all shrink-0 mr-1 z-10 opacity-70 hover:opacity-100 cursor-pointer"
            aria-label="Desplazar categorías hacia la izquierda"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Barra Horizontal de Categorías (Sin barra nativa blanca) */}
          <nav 
            ref={navContainerRef}
            aria-label="Navegación de categorías"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            className="category-nav-bar no-scrollbar flex-1 flex items-center justify-start overflow-x-auto gap-1 sm:gap-1.5 py-2 text-xs font-semibold text-slate-300 select-none scroll-smooth"
          >
            {/* Portada / Home Link */}
            <button
              onClick={() => {
                onSelectCategory('portada');
                setActiveDropdown(null);
              }}
              onMouseEnter={() => setActiveDropdown(null)}
              className={`transition-all whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer shrink-0 ${
                currentCategory === 'portada' 
                  ? 'text-[#ffc456] bg-slate-950 border border-[#ffc456]/50 font-bold shadow-xs' 
                  : 'text-slate-200 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <Home className="w-3.5 h-3.5 text-[#ffc456]" />
              <span>Portada</span>
            </button>

            {/* Divisor vertical */}
            <div className="h-4 w-px bg-slate-800 shrink-0 mx-1" />

            {/* TODAS LAS CATEGORÍAS DISPONIBLES EN FILA */}
            {navCategories.map((cat) => {
              const isActive = currentCategory === cat.slug;
              const isOpen = activeDropdown === cat.slug;
              const hasSubcategories = cat.subcategories && cat.subcategories.length > 0;
              const Icon = getCategoryIcon(cat.iconName);

              return (
                <div
                  key={cat.slug}
                  className="relative shrink-0"
                  onMouseEnter={() => handleMouseEnter(cat.slug)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (hasSubcategories) {
                        setActiveDropdown(isOpen ? null : cat.slug);
                      } else {
                        onSelectCategory(cat.slug);
                        setActiveDropdown(null);
                      }
                    }}
                    onFocus={() => setActiveDropdown(cat.slug)}
                    aria-haspopup={hasSubcategories ? 'true' : undefined}
                    aria-expanded={hasSubcategories ? isOpen : undefined}
                    className={`transition-all whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer ${
                      isActive 
                        ? 'text-[#ffc456] bg-slate-950 border border-[#ffc456]/50 font-bold shadow-xs' 
                        : 'text-slate-300 hover:text-[#ffc456] hover:bg-slate-800/70'
                    } ${isOpen ? 'bg-slate-950 text-[#ffc456] border border-slate-700 shadow-md ring-1 ring-[#ff6486]/30' : ''}`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive || isOpen ? 'text-[#ff6486]' : 'text-slate-400'}`} />
                    <span>{cat.name}</span>
                    {hasSubcategories && (
                      <ChevronDown 
                        className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#ff6486]' : ''
                        }`} 
                      />
                    )}
                  </button>
                </div>
              );
            })}
          </nav>

          {/* Flecha Derecha para desplazamiento */}
          <button
            onClick={() => scrollNav('right')}
            className="hidden sm:flex items-center justify-center w-7 h-7 rounded-full bg-slate-950/90 text-slate-400 hover:text-[#ffc456] hover:bg-slate-800 border border-slate-700/80 shadow-md transition-all shrink-0 ml-1 z-10 opacity-70 hover:opacity-100 cursor-pointer"
            aria-label="Desplazar categorías hacia la derecha"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* ========================================================= */}
        {/* PANEL DESPLEGABLE MEGAMENU DE SUBCATEGORÍAS (NO CLIPPED)  */}
        {/* ========================================================= */}
        {activeCategoryObj && activeCategoryObj.subcategories && activeCategoryObj.subcategories.length > 0 && (
          <div
            onMouseEnter={handleDropdownPanelMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="absolute top-full left-0 w-full bg-slate-950/98 backdrop-blur-2xl border-b border-slate-800 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-150"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
              
              {/* Encabezado de la Categoría Activa */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3.5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[#ff6486]">
                    {ActiveIcon && <ActiveIcon className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white font-display uppercase tracking-wide">
                        {activeCategoryObj.slug === 'gta-6' ? 'GTA 6 - Super Categoría' : activeCategoryObj.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#ff6486]/15 text-[#ff6486] border border-[#ff6486]/30">
                        {activeCategoryObj.slug === 'gta-6' ? 'CONECTOR UNIVERSAL' : `${activeCategoryObj.subcategories.length} SECCIONES`}
                      </span>
                    </div>
                    {activeCategoryObj.shortDesc && (
                      <p className="text-xs text-slate-400 font-light mt-0.5">
                        {activeCategoryObj.shortDesc}
                      </p>
                    )}
                  </div>
                </div>

                {/* Botón Explorar Categoría Completa */}
                <button
                  onClick={() => {
                    onSelectCategory(activeCategoryObj.slug);
                    setActiveDropdown(null);
                  }}
                  className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-[#ff6486]/15 text-xs font-bold text-[#ffc456] hover:text-[#ff6486] border border-slate-800 hover:border-[#ff6486]/40 transition-all cursor-pointer font-mono group"
                >
                  <span>{activeCategoryObj.slug === 'gta-6' ? 'Ver Hub Central GTA 6' : `Ver todo en ${activeCategoryObj.name}`}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Grid de Subcategorías / Conectores */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
                {activeCategoryObj.subcategories.map((sub) => {
                  const isSuperCat = activeCategoryObj.slug === 'gta-6';
                  return (
                    <button
                      key={sub.slug}
                      onClick={() => {
                        if (isSuperCat) {
                          onSelectCategory(sub.slug);
                        } else {
                          onSelectCategory(activeCategoryObj.slug, sub.slug);
                        }
                        setActiveDropdown(null);
                      }}
                      className="text-left p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-[#ff6486]/60 transition-all group flex flex-col justify-between cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold text-white group-hover:text-[#ffc456] transition-colors truncate">
                          {sub.name}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#ff6486] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                      </div>
                      {sub.description && (
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 font-light leading-relaxed">
                          {sub.description}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Botón Móvil para Explorar Categoría */}
              <div className="pt-3 border-t border-slate-800/80 mt-3 sm:hidden">
                <button
                  onClick={() => {
                    onSelectCategory(activeCategoryObj.slug);
                    setActiveDropdown(null);
                  }}
                  className="w-full py-2 rounded-lg bg-slate-900 text-xs font-bold text-[#ff6486] text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{activeCategoryObj.slug === 'gta-6' ? 'Ver Hub Central GTA 6' : `Ver todo en ${activeCategoryObj.name}`}</span>
                  <span>→</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* 4. MODAL / DRAWER MÓVIL COMPLETO                          */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[145px] bottom-0 z-50 bg-slate-950/98 backdrop-blur-xl border-t border-slate-800 overflow-y-auto px-4 py-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Acciones Rápidas Móviles */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onOpenSearch();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white hover:border-[#ff6486] transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4 text-[#ffc456]" />
              <span>Buscar Noticia</span>
            </button>

            <button
              onClick={() => {
                onOpenSEOInspector();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-[#ffc456] hover:border-[#ffc456] transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#ffc456]" />
              <span>Auditoría SEO</span>
            </button>
          </div>

          {/* Portada Link en Menú Móvil */}
          <button
            onClick={() => {
              onSelectCategory('portada');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
              currentCategory === 'portada'
                ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-[#ffc456] border border-[#ffc456]/50 shadow-md'
                : 'bg-slate-900/60 text-slate-200 hover:bg-slate-900 border border-slate-800/80'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Home className="w-4 h-4 text-[#ffc456]" />
              <span>Portada Principal KAIROSION</span>
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Acordeón de Categorías y Subcategorías */}
          <div className="space-y-2 pt-1">
            <div className="text-[11px] font-mono text-[#ffc456] uppercase tracking-wider px-1 font-bold flex items-center justify-between">
              <span>EXPLORAR SECCIONES</span>
              <span className="text-slate-400 font-normal">{navCategories.length} categorías</span>
            </div>

            {navCategories.map((cat) => {
              const isExpanded = mobileExpandedCat === cat.slug;
              const isActive = currentCategory === cat.slug;
              const hasSubcategories = cat.subcategories && cat.subcategories.length > 0;
              const Icon = getCategoryIcon(cat.iconName);

              return (
                <div 
                  key={cat.slug} 
                  className={`rounded-xl border overflow-hidden transition-all ${
                    isActive 
                      ? 'border-[#ff6486] bg-slate-900 shadow-md ring-1 ring-[#ff6486]/30' 
                      : 'border-slate-800/80 bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between p-2.5">
                    <button
                      onClick={() => {
                        onSelectCategory(cat.slug);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-2.5 text-xs font-bold text-left flex-1 transition-colors cursor-pointer min-w-0 ${
                        isActive ? 'text-[#ffc456]' : 'text-slate-200 hover:text-[#ff6486]'
                      }`}
                    >
                      <div className="p-1.5 rounded-lg bg-slate-800/80 shrink-0">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#ff6486]' : 'text-slate-400'}`} />
                      </div>
                      <span className="truncate">{cat.name}</span>
                    </button>

                    {hasSubcategories && (
                      <button
                        onClick={() => setMobileExpandedCat(isExpanded ? null : cat.slug)}
                        aria-expanded={isExpanded}
                        aria-label={`Ver subcategorías de ${cat.name}`}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800/80 transition-colors ml-2 shrink-0"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-[#ff6486]' : ''}`} />
                      </button>
                    )}
                  </div>

                  {/* Contenido Desplegable de Subcategorías */}
                  {hasSubcategories && isExpanded && (
                    <div className="p-2.5 pt-0 space-y-1 border-t border-slate-800/60 bg-slate-950/80 animate-in fade-in duration-150">
                      {cat.subcategories.map((sub) => {
                        const isSuperCat = cat.slug === 'gta-6';
                        return (
                          <button
                            key={sub.slug}
                            onClick={() => {
                              if (isSuperCat) {
                                onSelectCategory(sub.slug);
                              } else {
                                onSelectCategory(cat.slug, sub.slug);
                              }
                              setMobileMenuOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-900 transition-colors flex items-center justify-between group cursor-pointer"
                          >
                            <span className="truncate">{sub.name}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#ff6486]" />
                          </button>
                        );
                      })}

                      <button
                        onClick={() => {
                          onSelectCategory(cat.slug);
                          setMobileMenuOpen(false);
                        }}
                        className="w-full text-center py-2 text-xs font-mono font-semibold text-[#ff6486] hover:underline pt-2 border-t border-slate-800/60 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Explorar todo en {cat.name}</span>
                        <span>→</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Enlaces Técnicos y Botón CMS en Móvil */}
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2 text-xs text-slate-400">
            {onOpenAdmin && (
              <button
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#ff6486] via-rose-400 to-[#ffc456] text-slate-950 font-black rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:opacity-95 transition-opacity"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>ACCEDER AL PANEL CMS (TURSO DB)</span>
              </button>
            )}

            {onOpenSitemap && (
              <button
                onClick={() => {
                  onOpenSitemap();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-lg flex items-center justify-center gap-2 font-mono text-xs cursor-pointer"
              >
                <FileCode className="w-3.5 h-3.5 text-[#ff6486]" />
                <span>Ver Mapa del Sitio (Sitemap XML)</span>
              </button>
            )}

            <div className="text-center pt-2 font-mono text-[10px] text-slate-500">
              KAIROSION © {new Date().getFullYear()} · Sistema Turso DB Conectado
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
