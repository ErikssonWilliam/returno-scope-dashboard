
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

// Define the props interface
interface MarketOverviewProps {
  selectedSecurity: string;
  onSelectSecurity: Dispatch<SetStateAction<string>>;
}

// Sample market data
const marketData = [
  { 
    symbol: "AAPL", 
    name: "Apple Inc.", 
    lastPrice: 182.52, 
    change: 1.28, 
    changePercent: 0.71, 
    bid: 182.48, 
    ask: 182.55, 
    volume: 23456789
  },
  { 
    symbol: "MSFT", 
    name: "Microsoft Corp.", 
    lastPrice: 334.12, 
    change: -0.95, 
    changePercent: -0.28, 
    bid: 334.05, 
    ask: 334.20, 
    volume: 12345678
  },
  { 
    symbol: "GOOGL", 
    name: "Alphabet Inc.", 
    lastPrice: 131.86, 
    change: 2.45, 
    changePercent: 1.89, 
    bid: 131.75, 
    ask: 131.90, 
    volume: 8765432
  },
  { 
    symbol: "AMZN", 
    name: "Amazon.com Inc.", 
    lastPrice: 127.74, 
    change: 0.85, 
    changePercent: 0.67, 
    bid: 127.70, 
    ask: 127.80, 
    volume: 10234567
  },
  { 
    symbol: "TSLA", 
    name: "Tesla Inc.", 
    lastPrice: 217.25, 
    change: -5.32, 
    changePercent: -2.39, 
    bid: 217.15, 
    ask: 217.35, 
    volume: 15678234
  },
  { 
    symbol: "NVDA", 
    name: "NVIDIA Corp.", 
    lastPrice: 432.38, 
    change: 12.76, 
    changePercent: 3.04, 
    bid: 432.25, 
    ask: 432.50, 
    volume: 20987654
  },
  { 
    symbol: "META", 
    name: "Meta Platforms Inc.", 
    lastPrice: 326.72, 
    change: -2.14, 
    changePercent: -0.65, 
    bid: 326.65, 
    ask: 326.85, 
    volume: 9876543
  },
];

export function MarketOverview({ selectedSecurity, onSelectSecurity }: MarketOverviewProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Market Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trading Volume</span>
                <span className="font-medium">101.3M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Advancing</span>
                <span className="font-medium text-green-600">324</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Declining</span>
                <span className="font-medium text-red-600">176</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unchanged</span>
                <span className="font-medium">42</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Market Indices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">S&P 500</span>
                <div className="flex items-center">
                  <span className="font-medium mr-2">4,783.45</span>
                  <Badge variant="outline" className="text-green-600 bg-green-50">
                    <ArrowUp className="h-3 w-3 mr-1" /> 0.63%
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nasdaq</span>
                <div className="flex items-center">
                  <span className="font-medium mr-2">15,628.94</span>
                  <Badge variant="outline" className="text-green-600 bg-green-50">
                    <ArrowUp className="h-3 w-3 mr-1" /> 0.75%
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dow Jones</span>
                <div className="flex items-center">
                  <span className="font-medium mr-2">38,176.22</span>
                  <Badge variant="outline" className="text-red-600 bg-red-50">
                    <ArrowDown className="h-3 w-3 mr-1" /> 0.12%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Market Movers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Top Gainer</span>
                <div className="text-right">
                  <div className="font-medium">NVDA</div>
                  <div className="text-xs text-green-600">+3.04%</div>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Top Loser</span>
                <div className="text-right">
                  <div className="font-medium">TSLA</div>
                  <div className="text-xs text-red-600">-2.39%</div>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Highest Volume</span>
                <div className="text-right">
                  <div className="font-medium">AAPL</div>
                  <div className="text-xs">23.4M</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Market Prices</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Company</TableHead>
                <TableHead className="text-right">Last Price</TableHead>
                <TableHead className="text-right">Change</TableHead>
                <TableHead className="text-right">Bid</TableHead>
                <TableHead className="text-right">Ask</TableHead>
                <TableHead className="text-right">Spread</TableHead>
                <TableHead className="text-right">Volume</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marketData.map((item) => (
                <TableRow 
                  key={item.symbol} 
                  className={selectedSecurity === item.symbol ? "bg-slate-100" : undefined}
                  onClick={() => onSelectSecurity(item.symbol)}
                  style={{ cursor: 'pointer' }}
                >
                  <TableCell className="font-medium">{item.symbol}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-right">${item.lastPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        item.change >= 0 ? "text-green-600" : "text-red-600"
                      }
                    >
                      {item.change >= 0 ? "+" : ""}
                      {item.change.toFixed(2)} ({item.changePercent >= 0 ? "+" : ""}
                      {item.changePercent.toFixed(2)}%)
                    </span>
                  </TableCell>
                  <TableCell className="text-right">${item.bid.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${item.ask.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${(item.ask - item.bid).toFixed(2)}</TableCell>
                  <TableCell className="text-right">{formatNumber(item.volume)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
