import dotenv from 'dotenv';
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';

console.log('=== TESTING CLOUDINARY CONFIGURATION ===');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('Cloudinary configuration applied');

// Test the configuration
const config = cloudinary.config();
console.log('Applied configuration:', {
  cloud_name: config.cloud_name,
  api_key: config.api_key,
  api_secret: config.api_secret ? '[SET]' : '[NOT SET]'
});

// Test ping
try {
  const result = await cloudinary.api.ping();
  console.log('Cloudinary ping successful:', result);
} catch (error) {
  console.error('Cloudinary ping failed:', error.message);
}