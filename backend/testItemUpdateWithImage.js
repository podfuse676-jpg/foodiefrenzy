import fs from 'fs';
import path from 'path';
import axios from 'axios';

const BACKEND_URL = 'https://lakeshoreconveniencee-backend.onrender.com';

async function testItemUpdateWithImage() {
  try {
    console.log('Testing item update with image upload...\n');
    
    // Get all items
    const itemsResponse = await axios.get(`${BACKEND_URL}/api/items`);
    const items = itemsResponse.data;
    
    // Find an item that we know doesn't have an accessible image
    const testItem = items.find(item => item.name === 'Coffee');
    
    if (!testItem) {
      console.log('Test item not found!');
      return;
    }
    
    console.log(`Testing with item: ${testItem.name}`);
    console.log(`Item ID: ${testItem._id}`);
    console.log(`Current image URL: ${testItem.imageUrl}`);
    
    // Get test image
    const imagesDir = path.join(process.cwd(), 'uploads', 'images');
    const testImage = 'Coffee.webp';
    const imagePath = path.join(imagesDir, testImage);
    
    console.log(`\nTesting with image: ${testImage}`);
    
    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      console.log('Test image not found!');
      return;
    }
    
    console.log('Image file exists, proceeding with item update...\n');
    
    // Try to update the item with a new image
    const formData = new FormData();
    formData.append('image', fs.createReadStream(imagePath));
    
    console.log('Updating item with new image...');
    const response = await axios.put(`${BACKEND_URL}/api/items/${testItem._id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('Update response:', response.data);
    console.log(`New image URL: ${response.data.imageUrl}`);
    
    // Now try to access the new image
    const newImageUrl = response.data.imageUrl;
    console.log(`\nTrying to access new image: ${newImageUrl}`);
    
    try {
      // If it's a relative URL, make it absolute
      let fullImageUrl = newImageUrl;
      if (newImageUrl.startsWith('/')) {
        fullImageUrl = `${BACKEND_URL}${newImageUrl}`;
      }
      
      const imageResponse = await axios.head(fullImageUrl);
      console.log(`✓ Image accessible: Status ${imageResponse.status}`);
    } catch (imageError) {
      console.log(`✗ Image not accessible: ${imageError.message}`);
      if (imageError.response) {
        console.log(`  Status: ${imageError.response.status}`);
      }
    }
    
  } catch (error) {
    console.error('Error testing item update:', error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }
}

testItemUpdateWithImage();