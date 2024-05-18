"use client"
import { useEffect, useState } from "react";
import { LineChart } from '@mui/x-charts';

const GET_PREDICTIONS_URL = 'https://shelter-traffic-predictor-a506428a4d8d.herokuapp.com/get_predictions'


export default function Home() {
  const [predictionsResponse, setPredictionsResponse] = useState<{result: {predictions: number[], dates: string[], actual_values: number[]}} | null >(null); 

  useEffect(() => {
   const interval = setInterval(() => {
    fetch(GET_PREDICTIONS_URL).then(async result => {
      if (result.status === 200){
        setPredictionsResponse(await result.json())
        clearInterval(interval)
      }
    })
   }, 1000)
  }, [])
  if (predictionsResponse === null){
    return <div>
      loading...
    </div>
  }
  console.log(predictionsResponse)
  return (<div>
    {JSON.stringify(predictionsResponse.result.dates)}
    <LineChart
  xAxis={[{ data: predictionsResponse.result.dates }]}
  series={[
    {
      data: predictionsResponse.result.actual_values,
      
    }
  ]}
  width={500}
  height={300}
/>
  </div>
  )}

  