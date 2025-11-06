# Excel Import Template and Instructions

## Overview
This document provides a template for organizing your product data from Excel sheets and instructions for importing them into the Foodie Frenzy application.

## Excel Template Structure

### Required Columns
Create your Excel sheets with these columns:

| Column Name | Required | Description |
|-------------|----------|-------------|
| name | Yes | Product name |
| description | Yes | Product description |
| category | Yes | Must match one of the 11 categories exactly |
| price | Yes | Product price in decimal format (e.g., 4.99) |
| modifierGroups | No | Comma-separated modifier group names (e.g., "Milk Options,Sugar Level") |

### Optional Columns (for enhanced functionality)
| Column Name | Required | Description |
|-------------|----------|-------------|
| productCode | No | Product barcode or SKU |
| sku | No | Stock keeping unit |
| taxRate | No | Tax rate as decimal (e.g., 0.05 for 5%) |
| gst | No | GST amount |
| cost | No | Cost of goods |
| quantity | No | Available quantity |
| hidden | No | true/false - whether to hide the item |
| flavourOptions | No | Comma-separated flavor options |
| rating | No | Product rating (1-5) |
| imageUrl | No | URL to product image |

## Category List (Use Exact Names)
1. Home
2. Products
3. Hot Beverages
4. Cold Beverages
5. Hot Food
6. Exotic Chips
7. Exotic Drinks
8. Grocery
9. Novelties
10. Car Accessories
11. Smokes & Vapes

## Sample Excel Data

### Sample Row 1:
```
name: Double Shot Espresso
description: Strong black coffee with double espresso shot
category: Hot Beverages
price: 3.50
modifierGroups: Milk Options,Sugar Level,Size Options
```

### Sample Row 2:
```
name: Vanilla Latte
description: Espresso with steamed milk and vanilla syrup
category: Hot Beverages
price: 4.75
modifierGroups: Milk Options,Sugar Level,Size Options
```

### Sample Row 3:
```
name: Nachos
description: Tortilla chips with cheese and jalapeños
category: Hot Food
price: 6.50
modifierGroups: Sauces,Add-ons,Spice Level
```

## Import Process

### Method 1: Manual Import via Admin Panel
1. Access the admin panel at http://localhost:5174
2. Login with admin credentials
3. Navigate to "Add Items"
4. For each product:
   - Enter the name
   - Enter the description
   - Select the category from the dropdown or type it exactly
   - Enter the price
   - Enter modifier groups as comma-separated values
   - Fill in any other optional fields
   - Click "Add Item"

### Method 2: CSV Import (Advanced)
If you want to import multiple items at once:

1. Export your Excel data as CSV format
2. Ensure the CSV has these exact column headers:
   ```
   name,description,category,price,modifierGroups,productCode,sku,taxRate,gst,cost,quantity,hidden,flavourOptions,rating
   ```

3. Use the admin panel's bulk import feature (if available) or create a custom import script.

## Modifier Groups Reference

### For Hot Beverages:
- Milk Options: Whole Milk, Skim Milk, Soy Milk, Almond Milk, Oat Milk
- Sugar Level: No Sugar, Low Sugar, Regular, Extra Sugar
- Size Options: Small, Medium, Large

### For Cold Beverages:
- Flavors: Vanilla, Chocolate, Strawberry, Caramel
- Ice Level: No Ice, Light Ice, Regular Ice, Extra Ice
- Sweetness: No Sugar, Low Sugar, Regular, Extra Sugar
- Size Options: Small, Medium, Large

### For Hot Food:
- Sauces: Ketchup, Mayo, Mustard, BBQ Sauce, Hot Sauce
- Add-ons: Extra Cheese, Bacon, Avocado, Lettuce
- Spice Level: Mild, Medium, Hot, Extra Hot
- Cooking Instructions: Well Done, Medium, Rare

### For Other Categories (as applicable):
- Size/Weight: Small, Medium, Large, 1lb, 2lb
- Flavor: Various flavors specific to product type
- Color: Black, White, Red, Blue, etc.
- Compatibility: iPhone, Android, Universal

## Data Validation Checklist

Before importing, verify your data:

□ All category names match the 11 required categories exactly
□ Prices are in decimal format (e.g., 4.99, not $4.99 or 4,99)
□ Modifier groups are comma-separated with no spaces after commas
□ Descriptions are clear and informative
□ Required fields (name, description, category, price) are filled for all items
□ No duplicate product names in the same category (would cause database errors)

## Troubleshooting Common Issues

### Issue: "Item name already exists" Error
- Cause: Trying to add an item with the same name in the same category
- Solution: Either update the existing item or change the product name

### Issue: Category Not Showing in Frontend
- Cause: No items assigned to that category or category name misspelled
- Solution: Verify category names match exactly and at least one item exists in the category

### Issue: Modifiers Not Displaying
- Cause: Modifier group names misspelled or not comma-separated correctly
- Solution: Check spelling and formatting of modifier groups

### Issue: Price Display Issues
- Cause: Price not in decimal format
- Solution: Ensure all prices are numbers like 4.99, 10.50, etc.

## Example Complete Dataset

| name | description | category | price | modifierGroups |
|------|-------------|----------|-------|----------------|
| Double Shot Espresso | Strong black coffee with double espresso shot | Hot Beverages | 3.50 | Milk Options,Sugar Level,Size Options |
| Vanilla Latte | Espresso with steamed milk and vanilla syrup | Hot Beverages | 4.75 | Milk Options,Sugar Level,Size Options |
| Iced Tea | Refreshing cold tea with lemon | Cold Beverages | 2.99 | Flavors,Ice Level,Sweetness |
| Nachos | Tortilla chips with cheese and jalapeños | Hot Food | 6.50 | Sauces,Add-ons,Spice Level |
| Kettle Chips | Premium potato chips | Exotic Chips | 3.25 | Flavor,Size |
| Imported Soda | Specialty international soda | Exotic Drinks | 2.50 | Size |
| Bananas | Fresh bananas | Grocery | 0.99 | Size/Ripeness |
| Ice Cream Bar | Vanilla ice cream bar | Novelties | 2.25 | Flavors |
| Phone Charger | Universal phone charging cable | Car Accessories | 12.99 | Compatibility,Color |
| Cigarettes | Premium brand cigarettes | Smokes & Vapes | 14.99 | Strength,Pack Size |

This template and guide should help you properly organize and import your product data from Excel sheets into the Foodie Frenzy application with the correct categorization and modifier implementation.