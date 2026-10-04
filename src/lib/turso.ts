import { createClient } from "@libsql/client/web";

const rawUrl = import.meta.env.VITE_TURSO_DATABASE_URL || "https://dbkairosion-mikmusic2356.aws-us-east-2.turso.io";
const authToken = import.meta.env.VITE_TURSO_AUTH_TOKEN || "";

// Normalize URL: replace libsql:// with https:// for browser HTTP fetch client
const url = rawUrl.replace(/^libsql:\/\//, "https://");

export const turso = createClient({
  url,
  authToken,
});

/**
 * Initializes Turso database tables if they do not exist.
 */
export async function initDatabaseSchema() {
  try {
    // 1. Articles table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        subtitle TEXT,
        seo_title TEXT,
        seo_description TEXT,
        canonical_url TEXT,
        excerpt TEXT,
        category TEXT NOT NULL,
        subcategory_slug TEXT,
        category_label TEXT,
        verification_type TEXT,
        author_json TEXT NOT NULL,
        published_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        scheduled_at TEXT,
        read_time_minutes INTEGER DEFAULT 5,
        tags_json TEXT,
        likes INTEGER DEFAULT 0,
        shares INTEGER DEFAULT 0,
        views INTEGER DEFAULT 0,
        is_hero INTEGER DEFAULT 0,
        is_trending INTEGER DEFAULT 0,
        is_latest INTEGER DEFAULT 0,
        featured_image_json TEXT NOT NULL,
        youtube_video_id TEXT,
        schema_type TEXT,
        content_json TEXT NOT NULL,
        related_slugs_json TEXT,
        status TEXT NOT NULL DEFAULT 'publicado',
        revisions_json TEXT
      )
    `);

    // Auto-migrate columns for existing Turso tables
    try { await turso.execute('ALTER TABLE articles ADD COLUMN likes INTEGER DEFAULT 0'); } catch (e) { /* ignore */ }
    try { await turso.execute('ALTER TABLE articles ADD COLUMN shares INTEGER DEFAULT 0'); } catch (e) { /* ignore */ }
    try { await turso.execute('ALTER TABLE articles ADD COLUMN views INTEGER DEFAULT 0'); } catch (e) { /* ignore */ }

    // 2. Categories table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        slug TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        tagline TEXT,
        short_desc TEXT,
        color TEXT,
        icon_name TEXT,
        subcategories_json TEXT NOT NULL
      )
    `);

    // 3. Authors table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS authors (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        email TEXT,
        avatar TEXT NOT NULL,
        bio TEXT,
        social_twitter TEXT,
        social_instagram TEXT,
        social_youtube TEXT,
        social_tiktok TEXT,
        social_twitch TEXT,
        social_website TEXT,
        is_ai_agent INTEGER DEFAULT 0,
        articles_count INTEGER DEFAULT 0,
        author_order INTEGER DEFAULT 0
      )
    `);

    // Safe column migrations for existing authors table
    const authorColumnsToEnsure = [
      'ALTER TABLE authors ADD COLUMN social_instagram TEXT',
      'ALTER TABLE authors ADD COLUMN social_youtube TEXT',
      'ALTER TABLE authors ADD COLUMN social_tiktok TEXT',
      'ALTER TABLE authors ADD COLUMN social_twitch TEXT',
      'ALTER TABLE authors ADD COLUMN social_website TEXT',
      'ALTER TABLE authors ADD COLUMN author_order INTEGER DEFAULT 0'
    ];
    for (const ddl of authorColumnsToEnsure) {
      try {
        await turso.execute(ddl);
      } catch {
        // Ignore column already exists errors
      }
    }

    // 4. Tags table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS tags (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        is_hashtag INTEGER DEFAULT 0,
        article_count INTEGER DEFAULT 0,
        description TEXT
      )
    `);

    // 5. Media table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS media (
        id TEXT PRIMARY KEY,
        url TEXT NOT NULL,
        name TEXT NOT NULL,
        alt TEXT,
        title TEXT,
        caption TEXT,
        credit TEXT,
        size_kb INTEGER,
        dimensions TEXT,
        mime_type TEXT,
        created_at TEXT NOT NULL
      )
    `);

    // 6. Banners table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS banners (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        subtitle TEXT,
        badge TEXT,
        image_url TEXT NOT NULL,
        cta_text TEXT,
        cta_action_type TEXT,
        cta_target TEXT,
        banner_order INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        created_at TEXT NOT NULL
      )
    `);

    // 7. Breaking News table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS breaking_news (
        id TEXT PRIMARY KEY,
        text TEXT NOT NULL,
        badge TEXT,
        link_type TEXT,
        link_target TEXT,
        is_active INTEGER DEFAULT 1,
        news_order INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
      )
    `);

    // 8. Static Pages table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS static_pages (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        subtitle TEXT,
        content TEXT NOT NULL,
        last_updated TEXT NOT NULL,
        is_published INTEGER DEFAULT 1,
        seo_title TEXT,
        seo_description TEXT
      )
    `);

    // 9. Site Settings table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS site_settings (
        key TEXT PRIMARY KEY,
        value_json TEXT NOT NULL
      )
    `);

    // 10. AI Proposals table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS ai_proposals (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        target_article_slug TEXT,
        target_article_title TEXT,
        title TEXT NOT NULL,
        excerpt TEXT,
        category TEXT NOT NULL,
        subcategory_slug TEXT,
        tags_json TEXT,
        change_summary TEXT,
        proposed_content TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TEXT NOT NULL,
        ai_model TEXT
      )
    `);

    // 11. Cookie Consent Logs table (GDPR & ePrivacy audit trail)
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS cookie_consent_logs (
        id TEXT PRIMARY KEY,
        anonymous_user_id TEXT NOT NULL,
        decision TEXT NOT NULL,
        necessary INTEGER DEFAULT 1,
        preferences INTEGER DEFAULT 0,
        analytics INTEGER DEFAULT 0,
        marketing INTEGER DEFAULT 0,
        timestamp TEXT NOT NULL,
        user_agent TEXT,
        device_type TEXT,
        browser TEXT,
        ip_anonymized TEXT,
        source TEXT
      )
    `);

    // 12. Visitor Traffic & Analytics Logs table (Locations, IP, Devices, Referrers, Top Pages)
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS visitor_traffic_logs (
        id TEXT PRIMARY KEY,
        visitor_id TEXT NOT NULL,
        page_path TEXT NOT NULL,
        page_title TEXT,
        referrer TEXT,
        referrer_source TEXT NOT NULL,
        country TEXT NOT NULL,
        country_code TEXT NOT NULL,
        city TEXT,
        language TEXT NOT NULL,
        ip_anonymized TEXT,
        device_type TEXT,
        browser TEXT,
        os TEXT,
        timestamp TEXT NOT NULL
      )
    `);

    console.log("✅ Turso database schema initialized successfully.");
  } catch (err) {
    console.error("❌ Error initializing Turso schema:", err);
  }
}
