# Order Management Implementation

This document describes the implementation of the order management functionality as requested.

## Task 1: Order Model

### Requirements

- userId (ObjectId ref User, required)
- items: [{ productId, name, image, price, quantity }]
- totalAmount
- status (string: "PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", etc.)
- shippingAddress: { name, phone, line1, line2, city, pincode }
- createdAt, updatedAt
- Add indexes on userId and createdAt

### Implementation

The order model has been implemented in [backend/modals/order.js](backend/modals/order.js):

1. **userId**: ObjectId reference to User model, required, indexed
2. **items**: Array of order items with:
   - productId: ObjectId reference to Item model, required
   - name: String, required
   - image: String, optional
   - price: Number, required
   - quantity: Number, required
3. **totalAmount**: Number, required
4. **status**: String enum with values ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"], default "PLACED", indexed
5. **shippingAddress**: Embedded document with:
   - name: String, required
   - phone: String, required
   - line1: String, required
   - line2: String, optional
   - city: String, required
   - pincode: String, required
6. **timestamps**: createdAt and updatedAt are automatically managed by Mongoose
7. **Indexes**: Added on userId and createdAt fields

## Task 2: Order Routes

### Requirements

- GET /api/orders/my
  - Requires JWT auth (req.user.id)
  - Return all orders for that user, sorted by createdAt DESC
  - Return: \_id, createdAt, totalAmount, status, shippingAddress.name, and items
- GET /api/orders/:id
  - Requires JWT auth
  - Only allow access if the order's userId matches req.user.id
  - Return full order details

### Implementation

#### Controller

The controller has been implemented in [backend/controllers/newOrderController.js](backend/controllers/newOrderController.js):

1. **getMyOrders**:

   - Fetches all orders for the authenticated user
   - Sorts by createdAt DESC
   - Selects only the required fields: \_id, createdAt, totalAmount, status, shippingAddress.name, and items

2. **getOrderById**:
   - Fetches a specific order by ID
   - Validates that the order belongs to the authenticated user
   - Returns full order details
   - Includes proper error handling for invalid IDs and missing orders

#### Routes

The routes have been implemented in [backend/routes/newOrderRoutes.js](backend/routes/newOrderRoutes.js):

1. **GET /api/orders/my**: Maps to getMyOrders controller function
2. **GET /api/orders/:id**: Maps to getOrderById controller function
3. Both routes use the authMiddleware to ensure JWT authentication

#### Server Integration

The new routes have been integrated into the server in [backend/server.js](backend/server.js):

1. Imported the new routes module
2. Mounted the routes at /api/orders endpoint (alongside existing routes)

## Testing

### Model Testing

A test script has been created at [backend/testNewOrderModel.js](backend/testNewOrderModel.js) that:

1. Connects to MongoDB
2. Creates a test order with sample data
3. Saves and retrieves the order
4. Tests the indexes
5. Cleans up by deleting the test order

Run with: `npm run test-new-order-model`

### Route Testing

A test server has been created at [backend/testNewOrderRoutes.js](backend/testNewOrderRoutes.js) that:

1. Sets up a test Express server
2. Implements the new routes with mock authentication
3. Creates a test order
4. Provides endpoints to test the functionality

Run with: `npm run test-new-order-routes`

## Integration with Existing Code

The implementation has been designed to work alongside the existing order functionality without breaking any existing features:

1. The new model is compatible with the existing database structure
2. The new routes are added alongside existing routes
3. No existing functionality has been modified
4. Proper error handling and validation have been implemented

## Usage

### Getting User Orders

```bash
GET /api/orders/my
Authorization: Bearer <jwt_token>
```

### Getting Specific Order

```bash
GET /api/orders/:id
Authorization: Bearer <jwt_token>
```

## Security

1. **Authentication**: All routes require JWT authentication
2. **Authorization**: Users can only access their own orders
3. **Validation**: Proper validation of order IDs and user ownership
4. **Error Handling**: Comprehensive error handling with appropriate HTTP status codes
