import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import apiConfig from '../../utils/apiConfig';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const url = apiConfig.baseURL;

  // Get the redirect path from location state or default to '/'
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login with URL:', url);
      console.log('Login data:', formData);
      
      const res = await axios.post(`${url}/api/users/login`, {
        email: formData.email,
        password: formData.password,
      });

      console.log('Login response:', res.data);

      if (res.data.success && res.data.token) {
        // Use the auth context login function
        login(res.data.token, res.data.role);
        
        // Check if user is admin
        if (res.data.role === 'admin') {
          console.log('Login successful, redirecting to:', from);
          // Redirect to the page they were trying to access or to admin dashboard
          navigate(from, { replace: true });
        } else {
          setError('Access denied. Admin rights required.');
          // Clear token if not admin
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminRole');
        }
      } else {
        setError(res.data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error response:', err.response);
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2c1a] via-[#2a422a] to-[#0f1c0f] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#2b3a2b]/80 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-green-900/30 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent mb-2">
            Admin Login
          </h2>
          <p className="text-green-100/80">
            Access the admin panel
          </p>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-900/30 border-2 border-red-700/50 rounded-xl text-red-300 text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-green-100 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="w-full bg-[#1a2c1a]/50 border-2 border-green-900/30 rounded-xl py-3 px-4 text-green-100 placeholder-green-400/50 focus:outline-none focus:border-green-600 transition-colors"
              id="email"
              type="email"
              name="email"
              placeholder="admin@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-green-100 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="w-full bg-[#1a2c1a]/50 border-2 border-green-900/30 rounded-xl py-3 px-4 text-green-100 placeholder-green-400/50 focus:outline-none focus:border-green-600 transition-colors"
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button
            className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-[#1a2c1a] font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#1a2c1a]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </span>
            ) : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;