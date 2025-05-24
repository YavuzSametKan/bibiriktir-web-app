import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Axios instance oluştur
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Request interceptor - her istekte token'ı ekle
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const transactionService = {
  // Tüm işlemleri getir
  getAllTransactions: async (params = {}) => {
    try {
      const response = await api.get('/transactions', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // İşlem detayını getir
  getTransaction: async (id) => {
    try {
      const response = await api.get(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Yeni işlem oluştur
  createTransaction: async (transactionData) => {
    try {
      // FormData'yı doğrudan gönder
      console.log('Yeni işlem oluşturuluyor:', {
        data: Object.fromEntries(transactionData.entries())
      });

      const response = await api.post('/transactions', transactionData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('API yanıtı:', response.data);
      return response.data;
    } catch (error) {
      console.error('API hatası:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  },

  // İşlem güncelle
  updateTransaction: async (id, transactionData) => {
    try {
      // FormData'yı doğrudan gönder
      console.log('İşlem güncelleniyor:', {
        id,
        data: Object.fromEntries(transactionData.entries())
      });

      const response = await api.put(`/transactions/${id}`, transactionData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('API yanıtı:', response.data);
      return response.data;
    } catch (error) {
      console.error('API hatası:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  },

  // İşlem sil
  deleteTransaction: async (id) => {
    try {
      const response = await api.delete(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}; 