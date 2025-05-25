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
  const [currentMonthTransactions, setCurrentMonthTransactions] = useState([]);
  const [previousMonthTransactions, setPreviousMonthTransactions] = useState([]);
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
      // Seçili ay
      const startDate = format(startOfMonth(date), 'dd.MM.yyyy-HH:mm');
      const endDate = format(endOfMonth(date), 'dd.MM.yyyy-HH:mm');
      // Önceki ay
      const prevDate = new Date(date);
      prevDate.setMonth(prevDate.getMonth() - 1);
      const prevStartDate = format(startOfMonth(prevDate), 'dd.MM.yyyy-HH:mm');
      const prevEndDate = format(endOfMonth(prevDate), 'dd.MM.yyyy-HH:mm');

      // API çağrıları
      const [currentRes, prevRes] = await Promise.all([
        transactionService.getAllTransactions({ startDate, endDate, sort: '-date' }),
        transactionService.getAllTransactions({ startDate: prevStartDate, endDate: prevEndDate, sort: '-date' })
      ]);

      if (currentRes.success) setCurrentMonthTransactions(currentRes.data);
      if (prevRes.success) setPreviousMonthTransactions(prevRes.data);
      // Eski tekli state'i de güncel tutmak için:
      setTransactions(currentRes.success ? currentRes.data : []);
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
        // State'i güncelle
        setCurrentMonthTransactions(prev => [...prev, response.data]);
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
      const response = await transactionService.updateTransaction(id, transactionData);
      if (response.success) {
        // State'i güncelle
        setCurrentMonthTransactions(prev =>
          prev.map(transaction =>
            transaction._id === id ? response.data : transaction
          )
        );
        setTransactions(prev =>
          prev.map(transaction =>
            transaction._id === id ? response.data : transaction
          )
        );
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
        // State'i güncelle
        setCurrentMonthTransactions(prev =>
          prev.filter(transaction => transaction._id !== id)
        );
        setTransactions(prev =>
          prev.filter(transaction => transaction._id !== id)
        );
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
        transactions: currentMonthTransactions,
        previousMonthTransactions,
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