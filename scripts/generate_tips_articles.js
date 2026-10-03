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

const blogsDir = path.join(process.cwd(), 'BLOGS', 'trucos y consejos');
const files = fs.readdirSync(blogsDir).filter(f => f.endsWith('.md'));

console.log(`Processing ${files.length} blogs from BLOGS/trucos y consejos...`);

const imageMapping = {
  'consejos-de-escape-policial-nivel-de-busqueda-gta-6': {
    url: '/images/Personajes/Brian_Heder_landscape.webp',
    alt: 'Escape policial táctico y evasión de 5 estrellas en GTA 6',
    caption: 'Estrategias de evasión y corte de línea de visión ante las patrullas de Leonida.'
  },
  'consejos-de-gestion-de-inventario-y-armas-gta-6': {
    url: '/images/Armas/ULTIMATE_EDITION_WEAPON_VARIANTS_01.webp',
    alt: 'Gestión táctica de inventario, rueda de armas y maletero en GTA 6',
    caption: 'Organización eficiente del equipamiento personal y maletero del vehículo.'
  },
  'consejos-de-sobrevivencia-al-clima-extremo-y-huracanes-gta-6': {
    url: '/images/Lugares_y_Mapas/Mount_Kalaga_National_Park_Postcard_landscape.webp',
    alt: 'Supervivencia a tormentas tropicales, huracanes y clima extremo en GTA 6',
    caption: 'Adaptación al clima dinámico, inundaciones y tormentas severas en Leonida.'
  },
  'consejos-para-el-atraco-a-bancos-y-fisa-bank-gta-6': {
    url: '/images/Personajes/Jason_and_Lucia_Robbery_With_Logo_landscape.webp',
    alt: 'Atraco a bancos y sucursales FISA Bank en GTA 6',
    caption: 'Planificación, perforación de bóvedas y escape de golpes bancarios.'
  },
  'consejos-para-el-combate-y-tiroteos-gta-6': {
    url: '/images/Armas/ULTIMATE_EDITION_HAWK_AND_LITTLE_MORGAN_REVOLVERS_01.webp',
    alt: 'Técnicas de combate, coberturas y tiroteos en GTA 6',
    caption: 'Dominio de coberturas destructibles, apuntado rápido y retroceso de armas.'
  },
  'consejos-para-el-contrabando-maritimo-y-aereo-gta-6': {
    url: '/images/Vehiculos/ULTIMATE_EDITION_SQUALO_01.webp',
    alt: 'Rutas de contrabando marítimo y aéreo en los Cayos de Leonida',
    caption: 'Transporte marítimo encubierto y operaciones náuticas en Watson Bay.'
  },
  'consejos-para-el-transporte-y-uso-de-compañeros-gta-6': {
    url: '/images/Personajes/Jason_and_Lucia_Motel_landscape.webp',
    alt: 'Cooperación y trabajo en equipo entre Jason y Lucia en GTA 6',
    caption: 'Comandos tácticos de apoyo, cobertura mutua e intercambio de suministros.'
  },
  'consejos-para-ganar-carreras-ilegales-y-takeovers-gta-6': {
    url: '/images/Vehiculos/ULTIMATE_EDITION_GROTTI_CHEETAH_01.webp',
    alt: 'Carreras ilegales, takeovers y tuning callejero en Vice City',
    caption: 'Técnicas de trazado en curvas, gestión de nitro y maniobras de escape.'
  },
  'consejos-para-gestionar-rehenes-y-control-de-multitudes-gta-6': {
    url: '/images/Personajes/Raul_Bautista_landscape.webp',
    alt: 'Control de rehenes y gestión de multitudes en atracos en GTA 6',
    caption: 'Tácticas de intimidación, vigilancia de salidas y contención de civiles.'
  },
  'consejos-para-la-caza-y-fauna-en-grassrivers-gta-6': {
    url: '/images/Lugares_y_Mapas/Grassrivers_Postcard_landscape.webp',
    alt: 'Caza, caimanes y fauna salvaje en Grassrivers GTA 6',
    caption: 'Técnicas de rastreo en pantanos y defensa ante la fauna depredadora.'
  },
  'consejos-para-la-gestion-de-vehiculos-comerciales-y-remolques-gta-6': {
    url: '/images/Vehiculos/ULTIMATE_EDITION_WYMAN_CAR_COLLECTION_01.webp',
    alt: 'Uso de vehículos comerciales, grúas y remolques en GTA 6',
    caption: 'Transporte de carga pesada, logística y bloqueos viales tácticos.'
  },
  'consejos-para-robar-coches-y-hackeo-wank-gta-6': {
    url: '/images/Vehiculos/VINTAGE_VICE_CITY_PACK_VAPID_STANIER_01.webp',
    alt: 'Robo de vehículos y hackeo de alarmas con app Wank en GTA 6',
    caption: 'Desactivación de inmovilizadores electrónicos y reventa en desguaces.'
  },
  'consejos-para-superar-eventos-aleatorios-y-encuentros-gta-6': {
    url: '/images/Lugares_y_Mapas/Port_Gellhorn_Postcard_landscape.webp',
    alt: 'Eventos aleatorios y encuentros dinámicos en el mundo de GTA 6',
    caption: 'Resolución de situaciones emergentes y recompensas únicas en Leonida.'
  },
  'guia-de-inicio-10-consejos-fundamentales-gta-6': {
    url: '/images/Artes_y_Ediciones/Official_Cover_Art_landscape.webp',
    alt: 'Guía de inicio y 10 consejos fundamentales en GTA 6',
    caption: 'Primeros pasos esenciales para progresar rápidamente con Jason y Lucia.'
  },
  'trucos-de-conduccion-y-tuning-gta-6': {
    url: '/images/Vehiculos/ULTIMATE_EDITION_VAPID_GANADO_RETRO_BUILD_01.webp',
    alt: 'Físicas de conducción, derrapes y mejoras mecánicas en GTA 6',
    caption: 'Ajustes de suspensión, tracción en asfalto mojado y balance de peso.'
  },
  'trucos-de-navegacion-y-exploracion-de-arrecifes-gta-6': {
    url: '/images/Lugares_y_Mapas/Leonida_Keys_Postcard_landscape.webp',
    alt: 'Buceo y exploración de arrecifes y pecios en los Cayos de GTA 6',
    caption: 'Inmersiones submarinas, búsqueda de tesoros y gestión de oxígeno.'
  },
  'trucos-de-sigilo-e-infiltracion-gta-6': {
    url: '/images/Ropa_y_Personalizacion/ULTIMATE_EDITION_ELECTRIC_FANG_01.webp',
    alt: 'Infiltración sigilosa, derribos silenciosos y silenciadores en GTA 6',
    caption: 'Ocultación en sombras, ocultación de cuerpos y desactivación de alarmas.'
  },
  'trucos-de-sinergia-y-confianza-jason-lucia-gta-6': {
    url: '/images/Personajes/Jason_and_Lucia_Robbery_With_Logo_landscape.webp',
    alt: 'Vínculo y nivel de confianza entre Jason y Lucia en GTA 6',
    caption: 'Mecánicas de sinergia en combate, bonificaciones de pareja y habilidades combinadas.'
  },
  'trucos-para-aprovechar-los-interiores-accesibles-gta-6': {
    url: '/images/Lugares_y_Mapas/Vice_City_Postcard_landscape.webp',
    alt: 'Interiores explorables, edificios y comercios en Vice City GTA 6',
    caption: 'Uso táctico de edificios accesibles para emboscadas y recursos.'
  },
  'trucos-para-comprar-y-gestionar-pisos-francos-gta-6': {
    url: '/images/Vehiculos/ULTIMATE_EDITION_SAFEHOUSE_VEHICLES_01.webp',
    alt: 'Adquisición de pisos francos, refugios y garajes en GTA 6',
    caption: 'Puntos de guardado seguro, armerías clandestinas y depósitos de efectivo.'
  },
  'trucos-para-desactivar-sistemas-de-seguridad-y-alarmas-gta-6': {
    url: '/images/Personajes/Cal_Hampton_landscape.webp',
    alt: 'Hackeo y desactivación de alarmas, sensores y cuadros eléctricos en GTA 6',
    caption: 'Herramientas de intrusión electrónica y neutralización de seguridad.'
  },
  'trucos-para-dominio-de-las-redes-sociales-snapmatic-gta-6': {
    url: '/images/Personajes/Real_Dimez_landscape.webp',
    alt: 'Redes sociales, transmisiones virales y Snapmatic en GTA 6',
    caption: 'Aprovechamiento de tendencias virales e inteligencia de objetivos.'
  },
  'trucos-para-el-blanqueo-de-dinero-sucio-gta-6': {
    url: '/images/Personajes/Boobie_Ike_landscape.webp',
    alt: 'Blanqueo de capitales, empresas tapadera y compras en GTA 6',
    caption: 'Conversión de efectivo ilegal en fondos limpios y propiedades seguras.'
  },
  'trucos-para-el-combate-cuerpo-a-cuerpo-y-peleas-gta-6': {
    url: '/images/Ropa_y_Personalizacion/ULTIMATE_EDITION_GOODTIME_GEAR_01.webp',
    alt: 'Peleas callejeras, esquivas y artes marciales en GTA 6',
    caption: 'Mecánicas de contraataque, agarres y combate sin armas en Leonida.'
  },
  'trucos-para-evitar-el-rastreo-y-camaras-cctv-gta-6': {
    url: '/images/Ropa_y_Personalizacion/ULTIMATE_EDITION_ONE_EYED_WILLIE_01.webp',
    alt: 'Evasión de reconocimiento facial, cámaras CCTV y máscaras en GTA 6',
    caption: 'Prevención de registros biométricos y alteración de indumentaria.'
  },
  'trucos-para-ganar-dinero-rapido-gta-6': {
    url: '/images/Artes_y_Ediciones/ULTIMATE_EDITION_01.webp',
    alt: 'Generación rápida de dinero, botines y trabajos lucrativos en GTA 6',
    caption: 'Rutas optimizadas de atracos menores, contrabando y actividades de alto pago.'
  },
  'trucos-para-minimizar-gastos-y-multas-judiciales-gta-6': {
    url: '/images/Lugares_y_Mapas/Ambrosia_Postcard_landscape.webp',
    alt: 'Reducción de gastos legales, fianzas y multas de arresto en GTA 6',
    caption: 'Protección del patrimonio personal ante detenciones e incautaciones.'
  },
  'trucos-para-personalizar-y-modificar-armas-gta-6': {
    url: '/images/Armas/VINTAGE_VICE_CITY_WEAPON_PATTERN_01.webp',
    alt: 'Modificación balística, miras y accesorios de armas en GTA 6',
    caption: 'Calibración de cañones, empuñaduras y cargadores ampliados en talleres.'
  },
  'trucos-para-subir-atributos-y-fisico-gta-6': {
    url: '/images/Ropa_y_Personalizacion/ULTIMATE_EDITION_STOCK_305_01.webp',
    alt: 'Entrenamiento físico, gimnasios y atributos en GTA 6',
    caption: 'Aumento de resistencia, fuerza, capacidad pulmonar y velocidad.'
  },
  'trucos-y-codigos-de-trucos-gta-6': {
    url: '/images/Artes_y_Ediciones/VINTAGE_VICE_CITY_PACK_01.webp',
    alt: 'Códigos de trucos, comandos de botones y teléfonos en GTA 6',
    caption: 'Guía sobre la activación de ventajas, vehículos y trucos clásicos.'
  }
};

const subcategoryMapping = {
  'consejos-de-escape-policial-nivel-de-busqueda-gta-6': { sub: 'supervivencia', label: 'Trucos y Consejos · Supervivencia' },
  'consejos-de-gestion-de-inventario-y-armas-gta-6': { sub: 'gameplay', label: 'Trucos y Consejos · Mecánicas' },
  'consejos-de-sobrevivencia-al-clima-extremo-y-huracanes-gta-6': { sub: 'supervivencia', label: 'Trucos y Consejos · Supervivencia' },
  'consejos-para-el-atraco-a-bancos-y-fisa-bank-gta-6': { sub: 'dinero', label: 'Trucos y Consejos · Dinero Fácil' },
  'consejos-para-el-combate-y-tiroteos-gta-6': { sub: 'combate', label: 'Trucos y Consejos · Combate' },
  'consejos-para-el-contrabando-maritimo-y-aereo-gta-6': { sub: 'dinero', label: 'Trucos y Consejos · Dinero Fácil' },
  'consejos-para-el-transporte-y-uso-de-compañeros-gta-6': { sub: 'gameplay', label: 'Trucos y Consejos · Mecánicas' },
  'consejos-para-ganar-carreras-ilegales-y-takeovers-gta-6': { sub: 'conduccion', label: 'Trucos y Consejos · Conducción' },
  'consejos-para-gestionar-rehenes-y-control-de-multitudes-gta-6': { sub: 'gameplay', label: 'Trucos y Consejos · Mecánicas' },
  'consejos-para-la-caza-y-fauna-en-grassrivers-gta-6': { sub: 'exploracion', label: 'Trucos y Consejos · Exploración' },
  'consejos-para-la-gestion-de-vehiculos-comerciales-y-remolques-gta-6': { sub: 'conduccion', label: 'Trucos y Consejos · Conducción' },
  'consejos-para-robar-coches-y-hackeo-wank-gta-6': { sub: 'gameplay', label: 'Trucos y Consejos · Mecánicas' },
  'consejos-para-superar-eventos-aleatorios-y-encuentros-gta-6': { sub: 'secretos', label: 'Trucos y Consejos · Secretos' },
  'guia-de-inicio-10-consejos-fundamentales-gta-6': { sub: 'consejos-principiantes', label: 'Trucos y Consejos · Principiantes' },
  'trucos-de-conduccion-y-tuning-gta-6': { sub: 'conduccion', label: 'Trucos y Consejos · Conducción' },
  'trucos-de-navegacion-y-exploracion-de-arrecifes-gta-6': { sub: 'exploracion', label: 'Trucos y Consejos · Exploración' },
  'trucos-de-sigilo-e-infiltracion-gta-6': { sub: 'combate', label: 'Trucos y Consejos · Combate' },
  'trucos-de-sinergia-y-confianza-jason-lucia-gta-6': { sub: 'gameplay', label: 'Trucos y Consejos · Mecánicas' },
  'trucos-para-aprovechar-los-interiores-accesibles-gta-6': { sub: 'exploracion', label: 'Trucos y Consejos · Exploración' },
  'trucos-para-comprar-y-gestionar-pisos-francos-gta-6': { sub: 'consejos-rapidos', label: 'Trucos y Consejos · Consejos Rápidos' },
  'trucos-para-desactivar-sistemas-de-seguridad-y-alarmas-gta-6': { sub: 'gameplay', label: 'Trucos y Consejos · Mecánicas' },
  'trucos-para-dominio-de-las-redes-sociales-snapmatic-gta-6': { sub: 'consejos-rapidos', label: 'Trucos y Consejos · Consejos Rápidos' },
  'trucos-para-el-blanqueo-de-dinero-sucio-gta-6': { sub: 'dinero', label: 'Trucos y Consejos · Dinero Fácil' },
  'trucos-para-el-combate-cuerpo-a-cuerpo-y-peleas-gta-6': { sub: 'combate', label: 'Trucos y Consejos · Combate' },
  'trucos-para-evitar-el-rastreo-y-camaras-cctv-gta-6': { sub: 'supervivencia', label: 'Trucos y Consejos · Supervivencia' },
  'trucos-para-ganar-dinero-rapido-gta-6': { sub: 'dinero', label: 'Trucos y Consejos · Dinero Fácil' },
  'trucos-para-minimizar-gastos-y-multas-judiciales-gta-6': { sub: 'consejos-rapidos', label: 'Trucos y Consejos · Consejos Rápidos' },
  'trucos-para-personalizar-y-modificar-armas-gta-6': { sub: 'combate', label: 'Trucos y Consejos · Combate' },
  'trucos-para-subir-atributos-y-fisico-gta-6': { sub: 'consejos-rapidos', label: 'Trucos y Consejos · Consejos Rápidos' },
  'trucos-y-codigos-de-trucos-gta-6': { sub: 'trucos', label: 'Trucos y Consejos · Trucos' }
};

const authorsList = [
  {
    name: 'Elena Navarro',
    role: 'Especialista en Gameplay y Estrategia Táctica',
    avatar: '/images/Personajes/Real_Dimez_04.webp',
    bio: 'Analista táctica de combate, sistemas de juego y mecánicas de mundo abierto.'
  },
  {
    name: 'Marcos Valiente',
    role: 'Jefe de Redacción & Especialista en Rockstar Games',
    avatar: '/images/Personajes/Brian_Heder_01.webp',
    bio: 'Especialista en sagas de mundo abierto y tecnología de Rockstar Games.'
  },
  {
    name: 'Tomás Garrido',
    role: 'Editor de Guías & Supervivencia en Leonida',
    avatar: '/images/Personajes/Jason_Duval_01.webp',
    bio: 'Experto en economía criminal, vehículos y exploración en GTA.'
  }
];

function parseMarkdownArticle(file, rawContent, index) {
  const frontmatterMatch = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const meta = {};
  let body = rawContent;

  if (frontmatterMatch) {
    frontmatterMatch[1].split('\n').forEach(line => {
      const p = line.split(':');
      if (p.length >= 2) {
        meta[p[0].trim()] = p.slice(1).join(':').trim().replace(/^["']|["']$/g, '');
      }
    });
    body = rawContent.slice(frontmatterMatch[0].length).trim();
  }

  const slug = meta.slug || file.replace('.md', '').replace(/^consejos-para-gestionar-rehenes-y-control-de-multitudes-gta-$/, 'consejos-para-gestionar-rehenes-y-control-de-multitudes-gta-6');
  const normalizedSlug = slug.endsWith('-gta-') ? `${slug}6` : slug;
  const title = meta.title || 'Consejos y Trucos para GTA 6';
  const description = meta.description || 'Guía estratégica y consejos avanzados para dominar GTA 6 en Leonida.';

  // Parse sections from body
  const lines = body.split('\n');
  let leadText = '';
  const sections = [];
  const takeaways = [];

  let currentHeading = '';
  let currentParagraphs = [];

  let isReadingLead = true;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (line.startsWith('# ')) {
      // Main H1, ignore
      continue;
    }

    if (line.startsWith('## ') || line.startsWith('### ')) {
      isReadingLead = false;
      if (currentHeading || currentParagraphs.length > 0) {
        sections.push({
          heading: currentHeading || 'Aspectos Clave',
          paragraphs: currentParagraphs
        });
        currentParagraphs = [];
      }
      currentHeading = line.replace(/^#+\s*/, '').trim();
      continue;
    }

    if (line === '---') {
      continue;
    }

    if (isReadingLead && !leadText) {
      leadText = line.replace(/^\*\*|\*\*$/g, '');
      continue;
    }

    if (line.startsWith('* ') || line.startsWith('- ') || /^\d+\.\s/.test(line)) {
      const cleanBullet = line.replace(/^(\*|-|\d+\.)\s*/, '');
      currentParagraphs.push(cleanBullet);
      if (takeaways.length < 3 && cleanBullet.length > 25 && !cleanBullet.startsWith('http')) {
        takeaways.push(cleanBullet.replace(/^\*\*([^*]+)\*\*:\s*/, '$1: '));
      }
    } else {
      currentParagraphs.push(line);
    }
  }

  if (currentHeading || currentParagraphs.length > 0) {
    sections.push({
      heading: currentHeading || 'Recomendaciones Finales',
      paragraphs: currentParagraphs
    });
  }

  if (!leadText && sections.length > 0 && sections[0].paragraphs.length > 0) {
    leadText = sections[0].paragraphs[0];
  }

  if (takeaways.length === 0) {
    takeaways.push(
      'Aplica estos métodos prácticos para optimizar tus recursos y tiempo en Leonida.',
      'Sincroniza tus movimientos con tu compañero y mantén armamento preparado en el maletero.'
    );
  }

  const author = authorsList[index % authorsList.length];
  const imgInfo = imageMapping[normalizedSlug] || {
    url: '/images/Artes_y_Ediciones/Official_Cover_Art_landscape.webp',
    alt: `${title} - GTA 6 Oficial`,
    caption: `Fotografía y análisis sobre ${title} en el estado de Leonida.`
  };

  const subInfo = subcategoryMapping[normalizedSlug] || {
    sub: 'consejos-rapidos',
    label: 'Trucos y Consejos · Consejos Rápidos'
  };

  const articleId = `art-trucos-${String(index + 1).padStart(3, '0')}`;

  return {
    id: articleId,
    slug: normalizedSlug,
    title: title,
    subtitle: description,
    seoTitle: `${title} | KAIROSION Editorial`,
    seoDescription: description,
    canonicalUrl: `https://kairosion.online/gta-6/trucos-consejos/${normalizedSlug}`,
    excerpt: description,
    category: 'trucos-consejos',
    subcategorySlug: subInfo.sub,
    categoryLabel: subInfo.label,
    verificationType: 'truco-rapido',
    author: author,
    publishedAt: new Date(Date.now() - (index * 3600 * 1000 * 4)).toISOString(),
    updatedAt: new Date().toISOString(),
    readTimeMinutes: Math.max(3, Math.min(8, Math.round(body.length / 450))),
    tags: [
      'GTA 6',
      'Trucos y Consejos',
      'Leonida',
      'Guías GTA 6',
      subInfo.label.split('·')[1]?.trim() || 'Estrategia'
    ],
    isHero: index === 0 || index === 13,
    isTrending: index < 5,
    isLatest: true,
    difficulty: index % 3 === 0 ? 'Avanzado' : index % 2 === 0 ? 'Intermedio' : 'Principiante',
    featuredImage: {
      url: imgInfo.url,
      alt: imgInfo.alt,
      caption: imgInfo.caption,
      badge: 'TRUCOS & CONSEJOS'
    },
    schemaType: 'TechArticle',
    content: {
      leadText: leadText || description,
      sections: sections,
      takeaways: takeaways.slice(0, 3)
    },
    relatedSlugs: [
      'manual-de-huida-policial-como-eludir-patrullas-y-sobrevivir-a-las-6-estrellas-en-leonida',
      'guia-de-inicio-10-consejos-fundamentales-gta-6'
    ],
    likes: Math.floor(120 + Math.random() * 850),
    shares: Math.floor(35 + Math.random() * 220),
    views: Math.floor(1500 + Math.random() * 8500)
  };
}

async function main() {
  const articles = [];

  files.forEach((file, index) => {
    const raw = fs.readFileSync(path.join(blogsDir, file), 'utf8');
    const art = parseMarkdownArticle(file, raw, index);
    articles.push(art);
  });

  console.log(`Generated ${articles.length} structured articles.`);

  // 1. Write src/data/tipsArticles.ts
  const tsContent = `import { Article } from '../types';

export const TIPS_ARTICLES: Article[] = ${JSON.stringify(articles, null, 2)};
`;

  fs.writeFileSync('src/data/tipsArticles.ts', tsContent, 'utf8');
  console.log("✅ Written src/data/tipsArticles.ts");

  // 2. Update src/data/articles.ts to import and include TIPS_ARTICLES
  let articlesTs = fs.readFileSync('src/data/articles.ts', 'utf8');
  if (!articlesTs.includes("import { TIPS_ARTICLES } from './tipsArticles';")) {
    articlesTs = `import { TIPS_ARTICLES } from './tipsArticles';\n` + articlesTs;
  }

  // Insert ...TIPS_ARTICLES under CATEGORIA 4: TRUCOS Y CONSEJOS if not present
  if (!articlesTs.includes('...TIPS_ARTICLES')) {
    const trucosCatIndex = articlesTs.indexOf('// CATEGORIA 4: TRUCOS Y CONSEJOS');
    if (trucosCatIndex !== -1) {
      const nextCatIndex = articlesTs.indexOf('// CATEGORIA 5: PERSONAJES', trucosCatIndex);
      if (nextCatIndex !== -1) {
        articlesTs = articlesTs.slice(0, nextCatIndex) + '  ...TIPS_ARTICLES,\n\n  ' + articlesTs.slice(nextCatIndex);
      }
    }
  }

  fs.writeFileSync('src/data/articles.ts', articlesTs, 'utf8');
  console.log("✅ Updated src/data/articles.ts with TIPS_ARTICLES");

  // 3. Sync all 30 articles to Turso Cloud DB
  console.log("Syncing articles to Turso Cloud DB...");
  for (const art of articles) {
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
        null,
        art.readTimeMinutes || 5,
        JSON.stringify(art.tags || []),
        Math.max(0, Math.floor(Number(art.likes) || 0)),
        Math.max(0, Math.floor(Number(art.shares) || 0)),
        Math.max(0, Math.floor(Number(art.views) || 0)),
        art.isHero ? 1 : 0,
        art.isTrending ? 1 : 0,
        art.isLatest ? 1 : 0,
        JSON.stringify(art.featuredImage),
        null,
        art.schemaType || 'TechArticle',
        JSON.stringify(art.content),
        JSON.stringify(art.relatedSlugs || []),
        'publicado',
        JSON.stringify([])
      ]
    });
  }

  console.log(`✅ Successfully uploaded and synced ${articles.length} trucos & consejos articles to Turso DB!`);
}

main().catch(console.error);
