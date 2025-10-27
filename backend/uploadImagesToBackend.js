// Script to upload images to the deployed backend
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import fetch from 'node-fetch';

const BACKEND_URL = 'https://lakeshoreconveniencee-backend.onrender.com';

// Function to upload a single image
async function uploadImage(imagePath, itemName) {
  try {
    console.log(`Uploading ${imagePath} for item "${itemName}"...`);
    
    // Create form data
    const formData = new FormData();
    formData.append('image', fs.createReadStream(imagePath));
    
    // Find the item ID first
    const itemsResponse = await fetch(`${BACKEND_URL}/api/items`);
    const items = await itemsResponse.json();
    
    const item = items.find(i => i.name === itemName);
    if (!item) {
      console.log(`Item "${itemName}" not found`);
      return;
    }
    
    console.log(`Found item ID: ${item._id}`);
    
    // Upload the image
    const response = await fetch(`${BACKEND_URL}/api/items/${item._id}`, {
      method: 'PUT',
      body: formData,
      // Note: Don't set Content-Type header, let FormData set it with boundary
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log(`✓ Successfully uploaded image for "${itemName}"`);
      console.log(`  New image URL: ${result.imageUrl}`);
    } else {
      const error = await response.text();
      console.log(`✗ Failed to upload image for "${itemName}": ${response.status} ${error}`);
    }
  } catch (error) {
    console.log(`✗ Error uploading image for "${itemName}": ${error.message}`);
  }
}

// Main function to upload all images
async function uploadAllImages() {
  console.log('Starting image upload process...\n');
  
  // Image mapping - item name to image file path
  const imageMapping = {
    "Car Perfume": "./uploads/images/car-perfume.jpg",
    "Dashboard Polish": "./uploads/images/dash-board-polish.webp",
    // Add more items as needed
  };
  
  // Upload each image
  for (const [itemName, imagePath] of Object.entries(imageMapping)) {
    const fullPath = path.join(process.cwd(), imagePath);
    if (fs.existsSync(fullPath)) {
      await uploadImage(fullPath, itemName);
    } else {
      console.log(`⚠ Image file not found: ${fullPath}`);
    }
  }
  
  console.log('\nImage upload process completed');
}

// Run the script
uploadAllImages().catch(console.error);