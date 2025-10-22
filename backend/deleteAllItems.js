import mongoose from 'mongoose';
import Item from './modals/item.js';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/foodiefrenzy')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Function to delete all items
const deleteAllItems = async () => {
  try {
    // Clear existing items
    await Item.deleteMany({});
    console.log('Successfully deleted all menu items');
    process.exit(0);
  } catch (error) {
    console.error('Error deleting items:', error);
    process.exit(1);
  }
};

// Run the deletion
deleteAllItems();