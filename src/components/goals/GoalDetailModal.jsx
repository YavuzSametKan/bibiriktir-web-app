import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { PencilIcon, TrashIcon, CheckIcon, XMarkIcon, CalendarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import goalsService from '../../services/goalsService';
import confetti from 'canvas-confetti';

const ContributionItem = ({ contribution, goalId, onUpdate, onDelete, goal }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editAmount, setEditAmount] = useState(contribution.amount.toString());
  const [editNote, setEditNote] = useState(contribution.note || '');
  const [error, setError] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  // Kalan tutarı hesapla (güncellenmek istenen katkının tutarını da hesaba kat)
  const remainingAmount = (goal.targetAmount - goal.currentAmount) + contribution.amount;

  const handleEdit = () => {
    setIsEditing(true);
    setEditAmount(contribution.amount.toString());
    setEditNote(contribution.note || '');
    setError('');
    setHasChanges(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditAmount(contribution.amount.toString());
    setEditNote(contribution.note || '');
    setError('');
    setHasChanges(false);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setEditAmount(value);
    
    const newAmount = Number(value) || 0;
    const hasAmountChanged = newAmount !== contribution.amount;
    const hasNoteChanged = editNote !== (contribution.note || '');
    setHasChanges(hasAmountChanged || hasNoteChanged);
    
    // Kalan tutar kontrolü
    if (value && newAmount > remainingAmount) {
      setError(`Maksimum tutar: ${remainingAmount.toLocaleString('tr-TR')} ₺`);
    } else {
      setError('');
    }
  };

  const handleNoteChange = (e) => {
    const value = e.target.value;
    setEditNote(value);
    
    const hasAmountChanged = Number(editAmount) !== contribution.amount;
    const hasNoteChanged = value !== (contribution.note || '');
    setHasChanges(hasAmountChanged || hasNoteChanged);
  };

  const handleUpdate = async () => {
    if (error) return;

    const newAmount = Number(editAmount);
    if (isNaN(newAmount) || newAmount <= 0) {
      setError('Geçerli bir miktar giriniz');
      return;
    }

    // Kalan tutar kontrolü
    if (newAmount > remainingAmount) {
      setError(`Maksimum tutar: ${remainingAmount.toLocaleString('tr-TR')} ₺`);
      return;
    }

    try {
      await onUpdate(goalId, contribution._id, {
        amount: newAmount,
        note: editNote,
        date: contribution.date
      });
      
      setIsEditing(false);
      setError('');
    } catch (error) {
      console.error('Katkı güncelleme hatası:', error);
      setError(error.message || 'Katkı güncellenirken bir hata oluştu');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Bu katkıyı silmek istediğinizden emin misiniz?')) {
      try {
        await onDelete(goalId, contribution._id);
      } catch (error) {
        console.error('Katkı silme hatası:', error);
      }
    }
  };

  return (
    <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
      {isEditing ? (
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
        {isEditing ? (
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
              onClick={handleEdit}
              className="p-1.5 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-full"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const GoalDetailModal = ({ isOpen, onClose, goal, onUpdateContribution, onDeleteContribution, onUpdateGoal, onDeleteGoal }) => {
  const [isExtendingDeadline, setIsExtendingDeadline] = useState(false);
  const [isUpdatingTarget, setIsUpdatingTarget] = useState(false);
  const [newDeadline, setNewDeadline] = useState('');
  const [newTargetAmount, setNewTargetAmount] = useState('');
  const [deadlineError, setDeadlineError] = useState('');
  const [targetAmountError, setTargetAmountError] = useState('');
  const [localGoal, setLocalGoal] = useState(goal);

  useEffect(() => {
    setLocalGoal(goal);
  }, [goal]);

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
      ...localGoal,
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

  const handleUpdateTarget = () => {
    setIsUpdatingTarget(true);
    setNewTargetAmount(localGoal.targetAmount.toString());
  };

  const handleSaveTarget = () => {
    const amount = Number(newTargetAmount);
    
    if (isNaN(amount) || amount <= 0) {
      setTargetAmountError('Geçerli bir tutar giriniz');
      return;
    }

    if (amount < localGoal.currentAmount) {
      setTargetAmountError('Hedef tutarı mevcut tutardan küçük olamaz');
      return;
    }

    const updatedGoal = {
      ...localGoal,
      targetAmount: amount
    };
    
    onUpdateGoal(updatedGoal);
    setIsUpdatingTarget(false);
    setTargetAmountError('');
    onClose(); // Modalı kapat
  };

  const handleCancelTarget = () => {
    setIsUpdatingTarget(false);
    setNewTargetAmount('');
    setTargetAmountError('');
  };

  const handleDeleteGoal = () => {
    if (window.confirm('Bu hedefi iptal etmek istediğinizden emin misiniz?')) {
      onDeleteGoal(goal._id);
      onClose();
    }
  };

  const handleUpdateContribution = async (goalId, contributionId, updatedContribution) => {
    try {
      await onUpdateContribution(goalId, contributionId, updatedContribution);
      // Güncel hedef verilerini al
      const updatedGoal = await goalsService.getGoalDetails(goalId);
      if (updatedGoal.success) {
        setLocalGoal(updatedGoal.data);
        
        // Hedef tamamlandı mı kontrol et
        const progress = (updatedGoal.data.currentAmount / updatedGoal.data.targetAmount) * 100;
        if (progress >= 100) {
          toast.success('Tebrikler! Hedefinize ulaştınız! 🎉');
          
          // Konfeti efekti
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
        
        onClose(); // Modalı kapat
      }
    } catch (error) {
      console.error('Katkı güncelleme hatası:', error);
    }
  };

  const handleDeleteContribution = async (goalId, contributionId) => {
    try {
      await onDeleteContribution(goalId, contributionId);
      // Güncel hedef verilerini al
      const updatedGoal = await goalsService.getGoalDetails(goalId);
      if (updatedGoal.success) {
        setLocalGoal(updatedGoal.data);
        onClose(); // Modalı kapat
      }
    } catch (error) {
      console.error('Katkı silme hatası:', error);
    }
  };

  if (!localGoal) return null;

  const progress = (localGoal.currentAmount / localGoal.targetAmount) * 100;
  const isCompleted = progress >= 100;

  const sortedContributions = [...localGoal.contributions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={
      <div className="space-y-1">
        <h3 className="text-xl font-semibold text-gray-900">{localGoal.title}</h3>
        <p className="text-sm text-gray-500">Hedef Detayları</p>
      </div>
    }>
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500">Hedef Tutarı</p>
              {isUpdatingTarget ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={newTargetAmount}
                      onChange={(e) => setNewTargetAmount(e.target.value)}
                      min={localGoal.currentAmount}
                      step="0.01"
                      className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <span className="text-gray-500">₺</span>
                  </div>
                  {targetAmountError && (
                    <p className="text-xs text-red-500">{targetAmountError}</p>
                  )}
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveTarget}
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Kaydet
                    </button>
                    <button
                      onClick={handleCancelTarget}
                      className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <p className="text-base font-medium text-gray-900">{formatCurrency(localGoal.targetAmount)}</p>
                  {!isCompleted && (
                    <button
                      onClick={handleUpdateTarget}
                      className="inline-flex items-center p-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      title="Hedef Tutarını Güncelle"
                    >
                      <CurrencyDollarIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-500">Mevcut Tutar</p>
              <p className="text-base font-medium text-gray-900">{formatCurrency(localGoal.currentAmount)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Kalan Tutar</p>
              <p className="text-base font-medium text-gray-900">{formatCurrency(localGoal.targetAmount - localGoal.currentAmount)}</p>
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
                  <p className="text-base font-medium text-gray-900">{formatDate(localGoal.deadline)}</p>
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
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
            {sortedContributions.map(contribution => (
              <ContributionItem
                key={contribution._id}
                contribution={contribution}
                goalId={localGoal._id}
                goal={localGoal}
                onUpdate={handleUpdateContribution}
                onDelete={handleDeleteContribution}
              />
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

// Global CSS için stil ekleyin
const style = document.createElement('style');
style.textContent = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 2px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 2px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;
document.head.appendChild(style);

export default GoalDetailModal; 