import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Item from './modals/item.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB using the Atlas database
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodiefrenzy';

console.log('Connecting to MongoDB Atlas:', mongoURI.replace(/:[^:@]+@/, ':****@'));

mongoose.connect(mongoURI)
  .then(async () => {
    console.log('Connected to MongoDB Atlas');
    
    // Define keywords for each category
    const categoryKeywords = {
      'Fruits': ['apple', 'banana', 'orange', 'grape', 'strawberry', 'blueberry', 'raspberry', 'blackberry', 'kiwi', 'mango', 'pineapple', 'peach', 'pear', 'plum', 'cherry', 'watermelon', 'cantaloupe', 'honeydew', 'fruit'],
      'Vegetables': ['carrot', 'broccoli', 'spinach', 'lettuce', 'cucumber', 'tomato', 'potato', 'onion', 'garlic', 'pepper', 'celery', 'cabbage', 'cauliflower', 'corn', 'pea', 'bean', 'squash', 'zucchini', 'eggplant', 'mushroom', 'vegetable'],
      'Dairy': ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'ice cream', 'dairy'],
      'Beverages': ['water', 'juice', 'soda', 'pop', 'cola', 'tea', 'coffee', 'energy drink', 'sports drink', 'beverage', 'drink'],
      'Snacks': ['chip', 'cracker', 'cookie', 'candy', 'chocolate', 'nut', 'pretzel', 'popcorn', 'snack'],
      'Essentials': ['bread', 'rice', 'pasta', 'flour', 'sugar', 'salt', 'oil', 'vinegar', 'spice', 'seasoning', 'sauce', 'ketchup', 'mustard', 'mayo', 'jam', 'jelly', 'peanut butter', 'cereal', 'oat', 'essential']
    };
    
    // Get all convenience items
    const convenienceItems = await Item.find({ category: 'Convenience' });
    console.log(`Found ${convenienceItems.length} convenience items to re-categorize`);
    
    let updatedCount = 0;
    
    // Update each item's category based on its name
    for (const item of convenienceItems) {
      const itemName = item.name.toLowerCase();
      let newCategory = 'Convenience'; // Default category
      
      // Check each category's keywords
      for (const [category, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some(keyword => itemName.includes(keyword))) {
          newCategory = category;
          break;
        }
      }
      
      // Update the item if category changed
      if (newCategory !== item.category) {
        await Item.findByIdAndUpdate(item._id, { category: newCategory });
        console.log(`Updated: ${item.name} from ${item.category} to ${newCategory}`);
        updatedCount++;
      }
    }
    
    console.log(`\n=== Category Update Summary ===`);
    console.log(`Items re-categorized: ${updatedCount}`);
    
    // Show updated category counts
    const categories = await Item.distinct('category');
    console.log('\nUpdated category counts:');
    for (const cat of categories.sort()) {
      const count = await Item.countDocuments({ category: cat });
      console.log(`  ${cat}: ${count} items`);
    }
    
    mongoose.connection.close();
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });