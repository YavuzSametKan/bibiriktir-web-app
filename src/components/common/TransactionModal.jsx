import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

function TransactionModal({ isOpen, onClose, categories, transaction, onAdd, onUpdate, onDelete }) {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    categoryId: '',
    accountType: 'cash',
    date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    description: ''
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        ...transaction,
        date: format(new Date(transaction.date), "yyyy-MM-dd'T'HH:mm")
      });
    } else {
      setFormData({
        type: 'expense',
        amount: '',
        categoryId: '',
        accountType: 'cash',
        date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        description: ''
      });
    }
  }, [transaction]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date).toISOString()
    };

    if (transaction) {
      onUpdate({ ...data, id: transaction.id });
    } else {
      onAdd(data);
    }
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Bu işlemi silmek istediğinizden emin misiniz?')) {
      onDelete(transaction.id);
      onClose();
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="div"
                  className="flex justify-between items-center mb-4"
                >
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    {transaction ? 'İşlemi Düzenle' : 'Yeni İşlem'}
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        İşlem Tipi
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      >
                        <option value="expense">Harcama</option>
                        <option value="income">Gelir</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tutar
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kategori
                      </label>
                      <select
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
                        required
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      >
                        <option value="">Kategori Seçin</option>
                        {categories
                          .filter(c => c.type === formData.type)
                          .map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hesap Tipi
                      </label>
                      <select
                        value={formData.accountType}
                        onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                        required
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      >
                        <option value="cash">Nakit</option>
                        <option value="bank">Banka</option>
                        <option value="credit-card">Kredi Kartı</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tarih ve Saat
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Açıklama
                    </label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      placeholder="İşlem açıklaması"
                    />
                  </div>

                  <div className="mt-8 flex justify-between">
                    {transaction && (
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="px-4 py-2.5 rounded-lg text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                      >
                        Sil
                      </button>
                    )}
                    <div className="flex-1" />
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                    >
                      {transaction ? 'Güncelle' : 'Ekle'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default TransactionModal; 