---
name: template-backtesting-strategy
description: "Backtrader strategy template with indicators, analyzers, and complete Cerebro setup. Use when requesting 'backtest template', 'strategy template', 'backtrader template', 'trading strategy boilerplate', or 'backtesting example'."
---

# Backtesting Strategy Template

Template for creating backtrader strategies with proper parameter definition, indicator setup, order management, and analyzer configuration.

> **Skill Metadata**
> Category: `cross-cutting` (code-generation)
> Priority: `MEDIUM`

## Complete Strategy Template

```python
"""Backtesting Strategy Template using backtrader"""

import backtrader as bt
import pandas as pd
import numpy as np
from datetime import datetime


class MeanReversionStrategy(bt.Strategy):
    """Mean reversion strategy using Bollinger Bands and RSI.

    Buy when price touches lower Bollinger Band AND RSI is oversold.
    Sell when price touches upper Bollinger Band OR RSI is overbought.

    Parameters:
        bb_period: Bollinger Band lookback period (default: 20)
        bb_dev: Bollinger Band standard deviations (default: 2.0)
        rsi_period: RSI lookback period (default: 14)
        rsi_oversold: RSI oversold threshold (default: 30)
        rsi_overbought: RSI overbought threshold (default: 70)
        risk_pct: Fraction of portfolio to risk per trade (default: 0.02)
    """

    params = dict(
        bb_period=20,
        bb_dev=2.0,
        rsi_period=14,
        rsi_oversold=30,
        rsi_overbought=70,
        risk_pct=0.02,
    )

    def __init__(self):
        """Initialize indicators."""
        # Bollinger Bands
        self.bb = bt.ind.BollingerBands(
            self.data.close,
            period=self.p.bb_period,
            devfactor=self.p.bb_dev,
        )

        # RSI
        self.rsi = bt.ind.RSI(
            self.data.close,
            period=self.p.rsi_period,
        )

        # Track orders
        self.order = None
        self.entry_price = None

    def log(self, msg, dt=None):
        """Log a message with date."""
        dt = dt or self.datas[0].datetime.date(0)
        print(f"{dt.isoformat()} | {msg}")

    def notify_order(self, order):
        """Handle order notifications."""
        if order.status in [order.Submitted, order.Accepted]:
            return  # Nothing to do yet

        if order.status in [order.Completed]:
            if order.isbuy():
                self.log(
                    f"BUY EXECUTED | Price: {order.executed.price:.2f} | "
                    f"Size: {order.executed.size:.0f} | "
                    f"Cost: {order.executed.value:.2f} | "
                    f"Comm: {order.executed.comm:.2f}"
                )
                self.entry_price = order.executed.price
            elif order.issell():
                self.log(
                    f"SELL EXECUTED | Price: {order.executed.price:.2f} | "
                    f"Size: {order.executed.size:.0f} | "
                    f"PnL: {order.executed.pnl:.2f}"
                )
                self.entry_price = None

        elif order.status in [order.Canceled, order.Margin, order.Rejected]:
            self.log(f"Order {order.Status[order.status]}")

        self.order = None

    def notify_trade(self, trade):
        """Handle trade notifications."""
        if trade.isclosed:
            self.log(
                f"TRADE CLOSED | Gross: {trade.pnl:.2f} | "
                f"Net: {trade.pnlcomm:.2f}"
            )

    def next(self):
        """Execute strategy logic on each bar."""
        # Skip if an order is pending
        if self.order:
            return

        # Current values
        close = self.data.close[0]
        rsi = self.rsi[0]
        bb_lower = self.bb.lines.bot[0]
        bb_upper = self.bb.lines.top[0]

        if not self.position:
            # --- Entry logic ---
            if close <= bb_lower and rsi <= self.p.rsi_oversold:
                # Position sizing: risk-based
                risk_amount = self.broker.getvalue() * self.p.risk_pct
                stop_distance = close - (close * 0.95)  # 5% stop loss
                if stop_distance > 0:
                    size = int(risk_amount / stop_distance)
                    size = min(size, int(self.broker.getcash() * 0.95 / close))
                    if size > 0:
                        self.order = self.buy(size=size)
                        self.log(f"BUY SIGNAL | Close: {close:.2f} | RSI: {rsi:.1f}")
        else:
            # --- Exit logic ---
            if close >= bb_upper or rsi >= self.p.rsi_overbought:
                self.order = self.sell(size=self.position.size)
                self.log(f"SELL SIGNAL | Close: {close:.2f} | RSI: {rsi:.1f}")


def run_backtest(
    data_path: str = None,
    data_df: pd.DataFrame = None,
    initial_cash: float = 100_000.0,
    commission: float = 0.001,
    strategy_params: dict = None,
    verbose: bool = True,
) -> dict:
    """Run a complete backtest and return results.

    Args:
        data_path: Path to CSV file with OHLCV data
        data_df: DataFrame with OHLCV data (alternative to data_path)
        initial_cash: Starting portfolio value
        commission: Commission rate (e.g., 0.001 = 0.1%)
        strategy_params: Override default strategy parameters
        verbose: Print trade log

    Returns:
        Dictionary with backtest results and analyzer output
    """
    cerebro = bt.Cerebro()

    # Add strategy with optional parameter overrides
    params = strategy_params or {}
    cerebro.addstrategy(MeanReversionStrategy, **params)

    # Add data
    if data_df is not None:
        data = bt.feeds.PandasData(dataname=data_df)
    elif data_path is not None:
        data = bt.feeds.GenericCSVData(
            dataname=data_path,
            dtformat="%Y-%m-%d",
            datetime=0, open=1, high=2, low=3, close=4, volume=5,
            openinterest=-1,
        )
    else:
        raise ValueError("Provide either data_path or data_df")

    cerebro.adddata(data)

    # Broker settings
    cerebro.broker.setcash(initial_cash)
    cerebro.broker.setcommission(commission=commission)

    # Analyzers
    cerebro.addanalyzer(bt.analyzers.SharpeRatio, _name="sharpe",
                        timeframe=bt.TimeFrame.Days, annualize=True)
    cerebro.addanalyzer(bt.analyzers.DrawDown, _name="drawdown")
    cerebro.addanalyzer(bt.analyzers.TradeAnalyzer, _name="trades")
    cerebro.addanalyzer(bt.analyzers.Returns, _name="returns")

    # Run
    if verbose:
        print(f"Starting Portfolio Value: ${initial_cash:,.2f}")

    results = cerebro.run()
    strat = results[0]

    final_value = cerebro.broker.getvalue()
    total_return = (final_value - initial_cash) / initial_cash

    if verbose:
        print(f"Final Portfolio Value: ${final_value:,.2f}")
        print(f"Total Return: {total_return:.2%}")

    # Extract analyzer results
    sharpe = strat.analyzers.sharpe.get_analysis()
    drawdown = strat.analyzers.drawdown.get_analysis()
    trades = strat.analyzers.trades.get_analysis()

    return {
        "final_value": final_value,
        "total_return": total_return,
        "sharpe_ratio": sharpe.get("sharperatio"),
        "max_drawdown": drawdown.get("max", {}).get("drawdown", 0) / 100,
        "total_trades": trades.get("total", {}).get("total", 0),
        "won_trades": trades.get("won", {}).get("total", 0),
        "lost_trades": trades.get("lost", {}).get("total", 0),
        "cerebro": cerebro,
        "strategy": strat,
    }


if __name__ == "__main__":
    # Example with synthetic data
    np.random.seed(42)
    dates = pd.date_range("2022-01-01", periods=504, freq="B")
    close = 100 * np.exp(np.cumsum(np.random.normal(0.0002, 0.018, len(dates))))
    df = pd.DataFrame({
        "open": close * (1 + np.random.uniform(-0.005, 0.005, len(dates))),
        "high": close * (1 + np.abs(np.random.normal(0, 0.01, len(dates)))),
        "low": close * (1 - np.abs(np.random.normal(0, 0.01, len(dates)))),
        "close": close,
        "volume": np.random.randint(500_000, 5_000_000, len(dates)),
    }, index=dates)

    results = run_backtest(data_df=df, verbose=True)
    print(f"\nSharpe Ratio: {results['sharpe_ratio']}")
    print(f"Max Drawdown: {results['max_drawdown']:.2%}")
    print(f"Total Trades: {results['total_trades']}")
```

## Quick Tips

- Always define parameters using `params = dict(...)` for optimization
- Use `notify_order` and `notify_trade` for proper order tracking
- Size positions based on risk, not fixed dollar amounts
- Add multiple analyzers to get a complete picture
- Use synthetic data with `np.random.seed()` for reproducible tests

<!-- Trigger Keywords: backtest template, strategy template, backtrader template, trading strategy boilerplate, backtesting example, backtest boilerplate, strategy scaffold -->
