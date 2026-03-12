# User Flows: FMI COC Adaptation

## Flow 1: New Finance Project Setup

**User goal**: Start a new finance learning/analysis project from scratch.

### Journey

1. User opens terminal, runs `claude` in project directory
2. Session starts → `session-start.js` fires, shows workspace status
3. User types `/start`
4. COC explains the finance-focused workflow:
   - "This environment is set up to help you build financial education tools, investment analysis software, and market learning platforms."
   - Explains the 5 phases and finance-specific agents available
5. User fills out `briefs/01-product-brief.md` with their finance project vision
6. User runs `/analyze` → research agents analyze the finance domain context
7. User runs `/todos` → roadmap is created with finance-specific tasks
8. User runs `/implement` → finance agents assist with building
9. User runs `/redteam` → financial accuracy, disclaimers, pedagogical quality tested
10. User runs `/codify` → finance-specific knowledge captured for future sessions

### Key Touchpoints with Finance Agents

| Phase      | Finance Agents Involved                                                |
| ---------- | ---------------------------------------------------------------------- |
| /analyze   | market-data-specialist, curriculum-designer, financial-literacy-expert |
| /todos     | curriculum-designer, portfolio-analyst, risk-analyst                   |
| /implement | All finance specialists as needed                                      |
| /redteam   | regulatory-compliance, financial-modeling (accuracy check)             |

---

## Flow 2: Building a Portfolio Analysis Tool

**User goal**: Build a web app that lets users analyze stock portfolios.

### Journey

1. User describes: "I want to build a tool where users can enter stock tickers and see portfolio analysis — risk metrics, allocation breakdown, historical performance."

2. `/analyze` phase:
   - **market-data-specialist** recommends data sources (yfinance for prototyping, polygon.io for production)
   - **portfolio-analyst** defines the analysis features: returns, Sharpe ratio, beta, max drawdown, correlation matrix, efficient frontier
   - **risk-analyst** specifies risk metrics implementation: VaR (historical + parametric), stress testing against historical events
   - **regulatory-compliance** adds disclaimer requirements

3. `/todos` phase:
   - Data pipeline setup (fetch, cache, normalize)
   - Portfolio calculations (returns, risk metrics)
   - Visualization layer (charts, tables)
   - Frontend (dashboard with interactive charts)
   - Testing (calculation accuracy, API error handling)

4. `/implement` phase — for each task:
   - **pattern-expert** checks if pandas/numpy/scipy patterns exist before writing custom code
   - **financial-modeling** validates calculation correctness
   - **react-specialist** builds financial dashboard with recharts/plotly
   - **intermediate-reviewer** reviews code quality
   - **validate-financial-accuracy.js** hook fires on every Edit/Write to .py files

5. `/redteam` phase:
   - Are all formulas correct? (Compare against known portfolio analytics tools)
   - Do disclaimers appear everywhere required?
   - Does the tool handle edge cases? (Empty portfolio, single stock, missing data)
   - Is the UI accessible and readable with financial data?

---

## Flow 3: Creating a Finance Learning Module

**User goal**: Create an interactive learning module about Modern Portfolio Theory.

### Journey

1. User describes: "I want to create a learning module that teaches MPT — starting from basic concepts and building up to efficient frontier calculation."

2. `/analyze` phase:
   - **curriculum-designer** creates learning progression:
     - Lesson 1: What is diversification? (beginner)
     - Lesson 2: Risk and return tradeoff (beginner)
     - Lesson 3: Correlation between assets (intermediate)
     - Lesson 4: Efficient frontier (intermediate)
     - Lesson 5: Build your own optimizer (advanced)
   - **financial-literacy-expert** ensures explanations are accessible
   - **portfolio-analyst** validates technical accuracy

3. `/implement` phase:
   - Each lesson includes:
     - Conceptual explanation (plain language, analogies)
     - Interactive example with real data
     - Knowledge check / exercise
   - **financial-accuracy** hook validates all formulas
   - **disclaimer** hook ensures educational disclaimers present

4. `/redteam` phase:
   - **curriculum-designer** validates learning progression
   - **value-auditor** checks: does a beginner actually understand MPT after completing?
   - **regulatory-compliance** verifies no content crosses into financial advice

---

## Flow 4: Building a Backtesting Engine

**User goal**: Build a tool to backtest investment strategies.

### Journey

1. User describes: "I want to build a backtesting tool where users can define simple strategies (moving average crossover, RSI-based) and see how they would have performed."

2. `/analyze` phase:
   - **quant-developer** evaluates backtesting frameworks: backtrader vs vectorbt vs custom
   - **market-data-specialist** plans historical data pipeline
   - **risk-analyst** defines performance metrics to include
   - **regulatory-compliance** specifies hypothetical performance disclaimers (SEC-mandated language)

3. `/implement` phase:
   - **pattern-expert** ensures standard backtesting patterns (avoid look-ahead bias, handle survivorship bias)
   - **quant-developer** implements strategy framework
   - **financial-modeling** validates performance calculations
   - Testing includes: known-answer tests (backtest on historical data with known outcomes)

4. `/redteam` phase:
   - Does the backtest correctly handle dividends, splits, and corporate actions?
   - Are results consistent with other tools (manual comparison)?
   - Are all hypothetical disclaimers present?
   - Does the UI clearly distinguish backtested from real performance?

---

## Flow 5: Quick Finance Reference (Ad-Hoc)

**User goal**: Quickly look up a financial formula or pattern while coding.

### Journey

| User Action   | Result                                                                              |
| ------------- | ----------------------------------------------------------------------------------- |
| `/finance`    | Shows financial calculation cheatsheet: NPV, IRR, Sharpe, etc. with Python examples |
| `/data`       | Shows market data API quick reference: endpoints, rate limits, code snippets        |
| `/portfolio`  | Shows portfolio construction patterns: allocation, optimization, rebalancing        |
| `/backtest`   | Shows backtesting patterns: strategy definition, performance evaluation             |
| `/curriculum` | Shows learning design patterns: Bloom's taxonomy, assessment types                  |

---

## Hook Enforcement Flow

When a user writes or edits a Python file containing financial calculations:

```
User edits file.py
  → PostToolUse fires
  → validate-financial-accuracy.js runs:
    - Checks for common formula errors
    - Checks for hardcoded financial constants without documentation
    - Checks for missing precision handling (floating point in currency)
  → validate-disclaimer.js runs:
    - Checks if file references returns/performance
    - Warns if no disclaimer block found
  → auto-format.js runs:
    - Standard formatting
  → Results shown to user as warnings/blocks
```
