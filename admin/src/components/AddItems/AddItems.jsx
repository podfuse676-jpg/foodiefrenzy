// src/components/AddItems.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { FiUpload, FiHeart, FiStar } from 'react-icons/fi';
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

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
        preview: URL.createObjectURL(file)
      }));
    }
  };

  const handleRating = rating =>
    setFormData(prev => ({ ...prev, rating }));

  const handleHearts = () =>
    setFormData(prev => ({ ...prev, hearts: prev.hearts + 1 }));

  const handleSubmit = async e => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.image) {
      alert('Please select an image for the item');
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
        total: 0, image: null, preview: ''
      });
      
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
      
      alert(errorMessage);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <div className="max-w-4xl mx-auto">
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Add New Menu Item</h2>
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            <div className={styles.uploadWrapper}>
              <label className={styles.uploadLabel}>
                {formData.preview ? (
                  <img
                    src={formData.preview}
                    alt="Preview"
                    className={styles.previewImage}
                  />
                ) : (
                  <div className="text-center p-4">
                    <FiUpload className={styles.uploadIcon} />
                    <p className={styles.uploadText}>
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
              <div className="p-4 bg-[#2b3a2b] rounded-lg border border-green-900/20">
                <h3 className="text-lg text-green-200 mb-3">Convenience Store / Item</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm text-green-400">Price Type</label>
                    <input name="priceType" value={formData.priceType} onChange={handleInputChange} className={styles.inputField} placeholder="e.g. fixed / variable" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm text-green-400">Price Unit</label>
                    <input name="priceUnit" value={formData.priceUnit} onChange={handleInputChange} className={styles.inputField} placeholder="e.g. per item / per kg" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm text-green-400">GST (%)</label>
                    <input type="number" step="0.01" name="gst" value={formData.gst} onChange={handleInputChange} className={styles.inputField} placeholder="0.00" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm text-green-400">Cost</label>
                    <input type="number" step="0.01" name="cost" value={formData.cost} onChange={handleInputChange} className={styles.inputField} placeholder="0.00" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm text-green-400">Product Code</label>
                    <input name="productCode" value={formData.productCode} onChange={handleInputChange} className={styles.inputField} placeholder="e.g. PC123456" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm text-green-400">SKU</label>
                    <input name="sku" value={formData.sku} onChange={handleInputChange} className={styles.inputField} placeholder="e.g. SKU123456" />
                  </div>
                </div>
              </div>

              {/* Section 2: Food Menu fields */}
              <div className="p-4 bg-[#2b1f1f] rounded-lg border border-amber-900/20">
                <h3 className="text-lg text-amber-200 mb-3">Food Menu Item</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm text-amber-400">Item Name *</label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={styles.inputField}
                      placeholder="e.g. Margherita Pizza"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm text-amber-400">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={styles.inputField}
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm text-amber-400">Price *</label>
                    <div className="relative">
                      <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400" />
                      <input
                        type="number"
                        step="0.01"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className={`${styles.inputField} pl-10`}
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm text-amber-400">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className={styles.inputField}
                      placeholder="0"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block mb-2 text-sm text-amber-400">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className={`${styles.inputField} h-24`}
                      placeholder="Describe the item..."
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm text-amber-400">Modifier Groups (comma separated)</label>
                    <input
                      name="modifierGroups"
                      value={formData.modifierGroups}
                      onChange={handleInputChange}
                      className={styles.inputField}
                      placeholder="e.g. Toppings, Sauces"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm text-amber-400">Printer Labels (comma separated)</label>
                    <input
                      name="printerLabels"
                      value={formData.printerLabels}
                      onChange={handleInputChange}
                      className={styles.inputField}
                      placeholder="e.g. Kitchen, Bar"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm text-amber-400">Flavour Options (comma separated)</label>
                    <input
                      name="flavourOptions"
                      value={formData.flavourOptions}
                      onChange={handleInputChange}
                      className={styles.inputField}
                      placeholder="e.g. Spicy, Mild"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="hidden"
                        checked={formData.hidden}
                        onChange={e => setFormData(prev => ({ ...prev, hidden: e.target.checked }))}
                      />
                      <span className="text-amber-200">Hidden (do not show on frontend)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="nonRevenue"
                        checked={formData.nonRevenue}
                        onChange={e => setFormData(prev => ({ ...prev, nonRevenue: e.target.checked }))}
                      />
                      <span className="text-amber-200">Non-revenue item</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Rating and Hearts */}
              <div className="p-4 bg-[#2b1f1f] rounded-lg border border-amber-900/20">
                <h3 className="text-lg text-amber-200 mb-3">Item Rating</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <FiStar
                        key={star}
                        className={`text-2xl cursor-pointer ${star <= (hoverRating || formData.rating) ? 'text-amber-400 fill-current' : 'text-amber-100/30'}`}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => handleRating(star)}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleHearts}
                    className="flex items-center gap-2 px-3 py-1 bg-rose-900/30 rounded-lg border border-rose-700/50 text-rose-300 hover:bg-rose-800/50 transition-colors"
                  >
                    <FiHeart className="fill-current" />
                    <span>{formData.hearts} Hearts</span>
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" className={styles.submitButton}>
              Add Item
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItems;