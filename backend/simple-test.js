import express from 'express';
import itemRoutes from './routes/itemRoute.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Simple middleware
app.use(express.json());

// Simple test route
app.get('/', (req, res) => {
  res.json({ message: 'Simple test server is running' });
});

// Test the item routes
app.use('/api/items', itemRoutes);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Simple test server running on port ${PORT}`);
});