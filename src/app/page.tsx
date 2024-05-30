"use client";
import styled from 'styled-components';
import PredictionsChart from './components/PredictionsChart';
import { usePredictionsData } from './hooks';

const Container = styled.div`
  background-color: #f0f0f0;
  min-height: 50;
  padding: 75px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  font-family: 'Lora', 'Merriweather', 'Playfair Display', "Helvetica Neue";
  font-size: 18x;
  color: #000; // Set text color to black
  margin: 10px auto;
  max-width: 640px; // Adjust this value to match the desired width
  width: 100%; // Ensure it takes full available width up to the max-width
  text-align: left; // Text alignment set to left
  padding: 0 20px; // Padding to avoid text touching the container edges
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
      <Content>
        This chart displays the daily number of people in Toronto who were not matched to a shelter space for an overnight stay.
        It compares actual values to predictions made by a SARIMAX model, which forecasts using a daily rolling window. 
        The model takes into account historical data, weather effects, and shelter occupancy rates.<br /><br />
        Due to a delay in data release, this model can only be evaluated retroactively. <br /><br />
      </Content>
      <PredictionsChart />
      <Content>
      <br /><br />
        <div>The SARIMAX model has a Mean Absolute Error (MAE) of {predictionsResponse.result.comparison.mae_sarimax}.</div>
        <div>Using the last observation as the prediction for the next time point results in a MAE of {predictionsResponse.result.comparison.mae_last_observation}.</div>
        <div>This shows an improvement of {predictionsResponse.result.comparison.mae_comparison}% compared to the last observation method.</div><br />
        For more details, see the <StyledLink href="https://github.com/pendovka/Toronto-Shelter-Traffic/blob/main/Shelter-Demand-Predictor.ipynb" target="_blank" rel="noopener noreferrer">Jupyter notebook</StyledLink>.<br /><br />
      </Content>
    </Container>
  );
}


