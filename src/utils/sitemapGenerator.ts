import { Article, MainCategory } from '../types';
import { CHARACTERS_DATA } from '../data/characters';
import { VEHICLES_DATA } from '../data/vehicles';
import { WEAPONS_DATA } from '../data/weapons';
import { MAP_DISTRICTS } from '../data/mapDistricts';
import { StaticPage } from '../types/cms';

export const SITE_BASE_URL = 'https://kairosion.online';

export interface SitemapUrlEntry {
  loc: string;
  path: string;
  title: string;
  section: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export function getAllSitemapEntries(
  articles: Article[],
  categories: MainCategory[],
  staticPages?: StaticPage[]
): SitemapUrlEntry[] {
  const entries: SitemapUrlEntry[] = [];
  const nowIso = new Date().toISOString();

  // 1. Home / Portada
  entries.push({
    loc: `${SITE_BASE_URL}/`,
    path: '/',
    title: 'Portada Principal · KAIROSION GTA 6',
    section: 'Inicio',
    lastmod: nowIso,
    changefreq: 'daily',
    priority: 1.0
  });

  // 2. Sitemap Page
  entries.push({
    loc: `${SITE_BASE_URL}/sitemap`,
    path: '/sitemap',
    title: 'Mapa del Sitio Web · Directorio de URLs y Sitemap XML',
    section: 'Herramientas SEO',
    lastmod: nowIso,
    changefreq: 'daily',
    priority: 0.8
  });

  // 3. Categories & Subcategories
  categories.forEach((cat) => {
    const catPath = cat.slug === 'gta-6' ? '/gta-6' : `/gta-6/${cat.slug}`;
    entries.push({
      loc: `${SITE_BASE_URL}${catPath}`,
      path: catPath,
      title: `${cat.name} · Archivo y Noticias`,
      section: 'Categorías Principales',
      lastmod: nowIso,
      changefreq: 'daily',
      priority: cat.slug === 'gta-6' ? 1.0 : 0.9
    });

    cat.subcategories?.forEach((sub) => {
      const subPath = cat.slug === 'gta-6' ? `/gta-6/${sub.slug}` : `/gta-6/${cat.slug}/${sub.slug}`;
      entries.push({
        loc: `${SITE_BASE_URL}${subPath}`,
        path: subPath,
        title: `${sub.name} en ${cat.name}`,
        section: `Subcategorías (${cat.name})`,
        lastmod: nowIso,
        changefreq: 'weekly',
        priority: 0.75
      });
    });
  });

  // 4. Published Articles
  const publishedArticles = (articles as any[]).filter(a => a.status === 'publicado' || a.status === 'programado' || !a.status);
  publishedArticles.forEach((art) => {
    const subPath = art.subcategorySlug && art.subcategorySlug !== 'all' ? `${art.subcategorySlug}/` : '';
    const articlePath = art.category === 'gta-6' ? `/gta-6/${subPath}${art.slug}` : `/gta-6/${art.category}/${subPath}${art.slug}`;

    entries.push({
      loc: `${SITE_BASE_URL}${articlePath}`,
      path: articlePath,
      title: art.title,
      section: `Artículos (${art.categoryLabel || art.category})`,
      lastmod: art.updatedAt || art.publishedAt || nowIso,
      changefreq: 'weekly',
      priority: 0.85
    });
  });

  // 5. Interactive Characters Database
  CHARACTERS_DATA.forEach((char) => {
    entries.push({
      loc: `${SITE_BASE_URL}/personaje/${char.slug}`,
      path: `/personaje/${char.slug}`,
      title: `${char.name} (${char.alias || char.role})`,
      section: 'Expedientes de Personajes',
      lastmod: nowIso,
      changefreq: 'monthly',
      priority: 0.7
    });
  });

  // 6. Interactive Vehicles Database
  VEHICLES_DATA.forEach((veh) => {
    entries.push({
      loc: `${SITE_BASE_URL}/vehiculo/${veh.id}`,
      path: `/vehiculo/${veh.id}`,
      title: `${veh.name} · ${veh.manufacturer} (${veh.classType})`,
      section: 'Base de Datos de Vehículos',
      lastmod: nowIso,
      changefreq: 'monthly',
      priority: 0.65
    });
  });

  // 7. Interactive Weapons Database
  WEAPONS_DATA.forEach((wep) => {
    entries.push({
      loc: `${SITE_BASE_URL}/arma/${wep.id}`,
      path: `/arma/${wep.id}`,
      title: `${wep.name} · ${wep.type}`,
      section: 'Arsenal & Armería',
      lastmod: nowIso,
      changefreq: 'monthly',
      priority: 0.65
    });
  });

  // 8. Map Districts Database
  MAP_DISTRICTS.forEach((dist) => {
    entries.push({
      loc: `${SITE_BASE_URL}/distrito/${dist.id}`,
      path: `/distrito/${dist.id}`,
      title: `${dist.name} (${dist.type})`,
      section: 'Cartografía & Distritos',
      lastmod: nowIso,
      changefreq: 'monthly',
      priority: 0.65
    });
  });

  // 9. Institutional & Legal Pages
  const defaultLegalPages = [
    { slug: 'sobre-nosotros', title: 'Sobre Nosotros · Redacción y Compromiso Editorial' },
    { slug: 'contacto', title: 'Contacto con la Redacción Editorial' },
    { slug: 'politica-de-privacidad', title: 'Política de Privacidad y Tratamiento de Datos' },
    { slug: 'politica-de-cookies', title: 'Política de Cookies' },
    { slug: 'terminos-y-condiciones', title: 'Términos y Condiciones de Uso' },
    { slug: 'aviso-legal-y-descargo', title: 'Aviso Legal y Descargo de Responsabilidad' }
  ];

  const legalList = staticPages && staticPages.length > 0 
    ? staticPages.map(p => ({ slug: p.slug, title: p.title }))
    : defaultLegalPages;

  legalList.forEach((page) => {
    entries.push({
      loc: `${SITE_BASE_URL}/pagina/${page.slug}`,
      path: `/pagina/${page.slug}`,
      title: page.title,
      section: 'Transparencia & Legal',
      lastmod: nowIso,
      changefreq: 'monthly',
      priority: 0.5
    });
  });

  return entries;
}

export function generateSitemapXml(
  articles: Article[],
  categories: MainCategory[],
  staticPages?: StaticPage[]
): string {
  const entries = getAllSitemapEntries(articles, categories, staticPages);

  const urlTags = entries.map((entry) => {
    const formattedDate = entry.lastmod.split('T')[0];
    return `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${formattedDate}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority.toFixed(2)}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlTags}
</urlset>`;
}
