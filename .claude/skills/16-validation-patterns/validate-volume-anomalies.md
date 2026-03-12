---
name: validate-volume-anomalies
description: "Detect volume anomalies including zero volume, spikes, and suspicious patterns. Use when asking 'validate volume', 'volume anomaly', 'volume spike', or 'volume check'."
---

# Validate Volume Anomalies

> **Skill Metadata**
> Category: `validation`
> Priority: `MEDIUM`

## Volume Validation Function

```python
import pandas as pd
import numpy as np
import logging

logger = logging.getLogger(__name__)

def validate_volume(df: pd.DataFrame, symbol: str = "",
                    spike_threshold: float = 10.0) -> list[str]:
    """Check volume data for anomalies.

    Args:
        df: DataFrame with volume column
        symbol: Symbol for log messages
        spike_threshold: Multiple of median to flag as spike

    Returns:
        List of warning messages (empty if clean)
    """
    warnings = []

    # 1. Zero volume days
    zero_vol = (df["volume"] == 0).sum()
    if zero_vol > 0:
        pct = zero_vol / len(df) * 100
        warnings.append(
            f"{symbol}: {zero_vol} zero-volume days ({pct:.1f}%)"
        )

    # 2. Volume spikes
    median_vol = df["volume"].median()
    if median_vol > 0:
        spikes = df["volume"] > median_vol * spike_threshold
        if spikes.any():
            spike_dates = df.loc[spikes, "date"].tolist()
            warnings.append(
                f"{symbol}: {spikes.sum()} volume spikes "
                f"(>{spike_threshold}x median) on {spike_dates}"
            )

    # 3. Negative volume (data error)
    neg_vol = (df["volume"] < 0).sum()
    if neg_vol > 0:
        warnings.append(f"{symbol}: {neg_vol} negative volume values (data error)")

    # 4. Suspiciously round volumes (possible fake data)
    round_vols = df["volume"] % 1000 == 0
    round_pct = round_vols.sum() / len(df) * 100
    if round_pct > 80:
        warnings.append(
            f"{symbol}: {round_pct:.0f}% of volumes are round numbers (suspicious)"
        )

    for w in warnings:
        logger.warning(w)

    return warnings
```

## Quick Volume Checks

```python
# Basic volume assertions
assert df["volume"].ge(0).all(), "Negative volume found"
assert df["volume"].gt(0).any(), "All volumes are zero"
assert df["volume"].median() > 0, "Median volume is zero"
```

<!-- Trigger Keywords: validate volume, volume anomaly, volume spike, volume check, volume validation, zero volume -->
