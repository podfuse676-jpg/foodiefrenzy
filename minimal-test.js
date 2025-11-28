import express from 'express';
import itemRoutes from './backend/routes/itemRoute.js';

const app = express();

// Add basic middleware
app.use(express.json());

// Add a simple test route
app.get('/', (req, res) => {
  res.json({ message: 'Minimal test server running' });
});

// Register the item routes
app.use('/api/items', itemRoutes);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Minimal test server running on port ${PORT}`);
});