/**
 * Healthy Future - Cart Manager
 * Synchronizes cart with backend API and updates badge UI
 */

const Cart = {
  data: {
    items: [],
    subtotal: 0,
    delivery_charge: 30,
    total: 30
  },

  async fetchCart() {
    if (!Auth.isLoggedIn()) {
      const localCart = localStorage.getItem('hf_local_cart');
      if (localCart) {
        try {
          this.data = JSON.parse(localCart);
        } catch (e) {}
      }
      this.updateCounterBadge();
      return this.data;
    }

    const res = await Api.get('/cart/');
    if (res.success && res.data) {
      this.data = res.data;
      this.updateCounterBadge();
    }
    return this.data;
  },

  async addToCart(foodId, quantity = 1) {
    if (!Auth.isLoggedIn()) {
      showToast('Please sign in to add items to your healthy cart', 'info');
      setTimeout(() => {
        window.location.href = `/frontend/login.html?redirect=${encodeURIComponent(window.location.pathname)}`;
      }, 1200);
      return;
    }

    const res = await Api.post('/cart/add/', { food_id: foodId, quantity });
    if (res.success && res.data) {
      this.data = res.data;
      this.updateCounterBadge();
      showToast('Added to your healthy cart!', 'success');
    } else {
      showToast(res.message || 'Could not add to cart', 'error');
    }
    return res;
  },

  async updateQuantity(itemId, quantity) {
    if (!Auth.isLoggedIn()) return;
    const res = await Api.put(`/cart/${itemId}/`, { quantity });
    if (res.success && res.data) {
      this.data = res.data;
      this.updateCounterBadge();
    }
    return res;
  },

  async removeItem(itemId) {
    if (!Auth.isLoggedIn()) return;
    const res = await Api.delete(`/cart/${itemId}/`);
    if (res.success && res.data) {
      this.data = res.data;
      this.updateCounterBadge();
      showToast('Item removed from cart', 'info');
    }
    return res;
  },

  async clearCart() {
    if (!Auth.isLoggedIn()) return;
    const res = await Api.delete('/cart/clear/');
    if (res.success && res.data) {
      this.data = res.data;
      this.updateCounterBadge();
      showToast('Cart cleared', 'info');
    }
    return res;
  },

  updateCounterBadge() {
    const badges = document.querySelectorAll('.cart-count');
    const totalQty = (this.data.items || []).reduce((acc, item) => acc + (item.quantity || 1), 0);
    badges.forEach(b => {
      b.textContent = totalQty;
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Cart.fetchCart();
});
