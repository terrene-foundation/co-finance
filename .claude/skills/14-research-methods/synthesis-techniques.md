# Synthesis Techniques

Synthesis is the process of combining findings from multiple sources to build a coherent understanding of a topic. It goes beyond summarizing individual studies -- it identifies patterns, contradictions, and gaps across the body of evidence.

## Why Synthesis Matters

A literature review that summarizes papers one by one is an annotated bibliography, not a synthesis. True synthesis identifies what the collective body of evidence tells us, where studies disagree and why, and what questions remain unanswered. This is the foundation for justifying your own research contribution.

## Thematic Analysis

The most common synthesis technique in finance literature reviews. Studies are grouped by theme rather than by author or chronology.

### How to Conduct Thematic Analysis

**Step 1: Code your sources**. As you read each paper, tag it with themes.

| Source | Themes | Key Finding |
|--------|--------|-------------|
| Fama (1970) | Market efficiency, information | Efficient markets categorized into weak, semi-strong, strong forms |
| Jegadeesh & Titman (1993) | Market efficiency, momentum | Past winners outperform past losers for 3-12 months |
| Daniel et al. (1998) | Behavioral, momentum | Overconfidence and biased self-attribution explain momentum |
| Fama & French (1996) | Market efficiency, risk factors | Three-factor model explains most anomalies |

**Step 2: Group by theme**. Cluster related findings together.

Theme 1: Evidence for market efficiency
Theme 2: Evidence against market efficiency (anomalies)
Theme 3: Behavioral explanations for anomalies
Theme 4: Risk-based explanations for anomalies

**Step 3: Write thematic paragraphs**. Each paragraph addresses one theme and synthesizes multiple sources.

### Worked Example: Thematic Paragraph

> "The momentum anomaly -- the tendency for past winners to continue outperforming and past losers to continue underperforming over 3-12 month horizons -- presents one of the strongest challenges to market efficiency. First documented by Jegadeesh and Titman (1993) in US equities, the effect has since been confirmed across international markets (Rouwenhorst, 1998), asset classes (Asness, Moskowitz, and Pedersen, 2013), and time periods spanning over a century (Geczy and Samonov, 2016). The robustness and persistence of the effect make it difficult to dismiss as a statistical artifact. Two competing explanations dominate the debate: behavioral models attribute momentum to investor underreaction to new information (Hong and Stein, 1999) or overconfidence-driven continuation of initial price trends (Daniel, Hirshleifer, and Subrahmanyam, 1998), while risk-based models argue that momentum returns compensate for time-varying macroeconomic risk (Johnson, 2002). Neither explanation fully accounts for all features of the data, and the debate remains active."

**Notice**: This paragraph synthesizes six studies into a coherent narrative about a single theme, identifies competing explanations, and notes the unresolved nature of the debate.

## Meta-Analysis

A quantitative synthesis that statistically combines results from multiple studies to estimate an overall effect size.

### When to Use Meta-Analysis

- When multiple studies have estimated the same relationship (e.g., the effect of leverage on firm value)
- When you want to determine whether an effect is robust across studies
- When you want to explain why effect sizes differ across studies (moderator analysis)

### Basic Meta-Analysis Steps

**Step 1**: Collect effect sizes (regression coefficients, correlation coefficients, or event study CARs) from each study.

**Step 2**: Weight each study by precision (typically the inverse of its variance).

> **Weighted Average Effect = sum(w_i x ES_i) / sum(w_i)**

Where w_i = 1 / Var(ES_i) and ES_i = effect size from study i.

**Step 3**: Test for heterogeneity using the Q-statistic or I^2.

> **I^2 = [(Q - df) / Q] x 100%**

I^2 > 75% indicates substantial heterogeneity -- the studies are not measuring the same effect.

**Step 4**: If heterogeneity exists, conduct moderator analysis to explain why effect sizes vary (e.g., differences in sample period, country, or methodology).

### Worked Example: Meta-Analysis of Dividend Announcement Effects

| Study | CAR (%) | Sample Size | SE (%) | Weight (w) |
|-------|---------|-------------|--------|------------|
| Smith (2015) | 2.1 | 500 | 0.5 | 4.00 |
| Jones (2017) | 0.8 | 1,200 | 0.3 | 11.11 |
| Chen (2020) | 3.2 | 200 | 0.9 | 1.23 |
| Brown (2022) | 1.5 | 800 | 0.4 | 6.25 |

Weighted average = (4.00 x 2.1 + 11.11 x 0.8 + 1.23 x 3.2 + 6.25 x 1.5) / (4.00 + 11.11 + 1.23 + 6.25)

= (8.40 + 8.89 + 3.94 + 9.38) / 22.59

= 30.61 / 22.59 = **1.36%**

**Interpretation**: Across four studies, the average abnormal return around dividend increase announcements is approximately 1.36%, weighted by study precision.

## Systematic Reviews

A rigorous, transparent, and replicable approach to identifying and synthesizing all relevant studies on a topic.

### Steps in a Systematic Review

1. **Define the research question**: Use the PICO framework (Population, Intervention, Comparison, Outcome) adapted for finance:
   - Population: US public firms
   - Intervention: Dividend increase
   - Comparison: Firms with no dividend change
   - Outcome: Abnormal stock returns

2. **Develop a search protocol**: Define databases (Web of Science, Scopus, SSRN), search terms, and inclusion/exclusion criteria before searching.

3. **Search systematically**: Run the same search across all databases and record the results.

4. **Screen and select**: Apply inclusion criteria. Use a PRISMA flow diagram to show how you went from initial search results to final included studies.

5. **Extract data**: Record key information from each included study in a standardized table.

6. **Synthesize**: Use thematic analysis, meta-analysis, or both.

7. **Assess quality**: Evaluate the methodological quality of each study.

### PRISMA Flow Diagram

```
Records identified through database searching (n = 850)
    |
    v
Records after duplicates removed (n = 620)
    |
    v
Records screened by title/abstract (n = 620)
    |
    v
Records excluded (n = 480)
    |
    v
Full-text articles assessed for eligibility (n = 140)
    |
    v
Full-text articles excluded with reasons (n = 95)
    |
    v
Studies included in synthesis (n = 45)
```

## Framework for Organizing Literature

A synthesis framework helps you structure your review around the relationships between concepts.

### Concept Matrix

Map studies onto the concepts they address.

| | Capital Structure | Dividend Policy | Corporate Governance | Firm Value |
|---|---|---|---|---|
| Jensen (1986) | | X | X | X |
| Myers (1984) | X | | | X |
| La Porta et al. (2000) | | X | X | |
| Shleifer & Vishny (1997) | | | X | X |

This matrix reveals:
- Which intersections are well-studied (governance and firm value)
- Which intersections are under-studied (capital structure and governance)
- Which concepts are central (firm value appears in many studies)

### Funnel Map

Organize from broad to narrow:

1. **Macro level**: Market-wide evidence (market efficiency, asset pricing anomalies)
2. **Industry level**: Industry-specific patterns (banking regulation, tech valuations)
3. **Firm level**: Firm characteristics (size, leverage, governance)
4. **Event level**: Specific corporate actions (dividends, M&A, IPOs)
5. **Your study**: Where your research fits

## Common Mistakes

1. **Listing instead of synthesizing**: "Smith found X. Jones found Y. Brown found Z." This is a list, not a synthesis. Identify the pattern across all three.

2. **Ignoring contradictory evidence**: Cherry-picking studies that support your view and ignoring those that do not. A good synthesis addresses conflicting evidence and explains why studies disagree.

3. **Treating all studies as equally valid**: A study with 50 observations and no control variables is not as convincing as one with 50,000 observations and robust methodology. Weight your synthesis by study quality.

4. **No framework**: Dumping all studies into one section without organizing by theme, method, or time period. Use a concept matrix or thematic structure.

5. **Confusing narrative review with systematic review**: A narrative review is informal and potentially biased. A systematic review follows a predefined protocol. Be clear about which you are conducting.

6. **Forgetting to state the synthesis conclusion**: After reviewing 20 studies on a theme, explicitly state what the collective evidence tells us: "Taken together, these studies suggest that..."

## Key References

- Tranfield, D., Denyer, D. & Smart, P. (2003). "Towards a Methodology for Developing Evidence-Informed Management Knowledge by Means of Systematic Review." *British Journal of Management*, 14(3), 207-222.
- Borenstein, M., Hedges, L.V., Higgins, J.P.T. & Rothstein, H.R. (2021). *Introduction to Meta-Analysis*, 2nd ed., Wiley.
- Webster, J. & Watson, R.T. (2002). "Analyzing the Past to Prepare for the Future: Writing a Literature Review." *MIS Quarterly*, 26(2), xiii-xxiii.
- Moher, D. et al. (2009). "Preferred Reporting Items for Systematic Reviews and Meta-Analyses: The PRISMA Statement." *PLoS Medicine*, 6(7), e1000097.
