import React from 'react';
import { useCMS } from '../../context/CMSContext';
import { AdminSection } from './AdminLayout';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Archive, 
  Trash2, 
  FolderTree, 
  Tag, 
  Image as ImageIcon, 
  Sparkles, 
  PlusCircle, 
  ArrowRight,
  TrendingUp,
  UserCheck,
  Cookie
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (section: AdminSection, articleId?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { articles, categories, tags, media, aiProposals } = useCMS();

  // Real database metrics (no fabricated fake stats)
  const publishedCount = articles.filter(a => a.status === 'publicado').length;
  const draftCount = articles.filter(a => a.status === 'borrador').length;
  const revisionCount = articles.filter(a => a.status === 'revision').length;
  const scheduledCount = articles.filter(a => a.status === 'programado').length;
  const archivedCount = articles.filter(a => a.status === 'archivado').length;
  const trashCount = articles.filter(a => a.status === 'papelera').length;

  const totalWords = articles.reduce((acc, a) => {
    const lead = a.content?.leadText?.split(/\s+/).length || 0;
    const body = a.content?.sections?.reduce((sAcc, s) => {
      const pWords = s.paragraphs?.reduce((pAcc, p) => pAcc + p.split(/\s+/).length, 0) || 0;
      return sAcc + pWords;
    }, 0) || 0;
    return acc + lead + body;
  }, 0);

  const pendingAiProposals = aiProposals.filter(p => p.status === 'pending');

  const recentArticles = [...articles]
    .filter(a => a.status !== 'papelera')
    .sort((a, b) => new Date(b.updatedAt || b.publishedAt).getTime() - new Date(a.updatedAt || a.publishedAt).getTime())
    .slice(0, 5);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'publicado':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">PUBLICADO</span>;
      case 'revision':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-950/60 border border-amber-500/40 text-amber-300">EN REVISIÓN</span>;
      case 'programado':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-950/60 border border-blue-500/40 text-blue-300">PROGRAMADO</span>;
      case 'borrador':
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 border border-slate-700 text-slate-300">BORRADOR</span>;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* 1. WELCOME BANNER */}
      <div className="p-6 sm:p-8 rounded-2xl bg-linear-to-r from-rose-950/50 via-slate-900 to-indigo-950/50 border border-rose-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-rose-400 uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            <span>MESA DE CONTROL EDITORIAL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Panel de Redacción & Administración GTA 6
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl font-light">
            Control integral de publicaciones, taxonomía de Leonida, flujos de revisión humana con IA y optimización SEO.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('new-article')}
            className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nuevo Artículo</span>
          </button>
          <button
            onClick={() => onNavigate('ai-assistant')}
            className="px-4 py-2.5 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 border border-purple-500/40 text-purple-200 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Asistente IA ({pendingAiProposals.length})</span>
          </button>
        </div>
      </div>

      {/* 2. REAL STATS METRICS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Publicados</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-display">{publishedCount}</div>
          <div className="text-[10px] text-emerald-400 font-mono">En portal público</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>En Revisión</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-300 font-display">{revisionCount}</div>
          <div className="text-[10px] text-amber-400 font-mono">Requiere aprobación</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Borradores</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-200 font-display">{draftCount}</div>
          <div className="text-[10px] text-slate-500 font-mono">En elaboración</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Programados</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-300 font-display">{scheduledCount}</div>
          <div className="text-[10px] text-blue-400 font-mono">Publicación diferida</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Categorías</span>
            <FolderTree className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-white font-display">{categories.length}</div>
          <div className="text-[10px] text-rose-400 font-mono">Con subcategorías</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Biblioteca</span>
            <ImageIcon className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-display">{media.length}</div>
          <div className="text-[10px] text-cyan-400 font-mono">Imágenes listas</div>
        </div>

      </div>

      {/* 3. TWO-COLUMN MAIN WORKFLOW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Recent Articles Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white font-display">
              Últimas Publicaciones Modificadas
            </h2>
            <button
              onClick={() => onNavigate('articles')}
              className="text-xs font-mono text-rose-400 hover:text-rose-300 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Ver todos los artículos ({articles.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="rounded-xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-800">
              {recentArticles.map((art) => (
                <div 
                  key={art.id}
                  onClick={() => onNavigate('edit-article', art.id)}
                  className="p-4 hover:bg-slate-800/60 transition-colors flex items-center justify-between gap-4 group cursor-pointer"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(art.status)}
                      <span className="text-[11px] font-mono text-slate-400 uppercase">{art.category}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-[11px] font-mono text-slate-400">{art.author?.name || 'Redacción'}</span>
                    </div>
                    <div className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors truncate">
                      {art.title}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                      {new Date(art.updatedAt || art.publishedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                    </span>
                    <span className="text-xs text-rose-400 group-hover:translate-x-1 transition-transform">
                      Editar →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Proposals Queue & Category Breakdown */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* AI Queue Box */}
          <div className="p-5 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-300 uppercase">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>COLA DE REVISIÓN IA</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-200">
                {pendingAiProposals.length} pendientes
              </span>
            </div>

            {pendingAiProposals.length === 0 ? (
              <p className="text-xs text-slate-400">
                No hay propuestas de IA pendientes de moderación.
              </p>
            ) : (
              <div className="space-y-3">
                {pendingAiProposals.slice(0, 2).map((prop) => (
                  <div key={prop.id} className="p-3 rounded-lg bg-slate-900/80 border border-purple-500/20 space-y-1.5">
                    <div className="text-[10px] font-mono text-purple-400 uppercase">
                      {prop.type === 'new_draft' ? 'Nuevo Borrador Sugerido' : 'Propuesta de Actualización'}
                    </div>
                    <div className="text-xs font-bold text-white line-clamp-2">
                      {prop.title}
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => onNavigate('ai-assistant')}
                  className="w-full py-2 text-center text-xs font-bold text-purple-300 bg-purple-900/40 hover:bg-purple-900/70 border border-purple-500/30 rounded-lg transition-colors cursor-pointer"
                >
                  Abrir Moderación de IA →
                </button>
              </div>
            )}
          </div>

          {/* Cookies & Privacy Quick Status Card */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono font-bold text-[#ffc456] uppercase tracking-wider flex items-center gap-1.5">
                <Cookie className="w-4 h-4 text-[#ffc456]" />
                <span>Cookies & Privacidad</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                RGPD / AdSense
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Supervisión de consentimiento de usuarios, Google AdSense y escáner de cookies activas.
            </p>

            <button
              onClick={() => onNavigate('cookies')}
              className="w-full py-2 text-center text-xs font-bold text-slate-200 bg-slate-800 hover:bg-[#ff6486] hover:text-white rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Gestionar Cookies & Relanzar Banner →</span>
            </button>
          </div>

          {/* Categories Distribution */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Distribución por Categoría
            </div>

            <div className="space-y-2 text-xs">
              {categories.slice(0, 6).map((cat) => {
                const count = articles.filter(a => a.category === cat.slug && a.status !== 'papelera').length;
                return (
                  <div key={cat.slug} className="flex items-center justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-300">{cat.name}</span>
                    <span className="font-mono font-bold text-rose-400">{count} art.</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
