import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    subtotal: '0.00',
    delivery_charge: '30.00',
    total: '30.00'
  });
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useAuth();
  const { showToast } = useToast();

  const fetchCart = useCallback(async () => {
    if (!isLoggedIn) {
      setCart({ items: [], subtotal: '0.00', delivery_charge: '30.00', total: '30.00' });
      return;
    }

    setLoading(true);
    const res = await api.get('/cart/');
    if (res.success && res.data) {
      setCart(res.data);
    }
    setLoading(false);
  }, [isLoggedIn]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (foodId, quantity = 1) => {
    if (!isLoggedIn) {
      showToast('Please sign in to add items to your healthy cart', 'info');
      return false;
    }

    const res = await api.post('/cart/add/', { food_id: foodId, quantity });
    if (res.success && res.data) {
      setCart(res.data);
      showToast('Added to your healthy cart!', 'success');
      return true;
    } else {
      showToast(res.message || 'Could not add to cart', 'error');
      return false;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!isLoggedIn) return;
    const res = await api.put(`/cart/${itemId}/`, { quantity });
    if (res.success && res.data) {
      setCart(res.data);
    }
  };

  const removeItem = async (itemId) => {
    if (!isLoggedIn) return;
    const res = await api.delete(`/cart/${itemId}/`);
    if (res.success && res.data) {
      setCart(res.data);
      showToast('Item removed from cart', 'info');
    }
  };

  const clearCart = async () => {
    if (!isLoggedIn) return;
    const res = await api.delete('/cart/clear/');
    if (res.success && res.data) {
      setCart(res.data);
      showToast('Cart cleared', 'info');
    }
  };

  const totalCount = (cart.items || []).reduce((acc, i) => acc + (i.quantity || 1), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        items: cart.items || [],
        totalCount,
        subtotal: parseFloat(cart.subtotal || 0).toFixed(2),
        deliveryCharge: parseFloat(cart.delivery_charge || 30).toFixed(2),
        total: parseFloat(cart.total || 0).toFixed(2),
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        fetchCart,
        loading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
