import fs from 'fs';
import path from 'path';
import axios from 'axios';

const BACKEND_URL = 'https://lakeshoreconveniencee-backend.onrender.com';

async function testSingleImageUpload() {
  try {
    console.log('Testing single image upload to production backend...\n');
    
    // Get the path to a test image
    const imagesDir = path.join(process.cwd(), 'uploads', 'images');
    const testImage = 'Coffee.webp';
    const imagePath = path.join(imagesDir, testImage);
    
    console.log(`Testing with image: ${testImage}`);
    console.log(`Image path: ${imagePath}`);
    
    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      console.log('Test image not found!');
      return;
    }
    
    console.log('Image file exists, proceeding with upload test...\n');
    
    // Try to upload the image using the test endpoint
    const formData = new FormData();
    formData.append('image', fs.createReadStream(imagePath));
    
    console.log('Uploading image...');
    const response = await axios.post(`${BACKEND_URL}/api/test-upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('Upload response:', response.data);
    
    // Now try to access the uploaded image
    const uploadedFilename = response.data.filename;
    console.log(`\nTrying to access uploaded image: ${uploadedFilename}`);
    
    try {
      const imageResponse = await axios.head(`${BACKEND_URL}/uploads/${uploadedFilename}`);
      console.log(`✓ Image accessible: Status ${imageResponse.status}`);
    } catch (imageError) {
      console.log(`✗ Image not accessible: ${imageError.message}`);
      if (imageError.response) {
        console.log(`  Status: ${imageError.response.status}`);
      }
    }
    
  } catch (error) {
    console.error('Error testing image upload:', error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }
}

testSingleImageUpload();