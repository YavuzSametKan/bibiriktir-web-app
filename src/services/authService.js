import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Axios instance oluştur
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Cookie'leri otomatik gönder
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.error || 'Kayıt işlemi başarısız oldu');
      }
      throw new Error('Sunucuya bağlanılamadı');
    }
  },

  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.error || 'Giriş işlemi başarısız oldu');
      }
      throw new Error('Sunucuya bağlanılamadı');
    }
  },

  async logout() {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.error || 'Çıkış işlemi başarısız oldu');
      }
      throw new Error('Sunucuya bağlanılamadı');
    }
  },

  async checkAuth() {
    try {
      const response = await api.get('/auth/check-auth');
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return { success: false, error: 'Oturum bulunamadı' };
      }
      throw new Error('Kimlik doğrulama hatası');
    }
  },

  isAuthenticated() {
    return this.checkAuth()
      .then(response => response.success)
      .catch(() => false);
  },

  getToken() {
    return localStorage.getItem('token');
  },
}; 