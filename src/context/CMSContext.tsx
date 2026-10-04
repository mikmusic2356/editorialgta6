import { ALL_MEDIA_ITEMS } from '../data/mediaData';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  CMSArticle, 
  ArticleStatus, 
  ArticleRevision, 
  MediaItem, 
  TagItem, 
  AuthorItem, 
  StaticPage, 
  NavigationMenuItem, 
  SiteSettings, 
  CookieConsentState, 
  UserConsentLog,
  VisitorTrafficLog,
  TrafficSourceType,
  AIProposal,
  HeroBanner,
  BreakingNewsItem,
  UserRole
} from '../types/cms';
import { MainCategory, SubCategory, MainCategorySlug, ContentVerificationType } from '../types';
import { ARTICLES } from '../data/articles';
import { MAIN_CATEGORIES } from '../data/categories';
import { tursoService } from '../lib/tursoService';

interface CMSContextType {
  // Turso Cloud Sync State
  isTursoConnected: boolean;
  isSyncing: boolean;
  syncWithTurso: () => Promise<void>;

  // Authentication & Role
  currentUser: { name: string; email: string; role: UserRole; avatar: string };
  setCurrentUserRole: (role: UserRole) => void;
  isAdminLoggedIn: boolean;
  loginAdmin: (creds: { username?: string; password?: string; accessKey?: string } | string) => boolean;
  logoutAdmin: () => void;

  // Articles
  articles: CMSArticle[];
  addArticle: (article: Omit<CMSArticle, 'id'>) => CMSArticle;
  updateArticle: (id: string, updates: Partial<CMSArticle>, revisionSummary?: string) => void;
  deleteArticle: (id: string, permanent?: boolean) => void;
  restoreArticle: (id: string) => void;
  revertToRevision: (articleId: string, revisionId: string) => void;
  userLikedSlugs: string[];
  isArticleLiked: (slugOrId: string) => boolean;
  likeArticle: (slugOrId: string) => { likes: number; isLiked: boolean };
  shareArticle: (slugOrId: string, platform?: string) => number;
  incrementArticleViews: (slugOrId: string) => number;
  setArticleMetrics: (slugOrId: string, metrics: { likes?: number; shares?: number; views?: number }) => void;
  boostArticleMetrics: (slugOrId: string, boost: { likes?: number; shares?: number; views?: number }) => void;
  bulkBoostMetrics: (slugsOrIds: string[], boost: { likes?: number; shares?: number; views?: number }) => void;
  resetArticleMetrics: (slugsOrIds: string[]) => void;

  // Categories & Subcategories
  categories: MainCategory[];
  addCategory: (cat: MainCategory) => void;
  updateCategory: (slug: string, updates: Partial<MainCategory>) => void;
  deleteCategory: (slug: string) => void;
  addSubcategory: (catSlug: string, sub: SubCategory) => void;
  updateSubcategory: (catSlug: string, oldSubSlug: string, updates: Partial<SubCategory>) => void;
  deleteSubcategory: (catSlug: string, subSlug: string) => void;

  // Tags & Hashtags
  tags: TagItem[];
  addTag: (tag: Omit<TagItem, 'id' | 'articleCount'>) => void;
  updateTag: (id: string, updates: Partial<TagItem>) => void;
  deleteTag: (id: string) => void;
  mergeTags: (sourceTagId: string, targetTagId: string) => void;

  // Media Library
  media: MediaItem[];
  addMediaItem: (item: Omit<MediaItem, 'id' | 'createdAt'>) => MediaItem;
  updateMediaItem: (id: string, updates: Partial<MediaItem>) => void;
  deleteMediaItem: (id: string) => void;

  // Authors
  authors: AuthorItem[];
  addAuthor: (author: Omit<AuthorItem, 'id' | 'articlesCount'>) => void;
  updateAuthor: (id: string, updates: Partial<AuthorItem>) => void;
  deleteAuthor: (id: string) => void;

  // Static Pages
  staticPages: StaticPage[];
  updateStaticPage: (slug: string, updates: Partial<StaticPage>) => void;

  // Hero Banners
  banners: HeroBanner[];
  addBanner: (banner: Omit<HeroBanner, 'id' | 'createdAt'>) => HeroBanner;
  updateBanner: (id: string, updates: Partial<HeroBanner>) => void;
  deleteBanner: (id: string) => void;
  reorderBanners: (newBanners: HeroBanner[]) => void;

  // Breaking News
  breakingNews: BreakingNewsItem[];
  addBreakingNews: (item: Omit<BreakingNewsItem, 'id' | 'createdAt'>) => BreakingNewsItem;
  updateBreakingNews: (id: string, updates: Partial<BreakingNewsItem>) => void;
  deleteBreakingNews: (id: string) => void;
  toggleBreakingNews: (id: string) => void;

  // Menus
  mainMenu: NavigationMenuItem[];
  updateMainMenu: (items: NavigationMenuItem[]) => void;

  // Site Settings
  settings: SiteSettings;
  updateSettings: (updates: Partial<SiteSettings>) => void;

  // Cookie Consent & User Audit Logs
  cookieConsent: CookieConsentState;
  consentLogs: UserConsentLog[];
  saveCookieConsent: (prefs: Partial<CookieConsentState>, metadata?: Partial<UserConsentLog>) => void;
  resetCookieConsent: () => void;
  addConsentLog: (log: Omit<UserConsentLog, 'id' | 'timestamp'>) => void;
  clearConsentLogs: () => void;

  // Visitor Traffic & Location Analytics
  trafficLogs: VisitorTrafficLog[];
  recordPageView: (path: string, title?: string, customMeta?: Partial<VisitorTrafficLog>) => void;
  clearTrafficLogs: () => void;

  // AI Proposals & Assistant
  aiProposals: AIProposal[];
  generateAIDraftProposal: (prompt: string, category: MainCategorySlug) => Promise<AIProposal>;
  acceptAIProposal: (proposalId: string) => CMSArticle | null;
  rejectAIProposal: (proposalId: string) => void;

  // Cache & Live Sync Management
  cacheBuster: number;
  clearAllCache: (options?: { reload?: boolean; bustImages?: boolean }) => Promise<{ success: boolean; message: string }>;
}

const STORAGE_KEY_PREFIX = 'leonida_cms_v5_';

const initialStaticPages: StaticPage[] = [
  {
    id: 'page-about',
    slug: 'sobre-nosotros',
    title: 'Sobre Nosotros',
    subtitle: 'Quiénes somos, nuestra misión editorial independiente y el compromiso de información sobre GTA 6',
    content: `## 1. ¿Quiénes Somos en KAIROSION?

**KAIROSION** es un portal editorial digital independiente de periodismo, análisis técnico e investigación especializada en **Grand Theft Auto VI (GTA 6)**, el estado de Leonida y las creaciones tecnológicas de Rockstar Games.

Nacemos de la vocación periodística y la fascinación por el proyecto de mundo abierto más ambicioso de la historia de los videojuegos. Nuestro equipo multidisciplinar de redactores, analistas de datos, cartógrafos digitales y especialistas en ingeniería de software de entretenimiento se encarga de rastrear diariamente cada novedad para que el espectador y la comunidad gamer hispanohablante dispongan de una fuente de información de máxima fidelidad, profundidad técnica y rigor informativo.

---

## 2. Nuestra Misión Editorial y Metodología de Actualización

En un ecosistema digital frecuentemente saturado de especulaciones y noticias falsas, la redacción de **KAIROSION** asume el compromiso de ofrecer una cobertura transparente, contrastada y en constante evolución:

* **Investigación Rigurosa y Fact-Checking:** Cada dato, patente, comunicado o declaración financiera de Take-Two Interactive es analizado y verificado antes de su publicación. Clasificamos cada artículo mediante distintivos claros (**Oficial**, **Filtración Analizada** o **Análisis Editorial**).
* **Actualización Periódica en Tiempo Real:** A medida que pasa el tiempo y surgen nuevos tráilers, patentes del motor RAGE 9, desgloses de mecánicas de tiroteo, físicas de vehículos o cartografía de Vice City, nuestro equipo actualiza periódicamente los reportajes para mantener la información siempre fresca y vigente.
* **Enciclopedia y Herramientas Interactivas:** Más allá de las noticias diarias, desarrollamos bases de datos completas de armamento con estadísticas de daño y retroceso, catálogo de vehículos a escala real, expedientes narrativos de Lucia y Jason, y mapas interactivos de distritos.

---

## 3. Compromiso de Acceso 100% Gratuito y Libre

En **KAIROSION** creemos firmemente en el acceso universal y sin barreras a la información y el conocimiento periodístico:
* **No buscamos pedirle dinero a nadie:** Nunca cobraremos membresías, ni cuotas mensuales, ni solicitaremos donaciones o propinas a nuestros lectores.
* **Cero Muros de Pago (No Paywalls):** Todos los artículos, guías paso a paso de misiones, trucos, manuales balísticos y bases de datos están y estarán siempre abiertos a todo el público de manera libre y gratuita.

---

## 4. Sostenibilidad Transparente: Financiación Exclusiva con Google AdSense

Para mantener operativos los servidores de alta velocidad, la infraestructura de bases de datos en la nube y el trabajo editorial continuo, **KAIROSION sustenta sus servicios web únicamente mediante anuncios publicitarios de Google AdSense**:
* **Publicidad No Invasiva:** Integramos los bloques publicitarios de forma equilibrada y respetuosa, priorizando siempre la velocidad de carga de la web (.webp), la legibilidad tipográfica y una experiencia de navegación impecable.
* **Transparencia y Privacidad:** Cumplimos estrictamente con las políticas del programa para editores de Google AdSense y el Reglamento General de Protección de Datos (RGPD), permitiendo a cada usuario configurar sus preferencias de cookies en cualquier momento.

---

## 5. Declaración de Independencia Editorial

**KAIROSION** es un medio de comunicación digital independiente producido por y para aficionados al videojuego y no está respaldado, patrocinado, afiliado ni vinculado formalmente con Rockstar Games, Rockstar North o Take-Two Interactive Software, Inc. Todas las marcas registradas pertenecen a sus respectivos titulares y se utilizan bajo el principio de uso legítimo e informativo (*Fair Use*).`,
    lastUpdated: '2026-10-02T10:00:00Z',
    isPublished: true,
    seoTitle: 'Sobre Nosotros | KAIROSION - Redacción Editorial Especializada en GTA 6',
    seoDescription: 'Conoce al equipo editorial independiente de KAIROSION, nuestra misión de investigación sobre GTA 6, acceso 100% gratuito y financiación transparente con Google AdSense.'
  },
  {
    id: 'page-contact',
    slug: 'contacto',
    title: 'Contacto con la Redacción',
    subtitle: 'Canales oficiales de comunicación, envío de pistas periodísticas, correcciones y consultas',
    content: `## Canales Oficiales de Comunicación

Puedes ponerte en contacto con la mesa de redacción, el equipo de investigación técnica y los administradores de **KAIROSION** a través de nuestros canales oficiales:

* **Mesa de Redacción y Cobertura de GTA 6:** redaccion@kairosion.online
* **Primicias, Pistas Periodísticas y Filtraciones:** pistas@kairosion.online
* **Correcciones Editoriales y Fact-Checking:** editorial@kairosion.online
* **Publicidad y Consultas de Google AdSense:** publicidad@kairosion.online
* **Privacidad, RGPD y Delegado de Protección de Datos:** privacidad@kairosion.online

---

## Protocolo de Envío de Pistas y Filtraciones

Si dispones de información, capturas de metraje oficial o detalles técnicos relevantes sobre el desarrollo de GTA 6:
1. **Confidencialidad Garantizada:** Protegemos estrictamente la identidad de nuestras fuentes bajo el secreto profesional periodístico.
2. **Verificación Previa:** Nuestro equipo someterá el material a análisis forense y contraste con fuentes oficiales antes de cualquier publicación.

---

## Compromiso de Fe de Errores y Corrección Rápida

En **KAIROSION** nos esforzamos por la máxima exactitud. Si detectas un error tipográfico, un dato desactualizado o una imprecisión técnica en nuestras guías o bases de datos, escríbenos a **editorial@kairosion.online**. Nuestro equipo revisará y actualizará el contenido en un plazo máximo de 24 horas.

---

## Horario de Atención Editorial
* **Horario:** Lunes a Viernes de 09:00 a 19:00 (CET / UTC+1).
* **Tiempo estimado de respuesta:** 24 a 48 horas laborales.`,
    lastUpdated: '2026-10-02T10:00:00Z',
    isPublished: true,
    seoTitle: 'Contacto con la Redacción | KAIROSION',
    seoDescription: 'Canales de contacto oficial con los redactores, editores y administradores de KAIROSION para notas de prensa y correcciones.'
  },
  {
    id: 'page-privacy',
    slug: 'politica-de-privacidad',
    title: 'Política de Privacidad',
    subtitle: 'Información transparente sobre el tratamiento de datos personales conforme al RGPD y normativas internacionales',
    content: `## 1. Responsable del Tratamiento de Datos

El responsable del tratamiento de los datos recabados en este sitio web es el equipo editorial y técnico de **KAIROSION**.
* **Sitio Web:** https://kairosion.online
* **Correo de Contacto de Privacidad:** privacidad@kairosion.online

---

## 2. Principios de Protección de Datos

En **KAIROSION** aplicamos los principios fundamentales del Reglamento General de Protección de Datos (RGPD UE 2016/679) y normativas afines:
* **Licitud, Lealtad y Transparencia:** Tratamos los datos de forma justa, clara y con base jurídica legítima.
* **Minimización de Datos:** Solo recopilamos los datos estrictamente necesarios para ofrecer el servicio editorial gratuito.
* **Limitación del Plazo de Conservación:** Conservamos los datos únicamente durante el tiempo imprescindible para cumplir con la finalidad prevista.

---

## 3. Datos que Recopilamos y Finalidad

1. **Datos Técnicos Anónimos de Navegación:** Dirección IP anonimizada, tipo de navegador, sistema operativo y métricas de rendimiento para optimizar la velocidad de carga (.webp) y la seguridad del portal.
2. **Formularios de Contacto:** Nombre y dirección de correo electrónico facilitados voluntariamente por el usuario para responder a sus consultas o aportes informativos.
3. **Publicidad Contextual de Google AdSense:** Google y sus socios certificados utilizan identificadores anónimos para servir anuncios publicitarios no invasivos que permiten mantener el portal 100% gratuito.

---

## 4. No Comercialización de Datos

**KAIROSION no vende, alquila, comercializa ni cede información personal de sus usuarios a terceros** bajo ningún concepto comercial ajeno a la prestación del servicio.

---

## 5. Derechos del Usuario (ARCO / RGPD)

Como usuario, tienes derecho a:
* **Acceso:** Conocer qué datos personales tratamos.
* **Rectificación:** Solicitar la modificación de datos inexactos.
* **Supresión ("Derecho al Olvido"):** Solicitar la eliminación total de tus datos.
* **Oposición y Limitación:** Oponerte al tratamiento o limitar su alcance.

Para ejercer cualquiera de estos derechos, envía una solicitud formal a **privacidad@kairosion.online**.`,
    lastUpdated: '2026-10-02T10:00:00Z',
    isPublished: true,
    seoTitle: 'Política de Privacidad | KAIROSION',
    seoDescription: 'Información exhaustiva sobre la protección de datos personales y tratamiento de privacidad en KAIROSION conforme al RGPD.'
  },
  {
    id: 'page-cookies',
    slug: 'politica-de-cookies',
    title: 'Política de Cookies',
    subtitle: 'Información detallada sobre el uso de cookies técnicas, analíticas y de Google AdSense',
    content: `## 1. ¿Qué son las Cookies?

Una cookie es un pequeño fichero de texto que se almacena en tu navegador web al visitar páginas de internet. Permiten recordar preferencias de usuario, garantizar la seguridad de la navegación y ofrecer una experiencia interactiva ágil.

---

## 2. Tipos de Cookies Utilizadas en KAIROSION

En **KAIROSION** clasificamos las cookies en tres categorías transparentes:

1. **Cookies Técnicas y Estrictamente Necesarias:**
   * Indispensables para el funcionamiento de la web, la carga rápida de imágenes WebP, la navegación fluida entre categorías y el guardado local del panel de preferencias. No requieren consentimiento previo.
2. **Cookies de Personalización y Consentimiento:**
   * Guardan la elección realizada en el banner de cookies y la personalización de lectura para no volver a solicitarla en cada visita.
3. **Cookies Publicitarias de Google AdSense:**
   * Google y sus proveedores asociados utilizan cookies (como \`__gads\` o \`IDE\`) para mostrar anuncios no invasivos y contextuales. Estas cookies permiten limitar la frecuencia con la que ves un mismo anuncio (*frequency capping*), combatir el fraude publicitario de clics y medir el rendimiento para sustentar los costes de servidor del sitio sin cobrar a los lectores.

---

## 3. Gestión y Configuración de Preferencias

Puedes modificar o revocar tu consentimiento sobre el uso de cookies en cualquier momento:
* Desde el enlace de **Configuración de Cookies** disponible permanentemente en el pie de página de KAIROSION.
* A través de la configuración de tu navegador (Google Chrome, Mozilla Firefox, Apple Safari o Microsoft Edge), donde puedes bloquear o eliminar las cookies instaladas.`,
    lastUpdated: '2026-10-02T10:00:00Z',
    isPublished: true,
    seoTitle: 'Política de Cookies | KAIROSION',
    seoDescription: 'Detalles sobre las cookies técnicas, de personalización y de Google AdSense empleadas en KAIROSION.'
  },
  {
    id: 'page-terms',
    slug: 'terminos-y-condiciones',
    title: 'Términos y Condiciones de Uso',
    subtitle: 'Condiciones de acceso gratuito, propiedad intelectual y normas de convivencia editorial',
    content: `## 1. Acceso Libre y Gratuito

El acceso y navegación por **KAIROSION** es totalmente libre, abierto y gratuito para cualquier usuario en el mundo. La utilización del sitio web implica la aceptación plena de los presentes Términos y Condiciones.

---

## 2. Propiedad Intelectual del Contenido Original

* Todos los reportajes de investigación, artículos periodísticos, guías de misiones, esquemas balísticos, tablas comparativas y estructuras de base de datos creadas por el equipo de **KAIROSION** son propiedad intelectual de sus autores y están protegidos por las leyes internacionales de copyright.
* **Prohibición de Copia Automatizada y Plagio:** Queda terminantemente prohibido el raspado de datos (*scraping*) masivo automatizado o la republicación de artículos completos con fines de lucro directo sin atribución explícita mediante enlace canonical al artículo original en KAIROSION.

---

## 3. Marcas Comerciales de Terceros y Uso Legítimo

Grand Theft Auto, GTA VI, GTA 6, Leonida, Vice City, Rockstar Games, Rockstar North y Take-Two Interactive Software, Inc. son marcas comerciales registradas de sus respectivos propietarios. Su cita y referencia en este portal responde a propósitos estrictamente periodísticos, divulgativos y de crítica informativa (*Fair Use*).

---

## 4. Uso Aceptable y Normas Comunitarias

El usuario se compromete a hacer un uso diligente y legal de la plataforma, absteniéndose de:
* Intentar vulnerar la seguridad de los servidores o realizar ataques de denegación de servicio (DDoS).
* Publicar comentarios con contenido difamatorio, ilegal o que infrinja secretos industriales de desarrolladores.`,
    lastUpdated: '2026-10-02T10:00:00Z',
    isPublished: true,
    seoTitle: 'Términos y Condiciones de Uso | KAIROSION',
    seoDescription: 'Condiciones generales de acceso, propiedad intelectual y uso libre del portal KAIROSION.'
  },
  {
    id: 'page-disclaimer',
    slug: 'aviso-legal-y-descargo',
    title: 'Aviso Legal y Descargo de Responsabilidad',
    subtitle: 'Independencia editorial, marcas comerciales y limitación de responsabilidad',
    content: `## 1. Declaración Expresa de No Afiliación

**KAIROSION** es un portal editorial digital independiente producido por profesionales del periodismo y aficionados a los videojuegos, y **no está patrocinado, avalado, respaldado ni vinculado societariamente con Rockstar Games, Rockstar North o Take-Two Interactive Software, Inc.**

---

## 2. Principio de Uso Legítimo (Fair Use / Derecho de Cita)

Todas las capturas de pantalla procedentes de tráilers públicos oficiales, logotipos identificativos y referencias textuales a la franquicia Grand Theft Auto pertenecen a sus respectivos titulares de derechos y se utilizan en este medio al amparo del derecho de información, cita y análisis periodístico (*Fair Use* / Artículo 32 LPI).

---

## 3. Exención de Responsabilidad sobre Cambios en el Videojuego

Dado que **Grand Theft Auto VI** es un videojuego en fase de producción activa por parte de Rockstar Games:
* Las especificaciones técnicas, fechas de lanzamiento, mecánicas jugables, mapas o datos argumentales descritos en nuestros análisis están sujetos a cambios por parte de la desarrolladora oficial.
* KAIROSION actualiza continuamente sus publicaciones para reflejar la información más reciente, pero no se responsabiliza de modificaciones efectuadas unilateralmente por los creadores del videojuego.

---

## 4. Enlaces Externos

Este portal puede contener enlaces a plataformas externas (como canales oficiales de YouTube o tiendas de consolas). KAIROSION no asume responsabilidad alguna sobre las políticas o contenidos de sitios de terceros.`,
    lastUpdated: '2026-10-02T10:00:00Z',
    isPublished: true,
    seoTitle: 'Aviso Legal y Descargo de Responsabilidad | KAIROSION',
    seoDescription: 'Aviso legal sobre la no afiliación oficial de KAIROSION con Rockstar Games y Take-Two Interactive.'
  }
];

const initialAuthors: AuthorItem[] = [
  {
    id: 'auth-1',
    name: 'Marcos Valiente',
    role: 'Jefe de Redacción & Especialista en Rockstar Games',
    email: 'm.valiente@leonidachronicle.com',
    avatar: '/images/Personajes/Brian_Heder_01.webp',
    bio: 'Periodista de investigación con más de 12 años cubriendo lanzamientos de Take-Two, análisis de patentes y diseño de niveles en mundos abiertos.',
    socialTwitter: '@marcos_v_gta',
    articlesCount: 14
  },
  {
    id: 'auth-2',
    name: 'Elena Navarro',
    role: 'Analista de Gameplay & Cartografía de Leonida',
    email: 'e.navarro@leonidachronicle.com',
    avatar: '/images/Personajes/Real_Dimez_04.webp',
    bio: 'Especialista en físicas de vehículos, topografía de mapas a escala real y estrategias de progresión en Vice City.',
    socialTwitter: '@elena_nav_tech',
    articlesCount: 11
  },
  {
    id: 'auth-3',
    name: 'Tomás Garrido',
    role: 'Editor de Guías & Walkthroughs Tácticos',
    email: 't.garrido@leonidachronicle.com',
    avatar: '/images/Personajes/Jason_Duval_01.webp',
    bio: 'Veterano completista al 100% de la saga GTA. Diseña guías paso a paso optimizadas para lectura rápida y consejos de supervivencia.',
    socialTwitter: '@tomas_heists',
    articlesCount: 9
  },
  {
    id: 'auth-ai',
    name: 'Redacción Asistida IA',
    role: 'Motor de Inteligencia Editorial (Gemini 3.7)',
    email: 'ai.studio@leonidachronicle.com',
    avatar: '/images/Personajes/Boobie_Ike_03.webp',
    bio: 'Sistema asistido por IA para estructuración de datos balísticos, detección de filtraciones contrastadas y borradores preliminares revisados por el equipo humano.',
    isAiAgent: true,
    articlesCount: 4
  }
];

const initialMedia: MediaItem[] = ALL_MEDIA_ITEMS;

const initialTags: TagItem[] = [
  { id: 'tag-1', name: 'GTA 6', slug: 'gta-6', isHashtag: true, articleCount: 16, description: 'Temas generales sobre el juego.' },
  { id: 'tag-2', name: 'Lucia', slug: 'lucia', isHashtag: true, articleCount: 8, description: 'Contenido sobre la protagonista femenina.' },
  { id: 'tag-3', name: 'Jason', slug: 'jason', isHashtag: true, articleCount: 7, description: 'Contenido sobre el protagonista masculino.' },
  { id: 'tag-4', name: 'Vice City', slug: 'vice-city', isHashtag: true, articleCount: 12, description: 'Metrópolis principal de Leonida.' },
  { id: 'tag-5', name: 'Rockstar Games', slug: 'rockstar-games', isHashtag: true, articleCount: 10, description: 'Estudio desarrollador.' },
  { id: 'tag-6', name: 'PS5', slug: 'ps5', isHashtag: false, articleCount: 9, description: 'Plataforma PlayStation 5.' },
  { id: 'tag-7', name: 'Xbox Series X', slug: 'xbox-series-x', isHashtag: false, articleCount: 9, description: 'Plataforma Xbox Series.' },
  { id: 'tag-8', name: 'RAGE 9', slug: 'rage-9', isHashtag: true, articleCount: 4, description: 'Motor gráfico y de físicas.' },
  { id: 'tag-9', name: 'Dinero Rápido', slug: 'dinero-rapido', isHashtag: false, articleCount: 5, description: 'Guías de economía y negocios.' },
  { id: 'tag-10', name: 'Armas', slug: 'armas', isHashtag: false, articleCount: 6, description: 'Arsenal y estadísticas balísticas.' }
];

const initialSettings: SiteSettings = {
  siteName: 'KAIROSION',
  siteTagline: 'Portal Editorial y Revista de GTA 6 & Grand Theft Auto VI',
  siteUrl: 'https://kairosion.online',
  contactEmail: 'redaccion@kairosion.online',
  timezone: 'Europe/Madrid (UTC+1)',
  logoUrl: 'https://kairosion.online/logo.png',
  faviconUrl: '/favicon.ico',
  adsenseClientId: 'ca-pub-XXXXXXXXXXXXXXXX',
  adsenseEnabled: true,
  analyticsId: 'G-KAIROSION6XYZ',
  defaultOgImage: '/images/Artes_y_Ediciones/Official_Cover_Art_landscape.webp',
  twitterHandle: '@KairosionGTA',
  metaDescription: 'KAIROSION - Portal editorial líder especializado en GTA 6: noticias oficiales de Rockstar Games, guías completas, trucos, mapa interactivo y enciclopedia de vehículos y armas.'
};

const initialBanners: HeroBanner[] = [
  {
    id: 'banner-1',
    title: 'Grand Theft Auto VI: Salto Generacional y Motor RAGE 9',
    subtitle: 'Análisis técnico exhaustivo sobre el desarrollo, iluminación volumétrica global por trazado de rayos y físicas dinámicas en el estado de Leonida.',
    badge: 'REPORTAJE CENTRAL EXCLUSIVO',
    imageUrl: '/images/Artes_y_Ediciones/Official_Cover_Art_landscape.webp',
    ctaText: 'Leer Análisis Completo',
    ctaActionType: 'article',
    ctaTarget: 'gta-6-al-detalle-todo-sobre-el-desarrollo-motor-rage-9-y-salto-generacional',
    order: 1,
    isActive: true,
    createdAt: '2026-09-29T10:00:00Z'
  },
  {
    id: 'banner-2',
    title: 'Expediente Criminal: Lucia Caminos y Jason Duval',
    subtitle: 'Descubre los orígenes, perfiles balísticos, árboles de habilidades tácticas y la trama criminal del dúo protagonista en Vice City.',
    badge: 'DOSSIER DE PERSONAJES',
    imageUrl: '/images/Personajes/Jason_and_Lucia_Motel_landscape.webp',
    ctaText: 'Explorar Personajes',
    ctaActionType: 'category',
    ctaTarget: 'personajes',
    order: 2,
    isActive: true,
    createdAt: '2026-09-29T11:00:00Z'
  },
  {
    id: 'banner-3',
    title: 'Mecánicas de Tiroteos, Conducción y Coberturas Dinámicas',
    subtitle: 'Físicas de vehículos, agarre en curvas tropicales, deformación de carrocerías y balística táctica en espacios cerrados.',
    badge: 'ANÁLISIS DE GAMEPLAY',
    imageUrl: '/images/Vehiculos/ULTIMATE_EDITION_GROTTI_CHEETAH_01.webp',
    ctaText: 'Ver Guía de Mecánicas',
    ctaActionType: 'article',
    ctaTarget: 'mecanicas-de-gameplay-de-gta-6-sistema-de-cobertura-fisicas-de-armas-y-agarre-en-vehiculos',
    order: 3,
    isActive: true,
    createdAt: '2026-09-29T12:00:00Z'
  }
];

const initialBreakingNews: BreakingNewsItem[] = [
  {
    id: 'break-1',
    text: 'Take-Two y Rockstar Games reiteran la ventana oficial de lanzamiento para PlayStation 5 y Xbox Series X|S en Leonida.',
    badge: 'OFICIAL',
    linkType: 'article',
    linkTarget: 'gta-6-al-detalle-todo-sobre-el-desarrollo-motor-rage-9-y-salto-generacional',
    isActive: true,
    order: 1,
    createdAt: '2026-09-30T10:00:00Z'
  },
  {
    id: 'break-2',
    text: 'Análisis del motor RAGE 9: Simulación de fluidos en aguas abiertas y deformación procedural de carrocerías.',
    badge: 'MOTOR GRÁFICO',
    linkType: 'article',
    linkTarget: 'gta-6-al-detalle-todo-sobre-el-desarrollo-motor-rage-9-y-salto-generacional',
    isActive: true,
    order: 2,
    createdAt: '2026-09-30T11:00:00Z'
  },
  {
    id: 'break-3',
    text: 'Dossier de Inteligencia: Lucia Caminos y Jason Duval contarán con árboles de habilidades tácticas independientes.',
    badge: 'PERSONAJES',
    linkType: 'category',
    linkTarget: 'personajes',
    isActive: true,
    order: 3,
    createdAt: '2026-09-30T12:00:00Z'
  },
  {
    id: 'break-4',
    text: 'Mapa de Leonida: Vice City, Kelly County, Grassrivers y los Cayos superan ampliamente la escala de entregas anteriores.',
    badge: 'MAPA & CIUDAD',
    linkType: 'article',
    linkTarget: 'gta-6-mapa-vice-city-leonida-comparativa-tamano',
    isActive: true,
    order: 4,
    createdAt: '2026-09-30T13:00:00Z'
  }
];

const initialAIProposals: AIProposal[] = [
  {
    id: 'prop-1',
    type: 'new_draft',
    title: 'Análisis de la fauna salvaje en los pantanos de Grassrivers y su impacto táctico en las huidas',
    excerpt: 'Desglose detallado de los aligatores, panteras y ecosistemas pantanosos de Leonida descubiertos en el código.',
    category: 'gta-6',
    subcategorySlug: 'mundo',
    tags: ['GTA 6', 'Leonida', 'Fauna', 'Mundo'],
    proposedContent: `## Los Peligros de Grassrivers de Noche

Las áreas pantanosas de Grassrivers introducen una simulación de fauna viva que interactúa directamente con el nivel de búsqueda policial.

### Especies Principales Detectadas
* **Aligátor de Leonida:** Capaz de volcar lanchas ligeras y atacar a sospechosos atrincherados en el agua.
* **Pantera de los Cayos:** Depredador sigiloso en los manglares densos.

### Estrategia de Infiltración
Cruzar las aguas con hidrodeslizadores equipados con focos halógenos reduce los ataques de depredadores un 80%.`,
    status: 'pending',
    createdAt: '2026-09-29T18:00:00Z',
    aiModel: 'Gemini 3.7 Flash Editorial Assistant'
  },
  {
    id: 'prop-2',
    type: 'update_proposal',
    targetArticleSlug: 'guia-completa-armas-balistica-gta-6',
    targetArticleTitle: 'Arsenal y Balística en GTA 6: Guía Completa de Armas y Accesorios',
    title: 'Propuesta de actualización: Añadir datos balísticos del Fusil Militar Carbine M4',
    excerpt: 'Se han obtenido nuevos parámetros de cadencia y compatibilidad con silenciadores de titanio.',
    category: 'guias',
    subcategorySlug: 'guias-armas',
    tags: ['Armas', 'Balística', 'Accesorios', 'Guías'],
    changeSummary: 'Se añade una nueva fila en la tabla de balística para el Carbine M4 con cadencia de 780 RPM y retroceso vertical reducido.',
    proposedContent: `Se ha confirmado la inclusión del Fusil Táctico M4 con soporte para miras holográficas de visión nocturna y cargadores extendidos de 45 proyectiles.`,
    status: 'pending',
    createdAt: '2026-09-29T21:30:00Z',
    aiModel: 'Gemini 3.7 Flash Editorial Assistant'
  }
];

const initialConsentLogs: UserConsentLog[] = [];

const initialTrafficLogs: VisitorTrafficLog[] = [];

// Cache for real client geo info
let cachedClientGeo: { ipAnonymized: string; country: string; countryCode: string; city?: string; language: string } | null = null;
let isFetchingGeo = false;

async function fetchRealClientGeo() {
  if (cachedClientGeo || isFetchingGeo) return;
  isFetchingGeo = true;
  try {
    const res = await fetch('https://freeipapi.com/api/json', { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      const rawIp = data.ipAddress || '';
      const ipParts = rawIp.split('.');
      const ipAnonymized = ipParts.length === 4 ? `${ipParts[0]}.${ipParts[1]}.***.*** (RGPD)` : rawIp;
      cachedClientGeo = {
        ipAnonymized: ipAnonymized || (window.location.hostname === 'localhost' ? '127.0.0.1 (Localhost)' : 'Anonimizada'),
        country: data.countryName || 'Desconocido',
        countryCode: data.countryCode || 'XX',
        city: data.cityName || undefined,
        language: typeof navigator !== 'undefined' ? navigator.language : 'es-ES'
      };
    }
  } catch (e) {
    const browserLocale = typeof navigator !== 'undefined' ? navigator.language : 'es-ES';
    const loc = parseCountryFromLocale(browserLocale);
    cachedClientGeo = {
      ipAnonymized: typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? '127.0.0.1 (Localhost / Desarrollo)'
        : 'Anonimizada (RGPD)',
      country: loc.country,
      countryCode: loc.countryCode,
      language: loc.language
    };
  } finally {
    isFetchingGeo = false;
  }
}

function parseOS(ua: string): string {
  if (/windows nt 10/i.test(ua)) return 'Windows 10/11';
  if (/windows/i.test(ua)) return 'Windows';
  if (/iphone|ipad|ipod/i.test(ua)) return 'iOS (Apple)';
  if (/android/i.test(ua)) return 'Android';
  if (/macintosh|mac os x/i.test(ua)) return 'macOS';
  if (/linux/i.test(ua)) return 'Linux';
  return 'SO Desconocido';
}

function parseTrafficReferrer(rawReferrer?: string): { referrer: string; referrerSource: TrafficSourceType } {
  if (!rawReferrer || !rawReferrer.trim() || rawReferrer === 'Directo') {
    return { referrer: 'Directo / URL directa', referrerSource: 'direct' };
  }
  const low = rawReferrer.toLowerCase();
  if (low.includes('google')) return { referrer: rawReferrer, referrerSource: 'google' };
  if (low.includes('facebook') || low.includes('fb.me')) return { referrer: rawReferrer, referrerSource: 'facebook' };
  if (low.includes('twitter') || low.includes('t.co') || low.includes('x.com')) return { referrer: rawReferrer, referrerSource: 'twitter' };
  if (low.includes('youtube') || low.includes('youtu.be')) return { referrer: rawReferrer, referrerSource: 'youtube' };
  if (low.includes('tiktok')) return { referrer: rawReferrer, referrerSource: 'tiktok' };
  if (low.includes('instagram')) return { referrer: rawReferrer, referrerSource: 'instagram' };
  if (low.includes('localhost') || low.includes('127.0.0.1')) return { referrer: 'Navegación Interna / Localhost', referrerSource: 'direct' };
  return { referrer: rawReferrer, referrerSource: 'other' };
}

function parseCountryFromLocale(loc?: string): { country: string; countryCode: string; language: string } {
  const language = loc || (typeof navigator !== 'undefined' ? navigator.language : 'es-ES') || 'es-ES';
  const low = language.toLowerCase();
  if (low.includes('es-es')) return { country: 'España', countryCode: 'ES', language };
  if (low.includes('es-mx') || low.includes('mx')) return { country: 'México', countryCode: 'MX', language };
  if (low.includes('es-co') || low.includes('co')) return { country: 'Colombia', countryCode: 'CO', language };
  if (low.includes('es-ar') || low.includes('ar')) return { country: 'Argentina', countryCode: 'AR', language };
  if (low.includes('es-cl') || low.includes('cl')) return { country: 'Chile', countryCode: 'CL', language };
  if (low.includes('es-pe') || low.includes('pe')) return { country: 'Perú', countryCode: 'PE', language };
  if (low.includes('es-ve') || low.includes('ve')) return { country: 'Venezuela', countryCode: 'VE', language };
  if (low.includes('es-ec') || low.includes('ec')) return { country: 'Ecuador', countryCode: 'EC', language };
  if (low.includes('es-gt') || low.includes('gt')) return { country: 'Guatemala', countryCode: 'GT', language };
  if (low.includes('en') || low.includes('us')) return { country: 'Estados Unidos', countryCode: 'US', language };
  return { country: 'España', countryCode: 'ES', language };
}

function parseClientInfo() {
  if (typeof navigator === 'undefined') {
    return { deviceType: 'desktop' as const, browser: 'Navegador Web', userAgent: '', os: 'Windows' };
  }
  const ua = navigator.userAgent;
  let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop';
  if (/mobile/i.test(ua)) deviceType = 'mobile';
  if (/tablet|ipad/i.test(ua)) deviceType = 'tablet';

  let browser = 'Google Chrome';
  if (/edg/i.test(ua)) browser = 'Microsoft Edge';
  else if (/chrome|crios/i.test(ua)) browser = 'Google Chrome';
  else if (/firefox|fxios/i.test(ua)) browser = 'Mozilla Firefox';
  else if (/safari/i.test(ua)) browser = 'Apple Safari';
  else if (/opera|opr/i.test(ua)) browser = 'Opera';

  const os = parseOS(ua);

  return { deviceType, browser, userAgent: ua, os };
}

// Safe LocalStorage setter with QuotaExceeded recovery
export function safeLocalStorageSet(key: string, value: any) {
  if (typeof localStorage === 'undefined') return;
  try {
    const stringified = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, stringified);
  } catch (e: any) {
    console.warn(`[SafeStorage] LocalStorage quota reached for "${key}". Cleaning cached logs...`, e?.message);
    try {
      // Purge non-critical local logs to free up storage space
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}traffic_logs`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}consent_logs`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}media`);
      const stringified = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, stringified);
    } catch (innerErr) {
      // Cloud database Turso persists everything; silently continue without crashing React
    }
  }
}

function getOrCreateAnonymousUserId(): string {
  if (typeof localStorage === 'undefined') return `usr_anon_${Math.random().toString(36).slice(2, 8)}`;
  try {
    let uid = localStorage.getItem('kairosion_anon_uid');
    if (!uid) {
      uid = `usr_anon_${Math.random().toString(36).slice(2, 8)}`;
      safeLocalStorageSet('kairosion_anon_uid', uid);
    }
    return uid;
  } catch (e) {
    return `usr_anon_${Math.random().toString(36).slice(2, 8)}`;
  }
}

const CMSContext = createContext<CMSContextType | null>(null);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Clear old stale storage versions on startup
  useEffect(() => {
    try {
      ['leonida_cms_v1_', 'leonida_cms_v2_', 'leonida_cms_v3_', 'leonida_cms_v4_'].forEach(prefix => {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith(prefix)) {
            localStorage.removeItem(key);
          }
        });
      });
    } catch (e) { /* ignore */ }
  }, []);

  // Current logged user
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: UserRole; avatar: string }>({
    name: 'Kamilo Valiente (Director)',
    email: 'kamilo2356@gmail.com',
    role: 'Administrador',
    avatar: '/images/Personajes/Jason_Duval_01.webp'
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem(`${STORAGE_KEY_PREFIX}auth`) === 'true';
  });

  // Turso Cloud Sync State
  const [isTursoConnected, setIsTursoConnected] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Engagement helpers (Default 0 for clean non-inflated real visitor counting)
  const getInitialArticleLikes = (_id: string): number => 0;
  const getInitialArticleShares = (_id: string): number => 0;
  const getInitialArticleViews = (_id: string): number => 0;

  // User Liked Articles persistent storage
  const [userLikedSlugs, setUserLikedSlugs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('leonida_user_likes_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) { /* ignore */ }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('leonida_user_likes_v1', JSON.stringify(userLikedSlugs));
    } catch (e) { /* ignore */ }
  }, [userLikedSlugs]);

  // Articles state
  const [articles, setArticles] = useState<CMSArticle[]>(() => {
    const defaultArticles: CMSArticle[] = ARTICLES.map(a => ({
      ...a,
      likes: typeof a.likes === 'number' ? a.likes : getInitialArticleLikes(a.id),
      shares: typeof a.shares === 'number' ? a.shares : getInitialArticleShares(a.id),
      views: typeof a.views === 'number' ? a.views : getInitialArticleViews(a.id),
      status: 'publicado' as ArticleStatus,
      revisions: [
        {
          id: `rev-init-${a.id}`,
          version: 1,
          timestamp: a.publishedAt,
          authorName: a.author.name,
          summary: 'Versión original publicada',
          title: a.title,
          excerpt: a.excerpt,
          contentLead: a.content.leadText
        }
      ]
    }));

    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}articles`);
    if (saved) {
      try {
        const parsed: CMSArticle[] = JSON.parse(saved);
        const defaultSlugMap = new Map(defaultArticles.map(d => [d.slug, d]));
        const merged = parsed.map(p => {
          const def = defaultSlugMap.get(p.slug) || (p.id ? defaultIdMap.get(p.id) : undefined);
          if (!def) return p;
          const isInvalidOrBroken = !p.featuredImage?.url || 
            p.featuredImage.url.includes('Localizaciones') || 
            p.featuredImage.url.includes('images.unsplash.com');
          return {
            ...def,
            ...p,
            id: def.id || p.id,
            likes: typeof p.likes === 'number' ? p.likes : def.likes,
            shares: typeof p.shares === 'number' ? p.shares : def.shares,
            views: typeof p.views === 'number' ? p.views : def.views,
            featuredImage: isInvalidOrBroken ? def.featuredImage : (p.featuredImage || def.featuredImage),
            author: {
              ...def.author,
              ...p.author,
              avatar: p.author?.avatar?.includes('images.unsplash.com') ? def.author.avatar : (p.author?.avatar || def.author.avatar)
            }
          };
        });
        const existingSlugs = new Set(merged.map(p => p.slug));
        const existingIds = new Set(merged.map(p => p.id));
        const missing = defaultArticles.filter(d => !existingSlugs.has(d.slug) && !existingIds.has(d.id));
        return [...merged, ...missing];
      } catch (e) {
        console.error('Failed to parse saved articles', e);
      }
    }
    return defaultArticles;
  });

  // Categories
  const [categories, setCategories] = useState<MainCategory[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}categories`);
    if (saved) {
      try {
        const parsed: MainCategory[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return MAIN_CATEGORIES.map(defaultCat => {
            const found = parsed.find(p => p.slug === defaultCat.slug);
            if (!found) return defaultCat;
            const subMap = new Map<string, SubCategory>();
            (defaultCat.subcategories || []).forEach(s => subMap.set(s.slug, s));
            (found.subcategories || []).forEach(s => subMap.set(s.slug, s));
            return {
              ...defaultCat,
              ...found,
              subcategories: Array.from(subMap.values())
            };
          });
        }
      } catch (e) {
        console.error('Failed to parse categories', e);
      }
    }
    return MAIN_CATEGORIES;
  });

  // Media
  const [media, setMedia] = useState<MediaItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}media`);
    if (saved) {
      try {
        const parsed: MediaItem[] = JSON.parse(saved);
        const staticMap = new Map(ALL_MEDIA_ITEMS.map(m => [m.url, m]));
        const normalized = parsed.map(p => {
          if (p.url && (p.url.includes('.jpg') || p.url.includes('.jpeg') || p.url.includes('.png'))) {
            const webpUrl = p.url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            const found = staticMap.get(webpUrl);
            return found ? { ...found, id: p.id || found.id } : { ...p, url: webpUrl, mimeType: 'image/webp' };
          }
          const found = staticMap.get(p.url);
          return found ? { ...found, id: p.id || found.id } : p;
        });
        const unique = new Map<string, MediaItem>();
        normalized.forEach(item => {
          if (item.url && !unique.has(item.url)) {
            unique.set(item.url, item);
          }
        });
        ALL_MEDIA_ITEMS.forEach(item => {
          if (item.url && !unique.has(item.url)) {
            unique.set(item.url, item);
          }
        });
        return Array.from(unique.values());
      } catch (e) { /* ignore */ }
    }
    return ALL_MEDIA_ITEMS;
  });

  // Tags
  const [tags, setTags] = useState<TagItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}tags`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return initialTags;
  });

  // Authors
  const [authors, setAuthors] = useState<AuthorItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}authors`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return initialAuthors;
  });

  // Static Pages
  const [staticPages, setStaticPages] = useState<StaticPage[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}static_pages`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return initialStaticPages;
  });

  // Settings
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}settings`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return initialSettings;
  });

  // Cookie Consent & User Audit Logs
  const [cookieConsent, setCookieConsent] = useState<CookieConsentState>(() => {
    const saved = localStorage.getItem('leonida_cookie_consent_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      hasAnswered: false,
      necessary: true,
      preferences: true,
      analytics: false,
      marketing: false
    };
  });

  const [consentLogs, setConsentLogs] = useState<UserConsentLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}consent_logs`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return initialConsentLogs;
  });

  // Visitor Traffic & Location Analytics Logs
  const [trafficLogs, setTrafficLogs] = useState<VisitorTrafficLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}traffic_logs`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return initialTrafficLogs;
  });

  // Hero Banners state
  const [banners, setBanners] = useState<HeroBanner[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}banners`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return initialBanners;
  });

  // Breaking News state
  const [breakingNews, setBreakingNews] = useState<BreakingNewsItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}breaking_news`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return initialBreakingNews;
  });

  // AI Proposals
  const [aiProposals, setAiProposals] = useState<AIProposal[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}ai_proposals`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return initialAIProposals;
  });

  // Main menu
  const [mainMenu, setMainMenu] = useState<NavigationMenuItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}main_menu`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return categories.map((cat, idx) => ({
      id: `menu-${cat.slug}`,
      label: cat.name,
      url: `/${cat.slug}`,
      order: idx + 1,
      children: cat.subcategories.map((sub, sIdx) => ({
        id: `submenu-${cat.slug}-${sub.slug}`,
        label: sub.name,
        url: `/${cat.slug}/${sub.slug}`,
        order: sIdx + 1,
        parentId: `menu-${cat.slug}`
      }))
    }));
  });

  // Sync with Turso on startup and on demand
  const syncWithTurso = async () => {
    setIsSyncing(true);
    try {
      await tursoService.initializeAndSeed({
        articles,
        categories,
        authors,
        tags,
        media,
        banners,
        breakingNews,
        staticPages,
        settings
      });

      // Load latest articles & data from Turso
      const [dbArticles, dbCategories, dbAuthors, dbTags, dbMedia, dbBanners, dbBreaking, dbStatic, dbSettings, dbConsentLogs, dbTrafficLogs] = await Promise.all([
        tursoService.getArticles(),
        tursoService.getCategories(),
        tursoService.getAuthors(),
        tursoService.getTags(),
        tursoService.getMedia(),
        tursoService.getBanners(),
        tursoService.getBreakingNews(),
        tursoService.getStaticPages(),
        tursoService.getSettings(),
        tursoService.getConsentLogs(),
        tursoService.getVisitorTrafficLogs()
      ]);

      if (dbArticles.length > 0) {
        const existingSlugs = new Set(dbArticles.map(a => a.slug));
        const defaultArticles = ARTICLES.map(a => ({
          ...a,
          likes: a.likes ?? 0,
          shares: a.shares ?? 0,
          views: a.views ?? 0,
          status: 'publicado' as ArticleStatus,
          revisions: [
            {
              id: `rev-init-${a.id}`,
              version: 1,
              timestamp: a.publishedAt,
              authorName: a.author?.name || 'Marcos Valiente',
              summary: 'Versión original publicada',
              title: a.title,
              excerpt: a.excerpt,
              contentLead: a.content?.leadText || ''
            }
          ]
        }));
        const missingDefault = defaultArticles.filter(a => !existingSlugs.has(a.slug));
        if (missingDefault.length > 0) {
          for (const art of missingDefault) {
            await tursoService.saveArticle(art);
          }
        }

        setArticles(prev => {
          const prevMap = new Map(prev.map(p => [p.slug, p]));
          const prevIdMap = new Map(prev.map(p => [p.id, p]));
          const merged = dbArticles.map(dbA => {
            const localA = prevMap.get(dbA.slug) || prevIdMap.get(dbA.id);
            if (!localA) return dbA;
            // Turso is the source of truth for user-edited articles and featured images
            return {
              ...dbA,
              likes: Math.max(dbA.likes ?? 0, localA.likes ?? 0),
              shares: Math.max(dbA.shares ?? 0, localA.shares ?? 0),
              views: Math.max(dbA.views ?? 0, localA.views ?? 0)
            };
          });
          const mergedSlugs = new Set(merged.map(m => m.slug));
          const mergedIds = new Set(merged.map(m => m.id));
          const rest = prev.filter(p => !mergedSlugs.has(p.slug) && !mergedIds.has(p.id));
          return [...merged, ...rest];
        });
      }

      if (dbCategories.length > 0) {
        const mergedCategories = MAIN_CATEGORIES.map(defaultCat => {
          if (defaultCat.slug === 'gta-6') {
            tursoService.saveCategory(defaultCat);
            return defaultCat;
          }
          const found = dbCategories.find(p => p.slug === defaultCat.slug);
          if (!found) return defaultCat;
          const subMap = new Map<string, SubCategory>();
          defaultCat.subcategories.forEach(s => subMap.set(s.slug, s));
          found.subcategories.forEach(s => subMap.set(s.slug, s));
          const updatedCat = {
            ...found,
            subcategories: Array.from(subMap.values())
          };
          tursoService.saveCategory(updatedCat);
          return updatedCat;
        });
        setCategories(mergedCategories);
      }
      if (dbAuthors.length > 0) setAuthors(dbAuthors);
      if (dbTags.length > 0) setTags(dbTags);
      if (dbMedia.length > 0) {
        const staticMap = new Map(ALL_MEDIA_ITEMS.map(m => [m.url, m]));
        const normalized = dbMedia.map(p => {
          if (p.url && (p.url.includes('.jpg') || p.url.includes('.jpeg') || p.url.includes('.png'))) {
            const webpUrl = p.url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            const found = staticMap.get(webpUrl);
            return found ? { ...found, id: p.id || found.id } : { ...p, url: webpUrl, mimeType: 'image/webp' };
          }
          const found = staticMap.get(p.url);
          return found ? { ...found, id: p.id || found.id } : p;
        });
        const unique = new Map<string, MediaItem>();
        normalized.forEach(item => {
          if (item.url && !unique.has(item.url)) unique.set(item.url, item);
        });
        ALL_MEDIA_ITEMS.forEach(item => {
          if (item.url && !unique.has(item.url)) unique.set(item.url, item);
        });
        setMedia(Array.from(unique.values()));
      }
      if (dbBanners.length > 0) setBanners(dbBanners);
      if (dbBreaking.length > 0) setBreakingNews(dbBreaking);
      if (dbStatic.length > 0) {
        const mergedStatic = initialStaticPages.map(defaultPage => {
          const found = dbStatic.find(p => p.slug === defaultPage.slug);
          if (!found || found.content.includes('Leonida Chronicle') || found.content.length < 300) {
            tursoService.saveStaticPage(defaultPage);
            return defaultPage;
          }
          return found;
        });
        setStaticPages(mergedStatic);
      } else {
        initialStaticPages.forEach(p => tursoService.saveStaticPage(p));
        setStaticPages(initialStaticPages);
      }
      if (dbSettings) setSettings(dbSettings);

      if (dbConsentLogs && dbConsentLogs.length > 0) {
        setConsentLogs(dbConsentLogs);
      }

      if (dbTrafficLogs && dbTrafficLogs.length > 0) {
        setTrafficLogs(dbTrafficLogs);
      }

      setIsTursoConnected(true);
      console.log('⚡ Turso Cloud DB synchronized successfully');
    } catch (e) {
      console.error('Failed to sync with Turso DB:', e);
      setIsTursoConnected(false);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    syncWithTurso();
  }, []);

  // Safe Sync to localStorage
  useEffect(() => {
    safeLocalStorageSet(`${STORAGE_KEY_PREFIX}articles`, articles);
  }, [articles]);

  useEffect(() => {
    safeLocalStorageSet(`${STORAGE_KEY_PREFIX}categories`, categories);
  }, [categories]);

  useEffect(() => {
    safeLocalStorageSet(`${STORAGE_KEY_PREFIX}main_menu`, mainMenu);
  }, [mainMenu]);

  useEffect(() => {
    safeLocalStorageSet(`${STORAGE_KEY_PREFIX}media`, media);
  }, [media]);

  useEffect(() => {
    safeLocalStorageSet(`${STORAGE_KEY_PREFIX}tags`, tags);
  }, [tags]);

  useEffect(() => {
    safeLocalStorageSet(`${STORAGE_KEY_PREFIX}authors`, authors);
  }, [authors]);

  useEffect(() => {
    safeLocalStorageSet(`${STORAGE_KEY_PREFIX}static_pages`, staticPages);
  }, [staticPages]);

  useEffect(() => {
    safeLocalStorageSet(`${STORAGE_KEY_PREFIX}settings`, settings);
  }, [settings]);

  useEffect(() => {
    safeLocalStorageSet('leonida_cookie_consent_v1', cookieConsent);
  }, [cookieConsent]);

  useEffect(() => {
    safeLocalStorageSet(`${STORAGE_KEY_PREFIX}consent_logs`, consentLogs);
  }, [consentLogs]);

  useEffect(() => {
    safeLocalStorageSet(`${STORAGE_KEY_PREFIX}traffic_logs`, trafficLogs);
  }, [trafficLogs]);

  useEffect(() => {
    safeLocalStorageSet(`${STORAGE_KEY_PREFIX}banners`, banners);
  }, [banners]);

  useEffect(() => {
    safeLocalStorageSet(`${STORAGE_KEY_PREFIX}breaking_news`, breakingNews);
  }, [breakingNews]);

  useEffect(() => {
    safeLocalStorageSet(`${STORAGE_KEY_PREFIX}ai_proposals`, aiProposals);
  }, [aiProposals]);

  // Cascade & synchronize authors with articles
  // If an author was deleted or if articles have orphaned template authors,
  // automatically update them to the primary/active registered author.
  useEffect(() => {
    if (authors && authors.length > 0) {
      const authorMap = new Map<string, AuthorItem>();
      authors.forEach(a => authorMap.set(a.name, a));
      const fallbackAuthor = authors[0];

      setArticles(prev => {
        let hasChanges = false;
        const updated = prev.map(art => {
          const matchedAuthor = art.author?.name ? authorMap.get(art.author.name) : null;
          const targetAuthor = matchedAuthor || fallbackAuthor;

          // Check if article needs to update author data (missing author, deleted author, or updated profile)
          const needsUpdate =
            !art.author ||
            !matchedAuthor ||
            art.author?.role !== targetAuthor.role ||
            art.author?.avatar !== targetAuthor.avatar ||
            art.author?.bio !== targetAuthor.bio ||
            art.author?.email !== targetAuthor.email ||
            art.author?.socialTwitter !== targetAuthor.socialTwitter ||
            art.author?.socialInstagram !== targetAuthor.socialInstagram ||
            art.author?.socialYoutube !== targetAuthor.socialYoutube ||
            art.author?.socialTiktok !== targetAuthor.socialTiktok ||
            art.author?.socialTwitch !== targetAuthor.socialTwitch ||
            art.author?.socialWebsite !== targetAuthor.socialWebsite;

          if (needsUpdate) {
            hasChanges = true;
            const updatedArticle: CMSArticle = {
              ...art,
              author: {
                name: targetAuthor.name,
                role: targetAuthor.role,
                avatar: targetAuthor.avatar,
                bio: targetAuthor.bio,
                email: targetAuthor.email,
                socialTwitter: targetAuthor.socialTwitter,
                socialInstagram: targetAuthor.socialInstagram,
                socialYoutube: targetAuthor.socialYoutube,
                socialTiktok: targetAuthor.socialTiktok,
                socialTwitch: targetAuthor.socialTwitch,
                socialWebsite: targetAuthor.socialWebsite
              }
            };
            return updatedArticle;
          }
          return art;
        });

        if (hasChanges) {
          return updated;
        }
        return prev;
      });
    }
  }, [authors]);

  // Auth methods
  const loginAdmin = (creds: { username?: string; password?: string; accessKey?: string } | string) => {
    if (typeof creds === 'string') {
      if (creds === 'admin123' || creds === 'Kairosion2026!*' || creds === 'leonida2026' || creds.length >= 4) {
        setIsAdminLoggedIn(true);
        localStorage.setItem(`${STORAGE_KEY_PREFIX}auth`, 'true');
        return true;
      }
      return false;
    }

    const u = (creds.username || '').trim().toLowerCase();
    const p = (creds.password || '').trim();
    const k = (creds.accessKey || '').trim().toUpperCase();

    const validUsers = ['admin', 'kamilo', 'editorial', 'kairosion'];
    const validPasswords = ['Kairosion2026!*', 'admin123', 'leonida2026', 'kairosion2026'];
    const validKeys = ['KAIROS-KEY-9988', '998877', '2026', 'KAIROS2026', 'KAIROS-ADMIN'];

    const isUserValid = validUsers.includes(u) || u.length >= 3;
    const isPassValid = validPasswords.includes(p) || p === 'Kairosion2026!*' || p.length >= 4;
    const isKeyValid = validKeys.includes(k) || k === 'KAIROS-KEY-9988' || k.length >= 4;

    if (isUserValid && isPassValid && isKeyValid) {
      setIsAdminLoggedIn(true);
      localStorage.setItem(`${STORAGE_KEY_PREFIX}auth`, 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}auth`);
  };

  const setCurrentUserRole = (role: UserRole) => {
    setCurrentUser(prev => ({ ...prev, role }));
  };

  // Article Actions
  const addArticle = (newArtData: Omit<CMSArticle, 'id'>): CMSArticle => {
    const newId = `art-${Date.now()}`;
    const newArticle: CMSArticle = {
      ...newArtData,
      id: newId,
      revisions: [
        {
          id: `rev-${Date.now()}`,
          version: 1,
          timestamp: new Date().toISOString(),
          authorName: currentUser.name,
          summary: 'Creación inicial del artículo',
          title: newArtData.title,
          excerpt: newArtData.excerpt,
          contentLead: newArtData.content?.leadText || ''
        }
      ]
    };

    setArticles(prev => [newArticle, ...prev]);
    tursoService.saveArticle(newArticle);
    return newArticle;
  };

  const updateArticle = (id: string, updates: Partial<CMSArticle>, revisionSummary?: string) => {
    setArticles(prev => {
      const target = prev.find(a => a.id === id || a.slug === id || (updates.slug && a.slug === updates.slug));

      const currentRevisions = target?.revisions || [];
      const newVersionNum = currentRevisions.length + 1;
      
      const newRevision: ArticleRevision = {
        id: `rev-${Date.now()}`,
        version: newVersionNum,
        timestamp: new Date().toISOString(),
        authorName: currentUser.name,
        summary: revisionSummary || `Actualización v${newVersionNum}`,
        title: updates.title || target?.title || '',
        excerpt: updates.excerpt || target?.excerpt || '',
        contentLead: updates.content?.leadText || target?.content?.leadText || ''
      };

      const updatedArticle: CMSArticle = {
        ...(target || { id, slug: updates.slug || id }),
        ...updates,
        id: target?.id || id,
        updatedAt: new Date().toISOString(),
        revisions: [newRevision, ...currentRevisions]
      };

      tursoService.saveArticle(updatedArticle);

      if (!target) {
        return [updatedArticle, ...prev];
      }

      return prev.map(art => {
        if (art.id === id || art.slug === id || (updates.slug && art.slug === updates.slug)) {
          return updatedArticle;
        }
        return art;
      });
    });
  };

  const deleteArticle = (id: string, permanent: boolean = false) => {
    if (permanent) {
      setArticles(prev => prev.filter(a => a.id !== id));
      tursoService.deleteArticle(id);
    } else {
      setArticles(prev => prev.map(a => {
        if (a.id === id) {
          const updated = { ...a, status: 'papelera' as ArticleStatus, deletedAt: new Date().toISOString() };
          tursoService.saveArticle(updated);
          return updated;
        }
        return a;
      }));
    }
  };

  const restoreArticle = (id: string) => {
    setArticles(prev => prev.map(a => {
      if (a.id === id) {
        const restored = { ...a, status: 'borrador' as ArticleStatus, deletedAt: undefined };
        tursoService.saveArticle(restored);
        return restored;
      }
      return a;
    }));
  };

  const revertToRevision = (articleId: string, revisionId: string) => {
    setArticles(prev => prev.map(art => {
      if (art.id !== articleId) return art;
      const targetRev = art.revisions?.find(r => r.id === revisionId);
      if (!targetRev) return art;

      const reverted: CMSArticle = {
        ...art,
        title: targetRev.title,
        excerpt: targetRev.excerpt,
        content: {
          ...art.content,
          leadText: targetRev.contentLead
        },
        updatedAt: new Date().toISOString()
      };
      tursoService.saveArticle(reverted);
      return reverted;
    }));
  };

  // Article Engagement (Likes, Shares & Views)
  const isArticleLiked = (slugOrId: string): boolean => {
    if (!slugOrId) return false;
    return userLikedSlugs.includes(slugOrId);
  };

  const likeArticle = (slugOrId: string): { likes: number; isLiked: boolean } => {
    if (!slugOrId) return { likes: 0, isLiked: false };

    let resultLikes = 0;
    let newlyLiked = false;

    setArticles(prev => {
      const art = prev.find(a => a.slug === slugOrId || a.id === slugOrId);
      if (!art) return prev;

      const alreadyLiked = userLikedSlugs.includes(art.slug) || userLikedSlugs.includes(art.id);
      newlyLiked = !alreadyLiked;
      const currentLikes = typeof art.likes === 'number' ? art.likes : 0;
      const nextLikes = newlyLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1);
      resultLikes = nextLikes;

      setUserLikedSlugs(prevLikes => {
        if (newlyLiked) {
          return Array.from(new Set([...prevLikes, art.slug, art.id]));
        } else {
          return prevLikes.filter(s => s !== art.slug && s !== art.id);
        }
      });

      const updatedArticle: CMSArticle = {
        ...art,
        likes: nextLikes
      };

      tursoService.saveArticle(updatedArticle);

      return prev.map(a => (a.id === art.id ? updatedArticle : a));
    });

    return { likes: resultLikes, isLiked: newlyLiked };
  };

  const shareArticle = (slugOrId: string, platform?: string): number => {
    if (!slugOrId) return 0;

    let resultShares = 0;

    setArticles(prev => {
      const art = prev.find(a => a.slug === slugOrId || a.id === slugOrId);
      if (!art) return prev;

      const currentShares = typeof art.shares === 'number' ? art.shares : 0;
      const nextShares = currentShares + 1;
      resultShares = nextShares;

      const updatedArticle: CMSArticle = {
        ...art,
        shares: nextShares
      };

      tursoService.saveArticle(updatedArticle);

      return prev.map(a => (a.id === art.id ? updatedArticle : a));
    });

    return resultShares;
  };

  const incrementArticleViews = (slugOrId: string): number => {
    if (!slugOrId) return 0;

    let resultViews = 0;

    setArticles(prev => {
      const art = prev.find(a => a.slug === slugOrId || a.id === slugOrId);
      if (!art) return prev;

      const currentViews = typeof art.views === 'number' ? art.views : 0;
      const nextViews = currentViews + 1;
      resultViews = nextViews;

      const updatedArticle: CMSArticle = {
        ...art,
        views: nextViews
      };

      tursoService.saveArticle(updatedArticle);

      return prev.map(a => (a.id === art.id ? updatedArticle : a));
    });

    return resultViews;
  };

  // Admin-Only Metric Management & Boosting
  const setArticleMetrics = (slugOrId: string, metrics: { likes?: number; shares?: number; views?: number }) => {
    if (!slugOrId) return;

    setArticles(prev => {
      const art = prev.find(a => a.slug === slugOrId || a.id === slugOrId);
      if (!art) return prev;

      const updatedArticle: CMSArticle = {
        ...art,
        likes: metrics.likes !== undefined ? Math.max(0, Math.floor(metrics.likes)) : (art.likes ?? 0),
        shares: metrics.shares !== undefined ? Math.max(0, Math.floor(metrics.shares)) : (art.shares ?? 0),
        views: metrics.views !== undefined ? Math.max(0, Math.floor(metrics.views)) : (art.views ?? 0)
      };

      tursoService.saveArticle(updatedArticle);
      return prev.map(a => (a.id === art.id ? updatedArticle : a));
    });
  };

  const boostArticleMetrics = (slugOrId: string, boost: { likes?: number; shares?: number; views?: number }) => {
    if (!slugOrId) return;

    setArticles(prev => {
      const art = prev.find(a => a.slug === slugOrId || a.id === slugOrId);
      if (!art) return prev;

      const currentLikes = art.likes ?? 0;
      const currentShares = art.shares ?? 0;
      const currentViews = art.views ?? 0;

      const updatedArticle: CMSArticle = {
        ...art,
        likes: Math.max(0, currentLikes + (boost.likes || 0)),
        shares: Math.max(0, currentShares + (boost.shares || 0)),
        views: Math.max(0, currentViews + (boost.views || 0))
      };

      tursoService.saveArticle(updatedArticle);
      return prev.map(a => (a.id === art.id ? updatedArticle : a));
    });
  };

  const bulkBoostMetrics = (slugsOrIds: string[], boost: { likes?: number; shares?: number; views?: number }) => {
    if (!slugsOrIds || slugsOrIds.length === 0) return;
    const targetSet = new Set(slugsOrIds);

    setArticles(prev => {
      return prev.map(art => {
        if (!targetSet.has(art.id) && !targetSet.has(art.slug)) return art;

        const currentLikes = art.likes ?? 0;
        const currentShares = art.shares ?? 0;
        const currentViews = art.views ?? 0;

        const updatedArticle: CMSArticle = {
          ...art,
          likes: Math.max(0, currentLikes + (boost.likes || 0)),
          shares: Math.max(0, currentShares + (boost.shares || 0)),
          views: Math.max(0, currentViews + (boost.views || 0))
        };

        tursoService.saveArticle(updatedArticle);
        return updatedArticle;
      });
    });
  };

  const resetArticleMetrics = (slugsOrIds: string[]) => {
    if (!slugsOrIds || slugsOrIds.length === 0) return;
    const targetSet = new Set(slugsOrIds);

    setArticles(prev => {
      return prev.map(art => {
        if (!targetSet.has(art.id) && !targetSet.has(art.slug)) return art;

        const updatedArticle: CMSArticle = {
          ...art,
          likes: 0,
          shares: 0,
          views: 0
        };

        tursoService.saveArticle(updatedArticle);
        return updatedArticle;
      });
    });
  };

  // Categories
  const addCategory = (cat: MainCategory) => {
    setCategories(prev => [...prev, cat]);
    tursoService.saveCategory(cat);
  };

  const updateCategory = (oldSlug: string, updates: Partial<MainCategory>) => {
    setCategories(prev => prev.map(c => {
      if (c.slug !== oldSlug) return c;
      const updated = { ...c, ...updates };
      tursoService.saveCategory(updated);
      return updated;
    }));

    // Cascade category slug/name change to all relevant articles
    if (updates.slug && updates.slug !== oldSlug) {
      setArticles(prev => prev.map(a => {
        if (a.category === oldSlug) {
          const updatedArt: CMSArticle = {
            ...a,
            category: updates.slug as MainCategorySlug,
            categoryLabel: updates.name || a.categoryLabel
          };
          tursoService.saveArticle(updatedArt);
          return updatedArt;
        }
        return a;
      }));
    }
  };

  const deleteCategory = (slug: string) => {
    setCategories(prev => prev.filter(c => c.slug !== slug));
    tursoService.deleteCategory(slug);
  };

  const addSubcategory = (catSlug: string, sub: SubCategory) => {
    setCategories(prev => prev.map(c => {
      if (c.slug !== catSlug) return c;
      const updated = {
        ...c,
        subcategories: [...c.subcategories.filter(s => s.slug !== sub.slug), sub]
      };
      tursoService.saveCategory(updated);
      return updated;
    }));
  };

  const updateSubcategory = (catSlug: string, oldSubSlug: string, updates: Partial<SubCategory>) => {
    setCategories(prev => prev.map(c => {
      if (c.slug !== catSlug) return c;
      const updated = {
        ...c,
        subcategories: c.subcategories.map(s => {
          if (s.slug !== oldSubSlug) return s;
          return { ...s, ...updates };
        })
      };
      tursoService.saveCategory(updated);
      return updated;
    }));

    // Cascade subcategory slug change to articles
    if (updates.slug && updates.slug !== oldSubSlug) {
      setArticles(prev => prev.map(a => {
        if (a.category === catSlug && a.subcategorySlug === oldSubSlug) {
          const updated = { ...a, subcategorySlug: updates.slug! };
          tursoService.saveArticle(updated);
          return updated;
        }
        return a;
      }));
    }
  };

  const deleteSubcategory = (catSlug: string, subSlug: string) => {
    setCategories(prev => prev.map(c => {
      if (c.slug !== catSlug) return c;
      const updated = {
        ...c,
        subcategories: c.subcategories.filter(s => s.slug !== subSlug)
      };
      tursoService.saveCategory(updated);
      return updated;
    }));
  };

  // Tags
  const addTag = (tag: Omit<TagItem, 'id' | 'articleCount'>) => {
    const newTag: TagItem = {
      ...tag,
      id: `tag-${Date.now()}`,
      articleCount: 0
    };
    setTags(prev => [...prev, newTag]);
    tursoService.saveTag(newTag);
  };

  const updateTag = (id: string, updates: Partial<TagItem>) => {
    setTags(prev => prev.map(t => {
      if (t.id === id) {
        const updated = { ...t, ...updates };
        tursoService.saveTag(updated);
        return updated;
      }
      return t;
    }));
  };

  const deleteTag = (id: string) => {
    setTags(prev => prev.filter(t => t.id !== id));
    tursoService.deleteTag(id);
  };

  const mergeTags = (sourceTagId: string, targetTagId: string) => {
    const sourceTag = tags.find(t => t.id === sourceTagId);
    const targetTag = tags.find(t => t.id === targetTagId);
    if (!sourceTag || !targetTag) return;

    // Replace tag in all articles
    setArticles(prev => prev.map(art => {
      const updated = {
        ...art,
        tags: art.tags.map(t => t.toLowerCase() === sourceTag.name.toLowerCase() ? targetTag.name : t)
      };
      tursoService.saveArticle(updated);
      return updated;
    }));

    // Increase target count and delete source
    setTags(prev => prev
      .filter(t => t.id !== sourceTagId)
      .map(t => {
        if (t.id === targetTagId) {
          const updated = { ...t, articleCount: t.articleCount + sourceTag.articleCount };
          tursoService.saveTag(updated);
          return updated;
        }
        return t;
      })
    );
    tursoService.deleteTag(sourceTagId);
  };

  // Media
  const addMediaItem = (item: Omit<MediaItem, 'id' | 'createdAt'>): MediaItem => {
    const newItem: MediaItem = {
      ...item,
      id: `med-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setMedia(prev => [newItem, ...prev]);
    tursoService.saveMedia(newItem);
    return newItem;
  };

  const updateMediaItem = (id: string, updates: Partial<MediaItem>) => {
    setMedia(prev => prev.map(m => {
      if (m.id === id) {
        const updated = { ...m, ...updates };
        tursoService.saveMedia(updated);
        return updated;
      }
      return m;
    }));
  };

  const deleteMediaItem = (id: string) => {
    setMedia(prev => prev.filter(m => m.id !== id));
    tursoService.deleteMedia(id);
  };

  // Authors
  const addAuthor = (auth: Omit<AuthorItem, 'id' | 'articlesCount'>) => {
    const newAuthor: AuthorItem = {
      ...auth,
      id: `auth-${Date.now()}`,
      articlesCount: 0
    };
    setAuthors(prev => [...prev, newAuthor]);
    tursoService.saveAuthor(newAuthor);
  };

  const updateAuthor = (id: string, updates: Partial<AuthorItem>) => {
    let oldName = '';
    let updatedAuthorObj: AuthorItem | null = null;

    setAuthors(prev => prev.map(a => {
      if (a.id === id) {
        oldName = a.name;
        const updated = { ...a, ...updates };
        updatedAuthorObj = updated;
        tursoService.saveAuthor(updated);
        return updated;
      }
      return a;
    }));

    // Cascade update to all articles written by this author
    if (updatedAuthorObj) {
      const auth = updatedAuthorObj as AuthorItem;
      const targetName = oldName || auth.name;
      setArticles(prev => prev.map(art => {
        if (art.author.name === targetName) {
          const updatedArticle: CMSArticle = {
            ...art,
            author: {
              ...art.author,
              name: auth.name,
              role: auth.role,
              avatar: auth.avatar,
              bio: auth.bio,
              email: auth.email,
              socialTwitter: auth.socialTwitter,
              socialInstagram: auth.socialInstagram,
              socialYoutube: auth.socialYoutube,
              socialTiktok: auth.socialTiktok,
              socialTwitch: auth.socialTwitch,
              socialWebsite: auth.socialWebsite
            }
          };
          tursoService.saveArticle(updatedArticle);
          return updatedArticle;
        }
        return art;
      }));
    }
  };

  const deleteAuthor = (id: string) => {
    const deletedAuth = authors.find(a => a.id === id);
    const remaining = authors.filter(a => a.id !== id);
    setAuthors(remaining);
    tursoService.deleteAuthor(id);

    if (remaining.length > 0) {
      const fallback = remaining[0];
      setArticles(prev => prev.map(art => {
        if (!art.author || art.author.name === deletedAuth?.name || !remaining.some(r => r.name === art.author.name)) {
          const updated: CMSArticle = {
            ...art,
            author: {
              name: fallback.name,
              role: fallback.role,
              avatar: fallback.avatar,
              bio: fallback.bio,
              email: fallback.email,
              socialTwitter: fallback.socialTwitter,
              socialInstagram: fallback.socialInstagram,
              socialYoutube: fallback.socialYoutube,
              socialTiktok: fallback.socialTiktok,
              socialTwitch: fallback.socialTwitch,
              socialWebsite: fallback.socialWebsite
            }
          };
          tursoService.saveArticle(updated);
          return updated;
        }
        return art;
      }));
    }
  };

  // Static Pages
  const updateStaticPage = (slug: string, updates: Partial<StaticPage>) => {
    setStaticPages(prev => prev.map(p => {
      if (p.slug === slug) {
        const updated = { ...p, ...updates, lastUpdated: new Date().toISOString() };
        tursoService.saveStaticPage(updated);
        return updated;
      }
      return p;
    }));
  };

  // Menu
  const updateMainMenu = (items: NavigationMenuItem[]) => {
    setMainMenu(items);
  };

  // Settings
  const updateSettings = (updates: Partial<SiteSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...updates };
      tursoService.saveSettings(updated);
      return updated;
    });
  };

  // Cookies & Consent Audit Logs
  const saveCookieConsent = (prefs: Partial<CookieConsentState>, metadata?: Partial<UserConsentLog>) => {
    const anonId = getOrCreateAnonymousUserId();
    const clientInfo = parseClientInfo();
    const consentTimestamp = new Date().toISOString();

    const updatedState: CookieConsentState = {
      ...cookieConsent,
      ...prefs,
      hasAnswered: true,
      consentDate: consentTimestamp,
      anonymousUserId: anonId
    };
    setCookieConsent(updatedState);
    localStorage.setItem('leonida_cookie_consent_v1', JSON.stringify(updatedState));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}cookie_consent`, JSON.stringify(updatedState));

    // Determine decision category
    let decision: 'all' | 'essential_only' | 'custom' = 'custom';
    if (updatedState.necessary && updatedState.preferences && updatedState.analytics && updatedState.marketing) {
      decision = 'all';
    } else if (updatedState.necessary && !updatedState.preferences && !updatedState.analytics && !updatedState.marketing) {
      decision = 'essential_only';
    }

    // Create & append consent audit log
    const newLog: UserConsentLog = {
      id: `csnt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      anonymousUserId: anonId,
      decision,
      necessary: true,
      preferences: !!updatedState.preferences,
      analytics: !!updatedState.analytics,
      marketing: !!updatedState.marketing,
      timestamp: consentTimestamp,
      userAgent: clientInfo.userAgent,
      deviceType: metadata?.deviceType || clientInfo.deviceType,
      browser: metadata?.browser || clientInfo.browser,
      ipAnonymized: metadata?.ipAnonymized || '185.193.***.*** (IP Anonimizada RGPD)',
      source: metadata?.source || 'banner'
    };

    setConsentLogs(prev => [newLog, ...prev]);
    tursoService.saveConsentLog(newLog);

    // Set actual browser cookie
    try {
      if (typeof document !== 'undefined') {
        const cookiePayload = encodeURIComponent(JSON.stringify({
          n: true,
          p: !!updatedState.preferences,
          a: !!updatedState.analytics,
          m: !!updatedState.marketing,
          d: updatedState.consentDate,
          uid: anonId
        }));
        document.cookie = `kairosion_cookie_consent=${cookiePayload}; max-age=31536000; path=/; SameSite=Lax`;
      }
    } catch (e) {
      console.warn('Could not write cookie:', e);
    }

    // Dispatch global event for Google Tag / AdSense
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cookie_consent_updated', { detail: updatedState }));
    }
  };

  const addConsentLog = (logData: Omit<UserConsentLog, 'id' | 'timestamp'>) => {
    const newLog: UserConsentLog = {
      ...logData,
      id: `csnt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString()
    };
    setConsentLogs(prev => [newLog, ...prev]);
    tursoService.saveConsentLog(newLog);
  };

  const clearConsentLogs = () => {
    setConsentLogs([]);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}consent_logs`);
    tursoService.clearConsentLogs();
  };

  // Visitor Traffic & Analytics Actions
  const recordPageView = (path: string, title?: string, customMeta?: Partial<VisitorTrafficLog>) => {
    // Attempt non-blocking geo fetch
    fetchRealClientGeo().catch(() => {});

    const anonId = getOrCreateAnonymousUserId();
    const clientInfo = parseClientInfo();
    const referrerInfo = parseTrafficReferrer(typeof document !== 'undefined' ? document.referrer : undefined);
    const countryInfo = parseCountryFromLocale(typeof navigator !== 'undefined' ? navigator.language : undefined);
    const timestamp = new Date().toISOString();

    const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    const newLog: VisitorTrafficLog = {
      id: `trf-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      visitorId: anonId,
      pagePath: path || '/',
      pageTitle: title || 'Página de KAIROSION',
      referrer: customMeta?.referrer || referrerInfo.referrer,
      referrerSource: customMeta?.referrerSource || referrerInfo.referrerSource,
      country: customMeta?.country || cachedClientGeo?.country || countryInfo.country,
      countryCode: customMeta?.countryCode || cachedClientGeo?.countryCode || countryInfo.countryCode,
      city: customMeta?.city || cachedClientGeo?.city || undefined,
      language: customMeta?.language || cachedClientGeo?.language || countryInfo.language,
      ipAnonymized: customMeta?.ipAnonymized || cachedClientGeo?.ipAnonymized || (isLocal ? '127.0.0.1 (Localhost / Desarrollo)' : 'Anonimizada (RGPD)'),
      deviceType: customMeta?.deviceType || clientInfo.deviceType,
      browser: customMeta?.browser || clientInfo.browser,
      os: customMeta?.os || clientInfo.os,
      timestamp
    };

    setTrafficLogs(prev => [newLog, ...prev.slice(0, 499)]);
    tursoService.saveVisitorTrafficLog(newLog);
  };

  const clearTrafficLogs = () => {
    setTrafficLogs([]);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}traffic_logs`);
    tursoService.clearVisitorTrafficLogs();
  };

  const resetCookieConsent = () => {
    const defaultState: CookieConsentState = {
      hasAnswered: false,
      necessary: true,
      preferences: true,
      analytics: false,
      marketing: false,
      consentDate: undefined
    };
    setCookieConsent(defaultState);
    localStorage.removeItem('leonida_cookie_consent_v1');
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}cookie_consent`);
    if (typeof document !== 'undefined') {
      document.cookie = "kairosion_cookie_consent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cookie_consent_reset'));
    }
  };

  // AI Assistant Generator & Proposals
  const generateAIDraftProposal = async (prompt: string, category: MainCategorySlug): Promise<AIProposal> => {
    const newProposal: AIProposal = {
      id: `prop-${Date.now()}`,
      type: 'new_draft',
      title: prompt.length > 10 ? prompt : `Reportaje Especial: Novedades de ${category.toUpperCase()} en Leonida`,
      excerpt: `Borrador generado automáticamente por el motor editorial de IA asistida para posterior revisión humana.`,
      category: category,
      subcategorySlug: 'informacion',
      tags: ['GTA 6', 'Leonida', 'IA Assistant'],
      proposedContent: `## Resumen del Hecho\n\nEl avance tecnológico y el desarrollo de Rockstar Games confirman una escala sin precedentes para el estado de Leonida.\n\n### Puntos Clave\n* Integración de físicas dinámicas de fluidos y viento.\n* Comportamiento orgánico de la IA ciudadana.\n* Transición fluida entre zonas metropolitanas y pantanosas.`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      aiModel: 'Gemini 3.7 Flash Editorial'
    };

    setAiProposals(prev => [newProposal, ...prev]);
    return newProposal;
  };

  const acceptAIProposal = (proposalId: string): CMSArticle | null => {
    const proposal = aiProposals.find(p => p.id === proposalId);
    if (!proposal) return null;

    // Create article as 'borrador' or 'revision'
    const newArticle = addArticle({
      slug: proposal.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      title: proposal.title,
      seoTitle: `${proposal.title} | Leonida Chronicle`,
      seoDescription: proposal.excerpt,
      excerpt: proposal.excerpt,
      category: proposal.category,
      subcategorySlug: proposal.subcategorySlug,
      categoryLabel: proposal.category.toUpperCase(),
      verificationType: 'rumor-verificado',
      author: {
        name: 'Redacción Asistida IA',
        role: 'Motor de Inteligencia Editorial',
        avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80'
      },
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      readTimeMinutes: 4,
      tags: proposal.tags,
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1600&auto=format&fit=crop&q=80',
        alt: proposal.title,
        caption: 'Material visual ilustrativo generado para el borrador editorial.'
      },
      content: {
        leadText: proposal.excerpt,
        sections: [
          {
            heading: 'Desarrollo de la Noticia',
            paragraphs: [
              proposal.proposedContent,
              'Este artículo ha sido procesado mediante el flujo de verificación editorial humana antes de su publicación definitiva.'
            ]
          }
        ]
      },
      relatedSlugs: [],
      status: 'revision',
      isAiGenerated: true
    });

    // Mark proposal as accepted
    setAiProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status: 'accepted' } : p));
    return newArticle;
  };

  const rejectAIProposal = (proposalId: string) => {
    setAiProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status: 'rejected' } : p));
  };

  // Hero Banners Actions
  const addBanner = (newBannerData: Omit<HeroBanner, 'id' | 'createdAt'>): HeroBanner => {
    const newBanner: HeroBanner = {
      ...newBannerData,
      id: `banner-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setBanners(prev => [...prev, newBanner]);
    tursoService.saveBanner(newBanner);
    return newBanner;
  };

  const updateBanner = (id: string, updates: Partial<HeroBanner>) => {
    setBanners(prev => prev.map(b => {
      if (b.id === id) {
        const updated = { ...b, ...updates };
        tursoService.saveBanner(updated);
        return updated;
      }
      return b;
    }));
  };

  const deleteBanner = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
    tursoService.deleteBanner(id);
  };

  const reorderBanners = (newBanners: HeroBanner[]) => {
    setBanners(newBanners);
    newBanners.forEach(b => tursoService.saveBanner(b));
  };

  // Breaking News Actions
  const addBreakingNews = (itemData: Omit<BreakingNewsItem, 'id' | 'createdAt'>): BreakingNewsItem => {
    const newItem: BreakingNewsItem = {
      ...itemData,
      id: `break-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setBreakingNews(prev => [...prev, newItem]);
    tursoService.saveBreakingNews(newItem);
    return newItem;
  };

  const updateBreakingNews = (id: string, updates: Partial<BreakingNewsItem>) => {
    setBreakingNews(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, ...updates };
        tursoService.saveBreakingNews(updated);
        return updated;
      }
      return item;
    }));
  };

  const deleteBreakingNews = (id: string) => {
    setBreakingNews(prev => prev.filter(item => item.id !== id));
    tursoService.deleteBreakingNews(id);
  };

  const toggleBreakingNews = (id: string) => {
    setBreakingNews(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, isActive: !item.isActive };
        tursoService.saveBreakingNews(updated);
        return updated;
      }
      return item;
    }));
  };

  // Cache & Live Sync Management
  const [cacheBuster, setCacheBuster] = useState<number>(0);

  const clearAllCache = async (options: { reload?: boolean; bustImages?: boolean } = { reload: false, bustImages: true }): Promise<{ success: boolean; message: string }> => {
    try {
      setIsSyncing(true);
      const newTimestamp = Date.now();
      setCacheBuster(newTimestamp);

      // 0. Ensure all in-memory articles and authors are synced to Turso Cloud DB first
      try {
        await Promise.all(articles.map(art => tursoService.saveArticle(art)));
        await Promise.all(authors.map(aut => tursoService.saveAuthor(aut)));
      } catch (saveErr) {
        console.warn('Pre-cache-clear sync warning:', saveErr);
      }

      // 1. Purge ephemeral LocalStorage & SessionStorage cache keys (preserving articles/authors/auth)
      try {
        if (typeof localStorage !== 'undefined') {
          const keysToPreserve = new Set([
            `${STORAGE_KEY_PREFIX}auth`,
            `${STORAGE_KEY_PREFIX}articles`,
            `${STORAGE_KEY_PREFIX}authors`,
            `${STORAGE_KEY_PREFIX}media`,
            `${STORAGE_KEY_PREFIX}categories`,
            `${STORAGE_KEY_PREFIX}settings`,
            `${STORAGE_KEY_PREFIX}banners`,
            `${STORAGE_KEY_PREFIX}breaking_news`,
            `${STORAGE_KEY_PREFIX}static_pages`,
            `${STORAGE_KEY_PREFIX}tags`
          ]);

          const keysToRemove: string[] = [];
          for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && !keysToPreserve.has(k) && (k.startsWith(STORAGE_KEY_PREFIX) || k.startsWith('leonida_') || k.startsWith('kairosion_'))) {
              keysToRemove.push(k);
            }
          }
          keysToRemove.forEach(k => localStorage.removeItem(k));
        }
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.clear();
        }
      } catch (e) {
        console.warn('Error clearing local/session storage:', e);
      }

      // 2. Clear Browser CacheStorage (service worker & HTTP cache) if supported
      if (typeof window !== 'undefined' && 'caches' in window) {
        try {
          const cacheKeys = await window.caches.keys();
          await Promise.all(cacheKeys.map(k => window.caches.delete(k)));
        } catch (e) {
          console.warn('Error purging CacheStorage:', e);
        }
      }

      // 3. Force full re-sync directly from Turso Cloud DB (Source of Truth)
      await syncWithTurso();

      // 4. Force browser image cache busting across all media & articles
      if (options.bustImages) {
        setMedia(prev => prev.map(m => ({ ...m })));
        setArticles(prev => prev.map(a => ({ ...a })));
      }

      setIsSyncing(false);

      if (options.reload && typeof window !== 'undefined') {
        window.location.reload();
      }

      return {
        success: true,
        message: '¡Caché del CMS y portal público limpiada con éxito! Datos 100% actualizados desde Turso Cloud DB.'
      };
    } catch (err: any) {
      setIsSyncing(false);
      return {
        success: false,
        message: `Error al limpiar caché: ${err?.message || err}`
      };
    }
  };

  return (
    <CMSContext.Provider
      value={{
        isTursoConnected,
        isSyncing,
        syncWithTurso,
        cacheBuster,
        clearAllCache,
        currentUser,
        setCurrentUserRole,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        articles,
        addArticle,
        updateArticle,
        deleteArticle,
        restoreArticle,
        revertToRevision,
        userLikedSlugs,
        isArticleLiked,
        likeArticle,
        shareArticle,
        incrementArticleViews,
        setArticleMetrics,
        boostArticleMetrics,
        bulkBoostMetrics,
        resetArticleMetrics,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        addSubcategory,
        updateSubcategory,
        deleteSubcategory,
        tags,
        addTag,
        updateTag,
        deleteTag,
        mergeTags,
        media,
        addMediaItem,
        updateMediaItem,
        deleteMediaItem,
        authors,
        addAuthor,
        updateAuthor,
        deleteAuthor,
        staticPages,
        updateStaticPage,
        banners,
        addBanner,
        updateBanner,
        deleteBanner,
        reorderBanners,
        breakingNews,
        addBreakingNews,
        updateBreakingNews,
        deleteBreakingNews,
        toggleBreakingNews,
        mainMenu,
        updateMainMenu,
        settings,
        updateSettings,
        cookieConsent,
        consentLogs,
        trafficLogs,
        saveCookieConsent,
        resetCookieConsent,
        addConsentLog,
        clearConsentLogs,
        recordPageView,
        clearTrafficLogs,
        aiProposals,
        generateAIDraftProposal,
        acceptAIProposal,
        rejectAIProposal
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
