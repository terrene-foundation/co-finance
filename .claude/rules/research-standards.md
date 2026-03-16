# Research Standards Rules

## Scope

These rules apply to all research activities, including literature reviews, data collection, empirical analysis, thesis research, case study research, and any work that involves gathering, evaluating, or synthesizing information from external sources. They apply to both undergraduate and postgraduate finance research.

## MUST Rules

### 1. Prefer Peer-Reviewed Sources from Academic Databases

Research MUST prioritize peer-reviewed academic sources. For finance research, these include journals indexed in established databases.

**Preferred Academic Databases**:

- **JSTOR** — Historical and current journal articles across disciplines
- **SSRN** (Social Science Research Network) — Working papers and preprints in finance and economics
- **Google Scholar** — Broad academic search (verify the source quality of results)
- **EBSCOhost / Business Source Complete** — Business and finance journals
- **ProQuest** — Dissertations, theses, and journal articles
- **ScienceDirect / Elsevier** — Major publisher of finance journals
- **Wiley Online Library** — Publisher of many finance and accounting journals

**Top Finance Journals** (not exhaustive, but a starting reference):

- Journal of Finance
- Journal of Financial Economics
- Review of Financial Studies
- Journal of Financial and Quantitative Analysis
- Journal of Monetary Economics
- Journal of Banking and Finance
- Financial Analysts Journal

**Source Priority Order**:

1. Peer-reviewed journal articles
2. Working papers from reputable institutions (NBER, SSRN from known authors, central bank working paper series)
3. Books and textbook chapters by recognized authorities
4. Official institutional reports (IMF, World Bank, BIS, central banks, SEC)
5. Reputable financial press (for current events only, not for theoretical claims)

**Enforced by**: research-assistant agent
**Violation**: HIGH priority fix — replace or supplement with peer-reviewed sources

### 2. Apply the CRAAP Test to All Sources

Every source used in research MUST be evaluated against the CRAAP test before inclusion. This is especially important for non-journal sources.

| Criterion | Question to Ask | Finance-Specific Guidance |
|-----------|----------------|--------------------------|
| **Currency** | When was it published or last updated? | Financial regulations, market structures, and economic conditions change rapidly. A paper on banking regulation from 2005 may not reflect post-2008 reforms. Check if the findings predate major structural changes. |
| **Relevance** | Does it address your research question? | A paper on equity markets in developed economies may not apply to your research on emerging market debt. Verify that the context (geography, time period, market type) matches your scope. |
| **Authority** | Who wrote it? What are their credentials? | Check the author's institutional affiliation, publication record, and expertise. A Federal Reserve economist writing about monetary policy carries different weight than an anonymous blog author. |
| **Accuracy** | Is the information supported by evidence? | Does the source present data, methodology, and results transparently? Can the findings be verified or replicated? Are the statistical methods appropriate? |
| **Purpose** | Why does this source exist? | Distinguish between academic research (seeking truth), advocacy (promoting a position), and marketing (selling a product). Industry white papers from asset managers may have promotional intent. |

**Correct Evaluation**:

```
Source: "The Impact of Quantitative Easing on Asset Prices" by Krishnamurthy
and Vissing-Jorgensen (2011), Brookings Papers on Economic Activity.

Currency: Published 2011, covers QE1 and QE2. Still relevant as a foundational
study, but should be supplemented with research covering QE3 and post-COVID QE.
Relevance: Directly addresses my research question on unconventional monetary policy.
Authority: Both authors are established finance professors; published in a
top-tier policy journal.
Accuracy: Uses event-study methodology with clearly described data and methods.
Purpose: Academic research with no apparent commercial interest.

Assessment: Strong source for foundational QE analysis. Will supplement with
more recent studies for post-2020 developments.
```

**Enforced by**: research-assistant agent
**Violation**: HIGH priority fix — document the CRAAP evaluation or replace the source

### 3. Match Research Methodology to the Research Question

The research methodology MUST be appropriate for the type of question being asked. Choosing the wrong method undermines the validity of the findings.

**Common Finance Research Methodologies and Their Applications**:

| Research Question Type | Appropriate Methods | Example |
|----------------------|-------------------|---------|
| "What is the effect of X on Y?" | Regression analysis, event study, difference-in-differences | "What is the effect of dividend announcements on stock prices?" |
| "How does X relate to Y?" | Correlation analysis, panel data models, Granger causality | "How do interest rates relate to housing prices?" |
| "What happened and why?" | Case study analysis, historical analysis, qualitative research | "Why did Long-Term Capital Management fail?" |
| "What is the best strategy for X?" | Backtesting, optimization, simulation | "What is the optimal rebalancing frequency for a 60/40 portfolio?" |
| "What do practitioners/experts think about X?" | Surveys, interviews, content analysis | "How do CFOs perceive the trade-off between debt and equity financing?" |
| "What does the literature say about X?" | Systematic literature review, meta-analysis | "What is the consensus on the small-cap premium?" |

**Methodology Mismatch Examples**:

```
Incorrect: Using a case study of one company to prove a general claim about
all firms in an industry. (A single case cannot establish generalizability.)

Incorrect: Running a regression with 15 observations and drawing strong
causal conclusions. (Insufficient sample size for statistical inference.)

Incorrect: Using correlation to claim causation without addressing
endogeneity. ("Countries with more ice cream sales have more drownings"
does not mean ice cream causes drowning.)
```

**Enforced by**: research-assistant agent
**Violation**: HIGH priority fix — justify the methodology choice or select an appropriate method

### 4. Use Data from Reputable Sources

All data used in research MUST come from authoritative, well-documented sources. The data source, time period, frequency, and any transformations MUST be documented.

**Reputable Data Sources for Finance Research**:

| Source | Data Available | Access |
|--------|---------------|--------|
| **FRED** (Federal Reserve Economic Data) | Interest rates, GDP, inflation, employment, monetary aggregates | Free |
| **World Bank Open Data** | Global development indicators, GDP, trade, poverty | Free |
| **IMF Data** | International financial statistics, balance of payments, exchange rates | Free |
| **BIS Statistics** | International banking, derivatives, debt securities, exchange rates | Free |
| **OECD Data** | Economic indicators for member countries | Free / institutional |
| **SEC EDGAR** | Company filings, financial statements, insider transactions | Free |
| **CRSP** (Center for Research in Security Prices) | US stock prices, returns, market indices | Institutional subscription |
| **Compustat** | Company financial statements, fundamental data | Institutional subscription |
| **Bloomberg Terminal** | Real-time and historical market data, news, analytics | Institutional subscription |
| **Refinitiv (formerly Thomson Reuters)** | Market data, company fundamentals, ESG data | Institutional subscription |

**Data Documentation Requirements**:

```
Correct:
"We use monthly adjusted closing prices for S&P 500 constituents from CRSP
for the period January 2000 to December 2023 (n = 288 observations per firm).
Returns are calculated as log returns. Firms with fewer than 60 months of
continuous data are excluded, resulting in a final sample of 387 firms."

Incorrect:
"We got stock price data from the internet for the last few years."
```

**Enforced by**: research-assistant agent
**Violation**: HIGH priority fix — document the data source or replace with a reputable source

### 5. Distinguish Between Primary and Secondary Sources

Research MUST correctly identify and appropriately use primary versus secondary sources.

**Primary Sources** — original, first-hand evidence:

- Original research articles reporting new empirical findings
- Company financial statements (10-K, 10-Q filings)
- Central bank meeting minutes, speeches, and press releases
- Legislative and regulatory texts
- Raw datasets
- Interview transcripts or survey data you collected yourself
- Historical documents (e.g., original text of the Bretton Woods agreement)

**Secondary Sources** — interpret, analyze, or summarize primary sources:

- Textbooks summarizing established theories
- Literature review articles
- News reporting on research findings
- Commentary or opinion pieces discussing primary research
- Encyclopedias and reference works

**Rules for Use**:

- For theoretical claims, cite the **primary source** (the original paper or book), not a textbook that describes it. Write "Modigliani and Miller (1958)" not "as described in Brealey, Myers, and Allen (2020)."
- When you cannot access the primary source, use "as cited in" format: "Modigliani and Miller (1958, as cited in Brealey et al., 2020)." This is a signal that you have not verified the original.
- Secondary sources are appropriate for providing context, summarizing broad literatures, or citing established consensus.
- Your own empirical analysis should be treated as primary evidence within your paper.

**Enforced by**: research-assistant agent
**Violation**: MEDIUM priority fix — replace secondary citations with primary sources where feasible

### 6. Document Limitations and Potential Biases

All research MUST honestly acknowledge its limitations, including data limitations, methodological constraints, and potential sources of bias.

**Common Limitations to Address**:

- **Survivorship bias**: If your dataset only includes firms that still exist, you are missing firms that failed or were acquired, which can distort performance conclusions
- **Sample selection bias**: If your sample is not representative of the population you are making claims about
- **Look-ahead bias**: If your analysis uses information that would not have been available at the time of the decision being studied
- **Data limitations**: Short time series, missing observations, low frequency data for high-frequency questions
- **Geographic or temporal scope**: Findings from US equity markets may not generalize to European bond markets or emerging economies

**Correct**:

```
This study has several limitations. First, the sample period (2015-2024)
does not include a prolonged bear market, which may limit the generalizability
of the risk management findings to severe downturn conditions. Second, the
dataset excludes firms with market capitalization below $500 million, which
means the results may not apply to small-cap stocks. Third, the use of
monthly return data may obscure intra-month volatility dynamics that would
be visible at daily or intraday frequencies.
```

**Incorrect**:

```
There are no major limitations to this study.
```

(Every study has limitations. Claiming otherwise signals a lack of methodological awareness.)

**Enforced by**: research-assistant agent
**Violation**: HIGH priority fix — add a limitations section

## MUST NOT Rules

### 1. No Cherry-Picking Evidence

MUST NOT selectively present only evidence that supports your thesis while ignoring contradictory findings. Academic research requires engaging with counterarguments.

**Detection Patterns**:

```
"All studies support the efficient market hypothesis."
(This ignores decades of behavioral finance research documenting anomalies.)

"The evidence unanimously shows that value investing outperforms."
(This ignores periods and studies where value underperformed, such as 2010-2020.)
```

**Correct Approach**: Present the strongest evidence on all sides, then explain why your interpretation is more compelling.

```
"While Fama and French (1993) demonstrated a persistent value premium in US
equities, Asness et al. (2018) documented significant time variation in the
premium, including an extended period of value underperformance from 2010 to
2020. This paper argues that the value premium remains economically meaningful
over full market cycles, but acknowledges that its timing is unpredictable."
```

**Consequence**: HIGH priority fix — present counterevidence and address it

### 2. No Use of Outdated Data Without Justification

MUST NOT present data from more than 5 years ago as current without acknowledging its age and explaining why older data is being used.

**Detection Patterns**:

```
"The unemployment rate in the United States is 3.7%."
(If this statistic is from 2023 and the paper is being written in 2026,
the actual rate may have changed significantly.)
```

**Acceptable Uses of Older Data**:

- Historical analysis that requires a specific time period
- Replication studies using the same data as the original
- Long-term trend analysis where the full time series is the point
- When current data is unavailable and the limitation is noted

**Consequence**: HIGH priority fix — update the data or justify its age

### 3. No Confusing Correlation with Causation

MUST NOT claim that one variable causes another based solely on a statistical correlation or regression without addressing the identification strategy.

**Detection Patterns**:

```
"Our regression shows that higher ESG scores cause better stock returns."
(Regression coefficients do not establish causation without addressing
endogeneity, omitted variables, and reverse causality.)
```

**Correct Alternative**:

```
"Our regression results indicate a positive and statistically significant
association between ESG scores and stock returns. However, this relationship
may be driven by omitted variables such as firm quality or management
competence, and we cannot rule out reverse causality — that is, better-
performing firms may invest more in ESG initiatives because they can afford
to. Future research using instrumental variables or natural experiments
could help establish the causal direction."
```

**Consequence**: HIGH priority fix — qualify the causal language

### 4. No P-Hacking or Data Mining Without Disclosure

MUST NOT run multiple statistical tests until a significant result appears and then present only the significant result as though it were the only test conducted.

**Consequence**: HIGH priority fix — report all tests conducted, apply multiple testing corrections, or clearly disclose the exploratory nature of the analysis

## Exceptions

Research standards exceptions include:

1. **Preliminary or exploratory research**: Early-stage research may use less rigorous sources for initial scoping. However, the final submission must meet the standards above.
2. **Practitioner-oriented assignments**: Some courses ask for industry-style research (e.g., equity research reports, consulting memos). These may rely more heavily on industry sources and less on peer-reviewed journals, but data quality and source documentation requirements still apply.
3. **Qualitative research**: Case studies and qualitative analyses follow different methodological standards (e.g., Yin's case study methodology). The rigor requirement applies, but the specific methods differ from quantitative research.
4. **Unavailable primary sources**: When a primary source is behind a paywall or in a language you cannot read, citing through a reputable secondary source with "as cited in" notation is acceptable. Note this as a limitation.
