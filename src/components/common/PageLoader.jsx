import { motion, AnimatePresence } from 'framer-motion';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

function PageLoader({ isVisible }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center justify-center min-h-[260px]">
            {/* Dönen gradientli çember */}
            <div className="relative flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-20 rounded-full border-4 border-t-emerald-500 border-b-indigo-500 border-l-gray-200 border-r-gray-200"
                style={{ borderStyle: 'solid', borderTopWidth: 6, borderBottomWidth: 6, borderLeftWidth: 6, borderRightWidth: 6 }}
              />
              {/* Ortadaki para simgesi */}
              <div className="absolute inset-0 flex items-center justify-center">
                <CurrencyDollarIcon className="h-10 w-10 text-emerald-600 drop-shadow-lg" />
              </div>
            </div>
            {/* Yükleme metni */}
            <div className="mt-10 text-center">
              <p className="text-sm font-medium text-gray-600">Birikimleriniz yükleniyor...</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PageLoader; 