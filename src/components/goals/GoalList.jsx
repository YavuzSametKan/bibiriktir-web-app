import React from 'react';
import GoalCard from './GoalCard';

const GoalList = ({ goals, onAddContribution }) => {
  const activeGoals = goals.filter(goal => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    return progress < 100;
  });

  const archivedGoals = goals.filter(goal => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    return progress >= 100;
  });

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-semibold mb-4">Devam Eden Hedefler</h2>
        {activeGoals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeGoals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onAddContribution={onAddContribution}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            Henüz aktif hedef bulunmuyor. Yeni bir hedef oluşturmak için + butonuna tıklayın.
          </p>
        )}
      </section>

      {archivedGoals.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Arşivlenen Hedefler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {archivedGoals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onAddContribution={onAddContribution}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default GoalList; 