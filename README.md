<p align="center">
  <img src="docs/images/logo.png" width="96" alt="vector-doc-engine logo" />
</p>

<h2 align="center">vector-doc-engine</h2>

<p align="center">
  <a href="https://github.com/DileepWick/vector-doc-engine"><img src="https://img.shields.io/npm/v/@dileepwick/vector-doc-engine.svg?style=flat-square&color=black" alt="npm version" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.7-black.svg?style=flat-square&logo=typescript" alt="TypeScript" /></a>
  <a href="https://www.trychroma.com/"><img src="https://img.shields.io/badge/ChromaDB-1.10-black.svg?style=flat-square" alt="ChromaDB" /></a>
  <a href="https://ai.google.dev/"><img src="https://img.shields.io/badge/Google_Gemini-API-black.svg?style=flat-square&logo=google" alt="Google Gemini" /></a>
  <a href="https://github.com/DileepWick/vector-doc-engine/actions"><img src="https://img.shields.io/github/actions/workflow/status/DileepWick/vector-doc-engine/ci.yml?branch=main&style=flat-square&label=CI&color=black" alt="CI Pipeline" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-ISC-black.svg?style=flat-square" alt="License" /></a>
</p>

> Production-resilient TypeScript engine for PDF text chunking, Google Gemini vector embeddings, and local ChromaDB semantic vector search.

<p align="center">
  <img src="docs/images/vector-engine-diagram.png" alt="Vector Engine Architecture Diagram" width="100%" />
</p>

## Overview

`vector-doc-engine` is a lightweight library and CLI tool designed for document processing pipelines. It splits documents cleanly at natural text boundaries, generates embeddings with Google Gemini, and indexes them into ChromaDB for fast similarity retrieval.

## Features

- **Recursive Text Chunking**: Splits paragraphs, lines, and sentences cleanly before applying character limits.
- **Resilient API Layer**: Uses exponential backoff with delay retries to handle rate limits and temporary network drops.
- **Streaming Batch Processing**: Processes chunks in steady batches to keep memory usage minimal on large documents.
- **Similarity Threshold Filtering**: Filters search results against a similarity floor to exclude off-topic matches.

## Installation

Install as a project dependency:

```bash
npm install git+https://github.com/DileepWick/vector-doc-engine.git
```

Or via GitHub Packages registry:

```bash
npm install @dileepwick/vector-doc-engine
```

## Quick Start

### 1. Environment Configuration

Create a `.env` file in your root directory:

```env
CHROMA_URL=http://localhost:8000
GEMINI_API_KEY=your_gemini_api_key
GEMINI_EMBED_MODEL=gemini-embedding-2-preview
```

### 2. Infrastructure Setup

Start a local ChromaDB instance:

```bash
docker run -p 8000:8000 chromadb/chroma
```

### 3. Programmatic Usage

<details>
<summary><b>View Code Examples</b></summary>

<br />

**Ingest PDF Document**

```typescript
import { ingestPdfDocument } from "@dileepwick/vector-doc-engine";

const result = await ingestPdfDocument({
  filePath: "./data/documents/sem-reg.pdf",
});

console.log(`Ingested ${result.totalChunks} chunks.`);
```

**Perform Vector Search Query**

```typescript
import { queryVectorSearch } from "@dileepwick/vector-doc-engine";

const matches = await queryVectorSearch({
  query: "What are the main key takeaways?",
  topK: 3,
  minSimilarity: 0.35,
});

matches.forEach((match, idx) => {
  console.log(`[${idx + 1}] Score: ${match.score.toFixed(4)} | Excerpt: "${match.doc}"`);
});
```

</details>

## CLI Execution

<details>
<summary><b>View CLI Commands</b></summary>

<br />

**Build Package**

```bash
npm run build
```

**Ingest Document via CLI**

```bash
npx ts-node src/ingest.ts sem-reg.pdf
```

**Query Vector Search via CLI**

```bash
npx ts-node src/ask.ts "What are the key takeaways?"
```

</details>

## Project Structure

```text
vector-doc-engine/
├── src/
│   ├── index.ts               # Public API exports
│   ├── ingest.ts              # Document ingestion API
│   ├── ask.ts                 # Vector search query API
│   ├── chunker.ts             # Text chunking utility
│   └── embedder.ts            # Gemini API embedder with retries
├── data/documents/            # Default document storage
├── dist/                      # Built JavaScript binaries & declarations
├── docs/                      # Technical documentation & guides
└── tests/                     # Unit test suites
```

## Documentation

- [Architecture & Foundations](docs/architecture-and-learnings.md)
- [System Hardening & Audit](docs/failure-modes-and-audit.md)
- [GitHub Packages Publishing](docs/publishing-github-package.md)
