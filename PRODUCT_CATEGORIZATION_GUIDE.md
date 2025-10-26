# Product Categorization Guide

## Overview
This guide provides instructions for categorizing products from your Excel sheets into the Foodie Frenzy application following the exact category order and implementing modifier groups for hot food and beverages.

## Required Category Order
The application displays categories in this exact order:
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

## Category Assignment Guidelines

### Home
- Reserved category for homepage content
- Not used for individual products

### Products
- General category for items that don't fit other specific categories
- Can be used as a fallback for miscellaneous items

### Hot Beverages
Examples: Coffee, tea, hot chocolate, chai, etc.
- Should include modifier groups for:
  - Milk Options (e.g., Whole Milk, Skim Milk, Soy Milk, Almond Milk)
  - Sugar Level (e.g., No Sugar, Low Sugar, Regular, Extra Sugar)
  - Size Options (e.g., Small, Medium, Large)

### Cold Beverages
Examples: Soda, juice, iced tea, smoothies, milkshakes, etc.
- Should include modifier groups for:
  - Flavors (e.g., Vanilla, Chocolate, Strawberry)
  - Ice Level (e.g., No Ice, Light Ice, Regular Ice, Extra Ice)
  - Sweetness (e.g., No Sugar, Low Sugar, Regular, Extra Sugar)

### Hot Food
Examples: Prepared meals, heated items, soups, sandwiches, etc.
- Should include modifier groups for:
  - Sauces (e.g., Ketchup, Mayo, Mustard, Hot Sauce)
  - Add-ons (e.g., Extra Cheese, Bacon, Avocado)
  - Spice Level (e.g., Mild, Medium, Hot, Extra Hot)
  - Cooking Instructions (e.g., Well Done, Medium, Rare)

### Exotic Chips
Examples: Premium chips, specialty snacks, imported chips
- May include modifier groups for:
  - Flavor (e.g., Salted, BBQ, Sour Cream, Spicy)
  - Size (e.g., Small Bag, Regular Bag, Family Size)

### Exotic Drinks
Examples: Specialty beverages, craft sodas, imported drinks
- May include modifier groups for:
  - Temperature (e.g., Chilled, Room Temp, Warm)
  - Additions (e.g., Ice, Lemon, Lime)

### Grocery
Examples: Basic grocery items, produce, pantry staples
- May include modifier groups for:
  - Size/Weight (e.g., Small, Medium, Large, 1lb, 2lb)
  - Ripeness (e.g., Green, Ripe, Overripe - for fruits)

### Novelties
Examples: Candy, ice cream, unique items, seasonal products
- May include modifier groups for:
  - Flavor (e.g., Various candy flavors, ice cream flavors)
  - Size (e.g., Mini, Regular, Family Size)

### Car Accessories
Examples: Automotive items, phone chargers, cleaning supplies
- May include modifier groups for:
  - Compatibility (e.g., iPhone, Android, Universal)
  - Color (e.g., Black, White, Red, Blue)

### Smokes & Vapes
Examples: Tobacco products, vaping items
- May include modifier groups for:
  - Strength/Flavor (e.g., Light, Regular, Menthol, Vanilla)
  - Size/Pack (e.g., Single, Pack of 5, Pack of 10)

## Modifier Implementation

### Using Modifier Groups from Excel
When adding items through the admin panel:
1. In the "Modifier Groups" field, enter comma-separated modifier group names
2. Example: "Milk Options,Sugar Level,Size Options"
3. The frontend will automatically display these as selectable options

### Common Modifier Groups
1. **Milk Options**: Whole Milk, Skim Milk, Soy Milk, Almond Milk, Oat Milk
2. **Sugar Level**: No Sugar, Low Sugar, Regular, Extra Sugar
3. **Size Options**: Small, Medium, Large, Extra Large
4. **Flavors**: Vanilla, Chocolate, Strawberry, Caramel, Hazelnut
5. **Ice Level**: No Ice, Light Ice, Regular Ice, Extra Ice
6. **Sauces**: Ketchup, Mayo, Mustard, BBQ Sauce, Hot Sauce
7. **Add-ons**: Extra Cheese, Bacon, Avocado, Lettuce, Tomato
8. **Spice Level**: Mild, Medium, Hot, Extra Hot, Mild
9. **Cooking Instructions**: Well Done, Medium, Rare, Medium Rare

## Excel Data Import Process

### Step 1: Organize Your Data
Ensure your Excel sheets have these columns:
- Name
- Description
- Category (must match one of the 11 categories above exactly)
- Price
- Modifier Groups (comma-separated, e.g., "Milk Options,Sugar Level")

### Step 2: Categorize Each Product
Assign each product to the most appropriate category from the list above.

### Step 3: Add Modifier Groups
For Hot Food and relevant beverages, add appropriate modifier groups in the "Modifier Groups" column.

### Step 4: Import via Admin Panel
1. Access the admin panel at http://localhost:5174
2. Login with admin credentials
3. Navigate to "Add Items" or "List Items"
4. Add or update items with proper categories and modifier groups

## Example Product Categorization

| Product Name | Category | Modifier Groups | Notes |
|--------------|----------|----------------|-------|
| Double Shot Espresso | Hot Beverages | Milk Options,Sugar Level,Size Options | Classic coffee item |
| Vanilla Latte | Hot Beverages | Milk Options,Sugar Level,Size Options | Includes flavor option |
| Iced Tea | Cold Beverages | Flavors,Ice Level,Sweetness,Size Options | Cold beverage with multiple options |
| Nachos | Hot Food | Sauces,Add-ons,Spice Level | Hot food with various customizations |
| Kettle Chips | Exotic Chips | Flavor,Size | Premium snack item |
| Imported Soda | Exotic Drinks | Temperature,Size | Specialty beverage |
| Bananas | Grocery | Size/Ripeness | Basic grocery item |
| Ice Cream Bar | Novelties | Flavors,Size | Treat with flavor options |
| Phone Charger | Car Accessories | Compatibility,Color | Accessory with tech specs |
| Cigarettes | Smokes & Vapes | Strength/Pack Size | Tobacco product |

## Best Practices

1. **Consistent Category Naming**: Use exact category names as listed above
2. **Modifier Group Consistency**: Use the same modifier group names across similar items
3. **Data Validation**: Ensure prices are in decimal format (e.g., 4.99, not $4.99)
4. **Description Quality**: Write clear, concise descriptions that help customers understand the product
5. **Modifier Relevance**: Only assign modifier groups that make sense for the specific product

## Troubleshooting

### Issue: Category Not Appearing
- Verify the category name matches exactly with the list above
- Ensure at least one item is assigned to that category
- Check that the item is not marked as "hidden"

### Issue: Modifiers Not Showing
- Verify modifier group names are spelled correctly
- Ensure modifier groups are comma-separated with no spaces
- Check that the item has at least one modifier group assigned

### Issue: Item Not in Correct Category
- Verify the "category" field in the database matches the intended category
- Refresh the frontend to see updated categorization

## Admin Panel Usage

To manage your categorized products:
1. Visit http://localhost:5174
2. Login with admin credentials
3. Use "Add Items" to create new products with proper categories
4. Use "List Items" to edit existing products and update their categories
5. Use "Orders" to monitor customer orders

This guide ensures proper organization of your products following the exact category sequence while implementing Zomato-style modifier options for hot food and beverages.