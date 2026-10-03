import React, { useState, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import { 
  Cookie, 
  ShieldCheck, 
  Settings, 
  X, 
  Check, 
  Sparkles, 
  Lock, 
  Info,
  DollarSign,
  HeartHandshake
} from 'lucide-react';

export const CookieConsentBanner: React.FC = () => {
  const { cookieConsent, saveCookieConsent } = useCMS();

  const [modalOpen, setModalOpen] = useState(false);
  const [preferences, setPreferences] = useState(cookieConsent.preferences ?? true);
  const [analytics, setAnalytics] = useState(cookieConsent.analytics ?? false);
  const [marketing, setMarketing] = useState(cookieConsent.marketing ?? false);

  // Sync internal state if cookieConsent changes externally
  useEffect(() => {
    setPreferences(cookieConsent.preferences ?? true);
    setAnalytics(cookieConsent.analytics ?? false);
    setMarketing(cookieConsent.marketing ?? false);
  }, [cookieConsent]);

  // Listen for external trigger to open cookie settings modal
  useEffect(() => {
    const handleOpenSettings = () => {
      setModalOpen(true);
    };

    window.addEventListener('open_cookie_settings', handleOpenSettings);
    return () => window.removeEventListener('open_cookie_settings', handleOpenSettings);
  }, []);

  const handleAcceptAll = () => {
    saveCookieConsent({
      necessary: true,
      preferences: true,
      analytics: true,
      marketing: true
    }, { source: 'banner' });
    setModalOpen(false);
  };

  const handleRejectNonEssential = () => {
    saveCookieConsent({
      necessary: true,
      preferences: false,
      analytics: false,
      marketing: false
    }, { source: 'banner' });
    setModalOpen(false);
  };

  const handleSaveCustom = () => {
    saveCookieConsent({
      necessary: true,
      preferences,
      analytics,
      marketing
    }, { source: 'modal' });
    setModalOpen(false);
  };

  // If user has already answered and the modal is not explicitly open, don't render floating banner
  if (cookieConsent.hasAnswered && !modalOpen) {
    return null;
  }

  return (
    <>
      {/* 1. FLOATING BOTTOM COOKIE BANNER */}
      {!cookieConsent.hasAnswered && (
        <div 
          role="dialog"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-desc"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-xl z-50 bg-slate-950/98 backdrop-blur-2xl border border-slate-700/90 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-5"
        >
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#ff6486]/15 text-[#ff6486] border border-[#ff6486]/30 shrink-0">
              <Cookie className="w-6 h-6" />
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h4 id="cookie-consent-title" className="text-sm font-bold text-white font-display">
                  Privacidad & Cookies en KAIROSION
                </h4>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-[#ffc456] border border-slate-800 uppercase font-bold">
                  RGPD / GDPR
                </span>
              </div>
              <p id="cookie-consent-desc" className="text-xs text-slate-300 leading-relaxed font-light">
                Utilizamos cookies técnicas obligatorias para la velocidad de la web y, con tu consentimiento, cookies de <strong className="text-white">Google AdSense</strong> y analíticas para sostener nuestros servidores de forma 100% gratuita y sin muros de pago.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => setModalOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            >
              <Settings className="w-3.5 h-3.5 text-[#ffc456]" />
              <span>Personalizar</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRejectNonEssential}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 rounded-lg transition-colors cursor-pointer"
              >
                Rechazar no esenciales
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-[#ffc456] hover:bg-[#ffc456]/90 rounded-lg shadow-md transition-all cursor-pointer flex items-center gap-1 active:scale-95"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Aceptar todas</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. PREFERENCES CONFIGURATION MODAL */}
      {modalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setModalOpen(false)}
        >
          <div 
            className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#ff6486]/20 text-[#ff6486]">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    Centro de Preferencias de Cookies
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    KAIROSION · Gestión transparente de privacidad conforme al RGPD
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cookies Categories List */}
            <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
              
              {/* Category 1: Necessary */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Cookies Técnicas & Esenciales</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                      OBLIGATORIAS
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Necesarias para la navegación segura, renderizado WebP, arquitectura de páginas y almacenamiento local de sesión. No pueden desactivarse.
                  </p>
                </div>
                <input 
                  type="checkbox" 
                  checked 
                  disabled 
                  className="rounded bg-slate-800 text-emerald-500 cursor-not-allowed mt-1" 
                />
              </div>

              {/* Category 2: Preferences */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-white">Preferencias de Lectura e Interfaz</div>
                  <p className="text-[11px] text-slate-400">
                    Guarda la configuración visual del lector, preferencias de modo oscuro y consentimientos previos.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences}
                  onChange={(e) => setPreferences(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-[#ff6486] cursor-pointer mt-1"
                />
              </div>

              {/* Category 3: Analytics */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-white">Analíticas de Rendimiento Anónimas</div>
                  <p className="text-[11px] text-slate-400">
                    Métricas de velocidad de carga y secciones más consultadas para optimizar el rendimiento técnico sin registrar datos personales directos.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-[#ff6486] cursor-pointer mt-1"
                />
              </div>

              {/* Category 4: Marketing / AdSense */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">Publicidad No Invasiva (Google AdSense)</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30">
                      SOSTENIBILIDAD
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Permite mostrar anuncios contextuales y controlar la frecuencia de visualización para financiar nuestros servidores manteniendo el acceso 100% gratuito.
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

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={handleRejectNonEssential}
                className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                Rechazar no esenciales
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveCustom}
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  Guardar selección
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-5 py-2 text-xs font-bold text-slate-950 bg-[#ffc456] hover:bg-[#ffc456]/90 rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Aceptar todas
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
