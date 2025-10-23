import mongoose from 'mongoose';

// Connect to MongoDB. Uses MONGODB_URI from environment if present,
// otherwise falls back to a local MongoDB instance.
export const connectDB = async () => {
    // Get the URI from environment variables or use default
    let uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodiefrenzy';
    
    try {
        // Ensure the URI ends with the correct database name
        if (uri.includes('mongodb.net') && !uri.includes('foodiefrenzy')) {
            // If it's a MongoDB Atlas URI and doesn't specify database, add it
            if (uri.endsWith('/')) {
                uri += 'foodiefrenzy';
            } else if (!uri.includes('?')) {
                uri += '/foodiefrenzy';
            } else {
                // Insert database name before query parameters
                const parts = uri.split('?');
                if (!parts[0].endsWith('/foodiefrenzy')) {
                    parts[0] += '/foodiefrenzy';
                }
                uri = parts.join('?');
            }
        }
        
        console.log('Connecting to MongoDB with URI:', uri.replace(/:[^:@]+@/, ':****@')); // Hide password in logs
        
        await mongoose.connect(uri, {
            // useNewUrlParser and useUnifiedTopology are defaults in Mongoose 6+
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