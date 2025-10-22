import mongoose from 'mongoose';
import { exec } from 'child_process';
import { promisify } from 'util';
import Item from './modals/item.js';

const execAsync = promisify(exec);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/foodiefrenzy')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Function to process Excel files using Python
const processExcelFiles = async () => {
  try {
    console.log('Processing Excel files...');
    
    // Python script to read and convert Excel to JSON
    const pythonScript = `
import pandas as pd
import json
import sys
import os

# Change to parent directory where Excel files are located
os.chdir('..')

# Read convenience items
try:
    df_conv = pd.read_excel('lakeshore convenience item.xlsx')
    
    # Clean and process convenience items
    convenience_items = []
    for idx, row in df_conv.iterrows():
        if pd.notna(row.get('Name')):
            item = {
                'name': str(row.get('Name', '')).strip(),
                'price': float(row.get('Price', 0)) if pd.notna(row.get('Price')) else 0,
                'cost': float(row.get('Cost', 0)) if pd.notna(row.get('Cost')) else 0,
                'category': 'Convenience',
                'description': str(row.get('Alternate Name', row.get('Name', ''))).strip(),
                'productCode': str(row.get('Product Code', '')) if pd.notna(row.get('Product Code')) else '',
                'sku': str(row.get('SKU', '')) if pd.notna(row.get('SKU')) else '',
                'taxRate': 0.13,
                'rating': 4.0
            }
            convenience_items.append(item)
    
    print(f"Processed {len(convenience_items)} convenience items", file=sys.stderr)
    
except Exception as e:
    print(f"Error processing convenience items: {e}", file=sys.stderr)
    convenience_items = []

# Read food menu items
try:
    df_food = pd.read_excel('lakeshore food menu.xlsx')
    
    # Clean and process food items
    food_items = []
    current_category = 'Food'
    
    for idx, row in df_food.iterrows():
        item_name = row.get('ITEM', '')
        price_raw = row.get('PRICE', 0)
        
        if pd.notna(item_name):
            item_name = str(item_name).strip()
            
            # Skip header rows and empty rows
            if item_name in ['ITEM', 'Food:', 'Beverages:', 'NaN', ''] or item_name.startswith('Unnamed'):
                continue
            
            # Check if this is a category header (ends with ':')
            if item_name.endswith(':'):
                current_category = item_name.replace(':', '').strip()
                continue
            
            # Parse price - handle cases like '6.49 (Regular)' or ' 12.49 (Regular)'
            price = 0
            try:
                if pd.notna(price_raw):
                    price_str = str(price_raw).strip()
                    # Extract just the numeric part before any parentheses or spaces
                    import re
                    # Match any leading spaces, then the number
                    price_match = re.search(r'([0-9.]+)', price_str)
                    if price_match:
                        price = float(price_match.group(1))
                    else:
                        price = float(price_str)
            except (ValueError, AttributeError):
                pass
            
            # Skip rows without a valid price
            if price == 0:
                continue
            
            # Get description and flavour options
            description = str(row.get('Description', item_name)).strip() if pd.notna(row.get('Description')) else item_name
            flavour_options = str(row.get('Flavour Options', '')).strip() if pd.notna(row.get('Flavour Options')) else ''
            
            # Parse flavour options into list
            flavour_list = []
            if flavour_options:
                flavour_list = [f.strip() for f in flavour_options.split(',')]
            
            # Get GST status
            has_gst = str(row.get('GST (5%)', 'No')).strip().lower() == 'yes'
            
            item = {
                'name': item_name,
                'price': float(price),
                'category': current_category,
                'description': description,
                'flavourOptions': flavour_list,
                'taxRate': 0.05 if has_gst else 0,
                'gst': 0.05 if has_gst else 0,
                'rating': 4.5
            }
            food_items.append(item)
    
    print(f"Processed {len(food_items)} food items", file=sys.stderr)
    
except Exception as e:
    print(f"Error processing food items: {e}", file=sys.stderr)
    food_items = []

# Combine all items
all_items = convenience_items + food_items

# Output as JSON
print(json.dumps(all_items, indent=2))
`;

    // Write Python script to a temporary file
    const fs = await import('fs');
    fs.writeFileSync('temp_process_excel.py', pythonScript);
    
    // Execute Python script using the virtual environment
    const { stdout, stderr } = await execAsync('cd .. && source venv/bin/activate && cd backend && python3 temp_process_excel.py')
    
    if (stderr) {
      console.log('Python script logs:', stderr);
    }
    
    // Parse the JSON output
    const items = JSON.parse(stdout);
    
    console.log(`Total items to import: ${items.length}`);
    
    // Clean up temp file
    fs.unlinkSync('temp_process_excel.py');
    
    return items;
    
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
        // Try to find existing item by name AND category (compound unique key)
        const existingItem = await Item.findOne({ 
          name: itemData.name,
          category: itemData.category 
        });
        
        if (existingItem) {
          // Update existing item
          await Item.findOneAndUpdate(
            { name: itemData.name, category: itemData.category },
            itemData,
            { new: true }
          );
          updatedCount++;
          console.log(`Updated: ${itemData.name} (${itemData.category})`);
        } else {
          // Create new item
          await Item.create(itemData);
          addedCount++;
          console.log(`Added: ${itemData.name} (${itemData.category})`);
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
