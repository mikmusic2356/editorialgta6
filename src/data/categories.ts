import { MainCategory } from '../types';

export const MAIN_CATEGORIES: MainCategory[] = [
  {
    slug: 'gta-6',
    name: 'GTA 6',
    shortDesc: 'Super Categoría y Conector Central: Acceso directo a todas las secciones, expedientes y bases de datos de Leonida.',
    tagline: 'Super Categoría · Hub Conector del Universo GTA VI',
    color: '#f43f5e',
    iconName: 'Flame',
    subcategories: [
      { slug: 'personajes', name: 'Personajes & Dossiers', description: 'Lucia, Jason y los 21 personajes secundarios del bajo mundo.' },
      { slug: 'mapa', name: 'Mapa y Mundo (Leonida)', description: 'Vice City, distritos, cayos, pantanos y puntos de interés.' },
      { slug: 'vehiculos', name: 'Vehículos & Motores', description: 'Superdeportivos, lanchas, aviación y fichas de telemetría.' },
      { slug: 'armas', name: 'Armas & Balística', description: 'Arsenal completo, pistolas, fusiles, mods y ruedas de equipo.' },
      { slug: 'noticias', name: 'Noticias & Novedades', description: 'Actualidad directa, comunicados oficiales de Rockstar y fechas.' },
      { slug: 'guias', name: 'Guías & Walkthroughs', description: 'Estrategias paso a paso, misiones, dinero y coleccionables.' },
      { slug: 'trucos-consejos', name: 'Trucos y Consejos', description: 'Atajos tácticos, combate, conducción y supervivencia.' },
      { slug: 'musica', name: 'Música & Radio', description: 'Banda sonora oficial, diales de emisoras in-game y vinilos.' },
      { slug: 'rockstar-games', name: 'Rockstar Games & RAGE', description: 'Tecnología RAGE 9, patentes, Take-Two y desarrollo.' }
    ]
  },
  {
    slug: 'noticias',
    name: 'Noticias',
    shortDesc: 'Actualidad editorial rigurosa, comunicados oficiales y novedades.',
    tagline: 'Información verificada al instante',
    color: '#e11d48',
    iconName: 'Newspaper',
    subcategories: [
      { slug: 'gta-6', name: 'Noticias GTA 6', description: 'Actualidad directa sobre el juego.' },
      { slug: 'rockstar-games', name: 'Rockstar Games', description: 'Comunicados y movimientos de la compañía.' },
      { slug: 'actualizaciones', name: 'Actualizaciones', description: 'Novedades de desarrollo y versiones.' },
      { slug: 'lanzamiento', name: 'Lanzamiento & Plataformas', description: 'Fechas, PS5, Xbox Series y PC.' },
      { slug: 'comunidad', name: 'Comunidad & Análisis', description: 'Acontecimientos relevantes de la comunidad.' }
    ]
  },
  {
    slug: 'guias',
    name: 'Guías',
    shortDesc: 'Walkthroughs completos paso a paso para completar y conseguir objetivos.',
    tagline: 'Tutoriales exhaustivos para dominar cada reto',
    color: '#06b6d4',
    iconName: 'Compass',
    subcategories: [
      { slug: 'guias-misiones', name: 'Guías de Misiones', description: 'Cómo superar asaltos y golpes principales.' },
      { slug: 'guias-personajes', name: 'Guías de Personajes', description: 'Desbloqueo de habilidades y química de pareja.' },
      { slug: 'guias-vehiculos', name: 'Guías de Vehículos', description: 'Cómo encontrar y tunear los mejores coches.' },
      { slug: 'guias-armas', name: 'Guías de Armas', description: 'Dónde conseguir armamento militar y piezas únicas.' },
      { slug: 'guias-mapa', name: 'Guías del Mapa', description: 'Rutas seguras, atajos y puntos clave.' },
      { slug: 'coleccionables', name: 'Coleccionables', description: 'Localización del 100% de coleccionables.' },
      { slug: 'secretos', name: 'Secretos & Huevos de Pascua', description: 'Pasos para activar misterios ocultos.' },
      { slug: 'dinero', name: 'Dinero & Economía', description: 'Métodos para generar millones rápidamente.' },
      { slug: 'actividades', name: 'Actividades & Negocios', description: 'Gestión de tapaderas comerciales.' },
      { slug: 'progresion', name: 'Progresión', description: 'Optimización de estadísticas y recursos.' },
      { slug: 'principiantes', name: 'Principiantes', description: 'Primeros pasos en Vice City sin morir.' }
    ]
  },
  {
    slug: 'trucos-consejos',
    name: 'Trucos y Consejos',
    shortDesc: 'Recomendaciones prácticas, atajos y técnicas para jugar mejor.',
    tagline: 'Consejos rápidos de combate, conducción y supervivencia',
    color: '#10b981',
    iconName: 'Sparkles',
    subcategories: [
      { slug: 'trucos', name: 'Trucos', description: 'Códigos y combinaciones clásicas.' },
      { slug: 'consejos-rapidos', name: 'Consejos Rápidos', description: 'Tips de utilidad inmediata para el día a día.' },
      { slug: 'consejos-principiantes', name: 'Para Principiantes', description: 'Errores comunes que debes evitar.' },
      { slug: 'gameplay', name: 'Mecánicas Jugables', description: 'Atajos de control y combinaciones tácticas.' },
      { slug: 'combate', name: 'Combate & Tiroteos', description: 'Técnicas de cobertura y apuntado rápido.' },
      { slug: 'conduccion', name: 'Conducción & Derrapes', description: 'Control de curvas y evasión en autopista.' },
      { slug: 'exploracion', name: 'Exploración Segura', description: 'Cómo cruzar los pantanos de noche.' },
      { slug: 'dinero', name: 'Dinero Fácil', description: 'Puntos de botín recurrente en tiendas.' },
      { slug: 'supervivencia', name: 'Supervivencia', description: 'Cómo eludir patrullas de 6 estrellas.' },
      { slug: 'secretos', name: 'Secretos Rápidos', description: 'Curiosidades descubiertas en el mapa.' }
    ]
  },
  {
    slug: 'personajes',
    name: 'Personajes',
    shortDesc: 'Dossiers individuales, biografías, facciones y relaciones de Leonida.',
    tagline: 'Expedientes de Lucia, Jason y el bajo mundo',
    color: '#ec4899',
    iconName: 'Users',
    subcategories: [
      { slug: 'lucia-caminos', name: 'Lucia Caminos', description: 'Biografía, origen, historial penal y habilidades de Lucia.' },
      { slug: 'jason-duval', name: 'Jason Duval', description: 'Historia, pasado militar, armamento y química de pareja con Lucia.' },
      { slug: 'agente-menddees', name: 'Agente Menddees', description: 'Comandante policial corrupto y conexiones en Vice City.' },
      { slug: 'andreas-deleo', name: 'Andreas Deleó', description: 'CEO de Megamundo, magnate corporativo y cliente VIP.' },
      { slug: 'boobie-ike', name: 'Boobie Ike', description: 'Magnate de la noche, dueño del club Jack of Hearts y Only Raw Records.' },
      { slug: 'brian-heder', name: 'Brian Heder', description: 'Mentor, contrabandista veterano y aliado en los Cayos de Leonida.' },
      { slug: 'cal-hampton', name: 'Cal Hampton', description: 'Aliado paranoico de los Cayos, experto en vigilancia y conspiraciones.' },
      { slug: 'donnie', name: 'Donnie', description: 'Criminal salvaje y figura caótica de los Cayos.' },
      { slug: 'dracoin-rayquan', name: 'Dracoin / Rayquan', description: 'Contacto de ocio urbano y escena musical en Vice City.' },
      { slug: 'drequan-priest', name: 'Dre\'Quan Priest', description: 'Productor musical de hip-hop y cofundador de Only Raw Records.' },
      { slug: 'el-abogado-del-contenedor', name: 'El Abogado del Contenedor', description: 'Jurista estrafalario de encuentros aleatorios en Vice City.' },
      { slug: 'el-streamer-del-trunk-challenge', name: 'El Streamer del Trunk Challenge', description: 'Influencer viral y creador de desafíos en vivo en Leonida.' },
      { slug: 'ernesto', name: 'Ernesto', description: 'Contacto logístico del transporte de narcóticos en Leonida.' },
      { slug: 'jimmy-kanto', name: 'Jimmy Kanto', description: 'Amigo de infancia de Brian Heder y lección del pasado.' },
      { slug: 'la-mujer-de-los-martillos', name: 'La Mujer de los Martillos', description: 'Evento aleatorio viral de Hamlet con ataques a vehículos.' },
      { slug: 'lorie', name: 'Lorie', description: 'Esposa de Brian Heder y contacto social en los Cayos.' },
      { slug: 'petra', name: 'Petra', description: 'Figura de la alta sociedad y esposa del magnate Andreas Deleó.' },
      { slug: 'propietaria-piso-franco', name: 'Propietaria del Piso Franco', description: 'Amiga de Lucia y dueña del departamento de seguridad en Vice City.' },
      { slug: 'raul-bautista', name: 'Raul Bautista', description: 'Atracador profesional de bancos y ex-agente de inteligencia.' },
      { slug: 'real-dimez', name: 'Real Dimez', description: 'Dúo musical urbano formado por Bae-Luxe y Roxy en Vice City.' },
      { slug: 'val', name: 'Val', description: 'Intermediaria ejecutiva y gestora de seguridad corporativa.' }
    ]
  },
  {
    slug: 'mapa',
    name: 'Mapa y Mundo',
    shortDesc: 'Geografía del estado de Leonida: distritos, costas, pantanos y cayos.',
    tagline: 'Exploración cartográfica interactiva',
    color: '#3b82f6',
    iconName: 'MapPin',
    subcategories: [
      { slug: 'localizaciones', name: 'Localizaciones', description: 'Todos los lugares registrados del mapa de Leonida.' },
      { slug: 'mapa-completo', name: 'Mapa Completo', description: 'Visión general de las fronteras de Leonida.' },
      { slug: 'vice-city', name: 'Vice City', description: 'Vice Beach, Downtown, Little Haiti y Puerto.' },
      { slug: 'lugares-secretos', name: 'Lugares Ocultos', description: 'Búnkeres subterráneos e islas vírgenes.' },
      { slug: 'actividades-mapa', name: 'Actividades por Zona', description: 'Eventos dinámicos en cada comarca.' },
      { slug: 'secretos-mundo', name: 'Misterios Geográficos', description: 'Fosas marinas y yacimientos.' },
      { slug: 'exploracion', name: 'Guía de Exploración', description: 'Rutas todoterreno y vías fluviales.' }
    ]
  },
  {
    slug: 'vehiculos',
    name: 'Vehículos',
    shortDesc: 'Catálogo automovilístico, náutico y aéreo con fichas técnicas.',
    tagline: 'Base de datos de superdeportivos, lanchas y motos',
    color: '#f59e0b',
    iconName: 'Car',
    subcategories: [
      { slug: 'transporte-terrestre', name: 'Transporte Terrestre', description: 'Superdeportivos, muscle cars, sedanes, SUVs, motocicletas, quads y camiones.' },
      { slug: 'transporte-aereo', name: 'Transporte Aéreo', description: 'Helicópteros, hidroaviones, avionetas ligeras y jets comerciales.' },
      { slug: 'transporte-maritimo', name: 'Transporte Marítimo', description: 'Hidrodeslizadores, lanchas de velocidad, motos acuáticas y yates de lujo.' },
      { slug: 'coches', name: 'Coches & Superdeportivos', description: 'Grotti, Pegassi, Bravado y tuning.' },
      { slug: 'motos', name: 'Motos & Quads', description: 'Motos deportivas, choppers y motocross.' },
      { slug: 'barcos', name: 'Barcos & Lanchas', description: 'Hidrodeslizadores, yates y motos de agua.' },
      { slug: 'aviones', name: 'Aviones & Helicópteros', description: 'Jets privados y avionetas de fumigación.' }
    ]
  },
  {
    slug: 'armas',
    name: 'Armas',
    shortDesc: 'Arsenal militar, accesorios tácticos, balística y ruedas de equipo.',
    tagline: 'Estadísticas de daño, cadencia y personalización',
    color: '#ef4444',
    iconName: 'Crosshair',
    subcategories: [
      { slug: 'pistolas', name: 'Pistolas & Revólveres', description: 'Armas cortas para tiroteos a corta distancia y portes ocultos.' },
      { slug: 'fusiles', name: 'Fusiles de Asalto', description: 'Carabinas tácticas y cadencia equilibrada para asaltos urbanos.' },
      { slug: 'subfusiles', name: 'Subfusiles & SMG', description: 'Armas automáticas compactas de alta cadencia para espacios cerrados.' },
      { slug: 'escopetas', name: 'Escopetas', description: 'Poder de parada masivo y dispersión de perdigones a corta distancia.' },
      { slug: 'francotiradores', name: 'Rifles de Francotirador', description: 'Fusiles de precisión de largo alcance y cerrojo.' },
      { slug: 'cuerpo-a-cuerpo', name: 'Cuerpo a Cuerpo', description: 'Bates, cuchillos tácticos, martillos y boxeo callejero.' },
      { slug: 'explosivos', name: 'Explosivos & Arrojadizas', description: 'C4 adhesivo, cócteles molotov y granadas de fragmentación.' },
      { slug: 'sistema-armamento', name: 'Sistema de Armamento', description: 'Mecánicas de rueda de equipo, inventario táctico y balística.' },
      { slug: 'otras-armas', name: 'Tirador Selecto / Especiales', description: 'Armamento pesado y visores térmicos.' }
    ]
  },
  {
    slug: 'musica',
    name: 'Música & Radio',
    shortDesc: 'Banda sonora oficial, dial de emisoras de radio in-game y GTA VI: The Album.',
    tagline: 'La revolución musical y sonora de Vice City',
    color: '#8b5cf6',
    iconName: 'Music',
    subcategories: [
      { slug: 'banda-sonora', name: 'Banda Sonora', description: 'Curaduría musical, score interactivo y canciones de los tráilers.' },
      { slug: 'emisoras-radio', name: 'Emisoras de Radio', description: 'Estaciones de radio, CircoLoco Records Radio y locutores.' },
      { slug: 'album-oficial', name: 'Álbum Oficial', description: 'GTA VI: The Album con Atlantic Records, sencillos y vinilos.' }
    ]
  },
  {
    slug: 'rockstar-games',
    name: 'Rockstar Games',
    shortDesc: 'Noticias corporativas, Take-Two Interactive, patentes y motor RAGE.',
    tagline: 'La compañía detrás de Grand Theft Auto',
    color: '#a855f7',
    iconName: 'Shield',
    subcategories: [
      { slug: 'noticias-rockstar', name: 'Noticias de Rockstar', description: 'Informes financieros y comunicados.' },
      { slug: 'anuncios', name: 'Anuncios Oficiales', description: 'Tráilers y conferencias de Take-Two.' },
      { slug: 'gta-6-rockstar', name: 'GTA 6 en Rockstar', description: 'Visión creativa de los directores.' },
      { slug: 'gta-online', name: 'GTA Online', description: 'Futuro de la vertiente multijugador.' },
      { slug: 'otros-proyectos', name: 'Otros Proyectos', description: 'Red Dead, Midnight Club y RAGE 9.' },
      { slug: 'actualizaciones', name: 'Actualizaciones de Estudio', description: 'Desarrollo y tecnología de vanguardia.' }
    ]
  }
];

export const CATEGORIES = MAIN_CATEGORIES;
export const SITE_TAXONOMY = MAIN_CATEGORIES;
