import axios from 'axios';

async function testBackendConnection() {
  // Test both local and Render backends
  const backends = [
    { name: 'Local Backend', url: 'http://localhost:4000' },
    { name: 'Render Backend', url: 'https://lakeshoreconveniencee-backend.onrender.com' }
  ];

  for (const backend of backends) {
    console.log(`\nTesting ${backend.name} (${backend.url})...`);
    
    try {
      // Test health endpoint
      const healthResponse = await axios.get(`${backend.url}/health`, { timeout: 5000 });
      console.log(`✓ Health check: ${healthResponse.status} - ${healthResponse.data.status}`);
      
      // Test items endpoint
      const itemsResponse = await axios.get(`${backend.url}/api/items`, { timeout: 10000 });
      console.log(`✓ Items endpoint: ${itemsResponse.status} - ${Array.isArray(itemsResponse.data) ? itemsResponse.data.length : 0} items`);
      
      console.log(`✓ ${backend.name} is working properly!`);
    } catch (error) {
      console.log(`✗ ${backend.name} is not accessible:`);
      if (error.code === 'ECONNABORTED') {
        console.log('  Timeout - Server not responding');
      } else if (error.response) {
        console.log(`  HTTP ${error.response.status}: ${error.response.statusText}`);
      } else {
        console.log(`  ${error.message}`);
      }
    }
  }
}

testBackendConnection();