import React, { useState } from 'react';
import Modal from '../common/Modal';
import { toast } from 'react-toastify';

const AddGoalModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    deadline: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Hedef adı gerekli';
    }

    if (!formData.targetAmount || Number(formData.targetAmount) <= 0) {
      newErrors.targetAmount = 'Geçerli bir hedef miktarı girin';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Son tarih gerekli';
    } else {
      const selectedDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate <= today) {
        newErrors.deadline = 'Son tarih bugünden sonraki bir tarih olmalıdır';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onAdd({
      ...formData,
      targetAmount: Number(formData.targetAmount),
      currentAmount: 0,
      contributions: []
    });
    setFormData({ title: '', targetAmount: '', deadline: '' });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Hata mesajını temizle
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Yeni Hedef Oluştur">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Hedef Adı
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className={`block w-full px-3 py-1.5 text-gray-900 border ${
              errors.title ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            placeholder="Örn: Bilgisayar Parası"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 mb-1">
            Hedef Miktarı (₺)
          </label>
          <input
            type="number"
            id="targetAmount"
            name="targetAmount"
            value={formData.targetAmount}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className={`block w-full px-3 py-1.5 text-gray-900 border ${
              errors.targetAmount ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            placeholder="Örn: 30000"
          />
          {errors.targetAmount && (
            <p className="mt-1 text-sm text-red-600">{errors.targetAmount}</p>
          )}
        </div>

        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
            Son Tarih
          </label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
            min={new Date().toISOString().split('T')[0]}
            className={`block w-full px-3 py-1.5 text-gray-900 border ${
              errors.deadline ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {errors.deadline && (
            <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            İptal
          </button>
          <button
            type="submit"
            className="px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Oluştur
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddGoalModal; 