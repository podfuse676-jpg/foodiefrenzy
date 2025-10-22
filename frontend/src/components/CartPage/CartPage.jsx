import React, { useState } from 'react';
import { useCart } from '../../CartContext/CartContext';
import { Link } from 'react-router-dom';
import { FaMinus, FaPlus, FaTrash, FaTimes } from 'react-icons/fa';

// Base URL for serving uploaded images
const API_URL = 'http://localhost:4000';

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
    <div className="min-h-screen overflow-x-hidden py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#fff7ed] via-[#fef3e5] to-[#fde9d0]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-12">
          <span className="font-dancingscript block text-5xl sm:text-6xl md:text-7xl mb-2 bg-gradient-to-r from-[#f59e0b] to-[#d97706] bg-clip-text text-transparent">
            Your Cart
          </span>
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center">
            <p className="text-[#2D1B0E]/80 text-xl mb-4">Your cart is empty</p>
            <Link
              to="/menu"
              className="bg-[#0ea5a4]/40 px-6 py-2 rounded-full font-cinzel text-sm uppercase hover:bg-[#0ea5a4]/50 transition duration-300 text-[#2D1B0E] inline-flex items-center gap-2"
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
                      className="group bg-white/20 p-4 rounded-2xl border-4 border-dashed border-[#f59e0b] backdrop-blur-sm flex flex-col items-center gap-4 transition-all duration-300 hover:border-solid hover:shadow-xl hover:shadow-[#0ea5a4]/10 transform hover:-translate-y-1"
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
                        <h3 className="text-xl font-dancingscript text-[#2D1B0E]">
                          {item.name}
                        </h3>
                        {/* Display selected size if available */}
                        {selectedSize && (
                          <p className="text-[#2D1B0E]/80 font-cinzel text-sm">
                            Size: {selectedSize.size}
                          </p>
                        )}
                        <p className="text-[#2D1B0E]/80 font-cinzel mt-1">
                          ${Number(price).toFixed(2)} CAD
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(_id, Math.max(1, quantity - 1), selectedSize)}
                          className="w-8 h-8 rounded-full bg-[#0ea5a4]/40 flex items-center justify-center hover:bg-[#0ea5a4]/50 transition duration-200 active:scale-95"
                        >
                          <FaMinus className="w-4 h-4 text-[#2D1B0E]" />
                        </button>
                        <span className="w-8 text-center text-[#2D1B0E] font-cinzel">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(_id, quantity + 1, selectedSize)}
                          className="w-8 h-8 rounded-full bg-[#0ea5a4]/40 flex items-center justify-center hover:bg-[#0ea5a4]/50 transition duration-200 active:scale-95"
                        >
                          <FaPlus className="w-4 h-4 text-[#2D1B0E]" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between w-full">
                        <button
                          onClick={() => removeFromCart(_id)}
                          className="bg-[#0ea5a4]/40 px-3 py-1 rounded-full font-cinzel text-xs uppercase transition duration-300 hover:bg-[#0ea5a4]/50 flex items-center gap-1 active:scale-95"
                        >
                          <FaTrash className="w-4 h-4 text-[#2D1B0E]" />
                          <span className="text-[#2D1B0E]">Remove</span>
                        </button>
                        <p className="text-sm font-dancingscript text-[#d97706]">
                          ${totalPrice.toFixed(2)} CAD
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="mt-12 pt-8 border-t border-[#f59e0b]/30">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-8">
                <Link
                  to="/menu"
                  className="bg-[#0ea5a4]/40 px-8 py-3 rounded-full font-cinzel uppercase tracking-wider hover:bg-[#0ea5a4]/50 transition duration-300 text-[#2D1B0E] inline-flex items-center gap-2 active:scale-95"
                >
                  Continue Shopping
                </Link>
                <div className="flex items-center gap-8">
                  <h2 className="text-3xl font-dancingscript text-[#2D1B0E]">
                    Total: ${totalAmount.toFixed(2)} CAD
                  </h2>
                  <Link
                    to="/checkout"
                    className="bg-gradient-to-r from-[#f59e0b] to-[#d97706] px-8 py-3 rounded-full font-cinzel uppercase tracking-wider hover:from-[#d97706] hover:to-[#f59e0b] transition duration-300 text-[#2D1B0E] flex items-center gap-2 active:scale-95 shadow-lg hover:shadow-[#f59e0b]/30"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D1B0E]/40 bg-opacity-75 backdrop-blur-sm p-4 overflow-auto"
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
              className="absolute top-1 right-1 bg-[#f59e0b]/80 rounded-full p-2 text-[#2D1B0E] hover:bg-[#d97706]/90 transition duration-200 active:scale-90"
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