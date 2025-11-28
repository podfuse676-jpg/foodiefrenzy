// Simple script to check backend health
import axios from 'axios';

const BACKEND_URL = 'https://lakeshoreconveniencee-backend-production.up.railway.app';

async function checkBackend() {
  console.log('=== Checking Backend Health ===');
  console.log('Backend URL:', BACKEND_URL);
  console.log('');
  
  try {
    // Test 1: Check backend health endpoint
    console.log('1. Testing backend health endpoint...');
    const healthResponse = await axios.get(`${BACKEND_URL}/health`, { 
      timeout: 10000,
      validateStatus: function (status) {
        return status < 500; // Accept all status codes less than 500
      }
    });
    console.log('   Status:', healthResponse.status);
    console.log('   Data:', healthResponse.data);
    
    // Test 2: Check backend items endpoint
    console.log('2. Testing backend items endpoint...');
    const itemsResponse = await axios.get(`${BACKEND_URL}/api/items`, { 
      timeout: 15000,
      validateStatus: function (status) {
        return status < 500; // Accept all status codes less than 500
      }
    });
    console.log('   Status:', itemsResponse.status);
    if (itemsResponse.status === 200) {
      console.log('   Data length:', itemsResponse.data.length);
    } else {
      console.log('   Response data:', itemsResponse.data);
    }
    
    console.log('');
    console.log('=== BACKEND CHECK COMPLETE ===');
    
  } catch (error) {
    console.error('❌ Backend check failed:', error.message);
    if (error.response) {
      console.error('   Response status:', error.response.status);
      console.error('   Response data:', error.response.data);
    }
  }
}

// Run check
checkBackend();