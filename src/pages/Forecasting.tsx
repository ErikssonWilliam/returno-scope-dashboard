
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ReturnForecast } from "@/components/dashboard/ReturnForecast";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const Forecasting = () => {
  const [timeHorizon, setTimeHorizon] = useState(1); // Default 1 year
  
  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Return Forecasting</h1>
          <p className="text-gray-600 max-w-4xl">
            Use statistical models to forecast potential future returns for your portfolio.
            Adjust the time horizon to see projections over different periods.
          </p>
        </div>
        
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <Label htmlFor="forecast-horizon" className="text-sm font-medium mb-2 block">
            Forecast Horizon: {timeHorizon} {timeHorizon === 1 ? 'Year' : 'Years'}
          </Label>
          <div className="flex items-center gap-4">
            <Slider 
              id="forecast-horizon"
              min={0.25} 
              max={5} 
              step={0.25} 
              value={[timeHorizon]} 
              onValueChange={(value) => setTimeHorizon(value[0])}
              className="w-full max-w-sm"
            />
            <span className="text-sm text-gray-500 w-24">0.25 - 5 Years</span>
          </div>
        </div>
        
        <div className="space-y-6">
          <ReturnForecast timeHorizon={timeHorizon} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Forecasting;
