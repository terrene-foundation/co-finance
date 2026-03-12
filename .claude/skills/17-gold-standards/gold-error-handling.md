---
name: gold-error-handling
description: "Gold standard for error handling in Python finance applications. Use when asking 'error handling standard', 'handle errors', or 'error patterns'."
---

# Gold Standard: Error Handling

> **Skill Metadata**
> Category: `gold-standards`
> Priority: `HIGH`

## Error Handling Patterns

### 1. Use Try/Except with Specific Exceptions

```python
import pandas as pd
import logging

logger = logging.getLogger(__name__)

def load_price_data(file_path: str) -> pd.DataFrame:
    """Load and validate price data from CSV."""
    try:
        df = pd.read_csv(file_path, parse_dates=["date"])
        if df.empty:
            raise ValueError(f"Empty file: {file_path}")
        return df
    except FileNotFoundError:
        raise FileNotFoundError(f"Price file not found: {file_path}")
    except pd.errors.ParserError as e:
        raise ValueError(f"Invalid CSV format in {file_path}: {e}") from e
```

### 2. Define Domain Exceptions

```python
class FinanceError(Exception):
    """Base exception for financial calculations."""
    pass

class InsufficientDataError(FinanceError):
    def __init__(self, required: int, actual: int):
        super().__init__(f"Need at least {required} observations, got {actual}")
        self.required = required
        self.actual = actual

class InvalidPriceError(FinanceError):
    def __init__(self, symbol: str, issue: str):
        super().__init__(f"Invalid price data for {symbol}: {issue}")
        self.symbol = symbol

class DataFetchError(FinanceError):
    def __init__(self, source: str, reason: str):
        super().__init__(f"Failed to fetch data from {source}: {reason}")
        self.source = source
```

### 3. Validation Before Processing

```python
def validate_returns_input(returns: pd.Series) -> None:
    """Validate return series before calculation."""
    if returns is None:
        raise ValueError("returns cannot be None")

    if not isinstance(returns, pd.Series):
        raise TypeError(f"Expected pd.Series, got {type(returns).__name__}")

    if len(returns) < 2:
        raise InsufficientDataError(required=2, actual=len(returns))

    if returns.isna().any():
        nan_count = returns.isna().sum()
        raise ValueError(f"Return series contains {nan_count} NaN values")
```

### 4. Graceful Degradation with Fallback

```python
import requests
import logging

logger = logging.getLogger(__name__)

def fetch_with_fallback(symbol: str, primary_api: str, fallback_api: str) -> dict:
    """Fetch market data from primary API, falling back to secondary on failure."""
    try:
        response = requests.get(f"{primary_api}/prices/{symbol}", timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        logger.warning(
            "Primary API failed (symbol=%s, error=%s), trying fallback",
            symbol, e,
        )
        response = requests.get(f"{fallback_api}/prices/{symbol}", timeout=10)
        response.raise_for_status()
        return response.json()
```

### 5. Structured Error Logging

```python
import logging

logger = logging.getLogger(__name__)

def run_analysis_pipeline(file_path: str, symbol: str) -> dict:
    """Run analysis pipeline with structured logging."""
    logger.info("Starting analysis for %s from %s", symbol, file_path)

    try:
        df = load_price_data(file_path)
        returns = df["close"].pct_change().dropna()
        metrics = calculate_risk_metrics(returns)
        logger.info(
            "Analysis completed for %s: sharpe=%.2f, observations=%d",
            symbol, metrics["sharpe_ratio"], metrics["observations"],
        )
        return metrics
    except Exception as e:
        logger.error(
            "Analysis failed for %s: %s",
            symbol, e,
            exc_info=True,
        )
        raise
```

### 6. Retry with Exponential Backoff

```python
import time
import requests
import logging

logger = logging.getLogger(__name__)

def robust_api_call(url: str, max_retries: int = 3) -> dict:
    """Call a data API with retry and exponential backoff."""
    last_error = None

    for attempt in range(max_retries):
        try:
            response = requests.get(url, timeout=10)
            if response.ok:
                return response.json()
            last_error = f"HTTP {response.status_code}"
        except requests.RequestException as e:
            last_error = str(e)

        delay = 0.1 * (2 ** attempt)
        logger.warning(
            "Attempt %d failed (error=%s), retrying in %.1fs",
            attempt + 1, last_error, delay,
        )
        time.sleep(delay)

    raise DataFetchError(url, f"All {max_retries} retries exhausted: {last_error}")
```

## Anti-Patterns

```python
# BAD: Bare except
try:
    df = pd.read_csv(file_path)
except:  # Catches everything including SystemExit!
    pass

# BAD: Silently swallowing errors
try:
    returns = df["close"].pct_change()
except Exception:
    pass  # Error discarded!

# BAD: Catch-all with no context
try:
    result = calculate_metrics(returns)
except Exception:
    raise  # What went wrong? No context added.

# GOOD: Specific exception with context
try:
    df = pd.read_csv(file_path, parse_dates=["date"])
except FileNotFoundError:
    raise FileNotFoundError(f"Price data not found: {file_path}")

# GOOD: Logging before re-raise
try:
    metrics = calculate_risk_metrics(returns)
except ValueError as e:
    logger.error("Risk calculation failed: %s", e, exc_info=True)
    raise
```

## Gold Standard Checklist

- [ ] All fallible operations wrapped in try/except
- [ ] Custom exception classes defined for domain errors
- [ ] Specific exceptions caught (never bare `except:`)
- [ ] Input validation before processing
- [ ] Fallback paths for external APIs
- [ ] Structured error logging with context
- [ ] Retry logic with exponential backoff for network calls
- [ ] Error context preserved (`raise ... from e`)
- [ ] Error tests in test suite (`pytest.raises`)

<!-- Trigger Keywords: error handling standard, handle errors, error patterns, error handling gold standard, exceptions, try except -->
