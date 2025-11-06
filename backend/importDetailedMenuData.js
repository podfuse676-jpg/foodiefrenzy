import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Item from './modals/item.js';

// Load environment variables
dotenv.config();

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use the same database connection as the main application
const connectDB = async () => {
    // Get the URI from environment variables or use default
    let uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodiefrenzy';
    
    try {
        console.log('MongoDB URI from environment:', uri.replace(/:[^:@]+@/, ':****@')); // Hide password in logs
        
        // Ensure the database name is properly specified
        let dbName = 'foodiefrenzy';
        if (uri.includes('mongodb.net')) {
            // Check if database name is in the URI
            const dbMatch = uri.match(/mongodb\.net\/([^?]+)/);
            if (dbMatch && dbMatch[1]) {
                dbName = dbMatch[1];
                console.log('Database name from URI:', dbName);
            } else {
                // If no database name in URI, add it
                if (uri.endsWith('/')) {
                    uri += 'foodiefrenzy';
                } else if (!uri.includes('?')) {
                    uri += '/foodiefrenzy';
                } else {
                    // Insert database name before query parameters
                    const parts = uri.split('?');
                    if (!parts[0].endsWith('/foodiefrenzy')) {
                        parts[0] = parts[0].replace(/\/$/, '') + '/foodiefrenzy';
                    }
                    uri = parts.join('?');
                }
                console.log('Updated URI with database name:', uri.replace(/:[^:@]+@/, ':****@'));
            }
        }
        
        // Clean the database name to remove any leading slashes
        dbName = dbName.replace(/^\//, '');
        console.log('Using database name:', dbName);
        
        await mongoose.connect(uri, {
            // Explicitly specify the database name
            dbName: dbName
        });
        console.log('DB CONNECTED to database:', mongoose.connection.name);
        return true;
    } catch (err) {
        console.error('DB CONNECTION ERROR:', err.message || err);
        return false;
    }
};

// Function to import detailed menu data
const importDetailedMenuData = async () => {
    try {
        // Connect to MongoDB
        const connected = await connectDB();
        if (!connected) {
            console.error('Failed to connect to MongoDB');
            process.exit(1);
        }
        console.log('Connected to MongoDB');
        
        // Import the detailed menu data
        const menuData = (await import('../../menu_data_detailed.js')).default;
        
        // Clear existing items
        await Item.deleteMany({});
        console.log('Cleared existing menu items');
        
        // Counter for imported items
        let importedCount = 0;
        
        // Process each category
        for (const [category, items] of Object.entries(menuData)) {
            console.log(`Processing category: ${category} (${items.length} items)`);
            
            // Process each item in the category
            for (const item of items) {
                // Process each size variant of the item
                for (const sizeOption of item.sizes) {
                    // Create a new item with the required fields
                    const newItem = {
                        name: item.name,
                        price: sizeOption.price,
                        description: `${item.name} - ${sizeOption.size}`,
                        category: category,
                        gst: item.gst || 0,
                        flavourOptions: item.customizations || item.flavours || [],
                        // Add size information to the item
                        sizeOptions: item.sizes.map(size => ({
                            size: size.size,
                            price: size.price
                        })),
                        // Add modifier groups based on available customizations
                        modifierGroups: (item.customizations || item.flavours) ? ['Customizations'] : []
                    };
                    
                    // Create or update the item
                    await Item.findOneAndUpdate(
                        { name: item.name, category: category },
                        newItem,
                        { upsert: true, new: true }
                    );
                    
                    importedCount++;
                }
            }
        }
        
        console.log(`Successfully imported ${importedCount} menu items`);
        
        // Verify the import by fetching some items
        const sampleItems = await Item.find().limit(5);
        console.log('Sample items imported:');
        sampleItems.forEach(item => {
            console.log(`- ${item.name} (${item.category}): $${item.price}`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('Error importing detailed menu data:', error);
        process.exit(1);
    }
};

// Run the import
importDetailedMenuData();