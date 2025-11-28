// Test script to verify backend connection
import axios from 'axios';

const BACKEND_URL = 'https://lakeshoreconveniencee-backend-production.up.railway.app';

async function testBackend() {
  console.log('=== Testing Backend Connection ===');
  console.log('Backend URL:', BACKEND_URL);
  console.log('');

  try {
    // Test 1: Check backend health endpoint
    console.log('1. Testing backend health endpoint...');
    const healthResponse = await axios.get(`${BACKEND_URL}/health`, { timeout: 10000 });
    console.log('   ✓ Backend health endpoint accessible (Status:', healthResponse.status + ')');
    console.log('   ✓ Backend status:', healthResponse.data.status);
    console.log('   ✓ Backend timestamp:', healthResponse.data.timestamp);
    
    // Test 2: Check backend items endpoint
    console.log('2. Testing backend items endpoint...');
    const itemsResponse = await axios.get(`${BACKEND_URL}/api/items`, { timeout: 15000 });
    console.log('   ✓ Backend items endpoint accessible (Status:', itemsResponse.status + ')');
    console.log('   ✓ Found', itemsResponse.data.length, 'items');
    
    // Test 3: Check if items have proper structure
    if (itemsResponse.data.length > 0) {
      const firstItem = itemsResponse.data[0];
      console.log('   ✓ First item structure:');
      console.log('     - ID:', firstItem._id);
      console.log('     - Name:', firstItem.name);
      console.log('     - Price:', firstItem.price);
      console.log('     - Has image URL:', !!firstItem.imageUrl);
      
      if (firstItem.imageUrl) {
        console.log('     - Image URL preview:', firstItem.imageUrl.substring(0, 50) + '...');
      }
    }
    
    console.log('');
    console.log('=== BACKEND TEST COMPLETE ===');
    console.log('✅ All backend tests passed!');
    
  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
    if (error.response) {
      console.error('   Response status:', error.response.status);
      console.error('   Response data:', JSON.stringify(error.response.data, null, 2));
    }
    
    console.log('');
    console.log('🔧 Troubleshooting tips:');
    console.log('   - Check that the backend is running on Railway');
    console.log('   - Verify the backend URL is correct');
    console.log('   - Check Railway logs for any errors');
    console.log('   - Ensure MongoDB connection is working');
  }
}

// Run test
testBackend();