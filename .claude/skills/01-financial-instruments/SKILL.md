---
name: financial-instruments
description: "Financial instruments reference covering equities, fixed income, derivatives, forex/crypto, and ETFs/funds. Use when asking about 'stocks', 'bonds', 'options', 'futures', 'derivatives', 'forex', 'cryptocurrency', 'ETFs', 'mutual funds', 'fixed income', 'equities', 'dividends', 'yield', 'Black-Scholes', 'Greeks', 'currency pairs', 'share classes', 'bond pricing', 'put-call parity', 'NAV', 'expense ratio', 'IPO', 'market cap', or 'financial instruments'."
---

# Financial Instruments

Comprehensive reference for financial instrument types, their characteristics, pricing, and Python implementations for analysis and computation.

## Overview

This skill covers the major asset classes traded in financial markets:

- Equity securities (stocks and share classes)
- Fixed income (bonds and yield analysis)
- Derivatives (options, futures, swaps)
- Foreign exchange and cryptocurrencies
- Pooled investment vehicles (ETFs, mutual funds, index funds)

## Reference Documentation

### Equity Securities

- **[equities](equities.md)** - Stock types, market cap classifications, sectors, exchanges, IPOs, dividends, and voting rights. Includes yfinance examples for data retrieval.

### Fixed Income Securities

- **[fixed-income](fixed-income.md)** - Bond types, yield calculations (YTM, current yield, spread), duration, convexity, credit ratings, and bond pricing. Includes numpy-financial examples.

### Derivative Instruments

- **[derivatives](derivatives.md)** - Options (calls/puts, American/European), futures, swaps, forwards. Greeks (delta, gamma, theta, vega, rho), put-call parity, and Black-Scholes implementation.

### Foreign Exchange and Cryptocurrency

- **[forex-crypto](forex-crypto.md)** - Currency pairs, exchange rate conventions, pip calculations, cryptocurrency fundamentals, and market structure differences.

### ETFs and Funds

- **[etfs-funds](etfs-funds.md)** - ETFs vs mutual funds vs index funds, expense ratios, tracking error, NAV, creation/redemption, factor-based ETFs, and portfolio construction.

## When to Use This Skill

Use this skill when:

- Building financial data pipelines or dashboards
- Implementing pricing models for securities
- Working with market data APIs to retrieve instrument information
- Constructing portfolios across asset classes
- Understanding the characteristics of different financial products

## Related Skills

- **[02-market-analysis](../02-market-analysis/SKILL.md)** - Technical and fundamental analysis of securities
- **[03-portfolio-theory](../03-portfolio-theory/SKILL.md)** - Portfolio construction and optimization
- **[04-risk-management](../04-risk-management/SKILL.md)** - Risk measurement and hedging
- **[05-financial-data-apis](../05-financial-data-apis/SKILL.md)** - Data retrieval APIs and caching
