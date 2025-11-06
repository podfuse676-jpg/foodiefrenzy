import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Item from './modals/item.js';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const testItems = async () => {
  await connectDB();
  
  try {
    console.log('Testing Item model import...');
    
    // Test if we can use the Item model
    const itemCount = await Item.countDocuments();
    console.log(`Item model working correctly. Found ${itemCount} items in database.`);
    
    // Try to fetch a few items
    const items = await Item.find({}).limit(5);
    console.log(`Sample items:`, items.map(item => ({
      id: item._id,
      name: item.name,
      imageUrl: item.imageUrl
    })));
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error testing Item model:', error);
    mongoose.connection.close();
  }
};

testItems();