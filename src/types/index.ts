export type MainCategorySlug = 
  | 'gta-6'
  | 'noticias'
  | 'guias'
  | 'trucos-consejos'
  | 'personajes'
  | 'mapa'
  | 'vehiculos'
  | 'armas'
  | 'musica'
  | 'rockstar-games';

export type ContentVerificationType = 
  | 'oficial'         // Confirmado oficialmente por Rockstar Games o Take-Two
  | 'actualizacion'   // Parche, nota de desarrollo o comunicado
  | 'rumor-verificado'// Filtración analizada y con indicios verificables
  | 'comunidad'       // Aportación, creación o teoría de la comunidad
  | 'guia-estrategica'// Tutorial paso a paso
  | 'truco-rapido';   // Consejo o técnica inmediata

export interface SubCategory {
  slug: string;
  name: string;
  description: string;
}

export interface MainCategory {
  slug: MainCategorySlug;
  name: string;
  shortDesc: string;
  tagline: string;
  color: string;
  iconName: string;
  subcategories: SubCategory[];
}

export interface Author {
  name: string;
  role: string;
  avatar: string;
  bio?: string;
  email?: string;
  socialTwitter?: string;
  socialInstagram?: string;
  socialYoutube?: string;
  socialTiktok?: string;
  socialTwitch?: string;
  socialWebsite?: string;
}

export interface ImageAsset {
  url: string;
  alt: string;
  caption?: string;
  badge?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1';
}

export interface CalloutBox {
  type: 'tip' | 'warning' | 'info' | 'rockstar-note';
  title: string;
  content: string;
}

export interface GuideStep {
  number: number;
  title: string;
  description: string;
  hint?: string;
}

export interface TableData {
  caption: string;
  headers: string[];
  rows: string[][];
}

export interface ArticleSection {
  id?: string;
  type?: 'text' | 'video' | 'image' | 'callout' | 'table';
  heading?: string;
  subheading?: string;
  paragraphs?: string[];
  calloutBox?: CalloutBox;
  steps?: GuideStep[];
  tableData?: TableData;
  image?: ImageAsset;
  youtubeVideoId?: string;
  youtubeCaption?: string;
  quote?: {
    text: string;
    author?: string;
  };
}

export interface ArticleContent {
  leadText: string;
  sections: ArticleSection[];
  takeaways?: string[];
}

export interface TocItem {
  id: string;
  title: string;
  level: 2 | 3;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl?: string;
  excerpt: string;
  category: MainCategorySlug;
  subcategorySlug: string;
  categoryLabel: string;
  verificationType: ContentVerificationType;
  author: Author;
  publishedAt: string;
  updatedAt: string;
  readTimeMinutes: number;
  tags: string[];
  featuredImage: ImageAsset;
  isHero?: boolean;
  isTrending?: boolean;
  isLatest?: boolean;
  difficulty?: 'Principiante' | 'Intermedio' | 'Avanzado' | 'Experto';
  estimatedTime?: string;
  youtubeVideoId?: string;
  schemaType?: 'NewsArticle' | 'Article' | 'TechArticle';
  tableOfContents?: TocItem[];
  content: ArticleContent;
  relatedSlugs: string[];
  likes?: number;
  shares?: number;
  views?: number;
  status?: 'borrador' | 'revision' | 'publicado' | 'programado' | 'archivado' | 'papelera';
  scheduledAt?: string;
  revisions?: any[];
}

export interface CharacterImage {
  url: string;
  caption: string;
  title?: string;
  credit?: string;
}

export interface CharacterProfile {
  id: string;
  slug: string;
  name: string;
  alias: string;
  role: string;
  status: 'Confirmado' | 'Especulativo';
  faction: string;
  bio: string;
  story?: {
    heading: string;
    paragraphs: string[];
  }[];
  mainImage?: string;
  gallery?: CharacterImage[];
  personalData?: {
    age?: string;
    origin?: string;
    specialty?: string;
    favWeapon?: string;
    favVehicle?: string;
  };
  voiceActor?: string;
  skills?: { name: string; level: number; description: string }[];
  keyQuotes?: string[];
  relatedArticleSlugs?: string[];
  imageBadge?: string;
}

export interface VehicleSpecs {
  id: string;
  slug: string;
  name: string;
  manufacturer: string;
  classType: 'Superdeportivo' | 'Muscle' | 'Clásico' | 'Todoterreno' | 'Lancha' | 'Aeronave';
  realLifeInspiration: string;
  topSpeedKmh: number;
  accelerationScore: number; // 0-100
  handlingScore: number;     // 0-100
  brakingScore: number;      // 0-100
  capacitySeats: number;
  customizationTier: 'Básica' | 'Avanzada' | 'Completa (Taller Clandestino)';
  description: string;
}

export interface WeaponSpecs {
  id: string;
  slug: string;
  name: string;
  manufacturer: string;
  type: 'Pistola' | 'Fusil de Asalto' | 'Subfusil' | 'Escopeta' | 'Tirador Selecto' | 'Cuerpo a Cuerpo' | 'Explosivo';
  damageScore: number;       // 0-100
  fireRateRpm: number;
  accuracyScore: number;     // 0-100
  magazineCapacity: string;
  rangeEffective: string;
  attachmentsSupported: string[];
  description: string;
}

export interface MapDistrict {
  id: string;
  slug: string;
  name: string;
  type: 'Distrito Metropolitano' | 'Condado Industrial' | 'Parque Natural' | 'Archipiélago';
  dangerLevel: 'Bajo (Vigilancia Alta)' | 'Medio' | 'Alto (Bandas Callejeras)' | 'Extremo (Fauna y Clandestinidad)';
  policeResponseTime: string;
  keyLocations: string[];
  description: string;
}

export interface Comment {
  id: string;
  articleSlug: string;
  authorName: string;
  content: string;
  createdAt: string;
  likes: number;
}
