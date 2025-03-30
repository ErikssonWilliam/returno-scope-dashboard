
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MarketOverview } from "@/components/market/MarketOverview";
import { OrderBook } from "@/components/market/OrderBook";
import { TradeForm } from "@/components/market/TradeForm";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Market() {
  const [selectedSecurity, setSelectedSecurity] = useState("AAPL");
  const location = useLocation();
  
  // Parse URL parameters to get security
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const securityParam = params.get("security");
    if (securityParam) {
      setSelectedSecurity(securityParam);
    }
  }, [location]);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Market</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track prices, analyze market data, and execute trades
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <MarketOverview selectedSecurity={selectedSecurity} onSelectSecurity={setSelectedSecurity} />
          </div>
          <div>
            <div className="space-y-6">
              <TradeForm selectedSecurity={selectedSecurity} />
              <OrderBook selectedSecurity={selectedSecurity} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
