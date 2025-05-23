import React, { useState } from 'react';
import Modal from '../common/Modal';
import { PencilIcon, TrashIcon, CheckIcon, XMarkIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const GoalDetailModal = ({ isOpen, onClose, goal, onUpdateContribution, onDeleteContribution, onUpdateGoal, onDeleteGoal }) => {
  const [editingContribution, setEditingContribution] = useState(null);
  const [editAmount, setEditAmount] = useState('');
  const [editNote, setEditNote] = useState('');
  const [error, setError] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [isExtendingDeadline, setIsExtendingDeadline] = useState(false);
  const [newDeadline, setNewDeadline] = useState('');
  const [deadlineError, setDeadlineError] = useState('');

  const handleEdit = (contribution) => {
    setEditingContribution(contribution);
    setEditAmount(contribution.amount.toString());
    setEditNote(contribution.note || '');
    setError('');
    setHasChanges(false);
  };

  const handleCancelEdit = () => {
    setEditingContribution(null);
    setEditAmount('');
    setEditNote('');
    setError('');
    setHasChanges(false);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setEditAmount(value);
    
    const remainingAmount = goal.targetAmount - (goal.currentAmount - editingContribution.amount);
    const newAmount = Number(value) || 0;
    
    // Değişiklik kontrolü
    const hasAmountChanged = newAmount !== editingContribution.amount;
    const hasNoteChanged = editNote !== (editingContribution.note || '');
    setHasChanges(hasAmountChanged || hasNoteChanged);
    
    if (value && newAmount > remainingAmount) {
      setError(`Kalan tutar: ${remainingAmount.toLocaleString('tr-TR')} ₺`);
    } else {
      setError('');
    }
  };

  const handleNoteChange = (e) => {
    const value = e.target.value;
    setEditNote(value);
    
    // Değişiklik kontrolü
    const hasAmountChanged = Number(editAmount) !== editingContribution.amount;
    const hasNoteChanged = value !== (editingContribution.note || '');
    setHasChanges(hasAmountChanged || hasNoteChanged);
  };

  const handleUpdate = () => {
    if (error) return;

    const remainingAmount = goal.targetAmount - (goal.currentAmount - editingContribution.amount);
    if (Number(editAmount) > remainingAmount) return;

    onUpdateContribution({
      ...editingContribution,
      amount: Number(editAmount),
      note: editNote,
    });
    handleCancelEdit();
  };

  const handleDelete = (contribution) => {
    if (window.confirm('Bu katkıyı silmek istediğinizden emin misiniz?')) {
      onDeleteContribution(contribution.id);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleExtendDeadline = () => {
    setIsExtendingDeadline(true);
    setNewDeadline(goal.deadline);
  };

  const handleSaveDeadline = () => {
    const currentDate = new Date();
    const selectedDate = new Date(newDeadline);
    
    if (selectedDate <= currentDate) {
      setDeadlineError('Yeni bitiş tarihi bugünden sonraki bir tarih olmalıdır.');
      return;
    }

    const updatedGoal = {
      ...goal,
      deadline: newDeadline
    };
    
    onUpdateGoal(updatedGoal);
    setIsExtendingDeadline(false);
    setDeadlineError('');
  };

  const handleCancelExtend = () => {
    setIsExtendingDeadline(false);
    setNewDeadline('');
    setDeadlineError('');
  };

  const handleDeleteGoal = () => {
    if (window.confirm('Bu hedefi iptal etmek istediğinizden emin misiniz?')) {
      onDeleteGoal(goal.id);
      onClose();
      toast.success('Hedef başarıyla iptal edildi.');
    }
  };

  if (!goal) return null;

  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const isCompleted = progress >= 100;

  const sortedContributions = [...goal.contributions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Hedef Detayları">
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500">Hedef Tutarı</p>
              <p className="text-base font-medium text-gray-900">{formatCurrency(goal.targetAmount)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Mevcut Tutar</p>
              <p className="text-base font-medium text-gray-900">{formatCurrency(goal.currentAmount)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Kalan Tutar</p>
              <p className="text-base font-medium text-gray-900">{formatCurrency(goal.targetAmount - goal.currentAmount)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Bitiş Tarihi</p>
              {isExtendingDeadline ? (
                <div className="space-y-2">
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {deadlineError && (
                    <p className="text-xs text-red-500">{deadlineError}</p>
                  )}
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveDeadline}
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Kaydet
                    </button>
                    <button
                      onClick={handleCancelExtend}
                      className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <p className="text-base font-medium text-gray-900">{formatDate(goal.deadline)}</p>
                  {!isCompleted && (
                    <button
                      onClick={handleExtendDeadline}
                      className="inline-flex items-center p-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      title="Süreyi Güncelle"
                    >
                      <CalendarIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Katkılar</h3>
          <div className="space-y-2">
            {sortedContributions.map((contribution) => (
              <div
                key={contribution.id}
                className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200"
              >
                {editingContribution?.id === contribution.id ? (
                  <div className="flex-1 space-y-2 mr-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={editAmount}
                        onChange={handleAmountChange}
                        required
                        min="0"
                        step="0.01"
                        className="block w-32 px-3 py-1.5 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Miktar"
                      />
                      <span className="text-gray-500">₺</span>
                    </div>
                    {error && (
                      <p className="text-sm text-red-600">{error}</p>
                    )}
                    <textarea
                      value={editNote}
                      onChange={handleNoteChange}
                      rows={1}
                      className="block w-full px-3 py-1.5 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Not (opsiyonel)"
                    />
                  </div>
                ) : (
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {contribution.amount.toLocaleString('tr-TR')} ₺
                    </p>
                    {contribution.note && (
                      <p className="text-sm text-gray-500 mt-1">{contribution.note}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(contribution.date).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  {editingContribution?.id === contribution.id ? (
                    <>
                      <button
                        onClick={handleUpdate}
                        disabled={!!error || !hasChanges}
                        className="p-1.5 text-gray-400 hover:text-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 rounded-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-400"
                      >
                        <CheckIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-1.5 text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-full"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(contribution)}
                        className="p-1.5 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(contribution)}
                        className="p-1.5 text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-full"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {!isCompleted && (
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleDeleteGoal}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Hedefi İptal Et
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default GoalDetailModal; 