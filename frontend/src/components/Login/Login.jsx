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
  FaPhone
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
      const msg = err.response?.data?.message || err.message || 'Login failed.';
      setToast({ visible: true, message: msg, isError: true });
      setTimeout(() => setToast({ visible: false, message: '', isError: false }), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      <div
        className={`fixed top-4 right-4 z-50 transition-all duration-300 ${toast.visible ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'
          }`}
      >
        <div
          className={`px-4 py-3 rounded-md shadow-lg flex items-center gap-2 text-sm ${toast.isError ? 'bg-[#E74C3C] text-white' : 'bg-[#4CAF50] text-white'
            }`}
        >
          <FaCheckCircle className="flex-shrink-0" />
          <span>{toast.message}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div className="relative">
          <FaEnvelope className="absolute top-1/2 transform -translate-y-1/2 left-3 text-[#4CAF50]" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-lg bg-[#333333] text-[#FAFAFA] placeholder-[#4CAF50] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] pl-10 pr-4 py-3"
            required
          />
        </div>

        {/* Password Field */}
        <div className="relative">
          <FaLock className="absolute top-1/2 transform -translate-y-1/2 left-3 text-[#4CAF50]" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-lg bg-[#333333] text-[#FAFAFA] placeholder-[#4CAF50] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] pl-10 pr-10 py-3"
            required
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4CAF50]"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Remember Me */}
        <div className="flex items-center">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="form-checkbox h-5 w-5 text-[#4CAF50] bg-[#333333] border-[#4CAF50] rounded focus:ring-[#4CAF50]"
            />
            <span className="ml-2 text-[#FAFAFA]">Remember me</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-[#4CAF50] to-[#388E3C] text-[#FAFAFA] font-bold rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#FAFAFA]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing In...
            </span>
          ) : (
            <>
              Sign In <FaArrowRight />
            </>
          )}
        </button>
      </form>

      {/* Sign Up Link */}
      <div className="text-center space-y-4">
        <Link
          to="/signup"
          onClick={onClose}
          className="inline-flex items-center gap-2 text-[#4CAF50] hover:text-[#F4D03F] transition-colors"
        >
          <FaUserPlus /> Create New Account
        </Link>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#333333]/30"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#333333] text-[#FAFAFA]/70">Or continue with</span>
          </div>
        </div>
        <div>
          <button
            onClick={() => {
              onClose && onClose();
              navigate('/phone-login');
            }}
            className="inline-flex items-center gap-2 text-[#4CAF50] hover:text-[#F4D03F] transition-colors"
          >
            <FaPhone /> Login with Phone Number
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;