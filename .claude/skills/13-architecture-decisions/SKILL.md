---
name: finance-architecture-decisions
description: "Architecture decision guides for financial Python projects including library selection (pandas vs numpy-financial vs backtrader vs QuantLib vs cvxpy), computation strategy (vectorized vs loops vs multiprocessing), database selection (PostgreSQL vs SQLite for financial data), tool selection for common financial tasks, and test tier selection. Use when asking about 'which library', 'choose library', 'which database', 'which tool', 'architecture decision', 'when to use', 'pandas vs numpy', 'PostgreSQL vs SQLite', 'vectorized vs loops', or 'test tier selection'."
---

# Finance Architecture Decisions

Decision guides for selecting the right libraries, computation strategies, databases, tools, and testing approaches for financial Python projects.

## Overview

Comprehensive decision guides for:

- Library selection (pandas, numpy-financial, backtrader, QuantLib, cvxpy, scipy)
- Computation strategy (vectorized numpy vs pandas vs manual loops vs multiprocessing)
- Database selection (PostgreSQL vs SQLite for financial data)
- Tool selection for common financial tasks
- Test tier selection (Unit, Integration, E2E)
- Financial analysis patterns (fundamental vs technical, top-down vs bottom-up)

## Reference Documentation

### Library Selection

- **[decide-library](decide-library.md)** - Choose the right library
  - pandas: Time series, data wrangling, returns
  - numpy-financial: TVM calculations, NPV, IRR
  - backtrader: Strategy backtesting
  - QuantLib: Derivatives pricing, yield curves
  - cvxpy/scipy: Portfolio optimization
  - When to use each, combining libraries

### Computation Strategy

- **[decide-computation](decide-computation.md)** - Vectorized vs loops vs multiprocessing
  - Vectorized numpy/pandas for bulk calculations
  - Manual loops for path-dependent simulations
  - Multiprocessing for Monte Carlo
  - GPU acceleration considerations

### Database Selection

- **[decide-database-postgresql-sqlite](decide-database-postgresql-sqlite.md)** - PostgreSQL vs SQLite
  - PostgreSQL for production time-series storage
  - SQLite for local analysis and prototyping
  - TimescaleDB extension for time-series
  - Feature comparison for financial workloads

### Tool Selection

- **[decide-tool-for-task](decide-tool-for-task.md)** - Best tool for each financial task
  - Returns calculation: pandas
  - Bond pricing: QuantLib
  - Strategy backtesting: backtrader
  - Portfolio optimization: cvxpy
  - Risk metrics: scipy + numpy

### Test Tier Selection

- **[decide-test-tier](decide-test-tier.md)** - Unit vs Integration vs E2E
  - Tier 1: Pure calculation tests (fast)
  - Tier 2: Data pipeline tests (real data sources)
  - Tier 3: Full strategy/portfolio tests (end-to-end)
  - Financial-specific testing considerations

### Analysis Patterns

- **[analysis-patterns](analysis-patterns.md)** - Financial analysis approaches
  - Fundamental vs technical analysis
  - Top-down vs bottom-up
  - Quantitative vs qualitative
  - Risk assessment frameworks

## Key Decision Frameworks

### Library Selection Matrix

| Need                       | Library         | Why                              |
| -------------------------- | --------------- | -------------------------------- |
| **Time series & returns**  | pandas          | DataFrames, rolling windows      |
| **TVM calculations**       | numpy-financial | NPV, IRR, PMT, FV                |
| **Strategy backtesting**   | backtrader      | Event-driven, analyzers, brokers |
| **Derivatives pricing**    | QuantLib        | Black-Scholes, yield curves      |
| **Portfolio optimization** | cvxpy           | Convex optimization, constraints |
| **Statistical analysis**   | scipy           | Distributions, hypothesis tests  |
| **All of above**           | Combine them    | They work together               |

### Computation Selection Flow

```
What kind of calculation?
  |-- Bulk returns/statistics on DataFrames?
  |     YES -> Vectorized pandas/numpy
  |-- Path-dependent simulation (options)?
  |     YES -> Manual loops with numpy arrays
  |-- Monte Carlo with many trials?
  |     YES -> multiprocessing + numpy
  |-- Convex optimization problem?
        YES -> cvxpy solver
```

### Database Selection Flow

```
What's your use case?
  |-- Production with multiple users?
  |     YES -> PostgreSQL (+ TimescaleDB for time-series)
  |-- Local analysis / Jupyter notebook?
  |     YES -> SQLite or parquet files
  |-- High-frequency tick data?
        YES -> PostgreSQL with partitioning or specialized DB
```

### Test Tier Flow

```
What are you testing?
  |-- Pure financial formula? -> Tier 1 (Unit, benchmark values)
  |-- Data pipeline with API? -> Tier 2 (Integration, real feeds)
  |-- Full strategy backtest? -> Tier 3 (E2E, historical data)
  |-- All of above -> Use all tiers
```

## Critical Decision Rules

### Library Decisions

- Use pandas for all tabular financial data manipulation
- Use numpy-financial for time-value-of-money (do not reimplement NPV/IRR)
- Use backtrader for backtesting (do not build your own event loop)
- Use QuantLib for derivatives pricing (do not reimplement Black-Scholes)
- Use cvxpy for portfolio optimization (do not hand-roll solvers)
- Combine libraries as needed -- they interoperate well

### Computation Decisions

- Default to vectorized operations for performance
- Use multiprocessing for embarrassingly parallel Monte Carlo
- Never use Python loops when numpy broadcasting works
- Profile before optimizing -- measure first

### Database Decisions

- PostgreSQL for production financial data storage
- SQLite for local prototyping and single-user analysis
- Always use parameterized queries for any user-facing input
- Consider parquet files for read-heavy analytical workloads

## When to Use This Skill

Use this skill when you need to:

- Choose between pandas, numpy-financial, backtrader, QuantLib, or cvxpy
- Decide on a computation strategy for financial calculations
- Select a database for financial data storage
- Find the right tool for a specific financial task
- Determine the appropriate test tier
- Choose an analysis methodology

## Related Skills

- **[06-python-finance](../../06-python-finance/SKILL.md)** - Python finance libraries
- **[01-financial-instruments](../../01-financial-instruments/SKILL.md)** - Financial instruments reference
- **[12-testing-strategies](../../12-testing-strategies/SKILL.md)** - Testing strategies
