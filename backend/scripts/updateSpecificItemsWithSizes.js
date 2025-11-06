import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import Item from '../modals/item.js';

dotenv.config();

// Connect to MongoDB
connectDB();

// Define categories and keywords for items that should have sizes
const sizeCategories = ['Drinks', 'Speciality coffee', 'Beverages', 'Ice Cream'];
const sizeKeywords = [
  'coffee', 'tea', 'latte', 'smoothie', 'mocha', 'cappuccino', 'espresso',
  'scoop', 'ice cream', 'cake', 'pie', 'mousse', 'pudding', 'gelato',
  'salad', 'sandwich', 'wrap', 'burger', 'taco', 'quesadilla', 'pasta',
  'steak', 'chicken', 'beef', 'pork', 'fish', 'shrimp', 'lamb',
  'pancake', 'waffle', 'french toast', 'omelet', 'burrito', 'soup'
];

// Specific item names that should have sizes
const specificItemsWithSizes = [
  'Iced Latte', 'Mojito', 'Smoothie', 'Iced Tea', 'Lemonade', 
  'Espresso', 'Margarita', 'Cappuccino', 'Snapple Drink Kiwi/Strbry',
  'Snapple Drink Lemonade', 'Snapple Drink Mango Madns', 'Snapple Ice Tea Lemon',
  'Snapple Ice Tea Peach', 'Sparkling Ice Cherry/Limeade', 'Sparkling Ice Coco/Pineapple',
  'Sparkling Ice Orange Mango', 'Sparkling Ice Peach Necatrine', 'T Buddah Coco Wtr',
  'T Buddah Coco Wtr W/Pulp', 'Pancakes with Maple Syrup', 'French Toast', 'Breakfast Burrito',
  'Eggs Benedict', 'Bagel with Lox', 'Granola Parfait', 'Fruit Smoothie Bowl',
  'Chicken Caesar Salad', 'Club Sandwich', 'Veggie Wrap', 'Grilled Cheese Sandwich',
  'Turkey Panini', 'Quinoa Salad', 'Pasta Salad', 'Fish Tacos',
  'Grilled Ribeye Steak', 'Salmon Fillet', 'Roast Chicken', 'Pasta Primavera',
  'Beef Bourguignon', 'Vegetable Stir Fry', 'Shrimp Scampi', 'Lamb Chops',
  'Tacosal Pastor', 'Chicken Quesadilla', 'Enchiladas', 'Fajitas', 'Nachos',
  'Burrito', 'Tamales', 'Chilaquiles', 'Lasagna', 'Spaghetti Carbonara',
  'Risotto', 'Margherita Pizza', 'Fettuccine Alferdo', 'Pesto Pasta', 'Gnocchi',
  'Osso Buco', 'Tiramisu', 'Gelato', 'Cannoli', 'Panna Cotta', 'Cheesecake',
  'Chocolate Mousse', 'Profiteroles', 'Ricotta Pie', 'Single Scoop Ice Cream', 
  'Double scoop', 'Triple scoop', 'Hot dog', 'Latte', 'Mocha', 'Cappucino',
  'Hot Chocolate', 'Waffle cone', 'Soup'
];

// Categories that should NOT have sizes (to remove existing size options)
const noSizeCategories = ['Convenience', 'Merchandise', 'Candy', 'Toys', 'Household'];

const updateSpecificItemsWithSizes = async () => {
  try {
    let updatedCount = 0;
    let removedCount = 0;
    
    // Get all items
    const allItems = await Item.find({});
    
    for (const item of allItems) {
      // Check if item should have sizes
      const shouldHaveSizes = 
        specificItemsWithSizes.includes(item.name) ||
        sizeCategories.includes(item.category) ||
        sizeKeywords.some(keyword => 
          item.name.toLowerCase().includes(keyword) || 
          (item.description && item.description.toLowerCase().includes(keyword))
        );
      
      // Check if item is in a category that should NOT have sizes
      const shouldNotHaveSizes = noSizeCategories.includes(item.category);
      
      if (shouldNotHaveSizes) {
        // Remove size options from items in categories that shouldn't have them
        if (item.sizeOptions && item.sizeOptions.length > 0) {
          item.sizeOptions = [];
          await item.save();
          console.log(`Removed size options from: ${item.name} (category: ${item.category})`);
          removedCount++;
        }
      } else if (shouldHaveSizes) {
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
          console.log(`Updated item: ${item.name} (category: ${item.category})`);
          updatedCount++;
        } else {
          console.log(`Item ${item.name} already has size options`);
        }
      } else if (item.sizeOptions && item.sizeOptions.length > 0) {
        // For items that don't match our criteria but have size options, remove them
        item.sizeOptions = [];
        await item.save();
        console.log(`Removed size options from: ${item.name} (category: ${item.category})`);
        removedCount++;
      }
    }
    
    console.log(`Updated ${updatedCount} items with size options.`);
    console.log(`Removed size options from ${removedCount} items.`);
  } catch (error) {
    console.error('Error updating items:', error);
  } finally {
    mongoose.connection.close();
  }
};

updateSpecificItemsWithSizes();