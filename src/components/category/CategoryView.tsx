import React, { useState, useEffect } from 'react';
import { Article, MainCategorySlug, CharacterProfile, VehicleSpecs, WeaponSpecs, MapDistrict } from '../../types';
import { MAIN_CATEGORIES } from '../../data/categories';
import { useCMS } from '../../context/CMSContext';
import { CHARACTERS_DATA } from '../../data/characters';
import { VEHICLES_DATA } from '../../data/vehicles';
import { WEAPONS_DATA } from '../../data/weapons';
import { MAP_DISTRICTS } from '../../data/mapDistricts';
import { ArticleCard } from '../articles/ArticleCard';
import { Pagination } from '../common/Pagination';
import { CharacterExplorer } from '../characters/CharacterExplorer';
import { generateBreadcrumbSchema } from '../../utils/schemaGenerator';
import { 
  ArrowLeft, 
  ChevronRight, 
  Users, 
  MapPin, 
  Car, 
  Crosshair, 
  Layers,
  Flame,
  Newspaper,
  Compass,
  Sparkles,
  Music,
  Shield,
  ArrowRight,
  Zap
} from 'lucide-react';

interface CategoryViewProps {
  categorySlug: MainCategorySlug | string;
  initialSubCategory?: string;
  articles: Article[];
  onSelectArticle: (slug: string) => void;
  onBackToHome: () => void;
  onSelectCategory?: (category: MainCategorySlug | string, subcategory?: string) => void;
  onSelectCharacter: (char: CharacterProfile) => void;
  onSelectVehicle: (v: VehicleSpecs) => void;
  onSelectWeapon: (w: WeaponSpecs) => void;
  onSelectDistrict: (d: MapDistrict) => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({
  categorySlug,
  initialSubCategory = 'all',
  articles,
  onSelectArticle,
  onBackToHome,
  onSelectCategory,
  onSelectCharacter,
  onSelectVehicle,
  onSelectWeapon,
  onSelectDistrict,
}) => {
  const { categories } = useCMS();
  const currentCatList = categories && categories.length > 0 ? categories : MAIN_CATEGORIES;
  const currentCat = currentCatList.find((c) => c.slug === categorySlug) || currentCatList[0];
  const isSuperCategory = categorySlug === 'gta-6';

  const [selectedSubCategory, setSelectedSubCategory] = useState<string>(initialSubCategory || 'all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(6);

  useEffect(() => {
    setSelectedSubCategory(initialSubCategory || 'all');
    setCurrentPage(1);
  }, [categorySlug, initialSubCategory]);

  // SINGLE SOURCE OF TRUTH: Category and Subcategory article filtering
  // For GTA 6 Super Category, aggregate all articles across the portal
  const categoryArticles = isSuperCategory 
    ? articles 
    : articles.filter((a) => a.category === categorySlug);

  const filteredArticles = isSuperCategory
    ? (selectedSubCategory === 'all' ? categoryArticles : categoryArticles.filter(a => a.category === selectedSubCategory))
    : categoryArticles.filter((a) => {
        if (selectedSubCategory === 'all') return true;
        return a.subcategorySlug === selectedSubCategory;
      });

  // Calculate slice for current page
  const totalItems = filteredArticles.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const effectiveCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (effectiveCurrentPage - 1) * itemsPerPage;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + itemsPerPage);

  const handleSubCategoryChange = (subSlug: string) => {
    if (isSuperCategory && subSlug !== 'all') {
      if (onSelectCategory) {
        onSelectCategory(subSlug);
        return;
      }
    }
    setSelectedSubCategory(subSlug);
    setCurrentPage(1);
    if (onSelectCategory) {
      onSelectCategory(categorySlug, subSlug);
    }
  };

  const breadcrumbs = [
    { name: 'Portada', url: '/' },
    { name: currentCat.name, url: `/${categorySlug}` }
  ];

  if (selectedSubCategory !== 'all') {
    const subObj = currentCat.subcategories.find(s => s.slug === selectedSubCategory);
    if (subObj) {
      breadcrumbs.push({ name: subObj.name, url: `/${categorySlug}/${subObj.slug}` });
    }
  }

  const categorySchemaJson = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      generateBreadcrumbSchema(breadcrumbs),
      {
        "@type": "CollectionPage",
        "name": `${currentCat.name} - KAIROSION`,
        "description": currentCat.shortDesc,
        "url": `https://kairosion.online/${categorySlug}`,
        "inLanguage": "es-ES"
      }
    ]
  }, null, 2);

  return (
    <div className="w-full space-y-8">
      {/* Schema JSON-LD for Category */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: categorySchemaJson }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-mono text-[#ffc456]">
        <button
          onClick={onBackToHome}
          className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Portada</span>
        </button>
        <ChevronRight className="w-3 h-3 text-slate-600" />
        <span className="text-[#ffc456] font-bold uppercase">{currentCat.name}</span>
        {selectedSubCategory !== 'all' && (
          <>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-white">
              {currentCat.subcategories.find(s => s.slug === selectedSubCategory)?.name}
            </span>
          </>
        )}
      </nav>

      {/* Category Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 space-y-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#ff6486] font-bold">
              {isSuperCategory ? 'SUPER CATEGORÍA · HUB CONECTOR' : `SECCIÓN EDITORIAL · ${currentCat.tagline}`}
            </span>
            {isSuperCategory && (
              <span className="px-2 py-0.5 rounded-full bg-[#ffc456]/15 border border-[#ffc456]/30 text-[#ffc456] text-[10px] font-mono font-bold">
                Conector Universal
              </span>
            )}
          </div>
          <div className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-950 border border-[#ffc456]/40 text-[#ffc456] font-bold">
            {categoryArticles.length} artículos en total
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
          {isSuperCategory ? 'GTA 6 - Super Categoría & Hub Central' : currentCat.name}
        </h1>
        <p className="text-white/90 text-sm max-w-3xl leading-relaxed font-light">
          {isSuperCategory 
            ? 'Conector integral de Grand Theft Auto VI: accede directamente a todas las bases de datos de personajes, mapas, vehículos, armas, guías, noticias y música oficial.' 
            : currentCat.shortDesc}
        </p>

        {/* Subcategories Selector Tabs (for regular categories) */}
        {!isSuperCategory && currentCat.subcategories && currentCat.subcategories.length > 0 && (
          <div className="pt-4 border-t border-slate-800/80 flex flex-wrap gap-2 items-center">
            <div className="text-[11px] font-mono text-[#ffc456] flex items-center gap-1 mr-1 font-bold">
              <Layers className="w-3.5 h-3.5 text-[#ffc456]" />
              <span>Filtrar por subtema:</span>
            </div>

            <button
              onClick={() => handleSubCategoryChange('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedSubCategory === 'all'
                  ? 'bg-[#ff6486] text-white font-bold shadow-xs'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Todas las subcategorías ({categoryArticles.length})
            </button>

            {currentCat.subcategories.map((sub) => {
              const count = categoryArticles.filter(a => a.subcategorySlug === sub.slug).length;
              return (
                <button
                  key={sub.slug}
                  onClick={() => handleSubCategoryChange(sub.slug)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    selectedSubCategory === sub.slug
                      ? 'bg-[#ff6486] text-white font-bold shadow-xs'
                      : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  <span>{sub.name}</span>
                  <span className={`text-[10px] font-mono px-1 rounded font-bold ${
                    selectedSubCategory === sub.slug ? 'bg-white/20 text-white' : 'bg-slate-900 text-[#ffc456]'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* SUPER CATEGORY CONNECTOR GRID */}
      {isSuperCategory && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#ffc456] font-bold">
              <Zap className="w-4 h-4 text-[#ff6486]" />
              <span>CATEGORÍAS CONECTADAS · SELECCIONA UNA SECCIÓN</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">9 Secciones Principales</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentCat.subcategories.map((sub) => {
              const targetCount = articles.filter(a => a.category === sub.slug).length;
              let Icon = Sparkles;
              if (sub.slug === 'personajes') Icon = Users;
              else if (sub.slug === 'mapa') Icon = MapPin;
              else if (sub.slug === 'vehiculos') Icon = Car;
              else if (sub.slug === 'armas') Icon = Crosshair;
              else if (sub.slug === 'noticias') Icon = Newspaper;
              else if (sub.slug === 'guias') Icon = Compass;
              else if (sub.slug === 'trucos-consejos') Icon = Sparkles;
              else if (sub.slug === 'musica') Icon = Music;
              else if (sub.slug === 'rockstar-games') Icon = Shield;

              return (
                <div
                  key={sub.slug}
                  onClick={() => handleSubCategoryChange(sub.slug)}
                  className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-[#ff6486] hover:bg-slate-900 transition-all cursor-pointer group flex flex-col justify-between shadow-lg space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-700/80 flex items-center justify-center text-[#ff6486] group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-950 border border-[#ffc456]/40 text-[#ffc456] text-xs font-mono font-bold">
                        {targetCount} artículos
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-[#ffc456] transition-colors font-display">
                      {sub.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-light leading-relaxed">
                      {sub.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-[#ff6486] group-hover:text-white transition-colors">
                    <span>Explorar Categoría</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SPECIAL INTERACTIVE DATABASE WIDGETS WHEN APPLICABLE */}
      {categorySlug === 'personajes' && (
        <CharacterExplorer
          characters={CHARACTERS_DATA}
          articles={articles}
          onSelectArticle={onSelectArticle}
          onSelectCharacter={(char) => {
            handleSubCategoryChange(char.slug);
          }}
          selectedCharacterId={selectedSubCategory !== 'all' ? selectedSubCategory : undefined}
        />
      )}

      {categorySlug === 'vehiculos' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#ff6486] font-bold">
            <Car className="w-4 h-4" />
            <span>FICHAS TÉCNICAS Y TELEMETRÍA DE VEHÍCULOS</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {VEHICLES_DATA.map((v) => (
              <button
                key={v.id}
                onClick={() => onSelectVehicle(v)}
                className="p-4 text-left rounded-xl bg-slate-950 border border-slate-800 hover:border-[#ff6486]/60 hover:bg-slate-900 transition-all group cursor-pointer"
              >
                <div className="text-[10px] font-mono text-[#ffc456] uppercase font-bold">{v.manufacturer} · {v.classType}</div>
                <div className="text-base font-bold text-white group-hover:text-[#ff6486]">{v.name}</div>
                <div className="text-xs text-white font-mono">Velocidad: <span className="text-[#ffc456] font-bold">{v.topSpeedKmh} km/h</span></div>
              </button>
            ))}
          </div>
        </div>
      )}

      {categorySlug === 'armas' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#ff6486] font-bold">
            <Crosshair className="w-4 h-4" />
            <span>ARSENAL Y BALÍSTICA DE ARMAS</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {WEAPONS_DATA.map((w) => (
              <button
                key={w.id}
                onClick={() => onSelectWeapon(w)}
                className="p-4 text-left rounded-xl bg-slate-950 border border-slate-800 hover:border-[#ff6486]/60 hover:bg-slate-900 transition-all group cursor-pointer"
              >
                <div className="text-[10px] font-mono text-[#ffc456] uppercase font-bold">{w.manufacturer} · {w.type}</div>
                <div className="text-base font-bold text-white group-hover:text-[#ff6486]">{w.name}</div>
                <div className="text-xs text-white font-mono">Daño: <span className="text-[#ff6486] font-bold">{w.damageScore}/100</span></div>
              </button>
            ))}
          </div>
        </div>
      )}

      {categorySlug === 'mapa' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#ff6486] font-bold">
            <MapPin className="w-4 h-4" />
            <span>DISTRITOS Y PUNTOS DE INTERÉS DE LEONIDA</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {MAP_DISTRICTS.map((d) => (
              <button
                key={d.id}
                onClick={() => onSelectDistrict(d)}
                className="p-4 text-left rounded-xl bg-slate-950 border border-slate-800 hover:border-[#ff6486]/60 hover:bg-slate-900 transition-all group cursor-pointer"
              >
                <div className="text-[10px] font-mono text-[#ffc456] uppercase font-bold">{d.type}</div>
                <div className="text-base font-bold text-white group-hover:text-[#ff6486]">{d.name}</div>
                <div className="text-xs text-white/90 line-clamp-1 font-light">{d.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Articles Grid & Pagination Header */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800/80">
          <span>
            MOSTRANDO <strong className="text-white">{filteredArticles.length}</strong> PUBLICACIONES EDITORIALES
            {selectedSubCategory !== 'all' && ` EN "${currentCat.subcategories.find(s => s.slug === selectedSubCategory)?.name}"`}
          </span>
          <span className="text-[#ffc456] font-bold">ORDENADO POR FECHA DE PUBLICACIÓN</span>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-slate-900/30 border border-slate-800 space-y-3">
            <p className="text-white font-semibold">No hay publicaciones con la subcategoría seleccionada</p>
            <p className="text-xs text-white/80">Nuestro equipo editorial está redactando nuevos análisis.</p>
            <button
              onClick={() => handleSubCategoryChange('all')}
              className="px-4 py-2 text-xs font-bold bg-[#ff6486] text-white hover:bg-[#ff6486]/90 rounded-lg cursor-pointer transition-colors shadow-md"
            >
              Ver todas las publicaciones de {currentCat.name}
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedArticles.map((art) => (
                <ArticleCard
                  key={art.id}
                  article={art}
                  onSelectArticle={onSelectArticle}
                  variant="standard"
                />
              ))}
            </div>

            {/* Pagination Component */}
            <div className="pt-4 border-t border-slate-800/80">
              <Pagination
                currentPage={effectiveCurrentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                onItemsPerPageChange={(newPerPage) => {
                  setItemsPerPage(newPerPage);
                  setCurrentPage(1);
                }}
                itemsPerPageOptions={[6, 9, 12, 18]}
                itemLabel="artículos"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
