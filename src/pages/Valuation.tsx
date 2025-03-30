
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MonteCarloValuation from "@/components/valuation/MonteCarloValuation";
import FiniteDifferenceValuation from "@/components/valuation/FiniteDifferenceValuation";
import BinomialTreeValuation from "@/components/valuation/BinomialTreeValuation";
import BlackScholesValuation from "@/components/valuation/BlackScholesValuation";
import { HestonModelValuation } from "@/components/valuation/HestonModelValuation";
import { GarchPoissonValuation } from "@/components/valuation/GarchPoissonValuation";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const Valuation = () => {
  const [activeTab, setActiveTab] = useState("monte-carlo");
  const [timeHorizon, setTimeHorizon] = useState(1); // Default 1 year
  
  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Instrument Valuation</h1>
          <p className="text-gray-600 max-w-4xl">
            Use industry-standard option pricing models to value financial derivatives. Adjust input parameters to see how they affect
            the theoretical value of options and other derivatives.
          </p>
        </div>
        
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <Label htmlFor="time-horizon" className="text-sm font-medium mb-2 block">
            Time Horizon: {timeHorizon} {timeHorizon === 1 ? 'Year' : 'Years'}
          </Label>
          <div className="flex items-center gap-4">
            <Slider 
              id="time-horizon"
              min={0.25} 
              max={5} 
              step={0.25} 
              value={[timeHorizon]} 
              onValueChange={(value) => setTimeHorizon(value[0])}
              className="w-full max-w-sm"
            />
            <span className="text-sm text-gray-500 w-24">0.25 - 5 Years</span>
          </div>
        </div>

        <Tabs 
          defaultValue="monte-carlo" 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-6 bg-white overflow-x-auto flex whitespace-nowrap max-w-full">
            <TabsTrigger value="monte-carlo" className="px-2 md:px-3 py-1.5 text-xs md:text-sm">Monte Carlo</TabsTrigger>
            <TabsTrigger value="finite-difference" className="px-2 md:px-3 py-1.5 text-xs md:text-sm">Finite Difference</TabsTrigger>
            <TabsTrigger value="binomial-tree" className="px-2 md:px-3 py-1.5 text-xs md:text-sm">Binomial Trees</TabsTrigger>
            <TabsTrigger value="black-scholes" className="px-2 md:px-3 py-1.5 text-xs md:text-sm">Black-Scholes</TabsTrigger>
            <TabsTrigger value="heston-model" className="px-2 md:px-3 py-1.5 text-xs md:text-sm">Heston Model</TabsTrigger>
            <TabsTrigger value="garch-poisson" className="px-2 md:px-3 py-1.5 text-xs md:text-sm">GARCH-Poisson</TabsTrigger>
          </TabsList>
          
          <TabsContent value="monte-carlo">
            <Card>
              <CardHeader>
                <CardTitle>Monte Carlo Simulation</CardTitle>
                <CardDescription>
                  Price options by simulating thousands of possible price paths for the underlying asset.
                  Particularly useful for path-dependent exotic options.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MonteCarloValuation timeHorizon={timeHorizon} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="finite-difference">
            <Card>
              <CardHeader>
                <CardTitle>Finite Difference Methods</CardTitle>
                <CardDescription>
                  Numerically solve the Black-Scholes PDE by discretizing time and price to create a grid of option values.
                  Effective for American and exotic options.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FiniteDifferenceValuation timeHorizon={timeHorizon} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="binomial-tree">
            <Card>
              <CardHeader>
                <CardTitle>Binomial Tree Model</CardTitle>
                <CardDescription>
                  Model the underlying asset price as a discrete-time lattice (tree) with up and down movements.
                  Well-suited for American options and understanding option pricing fundamentals.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BinomialTreeValuation timeHorizon={timeHorizon} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="black-scholes">
            <Card>
              <CardHeader>
                <CardTitle>Black-Scholes-Merton Model</CardTitle>
                <CardDescription>
                  Classic analytical solution for European options pricing using a closed-form formula.
                  The foundation of modern option pricing theory.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BlackScholesValuation timeHorizon={timeHorizon} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="heston-model">
            <Card>
              <CardHeader>
                <CardTitle>Heston Stochastic Volatility Model</CardTitle>
                <CardDescription>
                  Advanced model that incorporates stochastic volatility to better capture market dynamics
                  and volatility smiles observed in options markets.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HestonModelValuation timeHorizon={timeHorizon} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="garch-poisson">
            <Card>
              <CardHeader>
                <CardTitle>GARCH(1,1) with Poisson Jumps</CardTitle>
                <CardDescription>
                  Combines time-varying volatility from GARCH models with sudden price jumps from a Poisson process,
                  ideal for capturing market crashes and rallies.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GarchPoissonValuation timeHorizon={timeHorizon} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Valuation;
