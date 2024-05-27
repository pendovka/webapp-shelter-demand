"use client";
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
  ChartOptions,
} from "chart.js";
import "chartjs-adapter-date-fns";

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

interface PredictionsChartProps {
  setComparisonData: (data: { mae_comparison: number, mae_last_observation: number, mae_sarimax: number }) => void;
  setLastCompletedOn: (date: string) => void;
}

// Define the structure for your PredictionsResponse here
interface PredictionsResponse {
  result: {
    predictions: number[];
    dates: string[];
    actual_values: number[];
    comparison: {
      mae_comparison: number;
      mae_last_observation: number;
      mae_sarimax: number;
    };
  };
  completed_on: string;
}

export default function PredictionsChart({ setComparisonData, setLastCompletedOn }: PredictionsChartProps) {
  const [predictionsResponse, setPredictionsResponse] = useState<PredictionsResponse | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("https://shelter-traffic-predictor-a506428a4d8d.herokuapp.com/get_predictions")
        .then(response => {
          if (response.ok) return response.json();
          throw new Error('Failed to fetch');
        })
        .then(data => {
          setPredictionsResponse(data);
          setComparisonData(data.result.comparison);
          setLastCompletedOn(new Date(data.completed_on).toLocaleString());
          clearInterval(interval);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          clearInterval(interval);
        });
    }, 2000);

    return () => clearInterval(interval); 
  }, []);

  if (predictionsResponse === null) {
    return <div>Loading...</div>;
  }

  const { dates, actual_values: actualValues, predictions, comparison } = predictionsResponse?.result || { dates: [], actual_values: [], predictions: [], comparison: null };

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

  const chartData = {
    labels: dates.map(date => new Date(date)),
    datasets: [
      {
        label: "Actual Values",
        data: actualValues,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.1)", // Light fill color
        fill: true,
        tension: 0.1,
      },
      {
        label: "Predicted Values",
        data: predictions,
        borderColor: "rgba(192, 75, 75, 1)",
        backgroundColor: "rgba(192, 75, 75, 0.1)", // Light fill color
        fill: true,
        tension: 0.1,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
        },
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Values",
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <ChartContainer>
      <p>Last updated on: {new Date(predictionsResponse.completed_on).toLocaleString()}</p>
      <Line data={chartData} options={options} />
    </ChartContainer>
  );  
}
