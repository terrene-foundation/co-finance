---
name: validate-compliance
description: "Validate compliance requirements including disclaimers, data attribution, and security. Use when asking 'check disclaimer', 'compliance check', 'data attribution', 'security validation', or 'regulatory compliance'."
---

# Validate Compliance

> **Skill Metadata**
> Category: `validation`
> Priority: `HIGH`

## Compliance Validation Functions

```python
import os
import re
import logging

logger = logging.getLogger(__name__)


def validate_disclaimer_present(output_text: str) -> bool:
    """Check that financial output includes a disclaimer.

    Any user-facing financial output must include language indicating
    the content is for educational/informational purposes only.
    """
    disclaimer_patterns = [
        r"not\s+(?:investment\s+)?advice",
        r"educational\s+purposes?\s+only",
        r"informational\s+purposes?\s+only",
        r"past\s+performance.*(?:not|no)\s+(?:guarantee|indicat)",
        r"hypothetical",
        r"simulated",
        r"disclaimer",
        r"consult.*(?:financial|professional|advisor)",
    ]

    text_lower = output_text.lower()
    for pattern in disclaimer_patterns:
        if re.search(pattern, text_lower):
            return True

    logger.error(
        "No disclaimer found in output. "
        "Add: 'For educational purposes only. Not investment advice.'"
    )
    return False


def validate_no_hardcoded_secrets(code: str) -> list[str]:
    """Check code for hardcoded API keys or secrets.

    Returns list of violations (empty if clean).
    """
    violations = []

    secret_patterns = [
        (r'api_key\s*=\s*["\'][A-Za-z0-9]{16,}["\']', "Hardcoded API key"),
        (r'password\s*=\s*["\'][^"\']+["\']', "Hardcoded password"),
        (r'["\']sk-[A-Za-z0-9]{20,}["\']', "Hardcoded secret key"),
        (r'Bearer\s+[A-Za-z0-9]{20,}', "Hardcoded bearer token"),
        (r'AWS_SECRET_ACCESS_KEY\s*=\s*["\']', "Hardcoded AWS secret"),
    ]

    for pattern, description in secret_patterns:
        if re.search(pattern, code):
            violations.append(description)

    return violations


def validate_data_attribution(output_text: str,
                               source: str = "") -> bool:
    """Check that output cites data source.

    Args:
        output_text: Text to check
        source: Expected source name (optional)
    """
    attribution_patterns = [
        r"data\s+(?:source|from|provided\s+by)",
        r"source:",
        r"(?:alpha\s+vantage|yahoo\s+finance|polygon|fred|bloomberg)",
        r"(?:cfa|hull|bodie|textbook|published)",
    ]

    text_lower = output_text.lower()
    for pattern in attribution_patterns:
        if re.search(pattern, text_lower):
            return True

    if source and source.lower() in text_lower:
        return True

    logger.warning("No data source attribution found in output")
    return False


def validate_hypothetical_labeled(output_text: str) -> bool:
    """Check that backtested/simulated results are labeled.

    SEC and FINRA require clear labeling of hypothetical performance.
    """
    if not any(word in output_text.lower() for word in
               ["backtest", "simulated", "hypothetical", "paper trad"]):
        return True  # Not applicable if no backtest content

    labels = [
        r"hypothetical",
        r"simulated",
        r"backtested?\s+results",
        r"paper\s+trad",
        r"not\s+(?:actual|real)\s+(?:trading|performance|results)",
    ]

    text_lower = output_text.lower()
    for pattern in labels:
        if re.search(pattern, text_lower):
            return True

    logger.error(
        "Backtest results not labeled as hypothetical. "
        "Add: 'Hypothetical results. Not indicative of future performance.'"
    )
    return False


def validate_api_key_from_env(code: str) -> bool:
    """Verify API keys come from environment variables, not hardcoded."""
    # Good patterns
    good = [
        r'os\.environ\[',
        r'os\.environ\.get\(',
        r'os\.getenv\(',
        r'load_dotenv',
    ]

    # Bad patterns
    bad_results = validate_no_hardcoded_secrets(code)

    if bad_results:
        logger.error("Hardcoded secrets found: %s", bad_results)
        return False

    # Check that env var usage exists if API calls are made
    if "requests.get" in code or "api" in code.lower():
        has_env = any(re.search(p, code) for p in good)
        if not has_env:
            logger.warning(
                "API calls detected but no os.environ usage. "
                "Use environment variables for API keys."
            )
            return False

    return True
```

## Compliance Checklist

```python
def run_compliance_checks(code: str, output: str = "") -> dict:
    """Run all compliance validations."""
    results = {}

    # Security
    secrets = validate_no_hardcoded_secrets(code)
    results["no_hardcoded_secrets"] = len(secrets) == 0
    results["api_keys_from_env"] = validate_api_key_from_env(code)

    # Output compliance (if output provided)
    if output:
        results["disclaimer_present"] = validate_disclaimer_present(output)
        results["data_attributed"] = validate_data_attribution(output)
        results["hypothetical_labeled"] = validate_hypothetical_labeled(output)

    return results
```

<!-- Trigger Keywords: check disclaimer, compliance check, data attribution, security validation, regulatory compliance, disclaimer validation, API key check, hypothetical labeling -->
