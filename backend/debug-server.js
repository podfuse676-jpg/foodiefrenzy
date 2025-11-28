// debug-server.js
// Simplified server to debug route registration issues

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

console.log('=== DEBUG SERVER STARTING ===');

// Add basic middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Simple health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Debug server running' });
});

// Import and register routes
console.log('Importing routes...');
import itemRoutes from './routes/itemRoute.js';
import userRoutes from './routes/userRoute.js';

console.log('Registering routes...');
app.use('/api/items', itemRoutes);
app.use('/api/users', userRoutes);

console.log('Routes registered successfully');

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Debug server is running!' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// 404 handler
app.use((req, res) => {
  console.log('404 for route:', req.url);
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`=== DEBUG SERVER LISTENING ON PORT ${PORT} ===`);
  console.log(`Health check: http://0.0.0.0:${PORT}/health`);
  console.log(`Items endpoint: http://0.0.0.0:${PORT}/api/items`);
  console.log(`Users endpoint: http://0.0.0.0:${PORT}/api/users`);
});