import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import apiConfig from '../../utils/apiConfig';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const url = apiConfig.baseURL;

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
      const res = await axios.post(`${url}/api/users/login`, {
        email: formData.email,
        password: formData.password,
      });

      if (res.data.success && res.data.token) {
        // Save token and role to localStorage
        localStorage.setItem('adminToken', res.data.token);
        localStorage.setItem('adminRole', res.data.role);
        
        // Check if user is admin
        if (res.data.role === 'admin') {
          // Redirect to admin dashboard
          navigate('/');
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
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D1B0E] via-[#4a372a] to-[#1a120b] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#3a2b2b]/80 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-amber-900/30 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-2">
            Admin Login
          </h2>
          <p className="text-amber-100/80">
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
            <label className="block text-amber-100 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="w-full bg-[#2D1B0E]/50 border-2 border-amber-900/30 rounded-xl py-3 px-4 text-amber-100 placeholder-amber-400/50 focus:outline-none focus:border-amber-600 transition-colors"
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
            <label className="block text-amber-100 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="w-full bg-[#2D1B0E]/50 border-2 border-amber-900/30 rounded-xl py-3 px-4 text-amber-100 placeholder-amber-400/50 focus:outline-none focus:border-amber-600 transition-colors"
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
            className="w-full bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-[#2D1B0E] font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#2D1B0E]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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