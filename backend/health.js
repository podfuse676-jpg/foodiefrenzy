// health.js
// Simple health check module that can be imported early

export const healthCheck = (req, res) => {
  res.status(200).json({ status: 'OK' });
};

export default healthCheck;