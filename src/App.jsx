import { useState, useEffect } from 'react';
import { categories as initialCategories, transactions as initialTransactions } from './data/mockData';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import AddTransactionButton from './components/AddTransactionButton';
import CategoryManagementButton from './components/CategoryManagementButton';
import TransactionModal from './components/TransactionModal';
import CategoryModal from './components/CategoryModal';
import MonthSelector from './components/MonthSelector';
import { format, getMonth, getYear } from 'date-fns';

function App() {
  const [categories, setCategories] = useState(initialCategories);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const filteredTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return (
      getMonth(transactionDate) === getMonth(selectedDate) &&
      getYear(transactionDate) === getYear(selectedDate)
    );
  });

  const handleMonthChange = (newDate) => {
    setSelectedDate(newDate);
  };

  useEffect(() => {
    console.log('App - Initial Transactions:', transactions);
  }, [transactions]);

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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Kişisel Finans</h1>
          <CategoryManagementButton onClick={() => setIsCategoryModalOpen(true)} />
        </div>

        <MonthSelector onMonthChange={handleMonthChange} />

        <Dashboard transactions={filteredTransactions} />

        {filteredTransactions.length > 0 ? (
          <TransactionList
            transactions={filteredTransactions}
            categories={categories}
            onTransactionClick={(transaction) => {
              setSelectedTransaction(transaction);
              setIsTransactionModalOpen(true);
            }}
          />
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-xl text-gray-600">Bu ay için veri bulunmamaktadır.</p>
          </div>
        )}

        <AddTransactionButton onClick={() => {
          setSelectedTransaction(null);
          setIsTransactionModalOpen(true);
        }} />

        <TransactionModal
          isOpen={isTransactionModalOpen}
          onClose={() => {
            setIsTransactionModalOpen(false);
            setSelectedTransaction(null);
          }}
          categories={categories}
          transaction={selectedTransaction}
          onAdd={handleAddTransaction}
          onUpdate={handleUpdateTransaction}
          onDelete={handleDeleteTransaction}
        />

        <CategoryModal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          categories={categories}
          onAdd={handleAddCategory}
          onUpdate={handleUpdateCategory}
          onDelete={handleDeleteCategory}
        />
      </div>
    </div>
  );
}

export default App;
