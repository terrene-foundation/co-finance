# Disclaimer & Compliance Rules

## Scope

These rules apply to all files generating user-facing financial content, including API responses, rendered templates, reports, educational materials, and any output displaying returns, performance metrics, or investment recommendations.

## MUST Rules

### 1. Include "Not Financial Advice" Disclaimer

Any content showing returns, performance data, or investment recommendations MUST include a disclaimer.

**Standard Disclaimer Template**:

```
DISCLAIMER: This content is for educational and informational purposes only and does not
constitute financial advice, investment advice, or a recommendation to buy, sell, or hold
any security. Past performance is not indicative of future results. Consult a qualified
financial advisor before making investment decisions.
```

**Short Disclaimer Template** (for space-constrained UI elements):

```
For educational purposes only. Not financial advice. Past performance does not guarantee future results.
```

**Implementation Example**:

```python
DISCLAIMER_FULL = (
    "This content is for educational and informational purposes only and does not "
    "constitute financial advice, investment advice, or a recommendation to buy, sell, "
    "or hold any security. Past performance is not indicative of future results. "
    "Consult a qualified financial advisor before making investment decisions."
)

DISCLAIMER_SHORT = (
    "For educational purposes only. Not financial advice. "
    "Past performance does not guarantee future results."
)

def render_performance_report(data):
    return {
        "results": data,
        "disclaimer": DISCLAIMER_FULL,
    }
```

**Enforced by**: intermediate-reviewer
**Violation**: BLOCK commit

### 2. Mark Hypothetical and Backtested Results Clearly

Any content showing backtested, simulated, or hypothetical performance MUST be clearly labeled as such.

**Required Label Template**:

```
HYPOTHETICAL PERFORMANCE RESULTS HAVE MANY INHERENT LIMITATIONS. NO REPRESENTATION IS
BEING MADE THAT ANY ACCOUNT WILL OR IS LIKELY TO ACHIEVE PROFITS OR LOSSES SIMILAR TO
THOSE SHOWN. THERE ARE FREQUENTLY SHARP DIFFERENCES BETWEEN HYPOTHETICAL PERFORMANCE
RESULTS AND THE ACTUAL RESULTS SUBSEQUENTLY ACHIEVED BY ANY PARTICULAR TRADING PROGRAM.
```

**Short Label Template**:

```
HYPOTHETICAL/BACKTESTED RESULTS: These results are based on simulated or hypothetical
performance that has inherent limitations. These results do not represent actual trading.
```

**Implementation Example**:

```python
def format_backtest_results(results):
    return {
        "label": "HYPOTHETICAL BACKTESTED PERFORMANCE",
        "results": results,
        "warning": BACKTEST_DISCLAIMER,
        "methodology": results.methodology_description,
    }
```

**Enforced by**: intermediate-reviewer
**Violation**: BLOCK commit

### 3. Include Data Source Attribution

All financial data presented to users MUST include the data source and the date/time of retrieval.

**Correct**:

```python
{
    "price": "152.34",
    "data_source": "Yahoo Finance (yfinance)",
    "as_of": "2026-03-11T16:00:00-05:00",
    "disclaimer": DISCLAIMER_SHORT,
}
```

**Incorrect**:

```
{
    "price": "152.34",  # Where did this come from? When?
}
```

**Enforced by**: intermediate-reviewer
**Violation**: HIGH priority fix

### 4. Use Past Tense for Historical Performance

All references to historical performance MUST use past tense to avoid implying future expectations.

**Correct**:

- "The portfolio returned 12.5% over the past year."
- "This strategy generated an annualized Sharpe ratio of 1.4 during the backtest period."
- "The S&P 500 gained 24% in 2023."

**Incorrect**:

```
"This portfolio returns 12.5% per year."
"This strategy generates a Sharpe ratio of 1.4."
"The S&P 500 gains 24%."
```

**Enforced by**: intermediate-reviewer
**Violation**: HIGH priority fix

### 5. Include Risk Warnings with Investment Content

Any content discussing specific investments, strategies, or asset classes MUST include relevant risk warnings.

**Risk Warning Template**:

```
RISK WARNING: All investments carry risk, including the potential loss of principal.
The value of investments can go down as well as up. Different investment strategies
carry different levels of risk. Diversification does not guarantee profit or protect
against loss in declining markets.
```

**Strategy-Specific Warnings** (use as appropriate):

```python
RISK_WARNINGS = {
    "leverage": "Leveraged investments amplify both gains and losses and may result in losses exceeding the original investment.",
    "options": "Options involve significant risk and are not suitable for all investors. Options can expire worthless, resulting in a total loss of the premium paid.",
    "international": "International investments involve additional risks including currency fluctuation, political instability, and differing accounting standards.",
    "concentration": "Concentrated portfolios carry higher risk than diversified portfolios. A decline in a single holding may significantly impact overall performance.",
    "crypto": "Cryptocurrency investments are highly volatile, largely unregulated, and may result in total loss of investment.",
}
```

**Enforced by**: intermediate-reviewer
**Violation**: HIGH priority fix

## MUST NOT Rules

### 1. No Promises of Future Returns

MUST NOT use language that implies or guarantees future investment performance.

**Detection Patterns**:

```
"This strategy will return 15% annually."
"You can expect to earn..."
"Guaranteed returns of..."
"This investment will outperform..."
"You will make money by..."
```

**Correct Alternative**:

```
"During the backtested period (2015-2024), this strategy returned an annualized 15%. Past performance is not indicative of future results."
```

**Consequence**: BLOCK commit

### 2. No Backtested Results Presented as Actual Performance

MUST NOT present simulated, backtested, or hypothetical results without clearly labeling them as such.

**Detection Patterns**:

```
"Our strategy achieved a 25% return."          # Was this real or backtested?
"Portfolio performance: +18.3%"                 # Actual or simulated?
```

**Correct Alternative**:

```
"BACKTESTED RESULT: The strategy achieved a hypothetical 25% return during the simulation period (Jan 2020 - Dec 2024). See methodology notes and hypothetical performance disclaimer below."
```

**Consequence**: BLOCK commit

### 3. No Investment Content Without Risk Warnings

MUST NOT display investment recommendations, portfolio allocations, or strategy suggestions without accompanying risk disclosures.

**Consequence**: BLOCK commit

## Disclaimer Placement Guidelines

- **Reports/Pages**: Full disclaimer at the top or bottom of every page
- **API Responses**: Include `disclaimer` field in all responses containing financial data
- **Charts/Visualizations**: Short disclaimer below every chart showing performance
- **Educational Content**: Full disclaimer at the beginning of each lesson/module containing financial examples
- **Email/Notifications**: Short disclaimer in footer of any message containing financial data

## Exceptions

Disclaimer exceptions require:

1. Legal review confirming the content does not constitute financial advice
2. Documentation of the rationale
3. Approval from intermediate-reviewer
