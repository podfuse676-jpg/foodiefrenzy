import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

// Import health check early
import healthCheck from './health.js';

// Load environment variables
dotenv.config();

// Add debugging at the top of the file
console.log('=== SERVER STARTUP DEBUG INFO ===');
console.log('Node version:', process.version);
console.log('Current working directory:', process.cwd());
console.log('Environment variables:');
Object.keys(process.env).filter(key => key.includes('PORT') || key.includes('MONGO') || key.includes('CORS') || key.includes('FRONTEND') || key.includes('ADMIN') || key.includes('CLOUDINARY')).forEach(key => {
  console.log(`  ${key}: ${process.env[key]}`);
});
console.log('================================');

// Add error handling for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('=== UNCAUGHT EXCEPTION ===');
  console.error('Error:', err);
  console.error('Stack:', err.stack);
  console.error('========================');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('=== UNHANDLED REJECTION ===');
  console.error('Reason:', reason);
  console.error('Promise:', promise);
  console.error('==========================');
});

// Ensure uploads directory exists (for any local fallback)
const uploadsDir = path.join(process.cwd(), 'uploads');
const imagesDir = path.join(uploadsDir, 'images');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  console.log('Creating uploads directory...');
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create images directory if it doesn't exist
if (!fs.existsSync(imagesDir)) {
  console.log('Creating uploads/images directory...');
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Configure Cloudinary storage for test endpoint
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'foodiefrenzy_items',
        format: async (req, file) => {
            // Determine format based on file mimetype
            if (file.mimetype.includes('webp')) return 'webp';
            if (file.mimetype.includes('png')) return 'png';
            if (file.mimetype.includes('jpg') || file.mimetype.includes('jpeg')) return 'jpg';
            return 'jpg'; // default
        },
        public_id: (req, file) => {
            // Generate unique public ID
            const timestamp = Date.now();
            const originalname = file.originalname.split('.')[0];
            // Sanitize filename for Cloudinary
            const sanitized = originalname.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_');
            return `${sanitized}_${timestamp}`;
        },
    },
});

// Add file filter to only accept images
const fileFilter = (_req, file, cb) => {
    console.log('File filter checking file:', file.mimetype);
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

const upload = multer({ 
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Log MongoDB URI for debugging (mask sensitive info)
    if (process.env.MONGODB_URI) {
      const maskedUri = process.env.MONGODB_URI.replace(/(mongodb\+srv:\/\/)([^:]+):([^@]+)(@.*)/, '$1****:****$4');
      console.log(`Attempting to connect to MongoDB: ${maskedUri}`);
    } else {
      console.log('MONGODB_URI environment variable not set!');
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Please check your MONGODB_URI environment variable in Render');
    process.exit(1);
  }
};

// Import routes
import itemRoutes from './routes/itemRoute.js';
import cartRoutes from './routes/cartRoute.js';
import orderRoutes from './routes/orderRoute.js';
import newOrderRoutes from './routes/newOrderRoutes.js';
import userRoutes from './routes/userRoute.js';
import phoneAuthRoutes from './routes/phoneAuthRoute.js';
import emailAuthRoutes from './routes/emailAuthRoute.js';
import whatsappAuthRoutes from './routes/whatsappAuthRoute.js';
import emailOTPRoutes from './routes/emailOTPRoutes.js'; // Add email OTP routes
import reviewRoutes from './routes/reviewRoute.js';
import testRoutes from './routes/testRoute.js';

// Import models after database connection
import User from './modals/userModel.js';

// Function to load initial data
const loadInitialData = async (Item) => {
  try {
    // Sample menu items with all categories
    const menuItems = [
      // Breakfast items
      { name: "Eggs Benedict", description: "Poached eggs and Canadian bacon on English muffins, topped with hollandaise sauce.", category: "Breakfast", price: 12.99, rating: 4.8, hearts: 0, imageUrl: "/uploads/EggsBenedict.png" },
      { name: "Avocado Toast", description: "Toasted artisan bread topped with mashed avocado, cherry tomatoes, and a poached egg.", category: "Breakfast", price: 10.99, rating: 4.5, hearts: 0, imageUrl: "/uploads/AvocadoToast.png" },
      { name: "Pancakes with Maple Syrup", description: "Fluffy buttermilk pancakes served with pure maple syrup and butter.", category: "Breakfast", price: 9.99, rating: 4.6, hearts: 0, imageUrl: "/uploads/PancakeswithMapleSyrup.png" },
      { name: "Fruit Smoothie Bowl", description: "Blended açaí with banana, topped with granola, fresh berries, and honey.", category: "Breakfast", price: 11.99, rating: 4.7, hearts: 0, imageUrl: "/uploads/FruitSmoothieBowl.png" },
      { name: "French Toast", description: "Thick-cut brioche bread dipped in cinnamon-vanilla batter, grilled and topped with powdered sugar.", category: "Breakfast", price: 10.99, rating: 4.5, hearts: 0, imageUrl: "/uploads/FrenchToast.png" },
      { name: "Bagel with Lox", description: "Toasted bagel with cream cheese, smoked salmon, capers, red onion, and dill.", category: "Breakfast", price: 13.99, rating: 4.6, hearts: 0, imageUrl: "/uploads/BagelwithLox.png" },
      { name: "Granola Parfait", description: "Layers of Greek yogurt, house-made granola, fresh berries, and honey.", category: "Breakfast", price: 8.99, rating: 4.4, hearts: 0, imageUrl: "/uploads/GranolaParfait.png" },
      { name: "Breakfast Burrito", description: "Scrambled eggs, cheese, potatoes, and your choice of bacon or sausage wrapped in a warm tortilla.", category: "Breakfast", price: 9.99, rating: 4.7, hearts: 0, imageUrl: "/uploads/BreakfastBurrito.png" },
      
      // Lunch items
      { name: "Chicken Caesar Salad", description: "Crisp romaine lettuce, grilled chicken, parmesan cheese, and croutons tossed in Caesar dressing.", category: "Lunch", price: 12.99, rating: 4.6, hearts: 0, imageUrl: "/uploads/ChickenCaesarSalad.png" },
      { name: "Club Sandwich", description: "Triple-decker sandwich with turkey, bacon, lettuce, tomato, and mayo on toasted bread.", category: "Lunch", price: 11.99, rating: 4.4, hearts: 0, imageUrl: "/uploads/ClubSandwich.png" },
      { name: "Veggie Wrap", description: "Hummus, avocado, cucumber, bell peppers, and mixed greens in a spinach tortilla.", category: "Lunch", price: 10.99, rating: 4.3, hearts: 0, imageUrl: "/uploads/VeggieWrap.png" },
      { name: "Grilled Cheese Sandwich", description: "Melted cheddar and Swiss cheese on buttery grilled sourdough bread.", category: "Lunch", price: 8.99, rating: 4.5, hearts: 0, imageUrl: "/uploads/GrilledCheeseSandwich.png" },
      { name: "Grilled Salmon Bowl", description: "Grilled salmon over brown rice with roasted vegetables and lemon-dill sauce.", category: "Lunch", price: 15.99, rating: 4.7, hearts: 0, imageUrl: "/uploads/GrilledSalmonBowl.png" },
      { name: "Spicy Beef Tacos", description: "Three corn tortillas filled with seasoned beef, pico de gallo, and avocado crema.", category: "Lunch", price: 12.99, rating: 4.5, hearts: 0, imageUrl: "/uploads/SpicyBeefTacos.png" },
      { name: "Sushi Combo", description: "Assortment of fresh nigiri and maki rolls served with wasabi, ginger, and soy sauce.", category: "Lunch", price: 16.99, rating: 4.8, hearts: 0, imageUrl: "/uploads/SushiCombo.png" },
      { name: "Red Chicken Curry", description: "Tender chicken in a spicy coconut curry sauce with vegetables, served with jasmine rice.", category: "Lunch", price: 13.99, rating: 4.6, hearts: 0, imageUrl: "/uploads/RedChickenCurry.png" },
      { name: "Turkey Panini", description: "Sliced turkey, provolone, pesto, and roasted red peppers on pressed ciabatta bread.", category: "Lunch", price: 11.99, rating: 4.4, hearts: 0, imageUrl: "/uploads/TurkeyPanini.png" },
      { name: "Quinoa Salad", description: "Quinoa with roasted vegetables, feta cheese, and lemon-herb vinaigrette.", category: "Lunch", price: 10.99, rating: 4.3, hearts: 0, imageUrl: "/uploads/QuinoaSalad.png" },
      { name: "Pasta Salad", description: "Rotini pasta with cherry tomatoes, mozzarella, olives, and Italian dressing.", category: "Lunch", price: 9.99, rating: 4.2, hearts: 0, imageUrl: "/uploads/PastaSalad.png" },
      { name: "Fish Tacos", description: "Grilled fish in corn tortillas with cabbage slaw, pico de gallo, and lime crema.", category: "Lunch", price: 13.99, rating: 4.7, hearts: 0, imageUrl: "/uploads/FishTacos.png" },
      
      // Dinner items
      { name: "Grilled Ribeye Steak", description: "12oz ribeye steak grilled to perfection, served with roasted vegetables and mashed potatoes.", category: "Dinner", price: 24.99, rating: 4.8, hearts: 0, imageUrl: "/uploads/GrilledRibeyeSteak.png" },
      { name: "Salmon Fillet", description: "Pan-seared salmon fillet with lemon butter sauce, served with asparagus and wild rice.", category: "Dinner", price: 22.99, rating: 4.7, hearts: 0, imageUrl: "/uploads/SalmonFillet.png" },
      { name: "Pasta Primavera", description: "Fettuccine pasta with seasonal vegetables in a light cream sauce.", category: "Dinner", price: 16.99, rating: 4.5, hearts: 0, imageUrl: "/uploads/PastaPrimavera.png" },
      { name: "Chicken Parmesan", description: "Breaded chicken breast topped with marinara sauce and melted mozzarella, served with spaghetti.", category: "Dinner", price: 18.99, rating: 4.6, hearts: 0, imageUrl: "/uploads/ChickenParmesan.png" },
      { name: "Pesto Pasta with Shrimp", description: "Linguine tossed in basil pesto with grilled shrimp and cherry tomatoes.", category: "Dinner", price: 19.99, rating: 4.7, hearts: 0, imageUrl: "/uploads/PestoPastaWithShrimp.png" },
      { name: "Garlic Butter Lamb Chops", description: "Grilled lamb chops with garlic butter, served with roasted potatoes and mint sauce.", category: "Dinner", price: 26.99, rating: 4.8, hearts: 0, imageUrl: "/uploads/GarlicButterLambChops.png" },
      { name: "Vegetarian Stuffed Peppers", description: "Bell peppers stuffed with quinoa, black beans, corn, and cheese, topped with enchilada sauce.", category: "Dinner", price: 17.99, rating: 4.4, hearts: 0, imageUrl: "/uploads/VegetarianStuffedPeppers.png" },
      { name: "Beef Bourguignon", description: "Slow-cooked beef stew with red wine, mushrooms, and pearl onions, served with crusty bread.", category: "Dinner", price: 21.99, rating: 4.6, hearts: 0, imageUrl: "/uploads/BeefBourguignon.png" },
      { name: "Vegetable Stir Fry", description: "Mixed vegetables stir-fried in a savory sauce, served over steamed rice.", category: "Dinner", price: 15.99, rating: 4.3, hearts: 0, imageUrl: "/uploads/VegetableStirFry.png" },
      { name: "Shrimp Scampi", description: "Sautéed shrimp in garlic butter and white wine sauce, served over linguine.", category: "Dinner", price: 20.99, rating: 4.7, hearts: 0, imageUrl: "/uploads/ShrimpScampi.png" },
      { name: "Lamb Chops", description: "Herb-crusted lamb chops with rosemary-infused demi-glace, served with mashed potatoes.", category: "Dinner", price: 25.99, rating: 4.8, hearts: 0, imageUrl: "/uploads/LambChops.png" },
      
      // Mexican items
      { name: "Tacos al Pastor", description: "Marinated pork tacos with pineapple, onion, and cilantro on corn tortillas.", category: "Mexican", price: 13.99, rating: 4.7, hearts: 0, imageUrl: "/uploads/TacosalPastor.png" },
      { name: "Chicken Quesadilla", description: "Flour tortilla filled with grilled chicken, melted cheese, and peppers, served with salsa and sour cream.", category: "Mexican", price: 12.99, rating: 4.5, hearts: 0, imageUrl: "/uploads/ChickenQuesadilla.png" },
      { name: "Enchiladas", description: "Corn tortillas filled with cheese and topped with red sauce, served with rice and beans.", category: "Mexican", price: 14.99, rating: 4.6, hearts: 0, imageUrl: "/uploads/Enchiladas.png" },
      { name: "Fajitas", description: "Sizzling plate of grilled chicken or beef with peppers and onions, served with tortillas and toppings.", category: "Mexican", price: 16.99, rating: 4.7, hearts: 0, imageUrl: "/uploads/Fajitas.png" },
      { name: "Chiles Rellenos", description: "Poblano peppers stuffed with cheese, battered and fried, topped with tomato sauce.", category: "Mexican", price: 15.99, rating: 4.5, hearts: 0, imageUrl: "/uploads/ChilesRellenos.png" },
      { name: "Mole Poblano", description: "Chicken in a rich chocolate-chili sauce, served with rice and tortillas.", category: "Mexican", price: 17.99, rating: 4.6, hearts: 0, imageUrl: "/uploads/MolePoblano.png" },
      { name: "Pozole Rojo", description: "Traditional Mexican soup with hominy and pork in a red chili broth.", category: "Mexican", price: 14.99, rating: 4.5, hearts: 0, imageUrl: "/uploads/PozoleRojo.png" },
      { name: "Churros", description: "Fried dough pastry dusted with cinnamon sugar, served with chocolate dipping sauce.", category: "Mexican", price: 8.99, rating: 4.7, hearts: 0, imageUrl: "/uploads/Churros.png" },
      { name: "Nachos", description: "Tortilla chips topped with melted cheese, beans, jalapeños, guacamole, and sour cream.", category: "Mexican", price: 11.99, rating: 4.4, hearts: 0, imageUrl: "/uploads/Nachos.png" },
      { name: "Burrito", description: "Large flour tortilla filled with rice, beans, cheese, and your choice of meat.", category: "Mexican", price: 13.99, rating: 4.6, hearts: 0, imageUrl: "/uploads/Burrito.png" },
      { name: "Tamales", description: "Corn masa filled with seasoned meat, steamed in corn husks.", category: "Mexican", price: 12.99, rating: 4.5, hearts: 0, imageUrl: "/uploads/Tamales.png" },
      { name: "Chilaquiles", description: "Fried tortilla chips simmered in salsa, topped with cheese, cream, and eggs.", category: "Mexican", price: 11.99, rating: 4.4, hearts: 0, imageUrl: "/uploads/Chilaquiles.png" },
      
      // Indian items
      { name: "Kebab", description: "Grilled skewers of marinated meat and vegetables, served with mint chutney.", category: "Indian", price: 14.99, rating: 4.6, hearts: 0, imageUrl: "/uploads/Kebab.png" },
      { name: "Chicken Tikka", description: "Tandoori-roasted chicken pieces marinated in yogurt and spices.", category: "Indian", price: 15.99, rating: 4.7, hearts: 0, imageUrl: "/uploads/ChickenTikka.png" },
      { name: "Desi Chowmein", description: "Indian-style stir-fried noodles with vegetables and spices.", category: "Indian", price: 13.99, rating: 4.5, hearts: 0, imageUrl: "/uploads/DesiChowmein.png" },
      { name: "Chicken Chargha", description: "Whole chicken marinated in spices and deep-fried, Pakistani style.", category: "Indian", price: 18.99, rating: 4.8, hearts: 0, imageUrl: "/uploads/ChickenChargha.png" },
      { name: "Paneer Tikka", description: "Cubes of cottage cheese marinated in spices and grilled in a tandoor.", category: "Indian", price: 14.99, rating: 4.6, hearts: 0, imageUrl: "/uploads/PannerTikka.png" },
      { name: "Masala Dosa", description: "Crispy rice crepe filled with spiced potatoes, served with sambar and chutney.", category: "Indian", price: 12.99, rating: 4.5, hearts: 0, imageUrl: "/uploads/MasalaDosa.png" },
      { name: "Palak Paneer", description: "Cottage cheese cubes in a creamy spinach sauce, served with naan.", category: "Indian", price: 15.99, rating: 4.6, hearts: 0, imageUrl: "/uploads/PalakPaneer.png" },
      { name: "Gulab Jamun", description: "Deep-fried milk solids soaked in sugar syrup, a classic Indian dessert.", category: "Indian", price: 7.99, rating: 4.7, hearts: 0, imageUrl: "/uploads/GulabJamun.png" },
      
      // Desserts
      { name: "Baklava", description: "Layers of phyllo pastry filled with chopped nuts and sweetened with honey syrup.", category: "Dessert", price: 8.99, rating: 4.7, hearts: 0, imageUrl: "/uploads/Baklava.png" },
      { name: "Gelato", description: "Italian-style ice cream in various flavors, denser and richer than regular ice cream.", category: "Dessert", price: 6.99, rating: 4.6, hearts: 0, imageUrl: "/uploads/Gelato.png" },
      { name: "Caramel Macchiato", description: "Espresso with steamed milk, vanilla syrup, and caramel drizzle.", category: "Beverage", price: 5.99, rating: 4.5, hearts: 0, imageUrl: "/uploads/CaramelMacchiato.png" }
    ];
    
    // Insert new items
    const result = await Item.insertMany(menuItems);
    console.log(`Successfully loaded ${result.length} menu items into database`);
  } catch (error) {
    console.error('Error loading initial data:', error);
    throw error;
  }
};

// Function to update image URLs for all items to use local paths
const updateItemImageUrls = async (Item) => {
  try {
    console.log('=== UPDATING ITEM IMAGE URLS ===');
    
    // Get list of all image files in uploads directory
    const uploadsDir = path.join(process.cwd(), 'uploads', 'images');
    if (!fs.existsSync(uploadsDir)) {
      console.log('Uploads directory not found, skipping image URL update');
      return;
    }
    
    const imageFiles = fs.readdirSync(uploadsDir);
    console.log(`Found ${imageFiles.length} image files in uploads directory`);
    
    // Create a map of filename to full path (without extension matching)
    const imageMap = {};
    imageFiles.forEach(file => {
      const nameWithoutExt = path.parse(file).name;
      imageMap[nameWithoutExt] = `/uploads/images/${file}`;
    });
    
    // Get all items from database
    const items = await Item.find({});
    console.log(`Found ${items.length} items in database`);
    
    let updatedCount = 0;
    
    // Update each item
    for (const item of items) {
      // Check if item has a Cloudinary URL or no image URL
      if (!item.imageUrl || item.imageUrl.includes('res.cloudinary.com')) {
        console.log(`Processing item: ${item.name}`);
        
        // Try to find a matching local image
        const itemNameClean = item.name.replace(/[^a-zA-Z0-9\s]/g, '').trim();
        const possibleNames = [
          item.name,
          itemNameClean,
          itemNameClean.replace(/\s+/g, '-'),
          itemNameClean.replace(/\s+/g, '_'),
          itemNameClean.replace(/\s+/g, ''),
          // Try without common suffixes
          itemNameClean.replace(/\s+(Shot|Drink|Webp|Jpg|Png)$/i, ''),
        ];
        
        let foundLocalImage = false;
        
        for (const name of possibleNames) {
          // Look for exact match first
          if (imageMap[name]) {
            console.log(`  Found exact match: ${name}`);
            item.imageUrl = imageMap[name];
            await item.save();
            updatedCount++;
            foundLocalImage = true;
            break;
          }
          
          // Look for partial matches
          const matchingKeys = Object.keys(imageMap).filter(key => 
            key.toLowerCase().includes(name.toLowerCase()) || 
            name.toLowerCase().includes(key.toLowerCase())
          );
          
          if (matchingKeys.length > 0) {
            console.log(`  Found partial match: ${matchingKeys[0]}`);
            item.imageUrl = imageMap[matchingKeys[0]];
            await item.save();
            updatedCount++;
            foundLocalImage = true;
            break;
          }
        }
        
        if (!foundLocalImage) {
          console.log(`  No matching local image found for: ${item.name}`);
        }
      }
    }
    
    console.log(`Updated ${updatedCount} items with local image URLs`);
    console.log('=== IMAGE URL UPDATE COMPLETE ===');
    
  } catch (error) {
    console.error('Error updating image URLs:', error);
  }
};

const app = express();
// Use PORT from environment variable (Render will set this) or default to 10000 for Render
// Render typically uses PORT
const PORT = process.env.PORT || process.env.$PORT || process.env.RENDER_PORT || 10000;

// Log PORT detection for debugging
console.log('PORT Detection:');
console.log('- process.env.PORT:', process.env.PORT);
console.log('- process.env.$PORT:', process.env.$PORT);
console.log('- process.env.RENDER_PORT:', process.env.RENDER_PORT);
console.log('- Final PORT value:', PORT);

// Add a simple test endpoint at the very beginning
app.get('/test-very-beginning', (req, res) => {
  res.json({ 
    message: 'Test endpoint at very beginning is working',
    timestamp: new Date().toISOString()
  });
});

// Add middleware to log all requests
app.use((req, res, next) => {
  console.log(`=== REQUEST RECEIVED ===`);
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log(`Headers:`, req.headers);
  console.log(`========================`);
  next();
});

// Add early health check endpoint - this should be one of the first routes
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    message: 'Server is running correctly',
    timestamp: new Date().toISOString(),
    database: databaseConnected ? 'connected' : 'disconnected',
    serverReady: serverReady,
    port: PORT
  });
});

// Log the port for debugging
console.log(`=== SERVER CONFIGURATION ===`);
console.log(`PORT: ${PORT}`);
console.log(`Environment variables:`);
console.log(`- PORT: ${process.env.PORT}`);
console.log(`- $PORT: ${process.env.$PORT}`);
console.log(`- RAILWAY_PORT: ${process.env.RAILWAY_PORT}`);
console.log(`===========================`);

// Add compression middleware for better performance
app.use(compression({
  level: 6, // Medium compression level
  threshold: 1024, // Only compress responses larger than 1KB
  filter: (req, res) => {
    // Don't compress streaming responses
    if (req.headers['x-no-compression']) {
      return false;
    }
    // Use compression filter function
    return compression.filter(req, res);
  }
}));

// Add security headers
app.use((req, res, next) => {
  // Prevent XSS attacks
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  // Enable DNS prefetching control
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  next();
});

// Configure CORS with a dynamic origin function to allow all Vercel subdomains
const corsOptions = {
  origin: function (origin, callback) {
    // List of allowed origins from environment variable
    let allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      process.env.FRONTEND_URL || 'http://localhost:5173',
      process.env.ADMIN_URL || 'http://localhost:5174',
      'https://foodiefrenzy-frontend.vercel.app',
      'https://foodiefrenzy-admin.vercel.app',
      'https://foodiefrenzy-5hdf.vercel.app', // Add the specific admin deployment URL
      'https://foodiefrenzy-nine.vercel.app',
      'https://admin-7y4pypy16-podfuse676-6967s-projects.vercel.app',
      'https://www.lakeshoreconvenience.com', // Add custom domain
      'https://lakeshoreconvenience.com', // Add custom domain without www
      'https://admin.lakeshoreconvenience.com', // Add custom admin domain
      'https://*.lakeshore-convenience.pages.dev' // Add Cloudflare Pages wildcard
    ];
    
    // Add origins from CORS_ORIGIN environment variable if set
    if (process.env.CORS_ORIGIN) {
      const corsOrigins = process.env.CORS_ORIGIN.split(',').map(origin => origin.trim());
      allowedOrigins = [...allowedOrigins, ...corsOrigins];
    }
    
    console.log('=== CORS REQUEST ===');
    console.log('Origin:', origin);
    console.log('Allowed origins:', allowedOrigins);
    
    // Allow requests with no origin (like mobile apps, curl requests, or server-to-server requests)
    if (!origin) {
      console.log('No origin provided, allowing request (common for server-to-server or mobile app requests)');
      return callback(null, true);
    }
    
    // Check if the origin is in our allowed list
    if (allowedOrigins.includes(origin)) {
      console.log('Origin is in allowed list, allowing request');
      return callback(null, true);
    }
    
    // Check if it's a Vercel subdomain
    if (origin && origin.endsWith('.vercel.app')) {
      console.log('Origin is a Vercel subdomain, allowing request');
      return callback(null, true);
    }
    
    // Check if it's our custom domain
    if (origin && (origin.includes('lakeshoreconvenience.com'))) {
      console.log('Origin is our custom domain, allowing request');
      return callback(null, true);
    }
    
    // Check if it's a Cloudflare Pages subdomain (explicit check)
    if (origin && origin.endsWith('.lakeshore-convenience.pages.dev')) {
      console.log('Origin is a Cloudflare Pages subdomain, allowing request');
      return callback(null, true);
    }
    
    // Check if it matches any of the CORS_ORIGIN values
    if (process.env.CORS_ORIGIN) {
      const corsOrigins = process.env.CORS_ORIGIN.split(',').map(o => o.trim());
      if (corsOrigins.includes(origin)) {
        console.log('Origin matches CORS_ORIGIN, allowing request');
        return callback(null, true);
      }
    }
    
    // Reject the request
    console.log('Origin not allowed, rejecting request');
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
};

app.use(cors(corsOptions));

// Add caching headers for static assets
app.use(express.static('public', {
  maxAge: '1y',
  etag: false
}));

// Add cookie parser and body parsers BEFORE rate limiting
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Add rate limiting middleware for protection against abuse
// General rate limiter for all requests
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Handle X-Forwarded-For headers for proxy environments
  keyGenerator: (req) => {
    // Use X-Forwarded-For header if available (for proxy environments)
    if (req.headers['x-forwarded-for']) {
      return req.headers['x-forwarded-for'].split(',')[0].trim();
    }
    // Fallback to connection remote address
    return req.ip;
  },
  // Add skipSuccessfulRequests to reduce load on successful requests
  skipSuccessfulRequests: false
});

// Specific rate limiter for login attempts to prevent brute force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login requests per windowMs
  message: {
    error: 'Too many login attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Handle X-Forwarded-For headers for proxy environments
  keyGenerator: (req) => {
    // Use X-Forwarded-For header if available (for proxy environments)
    if (req.headers['x-forwarded-for']) {
      return req.headers['x-forwarded-for'].split(',')[0].trim();
    }
    // Fallback to connection remote address
    return req.ip;
  },
  skipSuccessfulRequests: true
});

// Specific rate limiter for API endpoints to handle high traffic
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Higher limit for API endpoints
  message: {
    error: 'API rate limit exceeded, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Handle X-Forwarded-For headers for proxy environments
  keyGenerator: (req) => {
    // Use X-Forwarded-For header if available (for proxy environments)
    if (req.headers['x-forwarded-for']) {
      return req.headers['x-forwarded-for'].split(',')[0].trim();
    }
    // Fallback to connection remote address
    return req.ip;
  },
  skipSuccessfulRequests: false
});

// Apply rate limiting to all requests
app.use(generalLimiter);

// Apply stricter rate limiting to auth endpoints
app.use('/api/auth', loginLimiter);
app.use('/api/users/login', loginLimiter);

// Apply higher rate limiting to API endpoints
app.use('/api/', apiLimiter);

// Track server readiness
let serverReady = false;
let serverStartupError = null;
let databaseConnected = false;

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

// Log startup process
console.log('=== SERVER STARTUP PROCESS ===');
console.log('Starting server initialization...');
console.log('Node version:', process.version);
console.log('Current working directory:', process.cwd());

// Connect to database
console.log('Attempting to connect to database...');
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI environment variable is not set!');
  console.error('Server will start but database features will not work.');
  serverReady = true;
  databaseConnected = false;
} else {
  connectDB().then(async () => {
    console.log('Database connected successfully');
    serverReady = true;
    databaseConnected = true;
    
    // Load initial data if collection is empty
    try {
      const Item = (await import('./modals/item.js')).default;
      const itemCount = await Item.countDocuments();
      console.log(`Found ${itemCount} items in database`);
      
      if (itemCount === 0) {
        console.log('Database is empty, loading initial data...');
        await loadInitialData(Item);
      }
      
      // Always update image URLs to use local paths
      console.log('Updating item image URLs to use local paths...');
      await updateItemImageUrls(Item);
      
    } catch (error) {
      console.error('Error checking/loading initial data:', error);
    }
  }).catch((error) => {
    console.error('Failed to connect to database:', error);
    serverStartupError = error;
    // Even if database connection fails, we'll still start the server
    // The health check will show the database status
    serverReady = true;
    databaseConnected = false;
  });
}

// Add a middleware to check if server is ready
app.use((req, res, next) => {
  if (!serverReady) {
    if (serverStartupError) {
      return res.status(503).json({ 
        status: 'Service Unavailable', 
        message: 'Server failed to initialize',
        error: serverStartupError.message
      });
    } else {
      return res.status(503).json({ 
        status: 'Service Unavailable', 
        message: 'Server is still initializing' 
      });
    }
  }
  next();
});

// Log route registration
console.log('=== REGISTERING ROUTES ===');

// Routes
console.log('Registering /api/items routes');
app.use('/api/items', itemRoutes);
console.log('Registering /api/cart routes');
app.use('/api/cart', cartRoutes);
console.log('Registering /api/orders routes');
app.use('/api/orders', orderRoutes);
console.log('Registering /api/orders (new) routes');
app.use('/api/orders', newOrderRoutes);
console.log('Registering /api/users routes');
app.use('/api/users', userRoutes);
console.log('Registering /api/auth routes');
app.use('/api/auth', phoneAuthRoutes);
console.log('Registering /api/email-auth routes');
app.use('/api/email-auth', emailAuthRoutes);
console.log('Registering /api/whatsapp-auth routes');
app.use('/api/whatsapp-auth', whatsappAuthRoutes);
console.log('Registering /api/email-otp routes'); // Add email OTP routes
app.use('/api/email-otp', emailOTPRoutes); // Add email OTP routes
console.log('Registering /api/reviews routes');
app.use('/api/reviews', reviewRoutes);
console.log('Registering /api/test routes');
app.use('/api/test', testRoutes);

console.log('=== ROUTES REGISTERED ===');

// Add a middleware to check database connection for API routes
// This needs to be applied AFTER routes are registered so that route handlers
// can process requests before this middleware checks the database connection
const checkDatabaseConnection = (req, res, next) => {
  // Skip database check for health and test endpoints
  if (req.path === '/health' || req.path.startsWith('/test')) {
    return next();
  }
  
  // For API routes, check if database is connected
  if (!databaseConnected && req.path.startsWith('/api')) {
    return res.status(503).json({ 
      status: 'Service Unavailable', 
      message: 'Database connection unavailable',
      details: 'The database is not connected. Please check the database configuration.'
    });
  }
  
  next();
};


// Apply database connection check middleware AFTER routes are registered
// But before the 404 handler to ensure routes are properly handled
app.use('/api', checkDatabaseConnection);

// Serve static files from uploads directory (for local fallback)
// Note: With Cloudinary, images will be served directly from Cloudinary URLs
app.use('/uploads', express.static('uploads'));

// Add a route to serve images with proper headers (for local fallback)
app.get('/uploads/images/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(process.cwd(), 'uploads', 'images', imageName);
  
  console.log(`Request for image: ${imageName}`);
  console.log(`Looking for file at: ${imagePath}`);
  
  // Check if file exists
  if (!fs.existsSync(imagePath)) {
    console.log(`Image not found: ${imagePath}`);
    return res.status(404).json({ message: 'Image not found' });
  }
  
  // Set cache headers for better performance
  res.set('Cache-Control', 'public, max-age=31536000'); // 1 year
  
  // Serve the image file
  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error('Error serving image:', err);
      res.status(500).json({ message: 'Error serving image' });
    }
  });
});

// Add a route to list all available images (for debugging - local fallback)
app.get('/uploads/images', (req, res) => {
  const imagesDir = path.join(process.cwd(), 'uploads', 'images');
  
  // Check if directory exists
  if (!fs.existsSync(imagesDir)) {
    return res.status(404).json({ message: 'Images directory not found' });
  }
  
  // Read directory contents
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      console.error('Error reading images directory:', err);
      return res.status(500).json({ message: 'Error reading images directory' });
    }
    
    // Filter to only include image files
    const imageFiles = files.filter(file => 
      file.endsWith('.jpg') || file.endsWith('.jpeg') || 
      file.endsWith('.png') || file.endsWith('.gif') || 
      file.endsWith('.webp')
    );
    
    res.json({
      message: 'Available images',
      images: imageFiles,
      count: imageFiles.length
    });
  });
});

// Add a simple file upload endpoint for testing
app.post('/api/test-upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  res.json({
    message: 'File uploaded successfully',
    filename: req.file.filename,
    path: req.file.path,
    url: req.file.secure_url || req.file.path
  });
});

// Add a simple test endpoint before route registration
app.get('/test-before-routes', (req, res) => {
  res.json({ 
    message: 'Test endpoint before routes is working',
    timestamp: new Date().toISOString()
  });
});

// Add a test endpoint after middleware
app.get('/test-after-middleware', (req, res) => {
  res.json({ 
    message: 'Test endpoint after middleware is working',
    timestamp: new Date().toISOString()
  });
});

// Add a debug endpoint to check environment variables
app.get('/api/debug-env', (req, res) => {
  res.json({
    MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'NOT SET',
    JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
    NODE_ENV: process.env.NODE_ENV || 'NOT SET',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'NOT SET',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || 'NOT SET',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET',
    dbConnectionState: mongoose.connection.readyState,
    dbConnectionHost: mongoose.connection.host,
    dbConnectionName: mongoose.connection.name,
    PORT: process.env.PORT || 'NOT SET',
    // Add Render-specific environment variables
    RENDER: process.env.RENDER || 'NOT SET',
    RENDER_SERVICE_ID: process.env.RENDER_SERVICE_ID || 'NOT SET',
    RENDER_EXTERNAL_HOSTNAME: process.env.RENDER_EXTERNAL_HOSTNAME || 'NOT SET',
    // Add email-specific environment variables
    EMAIL_USER: process.env.EMAIL_USER ? 'SET' : 'NOT SET',
    EMAIL_PASS: process.env.EMAIL_PASS ? 'SET' : 'NOT SET',
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY ? 'SET' : 'NOT SET'
  });
});

// ADD THIS NEW ENDPOINT FOR CLEANING UP ORDERS
// WARNING: This endpoint should be removed after use or protected with authentication

// Add a test email endpoint
app.post('/api/test-email', async (req, res) => {
  try {
    console.log('=== EMAIL TEST ENDPOINT ===');
    console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'SET' : 'NOT SET');
    console.log('FROM_EMAIL:', process.env.FROM_EMAIL ? 'SET' : 'NOT SET');
    
    // Import and test email services
    const resendEmailService = await import('./services/resendEmailService.js');
    
    console.log('Resend service initialized:', resendEmailService.default.resend ? 'YES' : 'NO');
    
    res.json({
      message: 'Email configuration check completed',
      resendApiKey: process.env.RESEND_API_KEY ? 'SET' : 'NOT SET',
      fromEmail: process.env.FROM_EMAIL ? 'SET' : 'NOT SET',
      services: {
        resend: resendEmailService.default.resend ? 'INITIALIZED' : 'NOT INITIALIZED'
      }
    });
  } catch (error) {
    console.error('Error in email test endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add a comprehensive email service test endpoint
app.post('/api/test-email-services', async (req, res) => {
  try {
    console.log('=== COMPREHENSIVE EMAIL SERVICE TEST ===');
    
    // Import Resend email service
    const resendEmailService = await import('./services/resendEmailService.js');
    
    console.log('Resend service imported successfully');
    
    // Check initialization status
    const serviceStatus = {
      resend: {
        imported: !!resendEmailService.default,
        initialized: resendEmailService.default.resend ? 'YES' : 'NO'
      }
    };
    
    console.log('Service Status:', JSON.stringify(serviceStatus, null, 2));
    
    // Try to send a test email with Resend service
    const testResults = {};
    const testEmail = process.env.FROM_EMAIL || 'test@example.com';
    const testOtp = '123456';
    
    console.log(`Testing Resend email service with ${testEmail}`);
    
    // Test Resend service
    try {
      console.log('Testing Resend email service...');
      const result = await resendEmailService.default.sendOTP(testEmail, testOtp);
      testResults.resend = result;
      console.log('Resend service result:', result);
    } catch (error) {
      testResults.resend = { success: false, error: error.message };
      console.log('Resend service error:', error.message);
    }
    
    res.json({
      message: 'Email service test completed',
      environment: {
        resendApiKey: process.env.RESEND_API_KEY ? 'SET' : 'NOT SET',
        fromEmail: process.env.FROM_EMAIL ? 'SET' : 'NOT SET'
      },
      serviceStatus,
      testResults
    });
  } catch (error) {
    console.error('Error in comprehensive email service test:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

app.delete('/api/orders/cleanup', async (req, res) => {
  try {
    // This should only be used in development or by authorized admins
    // For production, this should be protected with proper authentication
    console.log('Cleaning up all orders...');
    const Order = (await import('./modals/order.js')).default;
    const result = await Order.deleteMany({});
    console.log(`Removed ${result.deletedCount} orders`);
    res.json({ message: `Successfully removed ${result.deletedCount} orders`, deletedCount: result.deletedCount });
  } catch (error) {
    console.error('Error cleaning up orders:', error);
    res.status(500).json({ message: 'Error cleaning up orders', error: error.message });
  }
});

// Test endpoint to verify database connection and user lookup
app.get('/api/test-db', async (req, res) => {
  try {
    console.log('Testing database connection...');
    const users = await User.find({}, 'username email role');
    console.log('Users found:', users.length);
    res.json({
      success: true,
      message: 'Database connection successful',
      userCount: users.length,
      users: users.map(u => ({
        username: u.username,
        email: u.email,
        role: u.role
      }))
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Test endpoint to explicitly look for the admin user
app.get('/api/test-admin', async (req, res) => {
  try {
    console.log('Testing admin user lookup...');
    const user = await User.findOne({ email: 'admin@foodiefrenzy.com' });
    console.log('Admin user lookup result:', user ? 'Found' : 'Not found');
    
    if (user) {
      res.json({
        success: true,
        message: 'Admin user found',
        user: {
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } else {
      res.json({
        success: false,
        message: 'Admin user not found'
      });
    }
  } catch (error) {
    console.error('Admin user test error:', error);
    res.status(500).json({
      success: false,
      message: 'Admin user lookup failed',
      error: error.message
    });
  }
});

// Test endpoint to verify Cloudinary configuration
app.get('/api/test-cloudinary', async (req, res) => {
  try {
    console.log('=== TESTING CLOUDINARY CONFIGURATION ===');
    
    // Import the configured Cloudinary instance
    const cloudinary = (await import('./config/cloudinary.js')).default;
    
    // Get current configuration
    
    const config = cloudinary.config();
    console.log('Current Cloudinary config:', config);
    
    // Test ping Cloudinary
    const pingResult = await cloudinary.api.ping();
    console.log('Cloudinary ping result:', pingResult);
    
    res.json({
      success: true,
      message: 'Cloudinary is properly configured',
      config: {
        cloud_name: config.cloud_name,
        api_key: config.api_key ? 'SET' : 'NOT SET'
      },
      ping: pingResult
    });
  } catch (error) {
    console.error('Cloudinary test error:', error);
    res.status(500).json({
      success: false,
      message: 'Cloudinary configuration error',
      error: error.message
    });
  }
});

// Test endpoint to verify item ID format
app.get('/api/test-item-id/:id', (req, res) => {
  const { id } = req.params;
  console.log('=== TESTING ITEM ID ===');
  console.log('Item ID:', id);
  console.log('Item ID length:', id ? id.length : 0);
  
  // Validate MongoDB ObjectId format
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  const isValid = objectIdRegex.test(id);
  
  console.log('Is valid ObjectId format:', isValid);
  
  res.json({
    id: id,
    length: id ? id.length : 0,
    isValidObjectId: isValid,
    details: isValid 
      ? 'This is a valid MongoDB ObjectId format' 
      : 'This is NOT a valid MongoDB ObjectId format. It should be 24 hexadecimal characters (0-9, a-f, A-F).'
  });
});

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'Server is running!', 
    port: PORT,
    version: '1.0.0', // Added version for deployment tracking
    timestamp: new Date().toISOString()
  });
});

// Simple test endpoint to check environment variables
app.get('/test-env', (req, res) => {
  res.json({
    MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'NOT SET',
    JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
    NODE_ENV: process.env.NODE_ENV || 'NOT SET',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'NOT SET',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET',
    PORT: process.env.PORT || 'NOT SET'
  });
});

// Test endpoint to simulate login function
app.get('/test-login', async (req, res) => {
  try {
    console.log('Test login endpoint called');
    
    // Import the user model
    const User = (await import('./modals/userModel.js')).default;
    
    console.log('User model imported');
    
    // Perform the exact same query as in the login function
    const user = await User.findOne({ email: 'admin@foodiefrenzy.com' });
    
    console.log('User lookup result:', user ? 'Found' : 'Not found');
    console.log('Database connection state:', mongoose.connection.readyState);
    console.log('Database connection host:', mongoose.connection.host);
    console.log('Database connection name:', mongoose.connection.name);
    
    if (!user) {
      return res.json({ success: false, message: "User Doesn't Exist" });
    }
    
    res.json({ 
      success: true, 
      message: "User found",
      user: {
        email: user.email,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Test login error:', error);
    res.status(500).json({ success: false, message: "Error", error: error.message });
  }
});

// Duplicate health endpoint removed to avoid conflicts

// Simple test endpoint to check if we can find the admin user
app.get('/test-admin-user', async (req, res) => {
  try {
    console.log('Testing admin user lookup...');
    
    // Import the user model
    const User = (await import('./modals/userModel.js')).default;
    
    // Try to find the admin user
    const user = await User.findOne({ email: 'admin@foodiefrenzy.com' });
    console.log('Admin user lookup result:', user ? 'Found' : 'Not found');
    
    if (user) {
      res.json({
        success: true,
        message: 'Admin user found',
        user: {
          email: user.email,
          username: user.username,
          role: user.role
        }
      });
    } else {
      res.json({
        success: false,
        message: 'Admin user not found'
      });
    }
  } catch (error) {
    console.error('Test admin user error:', error);
    res.status(500).json({
      success: false,
      message: 'Admin user lookup failed',
      error: error.message
    });
  }
});

// Test endpoint to explicitly use the user model to find the admin user
app.get('/test-admin-user-explicit', async (req, res) => {
  try {
    console.log('Testing admin user lookup with explicit model...');
    
    // Import the user model
    const userModel = (await import('./modals/userModel.js')).default;
    
    // Use the user model to find the admin user
    const user = await userModel.findOne({ email: 'admin@foodiefrenzy.com' });
    console.log('Admin user lookup result with explicit model:', user ? 'Found' : 'Not found');
    
    if (user) {
      res.json({
        success: true,
        message: 'Admin user found with explicit model',
        user: {
          email: user.email,
          username: user.username,
          role: user.role
        }
      });
    } else {
      res.json({
        success: false,
        message: 'Admin user not found with explicit model'
      });
    }
  } catch (error) {
    console.error('Test admin user error with explicit model:', error);
    res.status(500).json({
      success: false,
      message: 'Error testing admin user with explicit model',
      error: error.message
    });
  }
});

// Test endpoint to explicitly connect to the database and find the admin user
app.get('/test-admin-user-db', async (req, res) => {
  try {
    console.log('Testing admin user lookup with explicit database connection...');
    
    // Import mongoose
    const mongoose = (await import('mongoose')).default;
    
    // Get the database connection
    const db = mongoose.connection;
    
    // Check if we're connected
    if (db.readyState !== 1) {
      console.log('Database not connected');
      return res.status(500).json({
        success: false,
        message: 'Database not connected'
      });
    }
    
    // Import the user model
    const User = (await import('./modals/userModel.js')).default;
    
    // Try to find the admin user
    const user = await User.findOne({ email: 'admin@foodiefrenzy.com' });
    console.log('Admin user lookup result with explicit database connection:', user ? 'Found' : 'Not found');
    
    if (user) {
      res.json({
        success: true,
        message: 'Admin user found with explicit database connection',
        user: {
          email: user.email,
          username: user.username,
          role: user.role
        }
      });
    } else {
      res.json({
        success: false,
        message: 'Admin user not found with explicit database connection'
      });
    }
  } catch (error) {
    console.error('Test admin user error with explicit database connection:', error);
    res.status(500).json({
      success: false,
      message: 'Error testing admin user with explicit database connection',
      error: error.message
    });
  }
});

// Test endpoint to create an admin user
app.post('/test-create-admin', async (req, res) => {
  try {
    console.log('Creating test admin user...');
    
    // Import required modules
    const bcrypt = (await import('bcryptjs')).default;
    const User = (await import('./modals/userModel.js')).default;
    
    // Check if admin user already exists
    const existingUser = await User.findOne({ email: 'admin@foodiefrenzy.com' });
    if (existingUser) {
      console.log('Admin user already exists');
      return res.json({
        success: false,
        message: 'Admin user already exists'
      });
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    // Create the admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@foodiefrenzy.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    // Save the user
    const savedUser = await adminUser.save();
    console.log('Admin user created successfully:', savedUser.email);
    
    res.json({
      success: true,
      message: 'Admin user created successfully',
      user: {
        email: savedUser.email,
        username: savedUser.username,
        role: savedUser.role
      }
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating admin user',
      error: error.message
    });
  }
});

// Endpoint to reset admin password (for testing purposes)
app.post('/reset-admin-password', async (req, res) => {
  try {
    console.log('Resetting admin password...');
    
    // Import required modules
    const bcrypt = (await import('bcryptjs')).default;
    const User = (await import('./modals/userModel.js')).default;
    
    // Find the admin user
    const adminUser = await User.findOne({ email: 'admin@foodiefrenzy.com' });
    if (!adminUser) {
      console.log('Admin user not found');
      return res.json({
        success: false,
        message: 'Admin user not found'
      });
    }
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    // Update the password
    adminUser.password = hashedPassword;
    await adminUser.save();
    
    console.log('Admin password reset successfully');
    
    res.json({
      success: true,
      message: 'Admin password reset successfully'
    });
  } catch (error) {
    console.error('Error resetting admin password:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting admin password',
      error: error.message
    });
  }
});

// Add robots.txt endpoint
app.get('/robots.txt', (req, res) => {
  const baseUrl = process.env.FRONTEND_URL || process.env.VITE_FRONTEND_URL || 'https://lakeshoreconvenience.com';
  
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /cart
Disallow: /checkout
Disallow: /myorder
Disallow: /login
Disallow: /signup
Disallow: /phone-login

Sitemap: ${baseUrl}/sitemap.xml

User-agent: AdsBot-Google
Allow: /
Disallow: /api/
Disallow: /admin/

User-agent: GPTBot
Disallow: /

User-agent: ChatGPT
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: PerplexityBot
Disallow: /

User-agent: Anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /

User-agent: FacebookBot
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Omgilibot
Disallow: /

User-agent: Omgili
Disallow: /
`;

  res.header('Content-Type', 'text/plain');
  res.status(200).send(robotsTxt);
});

// Add sitemap.xml generation endpoint
app.get('/sitemap.xml', async (req, res) => {
  try {
    // Import the Item model
    const Item = (await import('./modals/item.js')).default;
    
    // Get all items from the database
    const items = await Item.find({}, 'name category _id updatedAt');
    
    // Get the base URL from environment or default
    const baseUrl = process.env.FRONTEND_URL || process.env.VITE_FRONTEND_URL || 'https://lakeshoreconvenience.com';
    
    // Generate sitemap XML
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/menu</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  ${items.map(item => `
  <url>
    <loc>${baseUrl}/item/${item._id}</loc>
    <lastmod>${item.updatedAt ? new Date(item.updatedAt).toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.status(200).send(sitemapXml);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// Add a route to update item images with correct Cloudinary URLs
app.post('/api/update-item-images', async (req, res) => {
  try {
    console.log('=== UPDATE ITEM IMAGES REQUEST ===');
    
    // Import the Item model
    const Item = (await import('./modals/item.js')).default;
    
    // Import cloudinary
    const cloudinary = (await import('cloudinary')).v2;
    
    // List all resources in the foodiefrenzy_items folder
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'foodiefrenzy_items/',
      max_results: 500
    });
    
    console.log(`Found ${result.resources.length} images in Cloudinary.`);
    
    // Map of item names to their correct Cloudinary URLs (use the most recent)
    const itemImageMap = {};
    
    // Process all Cloudinary images to build the mapping
    result.resources.forEach(resource => {
      // Extract the item name from the public_id (before the timestamp)
      const parts = resource.public_id.split('/');
      if (parts.length > 1) {
        const filename = parts[1];
        // Remove the timestamp part (after the last underscore)
        const nameParts = filename.split('_');
        if (nameParts.length > 1) {
          nameParts.pop(); // Remove timestamp
          const itemName = nameParts.join('_').replace(/-/g, ' '); // Convert underscores to spaces
          
          // Only store the most recent image for each item
          if (!itemImageMap[itemName] || resource.created_at > itemImageMap[itemName].created_at) {
            itemImageMap[itemName] = {
              url: resource.secure_url,
              created_at: resource.created_at
            };
          }
        }
      }
    });
    
    // Items we need to update
    const targetItems = [
      'Wiper Fluid',
      'Tire Cleaner',
      'Dashboard Polish',
      'Car Air Freshener',
      'Car Perfume'
    ];
    
    let updatedCount = 0;
    let notFoundCount = 0;
    const updateResults = [];
    
    // Update each target item
    for (const itemName of targetItems) {
      try {
        console.log(`\nProcessing item: ${itemName}`);
        
        // Find the item in the database
        const item = await Item.findOne({ 
          name: { $regex: new RegExp(itemName, 'i') } // Case insensitive match
        });
        
        if (!item) {
          console.log(`  ⚠️  Item not found in database: ${itemName}`);
          updateResults.push({
            item: itemName,
            status: 'not_found',
            message: 'Item not found in database'
          });
          notFoundCount++;
          continue;
        }
        
        // Find the correct Cloudinary URL
        const correctImageData = itemImageMap[itemName];
        if (!correctImageData) {
          console.log(`  ⚠️  No Cloudinary URL found for: ${itemName}`);
          updateResults.push({
            item: itemName,
            status: 'no_image',
            message: 'No Cloudinary URL found for this item'
          });
          notFoundCount++;
          continue;
        }
        
        const correctUrl = correctImageData.url;
        
        // Check if the item already has the correct URL
        if (item.imageUrl === correctUrl) {
          console.log(`  ✓ Item already has correct URL: ${itemName}`);
          updateResults.push({
            item: itemName,
            status: 'already_correct',
            message: 'Item already has correct URL',
            oldUrl: item.imageUrl,
            newUrl: correctUrl
          });
          updatedCount++;
          continue;
        }
        
        // Update the item with the correct URL
        const updatedItem = await Item.findByIdAndUpdate(
          item._id,
          { imageUrl: correctUrl },
          { new: true }
        );
        
        console.log(`  ✓ Updated item with correct Cloudinary URL: ${itemName}`);
        console.log(`    Old URL: ${item.imageUrl}`);
        console.log(`    New URL: ${updatedItem.imageUrl}`);
        
        updateResults.push({
          item: itemName,
          status: 'updated',
          message: 'Item updated with correct Cloudinary URL',
          oldUrl: item.imageUrl,
          newUrl: updatedItem.imageUrl
        });
        updatedCount++;
        
      } catch (error) {
        console.log(`  ✗ Failed to update item ${itemName}: ${error.message}`);
        updateResults.push({
          item: itemName,
          status: 'error',
          message: error.message
        });
      }
    }
    
    console.log(`\nUpdate Summary:`);
    console.log(`  Successfully updated: ${updatedCount}`);
    console.log(`  Not found/failures: ${notFoundCount}`);
    console.log(`  Total processed: ${targetItems.length}`);
    
    res.json({
      success: true,
      message: 'Item image update process completed',
      summary: {
        updated: updatedCount,
        notFound: notFoundCount,
        total: targetItems.length
      },
      results: updateResults
    });
    
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update item images',
      error: error.message
    });
  }
});

// Add a route to fix item images with correct Cloudinary URLs
app.post('/api/fix-item-images', async (req, res) => {
  try {
    console.log('=== FIX ITEM IMAGES REQUEST ===');
    
    // Import the Item model
    const Item = (await import('./modals/item.js')).default;
    
    // Define the corrections needed
    const corrections = [
      {
        itemName: 'Dashboard Polish',
        correctUrl: 'https://res.cloudinary.com/dfjypp016/image/upload/v1761670243/foodiefrenzy_items/foodiefrenzy_items/Dashboard_Polish_1761670242267.webp'
      },
      {
        itemName: 'Car Perfume',
        correctUrl: 'https://res.cloudinary.com/dfjypp016/image/upload/v1761670308/foodiefrenzy_items/foodiefrenzy_items/Car_Perfume_1761670306659.webp'
      }
    ];
    
    let updatedCount = 0;
    const results = [];
    
    // Process each correction
    for (const correction of corrections) {
      try {
        console.log('Processing: ' + correction.itemName);
        
        // Find the item (case insensitive)
        const item = await Item.findOne({ 
          name: { $regex: new RegExp('^' + correction.itemName + '$', 'i') }
        });
        
        if (!item) {
          console.log('  ⚠️  Item not found: ' + correction.itemName);
          results.push({
            item: correction.itemName,
            status: 'not_found',
            message: 'Item not found in database'
          });
          continue;
        }
        
        // Check if the item already has the correct URL
        if (item.imageUrl === correction.correctUrl) {
          console.log('  ✓ Item already has correct URL: ' + correction.itemName);
          results.push({
            item: correction.itemName,
            status: 'already_correct',
            message: 'Item already has correct URL',
            url: item.imageUrl
          });
          continue;
        }
        
        // Show what will be changed
        console.log('  Current URL: ' + item.imageUrl);
        console.log('  Correct URL: ' + correction.correctUrl);
        
        // Update the item
        const updatedItem = await Item.findByIdAndUpdate(
          item._id,
          { imageUrl: correction.correctUrl },
          { new: true }
        );
        
        console.log('  ✓ Updated item: ' + correction.itemName);
        results.push({
          item: correction.itemName,
          status: 'updated',
          oldUrl: item.imageUrl,
          newUrl: updatedItem.imageUrl
        });
        updatedCount++;
        
      } catch (error) {
        console.log('  ✗ Failed to update ' + correction.itemName + ': ' + error.message);
        results.push({
          item: correction.itemName,
          status: 'error',
          message: error.message
        });
      }
    }
    
    console.log('=== SUMMARY ===');
    console.log('Successfully updated ' + updatedCount + ' items');
    
    res.json({
      success: true,
      message: 'Image URL fix process completed',
      updatedCount: updatedCount,
      results: results
    });
    
  } catch (error) {
    console.error('Fix error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fix item images',
      error: error.message
    });
  }
});

// Add a simple test endpoint to verify CORS configuration
app.get('/api/test-cors', (req, res) => {
  res.json({ 
    message: 'CORS is working correctly', 
    origin: req.get('Origin'),
    timestamp: new Date().toISOString()
  });
});

// Add a debug endpoint to check environment variables
app.get('/api/debug/env', (req, res) => {
  res.json({ 
    cors_origin: process.env.CORS_ORIGIN,
    frontend_url: process.env.FRONTEND_URL,
    admin_url: process.env.ADMIN_URL,
    node_env: process.env.NODE_ENV
  });
});

// Add a global error handler
app.use((err, req, res, next) => {
  console.error('=== GLOBAL ERROR HANDLER ===');
  console.error('Error:', err);
  console.error('Error stack:', err.stack);
  console.error('Request URL:', req.url);
  console.error('Request method:', req.method);
  console.error('Request headers:', req.headers);
  
  // Send error response
  if (res.headersSent) {
    return next(err);
  }
  
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Add 404 handler for unmatched routes
app.use((req, res) => {
  console.log('404 - Route not found:', req.method, req.url);
  // Check if this is an API route
  if (req.url.startsWith('/api/')) {
    console.log('API route not found, this might indicate a routing issue');
  }
  res.status(404).json({
    message: 'Route not found',
    method: req.method,
    url: req.url
  });
});

// Start server - Listen on all interfaces for Render/Railway deployment
console.log(`Attempting to start server on port ${PORT}...`);

// Add a timeout to ensure the process exits if something goes wrong
const startupTimeout = setTimeout(() => {
  console.error('=== STARTUP TIMEOUT ===');
  console.error('Server failed to start within 30 seconds');
  console.error('======================');
  process.exit(1);
}, 30000);

const server = app.listen(PORT, '0.0.0.0', () => {
  clearTimeout(startupTimeout);
  console.log(`=== SERVER STARTED SUCCESSFULLY ===`);
  console.log(`Server Started on http://0.0.0.0:${PORT}`);
  console.log(`Health check endpoint: http://0.0.0.0:${PORT}/health`);
  console.log(`====================================`);
});

// Add error handling for the server
server.on('error', (error) => {
  clearTimeout(startupTimeout);
  console.error('=== SERVER STARTUP ERROR ===');
  console.error('Failed to start server:', error);
  console.error('===========================');
  serverStartupError = error;
  process.exit(1); // Exit with error code
});

server.on('listening', () => {
  clearTimeout(startupTimeout);
  console.log('=== SERVER LISTENING EVENT ===');
  console.log('Server is now listening for connections');
  console.log('==============================');
});
// Trigger redeployment
console.log('Redeployment trigger updated: v1.0');
