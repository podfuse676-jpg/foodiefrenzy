import mongoose from 'mongoose';
import Item from './modals/item.js';

const fixRedbullCategory = async () => {
  try {
    await mongoose.connect('mongodb+srv://podfuse676_db_user:yashuprenny1231@cluster0.86ejws0.mongodb.net/foodiefrenzy?retryWrites=true&w=majority');
    
    // Find the Redbull item
    const redbullItem = await Item.findOne({ name: 'Redbull' });
    
    if (redbullItem) {
      console.log('Found Redbull item:', redbullItem.name, 'in category:', redbullItem.category);
      
      // Update the category to "Exotic Drinks"
      redbullItem.category = 'Exotic Drinks';
      await redbullItem.save();
      
      console.log('Updated Redbull item to category: Exotic Drinks');
    } else {
      console.log('Redbull item not found');
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

fixRedbullCategory();