import mongoose from 'mongoose';

// Connect to MongoDB. Uses MONGODB_URI from environment if present,
// otherwise falls back to a local MongoDB instance.
export const connectDB = async () => {
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
            dbName: dbName,
            // Connection pool settings for high traffic
            maxPoolSize: 50, // Maximum number of connections in the connection pool
            minPoolSize: 10, // Minimum number of connections in the connection pool
            maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if server selection fails
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            heartbeatFrequencyMS: 10000, // Send heartbeat every 10 seconds
            // Retry settings
            retryWrites: true,
            retryReads: true
        });
        console.log('DB CONNECTED to database:', mongoose.connection.name);
        console.log('MongoDB connection pool size:', mongoose.connection.readyState);
    } catch (err) {
        console.error('DB CONNECTION ERROR:', err.message || err);
        console.error('This may be due to IP whitelist restrictions in MongoDB Atlas.');
        console.error('Please ensure your MongoDB Atlas cluster allows connections from Render.');
        console.error('You can whitelist 0.0.0.0/0 for testing purposes.');
        // Don't exit the process - allow the application to continue running
        // This will cause API calls that need the database to fail, but the server will stay up
    }
};