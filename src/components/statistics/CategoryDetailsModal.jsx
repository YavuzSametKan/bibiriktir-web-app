import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { statisticsService } from '../../services/statisticsService';
import { toast } from 'react-toastify';

function CategoryDetailsModal({ isOpen, onClose, category, startDate, endDate }) {
  const [loading, setLoading] = useState(false);
  const [categoryDetails, setCategoryDetails] = useState(null);

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      if (!category) return;

      setLoading(true);
      try {
        const response = await statisticsService.getCategoryStats(
          format(startDate, 'yyyy-MM-dd'),
          format(endDate, 'yyyy-MM-dd'),
          category.type
        );

        const categoryData = response.data.categories.find(
          c => c.categoryId === category.categoryId
        );

        if (categoryData) {
          setCategoryDetails(categoryData);
        }
      } catch (error) {
        toast.error('Kategori detayları yüklenirken bir hata oluştu');
        console.error('Kategori detayları yükleme hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchCategoryDetails();
    }
  }, [isOpen, category, startDate, endDate]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
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
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title as="h3" className="text-xl font-semibold text-gray-900">
                    {category?.categoryName} Detayları
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                ) : categoryDetails ? (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Toplam Tutar</h4>
                      <p className="mt-1 text-2xl font-semibold text-gray-900">
                        {categoryDetails.totalAmount.toLocaleString('tr-TR', {
                          style: 'currency',
                          currency: 'TRY',
                        })}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">İşlem Sayısı</h4>
                      <p className="mt-1 text-xl text-gray-900">
                        {categoryDetails.transactionCount} işlem
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Ortalama İşlem Tutarı</h4>
                      <p className="mt-1 text-xl text-gray-900">
                        {categoryDetails.averageAmount.toLocaleString('tr-TR', {
                          style: 'currency',
                          currency: 'TRY',
                        })}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Toplam Tutarın Yüzdesi</h4>
                      <p className="mt-1 text-xl text-gray-900">
                        %{categoryDetails.percentage.toFixed(1)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Kategori detayları bulunamadı.</p>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default CategoryDetailsModal; 