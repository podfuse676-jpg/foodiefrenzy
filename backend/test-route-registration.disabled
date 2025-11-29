// test-route-registration.js
// Test to verify route registration

import express from 'express';
import itemRoutes from './routes/itemRoute.js';

const app = express();

// Register routes
console.log('Registering item routes...');
app.use('/api/items', itemRoutes);
console.log('Item routes registered');

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test route working' });
});

// 404 handler
app.use((req, res) => {
  console.log('404 for route:', req.url);
  res.status(404).json({ message: 'Route not found', url: req.url });
});

export default app;