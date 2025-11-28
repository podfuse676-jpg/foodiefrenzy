// simple-route-test.js
// Simple test to verify route registration

import express from 'express';
import itemRoutes from './routes/itemRoute.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Add basic middleware
app.use(express.json());

// Register routes
console.log('Registering item routes...');
app.use('/api/items', itemRoutes);
console.log('Item routes registered');

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Simple route test server' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found', url: req.url });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Simple route test server listening on port ${PORT}`);
  console.log(`Health check: http://0.0.0.0:${PORT}/health`);
  console.log(`Items endpoint: http://0.0.0.0:${PORT}/api/items`);
});