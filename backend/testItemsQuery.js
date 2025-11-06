// Script to test items query
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Item from './modals/item.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Test querying items
    console.log('Querying items...');
    const items = await Item.find({}).limit(5);
    console.log(`Found ${items.length} items`);
    
    items.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} - ${item.category}`);
      console.log(`   Image URL: ${item.imageUrl || 'No image'}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();