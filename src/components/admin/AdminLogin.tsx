import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { Lock, ShieldCheck, ArrowRight, Sparkles, KeyRound } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

interface AdminLoginProps {
  onBackToPublicSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToPublicSite }) => {
  const { loginAdmin, currentUser } = useCMS();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(password || 'admin123');
    if (!success) {
      setError(true);
    }
  };

  const handleQuickDemoLogin = () => {
    loginAdmin('admin123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#080c14] text-slate-100">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        
        {/* Neon accent top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-linear-to-r from-rose-500 via-pink-500 to-amber-400 rounded-full" />

        {/* Logo & Header */}
        <div className="text-center space-y-2 flex flex-col items-center">
          <BrandLogo
            size="lg"
            subtitleText="PANEL CMS EDITORIAL v2.0"
          />
          <p className="text-xs text-slate-400 max-w-xs pt-1">
            Acceso administrativo restringido a la mesa de redacción editorial de KAIROSION
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
              Clave de Acceso / Contraseña Editorial
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="Ingresa tu clave de editor..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-hidden focus:border-rose-400 font-mono"
              />
            </div>
            {error && (
              <span className="text-[11px] text-red-400 font-mono mt-1 block">
                Clave incorrecta. Usa "admin123" o pulsa acceso directo.
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer font-display"
          >
            <span>Iniciar Sesión en CMS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Access Box */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 text-center">
          <div className="text-[11px] font-mono text-slate-400">
            Acceso Rápido de Demostración:
          </div>
          <button
            onClick={handleQuickDemoLogin}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-rose-300 font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Entrar como {currentUser?.role || 'Administrador'} (Kamilo)
          </button>
        </div>

        {/* Back to Public Site */}
        <div className="text-center pt-2">
          <button
            onClick={onBackToPublicSite}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-mono cursor-pointer"
          >
            ← Volver al portal público de KAIROSION
          </button>
        </div>

      </div>
    </div>
  );
};
