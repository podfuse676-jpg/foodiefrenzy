import React from 'react';
import Login from '../../components/Login/Login';

const EmailLogin = () => {
  const handleLoginSuccess = () => {
    // Redirect to home page after successful login
    window.location.href = '/';
  };

  const handleClose = () => {
    // Redirect to home page when closing
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] p-4 w-full overflow-x-hidden">
      <div className="w-full max-w-md">
        <Login onLoginSuccess={handleLoginSuccess} onClose={handleClose} />
      </div>
    </div>
  );
};

export default EmailLogin;