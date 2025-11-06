// Script to generate a secure JWT secret
import crypto from 'crypto';

// Generate a random string of 64 characters (512 bits)
const jwtSecret = crypto.randomBytes(64).toString('hex');

console.log('Generated JWT Secret:');
console.log(jwtSecret);
console.log('\nCopy this value and use it as your JWT_SECRET environment variable.');