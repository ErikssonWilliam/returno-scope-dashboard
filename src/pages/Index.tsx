
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PortfolioOverview } from "@/components/dashboard/PortfolioOverview";
import { AssetBreakdown } from "@/components/dashboard/AssetBreakdown";
import { PerformanceMetrics } from "@/components/dashboard/PerformanceMetrics";
import { ReturnForecast } from "@/components/dashboard/ReturnForecast";
import { TimeframeSelector } from "@/components/dashboard/TimeframeSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Linkedin, Instagram } from "lucide-react";
import { useState } from "react";

const Index = () => {
  const [timeframe, setTimeframe] = useState("1Y");
  
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
        
        <Card className="mb-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0 md:mr-6">
                <h2 className="text-xl font-bold text-indigo-800 mb-2">Welcome to ReturnoScope</h2>
                <p className="text-slate-600 max-w-md">
                  Your comprehensive platform for portfolio management, market analysis, and financial valuations. 
                  Access real-time data and sophisticated analysis tools all in one place.
                </p>
                <div className="mt-4 flex gap-3">
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                    Explore Market
                  </Button>
                  <Button size="sm" variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50">
                    View Valuations
                  </Button>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-center mb-3">
                  <span className="text-sm font-medium text-slate-500">Connect with us</span>
                </div>
                <div className="flex gap-4">
                  <a 
                    href="https://linkedin.com/in/returnoscope" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <Linkedin size={24} />
                  </a>
                  <a 
                    href="https://instagram.com/returnoscope" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <Instagram size={24} />
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <PortfolioOverview timeframe={timeframe} />
          <PerformanceMetrics timeframe={timeframe} />
        </div>
        
        <div className="mb-6">
          <AssetBreakdown timeframe={timeframe} />
        </div>
        
        <div>
          <ReturnForecast />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
