import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const baseDir = path.join(process.cwd(), 'public', 'images');

async function optimizeImages(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await optimizeImages(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.webp')) {
      try {
        const statBefore = fs.statSync(fullPath);
        // Optimize if file > 100 KB or is avatar
        if (statBefore.size > 100 * 1024 || (dir.includes('Personajes') && !entry.name.includes('landscape') && statBefore.size > 40 * 1024)) {
          const isAvatar = dir.includes('Personajes') && !entry.name.includes('landscape') && !entry.name.includes('Robbery') && !entry.name.includes('Motel');
          const maxDim = isAvatar ? 320 : 1280;
          const quality = isAvatar ? 75 : 78;

          const inputBuffer = fs.readFileSync(fullPath);
          const outputBuffer = await sharp(inputBuffer)
            .resize({ width: maxDim, height: maxDim, fit: 'inside', withoutEnlargement: true })
            .webp({ quality, effort: 5 })
            .toBuffer();

          if (outputBuffer.length < statBefore.size) {
            fs.writeFileSync(fullPath, outputBuffer);
            console.log(`⚡ Compressed: ${entry.name} (${Math.round(statBefore.size / 1024)} KB -> ${Math.round(outputBuffer.length / 1024)} KB)`);
          }
        }
      } catch (err) {
        console.error(`Error optimizing ${entry.name}:`, err.message);
      }
    }
  }
}

async function run() {
  console.log('🚀 Optimizing public/images for mobile PageSpeed...');
  await optimizeImages(baseDir);
  console.log('✅ Image optimization complete!');
}

run();
