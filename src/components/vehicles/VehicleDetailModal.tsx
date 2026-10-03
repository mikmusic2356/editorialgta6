import React from 'react';
import { VehicleSpecs } from '../../types';
import { X, Car, Gauge, Zap, Shield, Sparkles } from 'lucide-react';

interface VehicleDetailModalProps {
  vehicle: VehicleSpecs | null;
  onClose: () => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  vehicle,
  onClose,
}) => {
  if (!vehicle) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                {vehicle.manufacturer} · {vehicle.classType}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                {vehicle.name}
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
          
          {/* Quick Specs Pill Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-center text-xs">
            <div>
              <span className="text-slate-500 block font-mono">VEL. PUNTA</span>
              <span className="font-bold text-base text-amber-400 font-mono">{vehicle.topSpeedKmh} km/h</span>
            </div>
            <div>
              <span className="text-slate-500 block font-mono">PLAZAS</span>
              <span className="font-bold text-base text-white">{vehicle.capacitySeats}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-mono">INSPIRACIÓN</span>
              <span className="font-semibold text-slate-300 line-clamp-1">{vehicle.realLifeInspiration}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-mono">TUNING</span>
              <span className="font-semibold text-emerald-400 line-clamp-1">{vehicle.customizationTier}</span>
            </div>
          </div>

          {/* Performance Bars */}
          <div className="space-y-3.5 p-4 rounded-xl bg-slate-950/40 border border-slate-800">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              Telemetría y Rendimiento Oficial
            </h3>
            
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between font-mono mb-1">
                  <span className="text-slate-300">Aceleración 0-100 km/h</span>
                  <span className="text-amber-400 font-bold">{vehicle.accelerationScore}/100</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${vehicle.accelerationScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-mono mb-1">
                  <span className="text-slate-300">Manejabilidad / Agarre en Curva</span>
                  <span className="text-cyan-400 font-bold">{vehicle.handlingScore}/100</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${vehicle.handlingScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-mono mb-1">
                  <span className="text-slate-300">Potencia de Frenado</span>
                  <span className="text-rose-400 font-bold">{vehicle.brakingScore}/100</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-400 rounded-full" style={{ width: `${vehicle.brakingScore}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              Análisis Editorial del Vehículo
            </h3>
            <p className="leading-relaxed text-slate-200">
              {vehicle.description}
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
};
