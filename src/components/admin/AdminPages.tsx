import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { StaticPage } from '../../types/cms';
import { FileCode, Edit3, Save, Check, Eye } from 'lucide-react';

export const AdminPages: React.FC = () => {
  const { staticPages, updateStaticPage } = useCMS();

  const [selectedSlug, setSelectedSlug] = useState<string>(staticPages[0]?.slug || 'sobre-nosotros');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const activePage = staticPages.find(p => p.slug === selectedSlug) || staticPages[0];

  const [title, setTitle] = useState(activePage?.title || '');
  const [subtitle, setSubtitle] = useState(activePage?.subtitle || '');
  const [content, setContent] = useState(activePage?.content || '');
  const [seoTitle, setSeoTitle] = useState(activePage?.seoTitle || '');
  const [seoDesc, setSeoDesc] = useState(activePage?.seoDescription || '');

  const handleSelectPage = (page: StaticPage) => {
    setSelectedSlug(page.slug);
    setTitle(page.title);
    setSubtitle(page.subtitle || '');
    setContent(page.content);
    setSeoTitle(page.seoTitle || '');
    setSeoDesc(page.seoDescription || '');
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!activePage) return;
    updateStaticPage(activePage.slug, {
      title,
      subtitle,
      content,
      seoTitle,
      seoDescription: seoDesc
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-display">
            Páginas Institucionales y Legales
          </h1>
          <p className="text-xs text-slate-400">
            Edita las políticas de privacidad, cookies, aviso de exención y páginas estáticas de la redacción.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 cursor-pointer w-fit"
        >
          <Save className="w-4 h-4" />
          <span>{isSaved ? '¡Página Guardada!' : 'Guardar Cambios'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Page Selector */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold mb-2">
            Páginas del Portal ({staticPages.length})
          </div>

          {staticPages.map((page) => {
            const isSelected = activePage?.slug === page.slug;

            return (
              <button
                key={page.slug}
                onClick={() => handleSelectPage(page)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-slate-900 border-rose-500/60 shadow-md' 
                    : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900/70 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-white text-xs">{page.title}</div>
                <div className="text-[10px] font-mono text-slate-500">/{page.slug}</div>
              </button>
            );
          })}
        </div>

        {/* Right: Page Editor */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div>
              <label className="text-xs font-mono uppercase text-slate-400 block mb-1">Título de la Página</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm font-bold text-white"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-slate-400 block mb-1">Subtítulo / Introducción</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
                Contenido Markdown Legal / Institucional
              </label>
              <textarea
                rows={12}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono leading-relaxed text-slate-200 focus:outline-hidden focus:border-rose-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">SEO Title</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">SEO Description</label>
                <input
                  type="text"
                  value={seoDesc}
                  onChange={(e) => setSeoDesc(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                />
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
