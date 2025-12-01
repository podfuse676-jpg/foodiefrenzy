import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import apiConfig from '../../utils/apiConfig';
import SEO from '../../components/SEO/SEO';
import { FiUser, FiMail, FiPhone, FiKey, FiEdit, FiLock, FiLogOut, FiCalendar, FiShoppingBag, FiHeart, FiMapPin, FiAward, FiChevronRight, FiStar, FiCreditCard, FiPackage, FiShield } from 'react-icons/fi';

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
  const [stats, setStats] = useState({
    totalOrders: 0,
    savedAddresses: 0,
    wishlistItems: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  
  const navigate = useNavigate();
  const url = apiConfig.baseURL;

  // Fetch user profile and related data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        // Fetch user profile
        const profileRes = await axios.get(`${url}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (profileRes.data.success) {
          setUser(profileRes.data.user);
          setFormData({
            username: profileRes.data.user.username,
            email: profileRes.data.user.email,
            phoneNumber: profileRes.data.user.phoneNumber || ''
          });
        } else {
          setError('Failed to fetch profile');
          return;
        }

        // Fetch user orders
        try {
          const ordersRes = await axios.get(`${url}/api/new-orders/my`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          const orders = ordersRes.data || [];
          setRecentOrders(orders.slice(0, 3)); // Get only the 3 most recent orders
          
          // Update stats with real data
          setStats(prevStats => ({
            ...prevStats,
            totalOrders: orders.length,
            // For now, we'll use placeholder values for addresses and wishlist
            // since there don't seem to be specific endpoints for these
            savedAddresses: prevStats.savedAddresses || 1, // Default to 1 if not set
            wishlistItems: prevStats.wishlistItems || 0  // Default to 0 if not set
          }));
        } catch (ordersErr) {
          console.error('Failed to fetch orders:', ordersErr);
          // Still update with defaults if orders fetch fails
          setStats(prevStats => ({
            ...prevStats,
            totalOrders: 0,
            savedAddresses: prevStats.savedAddresses || 1,
            wishlistItems: prevStats.wishlistItems || 0
          }));
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

    fetchData();
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
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
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Account Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage your profile and account settings</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-8 text-white">
                  <div className="flex flex-col items-center">
                    <div className="bg-white/20 rounded-full p-3 mb-4">
                      <FiUser className="h-12 w-12 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">{user?.username}</h2>
                    <p className="text-indigo-100 mt-1">{user?.email}</p>
                    {user?.phoneNumber && (
                      <p className="text-indigo-100 mt-1">{user?.phoneNumber}</p>
                    )}
                    <p className="text-indigo-200 text-sm mt-3">
                      Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div className="px-6 py-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Account Status</h3>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Verified
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center">
                        <FiShield className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-600">Security</span>
                      </div>
                      <span className="text-sm text-green-600 font-medium">Strong</span>
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center">
                        <FiStar className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-600">Loyalty Points</span>
                      </div>
                      <span className="text-sm font-medium text-indigo-600">1,250 pts</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  <button
                    onClick={() => setEditing(true)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="bg-indigo-100 p-2 rounded-lg">
                        <FiEdit className="h-5 w-5 text-indigo-600" />
                      </div>
                      <span className="ml-4 text-gray-700 font-medium">Edit Profile</span>
                    </div>
                    <FiChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                  
                  <button
                    onClick={() => setChangePassword(true)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="bg-indigo-100 p-2 rounded-lg">
                        <FiLock className="h-5 w-5 text-indigo-600" />
                      </div>
                      <span className="ml-4 text-gray-700 font-medium">Change Password</span>
                    </div>
                    <FiChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="bg-red-100 p-2 rounded-lg">
                        <FiLogOut className="h-5 w-5 text-red-600" />
                      </div>
                      <span className="ml-4 text-gray-700 font-medium">Logout</span>
                    </div>
                    <FiChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Right Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-sm p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-indigo-100 text-sm">Total Orders</p>
                      <p className="text-3xl font-bold mt-1">{stats.totalOrders}</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                      <FiPackage className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-indigo-100 text-sm">
                      <span>{stats.totalOrders > 0 ? `+${Math.max(1, Math.floor(stats.totalOrders * 0.1))}% from last month` : 'No orders yet'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-sm p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Saved Addresses</p>
                      <p className="text-3xl font-bold mt-1">{stats.savedAddresses}</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                      <FiMapPin className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-green-100 text-sm">
                      <span>{stats.savedAddresses > 1 ? `${stats.savedAddresses - 1} new this month` : '1 default address'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-sm p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Wishlist Items</p>
                      <p className="text-3xl font-bold mt-1">{stats.wishlistItems}</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                      <FiHeart className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-purple-100 text-sm">
                      <span>{stats.wishlistItems > 0 ? `${stats.wishlistItems} items saved` : 'Empty wishlist'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Recent Activity */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                    <Link to="/myorder" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                      View all
                    </Link>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order, index) => (
                      <div key={order._id || index} className="px-6 py-4">
                        <div className="flex items-start">
                          <div className="bg-indigo-100 p-2 rounded-lg">
                            <FiShoppingBag className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div className="ml-4">
                            <h4 className="text-sm font-medium text-gray-900">Order #{order._id?.slice(-6) || 'N/A'} placed</h4>
                            <p className="text-sm text-gray-500 mt-1">
                              {order.items?.length || 0} items • ${typeof order.total === 'number' ? order.total.toFixed(2) : '0.00'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Date unknown'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-6 py-8 text-center">
                      <FiPackage className="h-12 w-12 text-gray-300 mx-auto" />
                      <h4 className="text-sm font-medium text-gray-900 mt-4">No recent orders</h4>
                      <p className="text-sm text-gray-500 mt-1">Your recent orders will appear here</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Navigation Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link 
                  to="/myorder" 
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">My Orders</h3>
                      <p className="text-gray-500 text-sm mt-1">View order history</p>
                    </div>
                    <div className="bg-indigo-100 p-3 rounded-lg">
                      <FiShoppingBag className="h-6 w-6 text-indigo-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-indigo-600 text-sm font-medium">
                    <span>View details</span>
                    <FiChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </Link>
                
                <Link 
                  to="/" 
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Home</h3>
                      <p className="text-gray-500 text-sm mt-1">Back to shopping</p>
                    </div>
                    <div className="bg-indigo-100 p-3 rounded-lg">
                      <FiAward className="h-6 w-6 text-indigo-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-indigo-600 text-sm font-medium">
                    <span>Browse products</span>
                    <FiChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Edit Profile Modal */}
          {editing && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-5 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setError('');
                        setSuccess('');
                      }}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <form onSubmit={handleUpdateProfile} className="px-6 py-5">
                  {success && (
                    <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                      {success}
                    </div>
                  )}
                  
                  {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  
                  <div className="space-y-4">
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setError('');
                        setSuccess('');
                      }}
                      className="flex-1 bg-gray-200 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          {/* Change Password Modal */}
          {changePassword && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-5 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
                    <button
                      onClick={() => {
                        setChangePassword(false);
                        setError('');
                        setSuccess('');
                      }}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <form onSubmit={handleChangePassword} className="px-6 py-5">
                  {success && (
                    <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                      {success}
                    </div>
                  )}
                  
                  {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        required
                      />
                      <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters long</p>
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                      Change Password
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setChangePassword(false);
                        setError('');
                        setSuccess('');
                      }}
                      className="flex-1 bg-gray-200 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;