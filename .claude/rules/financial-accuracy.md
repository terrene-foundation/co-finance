# Financial Accuracy in Coursework and Research

## Scope

These rules apply to all academic work involving financial calculations, data analysis, valuation, risk metrics, or portfolio analytics — including problem sets, essays, research papers, thesis chapters, and presentations.

## MUST Rules

### 1. Use Appropriate Precision for Financial Values

All monetary values and financial calculations in coursework MUST use appropriate precision. Rounding errors can compound and distort results, especially in multi-step calculations.

**Correct**:

- Carry at least 4 decimal places through intermediate calculations, then round the final answer as appropriate.
- Report currency values to 2 decimal places (e.g., $1,249.37).
- Report percentages to 2 decimal places unless the context demands more (e.g., 7.25%).
- Be consistent within a single paper or assignment — do not mix rounding conventions.

**Incorrect**:

- Rounding intermediate steps aggressively (e.g., rounding a discount factor to 2 decimal places before multiplying by cash flows).
- Reporting a bond yield as "about 5%" when the precise figure matters for the analysis.

**Enforced by**: peer-reviewer
**Violation**: HIGH priority fix

### 2. Cite Formulas with Sources

All financial formulas used in coursework MUST include a citation to the source — textbook, academic paper, or authoritative standard.

**Correct**:

> The Sharpe Ratio is defined as (Rp - Rf) / sigma_p, where Rp is the portfolio return, Rf is the risk-free rate, and sigma_p is the standard deviation of portfolio returns (Sharpe, 1966).

> The Black-Scholes call option price is given by C = S * N(d1) - K * e^(-rT) * N(d2) (Black & Scholes, 1973; see also Hull, 2022, Ch. 15).

**Incorrect**:

> The Sharpe Ratio is (return minus risk-free rate) divided by standard deviation.

(No attribution — the reader cannot verify the formula or consult the original source.)

**Enforced by**: peer-reviewer, citation-specialist
**Violation**: HIGH priority fix

### 3. Validate Calculations Against Known Benchmarks

When performing financial calculations, you MUST cross-check results against independently verified benchmarks — textbook examples, published datasets, or values from Bloomberg/WRDS.

**Correct**:

- "Using the inputs from Hull (2022), Example 15.6 (S=42, K=40, T=0.5, r=10%, sigma=20%), the Black-Scholes call price should be approximately $4.76. My calculation yields $4.76, confirming the formula is applied correctly."

**Incorrect**:

- Presenting a calculated value with no sanity check against a known reference.

**Enforced by**: peer-reviewer
**Violation**: HIGH priority fix

### 4. Address Edge Cases and Limitations

Financial analysis MUST acknowledge and handle edge cases and limitations:

- What happens to the Sharpe Ratio when returns have zero volatility? (Division by zero — the ratio is undefined.)
- What if the sample period is too short to be statistically meaningful?
- What if the data contains missing values, survivorship bias, or look-ahead bias?
- Are there outliers that distort the analysis?

Always state assumptions explicitly and note where results may be sensitive to those assumptions.

**Enforced by**: peer-reviewer
**Violation**: HIGH priority fix

### 5. Use Standard Financial Parameters with Definitions

When using standard financial parameters, MUST define them clearly and use consistent conventions throughout the work.

**Common parameters to define on first use**:

- **Trading days per year**: 252 (NYSE/NASDAQ convention, excluding weekends and approximately 10 holidays)
- **Months per year**: 12
- **Weeks per year**: 52
- **Day-count convention**: Specify whether using Actual/360, Actual/365, 30/360, etc.

**Correct**:

> "Daily returns are annualized using 252 trading days per year, the standard convention for U.S. equity markets (see Bodie, Kane, & Marcus, 2021, Ch. 5)."

**Incorrect**:

> "We multiply by 252" (without explaining what 252 represents or why it was chosen).
> "We annualize using 365 days" (incorrect for equity markets — this is a calendar day count, not a trading day count).

**Enforced by**: peer-reviewer
**Violation**: HIGH priority fix

### 6. Disclose Methodology for Return Calculations

Any return calculation presented in coursework or research MUST disclose the methodology, including:

- **Simple vs. log (continuously compounded) returns**: Which was used and why?
- **Arithmetic vs. geometric mean**: Arithmetic mean overstates compounded growth; geometric mean reflects actual compounding.
- **Gross vs. net of fees/costs**: Are transaction costs, management fees, or taxes included?
- **Compounding convention**: Daily, monthly, or annual compounding?
- **Nominal vs. real returns**: Has inflation been accounted for?

**Correct**:

> "We compute annualized returns using the geometric mean of monthly simple returns over 60 months, gross of transaction costs. Returns are nominal (not adjusted for inflation)."

**Incorrect**:

> "The portfolio returned 12% per year." (Simple or compound? Over what period? Gross or net? Nominal or real?)

**Enforced by**: peer-reviewer
**Violation**: HIGH priority fix

### 7. Distinguish Between Nominal and Real Values

When presenting financial data or calculations, MUST clearly state whether values are nominal (current dollars) or real (inflation-adjusted), and which price index was used for adjustment.

**Correct**:

> "GDP figures are reported in real 2020 U.S. dollars, adjusted using the CPI-U index (Bureau of Labor Statistics)."

> "Bond yields are quoted in nominal terms. The real yield can be approximated by subtracting the expected inflation rate (Fisher equation)."

**Incorrect**:

> "GDP was $21 trillion." (Nominal or real? Which year's dollars?)

**Enforced by**: peer-reviewer
**Violation**: HIGH priority fix

## MUST NOT Rules

### 1. No Unexplained Numbers in Calculations

MUST NOT use numbers in financial formulas or analysis without explaining what they represent.

**Incorrect**:

- "We multiply the daily return by 252." (What is 252?)
- "The discount rate is 0.08." (Why 8%? What does it represent? Where did it come from?)

**Correct**:

- "We annualize the daily return by multiplying by 252, the number of trading days per year on U.S. exchanges."
- "We use a discount rate of 8%, reflecting the company's estimated weighted average cost of capital (see Section 3.2 for the WACC calculation)."

**Consequence**: HIGH priority fix

### 2. No Performance Figures Without Methodology Disclosure

MUST NOT present return figures, risk metrics, or performance comparisons without stating the methodology.

**Incorrect**:

- "Portfolio A outperformed Portfolio B by 3%." (Over what period? Using what return measure? Before or after fees?)

**Correct**:

- "Over the 2019-2024 sample period, Portfolio A achieved an annualized geometric return of 11.2% versus 8.2% for Portfolio B, both gross of fees and in nominal terms."

**Consequence**: HIGH priority fix

### 3. No Unverified Data Presented as Fact

MUST NOT present financial data without verifying it against a reputable source and citing that source.

**Incorrect**:

- "Apple's stock price is $150." (When? From where?)

**Correct**:

- "As of March 14, 2026, Apple's closing price was $189.42 (Yahoo Finance)."

**Consequence**: HIGH priority fix

## Exceptions

Financial accuracy exceptions require:

1. Explicit justification (e.g., approximate figures acceptable in a conceptual discussion where precision is not the point)
2. Documentation in the text (e.g., "For simplicity, we round to the nearest whole number")
3. Approval from peer-reviewer
