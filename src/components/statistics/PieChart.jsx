import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function PieChart({ data, type }) {
  const chartData = {
    labels: data?.map(item => item.name) || [],
    datasets: [
      {
        data: data?.map(item => item.value) || [],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',  // Yeşil
          'rgba(239, 68, 68, 0.8)',  // Kırmızı
          'rgba(59, 130, 246, 0.8)', // Mavi
          'rgba(245, 158, 11, 0.8)', // Turuncu
          'rgba(139, 92, 246, 0.8)', // Mor
          'rgba(236, 72, 153, 0.8)', // Pembe
          'rgba(16, 185, 129, 0.8)', // Yeşil
          'rgba(249, 115, 22, 0.8)', // Turuncu
          'rgba(14, 165, 233, 0.8)', // Mavi
          'rgba(168, 85, 247, 0.8)', // Mor
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw;
            const percentage = context.dataset.data[context.dataIndex] / 
              context.dataset.data.reduce((a, b) => a + b, 0) * 100;
            return `${label}: ${new Intl.NumberFormat('tr-TR', {
              style: 'currency',
              currency: 'TRY'
            }).format(value)} (${percentage.toFixed(1)}%)`;
          }
        }
      }
    }
  };

  return <Pie data={chartData} options={options} />;
}

export default PieChart; 