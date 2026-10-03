import fs from 'fs';

function parseTsArray(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const equalIdx = code.indexOf('=');
  const startIdx = code.indexOf('[', equalIdx);
  const endIdx = code.lastIndexOf(']');
  const jsonStr = code.slice(startIdx, endIdx + 1);
  return JSON.parse(jsonStr);
}

// 1. Update locationArticles.ts
const locReplacements = [
  ['ambrosia-gta-6', '/images/Lugares_y_Mapas/Ambrosia_Postcard_landscape.webp'],
  ['estado-de-leonida-gta-6', '/images/Lugares_y_Mapas/Leonida_Keys_Postcard_landscape.webp'],
  ['grassrivers-gta-6', '/images/Lugares_y_Mapas/Grassrivers_Postcard_landscape.webp'],
  ['hamlet-penitenciaria-gta-6', '/images/Personajes/Jason_and_Lucia_Robbery_With_Logo_landscape.webp'],
  ['leonida-keys-gta-6', '/images/Lugares_y_Mapas/Leonida_Keys_Postcard_landscape.webp'],
  ['mount-kalaga-gta-6', '/images/Lugares_y_Mapas/Mount_Kalaga_National_Park_Postcard_landscape.webp'],
  ['port-gellhorn-gta-6', '/images/Lugares_y_Mapas/Port_Gellhorn_Postcard_landscape.webp'],
  ['vice-city-gta-6', '/images/Lugares_y_Mapas/Vice_City_Postcard_landscape.webp'],
  ['waning-sands-gta-6', '/images/Lugares_y_Mapas/Grassrivers_06.webp']
];

const locObj = parseTsArray('src/data/locationArticles.ts');
locObj.forEach(art => {
  const match = locReplacements.find(([slug]) => slug === art.slug);
  if (match) {
    art.featuredImage.url = match[1];
  }
  art.author.avatar = '/images/Personajes/Brian_Heder_01.webp';
});
fs.writeFileSync('src/data/locationArticles.ts', `import { Article } from '../types';\n\nexport const LOCATION_ARTICLES: Article[] = ${JSON.stringify(locObj, null, 2)};\n`, 'utf8');

// 2. Update vehicleArticles.ts
const vehReplacements = [
  ['superdeportivos-y-deportivos-gta-6', '/images/Vehiculos/ULTIMATE_EDITION_GROTTI_CHEETAH_01.webp'],
  ['lanchas-de-carreras-y-velocidad-gta-6', '/images/Vehiculos/ULTIMATE_EDITION_SQUALO_01.webp'],
  ['hidrodeslizadores-airboats-gta-6', '/images/Vehiculos/ULTIMATE_EDITION_SQUALO_04.webp'],
  ['sedanes-suvs-y-camionetas-gta-6', '/images/Vehiculos/VINTAGE_VICE_CITY_PACK_VAPID_STANIER_01.webp'],
  ['muscle-cars-y-clasicos-gta-6', '/images/Vehiculos/ULTIMATE_EDITION_VAPID_GANADO_RETRO_BUILD_01.webp'],
  ['vehiculos-terrestres-gta-6', '/images/Vehiculos/ULTIMATE_EDITION_SAFEHOUSE_VEHICLES_01.webp'],
  ['motocicletas-quads-y-escooters-gta-6', '/images/Vehiculos/ULTIMATE_EDITION_VAPID_BUGGY_01.webp'],
  ['vehiculos-comerciales-y-de-servicio-gta-6', '/images/Vehiculos/ULTIMATE_EDITION_WYMAN_CAR_COLLECTION_01.webp'],
  ['aviones-ligeros-y-hidroaviones-gta-6', '/images/Lugares_y_Mapas/Mount_Kalaga_National_Park_06.webp'],
  ['helicopteros-gta-6', '/images/Lugares_y_Mapas/Port_Gellhorn_01.webp'],
  ['jets-privados-y-aviones-comerciales-gta-6', '/images/Lugares_y_Mapas/Ambrosia_01.webp'],
  ['motos-acuaticas-jet-skis-gta-6', '/images/Vehiculos/ULTIMATE_EDITION_SQUALO_02.webp'],
  ['yates-y-embarcaciones-de-lujo-gta-6', '/images/Vehiculos/ULTIMATE_EDITION_SQUALO_03.webp']
];
const vehObj = parseTsArray('src/data/vehicleArticles.ts');
vehObj.forEach(art => {
  const match = vehReplacements.find(([slug]) => slug === art.slug);
  if (match) {
    art.featuredImage.url = match[1];
  }
  art.author.avatar = '/images/Personajes/Jason_Duval_01.webp';
});
fs.writeFileSync('src/data/vehicleArticles.ts', `import { Article } from '../types';\n\nexport const VEHICLE_ARTICLES: Article[] = ${JSON.stringify(vehObj, null, 2)};\n`, 'utf8');

// 3. Update weaponArticles.ts
const wepReplacements = [
  ['pistolas-y-revolveres-gta-6', '/images/Armas/ULTIMATE_EDITION_HAWK_AND_LITTLE_MORGAN_REVOLVERS_01.webp'],
  ['rifles-de-asalto-y-carabinas-gta-6', '/images/Armas/ULTIMATE_EDITION_WEAPON_VARIANTS_01.webp'],
  ['subfusiles-y-smg-gta-6', '/images/Armas/VINTAGE_VICE_CITY_WEAPON_PATTERN_01.webp'],
  ['escopetas-tacticas-gta-6', '/images/Armas/ULTIMATE_EDITION_HAWK_AND_LITTLE_MORGAN_REVOLVERS_02.webp'],
  ['rifles-de-francotirador-gta-6', '/images/Armas/ULTIMATE_EDITION_WEAPON_VARIANTS_01.webp'],
  ['armas-melee-y-cuerpo-a-cuerpo-gta-6', '/images/Ropa_y_Personalizacion/ULTIMATE_EDITION_GOODTIME_GEAR_01.webp'],
  ['explosivos-y-arrojadizas-gta-6', '/images/Ropa_y_Personalizacion/ULTIMATE_EDITION_ELECTRIC_FANG_01.webp'],
  ['sistema-de-inventario-y-armamento-gta-6', '/images/Personajes/Jason_and_Lucia_Robbery_With_Logo_landscape.webp']
];
const wepObj = parseTsArray('src/data/weaponArticles.ts');
wepObj.forEach(art => {
  const match = wepReplacements.find(([slug]) => slug === art.slug);
  if (match) {
    art.featuredImage.url = match[1];
  }
  art.author.avatar = '/images/Personajes/Raul_Bautista_03.webp';
});
fs.writeFileSync('src/data/weaponArticles.ts', `import { Article } from '../types';\n\nexport const WEAPON_ARTICLES: Article[] = ${JSON.stringify(wepObj, null, 2)};\n`, 'utf8');

// 4. Update musicArticles.ts
const musReplacements = [
  ['banda-sonora-y-musica-gta-6', '/images/Personajes/DreQuan_Priest_landscape.webp'],
  ['emisoras-de-radio-gta-6', '/images/Personajes/Real_Dimez_landscape.webp'],
  ['gta-vi-the-album', '/images/Personajes/Boobie_Ike_landscape.webp']
];
const musObj = parseTsArray('src/data/musicArticles.ts');
musObj.forEach(art => {
  const match = musReplacements.find(([slug]) => slug === art.slug);
  if (match) {
    art.featuredImage.url = match[1];
  }
  art.author.avatar = '/images/Personajes/Real_Dimez_04.webp';
});
fs.writeFileSync('src/data/musicArticles.ts', `import { Article } from '../types';\n\nexport const MUSIC_ARTICLES: Article[] = ${JSON.stringify(musObj, null, 2)};\n`, 'utf8');

console.log('Successfully updated all subcategory article files with local GTA 6 images.');
