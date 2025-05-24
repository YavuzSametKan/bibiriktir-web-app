import axios from 'axios';
import { format, subMonths, subWeeks, subQuarters, subYears } from 'date-fns';

const BASE_URL = 'http://localhost:3000/api/statistics';

// Axios instance oluştur
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Axios interceptor ekle
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Hatası:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// Periyot bazlı istatistikler
const getPeriodStats = async (fromDate, toDate, type = 'all', compareWithPrevious = true) => {
  try {
    console.log('Periyot istatistik isteği:', { fromDate, toDate, type, compareWithPrevious });
    const response = await api.get('/period', {
      params: { fromDate, toDate, type, compareWithPrevious }
    });
    console.log('Periyot istatistik yanıtı:', response.data);
    return response;
  } catch (error) {
    if (error.response?.status === 401) {
      window.location.href = '/login';
      throw new Error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
    }
    throw error;
  }
};

export const statisticsService = {
  // Haftalık istatistikler
  getWeeklyStats: async (week, year, type = 'all') => {
    const currentDate = new Date();
    const endDate = format(currentDate, 'yyyy-MM-dd');
    const startDate = format(subWeeks(currentDate, 1), 'yyyy-MM-dd');
    return getPeriodStats(startDate, endDate, type, true);
  },

  // Aylık istatistikler
  getMonthlyStats: async (month, year, type = 'all') => {
    const currentDate = new Date();
    const endDate = format(currentDate, 'yyyy-MM-dd');
    const startDate = format(subMonths(currentDate, 1), 'yyyy-MM-dd');
    return getPeriodStats(startDate, endDate, type, true);
  },

  // 3 Aylık istatistikler
  getQuarterlyStats: async (quarter, year, type = 'all') => {
    const currentDate = new Date();
    const endDate = format(currentDate, 'yyyy-MM-dd');
    const startDate = format(subQuarters(currentDate, 1), 'yyyy-MM-dd');
    return getPeriodStats(startDate, endDate, type, true);
  },

  // 6 Aylık istatistikler
  getHalfYearlyStats: async (half, year, type = 'all') => {
    const currentDate = new Date();
    const endDate = format(currentDate, 'yyyy-MM-dd');
    const startDate = format(subMonths(currentDate, 6), 'yyyy-MM-dd');
    return getPeriodStats(startDate, endDate, type, true);
  },

  // Yıllık istatistikler
  getYearlyStats: async (year, type = 'all') => {
    const currentDate = new Date();
    const endDate = format(currentDate, 'yyyy-MM-dd');
    const startDate = format(subYears(currentDate, 1), 'yyyy-MM-dd');
    return getPeriodStats(startDate, endDate, type, true);
  },

  // Kategori bazlı istatistikler
  getCategoryStats: async (startDate, endDate, type = 'all') => {
    try {
      console.log('Kategori istatistik isteği:', { startDate, endDate, type });
      const response = await api.get('/categories', {
        params: { startDate, endDate, type }
      });
      console.log('Kategori istatistik yanıtı:', response.data);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        window.location.href = '/login';
        throw new Error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
      }
      throw error;
    }
  },

  // Zaman bazlı trend
  getTrends: async (period, startDate, endDate, type = 'all') => {
    try {
      console.log('Trend istatistik isteği:', { period, startDate, endDate, type });
      const response = await api.get('/trends', {
        params: { period, startDate, endDate, type }
      });
      console.log('Trend istatistik yanıtı:', response.data);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        window.location.href = '/login';
        throw new Error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
      }
      throw error;
    }
  },

  // Özel istatistikler
  getCustomStats: async (metrics, startDate, endDate, type = 'all') => {
    try {
      console.log('Özel istatistik isteği:', { metrics, startDate, endDate, type });
      const response = await api.get('/custom', {
        params: { metrics, startDate, endDate, type }
      });
      console.log('Özel istatistik yanıtı:', response.data);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        window.location.href = '/login';
        throw new Error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
      }
      throw error;
    }
  }
}; 