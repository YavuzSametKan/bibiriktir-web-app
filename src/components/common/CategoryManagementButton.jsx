import { TagIcon } from '@heroicons/react/24/outline';

function CategoryManagementButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <TagIcon className="h-5 w-5 mr-2" />
      Kategori Yönetimi
    </button>
  );
}

export default CategoryManagementButton; 