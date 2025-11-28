// Simple test to check if backend routes are working
import axios from 'axios';

const BACKEND_URL = 'https://lakeshore-convenience.onrender.com';

async function testRoutes() {
  console.log('=== Testing Backend Routes ===');
  console.log('Backend URL:', BACKEND_URL);
  console.log('');
  
  // Test different endpoints
  const endpoints = [
    '/',
    '/health',
    '/api/items',
    '/api/test-cors'
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint}...`);
      const response = await axios.get(`${BACKEND_URL}${endpoint}`, { 
        timeout: 10000,
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
      console.log(`   Error: ${error.message}`);
    }
    console.log('');
  }
  
  console.log('=== ROUTE TESTING COMPLETE ===');
}

// Run test
testRoutes();