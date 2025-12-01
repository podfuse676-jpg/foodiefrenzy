import mongoose from 'mongoose';
import Item from './modals/item.js';

const checkCarAccessories = async () => {
  try {
    await mongoose.connect('mongodb+srv://podfuse676_db_user:yashuprenny1231@cluster0.86ejws0.mongodb.net/foodiefrenzy?retryWrites=true&w=majority');
    
    // Check if Car Air Freshener exists and what category it's in
    const carFreshener = await Item.findOne({ name: { $regex: /Car.*Air.*Freshener|Air.*Freshener.*Car/i } });
    
    if (carFreshener) {
      console.log('Found Car Air Freshener item:', carFreshener.name, 'in category:', carFreshener.category);
    } else {
      console.log('Car Air Freshener item not found');
    }
    
    // Check what items are in the Car Accessories category
    const carAccessoriesItems = await Item.find({ category: 'Car Accessories' });
    console.log('\nItems in Car Accessories category:');
    carAccessoriesItems.forEach(item => {
      console.log(`  - ${item.name} (${item._id}) - $${item.price}`);
    });
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

checkCarAccessories();