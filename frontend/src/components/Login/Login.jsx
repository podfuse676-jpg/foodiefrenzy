// frontend/src/components/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
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

const url = 'http://localhost:4000'

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
          className={`px-4 py-3 rounded-md shadow-lg flex items-center gap-2 text-sm ${toast.isError ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
            }`}
        >
          <FaCheckCircle className="flex-shrink-0" />
          <span>{toast.message}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div className="relative">
          <FaEnvelope className={iconClass} />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={`${inputBase} pl-10 pr-4 py-3`}
            required
          />
        </div>

        {/* Password Field */}
        <div className="relative">
          <FaLock className={iconClass} />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={`${inputBase} pl-10 pr-10 py-3`}
            required
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-400"
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
              className="form-checkbox h-5 w-5 text-amber-600 bg-[#2D1B0E] border-amber-400 rounded focus:ring-amber-600"
            />
            <span className="ml-2 text-amber-100">Remember me</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-[#2D1B0E] font-bold rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#2D1B0E]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
          className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-600 transition-colors"
        >
          <FaUserPlus /> Create New Account
        </Link>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-amber-900/30"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#3a2b2b] text-amber-100/70">Or continue with</span>
          </div>
        </div>
        <div>
          <button
            onClick={() => {
              onClose && onClose();
              navigate('/phone-login');
            }}
            className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-600 transition-colors"
          >
            <FaPhone /> Login with Phone Number
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;