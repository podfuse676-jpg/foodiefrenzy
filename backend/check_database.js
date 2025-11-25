import mongoose from 'mongoose';
import Item from './modals/item.js';

const checkDatabase = async () => {
  try {
    console.log('Connecting to database...');
    // Use the MongoDB URI directly from the .env file
    const mongoUri = 'mongodb+srv://podfuse676_db_user:yashuprenny1231@cluster0.86ejws0.mongodb.net/foodiefrenzy?retryWrites=true&w=majority';
    
    await mongoose.connect(mongoUri);
    console.log('Connected to database successfully!');
    
    const items = await Item.find({});
    console.log('Total items in database:', items.length);
    
    // Group items by category
    const categories = {};
    items.forEach(item => {
      const category = item.category || 'Uncategorized';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push({
        name: item.name,
        _id: item._id,
        price: item.price,
        category: item.category
      });
    });
    
    console.log('\nItems by category:');
    Object.keys(categories).forEach(category => {
      console.log(`  ${category}: ${categories[category].length} items`);
    });
    
    console.log('\nSample items:');
    Object.keys(categories).slice(0, 3).forEach(category => {
      console.log(`  ${category}:`);
      categories[category].slice(0, 2).forEach(item => {
        console.log(`    - ${item.name} (${item._id}) - $${item.price}`);
      });
    });
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

checkDatabase();