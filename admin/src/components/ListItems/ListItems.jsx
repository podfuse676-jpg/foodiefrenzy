// src/components/ListItems.jsx
import React, { useState, useEffect } from 'react';
import apiClient, { apiCallWithFallback } from '../../utils/apiClient';
import { FiTrash2, FiStar, FiHeart, FiX } from 'react-icons/fi';
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
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  // Fetch items from API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        
        // Remove fallback data to ensure we always show real backend data
        const response = await apiClient.get('/api/items');
        const data = response.data;
        
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
        alert('Error fetching items: ' + (err.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [lastRefresh]);

  // Refresh items function
  const refreshItems = () => {
    setLastRefresh(Date.now());
  };

  // Delete handler
  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      // Use our improved API client
      await apiClient.delete(`/api/items/${itemId}`);
      setItems(prev => prev.filter(item => item._id !== itemId));
      console.log('Deleted item ID:', itemId);
      alert('Item deleted successfully!');
      
      // Refresh the item list to ensure consistency
      refreshItems();
    } catch (err) {
      console.error('Error deleting item:', err);
      
      // Provide more detailed error message
      let errorMessage = 'Error deleting item: ' + (err.message || 'Unknown error');
      
      // Show more detailed error in development
      if (process.env.NODE_ENV === 'development') {
        errorMessage += '\n\nTechnical details:\n' + JSON.stringify(err, null, 2);
      }
      
      alert(errorMessage);
    }
  };

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <FiStar
        key={i}
        className={`text-xl ${i < rating ? 'text-[#FFC107] fill-current' : 'text-gray-300'}`}
      />
    ));

  // Handle image upload for editing
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Selected file:', file);
      console.log('File type:', file.type);
      console.log('File name:', file.name);
      
      // Check if the file is actually an image
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (JPEG, PNG, WEBP, GIF)');
        e.target.value = ''; // Clear the input
        return;
      }
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit. Please select a smaller image.');
        e.target.value = ''; // Clear the input
        return;
      }
      
      setNewImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] flex items-center justify-center text-gray-800">
        Loading menu…
      </div>
    );
  }

  // Edit Item Modal Component
  const EditItemModal = () => {
    if (!editingItem) return null;

    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-auto">
        <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-[#8BC34A]/30 shadow-2xl relative">
          {/* Modal Header with gradient */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#8BC34A]/10">
            <h3 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-[#8BC34A] to-[#FFC107] bg-clip-text text-transparent">Edit Item: {editingItem.name}</h3>
            <button 
              onClick={() => {
                setEditingItem(null);
                setImagePreview(null);
                setNewImage(null);
              }}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FiX className="text-2xl" />
            </button>
          </div>
          
          {/* Image Preview Section */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Current Image</label>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {imagePreview || editingItem.imageUrl ? (
                <img
                  src={imagePreview || (editingItem.imageUrl ? (editingItem.imageUrl.startsWith('http') ? editingItem.imageUrl : `${url}${editingItem.imageUrl}`) : '')}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-xl border border-[#8BC34A]/30 shadow-sm"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIEVycm9yPC90ZXh0Pjwvc3ZnPg==';
                  }}
                />
              ) : (
                <div className="w-32 h-32 bg-gradient-to-br from-[#F9FFF6] to-[#FFFFFF] rounded-xl border border-[#8BC34A]/30 flex items-center justify-center shadow-sm">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
              <div className="flex-1">
                <label className="block text-gray-700 mb-2">Update Image</label>
                <label className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-[#F9FFF6] to-[#FFFFFF] rounded-xl cursor-pointer w-fit border border-[#8BC34A]/30 hover:border-[#FFC107] transition-colors shadow-sm">
                  <FiUpload />
                  <span className="text-gray-700">Choose Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-gray-600 text-sm mt-2">Select a new image to replace the current one</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2 text-sm text-gray-700">Name</label>
              <input 
                type="text" 
                value={editingItem.name || ''} 
                onChange={e => setEditingItem(prev => ({ ...prev, name: e.target.value }))} 
                className="w-full bg-white border-2 border-[#8BC34A]/20 rounded-xl py-3 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 transition-colors" 
              />
            </div>
            <div>
              <label className="block mb-2 text-sm text-gray-700">Category</label>
              <input 
                type="text" 
                value={editingItem.category || ''} 
                onChange={e => setEditingItem(prev => ({ ...prev, category: e.target.value }))} 
                className="w-full bg-white border-2 border-[#8BC34A]/20 rounded-xl py-3 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 transition-colors" 
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-700">Price</label>
              <input 
                type="number" 
                step="0.01" 
                value={editingItem.price || 0} 
                onChange={e => setEditingItem(prev => ({ ...prev, price: Number(e.target.value) }))} 
                className="w-full bg-white border-2 border-[#8BC34A]/20 rounded-xl py-3 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 transition-colors" 
              />
            </div>
            <div>
              <label className="block mb-2 text-sm text-gray-700">GST (%)</label>
              <input 
                type="number" 
                step="0.01" 
                value={editingItem.gst || 0} 
                onChange={e => setEditingItem(prev => ({ ...prev, gst: Number(e.target.value) }))} 
                className="w-full bg-white border-2 border-[#8BC34A]/20 rounded-xl py-3 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 transition-colors" 
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-700">Price Type</label>
              <input 
                type="text" 
                value={editingItem.priceType || ''} 
                onChange={e => setEditingItem(prev => ({ ...prev, priceType: e.target.value }))} 
                className="w-full bg-white border-2 border-[#8BC34A]/20 rounded-xl py-3 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 transition-colors" 
              />
            </div>
            <div>
              <label className="block mb-2 text-sm text-gray-700">Price Unit</label>
              <input 
                type="text" 
                value={editingItem.priceUnit || ''} 
                onChange={e => setEditingItem(prev => ({ ...prev, priceUnit: e.target.value }))} 
                className="w-full bg-white border-2 border-[#8BC34A]/20 rounded-xl py-3 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 transition-colors" 
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-700">Cost</label>
              <input 
                type="number" 
                step="0.01" 
                value={editingItem.cost || 0} 
                onChange={e => setEditingItem(prev => ({ ...prev, cost: Number(e.target.value) }))} 
                className="w-full bg-white border-2 border-[#8BC34A]/20 rounded-xl py-3 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 transition-colors" 
              />
            </div>
            <div>
              <label className="block mb-2 text-sm text-gray-700">Product Code</label>
              <input 
                type="text" 
                value={editingItem.productCode || ''} 
                onChange={e => setEditingItem(prev => ({ ...prev, productCode: e.target.value }))} 
                className="w-full bg-white border-2 border-[#8BC34A]/20 rounded-xl py-3 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 transition-colors" 
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-700">SKU</label>
              <input 
                type="text" 
                value={editingItem.sku || ''} 
                onChange={e => setEditingItem(prev => ({ ...prev, sku: e.target.value }))} 
                className="w-full bg-white border-2 border-[#8BC34A]/20 rounded-xl py-3 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 transition-colors" 
              />
            </div>
            <div>
              <label className="block mb-2 text-sm text-gray-700">Modifier Groups (comma separated)</label>
              <input 
                type="text" 
                value={Array.isArray(editingItem.modifierGroups) ? editingItem.modifierGroups.join(', ') : (editingItem.modifierGroups || '')} 
                onChange={e => setEditingItem(prev => ({ ...prev, modifierGroups: e.target.value }))} 
                className="w-full bg-white border-2 border-[#8BC34A]/20 rounded-xl py-3 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 transition-colors" 
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-700">Printer Labels (comma separated)</label>
              <input 
                type="text" 
                value={Array.isArray(editingItem.printerLabels) ? editingItem.printerLabels.join(', ') : (editingItem.printerLabels || '')} 
                onChange={e => setEditingItem(prev => ({ ...prev, printerLabels: e.target.value }))} 
                className="w-full bg-white border-2 border-[#8BC34A]/20 rounded-xl py-3 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 transition-colors" 
              />
            </div>
            <div>
              <label className="block mb-2 text-sm text-gray-700">Flavour Options (comma separated)</label>
              <input 
                type="text" 
                value={Array.isArray(editingItem.flavourOptions) ? editingItem.flavourOptions.join(', ') : (editingItem.flavourOptions || '')} 
                onChange={e => setEditingItem(prev => ({ ...prev, flavourOptions: e.target.value }))} 
                className="w-full bg-white border-2 border-[#8BC34A]/20 rounded-xl py-3 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 transition-colors" 
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-700">Quantity</label>
              <input 
                type="number" 
                value={editingItem.quantity || 0} 
                onChange={e => setEditingItem(prev => ({ ...prev, quantity: Number(e.target.value) }))} 
                className="w-full bg-white border-2 border-[#8BC34A]/20 rounded-xl py-3 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 transition-colors" 
              />
            </div>
            <div className="flex items-center gap-4 sm:col-span-2">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={!!editingItem.hidden} 
                  onChange={e => setEditingItem(prev => ({ ...prev, hidden: e.target.checked }))} 
                  className="rounded text-[#8BC34A] focus:ring-[#8BC34A]" 
                />
                <span className="text-gray-700">Hidden (do not show on frontend)</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={!!editingItem.nonRevenue} 
                  onChange={e => setEditingItem(prev => ({ ...prev, nonRevenue: e.target.checked }))} 
                  className="rounded text-[#8BC34A] focus:ring-[#8BC34A]" 
                />
                <span className="text-gray-700">Non-revenue item</span>
              </label>
            </div>

            <div className="sm:col-span-2">
              <label className="block mb-2 text-sm text-gray-700">Description</label>
              <textarea 
                value={editingItem.description || ''} 
                onChange={e => setEditingItem(prev => ({ ...prev, description: e.target.value }))} 
                className="w-full bg-white border-2 border-[#8BC34A]/20 rounded-xl py-3 px-4 h-28 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 transition-colors" 
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button 
              className="px-4 py-2 rounded-xl bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200 transition-colors" 
              onClick={() => {
                setEditingItem(null);
                setImagePreview(null);
                setNewImage(null);
              }}
            >
              Cancel
            </button>
            <button 
              className="px-6 py-3 bg-gradient-to-r from-[#8BC34A] to-[#FFC107] rounded-xl font-semibold text-white hover:from-[#FFC107] hover:to-[#8BC34A] transition-all duration-300 shadow-lg hover:shadow-[#FFC107]/20" 
              onClick={async () => {
                try {
                  console.log('Updating item:', editingItem._id);
                  
                  // Prepare payload
                  let payload;
                  let config = { headers: { 'Content-Type': 'application/json' } };
                  
                  // If new image is selected, use FormData
                  if (newImage) {
                    console.log('Updating with new image');
                    console.log('New image file:', newImage);
                    console.log('New image type:', newImage.type);
                    console.log('New image name:', newImage.name);
                    console.log('New image size:', newImage.size);
                    
                    payload = new FormData();
                    payload.append('image', newImage);
                    
                    // Debug FormData
                    console.log('FormData created');
                    for (let [key, value] of payload.entries()) {
                      if (key === 'image') {
                        console.log('FormData image entry:', key, value.name, value.type, value.size);
                      } else {
                        console.log('FormData entry:', key, value);
                      }
                    }
                    
                    // Append all other fields
                    const dataToSend = { ...editingItem };
                    
                    // Remove _id field as it shouldn't be updated
                    delete dataToSend._id;
                    
                    // IMPORTANT: Remove imageUrl from payload to prevent conflicts
                    // The backend will handle the new image URL from the uploaded file
                    delete dataToSend.imageUrl;
                    
                    // Handle array fields properly
                    if (typeof dataToSend.modifierGroups === 'string') {
                      dataToSend.modifierGroups = dataToSend.modifierGroups.split(',').map(s => s.trim()).filter(Boolean);
                    } else if (Array.isArray(dataToSend.modifierGroups)) {
                      // Already an array, keep as is
                    } else {
                      dataToSend.modifierGroups = [];
                    }
                    
                    if (typeof dataToSend.printerLabels === 'string') {
                      dataToSend.printerLabels = dataToSend.printerLabels.split(',').map(s => s.trim()).filter(Boolean);
                    } else if (Array.isArray(dataToSend.printerLabels)) {
                      // Already an array, keep as is
                    } else {
                      dataToSend.printerLabels = [];
                    }
                    
                    if (typeof dataToSend.flavourOptions === 'string') {
                      dataToSend.flavourOptions = dataToSend.flavourOptions.split(',').map(s => s.trim()).filter(Boolean);
                    } else if (Array.isArray(dataToSend.flavourOptions)) {
                      // Already an array, keep as is
                    } else {
                      dataToSend.flavourOptions = [];
                    }
                    
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
                    
                    // IMPORTANT: Remove imageUrl from payload when not updating image
                    // to prevent overwriting with potentially incorrect URLs
                    delete payload.imageUrl;
                    
                    // Handle array fields properly
                    if (typeof payload.modifierGroups === 'string') {
                      payload.modifierGroups = payload.modifierGroups.split(',').map(s => s.trim()).filter(Boolean);
                    } else if (Array.isArray(payload.modifierGroups)) {
                      // Already an array, keep as is
                    } else {
                      payload.modifierGroups = [];
                    }
                                      
                    if (typeof payload.printerLabels === 'string') {
                      payload.printerLabels = payload.printerLabels.split(',').map(s => s.trim()).filter(Boolean);
                    } else if (Array.isArray(payload.printerLabels)) {
                      // Already an array, keep as is
                    } else {
                      payload.printerLabels = [];
                    }
                                      
                    if (typeof payload.flavourOptions === 'string') {
                      payload.flavourOptions = payload.flavourOptions.split(',').map(s => s.trim()).filter(Boolean);
                    } else if (Array.isArray(payload.flavourOptions)) {
                      // Already an array, keep as is
                    } else {
                      payload.flavourOptions = [];
                    }
                    
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
                  console.log('=== DEBUG ITEM UPDATE ===');
                  console.log('Editing item:', editingItem);
                  console.log('Item ID:', editingItem._id);
                  console.log('Item ID type:', typeof editingItem._id);
                  console.log('Item ID length:', editingItem._id.length);
                  console.log('Item ID char codes:', [...editingItem._id].map(c => c.charCodeAt(0)));
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
                  console.error('=== UPDATE ERROR ===');
                  console.error('Update error', err);
                  console.error('Error response:', err.response);
                  console.error('Error request:', err.request);
                  console.error('Error config:', err.config);
                  
                  let errorMessage = 'Failed to update item. ';
                  
                  if (err.response) {
                    // Server responded with error
                    errorMessage += err.response.data?.message || `Server error: ${err.response.status}`;
                    console.error('Server error details:', err.response.data);
                  } else if (err.request) {
                    // Request made but no response received
                    errorMessage += 'No response from server. Please check your connection.';
                    console.error('No response from server:', err.request);
                  } else {
                    // Error in request setup
                    errorMessage += err.message || 'Unknown error occurred';
                    console.error('Unknown error:', err.message);
                  }
                  
                  // Show detailed error in development
                  if (process.env.NODE_ENV === 'development') {
                    errorMessage += '\n\nDetails: ' + JSON.stringify(err.response?.data || err.message || 'Unknown error', null, 2);
                  }
                  
                  // Refresh items after error to ensure consistency
                  refreshItems();
                  
                  alert(errorMessage);
                }
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-[#8BC34A]/20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-center text-gray-800">Manage Menu Items</h2>
            <button 
              onClick={refreshItems}
              className="px-4 py-2 bg-[#8BC34A] text-white rounded-lg hover:bg-[#7cb342] transition-colors"
            >
              Refresh Items
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F9FFF6]">
                <tr>
                  <th className="p-4 text-left text-gray-700">Image</th>
                  <th className="p-4 text-left text-gray-700">Name</th>
                  <th className="p-4 text-left text-gray-700">Category</th>
                  <th className="p-4 text-left text-gray-700">Price ($ CAD)</th>
                  <th className="p-4 text-left text-gray-700">Rating</th>
                  <th className="p-4 text-left text-gray-700">Hearts</th>
                  <th className="p-4 text-center text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map(item => (
                    <tr key={item._id} className="border-b border-[#8BC34A]/10 hover:bg-[#F9FFF6]/50 transition-colors">
                      <td className="p-4">
                        <img
                          src={item.imageUrl ? (item.imageUrl.startsWith('http') ? item.imageUrl : `${url}${item.imageUrl}`) : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iMzAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='}
                          alt={item.name}
                          className="w-12 h-12 object-contain rounded-lg"
                          onError={(e) => {
                            // Handle broken image links
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iMzAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBFcnJvcjwvdGV4dD48L3N2Zz4=';
                          }}
                        />
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <p className="text-gray-800 font-medium text-lg">{item.name}</p>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                      </td>
                      <td className="p-4 text-gray-700/80">{item.category}</td>
                      <td className="p-4 text-[#8BC34A] font-medium">${item.price} CAD</td>
                      <td className="p-4">
                        <div className="flex gap-1">{renderStars(item.rating)}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-[#8BC34A]">
                          <FiHeart className="text-xl" />
                          <span>{item.hearts}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => setEditingItem(item)} className="text-[#8BC34A] hover:text-[#FFC107] transition-colors p-2 rounded-lg hover:bg-[#8BC34A]/10" title="Edit">
                            <FiEdit className="text-xl" />
                          </button>
                          <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-500/10">
                            <FiTrash2 className="text-2xl" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4 text-gray-700">
            <div>
              Showing {Math.min(items.length, currentPage * itemsPerPage)} of {items.length} items
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#8BC34A]/10'}`}
              >
                <FiChevronLeft />
              </button>
              <span className="flex items-center px-2">Page {currentPage}</span>
              <button 
                onClick={() => setCurrentPage(prev => (prev * itemsPerPage < items.length ? prev + 1 : prev))}
                disabled={currentPage * itemsPerPage >= items.length}
                className={`p-2 rounded-lg ${currentPage * itemsPerPage >= items.length ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#8BC34A]/10'}`}
              >
                <FiChevronRight />
              </button>
            </div>
          </div>

          {items.length === 0 && (
            <div className="text-center py-12 text-gray-600 text-xl">
              No items found in the menu
            </div>
          )}
        </div>
      </div>
      
      {/* Edit Item Modal */}
      {editingItem && <EditItemModal />}
    </div>
  );
};

export default ListItems;