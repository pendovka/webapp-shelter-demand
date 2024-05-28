import { useEffect, useState } from "react";
import styled from "styled-components";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  TimeScale,
  Filler,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { usePredictionsData } from "../hooks";

// Define styled components outside of the component function
const ChartContainer = styled.div`
  width: 100%;
  height: 400px;
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  background-color: white;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  TimeScale,
  Filler,
);

export default function PredictionsChart() {
  const predictionsResponse = usePredictionsData();

  if (predictionsResponse === null) {
    return <div>Loading...</div>;
  }

  const { dates, actual_values: actualValues, predictions } = predictionsResponse.result;

  const chartData = {
    labels: dates.map(date => new Date(date)),
    datasets: [
      {
        label: "Actual Values",
        data: actualValues,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
      {
        label: "Predicted Values",
        data: predictions,
        borderColor: "rgba(192, 75, 75, 1)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          boxWidth: 20,
          usePointStyle: true,
          padding: 5,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Number of unmatched callers',
      },
    },
  };

  return (
    <ChartContainer>
      <p style={{ color: 'black' }}>Last updated on: {new Date(predictionsResponse.completed_on).toLocaleString('fr-fr')}</p>
      <Line data={chartData} options={options} />
    </ChartContainer>
  );
}
