// src/components/AddItems.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { FiUpload, FiHeart, FiStar, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
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
    imageUrl: '',
    rating: 0,
    hearts: 0,
    hidden: false,
    modifierGroups: [], // Array of modifier groups
    flavourOptions: []  // Array of flavor options
  });
  
  // Simplified categories list with the actual categories used in the app
  const [categories] = useState([
    'Hot Beverages',
    'Cold Beverages', 
    'Hot Food',
    'Exotic Chips',
    'Exotic Drinks',
    'Grocery',
    'Novelties',
    'Car Accessories',
    'Smokes & Vapes',
    'Drinks'
  ]);
  
  const [hoverRating, setHoverRating] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [newModifierGroup, setNewModifierGroup] = useState({ name: '', options: '' });
  const [newFlavor, setNewFlavor] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Handle checkbox inputs differently
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
        preview: URL.createObjectURL(file)
      }));
    }
  };

  const handleRating = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleHearts = () => {
    setFormData(prev => ({ ...prev, hearts: prev.hearts + 1 }));
  };

  // Modifier group functions
  const addModifierGroup = () => {
    if (newModifierGroup.name.trim() && newModifierGroup.options.trim()) {
      const optionsArray = newModifierGroup.options.split(',').map(opt => opt.trim()).filter(opt => opt);
      const newGroup = {
        name: newModifierGroup.name.trim(),
        options: optionsArray
      };
      
      setFormData(prev => ({
        ...prev,
        modifierGroups: [...prev.modifierGroups, newGroup]
      }));
      
      setNewModifierGroup({ name: '', options: '' });
    }
  };

  const removeModifierGroup = (index) => {
    setFormData(prev => ({
      ...prev,
      modifierGroups: prev.modifierGroups.filter((_, i) => i !== index)
    }));
  };

  // Flavor functions
  const addFlavor = () => {
    if (newFlavor.trim()) {
      setFormData(prev => ({
        ...prev,
        flavourOptions: [...prev.flavourOptions, newFlavor.trim()]
      }));
      setNewFlavor('');
    }
  };

  const removeFlavor = (index) => {
    setFormData(prev => ({
      ...prev,
      flavourOptions: prev.flavourOptions.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.image && !formData.imageUrl) {
      alert('Please select an image for the item or provide an image URL');
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
    
    // Prepare data with default description if needed
    const submitData = { ...formData };
    if (!submitData.description || submitData.description.trim() === '') {
      submitData.description = `${submitData.name || 'Delicious item'} from our collection`;
    }
    
    try {
      // Create FormData object for file upload
      const payload = new FormData();
      
      // Log what's being added to payload for debugging
      console.log('Form data being submitted:', {
        ...submitData,
        image: submitData.image ? submitData.image.name : 'No image'
      });
      
      // Prepare fields that need special serialization
      const dataToSend = { ...submitData };
      
      // For modifierGroups, extract just the names (not the full objects)
      if (dataToSend.modifierGroups && dataToSend.modifierGroups.length > 0) {
        // If modifierGroups contains objects, extract just the names
        if (typeof dataToSend.modifierGroups[0] === 'object' && dataToSend.modifierGroups[0] !== null) {
          dataToSend.modifierGroups = dataToSend.modifierGroups.map(group => 
            typeof group === 'object' ? group.name : group
          );
        }
        dataToSend.modifierGroups = JSON.stringify(dataToSend.modifierGroups);
      }
      
      // For flavourOptions, ensure it's properly formatted
      if (dataToSend.flavourOptions && dataToSend.flavourOptions.length > 0) {
        // If flavourOptions contains objects, extract just the values
        if (typeof dataToSend.flavourOptions[0] === 'object' && dataToSend.flavourOptions[0] !== null) {
          dataToSend.flavourOptions = dataToSend.flavourOptions.map(option => 
            typeof option === 'object' ? option.value : option
          );
        }
        dataToSend.flavourOptions = JSON.stringify(dataToSend.flavourOptions);
      }
      
      // Append file first if exists
      if (submitData.image) payload.append('image', submitData.image);

      // Append other fields
      Object.entries(dataToSend).forEach(([key, val]) => {
        if (key === 'preview' || key === 'image') return;
        payload.append(key, val === undefined || val === null ? '' : String(val));
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
        name: '',
        description: '',
        category: '',
        price: '',
        imageUrl: '',
        rating: 0,
        hearts: 0,
        hidden: false,
        image: null,
        preview: '',
        modifierGroups: [],
        flavourOptions: []
      });
      
      setNewModifierGroup({ name: '', options: '' });
      setNewFlavor('');
      
      // Close modal
      setShowModal(false);
      
      // Clear any file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#8BC34A]/20">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-gray-800">
            Add New Menu Item
          </h2>
          
          {showModal ? (
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
                      />
                    </label>
                    <p className="text-sm text-gray-500 mt-2">Or provide image URL below</p>
                  </div>

                  <div className="space-y-6">
                    {/* Basic Item Information */}
                    <div className="p-4 bg-gradient-to-br from-[#FFF8E1] to-[#FFFDE7] rounded-xl border border-[#FFC107]/20 shadow-sm">
                      <h3 className="text-lg text-gray-800 mb-3 font-medium">Basic Item Information</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block mb-2 text-sm text-gray-700">Item Name *</label>
                          <input
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full bg-white border-2 border-[#8BC34A]/20 rounded-xl py-3 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 transition-colors"
                            placeholder="e.g. Red Bull Energy Drink"
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
                        <div className="sm:col-span-2">
                          <label className="block mb-2 text-sm text-gray-700">Image URL (optional if uploading)</label>
                          <input
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleInputChange}
                            className="w-full bg-white border-2 border-[#8BC34A]/20 rounded-xl py-3 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 transition-colors"
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Flavors/Customization Options */}
                    <div className="p-4 bg-gradient-to-br from-[#F0F8FF] to-[#F8F8FF] rounded-xl border border-[#4A90E2]/20 shadow-sm">
                      <h3 className="text-lg text-gray-800 mb-3 font-medium">Flavors & Customization</h3>
                      
                      {/* Flavor Options */}
                      <div className="mb-4">
                        <label className="block mb-2 text-sm text-gray-700">Flavor Options</label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={newFlavor}
                            onChange={(e) => setNewFlavor(e.target.value)}
                            className="flex-1 bg-white border-2 border-[#8BC34A]/20 rounded-xl py-2 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 transition-colors"
                            placeholder="e.g. Original, Sugar Free, Blue Edition"
                          />
                          <button
                            type="button"
                            onClick={addFlavor}
                            className="px-3 py-2 bg-[#4A90E2] text-white rounded-xl hover:bg-[#3A7BC8] transition-colors flex items-center gap-1"
                          >
                            <FiPlus /> Add
                          </button>
                        </div>
                        {formData.flavourOptions.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {formData.flavourOptions.map((flavor, index) => (
                              <div key={index} className="flex items-center bg-[#E3F2FD] rounded-full px-3 py-1">
                                <span className="text-[#4A90E2] text-sm">{flavor}</span>
                                <button
                                  type="button"
                                  onClick={() => removeFlavor(index)}
                                  className="ml-2 text-[#4A90E2] hover:text-[#D32F2F]"
                                >
                                  <FiX size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Modifier Groups */}
                      <div>
                        <label className="block mb-2 text-sm text-gray-700">Modifier Groups</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                          <input
                            type="text"
                            value={newModifierGroup.name}
                            onChange={(e) => setNewModifierGroup({...newModifierGroup, name: e.target.value})}
                            className="bg-white border-2 border-[#8BC34A]/20 rounded-xl py-2 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 transition-colors"
                            placeholder="e.g. Size, Temperature"
                          />
                          <input
                            type="text"
                            value={newModifierGroup.options}
                            onChange={(e) => setNewModifierGroup({...newModifierGroup, options: e.target.value})}
                            className="bg-white border-2 border-[#8BC34A]/20 rounded-xl py-2 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 transition-colors"
                            placeholder="Options separated by commas"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={addModifierGroup}
                          className="px-3 py-2 bg-[#4A90E2] text-white rounded-xl hover:bg-[#3A7BC8] transition-colors flex items-center gap-1 mb-3"
                        >
                          <FiPlus /> Add Modifier Group
                        </button>
                        
                        {formData.modifierGroups.length > 0 && (
                          <div className="space-y-2">
                            {formData.modifierGroups.map((group, index) => (
                              <div key={index} className="flex items-center justify-between bg-[#E3F2FD] rounded-xl p-3">
                                <div>
                                  <div className="font-medium text-[#4A90E2]">{group.name}</div>
                                  <div className="text-sm text-gray-600">
                                    {group.options.join(', ')}
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeModifierGroup(index)}
                                  className="text-[#D32F2F] hover:text-[#B71C1C]"
                                >
                                  <FiTrash2 />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Display Settings */}
                    <div className="p-4 bg-gradient-to-br from-[#F9FFF6] to-[#FFFFFF] rounded-xl border border-[#8BC34A]/20 shadow-sm">
                      <h3 className="text-lg text-gray-800 mb-3 font-medium">Display Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
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
                        </div>
                        
                        {/* Rating Section */}
                        <div>
                          <label className="block mb-2 text-sm text-gray-700">Initial Rating</label>
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
                            <span className="text-gray-700">{formData.rating} stars</span>
                          </div>
                        </div>
                        
                        {/* Hearts Section */}
                        <div>
                          <label className="block mb-2 text-sm text-gray-700">Initial Hearts</label>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={handleHearts}
                              className="flex items-center gap-2 px-3 py-1 bg-rose-50 rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-100 transition-colors"
                            >
                              <FiHeart className="fill-current" />
                              <span>Add Heart</span>
                            </button>
                            <span className="text-gray-700">{formData.hearts} hearts</span>
                          </div>
                        </div>
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
          ) : (
            <div className="text-center">
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-[#8BC34A] to-[#FFC107] rounded-xl font-semibold text-white hover:from-[#FFC107] hover:to-[#8BC34A] transition-all duration-300 shadow-lg hover:shadow-[#FFC107]/20"
                type="button"
              >
                Add New Item
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddItems;