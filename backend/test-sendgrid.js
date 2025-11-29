// Test SendGrid configuration
import dotenv from 'dotenv';
dotenv.config();

console.log('=== SENDGRID CONFIGURATION TEST ===');

// Check SendGrid API key
console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? `SET (${process.env.SENDGRID_API_KEY.substring(0, 10)}...)` : 'NOT SET');

if (process.env.SENDGRID_API_KEY) {
  console.log('API Key length:', process.env.SENDGRID_API_KEY.length);
  
  // Test importing SendGrid service
  try {
    console.log('\nTesting SendGrid service import...');
    const sendGridEmailService = await import('./services/sendGridEmailService.js');
    console.log('✅ SendGrid service imported successfully');
    
    // Check if transporter is initialized
    console.log('Transporter status:', sendGridEmailService.default.transporter ? 'INITIALIZED' : 'NOT INITIALIZED');
    
    if (sendGridEmailService.default.transporter) {
      console.log('✅ SendGrid transporter is ready');
    } else {
      console.log('❌ SendGrid transporter failed to initialize');
    }
  } catch (error) {
    console.log('❌ Error importing SendGrid service:', error.message);
  }
} else {
  console.log('❌ SENDGRID_API_KEY not set');
}

console.log('=== TEST COMPLETE ===');