import axios from 'axios';

const API_URL = 'http://localhost:3000/api/goals';

// Axios instance oluştur
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

// Request interceptor - her istekte token'ı ekle
axiosInstance.interceptors.request.use(
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

// Response interceptor - hata yönetimi
axiosInstance.interceptors.response.use(
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

const goalsService = {
  // Hedef oluşturma
  createGoal: async (goalData) => {
    try {
      const response = await axiosInstance.post('', goalData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Hedef oluşturulurken bir hata oluştu' };
    }
  },

  // Hedef güncelleme
  updateGoal: async (goalId, goalData) => {
    try {
      const response = await axiosInstance.put(`/${goalId}`, goalData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Hedef güncellenirken bir hata oluştu' };
    }
  },

  // Hedefleri listeleme
  getGoals: async () => {
    try {
      const response = await axiosInstance.get('');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Hedefler yüklenirken bir hata oluştu' };
    }
  },

  // Hedef detayı
  getGoalDetails: async (goalId) => {
    try {
      const response = await axiosInstance.get(`/${goalId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Hedef detayları yüklenirken bir hata oluştu' };
    }
  },

  // Hedefe katkı ekleme
  addContribution: async (goalId, contributionData) => {
    if (!goalId) {
      throw new Error('Hedef ID\'si gerekli');
    }

    if (!contributionData || !contributionData.amount) {
      throw new Error('Katkı miktarı gerekli');
    }

    try {
      console.log('Katkı ekleme isteği:', {
        url: `/${goalId}/contributions`,
        data: contributionData
      });

      const response = await axiosInstance.post(`/${goalId}/contributions`, contributionData);
      
      console.log('Katkı ekleme yanıtı:', response.data);

      if (!response.data) {
        throw new Error('Sunucudan yanıt alınamadı');
      }

      return {
        success: true,
        data: response.data,
        message: 'Katkı başarıyla eklendi'
      };
    } catch (error) {
      console.error('Katkı ekleme hatası:', {
        goalId,
        contributionData,
        error: error.response?.data || error.message,
        status: error.response?.status
      });

      if (error.response?.status === 401) {
        throw new Error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
      }

      if (error.response?.status === 404) {
        throw new Error('Hedef bulunamadı');
      }

      if (error.response?.status === 400) {
        throw new Error(error.response.data.message || 'Geçersiz katkı verisi');
      }

      throw new Error(error.response?.data?.message || 'Katkı eklenirken bir hata oluştu');
    }
  },

  // Hedef katkısını güncelleme
  updateContribution: async (goalId, contributionId, contributionData) => {
    try {
      console.log('Katkı güncelleme isteği:', {
        goalId,
        contributionId,
        contributionData
      });

      if (!goalId) {
        throw new Error('Hedef ID\'si gerekli');
      }

      if (!contributionId) {
        throw new Error('Katkı ID\'si gerekli');
      }

      if (!contributionData || !contributionData.amount) {
        throw new Error('Katkı miktarı gerekli');
      }

      const response = await axiosInstance.put(`/${goalId}/contributions/${contributionId}`, contributionData);
      console.log('Katkı güncelleme yanıtı:', response.data);

      if (!response.data) {
        throw new Error('Sunucudan yanıt alınamadı');
      }

      return {
        success: true,
        data: response.data,
        message: 'Katkı başarıyla güncellendi'
      };
    } catch (error) {
      console.error('Katkı güncelleme hatası:', {
        goalId,
        contributionId,
        contributionData,
        error: error.response?.data || error.message,
        status: error.response?.status
      });

      if (error.response?.status === 401) {
        throw new Error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
      }

      if (error.response?.status === 404) {
        throw new Error('Hedef veya katkı bulunamadı');
      }

      if (error.response?.status === 400) {
        throw new Error(error.response.data.message || 'Geçersiz katkı verisi');
      }

      throw new Error(error.response?.data?.message || 'Katkı güncellenirken bir hata oluştu');
    }
  },

  // Hedef katkısını silme
  deleteContribution: async (goalId, contributionId) => {
    try {
      const response = await axiosInstance.delete(`/${goalId}/contributions/${contributionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Katkı silinirken bir hata oluştu' };
    }
  },

  // Hedef silme
  deleteGoal: async (goalId) => {
    try {
      const response = await axiosInstance.delete(`/${goalId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Hedef silinirken bir hata oluştu' };
    }
  },

  // Hedef istatistikleri
  getGoalStatistics: async () => {
    try {
      const response = await axiosInstance.get('/statistics');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'İstatistikler yüklenirken bir hata oluştu' };
    }
  }
};

export default goalsService; 