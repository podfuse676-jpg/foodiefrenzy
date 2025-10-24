import React from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

const MenuItem = ({ item, cartEntry, quantity, addToCart, updateQuantity, removeFromCart }) => {
  return (
    <div className="relative bg-[#FFFFFF] rounded-2xl overflow-hidden border-4 border-dashed border-[#4CAF50] backdrop-blur-sm flex flex-col items-center gap-4 transition-all duration-300 hover:border-solid hover:shadow-xl hover:shadow-[#4CAF50]/10 transform hover:-translate-y-1">
      <div className="w-24 h-24 flex-shrink-0 relative overflow-hidden rounded-lg transition-transform duration-300">
        <img
          src={item.imageUrl || item.image || null}
          alt={item.name}
          className="w-full h-full object-contain"
        />
      </div>

      <div className="w-full text-center">
        <h3 className="text-xl font-dancingscript text-[#333333]">
          {item.name}
        </h3>
        <p className="text-[#333333]/80 font-cinzel text-sm">
          {item.description}
        </p>
        <p className="text-[#333333]/80 font-cinzel mt-1">
          ${Number(item.price).toFixed(2)} CAD
        </p>
      </div>

      <div className="flex items-center gap-3">
        {quantity > 0 ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                quantity > 1
                  ? updateQuantity(cartEntry._id, quantity - 1)
                  : removeFromCart(cartEntry._id)
              }
              className="w-8 h-8 rounded-full bg-[#4CAF50]/40 flex items-center justify-center hover:bg-[#4CAF50]/50 transition duration-200 active:scale-95"
            >
              <FaMinus className="w-4 h-4 text-[#FAFAFA]" />
            </button>
            <span className="w-8 text-center text-[#333333] font-cinzel">
              {quantity}
            </span>
            <button
              onClick={() => updateQuantity(cartEntry._id, quantity + 1)}
              className="w-8 h-8 rounded-full bg-[#4CAF50]/40 flex items-center justify-center hover:bg-[#4CAF50]/50 transition duration-200 active:scale-95"
            >
              <FaPlus className="w-4 h-4 text-[#FAFAFA]" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => addToCart(item, 1)}
            className="bg-[#4CAF50] border-2 border-[#4CAF50] px-4 py-1.5 rounded-full font-cinzel text-xs uppercase transition duration-300 hover:bg-[#FAFAFA] hover:text-[#4CAF50] flex items-center gap-1 active:scale-95"
          >
            <FaPlus className="w-3 h-3" />
            <span>Add to Cart</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuItem;