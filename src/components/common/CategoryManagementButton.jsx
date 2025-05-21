import { TagIcon } from '@heroicons/react/24/outline';

function CategoryManagementButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
    >
      <TagIcon className="h-5 w-5" />
      Kategori Yönetimi
    </button>
  );
}

export default CategoryManagementButton; 