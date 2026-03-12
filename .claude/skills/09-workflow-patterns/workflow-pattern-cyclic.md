---
name: workflow-pattern-cyclic
description: "Cyclic workflow patterns with loops and iterations. Use when asking 'loop workflow', 'cyclic', 'iterate', 'repeat until', or 'workflow cycles'."
---

# Cyclic Workflow Patterns

Patterns for implementing loops, iterations, and cyclic workflows.

> **Skill Metadata**
> Category: `workflow-patterns`
> Priority: `HIGH`
> SDK Version: `0.9.25+`
> Related Skills: [`workflow-pattern-etl`](workflow-pattern-etl.md), [`pattern-expert`](../../01-core-sdk/pattern-expert.md)
> Related Subagents: `pattern-expert` (cyclic workflows)

## Quick Reference

Cyclic workflows enable:
- **Loop until condition** - Repeat until success/threshold
- **Batch processing** - Process items in chunks
- **Retry logic** - Automatic retry with backoff
- **Iterative refinement** - Multi-pass processing

## Pattern 1: Loop Until Condition

```python
import pandas as pd
# runtime setup

workflow = Pipeline()

# 1. Initialize counter
pipeline.add_step("SetVariableNode", "init_counter", {
    "variable_name": "counter",
    "value": 0
})

# 2. Process iteration
pipeline.add_step("APICallNode", "check_status", {
    "url": "https://api.example.com/status",
    "method": "GET"
})

# 3. Evaluate condition
pipeline.add_step("ConditionalNode", "check_complete", {
    "condition": "{{check_status.status}} == 'completed'",
    "true_branch": "complete",
    "false_branch": "increment"
})

# 4. Increment counter
pipeline.add_step("TransformNode", "increment", {
    "input": "{{init_counter.counter}}",
    "transformation": "value + 1"
})

# 5. Check max iterations
pipeline.add_step("ConditionalNode", "check_max", {
    "condition": "{{increment.result}} < 10",
    "true_branch": "wait",
    "false_branch": "timeout"
})

# 6. Wait before retry
pipeline.add_step("DelayNode", "wait", {
    "duration_seconds": 5
})

# 7. Loop back (connect to check_status)
pipeline.connect("init_counter", "counter", "check_status", "input")
pipeline.connect("check_status", "status", "check_complete", "condition")
pipeline.connect("check_complete", "output_false", "increment", "input")
pipeline.connect("increment", "result", "check_max", "condition")
pipeline.connect("check_max", "output_true", "wait", "trigger")
pipeline.connect("wait", "done", "check_status", "input")  # Loop!

with LocalRuntime() as runtime:
    results, run_id = runtime.execute(workflow.build())
```

## Pattern 2: Batch Processing

```python
workflow = Pipeline()

# 1. Load all items
pipeline.add_step("DatabaseQueryNode", "load_items", {
    "query": "SELECT id, data FROM items WHERE processed = FALSE",
    "batch_size": 100
})

# 2. Split into batches
pipeline.add_step("BatchSplitNode", "split_batches", {
    "input": "{{load_items.results}}",
    "batch_size": 10
})

# 3. Process each batch
pipeline.add_step("MapNode", "process_batch", {
    "input": "{{split_batches.batches}}",
    "operation": "process_item"
})

# 4. Update database
pipeline.add_step("DatabaseExecuteNode", "mark_processed", {
    "query": "UPDATE items SET processed = TRUE WHERE id IN ({{process_batch.ids}})"
})

# 5. Check for more items
pipeline.add_step("ConditionalNode", "check_more", {
    "condition": "{{load_items.has_more}} == true",
    "true_branch": "load_items",  # Loop back!
    "false_branch": "complete"
})

pipeline.connect("load_items", "results", "split_batches", "input")
pipeline.connect("split_batches", "batches", "process_batch", "input")
pipeline.connect("process_batch", "ids", "mark_processed", "ids")
pipeline.connect("mark_processed", "result", "check_more", "condition")
pipeline.connect("check_more", "output_true", "load_items", "trigger")
```

## Pattern 3: Exponential Backoff Retry

```python
workflow = Pipeline()

# 1. Initialize retry state
pipeline.add_step("SetVariableNode", "init_retry", {
    "retry_count": 0,
    "backoff_seconds": 1
})

# 2. Execute operation
pipeline.add_step("APICallNode", "api_call", {
    "url": "https://api.example.com/operation",
    "method": "POST",
    "timeout": 30
})

# 3. Check success
pipeline.add_step("ConditionalNode", "check_success", {
    "condition": "{{api_call.status_code}} == 200",
    "true_branch": "success",
    "false_branch": "check_retry"
})

# 4. Check retry count
pipeline.add_step("ConditionalNode", "check_retry", {
    "condition": "{{init_retry.retry_count}} < 5",
    "true_branch": "calculate_backoff",
    "false_branch": "failed"
})

# 5. Calculate exponential backoff
pipeline.add_step("TransformNode", "calculate_backoff", {
    "input": "{{init_retry.backoff_seconds}}",
    "transformation": "value * 2"  # Exponential: 1, 2, 4, 8, 16 seconds
})

# 6. Wait with backoff
pipeline.add_step("DelayNode", "backoff_wait", {
    "duration_seconds": "{{calculate_backoff.result}}"
})

# 7. Increment retry counter
pipeline.add_step("TransformNode", "increment_retry", {
    "input": "{{init_retry.retry_count}}",
    "transformation": "value + 1"
})

# 8. Loop back to retry
pipeline.connect("init_retry", "retry_count", "api_call", "retry")
pipeline.connect("api_call", "status_code", "check_success", "condition")
pipeline.connect("check_success", "output_false", "check_retry", "condition")
pipeline.connect("check_retry", "output_true", "calculate_backoff", "input")
pipeline.connect("calculate_backoff", "result", "backoff_wait", "duration_seconds")
pipeline.connect("backoff_wait", "done", "increment_retry", "input")
pipeline.connect("increment_retry", "result", "api_call", "retry")  # Loop!
```

## Pattern 4: Iterative Refinement

```python
workflow = Pipeline()

# 1. Initial prompt
pipeline.add_step("SetVariableNode", "init_prompt", {
    "prompt": "Write a product description for: {{product_name}}",
    "iteration": 0
})

# 2. Generate content (LLM)
pipeline.add_step("LLMNode", "generate", {
    "provider": "openai",
    "model": "gpt-4",
    "prompt": "{{init_prompt.prompt}}"
})

# 3. Evaluate quality
pipeline.add_step("LLMNode", "evaluate", {
    "provider": "openai",
    "model": "gpt-4",
    "prompt": "Rate this description 1-10: {{generate.response}}"
})

# 4. Check quality threshold
pipeline.add_step("ConditionalNode", "check_quality", {
    "condition": "{{evaluate.score}} >= 8",
    "true_branch": "approved",
    "false_branch": "refine"
})

# 5. Refine prompt with feedback
pipeline.add_step("LLMNode", "refine", {
    "provider": "openai",
    "model": "gpt-4",
    "prompt": "Improve this: {{generate.response}}. Feedback: {{evaluate.feedback}}"
})

# 6. Check max iterations
pipeline.add_step("ConditionalNode", "check_max", {
    "condition": "{{init_prompt.iteration}} < 3",
    "true_branch": "increment",
    "false_branch": "use_best"
})

# 7. Increment iteration
pipeline.add_step("TransformNode", "increment", {
    "input": "{{init_prompt.iteration}}",
    "transformation": "value + 1"
})

# Loop back for refinement
pipeline.connect("init_prompt", "prompt", "generate", "prompt")
pipeline.connect("generate", "response", "evaluate", "prompt")
pipeline.connect("evaluate", "score", "check_quality", "condition")
pipeline.connect("check_quality", "output_false", "refine", "input")
pipeline.connect("refine", "response", "check_max", "condition")
pipeline.connect("check_max", "output_true", "increment", "input")
pipeline.connect("increment", "result", "generate", "iteration")  # Loop!
```

## Best Practices

1. **Always set max iterations** - Prevent infinite loops
2. **Use explicit loop counters** - Track iteration count
3. **Implement backoff delays** - Avoid overwhelming systems
4. **Store intermediate results** - Enable debugging/recovery
5. **Clear exit conditions** - Define success/failure states
6. **Monitor loop metrics** - Track iterations, duration, success rate

## Common Pitfalls

- **No exit condition** - Infinite loops
- **Missing max iterations** - Runaway processes
- **No backoff delay** - API rate limiting
- **Memory leaks** - Accumulating state in loops
- **Poor error handling** - Unhandled failures in iterations

## Related Skills

- **ETL Patterns**: [`workflow-pattern-etl`](workflow-pattern-etl.md)
- **Error Handling**: [`gold-error-handling`](../../17-gold-standards/gold-error-handling.md)
- **Conditional Logic**: [`nodes-logic-reference`](../nodes/nodes-logic-reference.md)

## Documentation


<!-- Trigger Keywords: loop workflow, cyclic, iterate, repeat until, workflow cycles, retry logic, batch processing -->
