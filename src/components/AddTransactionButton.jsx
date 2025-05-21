import { PlusIcon } from '@heroicons/react/24/outline';

function AddTransactionButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <PlusIcon className="h-6 w-6" />
    </button>
  );
}

export default AddTransactionButton; 