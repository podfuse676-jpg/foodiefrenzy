// Script to list all items
import mongoose from 'mongoose';
import dotenv from 'dotenv';
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

const listItems = async () => {
  try {
    await connectDB();
    
    console.log('Listing all menu items...\n');
    
    const items = await Item.find({}, 'name category imageUrl');
    
    items.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} (${item.category})`);
      console.log(`   Current image: ${item.imageUrl || 'No image'}`);
      console.log(''); // Empty line for readability
    });
    
    console.log(`\nTotal items: ${items.length}`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

listItems();