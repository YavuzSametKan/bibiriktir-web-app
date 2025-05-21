import { useMemo, useState, useEffect } from 'react';
import { format, subMonths, startOfMonth, endOfMonth, parseISO, getMonth, getYear } from 'date-fns';
import { tr } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartBarIcon } from '@heroicons/react/24/outline';

function Dashboard({ transactions }) {
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    console.log('Dashboard - Received Transactions:', transactions);
  }, [transactions]);

  const currentMonth = useMemo(() => {
    const now = new Date();
    const currentMonth = getMonth(now);
    const currentYear = getYear(now);
    
    console.log('Current Month Info:', {
      month: currentMonth,
      year: currentYear
    });
    
    const filteredTransactions = transactions.filter(t => {
      const transactionDate = parseISO(t.date);
      const transactionMonth = getMonth(transactionDate);
      const transactionYear = getYear(transactionDate);
      
      const isInRange = transactionMonth === currentMonth && transactionYear === currentYear;
      
      console.log('Transaction Check:', {
        transactionDate: format(transactionDate, 'yyyy-MM-dd'),
        transactionMonth,
        transactionYear,
        currentMonth,
        currentYear,
        isInRange,
        amount: t.amount,
        type: t.type
      });
      
      return isInRange;
    });

    console.log('Filtered Current Month Transactions:', filteredTransactions);
    return filteredTransactions;
  }, [transactions]);

  const previousMonth = useMemo(() => {
    const now = new Date();
    const prevMonth = subMonths(now, 1);
    const prevMonthNum = getMonth(prevMonth);
    const prevYear = getYear(prevMonth);
    
    console.log('Previous Month Info:', {
      month: prevMonthNum,
      year: prevYear
    });
    
    const filteredTransactions = transactions.filter(t => {
      const transactionDate = parseISO(t.date);
      const transactionMonth = getMonth(transactionDate);
      const transactionYear = getYear(transactionDate);
      
      const isInRange = transactionMonth === prevMonthNum && transactionYear === prevYear;
      
      console.log('Previous Month Transaction Check:', {
        transactionDate: format(transactionDate, 'yyyy-MM-dd'),
        transactionMonth,
        transactionYear,
        prevMonth: prevMonthNum,
        prevYear,
        isInRange,
        amount: t.amount,
        type: t.type
      });
      
      return isInRange;
    });

    console.log('Filtered Previous Month Transactions:', filteredTransactions);
    return filteredTransactions;
  }, [transactions]);

  const currentMonthIncome = useMemo(() => {
    const income = currentMonth
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    console.log('Current Month Income Calculation:', {
      transactions: currentMonth.filter(t => t.type === 'income'),
      total: income
    });
    return income;
  }, [currentMonth]);

  const currentMonthExpense = useMemo(() => {
    const expense = currentMonth
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    console.log('Current Month Expense Calculation:', {
      transactions: currentMonth.filter(t => t.type === 'expense'),
      total: expense
    });
    return expense;
  }, [currentMonth]);

  const previousMonthIncome = useMemo(() => {
    const income = previousMonth
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    console.log('Previous Month Income Calculation:', {
      transactions: previousMonth.filter(t => t.type === 'income'),
      total: income
    });
    return income;
  }, [previousMonth]);

  const previousMonthExpense = useMemo(() => {
    const expense = previousMonth
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    console.log('Previous Month Expense Calculation:', {
      transactions: previousMonth.filter(t => t.type === 'expense'),
      total: expense
    });
    return expense;
  }, [previousMonth]);

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

      <div className="flex justify-center mb-4">
        <button
          onClick={() => setShowChart(!showChart)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ChartBarIcon className="h-6 w-6 mr-2" />
          {showChart ? 'Grafiği Gizle' : 'Grafiği Göster'}
        </button>
      </div>

      {showChart && (
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
      )}
    </div>
  );
}

export default Dashboard; 