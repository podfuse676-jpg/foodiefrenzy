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
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
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

  // Handle review submission
  const handleReviewSubmit = async (reviewData) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('You must be logged in to submit a review');
      }
      
      const response = await axios.post(
        `${url}/api/reviews`,
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      console.log('Review submitted:', response.data);
      
      // Close the modal
      setShowReviewModal(false);
      setSelectedItem(null);
      setSelectedOrderId(null);
      
      // Show success message or refresh orders
      alert('Thank you for your review!');
      
      // Refresh orders to update any UI that might show review status
      const response2 = await axios.get(`${url}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const formattedOrders = response2.data.map(order => ({
        ...order,
        items: order.items?.map(entry => ({
          _id: entry._id,
          item: {
            ...entry.item,
            imageUrl: entry.item.imageUrl,
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
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(error.response?.data?.message || 'Failed to submit review. Please try again.');
    }
  };

  // Open review modal for an item
  const openReviewModal = (item, orderId) => {
    setSelectedItem(item);
    setSelectedOrderId(orderId);
    setShowReviewModal(true);
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
                  <th className="p-4 text-left text-[#8BC34A]">Actions</th>
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
                          {order.items.map((item, index) => (
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
                          ))}
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

                      {/* Actions column - Review button for delivered orders */}
                      <td className="p-4">
                        {order.status === 'delivered' && (
                          <div className="flex flex-col gap-2">
                            {order.items.map((item, index) => (
                              <button
                                key={`${order._id}-${index}-review`}
                                onClick={() => openReviewModal(item.item, order._id)}
                                className="flex items-center gap-1 bg-[#8BC34A]/20 text-[#8BC34A] hover:bg-[#8BC34A]/30 px-3 py-1 rounded-full text-sm transition-colors"
                              >
                                <FiStar className="text-sm" />
                                <span>Review</span>
                              </button>
                            ))}
                          </div>
                        )}
                        {order.status !== 'delivered' && (
                          <span className="text-gray-500 text-sm">Not delivered</span>
                        )}
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

      {/* Review Modal */}
      {showReviewModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-dancingscript text-gray-800">
                  Review {selectedItem.name}
                </h3>
                <button
                  onClick={() => {
                    setShowReviewModal(false);
                    setSelectedItem(null);
                    setSelectedOrderId(null);
                  }}
                  className="text-gray-500 hover:text-[#8BC34A]"
                >
                  <FiArrowLeft />
                </button>
              </div>

              <ReviewForm 
                item={selectedItem}
                orderId={selectedOrderId}
                onSubmit={handleReviewSubmit}
                onCancel={() => {
                  setShowReviewModal(false);
                  setSelectedItem(null);
                  setSelectedOrderId(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Review Form Component
const ReviewForm = ({ item, orderId, onSubmit, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (rating === 0) {
      setError('Please select a rating');
      setLoading(false);
      return;
    }

    if (!title.trim()) {
      setError('Please enter a title for your review');
      setLoading(false);
      return;
    }

    if (!comment.trim()) {
      setError('Please enter your review comment');
      setLoading(false);
      return;
    }

    if (!orderId) {
      setError('Order information is missing');
      setLoading(false);
      return;
    }

    try {
      await onSubmit({
        itemId: item._id || item.id,
        orderId,
        rating,
        title,
        comment
      });
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}
      
      {/* Rating Selection */}
      <div className="mb-4">
        <label className="block text-gray-800 font-cinzel mb-2">
          Your Rating
        </label>
        <div className="flex justify-center">
          {[...Array(5)].map((_, i) => {
            const ratingValue = i + 1;
            return (
              <label key={i} className="cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  value={ratingValue}
                  onClick={() => setRating(ratingValue)}
                  className="hidden"
                />
                <FiStar
                  className={`w-8 h-8 mx-1 transition-colors ${
                    ratingValue <= (hover || rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(0)}
                />
              </label>
            );
          })}
        </div>
        {rating > 0 && (
          <p className="text-center text-gray-800 mt-2 font-cinzel">
            {rating === 1 && 'Poor'}
            {rating === 2 && 'Fair'}
            {rating === 3 && 'Good'}
            {rating === 4 && 'Very Good'}
            {rating === 5 && 'Excellent'}
          </p>
        )}
      </div>
      
      {/* Title Input */}
      <div className="mb-4">
        <label className="block text-gray-800 font-cinzel mb-2">
          Review Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your review a title"
          className="w-full px-4 py-2 border border-[#8BC34A]/30 rounded-lg focus:outline-none focus:border-[#8BC34A] font-cinzel"
          maxLength={100}
        />
      </div>
      
      {/* Comment Textarea */}
      <div className="mb-6">
        <label className="block text-gray-800 font-cinzel mb-2">
          Your Review
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product"
          rows={4}
          className="w-full px-4 py-2 border border-[#8BC34A]/30 rounded-lg focus:outline-none focus:border-[#8BC34A] font-cinzel"
          maxLength={1000}
        />
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-between gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-cinzel hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-[#8BC34A] to-[#7CB342] text-white py-2 px-4 rounded-lg font-cinzel hover:from-[#7CB342] hover:to-[#8BC34A] transition-colors disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </form>
  );
};

export default UserOrdersPage;