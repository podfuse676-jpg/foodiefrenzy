// test-enhanced-minimal.js
// Test script to verify enhanced minimal server structure

import fs from 'fs';
import path from 'path';

console.log('=== ENHANCED MINIMAL SERVER TEST ===');

// Check if required files exist
const requiredFiles = [
  'enhanced-minimal-server.js',
  'modals/item.js'
];

requiredFiles.forEach(file => {
  const filePath = path.join('.', file);
  try {
    const exists = fs.existsSync(filePath);
    console.log(`${file}: ${exists ? 'FOUND' : 'NOT FOUND'}`);
    
    if (exists) {
      const stats = fs.statSync(filePath);
      console.log(`  Size: ${stats.size} bytes`);
    }
  } catch (error) {
    console.error(`Error checking ${file}:`, error.message);
  }
});

// Check if required imports will work
try {
  // Test importing the item model
  console.log('\nTesting item model import...');
  import('./modals/item.js').then(module => {
    console.log('Item model import: SUCCESS');
    console.log('Module type:', typeof module.default);
  }).catch(error => {
    console.error('Item model import: FAILED');
    console.error('Error:', error.message);
  });
} catch (error) {
  console.error('Import test error:', error.message);
}

console.log('\n=== TEST COMPLETE ===');