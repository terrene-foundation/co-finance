---
name: chart-patterns
description: "Chart patterns reference covering support/resistance, head-and-shoulders, double top/bottom, triangles, flags, and cup-and-handle. Use when asking about 'chart patterns', 'support resistance', 'head and shoulders', 'double top', 'double bottom', 'triangle pattern', 'flag pattern', 'cup and handle', 'reversal patterns', 'continuation patterns', 'breakout', 'trendline', or 'price patterns'."
---

# Chart Patterns

Reference for classical chart patterns including identification, characteristics, and conceptual recognition approaches. These patterns describe common price structures -- they are observational tools, not predictive guarantees.

## Support and Resistance

### Concepts

**Support**: A price level where buying pressure has historically prevented further decline. Think of it as a "floor."

**Resistance**: A price level where selling pressure has historically prevented further advance. Think of it as a "ceiling."

**Key principles:**

- Support and resistance are zones, not exact prices
- Once broken, support can become resistance and vice versa (role reversal)
- The more times a level is tested, the more significant it becomes
- Volume confirmation strengthens the level

### Identifying Support/Resistance Programmatically

```python
import pandas as pd
import numpy as np

def find_pivot_points(df: pd.DataFrame, left: int = 5, right: int = 5) -> pd.DataFrame:
    """Find local highs and lows that may act as support/resistance.

    Args:
        df: DataFrame with 'High' and 'Low' columns
        left: Number of candles to the left for comparison
        right: Number of candles to the right for comparison

    Returns:
        DataFrame with pivot_high and pivot_low columns
    """
    result = df.copy()
    result["pivot_high"] = np.nan
    result["pivot_low"] = np.nan

    for i in range(left, len(df) - right):
        # Check if this is a local high
        high_window = df["High"].iloc[i - left : i + right + 1]
        if df["High"].iloc[i] == high_window.max():
            result.loc[result.index[i], "pivot_high"] = df["High"].iloc[i]

        # Check if this is a local low
        low_window = df["Low"].iloc[i - left : i + right + 1]
        if df["Low"].iloc[i] == low_window.min():
            result.loc[result.index[i], "pivot_low"] = df["Low"].iloc[i]

    return result

def cluster_levels(levels: list, threshold_pct: float = 0.02) -> list:
    """Cluster nearby price levels into zones.

    Args:
        levels: List of price levels
        threshold_pct: Maximum percentage distance to cluster

    Returns:
        List of clustered level zones (as averages)
    """
    if not levels:
        return []

    sorted_levels = sorted(levels)
    clusters = [[sorted_levels[0]]]

    for level in sorted_levels[1:]:
        if (level - clusters[-1][-1]) / clusters[-1][-1] < threshold_pct:
            clusters[-1].append(level)
        else:
            clusters.append([level])

    return [np.mean(c) for c in clusters]
```

### Visualization

```python
import matplotlib.pyplot as plt
import yfinance as yf

def plot_support_resistance(ticker_symbol: str, period: str = "6mo"):
    """Plot price chart with identified support/resistance levels."""
    df = yf.Ticker(ticker_symbol).history(period=period)
    df = find_pivot_points(df)

    highs = df["pivot_high"].dropna().values.tolist()
    lows = df["pivot_low"].dropna().values.tolist()

    resistance_levels = cluster_levels(highs)
    support_levels = cluster_levels(lows)

    fig, ax = plt.subplots(figsize=(14, 7))
    ax.plot(df.index, df["Close"], linewidth=1, color="black", label="Close")

    for level in resistance_levels[-3:]:  # Top 3 resistance
        ax.axhline(y=level, color="red", linestyle="--", alpha=0.5)
        ax.text(df.index[-1], level, f"  R: ${level:.2f}", color="red", fontsize=9)

    for level in support_levels[-3:]:  # Top 3 support
        ax.axhline(y=level, color="green", linestyle="--", alpha=0.5)
        ax.text(df.index[-1], level, f"  S: ${level:.2f}", color="green", fontsize=9)

    ax.set_title(f"{ticker_symbol} - Support & Resistance")
    ax.set_ylabel("Price")
    ax.grid(True, alpha=0.3)
    return fig, ax
```

## Reversal Patterns

### Head and Shoulders

A three-peak formation signaling a potential trend reversal from bullish to bearish.

**Structure:**

1. **Left shoulder**: Price rises, then falls
2. **Head**: Price rises higher than the left shoulder, then falls
3. **Right shoulder**: Price rises again but lower than the head, then falls
4. **Neckline**: Line connecting the lows between shoulders

**Confirmation**: Price breaks below the neckline with volume.

**Inverse Head and Shoulders**: The mirror image, signaling a reversal from bearish to bullish.

```python
def detect_head_shoulders(df: pd.DataFrame, window: int = 20) -> list:
    """Detect potential head-and-shoulders patterns.

    This is a simplified conceptual detector that identifies three-peak
    formations. Real-world detection requires additional validation
    including volume confirmation, neckline slope, and timeframe context.

    Args:
        df: DataFrame with price data
        window: Lookback window for peak detection

    Returns:
        List of potential pattern locations
    """
    pivots = find_pivot_points(df, left=window//2, right=window//2)
    pivot_highs = pivots[pivots["pivot_high"].notna()].copy()

    patterns = []

    if len(pivot_highs) < 3:
        return patterns

    highs = pivot_highs["pivot_high"].values
    indices = pivot_highs.index.tolist()

    for i in range(len(highs) - 2):
        left_shoulder = highs[i]
        head = highs[i + 1]
        right_shoulder = highs[i + 2]

        # Head must be highest
        if head > left_shoulder and head > right_shoulder:
            # Shoulders should be roughly symmetric (within 15%)
            shoulder_ratio = min(left_shoulder, right_shoulder) / max(left_shoulder, right_shoulder)
            if shoulder_ratio > 0.85:
                patterns.append({
                    "type": "head_and_shoulders",
                    "left_shoulder": {"date": indices[i], "price": left_shoulder},
                    "head": {"date": indices[i+1], "price": head},
                    "right_shoulder": {"date": indices[i+2], "price": right_shoulder},
                    "symmetry": shoulder_ratio,
                })

    return patterns
```

### Double Top / Double Bottom

**Double Top**: Two peaks at roughly the same price level, signaling bearish reversal.

**Double Bottom**: Two troughs at roughly the same price level, signaling bullish reversal.

```python
def detect_double_patterns(df: pd.DataFrame, window: int = 20,
                            tolerance: float = 0.03) -> list:
    """Detect double top and double bottom patterns.

    Args:
        df: DataFrame with price data
        window: Lookback for peak/trough detection
        tolerance: Price tolerance for matching peaks/troughs (as fraction)

    Returns:
        List of detected patterns
    """
    pivots = find_pivot_points(df, left=window//2, right=window//2)
    patterns = []

    # Double Top
    pivot_highs = pivots[pivots["pivot_high"].notna()].copy()
    highs = pivot_highs["pivot_high"].values
    high_dates = pivot_highs.index.tolist()

    for i in range(len(highs) - 1):
        for j in range(i + 1, min(i + 4, len(highs))):  # Check next few peaks
            ratio = abs(highs[i] - highs[j]) / highs[i]
            if ratio < tolerance:
                # Check for valley between the peaks
                between = df.loc[high_dates[i]:high_dates[j], "Low"].min()
                depth = (highs[i] - between) / highs[i]
                if depth > 0.03:  # At least 3% pullback between peaks
                    patterns.append({
                        "type": "double_top",
                        "peak1": {"date": high_dates[i], "price": highs[i]},
                        "peak2": {"date": high_dates[j], "price": highs[j]},
                        "valley": between,
                        "neckline": between,
                    })

    # Double Bottom
    pivot_lows = pivots[pivots["pivot_low"].notna()].copy()
    lows = pivot_lows["pivot_low"].values
    low_dates = pivot_lows.index.tolist()

    for i in range(len(lows) - 1):
        for j in range(i + 1, min(i + 4, len(lows))):
            ratio = abs(lows[i] - lows[j]) / lows[i]
            if ratio < tolerance:
                between = df.loc[low_dates[i]:low_dates[j], "High"].max()
                depth = (between - lows[i]) / lows[i]
                if depth > 0.03:
                    patterns.append({
                        "type": "double_bottom",
                        "trough1": {"date": low_dates[i], "price": lows[i]},
                        "trough2": {"date": low_dates[j], "price": lows[j]},
                        "peak": between,
                        "neckline": between,
                    })

    return patterns
```

## Continuation Patterns

### Triangles

Triangles form as price action contracts into a narrowing range before a breakout.

| Type        | Description                      | Bias                         |
| ----------- | -------------------------------- | ---------------------------- |
| Ascending   | Flat resistance, rising support  | Bullish                      |
| Descending  | Falling resistance, flat support | Bearish                      |
| Symmetrical | Converging trendlines            | Neutral (breakout direction) |

```python
def detect_triangle(df: pd.DataFrame, lookback: int = 30) -> dict:
    """Detect triangle patterns using linear regression on highs and lows.

    Args:
        df: Recent price data
        lookback: Number of candles to analyze

    Returns:
        Dictionary describing the triangle type and characteristics
    """
    recent = df.tail(lookback).copy()
    x = np.arange(len(recent))

    # Fit linear regression to highs and lows
    high_slope, high_intercept = np.polyfit(x, recent["High"].values, 1)
    low_slope, low_intercept = np.polyfit(x, recent["Low"].values, 1)

    # Classify triangle type
    high_flat = abs(high_slope) < recent["High"].std() * 0.01
    low_flat = abs(low_slope) < recent["Low"].std() * 0.01

    if high_flat and low_slope > 0:
        triangle_type = "ascending"
    elif low_flat and high_slope < 0:
        triangle_type = "descending"
    elif high_slope < 0 and low_slope > 0:
        triangle_type = "symmetrical"
    else:
        triangle_type = "none"

    # Check for converging lines
    convergence = (high_slope - low_slope) * lookback
    is_converging = convergence < 0

    return {
        "type": triangle_type,
        "high_slope": high_slope,
        "low_slope": low_slope,
        "is_converging": is_converging,
        "range_start": recent["High"].iloc[0] - recent["Low"].iloc[0],
        "range_end": recent["High"].iloc[-1] - recent["Low"].iloc[-1],
    }
```

### Flags and Pennants

**Flag**: A short, counter-trend consolidation that slopes against the prior trend. Resembles a parallelogram.

**Pennant**: Similar to a flag but the consolidation forms a small symmetrical triangle.

Both are continuation patterns:

- **Bull flag**: Sharp rise (flagpole), then a slight downward drift (flag)
- **Bear flag**: Sharp decline (flagpole), then a slight upward drift (flag)

```python
def detect_flag(df: pd.DataFrame, flagpole_min_pct: float = 0.05,
                flag_max_candles: int = 20) -> dict:
    """Detect potential flag patterns.

    Looks for a strong move (flagpole) followed by a consolidation
    that slopes against the original move.

    Args:
        df: Price data
        flagpole_min_pct: Minimum percentage move for the flagpole
        flag_max_candles: Maximum candles for the flag portion

    Returns:
        Pattern description or None
    """
    if len(df) < flag_max_candles + 10:
        return None

    # Look at recent data
    recent = df.tail(flag_max_candles + 20)

    # Check for a strong move in the preceding period
    pre_flag = recent.head(20)
    price_change = (pre_flag["Close"].iloc[-1] - pre_flag["Close"].iloc[0]) / pre_flag["Close"].iloc[0]

    if abs(price_change) < flagpole_min_pct:
        return None

    # Check the flag portion for counter-trend slope
    flag_portion = recent.tail(flag_max_candles)
    x = np.arange(len(flag_portion))
    slope, _ = np.polyfit(x, flag_portion["Close"].values, 1)

    is_bull_flag = price_change > 0 and slope < 0
    is_bear_flag = price_change < 0 and slope > 0

    if is_bull_flag or is_bear_flag:
        return {
            "type": "bull_flag" if is_bull_flag else "bear_flag",
            "flagpole_change": price_change,
            "flag_slope": slope,
            "flag_candles": len(flag_portion),
        }

    return None
```

### Cup and Handle

A bullish continuation pattern shaped like a tea cup:

1. **Cup**: U-shaped decline and recovery, taking weeks to months
2. **Handle**: Short pullback from the cup's right rim (typically < 1/3 cup depth)
3. **Breakout**: Price moves above the cup's rim with volume

## Pattern Summary Table

| Pattern              | Type         | Signal                           | Volume Confirmation                            |
| -------------------- | ------------ | -------------------------------- | ---------------------------------------------- |
| Head & Shoulders     | Reversal     | Bearish (top), Bullish (inverse) | Increasing on breakdown                        |
| Double Top           | Reversal     | Bearish                          | Increasing on second test                      |
| Double Bottom        | Reversal     | Bullish                          | Increasing on second test                      |
| Ascending Triangle   | Continuation | Bullish                          | Increasing on breakout                         |
| Descending Triangle  | Continuation | Bearish                          | Increasing on breakdown                        |
| Symmetrical Triangle | Continuation | Direction of breakout            | Increasing on breakout                         |
| Bull Flag            | Continuation | Bullish                          | Decreasing during flag, increasing on breakout |
| Cup & Handle         | Continuation | Bullish                          | Increasing on handle breakout                  |

## Common Pitfalls

1. **Seeing patterns everywhere**: Confirmation bias leads traders to see patterns where none exist. Always require volume confirmation and consider the broader market context.

2. **Ignoring the timeframe**: Patterns on a 5-minute chart are far less reliable than those on daily or weekly charts. Higher timeframes carry more significance.

3. **Trading before confirmation**: A head-and-shoulders is not confirmed until the neckline breaks. Many patterns fail before completing.

4. **Treating pattern targets as exact**: The measured-move technique (projecting the pattern height as a target) provides a rough estimate, not a precise target.

5. **Algorithmic pattern detection limitations**: Automated pattern detection is inherently fuzzy. The patterns described here use simplified heuristics; real-world applications require domain expertise and additional filtering.

6. **Forgetting about false breakouts**: Price can break a pattern boundary and immediately reverse. Use volume and follow-through as filters. Wait for a close beyond the level, not just an intraday breach.

## Cross-References

- **[technical-indicators](technical-indicators.md)** - Indicator-based confirmation of pattern signals
- **[fundamental-ratios](fundamental-ratios.md)** - Fundamental context for pattern analysis
- **[04-risk-management/hedging-strategies](../04-risk-management/hedging-strategies.md)** - Managing risk on pattern-based trades
- **[01-financial-instruments/equities](../01-financial-instruments/equities.md)** - Understanding the securities being charted
