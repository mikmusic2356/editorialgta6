import { createClient } from "@libsql/client";
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const url = process.env.VITE_TURSO_DATABASE_URL || "https://dbkairosion-mikmusic2356.aws-us-east-2.turso.io";
const authToken = process.env.VITE_TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN;

const turso = createClient({
  url: url.replace(/^libsql:\/\//, "https://"),
  authToken
});

async function verifyTurso() {
  const res = await turso.execute("SELECT slug, featured_image_json FROM articles");
  console.log(`Total articles in Turso DB: ${res.rows.length}`);
  const withUnsplash = res.rows.filter(r => String(r.featured_image_json).includes('unsplash.com'));
  console.log(`Articles with unsplash.com in Turso DB: ${withUnsplash.length}`);
  if (withUnsplash.length > 0) {
    console.log("Unsplash slugs:", withUnsplash.map(u => u.slug));
  }
}

verifyTurso().catch(console.error);
