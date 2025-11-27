// test-npm-scripts.js
// Test to see what npm scripts are available

import { execSync } from 'child_process';

console.log('=== NPM SCRIPTS TEST ===');

try {
  // Run npm run to see available scripts
  const output = execSync('npm run', { encoding: 'utf8' });
  console.log('Available npm scripts:');
  console.log(output);
} catch (error) {
  console.error('Error running npm run:', error.message);
  console.error('Error output:', error.stderr);
}

console.log('=== CURRENT DIRECTORY CONTENTS ===');
try {
  const fs = await import('fs');
  const files = fs.readdirSync('.');
  console.log('Files in current directory:', files);
  
  // Check if package.json exists
  if (files.includes('package.json')) {
    console.log('package.json found');
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    console.log('Scripts in package.json:', Object.keys(packageJson.scripts || {}));
  } else {
    console.log('package.json NOT found');
  }
} catch (error) {
  console.error('Error reading directory:', error.message);
}