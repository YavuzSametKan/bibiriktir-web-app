import { useState, useMemo, useEffect } from 'react';
import { getMonth, getYear, subMonths, addMonths, format, parse } from 'date-fns';
import { ChartBarIcon, ArrowUpIcon, ArrowDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import MonthSelector from '../components/dashboard/MonthSelector';
import TransactionList from '../components/dashboard/TransactionList';
import AddTransactionButton from '../components/dashboard/AddTransactionButton';
import CategoryManagementButton from '../components/dashboard/CategoryManagementButton';
import TransactionModal from '../components/dashboard/TransactionModal';
import CategoryModal from '../components/dashboard/CategoryModal';
import { useFinance } from '../context/FinanceContext';
import Navbar from '../components/common/Navbar';
import { tr } from 'date-fns/locale';
import { useTransactions } from '../context/TransactionContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import { toast } from 'react-toastify';
import CategoryTransactionsModal from '../components/dashboard/CategoryTransactionsModal';
import WelcomeOverlay from '../components/common/WelcomeOverlay';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function DashboardPage() {
  const {
    categories,
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
    handleDeleteCategory
  } = useFinance();

  const { transactions, previousMonthTransactions, loading, selectedDate, setSelectedDate, setTransactions } = useTransactions();
  const [showCharts, setShowCharts] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState(0);
  const [shouldAnimateNumbers, setShouldAnimateNumbers] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCategoryTransactionsModalOpen, setIsCategoryTransactionsModalOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  const {
    currentMonthIncome,
    currentMonthExpense,
    previousMonthIncome,
    previousMonthExpense,
    incomeChange,
    expenseChange,
    lineChartData,
    incomePieData,
    expensePieData
  } = useMemo(() => {
    const currentMonthTransactions = transactions;
    const prevMonthTransactions = previousMonthTransactions || [];

    const currentMonthIncome = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const currentMonthExpense = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const previousMonthIncome = prevMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const previousMonthExpense = prevMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const incomeChange = previousMonthIncome === 0 
      ? (currentMonthIncome === 0 ? 0 : 100) 
      : ((currentMonthIncome - previousMonthIncome) / previousMonthIncome) * 100;

    const expenseChange = previousMonthExpense === 0 
      ? (currentMonthExpense === 0 ? 0 : 100) 
      : ((currentMonthExpense - previousMonthExpense) / previousMonthExpense) * 100;

    const lineChartData = {
      labels: Array.from({ length: 31 }, (_, i) => i + 1),
      datasets: [
        {
          label: 'Gelir',
          data: Array(31).fill(0),
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.5)',
          tension: 0.4,
        },
        {
          label: 'Gider',
          data: Array(31).fill(0),
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
          tension: 0.4,
        },
      ],
    };

    currentMonthTransactions.forEach(transaction => {
      const transactionDate = parse(transaction.date, 'dd.MM.yyyy-HH:mm', new Date());
      const day = transactionDate.getDate() - 1;
      if (transaction.type === 'income') {
        lineChartData.datasets[0].data[day] += transaction.amount;
      } else {
        lineChartData.datasets[1].data[day] += transaction.amount;
      }
    });

    const incomeByCategory = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => {
        if (t.category && t.category.name) {
          acc[t.category.name] = (acc[t.category.name] || 0) + t.amount;
        }
        return acc;
      }, {});

    const expenseByCategory = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        if (t.category && t.category.name) {
          acc[t.category.name] = (acc[t.category.name] || 0) + t.amount;
        }
        return acc;
      }, {});

    const incomePieData = {
      labels: Object.keys(incomeByCategory),
      datasets: [{
        data: Object.values(incomeByCategory),
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(199, 199, 199, 0.8)',
          'rgba(83, 102, 255, 0.8)',
          'rgba(40, 159, 64, 0.8)',
          'rgba(210, 199, 199, 0.8)',
          'rgba(78, 205, 196, 0.8)',
        ],
        borderWidth: 1,
      }],
    };

    const expensePieData = {
      labels: Object.keys(expenseByCategory),
      datasets: [{
        data: Object.values(expenseByCategory),
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(199, 199, 199, 0.8)',
          'rgba(83, 102, 255, 0.8)',
          'rgba(40, 159, 64, 0.8)',
          'rgba(210, 199, 199, 0.8)',
          'rgba(78, 205, 196, 0.8)',
        ],
        borderWidth: 1,
      }],
    };

    return {
      currentMonthIncome,
      currentMonthExpense,
      previousMonthIncome,
      previousMonthExpense,
      incomeChange,
      expenseChange,
      lineChartData,
      incomePieData,
      expensePieData
    };
  }, [transactions, previousMonthTransactions, selectedDate]);

  const filteredTransactions = transactions.filter(t => {
    const transactionDate = parse(t.date, 'dd.MM.yyyy-HH:mm', new Date());
    return (
      getMonth(transactionDate) === getMonth(selectedDate) &&
      getYear(transactionDate) === getYear(selectedDate)
    );
  });

  // Animasyonlu sayı geçişi için spring
  const incomeSpring = useSpring({
    from: { value: 0 },
    to: { value: currentMonthIncome },
    config: { duration: 2000 }, // 2 saniye
    reset: true,
    immediate: !shouldAnimateNumbers
  });

  const expenseSpring = useSpring({
    from: { value: 0 },
    to: { value: currentMonthExpense },
    config: { duration: 2000 }, // 2 saniye
    reset: true,
    immediate: !shouldAnimateNumbers
  });

  const handleDateChange = async (newDate) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setShouldAnimateNumbers(true);
    const oldDate = selectedDate;
    setDirection(newDate > oldDate ? 1 : -1);
    setSelectedDate(newDate);

    // Animasyonun tamamlanması için bekle
    setTimeout(() => {
      setIsTransitioning(false);
      setShouldAnimateNumbers(false);
    }, 500);
  };

  // İşlem kartları için animasyon varyantları
  const cardVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 1
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 1
    })
  };

  const handleCategoryClick = (categoryName, type) => {
    const categoryTransactions = transactions.filter(t => 
      t.category?.name === categoryName && t.type === type
    );
    
    if (categoryTransactions.length > 0) {
      setSelectedCategory({ name: categoryName, type, transactions: categoryTransactions });
      setIsCategoryTransactionsModalOpen(true);
    }
  };

  useEffect(() => {
    // Kullanıcının daha önce giriş yapıp yapmadığını kontrol et
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    
    if (!hasSeenWelcome) {
      setShowWelcome(true);
      // Kullanıcının hoş geldin ekranını gördüğünü kaydet
      localStorage.setItem('hasSeenWelcome', 'true');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <WelcomeOverlay isVisible={showWelcome} onClose={() => setShowWelcome(false)} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Ana Sayfa</h1>
          <MonthSelector
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            disabled={isTransitioning}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-green-50 rounded-lg p-6 shadow">
            <h3 className="text-lg font-medium text-green-800 mb-2">Toplam Gelir</h3>
            <animated.div className="text-3xl font-bold text-green-600 mb-2">
              {incomeSpring.value.to((val) => 
                val.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })
              )}
            </animated.div>
            <div className="flex items-center text-sm">
              {previousMonthIncome === 0 ? (
                <span className="text-gray-600">Önceki aya ait veri bulunmuyor</span>
              ) : currentMonthIncome === 0 ? (
                <span className="text-gray-600">Bu aya ait veri bulunmuyor</span>
              ) : (
                <>
                  <span className={`font-medium ${incomeChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {incomeChange >= 0 ? '+' : ''}{incomeChange.toFixed(1)}% geçen aya göre
                  </span>
                  {incomeChange !== 0 && (
                    incomeChange > 0 ? (
                      <ArrowUpIcon className="h-4 w-4 ml-1 text-green-600" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 ml-1 text-red-600" />
                    )
                  )}
                </>
              )}
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-6 shadow">
            <h3 className="text-lg font-medium text-red-800 mb-2">Toplam Gider</h3>
            <animated.div className="text-3xl font-bold text-red-600 mb-2">
              {expenseSpring.value.to((val) => 
                val.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })
              )}
            </animated.div>
            <div className="flex items-center text-sm">
              {previousMonthExpense === 0 ? (
                <span className="text-gray-600">Önceki aya ait veri bulunmuyor</span>
              ) : currentMonthExpense === 0 ? (
                <span className="text-gray-600">Bu aya ait veri bulunmuyor</span>
              ) : (
                <>
                  <span className={`font-medium ${expenseChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {expenseChange >= 0 ? '+' : ''}{expenseChange.toFixed(1)}% geçen aya göre
                  </span>
                  {expenseChange !== 0 && (
                    expenseChange > 0 ? (
                      <ArrowUpIcon className="h-4 w-4 ml-1 text-red-600" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 ml-1 text-green-600" />
                    )
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Grafikler</h2>
            <button
              onClick={() => setShowCharts(!showCharts)}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
              disabled={isTransitioning}
            >
              {showCharts ? (
                <>
                  <ChartBarIcon className="h-5 w-5" />
                  Grafikleri Gizle
                </>
              ) : (
                <>
                  <ChartBarIcon className="h-5 w-5" />
                  Grafikleri Göster
                </>
              )}
            </button>
          </div>
          <div className={`grid grid-cols-1 gap-6 transition-all duration-500 ease-in-out overflow-hidden ${
            showCharts ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="h-64 bg-white rounded-lg p-4 shadow">
              <Line
                data={lineChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => value.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }),
                      },
                    },
                  },
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(incomePieData.labels).length > 0 ? (
                <div className="h-80 flex flex-col items-center bg-white rounded-lg p-4 shadow">
                  <h4 className="text-center text-lg font-medium text-green-800 mb-1">Gelir Dağılımı</h4>
                  <div className="w-80 h-80">
                    <Pie
                      data={incomePieData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: true,
                            position: 'right',
                            labels: {
                              padding: 8,
                              font: {
                                size: 13
                              }
                            }
                          },
                          tooltip: {
                            callbacks: {
                              label: (context) => {
                                const value = context.raw;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${context.label}: ${value.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })} (${percentage}%)`;
                              },
                            },
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            padding: 8,
                            titleFont: {
                              size: 14,
                              weight: 'bold'
                            },
                            bodyFont: {
                              size: 13
                            }
                          },
                        },
                        onClick: (event, elements) => {
                          if (elements.length > 0) {
                            const index = elements[0].index;
                            const categoryName = incomePieData.labels[index];
                            handleCategoryClick(categoryName, 'income');
                          }
                        },
                        onHover: (event, elements) => {
                          event.native.target.style.cursor = elements.length ? 'pointer' : 'default';
                        }
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center bg-white rounded-lg shadow">
                  <p className="text-gray-500">Bu ay için gelir verisi bulunmamaktadır.</p>
                </div>
              )}

              {Object.keys(expensePieData.labels).length > 0 ? (
                <div className="h-80 flex flex-col items-center bg-white rounded-lg p-4 shadow">
                  <h4 className="text-center text-lg font-medium text-red-800 mb-1">Gider Dağılımı</h4>
                  <div className="w-80 h-80">
                    <Pie
                      data={expensePieData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: true,
                            position: 'right',
                            labels: {
                              padding: 8,
                              font: {
                                size: 13
                              }
                            }
                          },
                          tooltip: {
                            callbacks: {
                              label: (context) => {
                                const value = context.raw;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${context.label}: ${value.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })} (${percentage}%)`;
                              },
                            },
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            padding: 8,
                            titleFont: {
                              size: 14,
                              weight: 'bold'
                            },
                            bodyFont: {
                              size: 13
                            }
                          },
                        },
                        onClick: (event, elements) => {
                          if (elements.length > 0) {
                            const index = elements[0].index;
                            const categoryName = expensePieData.labels[index];
                            handleCategoryClick(categoryName, 'expense');
                          }
                        },
                        onHover: (event, elements) => {
                          event.native.target.style.cursor = elements.length ? 'pointer' : 'default';
                        }
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center bg-white rounded-lg shadow">
                  <p className="text-gray-500">Bu ay için gider verisi bulunmamaktadır.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">İşlemler</h2>
              <CategoryManagementButton 
                onClick={() => setIsCategoryModalOpen(true)}
                disabled={isTransitioning}
              />
            </div>
            <AddTransactionButton 
              onClick={() => setIsTransactionModalOpen(true)}
              disabled={isTransitioning}
            />
          </div>
          
          <div className="relative overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={selectedDate.toISOString()}
                custom={direction}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="w-full"
              >
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
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
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

      <CategoryTransactionsModal
        isOpen={isCategoryTransactionsModalOpen}
        onClose={() => {
          setIsCategoryTransactionsModalOpen(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
        transactions={selectedCategory?.transactions || []}
      />
    </div>
  );
}

export default DashboardPage; 