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
// Supports both JPEG and WebP formats
const imageMapping = {
  // Format: "Item Name": "/uploads/images/filename.ext"
  "Car Perfume": "/uploads/images/car-perfume.jpg",
  "Dashboard Polish": "/uploads/images/dash-board-polish.webp",
  // Add more items as needed
};

const updateItemImages = async () => {
  try {
    await connectDB();
    
    console.log('Updating item images...');
    console.log('Supported formats: JPEG, PNG, WebP, GIF');
    
    // Update each item with its image path
    for (const [itemName, imagePath] of Object.entries(imageMapping)) {
      try {
        const item = await Item.findOne({ name: itemName });
        if (item) {
          // Use absolute URL for deployed backend
          const baseUrl = process.env.BACKEND_URL || 'http://localhost:4000';
          item.imageUrl = `${baseUrl}${imagePath}`;
          await item.save();
          console.log(`✓ Updated image for "${itemName}" to ${item.imageUrl}`);
        } else {
          console.log(`⚠ Item "${itemName}" not found`);
        }
      } catch (error) {
        console.error(`✗ Error updating "${itemName}":`, error.message);
      }
    }
    
    console.log('\nImage update process completed');
    console.log('WebP images are supported and will be displayed correctly in modern browsers');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateItemImages();