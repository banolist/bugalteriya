import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { FinancialOperation } from "~/app/types";

ChartJS.register(ArcElement, Tooltip, Legend);

interface FinancialChartProps {
  data: FinancialOperation[];
}

const FinancialChartPie: React.FC<FinancialChartProps> = ({ data }) => {
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
        label: "Amount",
        data: amountsByType,
        backgroundColor: [
          "#f87171", // Красный для продаж
          "#4ade80", // Зеленый для покупок
          "#60a5fa", // Синий для возвратов
        ],
        // borderColor: "#1e293b",
        // borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#1e293b",
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        bodyFont: {
          size: 14,
        },
        titleFont: {
          size: 16,
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="card bg-base-100 shadow-xl p-6">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-4">Распределение операций</h2>
        <div className="h-96">
          <Pie data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default FinancialChartPie;
