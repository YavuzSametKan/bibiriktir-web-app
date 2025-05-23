import React from 'react';
import { motion } from 'framer-motion';

const getProgressStyle = (progress) => {
  if (progress >= 100) {
    return {
      barColor: 'bg-green-500',
      statusColor: 'bg-green-100 text-green-800',
      statusText: 'Hedefine Ulaştın'
    };
  } else if (progress >= 76) {
    return {
      barColor: 'bg-orange-500',
      statusColor: 'bg-orange-100 text-orange-800',
      statusText: 'Neredeyse Başardın'
    };
  } else if (progress >= 51) {
    return {
      barColor: 'bg-yellow-500',
      statusColor: 'bg-yellow-100 text-yellow-800',
      statusText: 'Yolu Yarıladın'
    };
  } else {
    return {
      barColor: 'bg-blue-500',
      statusColor: 'bg-blue-100 text-blue-800',
      statusText: 'Devam Ediyor'
    };
  }
};

const GoalProgressBar = ({ current, total, progress }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const progressStyle = getProgressStyle(progress);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>{formatCurrency(current)}</span>
        <span>{formatCurrency(total)}</span>
      </div>
      
      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
          className={`h-full rounded-full ${progressStyle.barColor}`}
        />
      </div>
      
      <div className="text-right text-sm font-medium">
        {progress.toFixed(1)}%
      </div>
    </div>
  );
};

export { getProgressStyle };
export default GoalProgressBar; 