# Lakeshore Convenience Menu Implementation

## Overview
This document details the implementation of the menu structure for Lakeshore Convenience, organizing products into the exact subcategories as specified.

## Menu Structure

### Main Navigation
- **Products** (Single main menu item)

### Subcategories (in exact order)
1. Hot Beverages
2. Cold Beverages
3. Hot Food
4. Exotic Chips
5. Exotic Drinks
6. Grocery
7. Novelties
8. Car Accessories
9. Smokes & Vapes

## Category Details

### 1. Hot Beverages
**Includes:** All hot drinks like Coffee, Speciality Coffee, Chai, Hot Chocolate with their variants and modifiers

**Implementation:**
- Dynamically loads all relevant products from Excel data
- Maps database categories: 'Hot Beverages', 'Coffee', 'Speciality Coffee', 'Chai', 'Hot Chocolate'
- Displays items with name, price, description/nutrition, and aggregated reviews

### 2. Cold Beverages
**Includes:** Slushies, Snow Joe, cold drinks and similarly categorized items

**Implementation:**
- Dynamically loads all relevant products from Excel data
- Maps database categories: 'Cold Beverages', 'Slushies', 'Snow Joe', 'Cold Drinks'
- Displays items with name, price, description/nutrition, and aggregated reviews

### 3. Hot Food
**Includes:** Items like Hot Dogs, Samosa, Chicken wings, Mac n Cheese Balls, Sausage Rolls, Wedges including modifiers such as dips and sauces

**Implementation:**
- Dynamically loads all relevant products from Excel data
- Maps database categories: 'Hot Food', 'Hot Dogs', 'Samosa', 'Chicken wings', 'Mac n Cheese Balls', 'Sausage Rolls', 'Wedges'
- Displays items with name, price, description/nutrition, and aggregated reviews
- Shows modifier options (dips, sauces) when available

### 4. Exotic Chips
**Includes:** Specialty chips, branded exotic chips from Excel item list

**Implementation:**
- Dynamically loads all relevant products from Excel data
- Maps database categories: 'Exotic Chips', 'Specialty chips', 'Branded chips'
- Displays items with name, price, description/nutrition, and aggregated reviews

### 5. Exotic Drinks
**Includes:** Energy drinks, unique sparkling waters, and other exotic beverages

**Implementation:**
- Dynamically loads all relevant products from Excel data
- Maps database categories: 'Exotic Drinks', 'Energy drinks', 'Sparkling waters', 'Unique beverages'
- Displays items with name, price, description/nutrition, and aggregated reviews

### 6. Grocery
**Includes:** Common grocery essentials like Ziploc bags, baking soda, canned foods, sauces, spices

**Implementation:**
- Dynamically loads all relevant products from Excel data
- Maps database categories: 'Grocery', 'Ziploc bags', 'Baking soda', 'Canned foods', 'Sauces', 'Spices', 'Essentials'
- Displays items with name, price, description/nutrition, and aggregated reviews

### 7. Novelties
**Includes:** Candy, snacks, chocolates, popcorn, treats

**Implementation:**
- Dynamically loads all relevant products from Excel data
- Maps database categories: 'Novelties', 'Candy', 'Snacks', 'Chocolates', 'Popcorn', 'Treats'
- Displays items with name, price, description/nutrition, and aggregated reviews

### 8. Car Accessories
**Includes:** Air fresheners, car cleaners, and other car-related items

**Implementation:**
- Dynamically loads all relevant products from Excel data
- Maps database categories: 'Car Accessories', 'Air fresheners', 'Car cleaners', 'Car items'
- Displays items with name, price, description/nutrition, and aggregated reviews

### 9. Smokes & Vapes
**Includes:** Cigarettes, vape pens, lighters, tobacco accessories

**Implementation:**
- Dynamically loads all relevant products from Excel data
- Maps database categories: 'Smokes & Vapes', 'Cigarettes', 'Vape pens', 'Lighters', 'Tobacco accessories'
- Displays items with name, price, description/nutrition, and aggregated reviews

## Product Display Features

Each product display includes:
- **Item Name**
- **Price** (from Excel sheet)
- **2-3 lines of product description/nutrition details**
- **One aggregated customer review below**

## Detailed Product View

When a user clicks on a product image or name:
- Opens a full-screen detailed view
- Shows large images
- Displays full description
- Shows flavor/modifier options (if any)
- Displays customer reviews
- Provides add-to-cart options

For items without flavor or modifier options:
- Omits that section
- Provides a confirmation tick popup when adding to cart

## UI Consistency

The UI maintains:
- Brand colors consistency
- Typography consistency
- Background consistency with the rest of the site
- Avoids overly simple design