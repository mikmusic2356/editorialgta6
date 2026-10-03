import { TIPS_ARTICLES } from './tipsArticles';
import { Article } from '../types';
import { CHARACTER_ARTICLES } from './characterArticles';
import { LOCATION_ARTICLES } from './locationArticles';
import { VEHICLE_ARTICLES } from './vehicleArticles';
import { WEAPON_ARTICLES } from './weaponArticles';
import { MUSIC_ARTICLES } from './musicArticles';
import { NEWS_GTA6_ARTICLES } from './newsGta6Articles';
import { NEWS_ROCKSTAR_ARTICLES } from './newsRockstarArticles';

export const ARTICLES: Article[] = [
  // =========================================================================
  // CATEGORIA 1: GTA 6 (Hub central con artículos en sus 11 subcategorías)
  // =========================================================================
  {
    id: 'art-gta6-01',
    slug: 'gta-6-al-detalle-todo-sobre-el-desarrollo-motor-rage-9-y-salto-generacional',
    title: 'GTA 6 al detalle: Todo sobre el desarrollo, motor RAGE 9 y salto generacional',
    seoTitle: 'GTA 6 Información General: Desarrollo, Motor Gráfico y Detalles | KAIROSION',
    seoDescription: 'Análisis exhaustivo sobre el desarrollo de Grand Theft Auto VI, innovaciones técnicas del motor RAGE 9 y visión de Rockstar Games.',
    excerpt: 'Desglosamos toda la información general confirmada sobre el desarrollo de GTA 6, el presupuesto récord y la arquitectura tecnológica en consolas de nueva generación.',
    category: 'gta-6',
    subcategorySlug: 'informacion',
    categoryLabel: 'GTA 6 · Información General',
    verificationType: 'oficial',
    author: {
      name: 'Marcos Valiente',
      role: 'Jefe de Redacción',
      avatar: '/images/Personajes/Brian_Heder_01.webp',
      bio: 'Especialista en sagas de mundo abierto y tecnología de Rockstar Games.'
    },
    publishedAt: '2026-09-29T10:00:00Z',
    updatedAt: '2026-09-30T08:00:00Z',
    readTimeMinutes: 7,
    tags: ['GTA 6', 'Desarrollo', 'RAGE 9', 'Rockstar Games', 'PS5', 'Xbox Series X'],
    isHero: true,
    isTrending: true,
    isLatest: true,
    featuredImage: {
      url: '/images/Artes_y_Ediciones/Official_Cover_Art_landscape.webp',
      alt: 'Paseo marítimo de Vice City al atardecer con luces de neón y rascacielos',
      caption: 'Vice City recreada con iluminación global por trazado de rayos volumétrico en tiempo real.',
      badge: 'REPORTAJE CENTRAL'
    },
    youtubeVideoId: 'QdBZY2fkU-0',
    schemaType: 'NewsArticle',
    content: {
      leadText: 'Grand Theft Auto VI representa el salto técnico más ambicioso en la historia de los videojuegos de mundo abierto. Con más de una década de desarrollo y un motor RAGE 9 reconstruido desde cero, Rockstar Games busca redefinir la inmersión urbana contemporánea.',
      sections: [
        {
          heading: 'Arquitectura y físicas de nueva generación',
          paragraphs: [
            'El salto de memoria y almacenamiento SSD de PS5 y Xbox Series X permite streaming instantáneo de texturas a resolución nativa 4K sin tiempos de carga perceptibles.',
            'La densidad de peatones cuenta con rutinas neuronales individuales que recuerdan actos delictivos y responden al clima tropical de Leonida de manera orgánica.'
          ]
        }
      ],
      takeaways: [
        'Desarrollado exclusivamente para PlayStation 5, Xbox Series X|S y posteriormente PC.',
        'Motor RAGE 9 con simulación de fluidos, aerodinámica y deformación de materiales.'
      ]
    },
    relatedSlugs: ['mecanicas-de-gameplay-de-gta-6-sistema-de-cobertura-fisicas-de-armas-y-agarre-en-vehiculos', 'lucia-historia-personalidad-rol-gta-6']
  },
  {
    id: 'art-gta6-02',
    slug: 'mecanicas-de-gameplay-de-gta-6-sistema-de-cobertura-fisicas-de-armas-y-agarre-en-vehiculos',
    title: 'Mecánicas de Gameplay de GTA 6: Sistema de cobertura, físicas de armas y agarre en vehículos',
    seoTitle: 'Gameplay de GTA 6: Físicas de Disparo, Conducción y Coberturas | KAIROSION',
    seoDescription: 'Descubre las nuevas mecánicas de jugabilidad de GTA VI: apuntado táctico, peso de inventario, agarre en curvas y tiroteos cooperativos.',
    excerpt: 'Analizamos cómo se siente el control de Lucia y Jason: fluidez en animaciones procedimentales, retroceso balístico y respuesta de la dirección.',
    category: 'gta-6',
    subcategorySlug: 'gameplay',
    categoryLabel: 'GTA 6 · Gameplay',
    verificationType: 'oficial',
    author: {
      name: 'Elena Navarro',
      role: 'Analista de Gameplay',
      avatar: '/images/Personajes/Real_Dimez_04.webp'
    },
    publishedAt: '2026-09-28T14:00:00Z',
    updatedAt: '2026-09-29T20:00:00Z',
    readTimeMinutes: 6,
    tags: ['Gameplay', 'GTA 6', 'Físicas', 'Tiroteos', 'Conducción'],
    featuredImage: {
      url: '/images/Personajes/Jason_and_Lucia_Robbery_With_Logo_landscape.webp',
      alt: 'Tiroteo urbano táctico en una avenida comercial',
      caption: 'El sistema de coberturas dinámicas permite asomarse en diferentes ángulos con precisión milimétrica.',
      badge: 'ANÁLISIS DE GAMEPLAY'
    },
    schemaType: 'TechArticle',
    content: {
      leadText: 'La jugabilidad de GTA VI sintetiza la contundencia física de Max Payne 3 con la interacción ambiental de Red Dead Redemption 2. Los tiroteos premian el uso inteligente de coberturas destructibles y la coordinación entre ambos protagonistas.',
      sections: [
        {
          heading: 'Transición táctica en tiempo real',
          paragraphs: [
            'Alternar entre Lucia y Jason durante un asalto permite flanquear patrullas policiales mientras el compañero proporciona fuego de supresión con armamento pesado desde el vehículo.'
          ]
        }
      ]
    },
    relatedSlugs: ['gta-6-al-detalle-todo-sobre-el-desarrollo-motor-rage-9-y-salto-generacional']
  },
  {
    id: 'art-gta6-03',
    slug: 'la-historia-de-gta-6-al-descubierto-trama-criminal-lealtad-y-el-prologo-carcelario',
    title: 'La historia de GTA 6 al descubierto: Trama criminal, lealtad y el prólogo carcelario',
    seoTitle: 'Historia y Trama de GTA 6: Lucia, Jason y Argumento | KAIROSION',
    seoDescription: 'Desglose del argumento central de Grand Theft Auto VI: el prólogo en prisión, la química entre Lucia y Jason y las guerras de cárteles en Leonida.',
    excerpt: 'Exploramos los arcos narrativos de GTA VI: cómo Lucia y Jason forjan su alianza delictiva en un mundo dominado por redes sociales y avaricia corporativa.',
    category: 'gta-6',
    subcategorySlug: 'historia',
    categoryLabel: 'GTA 6 · Historia & Trama',
    verificationType: 'oficial',
    author: {
      name: 'Tomás Garrido',
      role: 'Editor de Lore',
      avatar: '/images/Personajes/Jason_Duval_01.webp'
    },
    publishedAt: '2026-09-27T16:00:00Z',
    updatedAt: '2026-09-29T11:00:00Z',
    readTimeMinutes: 8,
    tags: ['Historia', 'GTA 6', 'Lucia', 'Jason', 'Vice City', 'Lore'],
    featuredImage: {
      url: '/images/Personajes/Jason_and_Lucia_Motel_landscape.webp',
      alt: 'Lucia dialogando con su oficial de libertad condicional en el Centro Correccional de Leonida',
      caption: 'La narrativa profundiza en los dilemas morales de una pareja que desafía al sistema judicial.',
      badge: 'LORE & HISTORIA'
    },
    schemaType: 'Article',
    content: {
      leadText: 'La historia de GTA 6 abraza la estética de cine negro moderno. Tras salir de prisión, Lucia se reencuentra con Jason en un Vice City donde las bandas tradicionales han sido reemplazadas por entramados financieros y tráfico de narcóticos sintéticos.',
      sections: [
        {
          heading: 'La prueba de fuego en Kelly County',
          paragraphs: [
            'Las decisiones tomadas durante los atracos iniciales determinan el nivel de confianza mutua, desbloqueando diálogos exclusivos y rutas alternativas de escape.'
          ]
        }
      ]
    },
    relatedSlugs: ['lucia-historia-personalidad-rol-gta-6', 'jason-perfil-habilidades-gta-6']
  },
  {
    id: 'art-gta6-04',
    slug: 'elenco-y-reparto-de-gta-6-protagonistas-secundarios-y-facciones-confirmadas',
    title: 'Elenco y Reparto de GTA 6: Protagonistas, Secundarios y Facciones Confirmadas',
    seoTitle: 'Personajes de GTA 6: Elenco, Actores y Facciones | KAIROSION',
    seoDescription: 'Repaso al reparto completo de personajes de Grand Theft Auto VI: Lucia, Jason, aliados en los Cayos y rivales del bajo mundo.',
    excerpt: 'Analizamos todo el reparto de Leonida: protagonistas, mentores en los Cayos, magnates de Vice City y autoridades corruptas.',
    category: 'gta-6',
    subcategorySlug: 'personajes',
    categoryLabel: 'GTA 6 · Personajes',
    verificationType: 'oficial',
    author: {
      name: 'Marcos Valiente',
      role: 'Jefe de Redacción',
      avatar: '/images/Personajes/Brian_Heder_01.webp'
    },
    publishedAt: '2026-09-26T12:00:00Z',
    updatedAt: '2026-09-29T18:00:00Z',
    readTimeMinutes: 7,
    tags: ['Personajes', 'Elenco', 'GTA 6', 'Protagonistas', 'Leonida'],
    featuredImage: {
      url: '/images/Personajes/Boobie_Ike_landscape.webp',
      alt: 'Elenco y personajes de Grand Theft Auto VI en Leonida',
      caption: 'El reparto de Leonida incluye figuras del crimen, magnates del ocio y contrabandistas de los Cayos.',
      badge: 'PANORAMA DE PERSONAJES'
    },
    schemaType: 'Article',
    content: {
      leadText: 'Grand Theft Auto VI presenta uno de los repartos de personajes más ambiciosos y variados de Rockstar Games, abarcando desde los suburbios de Vice City hasta los rincones más salvajes de los manglares de Leonida.',
      sections: [
        {
          heading: 'Estructura de Facciones y Contactos en Leonida',
          paragraphs: [
            'A lo largo del juego, Lucia y Jason interactúan con una extensa red de aliados tácticos, figuras de la noche como Boobie Ike y Dre\'Quan Priest, y contrabandistas veteranos como Brian Heder.'
          ]
        }
      ]
    },
    relatedSlugs: ['lucia-caminos-en-gta-6-biografia-origen-y-datos-confirmados', 'jason-duval-en-gta-6-historia-biografia-y-detalles-confirmados']
  },
  {
    id: 'art-gta6-05',
    slug: 'el-mundo-de-leonida-biomas-subtropicales-vida-salvaje-dinamica-y-clima-tropical',
    title: 'El Mundo de Leonida: Biomas subtropicales, vida salvaje dinámica y clima tropical',
    seoTitle: 'Mundo de Leonida en GTA 6: Ecosistemas, Fauna y Clima | KAIROSION',
    seoDescription: 'Explora la riqueza ecológica de Leonida: aligatores en Grassrivers, tormentas tropicales volumétricas y fauna reactiva.',
    excerpt: 'El estado de Leonida es un organismo vivo. Analizamos la interacción de caimanes, panteras y aves con el entorno urbano y las carreteras secundarias.',
    category: 'gta-6',
    subcategorySlug: 'mundo',
    categoryLabel: 'GTA 6 · Mundo de Leonida',
    verificationType: 'oficial',
    author: {
      name: 'Elena Navarro',
      role: 'Analista de Gameplay',
      avatar: '/images/Personajes/Real_Dimez_04.webp'
    },
    publishedAt: '2026-09-25T17:00:00Z',
    updatedAt: '2026-09-28T10:00:00Z',
    readTimeMinutes: 6,
    tags: ['Mundo', 'Leonida', 'Fauna', 'Ecosistemas', 'GTA 6'],
    featuredImage: {
      url: '/images/Lugares_y_Mapas/Grassrivers_Postcard_landscape.webp',
      alt: 'Pantanos de Grassrivers con aguas turbias y vegetación tropical',
      caption: 'Los pantanos de Grassrivers albergan especies peligrosas que reaccionan a la presencia humana.',
      badge: 'EXPLORACIÓN DEL MUNDO'
    },
    schemaType: 'Article',
    content: {
      leadText: 'Leonida recrea Florida a una escala monumental. Desde los arrecifes de coral en los Cayos hasta los densos manglares del interior, cada bioma posee sus propios ciclos de depredación y climatología dinámica.',
      sections: [
        {
          heading: 'Físicas del agua y oleaje tropical',
          paragraphs: [
            'Las mareas cambian según la hora del día y la intensidad de los huracanes, modificando la navegabilidad de ríos y canales urbanos.'
          ]
        }
      ]
    },
    relatedSlugs: ['mapa-de-gta-6-vice-city-port-gellhorn-ambrosia-y-los-cayos-de-leonida']
  },
  {
    id: 'art-gta6-06',
    slug: 'mapa-de-gta-6-vice-city-port-gellhorn-ambrosia-y-los-cayos-de-leonida',
    title: 'Mapa de GTA 6: Vice City, Port Gellhorn, Ambrosia y los Cayos de Leonida',
    seoTitle: 'Mapa Completo de GTA 6: Distritos, Ciudades y Rutas | KAIROSION',
    seoDescription: 'Guía cartográfica de GTA VI: dimensiones del mapa de Leonida, distritos metropolitanos, aeropuertos y zonas de contrabando.',
    excerpt: 'Examinamos la extensión total del mapa de GTA 6: Vice Beach, Downtown, Little Haiti, Port Gellhorn y las autopistas interoceánicas.',
    category: 'gta-6',
    subcategorySlug: 'mapa',
    categoryLabel: 'GTA 6 · Mapa & Distritos',
    verificationType: 'oficial',
    author: {
      name: 'Marcos Valiente',
      role: 'Jefe de Redacción',
      avatar: '/images/Personajes/Brian_Heder_01.webp'
    },
    publishedAt: '2026-09-24T15:00:00Z',
    updatedAt: '2026-09-29T14:00:00Z',
    readTimeMinutes: 8,
    tags: ['Mapa', 'Vice City', 'Distritos', 'Leonida', 'GTA 6'],
    featuredImage: {
      url: '/images/Lugares_y_Mapas/Leonida_Keys_Postcard_landscape.webp',
      alt: 'Vista aérea de Vice City iluminada por la noche',
      caption: 'La metrópolis de Vice City cuenta con más de 80 interiores transitables sin pantallas de carga.',
      badge: 'CARTOGRAFÍA'
    },
    schemaType: 'Article',
    content: {
      leadText: 'El mapa de Leonida multiplica por 2.5 la superficie de GTA V. Combina una urbe ultramoderna con extensas áreas rurales y rutas marítimas de alta velocidad.',
      sections: [
        {
          heading: 'División administrativa y respuesta policial',
          paragraphs: [
            'Cada condado cuenta con su propio cuerpo de alguaciles y tiempos de respuesta diferenciados, complicando las huidas a través de fronteras comarcales.'
          ]
        }
      ]
    },
    relatedSlugs: ['el-mundo-de-leonida-biomas-subtropicales-vida-salvaje-dinamica-y-clima-tropical']
  },
  {
    id: 'art-gta6-07',
    slug: 'vehiculos-en-gta-6-catalogo-de-superdeportivos-lanchas-rapidas-y-telemetria',
    title: 'Vehículos en GTA 6: Catálogo de superdeportivos, lanchas rápidas y telemetría',
    seoTitle: 'Vehículos de GTA 6: Coches, Tuning y Conducción | KAIROSION',
    seoDescription: 'Base de datos de vehículos en GTA VI: Grotti, Pegassi, Bravado, talleres clandestinos y nuevo modelo de desgaste de neumáticos.',
    excerpt: 'Analizamos las marcas confirmadas, el nuevo sistema de tuneo de motor y el control de cockpit en primera persona.',
    category: 'gta-6',
    subcategorySlug: 'vehiculos',
    categoryLabel: 'GTA 6 · Vehículos',
    verificationType: 'oficial',
    author: {
      name: 'Elena Navarro',
      role: 'Analista de Gameplay',
      avatar: '/images/Personajes/Real_Dimez_04.webp'
    },
    publishedAt: '2026-09-23T11:00:00Z',
    updatedAt: '2026-09-28T16:00:00Z',
    readTimeMinutes: 7,
    tags: ['Vehículos', 'Superdeportivos', 'Tuning', 'Coches', 'GTA 6'],
    featuredImage: {
      url: '/images/Vehiculos/ULTIMATE_EDITION_GROTTI_CHEETAH_01.webp',
      alt: 'Superdeportivo Grotti Furia en color rojo brillante',
      caption: 'Las opciones de personalización mecánica incluyen mapeo de motor, suspensión neumática y neumáticos de competición.',
      badge: 'MOTOR & GARAJE'
    },
    schemaType: 'Article',
    content: {
      leadText: 'La pasión por el motor en Florida se traslada a GTA 6 con un sistema de física de neumáticos que calcula la adherencia según la temperatura del asfalto y la lluvia tropical.',
      sections: [
        {
          heading: 'Cockpits interactivos en primera persona',
          paragraphs: [
            'Los espejos retrovisores cuentan con reflejos en tiempo real y las pantallas de navegación muestran el tráfico real de la ciudad.'
          ]
        }
      ]
    },
    relatedSlugs: ['mecanicas-de-gameplay-de-gta-6-sistema-de-cobertura-fisicas-de-armas-y-agarre-en-vehiculos']
  },
  {
    id: 'art-gta6-08',
    slug: 'armas-de-gta-6-balistica-realista-penetracion-de-coberturas-y-rueda-de-equipo',
    title: 'Armas de GTA 6: Balística realista, penetración de coberturas y rueda de equipo',
    seoTitle: 'Armamento de GTA 6: Fusiles, Pistolas y Modificaciones | KAIROSION',
    seoDescription: 'Descubre el arsenal de GTA VI: balística de precisión, accesorios tácticos y limitación de carga en el maletero del vehículo.',
    excerpt: 'El combate armado se vuelve más táctico con calibres basados en física real y gestión de inventario limitada.',
    category: 'gta-6',
    subcategorySlug: 'armas',
    categoryLabel: 'GTA 6 · Armas',
    verificationType: 'oficial',
    author: {
      name: 'Tomás Garrido',
      role: 'Editor de Armamento',
      avatar: '/images/Personajes/Jason_Duval_01.webp'
    },
    publishedAt: '2026-09-22T09:00:00Z',
    updatedAt: '2026-09-27T19:00:00Z',
    readTimeMinutes: 6,
    tags: ['Armas', 'Balística', 'Arsenal', 'Combate', 'GTA 6'],
    featuredImage: {
      url: '/images/Armas/ULTIMATE_EDITION_HAWK_AND_LITTLE_MORGAN_REVOLVERS_01.webp',
      alt: 'Mesa de armero con piezas y miras holográficas',
      caption: 'Cada arma equipada aporta peso físico que altera la velocidad de movimiento y retroceso.',
      badge: 'ARSENAL TÁCTICO'
    },
    schemaType: 'TechArticle',
    content: {
      leadText: 'Se terminaron los inventarios infinitos. En GTA 6, portar armas largas a pie es visible para la policía, obligando a los jugadores a guardar el armamento pesado en el maletero de sus coches.',
      sections: [
        {
          heading: 'Penetración balística en materiales',
          paragraphs: [
            'Los calibres pesados atraviesan tabiques ligeros de pladur, puertas de madera y cristales blindados tras impactos repetidos.'
          ]
        }
      ]
    },
    relatedSlugs: ['mecanicas-de-gameplay-de-gta-6-sistema-de-cobertura-fisicas-de-armas-y-agarre-en-vehiculos']
  },
  {
    id: 'art-gta6-09',
    slug: 'misiones-y-golpes-en-gta-6-planificacion-libre-y-asaltos-coordinados-en-pareja',
    title: 'Misiones y Golpes en GTA 6: Planificación libre y asaltos coordinados en pareja',
    seoTitle: 'Misiones y Asaltos en GTA 6: Sistema de Golpes Dinámicos | KAIROSION',
    seoDescription: 'Cómo funcionan las misiones principales y atracos en GTA VI: planificación de rutas, papeles coordinados y huida limpia.',
    excerpt: 'Los atracos en GTA 6 ofrecen múltiples vías de aproximación: sigilo absoluto, hackeo de seguridad o asalto frontal armado.',
    category: 'gta-6',
    subcategorySlug: 'misiones',
    categoryLabel: 'GTA 6 · Misiones',
    verificationType: 'oficial',
    author: {
      name: 'Marcos Valiente',
      role: 'Jefe de Redacción',
      avatar: '/images/Personajes/Brian_Heder_01.webp'
    },
    publishedAt: '2026-09-21T14:30:00Z',
    updatedAt: '2026-09-28T12:00:00Z',
    readTimeMinutes: 7,
    tags: ['Misiones', 'Golpes', 'Asaltos', 'GTA 6', 'Cooperativo'],
    featuredImage: {
      url: '/images/Personajes/Raul_Bautista_landscape.webp',
      alt: 'Plano táctico y diagramas de asalto a un banco de Vice City',
      caption: 'La fase de reconocimiento permite identificar cámaras, turnos de guardias y vías de escape.',
      badge: 'ESTRATEGIA DE ASALTO'
    },
    schemaType: 'Article',
    content: {
      leadText: 'A diferencia de las misiones lineales de GTA V, los golpes de GTA VI permiten improvisar sobre la marcha si salta una alarma o llega un furgón blindado no previsto.',
      sections: [
        {
          heading: 'Reparto de roles entre Lucia y Jason',
          paragraphs: [
            'Mientras un personaje intimida al gerente para abrir la cámara acorazada, el otro vigila el perímetro exterior y neutraliza llamadas al 911.'
          ]
        }
      ]
    },
    relatedSlugs: ['la-historia-de-gta-6-al-descubierto-trama-criminal-lealtad-y-el-prologo-carcelario']
  },
  {
    id: 'art-gta6-10',
    slug: 'actividades-de-leonida-deportes-nauticos-clubes-nocturnos-y-negocios-tapadera',
    title: 'Actividades de Leonida: Deportes náuticos, clubes nocturnos y negocios tapadera',
    seoTitle: 'Actividades y Minijuegos en GTA 6: Negocios y Ocio | KAIROSION',
    seoDescription: 'Descubre las actividades secundarias de GTA VI: pesca deportiva en alta mar, carreras clandestinas, compra de locales y golf.',
    excerpt: 'El descanso del criminal en Vice City: desde pilotar motos de agua en Vice Beach hasta gestionar blanqueo de capitales en lavanderías.',
    category: 'gta-6',
    subcategorySlug: 'actividades',
    categoryLabel: 'GTA 6 · Actividades',
    verificationType: 'oficial',
    author: {
      name: 'Elena Navarro',
      role: 'Analista de Gameplay',
      avatar: '/images/Personajes/Real_Dimez_04.webp'
    },
    publishedAt: '2026-09-20T16:00:00Z',
    updatedAt: '2026-09-27T15:00:00Z',
    readTimeMinutes: 6,
    tags: ['Actividades', 'Minijuegos', 'Negocios', 'Vice City', 'GTA 6'],
    featuredImage: {
      url: '/images/Personajes/Real_Dimez_landscape.webp',
      alt: 'Paseo de compras y locales de ocio nocturno en Vice Beach',
      caption: 'La economía de Leonida permite invertir los beneficios de atracos en negocios inmobiliarios y ocio.',
      badge: 'OCIO & ECONOMÍA'
    },
    schemaType: 'Article',
    content: {
      leadText: 'Leonida ofrece un catálogo de actividades que rivaliza con la vida real. La pesca de altura en los Cayos incluye simulación física de tensión de línea y más de 30 especies marinas.',
      sections: [
        {
          heading: 'Gestión de tapaderas comerciales',
          paragraphs: [
            'Comprar un taller de modificación o un club náutico permite lavar dinero negro y conseguir coartadas frente a inspecciones fiscales.'
          ]
        }
      ]
    },
    relatedSlugs: ['el-mundo-de-leonida-biomas-subtropicales-vida-salvaje-dinamica-y-clima-tropical']
  },
  {
    id: 'art-gta6-11',
    slug: 'secretos-y-easter-eggs-de-gta-6-misterios-submarinos-guinos-clasicos-y-conspiraciones',
    title: 'Secretos y Easter Eggs de GTA 6: Misterios submarinos, guiños clásicos y conspiraciones',
    seoTitle: 'Secretos y Easter Eggs de GTA 6: Misterios Ocultos | KAIROSION',
    seoDescription: 'Los secretos más fascinantes descubiertos en GTA VI: referencias a Tommy Vercetti, pecios hundidos en los Cayos y fenómenos extraños.',
    excerpt: 'Analizamos los misterios más profundos del mapa de Leonida: conspiraciones gubernamentales, fosas abisales y guiños a la saga clásica.',
    category: 'gta-6',
    subcategorySlug: 'secretos',
    categoryLabel: 'GTA 6 · Secretos',
    verificationType: 'rumor-verificado',
    author: {
      name: 'Tomás Garrido',
      role: 'Editor de Lore',
      avatar: '/images/Personajes/Jason_Duval_01.webp'
    },
    publishedAt: '2026-09-19T18:00:00Z',
    updatedAt: '2026-09-29T12:00:00Z',
    readTimeMinutes: 8,
    tags: ['Secretos', 'Easter Eggs', 'Misterios', 'Vice City', 'GTA 6'],
    featuredImage: {
      url: '/images/Lugares_y_Mapas/Mount_Kalaga_National_Park_Postcard_landscape.webp',
      alt: 'Buceador explorando un pecio sumergido en las costas de Leonida',
      caption: 'Las profundidades marinas ocultan cargamentos de contrabando de los años 80 y misterios sin resolver.',
      badge: 'MISTERIOS OCULTOS'
    },
    schemaType: 'Article',
    content: {
      leadText: 'Rockstar Games es célebre por sembrar sus mundos con enigmas que tardan años en ser resueltos. En Leonida, las aguas cristalinas esconden búnkeres de la Guerra Fría y barcos piratas del siglo XVIII.',
      sections: [
        {
          heading: 'El enigma de la mansión Vercetti',
          paragraphs: [
            'En Starfish Island se hallan documentos históricos que narran el ascenso y caída del imperio delictivo fundado por Tommy Vercetti en 1986.'
          ]
        }
      ]
    },
    relatedSlugs: ['gta-6-al-detalle-todo-sobre-el-desarrollo-motor-rage-9-y-salto-generacional']
  },

  // =========================================================================
  // CATEGORIA 2: NOTICIAS (Noticias de GTA 6 y Rockstar Games)
  // =========================================================================
  ...NEWS_GTA6_ARTICLES,
  ...NEWS_ROCKSTAR_ARTICLES,
  {
    id: 'art-not-01',
    slug: 'grand-theft-auto-vi-todo-lo-confirmado-sobre-fecha-de-lanzamiento-plataformas-y-leonida',
    title: 'Grand Theft Auto VI: Todo lo confirmado sobre fecha de lanzamiento, plataformas y Leonida',
    seoTitle: 'GTA 6: Fecha de Lanzamiento, Plataformas y Novedades de Leonida | KAIROSION',
    seoDescription: 'Descubre todos los detalles confirmados de Grand Theft Auto VI: lanzamiento en PS5 y Xbox Series X|S, ambientación en Leonida y mecánicas.',
    excerpt: 'Rockstar Games prepara su obra más ambiciosa hasta la fecha. Analizamos punto por punto cada dato oficial, tráilers desglosados y plataformas.',
    category: 'noticias',
    subcategorySlug: 'lanzamiento',
    categoryLabel: 'Noticias · Lanzamiento',
    verificationType: 'oficial',
    author: {
      name: 'Marcos Valiente',
      role: 'Jefe de Redacción',
      avatar: '/images/Personajes/Brian_Heder_01.webp'
    },
    publishedAt: '2026-09-28T14:30:00Z',
    updatedAt: '2026-09-29T18:00:00Z',
    readTimeMinutes: 7,
    tags: ['GTA 6', 'Rockstar Games', 'Vice City', 'Leonida', 'PS5', 'Xbox Series X'],
    isHero: true,
    isTrending: true,
    isLatest: true,
    featuredImage: {
      url: '/images/Artes_y_Ediciones/ULTIMATE_EDITION_01.webp',
      alt: 'Vista aérea nocturna de Ocean Drive en Vice City con luces de neón',
      caption: 'El icónico paseo marítimo de Vice Beach recreado con iluminación volumétrica.',
      badge: 'REPORTAJE OFICIAL'
    },
    youtubeVideoId: 'QdBZY2fkU-0',
    schemaType: 'NewsArticle',
    content: {
      leadText: 'Tras una década de espera desde el debut de GTA V, Rockstar Games vuelve a redefinir el estándar del género sandbox con Grand Theft Auto VI.',
      sections: [
        {
          heading: 'Plataformas de lanzamiento confirmadas',
          paragraphs: [
            'Take-Two Interactive ha confirmado el estreno en PS5 y Xbox Series X|S, con versión para PC proyectada para una ventana posterior.'
          ]
        }
      ]
    },
    relatedSlugs: ['gta-6-al-detalle-todo-sobre-el-desarrollo-motor-rage-9-y-salto-generacional']
  },
  {
    id: 'art-not-02',
    slug: 'rockstar-games-emite-comunicado-sobre-los-ultimos-meses-de-desarrollo-de-gta-vi',
    title: 'Rockstar Games emite comunicado sobre los últimos meses de desarrollo de GTA VI',
    seoTitle: 'Comunicado Oficial Rockstar Games sobre GTA 6 | KAIROSION',
    seoDescription: 'Declaraciones de los directores creativos de Rockstar Games sobre el pulido final de Grand Theft Auto VI y la experiencia de usuario.',
    excerpt: 'El estudio detalla las fases finales de control de calidad y optimización del motor RAGE 9 para asegurar una tasa de cuadros estable.',
    category: 'noticias',
    subcategorySlug: 'rockstar-games',
    categoryLabel: 'Noticias · Rockstar Games',
    verificationType: 'oficial',
    author: {
      name: 'Marcos Valiente',
      role: 'Jefe de Redacción',
      avatar: '/images/Personajes/Brian_Heder_01.webp'
    },
    publishedAt: '2026-09-27T18:00:00Z',
    updatedAt: '2026-09-29T10:00:00Z',
    readTimeMinutes: 5,
    tags: ['Rockstar Games', 'Noticias', 'GTA 6', 'Desarrollo'],
    isLatest: true,
    featuredImage: {
      url: '/images/Artes_y_Ediciones/Official_Cover_Art_landscape.webp',
      alt: 'Logotipo de Rockstar Games en pantalla de estudio',
      caption: 'Los equipos de Edimburgo y Nueva York ultiman el balanceo de las misiones.',
      badge: 'COMUNICADO OFICIAL'
    },
    schemaType: 'NewsArticle',
    content: {
      leadText: 'El comunicado agradece la paciencia de la comunidad global y destaca el compromiso de entregar una experiencia libre de compromisos.',
      sections: [
        {
          heading: 'Fase de optimización técnica',
          paragraphs: [
            'Los ingenieros de software se centran en maximizar el rendimiento con trazado de rayos activo en ambas consolas de actual generación.'
          ]
        }
      ]
    },
    relatedSlugs: ['grand-theft-auto-vi-todo-lo-confirmado-sobre-fecha-de-lanzamiento-plataformas-y-leonida']
  },

  // =========================================================================
  // CATEGORIA 3: GUIAS
  // =========================================================================
  {
    id: 'art-guias-01',
    slug: 'guia-de-inicio-en-vice-city-10-consejos-cruciales-antes-de-dar-tu-primer-golpe',
    title: 'Guía de inicio en Vice City: 10 consejos cruciales antes de dar tu primer golpe',
    seoTitle: 'Guía GTA 6 para Principiantes: Consejos y Supervivencia | KAIROSION',
    seoDescription: 'Aprende cómo dominar las calles de Vice City: gestión de inventario en maletero, evasión de patrullas y compras tácticas.',
    excerpt: 'Sobrevivir en el estado de Leonida exige mucho más que saber disparar. Esta guía detallada te enseña a gestionar tu botín y recursos.',
    category: 'guias',
    subcategorySlug: 'principiantes',
    categoryLabel: 'Guías · Principiantes',
    verificationType: 'guia-estrategica',
    author: {
      name: 'Elena Navarro',
      role: 'Editora de Guías',
      avatar: '/images/Personajes/Real_Dimez_04.webp'
    },
    publishedAt: '2026-09-27T10:15:00Z',
    updatedAt: '2026-09-29T16:20:00Z',
    readTimeMinutes: 9,
    tags: ['Guías', 'GTA 6', 'Vice City', 'Consejos', 'Misiones', 'Dinero'],
    isTrending: true,
    isLatest: true,
    difficulty: 'Principiante',
    estimatedTime: '25 min de lectura',
    featuredImage: {
      url: '/images/Lugares_y_Mapas/Vice_City_Postcard_landscape.webp',
      alt: 'Protagonista equipando armamento frente al maletero de un coche',
      caption: 'El maletero del vehículo personal actúa como armero móvil y almacenamiento.',
      badge: 'GUÍA COMPLETA'
    },
    schemaType: 'Article',
    content: {
      leadText: 'La ciudad de Vice City premia la audacia pero castiga la improvisación. Esta guía reúne los consejos esenciales para tus primeras 10 horas de juego.',
      sections: [
        {
          heading: '1. El maletero del coche: Tu base móvil',
          paragraphs: [
            'En GTA VI sólo puedes llevar dos armas largas en la espalda. Guarda fusiles de asalto y escopetas en el maletero de tu coche antes de cada asalto.'
          ]
        }
      ]
    },
    relatedSlugs: ['armas-de-gta-6-balistica-realista-penetracion-de-coberturas-y-rueda-de-equipo']
  },

  // =========================================================================
  // CATEGORIA 4: TRUCOS Y CONSEJOS
  // =========================================================================
  {
    id: 'art-trucos-01',
    slug: 'manual-de-huida-policial-como-eludir-patrullas-y-sobrevivir-a-las-6-estrellas-en-leonida',
    title: 'Manual de Huida Policial: Cómo eludir patrullas y sobrevivir a las 6 estrellas en Leonida',
    seoTitle: 'Policía en GTA 6: Sistema de 6 Estrellas y Consejos de Fuga | KAIROSION',
    seoDescription: 'Manual exhaustivo sobre el nuevo sistema policial de GTA VI: 6 niveles de búsqueda, helicópteros térmicos y bloqueos viales.',
    excerpt: 'La policía de Vice City ya no aparece de la nada. Descubre cómo las patrullas coordinan cercos por radio y cómo eludir patrullas de élite.',
    category: 'trucos-consejos',
    subcategorySlug: 'supervivencia',
    categoryLabel: 'Trucos y Consejos · Supervivencia',
    verificationType: 'truco-rapido',
    author: {
      name: 'Marcos Valiente',
      role: 'Jefe de Redacción',
      avatar: '/images/Personajes/Brian_Heder_01.webp'
    },
    publishedAt: '2026-09-22T09:00:00Z',
    updatedAt: '2026-09-29T11:00:00Z',
    readTimeMinutes: 8,
    tags: ['Policía', 'Manuales', 'Estrellas', 'Vice City', 'Leonida', 'Fuga'],
    difficulty: 'Avanzado',
    featuredImage: {
      url: '/images/Personajes/Brian_Heder_landscape.webp',
      alt: 'Coche patrulla policial con sirenas encendidas en una intersección',
      caption: 'Las patrullas de Leonida establecen perímetros de contención en puentes y peajes.',
      badge: 'TÁCTICAS DE FUGA'
    },
    schemaType: 'TechArticle',
    content: {
      leadText: 'El sistema policial obedece a líneas de visión lógicas, tiempos de desplazamiento físicos y comunicación por radio entre unidades.',
      sections: [
        {
          heading: 'Evasión de helicópteros con visión nocturna',
          paragraphs: [
            'Ocultarse bajo puentes de autopista o en aparcamientos subterráneos enfría la señal térmica de tu vehículo.'
          ]
        }
      ]
    },
    relatedSlugs: ['guia-de-inicio-en-vice-city-10-consejos-cruciales-antes-de-dar-tu-primer-golpe']
  },

  // =========================================================================
    ...TIPS_ARTICLES,

  // CATEGORIA 5: PERSONAJES (21 Dossiers de personajes de Leonida)
  // =========================================================================
  ...CHARACTER_ARTICLES,

  // =========================================================================
  // CATEGORIA 6: MAPA (Guías de Localizaciones y Distritos de Leonida)
  // =========================================================================
  ...LOCATION_ARTICLES,
  {
    id: 'art-mapa-01',
    slug: 'analisis-del-mapa-de-leonida-vice-city-port-gellhorn-ambrosia-y-los-cayos',
    title: 'Análisis del mapa de Leonida: Vice City, Port Gellhorn, Ambrosia y los Cayos',
    seoTitle: 'Mapa de GTA 6: Distritos de Leonida, Ciudades y Rutas | KAIROSION',
    seoDescription: 'Exploramos el mapa completo de Leonida en Grand Theft Auto VI: Vice City, Port Gellhorn, pantanos de Grassrivers y los Cayos.',
    excerpt: 'Desglosamos la geografía del estado de Leonida: desde el lujo de Vice Beach hasta el óxido de Port Gellhorn y la inmensidad de los pantanos.',
    category: 'mapa',
    subcategorySlug: 'vice-city',
    categoryLabel: 'Mapa & Mundo',
    verificationType: 'oficial',
    author: {
      name: 'Marcos Valiente',
      role: 'Jefe de Redacción',
      avatar: '/images/Personajes/Brian_Heder_01.webp'
    },
    publishedAt: '2026-09-25T15:00:00Z',
    updatedAt: '2026-09-29T09:30:00Z',
    readTimeMinutes: 8,
    tags: ['Mapa', 'Leonida', 'Vice City', 'Port Gellhorn', 'Cayos', 'Exploración'],
    isTrending: true,
    featuredImage: {
      url: '/images/Lugares_y_Mapas/Port_Gellhorn_Postcard_landscape.webp',
      alt: 'Vista cartográfica del estado de Leonida',
      caption: 'El mapa de Leonida combina metrópolis densas con biomas de marismas y archipiélagos.',
      badge: 'CARTOGRAFÍA OFICIAL'
    },
    schemaType: 'Article',
    content: {
      leadText: 'La escala de Leonida no se mide sólo en kilómetros, sino en densidad vertical y variedad biogeográfica.',
      sections: [
        {
          heading: 'Vice City Metropolitana y sus 5 distritos',
          paragraphs: [
            'Vice Beach, Downtown, Little Haiti, Starfish Island y Vice Port conforman el corazón neurálgico del estado.'
          ]
        }
      ]
    },
    relatedSlugs: ['el-mundo-de-leonida-biomas-subtropicales-vida-salvaje-dinamica-y-clima-tropical']
  },

  // =========================================================================
  // CATEGORIA 7: VEHICULOS (Transporte Terrestre, Aéreo y Marítimo)
  // =========================================================================
  ...VEHICLE_ARTICLES,
  {
    id: 'art-veh-legacy-01',
    slug: 'catalogo-completo-de-vehiculos-en-gta-6-superdeportivos-lanchas-rapidas-y-customizacion',
    title: 'Catálogo completo de vehículos en GTA 6: Superdeportivos, lanchas rápidas y customización',
    seoTitle: 'Vehículos en GTA 6: Lista de Coches, Motos y Tuning | KAIROSION',
    seoDescription: 'Base de datos completa de vehículos confirmados en GTA VI: Grotti, Pegassi, Bravado, lanchas y nuevo sistema de físicas.',
    excerpt: 'El garaje de Leonida supera todo lo visto en la saga. Analizamos las marcas confirmadas y las opciones de tuneo interior.',
    category: 'vehiculos',
    subcategorySlug: 'coches',
    categoryLabel: 'Vehículos · Catálogo',
    verificationType: 'oficial',
    author: {
      name: 'Elena Navarro',
      role: 'Analista de Gameplay',
      avatar: '/images/Personajes/Real_Dimez_04.webp'
    },
    publishedAt: '2026-09-24T12:00:00Z',
    updatedAt: '2026-09-29T14:15:00Z',
    readTimeMinutes: 7,
    tags: ['Vehículos', 'Coches', 'Superdeportivos', 'Tuning', 'Vice City'],
    featuredImage: {
      url: '/images/Vehiculos/ULTIMATE_EDITION_SQUALO_01.webp',
      alt: 'Superdeportivo Grotti estacionado en el paseo de Vice Beach',
      caption: 'La personalización incluye ajustes de suspensión neumática y tapicería interior.',
      badge: 'MOTOR & GARAJE'
    },
    schemaType: 'Article',
    content: {
      leadText: 'Desde los clásicos lowriders hasta los hiperdeportivos exóticos, cada vehículo cuenta con físicas de suspensión individualizadas.',
      sections: [
        {
          heading: 'Marcas emblemáticas confirmadas',
          paragraphs: [
            'Grotti, Pegassi, Bravado, Declasse y Pfister regresan con modelos rediseñados y cockpits totalmente interactivos.'
          ]
        }
      ]
    },
    relatedSlugs: ['vehiculos-en-gta-6-catalogo-de-superdeportivos-lanchas-rapidas-y-telemetria']
  },

  // =========================================================================
  // CATEGORIA 8: ARMAS (Pistolas, Fusiles, Escopetas, Subfusiles, Francotiradores, etc.)
  // =========================================================================
  ...WEAPON_ARTICLES,
  {
    id: 'art-arm-legacy-01',
    slug: 'sistema-de-armamento-y-rueda-de-inventario-balistica-realista-y-personalizacion-tactica',
    title: 'Sistema de armamento y rueda de inventario: Balística realista y personalización táctica',
    seoTitle: 'Armas en GTA 6: Arsenal, Accesorios y Balística | KAIROSION',
    seoDescription: 'Guía del arsenal de GTA VI: pistolas tácticas, fusiles de asalto, silenciadores y penetración de balas en coberturas.',
    excerpt: 'El combate armado da un salto de realismo con balística basada en física, penetración de materiales y accesorios modulares.',
    category: 'armas',
    subcategorySlug: 'fusiles',
    categoryLabel: 'Armas · Arsenal',
    verificationType: 'oficial',
    author: {
      name: 'Tomás Garrido',
      role: 'Editor de Armamento',
      avatar: '/images/Personajes/Jason_Duval_01.webp'
    },
    publishedAt: '2026-09-23T11:30:00Z',
    updatedAt: '2026-09-28T16:00:00Z',
    readTimeMinutes: 6,
    tags: ['Armas', 'Balística', 'Combate', 'Guías', 'GTA 6'],
    featuredImage: {
      url: '/images/Armas/ULTIMATE_EDITION_WEAPON_VARIANTS_01.webp',
      alt: 'Mesa de armero con fusiles desmontados y cajas de munición',
      caption: 'Los accesorios como supresores y miras térmicas modifican el retroceso y alcance efectivo.',
      badge: 'ARSENAL & EQUIPO'
    },
    schemaType: 'TechArticle',
    content: {
      leadText: 'El sistema de tiroteos de GTA 6 recoge lo mejor de Max Payne 3 adaptándolo a un contexto urbano moderno con armas de fuego de última generación.',
      sections: [
        {
          heading: 'Rueda de inventario táctico',
          paragraphs: [
            'Cada arma portada genera peso físico que afecta a la velocidad de esprint y al tiempo de apuntado.'
          ]
        }
      ]
    },
    relatedSlugs: ['armas-de-gta-6-balistica-realista-penetracion-de-coberturas-y-rueda-de-equipo']
  },

  // =========================================================================
  // CATEGORIA 9: MÚSICA & RADIO (Banda Sonora, Emisoras de Radio y Álbum Oficial)
  // =========================================================================
  ...MUSIC_ARTICLES,

  // =========================================================================
  // CATEGORIA 10: ROCKSTAR GAMES
  // =========================================================================
  {
    id: 'art-rs-01',
    slug: 'take-two-interactive-actualiza-sus-previsiones-para-inversores-y-reitera-ventana-de-gta-vi',
    title: 'Take-Two Interactive actualiza sus previsiones para inversores y reitera ventana de GTA VI',
    seoTitle: 'Take-Two Informe Financiero: GTA 6 y Previsiones Récord | KAIROSION',
    seoDescription: 'Análisis del informe para accionistas de Take-Two Interactive: inversiones en marketing para Leonida y proyecciones de ingresos.',
    excerpt: 'El consejero delegado Strauss Zelnick ratifica ante Wall Street los objetivos multimillonarios vinculados al lanzamiento de Grand Theft Auto VI.',
    category: 'rockstar-games',
    subcategorySlug: 'noticias-rockstar',
    categoryLabel: 'Rockstar Games · Corporativo',
    verificationType: 'oficial',
    author: {
      name: 'Marcos Valiente',
      role: 'Jefe de Redacción',
      avatar: '/images/Personajes/Brian_Heder_01.webp'
    },
    publishedAt: '2026-09-18T16:00:00Z',
    updatedAt: '2026-09-29T10:00:00Z',
    readTimeMinutes: 5,
    tags: ['Take-Two', 'Rockstar Games', 'Finanzas', 'Lanzamiento', 'Industria'],
    isLatest: true,
    featuredImage: {
      url: '/images/Artes_y_Ediciones/VINTAGE_VICE_CITY_PACK_01.webp',
      alt: 'Sede corporativa y gráficos financieros de Take-Two',
      caption: 'Take-Two proyecta ingresos récord en su ejercicio fiscal impulsados por GTA VI.',
      badge: 'INFORME CORPORATIVO'
    },
    schemaType: 'NewsArticle',
    content: {
      leadText: 'Durante la última conferencia de accionistas, Take-Two Interactive ofreció un panorama optimista sobre los hitos de producción alcanzados por Rockstar Games.',
      sections: [
        {
          heading: 'Confianza absoluta en el calendario comercial',
          paragraphs: [
            'Los directores ejecutivos recalcaron que los equipos continúan puliendo la experiencia jugable para superar las expectativas globales.'
          ]
        }
      ]
    },
    relatedSlugs: ['grand-theft-auto-vi-todo-lo-confirmado-sobre-fecha-de-lanzamiento-plataformas-y-leonida']
  }
];
