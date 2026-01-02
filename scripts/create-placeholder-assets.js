/**
 * Creates minimal placeholder PNG assets for EAS builds
 * Run with: node scripts/create-placeholder-assets.js
 * 
 * Note: This uses a simple approach. For production, replace with actual app icons.
 */

const fs = require('fs');
const path = require('path');

// Simple 1x1 pixel PNG in base64 (transparent)
// This is a minimal valid PNG that will work for builds
const minimalPNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

const assetsDir = path.join(__dirname, '..', 'assets');

// Ensure assets directory exists
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Create placeholder files
const assets = [
  { name: 'icon.png', size: '1024x1024' },
  { name: 'adaptive-icon.png', size: '1024x1024' },
  { name: 'splash.png', size: '1284x2778' },
  { name: 'favicon.png', size: '48x48' },
];

console.log('⚠️  Creating minimal placeholder assets...');
console.log('⚠️  These are temporary files for build purposes only.\n');
console.log('⚠️  IMPORTANT: Replace these with actual app icons before production release!\n');

assets.forEach(asset => {
  const filePath = path.join(assetsDir, asset.name);
  
  // For now, create a minimal PNG
  // In production, you should replace these with proper images
  fs.writeFileSync(filePath, minimalPNG);
  
  console.log(`✅ Created: ${asset.name} (${asset.size} - placeholder)`);
});

console.log('\n📝 Next Steps:');
console.log('   1. Replace placeholder assets with actual app icons');
console.log('   2. Use tools like https://www.appicon.co/ to generate proper assets');
console.log('   3. Ensure icon.png is 1024x1024px');
console.log('   4. Ensure adaptive-icon.png is 1024x1024px');
console.log('   5. Ensure splash.png is 1284x2778px');
console.log('\n✅ Placeholder assets created. You can now build, but replace them soon!');









