// Debug route registration
import express from 'express';
import itemRoutes from './routes/itemRoute.js';

const app = express();

// Add middleware to parse JSON
app.use(express.json());

// Add a simple middleware to log requests
app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

// Log route registration
console.log('=== REGISTERING ROUTES ===');
console.log('typeof itemRoutes:', typeof itemRoutes);
console.log('itemRoutes keys:', Object.keys(itemRoutes || {}));

// Check if itemRoutes has stack property (indicating it's a router)
if (itemRoutes && itemRoutes.stack) {
  console.log('itemRoutes.stack length:', itemRoutes.stack.length);
  console.log('itemRoutes.stack:', itemRoutes.stack.map(layer => ({
    method: layer.route ? Object.keys(layer.route.methods)[0] : 'middleware',
    path: layer.route ? layer.route.path : 'middleware'
  })));
} else {
  console.log('itemRoutes does not appear to be a router');
}

// Register the routes
try {
  app.use('/api/items', itemRoutes);
  console.log('Routes registered successfully');
} catch (error) {
  console.log('Error registering routes:', error.message);
}

// Add a simple test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint working' });
});

// Add 404 handler
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = 3004;
app.listen(PORT, () => {
  console.log(`Debug server running on port ${PORT}`);
});