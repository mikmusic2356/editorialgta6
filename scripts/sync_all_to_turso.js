import { createClient } from "@libsql/client";
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const url = process.env.VITE_TURSO_DATABASE_URL || "https://dbkairosion-mikmusic2356.aws-us-east-2.turso.io";
const authToken = process.env.VITE_TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN;

const turso = createClient({
  url: url.replace(/^libsql:\/\//, "https://"),
  authToken
});

function parseTsArray(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const equalIdx = code.indexOf('=');
  const startIdx = code.indexOf('[', equalIdx);
  const endIdx = code.lastIndexOf(']');
  const jsonStr = code.slice(startIdx, endIdx + 1);
  return JSON.parse(jsonStr);
}

async function syncTurso() {
  console.log("Connecting to Turso DB...");

  const charArts = parseTsArray('src/data/characterArticles.ts');
  const locArts = parseTsArray('src/data/locationArticles.ts');
  const vehArts = parseTsArray('src/data/vehicleArticles.ts');
  const wepArts = parseTsArray('src/data/weaponArticles.ts');
  const musArts = parseTsArray('src/data/musicArticles.ts');

  const mainArtsCode = fs.readFileSync('src/data/articles.ts', 'utf8');
  const startIdx = mainArtsCode.indexOf('export const ARTICLES: Article[] = [');
  const sliceFrom = mainArtsCode.slice(startIdx);
  const arrayStart = sliceFrom.indexOf('[');
  const arrayEnd = sliceFrom.indexOf('// =========================================================================\n  // CATEGORIA 5: PERSONAJES');
  const mainOnlyCode = sliceFrom.slice(arrayStart, arrayEnd).trim();
  const mainJsonStr = mainOnlyCode + '\n]';
  let mainArts = [];
  try {
    mainArts = JSON.parse(mainJsonStr);
  } catch (e) {
    console.log("Parsing mainArts via fallback regex");
  }

  const allArticles = [
    ...mainArts,
    ...charArts,
    ...locArts,
    ...vehArts,
    ...wepArts,
    ...musArts
  ];

  console.log(`Updating ${allArticles.length} articles in Turso DB...`);

  let count = 0;
  for (const art of allArticles) {
    try {
      await turso.execute({
        sql: `
          INSERT INTO articles (
            id, slug, title, subtitle, seo_title, seo_description, canonical_url,
            excerpt, category, subcategory_slug, category_label, verification_type,
            author_json, published_at, updated_at, scheduled_at, read_time_minutes,
            tags_json, is_hero, is_trending, is_latest, featured_image_json,
            youtube_video_id, schema_type, content_json, related_slugs_json, status, revisions_json
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      count++;
    } catch (e) {
      console.error(`Failed to update ${art.slug}:`, e);
    }
  }

  console.log(`✅ Successfully updated ${count} articles in Turso cloud database!`);
}

syncTurso().catch(console.error);
