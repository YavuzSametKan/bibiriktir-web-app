import { useMemo } from 'react';
import { format, parse } from 'date-fns';
import { tr } from 'date-fns/locale';
import { DocumentIcon, PhotoIcon, ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import { useTransactions } from '../../context/TransactionContext';
import { useCategories } from '../../context/CategoryContext';

function TransactionList({ onTransactionClick }) {
  const { transactions, loading, error } = useTransactions();
  const { categories } = useCategories();

  const groupedTransactions = useMemo(() => {
    if (!transactions) return [];

    const groups = {};
    transactions.forEach(transaction => {
      // API'den gelen tarih formatı: '15.05.2025-10:30'
      const date = parse(transaction.date, 'dd.MM.yyyy-HH:mm', new Date());
      const dateKey = format(date, 'yyyy-MM-dd');
      
      if (!groups[dateKey]) {
        groups[dateKey] = {
          date,
          transactions: [],
          totalIncome: 0,
          totalExpense: 0
        };
      }
      
      groups[dateKey].transactions.push(transaction);
      if (transaction.type === 'income') {
        groups[dateKey].totalIncome += transaction.amount;
      } else {
        groups[dateKey].totalExpense += transaction.amount;
      }
    });

    return Object.entries(groups)
      .sort(([a], [b]) => new Date(b) - new Date(a))
      .map(([dateKey, group]) => ({
        dateKey,
        ...group,
        dailyTotal: group.totalIncome - group.totalExpense
      }));
  }, [transactions]);

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c._id === categoryId);
    return category ? category.name : 'Bilinmeyen Kategori';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">İşlemler yüklenirken bir hata oluştu: {error}</p>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Henüz hiç işlem bulunmuyor.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groupedTransactions.map((group) => (
        <div key={group.dateKey} className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {format(group.date, 'd MMMM yyyy', { locale: tr })}
              </h3>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Gelir</p>
                  <p className="text-sm font-medium text-green-600">
                    {group.totalIncome.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Gider</p>
                  <p className="text-sm font-medium text-red-600">
                    {group.totalExpense.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Günlük Toplam</p>
                  <p className={`text-sm font-medium ${group.dailyTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {group.dailyTotal.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {group.transactions.map((transaction, index) => {
              const date = parse(transaction.date, 'dd.MM.yyyy-HH:mm', new Date());
              return (
                <div
                  key={`${group.dateKey}-${transaction._id || index}`}
                  onClick={() => onTransactionClick && onTransactionClick(transaction)}
                  className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ease-in-out border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'income' ? (
                          <ArrowDownIcon className="h-5 w-5 text-green-600" />
                        ) : (
                          <ArrowUpIcon className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900">
                            {transaction.category?.name || 'Bilinmeyen Kategori'}
                          </p>
                          {transaction.attachment && (
                            <div className="flex-shrink-0">
                              {transaction.attachment.mimetype === 'application/pdf' ? (
                                <DocumentIcon className="h-4 w-4 text-gray-400" />
                              ) : (
                                <PhotoIcon className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-xs text-gray-500">
                            {format(date, 'HH:mm')}
                          </p>
                          {transaction.description && (
                            <>
                              <span className="text-gray-300">•</span>
                              <p className="text-xs text-gray-500 truncate max-w-[200px]">
                                {transaction.description}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-sm font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {transaction.amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TransactionList; 