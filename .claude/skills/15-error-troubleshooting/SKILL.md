---
name: error-troubleshooting
description: "Common error patterns and troubleshooting guides for Python finance development including data API failures, calculation precision errors, date/timezone issues, missing data handling, rate limiting, DataFrame shape mismatches, and library version conflicts. Use when encountering errors, debugging issues, or asking about 'error', 'troubleshooting', 'debugging', 'not working', 'NaN values', 'precision error', 'API rate limit', 'timezone error', 'missing data', 'DataFrame error', or 'calculation error'."
---

# Python Finance Error Troubleshooting

Comprehensive troubleshooting guides for common errors in Python financial development.

## Overview

Common error patterns and solutions for:

- Data API failures and rate limiting
- Calculation precision errors (floating point, Decimal)
- Date and timezone issues
- Missing data and NaN handling
- DataFrame shape mismatches
- Library version conflicts
- Connection and timeout errors

## Reference Documentation

### Critical Errors

#### Data API Failures (MOST COMMON)

- **[error-api-rate-limiting](error-api-rate-limiting.md)** - API rate limits and failures
  - **Symptom**: HTTP 429, connection refused, empty responses
  - **Cause**: Exceeding provider rate limits or missing API key
  - **Solution**: Implement retry with backoff, use caching
  - **Prevention**: Cache aggressively, batch requests

#### Calculation Precision Errors

- **[error-calculation-precision](error-calculation-precision.md)** - Floating point and Decimal errors
  - **Symptom**: Penny differences, assertion failures on monetary values
  - **Cause**: Using float for money, wrong rounding mode
  - **Solution**: Use Decimal for monetary, float64 for returns
  - **Pattern**: `Decimal("0.01")` quantize for money

### Data Quality Errors

#### Missing Data and NaN

- **[error-missing-data](error-missing-data.md)** - NaN propagation and missing values
  - **Symptom**: NaN in calculations, silent wrong results
  - **Cause**: Missing market data, holidays, gaps in time series
  - **Solution**: Validate before calculation, use appropriate fill methods
  - **Prevention**: Check for NaN early, log warnings

#### Date and Timezone Issues

- **[error-date-timezone](error-date-timezone.md)** - Timezone mismatches and date errors
  - **Symptom**: Off-by-one day errors, wrong trading hours
  - **Cause**: Mixing naive and aware datetimes, wrong market timezone
  - **Solution**: Always use timezone-aware datetimes, convert to market tz
  - **Pattern**: `pd.Timestamp(..., tz='America/New_York')`

### Pipeline Errors

#### DataFrame Shape Mismatches

- **[error-dataframe-shape](error-dataframe-shape.md)** - Wrong columns, index issues
  - **Symptom**: KeyError, alignment errors, wrong join results
  - **Cause**: Column name mismatches, wrong merge keys
  - **Solution**: Validate columns before operations, use explicit index
  - **Prevention**: Assert expected columns early

#### Connection and Timeout Errors

- **[error-connection-timeout](error-connection-timeout.md)** - Database and API timeouts
  - **Symptom**: ConnectionError, TimeoutError, pool exhaustion
  - **Cause**: Slow queries, too many concurrent connections
  - **Solution**: Connection pooling, query timeout, retry logic
  - **Pattern**: Use `requests.Session()` with timeout

### Library Errors

#### Library Version Conflicts

- **[error-library-versions](error-library-versions.md)** - Version incompatibilities
  - **Symptom**: ImportError, AttributeError on library calls
  - **Cause**: Breaking API changes between library versions
  - **Solution**: Pin versions, check changelogs, use virtual environments
  - **Prevention**: Use requirements.txt with pinned versions

#### Formula Validation Errors

- **[error-formula-validation](error-formula-validation.md)** - Wrong calculation results
  - **Symptom**: Results differ from benchmark values (CFA, textbook)
  - **Cause**: Wrong formula, wrong convention (ACT/360 vs ACT/365)
  - **Solution**: Validate against published benchmarks, cite formula source
  - **Pattern**: Use `pytest.approx()` with appropriate tolerance

## Quick Error Reference

### Error by Symptom

| Symptom                     | Error Type            | Quick Fix                      |
| --------------------------- | --------------------- | ------------------------------ |
| **HTTP 429 / rate limited** | API rate limiting     | Add retry with backoff, cache  |
| **Penny differences**       | Calculation precision | Use Decimal for money          |
| **NaN in results**          | Missing data          | Check/fill NaN before calc     |
| **Off-by-one day**          | Timezone issue        | Use tz-aware datetimes         |
| **KeyError on DataFrame**   | Shape mismatch        | Validate columns early         |
| **ConnectionError**         | Connection timeout    | Add timeout and retry          |
| **ImportError**             | Library version       | Pin versions, check compat     |
| **Wrong Sharpe ratio**      | Formula validation    | Check annualization, benchmark |

### Error Prevention Checklist

**Before Running Calculations**:

- [ ] Data validated (no NaN in critical columns)?
- [ ] Using Decimal for monetary amounts?
- [ ] Dates are timezone-aware?
- [ ] API key set via environment variable?
- [ ] Retry logic on API calls?
- [ ] DataFrame columns match expected schema?
- [ ] Results compared against benchmark values?

## Common Error Patterns

### 1. Floating Point Money Errors

```python
# BAD: float for money
total = 0.1 + 0.2  # 0.30000000000000004

# GOOD: Decimal for money
from decimal import Decimal, ROUND_HALF_UP
total = Decimal("0.1") + Decimal("0.2")  # Decimal('0.3')
total = total.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
```

### 2. NaN Propagation

```python
import numpy as np

# BAD: NaN silently corrupts results
returns = prices.pct_change()  # First value is NaN
sharpe = returns.mean() / returns.std()  # May include NaN

# GOOD: Handle NaN explicitly
returns = prices.pct_change().dropna()
if returns.isna().any():
    raise ValueError("NaN values in returns series")
sharpe = returns.mean() / returns.std()
```

### 3. Timezone Mismatches

```python
import pandas as pd

# BAD: naive datetimes
start = pd.Timestamp("2024-01-02")  # No timezone!

# GOOD: timezone-aware
start = pd.Timestamp("2024-01-02", tz="America/New_York")
```

### 4. API Rate Limiting

```python
import time
import requests

# BAD: no rate limit handling
response = requests.get(url)  # Fails silently on 429

# GOOD: retry with backoff
for attempt in range(3):
    response = requests.get(url, timeout=30)
    if response.status_code == 429:
        delay = 2 ** attempt
        time.sleep(delay)
        continue
    response.raise_for_status()
    break
```

### 5. DataFrame Column Errors

```python
import pandas as pd

# BAD: assume column exists
close_prices = df["Close"]  # KeyError if column is "close"

# GOOD: normalize column names
df.columns = df.columns.str.lower().str.strip()
assert "close" in df.columns, f"Missing 'close' column. Found: {df.columns.tolist()}"
close_prices = df["close"]
```

## Debugging Strategies

### Step 1: Check Data Quality

- Print `df.info()` and `df.describe()`
- Check for NaN: `df.isna().sum()`
- Check dtypes: ensure dates are datetime, prices are float
- Verify date range covers expected period

### Step 2: Validate Calculations

- Compare against published benchmark (CFA, textbook)
- Use `pytest.approx()` with tolerance for floating point
- Check units (daily vs annualized, percent vs decimal)
- Verify convention (ACT/360, ACT/365, 30/360)

### Step 3: Test Components

- Test each calculation step independently
- Use known inputs with known outputs
- Add logging at intermediate steps
- Check edge cases (empty series, single value, all zeros)

### Step 4: Check Environment

- Verify library versions: `pip list | grep pandas`
- Check API key is set: `echo $MARKET_DATA_API_KEY`
- Confirm network access to data providers
- Verify disk space for cache files

## When to Use This Skill

Use this skill when you encounter:

- API errors or rate limiting
- Calculation precision issues
- NaN or missing data problems
- Date/timezone errors
- DataFrame shape or column errors
- Library version conflicts
- Any error message or unexpected behavior in financial code

## CRITICAL Debugging Tips

1. **ALWAYS** validate data before calculations (check for NaN, negative prices)
2. **NEVER** use float for monetary amounts (use Decimal)
3. **ALWAYS** use timezone-aware datetimes for market data
4. **NEVER** ignore NaN values (they propagate silently)

## Related Skills

- **[16-validation-patterns](../16-validation-patterns/SKILL.md)** - Validation patterns
- **[17-gold-standards](../../17-gold-standards/SKILL.md)** - Best practices to avoid errors
- **[06-python-finance](../../06-python-finance/SKILL.md)** - Python finance libraries

## Support

For error troubleshooting, invoke:

- `finance-navigator` - Find relevant documentation
- `finance-pattern-expert` - Pattern validation
- `gold-standards-validator` - Check compliance
- `testing-specialist` - Test debugging
