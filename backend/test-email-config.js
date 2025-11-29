// Comprehensive email configuration test
import dotenv from 'dotenv';
dotenv.config();

console.log('=== COMPREHENSIVE EMAIL CONFIGURATION TEST ===');

// Check all environment variables
console.log('Environment Variables:');
console.log('- RESEND_API_KEY:', process.env.RESEND_API_KEY ? `******** (SET)` : 'NOT SET');
console.log('- FROM_EMAIL:', process.env.FROM_EMAIL ? `${process.env.FROM_EMAIL} (SET)` : 'NOT SET');

// Test importing email services
try {
  console.log('\nTesting email service imports...');
  const resendEmailService = await import('./services/resendEmailService.js');
  console.log('✅ Resend email service imported successfully');
  
  // Check if service is initialized
  console.log('\nChecking service initialization...');
  console.log('- Resend service initialized:', resendEmailService.default.resend ? 'YES' : 'NO');
  
} catch (error) {
  console.log('❌ Error importing email services:', error.message);
}

console.log('\n=== TEST COMPLETE ===');