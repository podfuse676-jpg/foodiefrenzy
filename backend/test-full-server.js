// test-full-server.js
// Test to verify the full server can start

// Set Railway-like environment variables
process.env.PORT = process.env.PORT || '10000';
process.env.NODE_ENV = 'production';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test'; // Use a local test DB

console.log('=== FULL SERVER STARTUP TEST ===');
console.log('Environment variables:');
console.log('- PORT:', process.env.PORT);
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- MONGODB_URI:', process.env.MONGODB_URI);

// Try to import and start the full server
import('./server.js').then(() => {
  console.log('Full server import successful');
  
  // Wait a few seconds to see if server starts
  setTimeout(() => {
    console.log('Test completed - full server should be running');
    process.exit(0);
  }, 10000);
}).catch(err => {
  console.error('Full server import failed:', err);
  process.exit(1);
});