import React from 'react';
import { motion } from 'framer-motion';

const GoalBadge = ({ progress }) => {
  const getBadgeContent = () => {
    if (progress >= 100) {
      return {
        text: '🏅 Başardın!',
        color: 'bg-green-100 text-green-800',
        animation: 'animate-pulse'
      };
    } else if (progress >= 80) {
      return {
        text: 'Neredeyse Oradasın!',
        color: 'bg-yellow-100 text-yellow-800',
        animation: 'animate-glow'
      };
    } else if (progress >= 50) {
      return {
        text: 'Harika Gidiyorsun!',
        color: 'bg-orange-100 text-orange-800',
        animation: 'animate-pulse'
      };
    } else {
      return {
        text: 'Yolun Başındasın',
        color: 'bg-gray-100 text-gray-800',
        animation: ''
      };
    }
  };

  const badge = getBadgeContent();

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`px-3 py-1 rounded-full text-sm font-medium ${badge.color} ${badge.animation}`}
    >
      {badge.text}
    </motion.div>
  );
};

export default GoalBadge; 