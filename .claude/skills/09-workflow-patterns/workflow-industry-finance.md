---
name: workflow-industry-finance
description: "Finance industry workflows (payments, fraud, compliance). Use when asking 'finance workflow', 'payment processing', 'fraud detection', or 'financial compliance'."
---

# Finance Industry Workflows

> **Skill Metadata**
> Category: `industry-workflows`
> Priority: `MEDIUM`
> SDK Version: `0.9.25+`

## Pattern: Payment Processing with Fraud Detection

```python
import pandas as pd

workflow = Pipeline()

# 1. Validate payment details
pipeline.add_step("DataValidationNode", "validate", {
    "input": "{{input.payment}}",
    "schema": {"amount": "decimal", "card_number": "credit_card"}
})

# 2. Fraud check
pipeline.add_step("APICallNode", "fraud_check", {
    "url": "https://api.fraudcheck.com/analyze",
    "method": "POST",
    "body": "{{validate.valid_data}}"
})

# 3. Risk assessment
pipeline.add_step("ConditionalNode", "assess_risk", {
    "condition": "{{fraud_check.risk_score}}",
    "branches": {
        "low": "process_payment",
        "medium": "manual_review",
        "high": "reject_payment"
    }
})

# 4. Process payment
pipeline.add_step("APICallNode", "process_payment", {
    "url": "https://api.paymentgateway.com/charge",
    "method": "POST",
    "body": "{{validate.valid_data}}"
})

# 5. Record transaction
pipeline.add_step("DatabaseExecuteNode", "record", {
    "query": "INSERT INTO transactions (amount, status, timestamp) VALUES (?, ?, NOW())",
    "parameters": ["{{input.amount}}", "completed"]
})

pipeline.connect("validate", "valid_data", "fraud_check", "body")
pipeline.connect("fraud_check", "risk_score", "assess_risk", "condition")
pipeline.connect("assess_risk", "output_low", "process_payment", "body")
pipeline.connect("process_payment", "result", "record", "parameters")
```

<!-- Trigger Keywords: finance workflow, payment processing, fraud detection, financial compliance -->
