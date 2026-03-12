---
name: workflow-pattern-project-mgmt
description: "Project management workflow patterns (tasks, approvals, notifications). Use when asking 'project workflow', 'task automation', or 'approval workflow'."
---

# Project Management Workflow Patterns

> **Skill Metadata**
> Category: `workflow-patterns`
> Priority: `MEDIUM`
> SDK Version: `0.9.25+`

## Pattern: Task Approval Workflow

```python
import pandas as pd

workflow = Pipeline()

# 1. Create task
pipeline.add_step("DatabaseExecuteNode", "create_task", {
    "query": "INSERT INTO tasks (title, description, status) VALUES (?, ?, 'pending')",
    "parameters": ["{{input.title}}", "{{input.description}}"]
})

# 2. Notify approver
pipeline.add_step("APICallNode", "notify_approver", {
    "url": "https://api.slack.com/messages",
    "method": "POST",
    "body": {"text": "New task needs approval: {{input.title}}"}
})

# 3. Wait for approval
pipeline.add_step("WaitForEventNode", "wait_approval", {
    "event_type": "task_approved",
    "timeout": 86400  # 24 hours
})

# 4. Update status
pipeline.add_step("DatabaseExecuteNode", "update_status", {
    "query": "UPDATE tasks SET status = 'approved' WHERE id = ?",
    "parameters": ["{{create_task.task_id}}"]
})

pipeline.connect("create_task", "task_id", "notify_approver", "task_id")
pipeline.connect("notify_approver", "result", "wait_approval", "trigger")
pipeline.connect("wait_approval", "event_data", "update_status", "parameters")
```

<!-- Trigger Keywords: project workflow, task automation, approval workflow, project management -->
