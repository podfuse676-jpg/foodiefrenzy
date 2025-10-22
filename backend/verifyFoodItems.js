import mongoose from 'mongoose';
import Item from './modals/item.js';

mongoose.connect('mongodb://localhost:27017/foodiefrenzy')
  .then(async () => {
    console.log('Connected to MongoDB\n');
    
    // Get all items count
    const totalCount = await Item.countDocuments();
    console.log(`📊 TOTAL ITEMS IN DATABASE: ${totalCount}\n`);
    
    // Get convenience items count
    const convenienceCount = await Item.countDocuments({ category: 'Convenience' });
    console.log(`🛒 CONVENIENCE ITEMS: ${convenienceCount}\n`);
    
    // Get all food-related categories (not Convenience)
    const allCategories = await Item.distinct('category');
    const foodCategories = allCategories.filter(cat => cat !== 'Convenience');
    
    console.log(`🍔 FOOD CATEGORIES (${foodCategories.length} categories):\n`);
    
    let totalFoodItems = 0;
    for (const category of foodCategories.sort()) {
      const items = await Item.find({ category }).sort({ name: 1 });
      totalFoodItems += items.length;
      
      console.log(`\n📁 ${category} (${items.length} items):`);
      items.forEach(item => {
        const flavours = item.flavourOptions && item.flavourOptions.length > 0 
          ? ` [Flavours: ${item.flavourOptions.join(', ')}]` 
          : '';
        console.log(`   • ${item.name} - $${item.price}${flavours}`);
      });
    }
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📊 SUMMARY:`);
    console.log(`   Convenience Items: ${convenienceCount}`);
    console.log(`   Food Items (all categories): ${totalFoodItems}`);
    console.log(`   Total: ${totalCount}`);
    console.log(`${'='.repeat(60)}\n`);
    
    // Check for duplicate items
    console.log('🔍 Checking for potential duplicates...\n');
    const duplicateCheck = await Item.aggregate([
      { $group: { _id: '$name', count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    if (duplicateCheck.length > 0) {
      console.log(`⚠️  Found ${duplicateCheck.length} duplicate names:`);
      for (const dup of duplicateCheck) {
        const items = await Item.find({ name: dup._id });
        console.log(`\n   "${dup._id}" appears ${dup.count} times:`);
        items.forEach(item => {
          console.log(`      - Category: ${item.category}, Price: $${item.price}`);
        });
      }
    } else {
      console.log('✅ No duplicate item names found');
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
