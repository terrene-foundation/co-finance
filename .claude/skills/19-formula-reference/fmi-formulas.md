# Financial Markets & Investments Formula Reference

## Bond Analytics

| Formula | Expression |
|---------|-----------|
| Macaulay Duration | D = (1/P) x sum(t x PV(CF_t)) |
| Modified Duration | D_Mod = D_Mac / (1 + y/m) |
| Dollar Duration | DD = D_Mod x P |
| Convexity | C = (1/P) x sum(t(t+1) x CF_t / (1+y)^(t+2)) |
| Price Change | %Delta P = -D_Mod x Delta y + 0.5 x C x (Delta y)^2 |
| Forward Rate | f_(1,2) = [(1+z_2)^2/(1+z_1)] - 1 |
| Spot from Forward | (1+z_n)^n = (1+z_1)(1+f_1)(1+f_2)...(1+f_(n-1)) |

## Option Pricing (Black-Scholes)

| Formula | Expression |
|---------|-----------|
| Call Price | C = S x N(d_1) - K x e^(-rT) x N(d_2) |
| Put Price | P = K x e^(-rT) x N(-d_2) - S x N(-d_1) |
| d_1 | [ln(S/K) + (r + sigma^2/2) x T] / (sigma x sqrt(T)) |
| d_2 | d_1 - sigma x sqrt(T) |
| Put-Call Parity | C + K x e^(-rT) = P + S |

Where: S = stock price, K = strike price, r = risk-free rate, T = time to expiration, sigma = volatility, N() = cumulative normal distribution.

## Options Greeks

| Greek | Measures | Formula (Call) |
|-------|----------|---------------|
| Delta | Price sensitivity to stock price | N(d_1) |
| Gamma | Rate of change of delta | N'(d_1) / (S x sigma x sqrt(T)) |
| Theta | Time decay | -(S x N'(d_1) x sigma)/(2 x sqrt(T)) - r x K x e^(-rT) x N(d_2) |
| Vega | Sensitivity to volatility | S x sqrt(T) x N'(d_1) |
| Rho | Sensitivity to interest rates | K x T x e^(-rT) x N(d_2) |

## Portfolio Performance

| Measure | Formula | Uses |
|---------|---------|------|
| Sharpe Ratio | (R_p - R_f) / sigma_p | Total risk-adjusted return |
| Treynor Ratio | (R_p - R_f) / beta_p | Systematic risk-adjusted return |
| Jensen's Alpha | R_p - [R_f + beta(R_m - R_f)] | Excess return over CAPM |
| Information Ratio | Alpha / Tracking Error | Active management skill |
| Sortino Ratio | (R_p - R_f) / Downside Deviation | Downside risk-adjusted return |
| M-squared | R_f + (R_p - R_f) x (sigma_m/sigma_p) | Sharpe-equivalent return at market risk |

## Market Microstructure

| Formula | Expression |
|---------|-----------|
| Bid-Ask Spread | Ask - Bid |
| Effective Spread | 2 x |Trade Price - Midpoint| |
| VWAP | sum(P_i x V_i) / sum(V_i) |
| Amihud Illiquidity | |R_t| / Volume_t (averaged over T days) |
