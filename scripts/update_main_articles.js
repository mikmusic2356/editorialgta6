import fs from 'fs';

let content = fs.readFileSync('src/data/articles.ts', 'utf8');

// Replace Unsplash featured images with authentic GTA 6 images
const imageReplacements = [
  ['https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1600&auto=format&fit=crop&q=80', '/images/Lugares_y_Mapas/Vice_City_Postcard_landscape.webp'],
  ['https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&auto=format&fit=crop&q=80', '/images/Personajes/Jason_and_Lucia_Robbery_With_Logo_landscape.webp'],
  ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1600&auto=format&fit=crop&q=80', '/images/Personajes/Jason_and_Lucia_Motel_landscape.webp'],
  ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&auto=format&fit=crop&q=80', '/images/Personajes/Jason_Duval_01.webp'],
  ['https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1600&auto=format&fit=crop&q=80', '/images/Lugares_y_Mapas/Leonida_Keys_Postcard_landscape.webp'],
  ['https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80', '/images/Lugares_y_Mapas/Grassrivers_Postcard_landscape.webp'],
  ['https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=1600&auto=format&fit=crop&q=80', '/images/Armas/ULTIMATE_EDITION_HAWK_AND_LITTLE_MORGAN_REVOLVERS_01.webp'],
  ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&auto=format&fit=crop&q=80', '/images/Vehiculos/ULTIMATE_EDITION_GROTTI_CHEETAH_01.webp'],
  ['https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1600&auto=format&fit=crop&q=80', '/images/Personajes/DreQuan_Priest_landscape.webp'],
  ['https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1600&auto=format&fit=crop&q=80', '/images/Artes_y_Ediciones/ULTIMATE_EDITION_01.webp'],
  ['https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80', '/images/Personajes/Jason_and_Lucia_Motel_landscape.webp']
];

for (const [from, to] of imageReplacements) {
  content = content.replaceAll(from, to);
}

// Replace author avatars
content = content.replaceAll('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', '/images/Personajes/Brian_Heder_01.webp');
content = content.replaceAll('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', '/images/Personajes/Jason_Duval_01.webp');
content = content.replaceAll('https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80', '/images/Personajes/Real_Dimez_04.webp');

fs.writeFileSync('src/data/articles.ts', content, 'utf8');
console.log('Successfully updated src/data/articles.ts with local images.');
