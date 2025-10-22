import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const PhoneLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [displayedCode, setDisplayedCode] = useState(''); // Store OTP for display
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    try {
      setLoading(true);
      // Format phone number properly
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+1${phoneNumber}`;
      
      const response = await axios.post('http://localhost:4000/api/auth/send-code', {
        phoneNumber: formattedPhone
      });
      
      // Store the OTP code for display (helps when SMS isn't delivered)
      if (response.data.verificationCode) {
        setDisplayedCode(response.data.verificationCode);
        toast.success(`Code sent! For testing: ${response.data.verificationCode}`, {
          duration: 10000,
          style: {
            background: '#10b981',
            color: '#fff',
            fontWeight: 'bold'
          }
        });
      } else {
        toast.success('Verification code sent to your phone');
      }
      
      setCodeSent(true);
      setLoading(false);
    } catch (error) {
      console.error('Error sending verification code:', error);
      toast.error(error.response?.data?.message || 'Failed to send verification code');
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
      // Format phone number properly
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+1${phoneNumber}`;
      
      const response = await axios.post('http://localhost:4000/api/auth/verify-code', {
        phoneNumber: formattedPhone,
        verificationCode
      });
      
      // Save token and login data to localStorage
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('token', response.data.token); // Keep for backward compatibility
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('loginData', JSON.stringify({ 
        loggedIn: true,
        email: response.data.user.email || '',
        phoneNumber: response.data.user.phoneNumber || '',
        rememberMe: true
      }));
      
      toast.success('Login successful!');
      setLoading(false);
      // Redirect to home page
      navigate('/');
      // Reload the page to update the navbar authentication status
      window.location.reload();
    } catch (error) {
      console.error('Error verifying code:', error);
      toast.error(error.response?.data?.message || 'Invalid verification code');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D1B0E] via-[#4a372a] to-[#1a120b] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#3a2b2b]/80 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-amber-900/30 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-2">
            Phone Login
          </h2>
          <p className="text-amber-100/80">
            Enter your phone number to receive a verification code
          </p>
        </div>
        
        {!codeSent ? (
          <form onSubmit={handleSendCode} className="space-y-6">
            <div>
              <label className="block text-amber-100 text-sm font-bold mb-2" htmlFor="phoneNumber">
                Phone Number
              </label>
              <div className="relative">
                <input
                  className="w-full bg-[#2D1B0E]/50 border-2 border-amber-900/30 rounded-xl py-3 px-4 text-amber-100 placeholder-amber-400/50 focus:outline-none focus:border-amber-600 transition-colors"
                  id="phoneNumber"
                  type="tel"
                  placeholder="+1 (123) 456-7890"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <p className="text-xs text-amber-400/70 mt-2">
                Format: +1XXXXXXXXXX or XXXXXXXXXX (US)
              </p>
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
                  Sending...
                </span>
              ) : 'Send Verification Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            {displayedCode && (
              <div className="mb-6 p-4 bg-gradient-to-r from-green-900/30 to-green-800/30 border-2 border-green-700/50 rounded-xl">
                <p className="text-sm text-green-300 font-semibold mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Your Verification Code:
                </p>
                <p className="text-4xl font-bold text-green-400 text-center tracking-widest py-2">
                  {displayedCode}
                </p>
                <p className="text-xs text-green-400/80 mt-2 text-center">
                  (SMS may not be delivered on trial accounts - use this code)
                </p>
              </div>
            )}
            
            <div>
              <label className="block text-amber-100 text-sm font-bold mb-2" htmlFor="verificationCode">
                Verification Code
              </label>
              <input
                className="w-full bg-[#2D1B0E]/50 border-2 border-amber-900/30 rounded-xl py-3 px-4 text-amber-100 placeholder-amber-400/50 focus:outline-none focus:border-amber-600 transition-colors text-center text-2xl tracking-widest"
                id="verificationCode"
                type="text"
                placeholder="123456"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                required
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                className="flex-1 px-4 py-2 bg-amber-900/50 hover:bg-amber-800/50 text-amber-100 rounded-xl border-2 border-amber-700/30 transition-colors"
                onClick={() => setCodeSent(false)}
              >
                Change Phone Number
              </button>
              
              <button
                type="button"
                className="flex-1 px-4 py-2 bg-amber-900/50 hover:bg-amber-800/50 text-amber-100 rounded-xl border-2 border-amber-700/30 transition-colors"
                onClick={handleSendCode}
                disabled={loading}
              >
                Resend Code
              </button>
            </div>
            
            <button
              className="w-full bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-[#2D1B0E] font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading || verificationCode.length !== 6}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#2D1B0E]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : 'Verify & Login'}
            </button>
          </form>
        )}
        
        <div className="mt-8 pt-6 border-t border-amber-900/30 text-center">
          <p className="text-sm text-amber-100/70">
            Want to login with email instead?{' '}
            <button 
              onClick={() => navigate('/login')}
              className="text-amber-400 hover:text-amber-300 font-semibold transition-colors"
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