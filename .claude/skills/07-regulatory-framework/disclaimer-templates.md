# Disclaimer Templates for Financial Education

Ready-to-use disclaimer templates for financial education platforms. These templates address the most common compliance needs when presenting educational financial content, market data, backtested results, and hypothetical performance.

**Important**: These are starting templates. Have them reviewed by qualified legal counsel to ensure they meet your specific needs, jurisdiction, and use case.

## 1. General Educational Disclaimer

Use on every page, module, or tool that presents financial concepts.

```text
EDUCATIONAL DISCLAIMER

The information provided on this platform is for educational and
informational purposes only. It is not intended as, and should not be
construed as, financial, investment, tax, or legal advice. The content
does not constitute a recommendation or solicitation to buy, sell, or
hold any security or financial product.

You should consult with a qualified financial advisor, tax professional,
or attorney before making any financial decisions. The creators and
operators of this platform are not registered investment advisers,
broker-dealers, or tax professionals.

Any investment decisions you make are solely your responsibility.
Investing involves risk, including the possible loss of principal.
```

### Short Version (for footers, tooltips, banners)

```text
For educational purposes only. Not financial advice. Consult a qualified
financial advisor before making investment decisions. Investing involves
risk, including loss of principal.
```

### Inline Version (for embedding within content)

```text
Note: This example is for educational illustration only and does not
constitute a recommendation to buy, sell, or hold any security.
```

## 2. Backtested Performance Disclaimer

Use whenever displaying results from backtested trading strategies. See also **[hypothetical-performance](hypothetical-performance.md)** for detailed guidance.

```text
BACKTESTED PERFORMANCE DISCLAIMER

The performance results shown are backtested and hypothetical. They do
NOT represent actual trading results. Backtested performance has
significant limitations:

1. BACKTESTED RESULTS ARE HYPOTHETICAL. They were achieved by means of
   retroactive application of a model designed with the benefit of
   hindsight. No representation is made that any account will or is
   likely to achieve profits or losses similar to those shown.

2. BACKTESTED RESULTS DO NOT REFLECT ACTUAL TRADING. No actual money
   was at risk. Actual trading involves the risk of loss, which
   backtested results do not capture.

3. BACKTESTED RESULTS CANNOT ACCOUNT FOR ALL FACTORS. Transaction costs,
   market impact, liquidity constraints, slippage, regulatory changes,
   and other factors may materially affect actual results.

4. THERE IS NO GUARANTEE of future performance. Past performance,
   whether actual or backtested, is not indicative of future results.

5. BACKTESTS MAY BE SUBJECT TO OVERFITTING. Strategies optimized on
   historical data may not perform similarly in future market conditions.

The results shown assume [specify: reinvestment of dividends / no
dividends / specific commission rate / etc.]. Results do not include
the impact of taxes on returns.
```

## 3. Hypothetical Returns Disclaimer

Use when showing projections, simulations (e.g., Monte Carlo), or hypothetical scenarios.

```text
HYPOTHETICAL RETURNS DISCLAIMER

The projections, simulations, and hypothetical examples shown on this
platform are for educational illustration only. They are based on
mathematical models and assumptions that may not reflect actual market
conditions.

IMPORTANT LIMITATIONS:

- Hypothetical results are NOT indicative of future performance.
- The assumptions used (including but not limited to expected returns,
  volatility, inflation rates, and tax rates) are estimates and may
  differ materially from actual outcomes.
- These projections do not account for all risks, including market risk,
  inflation risk, liquidity risk, and geopolitical events.
- Actual investment results will vary and may be significantly different
  from the hypothetical results presented.
- No representation is made that any investor will or is likely to
  achieve results similar to those shown.

The models assume [specify: e.g., a constant annual return of X%,
normally distributed returns, no transaction costs, annual rebalancing].
Changes to these assumptions would significantly alter the results.
```

## 4. Data Source Attribution Template

Use when displaying market data, financial statistics, or economic indicators sourced from third parties.

```text
DATA SOURCE ATTRIBUTION

Market data provided by [Source Name]. [Real-time / Delayed by X minutes /
End-of-day / Historical]. Data is believed to be accurate but is not
guaranteed. [Source Name] makes no warranties regarding the data and
shall not be liable for any errors, omissions, or delays.

[If applicable:] Data is provided for educational and informational
purposes only and may not be redistributed without permission from
[Source Name].

Specific sources:
- Stock prices: [e.g., Yahoo Finance (delayed), Polygon.io (real-time)]
- Economic data: [e.g., Federal Reserve Economic Data (FRED)]
- Financial statements: [e.g., SEC EDGAR filings]
- Index data: [e.g., S&P Dow Jones Indices]

Data may be subject to adjustment, correction, or revision. Historical
data may be restated. Always verify critical data points with the
original source before making financial decisions.
```

### Compact Attribution (for chart footers)

```text
Data: [Source Name]. [Real-time / Delayed X min / Historical].
For educational purposes only.
```

## 5. No-Warranty Disclaimer

Use for tools, calculators, and software provided on the platform.

```text
NO WARRANTY DISCLAIMER

The tools, calculators, and software on this platform are provided
"AS IS" and "AS AVAILABLE" without warranties of any kind, either
express or implied, including but not limited to implied warranties of
merchantability, fitness for a particular purpose, and non-infringement.

The operators of this platform do not warrant that:
- The tools will meet your specific requirements
- The calculations will be accurate, complete, or error-free
- The tools will be available at all times without interruption
- Any errors in the tools will be corrected

You acknowledge that:
- Financial calculations involve assumptions and estimates
- Rounding, data errors, and model limitations may affect results
- The tools are for educational exploration, not professional financial
  planning
- You are solely responsible for verifying any calculations before
  relying on them for financial decisions

IN NO EVENT SHALL THE OPERATORS BE LIABLE FOR ANY DIRECT, INDIRECT,
INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM
YOUR USE OF THE TOOLS OR RELIANCE ON THEIR OUTPUT.
```

## Implementation Patterns

### Python: Adding Disclaimers to Generated Charts

```python
import matplotlib.pyplot as plt

def add_disclaimer(fig, text=None, fontsize=7):
    """Add a standard disclaimer to the bottom of a matplotlib figure."""
    if text is None:
        text = (
            "For educational purposes only. Not financial advice. "
            "Past performance is not indicative of future results."
        )
    fig.text(
        0.5, 0.01, text,
        ha="center", va="bottom",
        fontsize=fontsize, color="gray",
        style="italic",
    )

# Usage
fig, ax = plt.subplots()
ax.plot([1, 2, 3], [100, 110, 105])
ax.set_title("Example Performance Chart")
add_disclaimer(fig)
plt.tight_layout(rect=[0, 0.03, 1, 1])  # Leave room for disclaimer
plt.show()
```

### Python: Adding Disclaimers to Reports

```python
EDUCATIONAL_DISCLAIMER = """
--- EDUCATIONAL DISCLAIMER ---
This report is for educational and informational purposes only.
It does not constitute financial, investment, or tax advice.
Past performance is not indicative of future results.
Consult a qualified financial advisor before making investment decisions.
"""

BACKTEST_DISCLAIMER = """
--- BACKTESTED PERFORMANCE ---
Results shown are hypothetical and backtested. They do NOT represent
actual trading. No guarantee of future performance. Backtested results
have inherent limitations including hindsight bias, and do not reflect
actual market conditions, costs, or liquidity constraints.
"""

def generate_report(strategy_results):
    """Generate a strategy report with appropriate disclaimers."""
    report = EDUCATIONAL_DISCLAIMER + "\n"
    report += f"Strategy: {strategy_results['name']}\n"
    report += f"Period: {strategy_results['start']} to {strategy_results['end']}\n"
    report += f"Hypothetical Return: {strategy_results['return']:.2%}\n"
    report += "\n" + BACKTEST_DISCLAIMER
    return report
```

### HTML/Web: Disclaimer Banner Component

```html
<div class="disclaimer-banner" role="alert" aria-label="Educational disclaimer">
  <p>
    <strong>Educational Content Only</strong> — The information on this page is
    for educational purposes and does not constitute financial advice. Past
    performance is not indicative of future results.
    <a href="/disclaimers">Full disclaimers</a>.
  </p>
</div>

<style>
  .disclaimer-banner {
    background-color: #fff3cd;
    border: 1px solid #ffc107;
    border-radius: 4px;
    padding: 12px 16px;
    margin-bottom: 16px;
    font-size: 13px;
    color: #856404;
  }
</style>
```

## Placement Guidelines

| Content Type          | Disclaimer Location        | Template                         |
| --------------------- | -------------------------- | -------------------------------- |
| Every page            | Footer or banner           | Short General                    |
| Course modules        | Start and end of module    | Full General                     |
| Performance charts    | Below chart, in figure     | Backtested or Hypothetical       |
| Calculators/tools     | Above and below tool       | No-Warranty + General            |
| Data visualizations   | Chart footer               | Data Source Attribution          |
| Backtested strategies | Prominently before results | Full Backtested                  |
| Downloadable reports  | First and last page        | Full General + relevant specific |

## Common Pitfalls

1. **Disclaimer too small or hidden**: Regulators expect disclaimers to be prominent, not buried in fine print. Size, placement, and contrast matter.

2. **One disclaimer for everything**: Different types of content need different disclaimers. A general educational disclaimer is not sufficient for backtested performance results.

3. **Disclaimer contradicts content**: If your content says "you should buy X" and your disclaimer says "not financial advice," the disclaimer does not cure the substantive problem.

4. **Missing on generated outputs**: If users can export charts, reports, or data, the disclaimers must travel with the exported content.

## Cross-References

- See **[sec-educational-rules](sec-educational-rules.md)** for the regulatory framework behind these disclaimers
- See **[hypothetical-performance](hypothetical-performance.md)** for detailed rules on presenting backtested results
- See **[data-licensing](data-licensing.md)** for data source attribution requirements
- See **[06-python-finance/visualization](../06-python-finance/visualization.md)** for adding disclaimers to charts programmatically
