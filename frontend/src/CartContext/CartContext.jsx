import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';
import apiConfig from '../utils/apiConfig';

const CartContext = createContext();

// State shape: [ { _id, item: { _id, name, price, … }, quantity, selectedSize }, … ]
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'HYDRATE_CART':
      return action.payload;

    case 'ADD_ITEM': {
      const { _id, item, quantity, selectedSize } = action.payload;
      const exists = state.find(ci => ci._id === _id);
      if (exists) {
        return state.map(ci =>
          ci._id === _id ? { ...ci, quantity: ci.quantity + quantity } : ci
        );
      }
      return [...state, { _id, item, quantity, selectedSize }];
    }

    case 'UPDATE_ITEM': {
      const { _id, quantity, selectedSize } = action.payload;
      return state.map(ci =>
        ci._id === _id ? { ...ci, quantity, selectedSize } : ci
      );
    }

    case 'REMOVE_ITEM':
      return state.filter(ci => ci._id !== action.payload);

    case 'CLEAR_CART':
      return [];

    default:
      return state;
  }
};

const initializer = () => {
  try {
    // Check if user is logged in
    const loginData = localStorage.getItem('loginData');
    const authToken = localStorage.getItem('authToken');
    
    // If user is logged in, we should start with an empty cart
    // The actual cart will be hydrated from the server
    if (loginData && authToken) {
      return [];
    }
    
    // For non-logged in users, use localStorage cart
    return JSON.parse(localStorage.getItem('cart') || '[]');
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, [], initializer);

  // Persist locally
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Hydrate from server
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    
    axios
      .get(`${apiConfig.baseURL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        // Only hydrate if we got a valid response
        if (Array.isArray(res.data)) {
          dispatch({ type: 'HYDRATE_CART', payload: res.data });
        } else {
          // If response is not an array, initialize with empty cart
          dispatch({ type: 'HYDRATE_CART', payload: [] });
        }
      })
      .catch(err => { 
        if (err.response?.status === 403 || err.response?.status === 401) {
          console.warn('Access forbidden to cart API. User may need to re-authenticate.');
          // Clear invalid tokens
          localStorage.removeItem('authToken');
          localStorage.removeItem('loginData');
        } else {
          console.error('Error hydrating cart:', err);
          // Initialize with empty cart on error
          dispatch({ type: 'HYDRATE_CART', payload: [] });
        }
      });
  }, []);

  const addToCart = useCallback(async (item, qty, selectedSize = null) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.warn('No authentication token found. Adding item to local cart only.');
        // Add item to local cart even without token
        const _id = Date.now().toString() + Math.random().toString(36).substr(2, 9); // Generate unique ID
        dispatch({ 
          type: 'ADD_ITEM', 
          payload: { _id, item, quantity: qty, selectedSize } 
        });
        return;
      }
      
      // Handle both database items (_id) and dummy data items (id)
      const itemId = item._id || item.id;
      
      if (!itemId) {
        console.error('Item has no valid ID');
        return;
      }
      
      const requestData = { 
        itemId: itemId, 
        quantity: qty 
      };
      
      // Add selected size if provided
      if (selectedSize) {
        requestData.selectedSize = selectedSize;
      }
      
      const res = await axios.post(
        `${apiConfig.baseURL}/api/cart`,
        requestData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch({ type: 'ADD_ITEM', payload: res.data });
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Add item to local cart even if API call fails
      const _id = Date.now().toString() + Math.random().toString(36).substr(2, 9); // Generate unique ID
      dispatch({ 
        type: 'ADD_ITEM', 
        payload: { _id, item, quantity: qty, selectedSize } 
      });
    }
  }, []);

  const updateQuantity = useCallback(async (_id, qty, selectedSize = null) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.warn('No authentication token found. Updating local cart only.');
        // Update local cart even without token
        dispatch({ 
          type: 'UPDATE_ITEM', 
          payload: { _id, quantity: qty, selectedSize } 
        });
        return;
      }
      
      const requestData = { quantity: qty };
      
      // Add selected size if provided
      if (selectedSize) {
        requestData.selectedSize = selectedSize;
      }
      
      const res = await axios.put(
        `${apiConfig.baseURL}/api/cart/${_id}`,
        requestData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // backend responds with updated { _id, item, quantity, selectedSize }
      dispatch({ type: 'UPDATE_ITEM', payload: res.data });
    } catch (error) {
      console.error('Error updating cart item:', error);
      // Update local cart even if API call fails
      dispatch({ 
        type: 'UPDATE_ITEM', 
        payload: { _id, quantity: qty, selectedSize } 
      });
    }
  }, []);

  const removeFromCart = useCallback(async (_id) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.warn('No authentication token found. Removing from local cart only.');
        // Remove from local cart even without token
        dispatch({ type: 'REMOVE_ITEM', payload: _id });
        return;
      }
      await axios.delete(
        `${apiConfig.baseURL}/api/cart/${_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch({ type: 'REMOVE_ITEM', payload: _id });
    } catch (error) {
      console.error('Error removing from cart:', error);
      // Remove from local cart even if API call fails
      dispatch({ type: 'REMOVE_ITEM', payload: _id });
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.warn('No authentication token found. Clearing local cart only.');
        dispatch({ type: 'CLEAR_CART' });
        return;
      }
      await axios.post(
        `${apiConfig.baseURL}/api/cart/clear`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      console.error('Error clearing cart:', error);
      // Clear local cart even if API call fails
      dispatch({ type: 'CLEAR_CART' });
    }
  }, []);

  const totalItems = cartItems.reduce((sum, ci) => sum + ci.quantity, 0);
  const totalAmount = cartItems.reduce((sum, ci) => {
    // Use selected size price if available, otherwise use item price
    // Add additional null checks to prevent errors
    const price = ci && ci.selectedSize && ci.selectedSize.price 
      ? ci.selectedSize.price 
      : (ci && ci.item && ci.item.price ? ci.item.price : 0);
    const qty = ci && ci.quantity ? ci.quantity : 0;
    return sum + price * qty;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);