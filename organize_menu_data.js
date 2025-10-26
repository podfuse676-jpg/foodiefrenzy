/**
 * Menu Data Organization Script
 * 
 * This script helps organize menu data from Excel files into the exact
 * category structure and modifier implementation requested.
 * 
 * Usage:
 * 1. Place your Excel files in the project root directory
 * 2. Run: node organize_menu_data.js
 */

const fs = require('fs');
const path = require('path');

// Define the exact category order
const CATEGORY_ORDER = [
  'Home',
  'Products',
  'Hot Beverages',
  'Cold Beverages',
  'Hot Food',
  'Exotic Chips',
  'Exotic Drinks',
  'Grocery',
  'Novelties',
  'Car Accessories',
  'Smokes & Vapes'
];

// Define modifier groups by category
const MODIFIER_GROUPS = {
  'Hot Beverages': ['Milk Options', 'Sugar Level', 'Size Options'],
  'Cold Beverages': ['Flavors', 'Ice Level', 'Sweetness', 'Size Options'],
  'Hot Food': ['Sauces', 'Add-ons', 'Spice Level', 'Cooking Instructions'],
  'Exotic Chips': ['Flavor', 'Size'],
  'Exotic Drinks': ['Temperature', 'Additions', 'Size Options'],
  'Grocery': ['Size/Weight', 'Ripeness'],
  'Novelties': ['Flavor', 'Size'],
  'Car Accessories': ['Compatibility', 'Color'],
  'Smokes & Vapes': ['Strength/Flavor', 'Size/Pack']
};

// Sample mapping for convenience items that should be re-categorized
const CONVENIENCE_CATEGORY_MAPPING = {
  // Map specific items or keywords to appropriate categories
  'chips': 'Exotic Chips',
  'soda': 'Exotic Drinks',
  'candy': 'Novelties',
  'tobacco': 'Smokes & Vapes',
  'vape': 'Smokes & Vapes',
  'accessory': 'Car Accessories',
  'phone': 'Car Accessories',
  'charger': 'Car Accessories'
};

// Function to determine category for convenience items
function determineCategoryForConvenienceItem(itemName, currentCategory) {
  // Check if we have a specific mapping
  const lowerName = itemName.toLowerCase();
  for (const [keyword, category] of Object.entries(CONVENIENCE_CATEGORY_MAPPING)) {
    if (lowerName.includes(keyword)) {
      return category;
    }
  }
  
  // Default to Grocery for most convenience items
  return 'Grocery';
}

// Function to add modifiers to items based on category
function addModifiers(item, category) {
  if (MODIFIER_GROUPS[category]) {
    return {
      ...item,
      modifierGroups: MODIFIER_GROUPS[category]
    };
  }
  return item;
}

// Function to process and organize menu items
function organizeMenuItems(items) {
  const organizedData = {};
  
  // Initialize all categories
  CATEGORY_ORDER.forEach(category => {
    organizedData[category] = [];
  });
  
  // Process each item
  items.forEach(item => {
    let category = item.category || 'Products';
    const itemName = item.name || '';
    
    // Special handling for convenience items
    if (category === 'Convenience') {
      category = determineCategoryForConvenienceItem(itemName, category);
    }
    
    // Ensure category is in our defined order
    if (!CATEGORY_ORDER.includes(category)) {
      category = 'Products'; // Default to Products if category not recognized
    }
    
    // Add modifiers based on category
    const itemWithModifiers = addModifiers(item, category);
    
    // Add to appropriate category
    organizedData[category].push(itemWithModifiers);
  });
  
  return organizedData;
}

// Function to generate a summary report
function generateSummaryReport(organizedData) {
  console.log('\n=== MENU ORGANIZATION SUMMARY ===\n');
  
  CATEGORY_ORDER.forEach((category, index) => {
    const items = organizedData[category] || [];
    console.log(`${index + 1}. ${category}: ${items.length} items`);
    
    // Show first 3 items as examples
    if (items.length > 0) {
      const sampleItems = items.slice(0, 3);
      sampleItems.forEach(item => {
        console.log(`   - ${item.name} ($${item.price})`);
        if (item.modifierGroups && item.modifierGroups.length > 0) {
          console.log(`     Modifiers: ${item.modifierGroups.join(', ')}`);
        }
      });
      if (items.length > 3) {
        console.log(`   ... and ${items.length - 3} more items`);
      }
    }
    console.log('');
  });
}

// Function to save organized data to JSON file
function saveOrganizedData(organizedData) {
  const outputPath = path.join(__dirname, 'organized_menu_data.json');
  fs.writeFileSync(outputPath, JSON.stringify(organizedData, null, 2));
  console.log(`Organized data saved to: ${outputPath}`);
}

// Main function
function main() {
  console.log('Menu Data Organization Script');
  console.log('=============================');
  
  try {
    // This would be where you'd load your actual Excel data
    // For now, we'll create sample data to demonstrate the structure
    const sampleItems = [
      { name: 'Double Shot Espresso', price: 3.50, category: 'Hot Beverages', description: 'Strong black coffee with double espresso shot' },
      { name: 'Vanilla Latte', price: 4.75, category: 'Hot Beverages', description: 'Espresso with steamed milk and vanilla syrup' },
      { name: 'Iced Tea', price: 2.99, category: 'Cold Beverages', description: 'Refreshing cold tea with lemon' },
      { name: 'Classic Burger', price: 8.99, category: 'Hot Food', description: 'Beef patty with lettuce, tomato, and onion on a sesame bun' },
      { name: 'Nachos', price: 6.50, category: 'Hot Food', description: 'Tortilla chips with cheese and jalapeños' },
      { name: 'Kettle Chips', price: 3.25, category: 'Exotic Chips', description: 'Premium potato chips' },
      { name: 'Imported Soda', price: 2.50, category: 'Exotic Drinks', description: 'Specialty international soda' },
      { name: 'Bananas', price: 0.99, category: 'Grocery', description: 'Fresh bananas' },
      { name: 'Ice Cream Bar', price: 2.25, category: 'Novelties', description: 'Vanilla ice cream bar' },
      { name: 'Phone Charger', price: 12.99, category: 'Car Accessories', description: 'Universal phone charging cable' },
      { name: 'Cigarettes', price: 14.99, category: 'Smokes & Vapes', description: 'Premium brand cigarettes' },
      { name: 'Energy Bar', price: 1.99, category: 'Convenience', description: 'High protein energy bar' },
      { name: 'Soda Pop', price: 1.50, category: 'Convenience', description: 'Carbonated soft drink' }
    ];
    
    console.log(`Processing ${sampleItems.length} sample items...\n`);
    
    // Organize the menu items
    const organizedData = organizeMenuItems(sampleItems);
    
    // Generate summary report
    generateSummaryReport(organizedData);
    
    // Save organized data
    saveOrganizedData(organizedData);
    
    console.log('Processing complete!');
    console.log('\nNext steps:');
    console.log('1. Use the admin panel to import items into the database');
    console.log('2. Verify categories and modifiers display correctly in the frontend');
    console.log('3. Adjust any items that need different categorization');
    
  } catch (error) {
    console.error('Error during processing:', error.message);
    process.exit(1);
  }
}

// Run the script if executed directly
if (require.main === module) {
  main();
}

module.exports = {
  organizeMenuItems,
  generateSummaryReport,
  saveOrganizedData
};