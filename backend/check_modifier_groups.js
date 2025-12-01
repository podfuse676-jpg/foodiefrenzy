import mongoose from 'mongoose';
import Item from './modals/item.js';

const checkModifierGroups = async () => {
  try {
    await mongoose.connect('mongodb+srv://podfuse676_db_user:yashuprenny1231@cluster0.86ejws0.mongodb.net/foodiefrenzy?retryWrites=true&w=majority');
    
    // Find items that have modifier groups
    const items = await Item.find({ modifierGroups: { $ne: [] } }).limit(5);
    
    console.log('Items with modifier groups:');
    items.forEach(item => {
      console.log(`  - ${item.name}:`, item.modifierGroups);
    });
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

checkModifierGroups();