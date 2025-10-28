import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('=== TESTING ITEM ID VALIDATION ===');

// Test the item ID from the error
const testId = '68fe1ec19090329489752b18';

console.log('Testing ID:', testId);
console.log('ID length:', testId.length);

// Check if it's a valid ObjectId format
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
console.log('Valid ObjectId format:', objectIdRegex.test(testId));

// Try to create a mongoose ObjectId
try {
    const objectId = new mongoose.Types.ObjectId(testId);
    console.log('Successfully created mongoose ObjectId:', objectId);
} catch (error) {
    console.error('Failed to create mongoose ObjectId:', error.message);
}

// Test with MongoDB connection if available
const testMongoConnection = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        // Only test if MONGODB_URI is set
        if (process.env.MONGODB_URI) {
            await mongoose.connect(process.env.MONGODB_URI);
            console.log('Connected to MongoDB successfully');
            
            // Try to find an item with this ID
            // Import the Item model
            const { default: Item } = await import('./modals/item.js');
            
            console.log('Looking for item with ID:', testId);
            const item = await Item.findById(testId);
            console.log('Item found:', item ? 'Yes' : 'No');
            
            await mongoose.connection.close();
        } else {
            console.log('MONGODB_URI not set, skipping database test');
        }
    } catch (error) {
        console.error('MongoDB test error:', error.message);
    }
};

testMongoConnection();