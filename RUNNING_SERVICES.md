# Foodie Frenzy Running Services

All services are currently running properly.

## Running Services

1. **Backend Service**

   - URL: http://localhost:4000
   - Status: ✅ Running
   - Database: ✅ Connected to MongoDB
   - API: ✅ Accessible

2. **Frontend Service**

   - URL: http://localhost:5179
   - Status: ✅ Running
   - Framework: Vite + React

3. **Admin Panel**
   - URL: http://localhost:5180
   - Status: ✅ Running
   - Framework: Vite + React

## How to Access

- **Customer Website**: Open http://localhost:5179 in your browser
- **Admin Panel**: Open http://localhost:5180 in your browser
- **API Endpoints**: Access via http://localhost:4000/api/[endpoint]

## Stopping Services

To stop all services, you need to terminate the processes in each terminal window or use Ctrl+C in each terminal where the services are running.

You can also use the stop script:

```bash
./stop-all.sh
```

## Service Details

### Backend (Port 4000)

The backend provides RESTful APIs for:

- User authentication (email/password and phone/SMS)
- Item management (menu items, convenience store items)
- Cart functionality
- Order processing
- Database integration with MongoDB

### Frontend (Port 5179)

The customer-facing application allows users to:

- Browse menu items
- Add items to cart
- Place orders
- Track order status
- Authenticate via email or phone

### Admin Panel (Port 5180)

The administrative interface allows administrators to:

- Manage menu items (add, edit, delete)
- View and update order statuses
- Monitor system performance
- Manage user accounts

## API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login with email/password
- `POST /api/auth/send-code` - Send phone verification code
- `POST /api/auth/verify-code` - Verify phone code

### Items

- `GET /api/items` - Get all items
- `POST /api/items` - Create a new item (admin)
- `PUT /api/items/:id` - Update an item (admin)
- `DELETE /api/items/:id` - Delete an item (admin)

### Cart

- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove item from cart
- `POST /api/cart/clear` - Clear cart

### Orders

- `GET /api/orders/getall` - Get all orders (admin)
- `GET /api/orders/user` - Get user's orders
- `POST /api/orders` - Create a new order
- `PUT /api/orders/getall/:id` - Update order status (admin)

## Troubleshooting

### If a service fails to start:

1. Check if the required port is available
2. Verify MongoDB is running
3. Check environment variables in backend/.env
4. Ensure all dependencies are installed

### If you see connection errors:

1. Verify backend is running on port 4000
2. Check API URLs in frontend/src/utils/apiConfig.js
3. Verify CORS configuration in backend/server.js

### If authentication fails:

1. Check JWT_SECRET in backend/.env
2. Verify Twilio credentials for phone authentication
3. Ensure proper token storage and retrieval
