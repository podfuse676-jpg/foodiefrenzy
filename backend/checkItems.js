import mongoose from 'mongoose';
import Item from './modals/item.js';

mongoose.connect('mongodb://localhost:27017/foodiefrenzy')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const count = await Item.countDocuments();
    console.log(`\nTotal items in database: ${count}`);
    
    const categories = await Item.distinct('category');
    console.log(`\nCategories (${categories.length}):`);
    
    for (const cat of categories.sort()) {
      const catCount = await Item.countDocuments({ category: cat });
      console.log(`  ${cat}: ${catCount} items`);
    }
    
    console.log('\n=== Sample Food Items ===');
    const foodCategories = ['Food', 'Wedges', 'Chai', 'Coffee', 'Speciality coffee', 'Slushy', 'Chicken wings'];
    const sampleFood = await Item.find({ 
      category: { $in: foodCategories } 
    }).limit(15);
    
    sampleFood.forEach(item => {
      console.log(`  - ${item.name} (${item.category}): $${item.price}`);
    });
    
    console.log('\n=== Sample Convenience Items ===');
    const sampleConv = await Item.find({ category: 'Convenience' }).limit(10);
    sampleConv.forEach(item => {
      console.log(`  - ${item.name}: $${item.price}`);
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
