import { useMemo } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

function TransactionList({ transactions, categories, onTransactionClick }) {
  const groupedTransactions = useMemo(() => {
    const groups = {};
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
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
      .map(([_, group]) => ({
        ...group,
        dailyTotal: group.totalIncome - group.totalExpense
      }));
  }, [transactions]);

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Bilinmeyen Kategori';
  };

  return (
    <div className="space-y-6">
      {groupedTransactions.map((group) => (
        <div key={group.date.toISOString()} className="bg-white rounded-lg shadow">
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
            {group.transactions.map((transaction) => (
              <div
                key={transaction.id}
                onClick={() => onTransactionClick(transaction)}
                className="px-6 py-4 hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {getCategoryName(transaction.categoryId)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(transaction.date), 'HH:mm')}
                      {transaction.description && ` - ${transaction.description}`}
                    </p>
                  </div>
                  <span className={`text-sm font-medium ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {transaction.amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TransactionList; 