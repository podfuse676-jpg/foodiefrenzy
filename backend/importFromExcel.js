import mongoose from 'mongoose';
import { exec } from 'child_process';
import { promisify } from 'util';
import Item from './modals/item.js';
import xlsx from 'xlsx';

const execAsync = promisify(exec);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/foodiefrenzy')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

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

// Function to determine category for convenience items
function determineCategoryForConvenienceItem(itemName) {
  // Map specific keywords to appropriate categories
  const lowerName = itemName.toLowerCase();
  
  if (lowerName.includes('chip') || lowerName.includes('crisp') || lowerName.includes('pretzel')) {
    return 'Exotic Chips';
  } else if (lowerName.includes('soda') || lowerName.includes('pop') || lowerName.includes('soft drink') || lowerName.includes('beverage')) {
    return 'Exotic Drinks';
  } else if (lowerName.includes('candy') || lowerName.includes('chocolate') || lowerName.includes('snack') || lowerName.includes('cookie') || lowerName.includes('bar')) {
    return 'Novelties';
  } else if (lowerName.includes('tobacco') || lowerName.includes('cigarette')) {
    return 'Smokes & Vapes';
  } else if (lowerName.includes('vape') || lowerName.includes('e-cigarette')) {
    return 'Smokes & Vapes';
  } else if (lowerName.includes('accessory') || lowerName.includes('phone') || lowerName.includes('charger') || lowerName.includes('cable')) {
    return 'Car Accessories';
  }
  
  // Default to Grocery for most convenience items
  return 'Grocery';
}

// Function to process Excel files directly with xlsx library
const processExcelFiles = async () => {
  try {
    console.log('Processing Excel files...');
    
    let allItems = [];
    
    // Process convenience items Excel file
    try {
      const workbook1 = xlsx.readFile('../lakeshore convenience item.xlsx');
      const sheetName1 = workbook1.SheetNames[0];
      const worksheet1 = workbook1.Sheets[sheetName1];
      const convenienceData = xlsx.utils.sheet_to_json(worksheet1);
      
      const convenienceItems = convenienceData.map(row => {
        // Clean up the data
        const name = String(row['Name'] || '').trim();
        const price = parseFloat(row['Price']) || 0;
        const cost = parseFloat(row['Cost']) || 0;
        const description = String(row['Alternate Name'] || row['Name'] || '').trim();
        const productCode = String(row['Product Code'] || '').trim();
        const sku = String(row['SKU'] || '').trim();
        
        if (!name) return null;
        
        // Determine proper category for convenience items
        const category = determineCategoryForConvenienceItem(name);
        
        return {
          name,
          price,
          cost,
          category,
          description,
          productCode,
          sku,
          taxRate: 0.13,
          rating: 4.0
        };
      }).filter(item => item !== null);
      
      console.log(`Processed ${convenienceItems.length} convenience items`);
      allItems = allItems.concat(convenienceItems);
    } catch (error) {
      console.log('Error processing convenience items:', error.message);
    }
    
    // Process food menu Excel file
    try {
      const workbook2 = xlsx.readFile('../lakeshore food menu.xlsx');
      const sheetName2 = workbook2.SheetNames[0];
      const worksheet2 = workbook2.Sheets[sheetName2];
      const foodData = xlsx.utils.sheet_to_json(worksheet2);
      
      let currentCategory = 'Food';
      const foodItems = [];
      
      foodData.forEach(row => {
        const itemName = String(row['ITEM'] || '').trim();
        const priceRaw = row['PRICE'];
        
        if (!itemName) return;
        
        // Skip header rows and empty rows
        if (itemName === 'ITEM' || itemName === 'NaN' || itemName.startsWith('Unnamed')) {
          return;
        }
        
        // Check if this is a category header (ends with ':')
        if (itemName.endsWith(':')) {
          currentCategory = itemName.replace(':', '').trim();
          return;
        }
        
        // Parse price
        let price = 0;
        if (priceRaw) {
          const priceStr = String(priceRaw).trim();
          // Extract just the numeric part
          const priceMatch = priceStr.match(/([0-9.]+)/);
          if (priceMatch) {
            price = parseFloat(priceMatch[1]) || 0;
          } else {
            price = parseFloat(priceStr) || 0;
          }
        }
        
        // Skip rows without a valid price
        if (price === 0) {
          return;
        }
        
        // Get description and flavour options
        const description = String(row['Description'] || itemName).trim();
        const flavourOptionsRaw = String(row['Flavour Options'] || '').trim();
        
        // Parse flavour options into list
        let flavourOptions = [];
        if (flavourOptionsRaw) {
          flavourOptions = flavourOptionsRaw.split(',').map(f => f.trim()).filter(f => f);
        }
        
        // Get GST status
        const gstRaw = String(row['GST (5%)'] || 'No').trim().toLowerCase();
        const hasGst = gstRaw === 'yes';
        
        foodItems.push({
          name: itemName,
          price: price,
          category: currentCategory,
          description: description,
          flavourOptions: flavourOptions,
          taxRate: hasGst ? 0.05 : 0,
          gst: hasGst ? 0.05 : 0,
          rating: 4.5
        });
      });
      
      console.log(`Processed ${foodItems.length} food items`);
      allItems = allItems.concat(foodItems);
    } catch (error) {
      console.log('Error processing food items:', error.message);
    }
    
    console.log(`Total items to import: ${allItems.length}`);
    return allItems;
    
  } catch (error) {
    console.error('Error processing Excel files:', error);
    throw error;
  }
};

// Function to import items to MongoDB
const importItems = async () => {
  try {
    // Process Excel files
    const items = await processExcelFiles();
    
    if (items.length === 0) {
      console.log('No items to import');
      process.exit(0);
    }
    
    console.log(`Importing ${items.length} items to MongoDB...`);
    
    // Import items one by one, handling duplicates
    let addedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;
    
    for (const itemData of items) {
      try {
        // Ensure category is in our defined order, default to Products if not
        let category = itemData.category;
        if (!CATEGORY_ORDER.includes(category)) {
          category = 'Products';
        }
        
        // Add modifier groups based on category
        const itemWithModifiers = {
          ...itemData,
          category: category
        };
        
        if (MODIFIER_GROUPS[category]) {
          itemWithModifiers.modifierGroups = MODIFIER_GROUPS[category];
        }
        
        // Try to find existing item by name AND category (compound unique key)
        const existingItem = await Item.findOne({ 
          name: itemWithModifiers.name,
          category: itemWithModifiers.category 
        });
        
        if (existingItem) {
          // Update existing item
          await Item.findOneAndUpdate(
            { name: itemWithModifiers.name, category: itemWithModifiers.category },
            itemWithModifiers,
            { new: true }
          );
          updatedCount++;
          console.log(`Updated: ${itemWithModifiers.name} (${itemWithModifiers.category})`);
        } else {
          // Create new item
          await Item.create(itemWithModifiers);
          addedCount++;
          console.log(`Added: ${itemWithModifiers.name} (${itemWithModifiers.category})`);
        }
      } catch (error) {
        errorCount++;
        console.error(`Error processing ${itemData.name} in ${itemData.category}:`, error.message);
      }
    }
    
    console.log('\n=== Import Summary ===');
    console.log(`Total items processed: ${items.length}`);
    console.log(`Items added: ${addedCount}`);
    console.log(`Items updated: ${updatedCount}`);
    console.log(`Errors: ${errorCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error importing items:', error);
    process.exit(1);
  }
};

// Run the import
importItems();