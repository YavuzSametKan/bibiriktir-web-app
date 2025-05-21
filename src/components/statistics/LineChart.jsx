import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { format, eachDayOfInterval, eachMonthOfInterval, startOfMonth, endOfMonth, getDaysInMonth, eachWeekOfInterval, startOfWeek, endOfWeek, subMonths, subYears } from 'date-fns';
import { tr } from 'date-fns/locale';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function LineChart({ transactions, type, period }) {
  const data = useMemo(() => {
    const now = new Date();
    let labels = [];
    let data = [];

    if (period === 'weekly') {
      const days = eachDayOfInterval({
        start: new Date(now.setDate(now.getDate() - 6)),
        end: new Date(),
      });
      labels = days.map(day => format(day, 'd MMM', { locale: tr }));
      data = days.map(day => {
        return transactions
          .filter(t => format(new Date(t.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))
          .reduce((sum, t) => sum + t.amount, 0);
      });
    } else if (period === 'monthly') {
      const currentMonth = new Date();
      const daysInMonth = getDaysInMonth(currentMonth);
      const days = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
      });
      labels = days.map(day => format(day, 'd MMM', { locale: tr }));
      data = days.map(day => {
        return transactions
          .filter(t => format(new Date(t.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))
          .reduce((sum, t) => sum + t.amount, 0);
      });
    } else if (period === 'quarterly') {
      // 3 aylık periyot için haftalık karşılaştırma
      const startDate = subMonths(now, 3);
      const weeks = eachWeekOfInterval({
        start: startDate,
        end: now,
      });
      
      labels = weeks.map(week => {
        const start = startOfWeek(week, { weekStartsOn: 1 });
        const end = endOfWeek(week, { weekStartsOn: 1 });
        return `${format(start, 'd MMM', { locale: tr })}-${format(end, 'd MMM', { locale: tr })}`;
      });
      
      data = weeks.map(week => {
        const start = startOfWeek(week, { weekStartsOn: 1 });
        const end = endOfWeek(week, { weekStartsOn: 1 });
        return transactions
          .filter(t => {
            const date = new Date(t.date);
            return date >= start && date <= end;
          })
          .reduce((sum, t) => sum + t.amount, 0);
      });
    } else if (period === 'halfYearly') {
      // 6 aylık periyot için aylık karşılaştırma
      const months = eachMonthOfInterval({
        start: subMonths(now, 6),
        end: now,
      });
      labels = months.map(month => format(month, 'MMM yyyy', { locale: tr }));
      data = months.map(month => {
        return transactions
          .filter(t => format(new Date(t.date), 'yyyy-MM') === format(month, 'yyyy-MM'))
          .reduce((sum, t) => sum + t.amount, 0);
      });
    } else {
      // Yıllık periyot için aylık karşılaştırma
      const months = eachMonthOfInterval({
        start: subYears(now, 1),
        end: now,
      });
      labels = months.map(month => format(month, 'MMM yyyy', { locale: tr }));
      data = months.map(month => {
        return transactions
          .filter(t => format(new Date(t.date), 'yyyy-MM') === format(month, 'yyyy-MM'))
          .reduce((sum, t) => sum + t.amount, 0);
      });
    }

    return {
      labels,
      datasets: [
        {
          label: type === 'income' ? 'Gelir' : 'Gider',
          data,
          borderColor: type === 'income' ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
          backgroundColor: type === 'income' ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)',
          tension: 0.4,
        },
      ],
    };
  }, [transactions, type, period]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            return `${type === 'income' ? 'Gelir' : 'Gider'}: ${value.toLocaleString('tr-TR', {
              style: 'currency',
              currency: 'TRY',
            })}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) =>
            value.toLocaleString('tr-TR', {
              style: 'currency',
              currency: 'TRY',
              maximumFractionDigits: 0,
            }),
        },
      },
    },
  };

  return (
    <div className="h-80">
      <Line data={data} options={options} />
    </div>
  );
}

export default LineChart; 