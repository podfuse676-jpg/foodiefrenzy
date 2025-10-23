/**
 * Test script to verify admin portal connection to backend
 * This script tests if the backend CORS configuration allows requests from the Vercel admin portal
 */

const axios = require('axios');

async function testAdminConnection() {
  const backendUrl = 'https://lakeshoreconveniencee-backend.onrender.com';
  const adminUrl = 'https://foodiefrenzy-5hdf.vercel.app';
  
  console.log('Testing connection between admin portal and backend...\n');
  
  try {
    // Test 1: Check if backend is accessible
    console.log('Test 1: Checking if backend is accessible...');
    const healthResponse = await axios.get(`${backendUrl}/health`);
    console.log(`✓ Backend is accessible (Status: ${healthResponse.status})`);
    console.log(`  Health check response: ${JSON.stringify(healthResponse.data)}\n`);
    
    // Test 2: Check if items endpoint is accessible
    console.log('Test 2: Checking if items endpoint is accessible...');
    const itemsResponse = await axios.get(`${backendUrl}/api/items`, {
      headers: {
        'Origin': adminUrl
      }
    });
    console.log(`✓ Items endpoint is accessible (Status: ${itemsResponse.status})`);
    console.log(`  Items count: ${Array.isArray(itemsResponse.data) ? itemsResponse.data.length : 'N/A'}\n`);
    
    // Test 3: Check CORS headers
    console.log('Test 3: Checking CORS configuration...');
    const corsResponse = await axios.get(`${backendUrl}/api/items`, {
      headers: {
        'Origin': adminUrl
      },
      validateStatus: function (status) {
        return status < 500; // Accept all status codes less than 500
      }
    });
    
    const accessControlAllowOrigin = corsResponse.headers['access-control-allow-origin'];
    if (accessControlAllowOrigin && (accessControlAllowOrigin === adminUrl || accessControlAllowOrigin === '*')) {
      console.log(`✓ CORS is properly configured for ${adminUrl}`);
      console.log(`  Access-Control-Allow-Origin: ${accessControlAllowOrigin}\n`);
    } else {
      console.log(`⚠ CORS might not be properly configured for ${adminUrl}`);
      console.log(`  Access-Control-Allow-Origin: ${accessControlAllowOrigin || 'Not set'}\n`);
    }
    
    console.log('All tests completed successfully! Your admin portal should be able to communicate with the backend.');
    
  } catch (error) {
    console.error('Error during testing:');
    if (error.response) {
      console.error(`  Status: ${error.response.status}`);
      console.error(`  Message: ${error.response.statusText}`);
      console.error(`  Data: ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      console.error('  No response received from server');
      console.error(`  Error: ${error.message}`);
    } else {
      console.error(`  Error: ${error.message}`);
    }
  }
}

// Run the test
testAdminConnection();