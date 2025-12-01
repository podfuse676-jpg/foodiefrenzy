import axios from 'axios';

const baseURL = 'http://localhost:10000';
const adminEmail = 'admin@foodiefrenzy.com';
const adminPassword = 'admin123';

async function testPhoneSearch() {
  try {
    console.log('Testing user search with phone number...');
    
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
    
    // Test the search endpoint with a phone number
    const query = '7715939788';
    console.log(`Testing search endpoint with phone number: "${query}"`);
    const searchResponse = await axios.get(`${baseURL}/api/users/admin/users/search?query=${encodeURIComponent(query)}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('Search response:', searchResponse.data);
    
    if (searchResponse.data.success) {
      console.log(`Found ${searchResponse.data.count} users matching phone "${query}"`);
      searchResponse.data.users.forEach(user => {
        console.log(`- ${user.username} (${user.email}) - Phone: ${user.phoneNumber || 'N/A'} - Role: ${user.role}`);
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

testPhoneSearch();