
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { hestonModel } from "@/lib/valuation/heston";
import {
    EuropeanOption,
    HestonParameters,
    ValueType
} from "@/lib/types";

interface HestonModelValuationProps {
    timeHorizon?: number;
}

const HestonModelValuation: React.FC<HestonModelValuationProps> = ({ timeHorizon = 1 }) => {
    const [strikePrice, setStrikePrice] = useState<number>(100);
    const [timeToMaturity, setTimeToMaturity] = useState<number>(timeHorizon);
    const [riskFreeRate, setRiskFreeRate] = useState<number>(0.05);
    const [volatility, setVolatility] = useState<number>(0.20);
    const [currentPrice, setCurrentPrice] = useState<number>(100);

    // Update timeToMaturity when timeHorizon prop changes
    useEffect(() => {
        setTimeToMaturity(timeHorizon);
    }, [timeHorizon]);

    // Heston Model Parameters
    const [kappa, setKappa] = useState<number>(1.5);       // Mean reversion rate
    const [theta, setTheta] = useState<number>(0.04);       // Long-term variance
    const [xi, setXi] = useState<number>(0.1);            // Volatility of variance
    const [rho, setRho] = useState<number>(-0.7);          // Correlation between asset price and variance

    const [optionPrice, setOptionPrice] = useState<ValueType>('Not calculated');
    const [impliedVolatility, setImpliedVolatility] = useState<ValueType>('Not calculated');

    const calculateOptionPrice = () => {
        const hestonParams: HestonParameters = {
            kappa: kappa,
            theta: theta,
            xi: xi,
            rho: rho
        };

        const optionParams: EuropeanOption = {
            strike: strikePrice,
            maturity: timeToMaturity,
            rate: riskFreeRate,
            sigma: volatility,
            price: currentPrice
        };

        try {
            const { price, impliedVol } = hestonModel(optionParams, hestonParams);
            setOptionPrice(price);
            setImpliedVolatility(impliedVol);
        } catch (error) {
            console.error("Error calculating option price:", error);
            setOptionPrice('Error');
            setImpliedVolatility('Error');
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Heston Model Valuation</CardTitle>
                <CardDescription>
                    Calculate the price of a European option using the Heston model.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="currentPrice">Current Price</Label>
                        <Input
                            type="number"
                            id="currentPrice"
                            value={currentPrice}
                            onChange={(e) => setCurrentPrice(Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <Label htmlFor="strikePrice">Strike Price</Label>
                        <Input
                            type="number"
                            id="strikePrice"
                            value={strikePrice}
                            onChange={(e) => setStrikePrice(Number(e.target.value))}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="timeToMaturity">Time to Maturity</Label>
                        <Input
                            type="number"
                            id="timeToMaturity"
                            value={timeToMaturity}
                            onChange={(e) => setTimeToMaturity(Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <Label htmlFor="riskFreeRate">Risk-Free Rate</Label>
                        <Input
                            type="number"
                            id="riskFreeRate"
                            value={riskFreeRate}
                            onChange={(e) => setRiskFreeRate(Number(e.target.value))}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="volatility">Volatility</Label>
                        <Input
                            type="number"
                            id="volatility"
                            value={volatility}
                            onChange={(e) => setVolatility(Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <Label htmlFor="kappa">Kappa (Mean Reversion Rate)</Label>
                        <Input
                            type="number"
                            id="kappa"
                            value={kappa}
                            onChange={(e) => setKappa(Number(e.target.value))}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="theta">Theta (Long-Term Variance)</Label>
                        <Input
                            type="number"
                            id="theta"
                            value={theta}
                            onChange={(e) => setTheta(Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <Label htmlFor="xi">Xi (Volatility of Variance)</Label>
                        <Input
                            type="number"
                            id="xi"
                            value={xi}
                            onChange={(e) => setXi(Number(e.target.value))}
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="rho">Rho (Correlation)</Label>
                    <Input
                        type="number"
                        id="rho"
                        value={rho}
                        onChange={(e) => setRho(Number(e.target.value))}
                    />
                </div>

                <Button onClick={calculateOptionPrice}>Calculate Option Price</Button>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Implied Volatility</Label>
                        <div className="font-medium">
                            {typeof impliedVolatility === 'number' ? (impliedVolatility * 100).toFixed(2) + '%' : impliedVolatility}
                        </div>
                    </div>
                    <div>
                        <Label>Option Price</Label>
                        <div className="font-medium">
                            {typeof optionPrice === 'number' ? optionPrice.toFixed(2) : optionPrice}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default HestonModelValuation;
