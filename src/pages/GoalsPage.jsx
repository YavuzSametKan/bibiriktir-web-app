import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { PlusIcon } from '@heroicons/react/24/outline';
import AddGoalModal from '../components/goals/AddGoalModal';
import CelebrateConfetti from '../components/goals/CelebrateConfetti';
import GoalCard from '../components/goals/GoalCard';
import AddContributionModal from '../components/goals/AddContributionModal';
import GoalDetailModal from '../components/goals/GoalDetailModal';
import goalsService from '../services/goalsService';

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [filter, setFilter] = useState('active'); // 'all', 'active', 'completed'
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isAddContributionModalOpen, setIsAddContributionModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Hedefleri yükle
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await goalsService.getGoals();
        if (response.success) {
          setGoals(response.data.goals);
        }
      } catch (error) {
        toast.error(error.message || 'Hedefler yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  const handleAddGoal = async (newGoal) => {
    try {
      const response = await goalsService.createGoal(newGoal);
      if (response.success) {
        setGoals(prevGoals => [...prevGoals, response.data]);
        toast.success('Yeni hedef başarıyla oluşturuldu.');
        setIsAddGoalModalOpen(false);
      }
    } catch (error) {
      toast.error(error.message || 'Hedef oluşturulurken bir hata oluştu');
    }
  };

  const handleAddContribution = async (contribution) => {
    console.log('Selected Goal:', selectedGoal);

    if (!selectedGoal || !selectedGoal._id) {
      console.error('Hedef seçilmedi veya geçersiz hedef:', selectedGoal);
      toast.error('Hedef seçilmedi');
      return;
    }

    try {
      console.log('Katkı ekleniyor:', {
        goalId: selectedGoal._id,
        contribution
      });

      const response = await goalsService.addContribution(selectedGoal._id, contribution);
      console.log('Katkı ekleme yanıtı:', response);
      
      if (!response.success) {
        toast.error(response.message || 'Katkı eklenirken bir hata oluştu');
        return;
      }

      const updatedGoal = await goalsService.getGoalDetails(selectedGoal._id);
      console.log('Güncellenmiş hedef:', updatedGoal);
      
      if (!updatedGoal.success) {
        toast.error('Hedef güncellenirken bir hata oluştu');
        return;
      }

      setGoals(prevGoals => {
        return prevGoals.map(goal => {
          if (goal._id === selectedGoal._id) {
            return updatedGoal.data;
          }
          return goal;
        });
      });

      const progress = (updatedGoal.data.currentAmount / updatedGoal.data.targetAmount) * 100;
      if (progress >= 80 && progress < 100) {
        toast.info('Hedefine çok az kaldı, harika gidiyorsun!');
      } else if (progress >= 100) {
        toast.success('🎉 Hedefine ulaştın!');
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }

      toast.success('Katkı başarıyla kaydedildi.');
      setIsAddContributionModalOpen(false);
      setSelectedGoal(null);

    } catch (error) {
      console.error('Katkı ekleme hatası:', error);
      toast.error(error.message || 'Katkı eklenirken bir hata oluştu');
    }
  };

  const handleUpdateContribution = async (goalId, contributionId, updatedContribution) => {
    try {
      console.log('Güncellenecek katkı:', { goalId, contributionId, updatedContribution });
      const response = await goalsService.updateContribution(goalId, contributionId, updatedContribution);
      console.log('Katkı güncelleme yanıtı:', response);

      if (response.success) {
        const updatedGoal = await goalsService.getGoalDetails(goalId);
        if (updatedGoal.success) {
          setGoals(prevGoals => prevGoals.map(goal => 
            goal._id === goalId ? updatedGoal.data : goal
          ));
          if (selectedGoal && selectedGoal._id === goalId) {
            setSelectedGoal(updatedGoal.data);
          }
          toast.success('Katkı başarıyla güncellendi.');
        } else {
          toast.error('Hedef güncellenirken bir hata oluştu.');
        }
      } else {
        toast.error(response.message || 'Katkı güncellenirken bir hata oluştu.');
      }
    } catch (error) {
      console.error('Katkı güncelleme hatası:', error);
      toast.error('Katkı güncellenirken bir hata oluştu.');
    }
  };

  const handleDeleteContribution = async (goalId, contributionId) => {
    try {
      console.log('Silinecek katkı:', { goalId, contributionId });
      const response = await goalsService.deleteContribution(goalId, contributionId);
      console.log('Katkı silme yanıtı:', response);

      if (response.success) {
        const updatedGoal = await goalsService.getGoalDetails(goalId);
        if (updatedGoal.success) {
          setGoals(prevGoals => prevGoals.map(goal => 
            goal._id === goalId ? updatedGoal.data : goal
          ));
          if (selectedGoal && selectedGoal._id === goalId) {
            setSelectedGoal(updatedGoal.data);
          }
          toast.success('Katkı başarıyla silindi.');
        } else {
          toast.error('Hedef güncellenirken bir hata oluştu.');
        }
      } else {
        toast.error(response.message || 'Katkı silinirken bir hata oluştu.');
      }
    } catch (error) {
      console.error('Katkı silme hatası:', error);
      toast.error('Katkı silinirken bir hata oluştu.');
    }
  };

  const handleUpdateGoal = async (updatedGoal) => {
    try {
      const response = await goalsService.updateGoal(updatedGoal._id, updatedGoal);
      if (response.success) {
        setGoals(prevGoals => prevGoals.map(goal => 
          goal._id === updatedGoal._id ? response.data : goal
        ));

        if (selectedGoal && selectedGoal._id === updatedGoal._id) {
          setSelectedGoal(response.data);
        }

        toast.success('Hedef başarıyla güncellendi.');
      }
    } catch (error) {
      toast.error(error.message || 'Hedef güncellenirken bir hata oluştu');
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      const response = await goalsService.deleteGoal(goalId);
      if (response.success) {
        setGoals(prevGoals => prevGoals.filter(goal => goal._id !== goalId));
        toast.success('Hedef başarıyla silindi.');
      }
    } catch (error) {
      toast.error(error.message || 'Hedef silinirken bir hata oluştu');
    }
  };

  const filteredGoals = goals
    .filter(goal => {
      const progress = (goal.currentAmount / goal.targetAmount) * 100;
      if (filter === 'active') return progress < 100;
      if (filter === 'completed') return progress >= 100;
      return true;
    })
    .sort((a, b) => {
      // createdAt alanına göre sıralama (en yeniden en eskiye)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Hedeflerim</h1>
        <button
          onClick={() => setIsAddGoalModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Yeni Hedef
        </button>
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            filter === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Tümü
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            filter === 'active'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Aktif
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            filter === 'completed'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Tamamlanan
        </button>
      </div>

      <AnimatePresence>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map((goal, index) => (
            <GoalCard
              key={goal?._id ? `goal-${goal._id}` : `goal-${index}`}
              goal={goal}
              onAddContribution={() => {
                console.log('Setting selected goal:', goal);
                setSelectedGoal(goal);
                setIsAddContributionModalOpen(true);
              }}
              onViewDetails={() => {
                setSelectedGoal(goal);
                setIsDetailModalOpen(true);
              }}
            />
          ))}
        </div>
      </AnimatePresence>

      {filteredGoals.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Henüz hedef bulunmuyor.</p>
        </div>
      )}

      <AddGoalModal
        isOpen={isAddGoalModalOpen}
        onClose={() => setIsAddGoalModalOpen(false)}
        onAdd={handleAddGoal}
      />

      <AddContributionModal
        isOpen={isAddContributionModalOpen}
        onClose={() => {
          setIsAddContributionModalOpen(false);
          setSelectedGoal(null);
        }}
        onAdd={handleAddContribution}
        goal={selectedGoal}
      />

      <GoalDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        goal={selectedGoal}
        onUpdateContribution={handleUpdateContribution}
        onDeleteContribution={handleDeleteContribution}
        onUpdateGoal={handleUpdateGoal}
        onDeleteGoal={handleDeleteGoal}
      />

      {showConfetti && <CelebrateConfetti />}
    </div>
  );
};

export default GoalsPage; 