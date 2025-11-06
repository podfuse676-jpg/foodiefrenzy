import fs from 'fs';
import path from 'path';
import axios from 'axios';

const BACKEND_URL = 'https://lakeshoreconveniencee-backend.onrender.com';

async function uploadImagesToUpdateItems() {
  try {
    console.log('Fetching items from production backend...');
    
    // Get all items from production
    const itemsResponse = await axios.get(`${BACKEND_URL}/api/items`);
    const items = itemsResponse.data;
    
    console.log(`Found ${items.length} items in production`);
    
    // Get local image files
    const imagesDir = path.join(process.cwd(), 'uploads', 'images');
    const imageFiles = fs.readdirSync(imagesDir);
    
    console.log(`Found ${imageFiles.length} local image files`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    // For each item, check if we have a corresponding image and update it
    for (const item of items) {
      // Skip items that already have images (to avoid overwriting)
      if (item.imageUrl && item.imageUrl !== '' && 
          !item.imageUrl.includes('dash-board-polish.webp') && 
          !item.imageUrl.includes('car-perfume.jpg')) {
        console.log(`Skipping ${item.name} - already has image`);
        skippedCount++;
        continue;
      }
      
      // Find matching image file
      const imageName = item.name.replace(/[^a-zA-Z0-9\s]/g, ''); // Remove special characters
      const cleanImageName = imageName.replace(/\s+/g, ' ').trim(); // Clean spaces
      
      // Try different extensions
      const extensions = ['.webp', '.jpg', '.jpeg', '.png'];
      let foundImage = false;
      
      for (const ext of extensions) {
        const fileName = `${cleanImageName}${ext}`;
        const specialFileName = `${cleanImageName} ${ext}`; // Handle cases like "Cappuccino .webp"
        
        if (imageFiles.includes(fileName) || imageFiles.includes(specialFileName)) {
          const actualFileName = imageFiles.includes(fileName) ? fileName : specialFileName;
          console.log(`Found image for ${item.name}: ${actualFileName}`);
          
          // Upload image to update the item
          try {
            const imagePath = path.join(imagesDir, actualFileName);
            
            const formData = new FormData();
            formData.append('image', fs.createReadStream(imagePath));
            
            // Update the item with the new image
            const updateResponse = await axios.put(
              `${BACKEND_URL}/api/items/${item._id}`, 
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              }
            );
            
            console.log(`✓ Updated ${item.name} with image ${actualFileName}`);
            updatedCount++;
            foundImage = true;
            
            // Add delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 200));
            break;
          } catch (uploadError) {
            console.log(`✗ Failed to update ${item.name}: ${uploadError.message}`);
          }
        }
      }
      
      if (!foundImage) {
        console.log(`No image found for ${item.name}`);
      }
    }
    
    console.log(`\nUpdate Summary:`);
    console.log(`Successfully updated: ${updatedCount}`);
    console.log(`Skipped (already had images): ${skippedCount}`);
    
  } catch (error) {
    console.error('Error updating items with images:', error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }
}

// Polyfill for FormData in Node.js
import { FormData } from 'formdata-node';
global.FormData = FormData;

uploadImagesToUpdateItems();