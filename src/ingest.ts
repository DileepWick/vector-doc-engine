import fs from "fs";
import path from "path";
import pdf from "pdf-parse";
import { ChromaClient } from "chromadb";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { recursiveChunkText } from "./chunker";
import { embedWithRetry } from "./embedder";

dotenv.config();

export interface IngestOptions {
  filePath: string;
  geminiApiKey?: string;
  chromaUrl?: string;
  embeddingModel?: string;
  collectionName?: string;
  batchSize?: number;
}

export interface IngestResult {
  filePath: string;
  totalChunks: number;
  collectionName: string;
}

/**
 * Resolves PDF file path from explicit path or default ./data/documents/ directory.
 */
export function resolveDocumentPath(inputPath: string): string {
  if (fs.existsSync(inputPath)) {
    return inputPath;
  }

  const defaultDir = path.join(process.cwd(), "data", "documents");
  const directDataPath = path.join(defaultDir, inputPath);
  if (fs.existsSync(directDataPath)) {
    return directDataPath;
  }

  const baseNamePath = path.join(defaultDir, path.basename(inputPath));
  if (fs.existsSync(baseNamePath)) {
    return baseNamePath;
  }

  return inputPath;
}

/**
 * Programmatic PDF document ingestion function.
 */
export async function ingestPdfDocument(options: IngestOptions): Promise<IngestResult> {
  const geminiApiKey = options.geminiApiKey || process.env.GEMINI_API_KEY;
  const chromaUrl = options.chromaUrl || process.env.CHROMA_URL || "http://localhost:8000";
  const embeddingModel = options.embeddingModel || process.env.GEMINI_EMBED_MODEL || "gemini-embedding-2-preview";
  const collectionName = options.collectionName || "pdf_chunks";
  const batchSize = options.batchSize || 10;

  if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY is not defined in options or environment variables.");
  }

  const resolvedPath = resolveDocumentPath(options.filePath);
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`File not found at path: "${options.filePath}" (Checked: "${resolvedPath}")`);
  }

  const ai = new GoogleGenAI({ apiKey: geminiApiKey });
  const chroma = new ChromaClient({ path: chromaUrl });

  console.log(`Reading PDF file "${resolvedPath}"...`);
  const dataBuffer = fs.readFileSync(resolvedPath);
  const pdfData = await pdf(dataBuffer);

  if (!pdfData.text || pdfData.text.trim().length < 50) {
    throw new Error(
      `Insufficient text extracted (${pdfData.text?.trim().length || 0} chars). "${resolvedPath}" may be a scanned or image-only PDF requiring an OCR pipeline.`
    );
  }

  const textChunks = recursiveChunkText(pdfData.text, 800, 100);
  console.log(
    `Extracted ${textChunks.length} sentence-aware chunks from "${resolvedPath}". Processing using ${embeddingModel}...`
  );

  const collection = await chroma.getOrCreateCollection({
    name: collectionName,
    metadata: { "hnsw:space": "cosine" },
  });

  const sanitizeId = path.basename(resolvedPath).replace(/[^a-zA-Z0-9]/g, "_");

  for (let i = 0; i < textChunks.length; i += batchSize) {
    const currentBatchIndices: number[] = [];
    const currentBatchChunks: string[] = [];

    for (let j = i; j < Math.min(i + batchSize, textChunks.length); j++) {
      currentBatchIndices.push(j);
      currentBatchChunks.push(textChunks[j]);
    }

    const batchEmbeddings = await Promise.all(
      currentBatchChunks.map((chunk) => embedWithRetry(ai, embeddingModel, chunk))
    );

    const ids = currentBatchIndices.map((idx) => `${sanitizeId}_chunk_${idx}`);
    const metadatas = currentBatchIndices.map((idx) => ({
      sourceFile: resolvedPath,
      fileName: path.basename(resolvedPath),
      chunkIndex: idx,
      totalChunks: textChunks.length,
    }));

    await collection.upsert({
      ids,
      embeddings: batchEmbeddings,
      metadatas,
      documents: currentBatchChunks,
    });

    console.log(
      `Ingested & upserted chunks ${i + 1}-${Math.min(i + batchSize, textChunks.length)} of ${textChunks.length}`
    );
  }

  console.log(`Successfully ingested and vectorized "${resolvedPath}" in ChromaDB!`);
  return {
    filePath: resolvedPath,
    totalChunks: textChunks.length,
    collectionName,
  };
}

// CLI Execution Entry Point
if (require.main === module) {
  const filePath = process.argv[2];
  if (!filePath) {
    console.log("Usage: npx ts-node src/ingest.ts <path-to-pdf> (e.g. npx ts-node src/ingest.ts sem-reg.pdf)");
  } else {
    ingestPdfDocument({ filePath }).catch((err) => {
      console.error("Ingestion failed:", err.message || err);
      process.exit(1);
    });
  }
}
