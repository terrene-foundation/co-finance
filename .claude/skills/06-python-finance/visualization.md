# Financial Data Visualization

Effective financial charts combine clarity, accuracy, and appropriate visual encoding. This guide covers the essential chart types for financial analysis using matplotlib, mplfinance, and plotly.

## Installation

```bash
pip install matplotlib mplfinance plotly
```

## Candlestick Charts with mplfinance

Candlestick charts are the standard for displaying OHLCV (Open, High, Low, Close, Volume) data.

```python
import mplfinance as mpf
import pandas as pd
import numpy as np

# Create sample OHLCV data (in practice, load from CSV or API)
dates = pd.bdate_range("2024-01-02", periods=60)
np.random.seed(42)
close = 150 + np.cumsum(np.random.randn(60) * 1.5)
df = pd.DataFrame({
    "Open":   close + np.random.randn(60) * 0.5,
    "High":   close + abs(np.random.randn(60)) * 2,
    "Low":    close - abs(np.random.randn(60)) * 2,
    "Close":  close,
    "Volume": np.random.randint(1_000_000, 5_000_000, 60).astype(float),
}, index=dates)

# Basic candlestick chart
mpf.plot(df, type="candle", volume=True, title="AAPL Daily",
         style="charles")

# With moving averages
mpf.plot(df, type="candle", volume=True,
         mav=(10, 20, 50),
         title="AAPL with Moving Averages",
         style="yahoo")

# With Bollinger Bands (custom additional plots)
sma = df["Close"].rolling(20).mean()
std = df["Close"].rolling(20).std()
upper_band = sma + 2 * std
lower_band = sma - 2 * std

bb_plots = [
    mpf.make_addplot(upper_band, color="blue", linestyle="dashed", width=0.7),
    mpf.make_addplot(lower_band, color="blue", linestyle="dashed", width=0.7),
    mpf.make_addplot(sma, color="blue", width=0.7),
]

mpf.plot(df, type="candle", volume=True, addplot=bb_plots,
         title="AAPL with Bollinger Bands", style="charles")

# Save to file
mpf.plot(df, type="candle", volume=True, style="charles",
         savefig="candlestick.png")
```

### mplfinance Styles

```python
# Available built-in styles
print(mpf.available_styles())
# ['binance', 'blueskies', 'brasil', 'charles', 'checkers', 'classic',
#  'default', 'ibd', 'kenan', 'mike', 'nightclouds', 'sas', 'starsandstripes',
#  'yahoo']

# Custom style
custom_style = mpf.make_mpf_style(
    base_mpf_style="charles",
    marketcolors=mpf.make_marketcolors(
        up="green", down="red",
        edge="inherit",
        wick="inherit",
        volume="in",
    ),
    gridcolor="lightgray",
    gridstyle="--",
)
mpf.plot(df, type="candle", style=custom_style, volume=True)
```

## Performance / Equity Curves

### Cumulative Returns Chart

```python
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import numpy as np
import pandas as pd

# Simulated strategy and benchmark returns
dates = pd.bdate_range("2020-01-02", periods=1000)
np.random.seed(42)
strategy_returns = np.random.normal(0.0004, 0.012, 1000)
benchmark_returns = np.random.normal(0.0003, 0.010, 1000)

strategy_cumulative = (1 + pd.Series(strategy_returns, index=dates)).cumprod()
benchmark_cumulative = (1 + pd.Series(benchmark_returns, index=dates)).cumprod()

fig, ax = plt.subplots(figsize=(12, 6))
ax.plot(strategy_cumulative.index, strategy_cumulative.values,
        label="Strategy", linewidth=1.5, color="#2196F3")
ax.plot(benchmark_cumulative.index, benchmark_cumulative.values,
        label="S&P 500", linewidth=1.5, color="#757575")

ax.set_title("Cumulative Performance", fontsize=14, fontweight="bold")
ax.set_ylabel("Growth of $1")
ax.legend(loc="upper left")
ax.grid(True, alpha=0.3)
ax.xaxis.set_major_formatter(mdates.DateFormatter("%Y"))
ax.xaxis.set_major_locator(mdates.YearLocator())

# Shade outperformance regions
ax.fill_between(
    strategy_cumulative.index,
    strategy_cumulative.values,
    benchmark_cumulative.values,
    where=strategy_cumulative.values > benchmark_cumulative.values,
    alpha=0.1, color="green", label="Outperformance",
)
ax.fill_between(
    strategy_cumulative.index,
    strategy_cumulative.values,
    benchmark_cumulative.values,
    where=strategy_cumulative.values <= benchmark_cumulative.values,
    alpha=0.1, color="red", label="Underperformance",
)

plt.tight_layout()
plt.savefig("performance.png", dpi=150)
plt.show()
```

**Educational Disclaimer**: Performance charts showing hypothetical or backtested results are for educational purposes only. Past performance does not guarantee future results. See **[07-regulatory-framework/hypothetical-performance](../07-regulatory-framework/hypothetical-performance.md)** for required disclosures.

## Drawdown Plots

Drawdown shows how far a portfolio has fallen from its peak, a critical risk visualization.

```python
def compute_drawdown(cumulative_returns):
    """Compute drawdown series from cumulative returns."""
    running_max = cumulative_returns.cummax()
    drawdown = (cumulative_returns - running_max) / running_max
    return drawdown

drawdown = compute_drawdown(strategy_cumulative)

fig, axes = plt.subplots(2, 1, figsize=(12, 8), sharex=True,
                          gridspec_kw={"height_ratios": [3, 1]})

# Top: equity curve
axes[0].plot(strategy_cumulative.index, strategy_cumulative.values,
             color="#2196F3", linewidth=1.2)
axes[0].set_title("Equity Curve & Drawdown", fontsize=14, fontweight="bold")
axes[0].set_ylabel("Portfolio Value")
axes[0].grid(True, alpha=0.3)

# Bottom: drawdown
axes[1].fill_between(drawdown.index, drawdown.values, 0,
                      color="#F44336", alpha=0.4)
axes[1].plot(drawdown.index, drawdown.values, color="#F44336", linewidth=0.8)
axes[1].set_ylabel("Drawdown")
axes[1].set_ylim([drawdown.min() * 1.1, 0])
axes[1].yaxis.set_major_formatter(plt.FuncFormatter(lambda y, _: f"{y:.0%}"))
axes[1].grid(True, alpha=0.3)

# Annotate max drawdown
max_dd_date = drawdown.idxmin()
max_dd_value = drawdown.min()
axes[1].annotate(
    f"Max DD: {max_dd_value:.1%}",
    xy=(max_dd_date, max_dd_value),
    xytext=(max_dd_date + pd.Timedelta(days=60), max_dd_value * 0.5),
    arrowprops=dict(arrowstyle="->", color="black"),
    fontsize=10,
)

plt.tight_layout()
plt.show()
```

## Correlation Heatmaps

```python
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

# Returns for multiple assets
tickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "JPM", "GS", "XOM"]
np.random.seed(42)
returns = pd.DataFrame(
    np.random.randn(252, len(tickers)) * 0.02,
    columns=tickers,
    index=pd.bdate_range("2024-01-02", periods=252),
)
# Add some correlation structure
returns["MSFT"] = returns["AAPL"] * 0.7 + returns["MSFT"] * 0.3
returns["GOOGL"] = returns["AAPL"] * 0.4 + returns["GOOGL"] * 0.6

corr = returns.corr()

fig, ax = plt.subplots(figsize=(10, 8))
im = ax.imshow(corr, cmap="RdYlGn", vmin=-1, vmax=1, aspect="auto")

# Add text annotations
for i in range(len(tickers)):
    for j in range(len(tickers)):
        color = "white" if abs(corr.iloc[i, j]) > 0.6 else "black"
        ax.text(j, i, f"{corr.iloc[i, j]:.2f}",
                ha="center", va="center", color=color, fontsize=9)

ax.set_xticks(range(len(tickers)))
ax.set_yticks(range(len(tickers)))
ax.set_xticklabels(tickers, rotation=45, ha="right")
ax.set_yticklabels(tickers)
ax.set_title("Return Correlation Matrix", fontsize=14, fontweight="bold")

fig.colorbar(im, ax=ax, shrink=0.8, label="Correlation")
plt.tight_layout()
plt.show()
```

## Efficient Frontier Plot

```python
import matplotlib.pyplot as plt
import numpy as np

# Simulated portfolio results (from Monte Carlo optimization)
np.random.seed(42)
n_portfolios = 5000
port_returns = np.random.uniform(0.04, 0.18, n_portfolios)
port_vols = np.random.uniform(0.08, 0.30, n_portfolios)
# Make return/vol relationship realistic
port_vols = 0.05 + (port_returns - 0.04) * 1.2 + np.random.randn(n_portfolios) * 0.03
port_vols = np.clip(port_vols, 0.05, 0.35)
sharpe_ratios = (port_returns - 0.04) / port_vols

fig, ax = plt.subplots(figsize=(12, 8))

# Scatter plot colored by Sharpe ratio
scatter = ax.scatter(
    port_vols, port_returns,
    c=sharpe_ratios, cmap="viridis",
    s=5, alpha=0.6, edgecolors="none",
)

# Highlight key portfolios
max_sharpe_idx = sharpe_ratios.argmax()
min_vol_idx = port_vols.argmin()

ax.scatter(port_vols[max_sharpe_idx], port_returns[max_sharpe_idx],
           marker="*", s=300, color="red", edgecolors="black", linewidth=1,
           label=f"Max Sharpe ({sharpe_ratios[max_sharpe_idx]:.2f})", zorder=5)

ax.scatter(port_vols[min_vol_idx], port_returns[min_vol_idx],
           marker="*", s=300, color="blue", edgecolors="black", linewidth=1,
           label="Min Volatility", zorder=5)

# Capital Market Line (from risk-free to max Sharpe)
rf = 0.04
cml_x = np.linspace(0, 0.35, 100)
cml_y = rf + sharpe_ratios[max_sharpe_idx] * cml_x
ax.plot(cml_x, cml_y, color="red", linestyle="--", linewidth=1,
        label="Capital Market Line")

ax.set_xlabel("Annual Volatility", fontsize=12)
ax.set_ylabel("Annual Return", fontsize=12)
ax.set_title("Efficient Frontier", fontsize=14, fontweight="bold")
ax.legend(loc="upper left", fontsize=10)
ax.grid(True, alpha=0.3)

# Format axes as percentages
ax.xaxis.set_major_formatter(plt.FuncFormatter(lambda x, _: f"{x:.0%}"))
ax.yaxis.set_major_formatter(plt.FuncFormatter(lambda y, _: f"{y:.0%}"))

fig.colorbar(scatter, ax=ax, label="Sharpe Ratio", shrink=0.8)
plt.tight_layout()
plt.show()
```

## Risk Decomposition Charts

### Stacked Bar Chart: Portfolio Risk Contribution

```python
import matplotlib.pyplot as plt
import numpy as np

assets = ["US Equity", "Int'l Equity", "Bonds", "Real Estate", "Commodities"]
weights = [0.40, 0.20, 0.25, 0.10, 0.05]
risk_contributions = [0.55, 0.22, 0.05, 0.12, 0.06]  # % of total risk

fig, axes = plt.subplots(1, 2, figsize=(14, 6))

# Weight allocation (pie chart)
colors = ["#2196F3", "#4CAF50", "#FFC107", "#FF5722", "#9C27B0"]
axes[0].pie(weights, labels=assets, autopct="%1.0f%%", colors=colors,
            startangle=90, textprops={"fontsize": 10})
axes[0].set_title("Portfolio Weights", fontsize=13, fontweight="bold")

# Risk contribution (horizontal bar)
y_pos = np.arange(len(assets))
bars = axes[1].barh(y_pos, risk_contributions, color=colors, edgecolor="white")
axes[1].set_yticks(y_pos)
axes[1].set_yticklabels(assets)
axes[1].set_xlabel("Risk Contribution")
axes[1].set_title("Risk Contribution by Asset", fontsize=13, fontweight="bold")
axes[1].xaxis.set_major_formatter(plt.FuncFormatter(lambda x, _: f"{x:.0%}"))

# Add value labels on bars
for bar, pct in zip(bars, risk_contributions):
    axes[1].text(bar.get_width() + 0.01, bar.get_y() + bar.get_height()/2,
                 f"{pct:.0%}", va="center", fontsize=10)

plt.tight_layout()
plt.show()
```

## Interactive Charts with Plotly

Plotly creates interactive, web-based charts suitable for dashboards.

### Interactive Candlestick

```python
import plotly.graph_objects as go
import pandas as pd
import numpy as np

# Create sample data
dates = pd.bdate_range("2024-01-02", periods=120)
np.random.seed(42)
close = 150 + np.cumsum(np.random.randn(120) * 1.5)
df = pd.DataFrame({
    "Open":   close + np.random.randn(120) * 0.5,
    "High":   close + abs(np.random.randn(120)) * 2,
    "Low":    close - abs(np.random.randn(120)) * 2,
    "Close":  close,
    "Volume": np.random.randint(1_000_000, 5_000_000, 120),
}, index=dates)

fig = go.Figure(data=[
    go.Candlestick(
        x=df.index,
        open=df["Open"],
        high=df["High"],
        low=df["Low"],
        close=df["Close"],
        name="AAPL",
    )
])

# Add volume as bar chart on secondary y-axis
fig.add_trace(go.Bar(
    x=df.index, y=df["Volume"],
    name="Volume", yaxis="y2",
    marker_color="rgba(100,100,100,0.3)",
))

fig.update_layout(
    title="AAPL Interactive Chart",
    yaxis=dict(title="Price ($)", domain=[0.3, 1.0]),
    yaxis2=dict(title="Volume", domain=[0.0, 0.25], anchor="x"),
    xaxis=dict(rangeslider=dict(visible=False)),
    template="plotly_white",
    height=600,
)

fig.show()
# Or save: fig.write_html("interactive_chart.html")
```

### Interactive Performance Comparison

```python
import plotly.graph_objects as go
import pandas as pd
import numpy as np

dates = pd.bdate_range("2020-01-02", periods=1000)
np.random.seed(42)
assets = {
    "Portfolio": np.random.normal(0.0004, 0.012, 1000),
    "S&P 500": np.random.normal(0.0003, 0.010, 1000),
    "Bonds": np.random.normal(0.0001, 0.004, 1000),
}

fig = go.Figure()
for name, returns in assets.items():
    cumulative = (1 + pd.Series(returns, index=dates)).cumprod()
    fig.add_trace(go.Scatter(
        x=cumulative.index, y=cumulative.values,
        name=name, mode="lines",
    ))

fig.update_layout(
    title="Portfolio Performance Comparison",
    yaxis_title="Growth of $1",
    template="plotly_white",
    hovermode="x unified",
    height=500,
)
fig.show()
```

## Chart Design Best Practices

1. **Use appropriate chart types**: Candlesticks for OHLC, line charts for cumulative returns, bar charts for volumes, heatmaps for correlations.

2. **Label axes with units**: Always include currency symbols, percentage signs, or units. Financial charts without clear units are misleading.

3. **Use consistent color schemes**: Green/red for up/down is standard in Western markets. Some Asian markets use the opposite convention.

4. **Include time context**: Always show the date range. A chart without dates is meaningless for financial data.

5. **Add benchmarks**: Performance charts should always include a relevant benchmark for comparison.

6. **Annotate key events**: Major drawdowns, regime changes, or rebalance dates add context.

## Common Pitfalls

1. **Truncated y-axes**: Starting a price chart at a non-zero y-axis exaggerates price movements. For returns charts, this is acceptable; for price charts, consider the audience.

2. **Missing volume**: Candlestick charts without volume hide important information about the conviction behind price moves.

3. **Linear vs log scale**: For long time periods, use log scale so that percentage changes look proportional across the chart. A move from $10 to $20 should look the same as $100 to $200.

4. **Survivorship bias in visualizations**: If you only chart assets that still exist, the visualization inherently looks more optimistic than reality.

## Cross-References

- See **[pandas-finance](pandas-finance.md)** for preparing data for visualization
- See **[numpy-financial](numpy-financial.md)** for efficient frontier calculations
- See **[backtrader-guide](backtrader-guide.md)** for backtrader's built-in plotting
- See **[03-portfolio-theory](../03-portfolio-theory/SKILL.md)** for the theory behind efficient frontier charts
- See **[04-risk-management](../04-risk-management/SKILL.md)** for risk metrics shown in drawdown and decomposition charts
