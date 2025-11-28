// Test script to verify email service functionality
import dotenv from 'dotenv';
dotenv.config();

import emailService from './services/emailService.js';

async function testEmailService() {
  console.log('🧪 Testing Email Service...');
  
  // Check if environment variables are set
  console.log('Checking environment variables...');
  console.log('- EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'NOT SET');
  console.log('- EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET' : 'NOT SET');
  console.log('- JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('❌ EMAIL_USER and/or EMAIL_PASS not set. Please configure environment variables.');
    process.exit(1);
  }
  
  // Test sending an OTP
  console.log('\n📧 Testing OTP email sending...');
  const testEmail = process.env.EMAIL_USER; // Send to the same email for testing
  const testOTP = '123456';
  
  try {
    console.log(`Sending OTP ${testOTP} to ${testEmail}...`);
    const result = await emailService.sendOTP(testEmail, testOTP);
    
    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log('Message ID:', result.messageId);
    } else {
      console.log('❌ Failed to send email:', result.error);
    }
  } catch (error) {
    console.log('💥 Error during email test:', error.message);
  }
  
  console.log('\n🏁 Email service test completed.');
}

// Run the test
testEmailService();