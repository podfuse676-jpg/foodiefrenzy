// test-docker-start.js
// Test script to simulate Docker environment startup

// Set environment variables that would be present in Docker
process.env.PORT = process.env.PORT || '10000';
process.env.NODE_ENV = 'production';

console.log('=== DOCKER STARTUP TEST ===');
console.log('Environment variables:');
console.log('- PORT:', process.env.PORT);
console.log('- NODE_ENV:', process.env.NODE_ENV);

// Try to import and start the server
import('./server.js').then(() => {
  console.log('Server import successful');
  
  // Wait a few seconds to see if server starts
  setTimeout(() => {
    console.log('Test completed - server should be running');
    process.exit(0);
  }, 5000);
}).catch(err => {
  console.error('Server import failed:', err);
  process.exit(1);
});