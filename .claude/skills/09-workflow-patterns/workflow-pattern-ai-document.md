---
name: workflow-pattern-ai-document
description: "AI document processing patterns (OCR, extraction, analysis). Use when asking 'AI document', 'document AI', 'OCR workflow', or 'intelligent document processing'."
---

# AI Document Processing Patterns

AI-powered document analysis, extraction, and classification workflows.

> **Skill Metadata**
> Category: `workflow-patterns`
> Priority: `MEDIUM`
> SDK Version: `0.9.25+`
> Related Skills: [`workflow-pattern-rag`](workflow-pattern-rag.md), [`nodes-ai-reference`](../nodes/nodes-ai-reference.md)

## Pattern: Invoice Processing with AI

```python
import pandas as pd
# runtime setup

workflow = Pipeline()

# 1. Read document
pipeline.add_step("DocumentProcessorNode", "read_invoice", {
    "file_path": "{{input.invoice_path}}"
})

# 2. OCR extraction
pipeline.add_step("LLMNode", "extract_fields", {
    "provider": "openai",
    "model": "gpt-4-vision",
    "prompt": "Extract: invoice_number, date, amount, vendor from this invoice",
    "image": "{{read_invoice.content}}"
})

# 3. Validate extracted data
pipeline.add_step("DataValidationNode", "validate", {
    "input": "{{extract_fields.data}}",
    "schema": {
        "invoice_number": "string",
        "date": "date",
        "amount": "decimal",
        "vendor": "string"
    }
})

# 4. Store in database
pipeline.add_step("DatabaseExecuteNode", "store", {
    "query": "INSERT INTO invoices (number, date, amount, vendor) VALUES (?, ?, ?, ?)",
    "parameters": "{{validate.valid_data}}"
})

pipeline.connect("read_invoice", "content", "extract_fields", "image")
pipeline.connect("extract_fields", "data", "validate", "input")
pipeline.connect("validate", "valid_data", "store", "parameters")

with LocalRuntime() as runtime:
    results, run_id = runtime.execute(workflow.build())
```

## Documentation


<!-- Trigger Keywords: AI document, document AI, OCR workflow, intelligent document processing, invoice extraction -->
