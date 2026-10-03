import React, { useState, useEffect } from 'react';
import { CharacterProfile, Article } from '../../types';
import { MarkdownParagraph, renderFormattedInline } from '../common/MarkdownParagraph';
import { 
  Users, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Quote, 
  User, 
  Crosshair, 
  Car, 
  Sparkles, 
  BookOpen, 
  Newspaper, 
  ChevronLeft, 
  ChevronRight,
  Maximize2,
  Info,
  MapPin,
  Mic
} from 'lucide-react';

interface CharacterExplorerProps {
  characters: CharacterProfile[];
  articles: Article[];
  onSelectArticle: (slug: string) => void;
  onSelectCharacter?: (char: CharacterProfile) => void;
  selectedCharacterId?: string;
}

export const CharacterExplorer: React.FC<CharacterExplorerProps> = ({
  characters,
  articles,
  onSelectArticle,
  onSelectCharacter,
  selectedCharacterId,
}) => {
  const [activeCharId, setActiveCharId] = useState<string>(() => {
    if (selectedCharacterId) {
      const found = characters.find(
        (c) => c.id === selectedCharacterId || c.slug === selectedCharacterId || c.id === `char-${selectedCharacterId}`
      );
      if (found) return found.id;
    }
    return characters[0]?.id || 'char-lucia-caminos';
  });

  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number>(0);
  const [characterSearch, setCharacterSearch] = useState<string>('');

  // Synchronize when selectedCharacterId changes from parent (e.g. subcategory clicks)
  useEffect(() => {
    if (selectedCharacterId && selectedCharacterId !== 'all') {
      const found = characters.find(
        (c) => c.id === selectedCharacterId || c.slug === selectedCharacterId || c.id === `char-${selectedCharacterId}`
      );
      if (found) {
        setActiveCharId(found.id);
        setActiveGalleryIndex(0);
      }
    }
  }, [selectedCharacterId, characters]);

  const activeChar = characters.find((c) => c.id === activeCharId) || characters[0];

  // Reset active image and notify parent when changing character
  const handleSelectCharacter = (id: string) => {
    setActiveCharId(id);
    setActiveGalleryIndex(0);
    const charObj = characters.find(c => c.id === id);
    if (charObj && onSelectCharacter) {
      onSelectCharacter(charObj);
    }
  };

  if (!activeChar) return null;

  const galleryList = activeChar.gallery && activeChar.gallery.length > 0 
    ? activeChar.gallery 
    : [{ url: activeChar.mainImage, title: activeChar.name, caption: activeChar.bio, credit: 'Oficial' }];

  const currentGalleryItem = galleryList[activeGalleryIndex] || galleryList[0];

  // Filtered characters for selector
  const visibleCharacters = characters.filter(c => {
    if (!characterSearch.trim()) return true;
    const q = characterSearch.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.alias.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q)
    );
  });

  // Find real related articles matching this character
  const relatedArticles = articles.filter((art) => {
    if (activeChar.relatedArticleSlugs?.includes(art.slug)) return true;
    if (art.subcategorySlug === activeChar.slug) return true;
    const lowerName = activeChar.name.toLowerCase();
    const firstWord = lowerName.split(' ')[0];
    return (
      art.title.toLowerCase().includes(firstWord) ||
      art.tags.some(t => t.toLowerCase().includes(firstWord))
    );
  });

  const primaryArticle = articles.find((art) => 
    activeChar.relatedArticleSlugs?.includes(art.slug) ||
    art.subcategorySlug === activeChar.slug ||
    art.slug === `${activeChar.slug}-gta-6` ||
    art.slug.toLowerCase().includes(activeChar.slug.toLowerCase())
  ) || relatedArticles[0];

  const nextImage = () => {
    setActiveGalleryIndex((prev) => (prev + 1) % galleryList.length);
  };

  const prevImage = () => {
    setActiveGalleryIndex((prev) => (prev - 1 + galleryList.length) % galleryList.length);
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300">
      
      {/* 1. CHARACTER SELECTOR TABS / CARDS */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#ff6486] font-bold">
            <Users className="w-4 h-4 text-[#ff6486]" />
            <span>EXPEDIENTES Y BIOGRAFÍAS DE PERSONAJES ({characters.length})</span>
          </div>
          
          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Buscar personaje..."
              value={characterSearch}
              onChange={(e) => setCharacterSearch(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#ff6486] font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 max-h-80 overflow-y-auto pr-1">
          {visibleCharacters.map((char) => {
            const isSelected = char.id === activeChar.id;
            return (
              <button
                key={char.id}
                onClick={() => handleSelectCharacter(char.id)}
                className={`p-2.5 rounded-xl text-left transition-all cursor-pointer flex flex-col items-center text-center gap-2 border ${
                  isSelected
                    ? 'bg-slate-900 border-[#ff6486] shadow-lg shadow-[#ff6486]/10 ring-1 ring-[#ff6486]'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-slate-700">
                  <img
                    src={char.mainImage}
                    alt={char.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-[#ff6486]/20 border-2 border-[#ff6486] rounded-lg" />
                  )}
                </div>
                <div className="min-w-0 w-full">
                  <div className={`text-xs font-bold truncate ${isSelected ? 'text-white font-extrabold' : 'text-slate-200'}`}>
                    {char.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">
                    {char.role}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. TOP DOSSIER: SIDE-BY-SIDE (IMAGE & GALLERY on LEFT + BIOGRAPHY on RIGHT) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-8 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ============================================================ */}
          {/* LEFT: IMAGE & INTERACTIVE GALLERY (6 COLS) */}
          {/* ============================================================ */}
          <div className="lg:col-span-6 space-y-4">
            
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#ff6486] font-bold uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#ff6486]" />
                Galería Fotográfica Oficial
              </span>
              <span className="text-[#ffc456] font-bold">
                Foto {activeGalleryIndex + 1} de {galleryList.length}
              </span>
            </div>

            {/* Main Active Image Display */}
            <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-slate-950 border border-slate-700 shadow-md group">
              <img
                src={currentGalleryItem.url}
                alt={currentGalleryItem.title || activeChar.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Badge Overlay */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/85 backdrop-blur-md border border-slate-700 text-[10px] font-mono font-bold text-[#ffc456] uppercase">
                {activeChar.imageBadge || 'EXPEDIENTE OFICIAL'}
              </div>

              {/* Navigation Arrows on Preview */}
              {galleryList.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/80 hover:bg-[#ff6486] text-white transition-colors cursor-pointer border border-slate-700 shadow-lg"
                    aria-label="Foto anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/80 hover:bg-[#ff6486] text-white transition-colors cursor-pointer border border-slate-700 shadow-lg"
                    aria-label="Foto siguiente"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Image Title, Caption and Credits */}
            <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1 text-xs">
              <div className="font-bold text-white text-sm">
                {currentGalleryItem.title}
              </div>
              <p className="text-white/80 text-xs leading-relaxed">
                {currentGalleryItem.caption}
              </p>
              {currentGalleryItem.credit && (
                <div className="text-[10px] font-mono text-[#ffc456] pt-1">
                  Fuente / Crédito: <span className="text-slate-300">{currentGalleryItem.credit}</span>
                </div>
              )}
            </div>

            {/* Thumbnail Navigation Strip */}
            {galleryList.length > 1 && (
              <div className="grid grid-cols-4 gap-2 pt-1">
                {galleryList.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveGalleryIndex(idx)}
                    className={`relative aspect-16/10 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                      activeGalleryIndex === idx
                        ? 'border-[#ff6486] ring-2 ring-[#ff6486] scale-102'
                        : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600'
                    }`}
                  >
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/70 text-[9px] font-mono text-[#ffc456] font-bold">
                      #{idx + 1}
                    </div>
                  </button>
                ))}
              </div>
            )}

          </div>

          {/* ============================================================ */}
          {/* RIGHT: BIOGRAPHY & TACTICAL DOSSIER (6 COLS) */}
          {/* ============================================================ */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Header / Titles */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#ff6486]/20 border border-[#ff6486]/40 text-[#ff6486] text-xs font-mono font-bold uppercase">
                  {activeChar.role}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase">
                  {activeChar.status}
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-wide pt-1">
                {activeChar.name}
              </h2>
              <div className="text-sm font-semibold text-[#ff6486]">
                «{activeChar.alias}»
              </div>
            </div>

            {/* Quick Personal Data Table */}
            {activeChar.personalData && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-[#ffc456] block uppercase font-bold">Edad</span>
                  <span className="font-semibold text-white">{activeChar.personalData.age}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#ffc456] block uppercase font-bold">Origen</span>
                  <span className="font-semibold text-white truncate block">{activeChar.personalData.origin}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#ffc456] block uppercase font-bold">Arma Predilecta</span>
                  <span className="font-semibold text-white truncate block">{activeChar.personalData.favWeapon}</span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-mono text-[#ffc456] block uppercase font-bold">Vehículo Favorito</span>
                  <span className="font-semibold text-white truncate block">{activeChar.personalData.favVehicle}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] font-mono text-[#ffc456] block uppercase font-bold">Facción / Vínculo</span>
                  <span className="font-semibold text-white truncate block">{activeChar.faction}</span>
                </div>
              </div>
            )}

            {/* Biography Section */}
            <div className="space-y-2">
              <h3 className="text-sm font-mono uppercase tracking-wider text-[#ff6486] font-bold flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#ff6486]" />
                Perfil Biográfico y Antecedentes
              </h3>
              <div className="text-sm text-white leading-relaxed font-light">
                {renderFormattedInline(activeChar.bio)}
              </div>
              {activeChar.voiceActor && (
                <div className="flex items-center gap-2 pt-1 text-xs text-slate-300">
                  <Mic className="w-3.5 h-3.5 text-[#ffc456]" />
                  <span className="font-mono text-[#ffc456]">Doblaje / Voz:</span>
                  <span className="text-white font-medium">{activeChar.voiceActor}</span>
                </div>
              )}
            </div>

            {/* Prominent CTA: Direct Link to Blog Article */}
            {primaryArticle && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 to-slate-900 border border-[#ff6486]/40 shadow-lg space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono uppercase font-bold text-[#ffc456] flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[#ff6486]" />
                    Artículo Editorial Publicado
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {primaryArticle.readTimeMinutes} min de lectura
                  </span>
                </div>
                <div className="text-sm font-bold text-white line-clamp-1">
                  {primaryArticle.title}
                </div>
                <button
                  onClick={() => onSelectArticle(primaryArticle.slug)}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#ff6486] hover:bg-[#ff6486]/90 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 group"
                >
                  <span>Ver información completa aquí</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            {/* Tactical Skills Progress */}
            {activeChar.skills && activeChar.skills.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-mono uppercase tracking-wider text-[#ff6486] font-bold flex items-center gap-1.5">
                  <Crosshair className="w-4 h-4 text-[#ff6486]" />
                  Habilidades Tácticas & Destrezas
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeChar.skills.map((skill, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white truncate">{skill.name}</span>
                        <span className="font-mono text-[#ffc456] font-bold">{skill.level}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#ff6486] rounded-full transition-all duration-700"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-300 leading-tight">{skill.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Quotes */}
            {activeChar.keyQuotes && activeChar.keyQuotes.length > 0 && (
              <div className="space-y-2 pt-2">
                <h3 className="text-sm font-mono uppercase tracking-wider text-[#ff6486] font-bold flex items-center gap-1.5">
                  <Quote className="w-4 h-4 text-[#ff6486]" />
                  Declaraciones y Citas Célebres
                </h3>
                <div className="space-y-2">
                  {activeChar.keyQuotes.map((quote, qIdx) => (
                    <div 
                      key={qIdx} 
                      className="p-3.5 rounded-xl bg-slate-950 border-l-3 border-[#ff6486] text-xs italic text-white leading-relaxed"
                    >
                      "{quote}"
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* ============================================================ */}
        {/* 3. DEBAJO: HISTORIA DEL PERSONAJE (FULL DETAILED NARRATIVE) */}
        {/* ============================================================ */}
        {activeChar.story && activeChar.story.length > 0 && (
          <div className="pt-6 border-t border-slate-800 space-y-5">
            <div className="flex items-center gap-2 text-sm font-mono uppercase text-[#ff6486] font-bold">
              <BookOpen className="w-4 h-4 text-[#ff6486]" />
              <span>Historia y Evolución Narrativa en Leonida</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeChar.story.map((chapter, cIdx) => (
                <div 
                  key={cIdx} 
                  className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors"
                >
                  <h4 className="text-sm font-bold text-[#ff6486] font-display uppercase tracking-wide">
                    {chapter.heading}
                  </h4>
                  <div className="space-y-2 text-xs text-white leading-relaxed font-light">
                    {chapter.paragraphs.map((p, pIdx) => (
                      <MarkdownParagraph key={pIdx} content={p} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 4. DEBAJO: ARTÍCULOS RELACIONADOS CON EL PERSONAJE */}
        {/* ============================================================ */}
        <div className="pt-6 border-t border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-mono uppercase text-[#ff6486] font-bold">
              <Newspaper className="w-4 h-4 text-[#ff6486]" />
              <span>Artículos y Análisis Relacionados con {activeChar.name}</span>
            </div>
            <span className="text-xs font-mono text-[#ffc456] font-bold">
              {relatedArticles.length} artículos vinculados
            </span>
          </div>

          {relatedArticles.length === 0 ? (
            <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
              No hay artículos vinculados específicamente en este momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedArticles.map((art) => (
                <div
                  key={art.id}
                  className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col hover:border-[#ff6486]/60 transition-all group"
                >
                  {/* Article Thumbnail */}
                  <div className="relative aspect-16/9 overflow-hidden bg-slate-900">
                    <img
                      src={art.featuredImage?.url || 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&auto=format&fit=crop&q=80'}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-md text-[10px] font-mono text-[#ffc456] font-bold">
                      {art.categoryLabel}
                    </div>
                  </div>

                  {/* Article Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-[11px] font-mono text-[#ffc456]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#ffc456]" />
                          {new Date(art.publishedAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#ffc456]" />
                          {art.readTimeMinutes} min
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white group-hover:text-[#ff6486] transition-colors line-clamp-2">
                        {art.title}
                      </h4>

                      <p className="text-xs text-white/80 line-clamp-2 font-light">
                        {art.excerpt}
                      </p>
                    </div>

                    <button
                      onClick={() => onSelectArticle(art.slug)}
                      className="w-full mt-2 py-2 px-3 rounded-lg bg-[#ff6486] hover:bg-[#ff6486]/90 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span>Leer artículo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
