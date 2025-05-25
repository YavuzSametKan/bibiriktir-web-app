import { useState, useEffect } from 'react';
import { CalendarIcon, ChartBarIcon, ArrowTrendingUpIcon, BanknotesIcon, FlagIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import MonthlyReviewModal from '../components/monthly/MonthlyReviewModal';

// Axios instance oluştur
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

function MonthlyReviewPage() {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // API çağrılarını ayrı ayrı yapalım ve hataları yakalayalım
        try {
          const allReviewsResponse = await api.get('/monthly-review/all');
          console.log('Tüm değerlendirmeler:', allReviewsResponse.data);
          
          if (allReviewsResponse.data.success) {
            setReviews(allReviewsResponse.data.data);
          } else {
            console.error('API başarısız yanıt:', allReviewsResponse.data);
            setError('Değerlendirmeler yüklenirken bir hata oluştu');
          }
        } catch (err) {
          console.error('Tüm değerlendirmeler yüklenirken hata:', err);
          if (err.response?.status === 401) {
            setError('Bu sayfayı görüntülemek için giriş yapmanız gerekiyor');
          } else if (err.response?.status === 404) {
            setError('API endpoint bulunamadı. Lütfen backend servisinin çalıştığından emin olun.');
          } else {
            setError('Değerlendirmeler yüklenirken bir hata oluştu: ' + (err.response?.data?.message || err.message));
          }
        }

        try {
          const statisticsResponse = await api.get('/statistics');
          console.log('İstatistikler:', statisticsResponse.data);
          
          if (statisticsResponse.data.success) {
            setStatistics(statisticsResponse.data.data);
          } else {
            console.error('API başarısız yanıt:', statisticsResponse.data);
            setError('İstatistikler yüklenirken bir hata oluştu');
          }
        } catch (err) {
          console.error('İstatistikler yüklenirken hata:', err);
          if (err.response?.status === 401) {
            setError('Bu sayfayı görüntülemek için giriş yapmanız gerekiyor');
          } else if (err.response?.status === 404) {
            setError('API endpoint bulunamadı. Lütfen backend servisinin çalıştığından emin olun.');
          } else {
            setError('İstatistikler yüklenirken bir hata oluştu: ' + (err.response?.data?.message || err.message));
          }
        }
      } catch (err) {
        console.error('Genel hata:', err);
        setError('Veriler yüklenirken bir hata oluştu: ' + (err.response?.data?.message || err.message));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleReviewClick = (review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      month: 'long',
      year: 'numeric'
    });
  };

  const formatPercentage = (value) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Başlık ve Açıklama */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Ay Sonu Değerlendirmeleri</h1>
            <p className="text-gray-600">Finansal hedeflerinizin ve aktivitelerinizin aylık değerlendirmeleri</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm p-4 border border-blue-100">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-blue-700">Toplam Değerlendirme</p>
                <p className="text-xl font-bold text-blue-900">{reviews.length} ay</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Yükleme Durumu */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Hata Mesajı */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {!isLoading && !error && statistics && (
        <>
          {/* Güncel Ay Finansal Özet */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Gelir Kartı */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl shadow-sm p-6 border border-emerald-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-emerald-700">Güncel Ay Geliri</h3>
                <BanknotesIcon className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="flex items-baseline mb-2">
                <p className="text-2xl font-bold text-emerald-900">
                  {formatCurrency(statistics.currentMonthData.totalIncome)}
                </p>
                <span className="ml-2 text-sm text-emerald-600">toplam</span>
              </div>
              {statistics.previousMonthData && (
                <div className="mt-2 text-sm">
                  <div className="flex items-center text-emerald-600">
                    <span className="mr-1">
                      {statistics.currentMonthData.totalIncome > statistics.previousMonthData.totalIncome ? '↑' : '↓'}
                    </span>
                    {formatPercentage(
                      Math.abs(
                        (statistics.currentMonthData.totalIncome - statistics.previousMonthData.totalIncome) /
                        statistics.previousMonthData.totalIncome
                      )
                    )}
                  </div>
                  <div className="text-gray-500 text-xs mt-1">
                    Önceki ay: {formatCurrency(statistics.previousMonthData.totalIncome)}
                  </div>
                </div>
              )}
            </div>

            {/* Gider Kartı */}
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl shadow-sm p-6 border border-rose-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-rose-700">Güncel Ay Gideri</h3>
                <BanknotesIcon className="h-5 w-5 text-rose-600" />
              </div>
              <div className="flex items-baseline mb-2">
                <p className="text-2xl font-bold text-rose-900">
                  {formatCurrency(statistics.currentMonthData.totalExpense)}
                </p>
                <span className="ml-2 text-sm text-rose-600">toplam</span>
              </div>
              {statistics.previousMonthData && (
                <div className="mt-2 text-sm">
                  <div className="flex items-center text-rose-600">
                    <span className="mr-1">
                      {statistics.currentMonthData.totalExpense < statistics.previousMonthData.totalExpense ? '↓' : '↑'}
                    </span>
                    {formatPercentage(
                      Math.abs(
                        (statistics.currentMonthData.totalExpense - statistics.previousMonthData.totalExpense) /
                        statistics.previousMonthData.totalExpense
                      )
                    )}
                  </div>
                  <div className="text-gray-500 text-xs mt-1">
                    Önceki ay: {formatCurrency(statistics.previousMonthData.totalExpense)}
                  </div>
                </div>
              )}
            </div>

            {/* Tasarruf Kartı */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm p-6 border border-blue-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-blue-700">Tasarruf Durumu</h3>
                <BanknotesIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex items-baseline mb-2">
                <p className="text-2xl font-bold text-blue-900">
                  {formatCurrency(statistics.currentMonthData.netBalance)}
                </p>
                <span className="ml-2 text-sm text-blue-600">net</span>
              </div>
              {statistics.previousMonthData && (
                <div className="mt-2 text-sm">
                  <div className="flex items-center text-blue-600">
                    <span className="mr-1">
                      {statistics.currentMonthData.netBalance > statistics.previousMonthData.netBalance ? '↑' : '↓'}
                    </span>
                    {formatPercentage(
                      Math.abs(
                        (statistics.currentMonthData.netBalance - statistics.previousMonthData.netBalance) /
                        Math.abs(statistics.previousMonthData.netBalance)
                      )
                    )}
                  </div>
                  <div className="text-gray-500 text-xs mt-1">
                    Önceki ay: {formatCurrency(statistics.previousMonthData.netBalance)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Güncel Ay Detaylı İstatistikler */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Günlük Ortalama İşlem */}
            <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-xl shadow-sm p-6 border border-purple-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-purple-700">Günlük Ortalama İşlem</h3>
                <ChartBarIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex items-baseline mb-2">
                <p className="text-2xl font-bold text-purple-900">
                  {statistics.currentMonthData.averageTransactionPerDay.toFixed(1)}
                </p>
                <span className="ml-2 text-sm text-purple-600">günlük</span>
              </div>
              {statistics.previousMonthData && (
                <div className="text-gray-500 text-xs mt-1">
                  Önceki ay: {statistics.previousMonthData.averageTransactionPerDay.toFixed(1)} günlük
                </div>
              )}
            </div>

            {/* Toplam İşlem Sayısı */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm p-6 border border-green-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-green-700">Toplam İşlem Sayısı</h3>
                <ArrowTrendingUpIcon className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex items-baseline mb-2">
                <p className="text-2xl font-bold text-green-900">
                  {statistics.currentMonthData.transactionCount}
                </p>
                <span className="ml-2 text-sm text-green-600">işlem</span>
              </div>
              {statistics.previousMonthData && (
                <div className="text-gray-500 text-xs mt-1">
                  Önceki ay: {statistics.previousMonthData.transactionCount} işlem
                </div>
              )}
            </div>

            {/* Aktif Hedef Sayısı */}
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl shadow-sm p-6 border border-indigo-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-indigo-700">Aktif Hedef Sayısı</h3>
                <FlagIcon className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="flex items-baseline mb-2">
                <p className="text-2xl font-bold text-indigo-900">
                  {statistics.currentMonthData.activeGoalCount}
                </p>
                <span className="ml-2 text-sm text-indigo-600">hedef</span>
              </div>
              {statistics.previousMonthData && (
                <div className="text-gray-500 text-xs mt-1">
                  Önceki ay: {statistics.previousMonthData.activeGoalCount} hedef
                </div>
              )}
            </div>

            {/* Hedef İlerleme Oranı */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-sm p-6 border border-amber-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-amber-700">Hedef İlerleme Oranı</h3>
                <ChartBarIcon className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex items-baseline mb-2">
                <p className="text-2xl font-bold text-amber-900">
                  {formatPercentage(statistics.currentMonthData.activeGoalsAverageProgress)}
                </p>
                <span className="ml-2 text-sm text-amber-600">ortalama</span>
              </div>
              {statistics.previousMonthData && (
                <div className="text-gray-500 text-xs mt-1">
                  Önceki ay: {formatPercentage(statistics.previousMonthData.activeGoalsAverageProgress)}
                </div>
              )}
            </div>
          </div>

          {/* Değerlendirme Listesi */}
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.month}
                onClick={() => handleReviewClick(review)}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-blue-100"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Sol Kısım - Tarih ve Aktivite */}
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center border border-blue-100">
                      <CalendarIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{formatDate(review.month)}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500">Günlük Ortalama İşlem:</span>
                        <span className="text-sm font-medium text-purple-600">
                          {review.currentMonthData?.averageTransactionPerDay?.toFixed(1) || '0.0'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Orta Kısım - Finansal Bilgiler */}
                  <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Gelir:</span>
                      <span className="text-sm font-medium text-emerald-600">
                        {formatCurrency(review.currentMonthData?.totalIncome || 0)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Gider:</span>
                      <span className="text-sm font-medium text-rose-600">
                        {formatCurrency(review.currentMonthData?.totalExpense || 0)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">İşlem Sayısı:</span>
                      <span className="text-sm font-medium text-blue-600">
                        {review.currentMonthData?.transactionCount || 0}
                      </span>
                    </div>
                  </div>

                  {/* Sağ Kısım - Hedefler ve Detay */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Aktif Hedef:</span>
                      <span className="text-sm font-medium text-indigo-600">
                        {review.currentMonthData?.activeGoalCount || 0}
                      </span>
                    </div>
                    <div className="hidden md:block w-px h-6 bg-gray-200"></div>
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                      Detayları Gör
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <MonthlyReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        review={selectedReview}
      />
    </div>
  );
}

export default MonthlyReviewPage; 