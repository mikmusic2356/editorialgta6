import fs from 'fs';
import path from 'path';
import { createClient } from "@libsql/client";
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.VITE_TURSO_DATABASE_URL || "https://dbkairosion-mikmusic2356.aws-us-east-2.turso.io";
const authToken = process.env.VITE_TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN;

const turso = createClient({
  url: url.replace(/^libsql:\/\//, "https://"),
  authToken
});

const SITE_URL = 'https://kairosion.online';

async function buildSitemapXml() {
  console.log("Generating full sitemap.xml for Google Search Console...");

  // 1. Fetch articles from Turso DB
  let dbArticles = [];
  try {
    const res = await turso.execute("SELECT id, slug, title, category, subcategory_slug, updated_at, published_at, status FROM articles WHERE status = 'publicado' OR status = 'programado' OR status IS NULL");
    dbArticles = res.rows.map(r => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      category: r.category || 'gta-6',
      subcategorySlug: r.subcategory_slug || undefined,
      updatedAt: r.updated_at || r.published_at || new Date().toISOString(),
      publishedAt: r.published_at || new Date().toISOString()
    }));
    console.log(`Loaded ${dbArticles.length} published articles from Turso DB.`);
  } catch (e) {
    console.error("Error loading articles from Turso DB:", e);
  }

  // Categories & Subcategories
  const mainCategories = [
    {
      slug: 'gta-6',
      name: 'GTA 6',
      subcategories: [
        'personajes', 'mapa', 'vehiculos', 'armas', 'noticias',
        'guias', 'trucos-consejos', 'musica', 'rockstar-games'
      ]
    },
    {
      slug: 'noticias',
      name: 'Noticias',
      subcategories: ['gta-6', 'rockstar-games', 'actualizaciones', 'lanzamiento', 'comunidad']
    },
    {
      slug: 'guias',
      name: 'Guías',
      subcategories: ['guias-misiones', 'guias-personajes', 'guias-vehiculos', 'guias-armas', 'guias-mapa', 'coleccionables', 'secretos', 'dinero', 'actividades', 'progresion', 'principiantes']
    },
    {
      slug: 'trucos-consejos',
      name: 'Trucos y Consejos',
      subcategories: ['trucos', 'consejos-rapidos', 'consejos-principiantes', 'gameplay', 'combate', 'conduccion', 'exploracion', 'dinero', 'supervivencia', 'secretos']
    },
    {
      slug: 'personajes',
      name: 'Personajes',
      subcategories: ['lucia-caminos', 'jason-duval', 'agente-menddees', 'andreas-deleo', 'boobie-ike', 'brian-heder', 'cal-hampton', 'donnie', 'drequan-priest', 'raul-bautista', 'real-dimez']
    },
    {
      slug: 'mapa',
      name: 'Mapa y Mundo',
      subcategories: ['vice-city', 'leonida-keys', 'grassrivers', 'port-gellhorn', 'ambrosia', 'mount-kalaga', 'distritos', 'puntos-interes']
    },
    {
      slug: 'vehiculos',
      name: 'Vehículos',
      subcategories: ['superdeportivos', 'muscle-cars', 'lanchas', 'aeronaves', 'motos-quads', 'comerciales', 'tuning']
    },
    {
      slug: 'armas',
      name: 'Armas',
      subcategories: ['pistolas', 'fusiles', 'subfusiles', 'escopetas', 'francotiradores', 'cuerpo-a-cuerpo', 'explosivos', 'accesorios']
    },
    {
      slug: 'musica',
      name: 'Música y Radio',
      subcategories: ['emisoras', 'banda-sonora', 'soundtrack-oficial', 'artistas']
    },
    {
      slug: 'rockstar-games',
      name: 'Rockstar Games',
      subcategories: ['rage-engine', 'desarrollo', 'take-two', 'comunicados']
    }
  ];

  const nowIso = new Date().toISOString().split('T')[0];
  const urlEntries = [];

  // 1. Home / Portada
  urlEntries.push({
    loc: `${SITE_URL}/`,
    lastmod: nowIso,
    changefreq: 'daily',
    priority: '1.00'
  });

  // 2. Sitemap HTML page
  urlEntries.push({
    loc: `${SITE_URL}/sitemap`,
    lastmod: nowIso,
    changefreq: 'daily',
    priority: '0.80'
  });

  // 3. Category & Subcategory Pages
  mainCategories.forEach(cat => {
    const catPath = cat.slug === 'gta-6' ? '/gta-6' : `/gta-6/${cat.slug}`;
    urlEntries.push({
      loc: `${SITE_URL}${catPath}`,
      lastmod: nowIso,
      changefreq: 'daily',
      priority: cat.slug === 'gta-6' ? '1.00' : '0.90'
    });

    cat.subcategories.forEach(sub => {
      const subPath = cat.slug === 'gta-6' ? `/gta-6/${sub}` : `/gta-6/${cat.slug}/${sub}`;
      urlEntries.push({
        loc: `${SITE_URL}${subPath}`,
        lastmod: nowIso,
        changefreq: 'weekly',
        priority: '0.80'
      });
    });
  });

  // 4. Articles
  dbArticles.forEach(art => {
    const sub = art.subcategorySlug && art.subcategorySlug !== 'all' ? `${art.subcategorySlug}/` : '';
    const artPath = art.category === 'gta-6'
      ? `/gta-6/${sub}${art.slug}`
      : `/gta-6/${art.category}/${sub}${art.slug}`;
    
    const lastmod = (art.updatedAt || art.publishedAt || nowIso).split('T')[0];

    urlEntries.push({
      loc: `${SITE_URL}${artPath}`,
      lastmod: lastmod,
      changefreq: 'weekly',
      priority: '0.85'
    });
  });

  // 5. Legal & Institutional Pages
  const legalPages = [
    'sobre-nosotros',
    'contacto',
    'politica-de-privacidad',
    'politica-de-cookies',
    'terminos-y-condiciones',
    'aviso-legal-y-descargo'
  ];

  legalPages.forEach(p => {
    urlEntries.push({
      loc: `${SITE_URL}/pagina/${p}`,
      lastmod: nowIso,
      changefreq: 'monthly',
      priority: '0.50'
    });
  });

  // Deduplicate by loc
  const seenLocs = new Set();
  const uniqueEntries = [];
  for (const entry of urlEntries) {
    if (!seenLocs.has(entry.loc)) {
      seenLocs.add(entry.loc);
      uniqueEntries.push(entry);
    }
  }

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${uniqueEntries.map(e => `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  const targetPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  fs.writeFileSync(targetPath, xmlContent, 'utf8');
  console.log(`✅ Successfully generated public/sitemap.xml with ${uniqueEntries.length} verified URLs!`);
}

buildSitemapXml().catch(console.error);
