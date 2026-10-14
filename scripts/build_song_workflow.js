import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function buildSongWorkflow() {
  const origPath = 'C:/Users/sadiq/.gemini/antigravity-ide/brain/9d9f68d3-a180-4391-a8e2-6d55382079c1/.user_uploaded/media_1791835708910.jpg';
  const outPath = 'e:/Studio Master/website oct/public/products/song-selection-workflow.png';
  const outShowcasePath = 'e:/Studio Master/website oct/public/showcase/song-selection-workflow.png';

  const canvasW = 940;
  const canvasH = 580;

  // 1. Extract bride photo background from media_1791835708910.jpg
  // left: 41, top: 340, width: 490, height: 557
  const brideRaw = await sharp(origPath)
    .extract({ left: 41, top: 340, width: 490, height: 557 })
    .resize(520, canvasH, { fit: 'cover', position: 'left' })
    .ensureAlpha()
    .toBuffer();

  // Create feather mask for bride right edge (520 x 580)
  const brideMask = Buffer.from(
    `<svg width="520" height="${canvasH}">
      <defs>
        <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="white" stop-opacity="1" />
          <stop offset="78%" stop-color="white" stop-opacity="1" />
          <stop offset="100%" stop-color="white" stop-opacity="0" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="520" height="${canvasH}" fill="url(#fade)" />
    </svg>`
  );

  const bride = await sharp(brideRaw)
    .composite([{ input: brideMask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // 2. Extract warm bokeh from right side (above and below the cards to avoid any logo artifacts)
  const bokehTop = await sharp(origPath)
    .extract({ left: 780, top: 340, width: 200, height: 100 })
    .resize(560, canvasH, { fit: 'fill' })
    .blur(18)
    .toBuffer();

  // Create base canvas with smooth warm ambient background
  const baseBg = await sharp({
    create: {
      width: canvasW,
      height: canvasH,
      channels: 4,
      background: { r: 247, g: 218, b: 184, alpha: 1 }
    }
  })
  .composite([
    { input: bokehTop, left: 380, top: 0 },
    { input: bride, left: 0, top: 0 }
  ])
  .png()
  .toBuffer();

  // 3. Prepare the phone screen
  const screenW = 252;
  const screenH = 516;
  const phoneW = 266;
  const phoneH = 532;

  // Rounded mask for screen
  const screenMask = Buffer.from(
    `<svg width="${screenW}" height="${screenH}">
      <rect x="0" y="0" width="${screenW}" height="${screenH}" rx="32" ry="32" fill="white" />
    </svg>`
  );

  const resizedScreen = await sharp('e:/Studio Master/website oct/public/products/song-phone-screen-exact.png')
    .resize(screenW, screenH, { fit: 'fill' })
    .composite([{ input: screenMask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // 4. Create the sleek iPhone frame SVG
  const phoneSvg = Buffer.from(
    `<svg width="${phoneW}" height="${phoneH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="titanium" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2e2e30" />
          <stop offset="50%" stop-color="#18181a" />
          <stop offset="100%" stop-color="#0e0e10" />
        </linearGradient>
        <linearGradient id="edgeHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.4)" />
          <stop offset="20%" stop-color="rgba(255,255,255,0.1)" />
          <stop offset="80%" stop-color="rgba(255,255,255,0.05)" />
          <stop offset="100%" stop-color="rgba(255,255,255,0.2)" />
        </linearGradient>
      </defs>
      <!-- Outer body -->
      <rect x="0.75" y="0.75" width="${phoneW - 1.5}" height="${phoneH - 1.5}" rx="40" ry="40" fill="url(#titanium)" stroke="url(#edgeHighlight)" stroke-width="1.5" />
      <!-- Bezel inner shadow border -->
      <rect x="6" y="7" width="${screenW + 2}" height="${screenH + 2}" rx="33" ry="33" fill="none" stroke="#09090a" stroke-width="1.5" />
    </svg>`
  );

  // Assemble the phone device
  const phoneDevice = await sharp(phoneSvg)
    .composite([
      { input: resizedScreen, left: 7, top: 8 }
    ])
    .png()
    .toBuffer();

  // Create drop shadow for the phone with safe padding
  const shadowPadding = 18;
  const shadowSvg = Buffer.from(
    `<svg width="${phoneW + shadowPadding * 2}" height="${phoneH + shadowPadding * 2}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="rgba(0,0,0,0.35)" />
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="rgba(0,0,0,0.22)" />
        </filter>
      </defs>
      <rect x="${shadowPadding}" y="${shadowPadding}" width="${phoneW}" height="${phoneH}" rx="40" ry="40" fill="black" filter="url(#shadow)" />
    </svg>`
  );

  const shadowBuffer = await sharp(shadowSvg).png().toBuffer();

  // Position phone on canvas:
  // Center vertically: (canvasH - phoneH)/2 = (580 - 532)/2 = 24px!
  // Center horizontally in right area: left around 535px
  const phoneLeft = 535;
  const phoneTop = 24;

  await sharp(baseBg)
    .composite([
      { input: shadowBuffer, left: phoneLeft - shadowPadding, top: phoneTop - shadowPadding },
      { input: phoneDevice, left: phoneLeft, top: phoneTop }
    ])
    .png()
    .toFile(outPath);

  console.log('song-selection-workflow.png created successfully at', outPath);

  fs.copyFileSync(outPath, outShowcasePath);
  console.log('Copied to', outShowcasePath);
}

buildSongWorkflow().catch(console.error);
