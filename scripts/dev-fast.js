#!/usr/bin/env node

/**
 * Fast Development Script for KIRASTAY
 * 
 * This script optimizes the development environment for faster Next.js startup
 * by temporarily moving heavy assets and cleaning build cache.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Optimizing development environment...');

// Clean Next.js cache
console.log('🧹 Cleaning Next.js cache...');
try {
  if (fs.existsSync('.next')) {
    execSync('rmdir /s /q .next', { stdio: 'inherit' });
  }
  console.log('✅ Cache cleaned');
} catch (error) {
  console.log('⚠️  Cache cleaning skipped:', error.message);
}

// Create temporary directory for heavy assets
const tempDir = path.join(process.cwd(), 'temp_assets');
const heavyAssets = [
  'public/html-folder/video',
  'public/html-folder/flags',
  'public/html-folder/fonts'
];

console.log('📦 Moving heavy assets temporarily...');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

heavyAssets.forEach(assetPath => {
  const fullPath = path.join(process.cwd(), assetPath);
  const tempPath = path.join(tempDir, path.basename(assetPath));
  
  try {
    if (fs.existsSync(fullPath) && !fs.existsSync(tempPath)) {
      fs.renameSync(fullPath, tempPath);
      console.log(`✅ Moved ${assetPath} to temp`);
    }
  } catch (error) {
    console.log(`⚠️  Could not move ${assetPath}:`, error.message);
  }
});

console.log('⚡ Starting Next.js in fast mode...');
console.log('💡 To restore assets later, run: node scripts/restore-assets.js');

// Start Next.js
try {
  execSync('npm run dev', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Failed to start development server:', error.message);
}
