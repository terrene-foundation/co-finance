---
name: workflow-pattern-file
description: "File processing workflow patterns (CSV, JSON, PDF, batch). Use when asking 'file processing', 'batch file', 'document workflow', or 'file automation'."
---

# File Processing Workflow Patterns

Patterns for automated file processing, transformation, and batch operations.

> **Skill Metadata**
> Category: `workflow-patterns`
> Priority: `MEDIUM`
> SDK Version: `0.9.25+`
> Related Skills: [`nodes-data-reference`](../nodes/nodes-data-reference.md), [`workflow-pattern-etl`](workflow-pattern-etl.md)
> Related Subagents: `pattern-expert` (file workflows)

## Quick Reference

File processing patterns:
- **Batch file processing** - Process multiple files
- **File transformation** - Convert formats
- **Document extraction** - PDF, DOCX to text
- **Archive management** - ZIP, unzip, organize

## Pattern 1: Batch CSV Processing

```python
import pandas as pd
# runtime setup

workflow = Pipeline()

# 1. List CSV files
pipeline.add_step("FileListNode", "list_files", {
    "directory": "data/input",
    "pattern": "*.csv"
})

# 2. Process each file
pipeline.add_step("MapNode", "process_files", {
    "input": "{{list_files.files}}",
    "workflow": "process_single_csv"
})

# 3. Merge results
pipeline.add_step("MergeNode", "merge_results", {
    "inputs": "{{process_files.results}}",
    "strategy": "combine"
})

# 4. Write consolidated output
pipeline.add_step("CSVWriterNode", "write_output", {
    "file_path": "data/output/consolidated.csv",
    "data": "{{merge_results.combined}}",
    "headers": ["id", "name", "value"]
})

pipeline.connect("list_files", "files", "process_files", "input")
pipeline.connect("process_files", "results", "merge_results", "inputs")
pipeline.connect("merge_results", "combined", "write_output", "data")

with LocalRuntime() as runtime:
    results, run_id = runtime.execute(workflow.build())
```

## Pattern 2: PDF Document Extraction

```python
workflow = Pipeline()

# 1. Read PDF document
pipeline.add_step("DocumentProcessorNode", "extract_pdf", {
    "file_path": "{{input.pdf_path}}",
    "extract_metadata": True,
    "preserve_structure": True,
    "page_numbers": True
})

# 2. Extract tables
pipeline.add_step("TransformNode", "extract_tables", {
    "input": "{{extract_pdf.content}}",
    "transformation": "extract_tables()"
})

# 3. Extract text
pipeline.add_step("TransformNode", "extract_text", {
    "input": "{{extract_pdf.content}}",
    "transformation": "extract_text()"
})

# 4. Analyze with AI
pipeline.add_step("LLMNode", "analyze_document", {
    "provider": "openai",
    "model": "gpt-4",
    "prompt": "Summarize this document: {{extract_text.text}}"
})

# 5. Save results
pipeline.add_step("JSONWriterNode", "save_results", {
    "file_path": "output/{{input.pdf_name}}_analysis.json",
    "data": {
        "metadata": "{{extract_pdf.metadata}}",
        "tables": "{{extract_tables.tables}}",
        "summary": "{{analyze_document.response}}"
    },
    "indent": 2
})

pipeline.connect("extract_pdf", "content", "extract_tables", "input")
pipeline.connect("extract_pdf", "content", "extract_text", "input")
pipeline.connect("extract_text", "text", "analyze_document", "prompt")
pipeline.connect("analyze_document", "response", "save_results", "data")
```

## Pattern 3: File Format Conversion

```python
workflow = Pipeline()

# 1. Read source file
pipeline.add_step("ConditionalNode", "detect_format", {
    "condition": "{{input.file_ext}}",
    "branches": {
        ".csv": "read_csv",
        ".json": "read_json",
        ".xlsx": "read_excel"
    }
})

# 2. Read different formats
pipeline.add_step("CSVReaderNode", "read_csv", {
    "file_path": "{{input.file_path}}"
})

pipeline.add_step("JSONReaderNode", "read_json", {
    "file_path": "{{input.file_path}}"
})

pipeline.add_step("ExcelReaderNode", "read_excel", {
    "file_path": "{{input.file_path}}"
})

# 3. Normalize to common format
pipeline.add_step("TransformNode", "normalize", {
    "input": "{{read_csv.data || read_json.data || read_excel.data}}",
    "transformation": "normalize_to_dict_list()"
})

# 4. Write in target format
pipeline.add_step("ConditionalNode", "write_format", {
    "condition": "{{input.target_format}}",
    "branches": {
        "csv": "write_csv",
        "json": "write_json",
        "parquet": "write_parquet"
    }
})

pipeline.connect("detect_format", "result", "normalize", "input")
pipeline.connect("normalize", "data", "write_format", "input")
```

## Pattern 4: Watch Folder Automation

```python
workflow = Pipeline()

# 1. Watch directory for new files
pipeline.add_step("FileWatchNode", "watch_folder", {
    "directory": "data/inbox",
    "pattern": "*.pdf",
    "event": "created"
})

# 2. Validate file
pipeline.add_step("FileValidateNode", "validate", {
    "file_path": "{{watch_folder.file_path}}",
    "min_size": 1024,  # 1KB minimum
    "max_size": 10485760,  # 10MB maximum
    "extensions": [".pdf"]
})

# 3. Process document
pipeline.add_step("DocumentProcessorNode", "process", {
    "file_path": "{{validate.file_path}}"
})

# 4. Move to processed folder
pipeline.add_step("FileMoveNode", "move_file", {
    "source": "{{validate.file_path}}",
    "destination": "data/processed/{{watch_folder.filename}}"
})

# 5. On error, move to failed folder
pipeline.add_step("FileMoveNode", "move_failed", {
    "source": "{{validate.file_path}}",
    "destination": "data/failed/{{watch_folder.filename}}"
})

pipeline.connect("watch_folder", "file_path", "validate", "file_path")
pipeline.connect("validate", "file_path", "process", "file_path")
pipeline.connect("process", "result", "move_file", "source")
# Error handling connection
workflow.add_error_handler("process", "move_failed")
```

## Best Practices

1. **Error handling** - Move failed files to error folder
2. **File validation** - Check size, format, permissions
3. **Atomic operations** - Write to temp, then move
4. **Progress tracking** - Log processed files
5. **Cleanup** - Delete temp files
6. **Batch size** - Process in manageable chunks

## Common Pitfalls

- **No error handling** - Lost files on failures
- **Memory issues** - Loading large files entirely
- **Race conditions** - Multiple processors on same file
- **Missing validation** - Processing invalid files
- **No cleanup** - Accumulating temp files

## Related Skills

- **Data Nodes**: [`nodes-data-reference`](../nodes/nodes-data-reference.md)
- **ETL Patterns**: [`workflow-pattern-etl`](workflow-pattern-etl.md)

## Documentation


<!-- Trigger Keywords: file processing, batch file, document workflow, file automation, CSV processing, PDF extraction -->
