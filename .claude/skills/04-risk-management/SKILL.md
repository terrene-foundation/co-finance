---
name: risk-management
description: "Risk management reference covering VaR methods, stress testing, hedging strategies, and options Greeks for risk management. Use when asking about 'VaR', 'Value at Risk', 'Expected Shortfall', 'CVaR', 'stress testing', 'scenario analysis', 'hedging', 'delta hedging', 'protective put', 'covered call', 'collar', 'options Greeks', 'gamma scalping', 'risk management', 'risk measurement', 'backtesting VaR', or 'portfolio risk'."
---

# Risk Management

Comprehensive reference for financial risk measurement, stress testing, hedging strategies, and options-based risk management with Python implementations.

## Overview

This skill covers the major approaches to managing financial risk:

- Value at Risk (VaR) and Expected Shortfall calculation methods
- Stress testing and scenario analysis frameworks
- Hedging strategies using derivatives
- Options Greeks for risk monitoring and management

## Reference Documentation

### Value at Risk

- **[var-methods](var-methods.md)** - Historical VaR, parametric VaR, Monte Carlo VaR, Expected Shortfall (CVaR), confidence levels, time horizons, backtesting VaR models.

### Stress Testing

- **[stress-testing](stress-testing.md)** - Scenario analysis, historical stress tests (2008 GFC, COVID crash, dot-com), sensitivity analysis, reverse stress testing.

### Hedging Strategies

- **[hedging-strategies](hedging-strategies.md)** - Delta hedging, protective puts, covered calls, collar strategies, portfolio insurance, cross-hedging, basis risk.

### Options Greeks for Risk Management

- **[options-greeks](options-greeks.md)** - Delta, gamma, theta, vega, rho -- intuition, calculation, visualization. Greek-based risk management, gamma scalping, vega-neutral portfolios.

## When to Use This Skill

Use this skill when:

- Measuring portfolio risk exposure
- Implementing risk limits and monitoring systems
- Designing hedging strategies for existing positions
- Building stress testing frameworks
- Managing options portfolios with Greek-based risk controls

## Related Skills

- **[01-financial-instruments](../01-financial-instruments/SKILL.md)** - Understanding instruments and their risk characteristics
- **[02-market-analysis](../02-market-analysis/SKILL.md)** - Market analysis for risk assessment
- **[03-portfolio-theory](../03-portfolio-theory/SKILL.md)** - Portfolio construction with risk constraints
- **[05-financial-data-apis](../05-financial-data-apis/SKILL.md)** - Data retrieval for risk calculations
