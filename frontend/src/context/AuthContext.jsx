import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('hf_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('hf_access_token'));
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const setAuth = (newUser, newAccess, newRefresh) => {
    if (newUser) {
      setUser(newUser);
      localStorage.setItem('hf_user', JSON.stringify(newUser));
    }
    if (newAccess) {
      setToken(newAccess);
      localStorage.setItem('hf_access_token', newAccess);
    }
    if (newRefresh) {
      localStorage.setItem('hf_refresh_token', newRefresh);
    }
  };

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('hf_user');
    localStorage.removeItem('hf_access_token');
    localStorage.removeItem('hf_refresh_token');
  };

  const login = async (username, password) => {
    const res = await api.post('/auth/login/', { username, password });
    if (res.success && res.data) {
      setAuth(res.data.user, res.data.access, res.data.refresh);
      showToast('Login successful!', 'success');
      return { success: true, user: res.data.user };
    }
    showToast(res.message || 'Login failed', 'error');
    return { success: false, message: res.message };
  };

  const register = async (customerData) => {
    const res = await api.post('/auth/register/', customerData);
    if (res.success && res.data) {
      setAuth(res.data.user, res.data.access, res.data.refresh);
      showToast('Registration successful! Welcome to Healthy Future.', 'success');
      return { success: true, user: res.data.user };
    }
    const err = res.errors ? Object.values(res.errors).flat().join(' ') : res.message;
    showToast(err || 'Registration failed', 'error');
    return { success: false, message: err };
  };

  const logout = async () => {
    try {
      const refresh = localStorage.getItem('hf_refresh_token');
      if (refresh) {
        await api.post('/auth/logout/', { refresh });
      }
    } catch (e) {
      console.warn('Logout error', e);
    }
    clearAuth();
    showToast('Signed out successfully', 'info');
  };

  const updateProfile = async (profileData) => {
    const res = await api.put('/auth/profile/', profileData);
    if (res.success && res.data) {
      setUser(res.data);
      localStorage.setItem('hf_user', JSON.stringify(res.data));
      showToast('Profile updated successfully', 'success');
      return { success: true };
    }
    showToast(res.message || 'Update failed', 'error');
    return { success: false };
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn: !!token && !!user,
        role: user ? (user.role || 'customer') : null,
        login,
        register,
        logout,
        updateProfile,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
