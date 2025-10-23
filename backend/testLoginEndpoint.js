import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

dotenv.config();

// Add connection event listeners for debugging
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB (testLoginEndpoint.js)');
});

mongoose.connection.on('error', (err) => {
  console.log('Mongoose connection error (testLoginEndpoint.js):', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected (testLoginEndpoint.js)');
});

// Connect to MongoDB
console.log('Connecting to database...');
connectDB();

// Define user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, unique: true, sparse: true },
  isPhoneVerified: { type: Boolean, default: false },
  phoneVerificationCode: { type: String },
  phoneVerificationExpires: { type: Date },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

// Create or get user model
const User = mongoose.models.user || mongoose.model('user', userSchema);

const app = express();
const PORT = process.env.PORT || 4001;

app.use(express.json());

// Test login endpoint
app.post('/test-login', async (req, res) => {
  console.log('Test login request received');
  console.log('Request body:', req.body);
  
  const { email, password } = req.body;
  try {
    console.log('Login attempt for email:', email);
    
    // CHECK IF USER IS AVAILABLE WITH THIS ID
    const user = await User.findOne({ email });
    console.log('User lookup result:', user ? 'Found' : 'Not found');
    
    if (!user) {
      console.log('User not found in database for email:', email);
      return res.json({ success: false, message: "User Doesn't Exist" })
    }

    console.log('User found:', user.username, user.email, user.role);
    
    res.json({ success: true, message: "User found", user: { username: user.username, email: user.email, role: user.role } })
  }
  catch (error) {
    console.log('Login error:', error);
    res.json({ success: false, message: "Error" })
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server started on http://0.0.0.0:${PORT}`);
});