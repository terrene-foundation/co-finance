---
name: workflow-pattern-security
description: "Security workflow patterns (auth, encryption, audit). Use when asking 'security workflow', 'authentication', 'encryption workflow', or 'audit trail'."
---

# Security Workflow Patterns

Patterns for authentication, authorization, encryption, and audit workflows.

> **Skill Metadata**
> Category: `workflow-patterns`
> Priority: `HIGH`
> SDK Version: `0.9.25+`
> Related Skills: [`gold-security`](../../17-gold-standards/gold-security.md)

## Pattern: User Authentication Flow

```python
import pandas as pd

workflow = Pipeline()

# 1. Validate credentials
pipeline.add_step("DatabaseQueryNode", "check_user", {
    "query": "SELECT id, password_hash, role FROM users WHERE email = ?",
    "parameters": ["{{input.email}}"]
})

# 2. Verify password
pipeline.add_step("TransformNode", "verify_password", {
    "input": "{{input.password}}",
    "stored_hash": "{{check_user.password_hash}}",
    "transformation": "bcrypt.verify(input, stored_hash)"
})

# 3. Check authorization
pipeline.add_step("ConditionalNode", "check_auth", {
    "condition": "{{verify_password.match}} == true",
    "true_branch": "generate_token",
    "false_branch": "audit_failure"
})

# 4. Generate JWT
pipeline.add_step("TransformNode", "generate_token", {
    "input": {"user_id": "{{check_user.id}}", "role": "{{check_user.role}}"},
    "transformation": "jwt.encode(input, secret, algorithm='HS256')"
})

# 5. Audit log
pipeline.add_step("DatabaseExecuteNode", "audit_success", {
    "query": "INSERT INTO audit_log (user_id, action, timestamp) VALUES (?, 'login', NOW())",
    "parameters": ["{{check_user.id}}"]
})

pipeline.add_step("DatabaseExecuteNode", "audit_failure", {
    "query": "INSERT INTO audit_log (email, action, timestamp) VALUES (?, 'failed_login', NOW())",
    "parameters": ["{{input.email}}"]
})

pipeline.connect("check_user", "password_hash", "verify_password", "stored_hash")
pipeline.connect("verify_password", "match", "check_auth", "condition")
pipeline.connect("check_auth", "output_true", "generate_token", "input")
pipeline.connect("generate_token", "token", "audit_success", "parameters")
pipeline.connect("check_auth", "output_false", "audit_failure", "trigger")
```

## Documentation


<!-- Trigger Keywords: security workflow, authentication, encryption workflow, audit trail, user auth -->
