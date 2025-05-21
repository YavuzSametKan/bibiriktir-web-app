import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

function CategoryModal({ isOpen, onClose, categories, onAdd, onUpdate, onDelete }) {
  const [newCategory, setNewCategory] = useState({ name: '', type: 'expense' });
  const [editingCategory, setEditingCategory] = useState(null);

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategory.name.trim()) {
      onAdd(newCategory);
      setNewCategory({ name: '', type: 'expense' });
    }
  };

  const handleUpdateCategory = (e) => {
    e.preventDefault();
    if (editingCategory.name.trim()) {
      onUpdate(editingCategory);
      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      onDelete(categoryId);
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
                    Kategori Yönetimi
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </Dialog.Title>

                <div className="space-y-6">
                  {/* Yeni Kategori Ekleme Formu */}
                  <form onSubmit={handleAddCategory} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Yeni Kategori
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="text"
                          value={newCategory.name}
                          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                          className="block w-full rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Kategori adı"
                        />
                        <select
                          value={newCategory.type}
                          onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value })}
                          className="rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="expense">Harcama</option>
                          <option value="income">Gelir</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                    >
                      Kategori Ekle
                    </button>
                  </form>

                  {/* Kategori Listesi */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-900">Mevcut Kategoriler</h4>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div
                          key={category.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          {editingCategory?.id === category.id ? (
                            <form
                              onSubmit={handleUpdateCategory}
                              className="flex-1 flex items-center space-x-2"
                            >
                              <input
                                type="text"
                                value={editingCategory.name}
                                onChange={(e) =>
                                  setEditingCategory({ ...editingCategory, name: e.target.value })
                                }
                                className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                              <select
                                value={editingCategory.type}
                                onChange={(e) =>
                                  setEditingCategory({ ...editingCategory, type: e.target.value })
                                }
                                className="rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              >
                                <option value="expense">Harcama</option>
                                <option value="income">Gelir</option>
                              </select>
                              <button
                                type="submit"
                                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                Kaydet
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingCategory(null)}
                                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                              >
                                İptal
                              </button>
                            </form>
                          ) : (
                            <>
                              <div>
                                <span className="text-sm font-medium text-gray-900">
                                  {category.name}
                                </span>
                                <span className="ml-2 text-xs text-gray-500">
                                  ({category.type === 'expense' ? 'Harcama' : 'Gelir'})
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => setEditingCategory(category)}
                                  className="text-gray-400 hover:text-gray-500"
                                >
                                  <PencilIcon className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCategory(category.id)}
                                  className="text-gray-400 hover:text-red-500"
                                >
                                  <TrashIcon className="h-5 w-5" />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
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

export default CategoryModal; 