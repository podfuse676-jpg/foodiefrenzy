import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import Item from '../modals/item.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const updateItemsWithSizes = async () => {
  try {
    // Find all items
    const items = await Item.find({});
    
    let updatedCount = 0;
    
    for (const item of items) {
      // Check if item already has size options
      if (!item.sizeOptions || item.sizeOptions.length === 0) {
        // Add default size options
        item.sizeOptions = [
          { size: 'Small', price: item.price, sku: `${item.sku || item._id}-S` },
          { size: 'Medium', price: item.price + 2, sku: `${item.sku || item._id}-M` },
          { size: 'Large', price: item.price + 4, sku: `${item.sku || item._id}-L` }
        ];
        
        // Save the updated item
        await item.save();
        console.log(`Updated item: ${item.name}`);
        updatedCount++;
      }
    }
    
    console.log(`All items updated with size options. Total updated: ${updatedCount}`);
  } catch (error) {
    console.error('Error updating items:', error);
  } finally {
    mongoose.connection.close();
  }
};

updateItemsWithSizes();