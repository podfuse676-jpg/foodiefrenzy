# Processing Your Excel Data for Foodie Frenzy

## Overview
This guide will help you process your Excel sheets (`lakeshore convenience item.xlsx` and `lakeshore food menu.xlsx`) to organize the menu into the exact categories and modifier system you've requested.

## Required Category Structure (Exact Order)
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

## Processing Your Excel Files

### Step 1: Prepare Your Data
The application already has an import script that can process your Excel files. However, to ensure proper categorization, you'll need to make sure your data follows these guidelines:

#### For `lakeshore food menu.xlsx`:
1. Ensure category headers end with a colon (e.g., "Hot Beverages:", "Cold Beverages:")
2. Items should be listed under their respective category headers
3. Each item should have:
   - Item name in the "ITEM" column
   - Price in the "PRICE" column
   - Description in the "Description" column (optional)
   - Flavour Options in the "Flavour Options" column (comma-separated)
   - GST status in the "GST (5%)" column (Yes/No)

#### For `lakeshore convenience item.xlsx`:
1. Items will be categorized as "Convenience" by default
2. You may want to manually reassign some items to more specific categories like "Grocery" or "Novelties"

### Step 2: Run the Import Script
The application has a script to import your Excel data:

1. Open a terminal/command prompt
2. Navigate to the backend directory:
   ```
   cd c:\Users\YASHASVI\Downloads\FOODIEFRENZY\FOODIEFRENZY\backend
   ```
3. Run the import script:
   ```
   node importFromExcel.js
   ```

### Step 3: Post-Processing for Correct Categories
After importing, you may need to adjust some item categories through the admin panel:

1. Access the admin panel at http://localhost:5174
2. Login with admin credentials
3. Navigate to "List Items" or "Manage Items"
4. For each item that needs re-categorization:
   - Edit the item
   - Change the category to one of the 11 required categories
   - Add modifier groups if applicable (comma-separated)
   - Save the changes

## Adding Modifiers to Items

### For Hot Food Items
Add these modifier groups:
- "Sauces" (for ketchup, mayo, mustard, etc.)
- "Add-ons" (for extra cheese, bacon, avocado, etc.)
- "Spice Level" (for mild, medium, hot preferences)
- "Cooking Instructions" (for well done, medium, rare)
- "Size Options" (for small, medium, large portions)

### For Hot Beverages
Add these modifier groups:
- "Milk Options" (for whole milk, skim milk, soy milk, etc.)
- "Sugar Level" (for no sugar, low sugar, regular, extra sugar)
- "Size Options" (for small, medium, large cups)

### For Cold Beverages
Add these modifier groups:
- "Flavors" (for vanilla, chocolate, strawberry, etc.)
- "Ice Level" (for no ice, light ice, regular ice, extra ice)
- "Sweetness" (for no sugar, low sugar, regular, extra sugar)
- "Size Options" (for small, medium, large cups)

## Example Data Structure

Here's how your items should be structured in the database:

### Hot Food Example
```
Name: Classic Burger
Description: Beef patty with lettuce, tomato, and onion on a sesame bun
Category: Hot Food
Price: 8.99
Modifier Groups: Sauces,Add-ons,Spice Level,Cooking Instructions
Flavour Options: Beef,Chicken,Veggie
```

### Hot Beverage Example
```
Name: Vanilla Latte
Description: Espresso with steamed milk and vanilla syrup
Category: Hot Beverages
Price: 4.75
Modifier Groups: Milk Options,Sugar Level,Size Options
Flavour Options: Vanilla,Chocolate,Caramel
```

### Cold Beverage Example
```
Name: Iced Tea
Description: Refreshing cold tea with lemon
Category: Cold Beverages
Price: 2.99
Modifier Groups: Flavors,Ice Level,Sweetness,Size Options
Flavour Options: Lemon,Mint,Berry
```

## Verifying Your Menu Organization

After processing your data:

1. Visit http://localhost:5173/menu
2. Check that categories appear in the exact order specified
3. Verify that items are in their correct categories
4. Test modifier selection for Hot Food and beverage items
5. Ensure all items display properly with images (using Unsplash API)

## Troubleshooting Common Issues

### Issue: Items Not in Correct Categories
- Solution: Edit items through the admin panel and reassign to correct categories

### Issue: Modifiers Not Displaying
- Solution: Ensure modifierGroups field has data and is comma-separated
- Solution: Check that modifier group names contain the expected keywords (e.g., "Milk" for milk options)

### Issue: Prices Not Displaying Correctly
- Solution: Ensure prices are in decimal format (e.g., 4.99, not $4.99 or 4,99)

### Issue: Images Not Loading
- Solution: The system automatically generates images using Unsplash API based on item names
- Solution: If images still don't load, check internet connection

## Next Steps

1. Run the import script to process your Excel data
2. Review and adjust categories through the admin panel
3. Add modifier groups to Hot Food and beverage items
4. Verify the frontend displays everything correctly
5. Test the modifier selection functionality

Your menu will then be organized exactly as requested with all items in their proper categories and Hot Food/beverage items having customizable modifiers just like popular food ordering platforms.