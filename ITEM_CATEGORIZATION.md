# Lakeshore Convenience Item Categorization

## Overview
This document details the exact categorization of all items according to the specifications provided, with proper mapping of items to their respective categories.

## Category Mappings

### ☕ Hot Beverages
**Items:**
- Coffee (Small / Medium / Large)
- Cappuccino
- Latte
- Mocha
- Hot Chocolate
- Chai (Masala Chai, Cardamom Chai, Kashmiri Pink Chai)

**Characteristics:**
- Items with size variants (Small, Medium, Large)
- Items with flavor/customization options
- Warm beverage category

### 🧃 Cold Beverages
**Items:**
- Airheads Watermelon Drink
- Dare Juicee Sour Bears
- Kool-Aid Bursts
- Jarritos Fruit Punch
- Mogu Mogu Grape
- Red Rain Energy Drink
- Vitamin Water
- Coca-Cola
- Pepsi
- Sprite
- Fanta (Orange / Blue Raspberry)
- Snow Joe (Soft Serve + Slushy Combo)
- Iced Tea
- Minute Maid Juice

**Characteristics:**
- Cold drinks and beverages
- Some items with flavor variants
- Snow Joe with combination options

### 🍔 Hot Food
**Items:**
- Hot Dog (with ketchup, mustard, relish)
- Samosa (Spiced potato, peas, and herbs)
- Potato Wedges (Small / Medium / Large)
- Chicken Wings (Regular & Flavoured — BBQ, Sweet & Spicy, Korean Gochugaru, Montreal BBQ, etc.)
- Chicken Tenders (4pc, with Ranch, Ketchup, BBQ, Sweet & Sour dips)
- Mac N Cheese Balls (3pc / 5pc, with dip or drizzle)
- Sausage Rolls (Minced beef pastry)
- Extra Dip (Ranch, Ketchup, BBQ, Sweet & Sour)

**Characteristics:**
- Prepared food items
- Items with size variants (Wedges)
- Items with flavor variants (Chicken Wings, Chicken Tenders)
- Items with dip options
- Items with sauce options

### 🍟 Exotic Chips
**Items:**
- Doritos Sweet Chili Heat
- Kettle Chips Backyard BBQ
- Pringles Original
- Takis Fuego
- Lays Salt & Vinegar
- Ruffles All Dressed
- Miss Vickie's Jalapeño
- Christie Chips Ahoy (Snack version)
- Cheetos Crunchy

**Characteristics:**
- Packaged chip/snack items
- Branded specialty chips
- No size or flavor variants

### 🥤 Exotic Drinks
**Items:**
- 5-Hr Energy Shot Berry
- 5-Hr Energy Shot Xtra Blue Raspberry
- 5-Hr Energy Shot Xtra Grape
- 5-Hr Energy Shot Xtra Peach Mango
- Monster Energy Ultra
- Red Bull Regular
- Red Bull Blue Edition
- Prime Hydration (Ice Pop / Tropical Punch)
- Rockstar Energy Drink
- Bang Energy
- Gatorade

**Characteristics:**
- Energy drinks
- Specialty beverages
- Items with flavor variants
- Hydration drinks

### 🛒 Grocery
**Items:**
- Alcan Aluminium Foil 12inch
- Kinder Bueno
- Oreo Original
- Ritz Crackers
- Cadbury Caramilk
- Cadbury Dairy Milk
- Big Sky Mints
- Milk
- Bread
- Eggs
- Rice
- Sugar
- Cooking Oil
- Salt
- Sauce Packets
- Cookies
- Candy Bars

**Characteristics:**
- Household essentials
- Pantry items
- Packaged food items
- Baking supplies
- Dairy products

### 🎁 Novelties
**Items:**
- Keychain Set
- Greeting Card
- Lighter Refill
- Gift Bag
- Small Toy Figurine

**Characteristics:**
- Gift items
- Small accessories
- Non-food items
- Novelty products

### 🚗 Car Accessories
**Items:**
- Car Air Freshener
- Tire Cleaner
- Wiper Fluid
- Dashboard Polish
- Car Perfume

**Characteristics:**
- Automotive products
- Car maintenance items
- Car accessories

### 🚬 Smokes & Vapes
**Items:**
- Vape Device
- Vape Pods
- Cigarette Pack
- Cigarillo
- Rolling Paper

**Characteristics:**
- Tobacco products
- Smoking accessories
- Vaping products

## Implementation Notes

### Data Mapping
- Items are categorized based on exact name matching with keywords
- Size variants are handled through item variants in the database
- Flavor options are handled through modifier groups
- Price information is fetched directly from the database/Excel sheets

### Customization Options
- **Hot Beverages**: Size options (Small/Medium/Large), creamer/sugar options
- **Cold Beverages**: Flavor options for Fanta and Snow Joe combinations
- **Hot Food**: Size options for Potato Wedges, flavor options for Chicken Wings and Tenders, dip options
- **Exotic Chips**: No customization options
- **Exotic Drinks**: Flavor options for energy shots
- **Grocery**: No customization options
- **Novelties**: No customization options
- **Car Accessories**: No customization options
- **Smokes & Vapes**: No customization options

### Price Handling
- All prices are fetched directly from the database
- Prices include GST where applicable
- Variant prices are dynamically calculated
- Modifier prices are added to base prices

### Search and Filtering
- Items can be searched by name across all categories
- Results show items matching the search term
- Categories can be browsed individually
- All items display their correct pricing information

## Technical Implementation

### Category Assignment Logic
1. Each item is checked against keywords for each category
2. The first matching category is assigned
3. Items that don't match any category go to "Uncategorized"
4. Category order is maintained as specified

### Data Structure
- Items are organized in a dictionary with categories as keys
- Each category contains an array of items
- Items retain all their properties (name, price, description, variants, modifiers)
- Search functionality works across all categories

### UI/UX Considerations
- Each category has distinct visual styling
- Items with customization options show "Customize" button
- Items without options show "Add" button directly
- Responsive design works on all device sizes
- Clear visual hierarchy and navigation