import { WeaponSpecs } from '../types';

export const WEAPONS_DATA: WeaponSpecs[] = [
  {
    id: 'wpn-combat-pistol',
    slug: 'vom-feuer-combat-pistol',
    name: 'Vom Feuer Combat Pistol 9mm',
    manufacturer: 'Vom Feuer',
    type: 'Pistola',
    damageScore: 52,
    fireRateRpm: 380,
    accuracyScore: 78,
    magazineCapacity: '15 balas (ampliable a 20)',
    rangeEffective: '35 metros',
    attachmentsSupported: ['Silenciador Táctico', 'Linterna LED de Armazón', 'Mira Micro Punto Rojo', 'Cargador Extendido'],
    description: 'Pistola de dotación policial fiable y con retroceso suave. El arma secundaria predilecta para atracos discretos y combates a quemarropa en callejones.'
  },
  {
    id: 'wpn-carbine-rifle',
    slug: 'hawk-little-carbine-rifle',
    name: 'Hawk & Little Carbine Rifle 5.56',
    manufacturer: 'Hawk & Little',
    type: 'Fusil de Asalto',
    damageScore: 74,
    fireRateRpm: 680,
    accuracyScore: 86,
    magazineCapacity: '30 balas (tambor de 60)',
    rangeEffective: '120 metros',
    attachmentsSupported: ['Supresor Pesado', 'Empuñadura Angular', 'Mira Holográfica EOTech', 'Láser Táctico Verde'],
    description: 'El estándar de oro en tiroteos urbanos de media distancia. Excelente estabilidad en ráfagas cortas y penetración demostrada contra chalecos de nivel II.'
  },
  {
    id: 'wpn-pump-shotgun',
    slug: 'heavy-pump-shotgun-12g',
    name: 'Heavy Pump Shotgun Calibre 12',
    manufacturer: 'Shrewsbury',
    type: 'Escopeta',
    damageScore: 95,
    fireRateRpm: 90,
    accuracyScore: 45,
    magazineCapacity: '8 cartuchos',
    rangeEffective: '20 metros (posta) / 45m (bala sabot)',
    attachmentsSupported: ['Freno de Boca Dispersor', 'Riel con Linterna de Asalto', 'Cartuchera de Culata'],
    description: 'Destructiva a corta distancia. Capaz de reventar cerraduras de puertas blindadas y neutralizar vehículos ligeros destrozando sus bloques de motor.'
  },
  {
    id: 'wpn-marksman-dmr',
    slug: 'marksman-dmr-308',
    name: 'Marksman DMR .308 Win',
    manufacturer: 'Ammu-Nation Custom',
    type: 'Tirador Selecto',
    damageScore: 88,
    fireRateRpm: 210,
    accuracyScore: 94,
    magazineCapacity: '10 balas',
    rangeEffective: '280 metros',
    attachmentsSupported: ['Visor Térmico Nocturno', 'Bípode Plegable', 'Silenciador de Titanio', 'Munición Perforante'],
    description: 'Rifle semiautomático de precisión quirúrgica para tiradores desde azoteas y coberturas elevadas durante asaltos a depósitos bancarios.'
  },
  {
    id: 'wpn-c4',
    slug: 'c4-sticky-charge-pack',
    name: 'Carga Explosiva C4 Adhesiva',
    manufacturer: 'Material Clandestino',
    type: 'Explosivo',
    damageScore: 100,
    fireRateRpm: 1,
    accuracyScore: 100,
    magazineCapacity: '4 cargas por bolsa',
    rangeEffective: 'Radio letal de 12 metros',
    attachmentsSupported: ['Detonador por Teléfono Móvil', 'Imán de Neodimio'],
    description: 'Imprescindible para abrir cámaras acorazadas subterráneas, destruir furgones blindados en marcha y preparar emboscadas a patrullas SWAT.'
  }
];
