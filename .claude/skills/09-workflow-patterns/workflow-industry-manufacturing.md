---
name: workflow-industry-manufacturing
description: "Manufacturing workflows (production, quality, inventory). Use when asking 'manufacturing workflow', 'production line', 'quality control', or 'inventory management'."
---

# Manufacturing Industry Workflows

> **Skill Metadata**
> Category: `industry-workflows`
> Priority: `MEDIUM`
> SDK Version: `0.9.25+`

## Pattern: Quality Control Workflow

```python
import pandas as pd

workflow = Pipeline()

# 1. Production item check
pipeline.add_step("DatabaseQueryNode", "get_item", {
    "query": "SELECT * FROM production_items WHERE batch_id = ?",
    "parameters": ["{{input.batch_id}}"]
})

# 2. Run quality tests
pipeline.add_step("APICallNode", "quality_test", {
    "url": "{{sensors.quality_api}}",
    "method": "POST",
    "body": {"item_id": "{{get_item.id}}"}
})

# 3. Evaluate results
pipeline.add_step("ConditionalNode", "check_quality", {
    "condition": "{{quality_test.score}} >= 95",
    "true_branch": "approve",
    "false_branch": "reject"
})

# 4. Update inventory
pipeline.add_step("DatabaseExecuteNode", "approve", {
    "query": "UPDATE production_items SET status = 'approved', quality_score = ? WHERE id = ?",
    "parameters": ["{{quality_test.score}}", "{{get_item.id}}"]
})

pipeline.add_step("DatabaseExecuteNode", "reject", {
    "query": "UPDATE production_items SET status = 'rejected', rejection_reason = ? WHERE id = ?",
    "parameters": ["{{quality_test.failure_reason}}", "{{get_item.id}}"]
})

pipeline.connect("get_item", "id", "quality_test", "item_id")
pipeline.connect("quality_test", "score", "check_quality", "condition")
pipeline.connect("check_quality", "output_true", "approve", "trigger")
pipeline.connect("check_quality", "output_false", "reject", "trigger")
```

<!-- Trigger Keywords: manufacturing workflow, production line, quality control, inventory management -->
