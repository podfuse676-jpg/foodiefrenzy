import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import apiConfig from '../../utils/apiConfig';
import SEO from '../../components/SEO/SEO';
import { FiUser, FiMail, FiPhone, FiKey, FiEdit, FiLock, FiLogOut, FiCalendar, FiCreditCard, FiShoppingBag, FiHeart, FiMapPin, FiAward } from 'react-icons/fi';

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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Profile Header with Navigation */}
            <div className="bg-gradient-to-r from-[#8BC34A] to-[#7CB342] px-6 py-8 sm:p-10 text-white">
              <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between">
                <div className="flex flex-col sm:flex-row items-center w-full lg:w-auto">
                  <div className="bg-white/20 rounded-full p-4 mb-4 sm:mb-0 sm:mr-6">
                    <FiUser className="h-16 w-16 text-white" />
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">{user?.username}</h1>
                    <div className="space-y-1">
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
                      <p className="text-white/80 text-sm flex items-center justify-center sm:justify-start mt-2">
                        <FiCalendar className="mr-2" />
                        Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 lg:mt-0 flex flex-wrap justify-center lg:justify-end gap-3">
                  <Link 
                    to="/myorder" 
                    className="bg-white/20 hover:bg-white/30 text-white px-5 py-3 rounded-lg transition-colors text-center text-sm font-medium flex items-center"
                  >
                    <FiShoppingBag className="mr-2" />
                    My Orders
                  </Link>
                  <Link 
                    to="/" 
                    className="bg-white/20 hover:bg-white/30 text-white px-5 py-3 rounded-lg transition-colors text-center text-sm font-medium flex items-center"
                  >
                    <FiAward className="mr-2" />
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
                      <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                        <FiUser className="mr-3 text-[#8BC34A]" />
                        Profile Information
                      </h2>
                      <button
                        onClick={() => setEditing(true)}
                        className="flex items-center bg-[#8BC34A] text-white px-5 py-2.5 rounded-lg hover:bg-[#7CB342] transition-colors text-sm font-medium"
                      >
                        <FiEdit className="mr-2" />
                        Edit Profile
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-gradient-to-br from-[#8BC34A]/5 to-[#7CB342]/5 p-5 rounded-xl border border-[#8BC34A]/20">
                        <div className="flex items-center text-sm font-medium text-[#8BC34A] mb-2">
                          <FiUser className="mr-2" />
                          Username
                        </div>
                        <p className="text-lg font-semibold text-gray-900">{user?.username}</p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-[#8BC34A]/5 to-[#7CB342]/5 p-5 rounded-xl border border-[#8BC34A]/20">
                        <div className="flex items-center text-sm font-medium text-[#8BC34A] mb-2">
                          <FiMail className="mr-2" />
                          Email
                        </div>
                        <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-[#8BC34A]/5 to-[#7CB342]/5 p-5 rounded-xl border border-[#8BC34A]/20">
                        <div className="flex items-center text-sm font-medium text-[#8BC34A] mb-2">
                          <FiPhone className="mr-2" />
                          Phone
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
                          {user?.phoneNumber || 'Not provided'}
                        </p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-[#8BC34A]/5 to-[#7CB342]/5 p-5 rounded-xl border border-[#8BC34A]/20">
                        <div className="flex items-center text-sm font-medium text-[#8BC34A] mb-2">
                          <FiCalendar className="mr-2" />
                          Member Since
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                      <FiAward className="mr-3 text-[#8BC34A]" />
                      Quick Actions
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      <Link 
                        to="/myorder" 
                        className="bg-gradient-to-br from-[#8BC34A]/10 to-[#7CB342]/10 p-5 rounded-xl border border-[#8BC34A]/30 hover:from-[#8BC34A]/20 hover:to-[#7CB342]/20 transition-all duration-300 group"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="bg-[#8BC34A]/10 p-3 rounded-lg">
                            <FiShoppingBag className="h-6 w-6 text-[#8BC34A] group-hover:scale-110 transition-transform" />
                          </div>
                          <FiEdit className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">My Orders</h3>
                        <p className="text-sm text-gray-600">View your order history and track deliveries</p>
                      </Link>
                      
                      <button
                        onClick={() => setChangePassword(true)}
                        className="bg-gradient-to-br from-[#8BC34A]/10 to-[#7CB342]/10 p-5 rounded-xl border border-[#8BC34A]/30 hover:from-[#8BC34A]/20 hover:to-[#7CB342]/20 transition-all duration-300 group"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="bg-[#8BC34A]/10 p-3 rounded-lg">
                            <FiLock className="h-6 w-6 text-[#8BC34A] group-hover:scale-110 transition-transform" />
                          </div>
                          <FiEdit className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Change Password</h3>
                        <p className="text-sm text-gray-600">Update your password for security</p>
                      </button>
                      
                      <button
                        onClick={handleLogout}
                        className="bg-gradient-to-br from-red-500/10 to-red-600/10 p-5 rounded-xl border border-red-500/30 hover:from-red-500/20 hover:to-red-600/20 transition-all duration-300 group"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="bg-red-500/10 p-3 rounded-lg">
                            <FiLogOut className="h-6 w-6 text-red-500 group-hover:scale-110 transition-transform" />
                          </div>
                          <FiLogOut className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Logout</h3>
                        <p className="text-sm text-gray-600">Sign out of your account</p>
                      </button>
                    </div>
                  </div>
                  
                  {/* Account Statistics */}
                  <div className="border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                      <FiAward className="mr-3 text-[#8BC34A]" />
                      Account Overview
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-br from-blue-500/5 to-blue-600/5 p-5 rounded-xl border border-blue-500/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-blue-600 font-medium">Total Orders</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">0</p>
                          </div>
                          <div className="bg-blue-500/10 p-3 rounded-lg">
                            <FiShoppingBag className="h-8 w-8 text-blue-500" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-green-500/5 to-green-600/5 p-5 rounded-xl border border-green-500/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-green-600 font-medium">Saved Addresses</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">0</p>
                          </div>
                          <div className="bg-green-500/10 p-3 rounded-lg">
                            <FiMapPin className="h-8 w-8 text-green-500" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-purple-500/5 to-purple-600/5 p-5 rounded-xl border border-purple-500/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-purple-600 font-medium">Wishlist Items</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">0</p>
                          </div>
                          <div className="bg-purple-500/10 p-3 rounded-lg">
                            <FiHeart className="h-8 w-8 text-purple-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
              
              {/* Edit Profile Form */}
              {editing && (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                      <FiEdit className="mr-3 text-[#8BC34A]" />
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#8BC34A] focus:border-[#8BC34A] transition-colors shadow-sm"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#8BC34A] focus:border-[#8BC34A] transition-colors shadow-sm"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#8BC34A] focus:border-[#8BC34A] transition-colors shadow-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 pt-4">
                    <button
                      type="submit"
                      className="bg-[#8BC34A] text-white px-6 py-3 rounded-lg hover:bg-[#7CB342] transition-colors font-medium flex items-center shadow-md hover:shadow-lg"
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
                      className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium shadow-sm"
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
                    <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                      <FiLock className="mr-3 text-[#8BC34A]" />
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
                  
                  <div className="space-y-5">
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#8BC34A] focus:border-[#8BC34A] transition-colors shadow-sm"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#8BC34A] focus:border-[#8BC34A] transition-colors shadow-sm"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#8BC34A] focus:border-[#8BC34A] transition-colors shadow-sm"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 pt-4">
                    <button
                      type="submit"
                      className="bg-[#8BC34A] text-white px-6 py-3 rounded-lg hover:bg-[#7CB342] transition-colors font-medium flex items-center shadow-md hover:shadow-lg"
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
                      className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium shadow-sm"
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