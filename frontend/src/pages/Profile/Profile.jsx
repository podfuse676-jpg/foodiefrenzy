import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import apiConfig from '../../utils/apiConfig';
import SEO from '../../components/SEO/SEO';
import { FiUser, FiMail, FiPhone, FiKey, FiEdit, FiLock, FiLogOut, FiCalendar, FiCreditCard } from 'react-icons/fi';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: ''
  });
  const [changePassword, setChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const navigate = useNavigate();
  const url = apiConfig.baseURL;

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await axios.get(`${url}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (res.data.success) {
          setUser(res.data.user);
          setFormData({
            username: res.data.user.username,
            email: res.data.user.email,
            phoneNumber: res.data.user.phoneNumber || ''
          });
        } else {
          setError('Failed to fetch profile');
        }
      } catch (err) {
        setError('Failed to fetch profile: ' + (err.response?.data?.message || err.message));
        if (err.response?.status === 401) {
          localStorage.removeItem('authToken');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, url]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.put(`${url}/api/users/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (res.data.success) {
        setUser(res.data.user);
        setSuccess('Profile updated successfully');
        setEditing(false);
      } else {
        setError(res.data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('Failed to update profile: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }
    
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.put(`${url}/api/users/change-password`, passwordData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (res.data.success) {
        setSuccess('Password changed successfully');
        setChangePassword(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setError(res.data.message || 'Failed to change password');
      }
    } catch (err) {
      setError('Failed to change password: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('loginData');
    navigate('/');
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8BC34A] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6]">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#8BC34A] text-white px-6 py-2 rounded-lg hover:bg-[#7CB342] transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Profile - Lakeshore Convenience"
        description="Manage your profile information and account settings"
        keywords="profile, account, settings, user information"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Profile Header with Navigation */}
            <div className="bg-gradient-to-r from-[#8BC34A] to-[#7CB342] px-6 py-8 sm:p-10 text-white">
              <div className="flex flex-col sm:flex-row items-center">
                <div className="bg-white/20 rounded-full p-4 mb-4 sm:mb-0 sm:mr-6">
                  <FiUser className="h-12 w-12 text-white" />
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2">{user?.username}</h1>
                  <p className="text-white/90 mb-1 flex items-center justify-center sm:justify-start">
                    <FiMail className="mr-2" />
                    {user?.email}
                  </p>
                  {user?.phoneNumber && (
                    <p className="text-white/90 flex items-center justify-center sm:justify-start">
                      <FiPhone className="mr-2" />
                      {user?.phoneNumber}
                    </p>
                  )}
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-auto flex flex-col space-y-2">
                  <Link 
                    to="/myorder" 
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors text-center text-sm font-medium"
                  >
                    My Orders
                  </Link>
                  <Link 
                    to="/" 
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors text-center text-sm font-medium"
                  >
                    Home
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-8 sm:p-10">
              {success && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  {success}
                </div>
              )}
              
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              
              {!editing && !changePassword ? (
                <div className="space-y-8">
                  {/* Profile Information */}
                  <div className="border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                        <FiUser className="mr-2 text-[#8BC34A]" />
                        Profile Information
                      </h2>
                      <button
                        onClick={() => setEditing(true)}
                        className="flex items-center bg-[#8BC34A] text-white px-4 py-2 rounded-lg hover:bg-[#7CB342] transition-colors text-sm font-medium"
                      >
                        <FiEdit className="mr-2" />
                        Edit Profile
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
                          <FiUser className="mr-2" />
                          Username
                        </div>
                        <p className="text-lg font-medium text-gray-900">{user?.username}</p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
                          <FiMail className="mr-2" />
                          Email
                        </div>
                        <p className="text-lg font-medium text-gray-900">{user?.email}</p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
                          <FiPhone className="mr-2" />
                          Phone Number
                        </div>
                        <p className="text-lg font-medium text-gray-900">
                          {user?.phoneNumber || 'Not provided'}
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
                          <FiCalendar className="mr-2" />
                          Member Since
                        </div>
                        <p className="text-lg font-medium text-gray-900">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Account Settings */}
                  <div className="border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <FiKey className="mr-2 text-[#8BC34A]" />
                      Account Settings
                    </h2>
                    
                    <div className="space-y-4">
                      <button
                        onClick={() => setChangePassword(true)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="bg-[#8BC34A]/10 p-2 rounded-lg mr-4">
                            <FiLock className="h-5 w-5 text-[#8BC34A]" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-medium text-gray-900">Change Password</h3>
                            <p className="text-sm text-gray-500">Update your password for security</p>
                          </div>
                        </div>
                        <FiEdit className="h-5 w-5 text-gray-400" />
                      </button>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="bg-red-500/10 p-2 rounded-lg mr-4">
                            <FiLogOut className="h-5 w-5 text-red-500" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-medium text-gray-900">Logout</h3>
                            <p className="text-sm text-gray-500">Sign out of your account</p>
                          </div>
                        </div>
                        <FiLogOut className="h-5 w-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
              
              {/* Edit Profile Form */}
              {editing && (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <FiEdit className="mr-2 text-[#8BC34A]" />
                      Edit Profile
                    </h2>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setError('');
                        setSuccess('');
                        // Reset form to original values
                        setFormData({
                          username: user?.username,
                          email: user?.email,
                          phoneNumber: user?.phoneNumber || ''
                        });
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#8BC34A] focus:border-[#8BC34A] transition-colors"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#8BC34A] focus:border-[#8BC34A] transition-colors"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#8BC34A] focus:border-[#8BC34A] transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 pt-4">
                    <button
                      type="submit"
                      className="bg-[#8BC34A] text-white px-6 py-3 rounded-lg hover:bg-[#7CB342] transition-colors font-medium flex items-center"
                    >
                      <FiEdit className="mr-2" />
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setError('');
                        setSuccess('');
                        // Reset form to original values
                        setFormData({
                          username: user?.username,
                          email: user?.email,
                          phoneNumber: user?.phoneNumber || ''
                        });
                      }}
                      className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
              
              {/* Change Password Form */}
              {changePassword && (
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <FiLock className="mr-2 text-[#8BC34A]" />
                      Change Password
                    </h2>
                    <button
                      type="button"
                      onClick={() => {
                        setChangePassword(false);
                        setError('');
                        setSuccess('');
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#8BC34A] focus:border-[#8BC34A] transition-colors"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#8BC34A] focus:border-[#8BC34A] transition-colors"
                        required
                      />
                      <p className="mt-1 text-sm text-gray-500">Must be at least 8 characters long</p>
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#8BC34A] focus:border-[#8BC34A] transition-colors"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 pt-4">
                    <button
                      type="submit"
                      className="bg-[#8BC34A] text-white px-6 py-3 rounded-lg hover:bg-[#7CB342] transition-colors font-medium flex items-center"
                    >
                      <FiLock className="mr-2" />
                      Change Password
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setChangePassword(false);
                        setError('');
                        setSuccess('');
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                      }}
                      className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;