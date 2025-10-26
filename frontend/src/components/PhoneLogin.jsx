import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import apiConfig from '../utils/apiConfig';

const PhoneLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [displayedCode, setDisplayedCode] = useState(''); // Store OTP for display
  const [verificationStatus, setVerificationStatus] = useState(''); // For visual feedback
  const navigate = useNavigate();
  const url = apiConfig.baseURL;

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    try {
      setLoading(true);
      setVerificationStatus('sending');
      // Format phone number properly
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+1${phoneNumber}`;
      
      const response = await axios.post(`${url}/api/auth/send-code`, {
        phoneNumber: formattedPhone
      });
      
      // Store the OTP code for display (helps when SMS isn't delivered)
      if (response.data.verificationCode) {
        setDisplayedCode(response.data.verificationCode);
        toast.success(`Code sent! For testing: ${response.data.verificationCode}`, {
          duration: 10000,
          style: {
            background: '#8BC34A',
            color: '#fff',
            fontWeight: 'bold'
          }
        });
      } else {
        toast.success('Verification code sent to your phone');
      }
      
      setCodeSent(true);
      setVerificationStatus('sent');
      setLoading(false);
    } catch (error) {
      console.error('Error sending verification code:', error);
      toast.error(error.response?.data?.message || 'Failed to send verification code');
      setVerificationStatus('error');
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit verification code');
      return;
    }

    try {
      setLoading(true);
      setVerificationStatus('verifying');
      // Format phone number properly
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+1${phoneNumber}`;
      
      const response = await axios.post(`${url}/api/auth/verify-code`, {
        phoneNumber: formattedPhone,
        verificationCode
      });
      
      // Save token and login data to localStorage - use consistent key
      localStorage.setItem('authToken', response.data.token);
      // Remove old token key if it exists
      localStorage.removeItem('token');
      
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('loginData', JSON.stringify({ 
        loggedIn: true,
        email: response.data.user.email || '',
        phoneNumber: response.data.user.phoneNumber || '',
        rememberMe: true
      }));
      
      // Clear the cart to ensure no items from previous session
      localStorage.removeItem('cart');
      
      toast.success('Login successful!');
      setVerificationStatus('success');
      setLoading(false);
      // Redirect to home page
      navigate('/');
      // Reload the page to update the navbar authentication status
      window.location.reload();
    } catch (error) {
      console.error('Error verifying code:', error);
      toast.error(error.response?.data?.message || 'Invalid verification code');
      setVerificationStatus('error');
      setLoading(false);
    }
  };

  return (
    // Updated to light fresh colors
    <div className="min-h-screen bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-[#8BC34A]/30 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#8BC34A] to-[#FFC107] bg-clip-text text-transparent mb-2">
            Phone Login
          </h2>
          <p className="text-gray-800/80">
            Enter your phone number to receive a verification code
          </p>
        </div>
        
        {!codeSent ? (
          <form onSubmit={handleSendCode} className="space-y-6">
            <div>
              <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="phoneNumber">
                Phone Number
              </label>
              <div className="relative">
                <input
                  className="w-full bg-white border-2 border-[#8BC34A]/30 rounded-xl py-3 px-4 text-gray-800 placeholder-[#8BC34A]/50 focus:outline-none focus:border-[#8BC34A] transition-colors"
                  id="phoneNumber"
                  type="tel"
                  placeholder="+1 (123) 456-7890"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <p className="text-xs text-[#8BC34A]/70 mt-2">
                Format: +1XXXXXXXXXX or XXXXXXXXXX (US)
              </p>
            </div>
            
            <button
              className="w-full bg-gradient-to-r from-[#8BC34A] to-[#7CB342] hover:from-[#7CB342] hover:to-[#8BC34A] text-white font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : 'Send Verification Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            {displayedCode && (
              <div className="mb-6 p-4 bg-gradient-to-r from-green-100/30 to-green-200/30 border-2 border-green-300/50 rounded-xl">
                <p className="text-sm text-green-800 font-semibold mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Your Verification Code:
                </p>
                <p className="text-4xl font-bold text-green-700 text-center tracking-widest py-2">
                  {displayedCode}
                </p>
                <p className="text-xs text-green-700/80 mt-2 text-center">
                  (SMS may not be delivered on trial accounts - use this code)
                </p>
              </div>
            )}
            
            <div>
              <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="verificationCode">
                Verification Code
              </label>
              <input
                className="w-full bg-white border-2 border-[#8BC34A]/30 rounded-xl py-3 px-4 text-gray-800 placeholder-[#8BC34A]/50 focus:outline-none focus:border-[#8BC34A] transition-colors text-center text-2xl tracking-widest"
                id="verificationCode"
                type="text"
                placeholder="123456"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                required
              />
            </div>
            
            {/* Visual feedback for verification status */}
            {verificationStatus && (
              <div className={`p-3 rounded-lg text-center ${
                verificationStatus === 'verifying' ? 'bg-blue-100/30 text-blue-800' :
                verificationStatus === 'success' ? 'bg-green-100/30 text-green-800' :
                verificationStatus === 'error' ? 'bg-red-100/30 text-red-800' :
                'bg-gray-100/30 text-gray-800'
              }`}>
                {verificationStatus === 'verifying' && (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Verifying code...</span>
                  </div>
                )}
                {verificationStatus === 'success' && (
                  <div className="flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Login successful! Redirecting...</span>
                  </div>
                )}
                {verificationStatus === 'error' && (
                  <div className="flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>Verification failed. Please try again.</span>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                className="flex-1 px-4 py-2 bg-[#8BC34A]/50 hover:bg-[#7CB342]/50 text-white rounded-xl border-2 border-[#8BC34A]/30 transition-colors"
                onClick={() => {
                  setCodeSent(false);
                  setVerificationStatus('');
                }}
              >
                Change Phone Number
              </button>
              
              <button
                type="button"
                className="flex-1 px-4 py-2 bg-[#8BC34A]/50 hover:bg-[#7CB342]/50 text-white rounded-xl border-2 border-[#8BC34A]/30 transition-colors"
                onClick={handleSendCode}
                disabled={loading}
              >
                Resend Code
              </button>
            </div>
            
            <button
              className="w-full bg-gradient-to-r from-[#8BC34A] to-[#7CB342] hover:from-[#7CB342] hover:to-[#8BC34A] text-white font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading || verificationCode.length !== 6}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : 'Verify & Login'}
            </button>
          </form>
        )}
        
        <div className="mt-8 pt-6 border-t border-[#8BC34A]/30 text-center">
          <p className="text-sm text-gray-800/70">
            Want to login with email instead?{' '}
            <button 
              onClick={() => navigate('/login')}
              className="text-[#8BC34A] hover:text-[#FFC107] font-semibold transition-colors"
            >
              Login with Email
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhoneLogin;