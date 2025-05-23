import { useState } from 'react';
import { CalendarIcon, ChartBarIcon, ArrowTrendingUpIcon, BanknotesIcon, FlagIcon } from '@heroicons/react/24/outline';
import { mockMonthlyReviews } from '../data/mockMonthlyReviews';
import MonthlyReviewModal from '../components/monthly/MonthlyReviewModal';

function MonthlyReviewPage() {
  const [reviews] = useState(mockMonthlyReviews);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // İstatistikler için hesaplamalar
  const totalReviews = reviews.length;
  const averageActivity = reviews.reduce((acc, review) => acc + review.dailyAverageTransaction, 0) / totalReviews;
  const totalActiveGoals = reviews.reduce((acc, review) => acc + review.activeGoals, 0);
  const totalTransactions = reviews.reduce((acc, review) => acc + review.totalTransactions, 0);
  
  // Güncel ay verileri
  const currentMonth = reviews[0]; // En son eklenen ay
  const currentMonthIncome = currentMonth?.totalIncome || 0;
  const currentMonthExpense = currentMonth?.totalExpense || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Başlık ve Açıklama */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Ay Sonu Değerlendirmeleri</h1>
        <p className="text-gray-600">Finansal hedeflerinizin ve aktivitelerinizin aylık değerlendirmeleri</p>
      </div>

      {/* Üst Bilgi Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Toplam Değerlendirme */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm p-6 border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-blue-700">Toplam Değerlendirme</h3>
            <CalendarIcon className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold text-blue-900">{totalReviews}</p>
            <span className="ml-2 text-sm text-blue-600">ay</span>
          </div>
        </div>

        {/* Günlük Ortalama İşlem */}
        <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-xl shadow-sm p-6 border border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-purple-700">Günlük Ortalama İşlem</h3>
            <ChartBarIcon className="h-5 w-5 text-purple-600" />
          </div>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold text-purple-900">{averageActivity.toFixed(1)}</p>
            <span className="ml-2 text-sm text-purple-600">günlük</span>
          </div>
        </div>

        {/* Toplam İşlem Sayısı */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm p-6 border border-green-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-green-700">Toplam İşlem Sayısı</h3>
            <ArrowTrendingUpIcon className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold text-green-900">{totalTransactions}</p>
            <span className="ml-2 text-sm text-green-600">işlem</span>
          </div>
        </div>

        {/* Toplam Aktif Hedef */}
        <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl shadow-sm p-6 border border-indigo-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-indigo-700">Toplam Aktif Hedef</h3>
            <FlagIcon className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold text-indigo-900">{totalActiveGoals}</p>
            <span className="ml-2 text-sm text-indigo-600">hedef</span>
          </div>
        </div>
      </div>

      {/* Güncel Ay Finansal Özet */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl shadow-sm p-6 border border-emerald-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-emerald-700">Güncel Ay Geliri</h3>
            <BanknotesIcon className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold text-emerald-900">{formatCurrency(currentMonthIncome)}</p>
            <span className="ml-2 text-sm text-emerald-600">toplam</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl shadow-sm p-6 border border-rose-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-rose-700">Güncel Ay Gideri</h3>
            <BanknotesIcon className="h-5 w-5 text-rose-600" />
          </div>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold text-rose-900">{formatCurrency(currentMonthExpense)}</p>
            <span className="ml-2 text-sm text-rose-600">toplam</span>
          </div>
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
                    <span className="text-sm font-medium text-purple-600">{review.dailyAverageTransaction}</span>
                  </div>
                </div>
              </div>

              {/* Orta Kısım - Finansal Bilgiler */}
              <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Gelir:</span>
                  <span className="text-sm font-medium text-emerald-600">{formatCurrency(review.totalIncome)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Gider:</span>
                  <span className="text-sm font-medium text-rose-600">{formatCurrency(review.totalExpense)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">İşlem Sayısı:</span>
                  <span className="text-sm font-medium text-blue-600">{review.totalTransactions}</span>
                </div>
              </div>

              {/* Sağ Kısım - Hedefler ve Detay */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Aktif Hedef:</span>
                  <span className="text-sm font-medium text-indigo-600">{review.activeGoals}</span>
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

      <MonthlyReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        review={selectedReview}
      />
    </div>
  );
}

export default MonthlyReviewPage; 