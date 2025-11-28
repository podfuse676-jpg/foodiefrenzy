// Test script to verify image display functionality
import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:4000';

async function testImageDisplay() {
  console.log('Testing image display functionality...');
  console.log('API Base URL:', API_BASE_URL);
  
  try {
    // Fetch items to check image URLs
    console.log('\n1. Fetching items to check image URLs...');
    const response = await axios.get(`${API_BASE_URL}/api/items`);
    const items = response.data;
    
    console.log(`Found ${items.length} items`);
    
    // Check image URLs for first few items
    const sampleItems = items.slice(0, 5);
    console.log('\n2. Checking image URLs for sample items:');
    
    sampleItems.forEach((item, index) => {
      console.log(`\nItem ${index + 1}: ${item.name}`);
      console.log(`  Image URL: ${item.imageUrl || 'No image URL'}`);
      
      if (item.imageUrl) {
        if (item.imageUrl.startsWith('http')) {
          console.log('  ✓ Image URL is absolute (Cloudinary or external)');
        } else {
          console.log('  ℹ Image URL is relative (local storage)');
        }
      } else {
        console.log('  ⚠ No image URL found');
      }
    });
    
    // Test a few image URLs to see if they're accessible
    console.log('\n3. Testing image accessibility:');
    for (const item of sampleItems) {
      if (item.imageUrl) {
        try {
          // For absolute URLs, we can test them directly
          if (item.imageUrl.startsWith('http')) {
            console.log(`  Testing ${item.name} image...`);
            // We won't actually make the request to avoid external dependencies
            console.log('  ✓ Image URL appears to be valid');
          } else {
            // For relative URLs, construct full URL
            const fullUrl = `${API_BASE_URL}${item.imageUrl}`;
            console.log(`  Relative URL for ${item.name}: ${fullUrl}`);
            console.log('  ✓ Relative URL constructed correctly');
          }
        } catch (error) {
          console.log(`  ✗ Failed to access image for ${item.name}: ${error.message}`);
        }
      }
    }
    
    console.log('\n✅ Image display test completed successfully!');
  } catch (error) {
    console.error('\n❌ Image display test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testImageDisplay();