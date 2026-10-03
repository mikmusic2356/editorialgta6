import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { createClient } from "@libsql/client";
import dotenv from 'dotenv';

dotenv.config();

const baseDir = path.join(process.cwd(), 'public', 'images');
const dDriveDir = 'D:\\imagenes gta 6';

async function convertDir(targetDir) {
  if (!fs.existsSync(targetDir)) return;
  const entries = fs.readdirSync(targetDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(targetDir, entry.name);
    if (entry.isDirectory()) {
      await convertDir(fullPath);
    } else if (entry.isFile() && entry.name.match(/\.(jpg|jpeg|png)$/i)) {
      const webpPath = fullPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      
      const statBefore = fs.statSync(fullPath);
      await sharp(fullPath)
        .resize({ width: 1920, height: 1080, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82, effort: 4 })
        .toFile(webpPath);
      
      const statAfter = fs.statSync(webpPath);
      console.log(`Converted: ${entry.name} (${Math.round(statBefore.size/1024)} KB) -> ${path.basename(webpPath)} (${Math.round(statAfter.size/1024)} KB)`);
      
      // Delete old jpg/png
      fs.unlinkSync(fullPath);
    }
  }
}

async function updateCodeReferences(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'dist') {
      await updateCodeReferences(fullPath);
    } else if (entry.isFile() && entry.name.match(/\.(ts|tsx|js|json|md)$/i)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('/images/') && (content.includes('.jpg') || content.includes('.jpeg') || content.includes('.png'))) {
        const updated = content
          .replace(/\/images\/([^"'\s)]+)\.(jpg|jpeg|png)/gi, '/images/$1.webp');
        if (updated !== content) {
          fs.writeFileSync(fullPath, updated, 'utf8');
          console.log(`Updated code file: ${path.relative(process.cwd(), fullPath)}`);
        }
      }
    }
  }
}

async function updateTursoDB() {
  const url = (process.env.VITE_TURSO_DATABASE_URL || "").replace(/^libsql:\/\//, "https://");
  const authToken = process.env.VITE_TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) return;

  const turso = createClient({ url, authToken });
  console.log("Updating Turso DB URLs to .webp...");

  // Update articles
  const artRes = await turso.execute("SELECT id, featured_image_json, author_json FROM articles");
  for (const row of artRes.rows) {
    let featStr = String(row.featured_image_json).replace(/\.jpg/gi, '.webp');
    let authStr = String(row.author_json).replace(/\.jpg/gi, '.webp');
    await turso.execute({
      sql: "UPDATE articles SET featured_image_json = ?, author_json = ? WHERE id = ?",
      args: [featStr, authStr, row.id]
    });
  }

  // Update media
  const medRes = await turso.execute("SELECT id, url, name FROM media");
  for (const row of medRes.rows) {
    let newUrl = String(row.url).replace(/\.jpg/gi, '.webp');
    let newName = String(row.name).replace(/\.jpg/gi, '.webp');
    await turso.execute({
      sql: "UPDATE media SET url = ?, name = ?, mime_type = 'image/webp' WHERE id = ?",
      args: [newUrl, newName, row.id]
    });
  }
  console.log("✅ Turso DB articles and media updated to WebP.");
}

async function main() {
  console.log("Starting full WebP conversion and optimization...");
  console.log("1. Converting public/images...");
  await convertDir(baseDir);

  if (fs.existsSync(dDriveDir)) {
    console.log("2. Converting D:\\imagenes gta 6...");
    await convertDir(dDriveDir);
  }

  console.log("3. Updating code references across src/ and scripts/...");
  await updateCodeReferences(path.join(process.cwd(), 'src'));
  await updateCodeReferences(path.join(process.cwd(), 'scripts'));

  console.log("4. Updating Turso Cloud Database...");
  await updateTursoDB();

  console.log("✨ All images successfully converted to ultra-fast .webp and synced!");
}

main().catch(console.error);
