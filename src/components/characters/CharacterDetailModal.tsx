import React, { useState, useEffect } from 'react';
import { CharacterProfile, Article } from '../../types';
import { 
  X, 
  Users, 
  ShieldCheck, 
  ChevronRight, 
  ChevronLeft,
  Quote, 
  ArrowRight, 
  Sparkles, 
  User, 
  Crosshair, 
  BookOpen, 
  Newspaper,
  Calendar,
  Clock,
  Mic
} from 'lucide-react';

interface CharacterDetailModalProps {
  character: CharacterProfile | null;
  onClose: () => void;
  articles: Article[];
  onSelectArticle: (slug: string) => void;
}

export const CharacterDetailModal: React.FC<CharacterDetailModalProps> = ({
  character,
  onClose,
  articles,
  onSelectArticle,
}) => {
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number>(0);

  useEffect(() => {
    setActiveGalleryIndex(0);
  }, [character?.id]);

  if (!character) return null;

  const galleryList = character.gallery && character.gallery.length > 0 
    ? character.gallery 
    : [{ url: character.mainImage, title: character.name, caption: character.bio, credit: 'Oficial' }];

  const currentGalleryItem = galleryList[activeGalleryIndex] || galleryList[0];

  const relatedArticles = articles.filter(a => {
    if (character.relatedArticleSlugs?.includes(a.slug)) return true;
    const lowerName = character.name.toLowerCase();
    const firstWord = lowerName.split(' ')[0];
    return a.title.toLowerCase().includes(firstWord);
  });

  const nextImage = () => {
    setActiveGalleryIndex((prev) => (prev + 1) % galleryList.length);
  };

  const prevImage = () => {
    setActiveGalleryIndex((prev) => (prev - 1 + galleryList.length) % galleryList.length);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ff6486]/20 text-[#ff6486] border border-[#ff6486]/30 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#ffc456] font-bold">
                {character.imageBadge || 'EXPEDIENTE CONFIDENCIAL'}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                {character.name} <span className="text-[#ff6486] text-sm font-normal">({character.alias})</span>
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-8 flex-1 text-slate-300 text-sm leading-relaxed">
          
          {/* ============================================================ */}
          {/* TOP SECTION: IMAGE & GALLERY (LEFT) + BIOGRAPHY & STATS (RIGHT) */}
          {/* ============================================================ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* LEFT: IMAGE & GALLERY (6 cols) */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#ff6486] font-bold uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#ff6486]" />
                  Galería Oficial
                </span>
                <span className="text-[#ffc456] font-bold">
                  Foto {activeGalleryIndex + 1} de {galleryList.length}
                </span>
              </div>

              {/* Large Image Preview with Navigation */}
              <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-slate-950 border border-slate-700 shadow-md group">
                <img
                  src={currentGalleryItem.url}
                  alt={currentGalleryItem.title || character.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                />
                
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-slate-950/85 backdrop-blur-md border border-slate-700 text-[10px] font-mono font-bold text-[#ffc456] uppercase">
                  {character.role}
                </div>

                {galleryList.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/80 hover:bg-[#ff6486] text-white transition-colors cursor-pointer border border-slate-700 shadow-md"
                      aria-label="Anterior"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/80 hover:bg-[#ff6486] text-white transition-colors cursor-pointer border border-slate-700 shadow-md"
                      aria-label="Siguiente"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Image Caption and Credits */}
              <div className="p-3 rounded-lg bg-slate-950/90 border border-slate-800 space-y-1 text-xs">
                <div className="font-bold text-white text-xs">
                  {currentGalleryItem.title}
                </div>
                <p className="text-white/80 text-[11px] leading-relaxed">
                  {currentGalleryItem.caption}
                </p>
                {currentGalleryItem.credit && (
                  <div className="text-[10px] font-mono text-[#ffc456]">
                    Crédito: <span className="text-slate-300">{currentGalleryItem.credit}</span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {galleryList.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {galleryList.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveGalleryIndex(idx)}
                      className={`relative aspect-16/10 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                        activeGalleryIndex === idx
                          ? 'border-[#ff6486] ring-2 ring-[#ff6486]'
                          : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: BIOGRAPHY & DATA (6 cols) */}
            <div className="lg:col-span-6 space-y-5">
              
              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block font-mono text-[10px] uppercase">ROL</span>
                  <span className="font-semibold text-white truncate block">{character.role}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono text-[10px] uppercase">ESTADO</span>
                  <span className="font-semibold text-emerald-400 truncate block">{character.status}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono text-[10px] uppercase">EDAD</span>
                  <span className="font-semibold text-white truncate block">{character.personalData?.age || 'N/D'}</span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block font-mono text-[10px] uppercase">ORIGEN</span>
                  <span className="font-semibold text-white truncate block">{character.personalData?.origin || 'Leonida'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block font-mono text-[10px] uppercase">FACCIÓN</span>
                  <span className="font-semibold text-white truncate block">{character.faction}</span>
                </div>
              </div>

              {/* Biography */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#ff6486] font-bold flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#ff6486]" />
                  Perfil Biográfico
                </h3>
                <p className="leading-relaxed text-white text-xs font-light">
                  {character.bio}
                </p>
                {character.voiceActor && (
                  <div className="flex items-center gap-2 pt-1 text-xs">
                    <Mic className="w-3.5 h-3.5 text-[#ffc456]" />
                    <span className="font-mono text-[#ffc456] text-[11px]">Actor de Voz:</span>
                    <span className="text-white text-[11px]">{character.voiceActor}</span>
                  </div>
                )}
              </div>

              {/* Skills Breakdown */}
              {character.skills && character.skills.length > 0 && (
                <div className="space-y-2 pt-1">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-[#ff6486] font-bold flex items-center gap-1.5">
                    <Crosshair className="w-3.5 h-3.5 text-[#ff6486]" />
                    Habilidades Tácticas
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {character.skills.map((skill, sIdx) => (
                      <div key={sIdx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white text-[11px] truncate">{skill.name}</span>
                          <span className="font-mono text-[#ffc456] font-bold text-[11px]">{skill.level}%</span>
                        </div>
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#ff6486] rounded-full" 
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quotes */}
              {character.keyQuotes && character.keyQuotes.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="p-2.5 rounded-lg bg-slate-950 border-l-2 border-[#ff6486] text-xs italic text-white leading-relaxed">
                    "{character.keyQuotes[0]}"
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* ============================================================ */}
          {/* DEBAJO: HISTORIA COMPLETA */}
          {/* ============================================================ */}
          {character.story && character.story.length > 0 && (
            <div className="space-y-3 pt-6 border-t border-slate-800">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#ff6486] font-bold flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#ff6486]" />
                Historia y Contexto Narrativo
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {character.story.map((chapter, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold text-[#ff6486] uppercase font-mono">
                      {chapter.heading}
                    </h4>
                    <div className="space-y-1.5 text-xs text-white leading-relaxed font-light">
                      {chapter.paragraphs.map((p, pIdx) => (
                        <p key={pIdx}>{p}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* DEBAJO: ARTÍCULOS RELACIONADOS CON EL PERSONAJE */}
          {/* ============================================================ */}
          {relatedArticles.length > 0 && (
            <div className="space-y-3 pt-6 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#ff6486] font-bold flex items-center gap-1.5">
                  <Newspaper className="w-4 h-4 text-[#ff6486]" />
                  Artículos y Coberturas Relacionadas
                </h3>
                <span className="text-[11px] font-mono text-[#ffc456] font-bold">
                  {relatedArticles.length} disponibles
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {relatedArticles.map((art) => (
                  <div
                    key={art.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-[#ff6486]/60 transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-mono text-[#ffc456] uppercase font-bold truncate">
                        {art.categoryLabel}
                      </div>
                      <div className="text-xs font-bold text-white group-hover:text-[#ff6486] transition-colors line-clamp-2">
                        {art.title}
                      </div>
                      <p className="text-[11px] text-white/80 line-clamp-2 font-light">
                        {art.excerpt}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        onSelectArticle(art.slug);
                        onClose();
                      }}
                      className="mt-3 w-full py-1.5 px-2.5 rounded-lg bg-[#ff6486] hover:bg-[#ff6486]/90 text-white text-[11px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>Leer artículo</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center shrink-0">
          <span className="text-[11px] font-mono text-slate-400">
            KAIROSION · Expediente de Inteligencia Leonida
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-[#ff6486] hover:bg-[#ff6486]/90 rounded-lg transition-colors cursor-pointer"
          >
            Cerrar Expediente
          </button>
        </div>
      </div>
    </div>
  );
};
