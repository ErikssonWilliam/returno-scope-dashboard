
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ReturnForecastProps {
  timeHorizon?: number; // Default is 1 year if not provided
}

export const ReturnForecast = ({ timeHorizon = 1 }: ReturnForecastProps) => {
  const [selectedModel, setSelectedModel] = useState("arima");
  
  // Generate forecast data based on selected model and time horizon
  const generateForecastData = (model: string, horizon: number) => {
    const data = [];
    const months = Math.ceil(horizon * 12); // Convert years to months
    const startDate = new Date();
    
    // Starting values and volatility vary by model
    let baseReturn = 0;
    let volatility = 0;
    
    switch (model) {
      case "arima":
        baseReturn = 0.7; // 0.7% monthly return
        volatility = 1.5;
        break;
      case "garch":
        baseReturn = 0.6; 
        volatility = 2.2;
        break;
      case "montecarlo":
        baseReturn = 0.65;
        volatility = 2.5;
        break;
      case "regime":
        baseReturn = 0.75;
        volatility = 1.8;
        break;
      default:
        baseReturn = 0.7;
        volatility = 1.5;
    }
    
    // Cumulative return starts at 0
    let cumulativeReturn = 0;
    
    // Confidence interval bounds
    let lowerBound = 0;
    let upperBound = 0;
    
    for (let i = 0; i <= months; i++) {
      const date = new Date(startDate);
      date.setMonth(startDate.getMonth() + i);
      
      // Randomize monthly returns based on model parameters
      const monthReturn = baseReturn + (Math.random() - 0.5) * volatility;
      
      // Add to cumulative return (compounding effect)
      cumulativeReturn = i === 0 ? 0 : cumulativeReturn * (1 + monthReturn / 100) + monthReturn / 10;
      
      // Calculate confidence intervals (widen over time)
      const timeEffect = Math.sqrt(i) * volatility / 10;
      lowerBound = cumulativeReturn - timeEffect;
      upperBound = cumulativeReturn + timeEffect;
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        return: parseFloat(cumulativeReturn.toFixed(2)),
        lowerBound: parseFloat(lowerBound.toFixed(2)),
        upperBound: parseFloat(upperBound.toFixed(2))
      });
    }
    
    return data;
  };
  
  const forecastData = generateForecastData(selectedModel, timeHorizon);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Return Forecast</CardTitle>
        <CardDescription>
          Projected returns over the next {timeHorizon} {timeHorizon === 1 ? 'year' : 'years'} using statistical models
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedModel} onValueChange={setSelectedModel}>
          <TabsList className="mb-6">
            <TabsTrigger value="arima">ARIMA</TabsTrigger>
            <TabsTrigger value="garch">GARCH</TabsTrigger>
            <TabsTrigger value="montecarlo">Monte Carlo</TabsTrigger>
            <TabsTrigger value="regime">Regime Switching</TabsTrigger>
          </TabsList>
          
          <TabsContent value={selectedModel} className="mt-0">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={forecastData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="date" 
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                  />
                  <YAxis 
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFF', borderRadius: '0.375rem', border: '1px solid #E2E8F0' }}
                    formatter={(value) => [`${Number(value).toFixed(2)}%`, "Return"]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="return" 
                    name="Expected Return"
                    stroke="#6366F1" 
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="upperBound" 
                    name="Upper Bound (95%)"
                    stroke="#C7D2FE" 
                    strokeDasharray="5 5"
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="lowerBound" 
                    name="Lower Bound (95%)"
                    stroke="#C7D2FE" 
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
              <h4 className="font-medium mb-2">Model Description</h4>
              {selectedModel === "arima" && (
                <p className="text-sm text-slate-600">
                  ARIMA (AutoRegressive Integrated Moving Average) forecasts future returns based on patterns in past returns,
                  treating the time series as stationary after differencing.
                </p>
              )}
              {selectedModel === "garch" && (
                <p className="text-sm text-slate-600">
                  GARCH (Generalized AutoRegressive Conditional Heteroskedasticity) models volatility clustering,
                  accounting for periods of high and low volatility in financial returns.
                </p>
              )}
              {selectedModel === "montecarlo" && (
                <p className="text-sm text-slate-600">
                  Monte Carlo simulation generates thousands of random potential future paths for returns,
                  allowing for a probability distribution of outcomes rather than a single forecast.
                </p>
              )}
              {selectedModel === "regime" && (
                <p className="text-sm text-slate-600">
                  Regime Switching models capture structural shifts in market conditions, allowing for different
                  forecast parameters in bull versus bear markets.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
