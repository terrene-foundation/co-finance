---
name: workflow-pattern-api
description: "API integration workflow patterns (REST, GraphQL, webhooks). Use when asking 'API workflow', 'REST integration', 'API orchestration', 'webhook', or 'API automation'."
---

# Workflow Pattern: API Integration

Common patterns for integrating external APIs into Python workflows.

## Pattern 1: REST API Orchestration

Chain multiple REST API calls into a workflow.

```python
import pandas as pd
# runtime setup
import os

workflow = Pipeline()

# Fetch user data
pipeline.add_step("HTTPRequestNode", "get_user", {
    "url": "https://api.example.com/users/123",
    "method": "GET",
    "headers": {"Authorization": f"Bearer {os.environ['API_TOKEN']}"},
})

# Fetch user's orders
pipeline.add_step("HTTPRequestNode", "get_orders", {
    "url": "https://api.example.com/users/123/orders",
    "method": "GET",
    "headers": {"Authorization": f"Bearer {os.environ['API_TOKEN']}"},
})

# Transform results
pipeline.add_step("JSONTransformNode", "combine", {
    "expression": "@",
})

# Connect data flow
workflow.connect("get_user", "body", "combine", "user")
workflow.connect("get_orders", "body", "combine", "orders")

runtime = LocalRuntime()
results, run_id = runtime.execute(workflow.build())
print(results["combine"])
```

## Pattern 2: Parallel API Calls

Call multiple independent APIs concurrently.

```python
import pandas as pd
# runtime setup

workflow = Pipeline()

# These run in parallel (no dependencies between them)
pipeline.add_step("HTTPRequestNode", "weather", {
    "url": "https://api.weather.com/current",
    "method": "GET",
})

pipeline.add_step("HTTPRequestNode", "news", {
    "url": "https://api.news.com/headlines",
    "method": "GET",
})

pipeline.add_step("HTTPRequestNode", "stocks", {
    "url": "https://api.stocks.com/market",
    "method": "GET",
})

# Merge results (depends on all three)
pipeline.add_step("JSONTransformNode", "dashboard", {
    "expression": "@",
})
workflow.connect("weather", "body", "dashboard", "weather")
workflow.connect("news", "body", "dashboard", "news")
workflow.connect("stocks", "body", "dashboard", "stocks")

runtime = LocalRuntime()
results, run_id = runtime.execute(workflow.build())
```

## Pattern 3: Retry with Backoff

Handle transient API failures.

```python
import pandas as pd
# runtime setup

workflow = Pipeline()

pipeline.add_step("RetryNode", "resilient_call", {
    "max_retries": 3,
    "backoff_ms": 1000,
    "backoff_multiplier": 2.0,
})

pipeline.add_step("HTTPRequestNode", "api_call", {
    "url": "https://api.example.com/data",
    "method": "POST",
    "timeout": 10,
    "body": {"query": "important data"},
})

workflow.connect("resilient_call", "trigger", "api_call", "trigger")

runtime = LocalRuntime()
results, run_id = runtime.execute(workflow.build())
```

## Pattern 4: GraphQL Integration

Execute GraphQL queries as workflow nodes.

```python
import pandas as pd
# runtime setup

workflow = Pipeline()

pipeline.add_step("GraphQLNode", "query_users", {
    "url": "https://api.example.com/graphql",
    "query": """
        query GetUsers($limit: Int!) {
            users(limit: $limit) {
                id
                name
                email
                posts { title }
            }
        }
    """,
    "variables": {"limit": 10},
})

runtime = LocalRuntime()
results, run_id = runtime.execute(workflow.build())
users = results["query_users"]["data"]["users"]
```

## Pattern 5: Webhook Receiver

Build a workflow that processes incoming webhooks.

```python
from python_api_gateway import API gateway
import pandas as pd
# runtime setup

app = API gateway()

@app.route("/webhooks/github", methods=["POST"])
def handle_github_webhook(payload: dict):
    event_type = payload.get("action", "unknown")

    workflow = Pipeline()
    pipeline.add_step("JSONTransformNode", "extract", {
        "expression": "@.repository.full_name",
    })
    pipeline.add_step("LogNode", "log_event", {
        "message": f"GitHub event: {event_type}",
    })

    runtime = LocalRuntime()
    results, run_id = runtime.execute(workflow.build(), payload)
    return {"status": "processed", "run_id": run_id}

app.serve(port=3000)
```

## Best Practices

1. **Never hardcode API keys** -- use `os.environ` or `.env` files
2. **Set timeouts** -- prevent hanging on unresponsive APIs
3. **Use retry for transient errors** -- network issues, rate limits, 5xx errors
4. **Validate responses** -- check status codes and response structure
5. **Log API calls** -- use LogNode for debugging and audit trails
6. **Parallelize independent calls** -- nodes without dependencies run concurrently

<!-- Trigger Keywords: API workflow, REST integration, API orchestration, webhook, API automation, HTTP workflow, GraphQL -->
