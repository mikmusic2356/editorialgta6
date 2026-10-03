import React from 'react';
import { WeaponSpecs } from '../../types';
import { X, Crosshair, Target, Shield, Wrench } from 'lucide-react';

interface WeaponDetailModalProps {
  weapon: WeaponSpecs | null;
  onClose: () => void;
}

export const WeaponDetailModal: React.FC<WeaponDetailModalProps> = ({
  weapon,
  onClose,
}) => {
  if (!weapon) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center font-bold">
              <Crosshair className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-red-400 font-bold">
                {weapon.manufacturer} · {weapon.type}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                {weapon.name}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300 text-sm leading-relaxed">
          
          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-center text-xs">
            <div>
              <span className="text-slate-500 block font-mono">DAÑO</span>
              <span className="font-bold text-base text-red-400 font-mono">{weapon.damageScore}/100</span>
            </div>
            <div>
              <span className="text-slate-500 block font-mono">CADENCIA</span>
              <span className="font-bold text-base text-white font-mono">{weapon.fireRateRpm} DPM</span>
            </div>
            <div>
              <span className="text-slate-500 block font-mono">CARGADOR</span>
              <span className="font-semibold text-slate-300 line-clamp-1">{weapon.magazineCapacity}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-mono">ALCANCE EFECTIVO</span>
              <span className="font-semibold text-amber-400 line-clamp-1">{weapon.rangeEffective}</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              Balística y Desempeño
            </h3>
            <p className="leading-relaxed text-slate-200">
              {weapon.description}
            </p>
          </div>

          {/* Compatible Attachments */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-red-400" />
              Accesorios y Modificaciones Compatibles
            </h3>
            <div className="flex flex-wrap gap-2">
              {weapon.attachmentsSupported.map((att, aIdx) => (
                <span 
                  key={aIdx} 
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300"
                >
                  ✓ {att}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Cerrar Arsenal
          </button>
        </div>
      </div>
    </div>
  );
};
