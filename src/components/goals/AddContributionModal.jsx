import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const AddContributionModal = ({ isOpen, onClose, onAdd, goal }) => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal açıldığında form verilerini sıfırla
  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setNote('');
      setError('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const remainingAmount = goal ? goal.targetAmount - goal.currentAmount : 0;
  const progress = goal ? ((goal.currentAmount + Number(amount || 0)) / goal.targetAmount) * 100 : 0;
  const isMilestone = progress >= 80 && progress < 100;
  const isCompleted = progress >= 100;

  const getProgressColor = () => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-orange-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 25) return 'bg-blue-500';
    return 'bg-gray-500';
  };

  const getProgressTextColor = () => {
    if (progress >= 100) return 'text-green-800';
    if (progress >= 75) return 'text-orange-800';
    if (progress >= 50) return 'text-yellow-800';
    if (progress >= 25) return 'text-blue-800';
    return 'text-gray-800';
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    
    if (value && Number(value) > remainingAmount) {
      setError(`Kalan tutar: ${remainingAmount.toLocaleString('tr-TR')} ₺`);
    } else {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    if (!goal?._id) {
      toast.error('Hedef seçilmedi');
      onClose();
      return;
    }

    if (!amount || Number(amount) <= 0) {
      toast.error('Lütfen geçerli bir miktar girin');
      return;
    }

    if (Number(amount) > remainingAmount) {
      toast.error(`Kalan tutar: ${remainingAmount.toLocaleString('tr-TR')} ₺`);
      return;
    }

    try {
      console.log('Katkı ekleme başlıyor...');
      setIsSubmitting(true);
      const contribution = {
        amount: Number(amount),
        note: note.trim(),
        date: new Date().toISOString()
      };

      console.log('onAdd çağrılıyor...');
      await onAdd(contribution);
      console.log('onAdd tamamlandı, modal kapanıyor...');
      onClose();
    } catch (error) {
      console.error('Katkı ekleme hatası:', error);
      toast.error(error.message || 'Katkı eklenirken bir hata oluştu');
    } finally {
      console.log('isSubmitting false yapılıyor...');
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Katkı Ekle">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Katkı Miktarı (₺)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={handleAmountChange}
            required
            min="0"
            step="0.01"
            max={remainingAmount}
            className="block w-full px-3 py-1.5 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Örn: 1000"
          />
          <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
            Kalan tutar: {remainingAmount.toLocaleString('tr-TR')} ₺
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">İlerleme</span>
            <span className={`font-medium ${getProgressTextColor()}`}>%{Math.min(Math.round(progress), 100)}</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <motion.div
              className={`h-full ${getProgressColor()} transition-colors duration-300`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          {isMilestone && (
            <p className="text-sm text-yellow-800 font-medium">
              🎯 Hedefine çok az kaldı, harika gidiyorsun!
            </p>
          )}
          {isCompleted && (
            <p className="text-sm text-green-800 font-medium">
              🎉 Tebrikler! Hedefine ulaştın!
            </p>
          )}
        </div>

        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
            Not (Opsiyonel)
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="block w-full px-3 py-1.5 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Bu katkı hakkında bir not ekleyin..."
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={!!error || isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Ekleniyor...' : 'Ekle'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddContributionModal; 