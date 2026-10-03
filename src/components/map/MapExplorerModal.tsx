import React from 'react';
import { MapDistrict } from '../../types';
import { X, MapPin, ShieldAlert, Navigation, Compass } from 'lucide-react';

interface MapExplorerModalProps {
  district: MapDistrict | null;
  onClose: () => void;
}

export const MapExplorerModal: React.FC<MapExplorerModalProps> = ({
  district,
  onClose,
}) => {
  if (!district) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                ESTADO DE LEONIDA · {district.type}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                {district.name}
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
          
          {/* Danger & Police Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 block font-mono">NIVEL DE PELIGRO</span>
              <span className="font-bold text-amber-400">{district.dangerLevel}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-mono">TIEMPO RESPUESTA POLICIAL</span>
              <span className="font-bold text-cyan-400">{district.policeResponseTime}</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              Guía Geográfica & Entorno
            </h3>
            <p className="leading-relaxed text-slate-200">
              {district.description}
            </p>
          </div>

          {/* Key Locations */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-emerald-400" />
              Puntos de Interés Confirmados
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {district.keyLocations.map((loc, lIdx) => (
                <div 
                  key={lIdx} 
                  className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-200 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{loc}</span>
                </div>
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
            Cerrar Mapa
          </button>
        </div>
      </div>
    </div>
  );
};
