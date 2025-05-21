import { useState, useMemo } from 'react';
import { format, subMonths, subWeeks, startOfMonth, endOfMonth, eachMonthOfInterval, subYears } from 'date-fns';
import { tr } from 'date-fns/locale';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import SegmentedControl from '../components/statistics/SegmentedControl';
import DateRangePicker from '../components/statistics/DateRangePicker';
import LineChart from '../components/statistics/LineChart';
import PieChart from '../components/statistics/PieChart';
import BarChart from '../components/statistics/BarChart';
import CategoryDetailsModal from '../components/statistics/CategoryDetailsModal';
import { useFinance } from '../context/FinanceContext';

const PERIODS = [
  { id: 'weekly', label: 'Haftalık' },
  { id: 'monthly', label: 'Aylık' },
  { id: 'quarterly', label: '3 Aylık' },
  { id: 'halfYearly', label: '6 Aylık' },
  { id: 'yearly', label: 'Yıllık' },
];

const TRANSACTION_TYPES = [
  { id: 'income', label: 'Gelir' },
  { id: 'expense', label: 'Gider' },
];

function StatisticsPage() {
  const { transactions, categories } = useFinance();
  const [selectedType, setSelectedType] = useState('income');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { startDate, endDate } = useMemo(() => {
    const now = new Date();
    switch (selectedPeriod) {
      case 'weekly':
        return {
          startDate: subWeeks(now, 1),
          endDate: now,
        };
      case 'monthly':
        return {
          startDate: subMonths(startOfMonth(now), 2), // Son 3 ayı göster
          endDate: endOfMonth(now),
        };
      case 'quarterly':
        return {
          startDate: subMonths(now, 3),
          endDate: now,
        };
      case 'halfYearly':
        return {
          startDate: subMonths(now, 6),
          endDate: now,
        };
      case 'yearly':
        return {
          startDate: subYears(now, 1),
          endDate: now,
        };
      default:
        return {
          startDate: startOfMonth(now),
          endDate: endOfMonth(now),
        };
    }
  }, [selectedPeriod]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return (
        transaction.type === selectedType &&
        transactionDate >= startDate &&
        transactionDate <= endDate
      );
    });
  }, [transactions, selectedType, startDate, endDate]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Başlık ve Kontroller */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">İstatistikler</h1>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <SegmentedControl
              options={TRANSACTION_TYPES}
              selected={selectedType}
              onChange={setSelectedType}
            />
            
            <DateRangePicker
              period={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
              periods={PERIODS}
            />
          </div>
        </div>

        {/* Grafikler */}
        <div className="grid grid-cols-1 gap-6">
          {/* Çizgi Grafik */}
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedType === 'income' ? 'Gelir' : 'Gider'} Trendi
            </h2>
            <LineChart
              transactions={filteredTransactions}
              type={selectedType}
              period={selectedPeriod}
            />
          </div>

          {/* Pasta ve Bar Grafikler */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pasta Grafik */}
            <div className="bg-white rounded-lg p-6 shadow">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Kategori Dağılımı
              </h2>
              <PieChart
                transactions={filteredTransactions}
                categories={categories}
                onCategoryClick={handleCategoryClick}
              />
            </div>

            {/* Bar Grafik */}
            <div className="bg-white rounded-lg p-6 shadow">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedPeriod === 'weekly' ? 'Günlük' : 'Aylık'} Karşılaştırma
              </h2>
              <BarChart
                transactions={filteredTransactions}
                type={selectedType}
                period={selectedPeriod}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Kategori Detay Modalı */}
      <CategoryDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={selectedCategory}
        transactions={filteredTransactions.filter(
          t => t.categoryId === selectedCategory?.id
        )}
      />
    </div>
  );
}

export default StatisticsPage; 