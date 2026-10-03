import fs from 'fs';
import path from 'path';

const baseDir = path.join(process.cwd(), 'public', 'images');
const folders = fs.readdirSync(baseDir);

console.log("Available local images in public/images:");
const imagesByFolder = {};

folders.forEach(folder => {
  const p = path.join(baseDir, folder);
  if (fs.statSync(p).isDirectory()) {
    const files = fs.readdirSync(p).filter(f => f.match(/\.(webp|png|jpg)$/i));
    imagesByFolder[folder] = files.map(f => `/images/${folder}/${f}`);
  }
});

console.log(JSON.stringify(imagesByFolder, null, 2));
