// verify-files.js
// Simple script to verify that required files exist

import fs from 'fs';
import path from 'path';

console.log('=== FILE VERIFICATION ===');

const requiredFiles = [
  'package.json',
  'minimal-server.js',
  'server.js'
];

requiredFiles.forEach(file => {
  const filePath = path.join('.', file);
  try {
    const exists = fs.existsSync(filePath);
    console.log(`${file}: ${exists ? 'FOUND' : 'NOT FOUND'}`);
    
    if (exists) {
      const stats = fs.statSync(filePath);
      console.log(`  Size: ${stats.size} bytes`);
      console.log(`  Modified: ${stats.mtime.toISOString()}`);
    }
  } catch (error) {
    console.error(`Error checking ${file}:`, error.message);
  }
});

console.log('=== VERIFICATION COMPLETE ===');