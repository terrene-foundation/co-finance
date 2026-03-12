# Backtesting with backtrader

backtrader is a Python framework for backtesting trading strategies. It provides a complete ecosystem: data feeds, indicators, strategy logic, order management, position sizing, commission models, and performance analysis.

## Installation

```bash
pip install backtrader
# Optional: for plotting
pip install matplotlib
```

## Core Architecture

backtrader follows an event-driven architecture centered on these components:

| Component     | Role                                                     |
| ------------- | -------------------------------------------------------- |
| **Cerebro**   | The engine that orchestrates everything                  |
| **Data Feed** | OHLCV price data (one or more)                           |
| **Strategy**  | Your trading logic — `next()` is called on each bar      |
| **Indicator** | Technical indicators (SMA, RSI, etc.)                    |
| **Analyzer**  | Post-run performance metrics                             |
| **Observer**  | Live-updated visual tracking (cash, value, trades)       |
| **Broker**    | Simulated broker handling orders, fills, and commissions |

## Minimal Working Example

```python
import backtrader as bt
import datetime

class SmaCross(bt.Strategy):
    """Simple moving average crossover strategy."""

    params = (
        ("fast_period", 10),
        ("slow_period", 30),
    )

    def __init__(self):
        # Indicators are auto-calculated before next() is called
        self.fast_sma = bt.indicators.SMA(self.data.close, period=self.p.fast_period)
        self.slow_sma = bt.indicators.SMA(self.data.close, period=self.p.slow_period)
        self.crossover = bt.indicators.CrossOver(self.fast_sma, self.slow_sma)

    def next(self):
        if not self.position:  # Not in a position
            if self.crossover > 0:  # Fast SMA crosses above slow SMA
                self.buy()
        elif self.crossover < 0:    # Fast SMA crosses below slow SMA
            self.close()


# Set up the engine
cerebro = bt.Cerebro()
cerebro.addstrategy(SmaCross)

# Add data feed (Yahoo CSV format)
data = bt.feeds.YahooFinanceCSVData(
    dataname="AAPL.csv",
    fromdate=datetime.datetime(2020, 1, 1),
    todate=datetime.datetime(2023, 12, 31),
)
cerebro.adddata(data)

# Set starting capital
cerebro.broker.setcash(100_000)

# Set commission (0.1% per trade)
cerebro.broker.setcommission(commission=0.001)

# Run the backtest
print(f"Starting Value: ${cerebro.broker.getvalue():,.2f}")
results = cerebro.run()
print(f"Ending Value: ${cerebro.broker.getvalue():,.2f}")

# Plot the results
cerebro.plot()
```

## Strategy Class In Depth

### Lifecycle Methods

```python
class DetailedStrategy(bt.Strategy):
    params = (
        ("risk_per_trade", 0.02),  # 2% of portfolio per trade
        ("stop_loss_pct", 0.05),   # 5% stop loss
    )

    def __init__(self):
        """Called once at initialization. Define indicators here."""
        self.rsi = bt.indicators.RSI(self.data.close, period=14)
        self.atr = bt.indicators.ATR(self.data, period=14)
        self.order = None  # Track pending orders

    def log(self, txt):
        """Logging helper."""
        dt = self.datas[0].datetime.date(0)
        print(f"{dt}: {txt}")

    def notify_order(self, order):
        """Called when order status changes."""
        if order.status in [order.Submitted, order.Accepted]:
            return  # Order submitted/accepted — nothing to do

        if order.status == order.Completed:
            if order.isbuy():
                self.log(f"BUY executed at ${order.executed.price:.2f}, "
                         f"Size: {order.executed.size:.0f}, "
                         f"Commission: ${order.executed.comm:.2f}")
            else:
                self.log(f"SELL executed at ${order.executed.price:.2f}")

        elif order.status in [order.Canceled, order.Margin, order.Rejected]:
            self.log(f"Order canceled/margin/rejected")

        self.order = None  # Reset pending order

    def notify_trade(self, trade):
        """Called when a trade (position change) completes."""
        if trade.isclosed:
            self.log(f"TRADE P&L: Gross=${trade.pnl:.2f}, Net=${trade.pnlcomm:.2f}")

    def next(self):
        """Called on each bar. This is where trading logic lives."""
        if self.order:
            return  # Wait for pending order

        if not self.position:
            if self.rsi < 30:  # Oversold
                # Position sizing based on risk
                risk_amount = self.broker.getvalue() * self.p.risk_per_trade
                stop_distance = self.data.close[0] * self.p.stop_loss_pct
                size = int(risk_amount / stop_distance)
                self.order = self.buy(size=size)
        else:
            if self.rsi > 70:  # Overbought
                self.order = self.close()  # Close entire position
```

## Indicators

backtrader includes 100+ built-in indicators.

```python
class IndicatorShowcase(bt.Strategy):
    def __init__(self):
        # Trend indicators
        self.sma = bt.indicators.SMA(self.data.close, period=20)
        self.ema = bt.indicators.EMA(self.data.close, period=20)
        self.macd = bt.indicators.MACD(self.data.close)

        # Momentum indicators
        self.rsi = bt.indicators.RSI(self.data.close, period=14)
        self.stochastic = bt.indicators.Stochastic(self.data)

        # Volatility indicators
        self.atr = bt.indicators.ATR(self.data, period=14)
        self.bbands = bt.indicators.BollingerBands(self.data.close, period=20)

        # Volume indicators
        self.obv = bt.indicators.OBV(self.data)

    def next(self):
        # Access indicator values at current bar
        current_rsi = self.rsi[0]
        previous_rsi = self.rsi[-1]  # Previous bar
        upper_band = self.bbands.top[0]
        lower_band = self.bbands.bot[0]
        macd_line = self.macd.macd[0]
        signal_line = self.macd.signal[0]
```

### Custom Indicators

```python
class VolumeWeightedRSI(bt.Indicator):
    """Custom indicator: RSI weighted by relative volume."""
    lines = ("vwrsi",)
    params = (("period", 14),)

    def __init__(self):
        self.rsi = bt.indicators.RSI(self.data.close, period=self.p.period)
        self.vol_ratio = self.data.volume / bt.indicators.SMA(
            self.data.volume, period=self.p.period
        )

    def next(self):
        # Higher volume amplifies the RSI signal
        self.lines.vwrsi[0] = self.rsi[0] * min(self.vol_ratio[0], 2.0)
```

## Data Feeds

### From CSV Files

```python
# Yahoo Finance CSV format
data = bt.feeds.YahooFinanceCSVData(
    dataname="data/AAPL.csv",
    fromdate=datetime.datetime(2020, 1, 1),
    todate=datetime.datetime(2023, 12, 31),
    reverse=False,
)

# Generic CSV (specify column mapping)
data = bt.feeds.GenericCSVData(
    dataname="data/custom.csv",
    dtformat="%Y-%m-%d",
    datetime=0,    # Column index for date
    open=1,
    high=2,
    low=3,
    close=4,
    volume=5,
    openinterest=-1,  # -1 means not present
)
```

### From pandas DataFrame

```python
import pandas as pd

df = pd.read_csv("prices.csv", parse_dates=["Date"], index_col="Date")
data = bt.feeds.PandasData(dataname=df)
cerebro.adddata(data)
```

### Multiple Data Feeds

```python
# Add multiple tickers
for ticker in ["AAPL", "MSFT", "GOOGL"]:
    data = bt.feeds.YahooFinanceCSVData(
        dataname=f"data/{ticker}.csv",
        fromdate=datetime.datetime(2020, 1, 1),
        todate=datetime.datetime(2023, 12, 31),
    )
    cerebro.adddata(data, name=ticker)

# Access in strategy
class MultiAssetStrategy(bt.Strategy):
    def next(self):
        for i, d in enumerate(self.datas):
            if not self.getposition(d).size:
                self.buy(data=d, size=100)
```

## Analyzers: Performance Metrics

```python
cerebro = bt.Cerebro()
cerebro.addstrategy(SmaCross)

# Add analyzers
cerebro.addanalyzer(bt.analyzers.SharpeRatio, _name="sharpe", riskfreerate=0.04)
cerebro.addanalyzer(bt.analyzers.DrawDown, _name="drawdown")
cerebro.addanalyzer(bt.analyzers.TradeAnalyzer, _name="trades")
cerebro.addanalyzer(bt.analyzers.Returns, _name="returns")
cerebro.addanalyzer(bt.analyzers.SQN, _name="sqn")  # System Quality Number

results = cerebro.run()
strat = results[0]

# Extract analyzer results
sharpe = strat.analyzers.sharpe.get_analysis()
dd = strat.analyzers.drawdown.get_analysis()
trades = strat.analyzers.trades.get_analysis()
returns = strat.analyzers.returns.get_analysis()

print(f"Sharpe Ratio: {sharpe.get('sharperatio', 'N/A')}")
print(f"Max Drawdown: {dd.max.drawdown:.2f}%")
print(f"Total Trades: {trades.total.total}")
print(f"Win Rate: {trades.won.total / trades.total.total:.1%}")
print(f"Total Return: {returns.rtot:.2%}")
```

## Order Types

```python
class OrderTypesExample(bt.Strategy):
    def next(self):
        # Market order (executes at next bar's open)
        self.buy()

        # Limit order (executes only at specified price or better)
        self.buy(exectype=bt.Order.Limit, price=145.00)

        # Stop order (triggers when price reaches stop level)
        self.sell(exectype=bt.Order.Stop, price=140.00)

        # Stop-limit order
        self.buy(
            exectype=bt.Order.StopLimit,
            price=155.00,   # Limit price
            pricelimit=156.00  # Maximum price
        )

        # Bracket order (entry + stop loss + take profit)
        self.buy_bracket(
            price=150.00,          # Entry price (limit)
            stopprice=142.50,      # Stop loss
            limitprice=165.00,     # Take profit
        )
```

## Position Sizing

```python
# Fixed size
cerebro.addsizer(bt.sizers.FixedSize, stake=100)

# Percentage of portfolio
cerebro.addsizer(bt.sizers.PercentSizer, percents=10)

# All available cash
cerebro.addsizer(bt.sizers.AllInSizer, percents=95)

# Custom sizer
class RiskBasedSizer(bt.Sizer):
    params = (("risk_pct", 0.02),)

    def _getsizing(self, comminfo, cash, data, isbuy):
        if isbuy:
            risk = cash * self.p.risk_pct
            atr = self.strategy.atr[0]
            size = int(risk / (2 * atr))  # Risk = 2x ATR
            return max(size, 1)
        return self.broker.getposition(data).size

cerebro.addsizer(RiskBasedSizer, risk_pct=0.02)
```

## Commission Models

```python
# Percentage commission
cerebro.broker.setcommission(commission=0.001)  # 0.1%

# Fixed per-share commission
cerebro.broker.setcommission(
    commission=0.005,         # $0.005 per share
    commtype=bt.CommInfoBase.COMM_FIXED,
)

# IB-style tiered commission
class IBCommission(bt.CommInfoBase):
    params = (
        ("commission", 0.005),   # Per share
        ("min_commission", 1.0), # Minimum per order
    )

    def _getcommission(self, size, price, pseudoexec):
        comm = abs(size) * self.p.commission
        return max(comm, self.p.min_commission)

cerebro.broker.addcommissioninfo(IBCommission())

# Slippage
cerebro.broker.set_slippage_perc(0.001)  # 0.1% slippage
```

## Complete Strategy Example with Performance Analysis

```python
import backtrader as bt
import datetime


class MeanReversionStrategy(bt.Strategy):
    """
    Mean reversion strategy using Bollinger Bands and RSI.

    Entry: Price below lower Bollinger Band AND RSI < 30
    Exit: Price crosses above middle band (SMA) OR RSI > 70
    """

    params = (
        ("bb_period", 20),
        ("bb_dev", 2.0),
        ("rsi_period", 14),
        ("rsi_oversold", 30),
        ("rsi_overbought", 70),
        ("risk_pct", 0.02),
    )

    def __init__(self):
        self.bbands = bt.indicators.BollingerBands(
            self.data.close, period=self.p.bb_period, devfactor=self.p.bb_dev
        )
        self.rsi = bt.indicators.RSI(self.data.close, period=self.p.rsi_period)
        self.atr = bt.indicators.ATR(self.data, period=14)
        self.order = None

    def notify_order(self, order):
        if order.status in [order.Completed]:
            if order.isbuy():
                self.entry_price = order.executed.price
        if order.status in [order.Completed, order.Canceled,
                            order.Margin, order.Rejected]:
            self.order = None

    def next(self):
        if self.order:
            return

        if not self.position:
            # Entry: oversold on both indicators
            if (self.data.close[0] < self.bbands.bot[0]
                    and self.rsi[0] < self.p.rsi_oversold):
                risk = self.broker.getvalue() * self.p.risk_pct
                size = int(risk / (2 * self.atr[0])) if self.atr[0] > 0 else 0
                if size > 0:
                    self.order = self.buy(size=size)
        else:
            # Exit: reversion to mean or overbought
            if (self.data.close[0] > self.bbands.mid[0]
                    or self.rsi[0] > self.p.rsi_overbought):
                self.order = self.close()


def run_backtest():
    cerebro = bt.Cerebro()
    cerebro.addstrategy(MeanReversionStrategy)

    data = bt.feeds.YahooFinanceCSVData(
        dataname="SPY.csv",
        fromdate=datetime.datetime(2018, 1, 1),
        todate=datetime.datetime(2023, 12, 31),
    )
    cerebro.adddata(data)
    cerebro.broker.setcash(100_000)
    cerebro.broker.setcommission(commission=0.001)

    # Analyzers
    cerebro.addanalyzer(bt.analyzers.SharpeRatio, _name="sharpe", riskfreerate=0.04)
    cerebro.addanalyzer(bt.analyzers.DrawDown, _name="drawdown")
    cerebro.addanalyzer(bt.analyzers.TradeAnalyzer, _name="trades")
    cerebro.addanalyzer(bt.analyzers.Returns, _name="returns")
    cerebro.addanalyzer(bt.analyzers.AnnualReturn, _name="annual")

    results = cerebro.run()
    strat = results[0]

    # Print performance report
    print("=" * 50)
    print("BACKTEST RESULTS")
    print("=" * 50)

    sharpe = strat.analyzers.sharpe.get_analysis()
    dd = strat.analyzers.drawdown.get_analysis()
    trades = strat.analyzers.trades.get_analysis()
    annual = strat.analyzers.annual.get_analysis()

    print(f"Final Portfolio Value: ${cerebro.broker.getvalue():,.2f}")
    print(f"Sharpe Ratio: {sharpe.get('sharperatio', 'N/A')}")
    print(f"Max Drawdown: {dd.max.drawdown:.2f}%")
    print(f"Max Drawdown Duration: {dd.max.len} bars")

    if trades.total.total > 0:
        print(f"Total Trades: {trades.total.total}")
        print(f"Won: {trades.won.total} | Lost: {trades.lost.total}")
        win_rate = trades.won.total / trades.total.total
        print(f"Win Rate: {win_rate:.1%}")

    print("\nAnnual Returns:")
    for year, ret in sorted(annual.items()):
        print(f"  {year}: {ret:.2%}")

    return cerebro, results


if __name__ == "__main__":
    cerebro, results = run_backtest()
    cerebro.plot(style="candle")
```

**Educational Disclaimer**: Backtested results are hypothetical and do not guarantee future performance. Backtests are subject to overfitting, survivorship bias, and look-ahead bias. Past performance is not indicative of future results. See **[07-regulatory-framework/hypothetical-performance](../07-regulatory-framework/hypothetical-performance.md)** for required disclosures.

## Common Pitfalls

1. **Look-ahead bias**: Using future data in decisions. In `next()`, only use `self.data[0]` (current bar) and `self.data[-N]` (past bars). Never access `self.data[1]` (future).

2. **Survivorship bias**: Only backtesting on stocks that still exist today. Companies that went bankrupt or were delisted are excluded, inflating results.

3. **Overfitting**: Optimizing parameters until the backtest looks perfect. More parameters = more risk of curve fitting to noise. Use out-of-sample testing.

4. **Ignoring costs**: Not modeling commissions, slippage, and bid-ask spreads. These can turn a profitable strategy into a losing one, especially for high-frequency strategies.

5. **Order execution assumptions**: Market orders in backtrader execute at the next bar's open, not the current bar's close. This is realistic but differs from some other frameworks.

## Cross-References

- See **[pandas-finance](pandas-finance.md)** for preparing data feeds from pandas DataFrames
- See **[visualization](visualization.md)** for custom performance charts beyond backtrader's built-in plotting
- See **[numpy-financial](numpy-financial.md)** for risk-adjusted return calculations
- See **[02-market-analysis](../02-market-analysis/SKILL.md)** for technical analysis concepts used in strategies
- See **[04-risk-management](../04-risk-management/SKILL.md)** for position sizing and risk management theory
