// test-health-check.js
// Test script to verify health check endpoints work correctly

import express from 'express';
import http from 'http';

// Get port from environment or default to 10000
const PORT = parseInt(process.env.PORT || process.env.RAILWAY_PORT || 10000, 10);

console.log(`=== HEALTH CHECK TEST ===`);
console.log(`Testing on port: ${PORT}`);

const app = express();

// Health check endpoints
app.get('/health', (req, res) => {
  console.log('Health check hit');
  res.status(200).send('OK');
});

app.get('/health-json', (req, res) => {
  console.log('Health check JSON hit');
  res.status(200).json({ status: 'ok' });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Server listening on port ${PORT}`);
  
  // Test health check endpoints
  try {
    // Test text health check
    const textResponse = await fetch(`http://localhost:${PORT}/health`);
    const textResult = await textResponse.text();
    console.log(`Text health check response: ${textResult} (status: ${textResponse.status})`);
    
    // Test JSON health check
    const jsonResponse = await fetch(`http://localhost:${PORT}/health-json`);
    const jsonResult = await jsonResponse.json();
    console.log(`JSON health check response:`, jsonResult, `(status: ${jsonResponse.status})`);
    
    console.log('=== HEALTH CHECK TEST COMPLETE ===');
    
    // Close server
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  } catch (error) {
    console.error('Health check test failed:', error);
    server.close(() => {
      process.exit(1);
    });
  }
});

server.on('error', (error) => {
  console.error('Server startup error:', error);
  process.exit(1);
});