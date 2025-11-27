// Simple test script to verify server startup
console.log('=== SERVER START TEST ===');
console.log('Current working directory:', process.cwd());
console.log('Environment variables:');
console.log('- PORT:', process.env.PORT);
console.log('- NODE_ENV:', process.env.NODE_ENV);

// Try to import and start the server
try {
  console.log('Attempting to import server...');
  import('./server.js').then(() => {
    console.log('Server import successful');
  }).catch(err => {
    console.error('Server import failed:', err);
  });
} catch (error) {
  console.error('Failed to start server test:', error);
}