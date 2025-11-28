// Comprehensive test to check backend functionality
import axios from 'axios';

const BACKEND_URL = 'https://lakeshoreconveniencee-backend-production.up.railway.app';

async function testBackend() {
  console.log('=== COMPREHENSIVE BACKEND TEST ===');
  console.log('Backend URL:', BACKEND_URL);
  console.log('');

  // Test different endpoints
  const endpoints = [
    '/',
    '/health',
    '/api/test-cors',
    '/api/items',
    '/api/debug-env',
    '/api/test-db'
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

  // Test POST request to items endpoint
  console.log('Testing POST /api/items...');
  try {
    const postData = {
      name: "Test Item",
      price: 10.99,
      category: "Test Category"
    };
    const postResponse = await axios.post(`${BACKEND_URL}/api/items`, postData, {
      timeout: 15000,
      validateStatus: function (status) {
        return status < 500; // Accept all status codes less than 500
      }
    });
    console.log(`   POST Status: ${postResponse.status}`);
    if (postResponse.status === 200 || postResponse.status === 201) {
      console.log(`   POST Success: Items endpoint accepts POST requests`);
    } else {
      console.log(`   POST Response:`, postResponse.data);
    }
  } catch (error) {
    console.log(`   POST Request error: ${error.message}`);
    if (error.response) {
      console.log(`   POST Response status: ${error.response.status}`);
      console.log(`   POST Response data:`, error.response.data);
    }
  }
}

testBackend().catch(console.error);