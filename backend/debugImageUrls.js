import axios from 'axios';

const BACKEND_URL = 'https://lakeshoreconveniencee-backend.onrender.com';

async function debugImageUrls() {
  try {
    console.log('Debugging image URLs from production backend...\n');
    
    // Get all items from production
    const itemsResponse = await axios.get(`${BACKEND_URL}/api/items`);
    const items = itemsResponse.data;
    
    console.log(`Found ${items.length} items in production\n`);
    
    // Check image URLs
    let itemsWithImages = 0;
    let itemsWithAccessibleImages = 0;
    
    for (const item of items.slice(0, 10)) { // Check first 10 items
      if (item.imageUrl && item.imageUrl !== '') {
        itemsWithImages++;
        console.log(`${item.name}:`);
        console.log(`  URL: ${item.imageUrl}`);
        
        // Try to access the image
        try {
          const imageResponse = await axios.head(item.imageUrl);
          console.log(`  Status: ✓ Accessible (${imageResponse.status})`);
          itemsWithAccessibleImages++;
        } catch (error) {
          console.log(`  Status: ✗ Not accessible (${error.response?.status || error.message})`);
        }
        console.log('');
      }
    }
    
    console.log(`Summary for first 10 items:`);
    console.log(`Items with image URLs: ${itemsWithImages}`);
    console.log(`Items with accessible images: ${itemsWithAccessibleImages}`);
    
    // Check the specific Dashboard Polish item
    const dashboardPolish = items.find(item => item.name === 'Dashboard Polish');
    if (dashboardPolish) {
      console.log(`\nDashboard Polish:`);
      console.log(`  URL: ${dashboardPolish.imageUrl}`);
      console.log(`  ID: ${dashboardPolish._id}`);
    }
    
  } catch (error) {
    console.error('Error debugging image URLs:', error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }
}

debugImageUrls();