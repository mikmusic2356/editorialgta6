import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { NavigationMenuItem } from '../../types/cms';
import { Menu, Plus, Trash2, ArrowUp, ArrowDown, ExternalLink, RotateCcw, Check } from 'lucide-react';

export const AdminMenus: React.FC = () => {
  const { mainMenu, updateMainMenu, categories } = useCMS();

  const [items, setItems] = useState<NavigationMenuItem[]>(mainMenu);
  const [newLabel, setNewLabel] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...items];
    const temp = newItems[index - 1];
    newItems[index - 1] = newItems[index];
    newItems[index] = temp;
    setItems(newItems);
  };

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    const temp = newItems[index + 1];
    newItems[index + 1] = newItems[index];
    newItems[index] = temp;
    setItems(newItems);
  };

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAddItem = () => {
    if (!newLabel.trim() || !newUrl.trim()) {
      alert('Etiqueta y URL requeridas.');
      return;
    }

    const newItem: NavigationMenuItem = {
      id: `custom-menu-${Date.now()}`,
      label: newLabel,
      url: newUrl,
      order: items.length + 1
    };

    setItems(prev => [...prev, newItem]);
    setNewLabel('');
    setNewUrl('');
  };

  const handleSaveMenu = () => {
    updateMainMenu(items);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleResetToTaxonomy = () => {
    if (confirm('¿Restablecer el menú con la estructura de categorías de SITE_TAXONOMY?')) {
      const generated = categories.map((cat, idx) => ({
        id: `menu-${cat.slug}`,
        label: cat.name,
        url: `/${cat.slug}`,
        order: idx + 1,
        children: cat.subcategories.map((sub, sIdx) => ({
          id: `submenu-${cat.slug}-${sub.slug}`,
          label: sub.name,
          url: `/${cat.slug}/${sub.slug}`,
          order: sIdx + 1,
          parentId: `menu-${cat.slug}`
        }))
      }));
      setItems(generated);
      updateMainMenu(generated);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-display">
            Gestión de Menús de Navegación
          </h1>
          <p className="text-xs text-slate-400">
            Controla los enlaces principales del encabezado, el menú desplegable móvil y el pie de página.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetToTaxonomy}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer desde Categorías</span>
          </button>

          <button
            onClick={handleSaveMenu}
            className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{isSaved ? '¡Guardado!' : 'Guardar Menú'}</span>
          </button>
        </div>
      </div>

      {/* Add New Link Box */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="text-xs font-mono uppercase text-slate-400 font-bold">
          Añadir Enlace Personalizado
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Texto del enlace (Ej: Foro / Discord)"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
          />
          <input
            type="text"
            placeholder="URL de destino (Ej: /comunidad o https://...)"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono"
          />
          <button
            onClick={handleAddItem}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-rose-400 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir al Menú</span>
          </button>
        </div>
      </div>

      {/* Menu Items Order Tree */}
      <div className="space-y-2">
        <div className="text-xs font-mono text-slate-400 uppercase font-bold px-1">
          Estructura Actual del Menú ({items.length} elementos)
        </div>

        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-500 w-5 text-center font-bold">
                  {index + 1}
                </span>
                <div>
                  <div className="text-sm font-bold text-white">{item.label}</div>
                  <div className="text-[11px] font-mono text-rose-400">{item.url}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800 cursor-pointer"
                  title="Mover arriba"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleMoveDown(index)}
                  disabled={index === items.length - 1}
                  className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800 cursor-pointer"
                  title="Mover abajo"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1 text-slate-400 hover:text-red-400 rounded hover:bg-slate-800 cursor-pointer ml-2"
                  title="Eliminar elemento"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
