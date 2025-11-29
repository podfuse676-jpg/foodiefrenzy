// Test Resend email service
import dotenv from 'dotenv';
dotenv.config();

console.log('=== RESEND EMAIL SERVICE TEST ===');

// Check environment variables
console.log('Environment Variables:');
console.log('- RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'SET' : 'NOT SET');
console.log('- FROM_EMAIL:', process.env.FROM_EMAIL ? process.env.FROM_EMAIL : 'NOT SET');

try {
  console.log('\nTesting Resend email service import...');
  const resendEmailService = await import('./services/resendEmailService.js');
  console.log('✅ Resend email service imported successfully');
  
  // Test sending an OTP
  console.log('\n📧 Testing OTP email sending with Resend service...');
  const testEmail = process.env.FROM_EMAIL || 'test@example.com';
  const testOTP = '123456';
  
  try {
    console.log(`Sending OTP ${testOTP} to ${testEmail}...`);
    const result = await resendEmailService.default.sendOTP(testEmail, testOTP);
    
    if (result.success) {
      console.log('✅ Resend email sent successfully!');
      console.log('Message ID:', result.messageId);
    } else {
      console.log('❌ Failed to send Resend email:', result.error);
    }
  } catch (error) {
    console.log('❌ Error sending test email:', error.message);
  }
} catch (error) {
  console.log('❌ Error importing Resend email service:', error.message);
}

console.log('\n=== TEST COMPLETE ===');