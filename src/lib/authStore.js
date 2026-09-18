// src/lib/authStore.js
import { create } from 'zustand';
import { authApi } from './api';

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,

  initAuth: () => {
    if (typeof window === 'undefined') return;
    try {
      const accessToken = localStorage.getItem('hpdc_access_token');
      const refreshToken = localStorage.getItem('hpdc_refresh_token');
      const userStr = localStorage.getItem('hpdc_user');

      if (accessToken && userStr) {
        const user = JSON.parse(userStr);
        set({
          accessToken,
          refreshToken,
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch {
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  setAuth: ({ user, accessToken, refreshToken }) => {
    if (typeof window !== 'undefined') {
      if (accessToken) localStorage.setItem('hpdc_access_token', accessToken);
      if (refreshToken) localStorage.setItem('hpdc_refresh_token', refreshToken);
      if (user) localStorage.setItem('hpdc_user', JSON.stringify(user));
    }
    set({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  updateUser: (userData) => {
    const updated = { ...get().user, ...userData };
    if (typeof window !== 'undefined') {
      localStorage.setItem('hpdc_user', JSON.stringify(updated));
    }
    set({ user: updated });
  },

  logout: async () => {
    const token = get().refreshToken;
    try {
      if (token) {
        await authApi.logout(token);
      }
    } catch (err) {
      console.warn('Logout API failed:', err);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('hpdc_access_token');
        localStorage.removeItem('hpdc_refresh_token');
        localStorage.removeItem('hpdc_user');
      }
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
      if (typeof window !== 'undefined') {
        window.location.href = '/signin';
      }
    }
  },
}));
