// Script to manually update item images
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

// Image mapping - update this with your actual image filenames
const imageMapping = {
  // Format: "Item Name": "/uploads/images/filename.jpg"
  "Rolling Paper": "/uploads/images/rolling-paper.jpg",
  "Cigarillo": "/uploads/images/cigarillo.jpg",
  "Cigarette Pack": "/uploads/images/cigarette-pack.jpg",
  "Vape Pods": "/uploads/images/vape-pods.jpg",
  "Vape Device": "/uploads/images/vape-device.jpg",
  // Add more items as needed
};

const updateItemImages = async () => {
  try {
    await connectDB();
    
    console.log('Updating item images...');
    
    // Update each item with its image path
    for (const [itemName, imagePath] of Object.entries(imageMapping)) {
      try {
        const item = await Item.findOne({ name: itemName });
        if (item) {
          item.imageUrl = imagePath;
          await item.save();
          console.log(`✓ Updated image for "${itemName}" to ${imagePath}`);
        } else {
          console.log(`⚠ Item "${itemName}" not found`);
        }
      } catch (error) {
        console.error(`✗ Error updating "${itemName}":`, error.message);
      }
    }
    
    console.log('Image update process completed');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateItemImages();