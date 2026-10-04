import React, { useState, useRef } from 'react';
import { useCMS } from '../../context/CMSContext';
import { MediaItem } from '../../types/cms';
import { uploadCompressedToR2, uploadToR2, deleteFromR2 } from '../../lib/r2Service';
import { 
  Image as ImageIcon, 
  Upload, 
  Search, 
  Trash2, 
  Edit3, 
  Check, 
  ExternalLink, 
  Copy, 
  FileText,
  Sparkles, 
  Info,
  Cloud,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Loader2,
  X
} from 'lucide-react';

import { ImageOptimizerModal } from './ImageOptimizerModal';
import { ALL_MEDIA_ITEMS } from '../../data/mediaData';

export const AdminMediaLibrary: React.FC = () => {
  const { media, addMediaItem, updateMediaItem, deleteMediaItem } = useCMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(media[0] || null);
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [isOptimizerModalOpen, setIsOptimizerModalOpen] = useState(false);

  // Edit Meta Form
  const [altText, setAltText] = useState('');
  const [titleText, setTitleText] = useState('');
  const [captionText, setCaptionText] = useState('');
  const [creditText, setCreditText] = useState('');

  // Upload Form Simulation & Real File Upload
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadName, setUploadName] = useState('');
  const [uploadAlt, setUploadAlt] = useState('');
  const [uploadCredit, setUploadCredit] = useState('Rockstar Games / Leonida Editorial');
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingToR2, setIsUploadingToR2] = useState(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);

  // Delete Confirmation Modal State
  const [mediaToDelete, setMediaToDelete] = useState<MediaItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Formatter to ensure all R2 URLs render seamlessly in browser
  const formatDisplayUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('r2.cloudflarestorage.com/')) {
      const match = url.match(/r2\.cloudflarestorage\.com\/[^/]+\/(.+)$/);
      if (match && match[1]) {
        return `/api/r2-file?key=${encodeURIComponent(match[1])}`;
      }
    }
    // Normalize .jpg to .webp if local image
    if (url.startsWith('/images/') && url.match(/\.(jpg|jpeg|png)$/i)) {
      return url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }
    return url;
  };

  const resolveCategory = (url: string): string => {
    if (url.includes('/Personajes/')) return 'Personajes';
    if (url.includes('/Lugares_y_Mapas/')) return 'Mapa & Mundo';
    if (url.includes('/Vehiculos/')) return 'Vehículos';
    if (url.includes('/Armas/')) return 'Armas';
    if (url.includes('/Ropa_y_Personalizacion/')) return 'Personalización & Moda';
    if (url.includes('/Artes_y_Ediciones/')) return 'Artes & Portadas';
    if (url.includes('r2.cloudflarestorage.com') || url.includes('/api/r2-file') || url.includes('r2.dev')) return 'Mi Biblioteca (Cloudflare / Turso)';
    return 'General';
  };

  // Deduplicate unique media items by URL and normalize to WebP
  const staticMap = new Map((ALL_MEDIA_ITEMS || []).map(m => [m.url, m]));
  const uniqueMediaMap = new Map<string, MediaItem>();

  (media || []).forEach(m => {
    if (!m || !m.url) return;
    const cleanUrl = m.url.startsWith('/images/') ? m.url.replace(/\.(jpg|jpeg|png)$/i, '.webp') : m.url;
    const staticInfo = staticMap.get(cleanUrl);
    if (!uniqueMediaMap.has(cleanUrl)) {
      uniqueMediaMap.set(cleanUrl, staticInfo ? { ...m, ...staticInfo, id: m.id || staticInfo.id } : { ...m, url: cleanUrl });
    }
  });

  (ALL_MEDIA_ITEMS || []).forEach(m => {
    if (!m || !m.url) return;
    if (!uniqueMediaMap.has(m.url)) {
      uniqueMediaMap.set(m.url, m);
    }
  });

  const uniqueMedia = Array.from(uniqueMediaMap.values());

  const filteredMedia = uniqueMedia.filter(m => {
    if (selectedCategory !== 'all') {
      const cat = resolveCategory(m.url);
      if (cat !== selectedCategory) return false;
    }
    const q = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.alt.toLowerCase().includes(q) ||
      m.title.toLowerCase().includes(q)
    );
  });

  const handleSelect = (item: MediaItem) => {
    setSelectedMedia(item);
    setAltText(item.alt);
    setTitleText(item.title);
    setCaptionText(item.caption);
    setCreditText(item.credit);
    setIsEditingMeta(false);
  };

  const handleSaveMeta = () => {
    if (!selectedMedia) return;
    updateMediaItem(selectedMedia.id, {
      alt: altText,
      title: titleText,
      caption: captionText,
      credit: creditText
    });
    setSelectedMedia(prev => prev ? {
      ...prev,
      alt: altText,
      title: titleText,
      caption: captionText,
      credit: creditText
    } : null);
    setIsEditingMeta(false);
    setUploadSuccessMessage('Metadatos guardados en Turso DB.');
    setTimeout(() => setUploadSuccessMessage(null), 3000);
  };

  // Handle direct compressed file upload to Cloudflare R2
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingToR2(true);
      
      // Upload and automatically compress to WebP
      const result = await uploadCompressedToR2(file, file.name, 'articulos');

      // Save to CMS & Turso DB
      const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const newItem = addMediaItem({
        url: result.url,
        name: result.name,
        alt: uploadAlt || cleanTitle,
        title: cleanTitle,
        caption: 'Recurso gráfico optimizado en Cloudflare R2.',
        credit: uploadCredit,
        sizeKb: result.sizeKb,
        dimensions: result.dimensions,
        mimeType: result.mimeType
      });

      setIsUploadingToR2(false);
      setIsUploading(false);
      handleSelect(newItem);
      setUploadSuccessMessage(`¡Imagen comprimida y subida a Cloudflare R2! De ${result.originalSizeKb} KB a ${result.sizeKb} KB (${result.compressionRatio}% de espacio ahorrado).`);
      setTimeout(() => setUploadSuccessMessage(null), 5000);

    } catch (error: any) {
      console.warn('Error durante subida en galería, usando fallback local...', error);
      try {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
            const fallbackItem = addMediaItem({
              url: reader.result,
              name: file.name,
              alt: uploadAlt || cleanTitle,
              title: cleanTitle,
              caption: 'Recurso gráfico optimizado.',
              credit: uploadCredit,
              sizeKb: Math.round(file.size / 1024),
              dimensions: '1920x1080',
              mimeType: file.type || 'image/webp'
            });
            setIsUploadingToR2(false);
            setIsUploading(false);
            handleSelect(fallbackItem);
            setUploadSuccessMessage('Imagen guardada localmente en la biblioteca.');
            setTimeout(() => setUploadSuccessMessage(null), 4000);
          }
        };
        reader.readAsDataURL(file);
      } catch (e) {
        setIsUploadingToR2(false);
        alert(`Error al procesar la imagen: ${error?.message || error}`);
      }
    }
  };

  const handleCreateUpload = () => {
    if (!uploadUrl.trim() || !uploadName.trim()) {
      alert('Ingresa una URL de imagen válida y un nombre.');
      return;
    }

    const newItem = addMediaItem({
      url: uploadUrl.trim(),
      name: uploadName.endsWith('.jpg') || uploadName.endsWith('.png') ? uploadName : `${uploadName}.jpg`,
      alt: uploadAlt || uploadName,
      title: uploadName,
      caption: 'Fotografía editorial de Leonida.',
      credit: uploadCredit,
      sizeKb: 380,
      dimensions: '1920x1080',
      mimeType: 'image/jpeg'
    });

    setUploadUrl('');
    setUploadName('');
    setUploadAlt('');
    setIsUploading(false);
    handleSelect(newItem);
  };

  // Handle Confirmed Delete
  const handleConfirmDelete = async () => {
    if (!mediaToDelete) return;

    try {
      setIsDeleting(true);

      // 1. Delete from Cloudflare R2
      if (mediaToDelete.url.includes('r2.cloudflarestorage.com') || mediaToDelete.url.includes('/api/r2-file') || mediaToDelete.url.includes('.r2.dev')) {
        await deleteFromR2(mediaToDelete.url);
      }

      // 2. Delete from Turso DB and CMS context
      deleteMediaItem(mediaToDelete.id);

      if (selectedMedia?.id === mediaToDelete.id) {
        setSelectedMedia(null);
      }

      setIsDeleting(false);
      const deletedName = mediaToDelete.name;
      setMediaToDelete(null);
      setUploadSuccessMessage(`La imagen "${deletedName}" fue eliminada de Cloudflare R2 y Turso DB.`);
      setTimeout(() => setUploadSuccessMessage(null), 4000);

    } catch (err: any) {
      console.error('Error al eliminar imagen:', err);
      setIsDeleting(false);
      alert(`Error al eliminar la imagen: ${err?.message || err}`);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Toast Notification */}
      {uploadSuccessMessage && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/50 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{uploadSuccessMessage}</span>
        </div>
      )}

      {/* Header with Cloudflare R2 badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white font-display">
              Biblioteca de Medios & Optimización de Imágenes
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/40 text-orange-400 text-[10px] font-mono font-bold flex items-center gap-1">
              <Cloud className="w-3 h-3 text-orange-400" />
              <span>R2: bubketgta6 · Turso DB</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gestiona recursos gráficos alojados en Cloudflare R2 y sincronizados con Turso DB.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setIsOptimizerModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 hover:bg-emerald-500/30 text-emerald-300 hover:text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer w-fit"
            title="Optimizar y convertir automáticamente todas las imágenes a formato WebP"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Comprimir imágenes y convertir</span>
          </button>

          <button
            onClick={() => setIsUploading(!isUploading)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-[#ff6486] hover:opacity-95 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer w-fit"
          >
            <Upload className="w-4 h-4 fill-slate-950" />
            <span>Subir a Cloudflare R2</span>
          </button>
        </div>
      </div>

      {/* Upload Box with Drag & Drop or File Picker */}
      {isUploading && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-orange-500/40 space-y-4 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-orange-400" />
              <h3 className="text-sm font-bold text-white font-display">
                Subir y Comprimir Archivo al Bucket "bubketgta6"
              </h3>
            </div>
            <button onClick={() => setIsUploading(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
          </div>

          {/* Drag & Drop File Zone */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="p-8 border-2 border-dashed border-slate-700 hover:border-orange-400 rounded-xl bg-slate-950/60 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group"
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload} 
              className="hidden" 
            />
            {isUploadingToR2 ? (
              <div className="flex flex-col items-center gap-2 py-4">
                <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
                <span className="text-xs font-mono text-slate-300 font-bold">Comprimiendo y subiendo a Cloudflare R2...</span>
              </div>
            ) : (
              <>
                <div className="p-3 rounded-full bg-slate-900 border border-slate-800 group-hover:border-orange-500/50 group-hover:scale-110 transition-all">
                  <Upload className="w-6 h-6 text-orange-400" />
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-white">Haz clic aquí o arrastra una imagen para optimizar y subir</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Se comprime automáticamente a WebP de alta fidelidad</div>
                </div>
              </>
            )}
          </div>

          {/* Or manual URL */}
          <div className="pt-3 border-t border-slate-800/80">
            <div className="text-[11px] font-mono text-slate-400 mb-2 uppercase">O registrar por URL externa:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">URL de la Imagen *</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={uploadUrl}
                  onChange={(e) => setUploadUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Nombre del Archivo *</label>
                <input
                  type="text"
                  placeholder="vice_city_downtown_night.jpg"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Texto Alternativo (ALT SEO)</label>
                <input
                  type="text"
                  placeholder="Descripción visual detallada..."
                  value={uploadAlt}
                  onChange={(e) => setUploadAlt(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Crédito / Fuente</label>
                <input
                  type="text"
                  value={uploadCredit}
                  onChange={(e) => setUploadCredit(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                onClick={() => setIsUploading(false)}
                className="px-4 py-2 text-xs text-slate-300 bg-slate-800 rounded-lg cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateUpload}
                className="px-4 py-2 text-xs font-bold text-slate-950 bg-orange-400 hover:bg-orange-500 rounded-lg shadow-sm cursor-pointer"
              >
                Guardar por URL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Media Grid */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Search & Category Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar en la biblioteca por nombre, título o ALT..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-orange-400"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {['all', 'Personajes', 'Mapa & Mundo', 'Vehículos', 'Armas', 'Personalización & Moda', 'Artes & Portadas', 'Mi Biblioteca (Cloudflare / Turso)'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-[#ff6486] text-white shadow-xs'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat === 'all' ? `Todas (${uniqueMedia.length})` : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filteredMedia.map((item) => {
              const isSelected = selectedMedia?.id === item.id;
              const displayUrl = formatDisplayUrl(item.url);
              const isR2 = item.url.includes('r2.cloudflarestorage.com') || item.url.includes('/api/r2-file') || item.url.includes('r2.dev');

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={`p-2.5 rounded-2xl border transition-all cursor-pointer space-y-2 group relative ${
                    isSelected 
                      ? 'bg-slate-900 border-orange-500 ring-2 ring-orange-500/20 shadow-lg' 
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900/90 hover:border-slate-700'
                  }`}
                >
                  <div className="aspect-16/9 rounded-xl overflow-hidden bg-slate-950 relative">
                    <img
                      src={displayUrl}
                      alt={item.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback image indicator if broken
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600';
                      }}
                    />
                    {isR2 && (
                      <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-slate-950/90 backdrop-blur-xs text-orange-400 font-mono text-[9px] font-bold border border-orange-500/30">
                        R2
                      </span>
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-white truncate">{item.name}</div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span>{item.dimensions}</span>
                      <span>{item.sizeKb} KB</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Image Inspector & ALT Text Editor */}
        <div className="lg:col-span-4 space-y-4">
          {selectedMedia ? (
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
              <div className="aspect-16/9 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                <img
                  src={formatDisplayUrl(selectedMedia.url)}
                  alt={selectedMedia.alt}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white truncate">{selectedMedia.name}</h3>
                <div className="text-[11px] font-mono text-slate-400">
                  {selectedMedia.dimensions} · {selectedMedia.sizeKb} KB · {selectedMedia.mimeType}
                </div>
              </div>

              {/* URL Copy Button */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedMedia.url);
                  setUploadSuccessMessage('URL copiada al portapapeles.');
                  setTimeout(() => setUploadSuccessMessage(null), 2500);
                }}
                className="w-full py-2 px-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-orange-400" />
                <span>Copiar URL de la Imagen</span>
              </button>

              {/* Metadata Fields */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                    Texto Alternativo (ALT) *
                  </label>
                  <textarea
                    rows={2}
                    value={altText}
                    onChange={(e) => {
                      setAltText(e.target.value);
                      setIsEditingMeta(true);
                    }}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                    Pie de Foto (Caption)
                  </label>
                  <input
                    type="text"
                    value={captionText}
                    onChange={(e) => {
                      setCaptionText(e.target.value);
                      setIsEditingMeta(true);
                    }}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                    Crédito / Fuente
                  </label>
                  <input
                    type="text"
                    value={creditText}
                    onChange={(e) => {
                      setCreditText(e.target.value);
                      setIsEditingMeta(true);
                    }}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              {/* Save or Delete Actions with Explicit Confirmation Dialog */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  onClick={() => setMediaToDelete(selectedMedia)}
                  className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg border border-red-500/20 transition-colors flex items-center gap-1.5 cursor-pointer font-bold"
                  title="Eliminar permanentemente"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  <span>Eliminar Imagen</span>
                </button>

                {isEditingMeta && (
                  <button
                    onClick={handleSaveMeta}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-lg shadow-sm cursor-pointer"
                  >
                    Guardar Cambios
                  </button>
                )}
              </div>

            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-500 text-xs">
              Selecciona una imagen de la biblioteca para inspeccionar sus metadatos.
            </div>
          )}
        </div>

      </div>

      {/* ========================================================= */}
      {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN PERMANENTE           */}
      {/* ========================================================= */}
      {mediaToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-red-500/40 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  ¿Eliminar Imagen Permanentemente?
                </h3>
                <p className="text-xs text-slate-400">Esta acción no se puede deshacer.</p>
              </div>
            </div>

            {/* Thumbnail Preview of image to delete */}
            <div className="aspect-16/9 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 relative">
              <img
                src={formatDisplayUrl(mediaToDelete.url)}
                alt={mediaToDelete.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-slate-950/90 p-2 text-[11px] font-mono text-slate-300 truncate">
                {mediaToDelete.name}
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              La imagen se eliminará del bucket de <strong className="text-orange-400">Cloudflare R2 (bubketgta6)</strong> y se borrará su registro en la base de datos <strong className="text-[#ffc456]">Turso DB</strong>.
            </p>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                disabled={isDeleting}
                onClick={() => setMediaToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-black text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>{isDeleting ? 'Eliminando...' : 'Sí, Eliminar de R2 y Turso'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Optimizer & Converter to WebP Modal */}
      <ImageOptimizerModal
        isOpen={isOptimizerModalOpen}
        onClose={() => setIsOptimizerModalOpen(false)}
      />

    </div>
  );
};
