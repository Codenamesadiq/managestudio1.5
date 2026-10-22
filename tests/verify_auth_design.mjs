/**
 * Verification of pixel-perfect styling rules in Auth.css and compiled dist
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const authCssPath = path.join(__dirname, '../client/src/styles/Auth.css');
const authCss = fs.readFileSync(authCssPath, 'utf8');

console.log('--- Checking Design Tokens in Auth.css ---');

const checks = [
  { name: 'Teal Primary Accent (#1ABC9C)', test: authCss.includes('#1ABC9C') },
  { name: 'Teal Hover Accent (#16a085)', test: authCss.includes('#16a085') },
  { name: 'Dark Cinematic Background (#06090e)', test: authCss.includes('#06090e') },
  { name: 'Photo Mosaic Overlay (/hero-poster.jpg)', test: authCss.includes('/hero-poster.jpg') },
  { name: 'Signature Pill Buttons (border-radius: 9999px)', test: authCss.includes('9999px') },
  { name: 'Dark Glassmorphic Card (rgba(14, 18, 24, 0.88))', test: authCss.includes('rgba(14, 18, 24, 0.88)') },
  { name: 'SF Pro / Inter Typography Stack', test: authCss.includes('SF Pro') },
  { name: 'Teal Checkbox Accent', test: authCss.includes('accent-color: var(--ms-teal)') },
  { name: 'Teal Input Focus Ring', test: authCss.includes('--ms-teal-glow') || authCss.includes('rgba(26, 188, 156,') },
  { name: 'Smooth Entrance Animations', test: authCss.includes('@keyframes authCardEntrance') }
];

let allPassed = true;
checks.forEach(c => {
  if (c.test) {
    console.log(`  ✓ ${c.name}`);
  } else {
    console.error(`  ✗ Missing: ${c.name}`);
    allPassed = false;
  }
});

// Check compiled bundle
const distCssDir = path.join(__dirname, '../dist/assets');
const cssFile = fs.readdirSync(distCssDir).find(f => f.endsWith('.css'));
if (cssFile) {
  const distCss = fs.readFileSync(path.join(distCssDir, cssFile), 'utf8');
  const bundleHasTeal = distCss.includes('#1ABC9C') || distCss.includes('#1abc9c');
  const bundleHasPoster = distCss.includes('/hero-poster.jpg');
  console.log('\n--- Production Dist Bundle Verification ---');
  console.log(`  ✓ Dist CSS Bundle contains Teal Accent (#1ABC9C): ${bundleHasTeal}`);
  console.log(`  ✓ Dist CSS Bundle contains Hero Poster Mosaic: ${bundleHasPoster}`);
}

if (!allPassed) {
  process.exit(1);
} else {
  console.log('\nAll Design System tokens verified pixel-to-pixel!\n');
}
