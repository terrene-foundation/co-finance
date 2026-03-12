---
name: template-workflow-basic
description: "Basic financial analysis script template with data loading, returns calculation, risk metrics, and visualization. Use when requesting 'analysis template', 'analysis script', 'starter code', 'financial analysis boilerplate', or 'create analysis from scratch'."
---

# Basic Financial Analysis Template

Ready-to-use financial analysis script with data loading, returns calculation, risk metrics, and optional visualization.

> **Skill Metadata**
> Category: `cross-cutting` (code-generation)
> Priority: `CRITICAL`

## Quick Start Template

Copy this template to start any financial analysis:

```python
"""
Basic Financial Analysis Script
Replace placeholders with your specific data and parameters.
"""

import pandas as pd
import numpy as np
import numpy_financial as npf
from pathlib import Path

def load_and_validate(file_path: str) -> pd.DataFrame:
    """Load OHLCV data from CSV, validate, and return clean DataFrame."""
    df = pd.read_csv(file_path, parse_dates=["date"])

    # Normalize column names
    df.columns = df.columns.str.lower().str.strip()

    # Validate required columns
    required = {"date", "open", "high", "low", "close", "volume"}
    missing = required - set(df.columns)
    if missing:
        raise ValueError(f"Missing columns: {missing}")

    # Sort and deduplicate
    df = df.sort_values("date").drop_duplicates(subset=["date"], keep="last")

    # Quality checks
    assert df["close"].gt(0).all(), "Negative or zero prices found"
    assert (df["high"] >= df["low"]).all(), "High < Low detected"

    return df.reset_index(drop=True)


def calculate_returns(prices: pd.Series) -> pd.Series:
    """Calculate daily simple returns from price series."""
    returns = prices.pct_change().dropna()
    return returns


def risk_metrics(returns: pd.Series, risk_free_rate: float = 0.04) -> dict:
    """Calculate common risk metrics from a return series.

    Args:
        returns: Daily return series
        risk_free_rate: Annual risk-free rate (default 4%)

    Returns:
        Dictionary of risk metrics
    """
    rf_daily = risk_free_rate / 252

    ann_return = (1 + returns.mean()) ** 252 - 1
    ann_vol = returns.std(ddof=1) * np.sqrt(252)

    excess = returns - rf_daily
    sharpe = np.mean(excess) / np.std(excess, ddof=1) * np.sqrt(252)

    # Max drawdown
    cumulative = (1 + returns).cumprod()
    peak = cumulative.cummax()
    drawdown = (cumulative - peak) / peak
    max_dd = drawdown.min()

    # Value at Risk (95%)
    var_95 = np.percentile(returns, 5)

    return {
        "annualized_return": ann_return,
        "annualized_volatility": ann_vol,
        "sharpe_ratio": sharpe,
        "max_drawdown": max_dd,
        "var_95": var_95,
        "total_observations": len(returns),
    }


def print_report(metrics: dict, symbol: str = "Portfolio") -> None:
    """Print a formatted risk metrics report."""
    print(f"\n{'=' * 50}")
    print(f"  Risk Report: {symbol}")
    print(f"{'=' * 50}")
    print(f"  Annualized Return:     {metrics['annualized_return']:>10.2%}")
    print(f"  Annualized Volatility: {metrics['annualized_volatility']:>10.2%}")
    print(f"  Sharpe Ratio:          {metrics['sharpe_ratio']:>10.2f}")
    print(f"  Max Drawdown:          {metrics['max_drawdown']:>10.2%}")
    print(f"  VaR (95%):             {metrics['var_95']:>10.4f}")
    print(f"  Observations:          {metrics['total_observations']:>10d}")
    print(f"{'=' * 50}")
    print()
    print("  DISCLAIMER: For educational purposes only.")
    print("  Not investment advice. Past performance does")
    print("  not guarantee future results.")
    print()


def main():
    """Run the analysis pipeline."""
    # 1. Load data
    df = load_and_validate("data/AAPL.csv")
    print(f"Loaded {len(df)} rows")

    # 2. Calculate returns
    returns = calculate_returns(df["close"])

    # 3. Compute risk metrics
    metrics = risk_metrics(returns)

    # 4. Print report
    print_report(metrics, symbol="AAPL")

    return metrics


if __name__ == "__main__":
    main()
```

## Template Variations

### Multi-Asset Comparison

```python
"""Compare risk metrics across multiple assets."""

import pandas as pd
import numpy as np

def compare_assets(file_paths: dict[str, str]) -> pd.DataFrame:
    """Load multiple assets and compare risk metrics.

    Args:
        file_paths: Mapping of symbol -> CSV file path

    Returns:
        DataFrame with risk metrics per asset
    """
    results = []

    for symbol, path in file_paths.items():
        df = pd.read_csv(path, parse_dates=["date"])
        df.columns = df.columns.str.lower().str.strip()
        returns = df["close"].pct_change().dropna()
        metrics = risk_metrics(returns)
        metrics["symbol"] = symbol
        results.append(metrics)

    summary = pd.DataFrame(results).set_index("symbol")
    summary = summary.sort_values("sharpe_ratio", ascending=False)
    return summary


if __name__ == "__main__":
    assets = {
        "AAPL": "data/AAPL.csv",
        "MSFT": "data/MSFT.csv",
        "GOOG": "data/GOOG.csv",
    }
    summary = compare_assets(assets)
    print(summary.to_string(float_format=lambda x: f"{x:.4f}"))
```

### Synthetic Data for Testing

```python
"""Generate synthetic price data for development and testing."""

import pandas as pd
import numpy as np

def generate_synthetic_prices(
    symbol: str = "TEST",
    start_date: str = "2022-01-03",
    periods: int = 504,
    annual_return: float = 0.08,
    annual_vol: float = 0.20,
    seed: int = 42,
) -> pd.DataFrame:
    """Generate synthetic OHLCV data using geometric Brownian motion.

    Args:
        symbol: Ticker symbol
        start_date: Start date (YYYY-MM-DD)
        periods: Number of trading days
        annual_return: Expected annual return
        annual_vol: Annual volatility
        seed: Random seed for reproducibility

    Returns:
        DataFrame with date, open, high, low, close, volume
    """
    np.random.seed(seed)

    daily_return = annual_return / 252
    daily_vol = annual_vol / np.sqrt(252)

    dates = pd.bdate_range(start_date, periods=periods)
    log_returns = np.random.normal(daily_return, daily_vol, periods)
    close = 100 * np.exp(np.cumsum(log_returns))

    df = pd.DataFrame({
        "date": dates,
        "open": close * (1 + np.random.uniform(-0.005, 0.005, periods)),
        "high": close * (1 + np.abs(np.random.normal(0, 0.008, periods))),
        "low": close * (1 - np.abs(np.random.normal(0, 0.008, periods))),
        "close": close,
        "volume": np.random.randint(500_000, 5_000_000, periods),
    })

    return df


if __name__ == "__main__":
    df = generate_synthetic_prices()
    df.to_csv("data/TEST.csv", index=False)
    print(f"Generated {len(df)} rows of synthetic data")
    print(df.head())
```

### With Visualization

```python
"""Financial analysis with matplotlib/mplfinance visualization."""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

def plot_performance(df: pd.DataFrame, symbol: str = "Asset") -> None:
    """Plot price and drawdown chart.

    Args:
        df: DataFrame with date and close columns
        symbol: Asset name for title
    """
    fig, axes = plt.subplots(2, 1, figsize=(12, 8), sharex=True)

    # Price chart
    axes[0].plot(df["date"], df["close"], linewidth=1)
    axes[0].set_title(f"{symbol} Price")
    axes[0].set_ylabel("Price ($)")
    axes[0].grid(True, alpha=0.3)

    # Drawdown chart
    returns = df["close"].pct_change().dropna()
    cumulative = (1 + returns).cumprod()
    peak = cumulative.cummax()
    drawdown = (cumulative - peak) / peak

    axes[1].fill_between(
        df["date"].iloc[1:], drawdown.values, 0,
        alpha=0.3, color="red"
    )
    axes[1].set_title(f"{symbol} Drawdown")
    axes[1].set_ylabel("Drawdown (%)")
    axes[1].grid(True, alpha=0.3)

    plt.tight_layout()
    plt.savefig(f"output/{symbol}_performance.png", dpi=150)
    plt.close()
    print(f"Chart saved to output/{symbol}_performance.png")
```

## Customization Guide

### Step 1: Choose Your Data Source

| Source        | How                 | Example                                  |
| ------------- | ------------------- | ---------------------------------------- |
| **Local CSV** | `pd.read_csv()`     | `pd.read_csv("data/AAPL.csv")`           |
| **Parquet**   | `pd.read_parquet()` | `pd.read_parquet("data/prices.parquet")` |
| **SQLite**    | `pd.read_sql()`     | `pd.read_sql("SELECT...", conn)`         |
| **API**       | `requests.get()`    | See data pipeline template               |

### Step 2: Select Your Metrics

| Metric           | Function                                 | When                      |
| ---------------- | ---------------------------------------- | ------------------------- |
| **Returns**      | `pct_change()`                           | Always                    |
| **Volatility**   | `std() * sqrt(252)`                      | Risk assessment           |
| **Sharpe**       | `mean(excess) / std(excess) * sqrt(252)` | Risk-adjusted performance |
| **Max Drawdown** | `(cum - peak) / peak`                    | Downside risk             |
| **VaR**          | `percentile(returns, 5)`                 | Tail risk                 |

### Step 3: Add Output

| Output      | Library          | Use             |
| ----------- | ---------------- | --------------- |
| **Console** | `print()`        | Quick checks    |
| **CSV**     | `df.to_csv()`    | Data export     |
| **Chart**   | `matplotlib`     | Visual analysis |
| **Report**  | `print_report()` | Summary         |

## Quick Tips

- Start with the main template, then customize
- Always validate data before calculations
- Use `np.random.seed(42)` for reproducible synthetic data
- Include disclaimers in any output
- Use functions for each step (load, calculate, report)
- Keep file I/O separate from calculation logic

<!-- Trigger Keywords: analysis template, analysis script, starter code, financial analysis boilerplate, create analysis from scratch, analysis skeleton, basic analysis, portfolio analysis template, risk analysis script -->
