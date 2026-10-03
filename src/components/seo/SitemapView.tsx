import React, { useState, useMemo } from 'react';
import { useCMS } from '../../context/CMSContext';
import { MainCategorySlug } from '../../types';
import { getAllSitemapEntries, generateSitemapXml, SitemapUrlEntry } from '../../utils/sitemapGenerator';
import { 
  FileCode, 
  Search, 
  ExternalLink, 
  Copy, 
  Check, 
  Download, 
  Layers, 
  Globe, 
  Calendar, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles,
  FolderTree,
  FileText,
  Users,
  Car,
  Crosshair,
  MapPin,
  ChevronRight
} from 'lucide-react';

interface SitemapViewProps {
  onNavigate: (path: string) => void;
  onBackToHome: () => void;
}

export const SitemapView: React.FC<SitemapViewProps> = ({
  onNavigate,
  onBackToHome,
}) => {
  const { articles, categories, staticPages } = useCMS();
  const [activeTab, setActiveTab] = useState<'visual' | 'xml'>('visual');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [copied, setCopied] = useState(false);

  // Generate all dynamic entries
  const allEntries = useMemo(() => {
    return getAllSitemapEntries(articles, categories, staticPages);
  }, [articles, categories, staticPages]);

  const xmlContent = useMemo(() => {
    return generateSitemapXml(articles, categories, staticPages);
  }, [articles, categories, staticPages]);

  // Distinct sections for filtering
  const sectionsList = useMemo(() => {
    const set = new Set<string>();
    allEntries.forEach(e => set.add(e.section));
    return ['all', ...Array.from(set)];
  }, [allEntries]);

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return allEntries.filter(entry => {
      if (selectedSection !== 'all' && entry.section !== selectedSection) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          entry.title.toLowerCase().includes(q) ||
          entry.path.toLowerCase().includes(q) ||
          entry.section.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allEntries, selectedSection, searchQuery]);

  // Copy XML to clipboard
  const handleCopyXml = () => {
    navigator.clipboard.writeText(xmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Download XML file
  const handleDownloadXml = () => {
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getSectionIcon = (section: string) => {
    if (section.includes('Artículos')) return FileText;
    if (section.includes('Categorías')) return FolderTree;
    if (section.includes('Personajes')) return Users;
    if (section.includes('Vehículos')) return Car;
    if (section.includes('Arsenal') || section.includes('Armería')) return Crosshair;
    if (section.includes('Distritos') || section.includes('Cartografía')) return MapPin;
    return Globe;
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in py-4">
      
      {/* 1. TOP BREADCRUMB & BACK ACTION */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-mono text-[#ffc456] hover:underline cursor-pointer bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-[#ff6486] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#ff6486]" />
          <span>Volver a la Portada Principal</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs font-mono text-[#ffc456]">
            Total URLs Indexadas: <strong className="text-white">{allEntries.length}</strong>
          </span>
        </div>
      </div>

      {/* 2. HERO HEADER */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 space-y-4 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <FolderTree className="w-64 h-64 text-[#ff6486]" />
        </div>

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-[#ff6486]/40 text-[#ff6486] text-xs font-mono font-bold">
            <Globe className="w-3.5 h-3.5 text-[#ff6486]" />
            <span>ESTRUCTURA DE ENLACES & INDEXACIÓN WEB</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display tracking-tight">
            Mapa del Sitio Web · Directorio de URLs y Sitemap XML
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed font-light">
            Explora la arquitectura completa de KAIROSION con enlaces directos hacia cada artículo, categoría, base de datos interactiva y página oficial, o inspecciona el código XML estándar para Google Search Console.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="pt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('visual')}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'visual'
                  ? 'bg-[#ff6486] text-white shadow-lg shadow-[#ff6486]/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <FolderTree className="w-4 h-4" />
              <span>Mapa Visual del Sitio ({allEntries.length} URLs)</span>
            </button>

            <button
              onClick={() => setActiveTab('xml')}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'xml'
                  ? 'bg-[#ffc456] text-slate-950 shadow-lg shadow-[#ffc456]/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>Visor de Código Sitemap XML (sitemap.xml)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. VISUAL DIRECTORY TAB */}
      {activeTab === 'visual' && (
        <div className="space-y-6">
          
          {/* Filter Toolbar */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por título de artículo, categoría o ruta (/articulo/...)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#ff6486]"
              />
            </div>

            {/* Section Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {sectionsList.map((sec) => (
                <button
                  key={sec}
                  onClick={() => setSelectedSection(sec)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedSection === sec
                      ? 'bg-[#ff6486] text-white'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {sec === 'all' ? 'Todas las Secciones' : sec}
                </button>
              ))}
            </div>
          </div>

          {/* Directory Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredEntries.map((entry, idx) => {
              const IconComponent = getSectionIcon(entry.section);

              return (
                <div
                  key={idx}
                  onClick={() => onNavigate(entry.path)}
                  className="group p-4 rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-[#ff6486] hover:bg-slate-900 transition-all cursor-pointer shadow-md flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 group-hover:border-[#ff6486]/40 flex items-center justify-center text-[#ff6486] shrink-0">
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-950 border border-slate-800 text-[#ffc456] uppercase">
                          {entry.section}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          Prioridad {entry.priority.toFixed(2)}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white group-hover:text-[#ff6486] transition-colors truncate">
                        {entry.title}
                      </h3>

                      <div className="text-xs font-mono text-slate-400 group-hover:text-slate-200 transition-colors truncate flex items-center gap-1">
                        <span>{entry.path}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg text-slate-500 group-hover:text-[#ff6486] group-hover:bg-[#ff6486]/10 transition-colors shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>

          {filteredEntries.length === 0 && (
            <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
              <Search className="w-8 h-8 text-slate-500 mx-auto" />
              <div className="text-sm font-bold text-white">No se encontraron enlaces para esta búsqueda</div>
              <p className="text-xs text-slate-400">Intenta buscar con otros términos o selecciona «Todas las Secciones».</p>
            </div>
          )}

        </div>
      )}

      {/* 4. XML CODE VIEWER TAB */}
      {activeTab === 'xml' && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="text-xs font-mono text-[#ffc456] uppercase font-bold flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-[#ffc456]" />
                <span>Documento XML Estándar sitemap.xml</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Generado dinámicamente con codificación UTF-8, tags &lt;loc&gt;, &lt;lastmod&gt;, &lt;changefreq&gt; y &lt;priority&gt;.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyXml}
                className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#ffc456]" />
                    <span>Copiar XML</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadXml}
                className="px-4 py-2 rounded-xl bg-[#ff6486] hover:bg-[#ff6486]/90 text-white text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar sitemap.xml</span>
              </button>
            </div>
          </div>

          {/* XML Code Box */}
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-4 max-h-[600px] overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed whitespace-pre selection:bg-[#ff6486] selection:text-white">
            <code>{xmlContent}</code>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center gap-3 text-xs text-slate-400">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              Este archivo cumple al 100% con los estándares de Google Search Console, Bing Webmaster Tools y Yandex para rastreo e indexación automática.
            </span>
          </div>

        </div>
      )}

    </div>
  );
};
