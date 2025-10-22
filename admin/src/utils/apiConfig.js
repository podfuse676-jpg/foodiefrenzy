// API Configuration
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:4000',
    frontendURL: 'http://localhost:5173',
    adminURL: 'http://localhost:5174'
  },
  production: {
    baseURL: process.env.REACT_APP_API_URL || 'https://your-render-app-name.onrender.com',
    frontendURL: process.env.REACT_APP_FRONTEND_URL || 'https://your-frontend.netlify.app',
    adminURL: process.env.REACT_APP_ADMIN_URL || 'https://your-admin.netlify.app'
  }
};

const getApiConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  return isDevelopment ? API_CONFIG.development : API_CONFIG.production;
};

export default getApiConfig();