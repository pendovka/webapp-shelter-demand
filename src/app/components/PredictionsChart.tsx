"use client";
import { useEffect, useState, useCallback } from "react";
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

interface PredictionsResponse {
  result: {
    dates: string[];
    actual_values: number[];
    predictions: number[];
    comparison: {
      mae_comparison: number;
      mae_last_observation: number;
      mae_sarimax: number;
    };
    completed_on: string;
  };
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
  }, [setComparisonData, setLastCompletedOn]);

  if (predictionsResponse === null) {
    return <div>Loading...</div>;
  }

  const { dates, actual_values: actualValues, predictions, comparison } = predictionsResponse.result;

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
          text: "Number of unmatched callers",
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <ChartContainer>
    <p style={{ color: 'black' }}>Last updated on: {new Date(predictionsResponse?.completed_on).toLocaleString()}</p>
      <Line data={chartData} options={options} />
    </ChartContainer>
  );  
}

