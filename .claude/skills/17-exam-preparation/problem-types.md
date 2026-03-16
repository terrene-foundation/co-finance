# Problem Types in Finance Exams

Finance exams typically include four types of questions: calculations, conceptual, case analysis, and essays. Each type demands a different approach. Knowing what each type tests and how to structure your answer is half the battle.

## Calculation Problems

### What They Test

Your ability to apply financial formulas correctly, set up problems with the right inputs, and arrive at a numerically correct answer.

### Strategy: The Five-Step Method

1. **State the formula**: Write the relevant formula before plugging in numbers. This earns partial credit even if your arithmetic is wrong.
2. **Define variables**: List what each variable represents and its value from the problem.
3. **Substitute**: Plug the values into the formula. Show every substitution.
4. **Compute**: Carry out the arithmetic step by step.
5. **Interpret**: State what the answer means in context. "The NPV is $37,839, which is positive, so the project should be accepted."

### Worked Example

**Question**: A stock just paid a dividend of $2.50. Dividends are expected to grow at 6% per year. The required return is 11%. What is the stock's intrinsic value?

**Answer**:

Step 1 -- Formula: P_0 = D_1 / (r - g) [Gordon Growth Model]

Step 2 -- Variables: D_0 = $2.50, g = 6% = 0.06, r = 11% = 0.11

Step 3 -- Calculate D_1: D_1 = D_0 x (1 + g) = $2.50 x 1.06 = $2.65

Step 4 -- Substitute: P_0 = $2.65 / (0.11 - 0.06) = $2.65 / 0.05

Step 5 -- Compute: P_0 = **$53.00**

Interpretation: Based on the Gordon Growth Model, the intrinsic value of the stock is $53.00 per share.

### Common Calculation Errors

| Error | Example | Fix |
|-------|---------|-----|
| Using D_0 instead of D_1 | P = $2.50 / 0.05 = $50 (wrong) | Always multiply D_0 by (1+g) first |
| Mismatching periods | Using annual rate with monthly payments | Convert: monthly rate = annual / 12 |
| Forgetting to square for variance | sigma^2 = sum of deviations (not squared) | Always square the deviations |
| Rounding too early | Rounding intermediate steps | Keep 4+ decimal places until the final answer |
| Wrong sign on cash flows | Treating outflows as positive in NPV | Initial investment is negative in NPV |

## Conceptual Questions

### What They Test

Your understanding of financial concepts, theories, and their implications -- not just formulas but the reasoning behind them.

### Strategy

1. **Define the concept**: Start with a clear, concise definition
2. **Explain the intuition**: Why does this concept exist? What problem does it solve?
3. **Give an example**: Illustrate with a concrete scenario
4. **State limitations or assumptions**: Show deeper understanding

### Worked Example

**Question**: Explain why diversification reduces portfolio risk.

**Answer**:

**Definition**: Diversification is the practice of combining assets that are not perfectly correlated to reduce the total risk of a portfolio.

**Intuition**: When one asset is performing poorly, another may be performing well (or at least not declining as much), partially offsetting the loss. This occurs because assets respond differently to economic events. The key mathematical insight is that portfolio variance depends on the correlation between assets. When correlation (rho) is less than +1, the portfolio's standard deviation is less than the weighted average of individual standard deviations.

**Example**: Consider a portfolio of airline stocks and oil company stocks. When oil prices rise, airline profits fall (higher fuel costs) but oil company profits rise. Combining both in a portfolio reduces volatility because their returns partially offset each other.

**Limitation**: Diversification cannot eliminate systematic (market) risk -- the risk that affects all assets simultaneously (e.g., a recession). It eliminates only unsystematic (company-specific) risk. With approximately 25-30 stocks, most unsystematic risk is diversified away.

### Conceptual Question Pitfalls

- **Vague answers**: "Diversification is good because it reduces risk." This lacks specificity. *How* does it reduce risk? *What kind* of risk?
- **Formula-only answers**: Writing the portfolio variance formula without explaining the intuition. Formulas support conceptual answers; they do not replace them.
- **Missing limitations**: Every concept has boundaries. Mentioning them demonstrates deeper understanding.

## Case Analysis Questions

### What They Test

Your ability to apply frameworks and financial tools to a realistic business scenario, weigh tradeoffs, and make a recommendation.

### Strategy: The STAR Framework

1. **Situation**: Summarize the key facts of the case (2-3 sentences)
2. **Task**: Identify the decision or problem to be solved
3. **Analysis**: Apply relevant frameworks, models, and calculations
4. **Recommendation**: State a specific, actionable recommendation supported by your analysis

### Worked Example

**Question**: XYZ Corp is considering acquiring ABC Inc for $500 million. XYZ has WACC of 10%, and the projected synergies are $30 million per year in perpetuity. ABC's standalone DCF value is $400 million. Should XYZ proceed? What is the maximum they should pay?

**Answer**:

**Situation**: XYZ Corp is evaluating a $500M acquisition of ABC Inc, with expected annual synergies of $30M in perpetuity.

**Task**: Determine whether the proposed price creates value for XYZ shareholders.

**Analysis**:
- Standalone value of ABC = $400M (given from DCF)
- PV of synergies = $30M / 0.10 = $300M (perpetuity formula)
- Combined value = $400M + $300M = $700M
- Premium over standalone = $500M - $400M = $100M
- NPV of acquisition to XYZ = $700M - $500M = **$200M** (positive)
- Maximum price = Combined value = $700M (above this, NPV turns negative)

**Recommendation**: XYZ should proceed at $500M because the NPV is $200M (positive value creation). However, this assumes the $30M in annual synergies are achievable. The maximum price XYZ should pay is $700M, but paying the maximum would transfer all synergy value to ABC's shareholders. I would recommend negotiating a price closer to $500M to retain most of the synergy value for XYZ shareholders.

### Case Question Tips

- Always quantify when possible -- dollar values strengthen arguments
- Acknowledge risks and assumptions
- State your recommendation clearly (do not hedge excessively)
- Consider multiple stakeholders if relevant

## Essay Questions

### What They Test

Your ability to construct a coherent, well-supported argument about a financial topic, drawing on theory, evidence, and critical thinking.

### Strategy: The Three-Part Essay

1. **Introduction** (1 paragraph): State your thesis -- the main argument you will defend
2. **Body** (2-4 paragraphs): Present supporting arguments with evidence. Address counterarguments.
3. **Conclusion** (1 paragraph): Restate your thesis and summarize why the evidence supports it

### Worked Example

**Question**: "Markets are efficient." Discuss.

**Introduction**: "The efficient market hypothesis (EMH), proposed by Fama (1970), states that security prices fully reflect all available information. While the EMH provides a powerful benchmark, the evidence suggests that markets are largely but not perfectly efficient -- with pockets of inefficiency that are difficult to exploit after accounting for transaction costs and risk."

**Body paragraph 1** (evidence for): "Tests of the weak form show that simple trading rules based on past prices generally do not outperform a buy-and-hold strategy after transaction costs (Fama, 1970). Index funds consistently outperform the majority of actively managed funds over horizons of 10+ years (Malkiel, 2003), consistent with market efficiency."

**Body paragraph 2** (evidence against): "However, persistent anomalies challenge the EMH. The momentum effect (Jegadeesh and Titman, 1993), the value premium (Fama and French, 1993), and excess volatility relative to fundamentals (Shiller, 1981) are difficult to reconcile with strict efficiency. Behavioral finance attributes these patterns to systematic investor biases."

**Body paragraph 3** (reconciliation): "The debate may be best resolved by recognizing that markets are 'efficiently inefficient' (Pedersen, 2015). Markets are efficient enough that easy profits are rare, but inefficient enough that informed, skilled investors can earn returns that compensate for the cost of their research. Anomalies exist but are difficult and costly to exploit."

**Conclusion**: "In summary, the EMH remains the best starting assumption for most investors. However, treating it as an absolute truth ignores robust evidence of predictable patterns in returns. The practical implication is that passive investing is appropriate for most individuals, while skilled institutional investors may earn modest excess returns in specific, well-researched strategies."

### Essay Question Tips

- Take a position (but acknowledge the other side)
- Cite specific studies (even if you cannot remember exact dates, cite author names)
- Structure your answer clearly with topic sentences
- Manage time -- for a 30-minute essay, spend 5 minutes planning, 20 minutes writing, 5 minutes reviewing

## Common Mistakes

1. **Not showing work on calculations**: Even if your final answer is correct, you may lose marks if you do not show intermediate steps. If your final answer is wrong, showing work earns partial credit.

2. **Answering a different question**: Read the question carefully. "Explain" means describe the concept. "Evaluate" means assess whether something is good or bad. "Compare" means identify similarities and differences. "Calculate" means produce a number.

3. **Running out of time**: Allocate time at the start of the exam. If a section is worth 40% of marks, spend 40% of your time on it. Move on from a question you are stuck on -- come back later.

4. **Writing everything you know instead of answering the question**: A focused, well-structured answer that directly addresses the question is better than a brain dump of everything related to the topic.

5. **Not interpreting calculation results**: "NPV = $37,839" without interpretation misses easy marks. Add: "Since NPV > 0, the project creates value and should be accepted."

6. **Ignoring mark allocation**: If a question is worth 2 marks, a two-sentence answer is appropriate. If it is worth 20 marks, you need a structured, detailed response.

## Key References

- Dunlosky, J. et al. (2013). "Improving Students' Learning With Effective Learning Techniques." *Psychological Science in the Public Interest*, 14(1), 4-58.
- Brown, P.C., Roediger, H.L. & McDaniel, M.A. (2014). *Make It Stick: The Science of Successful Learning*. Harvard University Press.
