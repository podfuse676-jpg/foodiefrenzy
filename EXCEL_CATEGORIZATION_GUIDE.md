# Excel Product Categorization Guide

## Overview
This guide provides instructions for categorizing products in Excel to ensure proper display and organization in the Foodie Frenzy application.

## Required Columns

When creating or updating your product Excel file, ensure the following columns are present:

| Column Name | Required | Description |
|-------------|----------|-------------|
| name | Yes | Product name |
| description | Yes | Product description |
| category | Yes | Must match one of the specified categories exactly |
| price | Yes | Product price |
| modifierGroups | No | Comma-separated list of modifier groups (if applicable) |

## Category List

Products must be categorized using one of these exact category names:

1. **Hot Beverages** - Coffee, tea, hot chocolate, etc.
2. **Cold Beverages** - Soda, juice, iced tea, smoothies, etc.
3. **Hot Food** - Prepared meals, heated items, etc.
4. **Exotic Chips** - Specialty chips and snacks
5. **Exotic Drinks** - Specialty beverages and imports
6. **Grocery** - Basic grocery items, produce, etc.
7. **Novelties** - Candy, ice cream, unique items
8. **Car Accessories** - Automotive items
9. **Smokes & Vapes** - Tobacco and vaping products

## Example Excel Format

| name | description | category | price | modifierGroups |
|------|-------------|----------|-------|----------------|
| Double Shot Espresso | Strong black coffee | Hot Beverages | 3.50 | Milk Options,Sugar Level |
| Vanilla Latte | Espresso with vanilla and steamed milk | Hot Beverages | 4.75 | Milk Type,Sugar Level,Whipped Cream |
| Iced Tea | Refreshing cold tea | Cold Beverages | 2.99 | Lemon,Sugar Level |
| Nachos | Tortilla chips with cheese | Hot Food | 6.50 | Toppings,Spice Level |
| Kettle Chips | Premium potato chips | Exotic Chips | 3.25 | Flavor,Size |
| Imported Soda | Specialty international soda | Exotic Drinks | 2.50 | Size |
| Bananas | Fresh bananas | Grocery | 0.99 | |
| Ice Cream Bar | Vanilla ice cream bar | Novelties | 2.25 | Toppings |
| Phone Charger | Universal phone charging cable | Car Accessories | 12.99 | Cable Type |
| Cigarettes | Premium brand cigarettes | Smokes & Vapes | 14.99 | Pack Size |

## Modifier Groups

For items that require customization, include modifier groups in the "modifierGroups" column as a comma-separated list:

Common modifier groups:
- Milk Options
- Sugar Level
- Size
- Toppings
- Spice Level
- Cooking Instructions
- Add-ons
- Flavor

## Best Practices

1. **Exact Category Names**: Use category names exactly as listed (case-sensitive)
2. **Consistent Formatting**: Keep descriptions clear and concise
3. **Modifier Group Separation**: Use commas without spaces between modifier groups
4. **Price Format**: Use decimal format (e.g., 4.99, not $4.99)
5. **Empty Cells**: Leave modifierGroups cell empty if no modifiers apply

## Troubleshooting

### Issue: Items not appearing in the correct category
**Solution**: Verify the category name matches exactly with the specified list

### Issue: Modifiers not showing for an item
**Solution**: Check that modifierGroups column contains valid group names separated by commas

### Issue: Pricing errors
**Solution**: Ensure prices are in decimal format without currency symbols

## Import Process

After categorizing products in Excel:
1. Export as CSV or XLSX
2. Use the admin panel or import script to add items to the database
3. Verify items appear in the correct categories
4. Test modifier functionality for items with modifier groups

This guide ensures proper categorization and organization of products for optimal user experience.