import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

// Item schema (simplified version)
const itemSchema = new mongoose.Schema({
  name: String,
  imageUrl: String
}, { collection: 'items' });

const Item = mongoose.model('Item', itemSchema);

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Use the MONGODB_URI from environment variables
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('MONGODB_URI environment variable is not set');
      process.exit(1);
    }
    
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const fixImageUrls = async () => {
  await connectDB();
  
  try {
    console.log('Starting image URL fixes...\n');
    
    // Define the corrections needed
    const corrections = [
      {
        itemName: 'Dashboard Polish',
        correctUrl: 'https://res.cloudinary.com/dfjypp016/image/upload/v1761670243/foodiefrenzy_items/foodiefrenzy_items/Dashboard_Polish_1761670242267.webp'
      },
      {
        itemName: 'Car Perfume',
        correctUrl: 'https://res.cloudinary.com/dfjypp016/image/upload/v1761670308/foodiefrenzy_items/foodiefrenzy_items/Car_Perfume_1761670306659.webp'
      }
    ];
    
    let updatedCount = 0;
    
    // Process each correction
    for (const correction of corrections) {
      try {
        console.log(`Processing: ${correction.itemName}`);
        
        // Find the item (case insensitive)
        const item = await Item.findOne({ 
          name: { $regex: new RegExp(`^${correction.itemName}$`, 'i') }
        });
        
        if (!item) {
          console.log(`  ⚠️  Item not found: ${correction.itemName}`);
          continue;
        }
        
        // Check if the item already has the correct URL
        if (item.imageUrl === correction.correctUrl) {
          console.log(`  ✓ Item already has correct URL: ${correction.itemName}`);
          continue;
        }
        
        // Show what will be changed
        console.log(`  Current URL: ${item.imageUrl}`);
        console.log(`  Correct URL: ${correction.correctUrl}`);
        
        // Update the item
        const updatedItem = await Item.findByIdAndUpdate(
          item._id,
          { imageUrl: correction.correctUrl },
          { new: true }
        );
        
        console.log(`  ✓ Updated item: ${correction.itemName}\n`);
        updatedCount++;
        
      } catch (error) {
        console.log(`  ✗ Failed to update ${correction.itemName}: ${error.message}\n`);
      }
    }
    
    console.log(`=== SUMMARY ===`);
    console.log(`Successfully updated ${updatedCount} items`);
    
    mongoose.connection.close();
    
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
};

fixImageUrls();