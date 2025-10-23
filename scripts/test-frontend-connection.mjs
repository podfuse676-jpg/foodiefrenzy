// Test script to verify frontend can connect to backend
import axios from 'axios';

async function testConnection() {
  try {
    console.log('Testing connection to backend...');
    
    // Test the health endpoint
    const healthResponse = await axios.get('https://lakeshoreconveniencee-backend.onrender.com/health');
    console.log('Health check:', healthResponse.status, healthResponse.data);
    
    // Test the items endpoint
    const itemsResponse = await axios.get('https://lakeshoreconveniencee-backend.onrender.com/api/items');
    console.log('Items endpoint:', itemsResponse.status, `Found ${itemsResponse.data.length} items`);
    
    // Show first item if available
    if (itemsResponse.data.length > 0) {
      console.log('First item:', itemsResponse.data[0].name);
    }
    
    console.log('\nAll tests passed! The backend is accessible.');
  } catch (error) {
    console.error('Connection test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testConnection();