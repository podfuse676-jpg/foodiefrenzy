// src/components/Users/Users.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '../../utils/apiClient';
import { FiSearch, FiUser, FiMail, FiPhone, FiCalendar, FiShoppingBag } from 'react-icons/fi';
import { styles } from '../../assets/dummyadmin';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] flex items-center justify-center text-gray-800">
        Loading users…
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