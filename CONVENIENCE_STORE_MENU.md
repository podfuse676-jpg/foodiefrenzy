# Lakeshore Convenience Store Menu Implementation

## Overview
This document details the implementation of the menu structure for Lakeshore Convenience, organized exactly as specified with proper categorization and customization options.

## Menu Structure

### Main Categories (in exact order)
1. ☕ Hot Beverages
2. 🧃 Cold Beverages
3. 🍔 Hot Food
4. 🍟 Exotic Chips
5. 🥤 Exotic Drinks
6. 🛒 Grocery
7. 🎁 Novelties
8. 🚗 Car Accessories
9. 🚬 Smokes & Vapes

## Category Implementation

### 1. ☕ Hot Beverages
**Items:**
- Coffee (Small / Medium / Large)
- Cappuccino
- Latte
- Mocha
- Hot Chocolate
- Chai (Masala Chai, Cardamom Chai, Kashmiri Pink Chai)

**Features:**
- Size customization options
- Flavor options (Creamer, Sugar types)
- Warm color theme (brown/orange tones)

### 2. 🧃 Cold Beverages
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

**Features:**
- Flavor customization options
- Cool color theme (blue tones)
- Size options for Snow Joe

### 3. 🍔 Hot Food
**Items:**
- Hot Dog (with ketchup, mustard, relish)
- Samosa (Spiced potato, peas, and herbs)
- Potato Wedges (Small / Medium / Large)
- Chicken Wings (Regular & Flavoured — BBQ, Sweet & Spicy, Korean Gochugaru, Montreal BBQ, etc.)
- Chicken Tenders (4pc, with Ranch, Ketchup, BBQ, Sweet & Sour dips)
- Mac N Cheese Balls (3pc / 5pc, with dip or drizzle)
- Sausage Rolls (Minced beef pastry)
- Extra Dip (Ranch, Ketchup, BBQ, Sweet & Sour)

**Features:**
- Flavor options (sauces, dips)
- Size options for Wedges
- Warm color theme (red/orange tones)

### 4. 🍟 Exotic Chips
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

**Features:**
- No customization options
- Warm color theme (yellow/gold tones)

### 5. 🥤 Exotic Drinks
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

**Features:**
- Flavor options where applicable
- Cool color theme (purple/blue tones)

### 6. 🛒 Grocery
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

**Features:**
- No customization options
- Green color theme (fresh/healthy tones)

### 7. 🎁 Novelties
**Items:**
- Keychain Set
- Greeting Card
- Lighter Refill
- Gift Bag
- Small Toy Figurine

**Features:**
- No customization options
- Pink color theme (fun/gift tones)

### 8. 🚗 Car Accessories
**Items:**
- Car Air Freshener
- Tire Cleaner
- Wiper Fluid
- Dashboard Polish
- Car Perfume

**Features:**
- No customization options
- Gray color theme (professional/industrial tones)

### 9. 🚬 Smokes & Vapes
**Items:**
- Vape Device
- Vape Pods
- Cigarette Pack
- Cigarillo
- Rolling Paper

**Features:**
- No customization options
- Gray color theme (discreet tones)

## Functionality Rules Implementation

### Price Display
- Prices are fetched directly from Excel data
- GST is included in the display price if available
- Example: Hot Dog — $3.49 CAD (includes GST)

### Flavour / Size Customization
- Items with flavour or size options show a "Customize" button
- Clicking "Customize" opens a popup with:
  - Flavour selection dropdowns
  - Size selection (if applicable)
- Items without flavours show "No flavours for this item" in the popup

### Design & Layout
- Clean, elegant theme with category cards
- Each category has a distinct color theme:
  - Hot Beverages: Warm brown/orange tones
  - Cold Beverages: Cool blue tones
  - Hot Food: Warm red/orange tones
  - Exotic Chips: Warm yellow/gold tones
  - Exotic Drinks: Purple/blue tones
  - Grocery: Green tones
  - Novelties: Pink tones
  - Car Accessories: Gray tones
  - Smokes & Vapes: Gray tones

### Interactivity
- Dynamic price updates when flavours or sizes are selected
- Add to cart functionality from both main list and customization popup
- Quantity adjustment controls

### Style
- Minimal, modern UI (like Starbucks or Tim Hortons web menu)
- Warm tones for food items, cool tones for beverages
- Rounded buttons and soft hover effects
- Responsive design for all device sizes

## Technical Implementation

### Component Structure
1. **OurMenu.jsx** - Main menu component with category navigation
2. **MenuItem.jsx** - Individual product display with Add/Customize buttons
3. **CustomizePopup.jsx** - Popup for flavor/size customization
4. **Om.css** - Category-specific styling

### Data Handling
- Items are categorized based on exact Excel specifications
- Variants and modifiers are properly mapped
- Prices are dynamically calculated with modifiers
- GST is included in displayed prices

### User Experience
- Smooth transitions between views
- Clear visual feedback for interactions
- Intuitive navigation between categories
- Easy customization of product options
- Responsive design for all device sizes