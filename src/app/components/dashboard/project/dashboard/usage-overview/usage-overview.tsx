import React, { useState, useEffect } from "react";

import { ChartData } from "chart.js";

import { useSelector } from "react-redux";
import { selectProjectId } from "../../../../../../../redux/slices/projectSlice";

import { db } from "@/app/firebase/firebaseClient";
import { collection, query, where, getDocs } from "firebase/firestore";

import UsageBarChart from "./usage-bar-chart";
import DonutDisplay from "./donut-display";

interface DailyCounts {
  [key: string]: {
    likeCount: number;
    dislikeCount: number;
    messageCount: number;
    // Add any additional properties that might be in dailyCounts
  };
}

interface MetricsData {
  projectId: string;
  dailyCounts: DailyCounts;
}

interface UsageOverviewProps {}

const defaultChartData: ChartData<"bar"> = {
  labels: [],
  datasets: [
    {
      label: "Likes",
      data: [],
      backgroundColor: "#00ADB5",
    },
    {
      label: "Dislikes",
      data: [],
      backgroundColor: "#DF5656", // Example color
    },
    {
      label: "No Feedback",
      data: [],
      backgroundColor: "#393E46",
    },
  ],
};

const UsageOverview: React.FC<UsageOverviewProps> = () => {
  const projectId = useSelector(selectProjectId);
  const [viewType, setViewType] = useState<"daily" | "weekly" | "monthly">(
    "daily"
  );
  const [isCumulative, setIsCumulative] = useState<boolean>(false);
  const [chartData, setChartData] =
    useState<ChartData<"bar">>(defaultChartData);
  const [totalLikes, setTotalLikes] = useState<number>(0);
  const [totalDislikes, setTotalDislikes] = useState<number>(0);
  const [totalNoFeedback, setTotalNoFeedback] = useState<number>(0);
  const [totalMessages, setTotalMessages] = useState<number>(0);

  const transformMetricsToChartData = (
    dailyCounts: DailyCounts
  ): ChartData<"bar"> => {
    // Create arrays to hold the data for each stack in the bar chart
    const likeCounts: number[] = [];
    const dislikeCounts: number[] = [];
    const noFeedbackCounts: number[] = [];
    const labels: string[] = [];

    // Populate the arrays with data from the dailyCounts object
    Object.entries(dailyCounts).forEach(([date, counts]) => {
      labels.push(date); // The date becomes the label
      likeCounts.push(counts.likeCount);
      dislikeCounts.push(counts.dislikeCount);
      // Calculate no feedback count as the difference between messageCount and the sum of like and dislike counts
      const feedbackCount = counts.likeCount + counts.dislikeCount;
      noFeedbackCounts.push(counts.messageCount - feedbackCount);
    });

    // Create the data object in the format expected by ChartJS
    const chartData: ChartData<"bar"> = {
      labels,
      datasets: [
        {
          label: "Likes",
          data: likeCounts,
          backgroundColor: "#00ADB5",
        },
        {
          label: "Dislikes",
          data: dislikeCounts,
          backgroundColor: "#DF5656", // Example color
        },
        {
          label: "No Feedback",
          data: noFeedbackCounts,
          backgroundColor: "#393E46",
        },
      ],
    };

    return chartData;
  };

  // Function to sort the chartData based on labels (dates)
  const sortChartData = (chartData: any) => {
    // Create a mapping of labels to their indices
    const labelIndices = chartData.labels.map(
      (label: string, index: number) => ({ label, index })
    );

    // Sort the mapping based on labels
    labelIndices.sort((a: any, b: any) => a.label.localeCompare(b.label));

    // Apply the sorted label order to the datasets
    chartData.datasets.forEach((dataset: any) => {
      const sortedData: any = [];
      labelIndices.forEach((labelIndex: any) => {
        sortedData.push(dataset.data[labelIndex.index]);
      });
      dataset.data = sortedData;
    });

    // Sort the labels
    chartData.labels.sort((a: any, b: any) => a.localeCompare(b));

    return chartData;
  };

  const getTotalCounts = (dailyCounts: DailyCounts) => {
    let totalLikeCount = 0;
    let totalDislikeCount = 0;
    let totalNoFeedbackCount = 0;
    let totalMessagesCount = 0;

    // Sum up the counts from each day
    Object.values(dailyCounts).forEach((counts) => {
      totalLikeCount += counts.likeCount;
      totalDislikeCount += counts.dislikeCount;
      // Assuming messageCount includes both like and dislike counts
      totalNoFeedbackCount +=
        counts.messageCount - counts.likeCount - counts.dislikeCount;
      totalMessagesCount += counts.messageCount;
    });
    return {
      totalLikeCount,
      totalDislikeCount,
      totalNoFeedbackCount,
      totalMessagesCount,
    };
  };

  useEffect(() => {
    const fetchMetrics = async () => {
      // Implement this function to retrieve data from Firestore
      // This example function fetches data for the last month. Adjust as necessary.
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);

      // Transform dates to yyyy-mm-dd format or use a library like date-fns
      const formattedStartDate = `${startDate.getFullYear()}-${String(
        startDate.getMonth() + 1
      ).padStart(2, "0")}-${String(startDate.getDate()).padStart(2, "0")}`;
      const formattedEndDate = `${endDate.getFullYear()}-${String(
        endDate.getMonth() + 1
      ).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;

      // Fetch data from Firestore
      // Reference to your metrics collection
      const metricsCollectionRef = collection(db, "metrics");

      // Create a query against the collection for documents where the 'projectId' field matches the projectId
      const metricsQuery = query(
        metricsCollectionRef,
        where("projectId", "==", projectId)
      );

      try {
        // Perform the query
        const querySnapshot = await getDocs(metricsQuery);
        let metricsData: DailyCounts = {}; // Use the interface for the structure

        querySnapshot.forEach((doc) => {
          const data = doc.data() as MetricsData; // Cast the data to the interface

          // Filter out the dailyCounts based on the startDate and endDate
          const filteredCounts: DailyCounts = {}; // Use the interface for the structure
          Object.keys(data.dailyCounts)
            .filter(
              (date) => date >= formattedStartDate && date <= formattedEndDate
            )
            .forEach((date) => {
              filteredCounts[date] = data.dailyCounts[date];
            });

          metricsData = { ...metricsData, ...filteredCounts };
        });

        return metricsData;
      } catch (error) {
        console.error("Error fetching metrics:", error);
        throw error; // Throw the error so it can be caught by the caller
      }
    };

    fetchMetrics()
      .then((data) => {
        const chartReadyData = transformMetricsToChartData(data);
        const sortedChartData = sortChartData(chartReadyData);
        setChartData(sortedChartData);

        const totalCounts = getTotalCounts(data);
        setTotalLikes(totalCounts.totalLikeCount);
        setTotalDislikes(totalCounts.totalDislikeCount);
        setTotalNoFeedback(totalCounts.totalNoFeedbackCount);
        setTotalMessages(totalCounts.totalMessagesCount);
      })
      .catch((error) => {
        console.error("Error fetching metrics:", error);
      });
  }, [projectId, viewType, isCumulative]);

  // Define chart options here (omitted for brevity)

  return (
    <div className="flex space-x-4">
      <div className="h-full w-3/4 shadow-lg border border-[#393E46] rounded-lg bg-[#222831] p-4 text-white">
        <UsageBarChart chartData={chartData} />
      </div>
      <div className="h-full w-1/4 space-y-3 text-white">
        <DonutDisplay
          subTotal={totalLikes}
          total={totalMessages}
          title="Total Likes"
        />
        <DonutDisplay
          subTotal={totalDislikes}
          total={totalMessages}
          title="Total Dislikes"
        />
        <DonutDisplay
          subTotal={totalNoFeedback}
          total={totalMessages}
          title="Total No Feedback"
        />
      </div>
    </div>
  );
};

export default UsageOverview;
