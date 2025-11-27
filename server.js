// Simple wrapper to run the backend server from the root directory
// This file is specifically for Railway deployment
console.log('=== ROOT SERVER WRAPPER ===');
console.log('Current directory:', __dirname);
console.log('Loading backend server...');

try {
  require('./backend/server.js');
} catch (error) {
  console.error('Failed to start backend server:', error);
  process.exit(1);
}