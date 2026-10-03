import fs from 'fs';
import path from 'path';

const blogsDir = path.join(process.cwd(), 'BLOGS', 'personajes');
const files = fs.readdirSync(blogsDir).filter(f => f.endsWith('.md'));

const subcategories = [
  { slug: 'lucia-caminos', name: 'Lucia Caminos', description: 'Biografía, origen, historial penal y habilidades de Lucia.' },
  { slug: 'jason-duval', name: 'Jason Duval', description: 'Historia, pasado militar, armamento y química de pareja con Lucia.' },
  { slug: 'agente-menddees', name: 'Agente Menddees', description: 'Comandante policial corrupto y conexiones en Vice City.' },
  { slug: 'andreas-deleo', name: 'Andreas Deleó', description: 'CEO de Megamundo, magnate corporativo y cliente VIP.' },
  { slug: 'boobie-ike', name: 'Boobie Ike', description: 'Magnate de la noche, dueño del club Jack of Hearts y Only Raw Records.' },
  { slug: 'brian-heder', name: 'Brian Heder', description: 'Mentor, contrabandista veterano y aliado en los Cayos de Leonida.' },
  { slug: 'cal-hampton', name: 'Cal Hampton', description: 'Aliado paranoico de los Cayos, experto en vigilancia y conspiraciones.' },
  { slug: 'donnie', name: 'Donnie', description: 'Criminal salvaje y figura caótica de los Cayos.' },
  { slug: 'dracoin-rayquan', name: 'Dracoin / Rayquan', description: 'Contacto de ocio urbano y escena musical en Vice City.' },
  { slug: 'drequan-priest', name: 'Dre\'Quan Priest', description: 'Productor musical de hip-hop y cofundador de Only Raw Records.' },
  { slug: 'el-abogado-del-contenedor', name: 'El Abogado del Contenedor', description: 'Jurista estrafalario de encuentros aleatorios en Vice City.' },
  { slug: 'el-streamer-del-trunk-challenge', name: 'El Streamer del Trunk Challenge', description: 'Influencer viral y creador de desafíos en vivo en Leonida.' },
  { slug: 'ernesto', name: 'Ernesto', description: 'Contacto logístico del transporte de narcóticos en Leonida.' },
  { slug: 'jimmy-kanto', name: 'Jimmy Kanto', description: 'Amigo de infancia de Brian Heder y lección del pasado.' },
  { slug: 'la-mujer-de-los-martillos', name: 'La Mujer de los Martillos', description: 'Evento aleatorio viral de Hamlet con ataques a vehículos.' },
  { slug: 'lorie', name: 'Lorie', description: 'Esposa de Brian Heder y contacto social en los Cayos.' },
  { slug: 'petra', name: 'Petra', description: 'Figura de la alta sociedad y esposa del magnate Andreas Deleó.' },
  { slug: 'propietaria-piso-franco', name: 'Propietaria del Piso Franco', description: 'Amiga de Lucia y dueña del departamento de seguridad en Vice City.' },
  { slug: 'raul-bautista', name: 'Raul Bautista', description: 'Atracador profesional de bancos y ex-agente de inteligencia.' },
  { slug: 'real-dimez', name: 'Real Dimez', description: 'Dúo musical urbano formado por Bae-Luxe y Roxy en Vice City.' },
  { slug: 'val', name: 'Val', description: 'Intermediaria ejecutiva y gestora de seguridad corporativa.' }
];

const characterImages = {
  'lucia-caminos': '/images/Personajes/Jason_and_Lucia_Robbery_With_Logo_landscape.webp',
  'jason-duval': '/images/Personajes/Jason_Duval_01.webp',
  'boobie-ike': '/images/Personajes/Boobie_Ike_landscape.webp',
  'brian-heder': '/images/Personajes/Brian_Heder_landscape.webp',
  'cal-hampton': '/images/Personajes/Cal_Hampton_landscape.webp',
  'drequan-priest': '/images/Personajes/DreQuan_Priest_landscape.webp',
  'raul-bautista': '/images/Personajes/Raul_Bautista_landscape.webp',
  'real-dimez': '/images/Personajes/Real_Dimez_landscape.webp',
  'agente-menddees': '/images/Artes_y_Ediciones/Official_Cover_Art_landscape.webp',
  'andreas-deleo': '/images/Ropa_y_Personalizacion/ULTIMATE_EDITION_VICE_CITY_STYLE_01.webp',
  'lorie': '/images/Ropa_y_Personalizacion/VINTAGE_VICE_CITY_PACK_EXCLUSIVE_LOOKS_01.webp',
  'petra': '/images/Ropa_y_Personalizacion/VINTAGE_VICE_CITY_PACK_EXCLUSIVE_LOOKS_02.webp',
  'val': '/images/Ropa_y_Personalizacion/ULTIMATE_EDITION_VICE_CITY_STYLE_02.webp',
  'propietaria-piso-franco': '/images/Ropa_y_Personalizacion/VINTAGE_VICE_CITY_PACK_EXCLUSIVE_LOOKS_03.webp',
  'donnie': '/images/Ropa_y_Personalizacion/ULTIMATE_EDITION_ONE_EYED_WILLIE_01.webp',
  'dracoin-rayquan': '/images/Ropa_y_Personalizacion/ULTIMATE_EDITION_STOCK_305_01.webp',
  'el-streamer-del-trunk-challenge': '/images/Ropa_y_Personalizacion/ULTIMATE_EDITION_ELECTRIC_FANG_01.webp',
  'el-abogado-del-contenedor': '/images/Ropa_y_Personalizacion/ULTIMATE_EDITION_GOODTIME_GEAR_01.webp',
  'ernesto': '/images/Ropa_y_Personalizacion/ULTIMATE_EDITION_RIDEOUT_CUSTOMS_01.webp',
  'jimmy-kanto': '/images/Ropa_y_Personalizacion/ULTIMATE_EDITION_STOCK_305_02.webp',
  'la-mujer-de-los-martillos': '/images/Ropa_y_Personalizacion/ULTIMATE_EDITION_ONE_EYED_WILLIE_02.webp'
};

const authorsList = [
  { name: 'Tomás Garrido', role: 'Editor de Lore & Personajes', avatar: '/images/Personajes/Jason_Duval_01.webp' },
  { name: 'Marcos Valiente', role: 'Jefe de Redacción', avatar: '/images/Personajes/Brian_Heder_01.webp' },
  { name: 'Elena Navarro', role: 'Analista Editorial', avatar: '/images/Personajes/Real_Dimez_04.webp' }
];

export function parseFileToArticle(file, index) {
  const content = fs.readFileSync(path.join(blogsDir, file), 'utf-8');
  const lines = content.split(/\r?\n/);
  
  let inFrontmatter = false;
  const frontmatter = {};
  const bodyLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();
    if (trimmed === '---') {
      if (!inFrontmatter) {
        inFrontmatter = true;
      } else {
        inFrontmatter = false;
      }
      continue;
    }
    if (inFrontmatter) {
      const idx = rawLine.indexOf(':');
      if (idx !== -1) {
        const key = rawLine.slice(0, idx).trim();
        let val = rawLine.slice(idx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        frontmatter[key] = val;
      }
    } else {
      bodyLines.push(rawLine);
    }
  }

  // Derive subcategory slug from filename or slug
  let cleanName = file.replace('.md', '').replace(' (1)', '');
  let subcategorySlug = cleanName;
  const matchedSub = subcategories.find(s => s.slug === subcategorySlug);
  const subcategoryName = matchedSub ? matchedSub.name : cleanName;

  let leadText = '';
  const sections = [];
  let currentSection = null;

  for (let i = 0; i < bodyLines.length; i++) {
    const line = bodyLines[i].trim();
    if (!line) continue;

    if (line.startsWith('# ')) {
      continue;
    } else if (line.startsWith('## ')) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        heading: line.replace('## ', '').trim(),
        paragraphs: []
      };
    } else if (line.startsWith('### ')) {
      const sub = line.replace('### ', '').trim();
      if (currentSection) {
        currentSection.paragraphs.push(`**${sub}**`);
      } else {
        leadText += ` **${sub}**`;
      }
    } else {
      if (currentSection) {
        currentSection.paragraphs.push(line);
      } else {
        leadText = leadText ? `${leadText} ${line}` : line;
      }
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  const author = authorsList[index % authorsList.length];
  const slug = frontmatter.slug || `${cleanName}-gta-6`;
  const title = frontmatter.title || `${subcategoryName} en GTA 6`;
  const excerpt = frontmatter.description || `Expediente y análisis completo de ${subcategoryName} en Grand Theft Auto VI.`;
  const imgUrl = characterImages[subcategorySlug] || '/images/Artes_y_Ediciones/Official_Cover_Art_landscape.webp';

  const tags = [subcategoryName, 'Personajes GTA 6', 'GTA 6', 'Lore', 'Leonida'];
  if (frontmatter.focus_keyword) {
    tags.unshift(frontmatter.focus_keyword);
  }

  const artObj = {
    id: `art-pers-${String(index + 1).padStart(2, '0')}`,
    slug: slug,
    title: title,
    seoTitle: `${title} | KAIROSION`,
    seoDescription: excerpt,
    excerpt: excerpt,
    category: 'personajes',
    subcategorySlug: subcategorySlug,
    categoryLabel: `Personajes · ${subcategoryName}`,
    verificationType: 'oficial',
    author: author,
    publishedAt: new Date(Date.now() - (21 - index) * 3600 * 1000 * 4).toISOString(),
    updatedAt: new Date().toISOString(),
    readTimeMinutes: Math.max(3, Math.round(content.length / 800)),
    tags: Array.from(new Set(tags)),
    isTrending: index < 5,
    isLatest: true,
    featuredImage: {
      url: imgUrl,
      alt: `${subcategoryName} en GTA 6`,
      caption: `Dossier oficial e informe de inteligencia sobre ${subcategoryName} en Leonida.`,
      badge: 'EXPEDIENTE DE PERSONAJE'
    },
    schemaType: 'Article',
    content: {
      leadText: leadText || excerpt,
      sections: sections.map(s => ({
        heading: s.heading,
        paragraphs: s.paragraphs
      })),
      takeaways: [
        `Dossier oficial de ${subcategoryName} verificado para Grand Theft Auto VI.`,
        `Detalles de historia, conexiones criminales y rol en el estado de Leonida.`
      ]
    },
    relatedSlugs: ['lucia-caminos-gta-6', 'jason-duval-gta-6'].filter(s => s !== slug)
  };

  return artObj;
}

const allArticles = files.map((f, i) => parseFileToArticle(f, i));
fs.writeFileSync(path.join(process.cwd(), 'scripts', 'generated_articles.json'), JSON.stringify(allArticles, null, 2), 'utf-8');
console.log(`Generated ${allArticles.length} structured character articles.`);
