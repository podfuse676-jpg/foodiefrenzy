// Minimal test to check if routes work with Express 5
import express from 'express';
import itemRoutes from './routes/itemRoute.js';

const app = express();

// Add a simple middleware to log requests
app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

// Register the routes
console.log('Registering routes...');
app.use('/api/items', itemRoutes);
console.log('Routes registered');

// Add a 404 handler
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Try: http://localhost:${PORT}/api/items`);
});