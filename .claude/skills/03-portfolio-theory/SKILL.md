---
name: portfolio-theory
description: "Portfolio theory reference covering Markowitz mean-variance framework, CAPM, factor models, efficient frontier, and portfolio optimization. Use when asking about 'portfolio theory', 'Markowitz', 'mean-variance', 'efficient frontier', 'CAPM', 'beta', 'alpha', 'Fama-French', 'factor model', 'portfolio optimization', 'risk parity', 'Black-Litterman', 'Sharpe ratio', 'minimum variance', 'tangency portfolio', 'diversification', 'correlation matrix', or 'asset allocation'."
---

# Portfolio Theory

Comprehensive reference for modern portfolio theory, factor models, efficient frontier computation, and portfolio optimization with Python implementations.

## Overview

This skill covers the mathematical foundations of portfolio construction:

- Markowitz mean-variance framework and diversification
- CAPM, beta estimation, and multi-factor models
- Efficient frontier computation and visualization
- Optimization techniques (mean-variance, risk parity, Black-Litterman)

## Reference Documentation

### Mean-Variance Framework

- **[mpt-basics](mpt-basics.md)** - Markowitz framework, risk-return tradeoff, diversification benefit, correlation matrices. Full Python implementation with numpy/scipy.

### Factor Models

- **[capm-factor-models](capm-factor-models.md)** - CAPM, beta estimation, Security Market Line, Fama-French 3-factor and 5-factor models, Carhart 4-factor model, alpha. Implementation with statsmodels.

### Efficient Frontier

- **[efficient-frontier](efficient-frontier.md)** - Computing the efficient frontier, minimum variance portfolio, tangency portfolio, capital allocation line, short-selling constraints. Visualization with matplotlib.

### Portfolio Optimization

- **[portfolio-optimization](portfolio-optimization.md)** - Mean-variance optimization, risk parity, Black-Litterman model, maximum Sharpe ratio, minimum volatility, constraints handling. Implementation with cvxpy/scipy.optimize.

## When to Use This Skill

Use this skill when:

- Constructing and optimizing investment portfolios
- Estimating expected returns and risk for asset allocations
- Implementing factor-based investment strategies
- Building portfolio analytics dashboards
- Understanding the theoretical basis of diversification

## Related Skills

- **[01-financial-instruments](../01-financial-instruments/SKILL.md)** - Understanding the assets in a portfolio
- **[02-market-analysis](../02-market-analysis/SKILL.md)** - Analysis for return estimation
- **[04-risk-management](../04-risk-management/SKILL.md)** - Portfolio risk measurement and hedging
- **[05-financial-data-apis](../05-financial-data-apis/SKILL.md)** - Data retrieval for portfolio analysis
