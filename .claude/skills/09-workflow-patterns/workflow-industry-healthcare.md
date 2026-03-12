---
name: workflow-industry-healthcare
description: "Healthcare workflows (patient data, HIPAA, medical records). Use when asking 'healthcare workflow', 'patient workflow', 'HIPAA', or 'medical records'."
---

# Healthcare Industry Workflows

> **Skill Metadata**
> Category: `industry-workflows`
> Priority: `MEDIUM`
> SDK Version: `0.9.25+`

## Pattern: Patient Record Management (HIPAA Compliant)

```python
import pandas as pd

workflow = Pipeline()

# 1. Authenticate user
pipeline.add_step("APICallNode", "authenticate", {
    "url": "{{secrets.auth_endpoint}}",
    "method": "POST"
})

# 2. Check HIPAA authorization
pipeline.add_step("DatabaseQueryNode", "check_access", {
    "query": "SELECT role FROM healthcare_staff WHERE id = ? AND hipaa_certified = TRUE",
    "parameters": ["{{authenticate.user_id}}"]
})

# 3. Fetch patient record (encrypted)
pipeline.add_step("DatabaseQueryNode", "fetch_record", {
    "query": "SELECT encrypted_data FROM patient_records WHERE patient_id = ?",
    "parameters": ["{{input.patient_id}}"]
})

# 4. Decrypt data
pipeline.add_step("TransformNode", "decrypt", {
    "input": "{{fetch_record.encrypted_data}}",
    "transformation": "aes_decrypt(value, secret_key)"
})

# 5. Audit log
pipeline.add_step("DatabaseExecuteNode", "audit", {
    "query": "INSERT INTO hipaa_audit_log (staff_id, patient_id, action, timestamp) VALUES (?, ?, 'record_access', NOW())",
    "parameters": ["{{authenticate.user_id}}", "{{input.patient_id}}"]
})

pipeline.connect("authenticate", "user_id", "check_access", "parameters")
pipeline.connect("check_access", "role", "fetch_record", "authorization")
pipeline.connect("fetch_record", "encrypted_data", "decrypt", "input")
pipeline.connect("decrypt", "data", "audit", "parameters")
```

<!-- Trigger Keywords: healthcare workflow, patient workflow, HIPAA, medical records, patient data -->
