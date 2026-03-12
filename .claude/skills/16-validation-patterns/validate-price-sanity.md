---
name: validate-price-sanity
description: "Validate market price data for sanity including positive prices, high>=low, extreme moves, and stale data. Use when asking 'validate prices', 'price sanity check', 'data quality check', or 'OHLCV validation'."
---

# Validate Price Sanity

> **Skill Metadata**
> Category: `validation`
> Priority: `HIGH`

## Price Validation Function

```python
import pandas as pd
import numpy as np
import logging

logger = logging.getLogger(__name__)

def validate_prices(df: pd.DataFrame, symbol: str = "",
                    max_daily_move: float = 0.50) -> pd.DataFrame:
    """Validate OHLCV price data for common quality issues.

    Args:
        df: DataFrame with date, open, high, low, close, volume columns
        symbol: Symbol name for log messages
        max_daily_move: Maximum allowed daily move (default 50%)

    Returns:
        Validated and cleaned DataFrame

    Raises:
        ValueError: If critical validation fails
    """
    # 1. Required columns
    required = {"date", "open", "high", "low", "close", "volume"}
    missing = required - set(df.columns)
    if missing:
        raise ValueError(f"{symbol}: Missing columns: {missing}")

    if df.empty:
        raise ValueError(f"{symbol}: Empty DataFrame")

    # 2. Positive prices
    price_cols = ["open", "high", "low", "close"]
    for col in price_cols:
        neg = (df[col] <= 0).sum()
        if neg > 0:
            raise ValueError(f"{symbol}: {neg} non-positive values in {col}")

    # 3. High >= Low
    violations = df["high"] < df["low"]
    if violations.any():
        logger.warning(
            "%s: %d rows where high < low. Swapping.", symbol, violations.sum()
        )
        mask = df["high"] < df["low"]
        df.loc[mask, ["high", "low"]] = df.loc[mask, ["low", "high"]].values

    # 4. Extreme daily moves
    returns = df["close"].pct_change().abs()
    extreme = returns > max_daily_move
    if extreme.any():
        dates = df.loc[extreme, "date"].tolist()
        logger.warning(
            "%s: %d extreme moves (>%.0f%%) on %s. "
            "Check for splits or data errors.",
            symbol, extreme.sum(), max_daily_move * 100, dates,
        )

    # 5. Stale prices (unchanged for 5+ days)
    unchanged = df["close"].diff().eq(0)
    consecutive = unchanged.rolling(5).sum()
    if (consecutive >= 5).any():
        logger.warning("%s: Stale prices detected (unchanged 5+ days)", symbol)

    # 6. Volume non-negative
    df["volume"] = df["volume"].clip(lower=0)

    # 7. Sort by date and deduplicate
    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values("date").drop_duplicates(subset=["date"], keep="last")

    return df.reset_index(drop=True)
```

## Quick Checks

```python
# One-liner sanity checks
assert df["close"].gt(0).all(), "Negative prices found"
assert (df["high"] >= df["low"]).all(), "High < Low found"
assert df["date"].is_monotonic_increasing, "Dates not sorted"
assert not df["close"].isna().any(), "NaN in close prices"
```

<!-- Trigger Keywords: validate prices, price sanity check, data quality check, OHLCV validation, price validation -->
