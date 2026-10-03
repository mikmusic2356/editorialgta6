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

const specificImageMap = {
  'gta-6-guia-completa-informacion-general-desarrollo': '/images/Artes_y_Ediciones/Official_Cover_Art_landscape.webp',
  'gta-6-mecanicas-gameplay-tiroteos-conduccion': '/images/Personajes/Jason_and_Lucia_Robbery_With_Logo_landscape.webp',
  'gta-6-historia-argumento-narrativa-prologo': '/images/Personajes/Jason_and_Lucia_Motel_landscape.webp',
  'elenco-personajes-secundarios-gta-6': '/images/Personajes/Boobie_Ike_landscape.webp',
  'gta-6-mundo-leonida-fauna-ecosistemas': '/images/Lugares_y_Mapas/Grassrivers_Postcard_landscape.webp',
  'gta-6-mapa-distritos-vice-city-cayos': '/images/Lugares_y_Mapas/Leonida_Keys_Postcard_landscape.webp',
  'gta-6-catalogo-vehiculos-superdeportivos-customizacion': '/images/Vehiculos/ULTIMATE_EDITION_GROTTI_CHEETAH_01.webp',
  'gta-6-arsenal-armas-balistica-personalizacion': '/images/Armas/ULTIMATE_EDITION_HAWK_AND_LITTLE_MORGAN_REVOLVERS_01.webp',
  'gta-6-sistema-misiones-golpes-asaltos-coordinados': '/images/Personajes/Raul_Bautista_landscape.webp',
  'gta-6-actividades-secundarias-minijuegos-negocios': '/images/Personajes/Real_Dimez_landscape.webp',
  'gta-6-secretos-easter-eggs-misterios-ocultos': '/images/Lugares_y_Mapas/Mount_Kalaga_National_Park_Postcard_landscape.webp',
  'gta-6-todo-lo-confirmado-fecha-leonida-plataformas': '/images/Artes_y_Ediciones/ULTIMATE_EDITION_01.webp',
  'noticias-gta-6-nuevo-comunicado-rockstar-desarrollo': '/images/Artes_y_Ediciones/Official_Cover_Art_landscape.webp',
  'guia-inicio-vice-city-primeros-pasos-consejos': '/images/Lugares_y_Mapas/Vice_City_Postcard_landscape.webp',
  'manual-policial-como-funciona-sistema-6-estrellas-ia': '/images/Personajes/Brian_Heder_landscape.webp',
  'analisis-mapa-leonida-distritos-puntos-clave': '/images/Lugares_y_Mapas/Port_Gellhorn_Postcard_landscape.webp',
  'take-two-reitera-calendario-financiero-gta-6-inversores': '/images/Artes_y_Ediciones/VINTAGE_VICE_CITY_PACK_01.webp',
  'catalogo-completo-vehiculos-superdeportivos-lanchas': '/images/Vehiculos/ULTIMATE_EDITION_SQUALO_01.webp',
  'catalogo-completo-armas-accesorios-estadisticas': '/images/Armas/ULTIMATE_EDITION_WEAPON_VARIANTS_01.webp'
};

async function fixAllRemaining() {
  // 1. Fix in Turso
  const res = await turso.execute("SELECT id, slug, featured_image_json, author_json FROM articles");
  for (const row of res.rows) {
    const slug = String(row.slug);
    let feat = JSON.parse(String(row.featured_image_json));
    let auth = JSON.parse(String(row.author_json));
    let changed = false;

    if (specificImageMap[slug]) {
      feat.url = specificImageMap[slug];
      changed = true;
    } else if (feat.url && feat.url.includes('unsplash.com')) {
      feat.url = '/images/Artes_y_Ediciones/Official_Cover_Art_landscape.webp';
      changed = true;
    }

    if (auth.avatar && auth.avatar.includes('unsplash.com')) {
      auth.avatar = '/images/Personajes/Jason_Duval_01.webp';
      changed = true;
    }

    if (changed) {
      await turso.execute({
        sql: "UPDATE articles SET featured_image_json = ?, author_json = ? WHERE id = ?",
        args: [JSON.stringify(feat), JSON.stringify(auth), row.id]
      });
      console.log(`Updated Turso DB article: ${slug} => ${feat.url}`);
    }
  }

  // 2. Also fix in src/data/articles.ts
  let code = fs.readFileSync('src/data/articles.ts', 'utf8');
  for (const [slug, imgUrl] of Object.entries(specificImageMap)) {
    // Find the article block for this slug and replace its featuredImage url
    const slugRegex = new RegExp(`(slug:\\s*['"]${slug}['"][\\s\\S]*?featuredImage:\\s*{[\\s\\S]*?url:\\s*)['"][^'"]+['"]`, 'g');
    code = code.replace(slugRegex, `$1'${imgUrl}'`);
  }
  // Replace any leftover unsplash in articles.ts
  code = code.replace(/https:\/\/images\.unsplash\.com\/[^\s'"]+/g, '/images/Artes_y_Ediciones/Official_Cover_Art_landscape.webp');
  fs.writeFileSync('src/data/articles.ts', code, 'utf8');
  console.log("Updated src/data/articles.ts");
}

fixAllRemaining().catch(console.error);
