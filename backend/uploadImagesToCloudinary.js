import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to sanitize filename for Cloudinary public_id
const sanitizeFilename = (filename) => {
  // Remove file extension
  const nameWithoutExt = path.parse(filename).name;
  // Replace invalid characters with underscores
  // Cloudinary public_id valid characters: alphanumeric, underscore, hyphen
  return nameWithoutExt
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_') // Replace multiple underscores with single underscore
    .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
};

const uploadImagesToCloudinary = async () => {
  try {
    console.log('Starting direct image upload to Cloudinary...\n');
    
    // Define the images we need to upload based on the error messages
    const imagesToUpload = [
      'Wiper-Fluid_1761665699619.webp',
      'Tire-Cleaner_1761665699619.webp',
      'Dashboard-Polish_1761665699619.webp',
      'Car-Air-Freshener_1761665699619.webp',
      'Car-Perfume_1761665699619.webp'
    ];
    
    // Check if local images directory exists
    const imagesDir = path.join(process.cwd(), 'uploads', 'images');
    if (!fs.existsSync(imagesDir)) {
      console.log('Images directory does not exist:', imagesDir);
      console.log('Creating directory...');
      fs.mkdirSync(imagesDir, { recursive: true });
      console.log('Please place the image files in this directory and run the script again.');
      return;
    }
    
    console.log(`Looking for images in: ${imagesDir}`);
    
    let uploadedCount = 0;
    let failedCount = 0;
    
    for (const imageName of imagesToUpload) {
      try {
        const imagePath = path.join(imagesDir, imageName);
        console.log(`\nProcessing ${imageName}...`);
        
        // Check if file exists
        if (!fs.existsSync(imagePath)) {
          console.log(`  ⚠️  File not found: ${imagePath}`);
          console.log(`  Please ensure this image file exists in the uploads/images directory.`);
          failedCount++;
          continue;
        }
        
        // Sanitize filename for Cloudinary public_id
        const sanitizedFilename = sanitizeFilename(imageName);
        console.log(`  Sanitized filename: ${sanitizedFilename}`);
        
        console.log(`  Uploading ${imageName} to Cloudinary...`);
        
        // Upload to Cloudinary with sanitized public_id
        const result = await cloudinary.uploader.upload(imagePath, {
          folder: 'foodiefrenzy_items',
          public_id: `${sanitizedFilename}_${Date.now()}`,
          overwrite: false,
          resource_type: 'image'
        });
        
        console.log(`  ✓ Uploaded successfully: ${result.secure_url}`);
        uploadedCount++;
        
      } catch (error) {
        console.log(`  ✗ Failed to upload ${imageName}: ${error.message}`);
        failedCount++;
      }
    }
    
    console.log(`\nUpload Summary:`);
    console.log(`  Successfully uploaded: ${uploadedCount}`);
    console.log(`  Failed to upload: ${failedCount}`);
    console.log(`  Total processed: ${imagesToUpload.length}`);
    
  } catch (error) {
    console.error('Upload error:', error);
  }
};

uploadImagesToCloudinary();