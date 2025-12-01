import axios from 'axios';

const baseURL = 'http://localhost:10000';
const adminEmail = 'admin@foodiefrenzy.com';
const adminPassword = 'admin123';

async function testSearchEndpoint() {
  try {
    console.log('Testing user search endpoint...');
    
    // First, login as admin to get token
    console.log('Logging in as admin...');
    const loginResponse = await axios.post(`${baseURL}/api/users/login`, {
      email: adminEmail,
      password: adminPassword
    });
    
    if (!loginResponse.data.success) {
      console.error('Login failed:', loginResponse.data.message);
      return;
    }
    
    const token = loginResponse.data.token;
    console.log('Login successful. Token received.');
    
    // Test the search endpoint
    console.log('Testing search endpoint...');
    const searchResponse = await axios.get(`${baseURL}/api/users/admin/users/search`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('Search response:', searchResponse.data);
    
    if (searchResponse.data.success) {
      console.log(`Found ${searchResponse.data.count} users`);
      console.log('First few users:');
      searchResponse.data.users.slice(0, 3).forEach(user => {
        console.log(`- ${user.username} (${user.email}) - Role: ${user.role}`);
      });
    } else {
      console.error('Search failed:', searchResponse.data.message);
    }
  } catch (error) {
    console.error('Error testing search endpoint:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

testSearchEndpoint();