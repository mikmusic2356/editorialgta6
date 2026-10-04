import React, { useState, useEffect } from 'react';
import { ImageAsset, MainCategorySlug } from '../../types';
import { useCMS } from '../../context/CMSContext';
import { 
  Palmtree, 
  Car, 
  MapPin, 
  ShieldAlert, 
  Sparkles, 
  Crosshair, 
  Cpu, 
  Users, 
  Compass, 
  Newspaper 
} from 'lucide-react';

interface EditorialVisualProps {
  image?: ImageAsset;
  category?: MainCategorySlug;
  title?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1';
  className?: string;
  priority?: boolean;
}

export const EditorialVisual: React.FC<EditorialVisualProps> = ({
  image,
  category = 'noticias',
  title = 'Grand Theft Auto VI',
  aspectRatio = '16:9',
  className = '',
  priority = false,
}) => {
  const [imageError, setImageError] = useState(false);
  let cacheBuster: number | undefined;
  try {
    const cms = useCMS();
    cacheBuster = cms.cacheBuster;
  } catch (e) {
    // Graceful fallback if rendered outside CMSProvider
  }

  // Automatically reset image error state whenever the image URL changes
  useEffect(() => {
    setImageError(false);
  }, [image?.url, cacheBuster]);

  const rawUrl = image?.url?.trim() || '';
  let sanitizedUrl = rawUrl ? (rawUrl.startsWith('http') || rawUrl.startsWith('/') || rawUrl.startsWith('data:') || rawUrl.startsWith('blob:') ? rawUrl : `/${rawUrl}`) : '';

  // Append cache buster only when explicitly active (> 0) e.g. after manual CMS purge
  if (sanitizedUrl && cacheBuster && cacheBuster > 0 && !sanitizedUrl.startsWith('data:') && !sanitizedUrl.startsWith('blob:')) {
    const separator = sanitizedUrl.includes('?') ? '&' : '?';
    if (!sanitizedUrl.includes('_cb=')) {
      sanitizedUrl = `${sanitizedUrl}${separator}_cb=${cacheBuster}`;
    }
  }

  const hasRealImage = Boolean(sanitizedUrl && !imageError);

  // Select authentic color palette per category
  const getThemeConfig = (cat: MainCategorySlug) => {
    switch (cat) {
      case 'noticias':
        return {
          gradient: 'from-rose-950 via-slate-900 to-indigo-950',
          accent: 'text-rose-400',
          border: 'border-rose-500/20',
          glow: 'bg-rose-500/10',
          icon: Newspaper,
          themeLabel: 'VICE CITY BREAKING'
        };
      case 'guias':
        return {
          gradient: 'from-cyan-950 via-slate-900 to-blue-950',
          accent: 'text-cyan-400',
          border: 'border-cyan-500/20',
          glow: 'bg-cyan-500/10',
          icon: Compass,
          themeLabel: 'LEONIDA WALKTHROUGH'
        };
      case 'trucos-consejos':
        return {
          gradient: 'from-emerald-950 via-slate-900 to-green-950',
          accent: 'text-emerald-400',
          border: 'border-emerald-500/20',
          glow: 'bg-emerald-500/10',
          icon: Sparkles,
          themeLabel: 'TIPS & SURVIVAL'
        };
      case 'personajes':
        return {
          gradient: 'from-pink-950 via-slate-900 to-rose-950',
          accent: 'text-pink-400',
          border: 'border-pink-500/20',
          glow: 'bg-pink-500/10',
          icon: Users,
          themeLabel: 'LUCIA & JASON DOSSIER'
        };
      case 'mapa':
        return {
          gradient: 'from-blue-950 via-slate-900 to-cyan-950',
          accent: 'text-blue-400',
          border: 'border-blue-500/20',
          glow: 'bg-blue-500/10',
          icon: MapPin,
          themeLabel: 'CARTOGRAPHY & KEYS'
        };
      case 'vehiculos':
        return {
          gradient: 'from-amber-950 via-slate-900 to-orange-950',
          accent: 'text-amber-400',
          border: 'border-amber-500/20',
          glow: 'bg-amber-500/10',
          icon: Car,
          themeLabel: 'VICE MOTORS CATALOG'
        };
      case 'armas':
        return {
          gradient: 'from-red-950 via-slate-900 to-zinc-950',
          accent: 'text-red-400',
          border: 'border-red-500/20',
          glow: 'bg-red-500/10',
          icon: Crosshair,
          themeLabel: 'BALLISTICS & ARSENAL'
        };
      case 'rockstar-games':
        return {
          gradient: 'from-purple-950 via-slate-900 to-fuchsia-950',
          accent: 'text-purple-400',
          border: 'border-purple-500/20',
          glow: 'bg-purple-500/10',
          icon: ShieldAlert,
          themeLabel: 'ROCKSTAR GAMES ARCHIVE'
        };
      case 'gta-6':
      default:
        return {
          gradient: 'from-rose-950 via-slate-900 to-slate-950',
          accent: 'text-rose-400',
          border: 'border-rose-500/20',
          glow: 'bg-rose-500/10',
          icon: Cpu,
          themeLabel: 'GRAND THEFT AUTO VI'
        };
    }
  };

  const theme = getThemeConfig(category);
  const Icon = theme.icon;

  const aspectClass = 
    aspectRatio === '16:9' 
      ? 'aspect-16/9' 
      : aspectRatio === '4:3' 
        ? 'aspect-4/3' 
        : 'aspect-square';

  return (
    <figure className={`overflow-hidden rounded-xl group relative ${className}`}>
      {/* Visual Render Canvas */}
      <div 
        className={`w-full ${aspectClass} relative overflow-hidden bg-slate-950 border border-slate-800 transition-all duration-300 group-hover:scale-[1.01]`}
      >
        {hasRealImage ? (
          <>
            <img
              src={sanitizedUrl}
              alt={image?.alt || title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              loading={priority ? 'eager' : 'lazy'}
              decoding={priority ? 'sync' : 'async'}
            />
            {/* Subtle bottom gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

            {/* Top Badges */}
            {image?.badge && (
              <div className="absolute top-3 left-3 z-10">
                <div className="px-2.5 py-1 rounded-md bg-slate-950/90 backdrop-blur-md border border-slate-700 text-[10px] font-mono font-bold text-[#ffc456] uppercase shadow-lg">
                  {image.badge}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className={`w-full h-full bg-linear-to-br ${theme.gradient} flex flex-col justify-between p-6 border ${theme.border}`}>
            {/* Palm Tree & Sunset Atmospheric Grid SVG overlay */}
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
            
            {/* Neon Horizon Glow */}
            <div className={`absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-32 rounded-full blur-3xl ${theme.glow} pointer-events-none`} />

            {/* Top bar with visual tag & watermark */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-slate-400 uppercase">
                <Icon className={`w-3.5 h-3.5 ${theme.accent}`} />
                <span>{image?.badge || theme.themeLabel}</span>
              </div>
              <div className="flex items-center gap-1.5 opacity-60">
                <Palmtree className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-[10px] font-mono tracking-tighter text-slate-400">LEONIDA VI</span>
              </div>
            </div>

            {/* Centerpiece Graphic Element */}
            <div className="relative z-10 my-auto text-center px-4 py-2">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-slate-950/60 border border-slate-800/80 mb-3 shadow-lg group-hover:border-slate-700 transition-colors">
                <Icon className={`w-7 h-7 ${theme.accent}`} />
              </div>
              <p className="text-sm sm:text-base font-semibold text-slate-200 line-clamp-2 max-w-md mx-auto drop-shadow-md">
                {image?.alt || title}
              </p>
            </div>

            {/* Bottom bar */}
            <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800/60 pt-3">
              <span className="tracking-wide">ESTADO DE LEONIDA</span>
              <span className="text-slate-500 uppercase">EDICIÓN DIGITAL</span>
            </div>
          </div>
        )}
      </div>

      {/* Caption if provided */}
      {image?.caption && (
        <figcaption className="text-xs text-slate-400 italic mt-2.5 px-1 leading-relaxed">
          {image.caption}
        </figcaption>
      )}
    </figure>
  );
};
