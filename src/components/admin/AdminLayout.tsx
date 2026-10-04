import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { UserRole } from '../../types/cms';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  Sparkles, 
  FolderTree, 
  Tag, 
  Image as ImageIcon, 
  Users, 
  Menu as MenuIcon, 
  FileCode, 
  Cookie, 
  Settings, 
  ExternalLink, 
  LogOut, 
  ShieldCheck, 
  ChevronRight, 
  Bell, 
  Search,
  UserCheck,
  AlertTriangle,
  Flame,
  CheckCircle2,
  X,
  Sliders,
  Radio,
  Database,
  RefreshCw,
  Heart
} from 'lucide-react';

export type AdminSection = 
  | 'dashboard'
  | 'articles'
  | 'popularity'
  | 'new-article'
  | 'edit-article'
  | 'banners'
  | 'breaking-news'
  | 'ai-assistant'
  | 'categories'
  | 'tags'
  | 'media'
  | 'authors'
  | 'menus'
  | 'pages'
  | 'cookies'
  | 'settings';

interface AdminLayoutProps {
  currentSection: AdminSection;
  onNavigate: (section: AdminSection, articleId?: string) => void;
  onBackToPublicSite: () => void;
  editingArticleId?: string;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentSection,
  onNavigate,
  onBackToPublicSite,
  editingArticleId,
  children
}) => {
  const { 
    currentUser, 
    setCurrentUserRole, 
    logoutAdmin, 
    articles, 
    aiProposals,
    isTursoConnected,
    isSyncing,
    syncWithTurso
  } = useCMS();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  const pendingReviewCount = (articles || []).filter(a => a && a.status === 'revision').length;
  const pendingAiCount = (aiProposals || []).filter(p => p && p.status === 'pending').length;
  const draftsCount = (articles || []).filter(a => a && a.status === 'borrador').length;

  const navGroups = [
    {
      title: 'CONTENIDO EDITORIAL',
      items: [
        { id: 'dashboard' as AdminSection, label: 'Resumen Editorial', icon: LayoutDashboard },
        { 
          id: 'articles' as AdminSection, 
          label: 'Artículos', 
          icon: FileText, 
          badge: pendingReviewCount > 0 ? `${pendingReviewCount} rev` : undefined,
          badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
        },
        {
          id: 'popularity' as AdminSection,
          label: 'Popularidad & Likes',
          icon: Heart,
          badge: 'MÉTRICAS',
          badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
        },
        { id: 'new-article' as AdminSection, label: 'Crear Artículo', icon: PlusCircle },
        { 
          id: 'banners' as AdminSection, 
          label: 'Banners de Portada', 
          icon: Sliders 
        },
        { 
          id: 'breaking-news' as AdminSection, 
          label: 'Última Hora & Live', 
          icon: Radio,
          badge: 'LIVE',
          badgeColor: 'bg-red-500/20 text-red-400 border border-red-500/30'
        },
        { 
          id: 'ai-assistant' as AdminSection, 
          label: 'Redacción Asistida IA', 
          icon: Sparkles, 
          badge: pendingAiCount > 0 ? `${pendingAiCount} prop` : undefined,
          badgeColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
        },
      ]
    },
    {
      title: 'ORGANIZACIÓN & TAXONOMÍA',
      items: [
        { id: 'categories' as AdminSection, label: 'Categorías & Subcategorías', icon: FolderTree },
        { id: 'tags' as AdminSection, label: 'Etiquetas & Hashtags', icon: Tag },
        { id: 'media' as AdminSection, label: 'Biblioteca de Medios', icon: ImageIcon },
        { id: 'authors' as AdminSection, label: 'Equipo & Autores', icon: Users },
      ]
    },
    {
      title: 'ESTRUCTURA & LEGAL',
      items: [
        { id: 'menus' as AdminSection, label: 'Menús de Navegación', icon: MenuIcon },
        { id: 'pages' as AdminSection, label: 'Páginas Institucionales', icon: FileCode },
        { id: 'cookies' as AdminSection, label: 'Consentimiento & Cookies', icon: Cookie },
        { id: 'settings' as AdminSection, label: 'Configuración General', icon: Settings },
      ]
    }
  ];

  const roles: UserRole[] = ['Administrador', 'Editor', 'Autor', 'IA / API Engine'];

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 antialiased font-sans">
      
      {/* 1. SIDEBAR */}
      <aside 
        className={`bg-slate-900/95 border-r border-slate-800 flex flex-col justify-between transition-all duration-200 z-30 shrink-0 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand & Wordmark */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-rose-500 via-pink-500 to-amber-400 flex items-center justify-center text-slate-950 font-black text-sm shadow-md shrink-0">
              VI
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <div className="font-extrabold text-sm font-display uppercase tracking-tight truncate flex items-center">
                  <span className="text-white">KAIROS</span>
                  <span className="text-rose-400 ml-0.5">ION</span>
                </div>
                <span className="text-[9px] font-mono tracking-wider text-slate-400 uppercase">
                  CMS EDITORIAL v2.0
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 text-xs hidden md:block"
            title="Alternar barra lateral"
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        {/* Nav Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {!sidebarCollapsed && (
                <div className="text-[10px] font-mono font-bold tracking-widest text-slate-400 px-3 pb-1 uppercase">
                  {group.title}
                </div>
              )}

              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentSection === item.id || 
                  (item.id === 'articles' && currentSection === 'edit-article');

                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-rose-500 text-white shadow-md shadow-rose-900/30' 
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!sidebarCollapsed && item.badge && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* User Card & Back to Public Portal */}
        <div className="p-3 border-t border-slate-800 space-y-2 bg-slate-900/50">
          <button
            onClick={onBackToPublicSite}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-rose-300 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            {!sidebarCollapsed && <span>Ver Portal Público</span>}
          </button>

          {!sidebarCollapsed && (
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src={currentUser?.avatar || '/images/Personajes/Jason_Duval_01.webp'}
                  alt={currentUser?.name || 'Admin'}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/Personajes/Jason_Duval_01.webp';
                  }}
                  className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-bold text-white truncate text-[11px]">{currentUser?.name || 'Administrador'}</div>
                  <div className="text-[10px] text-rose-400 font-mono">{currentUser?.role || 'Admin'}</div>
                </div>
              </div>
              <button
                onClick={logoutAdmin}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                title="Cerrar sesión"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top bar header */}
        <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 flex items-center justify-between gap-4 shrink-0">
          
          {/* Breadcrumb path */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="text-slate-500">CMS</span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-white font-bold uppercase tracking-wider">
              {currentSection.replace('-', ' ')}
            </span>
            {editingArticleId && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-600" />
                <span className="text-rose-400 font-bold truncate max-w-xs">{editingArticleId}</span>
              </>
            )}
          </div>

          {/* Quick Tools & Role Switcher */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Turso Cloud DB Status Pill */}
            <button
              onClick={() => syncWithTurso()}
              disabled={isSyncing}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer ${
                isTursoConnected 
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60' 
                  : 'bg-amber-950/60 border-amber-500/40 text-amber-300 hover:bg-amber-900/60'
              }`}
              title="Base de datos Turso Cloud sincronizada en tiempo real"
            >
              <Database className={`w-3.5 h-3.5 ${isTursoConnected ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span className="hidden md:inline">{isSyncing ? 'Sincronizando...' : isTursoConnected ? 'Turso DB Conectado' : 'Conectar Turso'}</span>
              <RefreshCw className={`w-3 h-3 text-slate-400 ${isSyncing ? 'animate-spin text-emerald-400' : ''}`} />
            </button>

            {/* Role Switcher for Testing RBAC workflows */}
            <div className="relative">
              <button
                onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 hover:text-white cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Rol: <strong className="text-emerald-300">{currentUser.role}</strong></span>
              </button>

              {roleSwitcherOpen && (
                <div className="absolute right-0 mt-2 w-56 p-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase px-2 py-1">
                    Simular Permisos de Usuario:
                  </div>
                  {roles.map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setCurrentUserRole(r);
                        setRoleSwitcherOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        currentUser.role === r ? 'bg-rose-500 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Direct Create Shortcut */}
            <button
              onClick={() => onNavigate('new-article')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Redactar</span>
            </button>

          </div>
        </header>

        {/* Scrollable Work Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
          {children}
        </main>

      </div>

    </div>
  );
};
