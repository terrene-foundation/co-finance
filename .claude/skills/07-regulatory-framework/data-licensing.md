# Data Licensing and Redistribution Rules

Financial data comes with licensing restrictions that vary by source, data type, and intended use. This guide covers what you can and cannot do with common financial data sources.

**Important**: Data licensing terms change. Always verify current terms directly with the data provider before building a product. This guide provides general guidance as of early 2025.

## Real-Time vs Delayed vs Historical Data

Understanding these categories is critical because licensing requirements differ dramatically between them.

| Data Type            | Definition                                   | Licensing Implications                                          |
| -------------------- | -------------------------------------------- | --------------------------------------------------------------- |
| **Real-time**        | Current prices, less than 15 minutes old     | Most restrictive; exchange fees usually required                |
| **Delayed**          | Prices delayed by 15-20 minutes              | Less restrictive; many providers allow redistribution           |
| **End-of-day (EOD)** | Close-of-business prices                     | Moderate restrictions; some providers allow free redistribution |
| **Historical**       | Archival data, typically one day or more old | Least restrictive; many free sources available                  |

### Exchange Data Programs

Major exchanges (NYSE, NASDAQ, CME, etc.) have formal market data programs. If you display real-time data from these exchanges, you typically need:

1. **A data redistribution agreement** with the exchange or an authorized distributor
2. **Per-user fees** (exchanges charge based on how many people see the data)
3. **Usage reporting** (monthly reports on subscriber counts)
4. **Display requirements** (specific formats, attributions, and disclaimers)

For educational platforms displaying only delayed or historical data, these requirements are significantly reduced or eliminated, depending on the source.

## Source-by-Source Guide

### Yahoo Finance

**Access method**: `yfinance` Python library (unofficial), Yahoo Finance website

**What it provides**: Historical and delayed equity prices, fundamentals, options chains, ETF data

**Licensing considerations**:

- Yahoo Finance data is sourced from exchanges and data providers
- The `yfinance` library is an unofficial scraper, not an official API
- Yahoo's Terms of Service restrict commercial redistribution of their data
- For personal, educational, and research use: generally acceptable
- For commercial products redistributing data: not suitable without a commercial data license from an authorized provider

**Attribution**: When using Yahoo Finance data, attribute it: "Data provided by Yahoo Finance"

**Best practice for educational platforms**:

- Use for learning exercises and development/testing
- For production, consider a licensed data provider (Polygon, Alpha Vantage, etc.)
- Do not cache and redistribute Yahoo Finance data at scale

### Polygon.io

**Access method**: REST API, WebSocket, Python client (`polygon-api-client`)

**What it provides**: Real-time and historical equities, options, forex, crypto

**Licensing tiers**:
| Tier | Price (approx.) | Real-Time | Historical | Redistribution |
|------|----------------|-----------|------------|---------------|
| Basic | Free | No (15-min delay) | Limited | Personal use only |
| Starter | ~$29/mo | No | Yes | Personal use only |
| Developer | ~$79/mo | Yes | Yes | Internal use |
| Advanced | ~$199/mo | Yes | Yes | Limited redistribution |
| Enterprise | Custom | Yes | Full | Full redistribution |

**Key terms**:

- Free tier: delayed data, personal non-commercial use
- Paid tiers: check current terms for redistribution rights
- Enterprise tier required for commercial redistribution to end users
- Attribution required: "Data provided by Polygon.io"

### Federal Reserve Economic Data (FRED)

**Access method**: FRED API, `fredapi` Python library

**What it provides**: Economic indicators, interest rates, employment data, GDP, inflation, monetary data (800,000+ data series)

**Licensing**:

- FRED data is **publicly available** and free to use
- Most FRED data is in the **public domain** (U.S. government data)
- Some series are sourced from private providers and may have restrictions
- API key required (free registration)

**Attribution**: "Source: Federal Reserve Economic Data (FRED), Federal Reserve Bank of St. Louis"

**Best practice**: FRED is one of the most permissive data sources for economic data. Ideal for educational platforms.

### SEC EDGAR

**Access method**: EDGAR full-text search API, company filings

**What it provides**: Company financial filings (10-K, 10-Q, 8-K), XBRL structured data

**Licensing**:

- SEC filings are **public domain** (U.S. government data)
- Free to access, redistribute, and build upon
- API rate limits apply: include a `User-Agent` header with your email
- XBRL data is free and structured for machine processing

**Attribution**: Recommended but not legally required: "Source: SEC EDGAR"

### Alpha Vantage

**Access method**: REST API, Python client

**What it provides**: Stock prices, forex, crypto, technical indicators, fundamental data

**Licensing**:
| Tier | Price | API Calls | Redistribution |
|------|-------|-----------|---------------|
| Free | $0 | 25/day | Personal use |
| Premium | ~$50-250/mo | Higher limits | Check current terms |

**Key terms**:

- Free tier: strict rate limits, personal use only
- Premium tiers: increased limits, some commercial use
- Attribution required

### IEX Cloud

**Access method**: REST API

**What it provides**: U.S. equity data, fundamentals, news, crypto

**Licensing**: Message-based credit system. Check current terms for redistribution rights. Free tier has strict limits.

## What Requires Attribution

Most data providers require attribution in some form. Here is a general guide:

| Source        | Attribution Required | Format                                            |
| ------------- | -------------------- | ------------------------------------------------- |
| Yahoo Finance | Yes                  | "Data: Yahoo Finance"                             |
| Polygon.io    | Yes                  | "Data provided by Polygon.io"                     |
| FRED          | Yes (recommended)    | "Source: FRED, Federal Reserve Bank of St. Louis" |
| SEC EDGAR     | Recommended          | "Source: SEC EDGAR"                               |
| Alpha Vantage | Yes                  | Per provider terms                                |
| IEX Cloud     | Yes                  | Per provider terms                                |

### Where to Place Attribution

- **Chart footer**: Below every chart that uses the data
- **Data table footer**: Below every table displaying sourced data
- **Page footer**: On any page that displays market data
- **About/Sources page**: A dedicated page listing all data sources
- **API responses**: Include `data_source` field in API responses

```python
# Example: adding attribution to a chart
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot(dates, prices)
ax.set_title("S&P 500 Historical Performance")
fig.text(
    0.99, 0.01,
    "Data: Yahoo Finance. For educational purposes only.",
    ha="right", va="bottom", fontsize=7, color="gray"
)
```

## What Requires a Paid License for Commercial Use

Generally, you need a paid commercial license when:

1. **Real-time data redistribution**: Displaying current prices to users in a commercial product
2. **Bulk data downloads**: Systematically downloading and storing large datasets for commercial use
3. **Data as the product**: Selling or providing data itself as a product feature
4. **Derived data products**: Creating and selling indices, rankings, or scores derived from licensed data

You generally do NOT need a paid license when:

1. **Personal research**: Using data for your own analysis
2. **Education with free sources**: Teaching concepts with publicly available historical data
3. **Academic research**: Most providers have academic programs
4. **Public domain data**: FRED, SEC EDGAR, Census data

## Practical Strategy for Educational Platforms

### Development Phase

Use free data sources (`yfinance`, FRED, SEC EDGAR) for development and testing. This is generally acceptable under personal/educational use terms.

### Production Phase

Evaluate based on your use case:

| Use Case                             | Recommended Approach                                       |
| ------------------------------------ | ---------------------------------------------------------- |
| Historical examples only             | FRED + SEC EDGAR (free, public domain)                     |
| Delayed stock prices                 | Polygon.io free tier or Alpha Vantage free tier            |
| Real-time prices                     | Polygon.io paid tier or IEX Cloud                          |
| Educational with no redistribution   | `yfinance` for development, licensed source for production |
| Commercial product with data display | Enterprise data license required                           |

### Caching and Storage

- **Do not cache** real-time data beyond the display session unless your license permits it
- **Historical data** can generally be stored, but check provider terms
- **Public domain data** (FRED, EDGAR) can be freely cached and stored
- **Derived calculations** (returns, ratios, custom indicators calculated from raw data) may have different licensing than the underlying data — check provider terms

## Common Pitfalls

1. **Assuming free APIs mean free for all uses**: Free API tiers typically restrict commercial use. Read the terms.

2. **Scraping instead of using APIs**: Scraping exchange websites is almost always a terms-of-service violation and may violate computer fraud laws.

3. **Redistributing without checking**: Even if you have access to data, redistributing it to your users may require a separate license.

4. **Ignoring rate limits**: Hitting API rate limits can get your key revoked. Implement caching, rate limiting, and backoff strategies.

5. **Mixing data sources without attribution**: If you combine data from multiple sources, attribute each source clearly.

## Cross-References

- See **[sec-educational-rules](sec-educational-rules.md)** for the broader regulatory context
- See **[disclaimer-templates](disclaimer-templates.md)** for data source attribution templates
- See **[05-financial-data-apis](../05-financial-data-apis/SKILL.md)** for technical implementation of data retrieval
- See **[06-python-finance/pandas-finance](../06-python-finance/pandas-finance.md)** for working with downloaded data in pandas
