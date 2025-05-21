import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, subMonths, getMonth, getYear } from 'date-fns';
import { tr } from 'date-fns/locale';
import { ChartBarIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard({ transactions, selectedDate }) {
  const [showChart, setShowChart] = useState(false);

  const {
    currentMonthIncome,
    currentMonthExpense,
    previousMonthIncome,
    previousMonthExpense,
    incomeChange,
    expenseChange,
    chartData
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

    // Grafik verilerini hazırla
    const chartData = {
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
        chartData.datasets[0].data[day] += transaction.amount;
      } else {
        chartData.datasets[1].data[day] += transaction.amount;
      }
    });

    return {
      currentMonthIncome,
      currentMonthExpense,
      previousMonthIncome,
      previousMonthExpense,
      incomeChange,
      expenseChange,
      chartData
    };
  }, [transactions, selectedDate]);

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
        onClick={() => setShowChart(!showChart)}
        className="flex items-center justify-center w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors mb-4"
      >
        <ChartBarIcon className="h-5 w-5 mr-2" />
        {showChart ? 'Grafiği Gizle' : 'Grafiği Göster'}
      </button>

      {showChart && (
        <div className="h-64">
          <Line
            data={chartData}
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
      )}
    </div>
  );
}

export default Dashboard; 