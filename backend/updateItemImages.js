import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import Item from './modals/item.js';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Connect to MongoDB with a placeholder URI - this should be replaced with the actual Railway MongoDB URI
const connectDB = async () => {
  try {
    // Use the MONGODB_URI from environment variables, with a fallback for testing
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodiefrenzy';
    console.log('Connecting to MongoDB with URI:', mongoUri.split('@')[0] + '@***'); // Hide credentials
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const updateItemImages = async () => {
  await connectDB();
  
  try {
    console.log('Starting item image update...\n');
    
    // List all resources in the foodiefrenzy_items folder
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'foodiefrenzy_items/',
      max_results: 500
    });
    
    console.log(`Found ${result.resources.length} images in Cloudinary.`);
    
    // Map of item names to their correct Cloudinary URLs
    const itemImageMap = {};
    
    // Process all Cloudinary images to build the mapping
    result.resources.forEach(resource => {
      // Extract the item name from the public_id (before the timestamp)
      const parts = resource.public_id.split('/');
      if (parts.length > 1) {
        const filename = parts[1];
        // Remove the timestamp part (after the last underscore)
        const nameParts = filename.split('_');
        if (nameParts.length > 1) {
          nameParts.pop(); // Remove timestamp
          const itemName = nameParts.join('_').replace(/-/g, ' '); // Convert underscores to spaces
          itemImageMap[itemName] = resource.secure_url;
          console.log(`Mapped: ${itemName} -> ${resource.secure_url}`);
        }
      }
    });
    
    // Items we need to update
    const targetItems = [
      'Wiper Fluid',
      'Tire Cleaner',
      'Dashboard Polish',
      'Car Air Freshener',
      'Car Perfume'
    ];
    
    let updatedCount = 0;
    let notFoundCount = 0;
    
    // Update each target item
    for (const itemName of targetItems) {
      try {
        console.log(`\nProcessing item: ${itemName}`);
        
        // Find the item in the database
        const item = await Item.findOne({ 
          name: { $regex: new RegExp(itemName, 'i') } // Case insensitive match
        });
        
        if (!item) {
          console.log(`  ⚠️  Item not found in database: ${itemName}`);
          notFoundCount++;
          continue;
        }
        
        // Find the correct Cloudinary URL
        const correctUrl = itemImageMap[itemName];
        if (!correctUrl) {
          console.log(`  ⚠️  No Cloudinary URL found for: ${itemName}`);
          notFoundCount++;
          continue;
        }
        
        // Check if the item already has the correct URL
        if (item.imageUrl === correctUrl) {
          console.log(`  ✓ Item already has correct URL: ${itemName}`);
          updatedCount++;
          continue;
        }
        
        // Update the item with the correct URL
        const updatedItem = await Item.findByIdAndUpdate(
          item._id,
          { imageUrl: correctUrl },
          { new: true }
        );
        
        console.log(`  ✓ Updated item with correct Cloudinary URL: ${itemName}`);
        console.log(`    Old URL: ${item.imageUrl}`);
        console.log(`    New URL: ${updatedItem.imageUrl}`);
        updatedCount++;
        
      } catch (error) {
        console.log(`  ✗ Failed to update item ${itemName}: ${error.message}`);
      }
    }
    
    console.log(`\nUpdate Summary:`);
    console.log(`  Successfully updated: ${updatedCount}`);
    console.log(`  Not found/failures: ${notFoundCount}`);
    console.log(`  Total processed: ${targetItems.length}`);
    
    mongoose.connection.close();
    
  } catch (error) {
    console.error('Update error:', error);
    mongoose.connection.close();
  }
};

updateItemImages();