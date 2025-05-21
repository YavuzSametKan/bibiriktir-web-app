function SegmentedControl({ options, selected, onChange }) {
  return (
    <div className="inline-flex rounded-lg bg-gray-100 p-1">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onChange(option.id)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            selected === option.id
              ? option.id === 'income'
                ? 'bg-green-500 text-white shadow'
                : 'bg-red-500 text-white shadow'
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default SegmentedControl; 