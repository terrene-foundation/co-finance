# Financial Accuracy Rules

## Scope

These rules apply to all Python files containing financial calculations (`**/*.py` matching financial computations, pricing, returns, risk metrics, or portfolio analytics).

## MUST Rules

### 1. Use Decimal for Currency Amounts

All monetary values MUST use `decimal.Decimal` for storage and arithmetic. IEEE 754 floating-point introduces rounding errors that compound across transactions.

**Correct**:

```python
from decimal import Decimal, ROUND_HALF_UP

price = Decimal("149.99")
quantity = Decimal("100")
total = price * quantity  # Decimal("14999.00")

# Rounding to cents
result = total.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
```

**Incorrect**:

```
price = 149.99        # float — rounding errors accumulate
total = 0.1 + 0.2      # = 0.30000000000000004, not 0.3
```

**Enforced by**: intermediate-reviewer, security-reviewer
**Violation**: BLOCK commit for any float-based currency arithmetic

### 2. Cite Formulas with Sources

All financial formulas MUST include a docstring or comment citing the source (textbook, paper, or standard).

**Correct**:

```python
def sharpe_ratio(returns, risk_free_rate):
    """
    Sharpe Ratio = (Rp - Rf) / sigma_p

    Source: Sharpe, W.F. (1966). "Mutual Fund Performance."
    Journal of Business, 39(1), 119-138.
    """
    excess_returns = returns - risk_free_rate
    return excess_returns.mean() / excess_returns.std()
```

**Incorrect**:

```
def sharpe_ratio(returns, risk_free_rate):
    return (returns - risk_free_rate).mean() / returns.std()  # No source, no docs
```

**Enforced by**: intermediate-reviewer
**Violation**: HIGH priority fix

### 3. Validate Against Known Benchmarks

Financial calculations MUST include unit tests that validate output against independently verified benchmarks (e.g., textbook examples, Bloomberg terminal values, or published datasets).

**Correct**:

```python
def test_black_scholes_call():
    """Validate against Hull, Options, Futures, and Other Derivatives, 11th ed., Example 15.6."""
    price = black_scholes_call(S=42, K=40, T=0.5, r=0.10, sigma=0.20)
    assert abs(price - Decimal("4.76")) < Decimal("0.01")
```

**Enforced by**: testing-specialist
**Violation**: HIGH priority fix

### 4. Handle Edge Cases Explicitly

Financial functions MUST handle and document behavior for:

- Division by zero (e.g., zero standard deviation in Sharpe ratio)
- Negative prices or quantities
- Zero-length return series
- NaN or missing values in time series

**Correct**:

```python
def sharpe_ratio(returns, risk_free_rate):
    if len(returns) == 0:
        raise ValueError("Cannot compute Sharpe ratio on empty return series")
    std = returns.std()
    if std == 0:
        return Decimal("0")  # Or raise, depending on business rule — document the choice
    return (returns.mean() - risk_free_rate) / std
```

**Incorrect**:

```
def sharpe_ratio(returns, risk_free_rate):
    return (returns.mean() - risk_free_rate) / returns.std()  # ZeroDivisionError if flat returns
```

**Enforced by**: intermediate-reviewer
**Violation**: BLOCK commit

### 5. Use Named Constants for Annualization Factors

Annualization factors MUST be defined as named constants, not inline magic numbers. Document the assumption behind each.

**Required Constants**:

```python
# Annualization factors — document the convention used
TRADING_DAYS_PER_YEAR = 252      # NYSE/NASDAQ convention (excludes weekends + ~10 holidays)
MONTHS_PER_YEAR = 12
WEEKS_PER_YEAR = 52
CALENDAR_DAYS_PER_YEAR = 365
```

**Correct**:

```python
annualized_return = daily_return * TRADING_DAYS_PER_YEAR
annualized_vol = daily_vol * (TRADING_DAYS_PER_YEAR ** 0.5)
```

**Incorrect**:

```
annualized_return = daily_return * 252      # Magic number
annualized_vol = daily_vol * 15.8745        # What is this?
```

**Enforced by**: intermediate-reviewer
**Violation**: HIGH priority fix

### 6. Disclose Methodology for Calculated Returns

Any function that computes returns MUST document whether it uses:

- Simple vs. log returns
- Arithmetic vs. geometric mean
- Gross vs. net of fees
- The compounding convention

**Correct**:

```python
def annualized_return(prices):
    """
    Compute annualized return using geometric (compound) method.

    Method: geometric mean of daily simple returns, annualized over 252 trading days.
    Returns are gross of fees.
    Formula: ((1 + R_total)^(252/n)) - 1
    """
```

**Enforced by**: intermediate-reviewer
**Violation**: HIGH priority fix

## MUST NOT Rules

### 1. No Float for Currency Amounts

MUST NOT use Python `float` for any value representing money, price, or notional amount.

**Detection Patterns**:

```
price = 99.99
balance = float(input_value)
total_cost = quantity * 10.50
```

**Consequence**: BLOCK commit

### 2. No Magic Numbers Without Named Constants

MUST NOT use numeric literals in financial formulas without a named constant explaining the value.

**Detection Patterns**:

```
volatility * 15.87        # What is 15.87?
returns * 252              # Should be TRADING_DAYS_PER_YEAR
rate / 360                 # Should be DAYS_ACT_360 or similar
```

**Consequence**: HIGH priority fix

### 3. No Returns Without Methodology Disclosure

MUST NOT present or return calculated performance figures without documenting the methodology used.

**Detection Patterns**:

```
def get_performance(portfolio):
    return portfolio.value_now / portfolio.value_then - 1  # Simple or compound? Gross or net?
```

**Consequence**: HIGH priority fix

## Exceptions

Financial accuracy exceptions require:

1. Explicit justification (e.g., float acceptable for non-monetary quantities like ratios displayed to 2 decimal places)
2. Documentation in code comments
3. Approval from intermediate-reviewer
