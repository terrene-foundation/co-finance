# Methodology Section

The methodology section describes how you conducted your research in enough detail that another researcher could replicate your study. In finance, this typically means specifying your data sources, sample construction, variable definitions, and statistical models.

## Why the Methodology Section Matters

Your results are only as credible as your method. A reader who does not understand your methodology cannot evaluate your findings. The methodology section is also where reviewers focus most of their scrutiny -- if your method is flawed, your conclusions are unreliable regardless of how impressive the results look.

Think of it as a recipe: someone should be able to follow your instructions and produce the same dish.

## Quantitative vs. Qualitative Research in Finance

### Quantitative (Dominant in Finance)

Uses numerical data and statistical analysis to test hypotheses.

**Examples**: Event studies, panel regressions, time-series analysis, portfolio sorts, Monte Carlo simulations.

**When to use**: When you have a testable hypothesis and access to numerical data (stock returns, financial ratios, economic indicators).

### Qualitative

Uses non-numerical data (interviews, case studies, textual analysis) to explore phenomena.

**Examples**: CEO interview analysis, content analysis of annual reports, case studies of corporate events.

**When to use**: When exploring new phenomena where quantitative data is limited, or when seeking deeper understanding of motivations and processes.

### Mixed Methods

Combines both approaches -- for instance, using interviews to develop hypotheses that are then tested quantitatively.

## Data Sources for Finance Research

### Major Databases

| Database | Coverage | Access | Best For |
|----------|----------|--------|----------|
| **CRSP** | US stock prices, returns, delisting data, 1926-present | University subscription (via WRDS) | Event studies, portfolio returns, market microstructure |
| **Compustat** | US/global financial statement data | University subscription (via WRDS) | Cross-sectional studies of firm characteristics |
| **WRDS** | Aggregator of CRSP, Compustat, IBES, and others | University subscription | One-stop access to most finance databases |
| **Bloomberg** | Real-time and historical global data | Terminal subscription | Current market data, fixed income, derivatives |
| **FRED** | US macroeconomic and financial data | Free (Federal Reserve Bank of St. Louis) | Interest rates, GDP, unemployment, inflation |
| **World Bank WDI** | Global development indicators | Free | Cross-country studies, macro-finance |
| **IMF IFS** | International financial statistics | Free/subscription | Exchange rates, balance of payments, reserves |
| **Thomson Reuters/Refinitiv** | Global financial data | University subscription | M&A data, analyst forecasts, ownership |
| **IBES** | Analyst earnings forecasts | University subscription (via WRDS) | Earnings surprises, analyst behavior |
| **SDC Platinum** | M&A, IPO, debt issuance data | University subscription | Corporate events, deal characteristics |

### Citing Data Sources

Always specify:
1. The database name and provider
2. The specific dataset or table used
3. The date of data extraction
4. Any filters or selection criteria applied

**Example**: "Stock return data are from the CRSP Monthly Stock File, accessed via WRDS on January 15, 2026. We include all NYSE, AMEX, and NASDAQ common stocks (share codes 10 and 11) from January 2010 to December 2024."

## Sample Selection

### Describing Your Sample

Explain every step of sample construction clearly:

1. **Starting universe**: Where did you begin?
2. **Inclusion criteria**: What firms/observations did you keep?
3. **Exclusion criteria**: What did you remove, and why?
4. **Final sample**: How many observations remain?

### Worked Example: Sample Construction

> "We begin with all firms in the CRSP/Compustat merged database from 2010 to 2024 (initial universe: 85,432 firm-year observations). We exclude financial firms (SIC codes 6000-6999) because their capital structures are not comparable to non-financial firms (remaining: 67,891). We further exclude firms with negative book equity (remaining: 65,234) and those with missing data for our key variables (remaining: 58,117). Our final sample consists of 58,117 firm-year observations from 5,892 unique firms."

**Present this as a table**:

| Filter | Observations Dropped | Remaining |
|--------|---------------------|-----------|
| CRSP/Compustat merged, 2010-2024 | -- | 85,432 |
| Exclude financial firms (SIC 6000-6999) | 17,541 | 67,891 |
| Exclude negative book equity | 2,657 | 65,234 |
| Require non-missing key variables | 7,117 | 58,117 |

### Common Sample Issues in Finance

- **Survivorship bias**: Only including firms that survived to the end of the sample period. Use CRSP delisting data to include dead firms.
- **Look-ahead bias**: Using information that was not available at the time. Ensure accounting data is lagged appropriately (Compustat data is typically available 3-6 months after fiscal year end).
- **Selection bias**: Your sample may not be representative. Discuss who is included and excluded.

## Variable Definitions

### Dependent Variable

State precisely what you are measuring and how.

**Example**: "Our dependent variable is the three-day cumulative abnormal return (CAR[-1,+1]) around dividend announcement dates, calculated using the market model with a 200-day estimation window ending 20 days before the event."

### Independent Variables

Define each variable with its formula and data source.

**Example**:
> "We define the following independent variables:
> - **DivChange**: Percentage change in quarterly dividends per share, calculated as (D_t - D_{t-1}) / D_{t-1}
> - **Size**: Natural logarithm of market capitalization (price x shares outstanding from CRSP) measured at fiscal year end
> - **Leverage**: Total debt (Compustat: DLTT + DLC) divided by total assets (AT)
> - **ROA**: Net income (NI) divided by total assets (AT)"

### Control Variables

Explain why each control variable is included -- it should control for an alternative explanation.

**Example**: "We control for firm size (ln(MktCap)) because larger firms have richer information environments, which may reduce the signaling value of dividends (Atiase, 1985)."

## Statistical Models

### Specify the Model

Write out the regression equation explicitly.

> **CAR_i = alpha + beta_1 x DivChange_i + beta_2 x Size_i + beta_3 x Leverage_i + beta_4 x ROA_i + epsilon_i**

### Explain Your Choices

- **Why this model?** (OLS, logit, panel regression, event study -- justify the choice)
- **Fixed effects**: Do you include firm fixed effects? Year fixed effects? Industry fixed effects? Why?
- **Standard errors**: How are they clustered? (By firm? By year? Two-way clustering?)
- **Endogeneity**: What is your identification strategy?

### Common Econometric Approaches in Finance

| Method | When to Use | Key Assumption |
|--------|------------|----------------|
| **OLS** | Cross-sectional analysis | Exogeneity of regressors |
| **Panel regression (fixed effects)** | Multiple firms over time | Unobserved heterogeneity is time-invariant |
| **Event study** | Measuring market reaction to an event | Market model correctly estimates expected returns |
| **Difference-in-differences** | Natural experiment with treatment/control | Parallel trends assumption |
| **Instrumental variables (2SLS)** | Addressing endogeneity | Valid instrument (relevant and excludable) |
| **Logit/probit** | Binary dependent variable | Correct distributional assumption |
| **Fama-MacBeth** | Cross-sectional risk premia | Returns are cross-sectionally independent |

## Limitations

Every methodology has limitations. Acknowledging them demonstrates intellectual honesty and strengthens your paper.

### Common Limitations in Finance Research

1. **Endogeneity**: "We cannot fully rule out reverse causality. While we use lagged independent variables to mitigate this concern, the possibility remains that unobserved factors drive both dividend policy and firm performance."

2. **Generalizability**: "Our sample is limited to US-listed firms and may not generalize to other markets with different institutional environments."

3. **Data limitations**: "We use annual Compustat data, which may mask within-year variation. Higher-frequency data could reveal dynamics not captured in our analysis."

4. **Measurement error**: "Our proxy for information environment (analyst coverage) is an imperfect measure. Alternative proxies, such as forecast dispersion, may capture different aspects of the information environment."

## Common Mistakes

1. **Insufficient detail**: "We ran a regression" is not a methodology. Specify the model, variables, estimation technique, and standard error treatment.

2. **No justification for choices**: Every methodological choice should be justified. Why OLS? Why these controls? Why this sample period?

3. **Ignoring endogeneity**: In finance, most interesting relationships are potentially endogenous. At minimum, acknowledge the concern; ideally, address it with an identification strategy.

4. **Not reporting robustness checks**: Readers want to know if your results survive alternative specifications (different controls, different time periods, different variable definitions).

5. **Vague variable definitions**: "We control for size" -- measured how? Log of market cap? Log of total assets? Revenue? The choice matters.

6. **Missing sample construction details**: Not explaining how you went from the raw database to your final sample. Include a sample selection table.

## Key References

- Angrist, J.D. & Pischke, J.S. (2009). *Mostly Harmless Econometrics*, Princeton University Press.
- Wooldridge, J.M. (2020). *Introductory Econometrics: A Modern Approach*, 7th ed., Cengage.
- Roberts, M.R. & Whited, T.M. (2013). "Endogeneity in Empirical Corporate Finance." In Constantinides, G., Harris, M. & Stulz, R. (eds.), *Handbook of the Economics of Finance*, Vol. 2A, Elsevier.
- Creswell, J.W. & Creswell, J.D. (2018). *Research Design: Qualitative, Quantitative, and Mixed Methods Approaches*, 5th ed., SAGE.
