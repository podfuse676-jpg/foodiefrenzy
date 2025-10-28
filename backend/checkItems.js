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

const checkItems = async () => {
  await connectDB();
  
  try {
    console.log('Fetching all items from database...');
    const items = await Item.find({});
    
    console.log(`Found ${items.length} items:`);
    items.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name}`);
      console.log(`   Image URL: ${item.imageUrl}`);
      console.log(`   ID: ${item._id}`);
      console.log('---');
    });
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error fetching items:', error);
    mongoose.connection.close();
  }
};

checkItems();