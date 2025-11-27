// minimal-server.js
// Ultra-minimal server for Railway health check testing

import express from 'express';

// Get port from environment or default to 10000
const PORT = process.env.PORT || process.env.RAILWAY_PORT || 10000;

console.log(`=== MINIMAL SERVER STARTING ===`);
console.log(`PORT: ${PORT}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);

const app = express();

// Ultra-simple health check - responds immediately
app.get('/health', (req, res) => {
  console.log('Health check hit');
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Simple root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Minimal server running' });
});

// Start server immediately
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=== MINIMAL SERVER LISTENING ON PORT ${PORT} ===`);
  console.log(`Health check endpoint: http://0.0.0.0:${PORT}/health`);
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