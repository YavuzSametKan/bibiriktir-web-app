import { createContext, useContext, useState, useEffect } from 'react';
import { categories as initialCategories, transactions as initialTransactions } from '../data/mockData';
import { toast } from 'react-toastify';

const FinanceContext = createContext();

export function FinanceProvider({ children }) {
  const [categories, setCategories] = useState(() => {
    // Başlangıç kategorilerini alfabetik sırala
    return [...initialCategories].sort((a, b) => a.name.localeCompare(b.name, 'tr'));
  });
  const [transactions, setTransactions] = useState(initialTransactions);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Modal kapandığında seçili işlemi sıfırla
  useEffect(() => {
    if (!isTransactionModalOpen) {
      setSelectedTransaction(null);
    }
  }, [isTransactionModalOpen]);

  const handleAddTransaction = (transaction) => {
    setTransactions((prev) => [...prev, { ...transaction, id: Date.now() }]);
    toast.success('İşlem başarıyla eklendi');
    setIsTransactionModalOpen(false);
  };

  const handleUpdateTransaction = (updatedTransaction) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === updatedTransaction.id ? { ...t, ...updatedTransaction } : t))
    );
    toast.success('İşlem başarıyla güncellendi');
    setIsTransactionModalOpen(false);
  };

  const handleDeleteTransaction = (transactionId) => {
    setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
    toast.success('İşlem başarıyla silindi');
    setIsTransactionModalOpen(false);
  };

  const handleAddCategory = (category) => {
    setCategories((prev) => {
      const newCategories = [...prev, { ...category, id: Date.now() }];
      return newCategories.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
    });
    toast.success('Kategori başarıyla eklendi');
  };

  const handleUpdateCategory = (updatedCategory) => {
    setCategories((prev) => {
      const newCategories = prev.map(c => 
        c.id === updatedCategory.id ? updatedCategory : c
      );
      return newCategories.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
    });
    toast.success('Kategori başarıyla güncellendi');
  };

  const handleDeleteCategory = (categoryId) => {
    setCategories((prev) => {
      const newCategories = prev.filter(c => c.id !== categoryId);
      return newCategories.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
    });
    toast.success('Kategori başarıyla silindi');
  };

  const value = {
    categories,
    transactions,
    isTransactionModalOpen,
    setIsTransactionModalOpen,
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    selectedTransaction,
    setSelectedTransaction,
    handleAddTransaction,
    handleUpdateTransaction,
    handleDeleteTransaction,
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
} 