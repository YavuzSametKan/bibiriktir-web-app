import { useMemo } from 'react';
import { format, subMonths } from 'date-fns';
import { tr } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Dashboard({ transactions }) {
  const currentMonth = useMemo(() => {
    const now = new Date();
    return transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });
  }, [transactions]);

  const previousMonth = useMemo(() => {
    const now = new Date();
    const prevMonth = subMonths(now, 1);
    return transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === prevMonth.getMonth() && date.getFullYear() === prevMonth.getFullYear();
    });
  }, [transactions]);

  const currentMonthIncome = useMemo(() => 
    currentMonth.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    [currentMonth]
  );

  const currentMonthExpense = useMemo(() => 
    currentMonth.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    [currentMonth]
  );

  const previousMonthIncome = useMemo(() => 
    previousMonth.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    [previousMonth]
  );

  const previousMonthExpense = useMemo(() => 
    previousMonth.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    [previousMonth]
  );

  const incomeChange = previousMonthIncome ? ((currentMonthIncome - previousMonthIncome) / previousMonthIncome) * 100 : 0;
  const expenseChange = previousMonthExpense ? ((currentMonthExpense - previousMonthExpense) / previousMonthExpense) * 100 : 0;

  const chartData = useMemo(() => {
    const data = [];
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      const dayTransactions = currentMonth.filter(t => new Date(t.date).getDate() === i);
      const dayIncome = dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const dayExpense = dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

      data.push({
        date: i,
        income: dayIncome,
        expense: dayExpense
      });
    }

    return data;
  }, [currentMonth]);

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-red-700 mb-2">Bu Ay Harcama</h3>
          <p className="text-2xl font-bold text-red-600">
            {currentMonthExpense.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
          </p>
          <p className={`text-sm ${expenseChange >= 0 ? 'text-red-600' : 'text-green-600'}`}>
            {expenseChange >= 0 ? '+' : ''}{expenseChange.toFixed(1)}% geçen aya göre
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-700 mb-2">Bu Ay Gelir</h3>
          <p className="text-2xl font-bold text-green-600">
            {currentMonthIncome.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
          </p>
          <p className={`text-sm ${incomeChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {incomeChange >= 0 ? '+' : ''}{incomeChange.toFixed(1)}% geçen aya göre
          </p>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="income" stroke="#10B981" name="Gelir" />
            <Line type="monotone" dataKey="expense" stroke="#EF4444" name="Harcama" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard; 