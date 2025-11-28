// Test script to verify alternative email service functionality
import dotenv from 'dotenv';
dotenv.config();

import alternativeEmailService from './services/alternativeEmailService.js';

async function testAlternativeEmailService() {
  console.log('🧪 Testing Alternative Email Service...');
  
  // Check if environment variables are set
  console.log('Checking environment variables...');
  console.log('- EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'NOT SET');
  console.log('- EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET' : 'NOT SET');
  console.log('- JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('❌ EMAIL_USER and/or EMAIL_PASS not set. Please configure environment variables.');
    process.exit(1);
  }
  
  // Wait a moment for the transporter to initialize
  console.log('\n⏳ Waiting for alternative email transporter to initialize...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Test sending an OTP
  console.log('\n📧 Testing OTP email sending with alternative service...');
  const testEmail = process.env.EMAIL_USER; // Send to the same email for testing
  const testOTP = '654321';
  
  try {
    console.log(`Sending OTP ${testOTP} to ${testEmail}...`);
    const result = await alternativeEmailService.sendOTP(testEmail, testOTP);
    
    if (result.success) {
      console.log('✅ Alternative email sent successfully!');
      console.log('Message ID:', result.messageId);
    } else {
      console.log('❌ Failed to send alternative email:', result.error);
      
      // Provide specific guidance based on error
      if (result.error.includes('timeout')) {
        console.log('\n🔧 TROUBLESHOOTING TIP:');
        console.log('This appears to be a network timeout issue, which is common on some hosting platforms.');
        console.log('Try these solutions:');
        console.log('1. Check if your hosting provider blocks outbound SMTP connections');
        console.log('2. Consider using a different email service like SendGrid or Mailgun');
        console.log('3. Contact your hosting provider about SMTP restrictions');
      }
    }
  } catch (error) {
    console.log('💥 Error during alternative email test:', error.message);
  }
  
  console.log('\n🏁 Alternative email service test completed.');
}

// Run the test
testAlternativeEmailService();