import { createContext, useContext, useState, useEffect } from 'react';
import { transactionService } from '../services/transactionService';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const TransactionContext = createContext();

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // İşlemleri yükle
  const loadTransactions = async (params = {}) => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await transactionService.getAllTransactions(params);
      if (response.success) {
        setTransactions(response.data);
      }
    } catch (error) {
      setError(error.message);
      toast.error('İşlemler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Yeni işlem ekle
  const addTransaction = async (transactionData) => {
    if (!isAuthenticated) {
      toast.error('Bu işlem için giriş yapmanız gerekiyor');
      return false;
    }

    try {
      const response = await transactionService.createTransaction(transactionData);
      if (response.success) {
        setTransactions(prev => [...prev, response.data]);
        return true;
      }
    } catch (error) {
      toast.error(error.error || 'İşlem eklenirken bir hata oluştu');
      return false;
    }
  };

  // İşlem güncelle
  const updateTransaction = async (id, transactionData) => {
    if (!isAuthenticated) {
      toast.error('Bu işlem için giriş yapmanız gerekiyor');
      return false;
    }

    try {
      // FormData'yı doğrudan gönder
      const response = await transactionService.updateTransaction(id, transactionData);
      console.log('API yanıtı:', response);

      if (response && response.success) {
        // Güncellenmiş işlemi al
        const updatedTransaction = await transactionService.getTransaction(id);
        console.log('Güncellenmiş işlem:', updatedTransaction);

        // State'i güncelle
        setTransactions(prev =>
          prev.map(transaction =>
            transaction._id === id ? updatedTransaction.data : transaction
          )
        );
        return response;
      } else {
        console.error('Güncelleme başarısız:', response);
        return response;
      }
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      return error;
    }
  };

  // İşlem sil
  const deleteTransaction = async (id) => {
    if (!isAuthenticated) {
      toast.error('Bu işlem için giriş yapmanız gerekiyor');
      return false;
    }

    try {
      const response = await transactionService.deleteTransaction(id);
      if (response.success) {
        setTransactions(prev => prev.filter(transaction => transaction._id !== id));
        toast.success('İşlem başarıyla silindi');
        return true;
      }
    } catch (error) {
      toast.error(error.error || 'İşlem silinirken bir hata oluştu');
      return false;
    }
  };

  // İlk yüklemede ve authentication durumu değiştiğinde işlemleri getir
  useEffect(() => {
    loadTransactions();
  }, [isAuthenticated]);

  const value = {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    loadTransactions
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}; 