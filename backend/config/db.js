import mongoose from 'mongoose';

// Connect to MongoDB. Uses MONGODB_URI from environment if present,
// otherwise falls back to a local MongoDB instance.
export const connectDB = async () => {
    // Get the URI from environment variables or use default
    let uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodiefrenzy';
    
    try {
        console.log('MongoDB URI from environment:', uri.replace(/:[^:@]+@/, ':****@')); // Hide password in logs
        
        // Parse the URI to extract database name
        let dbName = 'foodiefrenzy';
        if (uri.includes('mongodb.net')) {
            const match = uri.match(/mongodb\.net\/([^?]+)/);
            if (match && match[1]) {
                dbName = match[1];
                console.log('Database name from URI:', dbName);
            }
        } else if (uri.startsWith('mongodb://localhost')) {
            const match = uri.match(/localhost:\d+\/([^?]+)/);
            if (match && match[1]) {
                dbName = match[1];
                console.log('Database name from URI:', dbName);
            }
        }
        
        await mongoose.connect(uri, {
            // Explicitly specify the database name
            dbName: dbName
        });
        console.log('DB CONNECTED to database:', mongoose.connection.name);
    } catch (err) {
        console.error('DB CONNECTION ERROR:', err.message || err);
        console.error('This may be due to IP whitelist restrictions in MongoDB Atlas.');
        console.error('Please ensure your MongoDB Atlas cluster allows connections from Render.');
        console.error('You can whitelist 0.0.0.0/0 for testing purposes.');
        // Don't exit the process - allow the application to continue running
        // This will cause API calls that need the database to fail, but the server will stay up
    }
};