// Script to upload images directly to the deployed backend
import fs from 'fs';
import path from 'path';
import https from 'https';
import FormData from 'form-data';

const BACKEND_URL = 'https://lakeshoreconveniencee-backend.onrender.com';

// Function to upload a single image
function uploadImage(imagePath, itemId) {
  return new Promise((resolve, reject) => {
    console.log(`Uploading ${imagePath} for item ID "${itemId}"...`);
    
    // Create form data
    const formData = new FormData();
    formData.append('image', fs.createReadStream(imagePath));
    
    // Create the request options
    const options = {
      method: 'PUT',
      headers: {
        ...formData.getHeaders()
      },
      timeout: 30000 // 30 second timeout
    };
    
    // Create the request
    const req = https.request(`${BACKEND_URL}/api/items/${itemId}`, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const result = JSON.parse(data);
            console.log(`✓ Successfully uploaded image for item ID "${itemId}"`);
            console.log(`  New image URL: ${result.imageUrl}`);
            resolve(result);
          } catch (error) {
            console.log(`✓ Upload successful but failed to parse response for item ID "${itemId}"`);
            resolve({ itemId, rawResponse: data });
          }
        } else {
          console.log(`✗ Failed to upload image for item ID "${itemId}": ${res.statusCode} ${data}`);
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`✗ Network error uploading image for item ID "${itemId}": ${error.message}`);
      reject(error);
    });
    
    req.on('timeout', () => {
      req.destroy();
      console.log(`✗ Timeout uploading image for item ID "${itemId}"`);
      reject(new Error('Request timeout'));
    });
    
    // Pipe the form data to the request
    formData.pipe(req);
  });
}

// Main function to upload all images
async function uploadAllImages() {
  console.log('Starting direct image upload process...\n');
  
  // Image mapping - item ID to image file path
  // We'll need to get the actual item IDs from the database
  const imageMapping = {
    "car-perfume.jpg": "./uploads/images/car-perfume.jpg",
    "dash-board-polish.webp": "./uploads/images/dash-board-polish.webp",
    // Add more images as needed
  };
  
  // For now, let's just test if we can upload to a test endpoint
  try {
    console.log('Testing connection to backend...');
    
    // First, let's try to get the items to get their IDs
    const itemsResponse = await new Promise((resolve, reject) => {
      https.get(`${BACKEND_URL}/api/items`, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const items = JSON.parse(data);
              resolve(items);
            } catch (error) {
              reject(error);
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      }).on('error', reject);
    });
    
    console.log(`Found ${itemsResponse.length} items`);
    
    // Find the specific items we want to update
    const carPerfumeItem = itemsResponse.find(item => item.name === "Car Perfume");
    const dashboardPolishItem = itemsResponse.find(item => item.name === "Dashboard Polish");
    
    if (carPerfumeItem) {
      console.log(`Found Car Perfume with ID: ${carPerfumeItem._id}`);
      try {
        const fullPath = path.join(process.cwd(), "./uploads/images/car-perfume.jpg");
        if (fs.existsSync(fullPath)) {
          await uploadImage(fullPath, carPerfumeItem._id);
        } else {
          console.log(`⚠ Image file not found: ${fullPath}`);
        }
      } catch (error) {
        console.log(`✗ Error uploading Car Perfume image: ${error.message}`);
      }
    } else {
      console.log("⚠ Car Perfume item not found");
    }
    
    if (dashboardPolishItem) {
      console.log(`Found Dashboard Polish with ID: ${dashboardPolishItem._id}`);
      try {
        const fullPath = path.join(process.cwd(), "./uploads/images/dash-board-polish.webp");
        if (fs.existsSync(fullPath)) {
          await uploadImage(fullPath, dashboardPolishItem._id);
        } else {
          console.log(`⚠ Image file not found: ${fullPath}`);
        }
      } catch (error) {
        console.log(`✗ Error uploading Dashboard Polish image: ${error.message}`);
      }
    } else {
      console.log("⚠ Dashboard Polish item not found");
    }
    
  } catch (error) {
    console.log(`✗ Error getting items: ${error.message}`);
    console.log('Backend may still be deploying or unavailable');
  }
  
  console.log('\nDirect image upload process completed');
}

// Run the script
uploadAllImages().catch(console.error);