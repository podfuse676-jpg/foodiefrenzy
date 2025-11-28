import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaEnvelope, FaKey, FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import apiConfig from '../../utils/apiConfig';

const EmailLogin = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  const url = apiConfig.baseURL;

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.post(`${url}/api/email-auth/send-email-otp`, { email });
      
      if (response.data.emailSent) {
        setSuccess('OTP sent successfully! Please check your email.');
        setStep(2); // Move to OTP entry step
        toast.success('OTP sent to your email!');
      } else {
        setError(response.data.message || 'Failed to send OTP');
      }
    } catch (err) {
      console.error('Error sending OTP:', err);
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
      toast.error('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    // Validate OTP
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.post(`${url}/api/email-auth/verify-email-otp`, { email, otp });
      
      if (response.data.token) {
        // Save token and user data
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('loginData', JSON.stringify({ 
          loggedIn: true,
          email: response.data.user.email,
          rememberMe: true
        }));
        
        // Clear cart
        localStorage.removeItem('cart');
        
        setSuccess('Login successful! Redirecting...');
        toast.success('Login successful!');
        
        // Redirect to home page after a short delay
        setTimeout(() => {
          navigate('/');
          window.location.reload();
        }, 1500);
      } else {
        setError(response.data.message || 'Failed to verify OTP');
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
      toast.error('Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await axios.post(`${url}/api/email-auth/send-email-otp`, { email });
      
      if (response.data.emailSent) {
        setSuccess('New OTP sent successfully! Please check your email.');
        toast.success('New OTP sent to your email!');
      } else {
        setError(response.data.message || 'Failed to resend OTP');
      }
    } catch (err) {
      console.error('Error resending OTP:', err);
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
      toast.error('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-[#8BC34A]/30 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#8BC34A] to-[#FFC107] bg-clip-text text-transparent mb-2">
            {step === 1 ? 'Email Login' : 'Verify OTP'}
          </h2>
          <p className="text-gray-800/80">
            {step === 1 
              ? 'Enter your email to receive a verification code' 
              : 'Enter the 6-digit code sent to your email'}
          </p>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center">
            <FaExclamationTriangle className="mr-2" />
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center">
            <FaCheckCircle className="mr-2" />
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
                  className="w-full bg-white border-2 border-[#8BC34A]/30 rounded-xl py-3 px-4 text-gray-800 placeholder-[#8BC34A]/50 focus:outline-none focus:border-[#8BC34A] transition-colors"
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
              ) : 'Send Verification Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="text-center mb-4">
              <p className="text-gray-700">
                Code sent to: <span className="font-semibold">{email}</span>
              </p>
            </div>
            
            <div>
              <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="otp">
                Verification Code
              </label>
              <input
                className="w-full bg-white border-2 border-[#8BC34A]/30 rounded-xl py-3 px-4 text-gray-800 placeholder-[#8BC34A]/50 focus:outline-none focus:border-[#8BC34A] transition-colors text-center text-2xl tracking-widest"
                id="otp"
                type="text"
                placeholder="123456"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                required
              />
              <p className="mt-2 text-sm text-gray-500 text-center">
                Enter the 6-digit code sent to your email
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="flex-1 bg-gradient-to-r from-[#8BC34A] to-[#7CB342] text-white font-bold py-3 px-4 rounded-xl hover:from-[#7CB342] hover:to-[#689F38] transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span>
                ) : 'Verify Code'}
              </button>
              
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 text-[#8BC34A] font-bold py-3 px-4 rounded-xl border-2 border-[#8BC34A]/30 hover:bg-[#8BC34A]/10 transition-colors flex items-center justify-center"
              >
                <FaArrowLeft className="mr-2" />
                Change Email
              </button>
            </div>
          </form>
        )}
        
        {step === 2 && (
          <div className="mt-6 text-center">
            <button
              onClick={handleResendOTP}
              disabled={loading}
              className="text-[#8BC34A] hover:text-[#FFC107] font-semibold transition-colors text-sm disabled:opacity-50"
            >
              Didn't receive the code? Resend OTP
            </button>
          </div>
        )}
        
        <div className="mt-8 pt-6 border-t border-[#8BC34A]/30 text-center">
          <p className="text-sm text-gray-800/70">
            Want to login with phone instead?{' '}
            <Link 
              to="/phone-login"
              className="text-[#8BC34A] hover:text-[#FFC107] font-semibold transition-colors"
            >
              Login with Phone
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailLogin;