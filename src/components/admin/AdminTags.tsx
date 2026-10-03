import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { TagItem } from '../../types/cms';
import { Tag, Plus, Edit3, Trash2, GitMerge, Search, Check, Hash } from 'lucide-react';

export const AdminTags: React.FC = () => {
  const { tags, addTag, updateTag, deleteTag, mergeTags, articles } = useCMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingTag, setEditingTag] = useState<TagItem | null>(null);

  // Form state
  const [tagName, setTagName] = useState('');
  const [tagSlug, setTagSlug] = useState('');
  const [isHashtag, setIsHashtag] = useState(false);
  const [tagDesc, setTagDesc] = useState('');

  // Merge state
  const [mergeSourceId, setMergeSourceId] = useState<string | null>(null);
  const [mergeTargetId, setMergeTargetId] = useState<string>('');

  const filteredTags = tags.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartEdit = (t: TagItem) => {
    setEditingTag(t);
    setTagName(t.name);
    setTagSlug(t.slug);
    setIsHashtag(t.isHashtag);
    setTagDesc(t.description || '');
    setIsAdding(false);
  };

  const handleSave = () => {
    if (!tagName.trim()) {
      alert('Nombre de la etiqueta requerido');
      return;
    }

    const calculatedSlug = tagSlug || tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingTag) {
      updateTag(editingTag.id, {
        name: tagName,
        slug: calculatedSlug,
        isHashtag,
        description: tagDesc
      });
      setEditingTag(null);
    } else {
      addTag({
        name: tagName,
        slug: calculatedSlug,
        isHashtag,
        description: tagDesc
      });
      setIsAdding(false);
    }

    setTagName('');
    setTagSlug('');
    setTagDesc('');
  };

  const handleExecuteMerge = () => {
    if (!mergeSourceId || !mergeTargetId || mergeSourceId === mergeTargetId) {
      alert('Selecciona una etiqueta de origen y otra de destino válida.');
      return;
    }

    const source = tags.find(t => t.id === mergeSourceId);
    const target = tags.find(t => t.id === mergeTargetId);

    if (confirm(`¿Fusionar "${source?.name}" dentro de "${target?.name}"? Todas las publicaciones actualizarán su referencia.`)) {
      mergeTags(mergeSourceId, mergeTargetId);
      setMergeSourceId(null);
      setMergeTargetId('');
      alert('Etiquetas fusionadas con éxito.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-display">
            Etiquetas Editoriales y Hashtags
          </h1>
          <p className="text-xs text-slate-400">
            Organiza los tópicos secundarios y hashtags sociales manteniendo una taxonomía limpia.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingTag(null);
            setTagName('');
            setTagSlug('');
            setIsHashtag(false);
            setTagDesc('');
            setIsAdding(true);
          }}
          className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Etiqueta</span>
        </button>
      </div>

      {/* Merge Modal if triggered */}
      {mergeSourceId && (
        <div className="p-5 rounded-xl bg-purple-950/40 border border-purple-500/40 space-y-3 animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-purple-300">
            <GitMerge className="w-4 h-4" />
            <span>Herramienta de Fusión de Etiquetas (Taxonomía Limpia)</span>
          </div>
          <p className="text-xs text-slate-300">
            Estás fusionando la etiqueta <strong className="text-purple-300">"{tags.find(t => t.id === mergeSourceId)?.name}"</strong> con otra existente para evitar duplicidades.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <select
              value={mergeTargetId}
              onChange={(e) => setMergeTargetId(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white flex-1"
            >
              <option value="">Seleccionar etiqueta destino...</option>
              {tags.filter(t => t.id !== mergeSourceId).map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.articleCount} artículos)</option>
              ))}
            </select>
            <button
              onClick={handleExecuteMerge}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg cursor-pointer"
            >
              Confirmar Fusión
            </button>
            <button
              onClick={() => setMergeSourceId(null)}
              className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-lg cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Form Card */}
      {(isAdding || editingTag) && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white font-display">
            {editingTag ? `Editar Etiqueta: ${editingTag.name}` : 'Crear Nueva Etiqueta / Hashtag'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Nombre</label>
              <input
                type="text"
                placeholder="Ej: Lucia"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Slug URL</label>
              <input
                type="text"
                placeholder="Ej: lucia"
                value={tagSlug}
                onChange={(e) => setTagSlug(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono"
              />
            </div>
            <div className="flex items-center gap-3 pt-4">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isHashtag}
                  onChange={(e) => setIsHashtag(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-rose-500 cursor-pointer"
                />
                <span>Habilitar como Hashtag Social</span>
              </label>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Descripción Breve</label>
            <input
              type="text"
              placeholder="Descripción temática..."
              value={tagDesc}
              onChange={(e) => setTagDesc(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => {
                setIsAdding(false);
                setEditingTag(null);
              }}
              className="px-4 py-2 text-xs text-slate-300 hover:text-white bg-slate-800 rounded-lg cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold text-white bg-[#ff6486] hover:bg-[#ff6486]/90 rounded-lg shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Guardar Etiqueta</span>
            </button>
          </div>
        </div>
      )}

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar etiquetas o hashtags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-400"
        />
      </div>

      {/* Tags Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredTags.map((tag) => {
          // calculate live article count from state
          const count = articles.filter(a => a.tags.some(t => t.toLowerCase() === tag.name.toLowerCase()) && a.status !== 'papelera').length;

          return (
            <div
              key={tag.id}
              className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 font-bold text-white text-sm">
                    {tag.isHashtag ? <Hash className="w-3.5 h-3.5 text-rose-400" /> : <Tag className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{tag.name}</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-rose-400 font-bold">
                    {count} art.
                  </span>
                </div>
                {tag.description && (
                  <p className="text-[11px] text-slate-400 line-clamp-1 font-light">
                    {tag.description}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                <button
                  onClick={() => setMergeSourceId(tag.id)}
                  className="hover:text-purple-400 flex items-center gap-1 font-mono text-[10px] cursor-pointer"
                  title="Fusionar con otra etiqueta"
                >
                  <GitMerge className="w-3 h-3" />
                  <span>Fusionar</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStartEdit(tag)}
                    className="p-1 hover:text-white rounded"
                    title="Editar"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar la etiqueta "${tag.name}"?`)) {
                        deleteTag(tag.id);
                      }
                    }}
                    className="p-1 hover:text-red-400 rounded"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
