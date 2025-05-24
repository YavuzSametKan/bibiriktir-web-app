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
      const response = await api.post('/transactions', transactionData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // İşlem güncelle
  updateTransaction: async (id, transactionData) => {
    try {
      const response = await api.put(`/transactions/${id}`, transactionData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
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
  },

  // Açıklama autocomplete
  getDescriptionSuggestions: async (query, categoryId, type) => {
    try {
      const params = new URLSearchParams();
      params.append('query', query);
      if (type) params.append('type', type);

      console.log('API isteği:', {
        url: '/transactions/description-suggestions',
        params: Object.fromEntries(params)
      });

      const response = await api.get(`/transactions/description-suggestions?${params}`);
      console.log('API yanıtı:', response.data);
      return response.data;
    } catch (error) {
      console.error('API hatası:', error);
      throw error.response?.data || error.message;
    }
  }
}; 