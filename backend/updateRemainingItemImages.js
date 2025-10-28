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

const updateRemainingItemImages = async () => {
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
    
    console.log(`Found ${itemsWithoutImages.length} items without images`);
    
    // Get all image files from the uploads directory
    const imagesDir = path.join(process.cwd(), 'uploads', 'images');
    const imageFiles = fs.readdirSync(imagesDir);
    
    // Manual mapping for remaining items
    const manualMapping = {
      'Kool-Aid Bursts': 'Kool-Aid Bursts .webp',
      'Coca-Cola': 'Coca-Cola.webp',
      'Fanta (Orange / Blue Raspberry)': 'Fanta (Orange : Blue Raspberry).webp',
      'Lays Salt & Vinegar': 'Lays Salt & Vinegar.webp',
      'Miss Vickie\'s Jalapeño': 'Miss Vickie\'s Jalapeño.webp',
      'Christie Chips Ahoy (Snack)': 'Christie Chips Ahoy (Snack).webp',
      '5-Hr Energy Shot Berry': '5-Hr Energy Shot Berry.webp',
      '5-Hr Energy Shot Xtra (Blue Raspberry, Grape, Peach Mango)': '5-Hr Energy Shot Xtra (Blue Raspberry, Grape, Peach Mango).webp',
      'Keychain Set': 'Keychain Set\.webp',
      'Car Air Freshener': 'Car-Air-Freshener.webp'
    };
    
    // Fallback images for items without specific images
    const fallbackImages = {
      'Red Bull (Regular / Blue Edition)': 'Monster Energy Ultra.webp'  // Use Monster Energy as fallback
    };
    
    let updatedCount = 0;
    
    for (const item of itemsWithoutImages) {
      let imageName = manualMapping[item.name];
      
      // If no specific image, check for fallback
      if (!imageName) {
        imageName = fallbackImages[item.name];
      }
      
      if (imageName && imageFiles.includes(imageName)) {
        const imageUrl = `/uploads/images/${imageName}`;
        console.log(`Updating ${item.name} with image: ${imageName}`);
        
        // Update the item
        await Item.findByIdAndUpdate(item._id, { imageUrl });
        console.log(`Updated ${item.name} with image URL: ${imageUrl}`);
        updatedCount++;
      } else {
        console.log(`No image found for ${item.name}`);
      }
    }
    
    console.log(`\nSuccessfully updated ${updatedCount} remaining items with images`);
    
    // Verify the updates
    console.log('\nVerifying updates...');
    const itemsWithImages = await Item.find({ 
      imageUrl: { $exists: true, $ne: null, $ne: "" } 
    });
    console.log(`Total items with images: ${itemsWithImages.length}`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error updating remaining item images:', error);
    mongoose.connection.close();
  }
};

updateRemainingItemImages();