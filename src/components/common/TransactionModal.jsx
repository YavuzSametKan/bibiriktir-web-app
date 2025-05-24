import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, DocumentIcon, PhotoIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { format, parse } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useCategories } from '../../context/CategoryContext';
import { useTransactions } from '../../context/TransactionContext';
import { toast } from 'react-toastify';

// PDF.js worker'ı için
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

function TransactionModal({ isOpen, onClose, transaction }) {
  const { categories, loading: categoriesLoading } = useCategories();
  const { addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    categoryId: '',
    accountType: 'cash',
    date: format(new Date(), 'dd.MM.yyyy-HH:mm'),
    description: '',
    attachment: null
  });

  const [activeTab, setActiveTab] = useState('details');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [fileType, setFileType] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (transaction) {
      const date = parse(transaction.date, 'dd.MM.yyyy-HH:mm', new Date());
      setFormData({
        type: transaction.type,
        amount: transaction.amount.toString(),
        categoryId: transaction.category?._id || '',
        accountType: transaction.accountType,
        date: format(date, "yyyy-MM-dd'T'HH:mm"),
        description: transaction.description || '',
        attachment: transaction.attachment || null
      });
      if (transaction.attachment) {
        setPreviewUrl(transaction.attachment.url);
        if (transaction.attachment.mimetype === 'application/pdf') {
          setFileType('pdf');
        } else if (transaction.attachment.mimetype.startsWith('image/')) {
          setFileType('image');
        }
      }
    } else {
      setFormData({
        type: 'expense',
        amount: '',
        categoryId: '',
        accountType: 'cash',
        date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        description: '',
        attachment: null
      });
      setPreviewUrl(null);
      setFileType(null);
    }
  }, [transaction]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // FormData oluştur
      const formDataToSend = new FormData();

      // Temel alanları ekle
      formDataToSend.append('type', formData.type);
      formDataToSend.append('amount', formData.amount);
      formDataToSend.append('categoryId', formData.categoryId);
      formDataToSend.append('accountType', formData.accountType);
      
      // Tarihi API'nin beklediği formata dönüştür
      const date = parse(formData.date, "yyyy-MM-dd'T'HH:mm", new Date());
      const formattedDate = format(date, 'dd.MM.yyyy-HH:mm');
      formDataToSend.append('date', formattedDate);
      
      // Açıklama varsa ekle
      if (formData.description) {
        formDataToSend.append('description', formData.description);
      }

      // Dosya işlemleri
      if (formData.attachment instanceof File) {
        // Yeni dosya yükleniyor
        console.log('Yeni dosya yükleniyor:', formData.attachment);
        formDataToSend.append('attachment', formData.attachment);
      } else if (transaction?.attachment && !previewUrl) {
        // Mevcut dosya kaldırılıyor
        console.log('Mevcut dosya kaldırılıyor');
        formDataToSend.append('removeAttachment', 'true');
      }

      // Debug için form verilerini logla
      const formDataObj = {};
      for (let [key, value] of formDataToSend.entries()) {
        if (key === 'attachment' && value instanceof File) {
          formDataObj[key] = {
            name: value.name,
            type: value.type,
            size: value.size
          };
        } else {
          formDataObj[key] = value;
        }
      }
      console.log('Gönderilecek form verisi:', formDataObj);

      let response;
      if (transaction) {
        // Güncelleme işlemi
        response = await updateTransaction(transaction._id, formDataToSend);
      } else {
        // Yeni işlem ekleme
        response = await addTransaction(formDataToSend);
      }

      // API yanıtını kontrol et
      if (response === true || (response && response.success)) {
        toast.success(transaction ? 'İşlem güncellendi' : 'İşlem eklendi');
        onClose();
      } else {
        // API'den gelen hata mesajını kullan
        const errorMessage = response?.error || (transaction ? 'Güncelleme başarısız oldu' : 'İşlem eklenirken bir hata oluştu');
        console.error('İşlem hatası:', errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('İşlem hatası:', error);
      toast.error(error.message || 'Bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!transaction) return;

    if (window.confirm('Bu işlemi silmek istediğinizden emin misiniz?')) {
      try {
        const response = await deleteTransaction(transaction._id);
        console.log('Silme yanıtı:', response); // Debug için

        if (response === true || (response && response.success)) {
          toast.success('İşlem başarıyla silindi');
          onClose();
        } else {
          const errorMessage = response?.error || 'Silme işlemi başarısız oldu';
          console.error('Silme hatası:', errorMessage);
          throw new Error(errorMessage);
        }
      } catch (error) {
        console.error('Silme hatası:', error);
        toast.error(error.message || 'Silme işlemi başarısız oldu');
      }
    }
  };

  const handleFileChange = (file) => {
    if (!file) return;

    // Dosya boyutu kontrolü (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Dosya boyutu 2MB\'dan büyük olamaz!');
      return;
    }

    // Dosya tipi kontrolü
    if (!file.type.match(/^(image\/|application\/pdf)/)) {
      toast.error('Sadece resim ve PDF dosyaları yükleyebilirsiniz!');
      return;
    }

    console.log('Yeni dosya seçildi:', file);
    setFormData(prev => ({ ...prev, attachment: file }));
    setPreviewUrl(URL.createObjectURL(file));
    
    if (file.type === 'application/pdf') {
      setFileType('pdf');
    } else if (file.type.startsWith('image/')) {
      setFileType('image');
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileChange(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleRemoveAttachment = () => {
    if (window.confirm('Eki silmek istediğinizden emin misiniz?')) {
      console.log('Ek kaldırılıyor');
      setFormData(prev => ({ ...prev, attachment: null }));
      setPreviewUrl(null);
      setFileType(null);
    }
  };

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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title as="h3" className="text-xl font-semibold text-gray-900">
                    {transaction ? 'İşlemi Düzenle' : 'Yeni İşlem Ekle'}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="mb-6">
                  <div className="flex space-x-4 border-b border-gray-200">
                    <button
                      onClick={() => setActiveTab('details')}
                      className={`pb-2 px-1 ${
                        activeTab === 'details'
                          ? 'border-b-2 border-indigo-500 text-indigo-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Detaylar
                    </button>
                    {transaction && (
                      <button
                        onClick={() => setActiveTab('attachment')}
                        className={`pb-2 px-1 ${
                          activeTab === 'attachment'
                            ? 'border-b-2 border-indigo-500 text-indigo-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Ek
                      </button>
                    )}
                  </div>
                </div>

                {activeTab === 'details' ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          İşlem Tipi
                        </label>
                        <select
                          value={formData.type}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                          required
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                        >
                          <option value="expense">Gider</option>
                          <option value="income">Gelir</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Kategori
                        </label>
                        <select
                          value={formData.categoryId}
                          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                          required
                          disabled={categoriesLoading}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                        >
                          <option value="">Kategori Seçin</option>
                          {categories
                            .filter(c => c.type === formData.type)
                            .map(category => (
                              <option key={category._id} value={category._id}>
                                {category.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tutar
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                        />
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
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ek (Fatura/Fiş)
                      </label>
                      <div
                        className={`mt-1 flex justify-center px-4 py-3 border-2 border-dashed rounded-lg ${
                          isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <div className="space-y-1 text-center">
                          {previewUrl ? (
                            <div className="relative inline-block">
                              {fileType === 'pdf' ? (
                                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                                  <DocumentIcon className="h-12 w-12 text-indigo-600" />
                                  <span className="mt-2 text-sm font-medium text-gray-600">PDF Dosyası</span>
                                </div>
                              ) : (
                                <img src={previewUrl} alt="Preview" className="h-20 w-auto" />
                              )}
                              <button
                                type="button"
                                onClick={handleRemoveAttachment}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                              >
                                <XMarkIcon className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <PhotoIcon className="mx-auto h-8 w-8 text-gray-400" />
                              <div className="flex text-sm text-gray-600">
                                <label
                                  htmlFor="file-upload"
                                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                >
                                  <span>Dosya Yükle</span>
                                  <input
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    className="sr-only"
                                    accept="image/*,.pdf"
                                    onChange={handleFileInputChange}
                                  />
                                </label>
                                <p className="pl-1">veya sürükleyip bırakın</p>
                              </div>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, PDF (max. 2MB)
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                      {transaction && (
                        <button
                          type="button"
                          onClick={handleDelete}
                          disabled={isSubmitting}
                          className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                        >
                          Sil
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 disabled:opacity-50"
                      >
                        İptal
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Kaydediliyor...' : (transaction ? 'Güncelle' : 'Ekle')}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    {previewUrl ? (
                      <div className="flex flex-col">
                        {fileType === 'pdf' ? (
                          <div className="w-full">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-2">
                                <DocumentIcon className="h-6 w-6 text-indigo-600" />
                                <span className="text-sm font-medium text-gray-900">
                                  PDF Dosyası
                                </span>
                              </div>
                              <div className="flex space-x-2">
                                <a
                                  href={previewUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100"
                                >
                                  Yeni Sekmede Aç
                                </a>
                                <button
                                  type="button"
                                  onClick={handleRemoveAttachment}
                                  className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 rounded-lg hover:bg-red-100"
                                >
                                  Eki Kaldır
                                </button>
                              </div>
                            </div>
                            <div className="w-full bg-gray-50 rounded-lg overflow-hidden border border-gray-200 p-6">
                              <div className="flex flex-col items-center justify-center text-center">
                                <DocumentIcon className="h-12 w-12 text-indigo-600 mb-3" />
                                <p className="text-sm text-gray-600">
                                  PDF dosyasını görüntülemek için "Yeni Sekmede Aç" butonuna tıklayın.
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-2">
                                <PhotoIcon className="h-6 w-6 text-indigo-600" />
                                <span className="text-sm font-medium text-gray-900">
                                  Resim Önizleme
                                </span>
                              </div>
                              <div className="flex space-x-2">
                                <a
                                  href={previewUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100"
                                >
                                  Tam Boyut
                                </a>
                                <button
                                  type="button"
                                  onClick={handleRemoveAttachment}
                                  className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 rounded-lg hover:bg-red-100"
                                >
                                  Eki Kaldır
                                </button>
                              </div>
                            </div>
                            <div className="w-full bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                              <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-full h-auto max-h-[500px] object-contain"
                              />
                            </div>
                          </div>
                        )}
                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={() => setActiveTab('details')}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
                          >
                            <ArrowLeftIcon className="h-4 w-4 mr-2" />
                            Detaylara Dön
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">
                          Bu işlem için ek bulunmamaktadır.
                        </p>
                        <button
                          type="button"
                          onClick={() => setActiveTab('details')}
                          className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                        >
                          <ArrowLeftIcon className="h-4 w-4 mr-2" />
                          Detaylara Dön
                        </button>
                      </div>
                    )}
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

export default TransactionModal; 