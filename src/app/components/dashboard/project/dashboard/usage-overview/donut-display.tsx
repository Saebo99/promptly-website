import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  Plugin,
} from "chart.js";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

// Optional: if using the datalabels plugin, register a dummy plugin to disable it for this chart
const noDataLabels: Plugin<"doughnut"> = {
  id: "no-datalabels",
  beforeDraw: (chart) => {
    chart.data.datasets.forEach((dataset) => {
      if (dataset.datalabels) {
        dataset.datalabels.display = false;
      }
    });
  },
};

ChartJS.register(noDataLabels);

interface DonutDisplayProps {
  subTotal: number;
  total: number;
  title: string;
}

const DonutDisplay: React.FC<DonutDisplayProps> = ({
  subTotal,
  total,
  title,
}) => {
  const data: ChartData<"doughnut"> = {
    // Labels can be removed if not used
    datasets: [
      {
        data: [subTotal, total - subTotal],
        backgroundColor: ["#4B5C78", "#393E46"],
        hoverBackgroundColor: ["#4B5C78", "#2B2F35"],
        borderWidth: 0,
        // Explicitly set datalabels to false if the plugin is registered
        datalabels: {
          display: false,
        },
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%",
    plugins: {
      legend: {
        display: false,
      },
      // Disable the datalabels plugin for this chart
      datalabels: {
        display: false,
      },
    },
  };

  return (
    <div className="h-1/3 flex items-center shadow-lg border border-[#393E46] rounded-lg bg-[#222831]">
      <div className="ml-[5%]" style={{ width: "30%" }}>
        <Doughnut data={data} options={options} />
      </div>
      <div className="ml-10">
        <h2>{title}</h2>
      </div>
    </div>
  );
};

export default DonutDisplay;
