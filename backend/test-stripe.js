import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

console.log('Stripe key exists:', !!process.env.STRIPE_SECRET_KEY);
console.log('Key length:', process.env.STRIPE_SECRET_KEY?.length || 0);

if (process.env.STRIPE_SECRET_KEY) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16'
    });
    console.log('Stripe initialized successfully');
  } catch (error) {
    console.error('Error initializing Stripe:', error.message);
  }
} else {
  console.log('Stripe secret key not found in environment variables');
}