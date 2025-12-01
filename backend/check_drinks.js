import mongoose from 'mongoose';
import Item from './modals/item.js';

const checkDrinksCategory = async () => {
  try {
    await mongoose.connect('mongodb+srv://podfuse676_db_user:yashuprenny1231@cluster0.86ejws0.mongodb.net/foodiefrenzy?retryWrites=true&w=majority');
    const items = await Item.find({ category: 'Drinks' });
    console.log('Items in Drinks category:');
    items.forEach(item => {
      console.log(`  - ${item.name} (${item._id}) - $${item.price}`);
    });
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

checkDrinksCategory();