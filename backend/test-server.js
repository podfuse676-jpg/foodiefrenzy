// Simple test server to verify deployment
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000;

// Simple CORS configuration
app.use(cors());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running correctly',
    timestamp: new Date().toISOString()
  });
});

// Test CORS endpoint
app.get('/api/test-cors', (req, res) => {
  res.json({ 
    message: 'CORS is working correctly', 
    origin: req.get('Origin'),
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server running on port ${PORT}`);
});