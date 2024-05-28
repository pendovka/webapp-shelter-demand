"use client";
import styled from 'styled-components';
import PredictionsChart from './components/PredictionsChart';
import { usePredictionsData } from './hooks';

const Container = styled.div`
  background-color: rgba(0, 0, 0, 0.1);
  min-height: 100vh;
  padding: 10px;
`;

const StyledLink = styled.a`
  text-decoration: underline;
  color: blue;
`;

export default function Home() {
  const predictionsResponse = usePredictionsData();

  if (predictionsResponse === null) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <div>
        This chart displays the daily number of people in Toronto who were not matched to a shelter space for an overnight stay.<br />
        It compares actual values to predictions made by a SARIMAX model, which forecasts using a daily rolling window.<br />
        The model takes into account historical data, weather effects, and shelter occupancy rates.<br />
        For more details, see the <StyledLink href="https://github.com/pendovka/Toronto-Shelter-Traffic/blob/main/Shelter-Demand-Predictor.ipynb" target="_blank" rel="noopener noreferrer">Jupyter notebook</StyledLink>.<br />  <br />
        New data is released monthly and will be available here once it is published by the Toronto Open Data page. <br />
        Due to a delay in data release, this model can only be evaluated retroactively. <br />  <br />
      </div>
      <PredictionsChart />
      <br />
      <div> The SARIMAX model has a Mean Absolute Error of {predictionsResponse.result.comparison.mae_sarimax}.</div>
      <div>Using the last observation as a forecast results in a Mean Absolute Error of {predictionsResponse.result.comparison.mae_last_observation}.</div>
      <div>This shows an improvement of {predictionsResponse.result.comparison.mae_comparison}% compared to the last observation method.</div>
    </Container>
  );
}


