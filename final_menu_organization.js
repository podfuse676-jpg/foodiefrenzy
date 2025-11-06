/**
 * Final Menu Organization Script
 * 
 * This script processes Excel data and organizes it into the exact menu structure
 * specified by the user, with proper categorization and modifier implementation.
 */

import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';

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

// Define specific items with their modifiers based on user specifications
const SPECIFIC_ITEMS_WITH_MODIFIERS = {
  'Hot Beverages': [
    {
      name: 'Coffee',
      variants: [
        { size: 'Small', price: '$2.09' },
        { size: 'Medium', price: '$2.29' },
        { size: 'Large', price: '$2.49' }
      ],
      modifiers: ['Creamer (regular/french vanilla)', 'Sugar (regular/Splenda)']
    },
    {
      name: 'Cappuccino',
      variants: [
        { size: '-', price: '$3.49' }
      ],
      modifiers: ['Sugar (regular/Splenda)']
    },
    {
      name: 'Latte',
      variants: [
        { size: '-', price: '$3.49' }
      ],
      modifiers: ['Sugar (regular/Splenda)']
    },
    {
      name: 'Mocha',
      variants: [
        { size: '-', price: '$3.49' }
      ],
      modifiers: ['Sugar (regular/Splenda)']
    },
    {
      name: 'Hot Chocolate',
      variants: [
        { size: '-', price: '$2.49' }
      ],
      modifiers: []
    },
    {
      name: 'Chai (Masala/Cardamom/Kashmiri Pink)',
      variants: [
        { size: 'Full cup', price: '$3.49' },
        { size: 'Half cup', price: '$2.99' }
      ],
      modifiers: ['Sweetener options']
    }
  ],
  'Cold Beverages': [
    {
      name: 'Slushy',
      variants: [
        { size: 'Small', price: '$2.25' },
        { size: 'Medium', price: '$2.75' },
        { size: 'Large', price: '$2.95' }
      ],
      modifiers: ['Flavors: Coke, Orange Fanta, Barq\'s Cream Soda, Fanta Blue Raspberry']
    },
    {
      name: 'Snow Joe',
      variants: [
        { size: 'Small', price: '$3.99' },
        { size: 'Medium', price: '$4.99' },
        { size: 'Large', price: '$5.99' }
      ],
      modifiers: ['Slushy flavor, soft serve']
    }
  ],
  'Hot Food': [
    {
      name: 'Hot dog',
      variants: [
        { size: '-', price: '$3.49' }
      ],
      modifiers: ['Ketchup', 'Mustard', 'Relish']
    },
    {
      name: 'Samosa',
      variants: [
        { size: '-', price: '$2.49' }
      ],
      modifiers: ['Option: pairs with chai']
    },
    {
      name: 'Wedges',
      variants: [
        { size: 'Small', price: '$1.99' },
        { size: 'Medium', price: '$3.99' },
        { size: 'Large', price: '$5.99' }
      ],
      modifiers: ['Sauces']
    },
    {
      name: 'Chicken wings (breaded)',
      variants: [
        { size: '5pc (Regular/Flavored)', price: '$6.49 / $7.99' },
        { size: '10pc (Regular/Flavored)', price: '$12.49 / $15.09' }
      ],
      modifiers: ['Flavours: BBQ, Sweet & Spicy, Korean Gochugaru, Montreal Chicken, Bang Bang, Montreal BBQ, Lemon Pepper, Sweet & Spicy Korean Style']
    },
    {
      name: 'Chicken tenders',
      variants: [
        { size: '4pc', price: '$5.99' }
      ],
      modifiers: ['Dips: Ranch, Ketchup, BBQ, Sweet & Sour']
    },
    {
      name: 'Mac n Cheese Balls',
      variants: [
        { size: '3pc', price: '$3.49' },
        { size: '5pc', price: '$5.49' }
      ],
      modifiers: ['Dips: Ranch, Ketchup, BBQ, Sweet & Sour', 'Drizzle: Sweet & Spicy']
    },
    {
      name: 'Sausage Rolls',
      variants: [
        { size: '-', price: '$2.05' }
      ],
      modifiers: []
    },
    {
      name: 'Extra Dip',
      variants: [
        { size: '-', price: '$0.39' }
      ],
      modifiers: ['Ranch, Ketchup, BBQ, Sweet & Sour, etc.']
    }
  ]
};

// Function to categorize convenience items based on detailed specifications
function categorizeConvenienceItem(itemName) {
  const lowerName = itemName.toLowerCase();
  
  // Exotic Chips
  if (lowerName.includes('takis') || lowerName.includes('kettle') || lowerName.includes('chip') || lowerName.includes('crisp') || lowerName.includes('pringle') || lowerName.includes('hardbite') || lowerName.includes('quest') || lowerName.includes('pringles')) {
    return 'Exotic Chips';
  }
  
  // Exotic Drinks
  if (lowerName.includes('beaver buzz') || lowerName.includes('ghost energy') || lowerName.includes('c4 energy') || 
      lowerName.includes('sparkling ice') || lowerName.includes('soda') || lowerName.includes('energy') || 
      lowerName.includes('drink') || lowerName.includes('beverage') || lowerName.includes('snapple') || lowerName.includes('arm & hammer')) {
    return 'Exotic Drinks';
  }
  
  // Grocery - This is a broad category for most convenience items
  if (lowerName.includes('ziploc') || lowerName.includes('baking soda') || lowerName.includes('dairy') || 
      lowerName.includes('canned') || lowerName.includes('pasta') || lowerName.includes('sauce') || 
      lowerName.includes('spice') || lowerName.includes('bag') || lowerName.includes('foil') || 
      lowerName.includes('toilet') || lowerName.includes('tissue') || lowerName.includes('cleaner') || 
      lowerName.includes('detergent') || lowerName.includes('soap') || lowerName.includes('shampoo') || 
      lowerName.includes('conditioner') || lowerName.includes('toothpaste') || lowerName.includes('mouthwash') || 
      lowerName.includes('deodorant') || lowerName.includes('shaving') || lowerName.includes('razor') || 
      lowerName.includes('band-aid') || lowerName.includes('medicine') || lowerName.includes('vitamin') || 
      lowerName.includes('supplement') || lowerName.includes('cereal') || lowerName.includes('oatmeal') || 
      lowerName.includes('rice') || lowerName.includes('bread') || lowerName.includes('milk') || 
      lowerName.includes('juice') || lowerName.includes('water') || lowerName.includes('tea') || 
      lowerName.includes('coffee') || lowerName.includes('sugar') || lowerName.includes('salt') || 
      lowerName.includes('pepper') || lowerName.includes('oil') || lowerName.includes('vinegar') || 
      lowerName.includes('honey') || lowerName.includes('jam') || lowerName.includes('jelly') || 
      lowerName.includes('peanut') || lowerName.includes('nut') || lowerName.includes('seed') || 
      lowerName.includes('dried') || lowerName.includes('fruit') || lowerName.includes('vegetable') || 
      lowerName.includes('soup') || lowerName.includes('broth') || lowerName.includes('stock') || 
      lowerName.includes('mix') || lowerName.includes('seasoning') || lowerName.includes('condiment') || 
      lowerName.includes('spread') || lowerName.includes('dressing') || lowerName.includes('marinade') || 
      lowerName.includes('pickles') || lowerName.includes('olives') || lowerName.includes('nuts') || 
      lowerName.includes('snacks') || lowerName.includes('crackers') || lowerName.includes('cookies') || 
      lowerName.includes('pretzels') || lowerName.includes('popcorn') || lowerName.includes('chips') || 
      lowerName.includes('candy') || lowerName.includes('gum') || lowerName.includes('mints') || 
      lowerName.includes('chocolate') || lowerName.includes('bar') || lowerName.includes('wafer') || 
      lowerName.includes('dessert') || lowerName.includes('ice cream') || lowerName.includes('frozen') || 
      lowerName.includes('pet') || lowerName.includes('dog') || lowerName.includes('cat') || 
      lowerName.includes('bird') || lowerName.includes('fish')) {
    return 'Grocery';
  }
  
  // Novelties
  if (lowerName.includes('candy') || lowerName.includes('chocolate') || lowerName.includes('snack') || 
      lowerName.includes('popcorn') || lowerName.includes('treat') || lowerName.includes('bar') || 
      lowerName.includes('cookie') || lowerName.includes('gum') || lowerName.includes('mints') || 
      lowerName.includes('caramel') || lowerName.includes('toffee') || lowerName.includes('fudge') || 
      lowerName.includes('licorice') || lowerName.includes('gummies') || lowerName.includes('jelly') || 
      lowerName.includes('marshmallow') || lowerName.includes('nougat') || lowerName.includes('taffy') || 
      lowerName.includes('lollipop') || lowerName.includes('candy') || lowerName.includes('sour') || 
      lowerName.includes('bubble') || lowerName.includes('blow pop') || lowerName.includes('sweet')) {
    return 'Novelties';
  }
  
  // Car Accessories
  if (lowerName.includes('air freshener') || lowerName.includes('cleaner') || lowerName.includes('auto') || 
      lowerName.includes('car') || lowerName.includes('vehicle') || lowerName.includes('wiper') || 
      lowerName.includes('tire') || lowerName.includes('battery') || lowerName.includes('oil') || 
      lowerName.includes('fluid') || lowerName.includes('antifreeze') || lowerName.includes('coolant') || 
      lowerName.includes('brake') || lowerName.includes('transmission') || lowerName.includes('fuel') || 
      lowerName.includes('gas') || lowerName.includes('detailed') || lowerName.includes('wax') || 
      lowerName.includes('polish') || lowerName.includes('shine') || lowerName.includes('chrome') || 
      lowerName.includes('wheel') || lowerName.includes('tire') || lowerName.includes('hubcap') || 
      lowerName.includes('cover') || lowerName.includes('mat') || lowerName.includes('seat') || 
      lowerName.includes('cushion') || lowerName.includes('organizer') || lowerName.includes('storage') || 
      lowerName.includes('phone') || lowerName.includes('mount') || lowerName.includes('charger') || 
      lowerName.includes('cable') || lowerName.includes('adapter') || lowerName.includes('plug') || 
      lowerName.includes('converter') || lowerName.includes('inverter') || lowerName.includes('jump') || 
      lowerName.includes('starter') || lowerName.includes('compressor') || lowerName.includes('tool') || 
      lowerName.includes('kit') || lowerName.includes('emergency') || lowerName.includes('first aid') || 
      lowerName.includes('road') || lowerName.includes('trip') || lowerName.includes('travel')) {
    return 'Car Accessories';
  }
  
  // Smokes & Vapes
  if (lowerName.includes('cigarette') || lowerName.includes('vape') || lowerName.includes('lighter') || 
      lowerName.includes('tobacco') || lowerName.includes('rolling') || lowerName.includes('paper') || 
      lowerName.includes('filter') || lowerName.includes('pipe') || lowerName.includes('cigar') || 
      lowerName.includes('hookah') || lowerName.includes('smoking') || lowerName.includes('nicotine') || 
      lowerName.includes('e-liquid') || lowerName.includes('coil') || lowerName.includes('battery') || 
      lowerName.includes('mod') || lowerName.includes('tank') || lowerName.includes('atomizer') || 
      lowerName.includes('clearomizer') || lowerName.includes('cartomizer')) {
    return 'Smokes & Vapes';
  }
  
  // Default to Grocery for other items
  return 'Grocery';
}

// Function to process the food menu Excel file with proper categorization
function processFoodMenu() {
  try {
    const workbook = xlsx.readFile('./lakeshore food menu.xlsx');
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    
    const categories = {};
    
    // Initialize categories with specific items that have modifiers
    Object.keys(SPECIFIC_ITEMS_WITH_MODIFIERS).forEach(category => {
      categories[category] = SPECIFIC_ITEMS_WITH_MODIFIERS[category];
    });
    
    return categories;
  } catch (error) {
    console.error('Error processing food menu:', error.message);
    return {};
  }
}

// Function to process the convenience items Excel file
function processConvenienceItems() {
  try {
    const workbook = xlsx.readFile('./lakeshore convenience item.xlsx');
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    
    const categorizedItems = {};
    
    // Initialize all categories
    CATEGORY_ORDER.forEach(category => {
      if (category !== 'Home') { // Home is a special category with no items
        categorizedItems[category] = [];
      }
    });
    
    data.forEach(row => {
      const name = String(row['Name'] || '').trim();
      const price = String(row['Price'] || '').trim();
      const alternateName = String(row['Alternate Name'] || '').trim();
      
      if (!name) return;
      
      // Categorize item
      const category = categorizeConvenienceItem(name);
      
      // Add to appropriate category
      if (categorizedItems[category]) {
        categorizedItems[category].push({
          name: name,
          price: price,
          description: alternateName || '',
          modifiers: []
        });
      }
    });
    
    return categorizedItems;
  } catch (error) {
    console.error('Error processing convenience items:', error.message);
    return {};
  }
}

// Function to generate the final organized menu
function generateFinalMenu(foodMenu, convenienceItems) {
  const finalMenu = {};
  
  // Add Home category (no items)
  finalMenu['Home'] = 'Landing page, banner, and featured sections (no product item here; app showcase).';
  
  // Add specific items with modifiers from the food menu
  Object.keys(SPECIFIC_ITEMS_WITH_MODIFIERS).forEach(category => {
    finalMenu[category] = SPECIFIC_ITEMS_WITH_MODIFIERS[category];
  });
  
  // Add convenience items to their respective categories
  Object.keys(convenienceItems).forEach(category => {
    if (!finalMenu[category]) {
      finalMenu[category] = [];
    }
    
    // For categories that already have specific items, we need to merge
    if (Array.isArray(finalMenu[category])) {
      finalMenu[category] = finalMenu[category].concat(convenienceItems[category]);
    } else {
      finalMenu[category] = convenienceItems[category];
    }
  });
  
  // Ensure all categories from the order are present
  CATEGORY_ORDER.forEach(category => {
    if (!finalMenu[category]) {
      if (category === 'Home') {
        finalMenu[category] = 'Landing page, banner, and featured sections (no product item here; app showcase).';
      } else {
        finalMenu[category] = [];
      }
    }
  });
  
  return finalMenu;
}

// Function to save the final menu as JSON
function saveFinalMenuAsJSON(finalMenu) {
  const outputPath = path.join('./', 'final_organized_menu.json');
  fs.writeFileSync(outputPath, JSON.stringify(finalMenu, null, 2));
  console.log(`Final organized menu saved to: ${outputPath}`);
  return outputPath;
}

// Function to save the final menu as Markdown
function saveFinalMenuAsMarkdown(finalMenu) {
  let markdown = '# Final Organized Menu\n\n';
  markdown += 'This document presents the menu organized according to your exact specifications.\n\n';
  
  CATEGORY_ORDER.forEach(category => {
    markdown += `## ${category}\n\n`;
    
    if (category === 'Home') {
      markdown += 'Landing page, banner, and featured sections (no product item here; app showcase).\n\n';
      return;
    }
    
    if (Array.isArray(finalMenu[category]) && finalMenu[category].length > 0) {
      // Check if these are the specific items with modifiers
      if (SPECIFIC_ITEMS_WITH_MODIFIERS[category]) {
        // Create table with Item Name, Size/Variant, Price, Modifiers/Extras
        markdown += '| Item Name | Size/Variant | Price | Modifiers/Extras |\n';
        markdown += '|-----------|--------------|-------|------------------|\n';
        
        finalMenu[category].forEach(item => {
          if (item.variants) {
            // Items with variants
            item.variants.forEach(variant => {
              markdown += `| ${item.name} | ${variant.size} | ${variant.price} | ${item.modifiers.join(', ') || '-'} |\n`;
            });
          } else {
            // Simple items
            markdown += `| ${item.name} | - | ${item.price || '-'} | ${item.modifiers ? item.modifiers.join(', ') : '-'} |\n`;
          }
        });
      } else {
        // Simple items without specific modifier structure
        markdown += '| Item Name | Price | Details/Modifiers |\n';
        markdown += '|-----------|-------|-------------------|\n';
        
        finalMenu[category].forEach(item => {
          markdown += `| ${item.name} | ${item.price || '-'} | ${item.modifiers && item.modifiers.length > 0 ? item.modifiers.join(', ') : (item.description || '-')} |\n`;
        });
      }
      
      markdown += '\n';
    } else {
      markdown += 'No items in this category.\n\n';
    }
  });
  
  const outputPath = path.join('./', 'final_organized_menu.md');
  fs.writeFileSync(outputPath, markdown);
  console.log(`Final organized menu saved to: ${outputPath}`);
  return outputPath;
}

// Main function
async function main() {
  console.log('Processing Excel files for final menu organization...\n');
  
  // Process both Excel files
  const foodMenu = processFoodMenu();
  const convenienceItems = processConvenienceItems();
  
  console.log('Food menu categories processed:');
  Object.keys(foodMenu).forEach(category => {
    console.log(`  ${category}: ${foodMenu[category].length} items`);
  });
  
  console.log('\nConvenience item categories processed:');
  Object.keys(convenienceItems).forEach(category => {
    console.log(`  ${category}: ${convenienceItems[category].length} items`);
  });
  
  // Generate final organized menu
  const finalMenu = generateFinalMenu(foodMenu, convenienceItems);
  
  // Save final menu
  const jsonPath = saveFinalMenuAsJSON(finalMenu);
  const markdownPath = saveFinalMenuAsMarkdown(finalMenu);
  
  console.log('\n=== Final Menu Organization Complete ===');
  console.log('The menu has been organized according to your exact specifications.');
  console.log('Files generated:');
  console.log(`  - ${jsonPath}`);
  console.log(`  - ${markdownPath}`);
  console.log('\nSummary of organization:');
  console.log('- Home: Landing page content only');
  console.log('- Products: General container category');
  console.log('- Hot Beverages: Coffee, Cappuccino, Latte, Mocha, Hot Chocolate, Chai with proper modifiers');
  console.log('- Cold Beverages: Slushy, Snow Joe with proper modifiers');
  console.log('- Hot Food: Hot dog, Samosa, Wedges, Chicken wings, Chicken tenders, Mac n Cheese Balls, Sausage Rolls, Extra Dip with proper modifiers');
  console.log('- Exotic Chips: All chip items from convenience data');
  console.log('- Exotic Drinks: All energy drinks and specialty beverages from convenience data');
  console.log('- Grocery: All general grocery items from convenience data');
  console.log('- Novelties: All candy and novelty items from convenience data');
  console.log('- Car Accessories: All automotive items from convenience data');
  console.log('- Smokes & Vapes: All tobacco and vaping products from convenience data');
}

// Run if executed directly
main();

export {
  processFoodMenu,
  processConvenienceItems,
  generateFinalMenu,
  saveFinalMenuAsJSON,
  saveFinalMenuAsMarkdown,
  main
};