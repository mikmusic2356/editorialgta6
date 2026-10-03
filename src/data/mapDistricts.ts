import { MapDistrict } from '../types';

export const MAP_DISTRICTS: MapDistrict[] = [
  {
    id: 'dist-vice-beach',
    slug: 'vice-beach-ocean-drive',
    name: 'Vice Beach & Ocean Drive',
    type: 'Distrito Metropolitano',
    dangerLevel: 'Bajo (Vigilancia Alta)',
    policeResponseTime: '30 - 45 segundos',
    keyLocations: ['Hotel Art Déco Boulevard', 'Paseo Marítimo de Palmeras', 'Club Nocturno Malibu Reborn', 'Muelle Turístico'],
    description: 'El epicentro turístico y visual de Vice City. Hoteles iluminados con luces de neón pastel, superdeportivos circulando a baja velocidad y constante presencia de patrullas policiales en bicicleta y coches ligeros.'
  },
  {
    id: 'dist-downtown',
    slug: 'downtown-financial-district',
    name: 'Downtown Vice City',
    type: 'Distrito Metropolitano',
    dangerLevel: 'Medio',
    policeResponseTime: '45 - 60 segundos',
    keyLocations: ['Torre Financiera Maze Bank Vice', 'Sede Judicial de Leonida', 'Estación Central de Metro Elevado', 'Helipuertos Corporativos'],
    description: 'El núcleo de rascacielos de cristal y corporaciones multimillonarias. Cuenta con las cámaras de seguridad más avanzadas de la ciudad y accesos subterráneos ideales para atracos de guante blanco.'
  },
  {
    id: 'dist-little-haiti',
    slug: 'little-haiti-district',
    name: 'Little Haiti & Barrio Obrero',
    type: 'Distrito Metropolitano',
    dangerLevel: 'Alto (Bandas Callejeras)',
    policeResponseTime: '2 - 3 minutos',
    keyLocations: ['Talleres Clandestinos Pay & Spray', 'Mercado Callejero Vudú', 'Desguace Municipal', 'Pisos Francos de Fuga'],
    description: 'El hogar formativo de Lucia. Un barrio vibrante con fuerte identidad cultural caribeña, callejones estrechos sin cámaras y talleres donde modificar vehículos robados lejos de la vigilancia estatal.'
  },
  {
    id: 'dist-grassrivers',
    slug: 'grassrivers-everglades-swamp',
    name: 'Grassrivers (Pantanos de Leonida)',
    type: 'Parque Natural',
    dangerLevel: 'Extremo (Fauna y Clandestinidad)',
    policeResponseTime: 'Inexistente / Solo Guardabosques en lanchas',
    keyLocations: ['Cabañas de Cazadores Furtivos', 'Laboratorios en Manglares', 'Pistas de Aterrizaje Clandestinas', 'Nidos de Caimanes Gigantes'],
    description: 'Un inmenso laberinto acuático donde la ley no existe. Solo accesible mediante hidrodeslizadores o todoterrenos con snorkel. La fauna local ataca tanto a jugadores como a criminales en fuga.'
  },
  {
    id: 'dist-gator-keys',
    slug: 'gator-keys-archipelago',
    name: 'Gator Keys & Overseas Highway',
    type: 'Archipiélago',
    dangerLevel: 'Medio',
    policeResponseTime: '1.5 - 2 minutos',
    keyLocations: ['Puente Colgante de las Siete Millas', 'Puertos Deportivos de Yates', 'Estaciones de Servicio en Islotes', 'Faros Marítimos'],
    description: 'Cadena de islas paradisíacas unidas por autopistas sobre el mar turquesa. Rutas estratégicas para el contrabando náutico internacional entre aguas abiertas y el continente.'
  },
  {
    id: 'dist-port-gellhorn',
    slug: 'port-gellhorn-industrial',
    name: 'Port Gellhorn & Refinerías',
    type: 'Condado Industrial',
    dangerLevel: 'Alto (Bandas Callejeras)',
    policeResponseTime: '2 - 4 minutos',
    keyLocations: ['Refinerías Petrolíferas', 'Terminales de Contenedores de Carga', 'Circuitos de Carreras Ilegales', 'Bares de Moteros'],
    description: 'El corazón productivo y decadente del noroeste de Leonida. Sede de bandas de contrabandistas, talleres de trucaje de motores pesados y hangares para almacenar botines industriales.'
  }
];
