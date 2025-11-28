// Add a minimal test endpoint to verify route registration
import express from 'express';

// Add a simple test endpoint at the end of the file
const app = express();

// Add a test endpoint to verify routes are working
app.get('/api/test-route', (req, res) => {
  res.json({ 
    message: 'Test route is working',
    timestamp: new Date().toISOString()
  });
});

console.log('Added test route endpoint');