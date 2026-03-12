---
name: workflow-pattern-etl
description: "ETL pipeline patterns (Extract, Transform, Load). Use when asking 'ETL', 'data pipeline', 'extract transform load', 'data migration', or 'data integration'."
---

# ETL Pipeline Patterns

Comprehensive patterns for Extract, Transform, Load workflows.

> **Skill Metadata**
> Category: `workflow-patterns`
> Priority: `HIGH`
> SDK Version: `0.9.25+`
> Related Skills: [`workflow-pattern-data`](workflow-pattern-data.md), [`database-specialist`](../../02-database/database-specialist.md)
> Related Subagents: `database-specialist` (database ETL), `pattern-expert` (ETL workflows)

## Quick Reference

ETL patterns enable:
- **Data extraction** - CSV, JSON, databases, APIs
- **Transformation** - Clean, normalize, enrich, aggregate
- **Loading** - Write to databases, files, APIs
- **Error handling** - Validation, retries, dead letter queues

## Pattern 1: CSV to Database ETL

```python
import pandas as pd
# runtime setup

workflow = Pipeline()

# 1. EXTRACT: Read CSV
pipeline.add_step("CSVReaderNode", "extract", {
    "file_path": "data/customers.csv",
    "delimiter": ",",
    "encoding": "utf-8"
})

# 2. TRANSFORM: Validate data
pipeline.add_step("DataValidationNode", "validate", {
    "input": "{{extract.data}}",
    "schema": {
        "email": "email",
        "age": "integer",
        "name": "string"
    },
    "on_error": "collect"  # Collect invalid rows
})

# 3. TRANSFORM: Clean data
pipeline.add_step("TransformNode", "clean", {
    "input": "{{validate.valid_data}}",
    "transformations": [
        {"field": "email", "operation": "lowercase"},
        {"field": "name", "operation": "trim"},
        {"field": "phone", "operation": "normalize_phone"}
    ]
})

# 4. TRANSFORM: Enrich data
pipeline.add_step("APICallNode", "enrich_location", {
    "url": "https://api.example.com/geocode",
    "method": "POST",
    "body": "{{clean.data}}"
})

# 5. LOAD: Insert to database
pipeline.add_step("DatabaseExecuteNode", "load", {
    "query": """
        INSERT INTO customers (name, email, age, location)
        VALUES (?, ?, ?, ?)
        ON CONFLICT (email) DO UPDATE SET
            name = EXCLUDED.name,
            age = EXCLUDED.age,
            location = EXCLUDED.location
    """,
    "parameters": "{{enrich_location.enriched_data}}"
})

# 6. Error handling: Log invalid rows
pipeline.add_step("CSVWriterNode", "log_errors", {
    "file_path": "logs/invalid_rows.csv",
    "data": "{{validate.invalid_data}}",
    "headers": ["row", "error", "data"]
})

# Connect nodes
pipeline.connect("extract", "data", "validate", "input")
pipeline.connect("validate", "valid_data", "clean", "input")
pipeline.connect("clean", "data", "enrich_location", "body")
pipeline.connect("enrich_location", "enriched_data", "load", "parameters")
pipeline.connect("validate", "invalid_data", "log_errors", "data")

with LocalRuntime() as runtime:
    results, run_id = runtime.execute(workflow.build())
```

## Pattern 2: API to Database ETL

```python
workflow = Pipeline()

# 1. EXTRACT: Paginated API
pipeline.add_step("SetVariableNode", "init_page", {
    "page": 1,
    "has_more": True
})

pipeline.add_step("APICallNode", "extract_api", {
    "url": "https://api.example.com/users?page={{init_page.page}}",
    "method": "GET",
    "headers": {"Authorization": "Bearer {{secrets.api_token}}"}
})

# 2. TRANSFORM: Normalize API response
pipeline.add_step("TransformNode", "normalize", {
    "input": "{{extract_api.data}}",
    "mapping": {
        "user_id": "id",
        "full_name": "name",
        "email_address": "email",
        "created_at": "timestamp|iso8601"
    }
})

# 3. TRANSFORM: Filter records
pipeline.add_step("FilterNode", "filter_active", {
    "input": "{{normalize.data}}",
    "condition": "status == 'active' AND created_at > '2024-01-01'"
})

# 4. LOAD: Batch insert
pipeline.add_step("DatabaseExecuteNode", "load_batch", {
    "query": """
        INSERT INTO users (user_id, full_name, email_address, created_at)
        VALUES (?, ?, ?, ?)
    """,
    "batch": True,
    "batch_size": 100,
    "parameters": "{{filter_active.filtered_data}}"
})

# 5. Check for more pages
pipeline.add_step("ConditionalNode", "check_more", {
    "condition": "{{extract_api.has_next_page}} == true",
    "true_branch": "next_page",
    "false_branch": "complete"
})

# 6. Increment page
pipeline.add_step("TransformNode", "next_page", {
    "input": "{{init_page.page}}",
    "transformation": "value + 1"
})

# Loop for pagination
pipeline.connect("init_page", "page", "extract_api", "page")
pipeline.connect("extract_api", "data", "normalize", "input")
pipeline.connect("normalize", "data", "filter_active", "input")
pipeline.connect("filter_active", "filtered_data", "load_batch", "parameters")
pipeline.connect("load_batch", "result", "check_more", "input")
pipeline.connect("check_more", "output_true", "next_page", "input")
pipeline.connect("next_page", "result", "extract_api", "page")  # Loop!
```

## Pattern 3: Database to Database Migration

```python
workflow = Pipeline()

# 1. EXTRACT: Read from source DB
pipeline.add_step("DatabaseQueryNode", "extract_source", {
    "connection": "source_db",
    "query": """
        SELECT id, name, email, created_at
        FROM legacy_users
        WHERE migrated = FALSE
        LIMIT 1000
    """
})

# 2. TRANSFORM: Data mapping
pipeline.add_step("TransformNode", "transform_schema", {
    "input": "{{extract_source.results}}",
    "transformations": [
        {"source": "id", "target": "legacy_id", "type": "string"},
        {"source": "name", "target": "full_name", "type": "string"},
        {"source": "email", "target": "email_address", "type": "lowercase"},
        {"source": "created_at", "target": "registration_date", "type": "datetime"}
    ]
})

# 3. TRANSFORM: Validate business rules
pipeline.add_step("DataValidationNode", "validate_rules", {
    "input": "{{transform_schema.data}}",
    "rules": [
        {"field": "email_address", "validation": "email_format"},
        {"field": "full_name", "validation": "not_empty"},
        {"field": "registration_date", "validation": "valid_date"}
    ]
})

# 4. LOAD: Insert to target DB
pipeline.add_step("DatabaseExecuteNode", "load_target", {
    "connection": "target_db",
    "query": """
        INSERT INTO users (legacy_id, full_name, email_address, registration_date)
        VALUES (?, ?, ?, ?)
    """,
    "batch": True,
    "parameters": "{{validate_rules.valid_data}}"
})

# 5. Update source DB (mark as migrated)
pipeline.add_step("DatabaseExecuteNode", "mark_migrated", {
    "connection": "source_db",
    "query": """
        UPDATE legacy_users
        SET migrated = TRUE, migrated_at = NOW()
        WHERE id IN ({{load_target.inserted_ids}})
    """
})

# 6. Handle failures
pipeline.add_step("DatabaseExecuteNode", "log_failures", {
    "connection": "source_db",
    "query": """
        INSERT INTO migration_failures (legacy_id, error, data)
        VALUES (?, ?, ?)
    """,
    "parameters": "{{validate_rules.invalid_data}}"
})

pipeline.connect("extract_source", "results", "transform_schema", "input")
pipeline.connect("transform_schema", "data", "validate_rules", "input")
pipeline.connect("validate_rules", "valid_data", "load_target", "parameters")
pipeline.connect("load_target", "inserted_ids", "mark_migrated", "ids")
pipeline.connect("validate_rules", "invalid_data", "log_failures", "parameters")
```

## Pattern 4: Real-Time Streaming ETL

```python
workflow = Pipeline()

# 1. EXTRACT: Stream from message queue
pipeline.add_step("MessageQueueConsumerNode", "extract_stream", {
    "queue_url": "kafka://localhost:9092/events",
    "topic": "user_events",
    "batch_size": 50
})

# 2. TRANSFORM: Parse events
pipeline.add_step("TransformNode", "parse_events", {
    "input": "{{extract_stream.messages}}",
    "parsing": {
        "format": "json",
        "flatten": True,
        "extract_fields": ["user_id", "event_type", "timestamp", "data"]
    }
})

# 3. TRANSFORM: Aggregate metrics
pipeline.add_step("AggregateNode", "calculate_metrics", {
    "input": "{{parse_events.events}}",
    "group_by": ["user_id", "event_type"],
    "aggregations": {
        "count": "COUNT(*)",
        "avg_duration": "AVG(data.duration)",
        "last_seen": "MAX(timestamp)"
    },
    "window": "5m"  # 5-minute window
})

# 4. LOAD: Write to time-series DB
pipeline.add_step("DatabaseExecuteNode", "load_metrics", {
    "connection": "timescaledb",
    "query": """
        INSERT INTO user_metrics (user_id, event_type, count, avg_duration, last_seen, window_start)
        VALUES (?, ?, ?, ?, ?, ?)
    """,
    "parameters": "{{calculate_metrics.aggregated}}"
})

# 5. Acknowledge messages
pipeline.add_step("MessageQueueAckNode", "ack_messages", {
    "message_ids": "{{extract_stream.message_ids}}"
})

pipeline.connect("extract_stream", "messages", "parse_events", "input")
pipeline.connect("parse_events", "events", "calculate_metrics", "input")
pipeline.connect("calculate_metrics", "aggregated", "load_metrics", "parameters")
pipeline.connect("load_metrics", "result", "ack_messages", "message_ids")
```

## Best Practices

1. **Batch processing** - Process in chunks (100-1000 records)
2. **Idempotent operations** - Use UPSERT/ON CONFLICT
3. **Error isolation** - Collect invalid data separately
4. **Transaction boundaries** - Commit per batch
5. **Progress tracking** - Mark processed records
6. **Data validation** - Validate at each stage
7. **Logging** - Track successes, failures, timing

## Common Pitfalls

- **No error handling** - Lost data on failures
- **Memory overload** - Loading entire datasets
- **Missing validation** - Invalid data in target
- **No rollback strategy** - Can't recover from failures
- **Poor performance** - Not using batch operations

## Related Skills

- **database Framework**: [`database-specialist`](../../02-database/database-specialist.md)
- **Data Patterns**: [`workflow-pattern-data`](workflow-pattern-data.md)
- **Database Nodes**: [`nodes-database-reference`](../nodes/nodes-database-reference.md)

## Documentation


<!-- Trigger Keywords: ETL, data pipeline, extract transform load, data migration, data integration, batch processing -->
