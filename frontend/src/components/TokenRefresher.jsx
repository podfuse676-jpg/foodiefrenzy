import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// This component handles token validation and redirects if invalid
const TokenRefresher = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any invalid tokens and redirect to login
    const clearInvalidTokens = () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
      localStorage.removeItem('loginData');
      navigate('/login');
    };

    clearInvalidTokens();
  }, [navigate]);

  return null; // This component doesn't render anything
};

export default TokenRefresher;