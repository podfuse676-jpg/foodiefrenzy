import axios from 'axios';

async function testRenderBackend() {
  const backendUrl = 'https://lakeshoreconveniencee-backend.onrender.com';
  
  console.log('Testing connection to Render backend...\n');
  
  try {
    // Test 1: Check if backend is accessible
    console.log('Test 1: Checking if backend is accessible...');
    const healthResponse = await axios.get(`${backendUrl}/health`, {
      timeout: 10000
    });
    console.log(`✓ Backend is accessible (Status: ${healthResponse.status})`);
    console.log(`  Health check response: ${JSON.stringify(healthResponse.data)}\n`);
    
    // Test 2: Check if items endpoint is accessible
    console.log('Test 2: Checking if items endpoint is accessible...');
    const itemsResponse = await axios.get(`${backendUrl}/api/items`, {
      headers: {
        'Origin': 'https://foodiefrenzy-frontend.vercel.app'
      },
      timeout: 10000
    });
    console.log(`✓ Items endpoint is accessible (Status: ${itemsResponse.status})`);
    console.log(`  Items count: ${Array.isArray(itemsResponse.data) ? itemsResponse.data.length : 'N/A'}\n`);
    
    // Test 3: Display first few items
    if (Array.isArray(itemsResponse.data) && itemsResponse.data.length > 0) {
      console.log('Test 3: First few menu items:');
      itemsResponse.data.slice(0, 3).forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.name} - $${item.price} (${item.category})`);
      });
    }
    
    console.log('\nAll tests completed successfully! Your Render backend is working correctly.');
    
  } catch (error) {
    console.error('Error during testing:');
    if (error.response) {
      console.error(`  Status: ${error.response.status}`);
      console.error(`  Message: ${error.response.statusText}`);
      console.error(`  Data: ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      console.error('  No response received from server');
      console.error(`  Error: ${error.message}`);
    } else {
      console.error(`  Error: ${error.message}`);
    }
  }
}

// Run the test
testRenderBackend();