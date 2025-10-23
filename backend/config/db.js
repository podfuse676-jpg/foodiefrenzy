import mongoose from 'mongoose';

// Connect to MongoDB. Uses MONGODB_URI from environment if present,
// otherwise falls back to a local MongoDB instance.
export const connectDB = async () => {
    // Ensure the database name is explicitly set to 'foodiefrenzy'
    let uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodiefrenzy';
    
    // If the URI doesn't end with the database name, append it
    if (uri && !uri.endsWith('/foodiefrenzy')) {
        // Remove any trailing slash if present
        if (uri.endsWith('/')) {
            uri = uri.slice(0, -1);
        }
        // Add the database name if it's not already there
        if (!uri.includes('/foodiefrenzy?')) {
            // Check if there's already a database name
            const lastSlashIndex = uri.lastIndexOf('/');
            if (lastSlashIndex > 8) { // Make sure we're not looking at the protocol part
                // Replace the existing database name with foodiefrenzy
                uri = uri.substring(0, lastSlashIndex) + '/foodiefrenzy';
            } else {
                // Append the database name
                uri = uri + '/foodiefrenzy';
            }
        }
    }
    
    try {
        await mongoose.connect(uri, {
            // useNewUrlParser and useUnifiedTopology are defaults in Mongoose 6+
        });
        console.log('DB CONNECTED');
        console.log('Connected to database:', mongoose.connection.name);
    } catch (err) {
        console.error('DB CONNECTION ERROR:', err.message || err);
        console.error('This may be due to IP whitelist restrictions in MongoDB Atlas.');
        console.error('Please ensure your MongoDB Atlas cluster allows connections from Render.');
        console.error('You can whitelist 0.0.0.0/0 for testing purposes.');
        // Don't exit the process - allow the application to continue running
        // This will cause API calls that need the database to fail, but the server will stay up
    }
};

// ... existing comments ...