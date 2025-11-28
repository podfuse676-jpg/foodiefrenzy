// Debug imports from within the backend directory
import itemRoutes from './routes/itemRoute.js';

console.log('Debug imports from backend directory:');
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
    console.log('Error stack:', error.stack);
  }
}