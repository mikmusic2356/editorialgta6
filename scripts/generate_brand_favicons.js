import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="grad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6486" />
      <stop offset="100%" stop-color="#ffc456" />
    </linearGradient>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
  </defs>
  
  <!-- Outer Dark Container with Rounded Corners -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)" />
  <rect x="12" y="12" width="488" height="488" rx="100" fill="none" stroke="url(#grad)" stroke-width="12" stroke-opacity="0.45" />
  
  <!-- Central Glowing Brand Badge -->
  <rect x="76" y="76" width="360" height="360" rx="84" fill="url(#grad)" />
  
  <!-- Iconic "VI" numeral in bold dark slate -->
  <text x="256" y="326" font-family="'Plus Jakarta Sans', 'Arial Black', -apple-system, sans-serif" font-size="210" font-weight="900" text-anchor="middle" fill="#020617" letter-spacing="-4">VI</text>
</svg>`;

const publicDir = path.join(process.cwd(), 'public');

async function generateFavicons() {
  console.log("Generating brand favicons and icons...");

  // 1. Write favicon.svg
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent, 'utf8');
  console.log("✅ Written public/favicon.svg");

  const svgBuffer = Buffer.from(svgContent);

  // 2. Generate 32x32 PNG (favicon-32x32.png and favicon.ico)
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));
  console.log("✅ Written public/favicon-32x32.png");

  await sharp(svgBuffer)
    .resize(16, 16)
    .png()
    .toFile(path.join(publicDir, 'favicon-16x16.png'));
  console.log("✅ Written public/favicon-16x16.png");

  // Copy 32x32 as favicon.ico
  fs.copyFileSync(path.join(publicDir, 'favicon-32x32.png'), path.join(publicDir, 'favicon.ico'));
  console.log("✅ Written public/favicon.ico");

  // 3. Generate Apple Touch Icon (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log("✅ Written public/apple-touch-icon.png");

  // 4. Generate 512x512 Android Chrome icon
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'android-chrome-512x512.png'));
  console.log("✅ Written public/android-chrome-512x512.png");

  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'android-chrome-192x192.png'));
  console.log("✅ Written public/android-chrome-192x192.png");

  // 5. Generate full logo with text for Schema / OpenGraph (logo.png)
  const logoBannerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 120" width="600" height="120">
    <defs>
      <linearGradient id="brandGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ff6486" />
        <stop offset="100%" stop-color="#ffc456" />
      </linearGradient>
    </defs>
    <rect width="600" height="120" fill="#020617" />
    <!-- VI Badge -->
    <rect x="20" y="20" width="80" height="80" rx="20" fill="url(#brandGrad)" />
    <text x="60" y="75" font-family="'Plus Jakarta Sans', 'Arial Black', sans-serif" font-size="46" font-weight="900" text-anchor="middle" fill="#020617">VI</text>
    <!-- Brand Text -->
    <text x="120" y="72" font-family="'Plus Jakarta Sans', sans-serif" font-size="48" font-weight="900" fill="#ffffff" letter-spacing="-1">KAIROS<tspan fill="#ff6486">ION</tspan></text>
    <text x="122" y="96" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="700" fill="#ffc456" letter-spacing="4">PORTAL EDITORIAL GTA 6</text>
  </svg>`;

  await sharp(Buffer.from(logoBannerSvg))
    .resize(600, 120)
    .png()
    .toFile(path.join(publicDir, 'logo.png'));
  console.log("✅ Written public/logo.png");
}

generateFavicons().catch(console.error);
