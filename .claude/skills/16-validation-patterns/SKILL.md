---
name: validation-patterns
description: "Validation patterns for Python finance code including price data sanity checks, volume anomaly detection, corporate action detection, benchmark comparison, formula cross-checks, and compliance validation. Use when asking about 'validation', 'validate', 'check compliance', 'verify', 'data quality', 'price sanity', 'volume anomaly', 'split detection', 'benchmark comparison', 'formula cross-check', or 'disclaimer check'."
---

# Python Finance Validation Patterns

Comprehensive validation patterns for financial data quality, calculation correctness, and regulatory compliance.

## Overview

Validation tools and patterns for:

- Price data sanity (positive prices, high >= low, extreme moves)
- Volume anomaly detection (zero volume, spikes, suspicious patterns)
- Corporate action detection (stock splits from price discontinuities)
- Benchmark comparison (NPV/IRR against CFA published values)
- Formula cross-checks (mathematical identities that must hold)
- Compliance validation (disclaimers, data attribution, secrets)

## Reference Documentation

### Data Quality Validations

#### Price Data Sanity

- **[validate-price-sanity](validate-price-sanity.md)** - Price data validation
  - Positive prices check
  - High >= Low OHLC relationship
  - Extreme daily move detection
  - Stale data detection
  - NaN and missing value checks

#### Volume Anomaly Detection

- **[validate-volume-anomalies](validate-volume-anomalies.md)** - Volume validation
  - Zero volume day detection
  - Volume spike detection (multiples of median)
  - Negative volume (data error)
  - Round number pattern detection

#### Corporate Action Detection

- **[validate-corporate-actions](validate-corporate-actions.md)** - Split detection
  - Price discontinuity detection
  - Common split ratio matching (2:1, 3:1, etc.)
  - Adjusted vs unadjusted price verification
  - Forward/reverse split identification

### Calculation Validations

#### Benchmark Comparison

- **[validate-benchmark-comparison](validate-benchmark-comparison.md)** - Published benchmarks
  - NPV validation against CFA Level I values
  - IRR validation with known cashflows
  - Future value compound interest verification
  - Sharpe ratio reasonableness bounds
  - Volatility reasonableness bounds

#### Formula Cross-Checks

- **[validate-formula-crosscheck](validate-formula-crosscheck.md)** - Mathematical identities
  - Cumulative return identity (from returns vs from prices)
  - Geometric mean <= arithmetic mean (Jensen's inequality)
  - Portfolio weights sum to 1.0
  - Covariance matrix symmetry and positive semi-definiteness
  - Log return / simple return equivalence

### Compliance Validations

#### Compliance and Disclaimers

- **[validate-compliance](validate-compliance.md)** - Regulatory compliance
  - Disclaimer presence detection
  - Hardcoded secrets detection
  - Data source attribution verification
  - Hypothetical performance labeling (SEC/FINRA)
  - API key environment variable usage

## Quick Validation Checklist

### Data Quality

- [ ] All prices positive
- [ ] High >= Low for OHLC data
- [ ] No extreme daily moves (> 50%) without explanation
- [ ] No stale data (repeated identical closes)
- [ ] Volume non-negative
- [ ] No NaN in critical columns
- [ ] Dates are timezone-aware and sorted

### Calculation Correctness

- [ ] Results match published benchmarks within tolerance
- [ ] Portfolio weights sum to 1.0
- [ ] Cumulative return identity holds
- [ ] Geometric mean <= arithmetic mean
- [ ] Sharpe ratio in [-5, 5] range
- [ ] Volatility in (0, 200%) range for annual data
- [ ] Covariance matrix is symmetric and PSD

### Compliance

- [ ] Disclaimer present in user-facing output
- [ ] Data source attributed
- [ ] Hypothetical results labeled
- [ ] No hardcoded API keys or secrets
- [ ] API keys loaded from environment variables

## When to Use This Skill

Use this skill when you need to:

- Validate financial data before analysis
- Check calculation results against known benchmarks
- Detect data quality issues (splits, anomalies, stale data)
- Ensure compliance with disclosure requirements
- Cross-check calculations using mathematical identities
- Audit code for security (hardcoded secrets)

## Related Skills

- **[17-gold-standards](../17-gold-standards/SKILL.md)** - Development standards
- **[15-error-troubleshooting](../15-error-troubleshooting/SKILL.md)** - Error troubleshooting
- **[06-python-finance](../06-python-finance/SKILL.md)** - Python finance libraries

<!-- Trigger Keywords: validation, validate, check compliance, verify, data quality, price sanity, volume anomaly, split detection, benchmark comparison, formula cross-check, disclaimer check, corporate action, covariance check, weights sum -->
