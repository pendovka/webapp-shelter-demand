import { useEffect, useState } from "react";

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
  };
  completed_on: string;
}

export const usePredictionsData = () => {
  const [predictionsResponse, setPredictionsResponse] =
    useState<PredictionsResponse | null>(null);

  // Fetch data every two seconds untill received 2000 
  useEffect(() => {
    const fetchPredictions = async () => {
      const response = await fetch(
        "https://shelter-traffic-predictor-a506428a4d8d.herokuapp.com/get_predictions",
      );

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();
      setPredictionsResponse(data);
      clearInterval(interval);
    };

    const interval = setInterval(() => {
      fetchPredictions();
    }, 2000);

    fetchPredictions();

    return () => clearInterval(interval);
  }, []);

  return predictionsResponse;
};
