import fs from 'fs';
import path from 'path';
import axios from 'axios';

const BACKEND_URL = 'https://lakeshoreconveniencee-backend.onrender.com';

async function uploadAllImagesToProduction() {
  try {
    console.log('Starting image upload process to production backend...\n');
    
    // Get all image files from local uploads directory
    const imagesDir = path.join(process.cwd(), 'uploads', 'images');
    const imageFiles = fs.readdirSync(imagesDir);
    
    console.log(`Found ${imageFiles.length} image files to upload`);
    
    let uploadedCount = 0;
    let failedCount = 0;
    
    // Upload each image file
    for (const imageFile of imageFiles) {
      try {
        const imagePath = path.join(imagesDir, imageFile);
        
        // Skip directories
        if (fs.statSync(imagePath).isDirectory()) {
          continue;
        }
        
        console.log(`Uploading ${imageFile}...`);
        
        // Create form data
        const formData = new FormData();
        formData.append('image', fs.createReadStream(imagePath));
        
        // Upload the image
        const response = await axios.post(`${BACKEND_URL}/api/test-upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        console.log(`✓ Successfully uploaded ${imageFile}`);
        uploadedCount++;
        
        // Add a small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.log(`✗ Failed to upload ${imageFile}: ${error.message}`);
        failedCount++;
      }
    }
    
    console.log(`\nUpload Summary:`);
    console.log(`Successfully uploaded: ${uploadedCount}`);
    console.log(`Failed to upload: ${failedCount}`);
    console.log(`Total files processed: ${imageFiles.length}`);
    
  } catch (error) {
    console.error('Error in upload process:', error.message);
  }
}

uploadAllImagesToProduction();