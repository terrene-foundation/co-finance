---
name: validate-corporate-actions
description: "Detect stock splits and corporate actions in price data. Use when asking 'detect split', 'stock split', 'corporate action', 'adjusted prices', or 'price discontinuity'."
---

# Validate Corporate Actions

> **Skill Metadata**
> Category: `validation`
> Priority: `MEDIUM`

## Split Detection Function

```python
import pandas as pd
import numpy as np
import logging

logger = logging.getLogger(__name__)

COMMON_SPLIT_RATIOS = [2.0, 3.0, 4.0, 5.0, 0.5, 0.333, 0.25, 0.2]

def detect_splits(df: pd.DataFrame, symbol: str = "",
                  threshold: float = 0.30) -> list[dict]:
    """Detect potential stock splits from price discontinuities.

    Args:
        df: DataFrame with date and close columns (sorted by date)
        symbol: Symbol for log messages
        threshold: Minimum daily change to flag (default 30%)

    Returns:
        List of detected split events with date, ratio, and direction
    """
    returns = df["close"].pct_change()
    splits = []

    for i in returns.index:
        if pd.isna(returns[i]):
            continue
        if abs(returns[i]) < threshold:
            continue

        # Check if the price ratio matches a common split
        prev_price = df["close"].iloc[df.index.get_loc(i) - 1]
        curr_price = df["close"][i]
        ratio = prev_price / curr_price

        # Check against common split ratios
        for common in COMMON_SPLIT_RATIOS:
            if abs(ratio - common) < 0.05:
                direction = "split" if ratio > 1 else "reverse split"
                event = {
                    "date": df["date"][i],
                    "ratio": round(ratio, 2),
                    "direction": direction,
                    "prev_close": prev_price,
                    "curr_close": curr_price,
                }
                splits.append(event)
                logger.warning(
                    "%s: Potential %s detected on %s "
                    "(ratio %.2f, $%.2f -> $%.2f)",
                    symbol, direction, event["date"],
                    ratio, prev_price, curr_price,
                )
                break

    return splits


def check_adjusted_prices(df: pd.DataFrame, symbol: str = "") -> bool:
    """Check if prices appear to be split-adjusted.

    Returns True if no splits detected (prices likely adjusted).
    """
    splits = detect_splits(df, symbol)
    if splits:
        logger.warning(
            "%s: %d potential split(s) found. "
            "Prices may not be adjusted. Use adjusted close.",
            symbol, len(splits),
        )
        return False
    return True
```

## Quick Split Check

```python
# Flag any daily move > 40% as potential split
returns = df["close"].pct_change()
large_moves = returns.abs() > 0.40
if large_moves.any():
    print("WARNING: Large moves detected - check for splits:")
    print(df.loc[large_moves, ["date", "close"]])
```

<!-- Trigger Keywords: detect split, stock split, corporate action, adjusted prices, price discontinuity, split detection, reverse split -->
