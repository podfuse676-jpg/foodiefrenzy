import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import Item from './modals/item.js';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to sanitize filename for Cloudinary public_id
const sanitizeFilename = (filename) => {
  // Remove file extension
  const nameWithoutExt = path.parse(filename).name;
  // Replace invalid characters with underscores
  // Cloudinary public_id valid characters: alphanumeric, underscore, hyphen
  return nameWithoutExt
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_') // Replace multiple underscores with single underscore
    .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
};

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

const migrateToCloudinary = async () => {
  await connectDB();
  
  try {
    console.log('Starting migration to Cloudinary...\n');
    
    // Find all items with local image URLs
    const itemsWithLocalImages = await Item.find({
      imageUrl: { $regex: /^\/uploads\/images\// }
    });
    
    console.log(`Found ${itemsWithLocalImages.length} items with local image URLs`);
    
    if (itemsWithLocalImages.length === 0) {
      console.log('No items with local images found. Migration complete.');
      mongoose.connection.close();
      return;
    }
    
    // Get local image files
    const imagesDir = path.join(process.cwd(), 'uploads', 'images');
    let migratedCount = 0;
    let failedCount = 0;
    
    for (const item of itemsWithLocalImages) {
      try {
        console.log(`\nProcessing ${item.name}...`);
        
        // Extract filename from local URL
        const localUrl = item.imageUrl;
        const filename = path.basename(localUrl);
        const imagePath = path.join(imagesDir, filename);
        
        console.log(`  Local URL: ${localUrl}`);
        console.log(`  File path: ${imagePath}`);
        
        // Check if file exists
        if (!fs.existsSync(imagePath)) {
          console.log(`  ⚠️  File not found: ${imagePath}`);
          failedCount++;
          continue;
        }
        
        // Sanitize filename for Cloudinary public_id
        const sanitizedFilename = sanitizeFilename(filename);
        console.log(`  Sanitized filename: ${sanitizedFilename}`);
        
        console.log(`  Uploading ${filename} to Cloudinary...`);
        
        // Upload to Cloudinary with sanitized public_id
        const result = await cloudinary.uploader.upload(imagePath, {
          folder: 'foodiefrenzy_items',
          public_id: `${sanitizedFilename}_${Date.now()}`,
          overwrite: false,
          resource_type: 'image'
        });
        
        console.log(`  ✓ Uploaded successfully: ${result.secure_url}`);
        
        // Update item with Cloudinary URL
        const updatedItem = await Item.findByIdAndUpdate(
          item._id,
          { imageUrl: result.secure_url },
          { new: true }
        );
        
        console.log(`  ✓ Item updated with Cloudinary URL`);
        migratedCount++;
        
      } catch (error) {
        console.log(`  ✗ Failed to migrate ${item.name}: ${error.message}`);
        failedCount++;
      }
    }
    
    console.log(`\nMigration Summary:`);
    console.log(`  Successfully migrated: ${migratedCount}`);
    console.log(`  Failed to migrate: ${failedCount}`);
    console.log(`  Total processed: ${itemsWithLocalImages.length}`);
    
    mongoose.connection.close();
    
  } catch (error) {
    console.error('Migration error:', error);
    mongoose.connection.close();
  }
};

migrateToCloudinary();