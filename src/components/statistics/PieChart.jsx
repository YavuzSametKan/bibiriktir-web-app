import { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
  'rgba(54, 162, 235, 0.8)',
  'rgba(255, 206, 86, 0.8)',
  'rgba(75, 192, 192, 0.8)',
  'rgba(153, 102, 255, 0.8)',
  'rgba(255, 159, 64, 0.8)',
  'rgba(199, 199, 199, 0.8)',
  'rgba(83, 102, 255, 0.8)',
  'rgba(40, 159, 64, 0.8)',
  'rgba(210, 199, 199, 0.8)',
  'rgba(78, 205, 196, 0.8)',
];

function PieChart({ transactions, categories, onCategoryClick }) {
  const data = useMemo(() => {
    const categoryTotals = transactions.reduce((acc, transaction) => {
      const category = categories.find(c => c.id === transaction.categoryId);
      if (category) {
        acc[category.id] = {
          name: category.name,
          total: (acc[category.id]?.total || 0) + transaction.amount,
        };
      }
      return acc;
    }, {});

    const sortedCategories = Object.values(categoryTotals).sort((a, b) => b.total - a.total);

    return {
      labels: sortedCategories.map(c => c.name),
      datasets: [
        {
          data: sortedCategories.map(c => c.total),
          backgroundColor: COLORS,
          borderWidth: 1,
        },
      ],
    };
  }, [transactions, categories]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 8,
          font: {
            size: 13,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value.toLocaleString('tr-TR', {
              style: 'currency',
              currency: 'TRY',
            })} (${percentage}%)`;
          },
        },
      },
    },
    onClick: (_, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const category = categories.find(c => c.name === data.labels[index]);
        if (category) {
          onCategoryClick(category);
        }
      }
    },
  };

  return (
    <div className="h-80">
      <Pie data={data} options={options} />
    </div>
  );
}

export default PieChart; 