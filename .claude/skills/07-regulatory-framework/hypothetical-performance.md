# Hypothetical and Backtested Performance Disclosure

Presenting hypothetical, backtested, or simulated investment performance is one of the most regulated areas of financial communication. This guide covers what disclosures are required, what limitations must be stated, and how to properly label performance results.

**Important**: This document provides general educational guidance. It is not legal advice. Specific compliance requirements depend on your regulatory status (RIA, broker-dealer, exempt entity, or unregistered). Consult qualified legal counsel.

## Why This Matters

Hypothetical performance is inherently misleading because it benefits from hindsight. A strategy "designed" after seeing the data will almost always look better than it would have performed in real time. Regulators take this seriously:

- The SEC has brought enforcement actions against advisers for misleading backtested performance claims
- FINRA prohibits broker-dealers from presenting hypothetical performance in most retail communications
- Even educational platforms should follow best practices to avoid liability

## Types of Performance Results

| Type             | Definition                                                          | Regulatory Treatment                                   |
| ---------------- | ------------------------------------------------------------------- | ------------------------------------------------------ |
| **Actual**       | Verified results from real money, real trades                       | Least restricted; must still be fair and balanced      |
| **Model**        | Theoretical portfolio tracked in real time (paper trading)          | Moderate restrictions; must disclose it is not actual  |
| **Backtested**   | Strategy applied retroactively to historical data                   | Heavy restrictions; extensive disclaimers required     |
| **Hypothetical** | Projections or scenarios (e.g., "if you invested $10,000 at 7%...") | Heavy restrictions; must clearly label as hypothetical |
| **Simulated**    | Monte Carlo or other statistical simulations                        | Heavy restrictions; must disclose assumptions          |

## SEC Guidance

### Investment Advisers (Registered and Exempt)

The SEC's position on backtested performance for investment advisers:

1. **Not per se prohibited**: The SEC does not categorically prohibit showing backtested results, but...
2. **Must not be misleading**: Under the antifraud provisions of the Advisers Act (Section 206), any performance presentation must not be false or misleading
3. **Material limitations must be disclosed**: You must prominently disclose the limitations of backtested results
4. **Fair and balanced**: Presentations must be fair and balanced, not cherry-picking favorable periods

### SEC Marketing Rule (Rule 206(4)-1, effective November 2022)

For registered investment advisers, the Marketing Rule specifically addresses hypothetical performance:

- **May be used** if the adviser meets certain conditions
- Must include **sufficient information** for the audience to understand the hypothetical nature
- Must include **relevant criteria and assumptions**
- Cannot be presented to a **mass audience** without additional safeguards (i.e., must be targeted to sophisticated investors or provided in one-on-one settings)

For educational platforms that are NOT registered investment advisers, these rules do not directly apply, but following them represents best practice.

## FINRA Guidance

For broker-dealers and their associated persons:

- **FINRA Rule 2210** governs communications with the public
- **Hypothetical performance is generally prohibited** in retail communications by broker-dealers
- **Backtested performance** may be used in institutional communications with appropriate disclosures
- **Projections** are prohibited in retail communications (with limited exceptions)

For educational platforms not affiliated with a broker-dealer, FINRA rules do not directly apply, but they represent industry best practice.

## Required Disclosures for Backtested Results

When presenting backtested performance in an educational context, include ALL of the following:

### 1. Nature of Results

Clearly and prominently state that results are backtested/hypothetical.

```text
THESE RESULTS ARE BACKTESTED AND HYPOTHETICAL. THEY DO NOT REPRESENT
ACTUAL TRADING RESULTS.
```

### 2. No Guarantee of Future Performance

```text
PAST PERFORMANCE, WHETHER ACTUAL OR BACKTESTED, IS NOT INDICATIVE OF
FUTURE RESULTS.
```

### 3. Inherent Limitations

Describe the specific limitations:

```text
Backtested results have inherent limitations, including:

(a) They are designed with the benefit of hindsight. The strategy was
    developed or selected after observing historical market data.

(b) They do not reflect actual trading decisions, market conditions,
    or the impact of economic and market factors on decision-making.

(c) They assume perfect execution at historical prices. Actual trading
    involves slippage, partial fills, and execution delays.

(d) They do not account for all transaction costs, fees, taxes, or
    market impact that would affect actual returns.

(e) They may be subject to overfitting — performing well on historical
    data but poorly on future data.
```

### 4. Methodology and Assumptions

Disclose the methodology used:

```text
Methodology:
- Period: [Start date] to [End date]
- Universe: [e.g., S&P 500 constituents as of end date]
- Rebalancing: [e.g., Monthly on last business day]
- Transaction costs: [e.g., Assumed 0.1% per trade / Not included]
- Dividends: [e.g., Reinvested at close / Not included]
- Data source: [e.g., Yahoo Finance historical data]
- Survivorship bias: [e.g., Not addressed / Addressed by using
  point-in-time constituent lists]
```

### 5. Risk of Loss

```text
INVESTING INVOLVES RISK, INCLUDING THE POSSIBLE LOSS OF PRINCIPAL.
There is no assurance that any strategy will achieve its investment
objective.
```

## Proper Labeling

### Chart Labels

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(12, 6))
ax.plot(dates, cumulative_returns)
ax.set_title("HYPOTHETICAL Backtested Performance — Not Actual Results",
             fontsize=12, fontweight="bold")
ax.set_ylabel("Hypothetical Growth of $10,000")

# Add disclaimer
disclaimer = (
    "HYPOTHETICAL BACKTESTED RESULTS — NOT ACTUAL TRADING.\n"
    "Past performance is not indicative of future results.\n"
    "Results do not reflect transaction costs, taxes, or slippage.\n"
    "See full methodology and disclaimers."
)
fig.text(0.5, -0.02, disclaimer, ha="center", fontsize=7,
         color="gray", style="italic",
         transform=ax.transAxes)
plt.tight_layout()
```

### Table Labels

```python
import pandas as pd

# Always label performance tables clearly
results = pd.DataFrame({
    "Year": [2020, 2021, 2022, 2023],
    "Strategy (Hypothetical)": ["12.5%", "18.3%", "-8.2%", "22.1%"],
    "S&P 500 (Actual)": ["18.4%", "28.7%", "-18.1%", "26.3%"],
})

print("=" * 60)
print("HYPOTHETICAL BACKTESTED RESULTS — NOT ACTUAL TRADING")
print("Past performance does not guarantee future results.")
print("=" * 60)
print(results.to_string(index=False))
print("-" * 60)
print("See full methodology and disclaimers.")
```

### Naming Conventions

| Instead of...               | Use...                                                        |
| --------------------------- | ------------------------------------------------------------- |
| "Returns"                   | "Hypothetical Returns" or "Backtested Returns"                |
| "Performance"               | "Hypothetical Performance"                                    |
| "Results"                   | "Simulated Results"                                           |
| "The strategy returned 15%" | "The backtested strategy showed a hypothetical return of 15%" |
| "Growth of $10,000"         | "Hypothetical Growth of $10,000 (Backtested)"                 |

## Common Biases That Must Be Disclosed

### Survivorship Bias

Backtests on current index constituents exclude companies that went bankrupt or were delisted. This inflates historical returns.

**Disclosure**: "This backtest uses the current S&P 500 constituents applied retroactively. It does not account for companies that were removed from the index during the test period (survivorship bias), which may overstate historical returns."

### Look-Ahead Bias

Using information that was not available at the time of the hypothetical trade decision.

**Disclosure**: "Strategy parameters were selected based on analysis of the full historical dataset. In real-time trading, this information would not have been available, which may affect the replicability of these results."

### Selection Bias

Showing only the best-performing backtest among many tested strategies.

**Disclosure**: "Multiple strategies were tested during development. The results shown represent [the strategy selected for presentation / the average of all tested strategies / the strategy with the best risk-adjusted returns]. Other tested strategies may have performed differently."

### Transaction Cost Bias

Ignoring or underestimating the impact of trading costs.

**Disclosure**: "Results [do / do not] include estimated transaction costs of [X% per trade]. Actual transaction costs may vary and could materially affect results, particularly for strategies with high turnover."

## Implementation Pattern: Performance Report Generator

```python
from datetime import datetime


BACKTEST_DISCLAIMER_FULL = """
================================================================================
                    IMPORTANT: HYPOTHETICAL BACKTESTED RESULTS
================================================================================

The performance results shown below are HYPOTHETICAL and BACKTESTED. They do NOT
represent actual trading and were generated by retroactive application of a
strategy to historical market data.

LIMITATIONS:
1. Results are designed with the benefit of hindsight
2. No actual money was invested; actual trading involves risk of loss
3. Results may not account for all transaction costs, taxes, or slippage
4. Strategy parameters may be overfit to historical data
5. Past performance is NOT indicative of future results

ASSUMPTIONS:
- Period: {start_date} to {end_date}
- Transaction costs: {transaction_costs}
- Data source: {data_source}
- Rebalancing: {rebalancing}
- Survivorship bias: {survivorship}

NO GUARANTEE: There is no guarantee that any investment strategy will achieve
its objectives. All investments involve risk, including the possible loss of
principal.

This content is for EDUCATIONAL PURPOSES ONLY and does not constitute financial
advice. Consult a qualified financial advisor before making investment decisions.
================================================================================
"""


def generate_backtest_report(results, config):
    """Generate a properly disclaimed backtest report."""

    disclaimer = BACKTEST_DISCLAIMER_FULL.format(
        start_date=config.get("start_date", "N/A"),
        end_date=config.get("end_date", "N/A"),
        transaction_costs=config.get("transaction_costs", "Not included"),
        data_source=config.get("data_source", "N/A"),
        rebalancing=config.get("rebalancing", "N/A"),
        survivorship=config.get("survivorship", "Not addressed"),
    )

    report = disclaimer + "\n"
    report += f"Strategy: {config.get('strategy_name', 'Unnamed')}\n"
    report += f"Hypothetical Total Return: {results.get('total_return', 0):.2%}\n"
    report += f"Hypothetical Annual Return: {results.get('annual_return', 0):.2%}\n"
    report += f"Hypothetical Max Drawdown: {results.get('max_drawdown', 0):.2%}\n"
    report += f"Hypothetical Sharpe Ratio: {results.get('sharpe', 0):.2f}\n"
    report += f"\nReport generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
    report += "\nFor educational purposes only. Not financial advice.\n"

    return report
```

## Common Pitfalls

1. **Burying the disclaimer**: Putting the disclaimer in a footnote while prominently displaying impressive returns. The disclaimer must be as prominent as the results.

2. **Cherry-picking periods**: Showing only the best-performing time period. If you show a backtest for 2020-2023, also discuss what happened in other periods.

3. **Comparing hypothetical to actual**: Showing backtested strategy returns next to actual benchmark returns without clearly labeling which is hypothetical.

4. **Using the word "would"**: "This strategy would have returned 20%" implies certainty. Use "This backtested strategy showed a hypothetical return of 20%" instead.

5. **Omitting losing periods**: If the strategy had drawdowns, show them. Cherry-picking only positive years is misleading.

## Cross-References

- See **[sec-educational-rules](sec-educational-rules.md)** for the broader regulatory framework
- See **[disclaimer-templates](disclaimer-templates.md)** for ready-to-use disclaimer text
- See **[06-python-finance/backtrader-guide](../06-python-finance/backtrader-guide.md)** for building backtests with proper output
- See **[06-python-finance/visualization](../06-python-finance/visualization.md)** for adding disclaimers to charts
