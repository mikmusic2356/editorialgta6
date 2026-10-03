import { createClient } from "@libsql/client";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const url = process.env.VITE_TURSO_DATABASE_URL || "https://dbkairosion-mikmusic2356.aws-us-east-2.turso.io";
const authToken = process.env.VITE_TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN;

const turso = createClient({
  url: url.replace(/^libsql:\/\//, "https://"),
  authToken
});

const basePublicDir = path.join(process.cwd(), 'public', 'images');

function cleanTitle(filename) {
  return filename
    .replace(/\.[^/.]+$/, '')
    .replace(/_/g, ' ')
    .replace(/ULTIMATE EDITION /g, '')
    .replace(/VINTAGE VICE CITY PACK /g, '')
    .replace(/landscape/g, '')
    .trim();
}

function getCategoryName(folder) {
  switch (folder) {
    case 'Personajes': return 'Personajes';
    case 'Lugares_y_Mapas': return 'Mapa & Mundo';
    case 'Vehiculos': return 'Vehículos';
    case 'Armas': return 'Armas';
    case 'Ropa_y_Personalizacion': return 'Personalización & Moda';
    case 'Artes_y_Ediciones': return 'Artes & Portadas';
    default: return folder;
  }
}

async function registerAllMedia() {
  console.log("Scanning public/images for all assets...");
  const folders = fs.readdirSync(basePublicDir);
  const mediaItems = [];
  const presetItems = [];

  let idx = 1;
  for (const folder of folders) {
    const folderPath = path.join(basePublicDir, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;

    const files = fs.readdirSync(folderPath);
    for (const file of files) {
      if (!file.match(/\.(jpg|jpeg|png|webp)$/i)) continue;
      const filePath = path.join(folderPath, file);
      const stat = fs.statSync(filePath);
      const webUrl = `/images/${folder}/${file}`;
      const title = cleanTitle(file);
      const categoryName = getCategoryName(folder);

      const mediaItem = {
        id: `med-gta6-${String(idx).padStart(3, '0')}`,
        url: webUrl,
        name: file,
        alt: `${title} - GTA 6 Oficial`,
        title: title,
        caption: `Fotografía oficial de ${title} en el estado de Leonida.`,
        credit: 'Rockstar Games / KAIROSION Editorial',
        sizeKb: Math.round(stat.size / 1024),
        dimensions: '1920x1080',
        mimeType: 'image/jpeg',
        createdAt: new Date().toISOString()
      };

      mediaItems.push(mediaItem);

      presetItems.push({
        url: webUrl,
        title: title,
        alt: `${title} - GTA 6 Oficial`,
        caption: `Fotografía oficial de ${title} en el estado de Leonida.`,
        category: categoryName
      });

      idx++;
    }
  }

  console.log(`Generated ${mediaItems.length} media records.`);

  // 1. Insert into Turso DB
  console.log("Syncing all media items to Turso DB...");
  // Clear old unsplash media from Turso
  await turso.execute("DELETE FROM media WHERE url LIKE '%unsplash.com%'");
  
  for (const m of mediaItems) {
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
        m.alt,
        m.title,
        m.caption,
        m.credit,
        m.sizeKb,
        m.dimensions,
        m.mimeType,
        m.createdAt
      ]
    });
  }

  console.log("✅ Synced all media items to Turso DB.");

  // 2. Save media items to a dedicated data file: src/data/mediaData.ts
  const mediaTs = `import { MediaItem } from '../types/cms';

export const ALL_MEDIA_ITEMS: MediaItem[] = ${JSON.stringify(mediaItems, null, 2)};

export const PRESET_STOCK_MEDIA = ${JSON.stringify(presetItems, null, 2)};
`;
  fs.writeFileSync('src/data/mediaData.ts', mediaTs, 'utf8');
  console.log("✅ Written src/data/mediaData.ts");

  // 3. Update MediaPickerModal.tsx to use PRESET_STOCK_MEDIA from src/data/mediaData.ts
  let pickerCode = fs.readFileSync('src/components/admin/MediaPickerModal.tsx', 'utf8');
  // If it defines PRESET_STOCK_MEDIA locally, replace it to import from mediaData
  if (pickerCode.includes('const PRESET_STOCK_MEDIA = [')) {
    const pStart = pickerCode.indexOf('const PRESET_STOCK_MEDIA = [');
    const pEnd = pickerCode.indexOf('];', pStart);
    pickerCode = pickerCode.slice(0, pStart) + `import { PRESET_STOCK_MEDIA } from '../../data/mediaData';\n` + pickerCode.slice(pEnd + 2);
  } else if (!pickerCode.includes('PRESET_STOCK_MEDIA')) {
    pickerCode = `import { PRESET_STOCK_MEDIA } from '../../data/mediaData';\n` + pickerCode;
  }
  fs.writeFileSync('src/components/admin/MediaPickerModal.tsx', pickerCode, 'utf8');
  console.log("✅ Updated MediaPickerModal.tsx");

  // 4. Update CMSContext.tsx initialMedia to use ALL_MEDIA_ITEMS from src/data/mediaData.ts
  let cmsCode = fs.readFileSync('src/context/CMSContext.tsx', 'utf8');
  if (!cmsCode.includes('ALL_MEDIA_ITEMS')) {
    cmsCode = `import { ALL_MEDIA_ITEMS } from '../data/mediaData';\n` + cmsCode;
  }
  const mStart = cmsCode.indexOf('const initialMedia: MediaItem[] = [');
  if (mStart !== -1) {
    const mEnd = cmsCode.indexOf('];', mStart);
    cmsCode = cmsCode.slice(0, mStart) + `const initialMedia: MediaItem[] = ALL_MEDIA_ITEMS;` + cmsCode.slice(mEnd + 2);
  }
  fs.writeFileSync('src/context/CMSContext.tsx', cmsCode, 'utf8');
  console.log("✅ Updated CMSContext.tsx initialMedia");
}

registerAllMedia().catch(console.error);
