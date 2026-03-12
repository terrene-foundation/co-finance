# Learning & Pedagogy Rules

## Scope

These rules apply to all educational content, curriculum files, lesson plans, exercises, tutorials, and instructional materials (`**/curriculum/**`, `**/lessons/**`, `**/tutorials/**`, `**/exercises/**`, `**/*lesson*`, `**/*tutorial*`, `**/*curriculum*`, `**/*exercise*`).

## MUST Rules

### 1. Use Progressive Difficulty

All educational content MUST follow a progressive difficulty structure: beginner, then intermediate, then advanced. Each level MUST build on the previous one.

**Correct Structure**:

```
Module: Portfolio Risk
  - Beginner: What is risk? (Volatility as standard deviation of returns)
  - Intermediate: Measuring risk (Sharpe ratio, Sortino ratio, max drawdown)
  - Advanced: Risk modeling (Value at Risk, Monte Carlo simulation, copulas)
```

**Incorrect Structure**:

```
Module: Portfolio Risk
  - Lesson 1: Copula-based dependency modeling  # Jumps to advanced immediately
  - Lesson 2: What is standard deviation?        # Basics after advanced — disorienting
```

**Enforced by**: intermediate-reviewer
**Violation**: HIGH priority fix

### 2. Include Worked Examples Before Exercises

Every new concept MUST include at least one fully worked example before presenting exercises for the learner to attempt independently.

**Correct Pattern**:

```markdown
## Calculating Simple Returns

A simple return measures the percentage change in price over a period.

**Formula**: R = (P_end - P_start) / P_start

### Worked Example

You bought a stock at $100 and it is now worth $112.

R = ($112 - $100) / $100 = 0.12 = 12%

The stock returned 12% over the period.

### Exercise

Calculate the simple return for a stock purchased at $45 that is now worth $51.30.
```

**Incorrect Pattern**:

```markdown
## Calculating Simple Returns

Formula: R = (P_end - P_start) / P_start

### Exercise

Calculate the return for a stock purchased at $45 that is now worth $51.30.
```

(No worked example — learner must figure out the formula application alone.)

**Enforced by**: intermediate-reviewer
**Violation**: HIGH priority fix

### 3. Explain "Why" Not Just "How"

All instructional content MUST explain the motivation and reasoning behind a concept, not just the mechanical steps.

**Correct**:

```markdown
## Why We Annualize Returns

Investments are held for different periods — one might last 3 months, another 2 years.
Comparing a 5% return over 3 months to a 15% return over 2 years is misleading without
a common time frame. Annualization converts all returns to a "per year" basis so they
can be compared fairly, much like converting different currencies to a single one for
comparison.
```

**Incorrect**:

```markdown
## Annualizing Returns

To annualize a return, use the formula:
Annualized Return = (1 + R)^(252/n) - 1

where n is the number of trading days.
```

(Tells the learner what to do, but not why they would want to.)

**Enforced by**: intermediate-reviewer
**Violation**: HIGH priority fix

### 4. Connect New Concepts to Prerequisites

Every lesson MUST explicitly state its prerequisites and reference how new material relates to previously covered topics.

**Correct**:

```markdown
## Lesson: The Sharpe Ratio

### Prerequisites

- [Lesson 3: Calculating Returns](/lessons/03-returns) — you should be comfortable computing simple and log returns
- [Lesson 5: Standard Deviation as Risk](/lessons/05-standard-deviation) — understanding volatility as a risk measure

### Connection to Prior Learning

In Lesson 3, you learned to compute the return of an investment. In Lesson 5, you
learned to measure risk using standard deviation. The Sharpe ratio combines both ideas:
it tells you how much return you earned _per unit of risk taken_. Think of it as the
"efficiency" of your investment — more return per unit of risk is better.
```

**Enforced by**: intermediate-reviewer
**Violation**: HIGH priority fix

### 5. Use Real-World Analogies

Complex financial concepts MUST include at least one real-world analogy to anchor abstract ideas in familiar experience.

**Examples of Good Analogies**:

```markdown
**Diversification** is like not putting all your eggs in one basket. If you carry ten eggs
in one basket and drop it, you lose everything. If you carry them in five baskets, dropping
one costs you only two eggs.

**Compound interest** works like a snowball rolling downhill — it starts small, but as it
rolls, it picks up more snow, and the bigger it gets, the faster it grows.

**A bond's coupon** is like rent paid to you by the borrower for using your money — you get
regular payments for letting someone else use what's yours.

**Liquidity** is how quickly you can sell something at a fair price. Your house is an
investment, but it's not very liquid — selling it takes months. A share of Apple stock is
very liquid — you can sell it in seconds during market hours.
```

**Enforced by**: intermediate-reviewer
**Violation**: HIGH priority fix

### 6. Use Bloom's Taxonomy for Learning Objectives

All lessons and modules MUST define learning objectives using Bloom's Taxonomy verbs to ensure coverage across cognitive levels.

**Bloom's Taxonomy Reference** (lowest to highest cognitive level):

| Level             | Description                       | Verbs to Use                              | Financial Example                                                     |
| ----------------- | --------------------------------- | ----------------------------------------- | --------------------------------------------------------------------- |
| **1. Remember**   | Recall facts and basic concepts   | Define, list, identify, name, state       | "Define what a stock dividend is"                                     |
| **2. Understand** | Explain ideas or concepts         | Explain, describe, summarize, interpret   | "Explain why diversification reduces portfolio risk"                  |
| **3. Apply**      | Use information in new situations | Calculate, compute, implement, solve      | "Calculate the Sharpe ratio for a given portfolio"                    |
| **4. Analyze**    | Draw connections among ideas      | Compare, contrast, differentiate, examine | "Compare the risk-return profiles of two portfolios"                  |
| **5. Evaluate**   | Justify a decision or position    | Assess, critique, judge, recommend        | "Evaluate whether a 60/40 portfolio is appropriate for a retiree"     |
| **6. Create**     | Produce new or original work      | Design, construct, develop, formulate     | "Design a portfolio optimization strategy for a given risk tolerance" |

**Correct**:

```markdown
## Module 4: Portfolio Construction

### Learning Objectives

By the end of this module, you will be able to:

- **Define** the efficient frontier and its components (Remember)
- **Explain** why mean-variance optimization matters for investors (Understand)
- **Calculate** optimal portfolio weights using the Markowitz model (Apply)
- **Compare** equal-weight vs. optimized portfolios on risk-adjusted returns (Analyze)
- **Evaluate** the limitations of mean-variance optimization in practice (Evaluate)
- **Design** a portfolio construction workflow for a specific investor profile (Create)
```

**Incorrect**:

```markdown
## Module 4: Portfolio Construction

### Learning Objectives

- Learn about the efficient frontier
- Understand portfolio optimization
- Do portfolio calculations
```

(Vague, unmeasurable, does not progress through cognitive levels.)

**Enforced by**: intermediate-reviewer
**Violation**: HIGH priority fix

## MUST NOT Rules

### 1. No Jargon Without Definition

MUST NOT use financial or technical jargon without immediately defining it on first use.

**Detection Patterns**:

```
"Calculate the portfolio's beta relative to the benchmark."
# What is beta? What is a benchmark? First-time learners won't know.
```

**Correct Alternative**:

```
"Calculate the portfolio's beta (a measure of how much the portfolio moves relative to the
overall market — a beta of 1.5 means the portfolio tends to move 1.5x as much as the market)
relative to the benchmark (the market index you're comparing against, such as the S&P 500)."
```

On subsequent uses within the same lesson, the short term alone is acceptable after the first definition.

**Consequence**: HIGH priority fix

### 2. No Skipping Foundational Concepts

MUST NOT present advanced techniques without ensuring the foundational concepts they depend on have been covered or are explicitly listed as prerequisites.

**Detection Patterns**:

```
# Teaching Monte Carlo simulation without first covering:
# - Random variables and probability distributions
# - Expected value and variance
# - The concept of simulation / sampling
```

**Consequence**: HIGH priority fix — add prerequisite coverage or explicit prerequisite links

### 3. No Advanced Topics Without Prerequisites Noted

MUST NOT introduce advanced material without clearly noting what the learner must already know.

**Detection Patterns**:

```markdown
## Black-Scholes Option Pricing

The Black-Scholes formula is: C = S*N(d1) - K*e^(-rT)\*N(d2)

Let's implement it:
```

(Assumes knowledge of options, continuous compounding, normal distributions, and calculus — none referenced.)

**Correct Alternative**:

```markdown
## Black-Scholes Option Pricing

### Prerequisites

- Module 8: What Are Options? (calls, puts, strike price, expiration)
- Module 9: Continuous Compounding (e^rt notation)
- Module 10: Normal Distribution and Cumulative Distribution Function
- Comfortable with Python functions and NumPy

### What You'll Learn

This lesson brings together everything from Modules 8-10 to build the most famous
formula in finance...
```

**Consequence**: HIGH priority fix

## Content Structure Guidelines

Every educational module SHOULD follow this structure:

1. **Title and Learning Objectives** (Bloom's taxonomy verbs)
2. **Prerequisites** (with links to prior modules)
3. **Motivation** (why this matters — real-world context)
4. **Concept Explanation** (with analogies)
5. **Worked Example** (step-by-step with commentary)
6. **Key Takeaways** (concise summary)
7. **Exercises** (progressive difficulty: practice, then challenge)
8. **Further Reading** (optional, for learners who want to go deeper)

## Exceptions

Pedagogy exceptions require:

1. Documentation of the target audience's assumed knowledge level
2. Justification for deviating from progressive structure (e.g., reference material intended for lookup, not sequential learning)
3. Approval from intermediate-reviewer
