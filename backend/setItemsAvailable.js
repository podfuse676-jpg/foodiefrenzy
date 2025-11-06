import mongoose from 'mongoose';
import Item from './modals/item.js';

mongoose.connect('mongodb://localhost:27017/foodiefrenzy')
  .then(async () => {
    console.log('Connected to MongoDB\n');
    
    try {
      // Update all items to have quantity = 100 (available in stock)
      const result = await Item.updateMany(
        { quantity: { $lte: 0 } }, // Items with 0 or negative quantity
        { $set: { quantity: 100 } }  // Set to 100
      );
      
      console.log(`✅ Updated ${result.modifiedCount} items to be available in stock`);
      
      // Verify the update
      const totalItems = await Item.countDocuments();
      const availableItems = await Item.countDocuments({ quantity: { $gt: 0 } });
      const unavailableItems = await Item.countDocuments({ quantity: { $lte: 0 } });
      
      console.log('\n📊 Stock Status:');
      console.log(`   Total Items: ${totalItems}`);
      console.log(`   Available (quantity > 0): ${availableItems}`);
      console.log(`   Unavailable (quantity = 0): ${unavailableItems}`);
      
      process.exit(0);
    } catch (error) {
      console.error('Error updating items:', error);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
