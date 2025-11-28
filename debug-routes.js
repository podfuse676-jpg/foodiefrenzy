// Debug route registration
import express from 'express';
import itemRoutes from './backend/routes/itemRoute.js';

console.log('Debug route registration:');
console.log('typeof itemRoutes:', typeof itemRoutes);
console.log('itemRoutes:', itemRoutes);

// Check if it's a function that returns a router
if (typeof itemRoutes === 'function') {
  try {
    const result = itemRoutes();
    console.log('Calling itemRoutes() returns:', typeof result);
    console.log('Result:', result);
    if (result && result.stack) {
      console.log('Result is a router with', result.stack.length, 'routes');
    }
  } catch (error) {
    console.log('Error calling itemRoutes():', error.message);
  }
}

// Create a test app to see what happens when we register the routes
const app = express();
try {
  console.log('Attempting to register routes...');
  app.use('/api/items', itemRoutes);
  console.log('Routes registered successfully');
} catch (error) {
  console.log('Error registering routes:', error.message);
}