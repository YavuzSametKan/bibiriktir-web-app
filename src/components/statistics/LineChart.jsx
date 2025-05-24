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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function LineChart({ data, type }) {
  const chartData = {
    labels: data?.map(item => item.date) || [],
    datasets: [
      {
        label: type === 'income' ? 'Gelir' : 'Gider',
        data: data?.map(item => item.value) || [],
        borderColor: type === 'income' ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
        backgroundColor: type === 'income' ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('tr-TR', {
                style: 'currency',
                currency: 'TRY'
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('tr-TR', {
              style: 'currency',
              currency: 'TRY',
              maximumSignificantDigits: 3
            }).format(value);
          }
        }
      }
    }
  };

  return <Line data={chartData} options={options} />;
}

export default LineChart; 