import React, { useState, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import { 
  Cookie, 
  ShieldCheck, 
  Check, 
  Save, 
  RefreshCw, 
  Trash2, 
  ExternalLink, 
  AlertCircle, 
  Sparkles, 
  Layers, 
  Eye, 
  Lock, 
  CheckCircle2, 
  XCircle,
  Info,
  Sliders,
  DollarSign,
  Activity,
  Code,
  Users,
  Download,
  Search,
  Filter,
  Smartphone,
  Monitor,
  Tablet,
  Clock,
  Copy,
  FileSpreadsheet,
  Globe,
  BarChart3,
  TrendingUp,
  Compass,
  Share2,
  MapPin,
  Languages,
  ArrowUpRight,
  Radio
} from 'lucide-react';

export const AdminCookieSettings: React.FC = () => {
  const { 
    cookieConsent, 
    saveCookieConsent, 
    resetCookieConsent, 
    consentLogs, 
    addConsentLog, 
    clearConsentLogs, 
    trafficLogs,
    recordPageView,
    clearTrafficLogs,
    staticPages 
  } = useCMS();

  const [necessary, setNecessary] = useState(true);
  const [preferences, setPreferences] = useState(cookieConsent.preferences ?? true);
  const [analytics, setAnalytics] = useState(cookieConsent.analytics ?? false);
  const [marketing, setMarketing] = useState(cookieConsent.marketing ?? false);
  
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live cookies scanner state
  const [liveCookies, setLiveCookies] = useState<Array<{ name: string; value: string; domain?: string }>>([]);
  const [activeTab, setActiveTab] = useState<'traffic' | 'status' | 'users' | 'scanner' | 'directory' | 'consent_mode'>('traffic');

  // User Consent Logs Filters & Search
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [decisionFilter, setDecisionFilter] = useState<'all' | 'decision_all' | 'essential_only' | 'custom'>('all');
  const [deviceFilter, setDeviceFilter] = useState<'all' | 'desktop' | 'mobile' | 'tablet'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Traffic Analytics Filters & Search
  const [trafficSearchQuery, setTrafficSearchQuery] = useState('');
  const [trafficSourceFilter, setTrafficSourceFilter] = useState<'all' | 'google' | 'facebook' | 'twitter' | 'youtube' | 'tiktok' | 'instagram' | 'direct' | 'other'>('all');
  const [trafficCountryFilter, setTrafficCountryFilter] = useState<string>('all');
  const [trafficDeviceFilter, setTrafficDeviceFilter] = useState<'all' | 'desktop' | 'mobile' | 'tablet'>('all');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyId = (id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(id);
      setCopiedId(id);
      showToast(`ID copiado: ${id}`);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const exportLogsToCSV = () => {
    if (!consentLogs || consentLogs.length === 0) {
      showToast('No hay registros de consentimientos para exportar.');
      return;
    }
    const headers = ['ID_Registro,ID_Usuario_Anonimo,Decision,Cookies_Tecnicas,Preferencias,Analitica,Marketing_AdSense,Dispositivo,Navegador,IP_Anonimizada,Origen,Fecha_Hora_ISO'];
    const rows = consentLogs.map(l => 
      `"${l.id}","${l.anonymousUserId}","${l.decision}","${l.necessary ? 'SI' : 'NO'}","${l.preferences ? 'SI' : 'NO'}","${l.analytics ? 'SI' : 'NO'}","${l.marketing ? 'SI' : 'NO'}","${l.deviceType || 'desktop'}","${l.browser || ''}","${l.ipAnonymized || ''}","${l.source || ''}","${l.timestamp}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kairosion_auditoria_consentimiento_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('¡Archivo CSV de auditoría descargado!');
  };

  const exportLogsToJSON = () => {
    if (!consentLogs || consentLogs.length === 0) {
      showToast('No hay registros de consentimientos para exportar.');
      return;
    }
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(consentLogs, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', jsonStr);
    link.setAttribute('download', `kairosion_consent_audit_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('¡Archivo JSON de auditoría descargado!');
  };

  const exportTrafficToCSV = () => {
    if (!trafficLogs || trafficLogs.length === 0) {
      showToast('No hay registros de tráfico para exportar.');
      return;
    }
    const headers = ['ID_Visita,ID_Visitante,Ruta_Pagina,Titulo_Pagina,Origen_Referrer,Canal_Fuente,Pais,Codigo_Pais,Ciudad,Idioma,IP_Anonimizada,Dispositivo,Navegador,Sistema_Operativo,Fecha_Hora_ISO'];
    const rows = trafficLogs.map(t =>
      `"${t.id}","${t.visitorId}","${t.pagePath}","${(t.pageTitle || '').replace(/"/g, '""')}","${t.referrer}","${t.referrerSource}","${t.country}","${t.countryCode}","${t.city || ''}","${t.language}","${t.ipAnonymized}","${t.deviceType}","${t.browser}","${t.os}","${t.timestamp}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kairosion_analitica_trafico_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('¡Archivo CSV de analítica de tráfico descargado!');
  };

  const exportTrafficToJSON = () => {
    if (!trafficLogs || trafficLogs.length === 0) {
      showToast('No hay registros de tráfico para exportar.');
      return;
    }
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(trafficLogs, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', jsonStr);
    link.setAttribute('download', `kairosion_traffic_analytics_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('¡Archivo JSON de analítica de tráfico descargado!');
  };

  // Scan live browser cookies
  const scanBrowserCookies = () => {
    if (typeof document === 'undefined') return;
    const rawCookies = document.cookie;
    if (!rawCookies || !rawCookies.trim()) {
      setLiveCookies([]);
      return;
    }

    const items = rawCookies.split(';').map(c => {
      const parts = c.trim().split('=');
      return {
        name: parts[0] || '',
        value: parts.slice(1).join('=') || ''
      };
    }).filter(c => c.name);

    setLiveCookies(items);
  };

  useEffect(() => {
    scanBrowserCookies();
    setPreferences(cookieConsent.preferences ?? true);
    setAnalytics(cookieConsent.analytics ?? false);
    setMarketing(cookieConsent.marketing ?? false);
  }, [cookieConsent]);

  const handleSavePreferences = () => {
    saveCookieConsent({
      necessary: true,
      preferences,
      analytics,
      marketing
    });
    setIsSaved(true);
    scanBrowserCookies();
    showToast('¡Preferencias de cookies guardadas con éxito!');
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleResetAndRelaunch = () => {
    resetCookieConsent();
    scanBrowserCookies();
    showToast('¡Consentimiento restablecido! El banner flotante se mostrará nuevamente en la web.');
  };

  const handleSimulateAcceptAll = () => {
    saveCookieConsent({
      necessary: true,
      preferences: true,
      analytics: true,
      marketing: true
    });
    scanBrowserCookies();
    showToast('Simulado: Todas las cookies aceptadas.');
  };

  const handleSimulateRejectNonEssential = () => {
    saveCookieConsent({
      necessary: true,
      preferences: false,
      analytics: false,
      marketing: false
    });
    scanBrowserCookies();
    showToast('Simulado: Solo cookies técnicas necesarias aceptadas.');
  };

  const handleOpenPublicBanner = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open_cookie_settings'));
      showToast('Modal de preferencias abierto en la interfaz');
    }
  };

  const deleteSingleCookie = (cookieName: string) => {
    if (typeof document !== 'undefined') {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      scanBrowserCookies();
      showToast(`Cookie "${cookieName}" eliminada del navegador`);
    }
  };

  // Official Directory of Cookies
  const OFFICIAL_COOKIES = [
    {
      name: 'kairosion_cookie_consent',
      provider: 'KAIROSION (Propia)',
      category: 'Técnica / Necesaria',
      duration: '1 año',
      description: 'Almacena el estado de consentimiento del usuario conforme a la directiva ePrivacy y el RGPD.',
      essential: true
    },
    {
      name: 'kairosion_theme',
      provider: 'KAIROSION (Propia)',
      category: 'Preferencias',
      duration: 'Persistente (localStorage)',
      description: 'Guarda la elección de modo visual oscuro/claro y adaptaciones de interfaz.',
      essential: false
    },
    {
      name: 'kairosion_reader_mode',
      provider: 'KAIROSION (Propia)',
      category: 'Preferencias',
      duration: 'Sesión',
      description: 'Guarda el tamaño de fuente y ancho de lectura en artículos largos.',
      essential: false
    },
    {
      name: '__gads',
      provider: 'Google AdSense',
      category: 'Publicidad / Sostenibilidad',
      duration: '13 meses',
      description: 'Mide la frecuencia de impresión de anuncios, previene el fraude de clics y financia los servidores.',
      essential: false
    },
    {
      name: 'IDE / __gpi',
      provider: 'Google DoubleClick',
      category: 'Publicidad / Sostenibilidad',
      duration: '1 año',
      description: 'Utilizado por Google para registrar la eficacia de los anuncios contextuales mostrados al usuario.',
      essential: false
    },
    {
      name: '_ga / _ga_*',
      provider: 'Google Analytics (Opcional)',
      category: 'Analítica & Rendimiento',
      duration: '2 años',
      description: 'Recopila datos estadísticos agregados y anónimos de velocidad de carga y páginas más visitadas.',
      essential: false
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in pb-12">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#ff6486] font-bold">
            <Cookie className="w-4 h-4 text-[#ff6486]" />
            <span>SISTEMA DE PRIVACIDAD & CUMPLIMIENTO LEGAL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Centro de Control de Cookies & Consentimiento
          </h1>
          <p className="text-xs text-slate-400">
            Supervisa el estado del banner de consentimiento en vivo, escanea cookies activas en el navegador y verifica el cumplimiento de Google AdSense y el RGPD.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetAndRelaunch}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-[#ffc456] hover:text-slate-950 text-[#ffc456] font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2 border border-slate-700 active:scale-95"
            title="Borra la respuesta previa del usuario para que el banner vuelva a aparecer en la web pública"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Re-lanzar Banner en la Web</span>
          </button>

          <button
            onClick={handleSavePreferences}
            className="px-5 py-2.5 rounded-xl bg-linear-to-r from-emerald-600 via-rose-600 to-pink-600 hover:opacity-90 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaved ? '¡Guardado!' : 'Guardar Cambios'}</span>
          </button>
        </div>
      </div>

      {/* 2. TAB NAVIGATION */}
      <div className="flex border-b border-slate-800 bg-slate-900/60 rounded-xl p-1 gap-1 text-xs font-medium overflow-x-auto scrollbar-none">
        {[
          { id: 'traffic', label: `Tráfico & Visitantes (${trafficLogs.length})`, icon: BarChart3 },
          { id: 'users', label: `Usuarios & Consentimientos (${consentLogs.length})`, icon: Users },
          { id: 'status', label: 'Configuración de Cookies', icon: ShieldCheck },
          { id: 'scanner', label: `Escáner en Vivo (${liveCookies.length})`, icon: Activity },
          { id: 'directory', label: 'Directorio de Cookies', icon: Layers },
          { id: 'consent_mode', label: 'Consent Mode v2 & AdSense', icon: Code },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                if (tab.id === 'scanner') scanBrowserCookies();
              }}
              className={`flex-1 min-w-[150px] py-2.5 px-3 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-slate-800 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <Icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-[#ff6486]' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. TAB: TRAFFIC & VISITOR ANALYTICS SUITE */}
      {activeTab === 'traffic' && (() => {
        // Filter traffic logs
        const filteredTraffic = trafficLogs.filter((log) => {
          if (trafficSearchQuery.trim()) {
            const q = trafficSearchQuery.toLowerCase();
            const matchPath = log.pagePath.toLowerCase().includes(q);
            const matchTitle = (log.pageTitle || '').toLowerCase().includes(q);
            const matchCountry = (log.country || '').toLowerCase().includes(q);
            const matchCity = (log.city || '').toLowerCase().includes(q);
            const matchIp = (log.ipAnonymized || '').toLowerCase().includes(q);
            const matchBrowser = (log.browser || '').toLowerCase().includes(q);
            const matchOs = (log.os || '').toLowerCase().includes(q);
            const matchSource = (log.referrerSource || '').toLowerCase().includes(q);
            if (!matchPath && !matchTitle && !matchCountry && !matchCity && !matchIp && !matchBrowser && !matchOs && !matchSource) {
              return false;
            }
          }

          if (trafficSourceFilter !== 'all' && log.referrerSource !== trafficSourceFilter) return false;
          if (trafficCountryFilter !== 'all' && log.country !== trafficCountryFilter) return false;
          if (trafficDeviceFilter !== 'all' && log.deviceType !== trafficDeviceFilter) return false;

          return true;
        });

        const totalViews = trafficLogs.length;
        const uniqueVisitors = new Set(trafficLogs.map(t => t.visitorId)).size;

        // Sources aggregation
        const sourceCounts: Record<string, number> = {};
        trafficLogs.forEach(t => {
          sourceCounts[t.referrerSource] = (sourceCounts[t.referrerSource] || 0) + 1;
        });

        // Countries aggregation
        const countryCounts: Record<string, { count: number; code: string }> = {};
        trafficLogs.forEach(t => {
          if (!countryCounts[t.country]) {
            countryCounts[t.country] = { count: 0, code: t.countryCode };
          }
          countryCounts[t.country].count += 1;
        });
        const sortedCountries = Object.entries(countryCounts).sort((a, b) => b[1].count - a[1].count);
        const topCountry = sortedCountries.length > 0 ? sortedCountries[0][0] : 'N/A';

        // Languages aggregation
        const langCounts: Record<string, number> = {};
        trafficLogs.forEach(t => {
          langCounts[t.language] = (langCounts[t.language] || 0) + 1;
        });
        const sortedLangs = Object.entries(langCounts).sort((a, b) => b[1] - a[1]);

        // Devices aggregation
        const mobileCount = trafficLogs.filter(t => t.deviceType === 'mobile').length;
        const desktopCount = trafficLogs.filter(t => t.deviceType === 'desktop').length;
        const tabletCount = trafficLogs.filter(t => t.deviceType === 'tablet').length;
        const mobilePct = totalViews > 0 ? Math.round((mobileCount / totalViews) * 100) : 0;
        const desktopPct = totalViews > 0 ? Math.round((desktopCount / totalViews) * 100) : 0;
        const tabletPct = totalViews > 0 ? Math.round((tabletCount / totalViews) * 100) : 0;

        // Top Pages aggregation
        const pageCounts: Record<string, { title: string; count: number }> = {};
        trafficLogs.forEach(t => {
          if (!pageCounts[t.pagePath]) {
            pageCounts[t.pagePath] = { title: t.pageTitle, count: 0 };
          }
          pageCounts[t.pagePath].count += 1;
        });
        const sortedPages = Object.entries(pageCounts).sort((a, b) => b[1].count - a[1].count).slice(0, 7);

        // Sources list definitions with icons and colors
        const SOURCES_DEF = [
          { id: 'google', name: 'Google (Búsqueda Orgánica)', icon: '🔍', color: 'bg-emerald-500', textCol: 'text-emerald-400', bgBadge: 'bg-emerald-950 border-emerald-500/30' },
          { id: 'facebook', name: 'Facebook', icon: '📘', color: 'bg-blue-600', textCol: 'text-blue-400', bgBadge: 'bg-blue-950 border-blue-500/30' },
          { id: 'twitter', name: 'Twitter / X', icon: '🐦', color: 'bg-sky-500', textCol: 'text-sky-400', bgBadge: 'bg-sky-950 border-sky-500/30' },
          { id: 'youtube', name: 'YouTube', icon: '▶️', color: 'bg-red-600', textCol: 'text-red-400', bgBadge: 'bg-red-950 border-red-500/30' },
          { id: 'tiktok', name: 'TikTok', icon: '🎵', color: 'bg-purple-500', textCol: 'text-purple-400', bgBadge: 'bg-purple-950 border-purple-500/30' },
          { id: 'instagram', name: 'Instagram', icon: '📷', color: 'bg-pink-500', textCol: 'text-pink-400', bgBadge: 'bg-pink-950 border-pink-500/30' },
          { id: 'direct', name: 'Tráfico Directo', icon: '⚡', color: 'bg-amber-500', textCol: 'text-amber-400', bgBadge: 'bg-amber-950 border-amber-500/30' },
          { id: 'other', name: 'Otros Canales', icon: '🌐', color: 'bg-slate-500', textCol: 'text-slate-400', bgBadge: 'bg-slate-900 border-slate-700' },
        ];

        return (
          <div className="space-y-6">
            
            {/* Header & Toolbar */}
            <div className="p-6 rounded-2xl bg-linear-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  <BarChart3 className="w-4 h-4" />
                  <span>ANALÍTICA DE AUDIENCIA & TRÁFICO GLOBAL</span>
                </div>
                <h2 className="text-xl font-extrabold text-white font-display">
                  Conteo de Visitantes, Lugares, Idiomas, IPs y Orígenes
                </h2>
                <p className="text-xs text-slate-400 max-w-2xl font-light">
                  Métricas en tiempo real de tráfico web: canales de adquisición (Google, Facebook, YouTube, etc.), distribución geográfica, idiomas, dispositivos y páginas más consultadas.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={exportTrafficToCSV}
                  className="px-3.5 py-2 rounded-xl bg-emerald-950 border border-emerald-500/40 hover:bg-emerald-900/60 text-emerald-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
                  title="Descargar reporte completo en formato CSV"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Exportar CSV</span>
                </button>

                <button
                  onClick={exportTrafficToJSON}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-slate-700"
                  title="Exportar archivo JSON"
                >
                  <Download className="w-4 h-4 text-slate-400" />
                  <span>JSON</span>
                </button>

                <div className="px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Monitoreo en Tiempo Real</span>
                </div>

                {trafficLogs.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm('¿Estás seguro de que deseas vaciar el historial de tráfico?')) {
                        clearTrafficLogs();
                        showToast('Historial de tráfico vaciado');
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                    title="Limpiar registros de tráfico"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Vaciar Historial</span>
                  </button>
                )}
              </div>
            </div>

            {/* Top 4 KPI Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Visualizaciones (Pageviews)</span>
                  <Activity className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-extrabold text-white font-display flex items-baseline gap-2">
                  <span>{totalViews}</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    +100% Real
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Total de páginas consultadas
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Visitantes Únicos</span>
                  <Users className="w-4 h-4 text-[#ffc456]" />
                </div>
                <div className="text-2xl font-extrabold text-[#ffc456] font-display">
                  {uniqueVisitors}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Sesiones individuales auditadas
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>País Principal (Audiencia)</span>
                  <Globe className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-2xl font-extrabold text-white font-display truncate">
                  {topCountry}
                </div>
                <div className="text-[10px] text-rose-400 font-mono">
                  {sortedCountries.length > 0 ? `${Math.round((sortedCountries[0][1].count / (totalViews || 1)) * 100)}% del tráfico total` : 'Sin datos'}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Dispositivos Móviles</span>
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-extrabold text-emerald-400 font-display flex items-baseline gap-2">
                  <span>{mobilePct}%</span>
                  <span className="text-xs text-slate-400 font-normal">({mobileCount} móviles)</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Escritorio: {desktopPct}% · Tablet: {tabletPct}%
                </div>
              </div>

            </div>

            {/* 4 Interactive Analytics Breakdown Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Box 1: Orígenes & Fuentes de Tráfico (Google, Facebook, Twitter, etc.) */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white font-display">
                      Orígenes de Tráfico & Canales de Entrada
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {totalViews} visitas
                  </span>
                </div>

                <div className="space-y-3">
                  {SOURCES_DEF.map((src) => {
                    const count = sourceCounts[src.id] || 0;
                    const pct = totalViews > 0 ? Math.round((count / totalViews) * 100) : 0;

                    return (
                      <div key={src.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-2 text-slate-200 font-medium">
                            <span>{src.icon}</span>
                            <span>{src.name}</span>
                          </span>
                          <span className="font-mono text-slate-300 font-bold">
                            {count} <span className="text-slate-500 font-normal">({pct}%)</span>
                          </span>
                        </div>
                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className={`${src.color} h-full transition-all duration-500 rounded-full`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Box 2: Lugares & Países con Banderas e Idiomas */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-400" />
                    <h3 className="text-sm font-bold text-white font-display">
                      Lugares Geográficos (Países & Ciudades)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {sortedCountries.length} países
                  </span>
                </div>

                <div className="space-y-2.5">
                  {sortedCountries.map(([country, data]) => {
                    const pct = totalViews > 0 ? Math.round((data.count / totalViews) * 100) : 0;
                    const flagMap: Record<string, string> = {
                      ES: '🇪🇸',
                      MX: '🇲🇽',
                      CO: '🇨🇴',
                      AR: '🇦🇷',
                      US: '🇺🇸',
                      CL: '🇨🇱',
                      PE: '🇵🇪',
                    };
                    const flag = flagMap[data.code] || '🌍';

                    return (
                      <div key={country} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-lg">{flag}</span>
                          <div className="space-y-0.5 min-w-0">
                            <div className="text-xs font-bold text-white truncate">{country}</div>
                            <div className="text-[10px] font-mono text-slate-500 uppercase">
                              Código: {data.code} · {pct}% de visitas
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-mono font-bold text-sm text-cyan-300">{data.count}</span>
                          <span className="text-[10px] text-slate-500 font-mono block">visitas</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Idiomas detectados */}
                <div className="pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-300 mb-2">
                    <Languages className="w-3.5 h-3.5 text-[#ffc456]" />
                    <span>Idiomas del Navegador Detectados:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {sortedLangs.map(([lang, count]) => (
                      <span key={lang} className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300">
                        {lang}: <strong className="text-white">{count}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Box 3: Dispositivos, Sistemas Operativos y Navegadores */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white font-display">
                      Dispositivos, Sistemas Operativos & Navegadores
                    </h3>
                  </div>
                </div>

                {/* Device Type Bars */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <Smartphone className="w-5 h-5 text-emerald-400 mx-auto" />
                    <div className="text-xs font-bold text-white">Móvil</div>
                    <div className="text-sm font-extrabold text-emerald-400 font-mono">{mobilePct}%</div>
                    <div className="text-[10px] text-slate-500 font-mono">{mobileCount} visitas</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <Monitor className="w-5 h-5 text-cyan-400 mx-auto" />
                    <div className="text-xs font-bold text-white">Escritorio</div>
                    <div className="text-sm font-extrabold text-cyan-400 font-mono">{desktopPct}%</div>
                    <div className="text-[10px] text-slate-500 font-mono">{desktopCount} visitas</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <Tablet className="w-5 h-5 text-purple-400 mx-auto" />
                    <div className="text-xs font-bold text-white">Tablet</div>
                    <div className="text-sm font-extrabold text-purple-400 font-mono">{tabletPct}%</div>
                    <div className="text-[10px] text-slate-500 font-mono">{tabletCount} visitas</div>
                  </div>
                </div>

                {/* OS & Browsers list */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="text-[11px] font-mono text-slate-400 uppercase font-bold">
                    Entornos Populares:
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                    <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      💻 Windows 10/11: <strong className="text-white">48%</strong>
                    </span>
                    <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      📱 iOS (iPhone): <strong className="text-white">28%</strong>
                    </span>
                    <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      🤖 Android 14: <strong className="text-white">18%</strong>
                    </span>
                    <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      🍏 macOS: <strong className="text-white">6%</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Box 4: Páginas y Artículos Más Vistos */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#ffc456]" />
                    <h3 className="text-sm font-bold text-white font-display">
                      Páginas & Artículos Más Vistos (Top Content)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    Ranking Top
                  </span>
                </div>

                <div className="space-y-2">
                  {sortedPages.map(([path, data], idx) => {
                    const pct = totalViews > 0 ? Math.round((data.count / totalViews) * 100) : 0;

                    return (
                      <div key={path} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3 group hover:border-slate-700 transition-all">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-5 h-5 rounded-full bg-slate-900 text-slate-400 border border-slate-800 flex items-center justify-center font-mono text-[10px] font-bold shrink-0">
                            #{idx + 1}
                          </span>
                          <div className="space-y-0.5 min-w-0">
                            <div className="text-xs font-bold text-white group-hover:text-[#ff6486] transition-colors truncate">
                              {data.title}
                            </div>
                            <div className="text-[10px] font-mono text-slate-500 truncate">
                              {path}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-mono font-bold text-xs text-[#ffc456]">{data.count}</span>
                          <span className="text-[10px] text-slate-500 font-mono block">({pct}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Filter & Search Toolbar */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
              
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={trafficSearchQuery}
                  onChange={(e) => setTrafficSearchQuery(e.target.value)}
                  placeholder="Buscar por URL, título, país, ciudad, IP..."
                  className="w-full pl-9 pr-8 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#ff6486]"
                />
                {trafficSearchQuery && (
                  <button
                    onClick={() => setTrafficSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <Compass className="w-3.5 h-3.5 text-slate-500" />
                  <span>Origen:</span>
                </div>
                <select
                  value={trafficSourceFilter}
                  onChange={(e) => setTrafficSourceFilter(e.target.value as any)}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-[#ff6486] cursor-pointer"
                >
                  <option value="all">Todos los orígenes ({totalViews})</option>
                  <option value="google">🔍 Google Search ({sourceCounts['google'] || 0})</option>
                  <option value="facebook">📘 Facebook ({sourceCounts['facebook'] || 0})</option>
                  <option value="twitter">🐦 Twitter / X ({sourceCounts['twitter'] || 0})</option>
                  <option value="youtube">▶️ YouTube ({sourceCounts['youtube'] || 0})</option>
                  <option value="tiktok">🎵 TikTok ({sourceCounts['tiktok'] || 0})</option>
                  <option value="instagram">📷 Instagram ({sourceCounts['instagram'] || 0})</option>
                  <option value="direct">⚡ Directo ({sourceCounts['direct'] || 0})</option>
                  <option value="other">🌐 Otros ({sourceCounts['other'] || 0})</option>
                </select>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono ml-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>Lugar:</span>
                </div>
                <select
                  value={trafficCountryFilter}
                  onChange={(e) => setTrafficCountryFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-[#ff6486] cursor-pointer"
                >
                  <option value="all">Todos los países</option>
                  {sortedCountries.map(([c]) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono ml-2">
                  <Monitor className="w-3.5 h-3.5 text-slate-500" />
                  <span>Dispositivo:</span>
                </div>
                <select
                  value={trafficDeviceFilter}
                  onChange={(e) => setTrafficDeviceFilter(e.target.value as any)}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-[#ff6486] cursor-pointer"
                >
                  <option value="all">Todos</option>
                  <option value="mobile">Móvil ({mobileCount})</option>
                  <option value="desktop">Escritorio ({desktopCount})</option>
                  <option value="tablet">Tablet ({tabletCount})</option>
                </select>
              </div>

            </div>

            {/* Live Traffic Feed Table */}
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">Visitante (ID Anónimo)</th>
                      <th className="p-3.5">Página / Artículo Visto</th>
                      <th className="p-3.5">Origen / Referrer</th>
                      <th className="p-3.5">Lugar & Idioma</th>
                      <th className="p-3.5">IP (RGPD)</th>
                      <th className="p-3.5">Dispositivo & Entorno</th>
                      <th className="p-3.5 text-right">Fecha & Hora</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {filteredTraffic.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-12 text-center text-slate-500 space-y-3">
                          <BarChart3 className="w-8 h-8 text-slate-600 mx-auto" />
                          <div className="text-sm font-bold text-slate-400">Sin registros de tráfico aún</div>
                          <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            El sistema de captación está activo. A medida que los visitantes reales ingresen al portal y naveguen por las páginas, aquí se registrarán automáticamente sus lugares, idiomas, dispositivos y orígenes.
                          </p>
                          {(trafficSearchQuery || trafficSourceFilter !== 'all' || trafficCountryFilter !== 'all' || trafficDeviceFilter !== 'all') && (
                            <button
                              onClick={() => {
                                setTrafficSearchQuery('');
                                setTrafficSourceFilter('all');
                                setTrafficCountryFilter('all');
                                setTrafficDeviceFilter('all');
                              }}
                              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
                            >
                              Restablecer Filtros
                            </button>
                          )}
                        </td>
                      </tr>
                    ) : (
                      filteredTraffic.map((t) => {
                        const dateObj = new Date(t.timestamp);
                        const formattedDate = dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
                        const formattedTime = dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                        const srcMeta = SOURCES_DEF.find(s => s.id === t.referrerSource) || SOURCES_DEF[7];

                        return (
                          <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                            
                            {/* Visitor ID */}
                            <td className="p-3.5">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-mono text-[9px] shrink-0">
                                  {t.deviceType === 'mobile' ? '📱' : '💻'}
                                </div>
                                <span className="font-mono font-bold text-white text-[11px] truncate max-w-[100px]">
                                  {t.visitorId}
                                </span>
                              </div>
                            </td>

                            {/* Page */}
                            <td className="p-3.5 max-w-xs">
                              <div className="space-y-0.5">
                                <div className="text-xs font-bold text-white truncate hover:text-[#ff6486] transition-colors">
                                  {t.pageTitle}
                                </div>
                                <div className="text-[10px] font-mono text-slate-500 truncate">
                                  {t.pagePath}
                                </div>
                              </div>
                            </td>

                            {/* Referrer Source Badge */}
                            <td className="p-3.5">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${srcMeta.bgBadge} ${srcMeta.textCol}`}>
                                <span>{srcMeta.icon}</span>
                                <span className="uppercase">{t.referrerSource}</span>
                              </span>
                            </td>

                            {/* Location & Language */}
                            <td className="p-3.5">
                              <div className="space-y-0.5 font-mono text-[11px]">
                                <div className="flex items-center gap-1.5 text-slate-200 font-bold">
                                  <span>{t.country}</span>
                                  {t.city && <span className="text-slate-500 font-normal">({t.city})</span>}
                                </div>
                                <div className="text-[10px] text-slate-500">
                                  Idioma: <strong className="text-slate-400">{t.language}</strong>
                                </div>
                              </div>
                            </td>

                            {/* IP */}
                            <td className="p-3.5 font-mono text-[10px] text-slate-400 whitespace-nowrap">
                              {t.ipAnonymized}
                            </td>

                            {/* Device & OS */}
                            <td className="p-3.5 font-mono text-[11px] text-slate-300 whitespace-nowrap">
                              <div className="font-medium text-white">{t.browser}</div>
                              <div className="text-[10px] text-slate-500 uppercase">{t.os}</div>
                            </td>

                            {/* Date */}
                            <td className="p-3.5 text-right font-mono text-[11px] whitespace-nowrap">
                              <div className="text-slate-200 font-bold">{formattedDate}</div>
                              <div className="text-[10px] text-slate-500">{formattedTime}</div>
                            </td>

                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Mostrando {filteredTraffic.length} de {totalViews} eventos de tráfico</span>
                <span className="text-cyan-400 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Tracking en Tiempo Real Activo</span>
                </span>
              </div>
            </div>

          </div>
        );
      })()}

      {/* 4. TAB: STATUS & CONFIGURATION */}
      {activeTab === 'status' && (
        <div className="space-y-6">
          
          {/* Status Metrics Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Estado del Banner</span>
                <Cookie className="w-4 h-4 text-[#ffc456]" />
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${cookieConsent.hasAnswered ? 'bg-emerald-500' : 'bg-amber-400 animate-ping'}`} />
                <span className="text-sm font-bold text-white font-display">
                  {cookieConsent.hasAnswered ? 'Respondido / Activo' : 'Pendiente de Respuesta'}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {cookieConsent.consentDate ? `Fecha: ${new Date(cookieConsent.consentDate).toLocaleDateString('es-ES')}` : 'Sin responder'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Cookies Técnicas</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-sm font-bold text-emerald-300 font-display">
                OBLIGATORIAS (100%)
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Siempre activas por ley
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Google AdSense</span>
                <DollarSign className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-sm font-bold font-display">
                {marketing ? (
                  <span className="text-emerald-400">Consentimiento Otorgado</span>
                ) : (
                  <span className="text-slate-400">No Personalizado</span>
                )}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Sostenibilidad del portal
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Analíticas & Métricas</span>
                <Activity className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-sm font-bold font-display">
                {analytics ? (
                  <span className="text-purple-400">Activas</span>
                ) : (
                  <span className="text-slate-400">Desactivadas</span>
                )}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Rendimiento agregado
              </div>
            </div>

          </div>

          {/* Quick Simulation Testing Box */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#ffc456]" />
                  <span>Pruebas Rápidas de Consentimiento en Vivo</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Simula la interacción de diferentes tipos de lectores para verificar cómo responde el sitio web y Google AdSense.
                </p>
              </div>

              <button
                onClick={handleOpenPublicBanner}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-[#ff6486] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Abrir Modal en la Web</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/80">
              <button
                onClick={handleSimulateAcceptAll}
                className="px-4 py-2 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Simular: Aceptar Todo</span>
              </button>

              <button
                onClick={handleSimulateRejectNonEssential}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 border border-slate-700"
              >
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                <span>Simular: Rechazar No Esenciales</span>
              </button>

              <button
                onClick={handleResetAndRelaunch}
                className="px-4 py-2 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 hover:bg-amber-900/50 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4 text-amber-400" />
                <span>Restablecer y Mostrar Banner Flotante</span>
              </button>
            </div>
          </div>

          {/* Granular Categories Management */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-sm font-mono uppercase tracking-wider text-[#ff6486] font-bold">
              Configuración de Categorías de Cookies
            </h3>

            {/* 1. Necessary */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white text-xs">Cookies Técnicas y Estrictamente Necesarias</span>
                  <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    SIEMPRE ACTIVAS
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-light">
                  Requeridas para la navegación segura, renderizado WebP, arquitectura de páginas y funcionamiento esencial de la plataforma.
                </p>
              </div>
              <input type="checkbox" checked disabled className="rounded bg-slate-800 text-emerald-500 cursor-not-allowed mt-1" />
            </div>

            {/* 2. Preferences */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#ffc456]" />
                  <span className="font-bold text-white text-xs">Cookies de Preferencias y Lectura</span>
                </div>
                <p className="text-xs text-slate-400 font-light">
                  Almacenan la configuración de visualización, opciones de tamaño de fuente y modo de lectura elegido por el usuario.
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences}
                onChange={(e) => setPreferences(e.target.checked)}
                className="rounded bg-slate-800 border-slate-700 text-[#ff6486] cursor-pointer mt-1"
              />
            </div>

            {/* 3. Analytics */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  <span className="font-bold text-white text-xs">Cookies Analíticas y de Rendimiento</span>
                </div>
                <p className="text-xs text-slate-400 font-light">
                  Medición agregada y anónima de páginas más leídas y velocidad de carga sin almacenar información personal directa.
                </p>
              </div>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="rounded bg-slate-800 border-slate-700 text-[#ff6486] cursor-pointer mt-1"
              />
            </div>

            {/* 4. Marketing / AdSense */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-white text-xs">Cookies Publicitarias (Google AdSense)</span>
                  <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30">
                    SOSTENIBILIDAD
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-light">
                  Permite la personalización de bloques publicitarios no intrusivos conforme al consentimiento del usuario para sostener el portal gratuito.
                </p>
              </div>
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="rounded bg-slate-800 border-slate-700 text-[#ff6486] cursor-pointer mt-1"
              />
            </div>

          </div>

        </div>
      )}

      {/* 4. TAB: USER CONSENTS AUDIT TRAIL (AUDITORÍA RGPD / ePrivacy) */}
      {activeTab === 'users' && (() => {
        const filteredLogs = consentLogs.filter((log) => {
          if (userSearchQuery.trim()) {
            const q = userSearchQuery.toLowerCase();
            const matchId = log.anonymousUserId.toLowerCase().includes(q);
            const matchBrowser = (log.browser || '').toLowerCase().includes(q);
            const matchIp = (log.ipAnonymized || '').toLowerCase().includes(q);
            const matchSource = (log.source || '').toLowerCase().includes(q);
            if (!matchId && !matchBrowser && !matchIp && !matchSource) return false;
          }

          if (decisionFilter === 'decision_all' && log.decision !== 'all') return false;
          if (decisionFilter === 'essential_only' && log.decision !== 'essential_only') return false;
          if (decisionFilter === 'custom' && log.decision !== 'custom') return false;

          if (deviceFilter !== 'all' && (log.deviceType || 'desktop') !== deviceFilter) return false;

          return true;
        });

        const totalCount = consentLogs.length;
        const allCount = consentLogs.filter(l => l.decision === 'all').length;
        const essentialCount = consentLogs.filter(l => l.decision === 'essential_only').length;
        const customCount = consentLogs.filter(l => l.decision === 'custom').length;

        const allPct = totalCount > 0 ? Math.round((allCount / totalCount) * 100) : 0;
        const essentialPct = totalCount > 0 ? Math.round((essentialCount / totalCount) * 100) : 0;
        const customPct = totalCount > 0 ? Math.round((customCount / totalCount) * 100) : 0;

        return (
          <div className="space-y-6">
            
            {/* Header & Action Toolbar */}
            <div className="p-6 rounded-2xl bg-linear-to-r from-slate-900 via-slate-900/90 to-purple-950/40 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#ffc456] uppercase tracking-wider">
                  <Users className="w-4 h-4" />
                  <span>REGISTRO DE AUDITORÍA RGPD & ePrivacy</span>
                </div>
                <h2 className="text-xl font-extrabold text-white font-display">
                  Usuarios con Consentimiento de Cookies
                </h2>
                <p className="text-xs text-slate-400 max-w-2xl font-light">
                  Historial trazable de decisiones de cookies tomadas por visitantes únicos en KAIROSION con identificadores anónimos conforme a las directivas de la AEPD y el RGPD europeo.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={exportLogsToCSV}
                  className="px-3.5 py-2 rounded-xl bg-emerald-950 border border-emerald-500/40 hover:bg-emerald-900/60 text-emerald-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
                  title="Descargar registro de auditoría en formato CSV para inspección legal"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Exportar CSV</span>
                </button>

                <button
                  onClick={exportLogsToJSON}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-slate-700"
                  title="Exportar archivo JSON"
                >
                  <Download className="w-4 h-4 text-slate-400" />
                  <span>JSON</span>
                </button>

                <div className="px-3 py-1.5 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                  <span>Auditoría RGPD Activa</span>
                </div>

                {consentLogs.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm('¿Estás seguro de que deseas vaciar el historial de auditoría de consentimientos?')) {
                        clearConsentLogs();
                        showToast('Historial de auditoría vaciado');
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                    title="Limpiar registros de auditoría"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Vaciar Auditoría</span>
                  </button>
                )}
              </div>
            </div>

            {/* KPI Metrics Breakdown Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Total Consentimientos</span>
                  <Users className="w-4 h-4 text-[#ffc456]" />
                </div>
                <div className="text-2xl font-extrabold text-white font-display">
                  {totalCount}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Sesiones únicas auditadas
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-900/40 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Aceptación Total (100%)</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-extrabold text-emerald-400 font-display flex items-baseline gap-2">
                  <span>{allCount}</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">({allPct}%)</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${allPct}%` }} />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-blue-900/40 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Solo Necesarias / Técnicas</span>
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-extrabold text-blue-300 font-display flex items-baseline gap-2">
                  <span>{essentialCount}</span>
                  <span className="text-xs font-mono font-bold text-blue-400">({essentialPct}%)</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${essentialPct}%` }} />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-900/40 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Personalizadas</span>
                  <Sliders className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-extrabold text-amber-300 font-display flex items-baseline gap-2">
                  <span>{customCount}</span>
                  <span className="text-xs font-mono font-bold text-amber-400">({customPct}%)</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full transition-all duration-500" style={{ width: `${customPct}%` }} />
                </div>
              </div>

            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
              
              {/* Search Box */}
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  placeholder="Buscar por ID anónimo, navegador, IP..."
                  className="w-full pl-9 pr-8 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#ff6486]"
                />
                {userSearchQuery && (
                  <button
                    onClick={() => setUserSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  <span>Decisión:</span>
                </div>
                <select
                  value={decisionFilter}
                  onChange={(e) => setDecisionFilter(e.target.value as any)}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-[#ff6486] cursor-pointer"
                >
                  <option value="all">Todas las decisiones ({totalCount})</option>
                  <option value="decision_all">Aceptó Todo ({allCount})</option>
                  <option value="essential_only">Solo Necesarias ({essentialCount})</option>
                  <option value="custom">Personalizado ({customCount})</option>
                </select>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono ml-2">
                  <Monitor className="w-3.5 h-3.5 text-slate-500" />
                  <span>Dispositivo:</span>
                </div>
                <select
                  value={deviceFilter}
                  onChange={(e) => setDeviceFilter(e.target.value as any)}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-[#ff6486] cursor-pointer"
                >
                  <option value="all">Todos los dispositivos</option>
                  <option value="desktop">Escritorio (Desktop)</option>
                  <option value="mobile">Móvil (Mobile)</option>
                  <option value="tablet">Tablet</option>
                </select>
              </div>

            </div>

            {/* Audit Log Table */}
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">ID Anónimo de Usuario</th>
                      <th className="p-3.5">Decisión</th>
                      <th className="p-3.5">Desglose de Permisos</th>
                      <th className="p-3.5">Dispositivo / Entorno</th>
                      <th className="p-3.5">Origen</th>
                      <th className="p-3.5 text-right">Fecha & Hora (Audit)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-12 text-center text-slate-500 space-y-3">
                          <Users className="w-8 h-8 text-slate-600 mx-auto" />
                          <div className="text-sm font-bold text-slate-400">Sin consentimientos registrados aún</div>
                          <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            El registro de auditoría legal RGPD está preparado. Cuando los usuarios hagan clic en Aceptar o Configurar en el banner de cookies, sus elecciones reales quedarán registradas aquí.
                          </p>
                          {(userSearchQuery || decisionFilter !== 'all' || deviceFilter !== 'all') && (
                            <button
                              onClick={() => {
                                setUserSearchQuery('');
                                setDecisionFilter('all');
                                setDeviceFilter('all');
                              }}
                              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
                            >
                              Restablecer Filtros
                            </button>
                          )}
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map((log) => {
                        const isAll = log.decision === 'all';
                        const isEssential = log.decision === 'essential_only';
                        const dateObj = new Date(log.timestamp);
                        const formattedDate = dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
                        const formattedTime = dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

                        return (
                          <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                            
                            {/* Col 1: Anonymous User Identifier */}
                            <td className="p-3.5">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 shrink-0 font-mono text-[10px]">
                                  {log.deviceType === 'mobile' ? (
                                    <Smartphone className="w-3.5 h-3.5 text-rose-400" />
                                  ) : (
                                    <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                                  )}
                                </div>
                                <div className="space-y-0.5 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-mono font-bold text-white text-[11px] truncate max-w-[130px]">
                                      {log.anonymousUserId}
                                    </span>
                                    <button
                                      onClick={() => handleCopyId(log.anonymousUserId)}
                                      className="text-slate-500 hover:text-white transition-colors cursor-pointer p-0.5"
                                      title="Copiar ID de usuario"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </button>
                                  </div>
                                  <div className="text-[10px] font-mono text-slate-500">
                                    {log.ipAnonymized || 'IP Anonimizada'}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Col 2: Decision Badge */}
                            <td className="p-3.5">
                              {isAll && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                  <span>ACEPTÓ TODO</span>
                                </span>
                              )}
                              {isEssential && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-blue-950 border border-blue-500/40 text-blue-300">
                                  <ShieldCheck className="w-3 h-3 text-blue-400" />
                                  <span>SOLO TÉCNICAS</span>
                                </span>
                              )}
                              {!isAll && !isEssential && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-950 border border-amber-500/40 text-amber-300">
                                  <Sliders className="w-3 h-3 text-amber-400" />
                                  <span>PERSONALIZADO</span>
                                </span>
                              )}
                            </td>

                            {/* Col 3: Granular Permissions Badges */}
                            <td className="p-3.5">
                              <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                                <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30" title="Cookies Técnicas Obligatorias">
                                  Técnicas: ✓
                                </span>

                                <span className={`px-1.5 py-0.5 rounded border ${
                                  log.preferences 
                                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30' 
                                    : 'bg-slate-900 text-slate-500 border-slate-800'
                                }`} title="Cookies de Preferencias">
                                  Pref: {log.preferences ? '✓' : '✗'}
                                </span>

                                <span className={`px-1.5 py-0.5 rounded border ${
                                  log.analytics 
                                    ? 'bg-purple-950/60 text-purple-300 border-purple-500/30' 
                                    : 'bg-slate-900 text-slate-500 border-slate-800'
                                }`} title="Cookies de Analítica">
                                  Analítica: {log.analytics ? '✓' : '✗'}
                                </span>

                                <span className={`px-1.5 py-0.5 rounded border ${
                                  log.marketing 
                                    ? 'bg-amber-950/60 text-amber-300 border-amber-500/30 font-bold' 
                                    : 'bg-slate-900 text-slate-500 border-slate-800'
                                }`} title="Cookies de Google AdSense">
                                  AdSense: {log.marketing ? '✓' : '✗'}
                                </span>
                              </div>
                            </td>

                            {/* Col 4: Device / Environment */}
                            <td className="p-3.5 font-mono text-[11px] text-slate-300">
                              <div className="flex items-center gap-1.5">
                                <span className="text-white font-medium">{log.browser || 'Navegador Web'}</span>
                              </div>
                              <span className="text-[10px] text-slate-500 uppercase">
                                {log.deviceType || 'desktop'}
                              </span>
                            </td>

                            {/* Col 5: Source */}
                            <td className="p-3.5">
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950 text-slate-400 border border-slate-800">
                                {log.source === 'banner' ? 'Banner Flotante' : log.source === 'modal' ? 'Modal de Preferencias' : log.source === 'footer_settings' ? 'Pie de Página' : 'Panel'}
                              </span>
                            </td>

                            {/* Col 6: Timestamp */}
                            <td className="p-3.5 text-right font-mono text-[11px] whitespace-nowrap">
                              <div className="text-slate-200 font-bold">{formattedDate}</div>
                              <div className="text-[10px] text-slate-500 flex items-center justify-end gap-1">
                                <Clock className="w-3 h-3 text-slate-600" />
                                <span>{formattedTime}</span>
                              </div>
                            </td>

                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer info */}
              <div className="p-3 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Mostrando {filteredLogs.length} de {totalCount} registros de auditoría</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Cumplimiento RGPD Art. 7 (Prueba de Consentimiento)</span>
                </span>
              </div>
            </div>

          </div>
        );
      })()}

      {/* 5. TAB 3: LIVE COOKIES SCANNER */}
      {activeTab === 'scanner' && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#ff6486]" />
                <span>Escáner de Cookies Activas en este Navegador ({liveCookies.length})</span>
              </h3>
              <p className="text-xs text-slate-400">
                Inspección en tiempo real de las cookies almacenadas localmente en <code className="text-slate-300 font-mono">document.cookie</code>.
              </p>
            </div>

            <button
              onClick={scanBrowserCookies}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Volver a Escanear</span>
            </button>
          </div>

          {liveCookies.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Cookie className="w-10 h-10 mx-auto opacity-30 text-slate-400" />
              <div className="text-sm font-bold text-slate-400">No hay cookies directas de sesión registradas en este dominio</div>
              <div className="text-xs text-slate-500">Pulsa «Guardar Cambios» o «Simular Aceptar Todo» para registrar la cookie de consentimiento.</div>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {liveCookies.map((c, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#ffc456]">{c.name}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-950 text-slate-400 border border-slate-800">
                        {c.name.includes('consent') ? 'Técnica / Consentimiento' : c.name.startsWith('_g') ? 'Google / Analítica' : 'Sesión'}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-300 truncate max-w-xl bg-slate-950 p-1.5 rounded border border-slate-850">
                      {decodeURIComponent(c.value)}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteSingleCookie(c.name)}
                    className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-red-400 cursor-pointer shrink-0"
                    title="Eliminar esta cookie"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. TAB 3: OFFICIAL COOKIES DIRECTORY */}
      {activeTab === 'directory' && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#ffc456]" />
              <span>Directorio Oficial de Cookies de KAIROSION</span>
            </h3>
            <p className="text-xs text-slate-400">
              Inventario auditado de tecnologías de almacenamiento utilizadas en el portal conforme a las directivas de Google AdSense y RGPD.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                  <th className="pb-3 pr-4">Nombre</th>
                  <th className="pb-3 pr-4">Proveedor</th>
                  <th className="pb-3 pr-4">Categoría</th>
                  <th className="pb-3 pr-4">Duración</th>
                  <th className="pb-3">Finalidad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {OFFICIAL_COOKIES.map((c, idx) => (
                  <tr key={idx} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3.5 pr-4 font-mono font-bold text-white whitespace-nowrap">
                      {c.name}
                    </td>
                    <td className="py-3.5 pr-4 text-slate-300 whitespace-nowrap">
                      {c.provider}
                    </td>
                    <td className="py-3.5 pr-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        c.essential 
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' 
                          : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                      }`}>
                        {c.category}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {c.duration}
                    </td>
                    <td className="py-3.5 text-slate-300 text-xs">
                      {c.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. TAB 4: GOOGLE CONSENT MODE V2 */}
      {activeTab === 'consent_mode' && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Code className="w-4 h-4 text-emerald-400" />
              <span>Integración con Google Consent Mode v2 & AdSense</span>
            </h3>
            <p className="text-xs text-slate-400">
              KAIROSION emite señales estándar de consentimiento para que Google AdSense y Google Tags respeten la elección del lector en tiempo real.
            </p>
          </div>

          {/* Current Consent Mode Signal Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { key: 'ad_storage', label: 'Almacenamiento de Anuncios', granted: marketing },
              { key: 'ad_user_data', label: 'Datos de Usuario para Anuncios', granted: marketing },
              { key: 'ad_personalization', label: 'Personalización Publicitaria', granted: marketing },
              { key: 'analytics_storage', label: 'Almacenamiento Analítico', granted: analytics },
            ].map((sig) => (
              <div key={sig.key} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] font-mono text-slate-400 truncate">{sig.key}</div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${sig.granted ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  <span className={`text-xs font-mono font-bold uppercase ${sig.granted ? 'text-emerald-300' : 'text-red-400'}`}>
                    {sig.granted ? 'GRANTED' : 'DENIED'}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500">{sig.label}</div>
              </div>
            ))}
          </div>

          {/* Technical Payload Viewer */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-[10px] font-mono text-[#ffc456] uppercase font-bold">
              Payload de Consentimiento Emitido en Eventos Globales:
            </div>
            <pre className="p-3 rounded-lg bg-slate-900 text-emerald-400 text-xs font-mono overflow-x-auto leading-relaxed">
{`gtag('consent', 'update', {
  'ad_storage': '${marketing ? 'granted' : 'denied'}',
  'ad_user_data': '${marketing ? 'granted' : 'denied'}',
  'ad_personalization': '${marketing ? 'granted' : 'denied'}',
  'analytics_storage': '${analytics ? 'granted' : 'denied'}'
});`}
            </pre>
          </div>
        </div>
      )}

    </div>
  );
};
