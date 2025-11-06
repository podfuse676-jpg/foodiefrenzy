import fs from 'fs';
import path from 'path';
import axios from 'axios';

const BACKEND_URL = 'https://lakeshoreconveniencee-backend.onrender.com';

async function uploadMissingImages() {
  try {
    console.log('Uploading missing images to production backend...\n');
    
    // Get all items from production
    const itemsResponse = await axios.get(`${BACKEND_URL}/api/items`);
    const items = itemsResponse.data;
    
    console.log(`Found ${items.length} items in production`);
    
    // Get local image files
    const imagesDir = path.join(process.cwd(), 'uploads', 'images');
    const imageFiles = fs.readdirSync(imagesDir);
    
    console.log(`Found ${imageFiles.length} local image files\n`);
    
    // Items that should have accessible images (based on our previous work)
    // But we know only 2 are actually accessible: Dashboard Polish and Car Perfume
    const itemsToFix = items.filter(item => 
      item.name !== 'Dashboard Polish' && item.name !== 'Car Perfume'
    );
    
    console.log(`Need to fix ${itemsToFix.length} items\n`);
    
    let updatedCount = 0;
    
    // Process a few items to test
    for (const item of itemsToFix.slice(0, 3)) {
      console.log(`Processing ${item.name}...`);
      
      // Find matching image file
      let imageName = item.name.replace(/[^a-zA-Z0-9\s]/g, ''); // Remove special characters
      imageName = imageName.replace(/\s+/g, ' ').trim(); // Clean spaces
      
      // Try different extensions
      const extensions = ['.webp', '.jpg', '.jpeg', '.png'];
      let foundImage = false;
      
      for (const ext of extensions) {
        const fileName = `${imageName}${ext}`;
        const specialFileName = `${imageName} ${ext}`; // Handle cases like "Cappuccino .webp"
        
        if (imageFiles.includes(fileName)) {
          console.log(`Found image: ${fileName}`);
          
          // Upload image to update the item
          try {
            const imagePath = path.join(imagesDir, fileName);
            
            // For now, let's just test if we can update an item without an image
            // We'll send an empty update to test the endpoint
            console.log(`Testing update for ${item.name}...`);
            
            // Update the item (even without an image to test the endpoint)
            const updateResponse = await axios.put(
              `${BACKEND_URL}/api/items/${item._id}`, 
              { name: item.name }, // Just send the name to test
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );
            
            console.log(`✓ Successfully tested update for ${item.name}`);
            updatedCount++;
            foundImage = true;
            
            // Add delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
            break;
          } catch (uploadError) {
            console.log(`✗ Failed to update ${item.name}: ${uploadError.message}`);
            if (uploadError.response) {
              console.log(`  Status: ${uploadError.response.status}`);
            }
          }
        } else if (imageFiles.includes(specialFileName)) {
          console.log(`Found special case image: ${specialFileName}`);
          
          // Upload image to update the item
          try {
            console.log(`Testing update for ${item.name}...`);
            
            // Update the item (even without an image to test the endpoint)
            const updateResponse = await axios.put(
              `${BACKEND_URL}/api/items/${item._id}`, 
              { name: item.name }, // Just send the name to test
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );
            
            console.log(`✓ Successfully tested update for ${item.name}`);
            updatedCount++;
            foundImage = true;
            
            // Add delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
            break;
          } catch (uploadError) {
            console.log(`✗ Failed to update ${item.name}: ${uploadError.message}`);
            if (uploadError.response) {
              console.log(`  Status: ${uploadError.response.status}`);
            }
          }
        }
      }
      
      if (!foundImage) {
        console.log(`No image found for ${item.name}`);
      }
      
      console.log(''); // Empty line for readability
    }
    
    console.log(`\nTest Summary:`);
    console.log(`Successfully tested: ${updatedCount} items`);
    console.log(`Remaining items to fix: ${itemsToFix.length - Math.min(3, itemsToFix.length)}`);
    
  } catch (error) {
    console.error('Error testing updates:', error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
    }
  }
}

uploadMissingImages();