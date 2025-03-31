import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FinancialOperation } from "~/app/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface FinancialChartProps {
  data: FinancialOperation[];
}

const FinancialChart: React.FC<FinancialChartProps> = ({ data }) => {
  // Группируем данные по типу операции
  const operationTypes = [...new Set(data.map((item) => item.operationType))];

  // Считаем сумму для каждого типа операции
  const amountsByType = operationTypes.map((type) =>
    data
      .filter((op) => op.operationType === type)
      .reduce((sum, op) => sum + op.amount, 0)
  );

  const chartData = {
    labels: ["Затраты", "Доход"],
    datasets: [
      {
        label: "Сумма",
        data: amountsByType,
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14, // Увеличиваем размер шрифта
            weight: "bold", // Делаем полужирным
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif", // Указываем шрифт
          },
          color: "#333", // Темный цвет для лучшего контраста
          padding: 20, // Добавляем отступы
        },
      },
      title: {
        display: true,
        text: "Финансовые операции по типу",
        font: {
          size: 18,
          weight: "bold",
          family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
        },
        color: "#111", // Очень темный цвет
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      tooltip: {
        bodyFont: {
          size: 14,
          weight: "bold",
        },
        titleFont: {
          size: 16,
          weight: "bold",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 14,
            weight: "bold",
          },
          color: "#333",
        },
        title: {
          display: true,
          text: "Тип операции",
          font: {
            size: 14,
            weight: "bold",
          },
          color: "#333",
        },
      },
      y: {
        ticks: {
          font: {
            size: 14,
            weight: "bold",
          },
          color: "#333",
        },
        title: {
          display: true,
          text: "Сумма (₽)",
          font: {
            size: 14,
            weight: "bold",
          },
          color: "#333",
        },
      },
    },
  };

  return (
    <div className="card bg-base-100 shadow-md p-6 rounded-xl">
      <div className="card-body">
        <Bar data={chartData} options={options as any} />
      </div>
    </div>
  );
};

export default FinancialChart;
