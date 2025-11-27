import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Item from './modals/item.js';
import dotenv from 'dotenv';

// Load environment variables from .env.railway
dotenv.config({ path: path.resolve(process.cwd(), '.env.railway') });

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB using the Railway database URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://podfuse676_db_user:yashuprenny1231@cluster0.86ejws0.mongodb.net/foodiefrenzy?retryWrites=true&w=majority';

console.log('Connecting to MongoDB Atlas...');
console.log('Using URI:', MONGODB_URI);
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Function to read the organized menu data file
const readOrganizedMenuData = () => {
  try {
    // Path to the organized menu data file
    const dataPath = path.join(__dirname, '..', 'organized_menu_data.json');
    
    // Read the file content
    const fileContent = fs.readFileSync(dataPath, 'utf8');
    
    // Parse the JSON data
    const menuData = JSON.parse(fileContent);
    
    return menuData;
  } catch (error) {
    console.error('Error reading organized menu data:', error);
    process.exit(1);
  }
};

// Function to transform the organized data for MongoDB
const transformOrganizedData = (menuData) => {
  const transformedData = [];
  
  // Process each category
  Object.entries(menuData.menu).forEach(([category, items]) => {
    items.forEach(item => {
      // Create a new item with the required fields
      const newItem = {
        name: item.name,
        category: category,
        description: `${item.name} - ${item.sizes ? item.sizes[0].size : 'Regular'}`,
        price: item.sizes ? item.sizes[0].price : 0,
        gst: item.gst || 5,
        quantity: 0,
        hidden: false,
        nonRevenue: false,
        hearts: 0,
        rating: 4.0,
        total: 0,
        taxRate: 0,
        cost: 0,
        printerLabels: [],
        modifierGroups: item.customizations ? ["Customizations"] : [],
        flavourOptions: item.customizations || [],
        sizeOptions: item.sizes || [],
        // Use a placeholder image URL for now
        imageUrl: `https://res.cloudinary.com/dfjypp016/image/upload/v1761665700/foodiefrenzy_items/${encodeURIComponent(item.name.replace(/\s+/g, '-'))}_1761665699619.webp`
      };
      
      transformedData.push(newItem);
    });
  });
  
  return transformedData;
};

// Function to import data to MongoDB
const importOrganizedData = async () => {
  try {
    // Read the organized menu data
    const menuData = readOrganizedMenuData();
    
    // Transform the data
    const transformedData = transformOrganizedData(menuData);
    
    console.log(`Found ${transformedData.length} menu items to import`);
    
    // Clear existing items
    console.log('Clearing existing items...');
    await Item.deleteMany({});
    
    // Insert the new items
    console.log('Inserting new items...');
    const result = await Item.insertMany(transformedData);
    
    console.log(`Successfully imported ${result.length} menu items`);
    
    // Display some of the imported items
    console.log('Sample of imported items:');
    const sampleItems = await Item.find({}).limit(5);
    sampleItems.forEach(item => {
      console.log(`- ${item.name} (${item.category}) - $${item.price}`);
    });
    
    mongoose.disconnect();
    console.log('Disconnected from MongoDB Atlas');
    process.exit(0);
  } catch (error) {
    console.error('Error importing data:', error);
    mongoose.disconnect();
    process.exit(1);
  }
};

// Run the import
console.log('Starting organized menu data import...');
importOrganizedData();