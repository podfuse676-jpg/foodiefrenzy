// Script to check if all required environment variables are set
const fs = require('fs');
const path = require('path');

// Required environment variables for each service
const requiredEnvVars = {
  backend: [
    'MONGO_URI',
    'JWT_SECRET',
    'STRIPE_SECRET_KEY',
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'TWILIO_PHONE_NUMBER',
    'TWILIO_VERIFIED_NUMBER'
  ],
  frontend: [
    'REACT_APP_API_URL',
    'REACT_APP_FRONTEND_URL',
    'REACT_APP_ADMIN_URL'
  ],
  admin: [
    'REACT_APP_API_URL',
    'REACT_APP_FRONTEND_URL',
    'REACT_APP_ADMIN_URL'
  ]
};

// Function to check environment variables
function checkEnvVars(service, envVars) {
  console.log(`\n=== Checking ${service} environment variables ===`);
  
  const missingVars = [];
  const presentVars = [];
  
  envVars.forEach(varName => {
    if (process.env[varName]) {
      presentVars.push(varName);
    } else {
      missingVars.push(varName);
    }
  });
  
  if (presentVars.length > 0) {
    console.log(`✓ Present variables (${presentVars.length}):`);
    presentVars.forEach(varName => console.log(`  - ${varName}`));
  }
  
  if (missingVars.length > 0) {
    console.log(`✗ Missing variables (${missingVars.length}):`);
    missingVars.forEach(varName => console.log(`  - ${varName}`));
  } else {
    console.log('✓ All required environment variables are present');
  }
}

// Function to check .env file
function checkEnvFile(filePath, serviceName) {
  console.log(`\n=== Checking ${serviceName} .env file ===`);
  
  if (fs.existsSync(filePath)) {
    console.log(`✓ ${filePath} exists`);
    
    const envContent = fs.readFileSync(filePath, 'utf8');
    const envLines = envContent.split('\n').filter(line => line.trim() !== '' && !line.startsWith('#'));
    
    console.log(`Found ${envLines.length} configuration lines`);
    
    const definedVars = envLines.map(line => {
      const [key, value] = line.split('=');
      return {
        key: key.trim(),
        value: value ? value.trim() : ''
      };
    });
    
    console.log('Defined variables:');
    definedVars.forEach(({ key, value }) => {
      const displayValue = value.length > 20 ? `${value.substring(0, 20)}...` : value;
      console.log(`  - ${key} = ${displayValue}`);
    });
  } else {
    console.log(`✗ ${filePath} does not exist`);
    console.log('Please create this file with the required environment variables');
  }
}

// Check backend environment variables
checkEnvVars('Backend', requiredEnvVars.backend);

// Check frontend environment variables
checkEnvVars('Frontend', requiredEnvVars.frontend);

// Check admin environment variables
checkEnvVars('Admin', requiredEnvVars.admin);

// Check .env files
const backendEnvPath = path.join(__dirname, '..', 'backend', '.env');
const frontendEnvPath = path.join(__dirname, '..', 'frontend', '.env');
const adminEnvPath = path.join(__dirname, '..', 'admin', '.env');

checkEnvFile(backendEnvPath, 'Backend');
checkEnvFile(frontendEnvPath, 'Frontend');
checkEnvFile(adminEnvPath, 'Admin');

console.log('\n=== Environment Check Summary ===');
console.log('Remember to set environment variables in your deployment platforms:');
console.log('- MongoDB Atlas for database');
console.log('- Render.com for backend API');
console.log('- Netlify for frontend and admin panel');