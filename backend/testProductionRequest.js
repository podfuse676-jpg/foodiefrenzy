import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4003;

// Middleware to log request
app.use((req, res, next) => {
  console.log('=== REQUEST RECEIVED ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', req.headers);
  next();
});

// Parse JSON bodies
app.use(express.json());

// Log parsed body
app.use((req, res, next) => {
  console.log('Parsed body:', req.body);
  next();
});

// Test endpoint that mimics the login endpoint
app.post('/api/users/login', async (req, res) => {
  console.log('=== LOGIN ENDPOINT CALLED ===');
  console.log('Request body:', req.body);
  
  const { email, password } = req.body;
  console.log('Email:', email);
  console.log('Password:', password);
  
  // Connect to MongoDB
  console.log('Connecting to database...');
  await mongoose.connect(process.env.MONGODB_URI, {
    // useNewUrlParser and useUnifiedTopology are defaults in Mongoose 6+
  });
  console.log('Database connected successfully');
  
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
  
  // Try to find the user
  console.log('Searching for user with email:', email);
  const user = await User.findOne({ email });
  console.log('User lookup result:', user ? 'Found' : 'Not found');
  
  if (!user) {
    console.log('User not found');
    await mongoose.connection.close();
    return res.json({ success: false, message: "User Doesn't Exist" });
  }
  
  console.log('User found:', user.username, user.email, user.role);
  await mongoose.connection.close();
  
  res.json({ success: true, message: "User found", user: { username: user.username, email: user.email, role: user.role } });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Test production request server started on http://0.0.0.0:${PORT}`);
});