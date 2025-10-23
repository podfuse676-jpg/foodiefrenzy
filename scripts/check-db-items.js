import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../backend/.env' });

// Import the Item model
import Item from '../backend/modals/item.js';

// Connect to MongoDB
const connectDB = async () => {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodiefrenzy';
    try {
        await mongoose.connect(uri);
        console.log('DB CONNECTED');
        return true;
    } catch (err) {
        console.error('DB CONNECTION ERROR:', err.message || err);
        return false;
    }
};

// Check items in database
const checkItems = async () => {
    try {
        const items = await Item.find();
        console.log(`Found ${items.length} items in database:`);
        items.forEach((item, index) => {
            console.log(`${index + 1}. ${item.name} - ${item.category} - $${item.price}`);
        });
        
        if (items.length === 0) {
            console.log("No items found in database. This explains why the API returns an empty array.");
        }
    } catch (err) {
        console.error('Error fetching items:', err.message || err);
    }
};

// Main execution
const main = async () => {
    const connected = await connectDB();
    if (connected) {
        await checkItems();
        await mongoose.connection.close();
    } else {
        console.log("Failed to connect to database");
    }
};

main();