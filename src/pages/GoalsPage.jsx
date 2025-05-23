import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { PlusIcon } from '@heroicons/react/24/outline';
import AddGoalModal from '../components/goals/AddGoalModal';
import CelebrateConfetti from '../components/goals/CelebrateConfetti';
import GoalCard from '../components/goals/GoalCard';
import AddContributionModal from '../components/goals/AddContributionModal';
import GoalDetailModal from '../components/goals/GoalDetailModal';
import { mockGoals } from '../data/mockGoals';

const GoalsPage = () => {
  const [goals, setGoals] = useState(mockGoals);
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [filter, setFilter] = useState('active'); // 'all', 'active', 'completed'
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isAddContributionModalOpen, setIsAddContributionModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleAddGoal = (newGoal) => {
    setGoals([...goals, { ...newGoal, id: `goal-${Date.now()}` }]);
    toast.success('Yeni hedef başarıyla oluşturuldu.');
    setIsAddGoalModalOpen(false);
  };

  const handleAddContribution = (contribution) => {
    if (!selectedGoal) return;

    const updatedGoals = goals.map(goal => {
      if (goal.id === selectedGoal.id) {
        const newAmount = goal.currentAmount + contribution.amount;
        const progress = (newAmount / goal.targetAmount) * 100;
        
        if (progress >= 80 && progress < 100) {
          toast.info('Hedefine çok az kaldı, harika gidiyorsun!');
        } else if (progress >= 100) {
          toast.success('🎉 Hedefine ulaştın!');
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        }

        return {
          ...goal,
          currentAmount: newAmount,
          contributions: [...goal.contributions, { ...contribution, id: `c${Date.now()}` }]
        };
      }
      return goal;
    });

    setGoals(updatedGoals);
    toast.success('Katkı başarıyla kaydedildi.');
    setIsAddContributionModalOpen(false);
  };

  const handleUpdateContribution = (updatedContribution) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === selectedGoal.id) {
        const oldContribution = goal.contributions.find(c => c.id === updatedContribution.id);
        const contributionDiff = updatedContribution.amount - oldContribution.amount;
        const newAmount = goal.currentAmount + contributionDiff;
        const progress = (newAmount / goal.targetAmount) * 100;
        
        if (progress >= 80 && progress < 100) {
          toast.info('Hedefine çok az kaldı, harika gidiyorsun!');
        } else if (progress >= 100) {
          toast.success('🎉 Hedefine ulaştın!');
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        }

        const updatedGoal = {
          ...goal,
          currentAmount: newAmount,
          contributions: goal.contributions.map(c => 
            c.id === updatedContribution.id ? updatedContribution : c
          )
        };

        // Seçili hedefi güncelle
        if (selectedGoal.id === goal.id) {
          setSelectedGoal(updatedGoal);
        }

        return updatedGoal;
      }
      return goal;
    });

    setGoals(updatedGoals);
    toast.success('Katkı başarıyla güncellendi.');
  };

  const handleDeleteContribution = (contributionId) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === selectedGoal.id) {
        const contribution = goal.contributions.find(c => c.id === contributionId);
        const newAmount = goal.currentAmount - contribution.amount;
        const progress = (newAmount / goal.targetAmount) * 100;

        const updatedGoal = {
          ...goal,
          currentAmount: newAmount,
          contributions: goal.contributions.filter(c => c.id !== contributionId)
        };

        // Seçili hedefi güncelle
        if (selectedGoal.id === goal.id) {
          setSelectedGoal(updatedGoal);
        }

        return updatedGoal;
      }
      return goal;
    });

    setGoals(updatedGoals);
    toast.success('Katkı başarıyla silindi.');
  };

  const handleUpdateGoal = (updatedGoal) => {
    setGoals(prevGoals => prevGoals.map(goal => 
      goal.id === updatedGoal.id ? updatedGoal : goal
    ));

    if (selectedGoal && selectedGoal.id === updatedGoal.id) {
      setSelectedGoal(updatedGoal);
    }

    toast.success('Hedef başarıyla güncellendi.');
  };

  const handleDeleteGoal = (goalId) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    setGoals(updatedGoals);
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGoals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onAddContribution={() => {
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