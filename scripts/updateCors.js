// Script to update CORS configuration with deployed URLs
const fs = require('fs');
const path = require('path');

// Get deployed URLs from command line arguments or use placeholders
const frontendUrl = process.argv[2] || 'https://your-frontend.netlify.app';
const adminUrl = process.argv[3] || 'https://your-admin.netlify.app';

const serverFilePath = path.join(__dirname, '..', 'backend', 'server.js');

// Read the server.js file
fs.readFile(serverFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading server.js:', err);
    return;
  }

  // Update CORS configuration
  const updatedData = data.replace(
    /cors\(\{[\s\S]*?origin:\s*\[[\s\S]*?\][\s\S]*?\}\)/,
    `cors({
        origin: [
            'http://localhost:5173', 
            'http://localhost:5174', 
            'http://localhost:5175', 
            'http://localhost:5176', 
            'http://localhost:5177',
            '${frontendUrl}',
            '${adminUrl}'
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: ['Content-Length', 'Content-Type']
    })`
  );

  // Write the updated content back to the file
  fs.writeFile(serverFilePath, updatedData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing to server.js:', err);
      return;
    }
    
    console.log('CORS configuration updated successfully!');
    console.log(`Frontend URL: ${frontendUrl}`);
    console.log(`Admin URL: ${adminUrl}`);
    console.log('Remember to redeploy your backend for changes to take effect.');
  });
});