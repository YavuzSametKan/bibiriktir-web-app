import { PlusIcon, ArrowTrendingUpIcon, FlagIcon } from '@heroicons/react/24/outline';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Ana Sayfa</h1>
        <div className="flex space-x-4">
          <Link
            to="/goals"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FlagIcon className="h-5 w-5 mr-2" />
            Hedeflerim
          </Link>
          <button
            onClick={() => setIsAddOperationModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Yeni İşlem
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 