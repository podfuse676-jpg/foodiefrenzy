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

const findProblemItems = async () => {
  await connectDB();
  
  try {
    console.log('Searching for items with problematic image URLs...');
    
    // Search for items with the specific image URLs mentioned in the error
    const problemItems = await Item.find({
      $or: [
        { imageUrl: { $regex: '1761580718238-car-perfume.jpg' } },
        { imageUrl: { $regex: '1761580718556-dash-board-polish.webp' } },
        { imageUrl: { $regex: 'uploads/1761580718238-car-perfume.jpg' } },
        { imageUrl: { $regex: 'uploads/1761580718556-dash-board-polish.webp' } }
      ]
    });
    
    console.log(`Found ${problemItems.length} items with problematic image URLs:`);
    problemItems.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name}`);
      console.log(`   Image URL: ${item.imageUrl}`);
      console.log(`   ID: ${item._id}`);
      console.log('---');
    });
    
    // Also check for items that might have these exact filenames
    const itemsWithExactNames = await Item.find({
      $or: [
        { imageUrl: '1761580718238-car-perfume.jpg' },
        { imageUrl: '1761580718556-dash-board-polish.webp' },
        { imageUrl: '/uploads/1761580718238-car-perfume.jpg' },
        { imageUrl: '/uploads/1761580718556-dash-board-polish.webp' }
      ]
    });
    
    if (itemsWithExactNames.length > 0) {
      console.log(`\nFound ${itemsWithExactNames.length} items with exact filename matches:`);
      itemsWithExactNames.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name}`);
        console.log(`   Image URL: ${item.imageUrl}`);
        console.log(`   ID: ${item._id}`);
        console.log('---');
      });
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error searching for items:', error);
    mongoose.connection.close();
  }
};

findProblemItems();