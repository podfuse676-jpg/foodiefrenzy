// Test script to verify WhatsApp service functionality
import dotenv from 'dotenv';
dotenv.config();

import whatsappService from './services/whatsappService.js';

async function testWhatsAppService() {
  console.log('🧪 Testing WhatsApp Service...');
  
  // Check if environment variables are set
  console.log('Checking environment variables...');
  console.log('- WHATSAPP_ACCESS_TOKEN:', process.env.WHATSAPP_ACCESS_TOKEN ? 'SET' : 'NOT SET');
  console.log('- WHATSAPP_PHONE_NUMBER_ID:', process.env.WHATSAPP_PHONE_NUMBER_ID ? 'SET' : 'NOT SET');
  console.log('- WHATSAPP_BUSINESS_ID:', process.env.WHATSAPP_BUSINESS_ID ? 'SET' : 'NOT SET');
  console.log('- JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
  
  if (!process.env.WHATSAPP_ACCESS_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID) {
    console.log('❌ WHATSAPP_ACCESS_TOKEN and/or WHATSAPP_PHONE_NUMBER_ID not set. Please configure environment variables.');
    console.log('\n🔧 To use WhatsApp OTP:');
    console.log('1. Get WhatsApp Business API credentials from Meta');
    console.log('2. Set WHATSAPP_ACCESS_TOKEN in your Render environment variables');
    console.log('3. Set WHATSAPP_PHONE_NUMBER_ID in your Render environment variables');
    process.exit(1);
  }
  
  // Test sending an OTP
  console.log('\n📧 Testing OTP sending via WhatsApp...');
  const testPhoneNumber = process.env.TEST_PHONE_NUMBER || '+1234567890'; // Replace with your test number
  const testOTP = '123456';
  
  try {
    console.log(`Sending OTP ${testOTP} to ${testPhoneNumber}...`);
    const result = await whatsappService.sendOTP(testPhoneNumber, testOTP);
    
    if (result.success) {
      console.log('✅ WhatsApp message sent successfully!');
      console.log('Message ID:', result.messageId);
    } else {
      console.log('❌ Failed to send WhatsApp message:', result.error);
    }
  } catch (error) {
    console.log('💥 Error during WhatsApp test:', error.message);
  }
  
  console.log('\n🏁 WhatsApp service test completed.');
}

// Run the test
testWhatsAppService();