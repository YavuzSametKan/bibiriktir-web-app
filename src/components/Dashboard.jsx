import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, subMonths, getMonth, getYear } from 'date-fns';
import { tr } from 'date-fns/locale';
import { ChartBarIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
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

function Dashboard({ transactions, selectedDate, categories }) {
  const [showCharts, setShowCharts] = useState(false);

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
    // Seçili ayın işlemleri
    const currentMonthTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return (
        getMonth(transactionDate) === getMonth(selectedDate) &&
        getYear(transactionDate) === getYear(selectedDate)
      );
    });

    // Önceki ayın işlemleri
    const previousMonthDate = subMonths(selectedDate, 1);
    const previousMonthTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return (
        getMonth(transactionDate) === getMonth(previousMonthDate) &&
        getYear(transactionDate) === getYear(previousMonthDate)
      );
    });

    // Seçili ayın toplam gelir ve giderleri
    const currentMonthIncome = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const currentMonthExpense = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Önceki ayın toplam gelir ve giderleri
    const previousMonthIncome = previousMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const previousMonthExpense = previousMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Yüzde değişimleri hesapla
    const incomeChange = previousMonthIncome === 0 
      ? 0 
      : ((currentMonthIncome - previousMonthIncome) / previousMonthIncome) * 100;

    const expenseChange = previousMonthExpense === 0 
      ? 0 
      : ((currentMonthExpense - previousMonthExpense) / previousMonthExpense) * 100;

    // Çizgi grafik verilerini hazırla
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

    // Günlük gelir ve giderleri hesapla
    currentMonthTransactions.forEach(transaction => {
      const day = new Date(transaction.date).getDate() - 1;
      if (transaction.type === 'income') {
        lineChartData.datasets[0].data[day] += transaction.amount;
      } else {
        lineChartData.datasets[1].data[day] += transaction.amount;
      }
    });

    // Gelir kategorilerine göre grupla
    const incomeByCategory = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => {
        const category = categories.find(c => c.id === t.categoryId);
        if (category) {
          acc[category.name] = (acc[category.name] || 0) + t.amount;
        }
        return acc;
      }, {});

    // Gider kategorilerine göre grupla
    const expenseByCategory = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        const category = categories.find(c => c.id === t.categoryId);
        if (category) {
          acc[category.name] = (acc[category.name] || 0) + t.amount;
        }
        return acc;
      }, {});

    // Gelir pasta grafiği verilerini hazırla
    const incomePieData = {
      labels: Object.keys(incomeByCategory),
      datasets: [{
        data: Object.values(incomeByCategory),
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',  // Mavi
          'rgba(255, 206, 86, 0.8)',  // Sarı
          'rgba(75, 192, 192, 0.8)',  // Turkuaz
          'rgba(153, 102, 255, 0.8)', // Mor
          'rgba(255, 159, 64, 0.8)',  // Turuncu
          'rgba(199, 199, 199, 0.8)', // Gri
          'rgba(83, 102, 255, 0.8)',  // Lacivert
          'rgba(40, 159, 64, 0.8)',   // Koyu Yeşil
          'rgba(210, 199, 199, 0.8)', // Açık Gri
          'rgba(78, 205, 196, 0.8)',  // Açık Turkuaz
        ],
        borderWidth: 1,
      }],
    };

    // Gider pasta grafiği verilerini hazırla
    const expensePieData = {
      labels: Object.keys(expenseByCategory),
      datasets: [{
        data: Object.values(expenseByCategory),
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',  // Mavi
          'rgba(255, 206, 86, 0.8)',  // Sarı
          'rgba(75, 192, 192, 0.8)',  // Turkuaz
          'rgba(153, 102, 255, 0.8)', // Mor
          'rgba(255, 159, 64, 0.8)',  // Turuncu
          'rgba(199, 199, 199, 0.8)', // Gri
          'rgba(83, 102, 255, 0.8)',  // Lacivert
          'rgba(40, 159, 64, 0.8)',   // Koyu Yeşil
          'rgba(210, 199, 199, 0.8)', // Açık Gri
          'rgba(78, 205, 196, 0.8)',  // Açık Turkuaz
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
  }, [transactions, selectedDate, categories]);

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-green-800 mb-2">Toplam Gelir</h3>
          <div className="text-3xl font-bold text-green-600 mb-2">
            {currentMonthIncome.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
          </div>
          <div className="flex items-center text-sm">
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
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800 mb-2">Toplam Gider</h3>
          <div className="text-3xl font-bold text-red-600 mb-2">
            {currentMonthExpense.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
          </div>
          <div className="flex items-center text-sm">
            <span className={`font-medium ${expenseChange >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {expenseChange >= 0 ? '+' : ''}{expenseChange.toFixed(1)}% geçen aya göre
            </span>
            {expenseChange !== 0 && (
              expenseChange > 0 ? (
                <ArrowUpIcon className="h-4 w-4 ml-1 text-red-600" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 ml-1 text-green-600" />
              )
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowCharts(!showCharts)}
        className="flex items-center justify-center w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors mb-4"
      >
        <ChartBarIcon className="h-5 w-5 mr-2" />
        {showCharts ? 'Grafikleri Gizle' : 'Grafikleri Göster'}
      </button>

      {showCharts && (
        <div className="grid grid-cols-1 gap-6 transition-all duration-300 ease-in-out">
          <div className="h-64">
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
              <div className="h-80 flex flex-col items-center">
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
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">Bu ay için gelir verisi bulunmamaktadır.</p>
              </div>
            )}

            {Object.keys(expensePieData.labels).length > 0 ? (
              <div className="h-80 flex flex-col items-center">
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
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">Bu ay için gider verisi bulunmamaktadır.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard; 