// Script to test items endpoint
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import itemRoutes from './routes/itemRoute.js';
import Item from './modals/item.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/items', itemRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Test server is running!' });
});

// Test database route
app.get('/test-items', async (req, res) => {
  try {
    console.log('Testing items query...');
    const items = await Item.find({}).limit(5);
    console.log('Found items:', items.length);
    res.json({
      success: true,
      message: 'Items query successful',
      itemCount: items.length,
      items: items.map(item => ({
        id: item._id,
        name: item.name,
        category: item.category
      }))
    });
  } catch (error) {
    console.error('Items test error:', error);
    res.status(500).json({
      success: false,
      message: 'Items query failed',
      error: error.message
    });
  }
});

// Connect to database and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
  });
});