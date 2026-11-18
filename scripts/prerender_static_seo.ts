import fs from 'fs';
import path from 'path';
import { ARTICLES } from '../src/data/articles';
import { MAIN_CATEGORIES } from '../src/data/categories';
import { generateArticleSchema } from '../src/utils/schemaGenerator';

const SITE_URL = 'https://kairosion.online';
const distDir = path.join(process.cwd(), 'dist');
const templateHtmlPath = path.join(distDir, 'index.html');

function escapeHtml(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getArticleCanonicalPath(art: any): string {
  const sub = art.subcategorySlug && art.subcategorySlug !== 'all' ? `${art.subcategorySlug}/` : '';
  if (art.category === 'gta-6') {
    return `/gta-6/${sub}${art.slug}`;
  }
  return `/gta-6/${art.category}/${sub}${art.slug}`;
}

function buildStaticFooterLinksHtml(): string {
  return `
    <footer class="ssr-editorial-footer" style="margin-top:3rem;padding-top:2rem;border-top:1px solid #1e293b;color:#94a3b8;font-size:0.875rem;">
      <p><strong>KAIROSION</strong> · Portal Editorial Independiente sobre Grand Theft Auto VI. Grand Theft Auto, GTA VI y Rockstar Games son marcas registradas de Take-Two Interactive Software, Inc. Este sitio no está patrocinado ni afiliado oficialmente a Rockstar Games.</p>
      <nav aria-label="Navegación Editorial y Legal" style="margin-top:1rem;display:flex;flex-wrap:wrap;gap:1rem;">
        <a href="/">Portada</a>
        <a href="/gta-6">GTA 6 Hub</a>
        <a href="/gta-6/noticias">Noticias</a>
        <a href="/gta-6/guias">Guías</a>
        <a href="/gta-6/trucos-consejos">Trucos y Consejos</a>
        <a href="/gta-6/personajes">Personajes</a>
        <a href="/gta-6/mapa">Mapa de Leonida</a>
        <a href="/gta-6/vehiculos">Vehículos</a>
        <a href="/gta-6/armas">Armas</a>
        <a href="/gta-6/musica">Música y Radio</a>
        <a href="/pagina/sobre-nosotros">Sobre Nosotros</a>
        <a href="/pagina/contacto">Contacto</a>
        <a href="/pagina/politica-de-privacidad">Política de Privacidad</a>
        <a href="/pagina/politica-de-cookies">Política de Cookies</a>
        <a href="/pagina/terminos-y-condiciones">Términos y Condiciones</a>
        <a href="/pagina/aviso-legal-y-descargo">Aviso Legal y Descargo</a>
        <a href="/sitemap">Mapa del Sitio</a>
      </nav>
    </footer>
  `;
}

function renderArticleBodyHtml(art: any): string {
  const sectionsHtml = (art.content?.sections || []).map((s: any) => {
    const paragraphs = (s.paragraphs || []).map((p: string) => `<p>${escapeHtml(p.replace(/\*\*/g, ''))}</p>`).join('\n');
    const steps = (s.steps || []).map((st: any) => `<li><strong>${escapeHtml(st.title)}:</strong> ${escapeHtml(st.description)}</li>`).join('\n');
    return `
      <section>
        ${s.heading ? `<h2>${escapeHtml(s.heading)}</h2>` : ''}
        ${s.subheading ? `<h3>${escapeHtml(s.subheading)}</h3>` : ''}
        ${paragraphs}
        ${steps ? `<ol>${steps}</ol>` : ''}
      </section>
    `;
  }).join('\n');

  const takeawaysHtml = (art.content?.takeaways || []).length > 0
    ? `<aside><h3>Puntos Clave</h3><ul>${art.content.takeaways.map((t: string) => `<li>${escapeHtml(t)}</li>`).join('')}</ul></aside>`
    : '';

  return `
    <main style="max-width:80rem;margin:0 auto;padding:2rem 1rem;color:#f1f5f9;font-family:sans-serif;">
      <article itemscope itemtype="https://schema.org/NewsArticle">
        <header>
          <p>${escapeHtml(art.categoryLabel || art.category)}</p>
          <h1 itemprop="headline">${escapeHtml(art.title)}</h1>
          ${art.subtitle ? `<p>${escapeHtml(art.subtitle)}</p>` : ''}
          <div>
            <span>Por <strong itemprop="author">${escapeHtml(art.author?.name || 'Redacción KAIROSION')}</strong> (${escapeHtml(art.author?.role || 'Editor')})</span>
            · <time itemprop="datePublished" datetime="${escapeHtml(art.publishedAt || '')}">${escapeHtml((art.publishedAt || '').split('T')[0])}</time>
          </div>
        </header>
        ${art.featuredImage?.url ? `<figure><img src="${escapeHtml(art.featuredImage.url)}" alt="${escapeHtml(art.featuredImage.alt || art.title)}" width="1200" height="675" /><figcaption>${escapeHtml(art.featuredImage.caption || '')}</figcaption></figure>` : ''}
        <div itemprop="articleBody">
          <p><strong>${escapeHtml(art.content?.leadText || art.excerpt || '')}</strong></p>
          ${takeawaysHtml}
          ${sectionsHtml}
        </div>
      </article>
      ${buildStaticFooterLinksHtml()}
    </main>
  `;
}

function renderCategoryBodyHtml(cat: any, subSlug?: string): string {
  const catArticles = ARTICLES.filter(a => {
    if (cat.slug === 'gta-6') {
      return subSlug ? (a.category === subSlug || a.subcategorySlug === subSlug) : true;
    }
    if (a.category !== cat.slug) return false;
    if (subSlug && a.subcategorySlug !== subSlug) return false;
    return true;
  });

  const subObj = subSlug ? cat.subcategories?.find((s: any) => s.slug === subSlug) : null;
  const heading = subObj ? `${subObj.name} - ${cat.name} en GTA 6` : `${cat.name} en GTA 6: Archivo Editorial y Guías`;
  const desc = subObj ? subObj.description : cat.shortDesc;

  const listHtml = catArticles.slice(0, 40).map(a => {
    const link = getArticleCanonicalPath(a);
    return `
      <article style="margin-bottom:1.5rem;padding-bottom:1rem;border-bottom:1px solid #1e293b;">
        <h2><a href="${link}">${escapeHtml(a.title)}</a></h2>
        <p>${escapeHtml(a.excerpt || a.seoDescription || '')}</p>
        <small>Por ${escapeHtml(a.author?.name || 'KAIROSION')} · ${escapeHtml((a.publishedAt || '').split('T')[0])}</small>
      </article>
    `;
  }).join('\n');

  return `
    <main style="max-width:80rem;margin:0 auto;padding:2rem 1rem;color:#f1f5f9;font-family:sans-serif;">
      <header>
        <h1>${escapeHtml(heading)}</h1>
        <p>${escapeHtml(desc)}</p>
      </header>
      <section>
        ${listHtml}
      </section>
      ${buildStaticFooterLinksHtml()}
    </main>
  `;
}

function renderHomeBodyHtml(): string {
  const latestArticles = ARTICLES.slice(0, 35).map(a => {
    const link = getArticleCanonicalPath(a);
    return `
      <article style="margin-bottom:1.5rem;">
        <h3><a href="${link}">${escapeHtml(a.title)}</a></h3>
        <p>${escapeHtml(a.excerpt || a.seoDescription || '')}</p>
      </article>
    `;
  }).join('\n');

  const categoriesNav = MAIN_CATEGORIES.map(c => {
    const href = c.slug === 'gta-6' ? '/gta-6' : `/gta-6/${c.slug}`;
    return `<li><a href="${href}"><strong>${escapeHtml(c.name)}:</strong> ${escapeHtml(c.shortDesc)}</a></li>`;
  }).join('\n');

  return `
    <main style="max-width:80rem;margin:0 auto;padding:2rem 1rem;color:#f1f5f9;font-family:sans-serif;">
      <header>
        <h1>KAIROSION: Portal Editorial de GTA 6, Noticias, Guías de Juego, Mapa de Leonida y Trucos</h1>
        <p>Bienvenido a KAIROSION, revista digital independiente especializada en Grand Theft Auto VI. Análisis técnico del motor RAGE 9, cobertura de noticias de Rockstar Games, expedientes de personajes (Lucia y Jason), catálogo balístico de armas, vehículos y mapa interactivo de Vice City.</p>
      </header>
      <section>
        <h2>Secciones Principales del Portal</h2>
        <ul>${categoriesNav}</ul>
      </section>
      <section>
        <h2>Últimos Reportajes, Noticias y Guías Publicadas</h2>
        ${latestArticles}
      </section>
      ${buildStaticFooterLinksHtml()}
    </main>
  `;
}

function injectHtmlPage(
  baseHtml: string,
  opts: {
    title: string;
    description: string;
    canonicalUrl: string;
    ogImage?: string;
    ogType?: string;
    schemaJson?: string;
    bodyHtml: string;
  }
): string {
  let html = baseHtml;

  // Replace <title>
  html = html.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(opts.title)}</title>`);

  // Replace meta description
  html = html.replace(
    /<meta name="description" content=".*?" \/>/,
    `<meta name="description" content="${escapeHtml(opts.description)}" />`
  );

  // Replace canonical
  html = html.replace(
    /<link rel="canonical" href=".*?" \/>/,
    `<link rel="canonical" href="${escapeHtml(opts.canonicalUrl)}" />`
  );

  // Replace OG tags
  html = html.replace(
    /<meta property="og:title" content=".*?" \/>/,
    `<meta property="og:title" content="${escapeHtml(opts.title)}" />`
  );
  html = html.replace(
    /<meta property="og:description" content=".*?" \/>/,
    `<meta property="og:description" content="${escapeHtml(opts.description)}" />`
  );
  html = html.replace(
    /<meta property="og:type" content=".*?" \/>/,
    `<meta property="og:type" content="${opts.ogType || 'website'}" /><meta property="og:url" content="${escapeHtml(opts.canonicalUrl)}" />`
  );
  if (opts.ogImage) {
    const fullImg = opts.ogImage.startsWith('http') ? opts.ogImage : `${SITE_URL}${opts.ogImage}`;
    html = html.replace(
      /<meta property="og:image" content=".*?" \/>/,
      `<meta property="og:image" content="${escapeHtml(fullImg)}" />`
    );
    html = html.replace(
      /<meta name="twitter:image" content=".*?" \/>/,
      `<meta name="twitter:image" content="${escapeHtml(fullImg)}" />`
    );
  }
  html = html.replace(
    /<meta name="twitter:title" content=".*?" \/>/,
    `<meta name="twitter:title" content="${escapeHtml(opts.title)}" />`
  );
  html = html.replace(
    /<meta name="twitter:description" content=".*?" \/>/,
    `<meta name="twitter:description" content="${escapeHtml(opts.description)}" />`
  );

  if (opts.schemaJson) {
    html = html.replace('</head>', `  <script type="application/ld+json">${opts.schemaJson}</script>\n  </head>`);
  }

  // Inject pre-rendered semantic HTML inside <div id="root">...</div>
  html = html.replace('<div id="root"></div>', `<div id="root">${opts.bodyHtml}</div>`);

  return html;
}

function writeRouteHtml(routePath: string, htmlContent: string) {
  const cleanRoute = routePath.replace(/^\/+|\/+$/g, '');
  if (!cleanRoute) {
    fs.writeFileSync(path.join(distDir, 'index.html'), htmlContent, 'utf8');
    return;
  }
  const targetDir = path.join(distDir, cleanRoute);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'index.html'), htmlContent, 'utf8');
}

async function runPrerender() {
  if (!fs.existsSync(templateHtmlPath)) {
    console.error('dist/index.html not found. Run vite build first.');
    process.exit(1);
  }

  const baseTemplate = fs.readFileSync(templateHtmlPath, 'utf8');
  let count = 0;

  // 1. Prerender Home (/)
  const homeHtml = injectHtmlPage(baseTemplate, {
    title: 'GTA 6: Noticias, Guías de Juego, Mapa y Trucos | KAIROSION',
    description: 'Descubre todas las novedades confirmadas de GTA 6: análisis del motor RAGE 9, mapa interactivo de Leonida, guía de misiones, personajes y trucos.',
    canonicalUrl: `${SITE_URL}/`,
    bodyHtml: renderHomeBodyHtml(),
  });
  writeRouteHtml('/', homeHtml);
  count++;

  // 2. Prerender all Articles
  for (const art of ARTICLES) {
    const canonicalPath = getArticleCanonicalPath(art);
    const fullUrl = `${SITE_URL}${canonicalPath}`;
    const schema = JSON.stringify(generateArticleSchema(art, SITE_URL));
    const rawTitle = art.seoTitle || art.title;
    const finalTitle = rawTitle.toUpperCase().includes('KAIROSION') ? rawTitle : `${rawTitle} | KAIROSION`;
    const artHtml = injectHtmlPage(baseTemplate, {
      title: finalTitle,
      description: art.seoDescription || art.excerpt || art.title,
      canonicalUrl: fullUrl,
      ogImage: art.featuredImage?.url,
      ogType: 'article',
      schemaJson: schema,
      bodyHtml: renderArticleBodyHtml(art),
    });

    // Write canonical route (/gta-6/:category/:sub/:slug)
    writeRouteHtml(canonicalPath, artHtml);
    count++;

    // Also write direct slug route if different
    if (canonicalPath !== `/gta-6/${art.slug}`) {
      writeRouteHtml(`/gta-6/${art.slug}`, artHtml);
    }
  }

  // 3. Prerender all Categories & Subcategories (both /gta-6/:cat and /:cat)
  for (const cat of MAIN_CATEGORIES) {
    const catCanonicalPath = cat.slug === 'gta-6' ? '/gta-6' : `/gta-6/${cat.slug}`;
    const catHtml = injectHtmlPage(baseTemplate, {
      title: `${cat.name} en GTA 6: Noticias, Guías y Archivo | KAIROSION`,
      description: cat.shortDesc,
      canonicalUrl: `${SITE_URL}${catCanonicalPath}`,
      bodyHtml: renderCategoryBodyHtml(cat),
    });

    writeRouteHtml(catCanonicalPath, catHtml);
    count++;

    // Also write short alias (/armas, /mapa, /noticias, /guias, /personajes, /vehiculos) for Sitelinks
    if (cat.slug !== 'gta-6') {
      writeRouteHtml(`/${cat.slug}`, catHtml);
      count++;
    }

    for (const sub of cat.subcategories || []) {
      const subPath = cat.slug === 'gta-6' ? `/gta-6/${sub.slug}` : `/gta-6/${cat.slug}/${sub.slug}`;
      const subHtml = injectHtmlPage(baseTemplate, {
        title: `${sub.name} · ${cat.name} GTA 6 | KAIROSION`,
        description: sub.description || cat.shortDesc,
        canonicalUrl: `${SITE_URL}${subPath}`,
        bodyHtml: renderCategoryBodyHtml(cat, sub.slug),
      });
      writeRouteHtml(subPath, subHtml);
      count++;
    }
  }

  // 4. Prerender Legal & Institutional Pages (/pagina/:slug)
  const legalPages = [
    {
      slug: 'sobre-nosotros',
      title: 'Sobre Nosotros | KAIROSION - Portal Editorial Independiente de GTA 6',
      description: 'Conoce al equipo editorial independiente de KAIROSION, nuestra misión de investigación sobre GTA 6, acceso 100% gratuito y transparencia.',
      heading: 'Sobre Nosotros - Redacción Editorial KAIROSION',
      body: `<p>KAIROSION es un portal editorial digital independiente de periodismo, análisis técnico e investigación especializada en Grand Theft Auto VI (GTA 6), el estado de Leonida y las creaciones tecnológicas de Rockstar Games.</p><p>Nuestro equipo multidisciplinar de redactores, analistas de datos y especialistas rastrea diariamente cada novedad con rigor informativo, fact-checking y acceso 100% libre y gratuito sin muros de pago.</p><p>KAIROSION es un medio independiente y no está respaldado, patrocinado ni afiliado con Rockstar Games o Take-Two Interactive Software, Inc.</p>`
    },
    {
      slug: 'contacto',
      title: 'Contacto con la Redacción | KAIROSION',
      description: 'Canales oficiales de contacto con los redactores, editores y administradores de KAIROSION para consultas, prensa y correcciones.',
      heading: 'Contacto Oficial con la Redacción de KAIROSION',
      body: `<p>Puedes comunicarte directamente con nuestro equipo editorial en:</p><ul><li>Mesa de Redacción: redaccion@kairosion.online</li><li>Correcciones y Fact-Checking: editorial@kairosion.online</li><li>Publicidad y Google AdSense: publicidad@kairosion.online</li><li>Privacidad y Protección de Datos (RGPD): privacidad@kairosion.online</li></ul><p>Horario de atención: Lunes a Viernes de 09:00 a 19:00.</p>`
    },
    {
      slug: 'politica-de-privacidad',
      title: 'Política de Privacidad (RGPD) | KAIROSION',
      description: 'Información transparente sobre el tratamiento de datos personales y privacidad en KAIROSION conforme al RGPD.',
      heading: 'Política de Privacidad y Protección de Datos (RGPD)',
      body: `<p>El responsable del tratamiento de los datos en https://kairosion.online es el equipo editorial de KAIROSION (privacidad@kairosion.online).</p><p>Aplicamos los principios de licitud, transparencia y minimización de datos del RGPD (UE 2016/679). KAIROSION no vende, alquila ni comercializa datos personales a terceros. Utilizamos servicios analíticos y publicitarios de Google AdSense cumpliendo con las políticas de consentimiento del usuario. Puedes ejercer tus derechos de acceso, rectificación, supresión y oposición escribiendo a privacidad@kairosion.online.</p>`
    },
    {
      slug: 'politica-de-cookies',
      title: 'Política de Cookies & AdSense | KAIROSION',
      description: 'Información detallada sobre el uso de cookies técnicas, de personalización y de Google AdSense en KAIROSION.',
      heading: 'Política de Cookies y Publicidad Contextual',
      body: `<p>En KAIROSION empleamos cookies técnicas estrictamente necesarias para el funcionamiento del portal, cookies de preferencias para guardar tu elección de consentimiento y cookies publicitarias oficiales de Google AdSense para ofrecer anuncios no invasivos que mantienen el sitio gratuito.</p><p>Puedes configurar o revocar tu consentimiento en cualquier momento desde el panel de Configuración de Cookies en el pie de página.</p>`
    },
    {
      slug: 'terminos-y-condiciones',
      title: 'Términos y Condiciones de Uso | KAIROSION',
      description: 'Condiciones de acceso gratuito, propiedad intelectual y normas de uso del portal KAIROSION.',
      heading: 'Términos y Condiciones de Uso',
      body: `<p>El acceso a KAIROSION es libre y gratuito. Todos los artículos periodísticos, análisis, guías y estructuras de datos creados por la redacción de KAIROSION son propiedad intelectual de sus autores.</p><p>Las marcas Grand Theft Auto, GTA VI, Vice City, Rockstar Games y Take-Two Interactive pertenecen a sus respectivos propietarios y se citan exclusivamente con fines periodísticos, informativos y divulgativos (Fair Use).</p>`
    },
    {
      slug: 'aviso-legal-y-descargo',
      title: 'Aviso Legal y Descargo de Responsabilidad | KAIROSION',
      description: 'Declaración expresa de independencia editorial y no afiliación de KAIROSION con Rockstar Games y Take-Two Interactive.',
      heading: 'Aviso Legal y Declaración de Independencia Editorial',
      body: `<p>KAIROSION es una publicación periodística digital independiente y NO está patrocinada, avalada, respaldada ni vinculada societariamente con Rockstar Games, Rockstar North o Take-Two Interactive Software, Inc.</p><p>Toda la cobertura se realiza al amparo del derecho de información, crítica y cita periodística.</p>`
    }
  ];

  for (const page of legalPages) {
    const route = `/pagina/${page.slug}`;
    const pageHtml = injectHtmlPage(baseTemplate, {
      title: page.title,
      description: page.description,
      canonicalUrl: `${SITE_URL}${route}`,
      bodyHtml: `
        <main style="max-width:60rem;margin:0 auto;padding:2rem 1rem;color:#f1f5f9;font-family:sans-serif;">
          <article>
            <h1>${escapeHtml(page.heading)}</h1>
            ${page.body}
          </article>
          ${buildStaticFooterLinksHtml()}
        </main>
      `
    });
    writeRouteHtml(route, pageHtml);
    count++;
  }

  // 5. Prerender HTML Sitemap (/sitemap)
  const sitemapLinks = ARTICLES.map(a => {
    const p = getArticleCanonicalPath(a);
    return `<li><a href="${p}">${escapeHtml(a.title)}</a></li>`;
  }).join('\n');

  const sitemapHtml = injectHtmlPage(baseTemplate, {
    title: 'Mapa del Sitio Web & Índice de Artículos | KAIROSION',
    description: 'Directorio completo de artículos, noticias, guías, bases de datos y páginas legales de KAIROSION.',
    canonicalUrl: `${SITE_URL}/sitemap`,
    bodyHtml: `
      <main style="max-width:80rem;margin:0 auto;padding:2rem 1rem;color:#f1f5f9;font-family:sans-serif;">
        <h1>Mapa del Sitio Web de KAIROSION</h1>
        <p>Índice completo de páginas, categorías y artículos publicados:</p>
        <ul>${sitemapLinks}</ul>
        ${buildStaticFooterLinksHtml()}
      </main>
    `
  });
  writeRouteHtml('/sitemap', sitemapHtml);
  count++;

  console.log(`✅ Pre-rendered ${count} static HTML pages with full article text, metadata, and legal links in dist/!`);
}

runPrerender().catch((err) => {
  console.error('Error during SSG prerender:', err);
  process.exit(1);
});
