import React, { useState, useEffect } from 'react';
import { useCart } from '../../CartContext/CartContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaLock, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import apiConfig from '../../utils/apiConfig';

const CheckoutPage = () => {
  const { totalAmount, cartItems: rawCart, clearCart } = useCart();
  const cartItems = rawCart.filter(ci => ci.item);
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', phone: '',
    email: '', address: '', city: '',
    zipCode: '', paymentMethod: ''
  });
  const [loading, setLoading] = useState(false);
  const [postalLookupLoading, setPostalLookupLoading] = useState(false);
  const [error, setError] = useState(null);

  // Grab token from localStorage (support both authToken and token keys)
  const token = localStorage.getItem('authToken') || localStorage.getItem('token');
  // Ensure proper Bearer token format for authorization header
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  // Handle redirect back from payment gateway - only for cancel cases
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentStatus = params.get('payment_status');

    console.log('CheckoutPage useEffect triggered with params:', { paymentStatus });

    if (paymentStatus === 'cancel') {
      // User cancelled or payment failed
      console.log('Payment cancelled or failed');
      setError('Payment was cancelled or failed. Your cart remains intact.');
    }
  }, [location.search]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Canadian postal code validation and lookup
  const validateAndLookupPostalCode = (postalCode) => {
    // Remove spaces and convert to uppercase
    const cleanPostalCode = postalCode.replace(/\s/g, '').toUpperCase();
    
    // Canadian postal code format: A1A 1A1
    const postalCodeRegex = /^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/;
    
    if (cleanPostalCode.length === 6 && postalCodeRegex.test(cleanPostalCode)) {
      // Format as A1A 1A1
      return cleanPostalCode.substring(0, 3) + ' ' + cleanPostalCode.substring(3);
    }
    
    return postalCode;
  };

  // Handle postal code change with validation
  const handlePostalCodeChange = (e) => {
    const formattedPostalCode = validateAndLookupPostalCode(e.target.value);
    setFormData(prev => ({ ...prev, zipCode: formattedPostalCode }));
  };

  // Canadian postal code lookup using API Ninjas
  const lookupPostalCode = async (postalCode) => {
    setPostalLookupLoading(true);
    setError(null);
    
    try {
      // Clean and validate the postal code
      const cleanPostalCode = postalCode.replace(/\s/g, '').toUpperCase();
      const postalCodeRegex = /^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/;
      
      if (cleanPostalCode.length !== 6 || !postalCodeRegex.test(cleanPostalCode)) {
        setError('Please enter a valid Canadian postal code (e.g., T4S 1Y8)');
        setPostalLookupLoading(false);
        return;
      }
      
      // Format the postal code for API request
      const formattedPostalCode = cleanPostalCode.substring(0, 3) + ' ' + cleanPostalCode.substring(3);
      
      // In a production environment, you would call the API Ninjas service here
      // For now, we'll simulate the API response with common Canadian postal codes
      // A real implementation would look like:
      /*
      const response = await fetch(
        `https://api.api-ninjas.com/v1/postalcode?postal_code=${cleanPostalCode}`,
        {
          headers: {
            'X-Api-Key': 'YOUR_API_NINJAS_KEY'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to lookup postal code');
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        setFormData(prev => ({
          ...prev,
          zipCode: result.postal_code,
          city: result.city
        }));
      } else {
        setError('Postal code not found. Please check and try again.');
      }
      */
      
      // Update the postal code in form data with proper formatting
      setFormData(prev => ({ ...prev, zipCode: formattedPostalCode }));
      
      // Simulate API lookup delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (err) {
      setError('Failed to lookup postal code. Please check and try again.');
      console.error('Postal code lookup error:', err);
    } finally {
      setPostalLookupLoading(false);
    }
  };

  // Handle postal code lookup on blur
  const handlePostalCodeBlur = () => {
    if (formData.zipCode) {
      lookupPostalCode(formData.zipCode);
    }
  };

  // Handle postal code lookup on Enter key
  const handlePostalCodeKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handlePostalCodeBlur();
    }
  };

  // Handle manual lookup button click
  const handleLookupClick = (e) => {
    e.preventDefault();
    handlePostalCodeBlur();
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate form data
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.address || !formData.city || !formData.zipCode || 
        !formData.paymentMethod) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    // Validate Canadian postal code format
    const cleanPostalCode = formData.zipCode.replace(/\s/g, '').toUpperCase();
    const postalCodeRegex = /^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/;
    if (cleanPostalCode.length !== 6 || !postalCodeRegex.test(cleanPostalCode)) {
      setError('Please enter a valid Canadian postal code (e.g., T4S 1Y8)');
      setLoading(false);
      return;
    }

    // Calculate pricing with delivery and COD fees
    const subtotal = Number(totalAmount.toFixed(2));
    const tax = Number((subtotal * 0.05).toFixed(2));
    const deliveryCharge = 5.00; // $5 CAD delivery charge
    const codFee = formData.paymentMethod === 'cod' ? 5.00 : 0; // $5 CAD extra for COD
    const total = Number((subtotal + tax + deliveryCharge + codFee).toFixed(2));

    const payload = {
      ...formData,
      subtotal,
      tax,
      deliveryCharge,
      codFee,
      total,
      items: cartItems.map(({ item, quantity, selectedSize }) => ({
        name: item.name,
        price: selectedSize?.price ?? item.price,
        quantity,
        imageUrl: item.imageUrl || null,
        selectedSize: selectedSize || undefined
      }))
    };

    try {
      if (formData.paymentMethod === 'card') {
        // Stripe Payment: create checkout session
        try {
          const { data } = await axios.post(
            `${apiConfig.baseURL}/api/orders`,
            payload,
            { 
              headers: authHeaders
            }
          );
          // Redirect to external payment gateway (Stripe)
          if (data.checkoutUrl) {
            console.log('Redirecting to Stripe checkout URL:', data.checkoutUrl);
            window.location.href = data.checkoutUrl;
          } else {
            setError('Payment gateway URL not received. Please try again.');
          }
        } catch (err) {
          console.error('Card payment error:', err);
          setError(err.response?.data?.message || 'Failed to process card payment');
          setLoading(false);
        }
      } else if (formData.paymentMethod === 'cod') {
        // Cash on Delivery: directly create order
        try {
          const { data } = await axios.post(
            `${apiConfig.baseURL}/api/orders`,
            payload,
            { 
              headers: authHeaders
            }
          );
          clearCart();
          // For COD, the backend returns { order: orderObject }
          navigate('/myorder', { state: { order: data.order } });
        } catch (err) {
          console.error('COD order submission error:', err);
          setError(err.response?.data?.message || 'Failed to submit order');
          setLoading(false);
        }
      } else {
        setError('Please select a payment method');
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error('Order submission error:', err);
      setError(err.response?.data?.message || 'Failed to submit order');
      setLoading(false);
    }
  };

  return (
    // Updated to light fresh colors with improved mobile responsiveness
    <div className="min-h-screen bg-gradient-to-b from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] text-gray-800 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/cart" className="flex items-center gap-2 text-[#8BC34A] mb-6 sm:mb-8">
          <FaArrowLeft /> Back to Cart
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8">Checkout</h1>
        
        {/* Improved form layout for mobile */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">

          {/* Personal Info Section - improved for mobile */}
          <div className="bg-white/80 p-4 sm:p-6 rounded-2xl space-y-4 sm:space-y-6 border border-[#8BC34A]/20">
            <h2 className="text-xl sm:text-2xl font-bold">Personal Information</h2>
            <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
            <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
            <Input label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
            <Input label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
            <Input label="Address" name="address" value={formData.address} onChange={handleInputChange} required />
            <Input label="City" name="city" value={formData.city} onChange={handleInputChange} required />
            <div>
              <label className="block mb-1 text-sm sm:text-base">Postal Code <span className="text-red-500">*</span></label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handlePostalCodeChange}
                  onBlur={handlePostalCodeBlur}
                  onKeyPress={handlePostalCodeKeyPress}
                  required
                  placeholder="e.g., T4S 1Y8"
                  className="flex-1 bg-white border border-[#8BC34A]/30 rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base"
                />
                <button 
                  onClick={handleLookupClick}
                  disabled={postalLookupLoading || !formData.zipCode}
                  className="bg-[#8BC34A] text-white px-3 rounded-xl flex items-center justify-center disabled:opacity-50"
                  title="Lookup address by postal code"
                >
                  {postalLookupLoading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <FaSearch />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Enter a valid Canadian postal code (e.g., T4S 1Y8) for address verification</p>
            </div>
          </div>

          {/* Payment Section - improved for mobile */}
          <div className="bg-white/80 p-4 sm:p-6 rounded-2xl space-y-4 sm:space-y-6 border border-[#8BC34A]/20">
            <h2 className="text-xl sm:text-2xl font-bold">Payment Details</h2>

            {/* Order Items - improved for mobile */}
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Your Order Items</h3>
              {cartItems.map(({ _id, item, quantity, selectedSize }) => {
                // Use selected size price if available, otherwise use item price
                const price = selectedSize?.price ?? item?.price ?? 0;
                const totalPrice = price * quantity;
                
                return (
                  <div key={_id} className="flex justify-between items-center bg-gray-100 p-2 sm:p-3 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <span className="text-gray-800 text-sm sm:text-base truncate block">{item.name}</span>
                      <div className="flex flex-wrap items-center gap-1 mt-1">
                        {selectedSize && (
                          <span className="text-[#8BC34A]/80 text-xs">({selectedSize.size})</span>
                        )}
                        <span className="text-[#8BC34A]/80 text-xs">x{quantity}</span>
                      </div>
                    </div>
                    <span className="text-[#FFC107] text-sm sm:text-base whitespace-nowrap ml-2">${totalPrice.toFixed(2)} CAD</span>
                  </div>
                );
              })}
            </div>

            <PaymentSummary 
              totalAmount={totalAmount} 
              paymentMethod={formData.paymentMethod}
            />

            {/* Payment Method - improved for mobile */}
            <div>
              <label className="block mb-2 text-sm sm:text-base">Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                required
                className="w-full bg-white border border-[#8BC34A]/30 rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base"
              >
                <option value="">Select Method</option>
                <option value="cod">Cash on Delivery (+$5.00 CAD)</option>
                <option value="card">Credit/Debit Card</option>
              </select>
            </div>

            {/* Error message - improved for mobile */}
            {error && (
              <div className="text-red-500 text-sm sm:text-base bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button - improved for mobile */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#8BC34A] to-[#7CB342] text-white py-3 sm:py-4 rounded-xl font-cinzel uppercase tracking-wider hover:from-[#7CB342] hover:to-[#8BC34A] transition duration-300 flex items-center justify-center gap-2 active:scale-95 shadow-lg hover:shadow-[#8BC34A]/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Processing...
                </>
              ) : (
                <>
                  <FaLock /> Place Order
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Input component - improved for mobile
const Input = ({ label, name, type = 'text', value, onChange, required }) => (
  <div>
    <label className="block mb-1 text-sm sm:text-base">{label} {required && <span className="text-red-500">*</span>}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full bg-white border border-[#8BC34A]/30 rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base"
    />
  </div>
);

// PaymentSummary component - improved for mobile
const PaymentSummary = ({ totalAmount, paymentMethod }) => {
  const subtotal = Number(totalAmount.toFixed(2));
  const tax = Number((subtotal * 0.05).toFixed(2));
  const deliveryCharge = 5.00;
  const codFee = paymentMethod === 'cod' ? 5.00 : 0;
  const total = Number((subtotal + tax + deliveryCharge + codFee).toFixed(2));

  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="flex justify-between">
        <span className="text-gray-800 text-sm sm:text-base">Subtotal:</span>
        <span className="text-gray-800 text-sm sm:text-base">${subtotal.toFixed(2)} CAD</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-800 text-sm sm:text-base">Tax (5%):</span>
        <span className="text-gray-800 text-sm sm:text-base">${tax.toFixed(2)} CAD</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-800 text-sm sm:text-base">Delivery:</span>
        <span className="text-gray-800 text-sm sm:text-base">${deliveryCharge.toFixed(2)} CAD</span>
      </div>
      {codFee > 0 && (
        <div className="flex justify-between">
          <span className="text-gray-800 text-sm sm:text-base">COD Fee:</span>
          <span className="text-gray-800 text-sm sm:text-base">${codFee.toFixed(2)} CAD</span>
        </div>
      )}
      <div className="border-t border-[#8BC34A]/30 pt-2 flex justify-between font-bold">
        <span className="text-gray-800 text-sm sm:text-base">Total:</span>
        <span className="text-[#FFC107] text-sm sm:text-base">${total.toFixed(2)} CAD</span>
      </div>
    </div>
  );
};

export default CheckoutPage;