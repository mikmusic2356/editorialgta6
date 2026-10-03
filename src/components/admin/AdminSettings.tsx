import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { Settings, Save, Check, Globe, DollarSign, BarChart3, Shield } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings } = useCMS();

  const [siteName, setSiteName] = useState(settings.siteName);
  const [siteTagline, setSiteTagline] = useState(settings.siteTagline);
  const [siteUrl, setSiteUrl] = useState(settings.siteUrl);
  const [contactEmail, setContactEmail] = useState(settings.contactEmail);
  const [timezone, setTimezone] = useState(settings.timezone);
  const [adsenseClientId, setAdsenseClientId] = useState(settings.adsenseClientId);
  const [adsenseEnabled, setAdsenseEnabled] = useState(settings.adsenseEnabled);
  const [analyticsId, setAnalyticsId] = useState(settings.analyticsId);
  const [twitterHandle, setTwitterHandle] = useState(settings.twitterHandle);
  const [metaDescription, setMetaDescription] = useState(settings.metaDescription);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    updateSettings({
      siteName,
      siteTagline,
      siteUrl,
      contactEmail,
      timezone,
      adsenseClientId,
      adsenseEnabled,
      analyticsId,
      twitterHandle,
      metaDescription
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-display">
            Configuración General del Portal
          </h1>
          <p className="text-xs text-slate-400">
            Ajustes globales del sitio, identificadores de Google AdSense y parámetros SEO.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 cursor-pointer w-fit"
        >
          <Save className="w-4 h-4" />
          <span>{isSaved ? '¡Ajustes Guardados!' : 'Guardar Ajustes'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. General Identification */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-rose-400 font-bold">
            <Globe className="w-4 h-4" />
            <span>Identidad & Contacto</span>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Nombre del Portal</label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Lema / Tagline</label>
            <input
              type="text"
              value={siteTagline}
              onChange={(e) => setSiteTagline(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">URL Principal Canónica</label>
            <input
              type="text"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Email de Redacción</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Zona Horaria</label>
            <input
              type="text"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
            />
          </div>
        </div>

        {/* 2. AdSense & Third Party Integrations */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-400 font-bold">
            <DollarSign className="w-4 h-4" />
            <span>Monetización Google AdSense</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Espacios Publicitarios AdSense</div>
              <div className="text-[10px] text-slate-400 font-light">Habilitar bloques laterales y entre artículos</div>
            </div>
            <input
              type="checkbox"
              checked={adsenseEnabled}
              onChange={(e) => setAdsenseEnabled(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-rose-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
              Google AdSense Client ID (ca-pub-...)
            </label>
            <input
              type="text"
              value={adsenseClientId}
              onChange={(e) => setAdsenseClientId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono"
            />
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-cyan-400 font-bold">
              <BarChart3 className="w-4 h-4" />
              <span>Google Analytics / Search Console</span>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                ID de Medición (G-XXXXXXXX)
              </label>
              <input
                type="text"
                value={analyticsId}
                onChange={(e) => setAnalyticsId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Cuenta de Twitter / X
              </label>
              <input
                type="text"
                value={twitterHandle}
                onChange={(e) => setTwitterHandle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
