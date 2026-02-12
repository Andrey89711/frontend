import { defineStore } from 'pinia';
import api from '../config/api';
import axios from 'axios';

// Типы для ошибок
interface AuthError {
  response?: {
    data?: {
      error?: string;
      [key: string]: any;
    };
    status?: number;
  };
  [key: string]: any;
}

interface RegisterError {
  response?: {
    data?: {
      [key: string]: string[];
    };
  };
  [key: string]: any;
}

interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  date_joined?: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as UserProfile | null,
    accessToken: localStorage.getItem('access_token') || null,
    refreshToken: localStorage.getItem('refresh_token') || null,
    isAuthenticated: !!localStorage.getItem('access_token'),
  }),

  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated,
  },

  actions: {
    async login(credentials: { username: string; password: string }) {
      try {
        const response = await api.post('/auth/login/', credentials);
        const { access, refresh, user } = response.data;

        this.accessToken = access;
        this.refreshToken = refresh;
        this.user = user;
        this.isAuthenticated = true;

        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('user', JSON.stringify(user));

        return { success: true, user };
      } catch (error) {
        const err = error as AuthError;
        // ИСПРАВЛЕНО: Убраны пробелы в опциональной цепочке
        return {
          success: false,
          error: err.response?.data?.error || 'Ошибка входа',
        };
      }
    },

    async register(userData: any) {
      try {
        const response = await api.post('/auth/register/', userData);
        return { success: true, response: response.data };
      } catch (error) {
        const err = error as RegisterError;
        const errors = err.response?.data || { error: 'Ошибка регистрации' };
        return { success: false, errors };
      }
    },

    async fetchUserProfile() {
      try {
        const response = await api.get('/auth/me/');
        this.user = response.data;
        localStorage.setItem('user', JSON.stringify(response.data));
        return { success: true, user: response.data };
      } catch (error) {
        const err = error as AuthError;
        return { success: false, error: 'Не удалось загрузить профиль' };
      }
    },

    async logout() {
      try {
        if (this.refreshToken) {
          await api.post('/auth/logout/', {
            refresh: this.refreshToken,
          });
        }
      } catch (error) {
        console.error('Ошибка при выходе:', error);
      } finally {
        this.user = null;
        this.accessToken = null;
        this.refreshToken = null;
        this.isAuthenticated = false;

        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
      }
    },

    async refreshToken() {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/auth/token/refresh/`,
          { refresh: this.refreshToken }
        );

        this.accessToken = response.data.access;
        localStorage.setItem('access_token', response.data.access);

        return { success: true };
      } catch (error) {
        this.logout();
        return { success: false };
      }
    },

    initializeAuth() {
      const token = localStorage.getItem('access_token');
      const user = localStorage.getItem('user');

      if (token) {
        this.isAuthenticated = true;
        this.accessToken = token;
      }

      if (user) {
        this.user = JSON.parse(user);
      }
    },
  },
});