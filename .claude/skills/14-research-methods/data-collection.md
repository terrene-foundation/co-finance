# Data Collection

Finance is an empirical discipline -- almost every research question requires data. Knowing where to find data, what each database covers, and how to cite it properly is a foundational research skill.

## Why Data Collection Matters

The quality of your research is bounded by the quality of your data. Using the wrong database, misunderstanding variable definitions, or failing to account for data quirks (survivorship bias, look-ahead bias, backfill bias) can invalidate your entire study.

## Major Financial and Economic Databases

### FRED (Federal Reserve Economic Data)

**Provider**: Federal Reserve Bank of St. Louis
**Access**: Free (fred.stlouisfed.org)
**Coverage**: 800,000+ US and international economic time series

**Key series for finance research**:

| Series ID | Description | Use For |
|-----------|-------------|---------|
| DFF | Federal funds effective rate | Risk-free rate proxy, monetary policy |
| DTB3 | 3-month Treasury bill rate | Short-term risk-free rate |
| DGS10 | 10-year Treasury constant maturity rate | Long-term rate, yield curve |
| T10Y2Y | 10-year minus 2-year Treasury spread | Yield curve slope, recession predictor |
| CPIAUCSL | Consumer Price Index for All Urban Consumers | Inflation adjustment |
| GDPC1 | Real GDP | Business cycle dating |
| UNRATE | Civilian unemployment rate | Economic conditions |
| VIXCLS | CBOE Volatility Index (VIX) | Market fear/uncertainty |
| DEXUSEU | USD/EUR exchange rate | International finance |
| BAMLH0A0HYM2 | High yield corporate bond spread | Credit conditions |

**How to cite**: "Data obtained from FRED, Federal Reserve Bank of St. Louis; [Series ID], [URL], accessed [date]."

### CRSP (Center for Research in Security Prices)

**Provider**: University of Chicago Booth School of Business
**Access**: University subscription, typically via WRDS
**Coverage**: US stock prices, returns, and market data, 1925-present

**Key files**:
- **Monthly Stock File**: Monthly prices, returns, shares outstanding, volume
- **Daily Stock File**: Daily prices and returns
- **Delisting Returns**: Returns when a stock is removed from an exchange (critical for avoiding survivorship bias)
- **Index Files**: Value-weighted and equal-weighted market returns

**Essential variables**:
- PERMNO: Permanent security identifier (use this to track stocks over time)
- RET: Holding period return (includes dividends)
- SHRCD: Share code (10, 11 = common stock)
- EXCHCD: Exchange code (1 = NYSE, 2 = AMEX, 3 = NASDAQ)

**How to cite**: "Stock return data are from the Center for Research in Security Prices (CRSP), accessed via WRDS on [date]."

### Compustat

**Provider**: S&P Global Market Intelligence
**Access**: University subscription, typically via WRDS
**Coverage**: Financial statement data for US (North America) and global firms

**Key variables (Compustat annual)**:

| Variable | Mnemonic | Description |
|----------|----------|-------------|
| Total Assets | AT | Balance sheet total assets |
| Total Revenue | REVT | Income statement revenue |
| Net Income | NI | Bottom-line profit |
| Common Equity | CEQ | Book value of equity |
| Long-Term Debt | DLTT | Long-term borrowings |
| Current Debt | DLC | Short-term borrowings |
| Capital Expenditures | CAPX | Investment in fixed assets |
| Depreciation | DP | Depreciation and amortization |
| Dividends per Share | DVPSX_F | Dividends paid per share |
| SIC Code | SIC | Industry classification |

**Critical note on timing**: Compustat reports fiscal year data, but this data becomes publicly available only after the fiscal year ends (typically a 60-90 day lag). When merging with CRSP returns, lag accounting data by at least 3-6 months to avoid look-ahead bias.

**How to cite**: "Financial statement data are from Compustat North America Annual File, accessed via WRDS on [date]."

### WRDS (Wharton Research Data Services)

**Provider**: University of Pennsylvania, Wharton School
**Access**: University subscription
**Coverage**: Aggregator providing access to 50+ databases

WRDS is not a database itself but a platform that provides standardized access to CRSP, Compustat, IBES, Thomson Reuters, and many other databases. It also provides tools for merging datasets (the CRSP/Compustat Merged database is especially popular).

**How to cite**: "Data accessed through Wharton Research Data Services (WRDS), wrds-web.wharton.upenn.edu, on [date]."

### Bloomberg Terminal

**Provider**: Bloomberg L.P.
**Access**: Terminal subscription (typically available in university finance labs)
**Coverage**: Real-time and historical data across all asset classes, globally

**Best for**:
- Real-time market data and news
- Fixed income data (corporate bonds, sovereign bonds, CDS)
- Derivatives data (options, futures)
- ESG data
- M&A deal data

**Key functions**:
- BDH (Bloomberg Data History): Historical time series
- BDP (Bloomberg Data Point): Current data snapshot
- FA (Financial Analysis): Company financial statements

**How to cite**: "Data obtained from Bloomberg L.P., accessed on [date] via Bloomberg Terminal."

### World Bank Open Data

**Provider**: The World Bank
**Access**: Free (data.worldbank.org)
**Coverage**: Development indicators for 200+ countries, 1960-present

**Key indicators for finance**:
- GDP per capita (NY.GDP.PCAP.CD)
- Inflation (FP.CPI.TOTL.ZG)
- Stock market capitalization to GDP (CM.MKT.LCAP.GD.ZS)
- Domestic credit to private sector (FS.AST.PRVT.GD.ZS)
- Rule of law index (various governance indicators)

**How to cite**: "Data from World Bank, World Development Indicators database, [indicator name], accessed [date]."

### IMF Data

**Provider**: International Monetary Fund
**Access**: Free (data.imf.org)
**Coverage**: International financial statistics, balance of payments, direction of trade

**Key datasets**:
- **International Financial Statistics (IFS)**: Exchange rates, interest rates, prices, national accounts
- **Balance of Payments Statistics**: Current account, capital flows
- **Direction of Trade Statistics (DOTS)**: Bilateral trade flows
- **World Economic Outlook (WEO)**: GDP forecasts, fiscal data

**How to cite**: "Data from International Monetary Fund, [Dataset name], accessed [date]."

### Additional Specialized Databases

| Database | Coverage | Access | Best For |
|----------|----------|--------|----------|
| **IBES** | Analyst earnings forecasts | WRDS | Earnings surprises, analyst behavior |
| **SDC Platinum** | M&A deals, IPOs, debt issuance | University subscription | Corporate events |
| **TAQ** | Intraday trades and quotes (NYSE) | WRDS | Market microstructure, HFT |
| **TRACE** | Corporate bond transactions | WRDS | Fixed income liquidity, pricing |
| **13F filings** | Institutional holdings | SEC EDGAR (free) | Institutional investor behavior |
| **ExecuComp** | Executive compensation | WRDS | CEO pay, incentives |
| **BoardEx** | Board of directors data | University subscription | Corporate governance |

## Data Quality Considerations

### Survivorship Bias

**Problem**: Databases may only include currently active firms, excluding those that failed, merged, or delisted.

**Impact**: Overstates average returns (dead firms had below-average returns before dying).

**Solution**: Use CRSP delisting returns. When a firm delists, its final return is recorded. Include these in your sample.

### Look-Ahead Bias

**Problem**: Using information that was not publicly available at the time.

**Impact**: Inflates apparent predictability of returns or events.

**Solution**: Lag accounting data by 3-6 months when using it to predict returns. Use point-in-time databases when available.

### Backfill Bias

**Problem**: When new firms are added to a database, their historical data may be backfilled, but only if they survived long enough to be added.

**Impact**: Similar to survivorship bias -- inflates historical returns.

**Solution**: Use "as-reported" data rather than restated data. Note when your database was accessed.

## Worked Example: Constructing a Research Dataset

**Research question**: Does institutional ownership reduce earnings management?

**Step 1: Identify needed data**
- Earnings management measure: Discretionary accruals (from Compustat)
- Institutional ownership: 13F filings (from Thomson Reuters Institutional Holdings via WRDS)
- Control variables: Firm size, leverage, ROA, auditor quality (from Compustat)

**Step 2: Specify sample**
- Period: 2010-2024
- Universe: All US common stocks in CRSP (share codes 10, 11)
- Exclusions: Financial firms (SIC 6000-6999), utilities (SIC 4900-4999)
- Merge: CRSP/Compustat via PERMNO-GVKEY link table

**Step 3: Data citation paragraph**
> "We construct our sample from three sources. Financial statement data are from Compustat North America Annual File. Stock return data and delisting information are from the CRSP Monthly Stock File. Institutional ownership data are from the Thomson Reuters Institutional Holdings (13F) database. All data are accessed via WRDS on March 1, 2026. We merge CRSP and Compustat using the CRSP/Compustat Merged database link table, requiring a valid PERMNO-GVKEY match."

## Common Mistakes

1. **Not specifying the exact database and access date**: "Data from Bloomberg" is insufficient. Specify the function, fields, and access date.

2. **Ignoring survivorship bias**: Using only currently listed firms systematically biases your results. Always include delisted firms from CRSP.

3. **Confusing Compustat variables**: AT is total assets, ACT is current assets. One letter can change your entire analysis. Always verify variable definitions in the data dictionary.

4. **Look-ahead bias in merging**: Merging December 2023 accounting data with January 2024 returns assumes the accounting data was available on January 1 -- it was not. Lag by at least 3 months.

5. **Not documenting sample construction**: Your methodology section must explain every step from raw database to final sample, including all filters and exclusions.

6. **Using free data without understanding its limitations**: yfinance data may have errors in adjusted prices around splits. FRED data may be revised after initial release.

## Key References

- Beaver, W.H., McNichols, M.F. & Price, R.A. (2007). "Delisting Returns and Their Effect on Accounting-Based Market Anomalies." *Journal of Accounting and Economics*, 43(2-3), 341-368.
- Shumway, T. (1997). "The Delisting Bias in CRSP Data." *Journal of Finance*, 52(1), 327-340.
- WRDS Research Team. *WRDS Data Manual*. Available at wrds-www.wharton.upenn.edu.
- Fama, E.F. & French, K.R. (1993). "Common Risk Factors in the Returns on Stocks and Bonds." *Journal of Financial Economics*, 33(1), 3-56.
