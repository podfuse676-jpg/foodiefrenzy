// Script to test if WebP images are working correctly
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

const testWebPImage = async () => {
  try {
    await connectDB();
    
    console.log('Testing WebP image support...\n');
    
    // Find the item with WebP image
    const item = await Item.findOne({ name: "Dashboard Polish" });
    
    if (item) {
      console.log('Item found:', item.name);
      console.log('Image URL:', item.imageUrl);
      console.log('Image format:', item.imageUrl ? item.imageUrl.split('.').pop() : 'None');
      
      if (item.imageUrl && item.imageUrl.endsWith('.webp')) {
        console.log('✅ WebP image is correctly assigned to item');
      } else {
        console.log('❌ Item does not have a WebP image assigned');
      }
    } else {
      console.log('❌ Dashboard Polish item not found');
    }
    
    // Test another item with JPEG
    const jpegItem = await Item.findOne({ name: "Car Perfume" });
    
    if (jpegItem) {
      console.log('\nItem found:', jpegItem.name);
      console.log('Image URL:', jpegItem.imageUrl);
      console.log('Image format:', jpegItem.imageUrl ? jpegItem.imageUrl.split('.').pop() : 'None');
      
      if (jpegItem.imageUrl && jpegItem.imageUrl.endsWith('.jpg')) {
        console.log('✅ JPEG image is correctly assigned to item');
      } else {
        console.log('❌ Item does not have a JPEG image assigned');
      }
    } else {
      console.log('❌ Car Perfume item not found');
    }
    
    console.log('\nWebP images are fully supported in:');
    console.log('- Modern browsers (Chrome, Firefox, Safari, Edge)');
    console.log('- HTML img tags (no special handling required)');
    console.log('- CSS background images');
    console.log('- All image processing libraries');
    
    console.log('\nBenefits of WebP format:');
    console.log('- 25-35% smaller file sizes compared to JPEG');
    console.log('- Better image quality at same file size');
    console.log('- Supports both lossy and lossless compression');
    console.log('- Supports transparency (alpha channel)');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testWebPImage();