
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BinomialTreeValuationProps {
  timeHorizon?: number;
}

const BinomialTreeValuation: React.FC<BinomialTreeValuationProps> = ({ timeHorizon = 1 }) => {
  const [spotPrice, setSpotPrice] = useState<number>(100);
  const [strikePrice, setStrikePrice] = useState<number>(100);
  const [timeToMaturity, setTimeToMaturity] = useState<number>(timeHorizon);
  const [volatility, setVolatility] = useState<number>(0.2);
  const [riskFreeRate, setRiskFreeRate] = useState<number>(0.05);
  const [optionType, setOptionType] = useState<string>("call");
  const [steps, setSteps] = useState<number>(50);
  const [optionPrice, setOptionPrice] = useState<number | null>(null);
  const [exerciseStyle, setExerciseStyle] = useState<string>("european");

  // Update timeToMaturity when timeHorizon prop changes
  useEffect(() => {
    setTimeToMaturity(timeHorizon);
  }, [timeHorizon]);

  const calculatePrice = () => {
    // Calculate parameters for the binomial tree
    const dt = timeToMaturity / steps;
    const u = Math.exp(volatility * Math.sqrt(dt));
    const d = 1 / u;
    const p = (Math.exp(riskFreeRate * dt) - d) / (u - d);
    
    // Initialize arrays for the stock price and option value at maturity
    const stockPrices = new Array(steps + 1);
    const optionValues = new Array(steps + 1);
    
    // Calculate stock prices at maturity (final step)
    for (let i = 0; i <= steps; i++) {
      stockPrices[i] = spotPrice * Math.pow(u, steps - i) * Math.pow(d, i);
      if (optionType === "call") {
        optionValues[i] = Math.max(0, stockPrices[i] - strikePrice);
      } else {
        optionValues[i] = Math.max(0, strikePrice - stockPrices[i]);
      }
    }
    
    // Work backwards through the tree
    for (let j = steps - 1; j >= 0; j--) {
      for (let i = 0; i <= j; i++) {
        const currentSpot = spotPrice * Math.pow(u, j - i) * Math.pow(d, i);
        const expectedValue = (p * optionValues[i] + (1 - p) * optionValues[i + 1]) * Math.exp(-riskFreeRate * dt);
        
        if (exerciseStyle === "american") {
          // For American options, compare with immediate exercise value
          const exerciseValue = optionType === "call" 
            ? Math.max(0, currentSpot - strikePrice) 
            : Math.max(0, strikePrice - currentSpot);
          optionValues[i] = Math.max(expectedValue, exerciseValue);
        } else {
          // For European options, just use the expected discounted value
          optionValues[i] = expectedValue;
        }
      }
    }
    
    // The option price is the value at the root of the tree
    setOptionPrice(optionValues[0]);
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
            <Label htmlFor="exercise-style">Exercise Style</Label>
            <Select value={exerciseStyle} onValueChange={setExerciseStyle}>
              <SelectTrigger id="exercise-style">
                <SelectValue placeholder="Select exercise style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="european">European</SelectItem>
                <SelectItem value="american">American</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="steps">Number of Steps</Label>
            <Input
              id="steps"
              type="number"
              value={steps}
              onChange={(e) => setSteps(parseInt(e.target.value) || 10)}
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
        <h3 className="text-lg font-semibold mb-4">Binomial Tree Method</h3>
        <p className="text-sm text-gray-600 mb-4">
          The binomial tree model constructs a discrete-time lattice of possible future asset prices. 
          At each node, the price either moves up or down with specified probabilities, creating a tree structure.
          The option is valued by working backward from the final nodes, applying risk-neutral valuation.
        </p>
        <div className="mt-4">
          <h4 className="font-medium text-sm mb-2">Advantages:</h4>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>Intuitive and relatively simple to implement</li>
            <li>Can handle American options and early exercise features</li>
            <li>Convergence to Black-Scholes as the number of steps increases</li>
          </ul>
        </div>
        <div className="mt-4">
          <h4 className="font-medium text-sm mb-2">Model Parameters:</h4>
          <p className="text-sm text-gray-600">
            More steps yield higher accuracy but require more computation. The calculation uses a risk-neutral approach 
            with up/down magnitudes derived from the volatility and time interval.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BinomialTreeValuation;
