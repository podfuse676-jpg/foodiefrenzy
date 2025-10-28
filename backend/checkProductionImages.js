import axios from 'axios';

const BACKEND_URL = 'https://lakeshoreconveniencee-backend.onrender.com';

async function checkProductionImages() {
  try {
    console.log('Checking production images endpoint...');
    
    // Fetch list of images from the production backend
    const response = await axios.get(`${BACKEND_URL}/uploads/images`);
    console.log(`Production images endpoint response:`, response.data);
    
  } catch (error) {
    console.error('Error checking production images:', error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }
  
  try {
    console.log('\nTesting direct access to a specific image...');
    // Try to access a specific image
    const imageResponse = await axios.head(`${BACKEND_URL}/uploads/images/Coffee.webp`);
    console.log(`Coffee.webp accessible: Status ${imageResponse.status}`);
  } catch (imageError) {
    console.log(`Coffee.webp not accessible: ${imageError.message}`);
    if (imageError.response) {
      console.log(`Status: ${imageError.response.status}`);
    }
  }
}

checkProductionImages();