// minimal-server.js
// Ultra-minimal server for Railway health check testing

import express from 'express';

// Get port from environment or default to 10000
// Ensure it's a number
const PORT = parseInt(process.env.PORT || process.env.RAILWAY_PORT || 10000, 10);

console.log(`=== MINIMAL SERVER STARTING ===`);
console.log(`PORT: ${PORT} (type: ${typeof PORT})`);
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);

const app = express();

// Ultra-simple health check - responds immediately with minimal response
app.get('/health', (req, res) => {
  console.log('Health check hit at:', new Date().toISOString());
  // Return exactly what Railway expects for a successful health check
  res.status(200).send('OK');
});

// Alternative health check that returns JSON (some systems prefer this)
app.get('/health-json', (req, res) => {
  console.log('Health check JSON hit at:', new Date().toISOString());
  res.status(200).json({ status: 'ok' });
});

// Simple root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Minimal server running' });
});

// Start server immediately
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=== MINIMAL SERVER LISTENING ON PORT ${PORT} ===`);
  console.log(`Health check endpoint (text): http://0.0.0.0:${PORT}/health`);
  console.log(`Health check endpoint (json): http://0.0.0.0:${PORT}/health-json`);
  console.log(`Root endpoint: http://0.0.0.0:${PORT}/`);
});

// Handle process signals
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down');
  process.exit(0);
});