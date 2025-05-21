import { CurrencyDollarIcon, ChartBarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center space-x-2">
            <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Bibiriktir</span>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <ChartBarIcon className="h-4 w-4" />
              <span>Finansal Özgürlük</span>
            </div>
            <div className="flex items-center space-x-1">
              <ArrowTrendingUpIcon className="h-4 w-4" />
              <span>Akıllı Tasarruf</span>
            </div>
          </div>

          <p className="text-gray-400 text-xs">
            © {new Date().getFullYear()} Bibiriktir. Finansal hedeflerinize ulaşmanın en kolay yolu.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 