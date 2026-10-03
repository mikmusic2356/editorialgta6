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

const filesToUpdate = [
  'index.html',
  'public/robots.txt',
  'public/sitemap.xml',
  'src/utils/schemaGenerator.ts',
  'src/utils/sitemapGenerator.ts',
  'src/components/admin/AdminArticleEditor.tsx',
  'src/components/seo/SEOInspectorModal.tsx',
  'src/components/seo/SitemapView.tsx',
  'src/data/newsGta6Articles.ts',
  'src/data/newsRockstarArticles.ts',
  'src/data/tipsArticles.ts',
  'src/data/articles.ts',
  'src/data/characterArticles.ts',
  'src/data/locationArticles.ts',
  'src/data/vehicleArticles.ts',
  'src/data/weaponArticles.ts',
  'src/data/musicArticles.ts',
  'scripts/generate_sitemap_file.js',
  'scripts/generate_tips_articles.js'
];

async function updateDomain() {
  console.log("Replacing all instances of kairosion.com with kairosion.online in project files...");

  for (const relPath of filesToUpdate) {
    const fullPath = path.join(process.cwd(), relPath);
    if (!fs.existsSync(fullPath)) continue;

    let content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes('kairosion.com')) {
      const count = (content.match(/kairosion\.com/g) || []).length;
      content = content.replace(/kairosion\.com/g, 'kairosion.online');
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Updated ${relPath} (${count} replacements)`);
    }
  }

  // Also scan all files in src/ just in case
  function scanDir(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const p = path.join(dir, item);
      const stat = fs.statSync(p);
      if (stat.isDirectory()) {
        scanDir(p);
      } else if (p.match(/\.(ts|tsx|js|json|html|txt|xml|md)$/)) {
        let text = fs.readFileSync(p, 'utf8');
        if (text.includes('kairosion.com')) {
          const count = (text.match(/kairosion\.com/g) || []).length;
          text = text.replace(/kairosion\.com/g, 'kairosion.online');
          fs.writeFileSync(p, text, 'utf8');
          console.log(`✅ Updated ${path.relative(process.cwd(), p)} (${count} replacements)`);
        }
      }
    }
  }

  scanDir(path.join(process.cwd(), 'src'));

  // Update Turso Cloud Database
  console.log("\nUpdating Turso Cloud Database canonical URLs and references...");
  try {
    const result = await turso.execute(`
      UPDATE articles 
      SET canonical_url = REPLACE(canonical_url, 'kairosion.com', 'kairosion.online')
      WHERE canonical_url LIKE '%kairosion.com%'
    `);
    console.log(`✅ Updated canonical URLs in Turso DB articles table (Rows affected: ${result.rowsAffected})`);

    // Also update any settings or site_settings
    await turso.execute(`
      UPDATE site_settings 
      SET value_json = REPLACE(value_json, 'kairosion.com', 'kairosion.online')
      WHERE value_json LIKE '%kairosion.com%'
    `);
    console.log(`✅ Updated site_settings in Turso DB`);
  } catch (e) {
    console.error("Error updating Turso DB:", e);
  }

  // Re-run sitemap generation to ensure public/sitemap.xml is 100% updated
  console.log("\nRe-generating public/sitemap.xml with kairosion.online domain...");
  const { execSync } = await import('child_process');
  execSync('node scripts/generate_sitemap_file.js', { stdio: 'inherit' });
  console.log("✅ public/sitemap.xml rebuilt successfully!");
}

updateDomain().catch(console.error);
