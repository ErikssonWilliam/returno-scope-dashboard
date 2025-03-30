
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useEffect } from "react";

// Define the props interface
interface OrderBookProps {
  selectedSecurity: string;
}

// Sample order book data
const initialOrderBook = {
  AAPL: {
    bids: [
      { price: 182.48, size: 100 },
      { price: 182.46, size: 250 },
      { price: 182.44, size: 500 },
      { price: 182.42, size: 200 },
      { price: 182.40, size: 350 },
    ],
    asks: [
      { price: 182.55, size: 150 },
      { price: 182.57, size: 300 },
      { price: 182.59, size: 450 },
      { price: 182.61, size: 100 },
      { price: 182.63, size: 200 },
    ]
  },
  MSFT: {
    bids: [
      { price: 334.05, size: 75 },
      { price: 334.00, size: 125 },
      { price: 333.95, size: 250 },
      { price: 333.90, size: 300 },
      { price: 333.85, size: 450 },
    ],
    asks: [
      { price: 334.20, size: 100 },
      { price: 334.25, size: 175 },
      { price: 334.30, size: 225 },
      { price: 334.35, size: 300 },
      { price: 334.40, size: 400 },
    ]
  },
  GOOGL: {
    bids: [
      { price: 131.75, size: 50 },
      { price: 131.70, size: 100 },
      { price: 131.65, size: 150 },
      { price: 131.60, size: 200 },
      { price: 131.55, size: 250 },
    ],
    asks: [
      { price: 131.90, size: 75 },
      { price: 131.95, size: 125 },
      { price: 132.00, size: 175 },
      { price: 132.05, size: 225 },
      { price: 132.10, size: 275 },
    ]
  }
};

const availableSymbols = ["AAPL", "MSFT", "GOOGL"];

export function OrderBook({ selectedSecurity }: OrderBookProps) {
  const [localSelectedSymbol, setLocalSelectedSymbol] = useState(selectedSecurity || "AAPL");
  
  // Update local state when prop changes
  useEffect(() => {
    if (selectedSecurity && availableSymbols.includes(selectedSecurity)) {
      setLocalSelectedSymbol(selectedSecurity);
    }
  }, [selectedSecurity]);
  
  // If selected security is not in our available symbols, use the first one
  const orderBook = initialOrderBook[localSelectedSymbol as keyof typeof initialOrderBook] || 
                    initialOrderBook[availableSymbols[0] as keyof typeof initialOrderBook];

  const calculateTotalSize = (orders: Array<{ price: number, size: number }>) => {
    return orders.reduce((total, order) => total + order.size, 0);
  };

  const totalBidSize = calculateTotalSize(orderBook.bids);
  const totalAskSize = calculateTotalSize(orderBook.asks);
  const spreadValue = orderBook.asks[0].price - orderBook.bids[0].price;
  const spreadPercentage = (spreadValue / orderBook.bids[0].price) * 100;

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 mb-4">
        {availableSymbols.map(symbol => (
          <button
            key={symbol}
            className={`px-4 py-2 rounded-md ${
              localSelectedSymbol === symbol 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-secondary-foreground"
            }`}
            onClick={() => setLocalSelectedSymbol(symbol)}
          >
            {symbol}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Best Bid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              ${orderBook.bids[0].price.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">
              Size: {orderBook.bids[0].size}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Spread</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${spreadValue.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">
              {spreadPercentage.toFixed(2)}% of price
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Best Ask</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              ${orderBook.asks[0].price.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">
              Size: {orderBook.asks[0].size}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>Bids</span>
              <span className="text-sm font-normal text-muted-foreground">
                Total Size: {totalBidSize}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Size</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderBook.bids.map((bid, index) => {
                  const cumulativeSize = orderBook.bids
                    .slice(0, index + 1)
                    .reduce((total, order) => total + order.size, 0);
                    
                  return (
                    <TableRow key={index} className="bg-green-50">
                      <TableCell className="font-medium text-green-600">
                        ${bid.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">{bid.size}</TableCell>
                      <TableCell className="text-right">{cumulativeSize}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>Asks</span>
              <span className="text-sm font-normal text-muted-foreground">
                Total Size: {totalAskSize}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Size</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderBook.asks.map((ask, index) => {
                  const cumulativeSize = orderBook.asks
                    .slice(0, index + 1)
                    .reduce((total, order) => total + order.size, 0);
                    
                  return (
                    <TableRow key={index} className="bg-red-50">
                      <TableCell className="font-medium text-red-600">
                        ${ask.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">{ask.size}</TableCell>
                      <TableCell className="text-right">{cumulativeSize}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
