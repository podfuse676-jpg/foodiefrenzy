// test-railway-simple.js
// Simple test to verify server can start in Railway environment

// Set Railway-like environment variables
process.env.PORT = process.env.PORT || '10000';
process.env.NODE_ENV = 'production';

console.log('=== RAILWAY STARTUP TEST ===');
console.log('Environment variables:');
console.log('- PORT:', process.env.PORT);
console.log('- NODE_ENV:', process.env.NODE_ENV);

// Create a minimal express app for testing
import express from 'express';

const app = express();
const PORT = process.env.PORT || 4000;

// Simple health check endpoint
app.get('/health', (req, res) => {
  console.log('Health check endpoint hit');
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Simple test endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`=== MINIMAL SERVER STARTED SUCCESSFULLY ===`);
  console.log(`Server listening on port ${PORT}`);
  console.log(`Health check available at: http://0.0.0.0:${PORT}/health`);
  
  // Test the health endpoint
  setTimeout(() => {
    console.log('Test completed - server should be running');
  }, 2000);
});

server.on('error', (error) => {
  console.error('=== SERVER STARTUP ERROR ===');
  console.error('Failed to start server:', error);
  console.error('===========================');
  process.exit(1);
});