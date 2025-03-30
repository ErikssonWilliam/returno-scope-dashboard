
import { EuropeanOption, HestonParameters } from "@/lib/types";

// Heston model implementation for option pricing
export const hestonModel = (option: EuropeanOption, params: HestonParameters) => {
  const { strike, maturity, rate, sigma, price } = option;
  const { kappa, theta, xi, rho } = params;
  
  // This is a simplified implementation of the Heston model
  // In a real application, this would use complex numerical methods
  
  // Generate a simulated option price based on the Heston model parameters
  // For demonstration purposes, we're using a simplified calculation
  const vol = sigma * Math.sqrt((1 + kappa * theta * maturity) / (1 + xi * Math.abs(rho)));
  const d1 = (Math.log(price / strike) + (rate + 0.5 * vol * vol) * maturity) / (vol * Math.sqrt(maturity));
  const d2 = d1 - vol * Math.sqrt(maturity);
  
  // Calculate call price using Black-Scholes approximation with Heston volatility
  const callPrice = price * normCDF(d1) - strike * Math.exp(-rate * maturity) * normCDF(d2);
  
  // Calculate implied volatility (simplified)
  const impliedVol = vol * (1 + 0.1 * (1 - Math.exp(-kappa * maturity)) * (theta - 1));
  
  return {
    price: callPrice,
    impliedVol: impliedVol
  };
};

// Standard normal cumulative distribution function
function normCDF(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2.0);
  
  const t = 1.0 / (1.0 + p * x);
  const erf = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  
  return 0.5 * (1.0 + sign * erf);
}
