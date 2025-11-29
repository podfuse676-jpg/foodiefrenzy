// Comprehensive email configuration test
import dotenv from 'dotenv';
dotenv.config();

console.log('=== COMPREHENSIVE EMAIL CONFIGURATION TEST ===');

// Check all environment variables
console.log('Environment Variables:');
console.log('- EMAIL_USER:', process.env.EMAIL_USER ? `${process.env.EMAIL_USER} (SET)` : 'NOT SET');
console.log('- EMAIL_PASS:', process.env.EMAIL_PASS ? `******** (SET)` : 'NOT SET');
console.log('- SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? `******** (SET)` : 'NOT SET');

// Test importing email services
try {
  console.log('\nTesting email service imports...');
  const emailService = await import('./services/emailService.js');
  console.log('✅ Primary email service imported successfully');
  
  const alternativeEmailService = await import('./services/alternativeEmailService.js');
  console.log('✅ Alternative email service imported successfully');
  
  const sendGridEmailService = await import('./services/sendGridEmailService.js');
  console.log('✅ SendGrid email service imported successfully');
  
  // Check if transporters are initialized
  console.log('\nChecking transporter initialization...');
  console.log('- Primary service transporter:', emailService.default.transporter ? 'INITIALIZED' : 'NOT INITIALIZED');
  console.log('- Alternative service transporter:', alternativeEmailService.default.transporter ? 'INITIALIZED' : 'NOT INITIALIZED');
  console.log('- SendGrid service transporter:', sendGridEmailService.default.transporter ? 'INITIALIZED' : 'NOT INITIALIZED');
  
} catch (error) {
  console.log('❌ Error importing email services:', error.message);
}

console.log('\n=== TEST COMPLETE ===');