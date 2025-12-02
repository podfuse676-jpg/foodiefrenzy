import React, { useState, useEffect } from 'react';
import { FiUser, FiBox } from 'react-icons/fi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// Removed AdminNavbar import since it's handled in App.jsx
import { statusStyles, paymentMethodDetails, tableClasses, layoutClasses,iconMap } from '../../assets/dummyadmin';
import apiConfig from '../../utils/apiConfig';

const Orders = () => {
  const url = apiConfig.baseURL;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        
        // Debugging logs
        console.log('Fetching orders with token:', token ? 'Present' : 'Missing');
        console.log('API URL:', url);
        console.log('Full endpoint:', `${url}/api/users/admin/orders`);
        
        // Check if token exists
        if (!token) {
          setError('Authentication required. Please log in again.');
          setLoading(false);
          return;
        }
        
        // Use the correct admin endpoint for fetching all orders
        const response = await axios.get(
          `${url}/api/users/admin/orders`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        console.log('Orders response:', response.data);

        // Add debugging for data structure
        console.log('Raw orders data:', response.data.orders);
        
        // Format the response data correctly - the admin route returns { success: true, orders: [...] }
        const formatted = response.data.orders.map((order, index) => {
          console.log(`Processing order ${index}:`, order);
          
          const processedOrder = {
            ...order,
            address: order.address ?? order.shippingAddress?.address ?? '',
            city: order.city ?? order.shippingAddress?.city ?? '',
            zipCode: order.zipCode ?? order.shippingAddress?.zipCode ?? '',
            phone: order.phone ?? order.user?.phoneNumber ?? '',
            items: order.items?.map(e => {
              // More robust item handling
              console.log('Processing item:', e);
              const itemObj = e.item || e;
              return {
                _id: e._id || itemObj._id,
                item: itemObj,
                quantity: e.quantity || itemObj.quantity || 0
              };
            }) || [],
            createdAt: order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
              year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
            }) : 'Unknown Date',
          };
          
          console.log(`Processed order ${index}:`, processedOrder);
          return processedOrder;
        });

        console.log('Formatted orders:', formatted);
        setOrders(formatted);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        console.error('Error response:', err.response);
        // Check if it's an authentication error
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError('Authentication required. Please log in again.');
        } else {
          setError(err.response?.data?.message || 'Failed to load orders.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      console.log('Updating order status with token:', token ? 'Present' : 'Missing');
      console.log('Update URL:', `${url}/api/users/admin/orders/${orderId}`);
      console.log('Update data:', { status: newStatus });
      
      const response = await axios.put(
        `${url}/api/users/admin/orders/${orderId}`, 
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      console.log('Update response:', response.data);
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error('Error updating order status:', err);
      console.error('Error response:', err.response);
      alert(err.response?.data?.message || 'Failed to update order status');
    }
  };

  if (loading) return (
    <div className={layoutClasses.page + ' flex items-center justify-center'}>
      <div className="text-green-400 text-xl">Loading orders...</div>
    </div>
  );

  if (error) return (
    <div className={layoutClasses.page + ' flex items-center justify-center'}>
      <div className="text-red-400 text-xl">{error}</div>
    </div>
  );

  return (
    <div className={layoutClasses.page}>
      <div className="max-w-7xl mx-auto">
        <div className={layoutClasses.card}>
          <h2 className={layoutClasses.heading}>Order Management</h2>
          <div className="mb-4 text-sm text-green-100/60">
            Click on any order row to view details
          </div>
          <div className={tableClasses.wrapper}>
            <table className={tableClasses.table}>
              <thead className={tableClasses.headerRow}>
                <tr>
                  {['Order ID', 'Customer', 'Address', 'Items', 'Total Items', 'Price', 'Payment', 'Status'].map(h => (
                    <th key={h} className={tableClasses.headerCell + (h === 'Total Items' ? ' text-center' : '')}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {console.log('Rendering orders:', orders)}
                {orders.map(order => {
                  console.log('Rendering order:', order);
                  const totalItems = order.items.reduce((s, i) => {
                    const result = s + (i.quantity || 0);
                    console.log('Calculating total items:', s, i.quantity, 'result:', result);
                    return result;
                  }, 0);
                  const totalPrice = order.total ?? order.items.reduce((s, i) => {
                    const price = (i.item?.price || i.price || 0);
                    const quantity = (i.quantity || 0);
                    const itemTotal = price * quantity;
                    const result = s + itemTotal;
                    console.log('Calculating total price:', s, price, quantity, 'item total:', itemTotal, 'result:', result);
                    return result;
                  }, 0);
                  const payMethod = paymentMethodDetails[order.paymentMethod?.toLowerCase()] || paymentMethodDetails.default;
                  const payStatusStyle = statusStyles[order.paymentStatus] || statusStyles.processing;
                  const stat = statusStyles[order.status] || statusStyles.processing;
                  
                  console.log('Order status styling:', { 
                    status: order.status, 
                    paymentStatus: order.paymentStatus,
                    stat,
                    payStatusStyle
                  });

                  return (
                    <tr 
                      key={order._id} 
                      className={tableClasses.row + ' cursor-pointer hover:bg-green-900/20 transition-colors'}
                      onClick={() => navigate(`/orders/${order._id}`)}
                    >
                      <td className={tableClasses.cellBase + ' font-mono text-sm text-green-100 hover:text-green-300'}>#{order._id.slice(-8)}</td>
                      <td className={tableClasses.cellBase}>
                        <div className="flex items-center gap-2">
                          <FiUser className="text-green-400" />
                          <div>
                            <p className="text-green-100">{order.user?.username || `${order.firstName} ${order.lastName}` || 'Unknown Customer'}</p>
                            <p className="text-sm text-green-400/60">{order.user?.phoneNumber || order.phone || 'No phone'}</p>
                            <p className="text-sm text-green-400/60">{order.user?.email || order.email || 'No email'}</p>
                          </div>
                        </div>
                      </td>
                      <td className={tableClasses.cellBase}>
                        <div className="text-green-100/80 text-sm max-w-[200px]">{order.address}, {order.city} - {order.zipCode}</div>
                      </td>
                      <td className={tableClasses.cellBase}>
                        <div className="space-y-1 max-h-52 overflow-auto">
                          {order.items.map((itm, idx) => {
                            // Optimize image URL construction
                            const imageUrl = itm.item?.image || itm.image;
                            let fullImageUrl = null;
                            
                            // More robust URL construction
                            if (imageUrl) {
                              if (imageUrl.startsWith('http')) {
                                fullImageUrl = imageUrl;
                              } else if (imageUrl.startsWith('/')) {
                                // Handle absolute paths - remove leading slash to avoid double slashes
                                fullImageUrl = `${url}${imageUrl}`;
                              } else {
                                // Handle relative paths
                                fullImageUrl = `${url}/${imageUrl}`;
                              }
                            }
                            
                            // Fallback SVG as data URI
                            const fallbackSvg = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBFcnJvcjwvdGV4dD48L3N2Zz4=';
                            
                            // Debug: Log image URLs
                            console.log('Image processing:', { imageUrl, fullImageUrl, fallbackSvg });
                            
                            return (
                              <div key={idx} className="flex items-center gap-3 p-2 rounded-lg">
                                <img 
                                  src={fullImageUrl || fallbackSvg}
                                  alt={itm.item?.name || itm.name || 'Item Image'} 
                                  className="w-10 h-10 object-cover rounded-lg"
                                  loading="lazy"
                                  onError={(e) => {
                                    console.log('Image error:', e.target.src);
                                    if (e.target.src !== fallbackSvg) {
                                      e.target.src = fallbackSvg;
                                    }
                                  }}
                                />
                                <div className="flex-1">
                                  <span className="text-green-100/80 text-sm block truncate">{itm.item?.name || itm.name || 'Unknown Item'}</span>
                                  <div className="flex items-center gap-2 text-xs text-green-400/60">
                                    <span>${(itm.item?.price || itm.price || 0).toFixed(2)} CAD</span>
                                    <span>•</span>
                                    <span>x{itm.quantity || 0}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                      <td className={tableClasses.cellBase + ' text-center'}>
                        <div className="flex items-center justify-center gap-1">
                          <FiBox className="text-green-400" /><span className="text-green-300 text-lg">{totalItems}</span>
                        </div>
                      </td>
                      <td className={tableClasses.cellBase + ' text-green-300 text-lg'}>${(order.total || totalPrice).toFixed(2)} CAD</td>
                      <td className={tableClasses.cellBase}>
                        <div className="flex flex-col gap-2">
                          <div className={`${payMethod.class} px-3 py-1.5 rounded-lg border text-sm`}>{payMethod.label}</div>
                          <div className={`${payStatusStyle.color} flex items-center gap-2 text-sm`}>{iconMap[payStatusStyle.icon]}<span>{payStatusStyle.label}</span></div>
                        </div>
                      </td>
                      <td className={tableClasses.cellBase}>
                        <div className="flex items-center gap-2">
                          <span className={`${stat.color} text-xl`}>{iconMap[stat.icon]}</span>
                          <select value={order.status} onChange={e => handleStatusChange(order._id, e.target.value)} className={`px-4 py-2 rounded-lg ${stat.bg} ${stat.color} border border-green-500/20 text-sm cursor-pointer`}>
                            {Object.entries(statusStyles).filter(([k]) => k !== 'succeeded').map(([key, sty]) => (
                              <option key={key} value={key} className={`${sty.bg} ${sty.color}`}>{sty.label}</option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {orders.length === 0 && <div className="text-center py-12 text-green-100/60 text-xl">No orders found</div>}
        </div>
      </div>
    </div>
  );
};

export default Orders;