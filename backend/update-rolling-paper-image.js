import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Item from './modals/item.js';

dotenv.config();

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodiefrenzy';

async function updateRollingPaperImage() {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
    
    // Find the Rolling Paper item
    const item = await Item.findOne({ name: "Rolling Paper" });
    
    if (!item) {
      console.log('Rolling Paper item not found');
      await mongoose.connection.close();
      return;
    }
    
    console.log(`Found item: ${item.name}`);
    console.log(`Current image URL: ${item.imageUrl}`);
    
    // Update with new image URL
    // Make sure this matches the filename you placed in the uploads directory
    const newImageUrl = '/uploads/rolling-paper-product.jpg';
    
    const updatedItem = await Item.findByIdAndUpdate(
      item._id,
      { imageUrl: newImageUrl },
      { new: true }
    );
    
    console.log(`Updated item: ${updatedItem.name}`);
    console.log(`New image URL: ${updatedItem.imageUrl}`);
    
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

updateRollingPaperImage();