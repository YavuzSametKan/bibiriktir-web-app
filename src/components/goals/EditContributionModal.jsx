import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { motion } from 'framer-motion';

const EditContributionModal = ({ isOpen, onClose, onUpdate, contribution, goal }) => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (contribution) {
      setAmount(contribution.amount.toString());
      setNote(contribution.note || '');
    }
  }, [contribution]);

  const remainingAmount = goal ? goal.targetAmount - (goal.currentAmount - contribution?.amount) : 0;

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    
    if (value && Number(value) > remainingAmount) {
      setError(`Kalan tutar: ${remainingAmount.toLocaleString('tr-TR')} ₺`);
    } else {
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Number(amount) > remainingAmount) {
      return;
    }

    onUpdate({
      ...contribution,
      amount: Number(amount),
      note,
    });
  };

  if (!contribution) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Katkıyı Düzenle">
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
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={!!error}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Güncelle
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditContributionModal; 