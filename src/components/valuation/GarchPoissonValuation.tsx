
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ScatterChart, Scatter, LineChart, Line, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const GarchPoissonValuation = () => {
  const [spotPrice, setSpotPrice] = useState<number>(100);
  const [strikePrice, setStrikePrice] = useState<number>(100);
  const [initialVolatility, setInitialVolatility] = useState<number>(0.2);
  const [riskFreeRate, setRiskFreeRate] = useState<number>(0.05);
  const [timeToMaturity, setTimeToMaturity] = useState<number>(1);
  
  // GARCH parameters
  const [omega, setOmega] = useState<number>(0.000002); // Constant term
  const [alpha, setAlpha] = useState<number>(0.1); // ARCH parameter
  const [beta, setBeta] = useState<number>(0.8); // GARCH parameter
  
  // Poisson jump parameters
  const [jumpIntensity, setJumpIntensity] = useState<number>(5); // Annual jump frequency
  const [jumpMean, setJumpMean] = useState<number>(-0.05); // Average jump size
  const [jumpVolatility, setJumpVolatility] = useState<number>(0.08); // Jump size volatility
  
  const [optionType, setOptionType] = useState<string>("call");
  const [priceData, setPriceData] = useState<any[]>([]);
  const [optionPrice, setOptionPrice] = useState<number | null>(null);
  const [jumpPoints, setJumpPoints] = useState<any[]>([]);
  
  const runSimulation = () => {
    // Simulation parameters
    const days = 252; // Trading days in a year
    const dt = timeToMaturity / days;
    const dailyJumpProb = jumpIntensity * dt;
    
    // Initialize simulation variables
    let currentPrice = spotPrice;
    let currentVariance = initialVolatility * initialVolatility; // Variance = vol²
    let prevReturn = 0;
    
    // Arrays to store path data
    const pricePath = [];
    const jumps = [];
    
    // Generate one sample path for visualization
    for (let day = 0; day <= days; day++) {
      const time = (day / days) * timeToMaturity;
      
      // Add current point to path
      pricePath.push({
        time: time.toFixed(3),
        price: currentPrice,
        variance: Math.sqrt(currentVariance), // Store volatility for display
        strikePrice: strikePrice
      });
      
      if (day === days) break; // Don't update on the last day
      
      // Update GARCH variance for next period
      currentVariance = omega + alpha * prevReturn * prevReturn + beta * currentVariance;
      
      // Generate normal random number for diffusion component
      const z = randomNormal();
      
      // Determine if a jump occurs
      const jumpOccurs = Math.random() < dailyJumpProb;
      let jumpComponent = 0;
      
      if (jumpOccurs) {
        // Generate jump size (normally distributed)
        const jumpSize = jumpMean + jumpVolatility * randomNormal();
        jumpComponent = jumpSize;
        
        // Store jump information for visualization
        jumps.push({
          time: time.toFixed(3),
          price: currentPrice,
          jumpSize: jumpSize,
        });
      }
      
      // Update price with both diffusion and possible jump
      const diffusionReturn = riskFreeRate * dt + Math.sqrt(currentVariance * dt) * z;
      const totalReturn = diffusionReturn + jumpComponent;
      prevReturn = totalReturn; // Store for GARCH updating
      
      currentPrice = currentPrice * Math.exp(totalReturn);
    }
    
    // Monte Carlo simulation for option pricing
    const numSimulations = 5000;
    let sumPayoffs = 0;
    
    for (let sim = 0; sim < numSimulations; sim++) {
      let simPrice = spotPrice;
      let simVariance = initialVolatility * initialVolatility;
      let simPrevReturn = 0;
      
      // Simulate price path
      for (let day = 0; day < days; day++) {
        // Update GARCH variance
        simVariance = omega + alpha * simPrevReturn * simPrevReturn + beta * simVariance;
        
        // Generate normal random number for diffusion
        const z = randomNormal();
        
        // Check for jump
        const jumpOccurs = Math.random() < dailyJumpProb;
        let jumpComponent = 0;
        
        if (jumpOccurs) {
          const jumpSize = jumpMean + jumpVolatility * randomNormal();
          jumpComponent = jumpSize;
        }
        
        // Update price
        const diffusionReturn = riskFreeRate * dt + Math.sqrt(simVariance * dt) * z;
        const totalReturn = diffusionReturn + jumpComponent;
        simPrevReturn = totalReturn;
        
        simPrice = simPrice * Math.exp(totalReturn);
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
    
    setPriceData(pricePath);
    setJumpPoints(jumps);
    setOptionPrice(calculatedOptionPrice);
  };
  
  // Helper function to generate standard normal random variables
  const randomNormal = () => {
    const u1 = Math.random();
    const u2 = Math.random();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  };
  
  // Calculate persistence (β + α) for display
  const persistence = alpha + beta;
  
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
            <Label htmlFor="initial-vol">Initial Volatility</Label>
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
        
        <div className="p-4 bg-slate-50 rounded-lg">
          <h3 className="text-md font-semibold mb-2">GARCH(1,1) Parameters</h3>
          
          <div className="space-y-2 mb-2">
            <Label htmlFor="omega-slider">Constant (ω): {omega.toExponential(6)}</Label>
            <Slider
              id="omega-slider"
              min={0.0000001}
              max={0.00001}
              step={0.0000001}
              value={[omega]}
              onValueChange={(value) => setOmega(value[0])}
            />
          </div>
          
          <div className="space-y-2 mb-2">
            <Label htmlFor="alpha-slider">ARCH (α): {alpha.toFixed(2)}</Label>
            <Slider
              id="alpha-slider"
              min={0.01}
              max={0.3}
              step={0.01}
              value={[alpha]}
              onValueChange={(value) => setAlpha(value[0])}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="beta-slider">GARCH (β): {beta.toFixed(2)}</Label>
            <Slider
              id="beta-slider"
              min={0.5}
              max={0.99}
              step={0.01}
              value={[beta]}
              onValueChange={(value) => setBeta(value[0])}
            />
          </div>
          
          <p className="text-xs text-slate-600 mt-2">
            Persistence (α + β): {persistence.toFixed(3)} {persistence >= 1 ? "⚠️ Warning: Non-stationary" : ""}
          </p>
        </div>
        
        <div className="p-4 bg-slate-50 rounded-lg">
          <h3 className="text-md font-semibold mb-2">Poisson Jump Parameters</h3>
          
          <div className="space-y-2 mb-2">
            <Label htmlFor="lambda-slider">Jump Intensity (λ): {jumpIntensity.toFixed(1)} per year</Label>
            <Slider
              id="lambda-slider"
              min={0}
              max={20}
              step={0.5}
              value={[jumpIntensity]}
              onValueChange={(value) => setJumpIntensity(value[0])}
            />
          </div>
          
          <div className="space-y-2 mb-2">
            <Label htmlFor="jump-mean-slider">Jump Mean Size: {(jumpMean * 100).toFixed(1)}%</Label>
            <Slider
              id="jump-mean-slider"
              min={-0.2}
              max={0.1}
              step={0.01}
              value={[jumpMean]}
              onValueChange={(value) => setJumpMean(value[0])}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="jump-vol-slider">Jump Size Volatility: {(jumpVolatility * 100).toFixed(1)}%</Label>
            <Slider
              id="jump-vol-slider"
              min={0.01}
              max={0.2}
              step={0.01}
              value={[jumpVolatility]}
              onValueChange={(value) => setJumpVolatility(value[0])}
            />
          </div>
        </div>
        
        <Button className="w-full" onClick={runSimulation}>
          Run GARCH-Poisson Simulation
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
        <h3 className="text-lg font-semibold mb-4">GARCH Process with Poisson Jumps</h3>
        {priceData.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  label={{ value: 'Time (years)', position: 'insideBottom', offset: -5 }} 
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  label={{ value: 'Price ($)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip formatter={(value, name) => {
                  if (name === 'price') return ['$' + value.toFixed(2), 'Price'];
                  if (name === 'strikePrice') return ['$' + value.toFixed(2), 'Strike Price'];
                  if (name === 'variance') return [(value * 100).toFixed(2) + '%', 'Volatility'];
                  return [value, name];
                }} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#8884d8" 
                  dot={false}
                  name="Price"
                />
                <Line 
                  type="monotone" 
                  dataKey="strikePrice" 
                  stroke="#ff0000" 
                  strokeDasharray="5 5"
                  dot={false}
                  name="Strike Price"
                />
                {jumpPoints.length > 0 && (
                  <Scatter 
                    name="Jump Points" 
                    data={jumpPoints} 
                    fill="#d24848"
                    line={false}
                    shape="circle"
                    dataKey="price" 
                    xAxisId={0} // Use the same xAxis
                    yAxisId={0} // Use the same yAxis
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Run a simulation to see price path with jumps</p>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-2">
          Note: Red dots indicate jumps. The chart shows one sample path. Option pricing uses 5,000 simulations.
        </p>
      </div>
    </div>
  );
};

export default GarchPoissonValuation;
