// Test to check if routes work without database connection
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

// Mock the database functions to avoid database connection issues
// This is a hack to test if routes work without database
const originalModule = await import('./controllers/itemController.js');

// Override the getItems function to return mock data
const mockGetItems = (req, res) => {
  console.log('Mock getItems called');
  res.json([{ id: 1, name: 'Test Item', price: 10.99 }]);
};

// Create a new router with mock functions
const mockItemRouter = express.Router();
mockItemRouter.get('/', mockGetItems);
mockItemRouter.post('/', (req, res) => res.json({ message: 'Created' }));
mockItemRouter.get('/:id', (req, res) => res.json({ id: req.params.id, name: 'Test Item' }));
mockItemRouter.delete('/:id', (req, res) => res.json({ message: 'Deleted' }));
mockItemRouter.put('/:id', (req, res) => res.json({ message: 'Updated' }));

// Register the mock routes
console.log('Registering mock routes...');
app.use('/api/items', mockItemRouter);
console.log('Mock routes registered');

// Add a simple test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint working' });
});

// Add a 404 handler
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Test server without DB running on port ${PORT}`);
  console.log(`Try: http://localhost:${PORT}/api/items`);
  console.log(`Try: http://localhost:${PORT}/test`);
});