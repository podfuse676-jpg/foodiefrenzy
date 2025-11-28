import express from 'express';
import itemRoutes from './routes/itemRoute.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Simple middleware
app.use(express.json());

// Simple test route
app.get('/', (req, res) => {
  res.json({ message: 'Minimal route test server is running' });
});

// Test the item routes
app.use('/api/items', itemRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// 404 handler
app.use((req, res) => {
  console.log('404 - Route not found:', req.url);
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Minimal route test server running on port ${PORT}`);
});