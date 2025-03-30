
// Common types for financial options and models

export type ValueType = number | string;

export interface EuropeanOption {
  strike: number;
  maturity: number;
  rate: number;
  sigma: number;
  price: number;
}

export interface HestonParameters {
  kappa: number;    // Mean reversion rate
  theta: number;    // Long-term variance
  xi: number;       // Volatility of variance
  rho: number;      // Correlation between asset price and variance
}
