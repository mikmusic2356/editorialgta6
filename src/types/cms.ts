import { Article, MainCategorySlug, ContentVerificationType, Author, ImageAsset } from './index';

export type ArticleStatus = 
  | 'borrador' 
  | 'revision' 
  | 'publicado' 
  | 'programado' 
  | 'archivado' 
  | 'papelera';

export interface ArticleRevision {
  id: string;
  version: number;
  timestamp: string;
  authorName: string;
  summary: string;
  title: string;
  excerpt: string;
  contentLead: string;
  rawMarkdown?: string;
}

export interface CMSArticle extends Article {
  status: ArticleStatus;
  subtitle?: string;
  canonicalUrl?: string;
  scheduledAt?: string; // ISO date for scheduled publication
  galleryImages?: ImageAsset[];
  revisions?: ArticleRevision[];
  hashtags?: string[];
  isAiGenerated?: boolean;
  aiPromptContext?: string;
  deletedAt?: string;
}

export interface MediaItem {
  id: string;
  url: string;
  name: string;
  alt: string;
  title: string;
  caption: string;
  credit: string;
  sizeKb: number;
  dimensions: string;
  mimeType: string;
  createdAt: string;
}

export interface TagItem {
  id: string;
  name: string;
  slug: string;
  isHashtag: boolean;
  description?: string;
  articleCount: number;
}

export interface AuthorItem {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  bio: string;
  socialTwitter?: string;
  socialInstagram?: string;
  socialYoutube?: string;
  socialTiktok?: string;
  socialTwitch?: string;
  socialWebsite?: string;
  isAiAgent?: boolean;
  articlesCount: number;
  order?: number;
}

export interface StaticPage {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  content: string;
  lastUpdated: string;
  isPublished: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface NavigationMenuItem {
  id: string;
  label: string;
  url: string;
  order: number;
  parentId?: string | null;
  children?: NavigationMenuItem[];
  target?: '_self' | '_blank';
}

export interface SiteSettings {
  siteName: string;
  siteTagline: string;
  siteUrl: string;
  contactEmail: string;
  timezone: string;
  logoUrl: string;
  faviconUrl: string;
  adsenseClientId: string;
  adsenseEnabled: boolean;
  analyticsId: string;
  defaultOgImage: string;
  twitterHandle: string;
  metaDescription: string;
}

export interface CookieConsentState {
  hasAnswered: boolean;
  necessary: boolean;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
  consentDate?: string;
  anonymousUserId?: string;
}

export interface UserConsentLog {
  id: string;
  anonymousUserId: string;
  decision: 'all' | 'essential_only' | 'custom';
  necessary: boolean;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
  userAgent?: string;
  deviceType?: 'desktop' | 'mobile' | 'tablet';
  browser?: string;
  ipAnonymized?: string;
  source?: 'banner' | 'modal' | 'admin_panel' | 'footer_settings';
}

export type TrafficSourceType = 'google' | 'facebook' | 'twitter' | 'youtube' | 'tiktok' | 'instagram' | 'direct' | 'other';

export interface VisitorTrafficLog {
  id: string;
  visitorId: string;
  pagePath: string;
  pageTitle: string;
  referrer: string;
  referrerSource: TrafficSourceType;
  country: string;
  countryCode: string;
  city?: string;
  language: string;
  ipAnonymized: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  timestamp: string;
}

export interface AIProposal {
  id: string;
  type: 'new_draft' | 'update_proposal';
  targetArticleSlug?: string;
  targetArticleTitle?: string;
  title: string;
  excerpt: string;
  category: MainCategorySlug;
  subcategorySlug: string;
  tags: string[];
  proposedContent: string;
  changeSummary?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  aiModel: string;
}

export interface HeroBanner {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  imageUrl: string;
  ctaText: string;
  ctaActionType: 'article' | 'category' | 'url';
  ctaTarget: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

export interface BreakingNewsItem {
  id: string;
  text: string;
  badge?: string;
  linkType?: 'article' | 'category' | 'url';
  linkTarget?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
}

export type UserRole = 'Administrador' | 'Editor' | 'Autor' | 'IA / API Engine';
