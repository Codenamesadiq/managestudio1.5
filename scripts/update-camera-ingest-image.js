const sharp = require('sharp');
const path = require('path');

const svg = Buffer.from(`
<svg width="126" height="54" viewBox="0 0 126 54" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="cloudPatch" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
      <stop offset="65%" stop-color="#f8f9ff" stop-opacity="0.98" />
      <stop offset="90%" stop-color="#edf0ff" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#edf0ff" stop-opacity="0" />
    </radialGradient>
  </defs>
  <!-- Patch covering the old text completely with soft faded edges matching cloud -->
  <ellipse cx="63" cy="27" rx="56" ry="24" fill="url(#cloudPatch)" />
  
  <!-- Visual label: Cloud Storage -->
  <text x="63" y="18" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-size="9.5" font-weight="700" fill="#0f172a" text-anchor="middle" letter-spacing="-0.1">Cloud Storage</text>
  
  <!-- Supporting text: Secure cloud storage for your original files. -->
  <text x="63" y="31" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-size="7.2" font-weight="400" fill="#475569" text-anchor="middle">Secure cloud storage</text>
  <text x="63" y="42" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-size="7.2" font-weight="400" fill="#475569" text-anchor="middle">for your original files.</text>
</svg>
`);

const inputPath = path.join(__dirname, '../public/products/camera-ingest-workflow-steps.png');
const outputPath = path.join(__dirname, '../public/products/camera-ingest-workflow-steps.png');
const testCropPath = path.join(__dirname, '../public/products/stage3-updated.png');

sharp(inputPath)
  .composite([{
    input: svg,
    top: 68,
    left: 316
  }])
  .toFile(path.join(__dirname, '../public/products/camera-ingest-workflow-steps.temp.png'))
  .then(() => {
    const fs = require('fs');
    fs.copyFileSync(
      path.join(__dirname, '../public/products/camera-ingest-workflow-steps.temp.png'),
      outputPath
    );
    fs.unlinkSync(path.join(__dirname, '../public/products/camera-ingest-workflow-steps.temp.png'));
    
    // Create a crop for visual inspection
    return sharp(outputPath)
      .extract({ left: 300, top: 0, width: 160, height: 137 })
      .toFile(testCropPath);
  })
  .then(() => {
    console.log('Successfully updated camera-ingest-workflow-steps.png and created stage3-updated.png');
  })
  .catch(err => {
    console.error('Error updating image:', err);
  });
