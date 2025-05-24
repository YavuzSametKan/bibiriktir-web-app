import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { format, addMonths, subMonths } from 'date-fns';
import { tr } from 'date-fns/locale';

function MonthSelector({ selectedDate, onDateChange }) {
  const handlePreviousMonth = () => {
    onDateChange(subMonths(selectedDate, 1));
  };

  const handleNextMonth = () => {
    onDateChange(addMonths(selectedDate, 1));
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={handlePreviousMonth}
        className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>
      <span className="text-lg font-medium text-gray-900">
        {format(selectedDate, 'MMMM yyyy', { locale: tr })}
      </span>
      <button
        onClick={handleNextMonth}
        className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
}

export default MonthSelector; 