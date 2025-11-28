// Minimal test to isolate the route issue
import express from 'express';
import itemRoutes from './backend/routes/itemRoute.js';

const app = express();
const PORT = 3001;

// Simple middleware to log all requests
app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

// Add JSON parsing
app.use(express.json());

// Register the items route
app.use('/api/items', itemRoutes);

// Add a simple test route
app.get('/', (req, res) => {
  res.json({ message: 'Test server running' });
});

// 404 handler
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ 
    message: 'Route not found in test server',
    method: req.method,
    url: req.url
  });
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Try accessing: http://localhost:${PORT}/api/items`);
});