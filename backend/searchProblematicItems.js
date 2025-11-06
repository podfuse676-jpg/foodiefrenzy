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

const searchForProblematicItems = async () => {
  await connectDB();
  
  try {
    console.log('Searching for items with problematic image URLs...');
    
    // Search for any items that might contain the problematic filenames
    const allItems = await Item.find({});
    
    const problematicItems = allItems.filter(item => {
      if (!item.imageUrl) return false;
      
      // Check if the image URL contains the problematic filenames
      return (
        item.imageUrl.includes('1761580718238-car-perfume.jpg') ||
        item.imageUrl.includes('1761580718556-dash-board-polish.webp') ||
        item.imageUrl.includes('uploads/1761580718238-car-perfume.jpg') ||
        item.imageUrl.includes('uploads/1761580718556-dash-board-polish.webp')
      );
    });
    
    console.log(`Found ${problematicItems.length} items with problematic image URLs:`);
    
    problematicItems.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name}`);
      console.log(`   Image URL: ${item.imageUrl}`);
      console.log(`   ID: ${item._id}`);
      console.log('---');
    });
    
    // Also check for partial matches
    const partialMatches = allItems.filter(item => {
      if (!item.imageUrl) return false;
      
      // Check for timestamp-like patterns in the image URL
      return /\d{13}-.*\.(jpg|jpeg|png|webp)/.test(item.imageUrl);
    });
    
    if (partialMatches.length > 0) {
      console.log(`\nFound ${partialMatches.length} items with timestamp-like image URLs:`);
      partialMatches.forEach((item, index) => {
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

searchForProblematicItems();