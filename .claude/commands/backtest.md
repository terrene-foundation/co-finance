# /backtest - Backtesting Quick Reference

## Purpose

Quick reference for backtesting trading and investment strategies against historical data. Loads the Python finance skill module so you can immediately build, run, and evaluate strategy backtests with proper methodology.

## Quick Reference

| Command                           | Action                       |
| --------------------------------- | ---------------------------- |
| `bt.Cerebro()`                    | Initialize backtrader engine |
| `cerebro.addstrategy(MyStrategy)` | Register strategy class      |
| `cerebro.adddata(data_feed)`      | Load historical price data   |
| `cerebro.run()`                   | Execute backtest             |
| `cerebro.plot()`                  | Visualize results            |
| `cerebro.addanalyzer(...)`        | Attach performance analyzers |

## What You Get

- Backtrader strategy template with buy/sell logic
- Performance metrics: total return, CAGR, Sharpe, max drawdown, win rate
- Proper train/test split methodology
- Common bias warnings and how to avoid them
- Walk-forward analysis patterns
- Transaction cost and slippage modeling

## Quick Pattern

```python
import backtrader as bt

class SmaCrossover(bt.Strategy):
    """Simple moving average crossover strategy."""
    params = (
        ("fast_period", 10),
        ("slow_period", 30),
    )

    def __init__(self):
        self.fast_sma = bt.indicators.SMA(period=self.params.fast_period)
        self.slow_sma = bt.indicators.SMA(period=self.params.slow_period)
        self.crossover = bt.indicators.CrossOver(self.fast_sma, self.slow_sma)

    def next(self):
        if not self.position:
            if self.crossover > 0:  # fast crosses above slow
                self.buy()
        elif self.crossover < 0:    # fast crosses below slow
            self.close()

# Run the backtest
cerebro = bt.Cerebro()
cerebro.addstrategy(SmaCrossover)

# Load data
import yfinance as yf
data = bt.feeds.PandasData(
    dataname=yf.download("AAPL", start="2018-01-01", end="2023-01-01")
)
cerebro.adddata(data)

# Configuration
cerebro.broker.setcash(100000)
cerebro.broker.setcommission(commission=0.001)  # 0.1% per trade
cerebro.addsizer(bt.sizers.PercentSizer, percents=95)

# Analyzers
cerebro.addanalyzer(bt.analyzers.SharpeRatio, _name="sharpe")
cerebro.addanalyzer(bt.analyzers.DrawDown, _name="drawdown")
cerebro.addanalyzer(bt.analyzers.Returns, _name="returns")
cerebro.addanalyzer(bt.analyzers.TradeAnalyzer, _name="trades")

# Execute
results = cerebro.run()
strategy = results[0]

# Extract metrics
sharpe = strategy.analyzers.sharpe.get_analysis()
drawdown = strategy.analyzers.drawdown.get_analysis()
returns = strategy.analyzers.returns.get_analysis()
trades = strategy.analyzers.trades.get_analysis()

print(f"Sharpe Ratio: {sharpe.get('sharperatio', 'N/A')}")
print(f"Max Drawdown: {drawdown.max.drawdown:.2f}%")
print(f"Total Return: {returns.rtot * 100:.2f}%")
```

## Bias Warnings

| Bias                         | Description                             | Mitigation                                                                |
| ---------------------------- | --------------------------------------- | ------------------------------------------------------------------------- |
| **Look-ahead bias**          | Using future data in current decisions  | Only use data available at decision time; no future peeking in indicators |
| **Survivorship bias**        | Testing only on stocks that still exist | Use delisted-inclusive datasets; include failed companies                 |
| **Overfitting**              | Strategy fits noise, not signal         | Out-of-sample testing; walk-forward analysis; limit free parameters       |
| **Transaction cost neglect** | Ignoring commissions and slippage       | Always model realistic commissions, bid-ask spread, and market impact     |
| **Selection bias**           | Cherry-picking favorable test periods   | Test across multiple market regimes (bull, bear, sideways)                |

## Performance Metrics Checklist

- Total return and CAGR
- Sharpe ratio (risk-adjusted return)
- Maximum drawdown and drawdown duration
- Win rate and profit factor
- Average win vs. average loss
- Number of trades (too few = unreliable statistics)
- Comparison against buy-and-hold benchmark

## Agent Teams

| Agent                    | Role                                                           |
| ------------------------ | -------------------------------------------------------------- |
| **financial-engineer**   | Strategy design, parameter selection, optimization methodology |
| **quantitative-analyst** | Statistical validation, significance testing, regime analysis  |

## Related Commands

- `/portfolio` - Portfolio construction and risk metrics
- `/data` - Fetch historical market data for backtests
- `/finance` - Underlying financial calculations

## Skill Reference

Loads `.claude/skills/06-python-finance/SKILL.md` for comprehensive Python finance library coverage including pandas time series, numpy-financial, backtrader, QuantLib, and financial visualization tools.
