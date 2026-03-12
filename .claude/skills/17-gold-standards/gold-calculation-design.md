---
name: gold-calculation-design
description: "Calculation pipeline design standards for financial Python code including the Load-Validate-Calculate-Report pattern, single responsibility, named constants, and input validation. Use when asking 'calculation design', 'pipeline design', 'analysis workflow', 'calculation pattern', or 'single responsibility'."
---

# Gold Standard: Calculation Design

> **Skill Metadata**
> Category: `gold-standards`
> Priority: `HIGH`

## Core Rules

1. Follow Load -> Validate -> Calculate -> Report pipeline
2. Single responsibility per function
3. Validate inputs before processing
4. Use named constants (no magic numbers)
5. Separate data loading from calculation logic

## The Load-Validate-Calculate-Report Pattern

```python
import pandas as pd
import numpy as np
import logging

logger = logging.getLogger(__name__)

TRADING_DAYS_PER_YEAR = 252


def main(file_path: str, symbol: str) -> dict:
    """Run complete financial analysis pipeline.

    Pipeline: Load -> Validate -> Calculate -> Report
    """
    # Step 1: LOAD
    df = load_prices(file_path)

    # Step 2: VALIDATE
    validate_price_data(df, symbol)

    # Step 3: CALCULATE
    returns = calculate_returns(df["close"])
    metrics = calculate_risk_metrics(returns)

    # Step 4: REPORT
    report = format_report(metrics, symbol)
    print_report(report)
    return report
```

## Single Responsibility

```python
# CORRECT: Each function does ONE thing

def load_prices(file_path: str) -> pd.DataFrame:
    """Load price data from CSV file."""
    df = pd.read_csv(file_path, parse_dates=["date"])
    df = df.sort_values("date").reset_index(drop=True)
    return df


def validate_price_data(df: pd.DataFrame, symbol: str) -> None:
    """Validate price data quality. Raises on failure."""
    if df.empty:
        raise ValueError(f"{symbol}: Empty DataFrame")
    if (df["close"] <= 0).any():
        raise ValueError(f"{symbol}: Non-positive prices found")
    if df["close"].isna().any():
        raise ValueError(f"{symbol}: NaN prices found")


def calculate_returns(prices: pd.Series) -> pd.Series:
    """Calculate daily simple returns from prices."""
    return prices.pct_change().dropna()


def calculate_risk_metrics(
    returns: pd.Series,
    risk_free_rate: float = 0.04,
) -> dict:
    """Calculate risk metrics from daily returns."""
    daily_rf = (1 + risk_free_rate) ** (1 / TRADING_DAYS_PER_YEAR) - 1
    excess = returns - daily_rf

    return {
        "sharpe_ratio": float(
            excess.mean() / excess.std() * np.sqrt(TRADING_DAYS_PER_YEAR)
        ),
        "annualized_volatility": float(
            returns.std() * np.sqrt(TRADING_DAYS_PER_YEAR)
        ),
        "max_drawdown": float(
            ((1 + returns).cumprod() / (1 + returns).cumprod().cummax() - 1).min()
        ),
        "total_return": float((1 + returns).prod() - 1),
        "observations": len(returns),
    }


def format_report(metrics: dict, symbol: str) -> dict:
    """Format metrics into a report with disclaimer."""
    return {
        "symbol": symbol,
        **metrics,
        "disclaimer": (
            "For educational purposes only. Not investment advice. "
            "Past performance does not guarantee future results."
        ),
    }
```

## Anti-Patterns

```python
# WRONG: God function that does everything
def analyze(file_path):
    df = pd.read_csv(file_path)  # Load
    if df.empty:                   # Validate
        return None
    returns = df["close"].pct_change().dropna()  # Calculate
    sharpe = returns.mean() / returns.std() * 252**0.5  # Magic number!
    print(f"Sharpe: {sharpe}")  # Report (mixed with calculation)
    return sharpe

# WRONG: Calculation depends on file format
def calculate_sharpe(file_path):  # Takes file path, not data!
    df = pd.read_csv(file_path)   # Coupled to CSV format
    returns = df["close"].pct_change()
    return returns.mean() / returns.std()

# WRONG: Side effects in calculation
def risk_metrics(returns):
    vol = returns.std() * np.sqrt(252)
    print(f"Volatility: {vol}")  # Side effect!
    save_to_database(vol)         # Side effect!
    return vol
```

## Named Constants

```python
# CORRECT: Named constants with source
TRADING_DAYS_PER_YEAR = 252        # NYSE average
MONTHS_PER_YEAR = 12
RISK_FREE_RATE_DEFAULT = 0.04      # From .env in production

# Day count conventions
ACT_360 = 360   # Money market
ACT_365 = 365   # UK gilts
THIRTY_360 = 360 # US corporate bonds

# Annualize daily volatility
annual_vol = daily_vol * np.sqrt(TRADING_DAYS_PER_YEAR)

# WRONG: Magic numbers
# annual_vol = daily_vol * np.sqrt(252)
# monthly_vol = daily_vol * np.sqrt(21)
# rate = returns.mean() * 252
```

## Composable Design

```python
# Functions compose cleanly because each takes data and returns data

# Compose for single stock
prices = load_prices("AAPL.csv")
validate_price_data(prices, "AAPL")
returns = calculate_returns(prices["close"])
metrics = calculate_risk_metrics(returns)

# Compose for multiple stocks
for symbol in ["AAPL", "GOOGL", "MSFT"]:
    prices = load_prices(f"{symbol}.csv")
    validate_price_data(prices, symbol)
    returns = calculate_returns(prices["close"])
    all_metrics[symbol] = calculate_risk_metrics(returns)

# Compose with different data sources
prices = load_from_api("AAPL")  # Same validate/calculate/report works
validate_price_data(prices, "AAPL")
returns = calculate_returns(prices["close"])
```

## Checklist

- [ ] Pipeline follows Load -> Validate -> Calculate -> Report
- [ ] Each function has single responsibility
- [ ] Calculation functions take data, not file paths
- [ ] No side effects in calculation functions
- [ ] Named constants for all magic numbers
- [ ] Input validation in dedicated validate step
- [ ] Functions compose cleanly (data in, data out)
- [ ] Logging in appropriate places (not print)
- [ ] Disclaimer included in report output
- [ ] Error handling at pipeline level, not in each function

<!-- Trigger Keywords: calculation design, pipeline design, analysis workflow, calculation pattern, single responsibility, Load Validate Calculate Report -->
