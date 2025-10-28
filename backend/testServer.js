// Simple test server
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import models after database connection
import Item from './modals/item.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Test database route
app.get('/test-db', async (req, res) => {
  try {
    console.log('Testing database connection...');
    const items = await Item.find({}).limit(5);
    console.log('Found items:', items.length);
    res.json({
      success: true,
      message: 'Database connection successful',
      itemCount: items.length,
      items: items.map(item => ({
        id: item._id,
        name: item.name,
        category: item.category
      }))
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});