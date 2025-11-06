// Script to fix double URL issue in item image URLs
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

const fixImageUrls = async () => {
  try {
    await connectDB();
    
    console.log('Fixing double URL issue in item image URLs...\n');
    
    // Find all items with image URLs
    const items = await Item.find({ imageUrl: { $ne: null, $ne: "" } });
    
    console.log(`Found ${items.length} items with image URLs`);
    
    // Fix each item's image URL
    for (const item of items) {
      if (item.imageUrl && item.imageUrl.includes('http://lakeshoreconveniencee-backend.onrender.comhttps://')) {
        // Fix double URL issue
        const fixedUrl = item.imageUrl.replace('http://lakeshoreconveniencee-backend.onrender.comhttps://', 'https://');
        console.log(`Fixing URL for "${item.name}":`);
        console.log(`  Old: ${item.imageUrl}`);
        console.log(`  New: ${fixedUrl}`);
        
        item.imageUrl = fixedUrl;
        await item.save();
        console.log(`  ✓ Updated`);
      } else if (item.imageUrl && item.imageUrl.startsWith('https://')) {
        // Already correct
        console.log(`"${item.name}" already has correct URL: ${item.imageUrl}`);
      } else if (item.imageUrl && item.imageUrl.startsWith('/uploads/')) {
        // Relative path, leave as is
        console.log(`"${item.name}" has relative path: ${item.imageUrl}`);
      }
    }
    
    console.log('\nImage URL fix process completed');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixImageUrls();