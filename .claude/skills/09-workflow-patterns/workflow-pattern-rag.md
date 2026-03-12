---
name: workflow-pattern-rag
description: "RAG (Retrieval Augmented Generation) workflow patterns. Use when asking 'RAG', 'retrieval augmented', 'vector search', 'semantic search', or 'document Q&A'."
---

# RAG Workflow Patterns

Retrieval Augmented Generation patterns for AI-powered document search and Q&A.

> **Skill Metadata**
> Category: `workflow-patterns`
> Priority: `HIGH`
> SDK Version: `0.9.25+`
> Related Skills: [`nodes-ai-reference`](../nodes/nodes-ai-reference.md), [`workflow-pattern-ai-document`](workflow-pattern-ai-document.md)
> Related Subagents: `pattern-expert` (RAG workflows), `ai_agent-specialist` (AI agents)

## Quick Reference

RAG workflow components:
- **Document ingestion** - Load and chunk documents
- **Embedding generation** - Convert text to vectors
- **Vector storage** - Store in vector database
- **Similarity search** - Find relevant chunks
- **LLM generation** - Generate answers with context

## Pattern 1: Document Ingestion Pipeline

```python
import pandas as pd
# runtime setup

workflow = Pipeline()

# 1. Load document
pipeline.add_step("DocumentProcessorNode", "load_doc", {
    "file_path": "{{input.document_path}}",
    "extract_metadata": True
})

# 2. Split into chunks
pipeline.add_step("TextChunkerNode", "chunk_text", {
    "input": "{{load_doc.content}}",
    "chunk_size": 512,
    "chunk_overlap": 50,
    "strategy": "semantic"  # Preserve sentence boundaries
})

# 3. Generate embeddings
pipeline.add_step("EmbeddingNode", "generate_embeddings", {
    "provider": "openai",
    "model": "text-embedding-3-small",
    "text": "{{chunk_text.chunks}}"
})

# 4. Store in vector database
pipeline.add_step("VectorStoreNode", "store_vectors", {
    "collection": "documents",
    "vectors": "{{generate_embeddings.embeddings}}",
    "metadata": {
        "doc_id": "{{input.document_id}}",
        "chunk_index": "{{chunk_text.indices}}",
        "text": "{{chunk_text.chunks}}"
    }
})

pipeline.connect("load_doc", "content", "chunk_text", "input")
pipeline.connect("chunk_text", "chunks", "generate_embeddings", "text")
pipeline.connect("generate_embeddings", "embeddings", "store_vectors", "vectors")

with LocalRuntime() as runtime:
    results, run_id = runtime.execute(workflow.build(), inputs={
        "document_path": "docs/manual.pdf",
        "document_id": "doc_001"
    })
```

## Pattern 2: RAG Query Pipeline

```python
workflow = Pipeline()

# 1. Generate query embedding
pipeline.add_step("EmbeddingNode", "query_embedding", {
    "provider": "openai",
    "model": "text-embedding-3-small",
    "text": "{{input.query}}"
})

# 2. Vector similarity search
pipeline.add_step("VectorSearchNode", "search_similar", {
    "collection": "documents",
    "query_vector": "{{query_embedding.embedding}}",
    "top_k": 5,
    "min_score": 0.7
})

# 3. Rerank results (optional)
pipeline.add_step("RerankNode", "rerank", {
    "query": "{{input.query}}",
    "documents": "{{search_similar.results}}",
    "model": "rerank-english-v2.0"
})

# 4. Build context prompt
pipeline.add_step("TransformNode", "build_prompt", {
    "input": "{{rerank.documents}}",
    "transformation": """
        context = '\n\n'.join([doc['text'] for doc in input])
        return f'''Answer the question based on this context:

Context:
{context}

Question: {{input.query}}

Answer:'''
    """
})

# 5. Generate answer with LLM
pipeline.add_step("LLMNode", "generate_answer", {
    "provider": "openai",
    "model": "gpt-4",
    "prompt": "{{build_prompt.result}}",
    "temperature": 0.3
})

pipeline.connect("query_embedding", "embedding", "search_similar", "query_vector")
pipeline.connect("search_similar", "results", "rerank", "documents")
pipeline.connect("rerank", "documents", "build_prompt", "input")
pipeline.connect("build_prompt", "result", "generate_answer", "prompt")
```

## Pattern 3: Multi-Document RAG

```python
workflow = Pipeline()

# 1. Query embedding
pipeline.add_step("EmbeddingNode", "query_embed", {
    "provider": "openai",
    "model": "text-embedding-3-small",
    "text": "{{input.query}}"
})

# 2. Search multiple collections in parallel
pipeline.add_step("VectorSearchNode", "search_docs", {
    "collection": "documents",
    "query_vector": "{{query_embed.embedding}}",
    "top_k": 3
})

pipeline.add_step("VectorSearchNode", "search_code", {
    "collection": "codebase",
    "query_vector": "{{query_embed.embedding}}",
    "top_k": 3
})

pipeline.add_step("VectorSearchNode", "search_api", {
    "collection": "api_docs",
    "query_vector": "{{query_embed.embedding}}",
    "top_k": 3
})

# 3. Merge and rerank all results
pipeline.add_step("MergeNode", "merge_results", {
    "inputs": [
        "{{search_docs.results}}",
        "{{search_code.results}}",
        "{{search_api.results}}"
    ],
    "strategy": "combine"
})

pipeline.add_step("RerankNode", "rerank_all", {
    "query": "{{input.query}}",
    "documents": "{{merge_results.combined}}",
    "top_k": 5
})

# 4. Generate comprehensive answer
pipeline.add_step("LLMNode", "generate", {
    "provider": "openai",
    "model": "gpt-4",
    "prompt": """Answer using context from docs, code, and API:

Context: {{rerank_all.documents}}

Question: {{input.query}}

Provide a comprehensive answer with examples."""
})

# Parallel searches
pipeline.connect("query_embed", "embedding", "search_docs", "query_vector")
pipeline.connect("query_embed", "embedding", "search_code", "query_vector")
pipeline.connect("query_embed", "embedding", "search_api", "query_vector")

pipeline.connect("search_docs", "results", "merge_results", "input_docs")
pipeline.connect("search_code", "results", "merge_results", "input_code")
pipeline.connect("search_api", "results", "merge_results", "input_api")

pipeline.connect("merge_results", "combined", "rerank_all", "documents")
pipeline.connect("rerank_all", "documents", "generate", "context")
```

## Pattern 4: Conversational RAG with Memory

```python
workflow = Pipeline()

# 1. Load conversation history
pipeline.add_step("DatabaseQueryNode", "load_history", {
    "query": """
        SELECT role, content FROM messages
        WHERE conversation_id = ?
        ORDER BY created_at DESC LIMIT 5
    """,
    "parameters": ["{{input.conversation_id}}"]
})

# 2. Build conversation context
pipeline.add_step("TransformNode", "build_context", {
    "input": "{{load_history.results}}",
    "transformation": "'\n'.join([f'{m.role}: {m.content}' for m in input])"
})

# 3. Embed query with context
pipeline.add_step("EmbeddingNode", "embed_query", {
    "provider": "openai",
    "model": "text-embedding-3-small",
    "text": "{{input.query}} Context: {{build_context.context}}"
})

# 4. Vector search
pipeline.add_step("VectorSearchNode", "search", {
    "collection": "documents",
    "query_vector": "{{embed_query.embedding}}",
    "top_k": 5
})

# 5. Generate answer with history
pipeline.add_step("LLMNode", "generate", {
    "provider": "openai",
    "model": "gpt-4",
    "prompt": """Conversation History:
{{build_context.context}}

Relevant Documents:
{{search.results}}

User: {{input.query}}
