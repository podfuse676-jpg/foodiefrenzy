import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Item from './modals/item.js';
import fs from 'fs';
import path from 'path';

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

const findMissingImages = async () => {
  await connectDB();
  
  try {
    console.log('Fetching all items with image URLs...');
    
    // Find all items that have an imageUrl field that is not empty
    const itemsWithImages = await Item.find({ 
      imageUrl: { $exists: true, $ne: null, $ne: "" } 
    });
    
    console.log(`Found ${itemsWithImages.length} items with image URLs:`);
    
    let missingImages = 0;
    
    for (const item of itemsWithImages) {
      console.log(`\nItem: ${item.name}`);
      console.log(`  Image URL: ${item.imageUrl}`);
      
      // Check if it's a relative path or absolute URL
      if (item.imageUrl.startsWith('http')) {
        // For absolute URLs, extract the filename
        const urlParts = item.imageUrl.split('/');
        const filename = urlParts[urlParts.length - 1];
        console.log(`  Extracted filename: ${filename}`);
        
        // Check if file exists in uploads directory
        const imagePath = path.join(process.cwd(), 'uploads', 'images', filename);
        if (fs.existsSync(imagePath)) {
          console.log(`  ✓ File exists: ${filename}`);
        } else {
          console.log(`  ✗ File missing: ${filename}`);
          missingImages++;
        }
      } else {
        // For relative paths
        let relativePath = item.imageUrl;
        if (relativePath.startsWith('/')) {
          relativePath = relativePath.substring(1);
        }
        
        const imagePath = path.join(process.cwd(), relativePath);
        if (fs.existsSync(imagePath)) {
          console.log(`  ✓ File exists: ${relativePath}`);
        } else {
          console.log(`  ✗ File missing: ${relativePath}`);
          missingImages++;
        }
      }
    }
    
    console.log(`\nSummary: ${missingImages} items with missing image files`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error checking image URLs:', error);
    mongoose.connection.close();
  }
};

findMissingImages();