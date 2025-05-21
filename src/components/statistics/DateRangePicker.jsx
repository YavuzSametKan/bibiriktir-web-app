import { useState } from 'react';

function DateRangePicker({ period, onPeriodChange, periods }) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="flex flex-wrap gap-2">
        {periods.map((p) => (
          <button
            key={p.id}
            onClick={() => onPeriodChange(p.id)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors
              ${period === p.id
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default DateRangePicker; 