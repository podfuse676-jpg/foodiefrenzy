// frontend/src/components/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiConfig from '../../utils/apiConfig';
import {
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaUserPlus,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaPhone,
  FaExclamationTriangle
} from 'react-icons/fa';
import { inputBase, iconClass } from '../../assets/dummydata';

const url = apiConfig.baseURL;

const Login = ({ onLoginSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', isError: false });
  const [loading, setLoading] = useState(false);
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
  
        setToast({ visible: true, message: 'Login successful!', isError: false });
        setTimeout(() => {
          setToast({ visible: false, message: '', isError: false });
          onLoginSuccess && onLoginSuccess(res.data.token);
        }, 1500);
  
      } else {
        console.warn('⚠️ Unexpected response:', res.data);
        throw new Error(res.data.message || 'Login failed.');
      }
  
    } catch (err) {
      console.error('❌ axios error object:', err);
      if (err.response) {
        console.error('❌ server responded with:', err.response.status, err.response.data);
      }
      
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
      
      setToast({ visible: true, message: msg, isError: true });
      setTimeout(() => setToast({ visible: false, message: '', isError: false }), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] p-4">
      {/* Toast Notification */}
      <div
        className={`fixed top-4 right-4 z-50 transition-all duration-300 ${toast.visible ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'
          }`}
      >
        <div
          className={`px-4 py-3 rounded-md shadow-lg flex items-center gap-2 text-sm ${toast.isError ? 'bg-red-500 text-white' : 'bg-[#8BC34A] text-white'
            }`}
        >
          {toast.isError ? <FaExclamationTriangle className="flex-shrink-0" /> : <FaCheckCircle className="flex-shrink-0" />}
          <span>{toast.message}</span>
        </div>
      </div>

      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border-4 border-[#8BC34A]/30">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-[#8BC34A] to-[#FFC107] bg-clip-text text-transparent mb-6">
          Sign In
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute top-1/2 transform -translate-y-1/2 left-3 text-[#8BC34A]" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border-2 border-[#8BC34A]/30 text-gray-800 placeholder-[#8BC34A] focus:outline-none focus:border-[#8BC34A] focus:ring-2 focus:ring-[#8BC34A]/20 transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute top-1/2 transform -translate-y-1/2 left-3 text-[#8BC34A]" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3 rounded-lg bg-white border-2 border-[#8BC34A]/30 text-gray-800 placeholder-[#8BC34A] focus:outline-none focus:border-[#8BC34A] focus:ring-2 focus:ring-[#8BC34A]/20 transition-all duration-200"
                required
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute inset-y-0 right-4 flex items-center text-[#8BC34A] hover:text-[#FFC107] transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 text-[#8BC34A] bg-white border-[#8BC34A] rounded focus:ring-[#8BC34A]"
              />
              <span className="ml-2 text-gray-800">Remember me</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#8BC34A] to-[#7CB342] text-white font-bold rounded-lg hover:from-[#7CB342] hover:to-[#8BC34A] transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </span>
            ) : (
              <>
                Sign In <FaArrowRight className="ml-2" />
              </>
            )}
          </button>
        </form>

        {/* Sign Up Link and Phone Login */}
        <div className="mt-6 space-y-4">
          <div className="text-center">
            <Link
              to="/signup"
              onClick={onClose}
              className="inline-flex items-center text-[#8BC34A] hover:text-[#FFC107] transition-all duration-300 font-semibold"
            >
              <FaUserPlus className="mr-2" />
              <span>Create New Account</span>
            </Link>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-800/70">Or continue with</span>
            </div>
          </div>
          
          <div className="text-center">
            <button
              onClick={() => {
                onClose && onClose();
                navigate('/phone-login');
              }}
              className="inline-flex items-center text-[#8BC34A] hover:text-[#FFC107] transition-all duration-300 font-semibold"
            >
              <FaPhone className="mr-2" /> Login with Phone Number
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;