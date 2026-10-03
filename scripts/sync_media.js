import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';

const baseDir = './public/images';
const categories = fs.readdirSync(baseDir);

const mediaItems = [];

for (const cat of categories) {
  const catDir = path.join(baseDir, cat);
  if (fs.existsSync(catDir) && fs.statSync(catDir).isDirectory()) {
    const files = fs.readdirSync(catDir);
    for (const f of files) {
      if (f.endsWith('.webp')) {
        const full = path.join(catDir, f);
        const st = fs.statSync(full);
        const cleanName = f.replace(/\.webp$/, '');
        const title = cleanName
          .replace(/^ULTIMATE_EDITION_/i, '')
          .replace(/^VINTAGE_VICE_CITY_/i, '')
          .replace(/_/g, ' ');

        mediaItems.push({
          id: 'med-' + cat.toLowerCase().slice(0, 3) + '-' + cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          url: '/images/' + cat + '/' + f,
          name: f,
          alt: title + ' - GTA 6 Oficial WebP',
          title: title,
          caption: 'Fotografía oficial y optimizada WebP de ' + title + ' en Leonida.',
          credit: 'Rockstar Games / KAIROSION Media Hub',
          sizeKb: Math.max(1, Math.round(st.size / 1024)),
          dimensions: '1920x1080',
          mimeType: 'image/webp',
          createdAt: new Date().toISOString()
        });
      }
    }
  }
}

console.log(`Found ${mediaItems.length} WebP media items in public/images.`);

// 1. Write src/data/mediaData.ts
const fileHeader = `import { MediaItem } from '../types/cms';\n\nexport const ALL_MEDIA_ITEMS: MediaItem[] = `;
const fileFooter = `;\n\nexport const PRESET_STOCK_MEDIA = ALL_MEDIA_ITEMS;\n`;
fs.writeFileSync('./src/data/mediaData.ts', fileHeader + JSON.stringify(mediaItems, null, 2) + fileFooter, 'utf-8');
console.log('Successfully written src/data/mediaData.ts');

// 2. Sync with Turso Database
const envContent = fs.readFileSync('.env', 'utf-8');
let token = '';
let url = 'https://dbkairosion-mikmusic2356.aws-us-east-2.turso.io';
for (const line of envContent.split('\n')) {
  if (line.startsWith('VITE_TURSO_AUTH_TOKEN=')) {
    token = line.split('=')[1].trim().replace(/^["']|["']$/g, '');
  }
  if (line.startsWith('VITE_TURSO_DATABASE_URL=')) {
    url = line.split('=')[1].trim().replace(/^["']|["']$/g, '');
  }
}

const client = createClient({ url, authToken: token });

async function syncTurso() {
  console.log('Syncing Turso database...');
  // Delete all old media records
  await client.execute('DELETE FROM media');
  console.log('Cleared old media records in Turso.');

  for (const item of mediaItems) {
    await client.execute({
      sql: `INSERT INTO media (id, url, name, alt, title, caption, credit, size_kb, dimensions, mime_type, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        item.id,
        item.url,
        item.name,
        item.alt,
        item.title,
        item.caption,
        item.credit,
        item.sizeKb,
        item.dimensions,
        item.mimeType,
        item.createdAt
      ]
    });
  }
  console.log(`Successfully synced ${mediaItems.length} WebP media items to Turso DB!`);

  // Update articles in Turso DB
  const articlesRes = await client.execute('SELECT id, featured_image_json, content_json FROM articles');
  let updatedCount = 0;
  for (const row of articlesRes.rows) {
    let fi = row.featured_image_json;
    let co = row.content_json;
    let mod = false;

    if (fi && (fi.includes('.jpg') || fi.includes('.jpeg') || fi.includes('.png'))) {
      fi = fi.replace(/\.(jpg|jpeg|png)/g, '.webp');
      mod = true;
    }
    if (co && (co.includes('.jpg') || co.includes('.jpeg') || co.includes('.png'))) {
      co = co.replace(/\.(jpg|jpeg|png)/g, '.webp');
      mod = true;
    }

    if (mod) {
      await client.execute({
        sql: 'UPDATE articles SET featured_image_json = ?, content_json = ? WHERE id = ?',
        args: [fi, co, row.id]
      });
      updatedCount++;
    }
  }
  console.log(`Updated ${updatedCount} articles in Turso to .webp format.`);
}

syncTurso().catch(console.error);
