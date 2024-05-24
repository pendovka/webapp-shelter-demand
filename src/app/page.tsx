"use client";
import styled from 'styled-components';
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
  comparison: { mae_comparison: number, mae_last_observation: number, mae_sarimax: number }
};

const Container = styled.div`
  background-color: grey;
  min-height: 100vh;
  padding: 10px;
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 400px;
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  background-color: white; /* Optional: set a background color for the chart container */
  padding: 20px; /* Optional: add some padding */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Optional: add a shadow */
  border-radius: 8px; /* Optional: add rounded corners */
`;

const StyledLink = styled.a`
  text-decoration: underline;
  color: blue;
`;

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
        borderColor: "rgba(75, 192, 192, 231)",
        backgroundColor: "rgba(4, 112, 112, 0)", // No fill color
        fill: true, 
        tension: 0.1,
      },
      {
        label: "Predicted Values",
        data: predictions,
        borderColor: "rgba(192, 75, 75, 1)",
        backgroundColor: "rgba(192, 75, 75, 0)", // No fill color
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
    maintainAspectRatio: false, // Allow resizing
  };

  return (
    <Container>
    <div>
  This chart displays the daily number of people in Toronto who were not matched to a shelter space for an overnight stay.<br />
  It compares actual values to predictions made by a SARIMAX model, which forecasts using a daily rolling window.<br />
  The model takes into account historical data, seasonality, weather effects, and occupancy rates.<br />
  For more details, see the <StyledLink href="https://github.com/pendovka/Toronto-Shelter-Traffic/blob/main/Shelter-Demand-Predictor.ipynb" target="_blank" rel="noopener noreferrer">Jupyter notebook</StyledLink>.<br />
  The chart updates automatically on the 16th of every month with new data from the Toronto Open Data page.<br />
  Due to a delay in data release, this model cannot be used to predict future values but can only be evaluated retroactively.
 

</div>
      <ChartContainer>
        <Line data={chartData} options={options} />
      </ChartContainer>
      <div>The SARIMAX model has a Mean Absolute Error of 21.96.</div>
      <div>Using the last observation as a forecast results in a Mean Absolute Error of 24.65.</div>
      <div>This shows an improvement of 10.91% compared to the last observation method.</div>
    </Container>
  );
}


