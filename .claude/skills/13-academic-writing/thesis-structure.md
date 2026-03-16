# Thesis Structure

A well-structured thesis or research paper in finance follows a standard format that guides the reader from the research question to the conclusion. Each section has a specific purpose, and knowing what belongs where is half the battle of writing well.

## Why Structure Matters

A strong argument buried in a poorly structured paper will not convince anyone. Structure is not just cosmetic -- it is a thinking tool. Organizing your paper into clear sections forces you to separate your question from your method, your results from your interpretation, and your claims from your evidence. Reviewers and professors expect this structure, and deviating from it without reason signals inexperience.

Think of structure as the skeleton of your paper: it holds everything together and determines the shape of the final product.

## The Standard Structure

### 1. Title

The title should convey the research question and key finding in as few words as possible.

**Good title**: "Does Dividend Policy Affect Firm Value? Evidence from S&P 500 Firms, 2010-2023"

**Weak title**: "A Study of Dividends"

**Formula for a strong title**: [Key variable/relationship] + [Context/sample] + [Optional: time period or method]

### 2. Abstract

A self-contained summary of the entire paper in 150-300 words.

**Structure**: Background (1-2 sentences) --> Research question (1 sentence) --> Method (1-2 sentences) --> Key finding (1-2 sentences) --> Implication (1 sentence).

**Worked Example**:

> "This paper examines whether corporate dividend policy affects firm value among S&P 500 firms from 2010 to 2023. Using panel regression with firm and year fixed effects, we test the signaling hypothesis against the irrelevance proposition of Miller and Modigliani (1961). We find that dividend increases are associated with a statistically significant 2.3% abnormal return in the three-day window around the announcement, controlling for firm size, leverage, and profitability. These results support the signaling hypothesis and suggest that dividends convey information about managerial confidence in future earnings. The findings have implications for corporate payout policy and investor interpretation of dividend announcements."

### 3. Introduction

The introduction sets up the entire paper. It should accomplish four things:

1. **Motivate the topic**: Why should anyone care? What is the real-world significance?
2. **State the research question**: What specific question are you answering?
3. **Preview your approach**: How did you investigate this question?
4. **Summarize your findings**: What did you find? (Yes, give away the ending.)

**Length**: 1-3 pages for an undergraduate paper; 3-5 pages for a graduate thesis.

**Common mistake**: Writing the introduction as a literature review. The introduction should mention only the most essential prior studies -- save the detailed review for the next section.

**Finance-specific tip**: Open with a real-world hook. For example: "In 2023, Apple returned over $90 billion to shareholders through dividends and buybacks -- more than the GDP of most countries. This raises a fundamental question: does the form of payout matter for firm value?"

### 4. Literature Review

See the separate [literature-review.md](literature-review.md) file for detailed guidance.

**Purpose**: Show what has been done before, identify the gap your research fills, and position your contribution.

**Length**: 3-8 pages for an undergraduate paper; 10-25 pages for a graduate thesis.

### 5. Methodology

See the separate [methodology-section.md](methodology-section.md) file for detailed guidance.

**Purpose**: Describe your data, sample, variables, and analytical approach in enough detail that another researcher could replicate your study.

**Length**: 3-6 pages.

### 6. Results

Present your findings without interpretation (interpretation belongs in the Discussion).

**Structure**:
1. Descriptive statistics (summary table of key variables)
2. Main results (regression tables, test statistics)
3. Robustness checks (alternative specifications that confirm or challenge your main finding)

**Finance-specific conventions**:
- Report coefficients with standard errors or t-statistics
- Use asterisks for significance levels: * p < 0.10, ** p < 0.05, *** p < 0.01
- Always report R-squared and number of observations
- Include economic magnitude, not just statistical significance ("a one-standard-deviation increase in leverage is associated with a 1.2 percentage point decrease in ROA")

**Common mistake**: Interpreting results in this section. "The coefficient is 0.023" belongs here. "This suggests that dividends signal managerial confidence" belongs in the Discussion.

### 7. Discussion

Interpret your results and connect them to the broader literature.

**Structure**:
1. What do your results mean? Connect findings to your hypotheses
2. How do they compare to prior studies? Consistent or contradictory?
3. What are the limitations? (Every study has them -- acknowledge them honestly)
4. What are the implications? For theory, for practice, for policy?

**Finance-specific tip**: Discuss economic significance, not just statistical significance. A coefficient that is statistically significant at p < 0.01 but represents a $0.02 effect on stock price is not economically meaningful.

### 8. Conclusion

Summarize the paper in one page. State:
1. What you did
2. What you found
3. Why it matters
4. What future research could explore

**Do not** introduce new arguments, data, or citations in the conclusion.

### 9. References

See [../15-citation-guide/](../15-citation-guide/SKILL.md) for formatting details.

### 10. Appendices (Optional)

Place supplementary material here: additional tables, derivations, variable definitions, robustness checks that did not fit in the main text.

## Finance-Specific Structural Considerations

### Hypothesis Development

In empirical finance, hypotheses should be:
- **Testable**: Can be confirmed or rejected with data
- **Grounded in theory**: Derived from an economic model or prior literature
- **Directional**: State the expected sign of the relationship

**Example**:
> "H1: Firms that increase dividends experience positive abnormal returns in the announcement window."
> "H2: The magnitude of the abnormal return is positively related to the size of the dividend increase."

### Data and Sample Description

Always include:
- Source of data (Bloomberg, CRSP, Compustat, hand-collected)
- Sample period and frequency
- Sample selection criteria and any exclusions
- Number of observations and firms
- Survivorship bias considerations

### Endogeneity Discussion

In finance research, almost every relationship could be endogenous (causation could run both ways, or a third variable could drive both). Your paper should:
- Acknowledge the endogeneity concern
- Discuss what approach you use to address it (instrumental variables, natural experiments, fixed effects, difference-in-differences)
- Be honest about limitations that remain

## Common Mistakes

1. **Writing the paper in order**: Write the Introduction and Conclusion last. Start with the Methodology and Results -- these are the most concrete sections.

2. **Burying the contribution**: State your contribution clearly in the Introduction. Do not make the reader guess why your paper matters.

3. **Literature review as annotated bibliography**: A literature review organizes themes and identifies gaps -- it does not summarize papers one by one.

4. **Results without economic interpretation**: "Beta = 0.023 (p < 0.01)" means nothing without context. Always translate statistical results into economic magnitude.

5. **Ignoring limitations**: Every study has limitations. Acknowledging them demonstrates maturity and strengthens (not weakens) your paper.

6. **Conclusion that introduces new material**: The conclusion summarizes; it does not present new arguments or evidence.

## Key References

- Cochrane, J.H. (2005). "Writing Tips for PhD Students." Manuscript, University of Chicago.
- Nikolov, A.N. (2012). *How to Write Academic Papers in Finance*. Working paper series.
- Swales, J.M. & Feak, C.B. (2012). *Academic Writing for Graduate Students*, 3rd ed., University of Michigan Press.
- Creswell, J.W. & Creswell, J.D. (2018). *Research Design: Qualitative, Quantitative, and Mixed Methods Approaches*, 5th ed., SAGE.
