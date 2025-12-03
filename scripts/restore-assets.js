#!/usr/bin/env node

/**
 * Restore Assets Script for KIRASTAY
 * 
 * This script restores the heavy assets that were temporarily moved
 * by the dev-fast.js script.
 */

const fs = require('fs');
const path = require('path');

console.log('🔄 Restoring heavy assets...');

const tempDir = path.join(process.cwd(), 'temp_assets');
const heavyAssets = [
  'public/html-folder/video',
  'public/html-folder/flags', 
  'public/html-folder/fonts'
];

if (fs.existsSync(tempDir)) {
  heavyAssets.forEach(assetPath => {
    const fullPath = path.join(process.cwd(), assetPath);
    const tempPath = path.join(tempDir, path.basename(assetPath));
    
    try {
      if (fs.existsSync(tempPath) && !fs.existsSync(fullPath)) {
        // Ensure parent directory exists
        const parentDir = path.dirname(fullPath);
        if (!fs.existsSync(parentDir)) {
          fs.mkdirSync(parentDir, { recursive: true });
        }
        
        fs.renameSync(tempPath, fullPath);
        console.log(`✅ Restored ${assetPath}`);
      }
    } catch (error) {
      console.log(`⚠️  Could not restore ${assetPath}:`, error.message);
    }
  });

  // Clean up temp directory
  try {
    if (fs.readdirSync(tempDir).length === 0) {
      fs.rmdirSync(tempDir);
      console.log('✅ Removed empty temp directory');
    }
  } catch (error) {
    console.log('⚠️  Could not remove temp directory:', error.message);
  }
} else {
  console.log('📁 No temp assets directory found');
}

console.log('✨ Asset restoration complete!');
