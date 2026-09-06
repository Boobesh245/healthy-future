/**
 * Healthy Future - API Client
 * Configurable REST API bridge with JWT authentication handling
 */

// Dynamically use origin if hosted with backend, or default to 127.0.0.1:8000/api
const API_BASE_URL = window.API_BASE_URL || (
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:8000/api'
    : '/api'
);

const Api = {
  baseUrl: API_BASE_URL,

  getHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders
    };
    const token = localStorage.getItem('hf_access_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const config = {
      ...options,
      headers: this.getHeaders(options.headers || {})
    };

    try {
      const response = await fetch(url, config);

      if (response.status === 204) {
        return { success: true, data: {} };
      }

      const data = await response.json();

      if (!response.ok) {
        // If token expired, clear tokens if 401 on protected route
        if (response.status === 401 && !endpoint.includes('/auth/login')) {
          // Token expired or invalid
          console.warn('Session expired or unauthorized');
        }
        return {
          success: false,
          status: response.status,
          message: data.message || 'Request failed',
          errors: data.errors || data
        };
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      return {
        success: false,
        message: 'Network error or server unreachable. Please check if the backend is running.',
        errors: { detail: error.message }
      };
    }
  },

  get(endpoint, params = {}) {
    let query = '';
    const cleanParams = {};
    for (const [key, val] of Object.entries(params)) {
      if (val !== undefined && val !== null && val !== '') {
        cleanParams[key] = val;
      }
    }
    const searchParams = new URLSearchParams(cleanParams).toString();
    if (searchParams) {
      query = (endpoint.includes('?') ? '&' : '?') + searchParams;
    }
    return this.request(`${endpoint}${query}`, { method: 'GET' });
  },

  post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
};
