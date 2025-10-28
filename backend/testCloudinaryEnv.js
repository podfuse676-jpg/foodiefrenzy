import dotenv from 'dotenv';
dotenv.config();

console.log('=== CLOUDINARY ENVIRONMENT VARIABLES TEST ===');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME || 'NOT SET');
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY || 'NOT SET');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET');

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.log('ERROR: Missing required Cloudinary environment variables');
    process.exit(1);
}

console.log('All Cloudinary environment variables are set correctly');