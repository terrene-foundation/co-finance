# Assessment Design for Financial Education

Effective assessment in financial education measures whether learners can actually apply financial concepts, not just recall definitions. This guide covers assessment types, rubric design, difficulty calibration, and the distinction between formative and summative assessment.

## Formative vs Summative Assessment

| Type          | Purpose                              | Timing               | Stakes           | Examples                           |
| ------------- | ------------------------------------ | -------------------- | ---------------- | ---------------------------------- |
| **Formative** | Guide learning, identify gaps        | During instruction   | Low or no stakes | Concept checks, practice exercises |
| **Summative** | Evaluate mastery, certify competence | End of module/course | High stakes      | Final exams, capstone projects     |

For financial education, formative assessment is often more valuable than summative. Learners need frequent feedback on whether their calculations are correct and their reasoning is sound _before_ they make real financial decisions.

## Assessment Types

### 1. Concept Checks

Quick, low-stakes checks embedded within learning content. Used for formative assessment at Bloom's Remember and Understand levels.

**Format**: 3-5 questions after each concept section.

```
Example Concept Check: Bond Pricing

1. When interest rates rise, bond prices:
   (a) Rise  (b) Fall  (c) Stay the same  (d) It depends on the bond

2. A bond trading at 95 is trading at:
   (a) A premium  (b) Par  (c) A discount  (d) Cannot determine

3. True or False: A bond's coupon rate changes when market interest
   rates change.
   Justify your answer: ___________

4. In your own words, explain why a 30-year bond's price is more
   sensitive to interest rate changes than a 5-year bond's price.
```

**Design principles**:

- Mix question types (multiple choice, true/false with justification, short answer)
- Include one "explain in your own words" question to test understanding, not just recall
- Provide immediate feedback with explanations for incorrect answers
- Do not count toward final grade (low stakes encourages honest self-assessment)

### 2. Calculation Exercises

Structured problems that require applying formulas and interpreting results. Bloom's Apply level.

```python
# Exercise: Returns Calculation
# Difficulty: Beginner

"""
EXERCISE: Calculate Returns

Given the following monthly closing prices for a stock:
Jan: $150.00, Feb: $155.25, Mar: $148.50, Apr: $162.00, May: $159.75

Tasks:
1. Calculate the monthly simple returns for Feb through May
2. Calculate the cumulative return from Jan to May
3. Calculate the annualized return (assuming these 4 months are representative)
4. If you had invested $10,000 in January, what would it be worth in May?

Show your work. Check your answers with the solution code below.
"""

# Solution
prices = [150.00, 155.25, 148.50, 162.00, 159.75]
months = ["Jan", "Feb", "Mar", "Apr", "May"]

# Task 1: Monthly simple returns
print("Monthly Returns:")
for i in range(1, len(prices)):
    ret = (prices[i] - prices[i-1]) / prices[i-1]
    print(f"  {months[i]}: {ret:.2%}")

# Task 2: Cumulative return
cumulative = (prices[-1] / prices[0]) - 1
print(f"\nCumulative return (Jan-May): {cumulative:.2%}")

# Task 3: Annualized return
annualized = (1 + cumulative) ** (12 / 4) - 1
print(f"Annualized return: {annualized:.2%}")

# Task 4: Portfolio value
final_value = 10_000 * (1 + cumulative)
print(f"$10,000 investment value: ${final_value:,.2f}")
```

**Design principles**:

- Provide realistic data (not round numbers that make calculation trivial)
- Ask for interpretation alongside calculation ("What does this tell you?")
- Include solution code for self-checking
- Gradually remove scaffolding as students advance (later exercises give less structure)

### 3. Case Studies

Real-world scenarios requiring analysis and judgment. Bloom's Analyze and Evaluate levels. See also **[curriculum-patterns](curriculum-patterns.md)** for the case study method.

**Grading approach**: Use a rubric (see below) rather than a single correct answer. Case studies often have multiple valid approaches.

```
CASE STUDY: Portfolio Recovery After a Market Crash

Difficulty: Intermediate
Time: 45 minutes
Bloom's Level: Analyze, Evaluate

SCENARIO:
In March 2020, a global pandemic caused markets to fall roughly 34%
in 23 trading days. An investor with a $200,000 portfolio (80% stocks,
20% bonds) saw their portfolio drop to approximately $152,000.

QUESTIONS:
1. [Analyze] Calculate the exact portfolio impact assuming stocks fell
   34% and bonds rose 5% during this period.

2. [Analyze] The investor panicked and sold all stocks at the bottom,
   moving to 100% bonds. By December 2020, the S&P 500 had recovered
   to its pre-crash level. Calculate the opportunity cost of this
   decision.

3. [Evaluate] What behavioral biases were likely at play in the
   investor's decision? (Reference specific biases from
   behavioral finance.)

4. [Evaluate] Design a plan that this investor could have followed
   BEFORE the crash to avoid panic selling. What specific
   pre-commitment strategies would you recommend?
```

### 4. Portfolio Projects

Extended, multi-step assignments that require creating original work. Bloom's Create level.

```
PORTFOLIO PROJECT: Build a Retirement Portfolio

Difficulty: Advanced
Time: 2-3 hours
Bloom's Level: Create, Evaluate

DELIVERABLES:

Part 1: Investor Profile (15 minutes)
  Create a detailed investor profile including: age, income, risk
  tolerance, time horizon, financial goals, and constraints.

Part 2: Asset Allocation (30 minutes)
  Design an asset allocation for this investor. Justify each
  allocation decision with reference to the investor profile.

Part 3: Implementation (30 minutes)
  Select specific funds (ETFs or index funds) for each asset class.
  Explain your selection criteria (expense ratio, tracking error,
  liquidity, tax efficiency).

Part 4: Analysis (45 minutes)
  Using historical data:
  - Calculate the portfolio's historical return and volatility
  - Create a performance chart comparing to a benchmark
  - Calculate the maximum historical drawdown
  - Run a basic Monte Carlo simulation for 30-year outcomes

Part 5: Critique (30 minutes)
  Identify three weaknesses or risks in your portfolio design.
  For each, explain: (a) what could go wrong, (b) how likely it is,
  and (c) what you could do to mitigate it.
```

### 5. Simulation Exercises

Interactive exercises using paper trading or portfolio simulators. Combines Apply, Analyze, and Evaluate.

```
SIMULATION: 12-Week Paper Trading Challenge

Setup:
- Starting capital: $100,000 (simulated)
- Trading platform: Paper trading account
- Universe: S&P 500 stocks

Weekly Requirements:
1. Make at least one trade per week (buy or sell)
2. Record your reasoning BEFORE each trade in a trading journal
3. After each trade, record the outcome and what you learned

Monthly Review:
1. Calculate your portfolio's return for the month
2. Compare to the S&P 500 benchmark
3. Review your trading journal: How many of your trade rationales
   proved correct? What patterns do you see in your mistakes?
4. Identify which behavioral biases (if any) affected your decisions

Final Report:
1. Total return vs benchmark
2. Risk metrics (volatility, max drawdown, Sharpe ratio)
3. Analysis of best and worst trades
4. Reflection: What did you learn about yourself as an investor?
5. What would you do differently in a real portfolio?
```

## Rubric Design

### General Financial Education Rubric Template

```
RUBRIC: [Assessment Name]
Scale: 4=Excellent, 3=Proficient, 2=Developing, 1=Beginning

CRITERION 1: Accuracy of Calculations
  4: All calculations correct, appropriate formulas used
  3: Minor calculation errors, correct approach
  2: Some correct calculations, some formula errors
  1: Major calculation errors or wrong formulas

CRITERION 2: Interpretation of Results
  4: Clear, insightful interpretation with practical implications
  3: Correct interpretation, some insight
  2: Partially correct interpretation, lacks depth
  1: Incorrect or missing interpretation

CRITERION 3: Critical Analysis
  4: Identifies limitations, considers alternatives, nuanced reasoning
  3: Some critical analysis, recognizes key limitations
  2: Surface-level analysis, misses important considerations
  1: No critical analysis or evaluation

CRITERION 4: Communication
  4: Clear, well-organized, appropriate use of financial terminology
  3: Generally clear, minor organizational issues
  2: Somewhat unclear, inconsistent use of terminology
  1: Unclear, disorganized, misuse of terminology
```

### Portfolio Project Rubric (Specific Example)

```
CRITERION: Asset Allocation Justification
  4 (Excellent):
    - Allocation percentages tied directly to investor profile
    - Considers time horizon, risk tolerance, and goals
    - Discusses trade-offs explicitly
    - References diversification principles
  3 (Proficient):
    - Allocation generally appropriate for the investor
    - Most decisions justified
    - Some trade-off discussion
  2 (Developing):
    - Allocation exists but justification is weak
    - Some decisions seem arbitrary
    - Limited connection to investor profile
  1 (Beginning):
    - Allocation not appropriate for the investor
    - Little or no justification
    - No connection to investor profile or principles
```

## Difficulty Calibration

### Bloom's Level to Difficulty Mapping

| Difficulty   | Bloom's Primary Level | Financial Context                      |
| ------------ | --------------------- | -------------------------------------- |
| Beginner     | Remember, Understand  | Define terms, explain concepts         |
| Intermediate | Apply, Analyze        | Calculate metrics, compare investments |
| Advanced     | Evaluate, Create      | Critique strategies, build portfolios  |

### Calibration Techniques

1. **Pilot testing**: Have 3-5 students at the target level attempt the assessment. If more than 80% get it right without help, it is too easy. If fewer than 40% can complete it, it is too hard.

2. **Scaffolding gradient**: Start exercises with significant scaffolding (formulas provided, steps outlined) and gradually remove support.

3. **Multiple difficulty levels**: Offer "Core" (required, moderate difficulty) and "Challenge" (optional, advanced) problems.

```python
# Example: Same concept, three difficulty levels

# BEGINNER: Formula and data provided
"""
Calculate the Sharpe Ratio using the formula:
Sharpe = (R_portfolio - R_riskfree) / StdDev_portfolio

Given: R_portfolio = 12%, R_riskfree = 4%, StdDev = 18%
"""

# INTERMEDIATE: Data provided, student selects formula
"""
Given the following annual data for a portfolio:
Returns: 15%, 8%, -5%, 22%, 12%

Calculate the Sharpe ratio assuming a risk-free rate of 4%.
You will need to calculate the average return and standard deviation first.
"""

# ADVANCED: Student must gather data and make decisions
"""
Download 5 years of monthly returns for any ETF of your choice.
Calculate and interpret the Sharpe ratio. Compare it to the
S&P 500 Sharpe ratio over the same period. What does this
comparison tell you about the risk-adjusted performance of
your chosen ETF?
"""
```

## Common Pitfalls

1. **Testing recall when teaching application**: If you teach students to calculate returns, test them on calculating returns, not on defining returns.

2. **Only one question type**: Multiple choice is efficient but insufficient. Mix in calculations, short answer, and open-ended analysis.

3. **Trick questions**: Financial concepts are complex enough without tricks. Clear, direct questions that test genuine understanding are more effective.

4. **No partial credit for multi-step problems**: If a student uses the correct approach but makes an arithmetic error in step 2, they should receive credit for correct methodology.

5. **Ignoring the "why"**: Asking students to calculate a Sharpe ratio without asking them to interpret what it means or when it is useful.

## Cross-References

- See **[blooms-taxonomy](blooms-taxonomy.md)** for aligning assessments to learning objectives
- See **[curriculum-patterns](curriculum-patterns.md)** for the mastery learning approach to assessment gating
- See **[gamification](gamification.md)** for turning assessments into engaging challenges
- See **[06-python-finance](../06-python-finance/SKILL.md)** for Python code examples to embed in exercises
