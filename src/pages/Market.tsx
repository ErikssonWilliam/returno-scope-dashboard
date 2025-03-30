
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MarketOverview } from "@/components/market/MarketOverview";
import { OrderBook } from "@/components/market/OrderBook";
import { TradeForm } from "@/components/market/TradeForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Market() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Market</h1>
        
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Market Overview</TabsTrigger>
            <TabsTrigger value="orderbook">Order Book</TabsTrigger>
            <TabsTrigger value="trade">Trade</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <MarketOverview />
          </TabsContent>
          
          <TabsContent value="orderbook">
            <OrderBook />
          </TabsContent>
          
          <TabsContent value="trade">
            <TradeForm />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
