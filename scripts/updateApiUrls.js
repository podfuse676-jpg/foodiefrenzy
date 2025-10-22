// Script to update hardcoded API URLs to use environment variables
const fs = require('fs');
const path = require('path');

// Function to replace localhost:4000 with environment variable
function updateApiUrls(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace localhost:4000 with process.env.REACT_APP_API_URL
    content = content.replace(/http:\/\/localhost:4000/g, '${process.env.REACT_APP_API_URL}');
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
  }
}

// List of files to update
const filesToUpdate = [
  'frontend/src/CartContext/CartContext.jsx',
  'frontend/src/components/CartPage/CartPage.jsx',
  'frontend/src/components/Checkout/Checkout.jsx',
  'frontend/src/components/Login/Login.jsx',
  'frontend/src/components/MyOredrsPage/MyOrdersPage.jsx',
  'frontend/src/components/OurMenu/OurMenu.jsx',
  'admin/src/components/AddItems/AddItems.jsx',
  'admin/src/components/ListItems/ListItems.jsx',
  'admin/src/components/Orders/Orders.jsx'
];

// Update each file
filesToUpdate.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    updateApiUrls(fullPath);
  } else {
    console.log(`File not found: ${fullPath}`);
  }
});

console.log('API URL update process completed.');