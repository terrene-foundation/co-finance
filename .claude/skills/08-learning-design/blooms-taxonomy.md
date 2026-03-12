# Bloom's Taxonomy for Financial Education

Bloom's taxonomy provides a hierarchy of cognitive skills that learners develop as they progress from novice to expert. Applying this framework to financial education ensures that curricula build systematically from basic recall to sophisticated analysis and portfolio construction.

## The Six Levels

### Level 1: Remember

**Cognitive goal**: Recall facts, terms, and definitions from memory.

**Financial education examples**:

- Define "stock," "bond," "ETF," "mutual fund"
- List the components of the income statement (revenue, expenses, net income)
- Name the five major asset classes
- Recall the formula for compound interest: A = P(1 + r/n)^(nt)
- State the difference between a market order and a limit order

**Assessment types**: Multiple choice, matching, fill-in-the-blank, flashcards.

**Example question**: "Which of the following best defines a bond? (a) Ownership in a company (b) A loan to a company or government (c) A basket of stocks (d) A type of insurance policy"

**Common pitfall**: Spending too much time at this level. Many financial education platforms never get past definitions. Learners need to move beyond memorization quickly.

### Level 2: Understand

**Cognitive goal**: Explain ideas, summarize concepts, translate between representations.

**Financial education examples**:

- Explain why diversification reduces portfolio risk
- Describe how inflation erodes purchasing power over time
- Summarize the relationship between bond prices and interest rates
- Interpret a candlestick chart
- Paraphrase the concept of compound interest in your own words

**Assessment types**: Short answer, explain-in-your-own-words, concept mapping, true/false with justification.

**Example question**: "In your own words, explain why a bond's price falls when interest rates rise. Use an analogy if helpful."

**Common pitfall**: Confusing "understand" with "remember." If a learner can recite the definition of diversification but cannot explain _why_ it works, they are still at Level 1.

### Level 3: Apply

**Cognitive goal**: Use knowledge to solve problems, perform calculations, execute procedures.

**Financial education examples**:

- Calculate simple and compound returns on an investment
- Compute a stock's P/E ratio from financial statement data
- Build a basic portfolio allocation for a given risk profile
- Use the 50/30/20 budgeting rule to create a budget
- Calculate monthly mortgage payments

```python
# Apply: Calculate compound annual growth rate (CAGR)
def calculate_cagr(beginning_value, ending_value, years):
    """
    Apply the CAGR formula to calculate annualized return.

    Learning objective: Students can use the CAGR formula
    to determine the annualized return of an investment.
    """
    if beginning_value <= 0 or years <= 0:
        raise ValueError("Beginning value and years must be positive")
    return (ending_value / beginning_value) ** (1 / years) - 1

# Exercise: An investment grew from $10,000 to $18,500 over 7 years.
# What was the CAGR?
cagr = calculate_cagr(10_000, 18_500, 7)
print(f"CAGR: {cagr:.2%}")  # ~9.23%
```

**Assessment types**: Calculation exercises, worked problems, fill-in-the-spreadsheet, code-along exercises.

**Example exercise**: "Given the following quarterly revenue data for Company X, calculate the year-over-year revenue growth rate for each quarter."

### Level 4: Analyze

**Cognitive goal**: Break down complex situations, compare alternatives, identify patterns, distinguish components.

**Financial education examples**:

- Compare two investment strategies using risk-adjusted metrics
- Analyze a company's financial health using ratio analysis
- Decompose portfolio returns into asset allocation vs security selection
- Identify the assumptions behind a Monte Carlo simulation and evaluate their validity
- Distinguish between correlation and causation in market data

```python
import numpy as np

# Analyze: Compare two portfolios on risk-adjusted basis
def analyze_portfolios(returns_a, returns_b, risk_free_rate=0.04):
    """
    Analyze two portfolios across multiple dimensions.

    Learning objective: Students can compare investments using
    multiple metrics rather than just raw returns.
    """
    results = {}

    for name, returns in [("Portfolio A", returns_a), ("Portfolio B", returns_b)]:
        annual_return = np.mean(returns) * 252
        annual_vol = np.std(returns) * np.sqrt(252)
        sharpe = (annual_return - risk_free_rate) / annual_vol

        cumulative = np.cumprod(1 + returns)
        running_max = np.maximum.accumulate(cumulative)
        drawdowns = (cumulative - running_max) / running_max
        max_drawdown = drawdowns.min()

        results[name] = {
            "Annual Return": f"{annual_return:.2%}",
            "Annual Volatility": f"{annual_vol:.2%}",
            "Sharpe Ratio": f"{sharpe:.2f}",
            "Max Drawdown": f"{max_drawdown:.2%}",
        }

    return results

# Exercise: Which portfolio is "better"? The answer depends on
# what the investor values — higher return, lower risk, or better
# risk-adjusted return. This is the analytical skill.
```

**Assessment types**: Case studies, comparative analysis, data interpretation exercises, written analysis with evidence.

**Example exercise**: "You are given the 5-year track records of two mutual funds. Fund A returned 12% annually with 18% volatility. Fund B returned 10% annually with 10% volatility. Analyze which fund performed better on a risk-adjusted basis, and explain under what circumstances an investor might prefer each one."

### Level 5: Evaluate

**Cognitive goal**: Make judgments, critique arguments, assess validity, justify decisions.

**Financial education examples**:

- Evaluate whether a specific investment thesis is well-supported
- Critique a backtested strategy for potential biases
- Assess whether a financial advisor's recommendation is appropriate for a specific client scenario
- Judge the credibility of a financial news article's claims
- Evaluate the trade-offs of different retirement withdrawal strategies

**Assessment types**: Critique assignments, peer review, debate exercises, decision justification essays.

**Example exercise**: "A financial blog claims that their momentum strategy 'consistently beats the market by 5% per year.' The post shows a 3-year backtest with no transaction costs. Write a 300-word critique evaluating this claim. Consider: (1) Is the backtest period sufficient? (2) What biases might be present? (3) What information is missing? (4) What additional evidence would you need?"

**Common pitfall**: Skipping to evaluation without building the analytical foundation. Learners cannot evaluate investment strategies if they cannot first analyze performance data.

### Level 6: Create

**Cognitive goal**: Design, construct, produce original work by combining elements in new ways.

**Financial education examples**:

- Design a portfolio for a specific investor profile
- Create an investment policy statement
- Build a financial model for a startup valuation
- Develop a personal financial plan
- Construct a backtesting framework for a strategy idea

```python
# Create: Design a goal-based portfolio allocation
def design_portfolio(
    age, risk_tolerance, time_horizon_years, goals
):
    """
    Create a portfolio allocation based on investor profile.

    Learning objective: Students synthesize knowledge of asset classes,
    risk, time horizon, and diversification to create a coherent
    portfolio recommendation.

    Note: This is an educational exercise. Not financial advice.
    """
    # Base equity allocation (rule of thumb: 110 - age)
    base_equity = max(20, min(90, 110 - age))

    # Adjust for risk tolerance (scale: 1=conservative, 5=aggressive)
    risk_adjustment = (risk_tolerance - 3) * 5
    equity_pct = max(20, min(90, base_equity + risk_adjustment))

    # Adjust for time horizon
    if time_horizon_years < 3:
        equity_pct = min(equity_pct, 30)
    elif time_horizon_years < 5:
        equity_pct = min(equity_pct, 50)

    bond_pct = 100 - equity_pct

    allocation = {
        "US Large Cap Equity": round(equity_pct * 0.50),
        "International Equity": round(equity_pct * 0.30),
        "US Small Cap Equity": round(equity_pct * 0.20),
        "US Aggregate Bonds": round(bond_pct * 0.60),
        "Treasury Inflation-Protected": round(bond_pct * 0.25),
        "International Bonds": round(bond_pct * 0.15),
    }

    return allocation

# Exercise: Create portfolios for three different investor profiles
# and justify your allocation decisions.
```

**Assessment types**: Portfolio projects, financial plans, model building, strategy design and defense, capstone projects.

**Example capstone**: "Design a complete investment plan for a hypothetical client (age 35, moderate risk tolerance, $80,000 income, goals of retirement at 65, college funding for two children). Your plan should include: asset allocation, recommended account types, contribution schedule, rebalancing strategy, and a written justification for each decision."

## Progression Pattern for Financial Education

```
Remember    -> Define P/E ratio
Understand  -> Explain what P/E ratio tells you about valuation
Apply       -> Calculate P/E ratios for 5 companies
Analyze     -> Compare P/E ratios across an industry sector
Evaluate    -> Assess whether a stock with a high P/E is overvalued
Create      -> Build a multi-factor valuation model using P/E and other metrics
```

## Mapping Bloom's to Module Design

| Module Component     | Primary Bloom's Level | Example                     |
| -------------------- | --------------------- | --------------------------- |
| Concept introduction | Remember, Understand  | Video lecture, reading      |
| Worked examples      | Apply                 | Instructor-led calculations |
| Practice exercises   | Apply, Analyze        | Problem sets                |
| Case studies         | Analyze, Evaluate     | Real-world scenarios        |
| Discussion prompts   | Evaluate              | Peer discussion             |
| Capstone project     | Create                | Portfolio construction      |

## Common Pitfalls in Financial Education Design

1. **Stuck at Remember/Understand**: Many courses teach definitions and theory but never progress to application. Learners leave "knowing about" investing but unable to _do_ anything.

2. **Jumping to Create without foundations**: Asking learners to build portfolios before they can calculate returns or analyze risk metrics.

3. **Testing at a lower level than teaching**: Teaching at the Analyze level but testing only at Remember (multiple choice on definitions).

4. **Ignoring the affective domain**: Financial decisions involve emotions (fear, greed, overconfidence). Behavioral finance concepts (see **[10-behavioral-finance](../10-behavioral-finance/SKILL.md)**) should be woven into every level.

## Cross-References

- See **[curriculum-patterns](curriculum-patterns.md)** for sequencing modules that build through Bloom's levels
- See **[assessment-design](assessment-design.md)** for assessment types matched to each Bloom's level
- See **[gamification](gamification.md)** for engagement strategies at each cognitive level
- See **[10-behavioral-finance](../10-behavioral-finance/SKILL.md)** for incorporating psychological awareness into learning
- See **[09-personal-finance](../09-personal-finance/SKILL.md)** for personal finance content at each Bloom's level
