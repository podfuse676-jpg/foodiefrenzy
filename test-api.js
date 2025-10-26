const axios = require('axios');

async function testAPI() {
  try {
    console.log('Testing API connection to http://localhost:4000...');
    
    // Test the root endpoint
    const rootResponse = await axios.get('http://localhost:4000/');
    console.log('Root endpoint response:', rootResponse.data);
    
    // Test the items endpoint
    const itemsResponse = await axios.get('http://localhost:4000/api/items');
    console.log('Items endpoint response:', itemsResponse.data);
    
    console.log('API test completed successfully!');
  } catch (error) {
    console.error('API test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testAPI();