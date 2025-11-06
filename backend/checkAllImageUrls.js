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

const checkAllImageUrls = async () => {
  await connectDB();
  
  try {
    console.log('Fetching all items with image URLs...');
    
    // Find all items that have an imageUrl field that is not empty
    const itemsWithImages = await Item.find({ 
      imageUrl: { $exists: true, $ne: null, $ne: "" } 
    });
    
    console.log(`Found ${itemsWithImages.length} items with image URLs:`);
    
    itemsWithImages.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name}`);
      console.log(`   Image URL: ${item.imageUrl}`);
      console.log(`   ID: ${item._id}`);
      
      // Check if the image file exists
      if (item.imageUrl) {
        // Extract filename from URL
        let filename = item.imageUrl;
        if (filename.includes('/')) {
          filename = filename.split('/').pop();
        }
        console.log(`   Extracted filename: ${filename}`);
      }
      console.log('---');
    });
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error checking image URLs:', error);
    mongoose.connection.close();
  }
};

checkAllImageUrls();