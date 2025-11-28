import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiConfig from '../../utils/apiConfig';
import SEO from '../../components/SEO/SEO';

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8BC34A] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-8 sm:p-10">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Profile</h1>
                <p className="text-gray-600">Manage your account information and settings</p>
              </div>
              
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
                  <div className="border-b border-gray-200 pb-8">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                      <button
                        onClick={() => setEditing(true)}
                        className="bg-[#8BC34A] text-white px-4 py-2 rounded-lg hover:bg-[#7CB342] transition-colors text-sm font-medium"
                      >
                        Edit Profile
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Username</label>
                        <p className="text-lg font-medium text-gray-900">{user?.username}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                        <p className="text-lg font-medium text-gray-900">{user?.email}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                        <p className="text-lg font-medium text-gray-900">
                          {user?.phoneNumber || 'Not provided'}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Account Type</label>
                        <p className="text-lg font-medium text-gray-900 capitalize">{user?.role || 'user'}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Password Change */}
                  <div className="border-b border-gray-200 pb-8">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-gray-900">Password</h2>
                      <button
                        onClick={() => setChangePassword(true)}
                        className="bg-[#8BC34A] text-white px-4 py-2 rounded-lg hover:bg-[#7CB342] transition-colors text-sm font-medium"
                      >
                        Change Password
                      </button>
                    </div>
                    <p className="mt-2 text-gray-600">Update your password to keep your account secure</p>
                  </div>
                  
                  {/* Account Actions */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Actions</h2>
                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={() => {
                          localStorage.removeItem('authToken');
                          localStorage.removeItem('loginData');
                          navigate('/');
                          window.location.reload();
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
              
              {/* Edit Profile Form */}
              {editing && (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Edit Profile</h2>
                  
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#8BC34A] focus:border-[#8BC34A]"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#8BC34A] focus:border-[#8BC34A]"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#8BC34A] focus:border-[#8BC34A]"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 pt-4">
                    <button
                      type="submit"
                      className="bg-[#8BC34A] text-white px-6 py-2 rounded-lg hover:bg-[#7CB342] transition-colors font-medium"
                    >
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
                      className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
              
              {/* Change Password Form */}
              {changePassword && (
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>
                  
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#8BC34A] focus:border-[#8BC34A]"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#8BC34A] focus:border-[#8BC34A]"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#8BC34A] focus:border-[#8BC34A]"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 pt-4">
                    <button
                      type="submit"
                      className="bg-[#8BC34A] text-white px-6 py-2 rounded-lg hover:bg-[#7CB342] transition-colors font-medium"
                    >
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
                      className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
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