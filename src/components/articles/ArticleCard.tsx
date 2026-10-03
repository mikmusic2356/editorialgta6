import React from 'react';
import { Article } from '../../types';
import { EditorialVisual } from '../common/EditorialVisual';
import { VerificationBadge } from '../common/VerificationBadge';
import { Calendar, Clock, ArrowRight, User, Heart, Share2 } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onSelectArticle: (slug: string) => void;
  variant?: 'featured' | 'standard' | 'compact' | 'horizontal' | 'trending';
  rankingNumber?: number;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onSelectArticle,
  variant = 'standard',
  rankingNumber,
}) => {
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const cleanExcerpt = (text?: string) => {
    if (!text) return '';
    return text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  };

  const likesCount = article.likes ?? 0;
  const sharesCount = article.shares ?? 0;

  // 1. FEATURED / HERO CARD VARIANT
  if (variant === 'featured') {
    return (
      <article 
        onClick={() => onSelectArticle(article.slug)}
        className="group cursor-pointer bg-slate-900/60 border border-slate-800/90 rounded-2xl overflow-hidden hover:border-[#ff6486]/50 transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-0 shadow-2xl"
      >
        <div className="lg:col-span-7 overflow-hidden relative">
          <EditorialVisual
            image={article.featuredImage}
            category={article.category}
            title={article.title}
            aspectRatio="16:9"
            className="w-full h-full rounded-none group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
            <VerificationBadge type={article.verificationType} />
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase bg-slate-950/80 border border-[#ffc456]/40 text-[#ffc456] backdrop-blur-md">
              {article.categoryLabel}
            </span>
          </div>
        </div>

        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-slate-900/40">
          <div className="space-y-4">
            {/* Meta Strip: Category & Date */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
              <span className="text-[#ffc456] font-bold uppercase tracking-wider">
                {article.categoryLabel}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="inline-flex items-center gap-1 text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-[#ffc456]" />
                {formattedDate}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="inline-flex items-center gap-1 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-[#ff6486]" />
                {article.readTimeMinutes} min
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="inline-flex items-center gap-1 text-rose-400 font-bold">
                <Heart className="w-3 h-3 fill-current" />
                {likesCount}
              </span>
            </div>

            {/* Title (Blanco) */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-[#ff6486] transition-colors font-display tracking-tight leading-tight">
              {article.title}
            </h2>

            {/* Description / Paragraph (Blanco) */}
            <p className="text-sm text-white/90 leading-relaxed font-light line-clamp-3">
              {cleanExcerpt(article.excerpt)}
            </p>
          </div>

          {/* Bottom Action Strip with #ff6486 Button */}
          <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
              />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">{article.author.name}</div>
                <div className="text-[10px] text-slate-400 font-mono truncate">{article.author.role}</div>
              </div>
            </div>

            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-[#ff6486] hover:bg-[#ff6486]/90 text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>Ver más</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </article>
    );
  }

  // 2. TRENDING CARD VARIANT
  if (variant === 'trending') {
    return (
      <article 
        onClick={() => onSelectArticle(article.slug)}
        className="group cursor-pointer p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-[#ff6486]/50 hover:bg-slate-900/80 transition-all flex flex-col sm:flex-row items-start gap-4"
      >
        <div className="w-full sm:w-36 h-24 shrink-0 rounded-lg overflow-hidden relative">
          <EditorialVisual
            image={article.featuredImage}
            category={article.category}
            title={article.title}
            aspectRatio="16:9"
            className="w-full h-full rounded-lg group-hover:scale-105 transition-transform duration-300"
          />
          {rankingNumber && (
            <div className="absolute top-1.5 left-1.5 w-6 h-6 rounded bg-slate-950/90 border border-[#ffc456]/40 text-[#ffc456] text-xs font-mono font-bold flex items-center justify-center">
              #{rankingNumber}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
            <span className="text-[#ffc456] font-bold uppercase truncate">
              {article.categoryLabel}
            </span>
            <span className="text-slate-600">·</span>
            <span className="inline-flex items-center gap-1 text-slate-300">
              <Calendar className="w-3 h-3 text-[#ffc456]" />
              {formattedDate}
            </span>
            <span className="text-slate-600">·</span>
            <span className="inline-flex items-center gap-1 text-rose-400 font-bold">
              <Heart className="w-2.5 h-2.5 fill-current" />
              {likesCount}
            </span>
          </div>

          <h3 className="text-base font-bold text-white group-hover:text-[#ff6486] transition-colors line-clamp-2 leading-snug font-display">
            {article.title}
          </h3>

          <p className="text-xs text-white/80 line-clamp-2 font-light">
            {cleanExcerpt(article.excerpt)}
          </p>

          <div className="pt-1 flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400">
              {article.readTimeMinutes} min de lectura
            </span>
            <span className="text-xs font-bold text-[#ff6486] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              Ver más →
            </span>
          </div>
        </div>
      </article>
    );
  }

  // 3. HORIZONTAL CARD VARIANT
  if (variant === 'horizontal') {
    return (
      <article 
        onClick={() => onSelectArticle(article.slug)}
        className="group cursor-pointer p-4 sm:p-5 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-[#ff6486]/50 hover:bg-slate-900/80 transition-all flex flex-col sm:flex-row gap-5 items-start"
      >
        <div className="w-full sm:w-56 shrink-0 overflow-hidden rounded-lg">
          <EditorialVisual
            image={article.featuredImage}
            category={article.category}
            title={article.title}
            aspectRatio="16:9"
            className="w-full h-full rounded-lg group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="flex-1 min-w-0 space-y-2.5 flex flex-col justify-between h-full">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
              <span className="text-[#ffc456] font-bold uppercase tracking-wider">
                {article.categoryLabel}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="inline-flex items-center gap-1 text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-[#ffc456]" />
                {formattedDate}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="inline-flex items-center gap-1 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-[#ff6486]" />
                {article.readTimeMinutes} min
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="inline-flex items-center gap-1 text-rose-400 font-bold">
                <Heart className="w-3 h-3 fill-current" />
                {likesCount}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#ff6486] transition-colors line-clamp-2 leading-snug font-display">
              {article.title}
            </h3>

            <p className="text-xs sm:text-sm text-white/90 line-clamp-2 leading-relaxed font-light">
              {cleanExcerpt(article.excerpt)}
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              className="px-3.5 py-1.5 rounded-lg bg-[#ff6486] hover:bg-[#ff6486]/90 text-white font-bold text-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Ver más</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </article>
    );
  }

  // 4. STANDARD CARD VARIANT (Default everywhere)
  return (
    <article 
      onClick={() => onSelectArticle(article.slug)}
      className="group cursor-pointer flex flex-col justify-between bg-slate-900/50 border border-slate-800/80 rounded-xl overflow-hidden hover:border-[#ff6486]/50 hover:bg-slate-900/80 transition-all duration-300 shadow-md"
    >
      <div>
        {/* 1. Portada de imagen del artículo */}
        <div className="overflow-hidden relative">
          <EditorialVisual
            image={article.featuredImage}
            category={article.category}
            title={article.title}
            aspectRatio="16:9"
            className="w-full rounded-none group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2.5 left-2.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-950/85 border border-[#ffc456]/40 text-[#ffc456] backdrop-blur-md">
              {article.categoryLabel}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-3">
          {/* 2. Categoría & 3. Fecha & Likes */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <span className="text-[#ffc456] font-bold uppercase tracking-wider truncate">
              {article.categoryLabel}
            </span>
            <div className="flex items-center gap-2 text-slate-300 text-[11px]">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#ffc456]" />
                <span>{formattedDate}</span>
              </span>
              <span className="flex items-center gap-1 text-rose-400 font-bold">
                <Heart className="w-3 h-3 fill-current" />
                <span>{likesCount}</span>
              </span>
            </div>
          </div>

          {/* 4. Título Principal (Blanco) */}
          <h3 className="text-lg font-bold text-white group-hover:text-[#ff6486] transition-colors font-display tracking-tight leading-snug line-clamp-2">
            {article.title}
          </h3>

          {/* 5. Descripción / Párrafo (Blanco) */}
          <p className="text-xs text-white/90 line-clamp-3 leading-relaxed font-light">
            {cleanExcerpt(article.excerpt)}
          </p>
        </div>
      </div>

      {/* 6. Botón de Ver Más (#ff6486 con letra blanca) */}
      <div className="px-5 pb-5 pt-3 flex items-center justify-between border-t border-slate-800/60 text-xs">
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
          <Clock className="w-3 h-3 text-[#ff6486]" />
          <span>{article.readTimeMinutes} min de lectura</span>
        </div>

        <button
          type="button"
          className="px-3.5 py-1.5 rounded-lg bg-[#ff6486] hover:bg-[#ff6486]/90 text-white font-bold text-xs shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
        >
          <span>Ver más</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
};
