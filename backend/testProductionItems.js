import axios from 'axios';

const BACKEND_URL = 'https://lakeshoreconveniencee-backend.onrender.com';

async function testProductionItems() {
  try {
    console.log('Testing production items endpoint...');
    
    // Fetch items from the production backend
    const response = await axios.get(`${BACKEND_URL}/api/items`);
    console.log(`Successfully fetched ${response.data.length} items from production backend`);
    
    // Check how many items have images
    const itemsWithImages = response.data.filter(item => item.imageUrl && item.imageUrl !== '');
    console.log(`Items with images: ${itemsWithImages.length}`);
    
    // Show first 5 items with their image status
    console.log('\nFirst 5 items:');
    response.data.slice(0, 5).forEach((item, index) => {
      console.log(`${index + 1}. ${item.name}: ${item.imageUrl ? 'Has image' : 'No image'}`);
      if (item.imageUrl) {
        console.log(`   Image URL: ${item.imageUrl}`);
      }
    });
    
    // Check if the backend is serving images
    if (itemsWithImages.length > 0) {
      const firstItemImage = itemsWithImages[0];
      console.log(`\nTesting image access for: ${firstItemImage.name}`);
      console.log(`Image URL: ${firstItemImage.imageUrl}`);
      
      // If it's a relative URL, convert it to absolute
      let imageUrl = firstItemImage.imageUrl;
      if (imageUrl.startsWith('/')) {
        imageUrl = `${BACKEND_URL}${imageUrl}`;
      }
      
      try {
        const imageResponse = await axios.head(imageUrl);
        console.log(`Image accessible: Status ${imageResponse.status}`);
      } catch (imageError) {
        console.log(`Image not accessible: ${imageError.message}`);
      }
    }
    
  } catch (error) {
    console.error('Error testing production items:', error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }
}

testProductionItems();