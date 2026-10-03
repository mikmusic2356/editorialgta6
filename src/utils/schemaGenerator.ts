import { Article, MainCategorySlug } from '../types';

export const SITE_URL = 'https://kairosion.online';
export const SITE_NAME = 'KAIROSION';
export const SITE_LOGO = `${SITE_URL}/logo.png`;

/**
 * Automatically determines the most appropriate Schema.org type for an article.
 * 
 * Rules:
 * - Explicit override on `article.schemaType` takes top precedence.
 * - 'noticias' -> 'NewsArticle'
 * - 'guias' with steps -> 'TechArticle' or 'Article'
 * - 'trucos-consejos', 'personajes', 'mapa', 'vehiculos', 'armas', 'gta-6', 'rockstar-games' -> 'Article'
 */
export function resolveArticleSchemaType(article: Article): 'NewsArticle' | 'Article' | 'TechArticle' {
  if (article.schemaType) {
    return article.schemaType;
  }

  if (article.category === 'noticias') {
    return 'NewsArticle';
  }

  if (article.category === 'guias' && article.content.sections?.some(s => s.steps && s.steps.length > 0)) {
    return 'TechArticle';
  }

  return 'Article';
}

/**
 * Calculates estimated word count from visible article content.
 */
export function calculateArticleWordCount(article: Article): number {
  if (!article) return 0;
  let text = article.content?.leadText || '';
  
  if (article.content?.sections && Array.isArray(article.content.sections)) {
    for (const section of article.content.sections) {
      if (section.heading) text += ' ' + section.heading;
      if (section.subheading) text += ' ' + section.subheading;
      if (section.paragraphs && Array.isArray(section.paragraphs)) {
        text += ' ' + section.paragraphs.join(' ');
      }
      if (section.calloutBox) {
        text += ' ' + (section.calloutBox.title || '') + ' ' + (section.calloutBox.content || '');
      }
      if (section.steps && Array.isArray(section.steps)) {
        for (const step of section.steps) {
          text += ' ' + (step.title || '') + ' ' + (step.description || '') + (step.hint ? ' ' + step.hint : '');
        }
      }
      if (section.quote?.text) text += ' ' + section.quote.text;
    }
  }

  if (article.content?.takeaways && Array.isArray(article.content.takeaways)) {
    text += ' ' + article.content.takeaways.join(' ');
  }

  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

/**
 * Generates the Schema.org Article / NewsArticle / TechArticle structured data JSON-LD.
 * Strictly adheres to Google Search Central requirements.
 */
export function generateArticleSchema(article: Article, baseUrl: string = SITE_URL) {
  if (!article) return {};
  const schemaType = resolveArticleSchemaType(article);
  const subPath = article.subcategorySlug && article.subcategorySlug !== 'all' ? `${article.subcategorySlug}/` : '';
  const canonicalUrl = `${baseUrl}/gta-6/${article.category || 'gta-6'}/${subPath}${article.slug}`;
  const wordCount = calculateArticleWordCount(article);

  const images: string[] = [];
  if (article.featuredImage?.url) {
    images.push(article.featuredImage.url);
  } else {
    // Default high-resolution OpenGraph card image
    images.push(`${baseUrl}/og-images/${article.slug}.jpg`);
  }

  const authorName = article.author?.name || 'KAIROSION Editorial';
  const authorRole = article.author?.role || 'Redacción';
  const tagsList = Array.isArray(article.tags) ? article.tags.join(', ') : 'GTA 6, Leonida';

  const baseSchema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "headline": article.seoTitle || article.title || 'KAIROSION',
    "description": article.seoDescription || article.excerpt || '',
    "image": images,
    "datePublished": article.publishedAt || new Date().toISOString(),
    "dateModified": article.updatedAt || article.publishedAt || new Date().toISOString(),
    "inLanguage": "es-ES",
    "articleSection": article.categoryLabel || 'GTA 6',
    "wordCount": wordCount,
    "keywords": tagsList,
    "author": {
      "@type": "Person",
      "name": authorName,
      "jobTitle": authorRole,
      "url": `${baseUrl}/autores/${authorName.toLowerCase().replace(/\s+/g, '-')}`
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": SITE_LOGO,
        "width": 600,
        "height": 60
      }
    }
  };

  // TechArticle specific properties if applicable
  if (schemaType === 'TechArticle' && article.difficulty) {
    baseSchema.proficiencyLevel = article.difficulty;
  }

  return baseSchema;
}

/**
 * Generates BreadcrumbList structured data for any hierarchical route.
 */
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[],
  baseUrl: string = SITE_URL
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`
    }))
  };
}

/**
 * Generates VideoObject structured data when an article features a relevant video.
 */
export function generateVideoSchema(article: Article, baseUrl: string = SITE_URL) {
  if (!article.youtubeVideoId) return null;

  const videoUrl = `https://www.youtube.com/watch?v=${article.youtubeVideoId}`;
  const embedUrl = `https://www.youtube.com/embed/${article.youtubeVideoId}`;

  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": `${article.title} - Material Audiovisual`,
    "description": article.seoDescription || article.excerpt,
    "thumbnailUrl": [
      `https://img.youtube.com/vi/${article.youtubeVideoId}/maxresdefault.jpg`,
      `https://img.youtube.com/vi/${article.youtubeVideoId}/hqdefault.jpg`
    ],
    "uploadDate": article.publishedAt,
    "embedUrl": embedUrl,
    "contentUrl": videoUrl
  };
}

/**
 * Generates a unified @graph array containing all relevant Schemas for a page.
 * This is the gold standard approach recommended by Schema.org and Google Search.
 */
export function generatePageGraphSchema(
  article: Article,
  breadcrumbs: { name: string; url: string }[],
  baseUrl: string = SITE_URL
) {
  const articleSchema = generateArticleSchema(article, baseUrl);
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs, baseUrl);
  const videoSchema = generateVideoSchema(article, baseUrl);

  const graph: any[] = [
    articleSchema,
    breadcrumbSchema
  ];

  if (videoSchema) {
    graph.push(videoSchema);
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph
  };
}
