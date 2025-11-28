// Test script to verify SendGrid email service functionality
import dotenv from 'dotenv';
dotenv.config();

import sendGridEmailService from './services/sendGridEmailService.js';

async function testSendGridEmailService() {
  console.log('🧪 Testing SendGrid Email Service...');
  
  // Check if environment variables are set
  console.log('Checking environment variables...');
  console.log('- SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? 'SET' : 'NOT SET');
  console.log('- FROM_EMAIL:', process.env.FROM_EMAIL ? 'SET' : 'NOT SET');
  console.log('- JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
  
  if (!process.env.SENDGRID_API_KEY) {
    console.log('❌ SENDGRID_API_KEY not set. Please configure environment variables.');
    console.log('\n🔧 To use SendGrid:');
    console.log('1. Sign up at https://sendgrid.com/');
    console.log('2. Get a free API key');
    console.log('3. Set SENDGRID_API_KEY in your Render environment variables');
    process.exit(1);
  }
  
  // Wait a moment for the transporter to initialize
  console.log('\n⏳ Waiting for SendGrid email transporter to initialize...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Test sending an OTP
  console.log('\n📧 Testing OTP email sending with SendGrid service...');
  const testEmail = process.env.FROM_EMAIL || process.env.EMAIL_USER || 'test@example.com';
  const testOTP = '987654';
  
  try {
    console.log(`Sending OTP ${testOTP} to ${testEmail}...`);
    const result = await sendGridEmailService.sendOTP(testEmail, testOTP);
    
    if (result.success) {
      console.log('✅ SendGrid email sent successfully!');
      console.log('Message ID:', result.messageId);
    } else {
      console.log('❌ Failed to send SendGrid email:', result.error);
      
      // Provide specific guidance based on error
      if (result.error.includes('timeout')) {
        console.log('\n🔧 TROUBLESHOOTING TIP:');
        console.log('This appears to be a network timeout issue.');
        console.log('SendGrid is generally more reliable than Gmail SMTP on hosting platforms.');
      }
    }
  } catch (error) {
    console.log('💥 Error during SendGrid email test:', error.message);
  }
  
  console.log('\n🏁 SendGrid email service test completed.');
}

// Run the test
testSendGridEmailService();