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

    useEffect(() => {
    const fetchPredictions = async () => {
      const response = await fetch(
        "https://shelter-traffic-predictor-a506428a4d8d.herokuapp.com/get_predictions",
      );

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      if (response.status === 202) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        fetchPredictions();
        
        return;
      }

      const data = await response.json();
      setPredictionsResponse(data);
    };

    fetchPredictions();

  }, []);

  return predictionsResponse;
};
