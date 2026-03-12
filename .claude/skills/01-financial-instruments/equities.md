---
name: equities
description: "Equity securities reference covering stock types, market cap classifications, sectors, exchanges, IPOs, share classes, voting rights, and dividends. Use when asking about 'stocks', 'equities', 'common stock', 'preferred stock', 'market cap', 'IPO', 'dividends', 'share classes', 'voting rights', 'stock exchanges', or 'sectors'."
---

# Equity Securities

Comprehensive reference for equity instruments including stock types, classifications, market structure, and Python examples for data retrieval and analysis.

## Stock Types

### Common Stock

Common stock represents ownership in a corporation with voting rights and residual claim on assets.

**Key characteristics:**

- Voting rights (typically one vote per share)
- Residual claim on assets in liquidation (after creditors and preferred shareholders)
- Variable dividends (not guaranteed)
- Potential for capital appreciation
- Limited liability (loss limited to investment)

### Preferred Stock

Preferred stock is a hybrid security with characteristics of both equity and debt.

**Key characteristics:**

- Fixed dividend (usually stated as a percentage of par value)
- Priority over common stock in dividends and liquidation
- Typically no voting rights
- Less price volatility than common stock
- Callable by the issuer in many cases

**Preferred stock subtypes:**

- **Cumulative preferred**: Unpaid dividends accumulate and must be paid before common dividends
- **Non-cumulative preferred**: Missed dividends are forfeited
- **Convertible preferred**: Can be converted to common stock at a specified ratio
- **Participating preferred**: Shares in additional earnings beyond the fixed dividend

```python
import yfinance as yf

# Retrieve stock info to identify share type
ticker = yf.Ticker("BAC")
info = ticker.info

print(f"Company: {info.get('longName')}")
print(f"Quote Type: {info.get('quoteType')}")
print(f"Market Cap: ${info.get('marketCap', 0):,.0f}")
print(f"Dividend Yield: {info.get('dividendYield', 0):.2%}")
print(f"Trailing PE: {info.get('trailingPE', 'N/A')}")

# Preferred shares often have a separate ticker (e.g., BAC-PL)
pref = yf.Ticker("BAC-PL")
pref_info = pref.info
print(f"\nPreferred: {pref_info.get('longName', 'N/A')}")
```

## Market Capitalization Classifications

Market cap = Share price x Shares outstanding

| Classification | Market Cap Range | Characteristics                                 |
| -------------- | ---------------- | ----------------------------------------------- |
| Mega-cap       | > $200B          | Global leaders, highly liquid, lower volatility |
| Large-cap      | $10B - $200B     | Established companies, institutional favorites  |
| Mid-cap        | $2B - $10B       | Growth potential with moderate risk             |
| Small-cap      | $300M - $2B      | Higher growth potential, higher volatility      |
| Micro-cap      | $50M - $300M     | Speculative, lower liquidity                    |
| Nano-cap       | < $50M           | Very speculative, very low liquidity            |

```python
import yfinance as yf
import pandas as pd

def classify_market_cap(market_cap):
    """Classify a stock by its market capitalization."""
    if market_cap is None:
        return "Unknown"
    if market_cap > 200e9:
        return "Mega-cap"
    elif market_cap > 10e9:
        return "Large-cap"
    elif market_cap > 2e9:
        return "Mid-cap"
    elif market_cap > 300e6:
        return "Small-cap"
    elif market_cap > 50e6:
        return "Micro-cap"
    else:
        return "Nano-cap"

tickers = ["AAPL", "MSFT", "CRWD", "ETSY", "PLTR"]
results = []

for symbol in tickers:
    t = yf.Ticker(symbol)
    info = t.info
    mc = info.get("marketCap")
    results.append({
        "Ticker": symbol,
        "Name": info.get("shortName", ""),
        "Market Cap": mc,
        "Classification": classify_market_cap(mc),
    })

df = pd.DataFrame(results)
df["Market Cap"] = df["Market Cap"].apply(
    lambda x: f"${x/1e9:.1f}B" if x else "N/A"
)
print(df.to_string(index=False))
```

## Sectors and Industries

The Global Industry Classification Standard (GICS) defines 11 sectors:

| Sector                 | Examples         | Characteristics                |
| ---------------------- | ---------------- | ------------------------------ |
| Information Technology | AAPL, MSFT, NVDA | Growth-oriented, high R&D      |
| Health Care            | JNJ, UNH, PFE    | Defensive, regulatory risk     |
| Financials             | JPM, BAC, GS     | Interest rate sensitive        |
| Consumer Discretionary | AMZN, TSLA, NKE  | Cyclical, consumer spending    |
| Communication Services | GOOGL, META, DIS | Ad revenue, content            |
| Industrials            | CAT, HON, UPS    | Economic cycle sensitive       |
| Consumer Staples       | PG, KO, WMT      | Defensive, stable demand       |
| Energy                 | XOM, CVX, SLB    | Commodity price driven         |
| Utilities              | NEE, DUK, SO     | Regulated, high dividend       |
| Real Estate            | AMT, PLD, SPG    | REITs, interest rate sensitive |
| Materials              | LIN, APD, SHW    | Commodity and cycle sensitive  |

```python
import yfinance as yf

ticker = yf.Ticker("AAPL")
info = ticker.info

print(f"Sector: {info.get('sector')}")
print(f"Industry: {info.get('industry')}")
print(f"Industry Key: {info.get('industryKey')}")
print(f"Sector Key: {info.get('sectorKey')}")
```

## Stock Exchanges

### Major Global Exchanges

| Exchange | Code    | Location     | Notable Features                            |
| -------- | ------- | ------------ | ------------------------------------------- |
| NYSE     | NYS     | New York     | Largest by market cap, auction + electronic |
| NASDAQ   | NMS     | New York     | Tech-heavy, fully electronic                |
| LSE      | LON     | London       | International listings, AIM market          |
| TSE/JPX  | TYO     | Tokyo        | Third largest globally                      |
| SSE      | SHA     | Shanghai     | A-shares (domestic), B-shares (foreign)     |
| HKEX     | HKG     | Hong Kong    | Gateway to China                            |
| Euronext | PAR/AMS | Pan-European | Multi-country exchange                      |

```python
import yfinance as yf

# Access stocks from different exchanges
# US stocks use plain tickers
us_stock = yf.Ticker("AAPL")

# International stocks use exchange suffixes
uk_stock = yf.Ticker("SHEL.L")      # London Stock Exchange
jp_stock = yf.Ticker("7203.T")      # Tokyo Stock Exchange (Toyota)
hk_stock = yf.Ticker("0700.HK")     # Hong Kong (Tencent)

for name, stock in [("AAPL", us_stock), ("SHEL.L", uk_stock),
                     ("7203.T", jp_stock), ("0700.HK", hk_stock)]:
    info = stock.info
    print(f"{name}: {info.get('shortName', 'N/A')} | "
          f"Exchange: {info.get('exchange', 'N/A')} | "
          f"Currency: {info.get('currency', 'N/A')}")
```

## Initial Public Offerings (IPOs)

An IPO is the process by which a private company offers shares to the public for the first time.

**IPO process stages:**

1. **Selection of underwriters** (investment banks)
2. **Due diligence and regulatory filings** (S-1 with SEC)
3. **Roadshow** (presentations to institutional investors)
4. **Pricing** (setting the offer price)
5. **Allocation and distribution**
6. **Trading begins** on the exchange

**Key IPO metrics:**

- **Offer price**: Price at which shares are sold in the IPO
- **Opening price**: First trade price on the exchange
- **IPO pop**: Percentage gain from offer to opening price
- **Lock-up period**: Typically 90-180 days when insiders cannot sell

```python
import yfinance as yf

# Check IPO-related info for a recently public company
ticker = yf.Ticker("ARM")
info = ticker.info

print(f"Company: {info.get('longName')}")
print(f"IPO Date (approx): {info.get('firstTradeDateEpochUtc')}")
print(f"Shares Outstanding: {info.get('sharesOutstanding', 0):,.0f}")
print(f"Float Shares: {info.get('floatShares', 0):,.0f}")

# Historical data from IPO
hist = ticker.history(period="max")
print(f"\nFirst available date: {hist.index[0].strftime('%Y-%m-%d')}")
print(f"First close: ${hist['Close'].iloc[0]:.2f}")
print(f"Latest close: ${hist['Close'].iloc[-1]:.2f}")
```

## Share Classes and Voting Rights

Many companies issue multiple share classes with different voting rights.

| Company               | Class A        | Class B               | Class C        |
| --------------------- | -------------- | --------------------- | -------------- |
| Alphabet (GOOGL/GOOG) | 1 vote (GOOGL) | 10 votes (not public) | 0 votes (GOOG) |
| Meta (META)           | 1 vote         | 10 votes (Zuckerberg) | N/A            |
| Berkshire (BRK)       | 1 vote (BRK-A) | 1/10,000 vote (BRK-B) | N/A            |

**Dual-class structure implications:**

- Founders retain control with fewer economic shares
- Can create misalignment between economic and voting interests
- Some index providers exclude or limit dual-class stocks

```python
import yfinance as yf

# Compare Alphabet's share classes
googl = yf.Ticker("GOOGL")  # Class A - voting
goog = yf.Ticker("GOOG")    # Class C - non-voting

googl_info = googl.info
goog_info = goog.info

print("Alphabet Share Classes:")
print(f"  GOOGL (Class A): ${googl_info.get('currentPrice', 'N/A')} | Votes: 1 per share")
print(f"  GOOG  (Class C): ${goog_info.get('currentPrice', 'N/A')} | Votes: 0 per share")

# The price difference reflects the voting premium (usually small)
if googl_info.get('currentPrice') and goog_info.get('currentPrice'):
    premium = (googl_info['currentPrice'] / goog_info['currentPrice'] - 1) * 100
    print(f"  Voting premium: {premium:.2f}%")
```

## Dividends

### Dividend Types

- **Cash dividend**: Direct cash payment per share
- **Stock dividend**: Additional shares distributed to shareholders
- **Special dividend**: One-time extraordinary payment
- **Liquidating dividend**: Return of capital during wind-down

### Key Dividend Dates

1. **Declaration date**: Board announces the dividend
2. **Ex-dividend date**: First day the stock trades without the dividend
3. **Record date**: Cutoff for determining eligible shareholders
4. **Payment date**: Dividend is distributed

### Dividend Metrics

```python
import yfinance as yf
import pandas as pd

ticker = yf.Ticker("JNJ")
info = ticker.info

# Dividend summary
print(f"Company: {info.get('longName')}")
print(f"Dividend Rate (annual): ${info.get('dividendRate', 0):.2f}")
print(f"Dividend Yield: {info.get('dividendYield', 0):.2%}")
print(f"Payout Ratio: {info.get('payoutRatio', 0):.2%}")
print(f"Ex-Dividend Date: {info.get('exDividendDate')}")
print(f"5-Year Avg Yield: {info.get('fiveYearAvgDividendYield', 0):.2f}%")

# Dividend history
dividends = ticker.dividends
print(f"\nDividend History (last 8 payments):")
print(dividends.tail(8).to_string())

# Calculate dividend growth rate
annual_divs = dividends.resample("YE").sum()
if len(annual_divs) > 1:
    growth_rates = annual_divs.pct_change().dropna()
    print(f"\nAvg Annual Dividend Growth: {growth_rates.mean():.2%}")
```

### Dividend Yield Calculation

```python
def dividend_yield(annual_dividend_per_share: float, current_price: float) -> float:
    """Calculate dividend yield as annual dividend / current price."""
    if current_price <= 0:
        raise ValueError("Price must be positive")
    return annual_dividend_per_share / current_price

# Example
annual_div = 4.76   # JNJ approximate annual dividend
price = 155.00
dy = dividend_yield(annual_div, price)
print(f"Dividend Yield: {dy:.2%}")  # ~3.07%
```

## Common Pitfalls

1. **Confusing market cap with enterprise value**: Enterprise value includes debt and excludes cash, giving a more complete picture for valuation comparisons.

2. **Ignoring share dilution**: Stock options, convertible securities, and secondary offerings can dilute existing shareholders. Always check fully diluted share count.

3. **Assuming preferred stock is safe**: Preferred dividends can be suspended (non-cumulative) or the issuer can call shares at par, capping upside.

4. **Chasing dividend yield**: Very high yields often signal distress. The stock price may have dropped sharply, inflating the yield before a dividend cut.

5. **Overlooking exchange rate risk**: International stocks expose you to currency fluctuations that can amplify or dampen returns.

6. **Using stale yfinance data**: The `info` dictionary can contain cached values. For real-time needs, verify against the exchange or use a real-time data provider.

## Cross-References

- **[fixed-income](fixed-income.md)** - For comparing equity vs bond characteristics
- **[etfs-funds](etfs-funds.md)** - For pooled equity investment vehicles
- **[derivatives](derivatives.md)** - For equity options and futures
- **[02-market-analysis/fundamental-ratios](../02-market-analysis/fundamental-ratios.md)** - For equity valuation ratios
- **[05-financial-data-apis/yfinance-guide](../05-financial-data-apis/yfinance-guide.md)** - For detailed yfinance usage
