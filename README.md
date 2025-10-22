# Foodie Frenzy

A full-stack food ordering application with customer frontend, admin panel, and backend API.

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

## Deployment

The application is designed for deployment on:

- **Frontend/Admin**: Netlify
- **Backend**: Render
- **Database**: MongoDB Atlas

### Environment Variables for Deployment

#### Frontend & Admin

```env
REACT_APP_API_URL=https://your-backend-url.onrender.com
REACT_APP_FRONTEND_URL=https://your-frontend-url.netlify.app
REACT_APP_ADMIN_URL=https://your-admin-url.netlify.app
```

## Scripts

- `start-all.sh` - Start all services (backend, frontend, admin)
- `stop-all.sh` - Stop all services
- Various deployment scripts in the `scripts/` directory

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
