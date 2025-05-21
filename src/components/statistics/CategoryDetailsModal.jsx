import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

function CategoryDetailsModal({ isOpen, onClose, category, transactions }) {
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);

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
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {category?.name} Detayları
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-lg p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="mb-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {total.toLocaleString('tr-TR', {
                      style: 'currency',
                      currency: 'TRY',
                    })}
                  </div>
                  <div className="text-sm text-gray-500">
                    Toplam {transactions.length} işlem
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <div className="font-medium text-gray-900">
                            {transaction.description}
                          </div>
                          <div className="text-sm text-gray-500">
                            {format(new Date(transaction.date), 'd MMMM yyyy', {
                              locale: tr,
                            })}
                          </div>
                        </div>
                        <div className="text-lg font-medium text-gray-900">
                          {transaction.amount.toLocaleString('tr-TR', {
                            style: 'currency',
                            currency: 'TRY',
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default CategoryDetailsModal; 