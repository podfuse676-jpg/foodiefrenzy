// test-server-start.js
// Simple test to verify server can start without errors

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('Testing server startup...');

// Test environment variables
console.log('Environment variables check:');
console.log('- PORT:', process.env.PORT || 'Not set (will use default)');
console.log('- MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET');

// Test express import
console.log('Express import:', express ? 'SUCCESS' : 'FAILED');

// Test mongoose import
console.log('Mongoose import:', mongoose ? 'SUCCESS' : 'FAILED');

// Test basic server startup
const app = express();
const PORT = process.env.PORT || 4000;

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server test successful' });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server started on port ${PORT}`);
  
  // Close server after 2 seconds
  setTimeout(() => {
    server.close(() => {
      console.log('Test server closed successfully');
      process.exit(0);
    });
  }, 2000);
});

server.on('error', (error) => {
  console.error('Test server error:', error);
  process.exit(1);
});