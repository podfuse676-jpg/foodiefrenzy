import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import apiConfig from '../utils/apiConfig';
import {
  FaEnvelope,
  FaKey,
  FaArrowLeft,
  FaPhone,
  FaWhatsapp
} from 'react-icons/fa';

const url = apiConfig.baseURL;

const EmailOTPLoginModern = () => {
  const [step, setStep] = useState(1); // 1 for email input, 2 for OTP input
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${url}/api/email-otp/send-email-otp`, {
        email
      });

      if (response.data.emailSent) {
        setSuccess('OTP sent to your email! Please check your inbox.');
        setStep(2); // Move to OTP input step
        toast.success('OTP sent! Please check your email.');
      } else {
        setError(response.data.message || 'Failed to send OTP');
        toast.error(response.data.message || 'Failed to send OTP');
      }
    } catch (err) {
      console.error('Error sending OTP:', err);
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
      toast.error(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${url}/api/email-otp/verify-email-otp`, {
        email,
        otp
      });

      if (response.data.token) {
        // Save token and user info to localStorage
        localStorage.setItem('authToken', response.data.token);
        // Remove old token key if it exists
        localStorage.removeItem('token');
        
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('loginData', JSON.stringify({ 
          loggedIn: true,
          email: email,
          rememberMe: true
        }));
        
        // Clear the cart to ensure no items from previous session
        localStorage.removeItem('cart');
        
        setSuccess('Login successful! Redirecting...');
        toast.success('Login successful!');
        
        // Redirect to homepage or account page
        setTimeout(() => {
          navigate('/'); // or '/account' based on your preference
        }, 1500);
      } else {
        setError(response.data.message || 'Failed to verify OTP');
        toast.error(response.data.message || 'Failed to verify OTP');
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setError(err.response?.data?.message || 'Failed to verify OTP. Please try again.');
      toast.error(err.response?.data?.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setSuccess('');
    setOtp('');

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${url}/api/email-otp/send-email-otp`, {
        email
      });

      if (response.data.emailSent) {
        setSuccess('OTP resent to your email! Please check your inbox.');
        toast.success('OTP resent! Please check your email.');
      } else {
        setError(response.data.message || 'Failed to resend OTP');
        toast.error(response.data.message || 'Failed to resend OTP');
      }
    } catch (err) {
      console.error('Error resending OTP:', err);
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
      toast.error(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-[#8BC34A]/30 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#8BC34A] to-[#FFC107] bg-clip-text text-transparent mb-2">
            {step === 1 ? 'Login with Email' : 'Verify OTP'}
          </h2>
          <p className="text-gray-800/80">
            {step === 1 
              ? 'Enter your email to receive a one-time password' 
              : 'Enter the 6-digit code sent to your email'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-100/30 text-red-800 text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-3 rounded-lg bg-green-100/30 text-green-800 text-center">
            {success}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div>
              <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full bg-white border-2 border-[#8BC34A]/30 rounded-xl py-3 px-4 text-gray-800 placeholder-[#8BC34A]/50 focus:outline-none focus:border-[#8BC34A] transition-colors"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <FaEnvelope className="text-[#8BC34A]" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#8BC34A] to-[#7CB342] text-white font-bold py-3 px-4 rounded-xl hover:from-[#7CB342] hover:to-[#689F38] transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending OTP...
                </span>
              ) : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="otp">
                6-Digit OTP
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                required
                maxLength="6"
                className="w-full bg-white border-2 border-[#8BC34A]/30 rounded-xl py-3 px-4 text-gray-800 placeholder-[#8BC34A]/50 focus:outline-none focus:border-[#8BC34A] transition-colors text-center text-2xl tracking-widest"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-gradient-to-r from-[#8BC34A] to-[#7CB342] text-white font-bold py-3 px-4 rounded-xl hover:from-[#7CB342] hover:to-[#689F38] transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : 'Verify OTP'}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-[#8BC34A] font-bold py-3 px-4 rounded-xl border-2 border-[#8BC34A]/30 hover:bg-[#8BC34A]/10 transition-colors flex items-center justify-center"
            >
              <FaArrowLeft className="mr-2" />
              Back to Email
            </button>

            <button
              type="button"
              onClick={handleResendOTP}
              disabled={loading}
              className="w-full text-[#8BC34A] font-bold py-3 px-4 rounded-xl border-2 border-[#8BC34A]/30 hover:bg-[#8BC34A]/10 transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#8BC34A]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Resending...
                </span>
              ) : 'Resend OTP'}
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-[#8BC34A]/30 text-center">
          <p className="text-sm text-gray-800/70 mb-4">
            Or login with:
          </p>
          
          <div className="flex justify-center gap-4">
            <Link 
              to="/phone-login"
              className="flex items-center gap-2 bg-white border-2 border-[#8BC34A]/30 text-[#8BC34A] hover:bg-[#8BC34A]/10 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              <FaPhone className="text-[#8BC34A]" />
              <span>Phone</span>
            </Link>
            
            <Link 
              to="/whatsapp-login"
              className="flex items-center gap-2 bg-white border-2 border-[#8BC34A]/30 text-[#8BC34A] hover:bg-[#8BC34A]/10 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              <FaWhatsapp className="text-[#8BC34A]" />
              <span>WhatsApp</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailOTPLoginModern;