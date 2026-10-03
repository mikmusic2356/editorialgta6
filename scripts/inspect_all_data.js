import fs from 'fs';
import path from 'path';

function inspectFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const slugMatches = [...content.matchAll(/"slug":\s*"([^"]+)"/g)].map(m => m[1]);
  const urlMatches = [...content.matchAll(/"url":\s*"([^"]+)"/g)].map(m => m[1]);
  console.log(`=== ${path.basename(filePath)} (${slugMatches.length} articles) ===`);
  for (let i = 0; i < slugMatches.length; i++) {
    console.log(`  ${slugMatches[i]} => ${urlMatches[i] || 'N/A'}`);
  }
}

inspectFile('src/data/locationArticles.ts');
inspectFile('src/data/vehicleArticles.ts');
inspectFile('src/data/weaponArticles.ts');
inspectFile('src/data/musicArticles.ts');
