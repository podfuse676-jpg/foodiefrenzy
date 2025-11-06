import axios from 'axios';

async function testVercelConnection() {
  const backendUrl = 'https://lakeshoreconveniencee-backend.onrender.com';
  const frontendUrl = 'https://foodiefrenzy-nine.vercel.app';
  const adminUrl = 'https://foodiefrenzy-5hdf.vercel.app';
  
  console.log('Testing connection between Vercel deployments and Render backend...\n');
  
  try {
    // Test 1: Check if backend is accessible
    console.log('Test 1: Checking if backend is accessible...');
    const healthResponse = await axios.get(`${backendUrl}/health`, {
      timeout: 10000
    });
    console.log(`✓ Backend is accessible (Status: ${healthResponse.status})`);
    console.log(`  Health check response: ${JSON.stringify(healthResponse.data)}\n`);
    
    // Test 2: Check if items endpoint is accessible from frontend
    console.log('Test 2: Checking if items endpoint is accessible from frontend...');
    const itemsResponse = await axios.get(`${backendUrl}/api/items`, {
      headers: {
        'Origin': frontendUrl
      },
      timeout: 10000
    });
    console.log(`✓ Items endpoint is accessible from frontend (Status: ${itemsResponse.status})`);
    console.log(`  Items count: ${Array.isArray(itemsResponse.data) ? itemsResponse.data.length : 'N/A'}\n`);
    
    // Test 3: Check if items endpoint is accessible from admin
    console.log('Test 3: Checking if items endpoint is accessible from admin...');
    const adminItemsResponse = await axios.get(`${backendUrl}/api/items`, {
      headers: {
        'Origin': adminUrl
      },
      timeout: 10000
    });
    console.log(`✓ Items endpoint is accessible from admin (Status: ${adminItemsResponse.status})`);
    console.log(`  Items count: ${Array.isArray(adminItemsResponse.data) ? adminItemsResponse.data.length : 'N/A'}\n`);
    
    // Test 4: Display first few items
    if (Array.isArray(itemsResponse.data) && itemsResponse.data.length > 0) {
      console.log('Test 4: First few menu items:');
      itemsResponse.data.slice(0, 3).forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.name} - $${item.price} (${item.category})`);
      });
    }
    
    console.log('\nAll tests completed successfully! Your Vercel deployments should be able to communicate with your Render backend.');
    
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
testVercelConnection();