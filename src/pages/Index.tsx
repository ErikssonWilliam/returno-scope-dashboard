import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PortfolioOverview } from "@/components/dashboard/PortfolioOverview";
import { AssetBreakdown } from "@/components/dashboard/AssetBreakdown";
import { PerformanceMetrics } from "@/components/dashboard/PerformanceMetrics";
import { ReturnForecast } from "@/components/dashboard/ReturnForecast";
import { TimeframeSelector } from "@/components/dashboard/TimeframeSelector";
import { FavoriteSecurities } from "@/components/market/FavoriteSecurities";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const Index = () => {
  const [timeframe, setTimeframe] = useState("1Y");
  const [forecastHorizon, setForecastHorizon] = useState(1); // Default 1 year
  
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Portfolio Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Track your investments and analyze performance</p>
          </div>
          <TimeframeSelector selected={timeframe} onSelect={setTimeframe} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            <PortfolioOverview timeframe={timeframe} />
          </div>
          <div className="md:col-span-1">
            <FavoriteSecurities />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            <PerformanceMetrics timeframe={timeframe} />
          </div>
          <div className="md:col-span-1">
            {/* Additional content could go here if needed */}
          </div>
        </div>
        
        <div className="mb-6">
          <AssetBreakdown timeframe={timeframe} />
        </div>
        
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <Label htmlFor="forecast-horizon" className="text-sm font-medium mb-2 block">
            Forecast Horizon: {forecastHorizon} {forecastHorizon === 1 ? 'Year' : 'Years'}
          </Label>
          <div className="flex items-center gap-4">
            <Slider 
              id="forecast-horizon"
              min={0.25} 
              max={5} 
              step={0.25} 
              value={[forecastHorizon]} 
              onValueChange={(value) => setForecastHorizon(value[0])}
              className="w-full max-w-sm"
            />
            <span className="text-sm text-gray-500 w-24">0.25 - 5 Years</span>
          </div>
        </div>
        
        <div>
          <ReturnForecast timeHorizon={forecastHorizon} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
