# /portfolio - Portfolio Construction & Risk Quick Reference

## Purpose

Quick reference for portfolio math, risk measurement, and optimization. Loads the portfolio theory skill module so you can immediately work with expected returns, covariance matrices, efficient frontiers, and risk metrics.

## Quick Reference

| Command                             | Action                                    |
| ----------------------------------- | ----------------------------------------- |
| `expected_return(weights, returns)` | Portfolio expected return                 |
| `portfolio_variance(weights, cov)`  | Portfolio variance from covariance matrix |
| `sharpe_ratio(ret, rf, std)`        | Risk-adjusted return                      |
| `sortino_ratio(ret, rf, downside)`  | Downside risk-adjusted return             |
| `max_drawdown(series)`              | Largest peak-to-trough decline            |
| `value_at_risk(returns, alpha)`     | Loss threshold at confidence level        |
| `efficient_frontier(returns, cov)`  | Optimal risk-return tradeoff curve        |

## What You Get

- Portfolio expected return and variance calculations
- Covariance matrix construction from historical returns
- Efficient frontier computation and visualization
- Risk metrics: VaR (parametric and historical), CVaR/Expected Shortfall
- Performance metrics: Sharpe, Sortino, Treynor, Information Ratio
- Maximum drawdown and drawdown duration analysis
- Mean-variance optimization with scipy

## Quick Pattern

```python
import numpy as np
import pandas as pd
from scipy.optimize import minimize

# Portfolio expected return
def portfolio_return(weights, expected_returns):
    return np.dot(weights, expected_returns)

# Portfolio volatility
def portfolio_volatility(weights, cov_matrix):
    return np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))

# Sharpe ratio
def sharpe_ratio(port_return, risk_free_rate, port_volatility):
    return (port_return - risk_free_rate) / port_volatility

# Sortino ratio (penalizes only downside volatility)
def sortino_ratio(returns, risk_free_rate):
    excess = returns - risk_free_rate
    downside = returns[returns < risk_free_rate]
    downside_std = np.std(downside)
    return np.mean(excess) / downside_std if downside_std > 0 else np.inf

# Maximum drawdown
def max_drawdown(cumulative_returns: pd.Series) -> float:
    peak = cumulative_returns.cummax()
    drawdown = (cumulative_returns - peak) / peak
    return drawdown.min()

# Value at Risk (historical method)
def historical_var(returns: pd.Series, confidence: float = 0.95) -> float:
    return np.percentile(returns, (1 - confidence) * 100)

# Mean-variance optimization: maximize Sharpe ratio
def optimize_portfolio(expected_returns, cov_matrix, risk_free_rate=0.02):
    n_assets = len(expected_returns)

    def neg_sharpe(weights):
        ret = portfolio_return(weights, expected_returns)
        vol = portfolio_volatility(weights, cov_matrix)
        return -(ret - risk_free_rate) / vol

    constraints = {"type": "eq", "fun": lambda w: np.sum(w) - 1}
    bounds = tuple((0, 1) for _ in range(n_assets))
    initial = np.array([1 / n_assets] * n_assets)

    result = minimize(neg_sharpe, initial, method="SLSQP",
                      bounds=bounds, constraints=constraints)
    return result.x

# Build covariance matrix from historical returns
import yfinance as yf

tickers = ["AAPL", "GOOGL", "MSFT", "BND"]
data = yf.download(tickers, start="2020-01-01")["Adj Close"]
returns = data.pct_change().dropna()
cov_matrix = returns.cov() * 252  # annualize
expected_rets = returns.mean() * 252  # annualize

optimal_weights = optimize_portfolio(expected_rets.values, cov_matrix.values)
```

## Agent Teams

| Agent                    | Role                                                          |
| ------------------------ | ------------------------------------------------------------- |
| **quantitative-analyst** | Risk metric computation, statistical validation, optimization |
| **financial-engineer**   | Portfolio construction, factor models, stress testing         |

## Related Commands

- `/finance` - Underlying financial calculations and formulas
- `/backtest` - Test portfolio strategies against historical data
- `/data` - Fetch the market data for portfolio analysis

## Skill Reference

Loads `.claude/skills/03-portfolio-theory/SKILL.md` for comprehensive portfolio theory coverage including modern portfolio theory, factor models, risk budgeting, and rebalancing strategies.
