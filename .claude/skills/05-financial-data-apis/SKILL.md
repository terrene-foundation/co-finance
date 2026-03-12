---
name: financial-data-apis
description: "Financial data APIs reference covering yfinance, Polygon.io, Alpha Vantage, FRED, Quandl, IEX Cloud, and caching strategies. Use when asking about 'yfinance', 'Polygon', 'Alpha Vantage', 'FRED', 'Quandl', 'IEX Cloud', 'market data API', 'financial data', 'data provider', 'API comparison', 'rate limiting', 'data caching', 'historical data', 'real-time data', 'economic data', 'options data', 'fundamentals data', or 'financial data API'."
---

# Financial Data APIs

Comprehensive reference for financial data providers including API comparisons, usage guides, and caching strategies.

## Overview

This skill covers the major financial data sources and best practices:

- Comparison of data providers (cost, coverage, quality)
- Detailed usage guides for yfinance, Polygon.io, and FRED
- Caching strategies for efficient data management
- Rate limiting and error handling patterns

## Reference Documentation

### Provider Comparison

- **[api-comparison](api-comparison.md)** - Compare yfinance, Polygon.io, Alpha Vantage, FRED, Quandl/Nasdaq Data Link, IEX Cloud. Pricing, rate limits, data quality, coverage, licensing.

### yfinance

- **[yfinance-guide](yfinance-guide.md)** - Complete yfinance usage: historical data, fundamentals, options chains, earnings, dividends, multiple tickers, error handling, rate limiting.

### Polygon.io

- **[polygon-guide](polygon-guide.md)** - Polygon.io REST and WebSocket APIs: real-time quotes, aggregates, options, reference data, authentication, pagination.

### FRED (Federal Reserve Economic Data)

- **[fred-guide](fred-guide.md)** - Economic indicators (GDP, CPI, unemployment, fed funds rate, yield curves), fredapi usage, time series analysis.

### Caching Strategies

- **[caching-patterns](caching-patterns.md)** - Local caching (SQLite, pickle, parquet), cache invalidation, market hours handling, tiered caching, rate limit management.

## When to Use This Skill

Use this skill when:

- Choosing a financial data provider for a project
- Retrieving historical or real-time market data
- Working with economic indicators and macro data
- Implementing efficient data pipelines with caching
- Handling rate limits and data freshness requirements

## Related Skills

- **[01-financial-instruments](../01-financial-instruments/SKILL.md)** - Understanding the data being retrieved
- **[02-market-analysis](../02-market-analysis/SKILL.md)** - Analyzing retrieved data
- **[03-portfolio-theory](../03-portfolio-theory/SKILL.md)** - Using data for portfolio construction
- **[04-risk-management](../04-risk-management/SKILL.md)** - Data for risk calculations
