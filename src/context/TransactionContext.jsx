import { createContext, useContext, useState, useEffect } from 'react';
import { transactionService } from '../services/transactionService';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';
import { format, startOfMonth, endOfMonth } from 'date-fns';

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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { isAuthenticated } = useAuth();

  // İşlemleri yükle
  const loadTransactions = async (date = selectedDate) => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const startDate = format(startOfMonth(date), 'dd.MM.yyyy-HH:mm');
      const endDate = format(endOfMonth(date), 'dd.MM.yyyy-HH:mm');

      const response = await transactionService.getAllTransactions({
        startDate,
        endDate,
        sort: '-date'
      });

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

  // Tarih değiştiğinde işlemleri yeniden yükle
  useEffect(() => {
    loadTransactions();
  }, [selectedDate, isAuthenticated]);

  // Yeni işlem ekle
  const addTransaction = async (transactionData) => {
    if (!isAuthenticated) {
      toast.error('Bu işlem için giriş yapmanız gerekiyor');
      return false;
    }

    try {
      const response = await transactionService.createTransaction(transactionData);
      if (response.success) {
        await loadTransactions();
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
      const response = await transactionService.updateTransaction(id, transactionData);
      if (response.success) {
        await loadTransactions();
        return true;
      }
    } catch (error) {
      toast.error(error.error || 'İşlem güncellenirken bir hata oluştu');
      return false;
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
        await loadTransactions();
        return true;
      }
    } catch (error) {
      toast.error(error.error || 'İşlem silinirken bir hata oluştu');
      return false;
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        loading,
        error,
        selectedDate,
        setSelectedDate,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        loadTransactions
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}; 