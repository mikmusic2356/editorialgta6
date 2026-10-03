import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { BreakingNewsItem } from '../../types/cms';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  Zap, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  Link as LinkIcon,
  Sparkles,
  Radio
} from 'lucide-react';

const PRESET_BADGES = ['OFICIAL', 'EXCLUSIVA', 'FILTRACIÓN', 'URGENTE', 'ACTUALIZACIÓN', 'GAMEPLAY', 'MOTOR GRÁFICO', 'PERSONAJES', 'MAPA & CIUDAD'];

export const AdminBreakingNews: React.FC = () => {
  const { breakingNews, addBreakingNews, updateBreakingNews, deleteBreakingNews, toggleBreakingNews, articles, categories } = useCMS();

  // Create Form State
  const [newText, setNewText] = useState('');
  const [newBadge, setNewBadge] = useState('OFICIAL');
  const [newLinkType, setNewLinkType] = useState<'article' | 'category' | 'url'>('article');
  const [newLinkTarget, setNewLinkTarget] = useState('');

  // Edit Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editBadge, setEditBadge] = useState('');
  const [editLinkType, setEditLinkType] = useState<'article' | 'category' | 'url'>('article');
  const [editLinkTarget, setEditLinkTarget] = useState('');

  const activeCount = breakingNews.filter(n => n.isActive).length;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    addBreakingNews({
      text: newText.trim(),
      badge: newBadge.trim() || undefined,
      linkType: newLinkType,
      linkTarget: newLinkTarget.trim() || undefined,
      isActive: true,
      order: breakingNews.length + 1
    });

    setNewText('');
    setNewLinkTarget('');
  };

  const handleStartEdit = (item: BreakingNewsItem) => {
    setEditingId(item.id);
    setEditText(item.text);
    setEditBadge(item.badge || 'OFICIAL');
    setEditLinkType(item.linkType || 'article');
    setEditLinkTarget(item.linkTarget || '');
  };

  const handleSaveEdit = (id: string) => {
    if (!editText.trim()) return;

    updateBreakingNews(id, {
      text: editText.trim(),
      badge: editBadge.trim() || undefined,
      linkType: editLinkType,
      linkTarget: editLinkTarget.trim() || undefined
    });

    setEditingId(null);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const items = [...breakingNews];
    const temp = items[index];
    items[index] = items[index - 1];
    items[index - 1] = temp;
    items.forEach((item, idx) => updateBreakingNews(item.id, { order: idx + 1 }));
  };

  const handleMoveDown = (index: number) => {
    if (index === breakingNews.length - 1) return;
    const items = [...breakingNews];
    const temp = items[index];
    items[index] = items[index + 1];
    items[index + 1] = temp;
    items.forEach((item, idx) => updateBreakingNews(item.id, { order: idx + 1 }));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#ff6486] font-bold">
            <Radio className="w-4 h-4 text-[#ff6486] animate-pulse" />
            <span>MÓDULO DE TRANSMISIÓN EN VIVO · ÚLTIMA HORA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Cinta de Noticias de Última Hora
          </h1>
          <p className="text-xs text-slate-400">
            Administra la cola de alertas y noticias que se desplazan continuamente con el círculo rojo animado en la cabecera.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-[#ffc456] font-bold flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span>{activeCount} noticias activas en cola</span>
          </span>
        </div>
      </div>

      {/* 2. FORM TO CREATE BREAKING NEWS */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#ffc456] font-bold">
          <Plus className="w-4 h-4 text-[#ffc456]" />
          <span>Añadir Nueva Noticia a la Cola de Última Hora</span>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            
            {/* News Headline */}
            <div className="sm:col-span-8">
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1 font-bold">
                Texto de la Noticia *
              </label>
              <input
                type="text"
                placeholder="Ej: Take-Two Interactive confirma el cierre de la ventana de lanzamiento de GTA VI..."
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#ff6486]"
              />
            </div>

            {/* Badge / Category Tag */}
            <div className="sm:col-span-4">
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Distintivo de la Alerta
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="OFICIAL"
                  value={newBadge}
                  onChange={(e) => setNewBadge(e.target.value)}
                  className="flex-1 px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-[#ffc456] font-mono uppercase font-bold focus:outline-hidden focus:border-[#ff6486]"
                />
              </div>
            </div>

          </div>

          {/* Quick preset badges */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] font-mono text-slate-400 mr-1">Etiquetas sugeridas:</span>
            {PRESET_BADGES.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setNewBadge(b)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer border ${
                  newBadge === b
                    ? 'bg-[#ff6486] text-white border-[#ff6486] font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-white border-slate-800'
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          {/* Link Redirection (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-slate-800/80">
            <div className="sm:col-span-4">
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Tipo de Enlace al Hacer Clic (Opcional)
              </label>
              <select
                value={newLinkType}
                onChange={(e) => {
                  setNewLinkType(e.target.value as any);
                  setNewLinkTarget('');
                }}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-hidden focus:border-[#ff6486]"
              >
                <option value="article">Vincular a Artículo Específico</option>
                <option value="category">Vincular a Categoría</option>
                <option value="url">URL Externa o Ruta Personalizada</option>
              </select>
            </div>

            <div className="sm:col-span-6">
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Destino del Enlace
              </label>
              {newLinkType === 'article' && (
                <select
                  value={newLinkTarget}
                  onChange={(e) => setNewLinkTarget(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-hidden focus:border-[#ff6486]"
                >
                  <option value="">Seleccionar Artículo...</option>
                  {articles.filter(a => a.status === 'publicado').map(art => (
                    <option key={art.id} value={art.slug}>{art.title}</option>
                  ))}
                </select>
              )}

              {newLinkType === 'category' && (
                <select
                  value={newLinkTarget}
                  onChange={(e) => setNewLinkTarget(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-hidden focus:border-[#ff6486]"
                >
                  <option value="">Seleccionar Categoría...</option>
                  {categories.map(cat => (
                    <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              )}

              {newLinkType === 'url' && (
                <input
                  type="text"
                  placeholder="https://... o /ruta"
                  value={newLinkTarget}
                  onChange={(e) => setNewLinkTarget(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-mono"
                />
              )}
            </div>

            <div className="sm:col-span-2 flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#ff6486] hover:bg-[#ff6486]/90 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Añadir a Cinta</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 3. CURRENT QUEUE LIST */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white font-display uppercase tracking-wide">
            Cola de Noticias Activas ({breakingNews.length})
          </h2>
          <span className="text-xs font-mono text-slate-400">
            Usa las flechas para reordenar la posición en la cinta
          </span>
        </div>

        {breakingNews.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
            No hay noticias en la cola de última hora. Crea una arriba para que aparezca en la cinta en vivo.
          </div>
        ) : (
          <div className="space-y-2.5">
            {breakingNews.map((item, index) => {
              const isEditing = editingId === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    item.isActive
                      ? 'bg-slate-900/90 border-slate-800'
                      : 'bg-slate-950/60 border-slate-800/60 opacity-60'
                  }`}
                >
                  {isEditing ? (
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="sm:col-span-8 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                        />
                        <input
                          type="text"
                          value={editBadge}
                          onChange={(e) => setEditBadge(e.target.value)}
                          className="sm:col-span-4 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-[#ffc456] font-mono"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSaveEdit(item.id)}
                          className="px-3 py-1 text-xs bg-emerald-600 text-white font-bold rounded-lg cursor-pointer"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 text-xs bg-slate-800 text-slate-300 rounded-lg cursor-pointer"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Order indicator */}
                      <span className="w-6 h-6 rounded-md bg-slate-950 text-[#ffc456] border border-slate-800 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                        #{index + 1}
                      </span>

                      {/* Badge */}
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-[#ffc456]/40 text-[#ffc456] text-[10px] font-mono font-bold uppercase shrink-0">
                          {item.badge}
                        </span>
                      )}

                      {/* News Text */}
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white truncate">
                          {item.text}
                        </div>
                        {item.linkTarget && (
                          <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 truncate">
                            <LinkIcon className="w-3 h-3 text-[#ff6486]" />
                            <span>Vínculo: {item.linkTarget}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions Toolbar */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Reorder Up/Down */}
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      title="Mover arriba"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === breakingNews.length - 1}
                      className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      title="Mover abajo"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Toggle Active/Inactive */}
                    <button
                      onClick={() => toggleBreakingNews(item.id)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        item.isActive
                          ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-500'
                      }`}
                      title={item.isActive ? 'Pausar noticia' : 'Activar noticia'}
                    >
                      {item.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => handleStartEdit(item)}
                      className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-[#ff6486] cursor-pointer"
                      title="Editar"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deleteBreakingNews(item.id)}
                      className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-red-400 cursor-pointer"
                      title="Eliminar de la cola"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
