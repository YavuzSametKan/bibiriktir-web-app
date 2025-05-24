import { createContext, useContext, useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const CategoryContext = createContext();

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // Kategorileri yükle
  const loadCategories = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await categoryService.getAllCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      setError(error.message);
      toast.error('Kategoriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Yeni kategori ekle
  const addCategory = async (categoryData) => {
    if (!isAuthenticated) {
      toast.error('Bu işlem için giriş yapmanız gerekiyor');
      return false;
    }

    try {
      const response = await categoryService.createCategory(categoryData);
      if (response.success) {
        setCategories(prev => [...prev, response.data]);
        toast.success('Kategori başarıyla eklendi');
        return true;
      }
    } catch (error) {
      if (error.error === 'Bu isimde ve tipte bir kategori zaten mevcut') {
        toast.error('Bu isimde ve tipte bir kategori zaten mevcut');
      } else {
        toast.error('Kategori eklenirken bir hata oluştu');
      }
      return false;
    }
  };

  // Kategori güncelle
  const updateCategory = async (id, categoryData) => {
    if (!isAuthenticated) {
      toast.error('Bu işlem için giriş yapmanız gerekiyor');
      return false;
    }

    try {
      const response = await categoryService.updateCategory(id, categoryData);
      if (response.success) {
        setCategories(prev =>
          prev.map(category =>
            category._id === id ? response.data : category
          )
        );
        toast.success('Kategori başarıyla güncellendi');
        return true;
      }
    } catch (error) {
      if (error.error === 'Bu isimde ve tipte bir kategori zaten mevcut') {
        toast.error('Bu isimde ve tipte bir kategori zaten mevcut');
      } else {
        toast.error('Kategori güncellenirken bir hata oluştu');
      }
      return false;
    }
  };

  // Kategori sil
  const deleteCategory = async (id) => {
    if (!isAuthenticated) {
      toast.error('Bu işlem için giriş yapmanız gerekiyor');
      return false;
    }

    try {
      const response = await categoryService.deleteCategory(id);
      if (response.success) {
        setCategories(prev => prev.filter(category => category._id !== id));
        toast.success('Kategori başarıyla silindi');
        return true;
      }
    } catch (error) {
      toast.error('Kategori silinirken bir hata oluştu');
      return false;
    }
  };

  // İlk yüklemede ve authentication durumu değiştiğinde kategorileri getir
  useEffect(() => {
    loadCategories();
  }, [isAuthenticated]);

  const value = {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    loadCategories
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
}; 