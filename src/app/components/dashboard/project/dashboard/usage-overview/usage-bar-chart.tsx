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
  ChartData,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

import ChartDataLabels from "chartjs-plugin-datalabels";

// Register the datalabels plugin
ChartJS.register(ChartDataLabels);

interface UsageBarChartProps {
  chartData: ChartData<"bar">;
}

const getCurrentMonthName = () => {
  const date = new Date();
  return date.toLocaleString("default", { month: "long" });
};

const options: any = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
      align: "start",
      labels: {
        boxWidth: 20,
        color: "white", // Set legend labels to white
      },
    },
    title: {
      position: "top",
      align: "start",
      display: true,
      text: `Usage ${getCurrentMonthName()}`,
      color: "white", // Set title color to white
      font: {
        size: 24, // Adjust font size as needed
      },
    },
    datalabels: {
      color: "white",
      display: function (context: any) {
        return context.datasetIndex === context.chart.data.datasets.length - 1;
      },
      formatter: function (value: any, context: any) {
        let sum = 0;
        let dataArr = context.chart.data.datasets.map(
          (dataset: any) => dataset.data[context.dataIndex]
        );
        dataArr.forEach((data: any) => {
          sum += data;
        });
        return sum;
      },
      align: "end",
      anchor: "end",
    },
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

const UsageBarChart: React.FC<UsageBarChartProps> = ({ chartData }) => {
  return <Bar options={options} data={chartData} />;
};

export default UsageBarChart;
