// Simple test script to verify backend routes are working
import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:4000';

async function testRoutes() {
  console.log('Testing backend routes...');
  console.log('API Base URL:', API_BASE_URL);
  
  try {
    // Test health endpoint
    console.log('\n1. Testing /health endpoint...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✓ Health endpoint working:', healthResponse.data);
    
    // Test items endpoint
    console.log('\n2. Testing /api/items endpoint...');
    const itemsResponse = await axios.get(`${API_BASE_URL}/api/items`);
    console.log('✓ Items endpoint working, found', itemsResponse.data.length, 'items');
    
    // Test specific item endpoint
    console.log('\n3. Testing /api/items/:id endpoint...');
    if (itemsResponse.data.length > 0) {
      const firstItem = itemsResponse.data[0];
      const itemResponse = await axios.get(`${API_BASE_URL}/api/items/${firstItem._id}`);
      console.log('✓ Item detail endpoint working:', itemResponse.data.name);
    } else {
      console.log('⚠ No items found to test detail endpoint');
    }
    
    console.log('\n✅ All route tests completed successfully!');
  } catch (error) {
    console.error('\n❌ Route test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testRoutes();