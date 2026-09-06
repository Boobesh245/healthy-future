/**
 * Healthy Future - Authentication Manager
 * Handles login, registration, JWT token storage, user roles and UI updates
 */

const Auth = {
  getUser() {
    try {
      const userStr = localStorage.getItem('hf_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('hf_access_token');
  },

  isLoggedIn() {
    return !!this.getToken() && !!this.getUser();
  },

  getRole() {
    const user = this.getUser();
    return user ? (user.role || 'customer') : null;
  },

  setAuth(user, accessToken, refreshToken) {
    if (user) localStorage.setItem('hf_user', JSON.stringify(user));
    if (accessToken) localStorage.setItem('hf_access_token', accessToken);
    if (refreshToken) localStorage.setItem('hf_refresh_token', refreshToken);
    this.updateNavUI();
  },

  clearAuth() {
    localStorage.removeItem('hf_user');
    localStorage.removeItem('hf_access_token');
    localStorage.removeItem('hf_refresh_token');
    this.updateNavUI();
  },

  async login(username, password) {
    const res = await Api.post('/auth/login/', { username, password });
    if (res.success && res.data) {
      this.setAuth(res.data.user, res.data.access, res.data.refresh);
    }
    return res;
  },

  async register(customerData) {
    const res = await Api.post('/auth/register/', customerData);
    if (res.success && res.data) {
      this.setAuth(res.data.user, res.data.access, res.data.refresh);
    }
    return res;
  },

  async logout() {
    try {
      await Api.post('/auth/logout/', { refresh: localStorage.getItem('hf_refresh_token') });
    } catch (e) {}
    this.clearAuth();
    window.location.href = '/frontend/login.html';
  },

  updateNavUI() {
    const authContainer = document.getElementById('nav-auth-container');
    if (!authContainer) return;

    const user = this.getUser();
    if (user) {
      let rolePortalLink = '';
      if (user.role === 'admin') {
        rolePortalLink = `<li><a class="dropdown-item fw-bold text-success" href="/frontend/admin/index.html"><i class="bi bi-shield-check me-2"></i>Admin Portal</a></li>`;
      } else if (user.role === 'hotel_owner') {
        rolePortalLink = `<li><a class="dropdown-item fw-bold text-success" href="/frontend/owner/index.html"><i class="bi bi-shop me-2"></i>Owner Dashboard</a></li>`;
      }

      authContainer.innerHTML = `
        <div class="dropdown">
          <button class="btn btn-outline-secondary dropdown-toggle d-flex align-items-center gap-2 py-1 px-3 rounded-pill" type="button" data-bs-toggle="dropdown">
            <i class="bi bi-person-circle fs-5 text-success"></i>
            <span class="fw-bold">${user.first_name || user.username}</span>
          </button>
          <ul class="dropdown-menu dropdown-menu-end shadow-sm">
            ${rolePortalLink}
            <li><a class="dropdown-item" href="/frontend/orders.html"><i class="bi bi-bag-check me-2"></i>My Orders</a></li>
            <li><a class="dropdown-item" href="/frontend/profile.html"><i class="bi bi-person-gear me-2"></i>My Profile</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item text-danger" href="javascript:void(0)" onclick="Auth.logout()"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
          </ul>
        </div>
      `;
    } else {
      authContainer.innerHTML = `
        <div class="d-flex align-items-center gap-2">
          <a href="/frontend/login.html" class="btn btn-outline-custom py-1 px-3 rounded-pill text-nowrap">Sign In</a>
          <a href="/frontend/register.html" class="btn btn-primary-custom py-1 px-3 rounded-pill text-nowrap">Sign Up</a>
        </div>
      `;
    }
  },

  requireAuth(allowedRoles = []) {
    if (!this.isLoggedIn()) {
      window.location.href = `/frontend/login.html?redirect=${encodeURIComponent(window.location.pathname)}`;
      return false;
    }
    if (allowedRoles.length > 0) {
      const currentRole = this.getRole();
      if (!allowedRoles.includes(currentRole)) {
        alert('Access denied: You do not have permission to view this page.');
        window.location.href = '/frontend/index.html';
        return false;
      }
    }
    return true;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Auth.updateNavUI();
});
