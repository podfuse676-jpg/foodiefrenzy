// Test to check deployed backend endpoints
import axios from 'axios';

const BACKEND_URL = 'https://lakeshore-convenience.onrender.com';

async function testEndpoints() {
  console.log('=== TESTING DEPLOYED BACKEND ===');
  console.log('Backend URL:', BACKEND_URL);
  console.log('');

  // Test different endpoints
  const endpoints = [
    '/',
    '/health',
    '/api/items'
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
        if (endpoint === '/api/items') {
          console.log(`   Items count: ${response.data.length}`);
        }
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
  
  // Test POST request to items endpoint (without image)
  console.log('Testing POST /api/items (without image)...');
  try {
    const postData = {
      name: "Test Item - " + new Date().toISOString(),
      price: 10.99,
      category: "Test Category",
      description: "This is a test item created by the verification script"
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
      console.log(`   Created Item ID: ${postResponse.data._id}`);
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

testEndpoints().catch(console.error);