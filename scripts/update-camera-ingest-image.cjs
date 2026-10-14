const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// The cloud shape in stage 3 has white center with soft purple edge
const svg = Buffer.from(`
<svg width="136" height="64" viewBox="0 0 136 64" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Soft blur filter for natural cloud edges -->
    <filter id="softBlur" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="1.5" />
    </filter>
  </defs>
  <!-- Clean solid cloud lobe covering all previous text seamlessly -->
  <rect x="8" y="2" width="120" height="56" rx="20" fill="#fcfdff" filter="url(#softBlur)" />
  <rect x="12" y="4" width="112" height="52" rx="18" fill="#ffffff" />

  <!-- Visual label: Cloud Storage -->
  <text x="68" y="21" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-size="9.5" font-weight="700" fill="#0f172a" text-anchor="middle" letter-spacing="-0.1">Cloud Storage</text>
  
  <!-- Supporting text: Secure cloud storage for your original files. -->
  <text x="68" y="36" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-size="7.2" font-weight="400" fill="#475569" text-anchor="middle">Secure cloud storage</text>
  <text x="68" y="48" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-size="7.2" font-weight="400" fill="#475569" text-anchor="middle">for your original files.</text>
</svg>
`);

const backupPath = path.join(__dirname, '../public/products/camera-ingest-workflow-steps.backup.png');
const outputPath = path.join(__dirname, '../public/products/camera-ingest-workflow-steps.png');
const testCropPath = path.join(__dirname, '../public/products/stage3-updated.png');

sharp(backupPath)
  .composite([{
    input: svg,
    top: 67,
    left: 311
  }])
  .toFile(outputPath)
  .then(() => {
    return sharp(outputPath)
      .extract({ left: 300, top: 0, width: 160, height: 137 })
      .toFile(testCropPath);
  })
  .then(() => {
    console.log('Successfully updated camera-ingest-workflow-steps.png and refreshed stage3-updated.png');
  })
  .catch(err => {
    console.error('Error updating image:', err);
  });
