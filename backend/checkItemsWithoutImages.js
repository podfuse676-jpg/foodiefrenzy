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

const checkItemsWithoutImages = async () => {
  await connectDB();
  
  try {
    console.log('Fetching items without images...');
    
    // Find all items that don't have an imageUrl field or have an empty imageUrl
    const itemsWithoutImages = await Item.find({ 
      $or: [
        { imageUrl: { $exists: false } },
        { imageUrl: { $eq: null } },
        { imageUrl: { $eq: "" } }
      ]
    });
    
    console.log(`Found ${itemsWithoutImages.length} items without images:`);
    
    itemsWithoutImages.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} (${item.category})`);
    });
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error checking items without images:', error);
    mongoose.connection.close();
  }
};

checkItemsWithoutImages();