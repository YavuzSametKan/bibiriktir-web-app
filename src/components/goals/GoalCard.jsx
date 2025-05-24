import React from 'react';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import GoalProgressBar, { getProgressStyle } from './GoalProgressBar';

const GoalCard = ({ goal, onAddContribution, onViewDetails }) => {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const isCompleted = progress >= 100;
  const progressStyle = getProgressStyle(progress);

  const daysLeft = goal.deadline ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md p-6 relative mb-4"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold">{goal.title}</h3>
          {daysLeft !== null && (
            <p className="text-sm text-gray-600">
              {daysLeft > 0 ? `${daysLeft} gün kaldı` : 'Süre doldu'}
            </p>
          )}
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${progressStyle.statusColor}`}>
          {progressStyle.statusText}
        </span>
      </div>

      <GoalProgressBar
        current={goal.currentAmount}
        total={goal.targetAmount}
        progress={progress}
      />

      <div className="flex justify-end space-x-2 mt-4">
        {!isCompleted && (
          <button
            onClick={onAddContribution}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Katkı Ekle
          </button>
        )}
        <button
          onClick={onViewDetails}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Detaylar
        </button>
      </div>
    </motion.div>
  );
};

export default GoalCard; 