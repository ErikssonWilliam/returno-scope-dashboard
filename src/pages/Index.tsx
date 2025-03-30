
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PortfolioOverview } from "@/components/dashboard/PortfolioOverview";
import { PerformanceMetrics } from "@/components/dashboard/PerformanceMetrics";
import { AssetBreakdown } from "@/components/dashboard/AssetBreakdown";
import { ReturnForecast } from "@/components/dashboard/ReturnForecast";
import { FavoriteSecurities } from "@/components/market/FavoriteSecurities";
import { TimeframeSelector } from "@/components/dashboard/TimeframeSelector";

export default function Index() {
  const [timeframe, setTimeframe] = useState("1Y");

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back! Here's an overview of your portfolio
          </p>
        </div>

        <div className="mb-6">
          <FavoriteSecurities />
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-slate-800">Portfolio Analysis</h2>
          <TimeframeSelector 
            timeframe={timeframe}
            onTimeframeChange={setTimeframe}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <PortfolioOverview timeframe={timeframe} />
          <PerformanceMetrics timeframe={timeframe} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AssetBreakdown />
          <ReturnForecast />
        </div>
      </div>
    </DashboardLayout>
  );
}
