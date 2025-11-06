import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4002;

// Middleware to log request body
app.use((req, res, next) => {
  console.log('Request received:');
  console.log('- Method:', req.method);
  console.log('- URL:', req.url);
  console.log('- Headers:', req.headers);
  next();
});

// Parse JSON bodies
app.use(express.json());

// Log request body after parsing
app.use((req, res, next) => {
  console.log('- Parsed body:', req.body);
  next();
});

// Test endpoint
app.post('/test-body', (req, res) => {
  res.json({ message: 'Body received', body: req.body });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Test body server started on http://0.0.0.0:${PORT}`);
});