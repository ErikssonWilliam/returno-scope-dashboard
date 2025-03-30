import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { calculateGARCHPoissonOptionPrice, GARCHPoissonInput } from './utils/garchPoissonModel';

type ValueType = number | string;

interface GARCHPoissonValuationProps {
    timeHorizon?: number;
}

const GarchPoissonValuation: React.FC<GARCHPoissonValuationProps> = ({ timeHorizon = 1 }) => {
    const [S, setS] = useState<ValueType>(100);
    const [K, setK] = useState<ValueType>(100);
    const [T, setT] = useState<ValueType>(timeHorizon);
    const [r, setR] = useState<ValueType>(0.05);
    const [sigma, setSigma] = useState<ValueType>(0.2);
    const [lambda, setLambda] = useState<ValueType>(0.5);
    const [muJ, setMuJ] = useState<ValueType>(0);
    const [sigmaJ, setSigmaJ] = useState<ValueType>(0.1);
    const [alpha, setAlpha] = useState<ValueType>(0.1);
    const [beta, setBeta] = useState<ValueType>(0.8);
    const [gamma, setGamma] = useState<ValueType>(0.1);
    const [optionType, setOptionType] = useState<"call" | "put">("call");
    const [optionPrice, setOptionPrice] = useState<ValueType>('Not calculated');
    const [delta, setDelta] = useState<ValueType>('Not calculated');
    const [impliedVolatility, setImpliedVolatility] = useState<ValueType>('Not calculated');
    const [iterations, setIterations] = useState<number>(10000);
    const [timeSteps, setTimeSteps] = useState<number>(250);

    useEffect(() => {
        setT(timeHorizon);
    }, [timeHorizon]);

    const handleCalculate = async () => {
        const numericCheck = (value: ValueType): number => {
            const num = Number(value);
            if (isNaN(num)) {
                throw new Error(`Invalid input: ${value} is not a number.`);
            }
            return num;
        };

        try {
            const parsedS = numericCheck(S);
            const parsedK = numericCheck(K);
            const parsedT = numericCheck(T);
            const parsedR = numericCheck(r);
            const parsedSigma = numericCheck(sigma);
            const parsedLambda = numericCheck(lambda);
            const parsedMuJ = numericCheck(muJ);
            const parsedSigmaJ = numericCheck(sigmaJ);
            const parsedAlpha = numericCheck(alpha);
            const parsedBeta = numericCheck(beta);
            const parsedGamma = numericCheck(gamma);

            const inputParams: GARCHPoissonInput = {
                S: parsedS,
                K: parsedK,
                T: parsedT,
                r: parsedR,
                sigma: parsedSigma,
                lambda: parsedLambda,
                muJ: parsedMuJ,
                sigmaJ: parsedSigmaJ,
                alpha: parsedAlpha,
                beta: parsedBeta,
                gamma: parsedGamma,
                optionType,
                iterations,
                timeSteps
            };

            const result = await calculateGARCHPoissonOptionPrice(inputParams);

            if (result) {
                setOptionPrice(result.optionPrice);
                setDelta(result.delta);
                setImpliedVolatility(result.impliedVolatility);
            } else {
                setOptionPrice('Calculation failed');
                setDelta('Calculation failed');
                setImpliedVolatility('Calculation failed');
            }
        } catch (error: any) {
            setOptionPrice(`Error: ${error.message}`);
            setDelta(`Error: ${error.message}`);
            setImpliedVolatility(`Error: ${error.message}`);
        }
    };

    const handleSChange = (e: React.ChangeEvent<HTMLInputElement>) => setS(e.target.value);
    const handleKChange = (e: React.ChangeEvent<HTMLInputElement>) => setK(e.target.value);
    const handleTChange = (e: React.ChangeEvent<HTMLInputElement>) => setT(e.target.value);
    const handleRChange = (e: React.ChangeEvent<HTMLInputElement>) => setR(e.target.value);
    const handleSigmaChange = (e: React.ChangeEvent<HTMLInputElement>) => setSigma(e.target.value);
    const handleLambdaChange = (e: React.ChangeEvent<HTMLInputElement>) => setLambda(e.target.value);
    const handleMuJChange = (e: React.ChangeEvent<HTMLInputElement>) => setMuJ(e.target.value);
    const handleSigmaJChange = (e: React.ChangeEvent<HTMLInputElement>) => setSigmaJ(e.target.value);
    const handleAlphaChange = (e: React.ChangeEvent<HTMLInputElement>) => setAlpha(e.target.value);
    const handleBetaChange = (e: React.ChangeEvent<HTMLInputElement>) => setBeta(e.target.value);
    const handleGammaChange = (e: React.ChangeEvent<HTMLInputElement>) => setGamma(e.target.value);
    const handleIterationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        setIterations(isNaN(value) ? 10000 : value);
    };
    const handleTimeStepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        setTimeSteps(isNaN(value) ? 250 : value);
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>GARCH-Poisson Option Valuation</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Stock Price */}
                    <div>
                        <Label htmlFor="stockPrice">Stock Price (S)</Label>
                        <Input type="number" id="stockPrice" value={S} onChange={handleSChange} />
                    </div>

                    {/* Strike Price */}
                    <div>
                        <Label htmlFor="strikePrice">Strike Price (K)</Label>
                        <Input type="number" id="strikePrice" value={K} onChange={handleKChange} />
                    </div>
                </div>

                 {/* Time to Maturity */}
                 <div>
                    <Label htmlFor="timeToMaturity">Time to Maturity (T)</Label>
                    <Input type="number" id="timeToMaturity" value={T} onChange={handleTChange} />
                </div>

                {/* Risk-Free Rate */}
                <div>
                    <Label htmlFor="riskFreeRate">Risk-Free Rate (r)</Label>
                    <Input type="number" id="riskFreeRate" value={r} onChange={handleRChange} />
                </div>

                {/* Volatility */}
                <div>
                    <Label htmlFor="volatility">Volatility (σ)</Label>
                    <Input type="number" id="volatility" value={sigma} onChange={handleSigmaChange} />
                </div>

                {/* Jump Intensity */}
                <div>
                    <Label htmlFor="jumpIntensity">Jump Intensity (λ)</Label>
                    <Input type="number" id="jumpIntensity" value={lambda} onChange={handleLambdaChange} />
                </div>

                {/* Mean Jump Size */}
                <div>
                    <Label htmlFor="meanJumpSize">Mean Jump Size (μJ)</Label>
                    <Input type="number" id="meanJumpSize" value={muJ} onChange={handleMuJChange} />
                </div>

                {/* Jump Size Volatility */}
                <div>
                    <Label htmlFor="jumpSizeVolatility">Jump Size Volatility (σJ)</Label>
                    <Input type="number" id="jumpSizeVolatility" value={sigmaJ} onChange={handleSigmaJChange} />
                </div>

                {/* GARCH Parameters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label htmlFor="alpha">Alpha (α)</Label>
                        <Input type="number" id="alpha" value={alpha} onChange={handleAlphaChange} />
                    </div>
                    <div>
                        <Label htmlFor="beta">Beta (β)</Label>
                        <Input type="number" id="beta" value={beta} onChange={handleBetaChange} />
                    </div>
                    <div>
                        <Label htmlFor="gamma">Gamma (γ)</Label>
                        <Input type="number" id="gamma" value={gamma} onChange={handleGammaChange} />
                    </div>
                </div>

                {/* Iterations and Time Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="iterations">Iterations</Label>
                        <Input
                            type="number"
                            id="iterations"
                            value={iterations}
                            onChange={handleIterationsChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="timeSteps">Time Steps</Label>
                        <Input
                            type="number"
                            id="timeSteps"
                            value={timeSteps}
                            onChange={handleTimeStepsChange}
                        />
                    </div>
                </div>

                {/* Option Type */}
                <div>
                    <Label>Option Type</Label>
                    <Select value={optionType} onValueChange={(value) => setOptionType(value as "call" | "put")}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select option type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="call">Call</SelectItem>
                            <SelectItem value="put">Put</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Calculate Button */}
                <Button onClick={handleCalculate}>Calculate Option Price</Button>

                {/* Results Display */}
                <div className="mt-6">
                    <h3 className="text-lg font-semibold">Results</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label>Option Price</Label>
                            <div className="font-medium">
                                {
                                    // For the specific error lines, we need to add a type guard:
                                    typeof optionPrice === 'number' ? optionPrice.toFixed(2) : optionPrice
                                }
                            </div>
                        </div>
                        <div>
                            <Label>Delta</Label>
                            <div className="font-medium">
                                {
                                    // For the specific error lines, we need to add a type guard:
                                    typeof delta === 'number' ? delta.toFixed(4) : delta
                                }
                            </div>
                        </div>
                        <div>
                            <Label>Implied Volatility</Label>
                            <div className="font-medium">
                                {
                                    // For the specific error lines, we need to add a type guard:
                                    typeof impliedVolatility === 'number' ? (impliedVolatility * 100).toFixed(2) : impliedVolatility
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default GarchPoissonValuation;
