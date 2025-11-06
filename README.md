# Lakeshore Convenience

A full-stack grocery delivery application with customer frontend, admin panel, and backend API.

## Project Structure

```
FOODIEFRENZY/
├── frontend/          # Customer-facing React application
├── admin/             # Admin panel React application
├── backend/           # Node.js Express API server
├── scripts/           # Deployment and utility scripts
├── start-all.sh       # Script to start all services
└── stop-all.sh        # Script to stop all services
```

## Tech Stack

### Frontend & Admin

- **React** with **Vite**
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API requests
- **React Icons** for icons

### Backend

- **Node.js** with **Express**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **Twilio** for SMS functionality

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/podfuse676-jpg/foodiefrenzy.git
cd foodiefrenzy
```

2. Install dependencies for each service:

```bash
# Install frontend dependencies
cd frontend
npm install
cd ..

# Install admin dependencies
cd admin
npm install
cd ..

# Install backend dependencies
cd backend
npm install
cd ..
```

### Environment Setup

#### Backend (.env file in backend directory)

```env
MONGO_URI=mongodb://localhost:27017/foodiefrenzy
PORT=4000
JWT_SECRET=your_jwt_secret_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

### Running the Application

#### Development Mode

You can start each service individually:

```bash
# Start backend
cd backend
npm start

# Start frontend (in a new terminal)
cd frontend
npm run dev

# Start admin panel (in a new terminal)
cd admin
npm run dev
```

Or use the provided script to start all services:

```bash
./start-all.sh
```

#### Production Mode

Build and serve each application:

```bash
# Build frontend
cd frontend
npm run build

# Build admin
cd admin
npm run build
```

## Services

| Service     | Port | URL                   |
| ----------- | ---- | --------------------- |
| Backend API | 4000 | http://localhost:4000 |
| Frontend    | 5173 | http://localhost:5173 |
| Admin Panel | 5174 | http://localhost:5174 |

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

## Authentication

The application supports two authentication methods:

1. **Email/Password** - Traditional registration and login
2. **Phone/SMS** - Phone number verification with SMS codes

## Menu Organization

The application organizes menu items in the following exact order:

1. Home
2. Products
3. Hot Beverages
4. Cold Beverages
5. Hot Food
6. Exotic Chips
7. Exotic Drinks
8. Grocery
9. Novelties
10. Car Accessories
11. Smokes & Vapes

Items are filtered and displayed based on their category tag. For proper loading, ensure grocery items are tagged with the exact "Grocery" category.

## Modifiers

Food items support modifier groups for customization (e.g., extras, spices, add-ons). Modifiers are displayed below items in the ordering UI and can be selected before adding items to the cart. Modifier groups are defined in the backend and linked to main items.

## Deployment

The application is designed for deployment on:

- **Frontend/Admin**: Vercel or Netlify
- **Backend**: Render
- **Database**: MongoDB Atlas

### Environment Variables for Deployment

#### Backend (.env)

```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key_(at_least_32_characters)
# STRIPE INTEGRATION - REPLACE WITH YOUR ACTUAL STRIPE SECRET KEY
# To get your Stripe secret key:
# 1. Go to https://dashboard.stripe.com/apikeys
# 2. Copy your "Secret key" (starts with sk_test_ for test mode or sk_live_ for live mode)
# 3. Paste it below replacing the placeholder value
STRIPE_SECRET_KEY=your_stripe_secret_key
FRONTEND_URL=https://your-frontend-url.vercel.app
ADMIN_URL=https://your-admin-url.vercel.app
TWILIO_ACCOUNT_SID= (leave empty if not using SMS)
TWILIO_AUTH_TOKEN= (leave empty if not using SMS)
TWILIO_PHONE_NUMBER= (leave empty if not using SMS)
```

#### Frontend & Admin (.env)

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

### Deployment Instructions

For detailed deployment instructions, see:

- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Admin Panel Deployment Guide](ADMIN_DEPLOYMENT_GUIDE.md)
- [Vercel Login Fix Summary](VERCEL_LOGIN_FIX_SUMMARY.md)
- [Troubleshooting Login Issues](TROUBLESHOOTING_LOGIN_ISSUES.md)

## Scripts

- `start-all.sh` - Start all services (backend, frontend, admin)
- `stop-all.sh` - Stop all services
- `scripts/deploy.sh` - Deployment helper script for all services
- `scripts/deploy-admin.sh` - Deployment helper script for admin panel only
- Various deployment scripts in the `scripts/` directory

### Windows Deployment Scripts

For Windows users, additional deployment scripts are available:

- `deploy-all.bat` - Complete deployment (push to GitHub + Vercel deployment)
- `push-to-github.bat` - Push changes to GitHub
- `deploy-to-vercel.bat` - Deploy to Vercel
- `start-all.bat` - Start all services
- `start-frontend-admin.bat` - Start frontend and admin panel
- `stop-all.bat` - Stop all services
- `run-all.ps1` - PowerShell script to run all services (frontend, admin, backend)
- `run-all.bat` - Batch script to run all services (frontend, admin, backend)

For detailed deployment instructions, see `DEPLOYMENT_INSTRUCTIONS.md`.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on the GitHub repository.
// Trigger redeployment
// Force redeploy Fri Oct 24 00:38:58 IST 2025
