// Test to check if routes are imported correctly
import itemRoutes from './backend/routes/itemRoute.js';
import cartRoutes from './backend/routes/cartRoute.js';
import orderRoutes from './backend/routes/orderRoute.js';
import newOrderRoutes from './backend/routes/newOrderRoutes.js';
import userRoutes from './backend/routes/userRoute.js';
import phoneAuthRoutes from './backend/routes/phoneAuthRoute.js';
import reviewRoutes from './backend/routes/reviewRoute.js';
import testRoutes from './backend/routes/testRoute.js';

console.log('Route imports test:');
console.log('itemRoutes:', typeof itemRoutes);
console.log('cartRoutes:', typeof cartRoutes);
console.log('orderRoutes:', typeof orderRoutes);
console.log('newOrderRoutes:', typeof newOrderRoutes);
console.log('userRoutes:', typeof userRoutes);
console.log('phoneAuthRoutes:', typeof phoneAuthRoutes);
console.log('reviewRoutes:', typeof reviewRoutes);
console.log('testRoutes:', typeof testRoutes);

// Check if they are Express routers
if (itemRoutes && typeof itemRoutes === 'object' && itemRoutes.stack) {
  console.log('itemRoutes is a valid Express router with', itemRoutes.stack.length, 'routes');
} else {
  console.log('itemRoutes is NOT a valid Express router');
}