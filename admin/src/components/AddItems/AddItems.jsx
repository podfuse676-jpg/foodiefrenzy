// src/components/AddItems.jsx
import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { FiUpload, FiHeart, FiStar, FiX } from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';
// Removed AdminNavbar import since it's handled in App.jsx
import { styles } from '../../assets/dummyadmin';
import apiConfig from '../../utils/apiConfig';

const AddItems = () => {
  const url = apiConfig.baseURL;
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    priceType: '',
    priceUnit: '',
    taxRate: '',
    cost: '',
    productCode: '',
    sku: '',
    modifierGroups: '',
    quantity: 0,
    printerLabels: '',
    hidden: false,
    nonRevenue: false,
    gst: '',
    flavourOptions: '',
    rating: 0,
    hearts: 0,
    total: 0,
    image: null,
    preview: ''
  });
  const [categories] = useState([
    'Breakfast', 'Lunch', 'Dinner', 'Mexican', 'Italian', 'Desserts', 'Drinks'
  ]);
  const [hoverRating, setHoverRating] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [onItemAdded, setOnItemAdded] = useState(null);

  // Use useCallback to prevent unnecessary re-renders
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    // Handle checkbox inputs differently
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }, []);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
        preview: URL.createObjectURL(file)
      }));
    }
  }, []);

  const handleRating = useCallback((rating) => {
    setFormData(prev => ({ ...prev, rating }));
  }, []);

  const handleHearts = useCallback(() => {
    setFormData(prev => ({ ...prev, hearts: prev.hearts + 1 }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.image) {
      alert('Please select an image for the item');
      return;
    }
    
    // Validate required fields
    if (!formData.name.trim()) {
      alert('Please enter an item name');
      return;
    }
    
    if (!formData.category) {
      alert('Please select a category');
      return;
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert('Please enter a valid price');
      return;
    }
    
    try {
      // Create FormData object for file upload
      const payload = new FormData();
      
      // Log what's being added to payload for debugging
      console.log('Form data being submitted:', {
        ...formData,
        image: formData.image ? formData.image.name : 'No image'
      });
      
      // Prepare fields that need special serialization
      const dataToSend = { ...formData };
      // Convert comma-separated strings to arrays
      if (dataToSend.modifierGroups && typeof dataToSend.modifierGroups === 'string') {
        dataToSend.modifierGroups = dataToSend.modifierGroups.split(',').map(s => s.trim()).filter(Boolean);
      }
      if (dataToSend.printerLabels && typeof dataToSend.printerLabels === 'string') {
        dataToSend.printerLabels = dataToSend.printerLabels.split(',').map(s => s.trim()).filter(Boolean);
      }
      if (dataToSend.flavourOptions && typeof dataToSend.flavourOptions === 'string') {
        dataToSend.flavourOptions = dataToSend.flavourOptions.split(',').map(s => s.trim()).filter(Boolean);
      }

      // Append file first
      if (formData.image) payload.append('image', formData.image);

      // Append other fields; arrays should be sent as JSON strings
      Object.entries(dataToSend).forEach(([key, val]) => {
        if (key === 'preview' || key === 'image') return;
        if (Array.isArray(val)) {
          payload.append(key, JSON.stringify(val));
        } else {
          payload.append(key, val === undefined || val === null ? '' : String(val));
        }
      });
      
      // Make the API request with proper configuration
      const res = await axios.post(
        `${url}/api/items`,
        payload,
        { 
          headers: { 
            'Content-Type': 'multipart/form-data'
          },
          // Add timeout to prevent hanging requests
          timeout: 30000
        }
      );
      
      console.log('Created Item:', res.data);
      alert('Item added successfully!');
      
      // Reset form after successful submission
      setFormData({
        name: '', description: '', category: '',
        price: '', rating: 0, hearts: 0,
        total: 0, image: null, preview: '',
        priceType: '', priceUnit: '', taxRate: '', cost: '',
        productCode: '', sku: '', modifierGroups: '',
        quantity: 0, printerLabels: '', hidden: false,
        nonRevenue: false, gst: '', flavourOptions: ''
      });
      
      // Close modal
      setShowModal(false);
      
      // Clear any file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
      // Notify parent component that an item was added
      if (onItemAdded) onItemAdded(res.data);
      
    } catch (err) {
      console.error('Error details:', err);
      
      // Provide more helpful error messages
      let errorMessage = 'Failed to add item. ';
      
      if (err.response) {
        // Server responded with error
        errorMessage += err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        // Request made but no response received
        errorMessage += 'No response from server. Please check your connection.';
      } else {
        // Error in request setup
        errorMessage += err.message || 'Unknown error occurred';
      }
      
      // Show more detailed error in development
      if (process.env.NODE_ENV === 'development') {
        errorMessage += '\n\nTechnical details:\n' + JSON.stringify(err, null, 2);
      }
      
      alert(errorMessage);
    }
  };

  // Modal form component
  const AddItemModal = () => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-[#8BC34A]/30 shadow-2xl relative">
        {/* Modal Header with gradient */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#8BC34A]/10">
          <h3 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-[#8BC34A] to-[#FFC107] bg-clip-text text-transparent">Add New Menu Item</h3>
          <button 
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            type="button"
          >
            <FiX className="text-2xl" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Section */}
          <div className="flex flex-col items-center">
            <label className="w-full max-w-xs h-48 bg-gradient-to-br from-[#F9FFF6] to-[#FFFFFF] border-2 border-dashed border-[#8BC34A]/30 rounded-2xl cursor-pointer flex flex-col items-center justify-center overflow-hidden hover:border-[#FFC107]/50 transition-all shadow-inner">
              {formData.preview ? (
                <img
                  src={formData.preview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <div className="text-center p-4">
                  <FiUpload className="text-3xl text-[#8BC34A] mx-auto mb-2" />
                  <p className="text-gray-600">
                    Click to upload product image
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                required
              />
            </label>
          </div>

          <div className="space-y-6">
            {/* Section 1: Convenience Store fields */}
            <div className="p-4 bg-gradient-to-br from-[#F9FFF6] to-[#FFFFFF] rounded-xl border border-[#8BC34A]/20 shadow-sm">
              <h3 className="text-lg text-gray-800 mb-3 font-medium">Convenience Store / Item</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm text-gray-700">Price Type</label>
                  <input 
                    name="priceType" 
                    value={formData.priceType} 
                    onChange={handleInputChange} 
                    className="w-full bg-white border-2 border-[#8BC34A]/20 rounded-xl py-3 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 transition-colors" 
                    placeholder="e.g. fixed / variable" 
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-700">Price Unit</label>
                  <input 
                    name="priceUnit" 
                    value={formData.priceUnit} 
                    onChange={handleInputChange} 
                    className="w-full bg-white border-2 border-[#8BC34A]/20 rounded-xl py-3 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 transition-colors" 
                    placeholder="e.g. per item / per kg" 
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-700">GST (%)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    name="gst" 
                    value={formData.gst} 
                    onChange={handleInputChange} 
                    className="w-full bg-white border-2 border-[#8BC34A]/20 rounded-xl py-3 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 transition-colors" 
                    placeholder="0.00" 
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-700">Cost</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    name="cost" 
                    value={formData.cost} 
                    onChange={handleInputChange} 
                    className="w-full bg-white border-2 border-[#8BC34A]/20 rounded-xl py-3 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 transition-colors" 
                    placeholder="0.00" 
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-700">Product Code</label>
                  <input 
                    name="productCode" 
                    value={formData.productCode} 
                    onChange={handleInputChange} 
                    className="w-full bg-white border-2 border-[#8BC34A]/20 rounded-xl py-3 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 transition-colors" 
                    placeholder="e.g. PC123456" 
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-700">SKU</label>
                  <input 
                    name="sku" 
                    value={formData.sku} 
                    onChange={handleInputChange} 
                    className="w-full bg-white border-2 border-[#8BC34A]/20 rounded-xl py-3 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 transition-colors" 
                    placeholder="e.g. SKU123456" 
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Food Menu fields */}
            <div className="p-4 bg-gradient-to-br from-[#FFF8E1] to-[#FFFDE7] rounded-xl border border-[#FFC107]/20 shadow-sm">
              <h3 className="text-lg text-gray-800 mb-3 font-medium">Food Menu Item</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm text-gray-700">Item Name *</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-white border-2 border-[#8BC34A]/20 rounded-xl py-3 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 transition-colors"
                    placeholder="e.g. Margherita Pizza"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-700">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-white border-2 border-[#8BC34A]/20 rounded-xl py-3 px-4 text-gray-700 focus:outline-none focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 transition-colors"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-700">Price *</label>
                  <div className="relative">
                    <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full bg-white border-2 border-[#8BC34A]/20 rounded-xl py-3 px-4 pl-10 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 transition-colors"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-700">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full bg-white border-2 border-[#8BC34A]/20 rounded-xl py-3 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 transition-colors"
                    placeholder="0"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block mb-2 text-sm text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full bg-white border-2 border-[#8BC34A]/20 rounded-xl py-3 px-4 h-24 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 transition-colors"
                    placeholder="Describe the item..."
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-700">Modifier Groups (comma separated)</label>
                  <input
                    name="modifierGroups"
                    value={formData.modifierGroups}
                    onChange={handleInputChange}
                    className="w-full bg-white border-2 border-[#8BC34A]/20 rounded-xl py-3 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 transition-colors"
                    placeholder="e.g. Toppings, Sauces"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-700">Printer Labels (comma separated)</label>
                  <input
                    name="printerLabels"
                    value={formData.printerLabels}
                    onChange={handleInputChange}
                    className="w-full bg-white border-2 border-[#8BC34A]/20 rounded-xl py-3 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 transition-colors"
                    placeholder="e.g. Kitchen, Bar"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-700">Flavour Options (comma separated)</label>
                  <input
                    name="flavourOptions"
                    value={formData.flavourOptions}
                    onChange={handleInputChange}
                    className="w-full bg-white border-2 border-[#8BC34A]/20 rounded-xl py-3 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 transition-colors"
                    placeholder="e.g. Spicy, Mild"
                  />
                </div>
                <div className="flex items-center gap-4 sm:col-span-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="hidden"
                      checked={formData.hidden}
                      onChange={handleInputChange}
                      className="rounded text-[#8BC34A] focus:ring-[#8BC34A]"
                    />
                    <span className="text-gray-700">Hidden (do not show on frontend)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="nonRevenue"
                      checked={formData.nonRevenue}
                      onChange={handleInputChange}
                      className="rounded text-[#8BC34A] focus:ring-[#8BC34A]"
                    />
                    <span className="text-gray-700">Non-revenue item</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Rating and Hearts */}
            <div className="p-4 bg-gradient-to-br from-[#FFF8E1] to-[#FFFDE7] rounded-xl border border-[#FFC107]/20 shadow-sm">
              <h3 className="text-lg text-gray-800 mb-3 font-medium">Item Rating</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <FiStar
                      key={star}
                      className={`text-2xl cursor-pointer ${star <= (hoverRating || formData.rating) ? 'text-[#FFC107] fill-current' : 'text-gray-300'}`}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => handleRating(star)}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleHearts}
                  className="flex items-center gap-2 px-3 py-1 bg-rose-50 rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-100 transition-colors"
                >
                  <FiHeart className="fill-current" />
                  <span>{formData.hearts} Hearts</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button"
              className="px-4 py-2 rounded-xl bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200 transition-colors"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-3 bg-gradient-to-r from-[#8BC34A] to-[#FFC107] rounded-xl font-semibold text-white hover:from-[#FFC107] hover:to-[#8BC34A] transition-all duration-300 shadow-lg hover:shadow-[#FFC107]/20"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#8BC34A]/20">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-gray-800">
            Add New Menu Item
          </h2>
          
          <div className="text-center">
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-[#8BC34A] to-[#FFC107] rounded-xl font-semibold text-white hover:from-[#FFC107] hover:to-[#8BC34A] transition-all duration-300 shadow-lg hover:shadow-[#FFC107]/20"
              type="button"
            >
              Add New Item
            </button>
          </div>
        </div>
      </div>
      
      {/* Modal */}
      {showModal && <AddItemModal />}
    </div>
  );
};

export default AddItems;