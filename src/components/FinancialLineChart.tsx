import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";

import dayjs from "dayjs";
import { FinancialOperation } from "~/app/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface FinancialLineChartProps {
  data: FinancialOperation[];
}

const FinancialLineChart: React.FC<FinancialLineChartProps> = ({ data }) => {
  // Группируем данные по дате и типу операции
  const groupedData = data.reduce(
    (acc, op) => {
      const dateKey = dayjs(op.date).format("YYYY-MM-DD");
      if (!acc[dateKey]) {
        acc[dateKey] = {
          income: 0,
          expense: 0,
        };
      }
      acc[dateKey][op.operationType] += op.amount;
      return acc;
    },
    {} as Record<string, Record<string, number>>
  );
  console.log(data);

  const dates = Object.keys(groupedData).sort();
  const operationTypes = [
    { value: "income", locale: "Доход" },
    { value: "expense", locale: "Затраты" },
  ];

  const chartData = {
    labels: dates,
    datasets: operationTypes.map((type, index) => ({
      label: type.locale as any,
      data: dates.map((date) => groupedData[date][type.value]),
      borderColor: [
        "#f87171", // Красный для продаж
        "#4ade80", // Зеленый для покупок
        // "#60a5fa", // Синий для возвратов
      ][index],
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      tension: 0.4,
      pointRadius: 5,
      pointHoverRadius: 7,
    })),
  };

  console.log(chartData, groupedData);

  return (
    <div className="card bg-base-100 shadow-xl p-6 mt-8 w-full flex">
      <div className="card-body w-full flex justify-center">
        <div className="h-96  flex justify-center">
          <Line
            data={chartData}
            options={{
              // maintainAspectRatio: false,

              responsive: true,
              plugins: {
                legend: {
                  position: "top" as const,
                },
                title: {
                  display: true,
                  text: "Динамика операций по дням",
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: "Дата",
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: "Сумма",
                  },
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FinancialLineChart;
