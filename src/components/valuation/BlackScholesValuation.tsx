
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BlackScholesValuationProps {
  timeHorizon?: number;
}

const BlackScholesValuation: React.FC<BlackScholesValuationProps> = ({ timeHorizon = 1 }) => {
  const [spotPrice, setSpotPrice] = useState<number>(100);
  const [strikePrice, setStrikePrice] = useState<number>(100);
  const [timeToMaturity, setTimeToMaturity] = useState<number>(timeHorizon);
  const [volatility, setVolatility] = useState<number>(0.2);
  const [riskFreeRate, setRiskFreeRate] = useState<number>(0.05);
  const [dividendYield, setDividendYield] = useState<number>(0);
  const [optionType, setOptionType] = useState<string>("call");
  const [optionPrice, setOptionPrice] = useState<number | null>(null);
  const [delta, setDelta] = useState<number | null>(null);
  const [gamma, setGamma] = useState<number | null>(null);
  const [theta, setTheta] = useState<number | null>(null);
  const [vega, setVega] = useState<number | null>(null);
  const [rho, setRho] = useState<number | null>(null);

  // Update timeToMaturity when timeHorizon prop changes
  useEffect(() => {
    setTimeToMaturity(timeHorizon);
  }, [timeHorizon]);

  const calculatePrice = () => {
    // Standard normal cumulative distribution function
    const cdf = (x: number): number => {
      const a1 = 0.254829592;
      const a2 = -0.284496736;
      const a3 = 1.421413741;
      const a4 = -1.453152027;
      const a5 = 1.061405429;
      const p = 0.3275911;
      
      const sign = x < 0 ? -1 : 1;
      x = Math.abs(x) / Math.sqrt(2.0);
      
      const t = 1.0 / (1.0 + p * x);
      const y = ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
      
      return 0.5 * (1.0 + sign * (1.0 - y));
    };
    
    // Black-Scholes formula
    const d1 = (Math.log(spotPrice / strikePrice) + (riskFreeRate - dividendYield + 0.5 * volatility * volatility) * timeToMaturity) / (volatility * Math.sqrt(timeToMaturity));
    const d2 = d1 - volatility * Math.sqrt(timeToMaturity);
    
    let price;
    if (optionType === "call") {
      price = spotPrice * Math.exp(-dividendYield * timeToMaturity) * cdf(d1) - strikePrice * Math.exp(-riskFreeRate * timeToMaturity) * cdf(d2);
    } else {
      price = strikePrice * Math.exp(-riskFreeRate * timeToMaturity) * cdf(-d2) - spotPrice * Math.exp(-dividendYield * timeToMaturity) * cdf(-d1);
    }
    
    // Greeks calculation
    const delta_value = optionType === "call" 
      ? Math.exp(-dividendYield * timeToMaturity) * cdf(d1) 
      : Math.exp(-dividendYield * timeToMaturity) * (cdf(d1) - 1);
    
    const gamma_value = Math.exp(-dividendYield * timeToMaturity) * Math.exp(-Math.pow(d1, 2) / 2) / (spotPrice * volatility * Math.sqrt(2 * Math.PI * timeToMaturity));
    
    const theta_value = optionType === "call"
      ? -spotPrice * volatility * Math.exp(-dividendYield * timeToMaturity) * Math.exp(-Math.pow(d1, 2) / 2) / (2 * Math.sqrt(2 * Math.PI * timeToMaturity)) - riskFreeRate * strikePrice * Math.exp(-riskFreeRate * timeToMaturity) * cdf(d2) + dividendYield * spotPrice * Math.exp(-dividendYield * timeToMaturity) * cdf(d1)
      : -spotPrice * volatility * Math.exp(-dividendYield * timeToMaturity) * Math.exp(-Math.pow(d1, 2) / 2) / (2 * Math.sqrt(2 * Math.PI * timeToMaturity)) + riskFreeRate * strikePrice * Math.exp(-riskFreeRate * timeToMaturity) * cdf(-d2) - dividendYield * spotPrice * Math.exp(-dividendYield * timeToMaturity) * cdf(-d1);
    
    const vega_value = spotPrice * Math.exp(-dividendYield * timeToMaturity) * Math.sqrt(timeToMaturity) * Math.exp(-Math.pow(d1, 2) / 2) / Math.sqrt(2 * Math.PI);
    
    const rho_value = optionType === "call"
      ? strikePrice * timeToMaturity * Math.exp(-riskFreeRate * timeToMaturity) * cdf(d2)
      : -strikePrice * timeToMaturity * Math.exp(-riskFreeRate * timeToMaturity) * cdf(-d2);
    
    setOptionPrice(price);
    setDelta(delta_value);
    setGamma(gamma_value);
    setTheta(theta_value / 365); // Convert to daily theta
    setVega(vega_value / 100); // For 1% change in volatility
    setRho(rho_value / 100); // For 1% change in interest rate
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
            <Label htmlFor="dividend-yield">Dividend Yield</Label>
            <Input
              id="dividend-yield"
              type="number"
              step="0.001"
              value={dividendYield}
              onChange={(e) => setDividendYield(parseFloat(e.target.value) || 0)}
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
        </div>
        
        <Button className="w-full" onClick={calculatePrice}>
          Calculate Price and Greeks
        </Button>
        
        {optionPrice !== null && (
          <Card className="mt-4">
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Option Price</h3>
                <p className="text-3xl font-bold text-green-600">${optionPrice.toFixed(2)}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Greeks</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <p className="text-sm text-gray-600">Delta</p>
                    <p className="font-medium">{delta?.toFixed(4)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gamma</p>
                    <p className="font-medium">{gamma?.toFixed(4)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Theta (daily)</p>
                    <p className="font-medium">{theta?.toFixed(4)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Vega (per 1% vol)</p>
                    <p className="font-medium">{vega?.toFixed(4)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rho (per 1% rate)</p>
                    <p className="font-medium">{rho?.toFixed(4)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Black-Scholes-Merton Model</h3>
        <p className="text-sm text-gray-600 mb-4">
          The Black-Scholes-Merton model is the foundational analytical formula for European option pricing. 
          It assumes that the underlying asset follows geometric Brownian motion with constant volatility.
        </p>
        <div className="mt-4">
          <h4 className="font-medium text-sm mb-2">Greeks Explained:</h4>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li><strong>Delta:</strong> Rate of change of option price with respect to underlying asset price</li>
            <li><strong>Gamma:</strong> Rate of change of delta with respect to underlying asset price</li>
            <li><strong>Theta:</strong> Rate of change of option price with respect to time (time decay)</li>
            <li><strong>Vega:</strong> Rate of change of option price with respect to volatility</li>
            <li><strong>Rho:</strong> Rate of change of option price with respect to interest rate</li>
          </ul>
        </div>
        <div className="mt-4">
          <h4 className="font-medium text-sm mb-2">Model Limitations:</h4>
          <p className="text-sm text-gray-600">
            The model assumes constant volatility, log-normal distribution of returns, no transaction costs, 
            and continuous trading. It only applies to European options (no early exercise).
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlackScholesValuation;
