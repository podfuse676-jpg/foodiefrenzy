import axios from 'axios';

const testLogin = async () => {
  try {
    console.log('Testing login with axios...');
    
    const response = await axios.post('https://lakeshoreconveniencee-backend.onrender.com/api/users/login', {
      email: 'admin@foodiefrenzy.com',
      password: 'AdminPassword123!'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Login response:', response.data);
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
  }
};

testLogin();