// Test Cloudinary configuration
import dotenv from 'dotenv';
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';

console.log('=== CLOUDINARY TEST ===');
console.log('Environment variables:');
console.log('- CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('- CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
console.log('- CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '[SET]' : '[NOT SET]');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('Cloudinary configured successfully');

// Try to list folders to test connection
try {
    const result = await cloudinary.api.root_folders();
    console.log('Cloudinary connection successful');
    console.log('Root folders:', result);
} catch (error) {
    console.error('Cloudinary connection failed:', error.message);
}