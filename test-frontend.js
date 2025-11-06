const axios = require('axios');

async function testFrontend() {
  try {
    console.log('Testing API connection to http://localhost:4000...');
    
    // Test the items endpoint
    const itemsResponse = await axios.get('http://localhost:4000/api/items');
    console.log('Items endpoint response status:', itemsResponse.status);
    console.log('Number of items:', Array.isArray(itemsResponse.data) ? itemsResponse.data.length : 'Not an array');
    
    console.log('Frontend test completed successfully!');
  } catch (error) {
    console.error('Frontend test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testFrontend();