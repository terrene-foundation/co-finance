---
name: development-guides
description: "Comprehensive development guides for Python finance applications including production deployment, testing strategies, security patterns, monitoring, circuit breaker patterns, compliance, and resilience. Use when asking about 'development guide', 'production deployment', 'testing strategies', 'security patterns', 'monitoring setup', 'circuit breaker', 'compliance', 'resilience', 'metrics collection', or 'regression testing'."
---

# Development Guides - Python Finance Applications

Comprehensive guides for building production-grade Python finance applications, covering deployment, testing, security, and enterprise features.

## Overview

In-depth guides for:

- Production deployment strategies
- Comprehensive testing approaches
- Enterprise security and compliance
- Monitoring and observability
- Resilience patterns

## Testing & Quality

### Testing Strategies

- **[testing-best-practices](testing-best-practices.md)** - Testing best practices
- **[test-organization](test-organization.md)** - Test organization strategies
- **[production-testing](production-testing.md)** - Production testing approaches
- **[regression-testing](regression-testing.md)** - Regression testing patterns

## Production & Operations

### Deployment

- **[production-deployment-guide](production-deployment-guide.md)** - Production deployment guide

### Monitoring & Observability

- **[monitoring-enterprise](monitoring-enterprise.md)** - Enterprise monitoring
- **[metrics-collection](metrics-collection.md)** - Metrics and telemetry

### Resilience

- **[resilience-enterprise](resilience-enterprise.md)** - Enterprise resilience patterns
- **[circuit-breaker](circuit-breaker.md)** - Circuit breaker implementation

## Enterprise & Security

### Security

- **[security-patterns-enterprise](security-patterns-enterprise.md)** - Enterprise security patterns
- **[compliance-patterns](compliance-patterns.md)** - Compliance and governance

## CRITICAL Warnings

| Rule                                     | Reason                    |
| ---------------------------------------- | ------------------------- |
| Always handle errors in async operations | Prevents hanging          |
| Never use blocking I/O in async code     | Blocks event loop         |
| Always validate financial calculations   | Precision errors compound |
| Never hardcode API keys                  | Use environment variables |

## When to Use This Skill

Use this skill when you need:

- Production deployment strategies
- Comprehensive testing approaches
- Enterprise security patterns
- Monitoring and observability setup
- Resilience and circuit breaker patterns
- Compliance guidance

## Related Skills

- **[06-cheatsheets](../06-cheatsheets/SKILL.md)** - Quick reference patterns
- **[12-testing-strategies](../12-testing-strategies/SKILL.md)** - Testing strategies
- **[18-security-patterns](../18-security-patterns/SKILL.md)** - Security patterns
