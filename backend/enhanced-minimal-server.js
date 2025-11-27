// enhanced-minimal-server.js
// Enhanced minimal server for Railway deployment with essential routes

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables
dotenv.config();

// Get port from environment or default to 10000
// Ensure it's a number
const PORT = parseInt(process.env.PORT || process.env.RAILWAY_PORT || 10000, 10);

console.log(`=== ENHANCED MINIMAL SERVER STARTING ===`);
console.log(`PORT: ${PORT} (type: ${typeof PORT})`);
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
console.log(`MONGODB_URI: ${process.env.MONGODB_URI ? 'SET' : 'NOT SET'}`);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ultra-simple health check - responds immediately with minimal response
app.get('/health', (req, res) => {
  console.log('Health check hit at:', new Date().toISOString());
  // Return exactly what Railway expects for a successful health check
  res.status(200).send('OK');
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not set in environment variables');
      return;
    }
    
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Import models and routes
let Item;
try {
  Item = (await import('./modals/item.js')).default;
  console.log('Item model loaded successfully');
} catch (error) {
  console.error('Error loading Item model:', error);
}

// Items API routes
app.get('/api/items', async (req, res) => {
  try {
    console.log('Fetching all items at:', new Date().toISOString());
    const items = await Item.find({});
    console.log(`Found ${items.length} items`);
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Failed to fetch items', error: error.message });
  }
});

app.get('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching item with ID: ${id}`);
    
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ message: 'Failed to fetch item', error: error.message });
  }
});

// Simple root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Enhanced minimal server running',
    timestamp: new Date().toISOString()
  });
});

// Start server immediately
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=== ENHANCED MINIMAL SERVER LISTENING ON PORT ${PORT} ===`);
  console.log(`Health check endpoint: http://0.0.0.0:${PORT}/health`);
  console.log(`Items endpoint: http://0.0.0.0:${PORT}/api/items`);
  console.log(`Root endpoint: http://0.0.0.0:${PORT}/`);
});

// Handle process signals
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down');
  process.exit(0);
});