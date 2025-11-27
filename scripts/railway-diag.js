#!/usr/bin/env node

/**
 * Railway Diagnostic Script
 * 
 * This script helps diagnose common Railway deployment issues.
 */

console.log('='.repeat(60));
console.log('Railway Deployment Diagnostic');
console.log('='.repeat(60));

console.log('\n1. Environment Variables:');
console.log('   PORT:', process.env.PORT || 'NOT SET');
console.log('   NODE_ENV:', process.env.NODE_ENV || 'NOT SET');
console.log('   HOME:', process.env.HOME || 'NOT SET');
console.log('   PWD:', process.env.PWD || 'NOT SET');

console.log('\n2. Current Working Directory:');
console.log('   ', process.cwd());

console.log('\n3. Directory Contents:');
const fs = require('fs');
const path = require('path');

try {
  const files = fs.readdirSync('.');
  console.log('   Root directory files:');
  files.forEach(file => {
    console.log('   -', file);
  });
  
  console.log('\n   Backend directory check:');
  if (fs.existsSync('./backend')) {
    console.log('   ✓ backend directory exists');
    const backendFiles = fs.readdirSync('./backend');
    console.log('   Backend directory files:');
    backendFiles.forEach(file => {
      console.log('   -', file);
    });
  } else {
    console.log('   ✗ backend directory does not exist');
  }
} catch (error) {
  console.error('   Error reading directory:', error.message);
}

console.log('\n4. Process Info:');
console.log('   PID:', process.pid);
console.log('   Platform:', process.platform);
console.log('   Arch:', process.arch);

console.log('\n' + '='.repeat(60));
console.log('Diagnostic Complete');
console.log('='.repeat(60));