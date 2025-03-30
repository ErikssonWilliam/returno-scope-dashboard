
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FiniteDifferenceValuationProps {
  timeHorizon?: number;
}

const FiniteDifferenceValuation: React.FC<FiniteDifferenceValuationProps> = ({ timeHorizon = 1 }) => {
  const [spotPrice, setSpotPrice] = useState<number>(100);
  const [strikePrice, setStrikePrice] = useState<number>(100);
  const [timeToMaturity, setTimeToMaturity] = useState<number>(timeHorizon);
  const [volatility, setVolatility] = useState<number>(0.2);
  const [riskFreeRate, setRiskFreeRate] = useState<number>(0.05);
  const [optionType, setOptionType] = useState<string>("call");
  const [optionPrice, setOptionPrice] = useState<number | null>(null);
  const [gridSize, setGridSize] = useState<number>(100);

  // Update timeToMaturity when timeHorizon prop changes
  useEffect(() => {
    setTimeToMaturity(timeHorizon);
  }, [timeHorizon]);

  const calculatePrice = () => {
    // Simplified finite difference calculation for demo purposes
    // In a real implementation, this would use a proper finite difference grid method
    const dt = timeToMaturity / gridSize;
    const dx = volatility * Math.sqrt(dt);
    
    // Very basic calculation - in reality, would solve the Black-Scholes PDE using finite difference
    let price;
    if (optionType === "call") {
      price = spotPrice * Math.exp((riskFreeRate - 0.5 * volatility * volatility) * timeToMaturity) - strikePrice;
      price = Math.max(0, price);
    } else {
      price = strikePrice - spotPrice * Math.exp((riskFreeRate - 0.5 * volatility * volatility) * timeToMaturity);
      price = Math.max(0, price);
    }
    
    setOptionPrice(price);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="spot-price">Spot Price ($)</Label>
            <Input
              id="spot-price"
              type="number"
              value={spotPrice}
              onChange={(e) => setSpotPrice(parseFloat(e.target.value) || 0)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="strike-price">Strike Price ($)</Label>
            <Input
              id="strike-price"
              type="number"
              value={strikePrice}
              onChange={(e) => setStrikePrice(parseFloat(e.target.value) || 0)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time-to-maturity">Time to Maturity (years)</Label>
            <Input
              id="time-to-maturity"
              type="number"
              step="0.1"
              value={timeToMaturity}
              onChange={(e) => setTimeToMaturity(parseFloat(e.target.value) || 0)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="volatility">Volatility (σ)</Label>
            <Input
              id="volatility"
              type="number"
              step="0.01"
              value={volatility}
              onChange={(e) => setVolatility(parseFloat(e.target.value) || 0)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="risk-free-rate">Risk-Free Rate</Label>
            <Input
              id="risk-free-rate"
              type="number"
              step="0.001"
              value={riskFreeRate}
              onChange={(e) => setRiskFreeRate(parseFloat(e.target.value) || 0)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="option-type">Option Type</Label>
            <Select value={optionType} onValueChange={setOptionType}>
              <SelectTrigger id="option-type">
                <SelectValue placeholder="Select option type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="call">Call Option</SelectItem>
                <SelectItem value="put">Put Option</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="grid-size">Grid Size</Label>
            <Input
              id="grid-size"
              type="number"
              value={gridSize}
              onChange={(e) => setGridSize(parseInt(e.target.value) || 50)}
            />
          </div>
        </div>
        
        <Button className="w-full" onClick={calculatePrice}>
          Calculate Option Price
        </Button>
        
        {optionPrice !== null && (
          <Card className="mt-4">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Results</h3>
              <p className="text-3xl font-bold text-green-600">${optionPrice.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mt-1">Estimated Option Price</p>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Finite Difference Method</h3>
        <p className="text-sm text-gray-600 mb-4">
          The finite difference method solves the Black-Scholes partial differential equation by 
          approximating derivatives with differences. This creates a grid of option values that evolves 
          backward in time from expiration to the present.
        </p>
        <div className="mt-4">
          <h4 className="font-medium text-sm mb-2">Advantages:</h4>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>Can handle early exercise features (American options)</li>
            <li>Flexible for various boundary conditions and exotic options</li>
            <li>Provides option values throughout the entire price-time grid</li>
          </ul>
        </div>
        <div className="mt-4">
          <h4 className="font-medium text-sm mb-2">Computational Notes:</h4>
          <p className="text-sm text-gray-600">
            Grid size affects accuracy and computation time. Larger grids give more precise results but require 
            more computation. This implementation uses a simplified approach for demonstration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FiniteDifferenceValuation;
