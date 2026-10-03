import fs from 'fs';
import path from 'path';

const blogsDir = path.join(process.cwd(), 'BLOGS', 'personajes');
const files = fs.readdirSync(blogsDir).filter(f => f.endsWith('.md'));

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

const characterGalleries = {
  'lucia-caminos': [
    {
      url: '/images/Personajes/Jason_and_Lucia_Robbery_With_Logo_landscape.webp',
      title: 'Lucia en Acción durante el Atraco',
      caption: 'Lucia armada durante una incursión criminal en el estado de Leonida.',
      credit: 'Rockstar Games / KAIROSION Editorial'
    },
    {
      url: '/images/Personajes/Jason_and_Lucia_Motel_landscape.webp',
      title: 'Lucia y Jason en el Motel',
      caption: 'Secuencia de planificación íntima y estratégica en el refugio de Vice City.',
      credit: 'Rockstar Games / KAIROSION Editorial'
    }
  ],
  'jason-duval': [
    {
      url: '/images/Personajes/Jason_Duval_01.webp',
      title: 'Retrato Oficial de Jason Duval',
      caption: 'Dossier e informe visual de Jason Duval en Grand Theft Auto VI.',
      credit: 'Rockstar Games / KAIROSION Editorial'
    },
    {
      url: '/images/Personajes/Jason_and_Lucia_Motel_landscape.webp',
      title: 'Jason y Lucia en el Motel',
      caption: 'Jason Duval coordinando tácticas conjuntas con Lucia.',
      credit: 'Rockstar Games / KAIROSION Editorial'
    },
    {
      url: '/images/Personajes/Jason_and_Lucia_Robbery_With_Logo_landscape.webp',
      title: 'Asalto a Mano Armada',
      caption: 'Jason liderando una incursión táctica en Leonida.',
      credit: 'Rockstar Games / KAIROSION Editorial'
    }
  ],
  'boobie-ike': [
    {
      url: '/images/Personajes/Boobie_Ike_landscape.webp',
      title: 'Boobie Ike en la Noche de Vice City',
      caption: 'Magnate de la vida nocturna y propietario del club Jack of Hearts.',
      credit: 'Rockstar Games / KAIROSION Editorial'
    },
    {
      url: '/images/Personajes/Boobie_Ike_03.webp',
      title: 'Retrato de Boobie Ike',
      caption: 'Perfil oficial del promotor musical y empresario de Leonida.',
      credit: 'Rockstar Games / KAIROSION Editorial'
    }
  ],
  'brian-heder': [
    {
      url: '/images/Personajes/Brian_Heder_landscape.webp',
      title: 'Brian Heder en los Cayos',
      caption: 'Veterano contrabandista y aliado clave en Leonida Keys.',
      credit: 'Rockstar Games / KAIROSION Editorial'
    },
    {
      url: '/images/Personajes/Brian_Heder_01.webp',
      title: 'Retrato de Brian Heder',
      caption: 'Perfil del mentor y contacto marítimo de Jason y Lucia.',
      credit: 'Rockstar Games / KAIROSION Editorial'
    }
  ],
  'cal-hampton': [
    {
      url: '/images/Personajes/Cal_Hampton_landscape.webp',
      title: 'Cal Hampton y Vigilancia Aérea',
      caption: 'Especialista en comunicaciones, radares y conspiraciones en los pantanos.',
      credit: 'Rockstar Games / KAIROSION Editorial'
    },
    {
      url: '/images/Personajes/Cal_Hampton_03.webp',
      title: 'Retrato de Cal Hampton',
      caption: 'Expediente clasificado de Cal Hampton.',
      credit: 'Rockstar Games / KAIROSION Editorial'
    }
  ],
  'drequan-priest': [
    {
      url: '/images/Personajes/DreQuan_Priest_landscape.webp',
      title: 'Dre\'Quan Priest en Only Raw Records',
      caption: 'Productor discográfico y figura central de la escena urbana de Vice City.',
      credit: 'Rockstar Games / KAIROSION Editorial'
    },
    {
      url: '/images/Personajes/DreQuan_Priest_02.webp',
      title: 'Retrato de Dre\'Quan Priest',
      caption: 'Perfil oficial de Dre\'Quan Priest.',
      credit: 'Rockstar Games / KAIROSION Editorial'
    },
    {
      url: '/images/Personajes/DreQuan_Priest_04.webp',
      title: 'Sesión de Grabación',
      caption: 'Detalle de producción musical en los estudios de Vice City.',
      credit: 'Rockstar Games / KAIROSION Editorial'
    }
  ],
  'raul-bautista': [
    {
      url: '/images/Personajes/Raul_Bautista_landscape.webp',
      title: 'Raul Bautista en Despliegue Táctico',
      caption: 'Especialista en asaltos armados y ex-agente operativo en Leonida.',
      credit: 'Rockstar Games / KAIROSION Editorial'
    },
    {
      url: '/images/Personajes/Raul_Bautista_03.webp',
      title: 'Retrato de Raul Bautista',
      caption: 'Expediente criminal de Raul Bautista.',
      credit: 'Rockstar Games / KAIROSION Editorial'
    }
  ],
  'real-dimez': [
    {
      url: '/images/Personajes/Real_Dimez_landscape.webp',
      title: 'Dúo Real Dimez en Vice City',
      caption: 'Bae-Luxe y Roxy dominando las tendencias virales y redes en Leonida.',
      credit: 'Rockstar Games / KAIROSION Editorial'
    },
    {
      url: '/images/Personajes/Real_Dimez_04.webp',
      title: 'Retrato de Real Dimez',
      caption: 'Imagen promocional del dúo musical Real Dimez.',
      credit: 'Rockstar Games / KAIROSION Editorial'
    }
  ]
};

const characters = files.map((file, idx) => {
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
      const colIdx = rawLine.indexOf(':');
      if (colIdx !== -1) {
        const key = rawLine.slice(0, colIdx).trim();
        let val = rawLine.slice(colIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        frontmatter[key] = val;
      }
    } else {
      bodyLines.push(rawLine);
    }
  }

  const cleanSlug = file.replace('.md', '').replace(' (1)', '');
  const title = frontmatter.title || cleanSlug;
  const bio = frontmatter.description || `Expediente oficial de ${title} en Grand Theft Auto VI.`;
  const name = title.split(' en GTA 6')[0].split(':')[0].trim();
  const articleSlug = frontmatter.slug || `${cleanSlug}-gta-6`;
  const imgUrl = characterImages[cleanSlug] || '/images/Artes_y_Ediciones/Official_Cover_Art_landscape.webp';

  // Story sections
  const story = [];
  let currentStory = null;

  for (let i = 0; i < bodyLines.length; i++) {
    const line = bodyLines[i].trim();
    if (!line) continue;
    if (line.startsWith('## Historia') || line.startsWith('## ¿Quién es') || line.startsWith('## Personalidad') || line.startsWith('## Papel')) {
      if (currentStory) story.push(currentStory);
      currentStory = {
        heading: line.replace('## ', '').trim(),
        paragraphs: []
      };
    } else if (line.startsWith('## ')) {
      if (currentStory) {
        story.push(currentStory);
        currentStory = null;
      }
    } else if (currentStory) {
      currentStory.paragraphs.push(line);
    }
  }
  if (currentStory) story.push(currentStory);

  const defaultGallery = [
    {
      url: imgUrl,
      title: `Retrato Oficial de ${name}`,
      caption: `Dossier e informe de inteligencia de ${name} en Grand Theft Auto VI.`,
      credit: 'Render Editorial KAIROSION / Rockstar Games'
    }
  ];

  return {
    id: `char-${cleanSlug}`,
    slug: cleanSlug,
    name: name,
    alias: frontmatter.focus_keyword || name,
    role: cleanSlug === 'lucia-caminos' || cleanSlug === 'jason-duval' ? 'Protagonista Jugable' : 'Personaje Secundario',
    status: 'Confirmado',
    faction: 'Bajo Mundo & Facciones de Leonida',
    bio: bio,
    mainImage: imgUrl,
    gallery: characterGalleries[cleanSlug] || defaultGallery,
    personalData: {
      origin: 'Estado de Leonida / Vice City',
      specialty: 'Perfil verificado en la base de datos de GTA 6'
    },
    story: story.length > 0 ? story : [
      {
        heading: 'Información e Historia',
        paragraphs: [bio]
      }
    ],
    relatedArticleSlugs: [articleSlug],
    imageBadge: `EXPEDIENTE #${String(idx + 1).padStart(3, '0')}`
  };
});

const tsCode = `import { CharacterProfile } from '../types';

export const CHARACTERS_DATA: CharacterProfile[] = ${JSON.stringify(characters, null, 2)};
`;

fs.writeFileSync(path.join(process.cwd(), 'src', 'data', 'characters.ts'), tsCode, 'utf-8');
console.log('Successfully regenerated src/data/characters.ts with', characters.length, 'characters.');
