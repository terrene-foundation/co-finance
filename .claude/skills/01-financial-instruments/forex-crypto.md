---
name: forex-crypto
description: "Foreign exchange and cryptocurrency reference covering currency pairs, exchange rate conventions, pip calculations, crypto fundamentals, and market structure. Use when asking about 'forex', 'FX', 'currency pairs', 'exchange rates', 'pips', 'cryptocurrency', 'bitcoin', 'crypto', 'currency trading', 'spot FX', 'cross rates', 'bid-ask spread', or '24-hour markets'."
---

# Foreign Exchange and Cryptocurrency

Reference for FX markets, currency pair conventions, cryptocurrency fundamentals, and market structure differences.

## Currency Pairs

### Quotation Conventions

A currency pair quotes one currency in terms of another: **BASE/QUOTE** (or BASE/COUNTER).

- **EUR/USD = 1.0850** means 1 EUR costs 1.0850 USD
- The base currency is what you are buying/selling
- The quote currency is what you are paying/receiving

### Major Pairs

All major pairs include USD:

| Pair    | Name       | Characteristics                |
| ------- | ---------- | ------------------------------ |
| EUR/USD | Euro       | Most traded pair globally      |
| USD/JPY | Dollar-Yen | Safe haven flows, carry trades |
| GBP/USD | Cable      | Historically volatile          |
| USD/CHF | Swissy     | Safe haven                     |
| AUD/USD | Aussie     | Commodity-linked               |
| USD/CAD | Loonie     | Oil price correlation          |
| NZD/USD | Kiwi       | Commodity-linked, carry trade  |

### Cross Pairs and Exotic Pairs

**Cross pairs** do not include USD: EUR/GBP, EUR/JPY, GBP/JPY

**Exotic pairs** include one major and one emerging market currency: USD/TRY, USD/ZAR, EUR/PLN

### Direct vs Indirect Quotes

- **Direct quote** (for a US investor): Foreign currency priced in USD (e.g., EUR/USD)
- **Indirect quote**: USD priced in foreign currency (e.g., USD/JPY)

```python
def convert_currency(amount: float, rate: float, direction: str = "base_to_quote") -> float:
    """Convert between base and quote currencies.

    Args:
        amount: Amount to convert
        rate: Exchange rate (base/quote)
        direction: 'base_to_quote' or 'quote_to_base'

    Returns:
        Converted amount
    """
    if direction == "base_to_quote":
        return amount * rate
    elif direction == "quote_to_base":
        return amount / rate
    raise ValueError("direction must be 'base_to_quote' or 'quote_to_base'")

# Convert 10,000 EUR to USD at EUR/USD = 1.0850
usd_amount = convert_currency(10000, 1.0850, "base_to_quote")
print(f"10,000 EUR = ${usd_amount:,.2f} USD")

# Convert $50,000 USD to EUR
eur_amount = convert_currency(50000, 1.0850, "quote_to_base")
print(f"$50,000 USD = {eur_amount:,.2f} EUR")
```

### Cross Rate Calculation

```python
def cross_rate(rate_a_usd: float, rate_b_usd: float,
               a_is_base: bool = True, b_is_base: bool = True) -> float:
    """Calculate cross rate between two currencies via USD.

    Args:
        rate_a_usd: Exchange rate of currency A vs USD
        rate_b_usd: Exchange rate of currency B vs USD
        a_is_base: True if A is base in its USD pair (e.g., EUR/USD)
        b_is_base: True if B is base in its USD pair

    Returns:
        Cross rate A/B
    """
    # Convert both to "per 1 USD"
    usd_per_a = rate_a_usd if a_is_base else 1 / rate_a_usd
    usd_per_b = rate_b_usd if b_is_base else 1 / rate_b_usd

    return usd_per_a / usd_per_b

# EUR/JPY from EUR/USD and USD/JPY
# EUR/USD = 1.0850 (EUR is base), USD/JPY = 149.50 (USD is base)
eur_jpy = cross_rate(1.0850, 1/149.50, a_is_base=True, b_is_base=False)
print(f"EUR/JPY = {eur_jpy:.2f}")  # ~161.91
```

## Pip Calculations

A **pip** (percentage in point) is the smallest standard unit of price movement.

- For most pairs: 1 pip = 0.0001 (4th decimal place)
- For JPY pairs: 1 pip = 0.01 (2nd decimal place)
- A **pipette** is 1/10 of a pip (5th decimal / 3rd for JPY)

```python
def pip_value(pair: str, lot_size: float = 100000, account_currency: str = "USD",
              exchange_rate: float = None) -> float:
    """Calculate the value of 1 pip for a given pair and lot size.

    Args:
        pair: Currency pair (e.g., 'EUR/USD')
        lot_size: Position size (standard lot = 100,000)
        account_currency: Your account currency
        exchange_rate: Current exchange rate of the pair

    Returns:
        Value of 1 pip in account currency
    """
    quote_currency = pair.split("/")[1]

    # Determine pip size
    if "JPY" in pair:
        pip_size = 0.01
    else:
        pip_size = 0.0001

    # Pip value in quote currency
    pip_val_quote = lot_size * pip_size

    # Convert to account currency if needed
    if quote_currency == account_currency:
        return pip_val_quote
    elif account_currency == "USD" and exchange_rate:
        if quote_currency == pair.split("/")[1]:
            return pip_val_quote / exchange_rate if quote_currency != "USD" else pip_val_quote

    return pip_val_quote  # In quote currency if no conversion available

# Standard lot EUR/USD
pip_val = pip_value("EUR/USD", lot_size=100000)
print(f"1 pip (EUR/USD, 1 std lot) = ${pip_val:.2f}")  # $10.00

# Mini lot USD/JPY
pip_val_jpy = pip_value("USD/JPY", lot_size=10000)
print(f"1 pip (USD/JPY, 1 mini lot) = {pip_val_jpy:.0f} JPY")
```

### Profit/Loss Calculation

```python
def fx_pnl(entry_rate: float, exit_rate: float, lot_size: float,
           pair: str, position: str = "long") -> dict:
    """Calculate FX trade profit/loss.

    Args:
        entry_rate: Entry exchange rate
        exit_rate: Exit exchange rate
        lot_size: Position size in base currency units
        pair: Currency pair
        position: 'long' or 'short'

    Returns:
        Dictionary with pips, P&L in quote currency
    """
    if "JPY" in pair:
        pip_size = 0.01
    else:
        pip_size = 0.0001

    rate_diff = exit_rate - entry_rate
    if position.lower() == "short":
        rate_diff = -rate_diff

    pips = rate_diff / pip_size
    pnl_quote = rate_diff * lot_size

    return {
        "pips": pips,
        "pnl_quote_currency": pnl_quote,
        "direction": position,
    }

# Long EUR/USD: bought at 1.0800, sold at 1.0850, 1 standard lot
result = fx_pnl(1.0800, 1.0850, 100000, "EUR/USD", "long")
print(f"Pips: {result['pips']:.1f}")
print(f"P&L: ${result['pnl_quote_currency']:,.2f}")
```

## Bid-Ask Spread

```python
def spread_in_pips(bid: float, ask: float, pair: str) -> float:
    """Calculate bid-ask spread in pips."""
    pip_size = 0.01 if "JPY" in pair else 0.0001
    return (ask - bid) / pip_size

def spread_cost(spread_pips: float, lot_size: float, pair: str) -> float:
    """Calculate the cost of the spread for a round-trip trade."""
    pip_size = 0.01 if "JPY" in pair else 0.0001
    return spread_pips * pip_size * lot_size

# EUR/USD typical spread
bid, ask = 1.08500, 1.08520
spread = spread_in_pips(bid, ask, "EUR/USD")
cost = spread_cost(spread, 100000, "EUR/USD")
print(f"Spread: {spread:.1f} pips")
print(f"Round-trip cost: ${cost:.2f}")
```

## Cryptocurrency Basics

### Key Differences from Traditional FX

| Feature           | Forex                  | Crypto                           |
| ----------------- | ---------------------- | -------------------------------- |
| Trading hours     | ~22h/day (Mon-Fri)     | 24/7/365                         |
| Settlement        | T+2 (spot)             | Minutes to hours (on-chain)      |
| Regulation        | Heavily regulated      | Evolving, varies by jurisdiction |
| Central authority | Central banks          | Decentralized (mostly)           |
| Volatility        | Low (major pairs)      | High                             |
| Leverage          | Up to 50:1 (US retail) | Varies, some platforms 100:1+    |
| Market cap        | ~$7.5T daily volume    | ~$100B daily volume              |

### Major Cryptocurrencies

| Asset    | Ticker | Category                | Key Feature                              |
| -------- | ------ | ----------------------- | ---------------------------------------- |
| Bitcoin  | BTC    | Store of value          | First cryptocurrency, fixed supply (21M) |
| Ethereum | ETH    | Smart contract platform | Programmable, proof of stake             |
| Tether   | USDT   | Stablecoin              | Pegged to USD, most traded               |
| USD Coin | USDC   | Stablecoin              | USD-backed, regulated                    |
| Solana   | SOL    | Smart contract platform | High throughput                          |

### Retrieving Crypto Data

```python
import yfinance as yf
import pandas as pd

# Crypto tickers in yfinance use -USD suffix
btc = yf.Ticker("BTC-USD")
eth = yf.Ticker("ETH-USD")

# Get historical data
btc_hist = btc.history(period="1y")
eth_hist = eth.history(period="1y")

print("Bitcoin (BTC-USD):")
print(f"  Latest: ${btc_hist['Close'].iloc[-1]:,.2f}")
print(f"  1Y High: ${btc_hist['High'].max():,.2f}")
print(f"  1Y Low:  ${btc_hist['Low'].min():,.2f}")

print(f"\nEthereum (ETH-USD):")
print(f"  Latest: ${eth_hist['Close'].iloc[-1]:,.2f}")

# Crypto volatility vs forex
btc_vol = btc_hist['Close'].pct_change().std() * np.sqrt(365) * 100
print(f"\nBTC Annualized Volatility: {btc_vol:.1f}%")
```

### Crypto Correlation Analysis

```python
import yfinance as yf
import pandas as pd
import numpy as np

tickers = ["BTC-USD", "ETH-USD", "SOL-USD", "SPY", "GLD"]
data = yf.download(tickers, period="1y", auto_adjust=True)["Close"]

returns = data.pct_change().dropna()
corr_matrix = returns.corr()

print("Correlation Matrix:")
print(corr_matrix.round(3).to_string())
```

## 24-Hour Market Structure

### Forex Sessions

```python
# Forex trading sessions (UTC)
FOREX_SESSIONS = {
    "Sydney":  {"open": "21:00", "close": "06:00", "tz": "UTC"},
    "Tokyo":   {"open": "00:00", "close": "09:00", "tz": "UTC"},
    "London":  {"open": "08:00", "close": "17:00", "tz": "UTC"},
    "New York": {"open": "13:00", "close": "22:00", "tz": "UTC"},
}

# Peak liquidity during session overlaps:
# London + New York: 13:00-17:00 UTC (highest volume)
# Tokyo + London: 08:00-09:00 UTC
# Sydney + Tokyo: 00:00-06:00 UTC

def get_active_sessions(utc_hour: int) -> list:
    """Determine which forex sessions are active at a given UTC hour."""
    active = []
    sessions = {
        "Sydney":   range(21, 24).__contains__(utc_hour) or range(0, 7).__contains__(utc_hour),
        "Tokyo":    range(0, 10).__contains__(utc_hour),
        "London":   range(8, 18).__contains__(utc_hour),
        "New York": range(13, 23).__contains__(utc_hour),
    }
    return [s for s, is_active in sessions.items() if is_active]

# Check sessions at different times
for hour in [3, 9, 15, 20]:
    sessions = get_active_sessions(hour)
    print(f"{hour:02d}:00 UTC: {', '.join(sessions) if sessions else 'Low activity'}")
```

## Common Pitfalls

1. **Ignoring the spread in backtesting**: FX spreads widen during low liquidity and high volatility. Using mid-prices in backtests overstates performance significantly for high-frequency strategies.

2. **Confusing quote conventions**: EUR/USD rising means EUR is strengthening, USD is weakening. USD/JPY rising means USD is strengthening. The base currency direction matches the rate direction.

3. **Treating crypto like forex**: Crypto markets have fundamentally different risk profiles -- exchange insolvency risk, smart contract risk, regulatory uncertainty, and extreme fat-tailed distributions.

4. **Ignoring rollover/swap rates**: Holding FX positions overnight incurs rollover charges or credits based on the interest rate differential. This can be significant for carry trades.

5. **Overlooking liquidity differences**: Major FX pairs are extremely liquid with tight spreads. Exotic pairs and most crypto pairs have wide spreads and can gap significantly.

6. **Using daily close for crypto analysis**: Crypto trades 24/7 with no official close. The "close" in data providers is typically midnight UTC, which is arbitrary compared to equity markets.

## Cross-References

- **[equities](equities.md)** - For comparing FX with equity markets
- **[derivatives](derivatives.md)** - For FX options and futures
- **[02-market-analysis/technical-indicators](../02-market-analysis/technical-indicators.md)** - Technical analysis applicable to FX/crypto
- **[04-risk-management/var-methods](../04-risk-management/var-methods.md)** - Risk management for FX portfolios
- **[05-financial-data-apis/yfinance-guide](../05-financial-data-apis/yfinance-guide.md)** - Retrieving FX and crypto data
