"use client";
import { useEffect, useState } from "react";
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

const GET_PREDICTIONS_URL =
  "https://shelter-traffic-predictor-a506428a4d8d.herokuapp.com/get_predictions";

type PredictionsResult = {
  predictions: number[];
  dates: string[];
  actual_values: number[];
  comparison: {mae_comparison: number, mae_last_observation: number, mae_sarimax: number}
};

export default function Home() {
  const [predictionsResponse, setPredictionsResponse] = useState<{
    result: PredictionsResult;
  } | null>(null);

  useEffect(() => {
    const fetchPredictions = () => {
      fetch(GET_PREDICTIONS_URL).then(async (result) => {
        if (result.status === 200) {
          setPredictionsResponse(await result.json());
          clearInterval(interval);
        }
      });
    }
    const interval = setInterval(() => {
      fetchPredictions()
    }, 2000);
    fetchPredictions()
  }, []);

  if (predictionsResponse === null) {
    return <div>loading...</div>;
  }

  const dates = predictionsResponse.result.dates.map((date) => new Date(date));
  const actualValues = predictionsResponse.result.actual_values;
  const predictions = predictionsResponse.result.predictions;
  const mae = predictionsResponse.result.comparison;

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: "Actual Values",
        data: actualValues,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0)", // No fill color
        fill: false, // Disable fill
        tension: 0.1,
      },
      {
        label: "Predicted Values",
        data: predictions,
        borderColor: "rgba(192, 75, 75, 1)",
        backgroundColor: "rgba(192, 75, 75, 0)", // No fill color
        fill: false, // Disable fill
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
    maintainAspectRatio: false, // Allow resizing
  };

  return (
    <div>
    {JSON.stringify(mae)}
    <div style={{ width: "60%", height: "400px", position: "relative" }}>
      <Line data={chartData} options={options} />
      
    </div>
    </div>
  );
}
