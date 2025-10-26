# Menu Organization Template

## Overview
This template will help you organize your Excel sheet data into the Foodie Frenzy application with the exact category structure and modifier implementation you've requested.

## Required Category Structure
The application will display categories in this exact order:
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

## Excel Data Processing Template

### Data Structure
When organizing your Excel data, ensure each row has these columns:

| Column Name | Required | Description |
|-------------|----------|-------------|
| name | Yes | Product name |
| description | Yes | Product description |
| category | Yes | Must match one of the 11 categories exactly |
| price | Yes | Product price in decimal format (e.g., 4.99) |
| modifierGroups | No | Comma-separated modifier group names (e.g., "Sauces,Spice Level") |
| flavourOptions | No | Comma-separated flavor options (e.g., "Vanilla,Chocolate,Strawberry") |

## Category-by-Category Organization Guide

### 1. Home
- Reserved category for homepage content
- Not used for individual products
- Keep empty in your product data

### 2. Products
- General category for items that don't fit other specific categories
- Use for miscellaneous items

### 3. Hot Beverages
**Examples**: Coffee, tea, hot chocolate, chai, etc.

**Recommended Modifier Groups**:
- Milk Options (e.g., Whole Milk, Skim Milk, Soy Milk, Almond Milk)
- Sugar Level (e.g., No Sugar, Low Sugar, Regular, Extra Sugar)
- Size Options (e.g., Small, Medium, Large)
- Flavor Options (e.g., Vanilla, Chocolate, Caramel)

**Excel Row Example**:
```
name: Double Shot Espresso
description: Strong black coffee with double espresso shot
category: Hot Beverages
price: 3.50
modifierGroups: Milk Options,Sugar Level,Size Options
flavourOptions: Regular, Vanilla, Caramel
```

### 4. Cold Beverages
**Examples**: Soda, juice, iced tea, smoothies, milkshakes, etc.

**Recommended Modifier Groups**:
- Flavors (e.g., Vanilla, Chocolate, Strawberry, Caramel)
- Ice Level (e.g., No Ice, Light Ice, Regular Ice, Extra Ice)
- Sweetness (e.g., No Sugar, Low Sugar, Regular, Extra Sugar)
- Size Options (e.g., Small, Medium, Large)

**Excel Row Example**:
```
name: Vanilla Milkshake
description: Creamy vanilla milkshake with your choice of milk
category: Cold Beverages
price: 5.99
modifierGroups: Flavors,Ice Level,Sweetness,Size Options
flavourOptions: Vanilla, Chocolate, Strawberry, Caramel
```

### 5. Hot Food
**Examples**: Prepared meals, heated items, soups, sandwiches, etc.

**Recommended Modifier Groups**:
- Sauces (e.g., Ketchup, Mayo, Mustard, BBQ Sauce, Hot Sauce)
- Add-ons (e.g., Extra Cheese, Bacon, Avocado, Lettuce, Tomato)
- Spice Level (e.g., Mild, Medium, Hot, Extra Hot)
- Cooking Instructions (e.g., Well Done, Medium, Rare)
- Size Options (e.g., Small, Medium, Large)

**Excel Row Example**:
```
name: Classic Burger
description: Beef patty with lettuce, tomato, and onion on a sesame bun
category: Hot Food
price: 8.99
modifierGroups: Sauces,Add-ons,Spice Level,Cooking Instructions
flavourOptions: Beef, Chicken, Veggie
```

### 6. Exotic Chips
**Examples**: Premium chips, specialty snacks, imported chips

**Recommended Modifier Groups**:
- Flavor (e.g., Salted, BBQ, Sour Cream, Spicy)
- Size (e.g., Small Bag, Regular Bag, Family Size)

**Excel Row Example**:
```
name: Truffle Parmesan Chips
description: Gourmet truffle and parmesan flavored potato chips
category: Exotic Chips
price: 4.50
modifierGroups: Flavor,Size
flavourOptions: Truffle Parmesan, Sea Salt, BBQ, Spicy
```

### 7. Exotic Drinks
**Examples**: Specialty beverages, craft sodas, imported drinks

**Recommended Modifier Groups**:
- Temperature (e.g., Chilled, Room Temp, Warm)
- Additions (e.g., Ice, Lemon, Lime)
- Size Options (e.g., Small, Medium, Large)

**Excel Row Example**:
```
name: Artisanal Sparkling Water
description: Premium sparkling water with natural fruit essences
category: Exotic Drinks
price: 3.25
modifierGroups: Temperature,Additions,Size Options
flavourOptions: Lemon, Lime, Berry, Cucumber
```

### 8. Grocery
**Examples**: Basic grocery items, produce, pantry staples

**Recommended Modifier Groups**:
- Size/Weight (e.g., Small, Medium, Large, 1lb, 2lb)
- Ripeness (e.g., Green, Ripe, Overripe - for fruits)

**Excel Row Example**:
```
name: Organic Bananas
description: Fresh organic bananas from local farms
category: Grocery
price: 0.99
modifierGroups: Size/Weight,Ripeness
flavourOptions: Regular
```

### 9. Novelties
**Examples**: Candy, ice cream, unique items, seasonal products

**Recommended Modifier Groups**:
- Flavor (e.g., Various candy flavors, ice cream flavors)
- Size (e.g., Mini, Regular, Family Size)

**Excel Row Example**:
```
name: Gourmet Chocolate Bar
description: Artisanal chocolate bar with premium ingredients
category: Novelties
price: 2.75
modifierGroups: Flavor,Size
flavourOptions: Dark Chocolate, Milk Chocolate, White Chocolate, Salted Caramel
```

### 10. Car Accessories
**Examples**: Automotive items, phone chargers, cleaning supplies

**Recommended Modifier Groups**:
- Compatibility (e.g., iPhone, Android, Universal)
- Color (e.g., Black, White, Red, Blue)

**Excel Row Example**:
```
name: Universal Phone Charger
description: Fast-charging USB-C phone charger compatible with all devices
category: Car Accessories
price: 12.99
modifierGroups: Compatibility,Color
flavourOptions: Universal
```

### 11. Smokes & Vapes
**Examples**: Tobacco products, vaping items

**Recommended Modifier Groups**:
- Strength/Flavor (e.g., Light, Regular, Menthol, Vanilla)
- Size/Pack (e.g., Single, Pack of 5, Pack of 10)

**Excel Row Example**:
```
name: Premium Cigarettes
description: Filtered premium blend cigarettes
category: Smokes & Vapes
price: 14.99
modifierGroups: Strength/Flavor,Size/Pack
flavourOptions: Regular, Menthol, Light
```

## Modifier Implementation Guide

### For Hot Food Items
When processing Hot Food items from your Excel sheets:

1. **Identify Modifier Groups**: Look for columns or data that indicate customization options
2. **Map to Standard Groups**: Use standard modifier group names:
   - Sauces
   - Add-ons
   - Spice Level
   - Cooking Instructions
   - Size Options

3. **Include Flavor Options**: If your Excel has separate flavor data, include it in the flavourOptions column

### For Beverage Items
When processing beverage items from your Excel sheets:

1. **Hot Beverages**:
   - Milk Options
   - Sugar Level
   - Size Options
   - Flavor Options

2. **Cold Beverages**:
   - Flavors
   - Ice Level
   - Sweetness
   - Size Options

### Data Entry Best Practices

1. **Category Names**: Use exact category names as listed above
2. **Modifier Groups**: Comma-separated with no spaces after commas
3. **Prices**: Use decimal format (e.g., 4.99, not $4.99 or 4,99)
4. **Descriptions**: Clear, concise, and informative
5. **Flavor Options**: Comma-separated with no spaces after commas

## Sample Complete Dataset

Here's how your processed Excel data should look:

| name | description | category | price | modifierGroups | flavourOptions |
|------|-------------|----------|-------|----------------|----------------|
| Double Shot Espresso | Strong black coffee with double espresso shot | Hot Beverages | 3.50 | Milk Options,Sugar Level,Size Options | Regular, Vanilla, Caramel |
| Vanilla Milkshake | Creamy vanilla milkshake with your choice of milk | Cold Beverages | 5.99 | Flavors,Ice Level,Sweetness,Size Options | Vanilla, Chocolate, Strawberry, Caramel |
| Classic Burger | Beef patty with lettuce, tomato, and onion on a sesame bun | Hot Food | 8.99 | Sauces,Add-ons,Spice Level,Cooking Instructions | Beef, Chicken, Veggie |
| Truffle Parmesan Chips | Gourmet truffle and parmesan flavored potato chips | Exotic Chips | 4.50 | Flavor,Size | Truffle Parmesan, Sea Salt, BBQ, Spicy |
| Artisanal Sparkling Water | Premium sparkling water with natural fruit essences | Exotic Drinks | 3.25 | Temperature,Additions,Size Options | Lemon, Lime, Berry, Cucumber |
| Organic Bananas | Fresh organic bananas from local farms | Grocery | 0.99 | Size/Weight,Ripeness | Regular |
| Gourmet Chocolate Bar | Artisanal chocolate bar with premium ingredients | Novelties | 2.75 | Flavor,Size | Dark Chocolate, Milk Chocolate, White Chocolate, Salted Caramel |
| Universal Phone Charger | Fast-charging USB-C phone charger compatible with all devices | Car Accessories | 12.99 | Compatibility,Color | Universal |
| Premium Cigarettes | Filtered premium blend cigarettes | Smokes & Vapes | 14.99 | Strength/Flavor,Size/Pack | Regular, Menthol, Light |

## Import Process

### Step 1: Prepare Your Data
1. Open your Excel sheets
2. Create columns matching the template above
3. Categorize each item according to the 11-category structure
4. Add modifier groups and flavor options where applicable

### Step 2: Import via Admin Panel
1. Access the admin panel at http://localhost:5174
2. Login with admin credentials
3. Navigate to "Add Items" or "List Items"
4. For each product:
   - Enter the name
   - Enter the description
   - Select the category from the dropdown or type it exactly
   - Enter the price
   - Enter modifier groups as comma-separated values
   - Enter flavor options as comma-separated values
   - Click "Add Item"

### Step 3: Verify Organization
1. Visit http://localhost:5173/menu
2. Check that items appear in the correct categories
3. Verify that modifier groups display correctly for Hot Food and beverage items
4. Test the modifier selection functionality

## Troubleshooting Common Issues

### Issue: Category Not Appearing
- Solution: Ensure at least one item is assigned to that category
- Solution: Verify category names match exactly with the list above

### Issue: Modifiers Not Showing
- Solution: Check that modifierGroups column has data for that item
- Solution: Verify modifier group names are spelled correctly

### Issue: Item Not in Correct Category
- Solution: Check the category field in your Excel data
- Solution: Refresh the frontend after importing

This template and guide should help you process your Excel sheet data into the Foodie Frenzy application with the exact category structure and modifier implementation you've requested.