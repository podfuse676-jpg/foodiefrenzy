/**
 * Detailed Menu Organization Script
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

// Define specific modifier groups for each category based on user specifications
const DETAILED_MODIFIER_GROUPS = {
  'Hot Beverages': {
    'Coffee': ['Creamer (regular/french vanilla)', 'Sugar (regular/Splenda)'],
    'Cappuccino': ['Sugar (regular/Splenda)'],
    'Latte': ['Sugar (regular/Splenda)'],
    'Mocha': ['Sugar (regular/Splenda)'],
    'Hot Chocolate': [],
    'Chai': ['Sweetener options']
  },
  'Cold Beverages': {
    'Slushy': ['Flavors: Coke, Orange Fanta, Barq\'s Cream Soda, Fanta Blue Raspberry'],
    'Snow Joe': ['Slushy flavor, soft serve']
  },
  'Hot Food': {
    'Hot dog': ['Ketchup', 'Mustard', 'Relish'],
    'Samosa': ['Option: pairs with chai'],
    'Wedges': ['Sauces'],
    'Chicken wings': ['Flavours: BBQ, Sweet & Spicy, Korean Gochugaru, Montreal Chicken, Bang Bang, Montreal BBQ, Lemon Pepper, Sweet & Spicy Korean Style'],
    'Chicken tenders': ['Dips: Ranch, Ketchup, BBQ, Sweet & Sour'],
    'Mac n Cheese Balls': ['Dips: Ranch, Ketchup, BBQ, Sweet & Sour', 'Drizzle: Sweet & Spicy'],
    'Sausage Rolls': [],
    'Extra Dip': ['Ranch, Ketchup, BBQ, Sweet & Sour, etc.']
  }
};

// Function to categorize convenience items based on detailed specifications
function categorizeConvenienceItem(itemName) {
  const lowerName = itemName.toLowerCase();
  
  // Exotic Chips
  if (lowerName.includes('takis') || lowerName.includes('kettle') || lowerName.includes('chip') || lowerName.includes('crisp') || lowerName.includes('pringle')) {
    return 'Exotic Chips';
  }
  
  // Exotic Drinks
  if (lowerName.includes('beaver buzz') || lowerName.includes('ghost energy') || lowerName.includes('c4 energy') || 
      lowerName.includes('sparkling ice') || lowerName.includes('soda') || lowerName.includes('energy') || 
      lowerName.includes('drink') || lowerName.includes('beverage')) {
    return 'Exotic Drinks';
  }
  
  // Grocery
  if (lowerName.includes('ziploc') || lowerName.includes('baking soda') || lowerName.includes('dairy') || 
      lowerName.includes('canned') || lowerName.includes('pasta') || lowerName.includes('sauce') || 
      lowerName.includes('spice') || lowerName.includes('bag')) {
    return 'Grocery';
  }
  
  // Novelties
  if (lowerName.includes('candy') || lowerName.includes('chocolate') || lowerName.includes('snack') || 
      lowerName.includes('popcorn') || lowerName.includes('treat') || lowerName.includes('bar') || 
      lowerName.includes('cookie')) {
    return 'Novelties';
  }
  
  // Car Accessories
  if (lowerName.includes('air freshener') || lowerName.includes('cleaner') || lowerName.includes('auto')) {
    return 'Car Accessories';
  }
  
  // Smokes & Vapes
  if (lowerName.includes('cigarette') || lowerName.includes('vape') || lowerName.includes('lighter') || 
      lowerName.includes('tobacco')) {
    return 'Smokes & Vapes';
  }
  
  // Default to Grocery for other items
  return 'Grocery';
}

// Function to process the food menu Excel file
function processFoodMenu() {
  try {
    const workbook = xlsx.readFile('./lakeshore food menu.xlsx');
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    
    const categories = {};
    let currentCategory = '';
    
    data.forEach(row => {
      const itemName = String(row['ITEM'] || '').trim();
      
      if (!itemName) return;
      
      // Skip header rows
      if (itemName === 'ITEM' || itemName === 'NaN' || itemName.startsWith('Unnamed')) {
        return;
      }
      
      // Check if this is a category header (ends with ':')
      if (itemName.endsWith(':')) {
        currentCategory = itemName.replace(':', '').trim();
        // Initialize category in our structure
        if (!categories[currentCategory]) {
          categories[currentCategory] = [];
        }
        return;
      }
      
      // Parse price
      const priceRaw = row['PRICE'];
      let price = '';
      if (priceRaw) {
        price = String(priceRaw).trim();
      }
      
      // Get description and flavour options
      const description = String(row['Description'] || '').trim();
      const flavourOptions = String(row['Flavour Options'] || '').trim();
      const gst = String(row['GST (5%)'] || '').trim();
      
      // Add item to category
      if (currentCategory && categories[currentCategory]) {
        categories[currentCategory].push({
          name: itemName,
          price: price,
          description: description,
          flavourOptions: flavourOptions,
          gst: gst
        });
      }
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
      const productCode = String(row['Product Code'] || '').trim();
      const sku = String(row['SKU'] || '').trim();
      const cost = String(row['Cost'] || '').trim();
      
      if (!name) return;
      
      // Categorize item
      const category = categorizeConvenienceItem(name);
      
      // Add to appropriate category
      if (categorizedItems[category]) {
        categorizedItems[category].push({
          name: name,
          price: price,
          alternateName: alternateName,
          productCode: productCode,
          sku: sku,
          cost: cost
        });
      }
    });
    
    return categorizedItems;
  } catch (error) {
    console.error('Error processing convenience items:', error.message);
    return {};
  }
}

// Function to generate detailed menu report
function generateDetailedMenuReport(foodMenu, convenienceItems) {
  const report = {};
  
  // Process food menu items
  Object.keys(foodMenu).forEach(category => {
    if (!report[category]) {
      report[category] = [];
    }
    
    foodMenu[category].forEach(item => {
      report[category].push({
        name: item.name,
        price: item.price,
        description: item.description,
        modifiers: DETAILED_MODIFIER_GROUPS[category] ? 
                  (DETAILED_MODIFIER_GROUPS[category][item.name] || 
                   DETAILED_MODIFIER_GROUPS[category][Object.keys(DETAILED_MODIFIER_GROUPS[category]).find(key => item.name.includes(key))] || 
                   []) : 
                  []
      });
    });
  });
  
  // Process convenience items
  Object.keys(convenienceItems).forEach(category => {
    if (!report[category]) {
      report[category] = [];
    }
    
    convenienceItems[category].forEach(item => {
      // For convenience items, we don't have detailed modifiers in the specification
      // so we'll add them as simple items
      report[category].push({
        name: item.name,
        price: item.price,
        description: item.alternateName || '',
        modifiers: []
      });
    });
  });
  
  return report;
}

// Function to save report as JSON
function saveReport(report) {
  const outputPath = path.join('./', 'detailed_menu_organization.json');
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
  console.log(`Detailed menu report saved to: ${outputPath}`);
  return outputPath;
}

// Function to save report as Markdown
function saveReportAsMarkdown(report) {
  let markdown = '# Detailed Menu Organization\n\n';
  
  CATEGORY_ORDER.forEach(category => {
    if (category === 'Home') {
      markdown += '## Home\n\n';
      markdown += 'Landing page, banner, and featured sections (no product item here; app showcase).\n\n';
      return;
    }
    
    markdown += `## ${category}\n\n`;
    
    if (report[category] && report[category].length > 0) {
      // Create table header
      markdown += '| Item Name | Price | Modifiers/Extras |\n';
      markdown += '|-----------|-------|------------------|\n';
      
      report[category].forEach(item => {
        const modifiers = item.modifiers && item.modifiers.length > 0 ? 
                         item.modifiers.join(', ') : 
                         (item.flavourOptions ? item.flavourOptions : '-');
        markdown += `| ${item.name} | ${item.price || '-'} | ${modifiers} |\n`;
      });
      
      markdown += '\n';
    } else {
      markdown += 'No items in this category.\n\n';
    }
  });
  
  const outputPath = path.join('./', 'detailed_menu_organization.md');
  fs.writeFileSync(outputPath, markdown);
  console.log(`Detailed menu report saved to: ${outputPath}`);
  return outputPath;
}

// Main function
async function main() {
  console.log('Processing Excel files for detailed menu organization...\n');
  
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
  
  // Generate detailed report
  const detailedReport = generateDetailedMenuReport(foodMenu, convenienceItems);
  
  // Save reports
  const jsonPath = saveReport(detailedReport);
  const markdownPath = saveReportAsMarkdown(detailedReport);
  
  console.log('\n=== Processing Complete ===');
  console.log('The menu has been organized according to your specifications.');
  console.log('Files generated:');
  console.log(`  - ${jsonPath}`);
  console.log(`  - ${markdownPath}`);
  console.log('\nNext steps:');
  console.log('1. Review the detailed_menu_organization.md file to verify the organization');
  console.log('2. Use the detailed_menu_organization.json file to import data into the application');
  console.log('3. Adjust any items that need different categorization or modifiers');
}

// Run if executed directly
main();

export {
  processFoodMenu,
  processConvenienceItems,
  generateDetailedMenuReport,
  saveReport,
  saveReportAsMarkdown,
  main
};