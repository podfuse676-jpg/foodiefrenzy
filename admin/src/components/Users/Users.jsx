// src/components/Users/Users.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '../../utils/apiClient';
import { FiSearch, FiUser, FiMail, FiPhone, FiCalendar, FiShoppingBag, FiMapPin, FiDollarSign } from 'react-icons/fi';
import { styles } from '../../assets/dummyadmin';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/api/users/admin/users');
        const data = response.data;
        
        if (data.success && Array.isArray(data.users)) {
          setUsers(data.users);
          setFilteredUsers(data.users);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        alert('Error fetching users: ' + (err.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  // Filter users based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = users.filter(user => 
      (user.username && user.username.toLowerCase().includes(query)) ||
      (user.email && user.email.toLowerCase().includes(query)) ||
      (user.phoneNumber && user.phoneNumber.includes(query))
    );
    
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  // Fetch user details and orders when a user is selected
  const fetchUserDetails = async (userId) => {
    if (!userId) return;
    
    try {
      setLoadingUserDetails(true);
      setSelectedUser(userId);
      
      // Fetch user details
      const userResponse = await apiClient.get(`/api/users/admin/users/${userId}`);
      setUserDetails(userResponse.data.user);
      setUserOrders(userResponse.data.orders || []);
    } catch (err) {
      console.error('Error fetching user details:', err);
      alert('Error fetching user details: ' + (err.message || 'Unknown error'));
    } finally {
      setLoadingUserDetails(false);
    }
  };

  // Close user detail view
  const closeUserDetails = () => {
    setSelectedUser(null);
    setUserDetails(null);
    setUserOrders([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] flex items-center justify-center text-gray-800">
        Loading users…
      </div>
    );
  }

  // User Detail View
  if (selectedUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-[#8BC34A]/20">
            {/* Back Button */}
            <button 
              onClick={closeUserDetails}
              className="mb-6 px-4 py-2 bg-[#8BC34A] text-white rounded-lg hover:bg-[#7cb342] transition-colors flex items-center gap-2"
            >
              ← Back to Users
            </button>
            
            {loadingUserDetails ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8BC34A]"></div>
                <p className="mt-4 text-gray-600">Loading user details...</p>
              </div>
            ) : userDetails ? (
              <>
                {/* User Info Header */}
                <div className="flex flex-col md:flex-row gap-6 mb-8 p-6 bg-[#F9FFF6] rounded-2xl">
                  <div className="bg-[#8BC34A]/10 p-4 rounded-full">
                    <FiUser className="text-[#8BC34A] text-4xl" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-800">{userDetails.username || 'N/A'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <FiMail className="text-gray-500" />
                        <span>{userDetails.email || 'N/A'}</span>
                      </div>
                      {userDetails.phoneNumber && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <FiPhone className="text-gray-500" />
                          <span>{userDetails.phoneNumber}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-700">
                        <FiCalendar className="text-gray-500" />
                        <span>Joined: {userDetails.createdAt ? new Date(userDetails.createdAt).toLocaleDateString() : 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <FiShoppingBag className="text-gray-500" />
                        <span>Total Orders: {userOrders.length}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Orders Section */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Recent Orders</h3>
                  
                  {userOrders.length === 0 ? (
                    <div className="text-center py-12 text-gray-600">
                      <FiShoppingBag className="mx-auto text-4xl text-gray-400 mb-4" />
                      <p>No orders found for this user</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-[#F9FFF6]">
                          <tr>
                            <th className="p-4 text-left text-gray-700">Order ID</th>
                            <th className="p-4 text-left text-gray-700">Date</th>
                            <th className="p-4 text-left text-gray-700">Items</th>
                            <th className="p-4 text-left text-gray-700">Total</th>
                            <th className="p-4 text-left text-gray-700">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userOrders.map(order => (
                            <tr key={order._id} className="border-b border-[#8BC34A]/10 hover:bg-[#F9FFF6]/50 transition-colors">
                              <td className="p-4">
                                <span className="font-mono text-sm">#{order._id?.substring(0, 8)}</span>
                              </td>
                              <td className="p-4 text-gray-700">
                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                              </td>
                              <td className="p-4">
                                <div className="space-y-1">
                                  {(order.items || []).slice(0, 2).map((item, idx) => (
                                    <div key={idx} className="text-sm text-gray-700">
                                      {item.item?.name || item.name || 'Unknown Item'} × {item.quantity || 1}
                                    </div>
                                  ))}
                                  {(order.items || []).length > 2 && (
                                    <div className="text-sm text-gray-500">
                                      + {(order.items || []).length - 2} more items
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="p-4 text-[#8BC34A] font-medium">
                                ${(order.total || 0).toFixed(2)} CAD
                              </td>
                              <td className="p-4">
                                <span className="px-3 py-1 bg-[#8BC34A]/10 text-[#8BC34A] rounded-full text-sm">
                                  {order.status || 'Pending'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-600">
                <p>Error loading user details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-[#8BC34A]/20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h2 className="text-3xl font-bold text-center text-gray-800">User Management</h2>
            
            {/* Search Bar */}
            <div className="relative w-full md:w-auto">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 w-full md:w-80 bg-white border-2 border-[#8BC34A]/20 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 transition-colors"
              />
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-gray-600 text-xl">
              {searchQuery ? 'No users found matching your search.' : 'No users found.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F9FFF6]">
                  <tr>
                    <th className="p-4 text-left text-gray-700">User</th>
                    <th className="p-4 text-left text-gray-700">Contact</th>
                    <th className="p-4 text-left text-gray-700">Joined</th>
                    <th className="p-4 text-left text-gray-700">Orders</th>
                    <th className="p-4 text-left text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user._id} className="border-b border-[#8BC34A]/10 hover:bg-[#F9FFF6]/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-[#8BC34A]/10 p-2 rounded-full">
                            <FiUser className="text-[#8BC34A]" />
                          </div>
                          <div>
                            <p className="text-gray-800 font-medium">{user.username || 'N/A'}</p>
                            <p className="text-sm text-gray-600">ID: {user._id.substring(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-700">
                            <FiMail className="text-gray-500" />
                            <span className="text-sm">{user.email || 'N/A'}</span>
                          </div>
                          {user.phoneNumber && (
                            <div className="flex items-center gap-2 text-gray-700">
                              <FiPhone className="text-gray-500" />
                              <span className="text-sm">{user.phoneNumber}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <FiCalendar className="text-gray-500" />
                          <span className="text-sm">
                            {user.createdAt 
                              ? new Date(user.createdAt).toLocaleDateString() 
                              : 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <FiShoppingBag className="text-gray-500" />
                          <span className="text-sm">0 orders</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => fetchUserDetails(user._id)}
                          className="px-4 py-2 bg-[#8BC34A] text-white rounded-lg hover:bg-[#7cb342] transition-colors text-sm"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 text-gray-600 text-sm">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;