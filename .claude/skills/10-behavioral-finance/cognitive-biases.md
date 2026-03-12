# Cognitive Biases in Investing

Cognitive biases are systematic errors in thinking that affect how people process information and make decisions. In investing, these biases cause predictable mistakes that can significantly reduce returns. Understanding them is the first step toward making better financial decisions.

**Educational Disclaimer**: This content is for educational purposes only. It does not constitute financial or investment advice.

## Prospect Theory

**Discovered by**: Daniel Kahneman and Amos Tversky (1979, Nobel Prize in Economics 2002)

**What it says**: People evaluate outcomes relative to a reference point (usually their purchase price or current wealth), not in absolute terms. They are:

- **Risk-averse for gains**: Prefer a certain $500 over a 50% chance of $1,000
- **Risk-seeking for losses**: Prefer a 50% chance of losing $1,000 over a certain $500 loss

**Market example**: An investor holds a stock bought at $50. It drops to $30. Rather than sell and accept the certain $20 loss, the investor holds on — taking the risk that it could drop further — because the pain of realizing the loss is too great. Meanwhile, when another stock rises from $50 to $70, the same investor sells quickly to "lock in" the $20 gain, even though the stock might continue rising.

**Impact on portfolio**: This behavior leads to selling winners too early and holding losers too long — a pattern called the disposition effect (see **[loss-aversion-herding](loss-aversion-herding.md)**).

```python
# Prospect theory value function (illustrative)
import numpy as np

def prospect_theory_value(x, alpha=0.88, beta=0.88, lambda_param=2.25):
    """
    Kahneman-Tversky value function.

    - alpha, beta: diminishing sensitivity parameters
    - lambda_param: loss aversion coefficient (losses hurt ~2.25x more)

    Educational illustration of the concept.
    """
    if x >= 0:
        return x ** alpha
    else:
        return -lambda_param * ((-x) ** beta)

# Demonstrate asymmetry
gains_losses = np.linspace(-100, 100, 1000)
values = [prospect_theory_value(x) for x in gains_losses]

# Key insight: the curve is steeper for losses than for gains
# A $50 loss feels roughly as bad as a $100 gain feels good
print(f"Value of +$50 gain:  {prospect_theory_value(50):+.2f}")
print(f"Value of -$50 loss:  {prospect_theory_value(-50):+.2f}")
print(f"Ratio (loss/gain):   {abs(prospect_theory_value(-50)/prospect_theory_value(50)):.2f}x")
```

## Mental Accounting

**What it is**: Treating money differently depending on where it came from or what it is earmarked for, even though money is fungible (a dollar is a dollar).

**Examples in investing**:

- Treating a "bonus" differently from salary — being willing to take more risk with bonus money because it feels like "house money"
- Refusing to sell a losing stock in a taxable account while simultaneously buying the same stock in a retirement account
- Maintaining a savings account earning 2% while carrying credit card debt at 22%
- Treating dividends as "income" and capital gains as "growth" — spending dividends but reinvesting gains, even though total return is what matters

**Market example**: After a big win, an investor takes increasingly risky bets because they are playing with "house money" (profits, not principal). But the profits are just as real as the original investment — losing them has the same financial impact.

**Debiasing**: Focus on total net worth and total return. A dollar of dividend income is the same as a dollar of capital gain. A dollar of bonus is the same as a dollar of salary.

## Framing Effects

**What it is**: Being influenced by how information is presented rather than by the information itself.

**Examples in investing**:

- A fund described as "outperforming 75% of peers" sounds better than "in the bottom quartile of the top half" — even though these could describe the same performance
- "This stock is down 30% from its high" (negative frame) vs "This stock is up 40% from its low" (positive frame) — same stock, different emotional response
- "9 out of 10 years were profitable" (positive) vs "You lose money 10% of the time" (negative)

**Market example**: During the 2020 COVID crash, media framing mattered enormously. "Market drops 34% in three weeks" caused panic. "Market returns to highs within 5 months" (which happened) was the rest of the story, but was unknowable in real time. The framing at the moment of decision drives behavior.

**Debiasing**: Look at the same information from multiple angles. Convert qualitative claims to quantitative ones. Ask "What is the base rate?" rather than reacting to how information is presented.

## Availability Heuristic

**What it is**: Judging the likelihood of events based on how easily examples come to mind, rather than on actual probability.

**Examples in investing**:

- After a market crash, investors overestimate the probability of another crash because the recent one is vivid and memorable
- After reading about a friend's huge gain on a specific stock, overestimating the probability of similar gains
- Overweighting the risk of dramatic events (market crashes) and underweighting the risk of slow-moving ones (inflation eroding purchasing power)

**Market example**: After the 2008 financial crisis, many investors stayed out of the stock market for years because the crash was vividly available in memory. The S&P 500 roughly tripled from its 2009 low through 2015. The availability of the crash memory led investors to overweight crash risk and miss the recovery.

**Debiasing**: Use actual historical data and base rates rather than relying on vivid recent memories. Check: "Is this event actually more likely, or is it just more memorable?"

## Representativeness Heuristic

**What it is**: Judging probability by how much something resembles a typical example (a "representative" case) rather than using actual statistical reasoning.

**Examples in investing**:

- Assuming a company with a great product will be a great stock (great companies can be bad investments if overpriced)
- Assuming that a recent pattern of returns will continue because it "looks like" a trend
- Believing that a fund manager who outperformed for 3 years is skilled rather than lucky (base rate: most short-term outperformance is explained by chance)

**Market example**: In the late 1990s, many investors assumed that any technology company would be a great investment because tech stocks in general were rising. The companies "represented" the successful tech archetype. Many of these companies went to zero in the dot-com bust.

**Debiasing**: Always ask: "What is the base rate?" If 80% of actively managed funds underperform their index over 15 years, then the base rate for any given fund manager being skilled is low, regardless of their recent track record.

## Status Quo Bias

**What it is**: A preference for the current state of affairs, even when changing would be beneficial.

**Examples in investing**:

- Staying in a default 401(k) investment option (often a money market fund) instead of choosing an appropriate allocation
- Not rebalancing a portfolio even when it has drifted far from target
- Keeping inherited stocks because "that's what Grandma had" rather than evaluating whether they fit your portfolio
- Staying with a high-fee financial advisor because switching feels effortful

**Market example**: Studies of 401(k) plans have found that whatever option is presented as the default gets the most enrollment. When the default is a money market fund, employees leave money in money markets. When the default is a target-date fund, they invest appropriately. The same people, with different defaults, get dramatically different outcomes over 30 years.

**Debiasing**: Treat every position as if you were building your portfolio from scratch today. Ask: "Would I buy this stock/fund/allocation today at today's price?" If not, it should probably be sold, regardless of when you originally bought it.

## Summary Table

| Bias               | What It Does                              | Common Investment Mistake            |
| ------------------ | ----------------------------------------- | ------------------------------------ |
| Prospect Theory    | Asymmetric response to gains vs losses    | Hold losers, sell winners            |
| Mental Accounting  | Treat money differently by source/label   | Risky behavior with "house money"    |
| Framing Effects    | Influenced by presentation, not substance | Buy/sell based on how data is framed |
| Availability       | Judge probability by ease of recall       | Overweight recent dramatic events    |
| Representativeness | Judge by similarity to stereotype         | Confuse good company with good stock |
| Status Quo         | Prefer not to change                      | Stick with inappropriate allocations |

## Common Pitfalls in Teaching Biases

1. **Assuming awareness eliminates biases**: Knowing about a bias does not automatically prevent it. Even experts who study biases fall prey to them. The value of awareness is in building systems and processes that counteract biases (see **[debiasing-strategies](debiasing-strategies.md)**).

2. **Presenting biases as "mistakes dumb people make"**: These biases are universal features of human cognition, not signs of ignorance. Framing them as character flaws discourages learners from engaging with the material.

3. **Ignoring that biases sometimes help**: In some contexts, heuristics are efficient. The availability heuristic, for example, helps us avoid dangers we have recently encountered. The problem is when these heuristics are applied to financial decisions where they produce systematic errors.

## Cross-References

- See **[loss-aversion-herding](loss-aversion-herding.md)** for deeper coverage of loss aversion, the disposition effect, and herding behavior
- See **[overconfidence-anchoring](overconfidence-anchoring.md)** for overconfidence, anchoring, confirmation bias, and hindsight bias
- See **[debiasing-strategies](debiasing-strategies.md)** for practical strategies to counteract these biases
- See **[09-personal-finance](../09-personal-finance/SKILL.md)** for how biases affect budgeting and saving decisions
- See **[08-learning-design/blooms-taxonomy](../08-learning-design/blooms-taxonomy.md)** for incorporating bias awareness into curriculum design
