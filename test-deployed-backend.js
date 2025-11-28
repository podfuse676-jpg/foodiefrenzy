// Test to check deployed backend endpoints
import axios from 'axios';

const BACKEND_URL = 'https://lakeshoreconveniencee-backend-production.up.railway.app';

async function testEndpoints() {
  console.log('=== TESTING DEPLOYED BACKEND ===');
  console.log('Backend URL:', BACKEND_URL);
  console.log('');

  // Test different endpoints
  const endpoints = [
    '/',
    '/health',
    '/api/test-cors',
    '/api/items',
    '/api/test'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint}...`);
      const response = await axios.get(`${BACKEND_URL}${endpoint}`, { 
        timeout: 15000,
        validateStatus: function (status) {
          return status < 500; // Accept all status codes less than 500
        }
      });
      console.log(`   Status: ${response.status}`);
      if (response.status === 200) {
        console.log(`   Success: ${endpoint} is working`);
      } else {
        console.log(`   Response:`, response.data);
      }
    } catch (error) {
      console.log(`   Request error: ${error.message}`);
      if (error.response) {
        console.log(`   Response status: ${error.response.status}`);
        console.log(`   Response data:`, error.response.data);
      }
    }
    console.log('');
  }
}

testEndpoints().catch(console.error);