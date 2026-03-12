# Overconfidence and Anchoring

Overconfidence leads investors to trade too much and take concentrated positions. Anchoring causes investors to fixate on irrelevant reference points. Both biases distort decision-making in predictable, measurable ways.

**Educational Disclaimer**: This content is for educational purposes only. It does not constitute financial or investment advice.

## Overconfidence Bias

### Three Forms of Overconfidence

1. **Overestimation**: Believing your skills, knowledge, or forecasts are better than they actually are
2. **Overplacement**: Believing you are better than others (above-average effect)
3. **Overprecision**: Being too certain about the accuracy of your beliefs (narrow confidence intervals)

### Overconfidence in Investing

**Research finding**: Brad Barber and Terrance Odean (2000, "Trading is Hazardous to Your Wealth") studied 66,465 households with brokerage accounts from 1991-1996. Key findings:

- The average household turned over 75% of their portfolio annually
- The most active traders (top quintile by turnover) earned 11.4% annually
- The least active traders earned 18.5% annually
- The market return was 17.9%
- **Active trading reduced returns by approximately 6.5 percentage points per year**

The primary driver: overconfidence. Investors who traded more believed they had superior information or analytical skill. In reality, their trading generated transaction costs and taxes without adding value.

### Gender and Overconfidence

Barber and Odean (2001, "Boys Will Be Boys") found that men traded 45% more frequently than women, resulting in 1% lower annual returns. This is consistent with research showing that overconfidence is, on average, more pronounced in men than women across many domains.

### How Overconfidence Manifests

**Overtrading**: Making frequent trades based on the belief that you can time the market or pick stocks.

```python
def overtrading_cost(annual_return_before_costs, turnover_rate,
                      transaction_cost, years):
    """
    Show how overtrading erodes returns.

    Educational illustration — not financial advice.
    """
    annual_trading_cost = turnover_rate * transaction_cost * 2  # Buy + sell
    net_return = annual_return_before_costs - annual_trading_cost

    # Compare: passive investor
    passive_cost = 0.10 * transaction_cost * 2  # 10% annual turnover
    passive_net = annual_return_before_costs - passive_cost

    investment = 100_000
    active_final = investment * (1 + net_return) ** years
    passive_final = investment * (1 + passive_net) ** years

    print(f"COST OF OVERTRADING (Hypothetical, {years}-year period)")
    print(f"=" * 50)
    print(f"Gross annual return:    {annual_return_before_costs:.1%}")
    print(f"Active turnover:        {turnover_rate:.0%}")
    print(f"Transaction cost:       {transaction_cost:.2%} per trade")
    print(f"")
    print(f"Active trader:")
    print(f"  Trading costs/year:   {annual_trading_cost:.2%}")
    print(f"  Net annual return:    {net_return:.2%}")
    print(f"  ${investment:,.0f} -> ${active_final:,.0f}")
    print(f"")
    print(f"Passive investor:")
    print(f"  Trading costs/year:   {passive_cost:.3%}")
    print(f"  Net annual return:    {passive_net:.2%}")
    print(f"  ${investment:,.0f} -> ${passive_final:,.0f}")
    print(f"")
    print(f"Cost of overtrading:    ${passive_final - active_final:,.0f}")

overtrading_cost(
    annual_return_before_costs=0.10,
    turnover_rate=1.5,        # 150% annual turnover
    transaction_cost=0.001,   # 0.1% per trade (bid-ask + commission)
    years=20,
)
```

**Concentrated positions**: Putting too much of a portfolio into a single stock or sector based on the belief that you have special insight.

**Narrow confidence intervals**: When asked "What will the S&P 500 return next year?", an overconfident investor might say "between 8% and 12%" — a range so narrow that the actual answer falls outside it most of the time. Calibrated forecasters use much wider intervals.

```python
def calibration_test():
    """
    Demonstrate the typical overconfidence in prediction intervals.

    If someone is well-calibrated, their 90% confidence intervals
    should contain the actual outcome 90% of the time.

    Educational illustration.
    """
    # Typical results from calibration studies
    print("CALIBRATION TEST RESULTS (Typical Research Finding)")
    print("=" * 55)
    print(f"{'Stated Confidence':<25} {'Should Contain':<20} {'Actually Contains':<20}")
    print("-" * 55)

    # Most people's 90% CI contains the answer only ~50% of the time
    results = [
        ("50% confidence", "50%", "~20%"),
        ("75% confidence", "75%", "~40%"),
        ("90% confidence", "90%", "~50%"),
        ("99% confidence", "99%", "~70%"),
    ]

    for label, should, actual in results:
        print(f"{label:<25} {should:<20} {actual:<20}")

    print()
    print("Interpretation: When people say they are '90% confident',")
    print("they are typically only right about 50% of the time.")
    print("We are systematically too precise in our predictions.")

calibration_test()
```

## Anchoring Bias

### What It Is

Anchoring is the tendency to rely too heavily on the first piece of information encountered (the "anchor") when making decisions, even when the anchor is irrelevant.

### Anchoring in Investing

**Purchase price anchor**: Investors fixate on the price they paid for a stock, treating it as a meaningful reference point. In reality, the market does not care what you paid. The only relevant question is: "Is this stock worth more or less than its current price?"

```python
def anchoring_example():
    """
    Demonstrate how purchase price anchoring affects decisions.

    Educational illustration.
    """
    # Two investors own the same stock at the same time
    current_price = 45
    fair_value_estimate = 40  # Based on fundamental analysis

    investor_a = {"name": "Investor A", "purchase_price": 30}
    investor_b = {"name": "Investor B", "purchase_price": 60}

    print("PURCHASE PRICE ANCHORING")
    print("=" * 55)
    print(f"Stock current price: ${current_price}")
    print(f"Estimated fair value: ${fair_value_estimate}")
    print()

    for inv in [investor_a, investor_b]:
        gain_loss = current_price - inv["purchase_price"]
        pct = gain_loss / inv["purchase_price"]
        print(f"{inv['name']}: Bought at ${inv['purchase_price']}")
        print(f"  Current gain/loss: {pct:+.1%} (${gain_loss:+.0f})")

    print()
    print("Rational analysis: Both investors should consider selling")
    print(f"because the stock (${current_price}) is above fair value (${fair_value_estimate}).")
    print()
    print("Anchored behavior:")
    print(f"  Investor A (bought at $30): 'I have a nice gain, I'll sell'")
    print(f"  Investor B (bought at $60): 'I can't sell at a loss, I'll hold'")
    print()
    print("Neither decision should depend on purchase price.")
    print("The only question: Is it worth more or less than $45 today?")

anchoring_example()
```

**Round number anchors**: Markets show increased trading activity and resistance/support at round numbers ($50, $100, $1,000 for individual stocks; 30,000, 40,000 for the Dow). These numbers have no fundamental significance but serve as psychological anchors.

**Analyst target anchors**: When an analyst sets a price target of $200, investors anchor to that number. Even if the analyst's methodology is flawed or conditions change, the number $200 persists in investors' minds as a reference point.

**52-week high/low anchor**: Investors often view stocks near their 52-week high as "expensive" and stocks near their 52-week low as "cheap." But a stock near its high could still be undervalued, and a stock near its low could still be overvalued.

## Confirmation Bias

**What it is**: Seeking out information that confirms your existing beliefs and ignoring or dismissing information that contradicts them.

**In investing**:

- After buying a stock, an investor reads only bullish articles and analyst reports
- Dismissing negative earnings results as "temporary" while amplifying positive developments
- Following only commentators and analysts who agree with your market outlook
- Interpreting ambiguous news as supportive of your position

**Market example**: An investor who believes that gold will rise seeks out articles about inflation, currency debasement, and geopolitical instability while ignoring articles about central bank tightening, rising real interest rates, and strengthening economic data. Both sets of information are relevant, but confirmation bias filters out the inconvenient evidence.

### The Echo Chamber Effect

Social media amplifies confirmation bias by creating algorithmic echo chambers. If you follow bullish gold accounts, the platform shows you more bullish gold content, reinforcing your existing view and hiding dissenting perspectives.

**Debiasing**: Actively seek out the strongest case against your investment thesis. Ask: "What would have to be true for this investment to fail?" If you cannot articulate specific, plausible failure scenarios, you may not understand the investment well enough.

## Hindsight Bias

**What it is**: After learning the outcome, believing you "knew it all along."

**In investing**:

- After a market crash: "I knew the market was overvalued"
- After a stock doubles: "I knew that company was going to succeed"
- After an investment thesis fails: "I had my doubts from the beginning"

**Why it is harmful**:

1. Prevents learning from mistakes ("I knew it all along, so there's nothing to learn")
2. Inflates overconfidence ("I've been right all along, so I must be good at this")
3. Distorts risk assessment ("That crash was obvious" — but if it was obvious, why didn't more people avoid it?)

**Debiasing**: Keep a written investment journal. Before each investment decision, write down your thesis, your expected outcomes, and your confidence level. Review these notes periodically. The gap between what you predicted and what happened is your actual track record, undistorted by hindsight.

```python
# Investment journal template
JOURNAL_ENTRY = """
INVESTMENT JOURNAL ENTRY
========================
Date: {date}
Security: {ticker}
Action: {action} (BUY/SELL/HOLD)
Price: ${price}

THESIS (Why I'm making this decision):
{thesis}

EXPECTED OUTCOME (12 months):
  Bull case: {bull_case}
  Base case: {base_case}
  Bear case: {bear_case}

CONFIDENCE LEVEL: {confidence}/10

KEY RISKS:
{risks}

REVIEW DATE: {review_date}
========================

[To be filled at review]:
ACTUAL OUTCOME:
THESIS ACCURACY:
WHAT I LEARNED:
"""
```

## Debiasing Strategies Summary

| Bias           | Primary Debiasing Strategy                                                       |
| -------------- | -------------------------------------------------------------------------------- |
| Overconfidence | Track your actual prediction accuracy; widen confidence intervals                |
| Overtrading    | Set trading rules and frequency limits; compare returns to a passive benchmark   |
| Concentration  | Set maximum position sizes before investing; diversify systematically            |
| Anchoring      | Ignore purchase price in hold/sell decisions; use only forward-looking valuation |
| Confirmation   | Actively seek the bear case for every bull thesis (and vice versa)               |
| Hindsight      | Maintain a written investment journal with time-stamped predictions              |

See **[debiasing-strategies](debiasing-strategies.md)** for comprehensive, practical debiasing approaches.

## Common Pitfalls

1. **Using overconfidence research to justify inaction**: The research shows that overtrading hurts returns, not that all trading is bad. Systematic, rules-based approaches can be effective. The problem is discretionary, ego-driven trading.

2. **Dismissing all expert opinions due to anchoring risk**: Analyst targets and expert forecasts contain real information, even if they also serve as anchors. The skill is in using them as one input among many, not as the anchor for your own view.

3. **Confusing confidence with competence**: In financial markets, the most confident voices are often the least accurate. True expertise includes understanding the limits of what you know.

## Cross-References

- See **[cognitive-biases](cognitive-biases.md)** for foundational concepts (prospect theory, mental accounting, framing)
- See **[loss-aversion-herding](loss-aversion-herding.md)** for how loss aversion interacts with overconfidence (holding losers due to both biases)
- See **[debiasing-strategies](debiasing-strategies.md)** for detailed strategies to counteract each bias
- See **[02-market-analysis](../02-market-analysis/SKILL.md)** for analytical frameworks that help overcome anchoring
