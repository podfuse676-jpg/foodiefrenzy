// Script to check email configuration
import dotenv from 'dotenv';
dotenv.config();

console.log('=== EMAIL CONFIGURATION CHECK ===');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'NOT SET');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET' : 'NOT SET');
console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? 'SET' : 'NOT SET');

if (process.env.EMAIL_USER) {
  console.log('EMAIL_USER value:', process.env.EMAIL_USER);
}

if (process.env.SENDGRID_API_KEY) {
  console.log('SENDGRID_API_KEY is set (length):', process.env.SENDGRID_API_KEY.length);
}

console.log('==================================');