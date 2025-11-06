import React, { useState, useEffect } from 'react';
import { FiTruck, FiCheckCircle, FiClock, FiArrowLeft, FiUser, FiMapPin, FiBox, FiStar } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../CartContext/CartContext';
import apiConfig from '../../utils/apiConfig';

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemRatings, setItemRatings] = useState({}); // Store ratings for items
  const url = apiConfig.baseURL;
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Check for authentication token using consistent key
        const token = localStorage.getItem('authToken');
        if (!token || token === 'undefined' || token === 'null' || token === '') {
          setError('You must be logged in to view orders');
          setLoading(false);
          // Redirect to login page
          setTimeout(() => {
            navigate('/login');
          }, 3000);
          return;
        }
        
        // Remove the email parameter since the backend filters by authenticated user ID
        const response = await axios.get(`${url}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const formattedOrders = response.data.map(order => ({
          ...order,
          items: order.items?.map(entry => ({
            _id: entry._id,
            item: {
              ...entry.item,
              imageUrl: entry.item.imageUrl,   // <-- CORRECT: pull from entry.item
            },
            quantity: entry.quantity
          })) || [],
          createdAt: new Date(order.createdAt).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          paymentStatus: order.paymentStatus?.toLowerCase() || 'pending'
        }));
        setOrders(formattedOrders);
        setError(null);
        
        // Fetch ratings for all items in orders
        fetchItemRatings(formattedOrders, token);
      } catch (err) {
        console.error('Error fetching orders:', err);
        if (err.response?.status === 401) {
          setError('You must be logged in to view orders. Redirecting to login page...');
          // Clear invalid tokens
          localStorage.removeItem('authToken');
          localStorage.removeItem('token');
          localStorage.removeItem('loginData');
          localStorage.removeItem('user');
          // Redirect to login page
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else if (err.response?.status === 403) {
          setError('Access denied. Please try logging in again.');
          // Clear invalid tokens
          localStorage.removeItem('authToken');
          localStorage.removeItem('token');
          localStorage.removeItem('loginData');
          localStorage.removeItem('user');
          // Redirect to login page
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          setError(err.response?.data?.message || 'Failed to load orders. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // Fetch ratings for all items in orders
  const fetchItemRatings = async (orders, token) => {
    try {
      const ratings = {};
      
      // Get all unique item IDs from orders
      const itemIds = [];
      orders.forEach(order => {
        order.items.forEach(item => {
          const itemId = item.item._id || item.item.id;
          if (itemId && !itemIds.includes(itemId)) {
            itemIds.push(itemId);
          }
        });
      });
      
      // Fetch ratings for each item
      for (const itemId of itemIds) {
        try {
          const response = await axios.get(`${url}/api/reviews/stats/${itemId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          ratings[itemId] = response.data.averageRating;
        } catch (err) {
          console.error(`Error fetching rating for item ${itemId}:`, err);
          ratings[itemId] = 0; // Default to 0 if error
        }
      }
      
      setItemRatings(ratings);
    } catch (err) {
      console.error('Error fetching item ratings:', err);
    }
  };

  const statusStyles = {
    processing: {
      color: 'text-[#FFC107]',
      bg: 'bg-[#FFC107]/20',
      icon: <FiClock className="text-lg" />,
      label: 'Processing'
    },
    outForDelivery: {
      color: 'text-blue-600',
      bg: 'bg-blue-100/20',
      icon: <FiTruck className="text-lg" />,
      label: 'Out for Delivery'
    },
    delivered: {
      color: 'text-[#8BC34A]',
      bg: 'bg-[#8BC34A]/20',
      icon: <FiCheckCircle className="text-lg" />,
      label: 'Delivered'
    },
    pending: {
      color: 'text-yellow-600',
      bg: 'bg-yellow-100/20',
      icon: <FiClock className="text-lg" />,
      label: 'Payment Pending'
    },
    succeeded: {
      color: 'text-[#8BC34A]',
      bg: 'bg-[#8BC34A]/20',
      icon: <FiCheckCircle className="text-lg" />,
      label: 'Payment Completed'
    },
    failed: {
      color: 'text-red-600',
      bg: 'bg-red-100/20',
      icon: <FiClock className="text-lg" />,
      label: 'Payment Failed'
    }
  };

  const getPaymentMethodDetails = (method) => {
    switch (method.toLowerCase()) {
      case 'cod':
        return {
          label: 'COD',
          class: 'bg-[#FFC107]/30 text-gray-800 border-[#FFC107]/50'
        };
      case 'card':
        return {
          label: 'Credit/Debit Card',
          class: 'bg-blue-100/30 text-blue-800 border-blue-500/50'
        };
      case 'upi':
        return {
          label: 'UPI Payment',
          class: 'bg-purple-100/30 text-purple-800 border-purple-500/50'
        };
      default:
        return {
          label: 'Online',
          class: 'bg-[#8BC34A]/30 text-gray-800 border-[#8BC34A]/50'
        };
    }
  };

  // Display star ratings
  const renderRating = (rating) => {
    if (!rating || rating === 0) {
      return <span className="text-gray-500 text-sm">No reviews</span>;
    }
    
    return (
      <div className="flex items-center gap-1">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <FiStar
              key={i}
              className={`${
                i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
              } text-sm`}
              fill={i < Math.floor(rating) ? 'currentColor' : 'none'}
            />
          ))}
        </div>
        <span className="text-gray-800 text-sm font-cinzel">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  if (loading) return (
    // Updated to light fresh colors
    <div className="min-h-screen bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] flex items-center justify-center text-[#8BC34A] text-xl">
      Loading orders...
    </div>
  );

  if (error) return (
    // Updated to light fresh colors
    <div className="min-h-screen bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] flex flex-col items-center justify-center text-[#FF9800] text-xl gap-4">
      <p>{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="flex items-center gap-2 text-[#8BC34A] hover:text-[#FFC107]"
      >
        <FiArrowLeft className="text-xl" />
        <span>Try Again</span>
      </button>
    </div>
  );

  return (
    // Updated to light fresh colors
    <div className="min-h-screen bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link to="/" className="flex items-center gap-2 text-[#8BC34A] hover:text-[#FFC107]">
            <FiArrowLeft className="text-xl" />
            <span className="font-bold">Back to Home</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-[#8BC34A]/70 text-sm">
              {user?.email}
            </span>
          </div>
        </div>

        <div className="bg-white backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-[#8BC34A]/20">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-[#8BC34A] to-[#FFC107] bg-clip-text text-transparent text-center">
            Order History
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100/50">
                <tr>
                  <th className="p-4 text-left text-[#8BC34A]">Order ID</th>
                  <th className="p-4 text-left text-[#8BC34A]">Customer</th>
                  <th className="p-4 text-left text-[#8BC34A]">Address</th>
                  <th className="p-4 text-left text-[#8BC34A]">Items</th>
                  <th className="p-4 text-left text-[#8BC34A]">Total Items</th>
                  <th className="p-4 text-left text-[#8BC34A]">Price</th>
                  <th className="p-4 text-left text-[#8BC34A]">Payment</th>
                  <th className="p-4 text-left text-[#8BC34A]">Status</th>
                  <th className="p-4 text-left text-[#8BC34A]">Rating</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
                  const totalPrice = order.total ?? order.items.reduce(
                    (sum, item) => sum + (item.item.price * item.quantity),
                    0
                  );
                  const paymentMethod = getPaymentMethodDetails(order.paymentMethod);
                  const status = statusStyles[order.status] || statusStyles.processing;
                  const paymentStatus = statusStyles[order.paymentStatus] || statusStyles.pending;

                  return (
                    <tr
                      key={order._id}
                      className="border-b border-[#8BC34A]/20 hover:bg-gray-100/30 transition-colors group"
                    >
                      <td className="p-4 text-gray-800 font-mono text-sm">#{order._id?.slice(-8)}</td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <FiUser className="text-[#8BC34A]" />
                          <div>
                            <p className="text-gray-800">{order.firstName} {order.lastName}</p>
                            <p className="text-sm text-[#8BC34A]/60">{order.phone}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <FiMapPin className="text-[#8BC34A]" />
                          <div className="text-gray-800/80 text-sm max-w-[200px]">
                            {order.address}, {order.city} - {order.zipCode}
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="space-y-2">
                          {order.items.map((item, index) => {
                            const itemId = item.item._id || item.item.id;
                            const itemRating = itemRatings[itemId] || 0;
                            
                            return (
                              <div
                                key={`${order._id}-${index}`}
                                className="flex items-center gap-3 p-2 bg-gray-100/50 rounded-lg"
                              >
                                <img
                                  src={item.item.imageUrl ? (item.item.imageUrl.startsWith('http') ? item.item.imageUrl : `${url}${item.item.imageUrl}`) : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='}
                                  alt={item.item.name}
                                  className="w-10 h-10 object-cover rounded-lg"
                                  onError={(e) => {
                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIEVycm9yPC90ZXh0Pjwvc3ZnPg==';
                                  }}
                                />

                                <div className="flex-1">
                                  <span className="text-gray-800/80 text-sm block">
                                    {item.item.name}
                                  </span>
                                  <div className="flex items-center gap-2 text-xs text-[#8BC34A]/60">
                                    <span>${item.item.price} CAD</span>
                                    <span className="mx-1">•</span>
                                    <span>x{item.quantity}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </td>

                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <FiBox className="text-[#8BC34A]" />
                          <span className="text-[#FFC107] text-lg">{totalItems}</span>
                        </div>
                      </td>

                      <td className="p-4 text-[#FFC107] text-lg">${totalPrice.toFixed(2)} CAD</td>

                      <td className="p-4">
                        <div className="flex flex-col gap-2">
                          <div className={`${paymentMethod.class} px-3 py-1.5 rounded-lg border text-sm`}>
                            {paymentMethod.label}
                          </div>
                          <div className={`${paymentStatus.bg} ${paymentStatus.color} flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border`}>
                            {paymentStatus.icon}
                            <span>{paymentStatus.label}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className={`${status.color} text-xl`}>{status.icon}</span>
                          <span className={`px-4 py-2 rounded-lg ${status.bg} ${status.color} border border-[#8BC34A]/20 text-sm`}>
                            {status.label}
                          </span>
                        </div>
                      </td>

                      {/* Rating column - Display ratings for all items */}
                      <td className="p-4">
                        <div className="space-y-2">
                          {order.items.map((item, index) => {
                            const itemId = item.item._id || item.item.id;
                            const itemRating = itemRatings[itemId];
                            
                            return (
                              <div key={`${order._id}-${index}-rating`} className="flex items-center">
                                {renderRating(itemRating)}
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {orders.length === 0 && (
            <div className="text-center py-12 text-gray-800/60 text-xl">
              No orders found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserOrdersPage;