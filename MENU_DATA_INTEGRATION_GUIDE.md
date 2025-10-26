# Menu Data Integration Guide

## Overview
This guide explains how to use the organized menu data files that have been created according to your exact specifications. The data is available in three formats:
1. JSON format (`organized_menu_data.json`)
2. CSV format (`organized_menu_data.csv`)
3. JavaScript format (`menu_data.js`)

## File Descriptions

### 1. organized_menu_data.json
A structured JSON file containing all menu items organized by category with complete details including sizes, prices, GST, and customizations.

### 2. organized_menu_data.csv
A flat CSV file with all menu items in a tabular format, suitable for importing into Excel or other spreadsheet applications.

### 3. menu_data.js
A JavaScript module that can be directly imported into web applications, containing the same structured data as the JSON file.

## Data Structure

### JSON/JavaScript Format
The data is organized in the following structure:
```javascript
{
  "Category Name": [
    {
      "name": "Item Name",
      "sizes": [
        {
          "size": "Size Description",
          "price": 0.00
        }
      ],
      "gst": 5, // or 13 for Smokes & Vapes
      "customizations": ["Option 1", "Option 2"], // Optional
      "flavours": ["Flavour 1", "Flavour 2"] // Optional
    }
  ]
}
```

### CSV Format
The CSV contains the following columns:
- Category
- Item Name
- Size/Variant
- Price
- GST
- Customization/Flavour

## Integration Instructions

### For Web Applications (JavaScript)
1. Copy `menu_data.js` to your project
2. Import the data in your application:
   ```javascript
   import menuData from './menu_data.js';
   // or
   const menuData = require('./menu_data.js');
   ```
3. Access categories and items:
   ```javascript
   const hotBeverages = menuData["Hot Beverages"];
   const firstItem = hotBeverages[0];
   console.log(firstItem.name); // "Coffee"
   ```

### For Database Import
1. Use `organized_menu_data.csv` with your preferred database import tool
2. Each row represents a unique item-size combination
3. Customizations/Flavours are pipe-separated in a single column

### For Spreadsheet Applications
1. Open `organized_menu_data.csv` in Excel, Google Sheets, or similar
2. Data will be automatically organized in columns
3. Customizations/Flavours are pipe-separated in a single column

## Category Order
The data is organized in the exact order you specified:
1. Hot Beverages
2. Cold Beverages
3. Hot Food
4. Exotic Chips
5. Exotic Drinks
6. Grocery
7. Novelties
8. Car Accessories
9. Smokes & Vapes

## Data Fields

### Required Fields
- **Category**: The menu category
- **Item Name**: The name of the item
- **Size/Variant**: Size or variant description
- **Price**: Price in CAD
- **GST**: Tax rate (5% for most items, 13% for Smokes & Vapes)

### Optional Fields
- **Customization/Flavour**: Available customizations or flavours (pipe-separated when multiple)

## Special Notes

### Size/Variant Handling
- Some items have multiple sizes (e.g., Coffee: Small, Medium, Large)
- Some items have variants (e.g., Fanta: Orange Can, Orange Bottle)
- Some items have a single "Regular" size

### Customization/Flavour Handling
- Customizations are specific to individual items (e.g., Hot Dog: Ketchup, Mustard, Relish)
- Flavours are available for items like energy drinks
- Multiple options are pipe-separated in the CSV format

### Tax Rates
- Most items: 5% GST
- Smokes & Vapes category: 13% GST

## Example Usage

### JavaScript
```javascript
// Get all hot beverages
const hotBeverages = menuData["Hot Beverages"];

// Find coffee items
const coffeeItems = hotBeverages.filter(item => item.name === "Coffee");

// Get the large coffee price
const largeCoffee = coffeeItems[0].sizes.find(size => size.size === "Large");
console.log(`Large Coffee: $${largeCoffee.price}`);

// Get coffee customizations
const customizations = coffeeItems[0].customizations;
console.log("Customizations:", customizations.join(", "));
```

### CSV Processing
When reading the CSV in any language:
1. Parse each row as a record
2. Split the Customization/Flavour column by "|" to get individual options
3. Group items by Category and Item Name for size variants

## Validation
All data has been validated to ensure:
- ✅ Complete category coverage with no empty categories
- ✅ Accurate pricing and size information
- ✅ Correct GST rates (5% or 13%)
- ✅ Proper organization of customizations and flavours
- ✅ Consistent naming conventions
- ✅ No missing items from any category

## Files Location
All files are located in:
`c:\Users\YASHASVI\Downloads\FOODIEFRENZY\FOODIEFRENZY\`

Files included:
1. `organized_menu_data.json` - Structured JSON data
2. `organized_menu_data.csv` - Flat CSV data
3. `menu_data.js` - JavaScript module