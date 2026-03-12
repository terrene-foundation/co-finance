---
name: workflow-pattern-data
description: "Data processing pipeline patterns (clean, transform, aggregate). Use when asking 'data pipeline', 'data processing', 'data transformation', or 'data cleaning'."
---

# Data Processing Pipeline Patterns

Patterns for data cleaning, transformation, and aggregation workflows.

> **Skill Metadata**
> Category: `workflow-patterns`
> Priority: `HIGH`
> SDK Version: `0.9.25+`
> Related Skills: [`workflow-pattern-etl`](workflow-pattern-etl.md), [`nodes-transform-reference`](../nodes/nodes-transform-reference.md)

## Pattern: Data Quality Pipeline

```python
import pandas as pd

workflow = Pipeline()

# 1. Load data
pipeline.add_step("CSVReaderNode", "load", {"file_path": "data.csv"})

# 2. Remove duplicates
pipeline.add_step("DeduplicateNode", "dedupe", {
    "input": "{{load.data}}",
    "key_fields": ["email"]
})

# 3. Validate schema
pipeline.add_step("DataValidationNode", "validate", {
    "input": "{{dedupe.data}}",
    "schema": {"email": "email", "age": "integer"}
})

# 4. Clean fields
pipeline.add_step("TransformNode", "clean", {
    "input": "{{validate.valid_data}}",
    "transformations": [
        {"field": "email", "operation": "lowercase"},
        {"field": "name", "operation": "trim"}
    ]
})

# 5. Aggregate metrics
pipeline.add_step("AggregateNode", "aggregate", {
    "input": "{{clean.data}}",
    "group_by": ["country"],
    "aggregations": {"count": "COUNT(*)", "avg_age": "AVG(age)"}
})

pipeline.connect("load", "data", "dedupe", "input")
pipeline.connect("dedupe", "data", "validate", "input")
pipeline.connect("validate", "valid_data", "clean", "input")
pipeline.connect("clean", "data", "aggregate", "input")
```

## Documentation


<!-- Trigger Keywords: data pipeline, data processing, data transformation, data cleaning, data quality -->
