import { useState, useMemo } from 'react';
import { format, subMonths, subWeeks, startOfMonth, endOfMonth, eachMonthOfInterval, subYears } from 'date-fns';
import { tr } from 'date-fns/locale';
import { ChartBarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
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
          startDate: startOfMonth(now),
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

  const comparisonData = useMemo(() => {
    const currentPeriodTotal = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    // Önceki dönem tarihlerini hesapla
    let previousStartDate, previousEndDate;
    switch (selectedPeriod) {
      case 'weekly':
        previousStartDate = subWeeks(startDate, 1);
        previousEndDate = subWeeks(endDate, 1);
        break;
      case 'monthly':
        previousStartDate = subMonths(startDate, 1);
        previousEndDate = subMonths(endDate, 1);
        break;
      case 'quarterly':
        previousStartDate = subMonths(startDate, 3);
        previousEndDate = subMonths(endDate, 3);
        break;
      case 'halfYearly':
        previousStartDate = subMonths(startDate, 6);
        previousEndDate = subMonths(endDate, 6);
        break;
      case 'yearly':
        previousStartDate = subYears(startDate, 1);
        previousEndDate = subYears(endDate, 1);
        break;
    }

    // Önceki dönem işlemlerini filtrele
    const previousPeriodTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return (
        transaction.type === selectedType &&
        transactionDate >= previousStartDate &&
        transactionDate <= previousEndDate
      );
    });

    const previousPeriodTotal = previousPeriodTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    // Değişim yüzdesini hesapla
    const changePercentage = previousPeriodTotal === 0 
      ? 100 
      : ((currentPeriodTotal - previousPeriodTotal) / previousPeriodTotal) * 100;

    return {
      currentPeriodTotal,
      previousPeriodTotal,
      changePercentage,
      isPositive: changePercentage >= 0,
    };
  }, [filteredTransactions, transactions, selectedType, selectedPeriod, startDate, endDate]);

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

        {/* Karşılaştırmalı Analizler */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Önceki Dönem Karşılaştırması */}
          <div className="bg-white rounded-lg p-6 shadow h-60">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Önceki Dönem Karşılaştırması</h3>
              <div className="flex items-center gap-2">
                <ChartBarIcon className={`h-6 w-6 ${
                  selectedType === 'income' 
                    ? (comparisonData.isPositive ? 'text-green-500' : 'text-red-500')
                    : (comparisonData.isPositive ? 'text-red-500' : 'text-green-500')
                }`} />
                {selectedType === 'income' ? (
                  comparisonData.isPositive ? (
                    <ArrowTrendingUpIcon className={`h-6 w-6 ${
                      comparisonData.isPositive ? 'text-green-500' : 'text-red-500'
                    }`} />
                  ) : (
                    <ArrowTrendingDownIcon className={`h-6 w-6 ${
                      comparisonData.isPositive ? 'text-green-500' : 'text-red-500'
                    }`} />
                  )
                ) : (
                  comparisonData.isPositive ? (
                    <ArrowTrendingDownIcon className={`h-6 w-6 ${
                      comparisonData.isPositive ? 'text-red-500' : 'text-green-500'
                    }`} />
                  ) : (
                    <ArrowTrendingUpIcon className={`h-6 w-6 ${
                      comparisonData.isPositive ? 'text-red-500' : 'text-green-500'
                    }`} />
                  )
                )}
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Mevcut Dönem</p>
                <p className="text-2xl font-bold text-gray-900">
                  {comparisonData.currentPeriodTotal.toLocaleString('tr-TR', {
                    style: 'currency',
                    currency: 'TRY',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Önceki Dönem</p>
                <p className="text-xl text-gray-700">
                  {comparisonData.previousPeriodTotal.toLocaleString('tr-TR', {
                    style: 'currency',
                    currency: 'TRY',
                  })}
                </p>
              </div>
              <p className={`text-sm font-medium ${
                selectedType === 'income' 
                  ? (comparisonData.isPositive ? 'text-green-600' : 'text-red-600')
                  : (comparisonData.isPositive ? 'text-red-600' : 'text-green-600')
              }`}>
                {comparisonData.isPositive ? '+' : ''}{comparisonData.changePercentage.toFixed(1)}% değişim
              </p>
            </div>
          </div>

          {/* Kategori Bazlı Karşılaştırma */}
          <div className="bg-white rounded-lg p-6 shadow h-60">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Kategori Bazlı Değişim</h3>
            <div className="overflow-y-auto custom-scrollbar h-36 pr-2">
              <div className="space-y-1.5">
                {categories
                  .filter(category => category.type === selectedType)
                  .map(category => {
                    const currentAmount = filteredTransactions
                      .filter(t => t.categoryId === category.id)
                      .reduce((sum, t) => sum + t.amount, 0);
                    
                    const previousAmount = transactions
                      .filter(t => {
                        const date = new Date(t.date);
                        return (
                          t.categoryId === category.id &&
                          t.type === selectedType &&
                          date >= subMonths(startDate, 1) &&
                          date <= subMonths(endDate, 1)
                        );
                      })
                      .reduce((sum, t) => sum + t.amount, 0);

                    const change = previousAmount === 0
                      ? 100
                      : ((currentAmount - previousAmount) / previousAmount) * 100;

                    return (
                      <div key={category.id} className="flex items-center justify-between py-1 border-b border-gray-100 last:border-0">
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="text-sm text-gray-600">{category.name}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600">
                            {currentAmount.toLocaleString('tr-TR', {
                              style: 'currency',
                              currency: 'TRY',
                            })}
                          </span>
                          <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
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