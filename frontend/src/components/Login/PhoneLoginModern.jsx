import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import apiConfig from '../../utils/apiConfig';
import {
  FaPhone,
  FaKey,
  FaArrowLeft,
  FaEnvelope,
  FaWhatsapp
} from 'react-icons/fa';

const url = apiConfig.baseURL;

const PhoneLoginModern = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [displayedCode, setDisplayedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(''); // 'sending', 'sent', 'verifying', 'success', 'error'
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
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
      
      // Check if user needs to set credentials
      if (response.data.user.needsPasswordSetup) {
        // Store user ID for credential setup
        localStorage.setItem('tempUserId', response.data.user.id);
        // Redirect to set credentials page
        navigate('/set-credentials');
        return;
      }
      
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
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <FaPhone className="text-[#8BC34A]" />
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
                  Sending Code...
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
                maxLength="6"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading || verificationCode.length !== 6}
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
              ) : 'Verify Code'}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setCodeSent(false);
                setVerificationCode('');
                setDisplayedCode('');
              }}
              className="w-full text-[#8BC34A] font-bold py-3 px-4 rounded-xl border-2 border-[#8BC34A]/30 hover:bg-[#8BC34A]/10 transition-colors flex items-center justify-center"
            >
              <FaArrowLeft className="mr-2" />
              Back to Phone Number
            </button>
          </form>
        )}
        
        <div className="mt-8 pt-6 border-t border-[#8BC34A]/30 text-center">
          <p className="text-sm text-gray-800/70 mb-4">
            Or login with:
          </p>
          
          <div className="flex justify-center gap-4">
            <Link 
              to="/email-otp-login"
              className="flex items-center gap-2 bg-white border-2 border-[#8BC34A]/30 text-[#8BC34A] hover:bg-[#8BC34A]/10 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              <FaEnvelope className="text-[#8BC34A]" />
              <span>Email</span>
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

export default PhoneLoginModern;