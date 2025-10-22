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
      const response = await axios.post('http://localhost:4000/api/phone-auth/send-code', {
        phoneNumber: phoneNumber.startsWith('+') ? phoneNumber : `+1${phoneNumber}`
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
      const response = await axios.post('http://localhost:4000/api/phone-auth/verify-code', {
        phoneNumber: phoneNumber.startsWith('+') ? phoneNumber : `+1${phoneNumber}`,
        verificationCode
      });
      
      // Save token and login data to localStorage
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('token', response.data.token); // Keep for backward compatibility
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('loginData', JSON.stringify({ 
        loggedIn: true,
        email: response.data.user.email || '',
        rememberMe: true
      }));
      
      toast.success('Login successful!');
      setLoading(false);
      navigate('/');
    } catch (error) {
      console.error('Error verifying code:', error);
      toast.error(error.response?.data?.message || 'Invalid verification code');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Phone Login</h2>
      
      {!codeSent ? (
        <form onSubmit={handleSendCode}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">
              Phone Number
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="phoneNumber"
              type="tel"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500 mt-1">Format: +1XXXXXXXXXX or XXXXXXXXXX (US)</p>
          </div>
          
          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Verification Code'}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode}>
          {displayedCode && (
            <div className="mb-4 p-4 bg-green-50 border-2 border-green-500 rounded-lg">
              <p className="text-sm text-green-800 font-semibold mb-2">📱 Your Verification Code:</p>
              <p className="text-3xl font-bold text-green-600 text-center tracking-widest">{displayedCode}</p>
              <p className="text-xs text-green-700 mt-2 text-center">
                (SMS may not be delivered on trial accounts - use this code)
              </p>
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="verificationCode">
              Verification Code
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="verificationCode"
              type="text"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
              required
            />
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              className="text-blue-500 hover:text-blue-700 text-sm"
              onClick={() => setCodeSent(false)}
            >
              Change Phone Number
            </button>
            
            <button
              type="button"
              className="text-blue-500 hover:text-blue-700 text-sm"
              onClick={handleSendCode}
              disabled={loading}
            >
              Resend Code
            </button>
          </div>
          
          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
          </div>
        </form>
      )}
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Want to login with email instead?{' '}
          <a href="/login" className="text-blue-500 hover:text-blue-700">
            Login with Email
          </a>
        </p>
      </div>
    </div>
  );
};

export default PhoneLogin;