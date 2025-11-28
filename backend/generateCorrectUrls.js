import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const generateCorrectUrls = async () => {
  try {
    console.log('Generating correct URLs for car accessory items...\n');
    
    // List all resources in the foodiefrenzy_items folder
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'foodiefrenzy_items/',
      max_results: 500
    });
    
    console.log(`Found ${result.resources.length} images in Cloudinary.`);
    
    // Map of item names to their correct Cloudinary URLs
    const itemImageMap = {};
    
    // Process all Cloudinary images to build the mapping
    result.resources.forEach(resource => {
      // Extract the item name from the public_id (before the timestamp)
      const parts = resource.public_id.split('/');
      if (parts.length > 1) {
        const filename = parts[1];
        // Remove the timestamp part (after the last underscore)
        const nameParts = filename.split('_');
        if (nameParts.length > 1) {
          nameParts.pop(); // Remove timestamp
          const itemName = nameParts.join('_').replace(/-/g, ' '); // Convert underscores to spaces
          itemImageMap[itemName] = resource.secure_url;
          console.log(`Mapped: ${itemName} -> ${resource.secure_url}`);
        }
      }
    });
    
    // Items we need to update
    const targetItems = [
      'Wiper Fluid',
      'Tire Cleaner',
      'Dashboard Polish',
      'Car Air Freshener',
      'Car Perfume'
    ];
    
    console.log('\n=== CORRECT URLS FOR CAR ACCESSORY ITEMS ===');
    targetItems.forEach(itemName => {
      const correctUrl = itemImageMap[itemName];
      if (correctUrl) {
        console.log(`${itemName}:`);
        console.log(`  ${correctUrl}`);
      } else {
        console.log(`${itemName}: NOT FOUND IN CLOUDINARY`);
      }
      console.log('');
    });
    
    console.log('=== HOW TO FIX THE ISSUE ===');
    console.log('1. Connect to your MongoDB database');
    console.log('2. Find the documents for these items');
    console.log('3. Update their imageUrl fields with the correct URLs shown above');
    console.log('4. Save the updated documents');
    
  } catch (error) {
    console.error('Error:', error);
  }
};

generateCorrectUrls();