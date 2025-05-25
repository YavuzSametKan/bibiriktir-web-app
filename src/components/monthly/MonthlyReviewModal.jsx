import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

function MonthlyReviewModal({ isOpen, onClose, review }) {
  if (!review) return null;

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
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Kapat</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-2xl font-semibold leading-6 text-gray-900 mb-6">
                      {formatDate(review.month)} Ay Değerlendirmesi
                    </Dialog.Title>

                    {/* Üst Kısım - Finansal Özet ve İstatistikler */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {/* Finansal Özet */}
                      <div className="space-y-4">
                        <div className="bg-emerald-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-emerald-700 mb-2">Toplam Gelir</h4>
                          <p className="text-2xl font-bold text-emerald-900">
                            {formatCurrency(review.currentMonthData?.totalIncome || 0)}
                          </p>
                          {review.previousMonthData && (
                            <div className="mt-2 flex items-center text-sm">
                              <span className={`mr-2 ${review.currentMonthData.totalIncome > review.previousMonthData.totalIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {review.currentMonthData.totalIncome > review.previousMonthData.totalIncome ? '↑' : '↓'}
                                {formatPercentage(
                                  Math.abs(
                                    (review.currentMonthData.totalIncome - review.previousMonthData.totalIncome) /
                                    review.previousMonthData.totalIncome
                                  )
                                )}
                              </span>
                              <span className="text-gray-600">
                                Önceki ay: {formatCurrency(review.previousMonthData.totalIncome)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="bg-rose-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-rose-700 mb-2">Toplam Gider</h4>
                          <p className="text-2xl font-bold text-rose-900">
                            {formatCurrency(review.currentMonthData?.totalExpense || 0)}
                          </p>
                          {review.previousMonthData && (
                            <div className="mt-2 flex items-center text-sm">
                              <span className={`mr-2 ${review.currentMonthData.totalExpense < review.previousMonthData.totalExpense ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {review.currentMonthData.totalExpense < review.previousMonthData.totalExpense ? '↓' : '↑'}
                                {formatPercentage(
                                  Math.abs(
                                    (review.currentMonthData.totalExpense - review.previousMonthData.totalExpense) /
                                    review.previousMonthData.totalExpense
                                  )
                                )}
                              </span>
                              <span className="text-gray-600">
                                Önceki ay: {formatCurrency(review.previousMonthData.totalExpense)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Hedef İlerlemeleri */}
                      <div className="bg-indigo-50 rounded-lg p-4">
                        <h4 className="text-lg font-medium text-indigo-900 mb-4">Hedef İlerlemeleri</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Aktif Hedef Sayısı</span>
                            <span className="font-medium text-indigo-600">{review.currentMonthData?.activeGoalCount || 0}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Tamamlanan Hedef Sayısı</span>
                            <span className="font-medium text-indigo-600">{review.currentMonthData?.completedGoalCount || 0}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Ortalama İlerleme</span>
                            <span className="font-medium text-indigo-600">
                              {formatPercentage(review.currentMonthData?.activeGoalsAverageProgress || 0)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Hedeflere Ayrılan Toplam</span>
                            <span className="font-medium text-indigo-600">
                              {formatCurrency(review.currentMonthData?.goalsContributionAmount || 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Orta Kısım - Kategori ve Gelir Detayları */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {/* Kategori Bazlı Giderler */}
                      {review.currentMonthData?.expensesByCategory && (
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                          <h4 className="text-lg font-medium text-gray-900 mb-4">Kategori Bazlı Giderler</h4>
                          <div className="space-y-3 h-32 overflow-y-auto custom-scrollbar pr-2">
                            {Object.entries(review.currentMonthData.expensesByCategory)
                              .sort(([, a], [, b]) => b - a) // Tutara göre sırala
                              .map(([category, amount]) => (
                                <div key={category} className="flex items-center justify-between">
                                  <span className="text-gray-600">{category}</span>
                                  <span className="font-medium text-rose-600">{formatCurrency(amount)}</span>
                                </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Gelir Kaynakları */}
                      {review.currentMonthData?.incomeBySource && (
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                          <h4 className="text-lg font-medium text-gray-900 mb-4">Gelir Kaynakları</h4>
                          <div className="space-y-3 h-32 overflow-y-auto custom-scrollbar pr-2">
                            {Object.entries(review.currentMonthData.incomeBySource)
                              .sort(([, a], [, b]) => b - a) // Tutara göre sırala
                              .map(([source, amount]) => (
                                <div key={source} className="flex items-center justify-between">
                                  <span className="text-gray-600">{source}</span>
                                  <span className="font-medium text-emerald-600">{formatCurrency(amount)}</span>
                                </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Alt Kısım - Değerlendirme ve Tavsiyeler (Scrollable) */}
                    <div className="mt-8 border-t border-gray-200 pt-6">
                      <div className="bg-gray-50 rounded-lg p-6 max-h-[400px] overflow-y-auto custom-scrollbar">
                        {review.analysisText ? (
                          <div className="prose prose-sm max-w-none">
                            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{review.analysisText}</p>
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">Bu ay için değerlendirme henüz oluşturulmamış.</p>
                        )}
                      </div>
                    </div>

                    {/* Önceki Ay Karşılaştırması */}
                    {review.previousMonthData && (
                      <div className="mt-8 border-t border-gray-200 pt-6">
                        <h4 className="text-lg font-medium text-gray-900 mb-4">Önceki Ay Karşılaştırması</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Gelir Değişimi</span>
                              <span className={`font-medium ${review.currentMonthData.totalIncome > review.previousMonthData.totalIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {formatCurrency(review.currentMonthData.totalIncome - review.previousMonthData.totalIncome)}
                              </span>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Gider Değişimi</span>
                              <span className={`font-medium ${review.currentMonthData.totalExpense < review.previousMonthData.totalExpense ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {formatCurrency(review.currentMonthData.totalExpense - review.previousMonthData.totalExpense)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <style jsx>{`
                  .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 3px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 3px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                  }
                `}</style>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default MonthlyReviewModal; 