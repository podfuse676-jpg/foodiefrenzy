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

const updateFinalItems = async () => {
  await connectDB();
  
  try {
    console.log('Updating final items...');
    
    // Update Miss Vickie's Jalapeño
    const vickieItem = await Item.findOne({ name: "Miss Vickie's Jalapeño" });
    if (vickieItem) {
      await Item.findByIdAndUpdate(vickieItem._id, { 
        imageUrl: '/uploads/images/Miss Vickie\'s Jalapeño.webp' 
      });
      console.log(`Updated Miss Vickie's Jalapeño with image`);
    }
    
    // Update Keychain Set
    const keychainItem = await Item.findOne({ name: "Keychain Set" });
    if (keychainItem) {
      await Item.findByIdAndUpdate(keychainItem._id, { 
        imageUrl: '/uploads/images/Keychain Set\\.webp' 
      });
      console.log(`Updated Keychain Set with image`);
    }
    
    // Final verification
    console.log('\nFinal verification...');
    const itemsWithImages = await Item.find({ 
      imageUrl: { $exists: true, $ne: null, $ne: "" } 
    });
    console.log(`Total items with images: ${itemsWithImages.length}`);
    
    const itemsWithoutImages = await Item.find({ 
      $or: [
        { imageUrl: { $exists: false } },
        { imageUrl: { $eq: null } },
        { imageUrl: { $eq: "" } }
      ]
    });
    console.log(`Items still without images: ${itemsWithoutImages.length}`);
    
    if (itemsWithoutImages.length > 0) {
      console.log('Items still without images:');
      itemsWithoutImages.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name} (${item.category})`);
      });
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error updating final items:', error);
    mongoose.connection.close();
  }
};

updateFinalItems();