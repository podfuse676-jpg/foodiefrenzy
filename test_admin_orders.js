const axios = require('axios');

async function testAdminOrders() {
  try {
    // Test with an invalid token first
    console.log('Testing with invalid token...');
    const response = await axios.get('https://lakeshore-convenience.onrender.com/api/users/admin/orders', {
      headers: {
        'Authorization': 'Bearer invalid-token'
      }
    });
    console.log('Response with invalid token:', response.data);
  } catch (error) {
    console.log('Error with invalid token:', error.response?.data || error.message);
  }
  
  console.log('\n---\n');
  
  try {
    // Test the login endpoint
    console.log('Testing login endpoint...');
    const loginResponse = await axios.post('https://lakeshore-convenience.onrender.com/api/users/login', {
      email: 'admin@foodiefrenzy.com',
      password: 'AdminPassword123!'
    });
    console.log('Login response:', loginResponse.data);
    
    if (loginResponse.data.success && loginResponse.data.token) {
      // Test with a real token
      console.log('\nTesting with real token...');
      const ordersResponse = await axios.get('https://lakeshore-convenience.onrender.com/api/users/admin/orders', {
        headers: {
          'Authorization': `Bearer ${loginResponse.data.token}`
        }
      });
      console.log('Orders response:', ordersResponse.data);
    }
  } catch (error) {
    console.log('Error during login/orders test:', error.response?.data || error.message);
  }
}

testAdminOrders();