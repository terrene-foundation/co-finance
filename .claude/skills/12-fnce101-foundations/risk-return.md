# Risk and Return

The fundamental tradeoff in finance: to earn higher returns, you must accept higher risk. Risk-return analysis provides the tools to quantify this tradeoff, measure how risky an investment is, and determine how much return you should demand for bearing that risk.

## Why Risk-Return Matters

Imagine two investments: both promise an average return of 10% per year, but Investment A ranges from 8% to 12% while Investment B ranges from -20% to 40%. They have the same average, but very different risk profiles. Risk-return analysis gives you the framework to decide whether the higher potential payoff of Investment B justifies its greater uncertainty.

## Measuring Return

### Simple (Arithmetic) Return

> **R = (P_1 - P_0 + D) / P_0**

Where:
- P_0 = Beginning price
- P_1 = Ending price
- D = Dividend (or other cash distribution)

### Expected Return

The probability-weighted average of all possible returns.

> **E(R) = sum from i=1 to n of: p_i x R_i**

Where p_i = probability of state i, R_i = return in state i.

### Worked Example: Expected Return

An investment has three possible outcomes:

| Economic State | Probability | Return |
|---------------|-------------|--------|
| Boom | 0.25 | 30% |
| Normal | 0.50 | 12% |
| Recession | 0.25 | -10% |

E(R) = 0.25 x 30% + 0.50 x 12% + 0.25 x (-10%)
E(R) = 7.5% + 6.0% + (-2.5%)
E(R) = **11.0%**

## Measuring Risk

### Variance and Standard Deviation

Variance measures the dispersion of returns around the expected value. Standard deviation is the square root of variance and is expressed in the same units as returns (percentage points).

> **Var(R) = sigma^2 = sum from i=1 to n of: p_i x [R_i - E(R)]^2**

> **StdDev(R) = sigma = sqrt(Var(R))**

### Worked Example: Standard Deviation

Using the same investment:

Var(R) = 0.25 x (30% - 11%)^2 + 0.50 x (12% - 11%)^2 + 0.25 x (-10% - 11%)^2
Var(R) = 0.25 x (19%)^2 + 0.50 x (1%)^2 + 0.25 x (-21%)^2
Var(R) = 0.25 x 361 + 0.50 x 1 + 0.25 x 441
Var(R) = 90.25 + 0.50 + 110.25
Var(R) = 201.0 (in percentage-squared terms)

sigma = sqrt(201.0) = **14.18%**

**Interpretation**: The expected return is 11.0% with a standard deviation of 14.18%. Roughly two-thirds of the time, you expect returns to fall within 11% +/- 14.18% -- that is, between -3.18% and 25.18%.

### Historical vs. Expected Measures

When using historical data (a sample of past returns):

> **Sample Variance = (1 / (T-1)) x sum from t=1 to T of: (R_t - R_bar)^2**

Note the denominator is T-1 (Bessel's correction), not T, when estimating from a sample.

## Diversification and Portfolio Risk

### Portfolio Expected Return

The weighted average of individual asset expected returns.

> **E(R_p) = w_A x E(R_A) + w_B x E(R_B)**

Where w_A + w_B = 1 (weights sum to one).

### Portfolio Variance (Two Assets)

> **sigma_p^2 = w_A^2 x sigma_A^2 + w_B^2 x sigma_B^2 + 2 x w_A x w_B x sigma_A x sigma_B x rho_AB**

Where:
- sigma_A, sigma_B = standard deviations of A and B
- rho_AB = correlation coefficient between A and B (-1 <= rho <= +1)

### The Power of Diversification

The key insight is in the correlation term. If rho_AB < 1, the portfolio's risk is **less than** the weighted average of individual risks. This is diversification -- combining imperfectly correlated assets reduces total risk.

| Correlation (rho) | Effect |
|-------------------|--------|
| +1.0 | No diversification benefit; portfolio risk is the weighted average |
| 0.0 | Substantial diversification; portfolio risk is significantly reduced |
| -1.0 | Perfect hedge; risk can be eliminated entirely |

### Worked Example: Portfolio of Two Assets

Asset A: E(R_A) = 12%, sigma_A = 20%
Asset B: E(R_B) = 8%, sigma_B = 15%
Correlation: rho_AB = 0.3
Weights: w_A = 0.6, w_B = 0.4

**Portfolio expected return**:
E(R_p) = 0.6 x 12% + 0.4 x 8% = 7.2% + 3.2% = **10.4%**

**Portfolio variance**:
sigma_p^2 = (0.6)^2 x (20%)^2 + (0.4)^2 x (15%)^2 + 2 x 0.6 x 0.4 x 20% x 15% x 0.3
sigma_p^2 = 0.36 x 400 + 0.16 x 225 + 2 x 0.6 x 0.4 x 20 x 15 x 0.3
sigma_p^2 = 144 + 36 + 43.2
sigma_p^2 = 223.2

sigma_p = sqrt(223.2) = **14.94%**

**Key result**: The weighted average of individual risks would be 0.6 x 20% + 0.4 x 15% = 18%. But the actual portfolio risk is only 14.94% -- diversification reduced risk by over 3 percentage points.

### Systematic vs. Unsystematic Risk

> **Total Risk = Systematic Risk + Unsystematic Risk**

- **Systematic (market) risk**: Risk that affects the entire market (recessions, interest rate changes, geopolitical events). Cannot be diversified away.
- **Unsystematic (idiosyncratic) risk**: Risk specific to a single company (CEO resignation, product recall, lawsuit). Can be diversified away by holding many assets.

As you add more securities to a portfolio, unsystematic risk declines. With approximately 25-30 well-diversified stocks, most unsystematic risk is eliminated. What remains is systematic risk.

**Implication**: The market does not reward you for bearing unsystematic risk (because you can eliminate it for free by diversifying). Only systematic risk earns a risk premium.

## The Capital Asset Pricing Model (CAPM)

The CAPM defines the relationship between systematic risk and expected return.

> **E(R_i) = R_f + beta_i x [E(R_m) - R_f]**

Where:
- E(R_i) = Expected return on asset i
- R_f = Risk-free rate (typically the Treasury bill rate)
- beta_i = Beta of asset i (measure of systematic risk)
- E(R_m) = Expected return on the market portfolio
- [E(R_m) - R_f] = Market risk premium

### Beta

Beta measures how sensitive an asset's returns are to market returns.

> **beta_i = Cov(R_i, R_m) / Var(R_m) = rho_(i,m) x sigma_i / sigma_m**

| Beta | Interpretation |
|------|---------------|
| beta = 1.0 | Same systematic risk as the market; moves 1:1 with the market |
| beta > 1.0 | More systematic risk; amplifies market movements |
| beta < 1.0 | Less systematic risk; dampens market movements |
| beta = 0 | No systematic risk; uncorrelated with the market (like a T-bill) |
| beta < 0 | Negative correlation with the market (rare; gold sometimes exhibits this) |

### Worked Example: CAPM

A stock has beta = 1.3. The risk-free rate is 3%, and the expected market return is 10%.

E(R) = 3% + 1.3 x (10% - 3%)
E(R) = 3% + 1.3 x 7%
E(R) = 3% + 9.1%
E(R) = **12.1%**

**Interpretation**: Given its systematic risk (beta of 1.3), investors should require a 12.1% return. If you expect the stock to return 15%, it is undervalued (plotting above the SML). If you expect it to return 10%, it is overvalued (plotting below the SML).

### Portfolio Beta

> **beta_p = sum from i=1 to n of: w_i x beta_i**

Portfolio beta is simply the weighted average of individual betas.

## The Security Market Line (SML)

The SML plots expected return against beta. All correctly priced assets should lie on this line.

- **Above the SML**: Undervalued (offers more return than required for its risk -- positive alpha)
- **Below the SML**: Overvalued (offers less return than required for its risk -- negative alpha)
- **On the SML**: Fairly priced

> **Alpha (Jensen's alpha) = Actual Return - CAPM Expected Return**
> **alpha_i = R_i - [R_f + beta_i x (R_m - R_f)]**

## The Capital Market Line (CML)

The CML plots expected return against **total risk** (standard deviation) for efficient portfolios that combine the risk-free asset with the market portfolio.

> **E(R_p) = R_f + [(E(R_m) - R_f) / sigma_m] x sigma_p**

The slope of the CML is the market's Sharpe ratio:

> **Slope of CML = [E(R_m) - R_f] / sigma_m**

**SML vs. CML**:
- The SML applies to all assets (individual securities and portfolios) and uses beta as the risk measure
- The CML applies only to efficient portfolios and uses standard deviation as the risk measure

## The Sharpe Ratio

The reward-to-variability ratio, measuring excess return per unit of total risk.

> **Sharpe Ratio = [E(R_p) - R_f] / sigma_p**

**Interpretation**: A Sharpe ratio of 0.8 means you earn 0.8% of excess return for every 1% of risk (standard deviation). Higher is better.

### Worked Example: Sharpe Ratio

Portfolio return = 14%, risk-free rate = 3%, portfolio standard deviation = 18%.

Sharpe = (14% - 3%) / 18% = 11% / 18% = **0.611**

Comparison: if the market Sharpe ratio is 0.50, this portfolio delivered better risk-adjusted performance than the market.

## Common Mistakes

1. **Confusing standard deviation with beta**: Standard deviation measures total risk (systematic + unsystematic). Beta measures only systematic risk. For a well-diversified portfolio, they tell a similar story; for a single stock, they can be very different.

2. **Using the CAPM with total risk**: The CAPM says expected return depends on beta (systematic risk), not standard deviation. A stock with high total risk but low beta should have a low expected return under the CAPM.

3. **Forgetting that correlation drives diversification**: Two risky assets can form a low-risk portfolio if their correlation is sufficiently low or negative. Risk is not just about individual assets -- it is about how they move together.

4. **Assuming historical average returns equal expected returns**: Past performance is not a guarantee. Historical averages are noisy estimates of future expected returns, especially over short periods.

5. **Applying CAPM blindly without understanding its assumptions**: CAPM assumes frictionless markets, no taxes, homogeneous expectations, and that all investors hold the market portfolio. In practice, these assumptions are violated, and the model is an approximation.

6. **Forgetting the sign convention for portfolio weights**: Long positions have positive weights. Short positions have negative weights. Weights must sum to 1.0 (or 100%) for a fully invested portfolio.

## Practice Problems

**Problem 1**: An investment has the following probability distribution: 20% chance of 25%, 60% chance of 10%, 20% chance of -15%. Calculate the expected return and standard deviation.

**Problem 2**: Asset X has sigma = 25%, Asset Y has sigma = 18%, rho_XY = -0.2. Calculate the portfolio standard deviation for a portfolio with 50% in each.

**Problem 3**: Using the CAPM, what is the expected return on a stock with beta = 0.8 if the risk-free rate is 2.5% and the market risk premium is 6%?

**Problem 4**: Portfolio A has an expected return of 16% and sigma of 22%. Portfolio B has an expected return of 10% and sigma of 12%. The risk-free rate is 3%. Which portfolio has the higher Sharpe ratio? Which is preferable?

## Key References

- Bodie, Z., Kane, A. & Marcus, A.J. (2021). *Investments*, 12th ed., McGraw-Hill. Chapters 5-9.
- Berk, J. & DeMarzo, P. (2020). *Corporate Finance*, 5th ed., Pearson. Chapters 10-11.
- Sharpe, W.F. (1964). "Capital Asset Prices: A Theory of Market Equilibrium under Conditions of Risk." *Journal of Finance*, 19(3), 425-442.
- Lintner, J. (1965). "The Valuation of Risk Assets and the Selection of Risky Investments in Stock Portfolios and Capital Budgets." *Review of Economics and Statistics*, 47(1), 13-37.
- Ross, S.A., Westerfield, R.W. & Jordan, B.D. (2022). *Fundamentals of Corporate Finance*, 13th ed., McGraw-Hill. Chapters 12-13.
