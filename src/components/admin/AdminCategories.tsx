import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { MainCategory, SubCategory, MainCategorySlug } from '../../types';
import { 
  FolderTree, 
  Plus, 
  Edit3, 
  Trash2, 
  ChevronRight, 
  FolderPlus, 
  Check, 
  X, 
  Sparkles,
  Layers,
  Flame,
  Newspaper,
  Compass,
  Users,
  MapPin,
  Car,
  Crosshair,
  Shield,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

const PRESET_ICONS = [
  { name: 'Flame', label: 'Llama / Destacado', icon: Flame },
  { name: 'Newspaper', label: 'Periódico / Noticias', icon: Newspaper },
  { name: 'Compass', label: 'Brújula / Guías', icon: Compass },
  { name: 'Sparkles', label: 'Trucos / Magia', icon: Sparkles },
  { name: 'Users', label: 'Personajes / Dúo', icon: Users },
  { name: 'MapPin', label: 'Mapa / Distritos', icon: MapPin },
  { name: 'Car', label: 'Vehículos / Motor', icon: Car },
  { name: 'Crosshair', label: 'Armas / Balística', icon: Crosshair },
  { name: 'Shield', label: 'Rockstar / Legal', icon: Shield },
];

export const AdminCategories: React.FC = () => {
  const { 
    categories, 
    addCategory, 
    updateCategory, 
    deleteCategory, 
    addSubcategory, 
    updateSubcategory,
    deleteSubcategory,
    articles 
  } = useCMS();

  const [selectedCatSlug, setSelectedCatSlug] = useState<string>(categories[0]?.slug || 'gta-6');
  const [isEditingCat, setIsEditingCat] = useState(false);
  const [isAddingCat, setIsAddingCat] = useState(false);
  
  // Category Form State
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catTagline, setCatTagline] = useState('');
  const [catShortDesc, setCatShortDesc] = useState('');
  const [catColor, setCatColor] = useState('#ff6486');
  const [catIcon, setCatIcon] = useState('Flame');

  // Subcategory Add / Edit State
  const [isAddingSub, setIsAddingSub] = useState(false);
  const [editingSubSlug, setEditingSubSlug] = useState<string | null>(null);
  const [subName, setSubName] = useState('');
  const [subSlug, setSubSlug] = useState('');
  const [subDesc, setSubDesc] = useState('');

  const activeCategory = categories.find(c => c.slug === selectedCatSlug) || categories[0];

  const generateSlugFromName = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleStartEditCategory = (cat: MainCategory) => {
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatTagline(cat.tagline || '');
    setCatShortDesc(cat.shortDesc || '');
    setCatColor(cat.color || '#ff6486');
    setCatIcon(cat.iconName || 'Flame');
    setIsEditingCat(true);
    setIsAddingCat(false);
  };

  const handleStartCreateCategory = () => {
    setCatName('');
    setCatSlug('');
    setCatTagline('');
    setCatShortDesc('');
    setCatColor('#ff6486');
    setCatIcon('Flame');
    setIsAddingCat(true);
    setIsEditingCat(false);
  };

  const handleSaveCategory = () => {
    if (!catName.trim() || !catSlug.trim()) {
      alert('Por favor ingresa un nombre y un slug válido para la categoría.');
      return;
    }

    const formattedSlug = catSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');

    if (isEditingCat && activeCategory) {
      updateCategory(activeCategory.slug, {
        slug: formattedSlug as MainCategorySlug,
        name: catName.trim(),
        tagline: catTagline.trim(),
        shortDesc: catShortDesc.trim(),
        color: catColor,
        iconName: catIcon
      });
      setIsEditingCat(false);
      setSelectedCatSlug(formattedSlug);
    } else {
      // Check if slug exists
      if (categories.some(c => c.slug === formattedSlug)) {
        alert('Ya existe una categoría con este slug. Elige uno diferente.');
        return;
      }

      addCategory({
        slug: formattedSlug as MainCategorySlug,
        name: catName.trim(),
        tagline: catTagline.trim(),
        shortDesc: catShortDesc.trim(),
        color: catColor,
        iconName: catIcon,
        subcategories: []
      });
      setIsAddingCat(false);
      setSelectedCatSlug(formattedSlug);
    }
  };

  // Subcategory Actions
  const handleStartEditSubcategory = (sub: SubCategory) => {
    setEditingSubSlug(sub.slug);
    setSubName(sub.name);
    setSubSlug(sub.slug);
    setSubDesc(sub.description || '');
    setIsAddingSub(false);
  };

  const handleSaveSubcategory = () => {
    if (!subName.trim() || !subSlug.trim()) {
      alert('Por favor ingresa un nombre y un slug para la subcategoría.');
      return;
    }

    const formattedSubSlug = subSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');

    if (editingSubSlug) {
      updateSubcategory(activeCategory.slug, editingSubSlug, {
        name: subName.trim(),
        slug: formattedSubSlug,
        description: subDesc.trim()
      });
      setEditingSubSlug(null);
    } else {
      addSubcategory(activeCategory.slug, {
        name: subName.trim(),
        slug: formattedSubSlug,
        description: subDesc.trim()
      });
      setIsAddingSub(false);
    }

    setSubName('');
    setSubSlug('');
    setSubDesc('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in">
      
      {/* 1. TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#ff6486] font-bold">
            <FolderTree className="w-4 h-4 text-[#ff6486]" />
            <span>ESTRUCTURA DE CATEGORÍAS & SLUGS EDITABLES</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Categorías, Subcategorías y Slugs
          </h1>
          <p className="text-xs text-slate-400">
            Crea, edita nombres, personaliza los slugs de URL (/categoria/:slug) y organiza la jerarquía editorial.
          </p>
        </div>

        <button
          onClick={handleStartCreateCategory}
          className="px-4 py-2.5 rounded-xl bg-[#ff6486] hover:bg-[#ff6486]/90 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2 cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Categoría Principal</span>
        </button>
      </div>

      {/* 2. MAIN 2-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Main Categories List Shelf (5 COLS) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase tracking-wider font-bold px-1">
            <span>Áreas Editoriales ({categories.length})</span>
            <span>URL Slug</span>
          </div>

          <div className="space-y-2">
            {categories.map((cat) => {
              const isSelected = activeCategory?.slug === cat.slug;
              const catArticles = articles.filter(a => a.category === cat.slug && a.status !== 'papelera');

              return (
                <div
                  key={cat.slug}
                  onClick={() => {
                    setSelectedCatSlug(cat.slug);
                    setIsEditingCat(false);
                    setIsAddingCat(false);
                    setEditingSubSlug(null);
                    setIsAddingSub(false);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected 
                      ? 'bg-slate-900 border-[#ff6486] shadow-lg ring-1 ring-[#ff6486]/50'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 shadow-inner"
                      style={{ 
                        backgroundColor: `${cat.color || '#ff6486'}20`, 
                        color: cat.color || '#ff6486',
                        borderColor: `${cat.color || '#ff6486'}40`,
                        borderWidth: '1px'
                      }}
                    >
                      <FolderTree className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="text-sm font-bold text-white truncate flex items-center gap-2">
                        <span>{cat.name}</span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ff6486] animate-pulse" />
                        )}
                      </div>
                      <div className="text-xs font-mono text-[#ffc456] truncate">
                        /categoria/{cat.slug}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950 border border-slate-800 text-slate-300">
                      {catArticles.length} arts
                    </span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-[#ff6486] translate-x-0.5' : 'text-slate-600'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Category Details, Edit Form & Subcategories (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Category Edit or Create Form */}
          {(isEditingCat || isAddingCat) ? (
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-700 space-y-5 shadow-xl animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#ff6486]/20 border border-[#ff6486]/40 flex items-center justify-center text-[#ff6486] font-bold">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-display">
                      {isEditingCat ? `Editar Categoría: ${activeCategory?.name}` : 'Crear Nueva Categoría Principal'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Puedes modificar libremente el nombre y el slug de la URL.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsEditingCat(false);
                    setIsAddingCat(false);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Inputs */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category Name */}
                  <div>
                    <label className="text-[10px] font-mono uppercase text-[#ffc456] block mb-1 font-bold">
                      Nombre de la Categoría *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Armas y Balística"
                      value={catName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCatName(val);
                        if (isAddingCat) {
                          setCatSlug(generateSlugFromName(val));
                        }
                      }}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-hidden focus:border-[#ff6486]"
                    />
                  </div>

                  {/* Category Slug (FULLY EDITABLE) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-mono uppercase text-[#ff6486] font-bold">
                        Slug de la URL (/categoria/:slug) *
                      </label>
                      <button
                        type="button"
                        onClick={() => setCatSlug(generateSlugFromName(catName))}
                        className="text-[10px] font-mono text-[#ffc456] hover:underline flex items-center gap-1 cursor-pointer"
                        title="Generar slug automáticamente a partir del nombre"
                      >
                        <RefreshCw className="w-2.5 h-2.5" />
                        <span>Autogenerar</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="ej: armas-y-balistica"
                      value={catSlug}
                      onChange={(e) => setCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-hidden focus:border-[#ff6486]"
                    />
                    <div className="text-[10px] font-mono text-slate-400 mt-1">
                      Ruta pública: <span className="text-[#ffc456]">{catSlug === 'gta-6' ? '/gta-6' : `/gta-6/${catSlug || 'tu-slug'}`}</span>
                    </div>
                  </div>
                </div>

                {/* Tagline */}
                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                    Lema Editorial / Tagline
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Arsenal, daño, retroceso y ubicaciones de compra en Vice City"
                    value={catTagline}
                    onChange={(e) => setCatTagline(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  />
                </div>

                {/* Short Description */}
                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                    Descripción Corta (SEO & Tarjetas)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Descripción para metadatos y encabezados de archivo..."
                    value={catShortDesc}
                    onChange={(e) => setCatShortDesc(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  />
                </div>

                {/* Color and Icon Picker */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                      Color Temático
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={catColor}
                        onChange={(e) => setCatColor(e.target.value)}
                        className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={catColor}
                        onChange={(e) => setCatColor(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                      Icono Editorial
                    </label>
                    <select
                      value={catIcon}
                      onChange={(e) => setCatIcon(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                    >
                      {PRESET_ICONS.map((ico) => (
                        <option key={ico.name} value={ico.name}>{ico.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingCat(false);
                    setIsAddingCat(false);
                  }}
                  className="px-4 py-2 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveCategory}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#ff6486] hover:bg-[#ff6486]/90 rounded-lg shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Guardar Categoría</span>
                </button>
              </div>

            </div>
          ) : (
            /* Active Category Overview Card */
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-sm">
              <div className="flex items-start justify-between border-b border-slate-800 pb-4 gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-[#ffc456] uppercase font-bold">
                    <span>{activeCategory?.slug === 'gta-6' ? '/gta-6 (Super Categoría)' : `/gta-6/${activeCategory?.slug}`}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white font-display">
                    {activeCategory?.name}
                  </h2>
                  <p className="text-xs text-[#ff6486] font-mono">
                    {activeCategory?.tagline}
                  </p>
                  <p className="text-xs text-slate-300 font-light max-w-lg pt-1">
                    {activeCategory?.shortDesc}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStartEditCategory(activeCategory)}
                    className="px-3.5 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-[#ff6486] rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#ffc456]" />
                    <span>Editar Categoría y Slug</span>
                  </button>
                </div>
              </div>

              {/* Subcategories Management */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-mono uppercase text-white font-bold flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#ff6486]" />
                      <span>Subcategorías ({activeCategory?.subcategories.length || 0})</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Rutas específicas bajo /gta-6/{activeCategory?.slug === 'gta-6' ? '' : `${activeCategory?.slug}/`}:subslug
                    </p>
                  </div>

                  {!isAddingSub && !editingSubSlug && (
                    <button
                      onClick={() => {
                        setIsAddingSub(true);
                        setEditingSubSlug(null);
                        setSubName('');
                        setSubSlug('');
                        setSubDesc('');
                      }}
                      className="px-3 py-1.5 text-xs font-mono text-[#ffc456] hover:text-white bg-slate-950 border border-slate-800 hover:border-[#ff6486] rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Añadir Subcategoría</span>
                    </button>
                  )}
                </div>

                {/* Subcategory Add / Edit Form */}
                {(isAddingSub || editingSubSlug) && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-[#ff6486]/50 space-y-3 shadow-md animate-in fade-in">
                    <div className="flex items-center justify-between text-xs font-bold text-[#ff6486] font-mono">
                      <span>{editingSubSlug ? `Editar Subcategoría (${editingSubSlug})` : `Nueva Subcategoría en ${activeCategory.name}`}</span>
                      <button
                        onClick={() => {
                          setIsAddingSub(false);
                          setEditingSubSlug(null);
                        }}
                        className="text-slate-400 hover:text-white cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Nombre</label>
                        <input
                          type="text"
                          placeholder="Ej: Guías de Misiones"
                          value={subName}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSubName(val);
                            if (!editingSubSlug) {
                              setSubSlug(generateSlugFromName(val));
                            }
                          }}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] font-mono uppercase text-[#ffc456] font-bold">Slug URL</label>
                          <button
                            type="button"
                            onClick={() => setSubSlug(generateSlugFromName(subName))}
                            className="text-[9px] font-mono text-slate-400 hover:text-[#ffc456] cursor-pointer"
                          >
                            Autogenerar
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="guias-misiones"
                          value={subSlug}
                          onChange={(e) => setSubSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Descripción</label>
                      <input
                        type="text"
                        placeholder="Descripción corta para filtros y menú..."
                        value={subDesc}
                        onChange={(e) => setSubDesc(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => {
                          setIsAddingSub(false);
                          setEditingSubSlug(null);
                        }}
                        className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-900 rounded cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSaveSubcategory}
                        className="px-4 py-1.5 text-xs font-bold bg-[#ff6486] hover:bg-[#ff6486]/90 text-white rounded cursor-pointer flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Guardar Subcategoría</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Subcategories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeCategory?.subcategories.map((sub) => {
                    const subArticleCount = articles.filter(a => a.subcategorySlug === sub.slug && a.status !== 'papelera').length;

                    return (
                      <div 
                        key={sub.slug}
                        className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-slate-700 flex items-center justify-between gap-2 shadow-xs"
                      >
                        <div className="space-y-0.5 min-w-0 flex-1">
                          <div className="text-xs font-bold text-white truncate">{sub.name}</div>
                          <div className="text-[10px] text-[#ffc456] font-mono truncate">
                            /gta-6{activeCategory.slug === 'gta-6' ? '' : `/${activeCategory.slug}`}/{sub.slug}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                            {subArticleCount} arts
                          </span>

                          <button
                            onClick={() => handleStartEditSubcategory(sub)}
                            className="p-1.5 text-slate-400 hover:text-[#ffc456] hover:bg-slate-900 rounded cursor-pointer"
                            title="Editar subcategoría y slug"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`¿Eliminar la subcategoría "${sub.name}"?`)) {
                                deleteSubcategory(activeCategory.slug, sub.slug);
                              }
                            }}
                            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-900 rounded cursor-pointer"
                            title="Eliminar subcategoría"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
