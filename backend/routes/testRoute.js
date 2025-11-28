import express from 'express';
const testRouter = express.Router();

testRouter.get('/', (req, res) => {
  res.json({ 
    message: 'Test route is working',
    timestamp: new Date().toISOString()
  });
});

testRouter.get('/items', (req, res) => {
  res.json({ 
    message: 'Test items route is working',
    items: [],
    timestamp: new Date().toISOString()
  });
});

export default testRouter;