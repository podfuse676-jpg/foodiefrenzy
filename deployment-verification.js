// Deployment verification script to check if all components are working correctly
import axios from 'axios';

// Configuration
const BACKEND_URL = process.env.BACKEND_URL || 'https://lakeshoreconveniencee-backend-production.up.railway.app';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://lakeshoreconvenience.com';
const ADMIN_URL = process.env.ADMIN_URL || 'https://admin.lakeshoreconvenience.com';

console.log('=== DEPLOYMENT VERIFICATION SCRIPT ===');
console.log('Backend URL:', BACKEND_URL);
console.log('Frontend URL:', FRONTEND_URL);
console.log('Admin URL:', ADMIN_URL);
console.log('=====================================\n');

async function verifyBackend() {
  console.log('1. Verifying Backend Services...');
  
  try {
    // Test health endpoint
    console.log('   Testing /health endpoint...');
    const healthResponse = await axios.get(`${BACKEND_URL}/health`, { timeout: 10000 });
    console.log('   ✓ Health endpoint accessible:', healthResponse.status);
    console.log('   ✓ Health status:', healthResponse.data.status);
    
    // Test items endpoint
    console.log('   Testing /api/items endpoint...');
    const itemsResponse = await axios.get(`${BACKEND_URL}/api/items`, { timeout: 15000 });
    console.log('   ✓ Items endpoint accessible:', itemsResponse.status);
    console.log('   ✓ Found', itemsResponse.data.length, 'items');
    
    // Check if items have image URLs
    const itemsWithImages = itemsResponse.data.filter(item => item.imageUrl);
    console.log('   ✓ Items with images:', itemsWithImages.length);
    
    // Test CORS
    console.log('   Testing CORS configuration...');
    const corsResponse = await axios.get(`${BACKEND_URL}/api/test-cors`, {
      headers: { 'Origin': FRONTEND_URL },
      timeout: 10000
    });
    console.log('   ✓ CORS test passed:', corsResponse.status);
    
    return true;
  } catch (error) {
    console.error('   ❌ Backend verification failed:', error.message);
    if (error.response) {
      console.error('   Response status:', error.response.status);
      console.error('   Response data:', error.response.data);
    }
    return false;
  }
}

async function verifyFrontend() {
  console.log('\n2. Verifying Frontend Services...');
  
  try {
    console.log('   Testing frontend homepage...');
    const frontendResponse = await axios.get(FRONTEND_URL, { timeout: 15000 });
    console.log('   ✓ Frontend accessible:', frontendResponse.status);
    
    // Check if the response contains expected content
    if (frontendResponse.data.includes('Our Grocery Selection') || 
        frontendResponse.data.includes('Lakeshore Convenience')) {
      console.log('   ✓ Frontend content appears correct');
    } else {
      console.log('   ⚠ Frontend content may not be loading correctly');
    }
    
    return true;
  } catch (error) {
    console.error('   ❌ Frontend verification failed:', error.message);
    return false;
  }
}

async function verifyAdmin() {
  console.log('\n3. Verifying Admin Panel...');
  
  try {
    console.log('   Testing admin panel homepage...');
    const adminResponse = await axios.get(ADMIN_URL, { timeout: 15000 });
    console.log('   ✓ Admin panel accessible:', adminResponse.status);
    
    // Check if the response contains expected content
    if (adminResponse.data.includes('Admin') || 
        adminResponse.data.includes('Login') ||
        adminResponse.data.includes('Dashboard')) {
      console.log('   ✓ Admin panel content appears correct');
    } else {
      console.log('   ⚠ Admin panel content may not be loading correctly');
    }
    
    return true;
  } catch (error) {
    console.error('   ❌ Admin panel verification failed:', error.message);
    return false;
  }
}

async function verifyImageDisplay() {
  console.log('\n4. Verifying Image Display...');
  
  try {
    // Get items from backend
    console.log('   Fetching items to check image URLs...');
    const itemsResponse = await axios.get(`${BACKEND_URL}/api/items`, { timeout: 15000 });
    const items = itemsResponse.data;
    
    if (items.length === 0) {
      console.log('   ⚠ No items found to verify images');
      return true;
    }
    
    // Check image URLs for first few items
    const sampleItems = items.slice(0, 3);
    let imageCheckPassed = true;
    
    for (const item of sampleItems) {
      console.log(`   Checking item: ${item.name}`);
      
      if (item.imageUrl) {
        console.log(`     ✓ Has image URL: ${item.imageUrl.substring(0, 60)}${item.imageUrl.length > 60 ? '...' : ''}`);
        
        // Check if it's a Cloudinary URL
        if (item.imageUrl.includes('cloudinary.com')) {
          console.log('     ✓ Using Cloudinary for image storage');
        } else if (item.imageUrl.startsWith('http')) {
          console.log('     ✓ Using external image URL');
        } else {
          console.log('     ℹ Using relative image URL');
        }
      } else {
        console.log('     ⚠ No image URL found');
        imageCheckPassed = false;
      }
    }
    
    return imageCheckPassed;
  } catch (error) {
    console.error('   ❌ Image display verification failed:', error.message);
    return false;
  }
}

async function runVerification() {
  console.log('Starting deployment verification...\n');
  
  const backendOk = await verifyBackend();
  const frontendOk = await verifyFrontend();
  const adminOk = await verifyAdmin();
  const imagesOk = await verifyImageDisplay();
  
  console.log('\n=== VERIFICATION SUMMARY ===');
  console.log('Backend:', backendOk ? '✓ PASS' : '❌ FAIL');
  console.log('Frontend:', frontendOk ? '✓ PASS' : '❌ FAIL');
  console.log('Admin Panel:', adminOk ? '✓ PASS' : '❌ FAIL');
  console.log('Image Display:', imagesOk ? '✓ PASS' : '❌ FAIL');
  
  if (backendOk && frontendOk && adminOk && imagesOk) {
    console.log('\n🎉 ALL VERIFICATIONS PASSED! Deployment is successful.');
    console.log('\n📋 Next steps:');
    console.log('   1. Test adding/editing items in the admin panel');
    console.log('   2. Verify images display correctly on the frontend');
    console.log('   3. Test ordering functionality');
    console.log('   4. Monitor logs for any issues');
  } else {
    console.log('\n⚠️  SOME VERIFICATIONS FAILED!');
    console.log('Please check the errors above and review your deployment configuration.');
    
    if (!backendOk) {
      console.log('\n🔧 Backend troubleshooting:');
      console.log('   - Check Railway logs for backend service');
      console.log('   - Verify MongoDB connection');
      console.log('   - Check environment variables');
    }
    
    if (!frontendOk) {
      console.log('\n🔧 Frontend troubleshooting:');
      console.log('   - Check Vercel deployment logs');
      console.log('   - Verify API URL configuration');
    }
    
    if (!adminOk) {
      console.log('\n🔧 Admin panel troubleshooting:');
      console.log('   - Check Vercel deployment logs for admin panel');
      console.log('   - Verify API URL configuration');
    }
  }
}

// Run the verification
runVerification().catch(error => {
  console.error('Verification script failed with error:', error);
});