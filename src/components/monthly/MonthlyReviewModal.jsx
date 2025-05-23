import React from 'react';
import Modal from '../common/Modal';
import { FlagIcon, ClockIcon } from '@heroicons/react/24/outline';

function MonthlyReviewModal({ isOpen, onClose, review }) {
  if (!review) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const getActivityColor = (activity) => {
    if (activity >= 4) return 'from-blue-400 to-indigo-500';
    if (activity >= 3) return 'from-indigo-400 to-violet-500';
    return 'from-purple-400 to-fuchsia-500';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${new Date(review.month).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })} Değerlendirmesi`}
    >
      <div className="space-y-8">
        {/* İstatistikler */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 rounded-2xl opacity-50 blur-xl"></div>
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {/* Aktif Hedefler */}
            <div className="group relative overflow-hidden rounded-xl bg-blue-50 p-6 shadow-sm transition-all hover:shadow-md">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 opacity-0 transition-opacity group-hover:opacity-100"></div>
              <div className="relative">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-blue-800">Aktif Hedefler</h4>
                  <FlagIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex items-baseline justify-between">
                  <p className="text-2xl font-bold text-blue-900">{review.activeGoals}</p>
                  <span className="text-xs text-blue-600">toplam</span>
                </div>
              </div>
            </div>

            {/* Günlük Aktivite */}
            <div className="group relative overflow-hidden rounded-xl bg-purple-50 p-6 shadow-sm transition-all hover:shadow-md">
              <div className={`absolute inset-0 bg-gradient-to-br ${getActivityColor(review.dailyActivityAverage)} opacity-10 transition-opacity group-hover:opacity-20`}></div>
              <div className="relative">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-purple-800">Günlük Aktivite</h4>
                  <ClockIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex items-baseline justify-between">
                  <p className={`text-2xl font-bold text-purple-900`}>
                    {review.dailyActivityAverage}
                  </p>
                  <span className="text-xs text-purple-600">ortalama</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Açıklama / Tavsiyeler */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Açıklama / Tavsiyeler</h3>
          <div className="relative overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 opacity-50"></div>
            <div className="relative h-auto max-h-[24rem] overflow-y-auto custom-scrollbar">
              <div className="p-6">
                <p className="text-gray-600 whitespace-pre-line leading-relaxed">{review.description}</p>
              </div>
            </div>
          </div>
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
    </Modal>
  );
}

export default MonthlyReviewModal; 