/**
 * Excel Import Helper Script
 * 
 * This script provides a framework for importing data from Excel files
 * into the Foodie Frenzy application.
 * 
 * To use this script:
 * 1. Convert your Excel files to CSV format
 * 2. Place the CSV files in the same directory as this script
 * 3. Update the file names in the script
 * 4. Run the script with Node.js
 */

// Import required modules
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  // Update these file paths to match your CSV files
  csvFiles: [
    'lakeshore_convenience_items.csv',
    'lakeshore_food_menu.csv'
  ],
  
  // Output file for processed data
  outputFile: 'processed_menu_data.json',
  
  // Category mapping (from Excel categories to Foodie Frenzy categories)
  categoryMapping: {
    // Add your category mappings here
    // 'Excel Category Name': 'Foodie Frenzy Category Name'
    'Hot Beverages': 'Hot Beverages',
    'Cold Beverages': 'Cold Beverages',
    'Hot Food': 'Hot Food',
    'Chips': 'Exotic Chips',
    'Drinks': 'Exotic Drinks',
    'Grocery': 'Grocery',
    'Candy': 'Novelties',
    'Accessories': 'Car Accessories',
    'Tobacco': 'Smokes & Vapes',
    'Vapes': 'Smokes & Vapes'
  },
  
  // Default modifier groups by category
  defaultModifiers: {
    'Hot Beverages': ['Milk Options', 'Sugar Level', 'Size Options'],
    'Cold Beverages': ['Flavors', 'Ice Level', 'Sweetness', 'Size Options'],
    'Hot Food': ['Sauces', 'Add-ons', 'Spice Level', 'Cooking Instructions'],
    'Exotic Chips': ['Flavor', 'Size'],
    'Exotic Drinks': ['Temperature', 'Additions', 'Size Options'],
    'Grocery': ['Size/Weight', 'Ripeness'],
    'Novelties': ['Flavor', 'Size'],
    'Car Accessories': ['Compatibility', 'Color'],
    'Smokes & Vapes': ['Strength/Flavor', 'Size/Pack']
  }
};

/**
 * Parse CSV data into JSON format
 * @param {string} csvData - Raw CSV data
 * @returns {Array} - Array of objects representing CSV rows
 */
function parseCSV(csvData) {
  const lines = csvData.trim().split('\n');
  const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(value => value.trim().replace(/"/g, ''));
    const row = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    rows.push(row);
  }
  
  return rows;
}

/**
 * Process menu items and organize by category
 * @param {Array} items - Array of menu items
 * @returns {Object} - Organized menu data
 */
function processMenuItems(items) {
  const menuData = {
    categories: {},
    items: []
  };
  
  items.forEach(item => {
    // Map category from Excel to Foodie Frenzy categories
    const categoryName = CONFIG.categoryMapping[item.category] || item.category || 'Products';
    
    // Ensure category exists
    if (!menuData.categories[categoryName]) {
      menuData.categories[categoryName] = {
        name: categoryName,
        items: []
      };
    }
    
    // Process modifier groups
    let modifierGroups = [];
    if (item.modifierGroups) {
      modifierGroups = item.modifierGroups.split(',').map(group => group.trim());
    } else if (CONFIG.defaultModifiers[categoryName]) {
      modifierGroups = CONFIG.defaultModifiers[categoryName];
    }
    
    // Process flavor options
    let flavourOptions = [];
    if (item.flavourOptions) {
      flavourOptions = item.flavourOptions.split(',').map(option => option.trim());
    }
    
    // Create processed item
    const processedItem = {
      name: item.name || 'Unnamed Item',
      description: item.description || '',
      category: categoryName,
      price: parseFloat(item.price) || 0,
      modifierGroups: modifierGroups,
      flavourOptions: flavourOptions,
      productCode: item.productCode || '',
      sku: item.sku || '',
      taxRate: parseFloat(item.taxRate) || 0,
      gst: parseFloat(item.gst) || 0,
      cost: parseFloat(item.cost) || 0,
      quantity: parseInt(item.quantity) || 0,
      hidden: item.hidden === 'true' || false,
      rating: parseFloat(item.rating) || 4
    };
    
    // Add to category
    menuData.categories[categoryName].items.push(processedItem);
    
    // Add to flat items list
    menuData.items.push(processedItem);
  });
  
  return menuData;
}

/**
 * Main import function
 */
async function importExcelData() {
  try {
    console.log('Starting Excel data import process...');
    
    // Array to hold all items from all CSV files
    let allItems = [];
    
    // Process each CSV file
    for (const fileName of CONFIG.csvFiles) {
      const filePath = path.join(__dirname, fileName);
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        continue;
      }
      
      console.log(`Processing file: ${fileName}`);
      
      // Read CSV file
      const csvData = fs.readFileSync(filePath, 'utf8');
      
      // Parse CSV data
      const items = parseCSV(csvData);
      console.log(`Found ${items.length} items in ${fileName}`);
      
      // Add items to all items array
      allItems = allItems.concat(items);
    }
    
    console.log(`Total items from all files: ${allItems.length}`);
    
    // Process menu items
    const menuData = processMenuItems(allItems);
    
    // Save processed data to file
    const outputPath = path.join(__dirname, CONFIG.outputFile);
    fs.writeFileSync(outputPath, JSON.stringify(menuData, null, 2));
    
    console.log(`Processed data saved to: ${outputPath}`);
    
    // Display category summary
    console.log('\nCategory Summary:');
    Object.keys(menuData.categories).forEach(categoryName => {
      const category = menuData.categories[categoryName];
      console.log(`- ${categoryName}: ${category.items.length} items`);
    });
    
    console.log('\nImport process completed successfully!');
    
    // Instructions for next steps
    console.log('\nNext steps:');
    console.log('1. Review the processed data in the output file');
    console.log('2. Use the admin panel to import items into the database');
    console.log('3. Verify categories and modifiers display correctly in the frontend');
    
  } catch (error) {
    console.error('Error during import process:', error.message);
    process.exit(1);
  }
}

// Run the import process if this script is executed directly
if (require.main === module) {
  importExcelData();
}

// Export functions for use in other modules
module.exports = {
  parseCSV,
  processMenuItems,
  importExcelData
};