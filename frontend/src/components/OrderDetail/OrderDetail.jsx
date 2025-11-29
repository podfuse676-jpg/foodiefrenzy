import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiTruck, FiCheckCircle, FiClock, FiMapPin, FiCreditCard, FiDollarSign } from 'react-icons/fi';
import axios from 'axios';
import apiConfig from '../../utils/apiConfig';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const url = apiConfig.baseURL;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        
        if (!token || token === 'undefined' || token === 'null' || token === '') {
          setError('You must be logged in to view order details');
          setLoading(false);
          setTimeout(() => {
            navigate('/login');
          }, 3000);
          return;
        }

        const response = await axios.get(`${url}/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setOrder(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching order:', err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError('Access denied. Please try logging in again.');
          localStorage.removeItem('authToken');
          localStorage.removeItem('token');
          localStorage.removeItem('loginData');
          localStorage.removeItem('user');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else if (err.response?.status === 404) {
          setError('Order not found.');
        } else {
          setError(err.response?.data?.message || 'Failed to load order details. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  const statusStyles = {
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
    },
    processing: {
      color: 'text-[#FFC107]',
      bg: 'bg-[#FFC107]/20',
      icon: <FiClock className="text-lg" />,
      label: 'Processing'
    },
    shipped: {
      color: 'text-blue-600',
      bg: 'bg-blue-100/20',
      icon: <FiTruck className="text-lg" />,
      label: 'Shipped'
    },
    delivered: {
      color: 'text-[#8BC34A]',
      bg: 'bg-[#8BC34A]/20',
      icon: <FiCheckCircle className="text-lg" />,
      label: 'Delivered'
    },
    cancelled: {
      color: 'text-red-600',
      bg: 'bg-red-100/20',
      icon: <FiClock className="text-lg" />,
      label: 'Cancelled'
    }
  };

  const getPaymentMethodDetails = (method) => {
    switch (method?.toLowerCase()) {
      case 'cod':
        return {
          label: 'Cash on Delivery',
          class: 'bg-[#FFC107]/30 text-gray-800 border-[#FFC107]/50'
        };
      case 'card':
        return {
          label: 'Credit/Debit Card',
          class: 'bg-blue-100/30 text-blue-800 border-blue-500/50'
        };
      default:
        return {
          label: 'Online Payment',
          class: 'bg-[#8BC34A]/30 text-gray-800 border-[#8BC34A]/50'
        };
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] flex items-center justify-center text-[#8BC34A] text-xl">
      Loading order details...
    </div>
  );

  if (error) return (
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

  if (!order) return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] flex flex-col items-center justify-center text-[#FF9800] text-xl gap-4">
      <p>Order not found.</p>
      <Link to="/myorder" className="flex items-center gap-2 text-[#8BC34A] hover:text-[#FFC107]">
        <FiArrowLeft className="text-xl" />
        <span>Back to Orders</span>
      </Link>
    </div>
  );

  const paymentMethod = getPaymentMethodDetails(order.paymentMethod);
  const status = statusStyles[order.paymentStatus] || statusStyles.pending;
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link to="/myorder" className="flex items-center gap-2 text-[#8BC34A] hover:text-[#FFC107]">
            <FiArrowLeft className="text-xl" />
            <span className="font-bold">Back to Orders</span>
          </Link>
        </div>

        <div className="bg-white backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-[#8BC34A]/20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#8BC34A] to-[#FFC107] bg-clip-text text-transparent">
                Order Details
              </h2>
              <p className="text-gray-600">
                Order ID: <span className="font-mono">#{order._id?.slice(-8)}</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className={`${status.bg} ${status.color} flex items-center gap-2 text-sm px-4 py-2 rounded-lg border`}>
                {status.icon}
                <span>{status.label}</span>
              </div>
              <div className={`${paymentMethod.class} px-4 py-2 rounded-lg border text-sm`}>
                {paymentMethod.label}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2">
              <div className="bg-gray-100/50 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-6 text-[#8BC34A] flex items-center gap-2">
                  <FiPackage /> Order Items
                </h3>
                
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[#8BC34A]/20">
                      {item.item?.imageUrl ? (
                        <img
                          src={item.item.imageUrl.startsWith('http') ? item.item.imageUrl : `${url}${item.item.imageUrl}`}
                          alt={item.item?.name || 'Product Image'}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIEVycm9yPC90ZXh0Pjwvc3ZnPg==';
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <FiPackage className="text-gray-500 text-xl" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{item.item?.name || 'Unknown Product'}</h4>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-medium text-[#FFC107]">${typeof item.item?.price === 'number' && typeof item.quantity === 'number' ? (item.item.price * item.quantity).toFixed(2) : '0.00'} CAD</p>
                        <p className="text-sm text-gray-600">${typeof item.item?.price === 'number' ? item.item.price.toFixed(2) : '0.00'} each</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-[#8BC34A]/20">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-gray-800">${typeof order.subtotal === 'number' ? order.subtotal.toFixed(2) : '0.00'} CAD</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Tax (5%):</span>
                    <span className="text-gray-800">${typeof order.tax === 'number' ? order.tax.toFixed(2) : '0.00'} CAD</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="text-gray-800">${typeof order.shipping === 'number' ? order.shipping.toFixed(2) : '0.00'} CAD</span>
                  </div>
                  {order.codFee > 0 && (
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">COD Fee:</span>
                      <span className="text-gray-800">${typeof order.codFee === 'number' ? order.codFee.toFixed(2) : '0.00'} CAD</span>
                    </div>
                  )}
                  <div className="flex justify-between mt-4 pt-4 border-t border-[#8BC34A]/30">
                    <span className="text-lg font-bold text-gray-800">Total:</span>
                    <span className="text-lg font-bold text-[#FFC107]">${typeof order.total === 'number' ? order.total.toFixed(2) : '0.00'} CAD</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Information */}
            <div className="space-y-8">
              {/* Customer Information */}
              <div className="bg-gray-100/50 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-6 text-[#8BC34A] flex items-center gap-2">
                  <FiCreditCard /> Customer Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium text-gray-800">{order.firstName} {order.lastName}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-800">{order.email}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-800">{order.phone}</p>
                  </div>
                </div>
              </div>
              
              {/* Shipping Address */}
              <div className="bg-gray-100/50 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-6 text-[#8BC34A] flex items-center gap-2">
                  <FiMapPin /> Shipping Address
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-gray-800">{order.firstName} {order.lastName}</p>
                    <p className="text-gray-600">{order.address}</p>
                    <p className="text-gray-600">{order.city}, {order.zipCode}</p>
                  </div>
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="bg-gray-100/50 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-6 text-[#8BC34A] flex items-center gap-2">
                  <FiDollarSign /> Order Summary
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-mono text-gray-800">#{order._id?.slice(-8)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="text-gray-800">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items:</span>
                    <span className="text-gray-800">{totalItems}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status:</span>
                    <span className={`${status.color} font-medium`}>{status.label}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;