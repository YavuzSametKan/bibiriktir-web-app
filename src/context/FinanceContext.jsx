import { createContext, useContext, useState } from 'react';
import { categories as initialCategories, transactions as initialTransactions } from '../data/mockData';

const FinanceContext = createContext();

export function FinanceProvider({ children }) {
  const [categories, setCategories] = useState(initialCategories);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const handleAddTransaction = (transaction) => {
    setTransactions([...transactions, { ...transaction, id: Date.now() }]);
  };

  const handleUpdateTransaction = (updatedTransaction) => {
    setTransactions(transactions.map(t => 
      t.id === updatedTransaction.id ? updatedTransaction : t
    ));
  };

  const handleDeleteTransaction = (transactionId) => {
    setTransactions(transactions.filter(t => t.id !== transactionId));
  };

  const handleAddCategory = (category) => {
    setCategories([...categories, { ...category, id: Date.now() }]);
  };

  const handleUpdateCategory = (updatedCategory) => {
    setCategories(categories.map(c => 
      c.id === updatedCategory.id ? updatedCategory : c
    ));
  };

  const handleDeleteCategory = (categoryId) => {
    setCategories(categories.filter(c => c.id !== categoryId));
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