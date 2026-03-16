# Data Sourcing for Research Papers and Coursework

## Scope

These rules apply to all academic work that uses financial data, market data, economic indicators, or statistical datasets — including research papers, thesis chapters, problem sets, case studies, and presentations.

## MUST Rules

### 1. Cite the Data Provider

All financial data used in academic work MUST identify the data provider, the specific dataset, and any licensing or access constraints.

**Correct**:

> "Daily adjusted closing prices for S&P 500 constituents were obtained from the Center for Research in Security Prices (CRSP) database, accessed via Wharton Research Data Services (WRDS), for the period January 2010 through December 2024."

> "U.S. Consumer Price Index (CPI-U) data were obtained from the Federal Reserve Economic Data (FRED) database, Federal Reserve Bank of St. Louis, Series ID: CPIAUCSL."

**Incorrect**:

> "We downloaded stock prices for our analysis." (From where? Which dataset? What time period?)

**Reputable Data Sources for Academic Work**:

| Source | Data Type | Access | Notes |
|--------|-----------|--------|-------|
| **WRDS / CRSP** | U.S. equity prices, returns, indices | University subscription | Gold standard for academic equity research |
| **Compustat** (via WRDS) | Financial statements, fundamentals | University subscription | Standard for accounting/corporate finance research |
| **FRED** (Federal Reserve) | Economic indicators, interest rates, inflation | Free, public | Authoritative source for U.S. macroeconomic data |
| **World Bank Open Data** | Global development indicators, GDP, trade | Free, public | Cross-country comparisons and development economics |
| **IMF Data** | Balance of payments, exchange rates, WEO | Free, public | International macroeconomic and financial data |
| **Bloomberg Terminal** | Real-time and historical market data | University terminal | Comprehensive but access may be restricted; note licensing |
| **Refinitiv / Datastream** | Global equities, fixed income, economics | University subscription | Wide international coverage |
| **Yahoo Finance** | Stock prices, basic financials | Free | Acceptable for coursework; less rigorous for thesis research |
| **Ken French Data Library** | Factor returns (Fama-French) | Free, public | Standard source for asset pricing factor data |
| **SEC EDGAR** | Company filings (10-K, 10-Q, proxy statements) | Free, public | Primary source for U.S. public company disclosures |

**Enforced by**: peer-reviewer, citation-specialist
**Violation**: HIGH priority fix

### 2. Specify Data Characteristics

All data used in analysis MUST include metadata describing its characteristics:

- **Date range**: Start and end dates of the sample period
- **Frequency**: Daily, weekly, monthly, quarterly, or annual
- **Adjustments**: Whether prices are adjusted for splits, dividends, or inflation
- **Currency**: The currency denomination of financial data
- **Access date**: When the data was retrieved (important because databases are updated retroactively)

**Correct**:

> "We use monthly total returns (including dividends) for 500 U.S. large-cap stocks from CRSP, January 2000 through December 2024, denominated in U.S. dollars. Data were accessed on January 15, 2026."

**Incorrect**:

> "We collected return data for U.S. stocks." (What frequency? Adjusted how? Over what period?)

**Enforced by**: peer-reviewer
**Violation**: HIGH priority fix

### 3. Acknowledge Market Holidays and Data Gaps

When working with time-series financial data, MUST acknowledge and explain how market holidays, weekends, and data gaps are handled.

**Key considerations**:

- **Weekends and holidays**: U.S. equity markets are closed on weekends and approximately 10 federal holidays per year. There is no trading data for these days.
- **Half-day sessions**: Some trading days have shortened hours (e.g., day before Thanksgiving, Christmas Eve).
- **Cross-market alignment**: If comparing data from multiple exchanges (e.g., NYSE and Tokyo Stock Exchange), trading calendars differ. Explain how you aligned the data.
- **Missing data**: If your dataset has gaps beyond normal closures, explain how you handled them (e.g., forward-fill, interpolation, exclusion).

**Correct**:

> "Missing values due to market holidays were forward-filled using the last available trading day's price. No gaps exceeding three consecutive business days were observed in the sample."

**Incorrect**:

> Presenting return calculations without acknowledging that the dataset skips weekends and holidays, potentially leading a reader to assume continuous data.

**Enforced by**: peer-reviewer
**Violation**: HIGH priority fix

### 4. Validate Data Quality

Before using financial data in analysis, MUST perform basic quality checks and document the results:

- **Missing values**: How many observations are missing? Is the missing rate acceptable?
- **Outliers**: Are there any extreme values that could distort results (e.g., a 90% single-day return suggesting a data error or unadjusted stock split)?
- **Survivorship bias**: Does the dataset include only firms that survived to the end of the sample, or does it include delisted firms?
- **Look-ahead bias**: Does the analysis use information that would not have been available at the time of the decision being modeled?
- **Duplicate observations**: Are there repeated entries for the same date/security?

**Correct**:

> "We screened the sample for data quality. Three stocks were excluded due to more than 20% missing daily returns. Observations with single-day absolute returns exceeding 50% were flagged and verified against corporate action records (splits, mergers). The final sample consists of 487 stocks with complete monthly return data."

**Incorrect**:

> Using raw downloaded data without any quality checks, potentially basing conclusions on erroneous data.

**Enforced by**: peer-reviewer
**Violation**: HIGH priority fix

### 5. Cite Data in the Reference List

All data sources MUST appear in the reference list or bibliography, not just in the body text. Follow your required citation style.

**APA Example**:

> Federal Reserve Bank of St. Louis. (2026). *10-Year Treasury Constant Maturity Rate* [Data set]. FRED Economic Data. https://fred.stlouisfed.org/series/DGS10

> Center for Research in Security Prices. (2026). *CRSP US Stock Database* [Data set]. Wharton Research Data Services. https://wrds-www.wharton.upenn.edu/

**Chicago Example**:

> Federal Reserve Bank of St. Louis. "10-Year Treasury Constant Maturity Rate." FRED Economic Data. Accessed March 1, 2026. https://fred.stlouisfed.org/series/DGS10.

**Enforced by**: citation-specialist
**Violation**: HIGH priority fix

## MUST NOT Rules

### 1. No Unattributed Data

MUST NOT present financial data in papers, tables, or charts without stating where it came from. Every number should be traceable to a source.

**Incorrect**:

- A table of stock returns with no source note.
- A chart of GDP growth with no data attribution.
- "The risk-free rate is 5%." (From where? As of when?)

**Consequence**: HIGH priority fix

### 2. No Assumptions of Continuous Markets

MUST NOT treat financial time series as continuous (available every calendar day). Equity markets are open approximately 252 days per year, not 365. Assuming otherwise leads to incorrect annualization and return calculations.

**Incorrect**:

- "We annualize daily returns by multiplying by 365." (Should be 252 for equities.)
- "The dataset should have 1,825 observations over 5 years." (That assumes every calendar day has data.)

**Consequence**: HIGH priority fix

### 3. No Mixing of Incompatible Data Without Disclosure

MUST NOT combine data from different sources, frequencies, or time zones without explicitly disclosing and justifying the approach.

**Incorrect**:

- Merging daily U.S. equity data with monthly European bond data without explaining the alignment method.
- Combining Yahoo Finance data with Bloomberg data without noting potential differences in adjustment methodology.

**Consequence**: HIGH priority fix

## Exceptions

Data sourcing exceptions may apply when:

1. The assignment explicitly uses hypothetical or textbook data (clearly label it as such)
2. The instructor provides a specific dataset for the assignment
3. The analysis is purely theoretical with no empirical component
4. Sample or illustrative data is used in a methodology section, clearly labeled as "for illustration only"
