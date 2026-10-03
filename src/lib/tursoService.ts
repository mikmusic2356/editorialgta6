import { turso, initDatabaseSchema } from './turso';
import { CMSArticle, ArticleStatus, ArticleRevision, MediaItem, TagItem, AuthorItem, StaticPage, NavigationMenuItem, SiteSettings, CookieConsentState, UserConsentLog, VisitorTrafficLog, AIProposal, HeroBanner, BreakingNewsItem } from '../types/cms';
import { MainCategory, SubCategory, MainCategorySlug, ContentVerificationType } from '../types';
import { ARTICLES } from '../data/articles';
import { MAIN_CATEGORIES } from '../data/categories';

/**
 * Service to sync and query all CMS data seamlessly between Turso Cloud DB and Local Cache
 */

function safeJsonParse<T>(jsonStr: any, fallback: T): T {
  if (!jsonStr) return fallback;
  if (typeof jsonStr === 'object') return jsonStr;
  try {
    const parsed = JSON.parse(jsonStr);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (e) {
    return fallback;
  }
}

export const tursoService = {
  // --- Initialization & Migration ---
  async initializeAndSeed(initialData: {
    articles: CMSArticle[];
    categories: MainCategory[];
    authors: AuthorItem[];
    tags: TagItem[];
    media: MediaItem[];
    banners: HeroBanner[];
    breakingNews: BreakingNewsItem[];
    staticPages: StaticPage[];
    settings: SiteSettings;
  }) {
    await initDatabaseSchema();

    // 1. Seed Articles if empty
    try {
      const artCountRes = await turso.execute('SELECT COUNT(*) as count FROM articles');
      const artCount = Number(artCountRes.rows[0]?.count || 0);
      if (artCount === 0 && initialData.articles.length > 0) {
        console.log(`🌱 Seeding ${initialData.articles.length} articles to Turso DB...`);
        for (const art of initialData.articles) {
          await this.saveArticle(art);
        }
      }
    } catch (e) {
      console.error('Error seeding articles:', e);
    }

    // 2. Seed Categories if empty
    try {
      const catCountRes = await turso.execute('SELECT COUNT(*) as count FROM categories');
      const catCount = Number(catCountRes.rows[0]?.count || 0);
      if (catCount === 0 && initialData.categories.length > 0) {
        console.log(`🌱 Seeding ${initialData.categories.length} categories to Turso DB...`);
        for (const cat of initialData.categories) {
          await this.saveCategory(cat);
        }
      }
    } catch (e) {
      console.error('Error seeding categories:', e);
    }

    // 3. Seed Authors if empty
    try {
      const authCountRes = await turso.execute('SELECT COUNT(*) as count FROM authors');
      const authCount = Number(authCountRes.rows[0]?.count || 0);
      if (authCount === 0 && initialData.authors.length > 0) {
        for (const auth of initialData.authors) {
          await this.saveAuthor(auth);
        }
      }
    } catch (e) {
      console.error('Error seeding authors:', e);
    }

    // 4. Seed Tags if empty
    try {
      const tagCountRes = await turso.execute('SELECT COUNT(*) as count FROM tags');
      const tagCount = Number(tagCountRes.rows[0]?.count || 0);
      if (tagCount === 0 && initialData.tags.length > 0) {
        for (const tag of initialData.tags) {
          await this.saveTag(tag);
        }
      }
    } catch (e) {
      console.error('Error seeding tags:', e);
    }

    // 5. Seed Media if empty
    try {
      const medCountRes = await turso.execute('SELECT COUNT(*) as count FROM media');
      const medCount = Number(medCountRes.rows[0]?.count || 0);
      if (medCount === 0 && initialData.media.length > 0) {
        for (const m of initialData.media) {
          await this.saveMedia(m);
        }
      }
    } catch (e) {
      console.error('Error seeding media:', e);
    }

    // 6. Seed Banners if empty
    try {
      const banCountRes = await turso.execute('SELECT COUNT(*) as count FROM banners');
      const banCount = Number(banCountRes.rows[0]?.count || 0);
      if (banCount === 0 && initialData.banners.length > 0) {
        for (const b of initialData.banners) {
          await this.saveBanner(b);
        }
      }
    } catch (e) {
      console.error('Error seeding banners:', e);
    }

    // 7. Seed Breaking News if empty
    try {
      const bnCountRes = await turso.execute('SELECT COUNT(*) as count FROM breaking_news');
      const bnCount = Number(bnCountRes.rows[0]?.count || 0);
      if (bnCount === 0 && initialData.breakingNews.length > 0) {
        for (const bn of initialData.breakingNews) {
          await this.saveBreakingNews(bn);
        }
      }
    } catch (e) {
      console.error('Error seeding breaking news:', e);
    }

    // 8. Seed Static Pages if empty
    try {
      const spCountRes = await turso.execute('SELECT COUNT(*) as count FROM static_pages');
      const spCount = Number(spCountRes.rows[0]?.count || 0);
      if (spCount === 0 && initialData.staticPages.length > 0) {
        for (const sp of initialData.staticPages) {
          await this.saveStaticPage(sp);
        }
      }
    } catch (e) {
      console.error('Error seeding static pages:', e);
    }

    // 9. Seed Site Settings
    try {
      await this.saveSettings(initialData.settings);
    } catch (e) {
      console.error('Error saving initial settings:', e);
    }
  },

  // --- Articles ---
  async getArticles(): Promise<CMSArticle[]> {
    try {
      const res = await turso.execute('SELECT * FROM articles ORDER BY published_at DESC');
      return res.rows.map((r: any) => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        subtitle: r.subtitle || undefined,
        seoTitle: r.seo_title || undefined,
        seoDescription: r.seo_description || undefined,
        canonicalUrl: r.canonical_url || undefined,
        excerpt: r.excerpt || '',
        category: (r.category || 'gta-6') as MainCategorySlug,
        subcategorySlug: r.subcategory_slug || undefined,
        categoryLabel: r.category_label || 'GTA 6',
        verificationType: (r.verification_type || 'oficial') as ContentVerificationType,
        author: safeJsonParse(r.author_json, {
          name: 'Marcos Valiente',
          role: 'Jefe de Redacción',
          avatar: '/images/Personajes/Brian_Heder_01.webp',
          bio: 'Especialista en sagas de mundo abierto.'
        }),
        publishedAt: r.published_at || new Date().toISOString(),
        updatedAt: r.updated_at || r.published_at || new Date().toISOString(),
        scheduledAt: r.scheduled_at || undefined,
        readTimeMinutes: Number(r.read_time_minutes || 5),
        tags: safeJsonParse(r.tags_json, ['GTA 6', 'Leonida']),
        likes: typeof r.likes === 'number' ? r.likes : (Number(r.likes) || 0),
        shares: typeof r.shares === 'number' ? r.shares : (Number(r.shares) || 0),
        views: typeof r.views === 'number' ? r.views : (Number(r.views) || 0),
        isHero: Boolean(r.is_hero),
        isTrending: Boolean(r.is_trending),
        isLatest: Boolean(r.is_latest),
        featuredImage: safeJsonParse(r.featured_image_json, {
          url: '/images/Artes_y_Ediciones/Official_Cover_Art_landscape.webp',
          alt: r.title || 'GTA 6'
        }),
        youtubeVideoId: r.youtube_video_id || undefined,
        schemaType: r.schema_type || 'NewsArticle',
        content: safeJsonParse(r.content_json, {
          leadText: r.excerpt || '',
          sections: []
        }),
        relatedSlugs: safeJsonParse(r.related_slugs_json, []),
        status: (r.status || 'publicado') as ArticleStatus,
        revisions: safeJsonParse(r.revisions_json, [])
      }));
    } catch (e) {
      console.error('Error fetching articles from Turso:', e);
      return [];
    }
  },

  async saveArticle(art: CMSArticle) {
    try {
      await turso.execute({
        sql: `
          INSERT INTO articles (
            id, slug, title, subtitle, seo_title, seo_description, canonical_url,
            excerpt, category, subcategory_slug, category_label, verification_type,
            author_json, published_at, updated_at, scheduled_at, read_time_minutes,
            tags_json, likes, shares, views, is_hero, is_trending, is_latest, featured_image_json,
            youtube_video_id, schema_type, content_json, related_slugs_json, status, revisions_json
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            slug=excluded.slug,
            title=excluded.title,
            subtitle=excluded.subtitle,
            seo_title=excluded.seo_title,
            seo_description=excluded.seo_description,
            canonical_url=excluded.canonical_url,
            excerpt=excluded.excerpt,
            category=excluded.category,
            subcategory_slug=excluded.subcategory_slug,
            category_label=excluded.category_label,
            verification_type=excluded.verification_type,
            author_json=excluded.author_json,
            published_at=excluded.published_at,
            updated_at=excluded.updated_at,
            scheduled_at=excluded.scheduled_at,
            read_time_minutes=excluded.read_time_minutes,
            tags_json=excluded.tags_json,
            likes=excluded.likes,
            shares=excluded.shares,
            views=excluded.views,
            is_hero=excluded.is_hero,
            is_trending=excluded.is_trending,
            is_latest=excluded.is_latest,
            featured_image_json=excluded.featured_image_json,
            youtube_video_id=excluded.youtube_video_id,
            schema_type=excluded.schema_type,
            content_json=excluded.content_json,
            related_slugs_json=excluded.related_slugs_json,
            status=excluded.status,
            revisions_json=excluded.revisions_json
        `,
        args: [
          art.id,
          art.slug,
          art.title,
          art.subtitle || null,
          art.seoTitle || null,
          art.seoDescription || null,
          art.canonicalUrl || null,
          art.excerpt,
          art.category,
          art.subcategorySlug || null,
          art.categoryLabel,
          art.verificationType || 'oficial',
          JSON.stringify(art.author),
          art.publishedAt,
          art.updatedAt || art.publishedAt,
          art.scheduledAt || null,
          art.readTimeMinutes || 5,
          JSON.stringify(art.tags || []),
          Math.max(0, Math.floor(Number(art.likes) || 0)),
          Math.max(0, Math.floor(Number(art.shares) || 0)),
          Math.max(0, Math.floor(Number(art.views) || 0)),
          art.isHero ? 1 : 0,
          art.isTrending ? 1 : 0,
          art.isLatest ? 1 : 0,
          JSON.stringify(art.featuredImage),
          art.youtubeVideoId || null,
          art.schemaType || 'NewsArticle',
          JSON.stringify(art.content),
          JSON.stringify(art.relatedSlugs || []),
          art.status || 'publicado',
          JSON.stringify(art.revisions || [])
        ]
      });
    } catch (e) {
      console.error(`Error saving article ${art.id} to Turso:`, e);
    }
  },

  async deleteArticle(id: string) {
    try {
      await turso.execute({
        sql: 'DELETE FROM articles WHERE id = ?',
        args: [id]
      });
    } catch (e) {
      console.error(`Error deleting article ${id} from Turso:`, e);
    }
  },

  // --- Categories ---
  async getCategories(): Promise<MainCategory[]> {
    try {
      const res = await turso.execute('SELECT * FROM categories');
      return res.rows.map((r: any) => ({
        slug: r.slug as MainCategorySlug,
        name: r.name,
        tagline: r.tagline || '',
        shortDesc: r.short_desc || '',
        color: r.color || '#ff6486',
        iconName: r.icon_name || 'Flame',
        subcategories: r.subcategories_json ? JSON.parse(r.subcategories_json) : []
      }));
    } catch (e) {
      console.error('Error fetching categories from Turso:', e);
      return [];
    }
  },

  async saveCategory(cat: MainCategory) {
    try {
      await turso.execute({
        sql: `
          INSERT INTO categories (slug, name, tagline, short_desc, color, icon_name, subcategories_json)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(slug) DO UPDATE SET
            name=excluded.name,
            tagline=excluded.tagline,
            short_desc=excluded.short_desc,
            color=excluded.color,
            icon_name=excluded.icon_name,
            subcategories_json=excluded.subcategories_json
        `,
        args: [
          cat.slug,
          cat.name,
          cat.tagline || null,
          cat.shortDesc || null,
          cat.color || '#ff6486',
          cat.iconName || 'Flame',
          JSON.stringify(cat.subcategories || [])
        ]
      });
    } catch (e) {
      console.error(`Error saving category ${cat.slug} to Turso:`, e);
    }
  },

  async deleteCategory(slug: string) {
    try {
      await turso.execute({
        sql: 'DELETE FROM categories WHERE slug = ?',
        args: [slug]
      });
    } catch (e) {
      console.error(`Error deleting category ${slug} from Turso:`, e);
    }
  },

  // --- Authors ---
  async getAuthors(): Promise<AuthorItem[]> {
    try {
      const res = await turso.execute('SELECT * FROM authors ORDER BY author_order ASC, name ASC');
      return res.rows.map((r: any) => ({
        id: r.id,
        name: r.name,
        role: r.role,
        email: r.email || '',
        avatar: r.avatar,
        bio: r.bio || '',
        socialTwitter: r.social_twitter || undefined,
        socialInstagram: r.social_instagram || undefined,
        socialYoutube: r.social_youtube || undefined,
        socialTiktok: r.social_tiktok || undefined,
        socialTwitch: r.social_twitch || undefined,
        socialWebsite: r.social_website || undefined,
        isAiAgent: Boolean(r.is_ai_agent),
        articlesCount: Number(r.articles_count || 0),
        order: Number(r.author_order || 0)
      }));
    } catch (e) {
      console.error('Error fetching authors from Turso:', e);
      return [];
    }
  },

  async saveAuthor(auth: AuthorItem) {
    try {
      await turso.execute({
        sql: `
          INSERT INTO authors (
            id, name, role, email, avatar, bio,
            social_twitter, social_instagram, social_youtube, social_tiktok, social_twitch, social_website,
            is_ai_agent, articles_count, author_order
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            name=excluded.name,
            role=excluded.role,
            email=excluded.email,
            avatar=excluded.avatar,
            bio=excluded.bio,
            social_twitter=excluded.social_twitter,
            social_instagram=excluded.social_instagram,
            social_youtube=excluded.social_youtube,
            social_tiktok=excluded.social_tiktok,
            social_twitch=excluded.social_twitch,
            social_website=excluded.social_website,
            is_ai_agent=excluded.is_ai_agent,
            articles_count=excluded.articles_count,
            author_order=excluded.author_order
        `,
        args: [
          auth.id,
          auth.name,
          auth.role,
          auth.email || null,
          auth.avatar,
          auth.bio || null,
          auth.socialTwitter || null,
          auth.socialInstagram || null,
          auth.socialYoutube || null,
          auth.socialTiktok || null,
          auth.socialTwitch || null,
          auth.socialWebsite || null,
          auth.isAiAgent ? 1 : 0,
          auth.articlesCount || 0,
          auth.order || 0
        ]
      });
    } catch (e) {
      console.error(`Error saving author ${auth.id} to Turso:`, e);
    }
  },

  async deleteAuthor(id: string) {
    try {
      await turso.execute({
        sql: 'DELETE FROM authors WHERE id = ?',
        args: [id]
      });
    } catch (e) {
      console.error(`Error deleting author ${id} from Turso:`, e);
    }
  },

  // --- Tags ---
  async getTags(): Promise<TagItem[]> {
    try {
      const res = await turso.execute('SELECT * FROM tags');
      return res.rows.map((r: any) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        isHashtag: Boolean(r.is_hashtag),
        articleCount: Number(r.article_count || 0),
        description: r.description || undefined
      }));
    } catch (e) {
      console.error('Error fetching tags from Turso:', e);
      return [];
    }
  },

  async saveTag(tag: TagItem) {
    try {
      await turso.execute({
        sql: `
          INSERT INTO tags (id, name, slug, is_hashtag, article_count, description)
          VALUES (?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            name=excluded.name,
            slug=excluded.slug,
            is_hashtag=excluded.is_hashtag,
            article_count=excluded.article_count,
            description=excluded.description
        `,
        args: [
          tag.id,
          tag.name,
          tag.slug,
          tag.isHashtag ? 1 : 0,
          tag.articleCount || 0,
          tag.description || null
        ]
      });
    } catch (e) {
      console.error(`Error saving tag ${tag.id} to Turso:`, e);
    }
  },

  async deleteTag(id: string) {
    try {
      await turso.execute({
        sql: 'DELETE FROM tags WHERE id = ?',
        args: [id]
      });
    } catch (e) {
      console.error(`Error deleting tag ${id} from Turso:`, e);
    }
  },

  // --- Media ---
  async getMedia(): Promise<MediaItem[]> {
    try {
      const res = await turso.execute('SELECT * FROM media ORDER BY created_at DESC');
      return res.rows.map((r: any) => ({
        id: r.id,
        url: r.url,
        name: r.name,
        alt: r.alt || '',
        title: r.title || '',
        caption: r.caption || '',
        credit: r.credit || '',
        sizeKb: Number(r.size_kb || 0),
        dimensions: r.dimensions || '',
        mimeType: r.mime_type || '',
        createdAt: r.created_at
      }));
    } catch (e) {
      console.error('Error fetching media from Turso:', e);
      return [];
    }
  },

  async saveMedia(m: MediaItem) {
    try {
      await turso.execute({
        sql: `
          INSERT INTO media (id, url, name, alt, title, caption, credit, size_kb, dimensions, mime_type, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            url=excluded.url,
            name=excluded.name,
            alt=excluded.alt,
            title=excluded.title,
            caption=excluded.caption,
            credit=excluded.credit,
            size_kb=excluded.size_kb,
            dimensions=excluded.dimensions,
            mime_type=excluded.mime_type
        `,
        args: [
          m.id,
          m.url,
          m.name,
          m.alt || '',
          m.title || '',
          m.caption || '',
          m.credit || '',
          m.sizeKb || 0,
          m.dimensions || '',
          m.mimeType || '',
          m.createdAt
        ]
      });
    } catch (e) {
      console.error(`Error saving media ${m.id} to Turso:`, e);
    }
  },

  async deleteMedia(id: string) {
    try {
      await turso.execute({
        sql: 'DELETE FROM media WHERE id = ?',
        args: [id]
      });
    } catch (e) {
      console.error(`Error deleting media ${id} from Turso:`, e);
    }
  },

  // --- Banners ---
  async getBanners(): Promise<HeroBanner[]> {
    try {
      const res = await turso.execute('SELECT * FROM banners ORDER BY banner_order ASC');
      return res.rows.map((r: any) => ({
        id: r.id,
        title: r.title,
        subtitle: r.subtitle || undefined,
        badge: r.badge || undefined,
        imageUrl: r.image_url,
        ctaText: r.cta_text || undefined,
        ctaActionType: r.cta_action_type as any,
        ctaTarget: r.cta_target || undefined,
        order: Number(r.banner_order || 0),
        isActive: Boolean(r.is_active),
        createdAt: r.created_at
      }));
    } catch (e) {
      console.error('Error fetching banners from Turso:', e);
      return [];
    }
  },

  async saveBanner(b: HeroBanner) {
    try {
      await turso.execute({
        sql: `
          INSERT INTO banners (id, title, subtitle, badge, image_url, cta_text, cta_action_type, cta_target, banner_order, is_active, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            title=excluded.title,
            subtitle=excluded.subtitle,
            badge=excluded.badge,
            image_url=excluded.image_url,
            cta_text=excluded.cta_text,
            cta_action_type=excluded.cta_action_type,
            cta_target=excluded.cta_target,
            banner_order=excluded.banner_order,
            is_active=excluded.is_active
        `,
        args: [
          b.id,
          b.title,
          b.subtitle || null,
          b.badge || null,
          b.imageUrl,
          b.ctaText || null,
          b.ctaActionType || null,
          b.ctaTarget || null,
          b.order || 0,
          b.isActive ? 1 : 0,
          b.createdAt
        ]
      });
    } catch (e) {
      console.error(`Error saving banner ${b.id} to Turso:`, e);
    }
  },

  async deleteBanner(id: string) {
    try {
      await turso.execute({
        sql: 'DELETE FROM banners WHERE id = ?',
        args: [id]
      });
    } catch (e) {
      console.error(`Error deleting banner ${id} from Turso:`, e);
    }
  },

  // --- Breaking News ---
  async getBreakingNews(): Promise<BreakingNewsItem[]> {
    try {
      const res = await turso.execute('SELECT * FROM breaking_news ORDER BY news_order ASC');
      return res.rows.map((r: any) => ({
        id: r.id,
        text: r.text,
        badge: r.badge || undefined,
        linkType: r.link_type as any,
        linkTarget: r.link_target || undefined,
        isActive: Boolean(r.is_active),
        order: Number(r.news_order || 0),
        createdAt: r.created_at
      }));
    } catch (e) {
      console.error('Error fetching breaking news from Turso:', e);
      return [];
    }
  },

  async saveBreakingNews(bn: BreakingNewsItem) {
    try {
      await turso.execute({
        sql: `
          INSERT INTO breaking_news (id, text, badge, link_type, link_target, is_active, news_order, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            text=excluded.text,
            badge=excluded.badge,
            link_type=excluded.link_type,
            link_target=excluded.link_target,
            is_active=excluded.is_active,
            news_order=excluded.news_order
        `,
        args: [
          bn.id,
          bn.text,
          bn.badge || null,
          bn.linkType || null,
          bn.linkTarget || null,
          bn.isActive ? 1 : 0,
          bn.order || 0,
          bn.createdAt
        ]
      });
    } catch (e) {
      console.error(`Error saving breaking news ${bn.id} to Turso:`, e);
    }
  },

  async deleteBreakingNews(id: string) {
    try {
      await turso.execute({
        sql: 'DELETE FROM breaking_news WHERE id = ?',
        args: [id]
      });
    } catch (e) {
      console.error(`Error deleting breaking news ${id} from Turso:`, e);
    }
  },

  // --- Static Pages ---
  async getStaticPages(): Promise<StaticPage[]> {
    try {
      const res = await turso.execute('SELECT * FROM static_pages');
      return res.rows.map((r: any) => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        subtitle: r.subtitle || undefined,
        content: r.content,
        lastUpdated: r.last_updated,
        isPublished: Boolean(r.is_published),
        seoTitle: r.seo_title || undefined,
        seoDescription: r.seo_description || undefined
      }));
    } catch (e) {
      console.error('Error fetching static pages from Turso:', e);
      return [];
    }
  },

  async saveStaticPage(sp: StaticPage) {
    try {
      await turso.execute({
        sql: `
          INSERT INTO static_pages (id, slug, title, subtitle, content, last_updated, is_published, seo_title, seo_description)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            slug=excluded.slug,
            title=excluded.title,
            subtitle=excluded.subtitle,
            content=excluded.content,
            last_updated=excluded.last_updated,
            is_published=excluded.is_published,
            seo_title=excluded.seo_title,
            seo_description=excluded.seo_description
        `,
        args: [
          sp.id,
          sp.slug,
          sp.title,
          sp.subtitle || null,
          sp.content,
          sp.lastUpdated,
          sp.isPublished ? 1 : 0,
          sp.seoTitle || null,
          sp.seoDescription || null
        ]
      });
    } catch (e) {
      console.error(`Error saving static page ${sp.id} to Turso:`, e);
    }
  },

  // --- Site Settings ---
  async getSettings(): Promise<SiteSettings | null> {
    try {
      const res = await turso.execute({
        sql: 'SELECT value_json FROM site_settings WHERE key = ?',
        args: ['general_settings']
      });
      if (res.rows.length > 0 && res.rows[0].value_json) {
        return JSON.parse(res.rows[0].value_json as string);
      }
      return null;
    } catch (e) {
      console.error('Error fetching settings from Turso:', e);
      return null;
    }
  },

  async saveSettings(settings: SiteSettings) {
    try {
      await turso.execute({
        sql: `
          INSERT INTO site_settings (key, value_json)
          VALUES (?, ?)
          ON CONFLICT(key) DO UPDATE SET value_json=excluded.value_json
        `,
        args: ['general_settings', JSON.stringify(settings)]
      });
    } catch (e) {
      console.error('Error saving settings to Turso:', e);
    }
  },

  // --- Cookie Consent Audit Logs ---
  async getConsentLogs(): Promise<UserConsentLog[]> {
    try {
      const res = await turso.execute('SELECT * FROM cookie_consent_logs ORDER BY timestamp DESC LIMIT 200');
      return res.rows.map((r: any) => ({
        id: r.id,
        anonymousUserId: r.anonymous_user_id,
        decision: r.decision as 'all' | 'essential_only' | 'custom',
        necessary: Boolean(r.necessary),
        preferences: Boolean(r.preferences),
        analytics: Boolean(r.analytics),
        marketing: Boolean(r.marketing),
        timestamp: r.timestamp,
        userAgent: r.user_agent || undefined,
        deviceType: r.device_type || 'desktop',
        browser: r.browser || 'Navegador Web',
        ipAnonymized: r.ip_anonymized || undefined,
        source: r.source || 'banner'
      }));
    } catch (e) {
      console.error('Error fetching consent logs from Turso:', e);
      return [];
    }
  },

  async saveConsentLog(log: UserConsentLog) {
    try {
      await turso.execute({
        sql: `
          INSERT INTO cookie_consent_logs (
            id, anonymous_user_id, decision, necessary, preferences, analytics, marketing,
            timestamp, user_agent, device_type, browser, ip_anonymized, source
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            decision=excluded.decision,
            necessary=excluded.necessary,
            preferences=excluded.preferences,
            analytics=excluded.analytics,
            marketing=excluded.marketing,
            timestamp=excluded.timestamp,
            source=excluded.source
        `,
        args: [
          log.id,
          log.anonymousUserId,
          log.decision,
          log.necessary ? 1 : 0,
          log.preferences ? 1 : 0,
          log.analytics ? 1 : 0,
          log.marketing ? 1 : 0,
          log.timestamp,
          log.userAgent || null,
          log.deviceType || 'desktop',
          log.browser || 'Navegador Web',
          log.ipAnonymized || null,
          log.source || 'banner'
        ]
      });
    } catch (e) {
      console.error(`Error saving consent log ${log.id} to Turso:`, e);
    }
  },

  async clearConsentLogs() {
    try {
      await turso.execute('DELETE FROM cookie_consent_logs');
    } catch (e) {
      console.error('Error clearing consent logs from Turso:', e);
    }
  },

  // --- Visitor Traffic & Location Analytics Logs ---
  async getVisitorTrafficLogs(): Promise<VisitorTrafficLog[]> {
    try {
      const res = await turso.execute('SELECT * FROM visitor_traffic_logs ORDER BY timestamp DESC LIMIT 300');
      return res.rows.map((r: any) => ({
        id: r.id,
        visitorId: r.visitor_id,
        pagePath: r.page_path,
        pageTitle: r.page_title || 'Página de KAIROSION',
        referrer: r.referrer || 'Directo',
        referrerSource: r.referrer_source as any,
        country: r.country || 'España',
        countryCode: r.country_code || 'ES',
        city: r.city || undefined,
        language: r.language || 'es-ES',
        ipAnonymized: r.ip_anonymized || '185.193.***.***',
        deviceType: (r.device_type || 'desktop') as any,
        browser: r.browser || 'Google Chrome',
        os: r.os || 'Windows',
        timestamp: r.timestamp
      }));
    } catch (e) {
      console.error('Error fetching visitor traffic logs from Turso:', e);
      return [];
    }
  },

  async saveVisitorTrafficLog(log: VisitorTrafficLog) {
    try {
      await turso.execute({
        sql: `
          INSERT INTO visitor_traffic_logs (
            id, visitor_id, page_path, page_title, referrer, referrer_source,
            country, country_code, city, language, ip_anonymized, device_type, browser, os, timestamp
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            page_path=excluded.page_path,
            page_title=excluded.page_title,
            timestamp=excluded.timestamp
        `,
        args: [
          log.id,
          log.visitorId,
          log.pagePath,
          log.pageTitle,
          log.referrer,
          log.referrerSource,
          log.country,
          log.countryCode,
          log.city || null,
          log.language,
          log.ipAnonymized,
          log.deviceType,
          log.browser,
          log.os,
          log.timestamp
        ]
      });
    } catch (e) {
      console.error(`Error saving visitor traffic log ${log.id} to Turso:`, e);
    }
  },

  async clearVisitorTrafficLogs() {
    try {
      await turso.execute('DELETE FROM visitor_traffic_logs');
    } catch (e) {
      console.error('Error clearing visitor traffic logs from Turso:', e);
    }
  }
};
