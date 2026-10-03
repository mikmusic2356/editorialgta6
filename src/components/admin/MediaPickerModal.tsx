import React, { useState, useRef } from 'react';
import { useCMS } from '../../context/CMSContext';
import { MediaItem } from '../../types/cms';
import { uploadCompressedToR2, deleteFromR2 } from '../../lib/r2Service';
import { 
  X, 
  Search, 
  Plus, 
  Image as ImageIcon, 
  Check, 
  Sparkles, 
  Upload, 
  Cloud, 
  CheckCircle2, 
  Loader2, 
  Zap, 
  Trash2,
  AlertTriangle,
  Info
} from 'lucide-react';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMedia: (media: { url: string; alt?: string; caption?: string; title?: string }) => void;
  title?: string;
}

import { ImageOptimizerModal } from './ImageOptimizerModal';
import { PRESET_STOCK_MEDIA } from '../../data/mediaData';

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectMedia,
  title = 'Biblioteca de Medios & Galería Editorial'
}) => {
  const { media, addMediaItem, deleteMediaItem } = useCMS();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isOptimizerModalOpen, setIsOptimizerModalOpen] = useState(false);

  // File Upload State
  const [isCompressingAndUploading, setIsCompressingAndUploading] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Delete Confirmation Modal inside picker
  const [itemToDelete, setItemToDelete] = useState<{ id?: string; url: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // New URL input state
  const [newUrl, setNewUrl] = useState('');
  const [newName, setNewName] = useState('');
  const [newAlt, setNewAlt] = useState('');
  const [newCaption, setNewCaption] = useState('');

  if (!isOpen) return null;

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

  // Helper to determine category from URL
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

  // Combine media uniquely by URL to ensure zero duplicates and strict WebP
  const staticMap = new Map(PRESET_STOCK_MEDIA.map(p => [p.url, p]));
  const mediaMap = new Map<string, any>();

  media.forEach(m => {
    if (!m.url) return;
    const cleanUrl = m.url.startsWith('/images/') ? m.url.replace(/\.(jpg|jpeg|png)$/i, '.webp') : m.url;
    const staticInfo = staticMap.get(cleanUrl);
    mediaMap.set(cleanUrl, {
      id: m.id,
      url: cleanUrl,
      title: staticInfo?.title || m.title || m.name,
      alt: staticInfo?.alt || m.alt || m.title || m.name,
      caption: staticInfo?.caption || m.caption || '',
      category: resolveCategory(cleanUrl),
      sizeKb: staticInfo?.sizeKb || m.sizeKb || 150,
      dimensions: staticInfo?.dimensions || m.dimensions || '1920x1080',
      isR2: cleanUrl.includes('r2.cloudflarestorage.com') || cleanUrl.includes('/api/r2-file') || cleanUrl.includes('r2.dev'),
      isDeletable: true
    });
  });

  PRESET_STOCK_MEDIA.forEach((p: any) => {
    if (!p.url) return;
    if (!mediaMap.has(p.url)) {
      mediaMap.set(p.url, {
        id: p.id || p.url,
        url: p.url,
        title: p.title,
        alt: p.alt,
        caption: p.caption,
        category: p.category || resolveCategory(p.url),
        sizeKb: p.sizeKb || 150,
        dimensions: p.dimensions || '1920x1080',
        isR2: false,
        isDeletable: false
      });
    }
  });

  const allMediaItems = Array.from(mediaMap.values());

  const filteredMedia = allMediaItems.filter(item => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        (item.alt || '').toLowerCase().includes(q) ||
        (item.caption || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSelect = (item: { url: string; alt?: string; caption?: string; title?: string }) => {
    onSelectMedia({
      url: formatDisplayUrl(item.url),
      alt: item.alt,
      caption: item.caption,
      title: item.title
    });
    onClose();
  };

  // Direct file compression & upload to Cloudflare R2 + Turso DB
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressingAndUploading(true);
      setUploadFeedback('Optimizando y comprimiendo imagen a WebP...');

      // 1. Compress and Upload to Cloudflare R2
      const result = await uploadCompressedToR2(file, file.name, 'articulos');

      setUploadFeedback(`Comprimido: ${result.originalSizeKb} KB → ${result.sizeKb} KB (${result.compressionRatio}% ahorrado). Guardando en Turso DB...`);

      // 2. Save into Turso DB and CMS context
      const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const createdItem = addMediaItem({
        url: result.url,
        name: result.name,
        alt: cleanTitle,
        title: cleanTitle,
        caption: 'Recurso gráfico optimizado en Cloudflare R2.',
        credit: 'KAIROSION Editorial',
        sizeKb: result.sizeKb,
        dimensions: result.dimensions,
        mimeType: result.mimeType
      });

      setIsCompressingAndUploading(false);

      // 3. Immediately select for the current article and close modal
      handleSelect({
        url: createdItem.url,
        alt: createdItem.alt,
        caption: createdItem.caption,
        title: createdItem.title
      });

    } catch (error: any) {
      console.error('Error al comprimir o subir a Cloudflare R2:', error);
      setIsCompressingAndUploading(false);
      alert(`Error al procesar o subir la imagen: ${error?.message || error}`);
    }
  };

  // Delete handler from picker
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setIsDeleting(true);
      if (itemToDelete.url.includes('r2.cloudflarestorage.com') || itemToDelete.url.includes('/api/r2-file') || itemToDelete.url.includes('r2.dev')) {
        await deleteFromR2(itemToDelete.url);
      }
      if (itemToDelete.id) {
        deleteMediaItem(itemToDelete.id);
      }
      setIsDeleting(false);
      setItemToDelete(null);
    } catch (err: any) {
      console.error('Error al eliminar:', err);
      setIsDeleting(false);
      alert(`Error al eliminar: ${err?.message || err}`);
    }
  };

  const handleAddCustomImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    // Save to CMS Media Library
    const created = addMediaItem({
      url: newUrl.trim(),
      name: newName.trim() || 'Imagen personalizada',
      alt: newAlt.trim() || newName.trim() || 'Imagen editorial',
      title: newName.trim() || 'Imagen editorial',
      caption: newCaption.trim() || '',
      credit: 'KAIROSION Media Hub',
      sizeKb: 450,
      dimensions: '1920x1080',
      mimeType: 'image/jpeg'
    });

    handleSelect({
      url: created.url,
      alt: created.alt,
      caption: created.caption,
      title: created.title
    });
  };

  const categoriesList = ['all', 'Personajes', 'Mapa & Mundo', 'Vehículos', 'Armas', 'Personalización & Moda', 'Artes & Portadas', 'Mi Biblioteca (Cloudflare / Turso)'];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ff6486] to-[#ffc456] flex items-center justify-center text-slate-950 font-black shadow-md">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#ffc456] uppercase font-bold">
                  BIBLIOTECA MULTIMEDIA CENTRAL
                </span>
                <span className="px-2 py-0.2 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-[9px] font-mono font-bold flex items-center gap-1">
                  <Cloud className="w-2.5 h-2.5" />
                  <span>Cloudflare R2: bubketgta6</span>
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white font-display">
                {title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar: Direct File Upload to R2 + Search */}
        <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          
          {/* Quick R2 Upload Button + WebP Optimizer */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setIsOptimizerModalOpen(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 hover:bg-emerald-500/30 text-emerald-300 hover:text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-xs"
              title="Optimizar y convertir automáticamente todas las imágenes a formato WebP"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Comprimir imágenes y convertir</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              disabled={isCompressingAndUploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 via-rose-500 to-[#ffc456] hover:opacity-95 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-md shrink-0"
            >
              {isCompressingAndUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 fill-slate-950" />
              )}
              <span>{isCompressingAndUploading ? 'Comprimiendo y Subiendo...' : 'Subir y Comprimir Nueva Imagen (R2)'}</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar en la biblioteca..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#ff6486]"
            />
          </div>

        </div>

        {/* Upload Progress Feedback Banner */}
        {uploadFeedback && (
          <div className="px-5 py-2 bg-orange-500/15 border-b border-orange-500/30 text-orange-300 text-xs font-mono font-bold flex items-center gap-2 animate-in fade-in">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-400" />
            <span>{uploadFeedback}</span>
          </div>
        )}

        {/* Categories Bar */}
        <div className="px-5 py-2.5 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#ff6486] text-white shadow-xs'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat === 'all' ? 'Todas las Imágenes' : cat}
            </button>
          ))}
        </div>

        {/* Body Grid of Selectable Images */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Haz clic en cualquier imagen para asignarla ({filteredMedia.length} disponibles):</span>
            <span className="text-orange-400 font-bold">✓ Reutilizable en cualquier artículo</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
            {filteredMedia.map((item, idx) => {
              const displayUrl = formatDisplayUrl(item.url);

              return (
                <div
                  key={idx}
                  onClick={() => handleSelect(item)}
                  className="group relative aspect-16/10 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 hover:border-[#ff6486] hover:ring-2 hover:ring-[#ff6486] transition-all cursor-pointer shadow-md flex flex-col justify-end"
                >
                  <img
                    src={displayUrl}
                    alt={item.alt || item.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600';
                    }}
                  />
                  
                  {/* R2 / Category Chip */}
                  <div className="absolute top-2 left-2 flex items-center gap-1 z-10">
                    {item.isR2 && (
                      <span className="px-1.5 py-0.5 rounded bg-slate-950/90 text-orange-400 text-[9px] font-mono font-bold border border-orange-500/40">
                        R2
                      </span>
                    )}
                    <span className="px-1.5 py-0.5 rounded bg-slate-950/85 backdrop-blur-md text-[9px] font-mono text-[#ffc456] font-bold uppercase border border-slate-700 truncate max-w-[110px]">
                      {item.category}
                    </span>
                  </div>

                  {/* Delete button on hover if deletable */}
                  {item.isDeletable && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setItemToDelete({ id: item.id, url: item.url, title: item.title });
                      }}
                      className="absolute top-2 right-2 p-1 rounded-md bg-slate-950/90 hover:bg-red-600 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all z-20 shadow-md border border-slate-700"
                      title="Eliminar de Cloudflare R2 y Turso"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Caption Overlay on Hover */}
                  <div className="relative p-2.5 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent space-y-0.5 z-10">
                    <div className="text-xs font-bold text-white group-hover:text-[#ffc456] truncate">
                      {item.title}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span className="truncate">{item.dimensions}</span>
                      <span>{item.sizeKb} KB</span>
                    </div>
                  </div>

                  {/* Select check badge */}
                  <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-[#ff6486] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-20">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>

          {filteredMedia.length === 0 && (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <Search className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-white">No se encontraron imágenes</div>
              <p className="text-xs text-slate-400">Prueba con otro término de búsqueda o sube una nueva imagen a Cloudflare R2.</p>
            </div>
          )}

          {/* Quick External URL Option at bottom */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5 mt-4">
            <div className="text-xs font-mono uppercase text-[#ffc456] font-bold">
              ¿Quieres enlazar una URL de imagen externa?
            </div>
            <form onSubmit={handleAddCustomImage} className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="sm:col-span-6 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono"
              />
              <input
                type="text"
                placeholder="Nombre o descripción..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="sm:col-span-4 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
              />
              <button
                type="submit"
                disabled={!newUrl.trim()}
                className="sm:col-span-2 px-3 py-2 bg-[#ff6486] hover:bg-[#ff6486]/90 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Guardar y Usar
              </button>
            </form>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center shrink-0">
          <span className="text-xs font-mono text-slate-400">
            KAIROSION Media Library · Conectado a Turso DB y Cloudflare R2
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>

      {/* Confirmation Modal for Deletion in Picker */}
      {itemToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in" onClick={(e) => e.stopPropagation()}>
          <div className="w-full max-w-sm bg-slate-900 border border-red-500/40 rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-sm font-bold text-white font-display">
                ¿Eliminar esta imagen?
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              Se eliminará permanentemente de <strong className="text-orange-400">Cloudflare R2</strong> y de la base de datos <strong className="text-[#ffc456]">Turso DB</strong>.
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <button
                disabled={isDeleting}
                onClick={() => setItemToDelete(null)}
                className="px-3 py-1.5 text-xs text-slate-300 bg-slate-800 rounded-lg cursor-pointer"
              >
                Cancelar
              </button>
              <button
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-md cursor-pointer flex items-center gap-1.5"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>{isDeleting ? 'Eliminando...' : 'Eliminar'}</span>
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
