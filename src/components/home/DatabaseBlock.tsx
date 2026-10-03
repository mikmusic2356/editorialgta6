import React, { useState } from 'react';
import { VEHICLES_DATA } from '../../data/vehicles';
import { WEAPONS_DATA } from '../../data/weapons';
import { MAP_DISTRICTS } from '../../data/mapDistricts';
import { VehicleSpecs, WeaponSpecs, MapDistrict, MainCategorySlug } from '../../types';
import { Car, Crosshair, MapPin, ArrowRight } from 'lucide-react';

interface DatabaseBlockProps {
  onSelectVehicle: (v: VehicleSpecs) => void;
  onSelectWeapon: (w: WeaponSpecs) => void;
  onSelectDistrict: (d: MapDistrict) => void;
  onSelectCategory: (category: MainCategorySlug) => void;
}

export const DatabaseBlock: React.FC<DatabaseBlockProps> = ({
  onSelectVehicle,
  onSelectWeapon,
  onSelectDistrict,
  onSelectCategory,
}) => {
  const [activeTab, setActiveTab] = useState<'vehiculos' | 'armas' | 'mapa'>('vehiculos');

  return (
    <section aria-label="Bases de Datos de Leonida" className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 space-y-6">
      {/* Header with Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-[#ff6486] font-bold mb-1">
            BLOQUE 06 · ENCICLOPEDIA & CATÁLOGOS TÉCNICOS
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Bases de Datos de Leonida
          </h2>
        </div>

        {/* Database Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('vehiculos')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 font-medium cursor-pointer ${
              activeTab === 'vehiculos' ? 'bg-[#ff6486] text-white font-bold shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Vehículos ({VEHICLES_DATA.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('armas')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 font-medium cursor-pointer ${
              activeTab === 'armas' ? 'bg-[#ff6486] text-white font-bold shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Armas ({WEAPONS_DATA.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('mapa')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 font-medium cursor-pointer ${
              activeTab === 'mapa' ? 'bg-[#ff6486] text-white font-bold shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Distritos ({MAP_DISTRICTS.length})</span>
          </button>
        </div>
      </div>

      {/* 1. VEHICLES TAB */}
      {activeTab === 'vehiculos' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {VEHICLES_DATA.slice(0, 3).map((v) => (
              <div
                key={v.id}
                onClick={() => onSelectVehicle(v)}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-[#ff6486]/50 hover:bg-slate-900/80 transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#ffc456] font-bold">
                    <span>{v.manufacturer}</span>
                    <span className="text-slate-400">{v.classType}</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#ff6486] transition-colors">
                    {v.name}
                  </h3>
                  <div className="flex items-center justify-between text-xs font-mono pt-1 text-white">
                    <span className="text-slate-400">Vel. Punta:</span>
                    <span className="text-[#ffc456] font-bold">{v.topSpeedKmh} km/h</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-white">
                    <span className="text-slate-400">Aceleración:</span>
                    <span className="text-[#ff6486] font-bold">{v.accelerationScore}/100</span>
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-[#ff6486] font-mono font-bold">
                  <span>Ver ficha técnica</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => onSelectCategory('vehiculos')}
              className="px-4 py-2 rounded-lg bg-[#ff6486] hover:bg-[#ff6486]/90 text-white font-bold text-xs shadow-md inline-flex items-center gap-1.5 cursor-pointer font-mono transition-colors"
            >
              <span>Explorar catálogo completo de vehículos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. WEAPONS TAB */}
      {activeTab === 'armas' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {WEAPONS_DATA.slice(0, 3).map((w) => (
              <div
                key={w.id}
                onClick={() => onSelectWeapon(w)}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-[#ff6486]/50 hover:bg-slate-900/80 transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#ffc456] font-bold">
                    <span>{w.manufacturer}</span>
                    <span className="text-slate-400">{w.type}</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#ff6486] transition-colors">
                    {w.name}
                  </h3>
                  <div className="flex items-center justify-between text-xs font-mono pt-1 text-white">
                    <span className="text-slate-400">Daño Balístico:</span>
                    <span className="text-[#ff6486] font-bold">{w.damageScore}/100</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-white">
                    <span className="text-slate-400">Cadencia:</span>
                    <span className="text-[#ffc456] font-bold">{w.fireRateRpm} RPM</span>
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-[#ff6486] font-mono font-bold">
                  <span>Ver estadísticas balísticas</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => onSelectCategory('armas')}
              className="px-4 py-2 rounded-lg bg-[#ff6486] hover:bg-[#ff6486]/90 text-white font-bold text-xs shadow-md inline-flex items-center gap-1.5 cursor-pointer font-mono transition-colors"
            >
              <span>Abrir arsenal de armas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 3. MAP TAB */}
      {activeTab === 'mapa' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {MAP_DISTRICTS.slice(0, 3).map((d) => (
              <div
                key={d.id}
                onClick={() => onSelectDistrict(d)}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-[#ff6486]/50 hover:bg-slate-900/80 transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="text-[10px] font-mono text-[#ffc456] font-bold uppercase">
                    {d.type}
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#ff6486] transition-colors">
                    {d.name}
                  </h3>
                  <p className="text-xs text-white/90 line-clamp-2 font-light">
                    {d.description}
                  </p>
                  <div className="text-[11px] font-mono text-[#ff6486] font-bold pt-1">
                    Peligro: {d.dangerLevel}
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-[#ff6486] font-mono font-bold">
                  <span>Ver mapa del distrito</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => onSelectCategory('mapa')}
              className="px-4 py-2 rounded-lg bg-[#ff6486] hover:bg-[#ff6486]/90 text-white font-bold text-xs shadow-md inline-flex items-center gap-1.5 cursor-pointer font-mono transition-colors"
            >
              <span>Explorar mapa interactivo de Leonida</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
