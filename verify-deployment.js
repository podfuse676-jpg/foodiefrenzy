// Simple verification script to check if deployment is working
import axios from 'axios';

// Configuration - update these URLs with your actual deployment URLs
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://your-frontend-url.vercel.app';
const ADMIN_URL = process.env.ADMIN_URL || 'https://your-admin-url.vercel.app';
const BACKEND_URL = process.env.BACKEND_URL || 'https://your-backend-url.up.railway.app';

async function verifyDeployment() {
  console.log('=== FoodieFrenzy Deployment Verification ===');
  console.log('Frontend URL:', FRONTEND_URL);
  console.log('Admin URL:', ADMIN_URL);
  console.log('Backend URL:', BACKEND_URL);
  console.log('');

  try {
    // Test 1: Check if frontend is accessible
    console.log('1. Testing frontend accessibility...');
    const frontendResponse = await axios.get(FRONTEND_URL, { timeout: 10000 });
    console.log('   ✓ Frontend is accessible (Status:', frontendResponse.status + ')');
    
    // Test 2: Check if admin panel is accessible
    console.log('2. Testing admin panel accessibility...');
    const adminResponse = await axios.get(ADMIN_URL, { timeout: 10000 });
    console.log('   ✓ Admin panel is accessible (Status:', adminResponse.status + ')');
    
    // Test 3: Check backend health endpoint
    console.log('3. Testing backend health endpoint...');
    const healthResponse = await axios.get(`${BACKEND_URL}/health`, { timeout: 10000 });
    console.log('   ✓ Backend health endpoint accessible (Status:', healthResponse.status + ')');
    console.log('   ✓ Backend status:', healthResponse.data.status);
    
    // Test 4: Check backend items endpoint
    console.log('4. Testing backend items endpoint...');
    const itemsResponse = await axios.get(`${BACKEND_URL}/api/items`, { timeout: 15000 });
    console.log('   ✓ Backend items endpoint accessible (Status:', itemsResponse.status + ')');
    console.log('   ✓ Found', itemsResponse.data.length, 'items');
    
    // Test 5: Check if items have image URLs
    if (itemsResponse.data.length > 0) {
      const itemsWithImages = itemsResponse.data.filter(item => item.imageUrl);
      console.log('   ✓ Items with images:', itemsWithImages.length);
      
      // Check first item's image URL
      const firstItem = itemsResponse.data[0];
      if (firstItem.imageUrl) {
        console.log('   ✓ First item has image URL:', firstItem.imageUrl.substring(0, 50) + '...');
      }
    }
    
    console.log('');
    console.log('=== VERIFICATION COMPLETE ===');
    console.log('✅ All deployment checks passed!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Visit your frontend URL to verify it looks correct');
    console.log('2. Visit your admin panel and log in');
    console.log('3. Test creating/updating items with images');
    console.log('4. Verify images display correctly on the frontend');
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    if (error.response) {
      console.error('   Response status:', error.response.status);
      console.error('   Response data:', JSON.stringify(error.response.data, null, 2));
    }
    
    console.log('');
    console.log('🔧 Troubleshooting tips:');
    console.log('   - Check that all URLs are correct');
    console.log('   - Verify the backend is running');
    console.log('   - Check environment variables are set correctly');
    console.log('   - Ensure CORS is configured properly in the backend');
    console.log('   - Check Vercel deployment logs for errors');
  }
}

// Run verification
verifyDeployment();