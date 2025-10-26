import React, { useState } from 'react';
import { useCart } from '../../CartContext/CartContext';
import { Link } from 'react-router-dom';
import { FaMinus, FaPlus, FaTrash, FaTimes } from 'react-icons/fa';
import apiConfig from '../../utils/apiConfig';

// Base URL for serving uploaded images
const API_URL = apiConfig.baseURL;

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, totalAmount } = useCart();
  const [selectedImage, setSelectedImage] = useState(null);

  // Helper to construct full image URL
  const buildImageUrl = (path) => {
    if (!path) return '';
    return path.startsWith('http')
      ? path
      : `${API_URL}/uploads/${path.replace(/^\/uploads\//, '')}`;
  };

  return (
    <div className="min-h-screen overflow-x-hidden py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-12">
          <span className="font-dancingscript block text-5xl sm:text-6xl md:text-7xl mb-2 bg-gradient-to-r from-[#8BC34A] to-[#FFC107] bg-clip-text text-transparent">
            Your Cart
          </span>
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-800/80 text-xl mb-4">Your cart is empty</p>
            <Link
              to="/menu"
              className="bg-[#8BC34A]/40 px-6 py-2 rounded-full font-cinzel text-sm uppercase hover:bg-[#8BC34A]/50 transition duration-300 text-gray-800 inline-flex items-center gap-2"
            >
              Browse All Items
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {cartItems
                .filter(ci => ci.item)
                .map(({ _id, item, quantity, selectedSize }) => {
                  // Use selected size price if available, otherwise use item price
                  const price = selectedSize?.price ?? item?.price ?? 0;
                  const totalPrice = price * quantity;
                  
                  return (
                    <div
                      key={_id}
                      className="group bg-white p-4 rounded-2xl border-4 border-dashed border-[#8BC34A] backdrop-blur-sm flex flex-col items-center gap-4 transition-all duration-300 hover:border-solid hover:shadow-xl hover:shadow-[#8BC34A]/10 transform hover:-translate-y-1"
                    >
                      <div
                        className="w-24 h-24 flex-shrink-0 cursor-pointer relative overflow-hidden rounded-lg transition-transform duration-300"
                        onClick={() => setSelectedImage(buildImageUrl(item.imageUrl || item.image))}
                      >
                        <img
                          src={buildImageUrl(item?.imageUrl || item?.image)}
                          alt={item?.name || 'Item'}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="w-full text-center">
                        <h3 className="text-xl font-dancingscript text-gray-800">
                          {item.name}
                        </h3>
                        {/* Display selected size if available */}
                        {selectedSize && (
                          <p className="text-gray-800/80 font-cinzel text-sm">
                            Size: {selectedSize.size}
                          </p>
                        )}
                        <p className="text-gray-800/80 font-cinzel mt-1">
                          ${Number(price).toFixed(2)} CAD
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(_id, Math.max(1, quantity - 1), selectedSize)}
                          className="w-8 h-8 rounded-full bg-[#8BC34A]/40 flex items-center justify-center hover:bg-[#8BC34A]/50 transition duration-200 active:scale-95"
                        >
                          <FaMinus className="w-4 h-4 text-white" />
                        </button>
                        <span className="w-8 text-center text-gray-800 font-cinzel">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(_id, quantity + 1, selectedSize)}
                          className="w-8 h-8 rounded-full bg-[#8BC34A]/40 flex items-center justify-center hover:bg-[#8BC34A]/50 transition duration-200 active:scale-95"
                        >
                          <FaPlus className="w-4 h-4 text-white" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between w-full">
                        <button
                          onClick={() => removeFromCart(_id)}
                          className="bg-[#8BC34A]/40 px-3 py-1 rounded-full font-cinzel text-xs uppercase transition duration-300 hover:bg-[#8BC34A]/50 flex items-center gap-1 active:scale-95"
                        >
                          <FaTrash className="w-4 h-4 text-white" />
                          <span className="text-gray-800">Remove</span>
                        </button>
                        <p className="text-sm font-dancingscript text-[#FFC107]">
                          ${totalPrice.toFixed(2)} CAD
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="mt-12 pt-8 border-t border-[#8BC34A]/30">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-8">
                <Link
                  to="/menu"
                  className="bg-[#8BC34A]/40 px-8 py-3 rounded-full font-cinzel uppercase tracking-wider hover:bg-[#8BC34A]/50 transition duration-300 text-gray-800 inline-flex items-center gap-2 active:scale-95"
                >
                  Continue Shopping
                </Link>
                <div className="flex items-center gap-8">
                  <h2 className="text-3xl font-dancingscript text-gray-800">
                    Total: ${totalAmount.toFixed(2)} CAD
                  </h2>
                  <Link
                    to="/checkout"
                    className="bg-gradient-to-r from-[#8BC34A] to-[#7CB342] px-8 py-3 rounded-full font-cinzel uppercase tracking-wider hover:from-[#7CB342] hover:to-[#8BC34A] transition duration-300 text-white flex items-center gap-2 active:scale-95 shadow-lg hover:shadow-[#8BC34A]/30"
                  >
                    Checkout Now
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/40 bg-opacity-75 backdrop-blur-sm p-4 overflow-auto"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-full max-h-full">
            <img
              src={selectedImage}
              alt="Full view"
              className="max-w-[90vw] max-h-[90vh] rounded-lg object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-1 right-1 bg-[#8BC34A]/80 rounded-full p-2 text-white hover:bg-[#7CB342]/90 transition duration-200 active:scale-90"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;