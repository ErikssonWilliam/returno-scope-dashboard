
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const HestonModelValuation = () => {
  const [spotPrice, setSpotPrice] = useState<number>(100);
  const [strikePrice, setStrikePrice] = useState<number>(100);
  const [initialVolatility, setInitialVolatility] = useState<number>(0.2);
  const [riskFreeRate, setRiskFreeRate] = useState<number>(0.05);
  const [timeToMaturity, setTimeToMaturity] = useState<number>(1);
  const [kappa, setKappa] = useState<number>(2); // Mean reversion speed
  const [theta, setTheta] = useState<number>(0.04); // Long-term volatility
  const [sigma, setSigma] = useState<number>(0.3); // Volatility of volatility
  const [rho, setRho] = useState<number>(-0.7); // Correlation between asset and volatility
  const [optionType, setOptionType] = useState<string>("call");
  const [priceData, setPriceData] = useState<any[]>([]);
  const [optionPrice, setOptionPrice] = useState<number | null>(null);
  
  const runSimulation = () => {
    // Number of simulation steps
    const steps = 50;
    const dt = timeToMaturity / steps;
    let currentPrice = spotPrice;
    let currentVol = initialVolatility;
    
    // Generate one sample path for visualization
    const path = [];
    const strikePrices = [];
    
    for (let step = 0; step <= steps; step++) {
      const time = step * dt;
      
      // Add current state to the path
      path.push({
        time: time.toFixed(2),
        price: currentPrice,
        volatility: currentVol,
      });
      
      // Don't update on the last step
      if (step === steps) break;
      
      // Generate random normal numbers for price and volatility processes
      const z1 = randomNormal();
      const z2 = rho * z1 + Math.sqrt(1 - rho * rho) * randomNormal();
      
      // Update volatility (square root process)
      const volDrift = kappa * (theta - currentVol) * dt;
      const volDiffusion = sigma * Math.sqrt(currentVol * dt) * z2;
      currentVol = Math.max(0.001, currentVol + volDrift + volDiffusion);
      
      // Update price (geometric Brownian motion with stochastic volatility)
      const priceDrift = riskFreeRate * currentPrice * dt;
      const priceDiffusion = Math.sqrt(currentVol) * currentPrice * Math.sqrt(dt) * z1;
      currentPrice = currentPrice + priceDrift + priceDiffusion;
      
      // Add strike price line for reference
      strikePrices.push({
        time: time.toFixed(2),
        strikePrice: strikePrice,
      });
    }
    
    // Combine path and strike price data for the chart
    const combinedData = path.map((point, index) => ({
      ...point,
      strikePrice: strikePrice,
    }));
    
    // Monte Carlo simulation for pricing
    const numSimulations = 10000;
    let sumPayoffs = 0;
    
    for (let sim = 0; sim < numSimulations; sim++) {
      let simPrice = spotPrice;
      let simVol = initialVolatility;
      
      // Run simulation for this path
      for (let step = 0; step < steps; step++) {
        const z1 = randomNormal();
        const z2 = rho * z1 + Math.sqrt(1 - rho * rho) * randomNormal();
        
        // Update volatility
        const volDrift = kappa * (theta - simVol) * dt;
        const volDiffusion = sigma * Math.sqrt(simVol * dt) * z2;
        simVol = Math.max(0.001, simVol + volDrift + volDiffusion);
        
        // Update price
        const priceDrift = riskFreeRate * simPrice * dt;
        const priceDiffusion = Math.sqrt(simVol) * simPrice * Math.sqrt(dt) * z1;
        simPrice = simPrice + priceDrift + priceDiffusion;
      }
      
      // Calculate payoff
      let payoff = 0;
      if (optionType === "call") {
        payoff = Math.max(0, simPrice - strikePrice);
      } else {
        payoff = Math.max(0, strikePrice - simPrice);
      }
      
      sumPayoffs += payoff;
    }
    
    // Calculate option price as discounted expected payoff
    const avgPayoff = sumPayoffs / numSimulations;
    const calculatedOptionPrice = avgPayoff * Math.exp(-riskFreeRate * timeToMaturity);
    
    setPriceData(combinedData);
    setOptionPrice(calculatedOptionPrice);
  };
  
  // Helper function to generate standard normal random variables
  const randomNormal = () => {
    const u1 = Math.random();
    const u2 = Math.random();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  };
  
  return (
    <div className="grid md:grid-cols-2 gap-6">
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
            <Label htmlFor="initial-vol">Initial Volatility (v₀)</Label>
            <Input
              id="initial-vol"
              type="number"
              step="0.01"
              value={initialVolatility}
              onChange={(e) => setInitialVolatility(parseFloat(e.target.value) || 0)}
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
        
        <div className="space-y-2">
          <Label htmlFor="kappa-slider">Mean Reversion Speed (κ): {kappa.toFixed(2)}</Label>
          <Slider
            id="kappa-slider"
            min={0.1}
            max={10}
            step={0.1}
            value={[kappa]}
            onValueChange={(value) => setKappa(value[0])}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="theta-slider">Long-term Volatility (θ): {theta.toFixed(2)}</Label>
          <Slider
            id="theta-slider"
            min={0.01}
            max={0.5}
            step={0.01}
            value={[theta]}
            onValueChange={(value) => setTheta(value[0])}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sigma-slider">Volatility of Volatility (σᵥ): {sigma.toFixed(2)}</Label>
          <Slider
            id="sigma-slider"
            min={0.01}
            max={1}
            step={0.01}
            value={[sigma]}
            onValueChange={(value) => setSigma(value[0])}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="rho-slider">Price-Volatility Correlation (ρ): {rho.toFixed(2)}</Label>
          <Slider
            id="rho-slider"
            min={-1}
            max={1}
            step={0.1}
            value={[rho]}
            onValueChange={(value) => setRho(value[0])}
          />
        </div>
        
        <Button className="w-full" onClick={runSimulation}>
          Run Heston Model Simulation
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
        <h3 className="text-lg font-semibold mb-4">Asset Price Path with Stochastic Volatility</h3>
        {priceData.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  label={{ value: 'Time (years)', position: 'insideBottom', offset: -5 }} 
                />
                <YAxis 
                  yAxisId="price"
                  label={{ value: 'Price ($)', angle: -90, position: 'insideLeft' }}
                />
                <YAxis 
                  yAxisId="volatility"
                  orientation="right"
                  domain={[0, 1]}
                  label={{ value: 'Volatility', angle: 90, position: 'insideRight' }}
                />
                <Tooltip formatter={(value, name) => {
                  if (name === 'price' || name === 'strikePrice') return ['$' + value.toFixed(2), name === 'price' ? 'Price' : 'Strike Price'];
                  if (name === 'volatility') return [value.toFixed(4), 'Volatility'];
                  return [value, name];
                }} />
                <Legend />
                <Line 
                  yAxisId="price"
                  type="monotone" 
                  dataKey="price" 
                  stroke="#8884d8" 
                  name="Price"
                  dot={false}
                />
                <Line 
                  yAxisId="price"
                  type="monotone" 
                  dataKey="strikePrice" 
                  stroke="#ff0000" 
                  strokeDasharray="5 5"
                  name="Strike Price" 
                  dot={false}
                />
                <Line 
                  yAxisId="volatility"
                  type="monotone" 
                  dataKey="volatility" 
                  stroke="#82ca9d" 
                  name="Volatility" 
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Run a simulation to see price path</p>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-2">
          Note: The chart shows one sample path. Option pricing uses 10,000 simulations.
        </p>
      </div>
    </div>
  );
};

export default HestonModelValuation;
