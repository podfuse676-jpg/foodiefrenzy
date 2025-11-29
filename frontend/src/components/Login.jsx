// frontend/src/components/Login.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import WhatsAppLogin from './WhatsAppLogin';

const Login = ({ onLoginSuccess, onClose }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <WhatsAppLogin onLoginSuccess={onLoginSuccess} onClose={onClose} />
        
        {/* Alternative login options */}
        <div className="mt-8 pt-6 border-t border-[#8BC34A]/30 text-center">
          <p className="text-sm text-gray-800/70 mb-4">
            Don't have an account?{' '}
            <Link 
              to="/signup"
              className="text-[#8BC34A] hover:text-[#FFC107] font-semibold transition-colors"
            >
              Create Account
            </Link>
          </p>
          
          <p className="text-sm text-gray-800/70">
            Prefer to login with email instead?{' '}
            <Link 
              to="/email-login"
              className="text-[#8BC34A] hover:text-[#FFC107] font-semibold transition-colors"
            >
              Login with Email
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;