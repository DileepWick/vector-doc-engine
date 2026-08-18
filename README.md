# Vector Doc Engine (`@dileepwick/vector-doc-engine`)

Production-resilient TypeScript engine for PDF document text chunking, Google Gemini vector embeddings, and local ChromaDB HNSW semantic vector search.

---

## Programmatic API Usage

Install as a dependency in any Node.js / TypeScript project:

```bash
npm install git+https://github.com/DileepWick/vector-doc-engine.git
```

### 1. Ingest PDF Document (`ingestPdfDocument`)

```typescript
import { ingestPdfDocument } from "@dileepwick/vector-doc-engine";

const result = await ingestPdfDocument({
  filePath: "./data/documents/sem-reg.pdf",
  geminiApiKey: process.env.GEMINI_API_KEY,
  chromaUrl: "http://localhost:8000",
  embeddingModel: "gemini-embedding-2-preview",
});

console.log(`Ingested ${result.totalChunks} chunks to ChromaDB.`);
```

### 2. Semantic Vector Search (`queryVectorSearch`)

```typescript
import { queryVectorSearch } from "@dileepwick/vector-doc-engine";

const matches = await queryVectorSearch({
  query: "What are the key takeaways?",
  geminiApiKey: process.env.GEMINI_API_KEY,
  chromaUrl: "http://localhost:8000",
  topK: 3,
  minSimilarity: 0.35,
});

matches.forEach((match, idx) => {
  console.log(`[Match ${idx + 1}] Score: ${match.score.toFixed(4)}`);
  console.log(`Excerpt: "${match.doc}"`);
});
```

---

## Repository Structure

```text
vector-doc-engine/
├── src/
│   ├── index.ts               <-- Package Entry Point & Exports
│   ├── ingest.ts              <-- Programmatic Ingestion API & CLI
│   ├── ask.ts                 <-- Programmatic Query API & CLI
│   ├── chunker.ts             <-- Recursive Text Chunker Utility
│   └── embedder.ts            <-- Resilient Gemini API Embedder
├── data/
│   └── documents/             <-- Sample Document Store
├── dist/                      <-- Built JavaScript & Type Declarations
├── docs/                      <-- System Documentation
│   ├── architecture-and-learnings.md
│   ├── failure-modes-and-audit.md
│   └── publishing-github-package.md
├── package.json
└── README.md
```

- [Architecture & Technical Foundation](file:///e:/ai-eng-projects/sec-adr-vector-search/docs/architecture-and-learnings.md)
- [Failure Mode Audit & System Hardening](file:///e:/ai-eng-projects/sec-adr-vector-search/docs/failure-modes-and-audit.md)
- [Publishing to GitHub Packages](file:///e:/ai-eng-projects/sec-adr-vector-search/docs/publishing-github-package.md)

---

## Infrastructure Setup

Start a local ChromaDB instance via Docker:

```bash
docker run -p 8000:8000 chromadb/chroma
```

---

## Build & CLI Usage

### Build Package (`dist/`)
```bash
npm run build
```

### CLI Ingestion
```bash
npx ts-node src/ingest.ts sem-reg.pdf
```

### CLI Vector Search Query
```bash
npx ts-node src/ask.ts "What are the main key takeaways discussed in this file?"
```
