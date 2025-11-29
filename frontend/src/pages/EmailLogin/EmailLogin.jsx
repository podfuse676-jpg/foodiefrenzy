// frontend/src/components/EmailLogin.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiConfig from '../utils/apiConfig';
import {
  FaEnvelope,
  FaLock,
  FaUserPlus,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaPhone,
  FaExclamationTriangle
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const url = apiConfig.baseURL;

const EmailLogin = ({ onLoginSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState(''); // For visual feedback
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('loginData');
    if (stored) {
      const parsed = JSON.parse(stored);
      setFormData({
        email: parsed.email || '',
        password: '',
        rememberMe: parsed.rememberMe || false,
      });
    }
  }, []);

  const toggleShowPassword = () => setShowPassword(prev => !prev);

  const handleChange = ({ target: { name, value, type, checked } }) =>
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setLoginStatus('logging-in');
    
    try {
      const res = await axios.post(`${url}/api/users/login`, {
        email: formData.email,
        password: formData.password,
      });
      console.log('✅ axios response:', res);
  
      if (res.data.success && res.data.token) {
        // Save your JWT - use only one consistent key
        localStorage.setItem('authToken', res.data.token);
        
        // Remove old token key if it exists
        localStorage.removeItem('token');
        
        // Save login state for app-wide authentication
        localStorage.setItem('loginData', JSON.stringify({ 
          loggedIn: true,
          email: formData.email,
          rememberMe: formData.rememberMe 
        }));
        
        // Clear the cart to ensure no items from previous session
        localStorage.removeItem('cart');
  
        setLoginStatus('success');
        toast.success('Login successful!');
        
        setTimeout(() => {
          onLoginSuccess && onLoginSuccess(res.data.token);
        }, 1000);
  
      } else {
        console.warn('⚠️ Unexpected response:', res.data);
        throw new Error(res.data.message || 'Login failed.');
      }
  
    } catch (err) {
      console.error('❌ axios error object:', err);
      if (err.response) {
        console.error('❌ server responded with:', err.response.status, err.response.data);
      }
      
      setLoginStatus('error');
      let msg = 'Login failed. Please check your credentials and try again.';
      
      // Provide more specific error messages based on the error type
      if (err.response?.status === 401) {
        msg = 'Invalid email or password. Please try again.';
      } else if (err.response?.status === 404) {
        msg = 'User not found. Please check your email address or create a new account.';
      } else if (err.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err.code === 'ECONNABORTED') {
        msg = 'Request timeout. Please check your internet connection and try again.';
      } else if (err.message) {
        msg = err.message;
      }
      
      toast.error(msg);
    } finally {
      setLoading(false);
      setTimeout(() => setLoginStatus(''), 3000);
    }
  };

  return (
    // Updated to have a distinct email login styling
    <div className="min-h-screen bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-[#8BC34A]/30 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#8BC34A] to-[#FFC107] bg-clip-text text-transparent mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-800/80">
            Sign in to your account with email
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white border-2 border-[#8BC34A]/30 rounded-xl py-3 px-4 text-gray-800 placeholder-[#8BC34A]/50 focus:outline-none focus:border-[#8BC34A] transition-colors"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <FaEnvelope className="text-[#8BC34A]" />
              </div>
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-white border-2 border-[#8BC34A]/30 rounded-xl py-3 px-4 text-gray-800 placeholder-[#8BC34A]/50 focus:outline-none focus:border-[#8BC34A] transition-colors"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="text-[#8BC34A] hover:text-[#FFC107] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 text-[#8BC34A] bg-white border-[#8BC34A] rounded focus:ring-[#8BC34A] cursor-pointer"
              />
              <span className="ml-2 text-gray-800">Remember me</span>
            </label>
          </div>
          
          {/* Visual feedback for login status */}
          {loginStatus && (
            <div className={`p-3 rounded-lg text-center ${
              loginStatus === 'logging-in' ? 'bg-blue-100/30 text-blue-800' :
              loginStatus === 'success' ? 'bg-green-100/30 text-green-800' :
              loginStatus === 'error' ? 'bg-red-100/30 text-red-800' :
              'bg-gray-100/30 text-gray-800'
            }`}>
              {loginStatus === 'logging-in' && (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing in...</span>
                </div>
              )}
              {loginStatus === 'success' && (
                <div className="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Login successful! Redirecting...</span>
                </div>
              )}
              {loginStatus === 'error' && (
                <div className="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>Login failed. Please try again.</span>
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#8BC34A] to-[#7CB342] hover:from-[#7CB342] hover:to-[#8BC34A] text-white font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        {/* Sign Up Link and Phone Login */}
        <div className="mt-8 pt-6 border-t border-[#8BC34A]/30 text-center">
          <p className="text-sm text-gray-800/70 mb-4">
            Don't have an account?{' '}
            <Link 
              to="/signup"
              className="text-[#8BC34A] hover:text-[#FFC107] font-semibold transition-colors"
            >
              Create Account
            </Link>
          </p>
          
          <p className="text-sm text-gray-800/70">
            Want to login with phone instead?{' '}
            <Link 
              to="/phone-login"
              className="text-[#8BC34A] hover:text-[#FFC107] font-semibold transition-colors"
            >
              Login with Phone
            </Link>
          </p>
          
          <p className="text-sm text-gray-800/70 mt-2">
            Want to login with WhatsApp instead?{' '}
            <Link 
              to="/login"
              className="text-[#8BC34A] hover:text-[#FFC107] font-semibold transition-colors"
            >
              Login with WhatsApp
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailLogin;