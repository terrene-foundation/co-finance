---
name: finance-code-templates
description: "Production-ready code templates for financial Python projects including financial calculators, backtesting strategies, data pipelines, and financial calculation tests. Use when asking about 'template', 'example code', 'starter code', 'boilerplate', 'scaffold', 'calculator template', 'strategy template', 'pipeline template', 'test template', 'financial test template', or 'backtest template'."
---

# Finance Code Templates

Production-ready code templates and boilerplate for common financial Python development tasks.

## Overview

Complete templates for:

- Financial calculator classes (with Decimal, validation)
- Backtesting strategy (backtrader with analyzers)
- Market data pipeline (fetch, validate, cache, serve)
- Financial calculation tests (benchmark values)
- Integration tests (data pipeline testing)
- Unit tests (formula validation)
- Basic analysis script

## Reference Documentation

### Calculator Templates

#### Financial Calculator

- **[template-financial-calculator](template-financial-calculator.md)** - Reusable calculator class
  - Decimal-based monetary calculations
  - Input validation
  - TVM functions
  - Risk metrics
  - Type hints and docstrings

### Strategy Templates

#### Backtesting Strategy

- **[template-backtesting-strategy](template-backtesting-strategy.md)** - Backtrader strategy template
  - Strategy class with parameters
  - Indicator setup
  - Order management
  - Analyzers (Sharpe, drawdown, trade stats)
  - Complete Cerebro setup

### Data Pipeline Templates

#### Market Data Pipeline

- **[template-data-pipeline](template-data-pipeline.md)** - Data pipeline template
  - Fetch from API
  - Validate and clean
  - Cache to local storage
  - Serve to consumers
  - Error handling and retry

### Test Templates

#### Financial Tests

- **[template-test-financial](template-test-financial.md)** - Financial test template
  - Benchmark value comparison
  - Tolerance handling with pytest.approx
  - Decimal precision tests
  - Edge case coverage
  - Multi-scenario parametrized tests

#### Integration Tests

- **[template-test-integration](template-test-integration.md)** - Integration test template
  - Data pipeline testing
  - Database roundtrip tests
  - Real file I/O tests
  - Multi-step calculation verification

#### Unit Tests

- **[template-test-unit](template-test-unit.md)** - Unit test template
  - Pure function tests
  - CFA benchmark comparisons
  - Edge case validation
  - Fast execution pattern

### Analysis Script Template

#### Basic Analysis

- **[template-workflow-basic](template-workflow-basic.md)** - Analysis script template
  - Data loading and cleaning
  - Returns calculation
  - Risk metrics
  - Visualization
  - Report output

## Template Usage

### Quick Start Process

1. **Select Template**: Choose relevant template for your task
2. **Copy Code**: Copy template as starting point
3. **Customize**: Adapt to your specific needs
4. **Test**: Verify with real or synthetic data
5. **Refine**: Iterate based on results

### Template Selection Guide

| Task                       | Template                        | Why                          |
| -------------------------- | ------------------------------- | ---------------------------- |
| **Financial calculations** | `template-financial-calculator` | Decimal precision, validated |
| **Trading strategy**       | `template-backtesting-strategy` | Backtrader best practices    |
| **Data ingestion**         | `template-data-pipeline`        | Fetch, validate, cache       |
| **Testing calculations**   | `template-test-financial`       | Benchmark values, tolerance  |
| **Testing pipelines**      | `template-test-integration`     | Real data, real I/O          |
| **Fast formula tests**     | `template-test-unit`            | Pure functions, <1s          |
| **Analysis script**        | `template-workflow-basic`       | Load, analyze, visualize     |

## Best Practices

### Using Templates

- Start with template, then customize
- Keep the validation and error handling
- Follow naming conventions
- Add comments for customization points
- Test modifications with known benchmark values

### Financial-Specific Practices

- Use Decimal for monetary amounts, float64 for returns
- Always validate inputs (no negative prices, no NaN)
- Compare against published benchmark values
- Include disclaimers in any output
- Cite formulas and note assumptions

## Related Skills

- **[06-python-finance](../../06-python-finance/SKILL.md)** - Python finance libraries
- **[13-architecture-decisions](../../13-architecture-decisions/SKILL.md)** - Architecture decisions
- **[12-testing-strategies](../../12-testing-strategies/SKILL.md)** - Testing strategies
- **[17-gold-standards](../../17-gold-standards/SKILL.md)** - Development standards
