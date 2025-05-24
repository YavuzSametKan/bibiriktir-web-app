import { useState, useMemo, useEffect } from 'react';
import { format, subMonths, subWeeks, startOfMonth, endOfMonth, eachMonthOfInterval, subYears, subQuarters, subDays, getWeek } from 'date-fns';
import { tr } from 'date-fns/locale';
import { ChartBarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, LightBulbIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import SegmentedControl from '../components/statistics/SegmentedControl';
import DateRangePicker from '../components/statistics/DateRangePicker';
import LineChart from '../components/statistics/LineChart';
import PieChart from '../components/statistics/PieChart';
import BarChart from '../components/statistics/BarChart';
import CategoryDetailsModal from '../components/statistics/CategoryDetailsModal';
import { statisticsService } from '../services/statisticsService';
import { toast } from 'react-toastify';

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
  const [selectedType, setSelectedType] = useState('income');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [monthlyStats, setMonthlyStats] = useState(null);
  const [categoryStats, setCategoryStats] = useState(null);
  const [trendStats, setTrendStats] = useState(null);
  const [customStats, setCustomStats] = useState(null);

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

  // Periyot bazlı trend aralığını belirle
  const getTrendInterval = (period) => {
    switch (period) {
      case 'weekly':
        return 'daily';
      case 'monthly':
        return 'daily';
      case 'quarterly':
        return 'weekly';
      case 'halfYearly':
        return 'monthly';
      case 'yearly':
        return 'monthly';
      default:
        return 'daily';
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const currentDate = new Date();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        const week = getWeek(currentDate);
        const quarter = Math.floor((month - 1) / 3) + 1;
        const half = Math.floor((month - 1) / 6) + 1;

        // Periyot bazlı istatistikleri getir
        let statsResponse;
        switch (selectedPeriod) {
          case 'weekly':
            statsResponse = await statisticsService.getWeeklyStats(week, year, selectedType);
            break;
          case 'monthly':
            statsResponse = await statisticsService.getMonthlyStats(month, year, selectedType);
            break;
          case 'quarterly':
            statsResponse = await statisticsService.getQuarterlyStats(quarter, year, selectedType);
            break;
          case 'halfYearly':
            statsResponse = await statisticsService.getHalfYearlyStats(half, year, selectedType);
            break;
          case 'yearly':
            statsResponse = await statisticsService.getYearlyStats(year, selectedType);
            break;
          default:
            statsResponse = await statisticsService.getMonthlyStats(month, year, selectedType);
        }

        if (statsResponse?.data?.success) {
          const stats = statsResponse.data.data;
          setMonthlyStats(stats);
          
          // Kategori istatistiklerini ayarla
          const categories = selectedType === 'income' 
            ? stats.categoryBreakdown?.income || []
            : stats.categoryBreakdown?.expense || [];
          
          setCategoryStats({
            categories: categories.map(cat => ({
              ...cat,
              totalAmount: cat.amount || 0,
              percentage: cat.percentage || 0
            }))
          });

          // Trend verilerini ayarla
          const trends = stats.dailyBreakdown?.map(day => ({
            period: day.date,
            income: day.income || 0,
            expense: day.expense || 0
          })) || [];
          
          setTrendStats({ trends });

          // Özel istatistikleri ayarla
          const transactionCount = stats.transactionCounts?.[selectedType] || 0;
          const totalAmount = selectedType === 'income' 
            ? stats.totalIncome || 0 
            : stats.totalExpense || 0;

          setCustomStats({
            averageTransactionAmount: transactionCount > 0 ? totalAmount / transactionCount : 0,
            largestTransaction: {
              amount: Math.max(...(stats.dailyBreakdown?.map(day => day[selectedType] || 0) || [0])),
              description: 'En yüksek günlük ' + (selectedType === 'income' ? 'gelir' : 'gider'),
              categoryName: selectedType === 'income' ? 'Gelir' : 'Gider'
            },
            mostFrequentCategory: categories[0] || {
              categoryName: 'Veri yok',
              transactionCount: 0,
              totalAmount: 0
            }
          });
        }
      } catch (error) {
        if (error.message.includes('Oturum')) {
          toast.error(error.message);
        } else {
          toast.error('İstatistikler yüklenirken bir hata oluştu');
          console.error('İstatistik yükleme hatası:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedType, selectedPeriod, startDate, endDate]);

  // Önceki dönem karşılaştırması için veri hesapla
  const getPreviousPeriodData = useMemo(() => {
    if (!monthlyStats) return null;

    const currentAmount = selectedType === 'income' 
      ? monthlyStats.totalIncome || 0
      : monthlyStats.totalExpense || 0;

    const previousPeriodComparison = monthlyStats.previousPeriodComparison;
    const hasPreviousData = !!previousPeriodComparison;
    const change = selectedType === 'income'
      ? previousPeriodComparison?.incomeChange || 0
      : previousPeriodComparison?.expenseChange || 0;

    return {
      currentAmount,
      previousAmount: currentAmount / (1 + change / 100),
      change,
      hasPreviousData
    };
  }, [monthlyStats, selectedType]);

  // Finansal sağlık skorunu hesapla
  const financialHealthScore = useMemo(() => {
    if (!monthlyStats) return 0;

    const totalIncome = monthlyStats.totalIncome || 0;
    const totalExpense = monthlyStats.totalExpense || 0;
    
    // Gelir/Gider oranı (0-40 puan)
    const incomeExpenseRatio = totalExpense > 0 ? (totalIncome / totalExpense) : 0;
    const incomeExpenseScore = Math.min(incomeExpenseRatio * 20, 40);
    
    // Tasarruf oranı (0-30 puan)
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) : 0;
    const savingsScore = savingsRate * 30;
    
    // Kategori çeşitliliği (0-30 puan)
    const categories = selectedType === 'income' 
      ? monthlyStats.categoryBreakdown?.income || []
      : monthlyStats.categoryBreakdown?.expense || [];
    const categoryDiversity = Math.min(categories.length * 5, 30);
    
    return Math.round(incomeExpenseScore + savingsScore + categoryDiversity);
  }, [monthlyStats, selectedType]);

  // Kategori bazlı ipuçları
  const categoryInsights = useMemo(() => {
    if (!monthlyStats?.categoryBreakdown) return [];

    const categories = selectedType === 'income' 
      ? monthlyStats.categoryBreakdown.income || []
      : monthlyStats.categoryBreakdown.expense || [];

    const insights = [];

    if (selectedType === 'income') {
      // Gelir kategorisi için ipuçları
      if (categories.length > 0) {
        const topCategory = categories[0];
        if (topCategory.percentage > 70) {
          insights.push({
            id: 'income-dependency',
            type: 'warning',
            title: 'Yüksek Gelir Bağımlılığı',
            description: `${topCategory.categoryName} kategorisinden gelen gelirleriniz toplam gelirinizin %${topCategory.percentage.toFixed(1)}'ini oluşturuyor. Gelir kaynaklarınızı çeşitlendirmeyi düşünebilirsiniz.`
          });
        }
      }

      // Gelir çeşitliliği ipucu
      if (categories.length < 2) {
        insights.push({
          id: 'income-diversity',
          type: 'warning',
          title: 'Düşük Gelir Çeşitliliği',
          description: 'Gelirleriniz tek bir kaynağa bağlı. Gelir kaynaklarınızı artırmak finansal güvenliğinizi artırabilir.'
        });
      }
    } else {
      // Gider kategorisi için ipuçları
      if (categories.length > 0) {
        const topCategory = categories[0];
        if (topCategory.percentage > 50) {
          insights.push({
            id: 'expense-concentration',
            type: 'warning',
            title: 'Yüksek Harcama Konsantrasyonu',
            description: `${topCategory.categoryName} kategorisinde harcamalarınız toplamın %${topCategory.percentage.toFixed(1)}'ini oluşturuyor. Bu kategorideki harcamalarınızı gözden geçirmeyi düşünebilirsiniz.`
          });
        }
      }

      // Gider çeşitliliği ipucu
      if (categories.length < 3) {
        insights.push({
          id: 'expense-diversity',
          type: 'warning',
          title: 'Düşük Harcama Çeşitliliği',
          description: 'Harcamalarınız çok az kategoriye yoğunlaşmış. Harcamalarınızı daha iyi yönetmek için kategorileri çeşitlendirmeyi düşünebilirsiniz.'
        });
      }
    }

    // Tasarruf ipucu (her iki durumda da göster)
    const totalIncome = monthlyStats.totalIncome || 0;
    const totalExpense = monthlyStats.totalExpense || 0;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) : 0;

    if (savingsRate < 0.2) {
      insights.push({
        id: 'savings',
        type: 'warning',
        title: 'Düşük Tasarruf Oranı',
        description: 'Tasarruf oranınız %20\'nin altında. Gelirlerinizin en az %20\'sini tasarruf etmeyi hedefleyebilirsiniz.'
      });
    } else if (savingsRate > 0.3) {
      insights.push({
        id: 'savings-good',
        type: 'saving',
        title: 'İyi Tasarruf Oranı',
        description: 'Tebrikler! Tasarruf oranınız %30\'un üzerinde. Bu iyi bir finansal alışkanlık.'
      });
    }

    return insights;
  }, [monthlyStats, selectedType]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">İstatistikler yükleniyor...</p>
        </div>
      </div>
    );
  }

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Önceki Dönem Karşılaştırması */}
          <div className="bg-white rounded-lg p-6 shadow h-60">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Önceki Dönem Karşılaştırması</h3>
              <div className="flex items-center gap-2">
                <ChartBarIcon className={`h-6 w-6 ${
                  selectedType === 'income' 
                    ? (getPreviousPeriodData?.change >= 0 ? 'text-green-500' : 'text-red-500')
                    : (getPreviousPeriodData?.change <= 0 ? 'text-green-500' : 'text-red-500')
                }`} />
                {selectedType === 'income' ? (
                  getPreviousPeriodData?.change >= 0 ? (
                    <ArrowTrendingUpIcon className="h-6 w-6 text-green-500" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-6 w-6 text-red-500" />
                  )
                ) : (
                  getPreviousPeriodData?.change <= 0 ? (
                    <ArrowTrendingDownIcon className="h-6 w-6 text-green-500" />
                  ) : (
                    <ArrowTrendingUpIcon className="h-6 w-6 text-red-500" />
                  )
                )}
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">
                  {selectedPeriod === 'weekly' && 'Bu Hafta'}
                  {selectedPeriod === 'monthly' && 'Bu Ay'}
                  {selectedPeriod === 'quarterly' && 'Son 3 Ay'}
                  {selectedPeriod === 'halfYearly' && 'Son 6 Ay'}
                  {selectedPeriod === 'yearly' && 'Bu Yıl'}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {(getPreviousPeriodData?.currentAmount || 0).toLocaleString('tr-TR', {
                    style: 'currency',
                    currency: 'TRY',
                  })}
                </p>
              </div>
              {getPreviousPeriodData?.hasPreviousData ? (
                <>
                  <div>
                    <p className="text-sm text-gray-600">
                      {selectedPeriod === 'weekly' && 'Geçen Hafta'}
                      {selectedPeriod === 'monthly' && 'Geçen Ay'}
                      {selectedPeriod === 'quarterly' && 'Önceki 3 Ay'}
                      {selectedPeriod === 'halfYearly' && 'Önceki 6 Ay'}
                      {selectedPeriod === 'yearly' && 'Geçen Yıl'}
                    </p>
                    <p className="text-xl text-gray-700">
                      {(getPreviousPeriodData?.previousAmount || 0).toLocaleString('tr-TR', {
                        style: 'currency',
                        currency: 'TRY',
                      })}
                    </p>
                  </div>
                  <p className={`text-sm font-medium ${
                    selectedType === 'income' 
                      ? (getPreviousPeriodData?.change >= 0 ? 'text-green-600' : 'text-red-600')
                      : (getPreviousPeriodData?.change <= 0 ? 'text-green-600' : 'text-red-600')
                  }`}>
                    {getPreviousPeriodData?.change >= 0 ? '+' : ''}{getPreviousPeriodData?.change?.toFixed(1)}% değişim
                  </p>
                </>
              ) : (
                <div className="text-sm text-gray-500 italic">
                  {selectedPeriod === 'yearly' ? 'Geçen yıla ait veri bulunmamaktadır' : 'Önceki döneme ait veri bulunmamaktadır'}
                </div>
              )}
            </div>
          </div>

          {/* Kategori Bazlı Karşılaştırma */}
          <div className="bg-white rounded-lg p-6 shadow h-60">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Kategori Bazlı Değişim</h3>
            <div className="overflow-y-auto custom-scrollbar h-36 pr-2">
              <div className="space-y-1.5">
                {categoryStats?.categories?.map(category => (
                  <div
                    key={category.categoryId}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                    onClick={() => handleCategoryClick(category)}
                  >
                    <span className="text-sm text-gray-700">{category.categoryName}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {(category.totalAmount || 0).toLocaleString('tr-TR', {
                          style: 'currency',
                          currency: 'TRY',
                        })}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({(category.percentage || 0).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Finansal Sağlık Skoru */}
          <div className="bg-white rounded-lg p-6 shadow h-60">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Finansal Sağlık</h3>
            <div className="flex items-center justify-between">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-gray-200"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className={`${
                      financialHealthScore >= 70 ? 'text-green-500' :
                      financialHealthScore >= 40 ? 'text-yellow-500' :
                      'text-red-500'
                    }`}
                    strokeWidth="8"
                    strokeDasharray={`${financialHealthScore * 2.51} 251.2`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold">{financialHealthScore}</span>
                </div>
              </div>
              <div className="flex-1 ml-4">
                <p className="text-sm font-medium text-gray-900">
                  {financialHealthScore >= 70 ? 'Mükemmel' :
                   financialHealthScore >= 40 ? 'İyi' :
                   'Geliştirilebilir'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {financialHealthScore >= 70 ? 'Finansal durumunuz çok iyi' :
                   financialHealthScore >= 40 ? 'Finansal durumunuz iyi' :
                   'Finansal durumunuzu iyileştirmek için önerileri inceleyin'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Kategori Bazlı İpuçları */}
        <div className="mb-8">
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Öneriler</h3>
            <div className="space-y-4">
              {categoryInsights.map(insight => (
                <div key={insight.id} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${
                    insight.type === 'saving' ? 'bg-green-100' : 'bg-yellow-100'
                  }`}>
                    {insight.type === 'saving' ? (
                      <LightBulbIcon className="h-5 w-5 text-green-600" />
                    ) : (
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{insight.title}</p>
                    <p className="text-xs text-gray-600">{insight.description}</p>
                  </div>
                </div>
              ))}
              {categoryInsights.length === 0 && (
                <p className="text-sm text-gray-500 italic">
                  Şu an için öneri bulunmamaktadır.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Grafikler */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trend Grafiği */}
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trend Analizi</h3>
            <div className="h-80">
              <LineChart
                data={trendStats?.trends?.map(trend => ({
                  date: trend.period,
                  value: selectedType === 'income' ? (trend.income || 0) : (trend.expense || 0)
                })) || []}
                type={selectedType}
              />
            </div>
          </div>

          {/* Kategori Dağılımı */}
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Kategori Dağılımı</h3>
            <div className="h-80">
              <PieChart
                data={categoryStats?.categories?.map(category => ({
                  name: category.categoryName,
                  value: category.totalAmount || 0,
                  percentage: category.percentage || 0
                })) || []}
                type={selectedType}
              />
            </div>
          </div>
        </div>

        {/* Özel İstatistikler */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ortalama İşlem</h3>
            <p className="text-2xl font-bold text-gray-900">
              {(customStats?.averageTransactionAmount || 0).toLocaleString('tr-TR', {
                style: 'currency',
                currency: 'TRY',
              })}
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">En Büyük İşlem</h3>
            <div className="space-y-2">
              <p className="text-xl font-bold text-gray-900">
                {(customStats?.largestTransaction?.amount || 0).toLocaleString('tr-TR', {
                  style: 'currency',
                  currency: 'TRY',
                })}
              </p>
              <p className="text-sm text-gray-600">{customStats?.largestTransaction?.description || 'Veri yok'}</p>
              <p className="text-xs text-gray-500">{customStats?.largestTransaction?.categoryName || 'Veri yok'}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">En Sık Kullanılan Kategori</h3>
            <div className="space-y-2">
              <p className="text-xl font-bold text-gray-900">{customStats?.mostFrequentCategory?.categoryName || 'Veri yok'}</p>
              <p className="text-sm text-gray-600">
                {customStats?.mostFrequentCategory?.transactionCount || 0} işlem
              </p>
              <p className="text-sm text-gray-600">
                {(customStats?.mostFrequentCategory?.totalAmount || 0).toLocaleString('tr-TR', {
                  style: 'currency',
                  currency: 'TRY',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Kategori Detay Modalı */}
      {selectedCategory && (
        <CategoryDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          category={selectedCategory}
          startDate={startDate}
          endDate={endDate}
        />
      )}
    </div>
  );
}

export default StatisticsPage; 