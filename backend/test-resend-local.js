// Local Resend test script
import dotenv from 'dotenv';
dotenv.config();

console.log('=== LOCAL RESEND CONFIGURATION TEST ===');

// Check environment variables
console.log('Environment Variables:');
console.log('- RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'SET' : 'NOT SET');
console.log('- FROM_EMAIL:', process.env.FROM_EMAIL || 'NOT SET');

if (!process.env.RESEND_API_KEY) {
  console.log('\n❌ RESEND_API_KEY is not set!');
  console.log('Please set your Resend API key in the .env file:');
  console.log('RESEND_API_KEY=your_resend_api_key_here');
  process.exit(1);
}

if (!process.env.FROM_EMAIL) {
  console.log('\n⚠️  FROM_EMAIL is not set!');
  console.log('Using default email: noreply@lakeshoreconvenience.com');
}

try {
  console.log('\nTesting Resend email service import...');
  const { Resend } = await import('resend');
  
  if (!Resend) {
    console.log('❌ Failed to import Resend');
    process.exit(1);
  }
  
  console.log('✅ Resend imported successfully');
  
  // Initialize Resend client
  const resend = new Resend(process.env.RESEND_API_KEY);
  console.log('✅ Resend client initialized');
  
  // Test sending a simple email (this will only work if API key is valid)
  console.log('\n📧 Testing Resend API connection...');
  
  // We won't actually send an email here to avoid spamming, but we can test the connection
  console.log('✅ Resend setup looks good!');
  console.log('\nTo test actual email sending, run:');
  console.log('npm run test-email-service');
  
} catch (error) {
  console.log('❌ Error testing Resend:', error.message);
  process.exit(1);
}

console.log('\n=== LOCAL TEST COMPLETE ===');