import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
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

const finalImageVerification = async () => {
  await connectDB();
  
  try {
    console.log('=== FINAL IMAGE VERIFICATION ===\n');
    
    // Get all items with images
    const itemsWithImages = await Item.find({ 
      imageUrl: { $exists: true, $ne: null, $ne: "" } 
    });
    
    console.log(`Total items with images: ${itemsWithImages.length}\n`);
    
    // Check if image files exist locally
    const imagesDir = path.join(process.cwd(), 'uploads', 'images');
    let missingFiles = 0;
    let validImages = 0;
    
    console.log('Checking image file existence...\n');
    
    for (const item of itemsWithImages) {
      // Extract filename from URL
      let filename = item.imageUrl;
      if (filename.startsWith('/uploads/images/')) {
        filename = filename.substring('/uploads/images/'.length);
      } else if (filename.includes('/')) {
        filename = filename.split('/').pop();
      }
      
      const imagePath = path.join(imagesDir, filename);
      
      if (fs.existsSync(imagePath)) {
        validImages++;
        console.log(`✓ ${item.name}: File exists (${filename})`);
      } else {
        missingFiles++;
        console.log(`✗ ${item.name}: File missing (${filename})`);
      }
    }
    
    console.log(`\n=== SUMMARY ===`);
    console.log(`Total items: ${itemsWithImages.length}`);
    console.log(`Valid images: ${validImages}`);
    console.log(`Missing files: ${missingFiles}`);
    
    if (missingFiles === 0) {
      console.log('\n🎉 ALL IMAGES ARE SUCCESSFULLY ASSIGNED AND FILES EXIST!');
    } else {
      console.log(`\n⚠️  ${missingFiles} items are missing image files`);
    }
    
    // Show a sample of items with their image URLs
    console.log('\n=== SAMPLE ITEMS WITH IMAGES ===');
    const sampleItems = itemsWithImages.slice(0, 10);
    sampleItems.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name}: ${item.imageUrl}`);
    });
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error during final verification:', error);
    mongoose.connection.close();
  }
};

finalImageVerification();