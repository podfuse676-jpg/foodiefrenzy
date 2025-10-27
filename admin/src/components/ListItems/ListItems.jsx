// src/components/ListItems.jsx
import React, { useState, useEffect } from 'react';
import apiClient, { apiCallWithFallback } from '../../utils/apiClient';
import { FiTrash2, FiStar, FiHeart } from 'react-icons/fi';
import { FiEdit, FiUpload } from 'react-icons/fi';
// Removed AdminNavbar import since it's handled in App.jsx
import { styles } from '../../assets/dummyadmin';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import apiConfig from '../../utils/apiConfig';
import axios from 'axios';

const ListItems = () => {
  const url = apiConfig.baseURL;
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [imagePreview, setImagePreview] = useState(null);
  const [newImage, setNewImage] = useState(null);

  // Fetch items from API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        
        // Use our improved API client with fallback
        const { data, error } = await apiCallWithFallback(
          () => apiClient.get('/api/items'),
          [] // Fallback to empty array if API fails
        );
        
        if (error) {
          console.warn('Using fallback data due to API error:', error);
        }
        
        console.log('Raw API response:', data);
        
        // Ensure we're getting an array of items
        let itemsArray = [];
        if (Array.isArray(data)) {
          itemsArray = data;
        } else if (data && typeof data === 'object') {
          // Try to extract items from response object
          if (Array.isArray(data.items)) {
            itemsArray = data.items;
          } else {
            // If all else fails, try to convert object values to array
            itemsArray = Object.values(data).filter(item => item && typeof item === 'object');
          }
        }
        
        console.log('Total items available:', itemsArray.length);
        setItems(itemsArray);
      } catch (err) {
        console.error('Error fetching items:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  // Delete handler
  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      // Use our improved API client
      await apiClient.delete(`/api/items/${itemId}`);
      setItems(prev => prev.filter(item => item._id !== itemId));
      console.log('Deleted item ID:', itemId);
      alert('Item deleted successfully!');
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Error deleting item: ' + (err.message || 'Unknown error'));
    }
  };

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <FiStar
        key={i}
        className={`text-xl ${i < rating ? 'text-amber-400 fill-current' : 'text-amber-100/30'}`}
      />
    ));

  // Handle image upload for editing
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  if (loading) {
    return (
      <div className={styles.pageWrapper.replace(/bg-gradient-to-br.*/, '').concat(' flex items-center justify-center text-green-100')}>
        Loading menu…
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className="max-w-7xl mx-auto">
        <div className={styles.cardContainer}>
          <h2 className={styles.title}>Manage Menu Items</h2>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr>
                  <th className={styles.th}>Image</th>
                  <th className={styles.th}>Name</th>
                  <th className={styles.th}>Category</th>
                  <th className={styles.th}>Price ($ CAD)</th>
                  <th className={styles.th}>Rating</th>
                  <th className={styles.th}>Hearts</th>
                  <th className={styles.thCenter}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map(item => (
                    <tr key={item._id} className={styles.tr}>
                      <td className={styles.imgCell}>
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className={styles.img}
                        />
                      </td>
                      <td className={styles.nameCell}>
                        <div className="space-y-1">
                          <p className={styles.nameText}>{item.name}</p>
                          <p className={styles.descText}>{item.description}</p>
                        </div>
                      </td>
                      <td className={styles.categoryCell}>{item.category}</td>
                      <td className={styles.priceCell}>${item.price} CAD</td>
                      <td className={styles.ratingCell}>
                        <div className="flex gap-1">{renderStars(item.rating)}</div>
                      </td>
                      <td className={styles.heartsCell}>
                        <div className={styles.heartsWrapper}>
                          <FiHeart className="text-xl" />
                          <span>{item.hearts}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => setEditingItem(item)} className={styles.editBtn} title="Edit">
                            <FiEdit className="text-xl" />
                          </button>
                          <button onClick={() => handleDelete(item._id)} className={styles.deleteBtn}>
                            <FiTrash2 className="text-2xl" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Edit modal / inline form */}
          {editingItem && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-auto">
              <div className="bg-[#2b3a2b]/90 backdrop-blur-sm rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto border-2 border-green-900/30">
                <h3 className="text-xl text-green-200 mb-4">Edit Item: {editingItem.name}</h3>
                
                {/* Image Preview Section */}
                <div className="mb-6">
                  <label className="block text-green-100 mb-2">Current Image</label>
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    {imagePreview || editingItem.imageUrl ? (
                      <img
                        src={imagePreview || editingItem.imageUrl}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border border-green-900/30"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-green-900/20 rounded-lg border border-green-900/30 flex items-center justify-center">
                        <span className="text-green-100/50">No image</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <label className="block text-green-100 mb-2">Update Image</label>
                      <label className="flex items-center gap-2 px-4 py-2 bg-green-800/30 rounded-lg cursor-pointer w-fit border border-green-900/30 hover:border-green-600 transition-colors">
                        <FiUpload />
                        <span className="text-green-100">Choose Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-green-100/70 text-sm mt-2">Select a new image to replace the current one</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="text-green-100">Name</label>
                    <input type="text" value={editingItem.name || ''} onChange={e => setEditingItem(prev => ({ ...prev, name: e.target.value }))} className={styles.inputField} />
                  </div>
                  <div>
                    <label className="text-green-100">Category</label>
                    <input type="text" value={editingItem.category || ''} onChange={e => setEditingItem(prev => ({ ...prev, category: e.target.value }))} className={styles.inputField} />
                  </div>

                  <div>
                    <label className="text-green-100">Price</label>
                    <input type="number" step="0.01" value={editingItem.price || 0} onChange={e => setEditingItem(prev => ({ ...prev, price: Number(e.target.value) }))} className={styles.inputField} />
                  </div>
                  <div>
                    <label className="text-green-100">GST (%)</label>
                    <input type="number" step="0.01" value={editingItem.gst || 0} onChange={e => setEditingItem(prev => ({ ...prev, gst: Number(e.target.value) }))} className={styles.inputField} />
                  </div>

                  <div>
                    <label className="text-green-100">Price Type</label>
                    <input type="text" value={editingItem.priceType || ''} onChange={e => setEditingItem(prev => ({ ...prev, priceType: e.target.value }))} className={styles.inputField} />
                  </div>
                  <div>
                    <label className="text-green-100">Price Unit</label>
                    <input type="text" value={editingItem.priceUnit || ''} onChange={e => setEditingItem(prev => ({ ...prev, priceUnit: e.target.value }))} className={styles.inputField} />
                  </div>

                  <div>
                    <label className="text-green-100">Cost</label>
                    <input type="number" step="0.01" value={editingItem.cost || 0} onChange={e => setEditingItem(prev => ({ ...prev, cost: Number(e.target.value) }))} className={styles.inputField} />
                  </div>
                  <div>
                    <label className="text-green-100">Product Code</label>
                    <input type="text" value={editingItem.productCode || ''} onChange={e => setEditingItem(prev => ({ ...prev, productCode: e.target.value }))} className={styles.inputField} />
                  </div>

                  <div>
                    <label className="text-green-100">SKU</label>
                    <input type="text" value={editingItem.sku || ''} onChange={e => setEditingItem(prev => ({ ...prev, sku: e.target.value }))} className={styles.inputField} />
                  </div>
                  <div>
                    <label className="text-green-100">Modifier Groups (comma separated)</label>
                    <input type="text" value={(editingItem.modifierGroups || []).join ? (editingItem.modifierGroups.join(', ')) : (editingItem.modifierGroups || '')} onChange={e => setEditingItem(prev => ({ ...prev, modifierGroups: e.target.value }))} className={styles.inputField} />
                  </div>

                  <div>
                    <label className="text-green-100">Printer Labels (comma separated)</label>
                    <input type="text" value={(editingItem.printerLabels || []).join ? (editingItem.printerLabels.join(', ')) : (editingItem.printerLabels || '')} onChange={e => setEditingItem(prev => ({ ...prev, printerLabels: e.target.value }))} className={styles.inputField} />
                  </div>
                  <div>
                    <label className="text-green-100">Flavour Options (comma separated)</label>
                    <input type="text" value={(editingItem.flavourOptions || []).join ? (editingItem.flavourOptions.join(', ')) : (editingItem.flavourOptions || '')} onChange={e => setEditingItem(prev => ({ ...prev, flavourOptions: e.target.value }))} className={styles.inputField} />
                  </div>

                  <div>
                    <label className="text-green-100">Quantity</label>
                    <input type="number" value={editingItem.quantity || 0} onChange={e => setEditingItem(prev => ({ ...prev, quantity: Number(e.target.value) }))} className={styles.inputField} />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={!!editingItem.hidden} onChange={e => setEditingItem(prev => ({ ...prev, hidden: e.target.checked }))} className="rounded text-green-500 focus:ring-green-500" />
                      <span className="text-green-200">Hidden (do not show on frontend)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={!!editingItem.nonRevenue} onChange={e => setEditingItem(prev => ({ ...prev, nonRevenue: e.target.checked }))} className="rounded text-green-500 focus:ring-green-500" />
                      <span className="text-green-200">Non-revenue item</span>
                    </label>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-green-100">Description</label>
                    <textarea value={editingItem.description || ''} onChange={e => setEditingItem(prev => ({ ...prev, description: e.target.value }))} className={styles.inputField + ' h-28'} />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button className="px-4 py-2 rounded-lg bg-green-800/30 border border-green-900/30 hover:border-green-600 text-green-100 transition-colors" onClick={() => {
                    setEditingItem(null);
                    setImagePreview(null);
                    setNewImage(null);
                  }}>Cancel</button>
                  <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-700 text-[#1a2c1a] font-bold transition-all transform hover:scale-[1.02] shadow-lg" onClick={async () => {
                    try {
                      console.log('Updating item:', editingItem._id);
                      
                      // Prepare payload
                      let payload;
                      let config = { headers: { 'Content-Type': 'application/json' } };
                      
                      // If new image is selected, use FormData
                      if (newImage) {
                        console.log('Updating with new image');
                        payload = new FormData();
                        payload.append('image', newImage);
                        
                        // Append all other fields
                        const dataToSend = { ...editingItem };
                        if (typeof dataToSend.modifierGroups === 'string') dataToSend.modifierGroups = dataToSend.modifierGroups.split(',').map(s => s.trim()).filter(Boolean);
                        if (typeof dataToSend.printerLabels === 'string') dataToSend.printerLabels = dataToSend.printerLabels.split(',').map(s => s.trim()).filter(Boolean);
                        if (typeof dataToSend.flavourOptions === 'string') dataToSend.flavourOptions = dataToSend.flavourOptions.split(',').map(s => s.trim()).filter(Boolean);
                        
                        // Handle numeric fields
                        const numericFields = ['price', 'gst', 'cost', 'quantity', 'rating', 'hearts', 'taxRate'];
                        numericFields.forEach(field => {
                          if (dataToSend[field] !== undefined) {
                            dataToSend[field] = Number(dataToSend[field]) || 0;
                          }
                        });
                        
                        // Handle boolean fields
                        const booleanFields = ['hidden', 'nonRevenue'];
                        booleanFields.forEach(field => {
                          if (dataToSend[field] === 'true') dataToSend[field] = true;
                          if (dataToSend[field] === 'false') dataToSend[field] = false;
                        });
                        
                        Object.entries(dataToSend).forEach(([key, val]) => {
                          if (key === 'image') return; // Skip the image field as it's already appended
                          if (key === '_id') return; // Skip the _id field
                          if (Array.isArray(val)) {
                            payload.append(key, JSON.stringify(val));
                          } else {
                            payload.append(key, val === undefined || val === null ? '' : String(val));
                          }
                        });
                        
                        // Update config for multipart form data
                        config = { headers: { 'Content-Type': 'multipart/form-data' } };
                        console.log('FormData prepared with fields:', [...payload.entries()]);
                      } else {
                        // No image update, send as JSON
                        console.log('Updating without new image');
                        payload = { ...editingItem };
                        
                        // Handle array fields
                        if (typeof payload.modifierGroups === 'string') payload.modifierGroups = payload.modifierGroups.split(',').map(s => s.trim()).filter(Boolean);
                        if (typeof payload.printerLabels === 'string') payload.printerLabels = payload.printerLabels.split(',').map(s => s.trim()).filter(Boolean);
                        if (typeof payload.flavourOptions === 'string') payload.flavourOptions = payload.flavourOptions.split(',').map(s => s.trim()).filter(Boolean);
                        
                        // Handle numeric fields
                        const numericFields = ['price', 'gst', 'cost', 'quantity', 'rating', 'hearts', 'taxRate'];
                        numericFields.forEach(field => {
                          if (payload[field] !== undefined) {
                            payload[field] = Number(payload[field]) || 0;
                          }
                        });
                        
                        // Handle boolean fields
                        const booleanFields = ['hidden', 'nonRevenue'];
                        booleanFields.forEach(field => {
                          if (payload[field] === 'true') payload[field] = true;
                          if (payload[field] === 'false') payload[field] = false;
                        });
                        
                        console.log('JSON payload prepared:', payload);
                      }

                      // Send update
                      console.log('Sending PUT request to:', `${url}/api/items/${editingItem._id}`);
                      const res = await axios.put(`${url}/api/items/${editingItem._id}`, payload, config);
                      console.log('Update response:', res.data);
                      
                      // Update local list
                      setItems(prev => prev.map(it => it._id === res.data._id ? res.data : it));
                      setEditingItem(null);
                      setImagePreview(null);
                      setNewImage(null);
                      alert('Item updated successfully!');
                    } catch (err) {
                      console.error('Update error', err);
                      console.error('Error response:', err.response);
                      let errorMessage = 'Failed to update item. ';
                      
                      if (err.response) {
                        errorMessage += err.response.data?.message || `Server error: ${err.response.status}`;
                        console.error('Server error details:', err.response.data);
                      } else if (err.request) {
                        errorMessage += 'No response from server. Please check your connection.';
                        console.error('No response from server:', err.request);
                      } else {
                        errorMessage += err.message || 'Unknown error occurred';
                        console.error('Unknown error:', err.message);
                      }
                      
                      alert(errorMessage);
                    }
                  }}>Save</button>
                </div>
              </div>
            </div>
          )}

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4 text-green-100">
            <div>
              Showing {Math.min(items.length, currentPage * itemsPerPage)} of {items.length} items
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-800'}`}
              >
                <FiChevronLeft />
              </button>
              <span className="flex items-center px-2">Page {currentPage}</span>
              <button 
                onClick={() => setCurrentPage(prev => (prev * itemsPerPage < items.length ? prev + 1 : prev))}
                disabled={currentPage * itemsPerPage >= items.length}
                className={`p-2 rounded-lg ${currentPage * itemsPerPage >= items.length ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-800'}`}
              >
                <FiChevronRight />
              </button>
            </div>
          </div>

          {items.length === 0 && (
            <div className={styles.emptyState}>
              No items found in the menu
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListItems;