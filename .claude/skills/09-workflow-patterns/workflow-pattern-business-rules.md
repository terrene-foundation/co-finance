---
name: workflow-pattern-business-rules
description: "Business rule engine patterns. Use when asking 'business rules', 'rule engine', 'conditional logic', or 'decision workflow'."
---

# Business Rule Engine Patterns

> **Skill Metadata**
> Category: `workflow-patterns`
> Priority: `MEDIUM`
> SDK Version: `0.9.25+`

## Pattern: Discount Calculation Rules

```python
import pandas as pd

workflow = Pipeline()

# 1. Load customer data
pipeline.add_step("DatabaseQueryNode", "load_customer", {
    "query": "SELECT * FROM customers WHERE id = ?",
    "parameters": ["{{input.customer_id}}"]
})

# 2. Check membership tier
pipeline.add_step("ConditionalNode", "check_tier", {
    "condition": "{{load_customer.tier}}",
    "branches": {
        "gold": "gold_discount",
        "silver": "silver_discount",
        "bronze": "bronze_discount"
    }
})

# 3. Calculate discounts
pipeline.add_step("TransformNode", "gold_discount", {
    "input": "{{input.amount}}",
    "transformation": "value * 0.80"  # 20% off
})

pipeline.add_step("TransformNode", "silver_discount", {
    "input": "{{input.amount}}",
    "transformation": "value * 0.90"  # 10% off
})

pipeline.add_step("TransformNode", "bronze_discount", {
    "input": "{{input.amount}}",
    "transformation": "value * 0.95"  # 5% off
})

# 4. Apply additional rules
pipeline.add_step("ConditionalNode", "check_bulk", {
    "condition": "{{input.quantity}} > 10",
    "true_branch": "bulk_discount",
    "false_branch": "final_price"
})

pipeline.connect("load_customer", "tier", "check_tier", "condition")
pipeline.connect("check_tier", "result", "check_bulk", "input")
```

<!-- Trigger Keywords: business rules, rule engine, conditional logic, decision workflow -->
