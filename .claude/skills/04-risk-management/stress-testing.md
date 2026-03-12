---
name: stress-testing
description: "Stress testing reference covering scenario analysis, historical stress tests, sensitivity analysis, and reverse stress testing. Use when asking about 'stress testing', 'scenario analysis', 'historical stress test', 'GFC', '2008 crisis', 'COVID crash', 'dot-com bubble', 'sensitivity analysis', 'reverse stress test', 'extreme events', 'tail risk scenarios', or 'crisis simulation'."
---

# Stress Testing

Reference for stress testing and scenario analysis frameworks with Python implementations.

## Concept

Stress testing evaluates portfolio performance under extreme but plausible scenarios. Unlike VaR, which uses statistical probability, stress testing asks: "What happens if a specific event occurs?"

## Historical Stress Scenarios

### Major Market Crises

| Event                   | Period       | S&P 500 Drawdown | Duration   | Key Characteristics                   |
| ----------------------- | ------------ | ---------------- | ---------- | ------------------------------------- |
| Dot-Com Crash           | 2000-2002    | -49%             | ~30 months | Tech sector collapse, slow grind      |
| Global Financial Crisis | 2007-2009    | -57%             | ~17 months | Credit crisis, systemic risk          |
| COVID-19 Crash          | Feb-Mar 2020 | -34%             | ~1 month   | Fastest bear market in history        |
| 2022 Rate Shock         | Jan-Oct 2022 | -25%             | ~10 months | Inflation, rate hikes, bonds fell too |

### Implementing Historical Stress Tests

```python
import numpy as np
import pandas as pd
import yfinance as yf

# Define historical stress periods
STRESS_SCENARIOS = {
    "dot_com_crash": {
        "name": "Dot-Com Crash",
        "start": "2000-03-10",
        "end": "2002-10-09",
        "description": "Technology bubble burst",
    },
    "gfc_2008": {
        "name": "Global Financial Crisis",
        "start": "2007-10-09",
        "end": "2009-03-09",
        "description": "Credit crisis and banking collapse",
    },
    "covid_crash": {
        "name": "COVID-19 Crash",
        "start": "2020-02-19",
        "end": "2020-03-23",
        "description": "Pandemic-driven market crash",
    },
    "rate_shock_2022": {
        "name": "2022 Rate Shock",
        "start": "2022-01-03",
        "end": "2022-10-12",
        "description": "Inflation and aggressive rate hikes",
    },
    "black_monday_2020": {
        "name": "Black Monday 2020",
        "start": "2020-03-09",
        "end": "2020-03-16",
        "description": "Worst single week since 2008",
    },
}

def historical_stress_test(tickers: list, weights: np.ndarray,
                            portfolio_value: float = 1_000_000,
                            scenarios: dict = None) -> pd.DataFrame:
    """Run historical stress tests on a portfolio.

    Args:
        tickers: List of portfolio asset tickers
        weights: Portfolio weights
        portfolio_value: Current portfolio value
        scenarios: Custom scenarios dict (default: built-in crises)

    Returns:
        DataFrame with portfolio impact for each scenario
    """
    if scenarios is None:
        scenarios = STRESS_SCENARIOS

    # Download data covering all scenarios
    data = yf.download(tickers, start="2000-01-01", auto_adjust=True)["Close"]

    results = []
    for key, scenario in scenarios.items():
        start = scenario["start"]
        end = scenario["end"]

        try:
            period_data = data.loc[start:end]
            if len(period_data) < 2:
                continue

            # Calculate return for each asset over the stress period
            asset_returns = (period_data.iloc[-1] / period_data.iloc[0]) - 1

            # Portfolio return
            port_return = np.dot(weights, asset_returns.values)
            port_loss = port_return * portfolio_value

            results.append({
                "scenario": scenario["name"],
                "period": f"{start} to {end}",
                "description": scenario["description"],
                "portfolio_return": port_return,
                "portfolio_loss": port_loss,
                **{f"{t}_return": asset_returns.get(t, np.nan) for t in tickers},
            })
        except Exception:
            continue

    return pd.DataFrame(results)

# Example
tickers = ["SPY", "TLT", "GLD", "VNQ"]
weights = np.array([0.50, 0.25, 0.15, 0.10])

stress_results = historical_stress_test(tickers, weights, 1_000_000)
print("Historical Stress Test Results:")
print(f"{'Scenario':<25} {'Portfolio':>10} {'Loss ($)':>12}")
print("-" * 50)
for _, row in stress_results.iterrows():
    print(f"{row['scenario']:<25} {row['portfolio_return']:>9.1%} "
          f"${row['portfolio_loss']:>10,.0f}")
```

## Hypothetical Scenario Analysis

### Defining Custom Scenarios

```python
def create_scenario(name: str, asset_shocks: dict, description: str = "") -> dict:
    """Create a hypothetical stress scenario.

    Args:
        name: Scenario name
        asset_shocks: Dict mapping ticker to return shock
        description: Scenario description

    Returns:
        Scenario dictionary
    """
    return {
        "name": name,
        "shocks": asset_shocks,
        "description": description,
    }

def apply_scenario(weights: np.ndarray, tickers: list,
                     scenario: dict,
                     portfolio_value: float = 1_000_000) -> dict:
    """Apply a hypothetical scenario to a portfolio.

    Args:
        weights: Portfolio weights
        tickers: Asset tickers
        scenario: Scenario with 'shocks' dict
        portfolio_value: Current portfolio value

    Returns:
        Impact assessment
    """
    shocks = np.array([scenario["shocks"].get(t, 0.0) for t in tickers])
    port_return = np.dot(weights, shocks)

    return {
        "scenario": scenario["name"],
        "description": scenario["description"],
        "portfolio_return": port_return,
        "portfolio_loss": port_return * portfolio_value,
        "asset_impacts": {t: s for t, s in zip(tickers, shocks)},
        "contribution": {t: w * s for t, w, s in zip(tickers, weights, shocks)},
    }

# Define hypothetical scenarios
scenarios = [
    create_scenario(
        "Severe Recession",
        {"SPY": -0.35, "TLT": 0.15, "GLD": 0.10, "VNQ": -0.40},
        "Deep recession with flight to safety",
    ),
    create_scenario(
        "Inflation Spike",
        {"SPY": -0.15, "TLT": -0.20, "GLD": 0.20, "VNQ": -0.10},
        "Unexpected inflation surge, rates rise sharply",
    ),
    create_scenario(
        "Geopolitical Crisis",
        {"SPY": -0.20, "TLT": 0.10, "GLD": 0.25, "VNQ": -0.15},
        "Major geopolitical conflict disrupts markets",
    ),
    create_scenario(
        "Tech Sector Crash",
        {"SPY": -0.25, "TLT": 0.05, "GLD": 0.05, "VNQ": -0.10},
        "Technology sector correction drives broad sell-off",
    ),
    create_scenario(
        "Stagflation",
        {"SPY": -0.20, "TLT": -0.15, "GLD": 0.15, "VNQ": -0.25},
        "Rising prices with stagnant growth -- bonds and stocks fall together",
    ),
]

print("Hypothetical Scenario Analysis:")
for scenario in scenarios:
    result = apply_scenario(weights, tickers, scenario)
    print(f"\n{result['scenario']}: {result['description']}")
    print(f"  Portfolio impact: {result['portfolio_return']:.1%} (${result['portfolio_loss']:,.0f})")
    for t, c in result["contribution"].items():
        print(f"    {t}: {c:.1%} contribution")
```

## Sensitivity Analysis

### Single-Factor Sensitivity

```python
def sensitivity_analysis(weights: np.ndarray, tickers: list,
                          target_asset: str,
                          shock_range: np.ndarray = None,
                          portfolio_value: float = 1_000_000) -> pd.DataFrame:
    """Analyze portfolio sensitivity to a single asset's return.

    Args:
        weights: Portfolio weights
        tickers: Asset tickers
        target_asset: The asset to shock
        shock_range: Range of shocks to test
        portfolio_value: Portfolio value

    Returns:
        DataFrame with sensitivity results
    """
    if shock_range is None:
        shock_range = np.linspace(-0.30, 0.30, 13)

    target_idx = tickers.index(target_asset)
    target_weight = weights[target_idx]

    results = []
    for shock in shock_range:
        port_impact = target_weight * shock
        results.append({
            "shock": shock,
            "portfolio_impact": port_impact,
            "portfolio_loss": port_impact * portfolio_value,
        })

    return pd.DataFrame(results)

sens = sensitivity_analysis(weights, tickers, "SPY")
print(f"Sensitivity to SPY (weight: {weights[0]:.0%}):")
for _, row in sens.iterrows():
    print(f"  SPY {row['shock']:+.0%} -> Portfolio {row['portfolio_impact']:+.1%} "
          f"(${row['portfolio_loss']:+,.0f})")
```

### Multi-Factor Sensitivity (Heatmap)

```python
import matplotlib.pyplot as plt

def two_factor_sensitivity(weights: np.ndarray, tickers: list,
                            asset1: str, asset2: str,
                            shock_range: np.ndarray = None,
                            portfolio_value: float = 1_000_000) -> pd.DataFrame:
    """Two-factor sensitivity heatmap.

    Args:
        weights: Portfolio weights
        tickers: Asset tickers
        asset1, asset2: Assets to vary
        shock_range: Range of shocks

    Returns:
        DataFrame suitable for heatmap plotting
    """
    if shock_range is None:
        shock_range = np.linspace(-0.30, 0.30, 7)

    idx1 = tickers.index(asset1)
    idx2 = tickers.index(asset2)

    results = np.zeros((len(shock_range), len(shock_range)))

    for i, s1 in enumerate(shock_range):
        for j, s2 in enumerate(shock_range):
            impact = weights[idx1] * s1 + weights[idx2] * s2
            results[i, j] = impact * portfolio_value

    df = pd.DataFrame(
        results,
        index=[f"{s:.0%}" for s in shock_range],
        columns=[f"{s:.0%}" for s in shock_range],
    )
    df.index.name = asset1
    df.columns.name = asset2

    return df

heatmap_data = two_factor_sensitivity(weights, tickers, "SPY", "TLT")

fig, ax = plt.subplots(figsize=(10, 8))
import seaborn as sns
sns.heatmap(heatmap_data, annot=True, fmt=",.0f", cmap="RdYlGn_r",
            center=0, ax=ax)
ax.set_title("Portfolio P&L: SPY vs TLT Shocks")
plt.tight_layout()
plt.savefig("sensitivity_heatmap.png", dpi=150)
plt.close()
```

## Reverse Stress Testing

Reverse stress testing starts from a specific loss and works backward to find which scenarios produce that loss.

```python
from scipy.optimize import minimize

def reverse_stress_test(weights: np.ndarray, cov_matrix: np.ndarray,
                         target_loss_pct: float = -0.20,
                         n_assets: int = None) -> dict:
    """Find the most likely scenario producing a specific loss.

    Finds the minimum Mahalanobis distance return vector
    that produces the target portfolio loss.

    Args:
        weights: Portfolio weights
        cov_matrix: Annualized covariance matrix
        target_loss_pct: Target portfolio loss (negative)
        n_assets: Number of assets

    Returns:
        Most likely scenario producing the target loss
    """
    if n_assets is None:
        n_assets = len(weights)

    inv_cov = np.linalg.inv(cov_matrix)

    def objective(returns):
        """Minimize Mahalanobis distance (most likely under MVN)."""
        return returns.T @ inv_cov @ returns

    constraints = [
        {"type": "eq", "fun": lambda r: np.dot(weights, r) - target_loss_pct},
    ]

    result = minimize(
        objective,
        np.ones(n_assets) * target_loss_pct,
        method="SLSQP",
        constraints=constraints,
    )

    return {
        "target_loss": target_loss_pct,
        "scenario_returns": result.x,
        "mahalanobis_distance": np.sqrt(result.fun),
        "portfolio_return": np.dot(weights, result.x),
    }

# What scenario most likely produces a 20% portfolio loss?
returns_df = yf.download(tickers, period="5y", auto_adjust=True)["Close"].pct_change().dropna()
cov = returns_df.cov().values * 252

rst = reverse_stress_test(weights, cov, target_loss_pct=-0.20)
print("Reverse Stress Test: Most likely scenario for 20% portfolio loss:")
for i, t in enumerate(tickers):
    print(f"  {t}: {rst['scenario_returns'][i]:.1%}")
print(f"Mahalanobis distance: {rst['mahalanobis_distance']:.2f}")
```

## Comprehensive Stress Report

```python
def stress_report(tickers: list, weights: np.ndarray,
                   portfolio_value: float = 1_000_000) -> None:
    """Generate a comprehensive stress testing report."""
    print("=" * 60)
    print("STRESS TESTING REPORT")
    print("=" * 60)

    print(f"\nPortfolio: ${portfolio_value:,.0f}")
    for i, t in enumerate(tickers):
        print(f"  {t}: {weights[i]:.0%}")

    # Historical stress tests
    print("\n--- Historical Stress Tests ---")
    hist_results = historical_stress_test(tickers, weights, portfolio_value)
    for _, row in hist_results.iterrows():
        print(f"  {row['scenario']}: {row['portfolio_return']:.1%} "
              f"(${row['portfolio_loss']:+,.0f})")

    # Worst-case from history
    if len(hist_results) > 0:
        worst = hist_results.loc[hist_results["portfolio_return"].idxmin()]
        print(f"\n  Worst historical: {worst['scenario']} ({worst['portfolio_return']:.1%})")

    print("\n--- Sensitivity Summary ---")
    for t in tickers:
        idx = tickers.index(t)
        impact_10pct = weights[idx] * (-0.10) * portfolio_value
        print(f"  {t} -10%: ${impact_10pct:+,.0f} portfolio impact")

stress_report(tickers, weights)
```

## Common Pitfalls

1. **Testing only historical crises**: Past crises may not resemble future ones. Always include hypothetical scenarios that capture novel risk factors.

2. **Ignoring correlation changes during stress**: Correlations increase during market crises ("correlation goes to 1 in a crisis"). Use stressed correlations, not normal-period correlations.

3. **Not testing bond-equity correlation flip**: In 2022, bonds and equities fell together, breaking the negative correlation that 60/40 portfolios rely on. Test scenarios where traditional diversifiers fail.

4. **Linear approximation errors**: For portfolios with options, linear stress testing (applying percentage shocks) misses the nonlinear payoff effects. Use full revaluation for derivative positions.

5. **Survivorship bias in historical tests**: Testing on assets that still exist today ignores those that went bankrupt. Lehman Brothers, Bear Stearns, and Enron are missing from current datasets.

6. **Treating stress results as probabilities**: Stress tests show impact, not likelihood. A scenario producing a 50% loss may be extremely unlikely, but it is important to understand the exposure.

## Cross-References

- **[var-methods](var-methods.md)** - Statistical risk measures that complement stress testing
- **[hedging-strategies](hedging-strategies.md)** - Hedging strategies to mitigate stressed scenarios
- **[03-portfolio-theory/mpt-basics](../03-portfolio-theory/mpt-basics.md)** - Portfolio risk fundamentals
- **[01-financial-instruments/derivatives](../01-financial-instruments/derivatives.md)** - Options for tail risk hedging
- **[05-financial-data-apis/fred-guide](../05-financial-data-apis/fred-guide.md)** - Economic data for macro stress scenarios
