---
name: technical-indicators
description: "Technical indicators reference covering moving averages, RSI, MACD, Bollinger Bands, ATR, OBV, and stochastic oscillator with Python implementations. Use when asking about 'moving average', 'SMA', 'EMA', 'WMA', 'RSI', 'MACD', 'Bollinger Bands', 'ATR', 'OBV', 'stochastic oscillator', 'technical indicators', 'momentum indicators', 'volatility indicators', 'volume indicators', or 'trend indicators'."
---

# Technical Indicators

Reference for commonly used technical indicators with conceptual explanations and pandas-based Python implementations.

## Moving Averages

Moving averages smooth price data to identify trend direction. They are lagging indicators -- they confirm trends rather than predict them.

### Simple Moving Average (SMA)

Equal-weight average of the last N prices.

```python
import pandas as pd
import numpy as np
import yfinance as yf

def sma(series: pd.Series, window: int) -> pd.Series:
    """Calculate Simple Moving Average."""
    return series.rolling(window=window).mean()

# Example with real data
ticker = yf.Ticker("AAPL")
df = ticker.history(period="1y")

df["SMA_20"] = sma(df["Close"], 20)
df["SMA_50"] = sma(df["Close"], 50)
df["SMA_200"] = sma(df["Close"], 200)

# Golden Cross: SMA_50 crosses above SMA_200 (bullish)
# Death Cross: SMA_50 crosses below SMA_200 (bearish)
df["golden_cross"] = (df["SMA_50"] > df["SMA_200"]) & (df["SMA_50"].shift(1) <= df["SMA_200"].shift(1))
df["death_cross"] = (df["SMA_50"] < df["SMA_200"]) & (df["SMA_50"].shift(1) >= df["SMA_200"].shift(1))

print(f"Golden crosses: {df['golden_cross'].sum()}")
print(f"Death crosses: {df['death_cross'].sum()}")
```

### Exponential Moving Average (EMA)

Gives more weight to recent prices, reacting faster to price changes.

```python
def ema(series: pd.Series, span: int) -> pd.Series:
    """Calculate Exponential Moving Average."""
    return series.ewm(span=span, adjust=False).mean()

df["EMA_12"] = ema(df["Close"], 12)
df["EMA_26"] = ema(df["Close"], 26)
```

### Weighted Moving Average (WMA)

Assigns linearly increasing weights to more recent data.

```python
def wma(series: pd.Series, window: int) -> pd.Series:
    """Calculate Weighted Moving Average."""
    weights = np.arange(1, window + 1, dtype=float)
    return series.rolling(window=window).apply(
        lambda x: np.dot(x, weights) / weights.sum(), raw=True
    )

df["WMA_20"] = wma(df["Close"], 20)
```

### Visualization

```python
import matplotlib.pyplot as plt

def plot_moving_averages(df: pd.DataFrame, ticker_name: str):
    """Plot price with multiple moving averages."""
    fig, ax = plt.subplots(figsize=(14, 7))

    ax.plot(df.index, df["Close"], label="Close", linewidth=1, alpha=0.8)
    ax.plot(df.index, df["SMA_20"], label="SMA(20)", linewidth=1)
    ax.plot(df.index, df["SMA_50"], label="SMA(50)", linewidth=1)
    if "SMA_200" in df.columns and df["SMA_200"].notna().any():
        ax.plot(df.index, df["SMA_200"], label="SMA(200)", linewidth=1)

    ax.set_title(f"{ticker_name} - Moving Averages")
    ax.set_xlabel("Date")
    ax.set_ylabel("Price")
    ax.legend()
    ax.grid(True, alpha=0.3)
    return fig, ax

fig, ax = plot_moving_averages(df, "AAPL")
plt.tight_layout()
plt.savefig("moving_averages.png", dpi=150)
plt.close()
```

## Relative Strength Index (RSI)

Momentum oscillator measuring speed and magnitude of price changes. Values range from 0 to 100.

- **RSI > 70**: Overbought (potential reversal down)
- **RSI < 30**: Oversold (potential reversal up)
- **RSI divergence**: When price makes new highs/lows but RSI does not, suggesting weakening momentum

```python
def rsi(series: pd.Series, period: int = 14) -> pd.Series:
    """Calculate Relative Strength Index.

    Args:
        series: Price series (typically Close)
        period: Lookback period (default 14)

    Returns:
        RSI values (0-100)
    """
    delta = series.diff()

    gain = delta.where(delta > 0, 0.0)
    loss = -delta.where(delta < 0, 0.0)

    # Wilder's smoothing (equivalent to EMA with alpha = 1/period)
    avg_gain = gain.ewm(alpha=1/period, min_periods=period, adjust=False).mean()
    avg_loss = loss.ewm(alpha=1/period, min_periods=period, adjust=False).mean()

    rs = avg_gain / avg_loss
    return 100 - (100 / (1 + rs))

df["RSI"] = rsi(df["Close"])

# Check current RSI level
latest_rsi = df["RSI"].iloc[-1]
print(f"Current RSI: {latest_rsi:.1f}")
if latest_rsi > 70:
    print("Status: Overbought")
elif latest_rsi < 30:
    print("Status: Oversold")
else:
    print("Status: Neutral")
```

## Moving Average Convergence Divergence (MACD)

Trend-following momentum indicator showing the relationship between two EMAs.

- **MACD Line**: EMA(12) - EMA(26)
- **Signal Line**: EMA(9) of the MACD Line
- **Histogram**: MACD Line - Signal Line

```python
def macd(series: pd.Series, fast: int = 12, slow: int = 26,
         signal: int = 9) -> pd.DataFrame:
    """Calculate MACD indicator.

    Args:
        series: Price series
        fast: Fast EMA period
        slow: Slow EMA period
        signal: Signal line EMA period

    Returns:
        DataFrame with macd_line, signal_line, histogram
    """
    ema_fast = series.ewm(span=fast, adjust=False).mean()
    ema_slow = series.ewm(span=slow, adjust=False).mean()

    macd_line = ema_fast - ema_slow
    signal_line = macd_line.ewm(span=signal, adjust=False).mean()
    histogram = macd_line - signal_line

    return pd.DataFrame({
        "macd_line": macd_line,
        "signal_line": signal_line,
        "histogram": histogram,
    })

macd_data = macd(df["Close"])
df = pd.concat([df, macd_data], axis=1)

# Signal: MACD crosses above signal line (bullish)
df["macd_bullish"] = (df["macd_line"] > df["signal_line"]) & \
                     (df["macd_line"].shift(1) <= df["signal_line"].shift(1))

# Signal: MACD crosses below signal line (bearish)
df["macd_bearish"] = (df["macd_line"] < df["signal_line"]) & \
                     (df["macd_line"].shift(1) >= df["signal_line"].shift(1))
```

### MACD Visualization

```python
def plot_macd(df: pd.DataFrame, ticker_name: str):
    """Plot MACD indicator with histogram."""
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 10),
                                     gridspec_kw={"height_ratios": [3, 1]})

    # Price chart
    ax1.plot(df.index, df["Close"], label="Close", linewidth=1)
    ax1.set_title(f"{ticker_name} - MACD Analysis")
    ax1.set_ylabel("Price")
    ax1.legend()
    ax1.grid(True, alpha=0.3)

    # MACD
    ax2.plot(df.index, df["macd_line"], label="MACD", linewidth=1)
    ax2.plot(df.index, df["signal_line"], label="Signal", linewidth=1)

    colors = ["green" if v >= 0 else "red" for v in df["histogram"]]
    ax2.bar(df.index, df["histogram"], color=colors, alpha=0.5, width=1)
    ax2.axhline(y=0, color="black", linewidth=0.5)
    ax2.set_ylabel("MACD")
    ax2.legend()
    ax2.grid(True, alpha=0.3)

    return fig, (ax1, ax2)
```

## Bollinger Bands

Volatility-based bands around a moving average. The bands widen during high volatility and contract during low volatility.

- **Upper Band**: SMA(20) + 2 \* StdDev(20)
- **Middle Band**: SMA(20)
- **Lower Band**: SMA(20) - 2 \* StdDev(20)

```python
def bollinger_bands(series: pd.Series, window: int = 20,
                     num_std: float = 2.0) -> pd.DataFrame:
    """Calculate Bollinger Bands.

    Args:
        series: Price series
        window: SMA window
        num_std: Number of standard deviations

    Returns:
        DataFrame with upper, middle, lower bands and bandwidth
    """
    middle = series.rolling(window=window).mean()
    std = series.rolling(window=window).std()

    upper = middle + (std * num_std)
    lower = middle - (std * num_std)

    # %B: Where current price sits relative to the bands (0 = lower, 1 = upper)
    pct_b = (series - lower) / (upper - lower)

    # Bandwidth: Normalized measure of band width
    bandwidth = (upper - lower) / middle

    return pd.DataFrame({
        "bb_upper": upper,
        "bb_middle": middle,
        "bb_lower": lower,
        "bb_pct_b": pct_b,
        "bb_bandwidth": bandwidth,
    })

bb = bollinger_bands(df["Close"])
df = pd.concat([df, bb], axis=1)

# Squeeze detection: low bandwidth suggests upcoming breakout
df["bb_squeeze"] = df["bb_bandwidth"] < df["bb_bandwidth"].rolling(120).quantile(0.1)
```

## Average True Range (ATR)

Measures market volatility using the full range of daily price movement.

```python
def atr(high: pd.Series, low: pd.Series, close: pd.Series,
        period: int = 14) -> pd.Series:
    """Calculate Average True Range.

    Args:
        high: High prices
        low: Low prices
        close: Close prices
        period: Smoothing period

    Returns:
        ATR values
    """
    tr1 = high - low                        # Current high-low range
    tr2 = abs(high - close.shift(1))        # Current high vs previous close
    tr3 = abs(low - close.shift(1))         # Current low vs previous close

    true_range = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1)

    return true_range.ewm(alpha=1/period, min_periods=period, adjust=False).mean()

df["ATR"] = atr(df["High"], df["Low"], df["Close"])

# ATR-based position sizing: risk a fixed dollar amount per trade
risk_per_trade = 1000  # dollars
atr_value = df["ATR"].iloc[-1]
position_size = risk_per_trade / atr_value
print(f"ATR: ${atr_value:.2f}")
print(f"Position size (risking ${risk_per_trade}): {position_size:.0f} shares")
```

## On-Balance Volume (OBV)

Cumulative volume indicator that relates volume to price changes.

```python
def obv(close: pd.Series, volume: pd.Series) -> pd.Series:
    """Calculate On-Balance Volume.

    Up days add volume; down days subtract volume.
    """
    direction = np.sign(close.diff())
    direction.iloc[0] = 0
    return (volume * direction).cumsum()

df["OBV"] = obv(df["Close"], df["Volume"])

# OBV trend: apply SMA to smooth OBV
df["OBV_SMA"] = df["OBV"].rolling(20).mean()

# Divergence: price rising but OBV falling suggests weakening buying pressure
```

## Stochastic Oscillator

Compares closing price to the price range over a lookback period. Shows momentum and potential reversal points.

- **%K**: Fast stochastic (raw value)
- **%D**: Slow stochastic (smoothed %K)
- **Overbought**: > 80
- **Oversold**: < 20

```python
def stochastic_oscillator(high: pd.Series, low: pd.Series, close: pd.Series,
                           k_period: int = 14, d_period: int = 3) -> pd.DataFrame:
    """Calculate Stochastic Oscillator.

    Args:
        high, low, close: Price series
        k_period: %K lookback period
        d_period: %D smoothing period

    Returns:
        DataFrame with %K and %D
    """
    lowest_low = low.rolling(window=k_period).min()
    highest_high = high.rolling(window=k_period).max()

    pct_k = 100 * (close - lowest_low) / (highest_high - lowest_low)
    pct_d = pct_k.rolling(window=d_period).mean()

    return pd.DataFrame({
        "stoch_k": pct_k,
        "stoch_d": pct_d,
    })

stoch = stochastic_oscillator(df["High"], df["Low"], df["Close"])
df = pd.concat([df, stoch], axis=1)

# Signal: %K crosses above %D in oversold territory (bullish)
df["stoch_bullish"] = (
    (df["stoch_k"] > df["stoch_d"]) &
    (df["stoch_k"].shift(1) <= df["stoch_d"].shift(1)) &
    (df["stoch_k"] < 20)
)
```

## Composite Indicator Dashboard

```python
def indicator_summary(df: pd.DataFrame) -> dict:
    """Generate a summary of current indicator readings.

    Args:
        df: DataFrame with all indicators calculated

    Returns:
        Dictionary with indicator readings and signals
    """
    latest = df.iloc[-1]

    summary = {
        "price": latest["Close"],
        "rsi": {
            "value": latest.get("RSI"),
            "signal": "overbought" if latest.get("RSI", 50) > 70
                      else "oversold" if latest.get("RSI", 50) < 30
                      else "neutral",
        },
        "macd": {
            "macd_line": latest.get("macd_line"),
            "signal_line": latest.get("signal_line"),
            "histogram": latest.get("histogram"),
            "signal": "bullish" if latest.get("macd_line", 0) > latest.get("signal_line", 0)
                      else "bearish",
        },
        "bollinger": {
            "pct_b": latest.get("bb_pct_b"),
            "bandwidth": latest.get("bb_bandwidth"),
            "signal": "above_upper" if latest.get("bb_pct_b", 0.5) > 1
                      else "below_lower" if latest.get("bb_pct_b", 0.5) < 0
                      else "within_bands",
        },
        "stochastic": {
            "k": latest.get("stoch_k"),
            "d": latest.get("stoch_d"),
            "signal": "overbought" if latest.get("stoch_k", 50) > 80
                      else "oversold" if latest.get("stoch_k", 50) < 20
                      else "neutral",
        },
        "trend": {
            "above_sma20": latest["Close"] > latest.get("SMA_20", 0),
            "above_sma50": latest["Close"] > latest.get("SMA_50", 0),
            "above_sma200": latest["Close"] > latest.get("SMA_200", 0),
        },
    }

    return summary

summary = indicator_summary(df)
for indicator, data in summary.items():
    if isinstance(data, dict):
        print(f"\n{indicator.upper()}:")
        for key, value in data.items():
            if isinstance(value, float):
                print(f"  {key}: {value:.2f}")
            else:
                print(f"  {key}: {value}")
    else:
        print(f"{indicator}: {data:.2f}" if isinstance(data, float) else f"{indicator}: {data}")
```

## Common Pitfalls

1. **Optimizing indicators on the same data used for testing**: This leads to curve-fitting and overly optimistic results. Always use out-of-sample data for validation.

2. **Using too many indicators that measure the same thing**: RSI, Stochastic, and Williams %R are all momentum oscillators. Using all three provides redundant signals, not confirmation.

3. **Ignoring the trending vs ranging context**: RSI overbought/oversold works well in ranging markets but generates false signals in strong trends. In a bull trend, RSI can stay above 70 for extended periods.

4. **Treating indicator signals as trading recommendations**: Indicators describe past price behavior. They do not predict the future. Always combine with risk management and position sizing.

5. **Using default parameters blindly**: The "standard" 14-period RSI or 20-period Bollinger Band may not suit all assets or timeframes. Test different parameters for your specific use case.

6. **Forgetting to handle NaN values**: Rolling calculations produce NaN for the first N-1 values. Ensure downstream logic handles these appropriately.

## Cross-References

- **[chart-patterns](chart-patterns.md)** - Visual pattern analysis to complement indicators
- **[fundamental-ratios](fundamental-ratios.md)** - Fundamental data to complement technical signals
- **[01-financial-instruments/equities](../01-financial-instruments/equities.md)** - Understanding the securities being analyzed
- **[04-risk-management/var-methods](../04-risk-management/var-methods.md)** - Risk-based position sizing
- **[05-financial-data-apis/yfinance-guide](../05-financial-data-apis/yfinance-guide.md)** - Retrieving price data for analysis
