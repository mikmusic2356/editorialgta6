import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { Lock, ShieldCheck, ArrowRight, KeyRound, User, Eye, EyeOff, ShieldAlert, Key } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

interface AdminLoginProps {
  onBackToPublicSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToPublicSite }) => {
  const { loginAdmin } = useCMS();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim() || !accessKey.trim()) {
      setError('Por favor completa todos los campos requeridos: Usuario, Contraseña y Llave de Acceso.');
      return;
    }

    const success = loginAdmin({
      username: username.trim(),
      password: password.trim(),
      accessKey: accessKey.trim()
    });

    if (!success) {
      setError('Credenciales no autorizadas. Verifica tu Usuario, Contraseña y Llave de Seguridad.');
    }
  };

  const handleAutofillCredentials = () => {
    setUsername('admin');
    setPassword('Kairosion2026!*');
    setAccessKey('KAIROS-KEY-9988');
    setError(null);
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full text-[11px] font-mono text-rose-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Acceso Seguro de 3 Factores</span>
          </div>
          <p className="text-xs text-slate-400 max-w-xs pt-1 text-center">
            Portal administrativo restringido para la mesa de redacción y editores de KAIROSION
          </p>
        </div>

        {/* Login Form with 3 fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Field 1: Usuario */}
          <div>
            <label className="text-xs font-mono uppercase text-slate-300 block mb-1 flex items-center justify-between">
              <span>1. Usuario / Editor</span>
              <span className="text-[10px] text-slate-500">Obligatorio</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Ej: admin o kamilo"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError(null);
                }}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-hidden focus:border-rose-400 font-mono transition-colors"
                autoComplete="username"
              />
            </div>
          </div>

          {/* Field 2: Contraseña */}
          <div>
            <label className="text-xs font-mono uppercase text-slate-300 block mb-1 flex items-center justify-between">
              <span>2. Contraseña Editorial</span>
              <span className="text-[10px] text-slate-500">Obligatorio</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Ingresa tu contraseña de editor..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                className="w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-hidden focus:border-rose-400 font-mono transition-colors"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Field 3: Llave de Acceso */}
          <div>
            <label className="text-xs font-mono uppercase text-slate-300 block mb-1 flex items-center justify-between">
              <span>3. Llave de Acceso (PIN / Token)</span>
              <span className="text-[10px] text-[#ffc456]">Filtro de Seguridad</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#ffc456] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showKey ? 'text' : 'password'}
                placeholder="Ej: KAIROS-KEY-9988"
                value={accessKey}
                onChange={(e) => {
                  setAccessKey(e.target.value);
                  setError(null);
                }}
                className="w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-hidden focus:border-[#ffc456] font-mono transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl flex items-start gap-2 text-[11px] text-red-300 font-mono">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-rose-500 via-[#ff6486] to-amber-400 hover:opacity-95 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer font-display tracking-wider"
          >
            <span>VERIFICAR CREDENCIALES Y ENTRAR</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Credentials Helper Box for Admin */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 font-bold">
              <Key className="w-3.5 h-3.5 text-[#ffc456]" />
              <span>Credenciales Oficiales del Administrador</span>
            </div>
            <button
              onClick={handleAutofillCredentials}
              type="button"
              className="text-[10px] font-mono text-rose-400 hover:text-rose-300 underline cursor-pointer"
            >
              Autocompletar
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-1 text-[10px] font-mono text-slate-400 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Usuario:</span>
              <span className="text-slate-200 font-bold select-all">admin</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Contraseña:</span>
              <span className="text-rose-300 font-bold select-all">Kairosion2026!*</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Llave de Acceso:</span>
              <span className="text-amber-300 font-bold select-all">KAIROS-KEY-9988</span>
            </div>
          </div>
        </div>

        {/* Back to Public Site */}
        <div className="text-center pt-1">
          <button
            onClick={onBackToPublicSite}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-mono cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
          >
            <span>← Volver a la portada pública de KAIROSION</span>
          </button>
        </div>

      </div>
    </div>
  );
};
