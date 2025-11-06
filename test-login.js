const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login endpoint at http://localhost:4000/api/users/login...');
    
    // Test with a sample login request
    const response = await axios.post('http://localhost:4000/api/users/login', {
      email: 'test@example.com',
      password: 'testpassword'
    });
    
    console.log('Login endpoint response status:', response.status);
    console.log('Login endpoint response data:', response.data);
    
    console.log('Login test completed successfully!');
  } catch (error) {
    console.error('Login test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testLogin();