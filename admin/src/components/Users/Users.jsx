import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiUser, FiPhone, FiMail, FiShoppingBag } from 'react-icons/fi';
import apiConfig from '../../utils/apiConfig';

const Users = () => {
  const url = apiConfig.baseURL;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (query = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(
        `${url}/api/users/admin/users/search${query ? `?query=${encodeURIComponent(query)}` : ''}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setUsers(response.data.users || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(searchQuery);
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2c1a] via-[#2a422a] to-[#0f1c0f] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="text-green-400 text-xl">Loading users...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2c1a] via-[#2a422a] to-[#0f1c0f] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="text-red-400 text-xl">{error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2c1a] via-[#2a422a] to-[#0f1c0f] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#2b3a2b]/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-green-900/30">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent text-center">
            User Management
          </h2>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch className="text-green-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, phone, or order ID..."
                className="w-full bg-[#1a2c1a]/50 border-2 border-green-900/30 rounded-xl py-3 pl-10 pr-4 text-green-100 placeholder-green-400/50 focus:outline-none focus:border-green-600 transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2.5 bottom-2.5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Search
              </button>
            </div>
          </form>
          
          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-900/20">
                <tr>
                  <th className="p-4 text-left text-green-100">User</th>
                  <th className="p-4 text-left text-green-100">Contact</th>
                  <th className="p-4 text-left text-green-100">Role</th>
                  <th className="p-4 text-left text-green-100">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} className="border-b border-green-900/20 hover:bg-green-900/10 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-900/20 p-2 rounded-lg">
                          <FiUser className="text-green-400" />
                        </div>
                        <div>
                          <p className="text-green-100 font-medium">{user.username}</p>
                          <p className="text-sm text-green-400/60">ID: {user._id.slice(-8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-green-100/80">
                          <FiMail className="text-green-400" />
                          <span>{user.email}</span>
                        </div>
                        {user.phoneNumber && (
                          <div className="flex items-center gap-2 text-green-100/80">
                            <FiPhone className="text-green-400" />
                            <span>{user.phoneNumber}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        user.role === 'admin' 
                          ? 'bg-purple-900/30 text-purple-300 border border-purple-500/50' 
                          : 'bg-green-900/30 text-green-300 border border-green-500/50'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-green-100/80">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {users.length === 0 && (
            <div className="text-center py-12 text-green-100/60 text-xl">
              No users found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;