# numpy-financial and Portfolio Math

`numpy-financial` provides time-value-of-money functions (NPV, IRR, PMT, FV, PV), while NumPy itself supplies the vectorized operations, matrix algebra, and random number generation essential for portfolio analytics and Monte Carlo simulation.

## Installation

```bash
pip install numpy-financial numpy
```

`numpy-financial` was split out of NumPy core in v1.20. The functions previously lived in `numpy.financial`.

## Time-Value-of-Money Functions

### Net Present Value (NPV)

Discounts a series of future cash flows back to today.

```python
import numpy_financial as npf
import numpy as np

# Project: invest $10,000 today, receive cash flows over 5 years
cash_flows = [-10_000, 2_500, 3_000, 3_500, 4_000, 4_500]
discount_rate = 0.08  # 8% required return

npv = npf.npv(discount_rate, cash_flows)
print(f"NPV at 8%: ${npv:,.2f}")
# Positive NPV means the project adds value at this discount rate

# Compare NPV at multiple discount rates
rates = np.arange(0.01, 0.20, 0.01)
npvs = [npf.npv(r, cash_flows) for r in rates]
```

### Internal Rate of Return (IRR)

The discount rate that makes NPV equal to zero.

```python
cash_flows = [-10_000, 2_500, 3_000, 3_500, 4_000, 4_500]
irr = npf.irr(cash_flows)
print(f"IRR: {irr:.2%}")

# Verify: NPV at the IRR should be ~0
print(f"NPV at IRR: ${npf.npv(irr, cash_flows):.6f}")
```

### Common Pitfall: IRR Limitations

IRR assumes reinvestment at the IRR rate itself, which may be unrealistic. For non-conventional cash flows (multiple sign changes), there can be multiple IRRs or none. Use Modified IRR (MIRR) when appropriate.

```python
def mirr(cash_flows, finance_rate, reinvest_rate):
    """Modified Internal Rate of Return."""
    n = len(cash_flows) - 1
    negatives = np.where(np.array(cash_flows) < 0, cash_flows, 0)
    positives = np.where(np.array(cash_flows) > 0, cash_flows, 0)

    pv_negatives = npf.npv(finance_rate, negatives)
    fv_positives = sum(
        cf * (1 + reinvest_rate) ** (n - i)
        for i, cf in enumerate(positives)
    )

    return (fv_positives / abs(pv_negatives)) ** (1 / n) - 1

result = mirr([-10_000, 3_000, 4_200, 6_800], finance_rate=0.10, reinvest_rate=0.06)
print(f"MIRR: {result:.2%}")
```

### Payment (PMT)

Calculate the periodic payment for a loan or annuity.

```python
# Monthly mortgage payment
principal = 400_000
annual_rate = 0.065
monthly_rate = annual_rate / 12
term_months = 30 * 12

monthly_payment = npf.pmt(monthly_rate, term_months, principal)
print(f"Monthly payment: ${-monthly_payment:,.2f}")

# Total interest paid over the life of the loan
total_paid = -monthly_payment * term_months
total_interest = total_paid - principal
print(f"Total interest: ${total_interest:,.2f}")

# Amortization schedule
balances = []
balance = principal
for month in range(1, term_months + 1):
    interest_payment = balance * monthly_rate
    principal_payment = -monthly_payment - interest_payment
    balance -= principal_payment
    balances.append({
        "Month": month,
        "Payment": -monthly_payment,
        "Principal": principal_payment,
        "Interest": interest_payment,
        "Balance": balance,
    })
```

### Future Value (FV) and Present Value (PV)

```python
# FV: What will $10,000 be worth in 20 years at 7% annual growth?
fv = npf.fv(rate=0.07, nper=20, pmt=0, pv=-10_000)
print(f"Future Value: ${fv:,.2f}")

# FV with monthly contributions: $500/month for 30 years at 7%
fv_with_contrib = npf.fv(rate=0.07/12, nper=30*12, pmt=-500, pv=-10_000)
print(f"FV with contributions: ${fv_with_contrib:,.2f}")

# PV: What is $1,000,000 in 30 years worth today at 5% discount?
pv = npf.pv(rate=0.05, nper=30, pmt=0, fv=1_000_000)
print(f"Present Value: ${-pv:,.2f}")
```

### Number of Periods (NPER)

```python
# How long to pay off a $20,000 loan at 6% with $400/month payments?
nper = npf.nper(rate=0.06/12, pmt=-400, pv=20_000)
print(f"Months to payoff: {nper:.0f} ({nper/12:.1f} years)")
```

## Vectorized Portfolio Math

### Portfolio Returns

```python
# Individual asset returns (annualized)
returns = np.array([0.12, 0.08, 0.15, 0.06])  # 4 assets
weights = np.array([0.30, 0.25, 0.25, 0.20])   # Portfolio weights

# Portfolio expected return (dot product)
portfolio_return = np.dot(weights, returns)
print(f"Expected portfolio return: {portfolio_return:.2%}")
```

### Covariance and Correlation Matrices

```python
# Simulated daily returns for 4 assets (250 trading days)
np.random.seed(42)
n_assets = 4
n_days = 250

# Generate correlated returns using Cholesky decomposition
target_corr = np.array([
    [1.00, 0.65, 0.30, 0.10],
    [0.65, 1.00, 0.40, 0.15],
    [0.30, 0.40, 1.00, 0.05],
    [0.10, 0.15, 0.05, 1.00],
])
daily_vols = np.array([0.02, 0.015, 0.025, 0.01])  # Daily std devs

# Cholesky decomposition to generate correlated returns
L = np.linalg.cholesky(target_corr)
uncorrelated = np.random.normal(0, 1, (n_days, n_assets))
correlated = uncorrelated @ L.T
daily_returns = correlated * daily_vols  # Scale by volatility

# Covariance matrix from actual returns
cov_matrix = np.cov(daily_returns, rowvar=False)

# Annualize the covariance matrix
annual_cov = cov_matrix * 252

# Correlation matrix from covariance
std_devs = np.sqrt(np.diag(cov_matrix))
corr_matrix = cov_matrix / np.outer(std_devs, std_devs)

# Portfolio variance and volatility
weights = np.array([0.30, 0.25, 0.25, 0.20])
portfolio_var = weights @ annual_cov @ weights
portfolio_vol = np.sqrt(portfolio_var)
print(f"Portfolio volatility: {portfolio_vol:.2%}")
```

### Efficient Frontier Calculation

```python
def portfolio_stats(weights, mean_returns, cov_matrix):
    """Calculate portfolio return and volatility."""
    port_return = np.dot(weights, mean_returns)
    port_vol = np.sqrt(weights @ cov_matrix @ weights)
    return port_return, port_vol

# Generate random portfolios
n_portfolios = 10_000
mean_returns = np.array([0.12, 0.08, 0.15, 0.06])
results = np.zeros((n_portfolios, 3))  # return, vol, sharpe

for i in range(n_portfolios):
    w = np.random.dirichlet(np.ones(n_assets))  # Random weights summing to 1
    ret, vol = portfolio_stats(w, mean_returns, annual_cov)
    sharpe = (ret - 0.04) / vol  # Risk-free rate = 4%
    results[i] = [ret, vol, sharpe]

# Find the maximum Sharpe ratio portfolio
max_sharpe_idx = results[:, 2].argmax()
print(f"Max Sharpe — Return: {results[max_sharpe_idx, 0]:.2%}, "
      f"Vol: {results[max_sharpe_idx, 1]:.2%}, "
      f"Sharpe: {results[max_sharpe_idx, 2]:.2f}")
```

## Monte Carlo Simulation

### Geometric Brownian Motion (GBM)

```python
def simulate_gbm(S0, mu, sigma, T, n_steps, n_paths):
    """
    Simulate stock price paths using Geometric Brownian Motion.

    Parameters:
        S0: Initial stock price
        mu: Expected annual return (drift)
        sigma: Annual volatility
        T: Time horizon in years
        n_steps: Number of time steps
        n_paths: Number of simulation paths
    """
    dt = T / n_steps
    # Pre-compute random component
    Z = np.random.standard_normal((n_steps, n_paths))

    # GBM formula: S(t+dt) = S(t) * exp((mu - 0.5*sigma^2)*dt + sigma*sqrt(dt)*Z)
    drift = (mu - 0.5 * sigma**2) * dt
    diffusion = sigma * np.sqrt(dt) * Z

    log_returns = drift + diffusion
    log_price_paths = np.vstack([np.zeros(n_paths), log_returns.cumsum(axis=0)])
    price_paths = S0 * np.exp(log_price_paths)

    return price_paths

# Simulate 1 year of daily prices
paths = simulate_gbm(
    S0=100,       # Starting price
    mu=0.10,      # 10% expected return
    sigma=0.25,   # 25% annual volatility
    T=1.0,        # 1 year
    n_steps=252,  # Daily steps
    n_paths=10_000
)

# Analyze terminal distribution
terminal_prices = paths[-1, :]
print(f"Mean terminal price: ${terminal_prices.mean():.2f}")
print(f"Median terminal price: ${np.median(terminal_prices):.2f}")
print(f"5th percentile (VaR 95%): ${np.percentile(terminal_prices, 5):.2f}")
print(f"95th percentile: ${np.percentile(terminal_prices, 95):.2f}")
```

### Portfolio Monte Carlo

```python
def monte_carlo_portfolio(
    initial_value, annual_return, annual_vol,
    annual_contribution, years, n_simulations
):
    """Simulate portfolio growth with annual contributions."""
    n_months = years * 12
    monthly_return = (1 + annual_return) ** (1/12) - 1
    monthly_vol = annual_vol / np.sqrt(12)
    monthly_contribution = annual_contribution / 12

    paths = np.zeros((n_months + 1, n_simulations))
    paths[0] = initial_value

    for t in range(1, n_months + 1):
        returns = np.random.normal(monthly_return, monthly_vol, n_simulations)
        paths[t] = paths[t-1] * (1 + returns) + monthly_contribution

    return paths

results = monte_carlo_portfolio(
    initial_value=50_000,
    annual_return=0.07,
    annual_vol=0.15,
    annual_contribution=12_000,
    years=30,
    n_simulations=5_000,
)

final_values = results[-1]
print(f"Median final portfolio: ${np.median(final_values):,.0f}")
print(f"10th percentile: ${np.percentile(final_values, 10):,.0f}")
print(f"90th percentile: ${np.percentile(final_values, 90):,.0f}")
```

**Educational Disclaimer**: Monte Carlo simulations are illustrative tools. They rely on assumptions about return distributions that may not hold in reality. Actual returns may differ materially from simulated results. See **[07-regulatory-framework](../07-regulatory-framework/SKILL.md)** for disclosure requirements.

## Common Pitfalls

1. **Sign conventions in npf functions**: PMT, PV, and FV use cash flow sign conventions. Money paid out is negative; money received is positive. Getting signs wrong produces confusing results.

2. **Rate/period mismatch**: If payments are monthly, the rate must be monthly (annual rate / 12) and nper must be in months (years \* 12).

3. **Covariance vs correlation**: Covariance depends on scale; correlation is normalized to [-1, 1]. Use covariance for portfolio variance calculations; correlation for understanding relationships.

4. **Annualization**: Multiply daily covariance by 252 (trading days), not 365. Multiply daily volatility by sqrt(252), not sqrt(365).

## Cross-References

- See **[pandas-finance](pandas-finance.md)** for building returns DataFrames from market data
- See **[quantlib-basics](quantlib-basics.md)** for advanced pricing and yield curve math
- See **[visualization](visualization.md)** for plotting Monte Carlo fan charts and efficient frontiers
- See **[03-portfolio-theory](../03-portfolio-theory/SKILL.md)** for the theory behind mean-variance optimization
- See **[04-risk-management](../04-risk-management/SKILL.md)** for VaR and risk metrics
