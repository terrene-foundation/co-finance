---
name: gold-documentation
description: "Gold standard for documentation. Use when asking 'documentation standard', 'how to document', or 'docs best practices'."
---

# Gold Standard: Documentation

> **Skill Metadata**
> Category: `gold-standards`
> Priority: `MEDIUM`

## Documentation Principles

### 1. Code-Level Documentation

```python
def calculate_sharpe_ratio(
    returns: pd.Series,
    risk_free_rate: float = 0.04,
    periods_per_year: int = 252,
) -> float:
    """Calculate the annualized Sharpe ratio.

    Uses the standard formula: (mean_excess_return / std_excess_return) * sqrt(N)
    where N is the number of periods per year.

    Args:
        returns: Daily return series (simple returns, not log returns)
        risk_free_rate: Annual risk-free rate as decimal (e.g., 0.04 for 4%)
        periods_per_year: Trading days per year (252 for daily data)

    Returns:
        Annualized Sharpe ratio as float

    Raises:
        ValueError: If returns has fewer than 2 observations
        ValueError: If risk_free_rate is negative

    Example:
        >>> returns = pd.Series([0.01, -0.005, 0.02, -0.01, 0.015])
        >>> sharpe = calculate_sharpe_ratio(returns)
        >>> print(f"Sharpe: {sharpe:.2f}")
    """
    if len(returns) < 2:
        raise ValueError("Need at least 2 return observations")

    rf_daily = risk_free_rate / periods_per_year
    excess = returns - rf_daily
    return float(np.mean(excess) / np.std(excess, ddof=1) * np.sqrt(periods_per_year))
```

### 2. Analysis Pipeline Documentation

```python
# Analysis pipeline: Load -> Validate -> Calculate -> Report
#
# Step 1: Load and validate OHLCV data from CSV
df = load_and_validate("data/AAPL.csv")

# Step 2: Calculate daily returns
returns = df["close"].pct_change().dropna()

# Step 3: Compute risk metrics (Sharpe, VaR, max drawdown)
metrics = calculate_risk_metrics(returns, risk_free_rate=0.04)

# Step 4: Generate report with required disclaimer
print_report(metrics, symbol="AAPL")
```

### 3. README Structure

```markdown
# Project Name

Brief description of what this project does.

## Installation

pip install -r requirements.txt

## Quick Start

from myproject import analyze
result = analyze("AAPL", period="1y")
print(f"Sharpe: {result['sharpe_ratio']:.2f}")

## Features

- Feature 1
- Feature 2

## Documentation

- [User Guide](docs/user-guide.md)
- [API Reference](docs/api.md)
```

### 4. Inline Comments

```python
# GOOD: Explain WHY, not WHAT
# Use exponential backoff to avoid overwhelming the API
# during temporary outages (max 5 retries over 31 seconds)
delay = 2 ** retry_count

# BAD: Stating the obvious
# Increment the counter by 1
counter += 1
```

## Documentation Checklist

- [ ] Docstrings for all public functions/classes
- [ ] Type hints for parameters and returns
- [ ] Examples in docstrings
- [ ] README with quick start
- [ ] User guides for major features
- [ ] API reference documentation
- [ ] Inline comments for complex logic
- [ ] Code examples are tested
- [ ] Documentation stays up-to-date
- [ ] Financial disclaimers included in output documentation

<!-- Trigger Keywords: documentation standard, how to document, docs best practices, documentation gold standard -->
