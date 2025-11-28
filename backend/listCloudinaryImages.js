import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const listCloudinaryImages = async () => {
  try {
    console.log('Listing images in Cloudinary folder: foodiefrenzy_items\n');
    
    // List resources in the foodiefrenzy_items folder
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'foodiefrenzy_items/',
      max_results: 500
    });
    
    console.log(`Found ${result.resources.length} images:`);
    
    // Filter for the specific images we're looking for
    const targetImages = [
      'Wiper-Fluid',
      'Tire-Cleaner',
      'Dashboard-Polish',
      'Car-Air-Freshener',
      'Car-Perfume'
    ];
    
    const matchingImages = result.resources.filter(resource => {
      return targetImages.some(target => resource.public_id.includes(target));
    });
    
    if (matchingImages.length > 0) {
      console.log('\nMatching images found:');
      matchingImages.forEach(resource => {
        console.log(`  - ${resource.public_id}: ${resource.secure_url}`);
      });
    } else {
      console.log('\nNo matching images found in Cloudinary.');
    }
    
    // Show all images if there are fewer than 20
    if (result.resources.length <= 20) {
      console.log('\nAll images in folder:');
      result.resources.forEach(resource => {
        console.log(`  - ${resource.public_id}: ${resource.secure_url}`);
      });
    } else {
      console.log(`\nShowing first 10 of ${result.resources.length} images:`);
      result.resources.slice(0, 10).forEach(resource => {
        console.log(`  - ${resource.public_id}: ${resource.secure_url}`);
      });
    }
    
  } catch (error) {
    console.error('Error listing Cloudinary images:', error.message);
  }
};

listCloudinaryImages();