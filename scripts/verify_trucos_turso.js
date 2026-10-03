import { createClient } from "@libsql/client";
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.VITE_TURSO_DATABASE_URL || "https://dbkairosion-mikmusic2356.aws-us-east-2.turso.io";
const authToken = process.env.VITE_TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN;

const turso = createClient({
  url: url.replace(/^libsql:\/\//, "https://"),
  authToken
});

async function checkTrucos() {
  const res = await turso.execute("SELECT id, slug, title, category, subcategory_slug, featured_image_json FROM articles WHERE category = 'trucos-consejos'");
  console.log(`Found ${res.rows.length} trucos-consejos articles in Turso DB:`);
  res.rows.forEach(r => {
    let img = {};
    try { img = JSON.parse(r.featured_image_json); } catch(e) {}
    console.log(`- [${r.id}] ${r.slug} (sub: ${r.subcategory_slug}) | img: ${img.url}`);
  });
}

checkTrucos().catch(console.error);
