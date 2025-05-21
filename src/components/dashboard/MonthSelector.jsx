import { useState, useEffect } from 'react';
import { format, addMonths, subMonths, isAfter, startOfDay, isSameMonth, isBefore, endOfMonth } from 'date-fns';
import { tr } from 'date-fns/locale';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

function MonthSelector({ onMonthChange }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [canGoNext, setCanGoNext] = useState(false);

  useEffect(() => {
    // Gelecek aya geçişi kontrol et
    const nextMonth = addMonths(selectedDate, 1);
    const today = new Date();
    const endOfCurrentMonth = endOfMonth(today);

    // Eğer bir sonraki ay bugünün ayından sonra ise ileri gitmeyi engelle
    setCanGoNext(isBefore(nextMonth, endOfCurrentMonth) || isSameMonth(nextMonth, today));
  }, [selectedDate]);

  const handlePreviousMonth = () => {
    const newDate = subMonths(selectedDate, 1);
    setSelectedDate(newDate);
    onMonthChange(newDate);
  };

  const handleNextMonth = () => {
    if (!canGoNext) return;
    const newDate = addMonths(selectedDate, 1);
    setSelectedDate(newDate);
    onMonthChange(newDate);
  };

  return (
    <div className="flex items-center justify-center space-x-4 mb-8">
      <button
        onClick={handlePreviousMonth}
        className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors month-selector-button"
      >
        <ChevronLeftIcon className="h-5 w-5 mr-1" />
        {format(subMonths(selectedDate, 1), 'MMMM', { locale: tr })}
      </button>

      <div className="text-2xl font-bold text-gray-900 px-6 py-2 bg-white rounded-lg shadow-sm">
        {format(selectedDate, 'MMMM yyyy', { locale: tr }).toUpperCase()}
      </div>

      <button
        onClick={handleNextMonth}
        disabled={!canGoNext}
        className={`flex items-center px-4 py-2 transition-colors month-selector-button ${
          canGoNext
            ? 'text-gray-600 hover:text-gray-900'
            : 'text-gray-400 cursor-not-allowed'
        }`}
      >
        {format(addMonths(selectedDate, 1), 'MMMM', { locale: tr })}
        <ChevronRightIcon className="h-5 w-5 ml-1" />
      </button>
    </div>
  );
}

export default MonthSelector; 