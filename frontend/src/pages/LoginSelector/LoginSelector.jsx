import React from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaWhatsapp } from 'react-icons/fa';

const LoginSelector = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-[#8BC34A]/30 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#8BC34A] to-[#FFC107] bg-clip-text text-transparent mb-2">
            Choose Login Method
          </h2>
          <p className="text-gray-800/80">
            Select your preferred way to sign in to your account
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            to="/email-login"
            className="w-full flex items-center justify-between bg-white border-2 border-[#8BC34A]/30 text-[#8BC34A] hover:bg-[#8BC34A]/10 font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg"
          >
            <div className="flex items-center">
              <FaEnvelope className="text-[#8BC34A] text-xl mr-4" />
              <span className="text-lg">Email & Password</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#8BC34A]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
          
          <Link 
            to="/phone-login"
            className="w-full flex items-center justify-between bg-white border-2 border-[#8BC34A]/30 text-[#8BC34A] hover:bg-[#8BC34A]/10 font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg"
          >
            <div className="flex items-center">
              <FaPhone className="text-[#8BC34A] text-xl mr-4" />
              <span className="text-lg">Phone Number</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#8BC34A]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
          
          <Link 
            to="/whatsapp-login"
            className="w-full flex items-center justify-between bg-white border-2 border-[#8BC34A]/30 text-[#8BC34A] hover:bg-[#8BC34A]/10 font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg"
          >
            <div className="flex items-center">
              <FaWhatsapp className="text-[#8BC34A] text-xl mr-4" />
              <span className="text-lg">WhatsApp</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#8BC34A]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        
        <div className="mt-8 pt-6 border-t border-[#8BC34A]/30 text-center">
          <p className="text-sm text-gray-800/70">
            Don't have an account?{' '}
            <Link 
              to="/signup"
              className="text-[#8BC34A] hover:text-[#FFC107] font-semibold transition-colors"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginSelector;