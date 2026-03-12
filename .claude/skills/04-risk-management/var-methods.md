---
name: var-methods
description: "Value at Risk methods reference covering historical VaR, parametric VaR, Monte Carlo VaR, Expected Shortfall (CVaR), confidence levels, time horizons, and VaR backtesting. Use when asking about 'VaR', 'Value at Risk', 'Expected Shortfall', 'CVaR', 'historical VaR', 'parametric VaR', 'Monte Carlo VaR', 'confidence level', 'VaR backtesting', 'risk measurement', 'tail risk', or 'conditional VaR'."
---

# Value at Risk (VaR) Methods

Reference for VaR and Expected Shortfall calculation methods with Python implementations and backtesting.

## Concept

**Value at Risk (VaR)** answers: "What is the maximum loss over a given time horizon at a specified confidence level?"

Example: "1-day 95% VaR of $1M" means there is a 5% probability of losing more than $1M in a single day.

**Key parameters:**

- **Confidence level**: Typically 95% or 99%
- **Time horizon**: 1 day, 10 days, or other periods
- **Portfolio value**: Dollar amount at risk

## Historical VaR

Uses actual historical returns to estimate the loss distribution. No distributional assumptions required.

```python
import numpy as np
import pandas as pd
import yfinance as yf

def historical_var(returns: pd.Series, confidence_level: float = 0.95,
                    portfolio_value: float = 1_000_000) -> dict:
    """Calculate historical Value at Risk.

    Args:
        returns: Series of portfolio returns
        confidence_level: VaR confidence level (e.g., 0.95)
        portfolio_value: Portfolio value in dollars

    Returns:
        VaR and ES in both percentage and dollar terms
    """
    # VaR is the negative of the quantile at (1 - confidence_level)
    var_pct = -np.percentile(returns, (1 - confidence_level) * 100)
    var_dollar = var_pct * portfolio_value

    # Expected Shortfall: average of losses beyond VaR
    losses_beyond = returns[returns <= -var_pct]
    es_pct = -losses_beyond.mean() if len(losses_beyond) > 0 else var_pct
    es_dollar = es_pct * portfolio_value

    return {
        "var_pct": var_pct,
        "var_dollar": var_dollar,
        "es_pct": es_pct,
        "es_dollar": es_dollar,
        "confidence_level": confidence_level,
        "observations": len(returns),
        "breaches": int((returns < -var_pct).sum()),
        "breach_rate": float((returns < -var_pct).mean()),
    }

# Example
spy = yf.download("SPY", period="5y", auto_adjust=True)["Close"]
returns = spy.pct_change().dropna()

var_95 = historical_var(returns, 0.95, 1_000_000)
var_99 = historical_var(returns, 0.99, 1_000_000)

print(f"95% 1-day VaR: {var_95['var_pct']:.2%} (${var_95['var_dollar']:,.0f})")
print(f"95% 1-day ES:  {var_95['es_pct']:.2%} (${var_95['es_dollar']:,.0f})")
print(f"99% 1-day VaR: {var_99['var_pct']:.2%} (${var_99['var_dollar']:,.0f})")
print(f"99% 1-day ES:  {var_99['es_pct']:.2%} (${var_99['es_dollar']:,.0f})")
```

## Parametric (Variance-Covariance) VaR

Assumes returns are normally distributed. Fast but may underestimate tail risk.

```python
from scipy.stats import norm

def parametric_var(returns: pd.Series, confidence_level: float = 0.95,
                    portfolio_value: float = 1_000_000) -> dict:
    """Calculate parametric (normal) VaR.

    Args:
        returns: Series of portfolio returns
        confidence_level: VaR confidence level
        portfolio_value: Portfolio value

    Returns:
        Parametric VaR and ES
    """
    mu = returns.mean()
    sigma = returns.std()

    # Z-score for the confidence level
    z = norm.ppf(1 - confidence_level)

    var_pct = -(mu + z * sigma)
    var_dollar = var_pct * portfolio_value

    # Parametric ES (for normal distribution)
    es_pct = -(mu - sigma * norm.pdf(z) / (1 - confidence_level))
    es_dollar = es_pct * portfolio_value

    return {
        "var_pct": var_pct,
        "var_dollar": var_dollar,
        "es_pct": es_pct,
        "es_dollar": es_dollar,
        "mean": mu,
        "std": sigma,
        "z_score": z,
        "confidence_level": confidence_level,
    }

param_var = parametric_var(returns, 0.95, 1_000_000)
print(f"Parametric 95% VaR: {param_var['var_pct']:.2%} (${param_var['var_dollar']:,.0f})")
```

### Multi-Asset Parametric VaR

```python
def portfolio_parametric_var(weights: np.ndarray, returns_df: pd.DataFrame,
                              confidence_level: float = 0.95,
                              portfolio_value: float = 1_000_000) -> dict:
    """Calculate parametric VaR for a multi-asset portfolio.

    Args:
        weights: Portfolio weights
        returns_df: DataFrame of asset returns
        confidence_level: VaR confidence level
        portfolio_value: Portfolio value

    Returns:
        Portfolio VaR and component VaR
    """
    mean_returns = returns_df.mean().values
    cov_matrix = returns_df.cov().values

    # Portfolio statistics
    port_mean = np.dot(weights, mean_returns)
    port_var = np.dot(weights.T, np.dot(cov_matrix, weights))
    port_std = np.sqrt(port_var)

    z = norm.ppf(1 - confidence_level)
    var_pct = -(port_mean + z * port_std)
    var_dollar = var_pct * portfolio_value

    # Component VaR: how much each asset contributes to total VaR
    marginal_var = np.dot(cov_matrix, weights) / port_std * (-z)
    component_var = weights * marginal_var

    return {
        "portfolio_var_pct": var_pct,
        "portfolio_var_dollar": var_dollar,
        "component_var": component_var,
        "component_var_pct": component_var / var_pct,
        "marginal_var": marginal_var,
    }
```

## Monte Carlo VaR

Simulates many possible future scenarios using random sampling. Most flexible method.

```python
def monte_carlo_var(returns: pd.Series, confidence_level: float = 0.95,
                     portfolio_value: float = 1_000_000,
                     n_simulations: int = 100_000,
                     time_horizon: int = 1) -> dict:
    """Calculate VaR using Monte Carlo simulation.

    Args:
        returns: Historical returns for parameter estimation
        confidence_level: VaR confidence level
        portfolio_value: Portfolio value
        n_simulations: Number of simulation paths
        time_horizon: Number of days to simulate

    Returns:
        Monte Carlo VaR and ES
    """
    mu = returns.mean()
    sigma = returns.std()

    # Generate random scenarios
    np.random.seed(42)
    simulated_returns = np.random.normal(
        mu * time_horizon,
        sigma * np.sqrt(time_horizon),
        n_simulations,
    )

    # Calculate losses
    simulated_values = portfolio_value * (1 + simulated_returns)
    simulated_losses = portfolio_value - simulated_values

    # VaR and ES from simulated distribution
    var_dollar = np.percentile(simulated_losses, confidence_level * 100)
    var_pct = var_dollar / portfolio_value

    # ES: average of losses beyond VaR
    es_losses = simulated_losses[simulated_losses >= var_dollar]
    es_dollar = es_losses.mean() if len(es_losses) > 0 else var_dollar
    es_pct = es_dollar / portfolio_value

    return {
        "var_pct": var_pct,
        "var_dollar": var_dollar,
        "es_pct": es_pct,
        "es_dollar": es_dollar,
        "mean_simulated_return": simulated_returns.mean(),
        "simulations": n_simulations,
        "time_horizon_days": time_horizon,
    }

mc_var = monte_carlo_var(returns, 0.95, 1_000_000)
print(f"Monte Carlo 95% VaR: {mc_var['var_pct']:.2%} (${mc_var['var_dollar']:,.0f})")
print(f"Monte Carlo 95% ES:  {mc_var['es_pct']:.2%} (${mc_var['es_dollar']:,.0f})")
```

### Multi-Asset Monte Carlo VaR

```python
def multi_asset_mc_var(returns_df: pd.DataFrame, weights: np.ndarray,
                        confidence_level: float = 0.95,
                        portfolio_value: float = 1_000_000,
                        n_simulations: int = 50_000,
                        time_horizon: int = 1) -> dict:
    """Monte Carlo VaR for a multi-asset portfolio using Cholesky decomposition.

    Uses correlated random draws to maintain the correlation structure.
    """
    mean_returns = returns_df.mean().values * time_horizon
    cov_matrix = returns_df.cov().values * time_horizon

    # Cholesky decomposition for correlated random draws
    L = np.linalg.cholesky(cov_matrix)

    np.random.seed(42)
    n_assets = len(weights)
    Z = np.random.normal(0, 1, (n_simulations, n_assets))
    correlated_returns = Z @ L.T + mean_returns

    # Portfolio returns
    port_returns = correlated_returns @ weights
    port_losses = -port_returns * portfolio_value

    var_dollar = np.percentile(port_losses, confidence_level * 100)
    es_losses = port_losses[port_losses >= var_dollar]
    es_dollar = es_losses.mean() if len(es_losses) > 0 else var_dollar

    return {
        "var_pct": var_dollar / portfolio_value,
        "var_dollar": var_dollar,
        "es_pct": es_dollar / portfolio_value,
        "es_dollar": es_dollar,
    }
```

## Expected Shortfall (CVaR)

Expected Shortfall (also called Conditional VaR or CVaR) answers: "Given that we exceed VaR, what is the expected loss?" It is a more coherent risk measure than VaR.

```python
def expected_shortfall(returns: pd.Series, confidence_level: float = 0.95) -> float:
    """Calculate Expected Shortfall (CVaR).

    ES is the average of all losses beyond the VaR threshold.
    """
    var = -np.percentile(returns, (1 - confidence_level) * 100)
    tail_losses = returns[returns <= -var]
    return -tail_losses.mean() if len(tail_losses) > 0 else var

es = expected_shortfall(returns, 0.95)
print(f"95% Expected Shortfall: {es:.2%}")
```

### VaR vs ES Comparison

| Property                  | VaR                                        | Expected Shortfall                                |
| ------------------------- | ------------------------------------------ | ------------------------------------------------- |
| Question answered         | "What is the worst loss at X% confidence?" | "What is the average loss in the X% worst cases?" |
| Tail information          | No (only the boundary)                     | Yes (average of tail)                             |
| Subadditivity             | Not guaranteed                             | Guaranteed (coherent)                             |
| Regulatory use            | Basel II, internal models                  | Basel III, preferred                              |
| Sensitivity to tail shape | Low (single quantile)                      | High (uses full tail)                             |

## Time Horizon Scaling

```python
def scale_var(one_day_var: float, target_days: int,
              method: str = "sqrt") -> float:
    """Scale VaR to a different time horizon.

    Args:
        one_day_var: 1-day VaR
        target_days: Target horizon in days
        method: 'sqrt' (square root of time) or 'exact'

    Returns:
        Scaled VaR
    """
    if method == "sqrt":
        # Square root of time rule (assumes IID returns)
        return one_day_var * np.sqrt(target_days)
    else:
        raise ValueError("Only 'sqrt' method implemented")

# Scale 1-day VaR to 10-day (Basel regulatory standard)
var_1d = var_95["var_dollar"]
var_10d = scale_var(var_1d, 10)
print(f"1-day 95% VaR: ${var_1d:,.0f}")
print(f"10-day 95% VaR: ${var_10d:,.0f}")
```

## VaR Backtesting

Backtesting checks whether the VaR model produces the correct number of exceedances.

```python
def backtest_var(returns: pd.Series, confidence_level: float = 0.95,
                  window: int = 252, method: str = "historical") -> dict:
    """Backtest a VaR model using rolling windows.

    Args:
        returns: Full series of returns
        confidence_level: VaR confidence level
        window: Rolling estimation window
        method: 'historical' or 'parametric'

    Returns:
        Backtesting results including exception counts and Kupiec test
    """
    n_test = len(returns) - window
    exceedances = 0
    var_estimates = []

    for i in range(window, len(returns)):
        historical_window = returns.iloc[i - window : i]

        if method == "historical":
            var_pct = -np.percentile(historical_window, (1 - confidence_level) * 100)
        elif method == "parametric":
            mu = historical_window.mean()
            sigma = historical_window.std()
            z = norm.ppf(1 - confidence_level)
            var_pct = -(mu + z * sigma)

        actual_return = returns.iloc[i]
        is_exceedance = actual_return < -var_pct

        var_estimates.append({
            "date": returns.index[i],
            "var": var_pct,
            "actual_return": actual_return,
            "exceedance": is_exceedance,
        })

        if is_exceedance:
            exceedances += 1

    expected_exceedances = n_test * (1 - confidence_level)
    exceedance_rate = exceedances / n_test

    # Kupiec POF (Proportion of Failures) test
    p = 1 - confidence_level
    if exceedances > 0 and exceedances < n_test:
        lr_pof = -2 * (
            n_test * np.log(1 - p) + 0 * np.log(p) -  # Null hypothesis
            (n_test - exceedances) * np.log(1 - exceedances / n_test) -
            exceedances * np.log(exceedances / n_test)
        )
    else:
        lr_pof = 0

    from scipy.stats import chi2
    kupiec_pvalue = 1 - chi2.cdf(lr_pof, df=1) if lr_pof > 0 else 1.0

    return {
        "total_observations": n_test,
        "exceedances": exceedances,
        "expected_exceedances": expected_exceedances,
        "exceedance_rate": exceedance_rate,
        "expected_rate": 1 - confidence_level,
        "kupiec_lr": lr_pof,
        "kupiec_pvalue": kupiec_pvalue,
        "model_adequate": kupiec_pvalue > 0.05,
        "details": pd.DataFrame(var_estimates),
    }

bt = backtest_var(returns, 0.95, window=252, method="historical")
print(f"VaR Backtest Results:")
print(f"  Exceedances: {bt['exceedances']} (expected: {bt['expected_exceedances']:.0f})")
print(f"  Exceedance rate: {bt['exceedance_rate']:.2%} (expected: {bt['expected_rate']:.0%})")
print(f"  Kupiec p-value: {bt['kupiec_pvalue']:.4f}")
print(f"  Model adequate: {bt['model_adequate']}")
```

### Backtest Visualization

```python
import matplotlib.pyplot as plt

def plot_var_backtest(backtest_result: dict):
    """Visualize VaR backtest results."""
    df = backtest_result["details"]

    fig, ax = plt.subplots(figsize=(14, 7))

    ax.plot(df["date"], df["actual_return"] * 100, linewidth=0.5, color="gray",
            label="Actual Returns", alpha=0.7)
    ax.plot(df["date"], -df["var"] * 100, linewidth=1, color="red",
            label="VaR Threshold")

    # Highlight exceedances
    exc = df[df["exceedance"]]
    ax.scatter(exc["date"], exc["actual_return"] * 100, color="red", s=20,
               zorder=5, label=f"Exceedances ({len(exc)})")

    ax.set_xlabel("Date")
    ax.set_ylabel("Return (%)")
    ax.set_title("VaR Backtest")
    ax.legend()
    ax.grid(True, alpha=0.3)
    return fig, ax
```

## Method Comparison

```python
def compare_var_methods(returns: pd.Series, portfolio_value: float = 1_000_000):
    """Compare all three VaR methods side by side."""
    hist = historical_var(returns, 0.95, portfolio_value)
    param = parametric_var(returns, 0.95, portfolio_value)
    mc = monte_carlo_var(returns, 0.95, portfolio_value)

    print(f"{'Method':<15} {'VaR ($)':>12} {'VaR (%)':>10} {'ES ($)':>12} {'ES (%)':>10}")
    print("-" * 60)
    for name, r in [("Historical", hist), ("Parametric", param), ("Monte Carlo", mc)]:
        print(f"{name:<15} ${r['var_dollar']:>10,.0f} {r['var_pct']:>9.2%} "
              f"${r['es_dollar']:>10,.0f} {r['es_pct']:>9.2%}")

compare_var_methods(returns)
```

## Common Pitfalls

1. **VaR does not measure tail risk**: VaR tells you the boundary of the loss but nothing about how bad losses can be beyond that point. Always report Expected Shortfall alongside VaR.

2. **Square root of time rule assumes IID returns**: Financial returns exhibit volatility clustering (ARCH effects). The sqrt(T) scaling overstates VaR in low-volatility periods and understates it in high-volatility periods.

3. **Parametric VaR underestimates tail risk**: Financial returns are fat-tailed, not normal. Historical or Monte Carlo methods capture this better. Use Student's t-distribution for better tail modeling.

4. **Lookback period bias**: Short windows are too responsive to recent events. Long windows may include irrelevant regimes. Common choices: 252 days (1 year) or 504 days (2 years).

5. **Treating VaR as a maximum loss**: VaR is a probabilistic statement, not a cap. At 95% confidence, you should expect to exceed VaR about once every 20 trading days.

6. **VaR is not subadditive**: The VaR of a combined portfolio can exceed the sum of individual VaRs. This violates a basic axiom of coherent risk measures. ES does not have this problem.

## Cross-References

- **[stress-testing](stress-testing.md)** - Complementary scenario-based risk assessment
- **[hedging-strategies](hedging-strategies.md)** - Reducing VaR through hedging
- **[options-greeks](options-greeks.md)** - Risk management for options portfolios
- **[03-portfolio-theory/mpt-basics](../03-portfolio-theory/mpt-basics.md)** - Portfolio risk fundamentals
- **[03-portfolio-theory/portfolio-optimization](../03-portfolio-theory/portfolio-optimization.md)** - VaR-constrained optimization
