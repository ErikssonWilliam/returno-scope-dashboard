
export interface GARCHPoissonInput {
  S: number;             // Current stock price
  K: number;             // Strike price
  T: number;             // Time to maturity in years
  r: number;             // Risk-free interest rate
  sigma: number;         // Initial volatility
  lambda: number;        // Jump intensity (average number of jumps per year)
  muJ: number;           // Average jump size
  sigmaJ: number;        // Jump size volatility
  alpha: number;         // GARCH parameter for ARCH term
  beta: number;          // GARCH parameter for GARCH term
  gamma: number;         // GARCH parameter for leverage effect
  optionType: "call" | "put";
  iterations: number;    // Number of Monte Carlo simulations
  timeSteps: number;     // Number of time steps in simulation
}

export const calculateGARCHPoissonOptionPrice = async (params: GARCHPoissonInput) => {
  const { S, K, T, r, sigma, lambda, muJ, sigmaJ, alpha, beta, gamma, optionType, iterations, timeSteps } = params;
  
  try {
    // This would normally be a complex Monte Carlo simulation with GARCH volatility and Poisson jumps
    // For demo purposes, we'll use a simplified calculation
    
    // Time step size
    const dt = T / timeSteps;
    const sqrtDt = Math.sqrt(dt);
    
    // Expected number of jumps in time period T
    const expectedJumps = lambda * T;
    
    // Adjustment for simulation (simplified)
    let currentVolatility = sigma;
    let sumPayoffs = 0;
    let sumDelta = 0;
    
    // Run Monte Carlo simulations
    for (let i = 0; i < iterations; i++) {
      let stockPrice = S;
      let variance = sigma * sigma;
      
      // Simulate price path
      for (let t = 0; t < timeSteps; t++) {
        // GARCH volatility update
        variance = alpha + beta * variance + gamma * (currentVolatility * Math.random() - 0.5) ** 2;
        currentVolatility = Math.sqrt(variance);
        
        // Generate normal random variable for diffusion
        const z = randomNormal();
        
        // Poisson jump component - simplified
        const jumpOccurs = Math.random() < lambda * dt;
        const jumpSize = jumpOccurs ? Math.exp(muJ + sigmaJ * randomNormal()) - 1 : 0;
        
        // Update stock price
        const drift = (r - 0.5 * variance) * dt;
        const diffusion = currentVolatility * sqrtDt * z;
        const jump = stockPrice * jumpSize;
        
        stockPrice = stockPrice * Math.exp(drift + diffusion) + jump;
      }
      
      // Calculate option payoff
      let payoff = 0;
      if (optionType === "call") {
        payoff = Math.max(0, stockPrice - K);
      } else {
        payoff = Math.max(0, K - stockPrice);
      }
      
      // Discount payoff to present value
      const discountedPayoff = payoff * Math.exp(-r * T);
      sumPayoffs += discountedPayoff;
      
      // Simple delta calculation (for demonstration)
      const delta = optionType === "call" ? (stockPrice > K ? 1 : 0) : (stockPrice < K ? -1 : 0);
      sumDelta += delta;
    }
    
    // Average results
    const optionPrice = sumPayoffs / iterations;
    const delta = sumDelta / iterations;
    
    // Calculate implied volatility (simplified)
    const impliedVolatility = sigma * (1 + 0.1 * expectedJumps) * (1 + 0.05 * Math.abs(gamma));
    
    return {
      optionPrice,
      delta,
      impliedVolatility
    };
  } catch (error) {
    console.error("Error in GARCH-Poisson calculation:", error);
    return null;
  }
};

// Helper function to generate standard normal random variables
function randomNormal() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}
